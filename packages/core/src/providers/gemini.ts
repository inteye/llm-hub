import {
  ProviderAdapter,
  ProviderConfig,
  ChatOptions,
  ChatResponse,
  StreamChunk,
  ModelInfo,
  Message
} from '../types'

export const geminiModels: ModelInfo[] = [
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    contextWindow: 1048576,
    maxOutput: 8192,
    supportsVision: true,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    contextWindow: 1048576,
    maxOutput: 8192,
    supportsVision: true,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'gemini-1.5-pro-exp-0801',
    name: 'Gemini 1.5 Pro (Exp)',
    contextWindow: 1048576,
    maxOutput: 8192,
    supportsVision: true,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'gemini-1.0-pro',
    name: 'Gemini 1.0 Pro',
    contextWindow: 32768,
    maxOutput: 8192,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'gemini-1.0-pro-vision',
    name: 'Gemini 1.0 Pro Vision',
    contextWindow: 16384,
    maxOutput: 4096,
    supportsVision: true,
    supportsStreaming: true
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    contextWindow: 32768,
    maxOutput: 8192,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'gemini-pro-vision',
    name: 'Gemini Pro Vision',
    contextWindow: 16384,
    maxOutput: 4096,
    supportsVision: true,
    supportsStreaming: true
  }
]

export class GeminiProvider implements ProviderAdapter {
  name = 'gemini'
  displayName = 'Google Gemini'
  icon = '✨'
  defaultBaseUrl = 'https://generativelanguage.googleapis.com/v1beta'
  models = geminiModels
  supportsListModels = true

  private getBaseUrl(config: ProviderConfig): string {
    return config.baseUrl || this.defaultBaseUrl
  }

  private transformMessages(messages: Message[]): any {
    const contents: any[] = []
    let systemInstruction: any = undefined

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemInstruction = {
          parts: [{ text: typeof msg.content === 'string' ? msg.content : '' }]
        }
        continue
      }

      const parts: any[] = []
      if (typeof msg.content === 'string') {
        parts.push({ text: msg.content })
      } else {
        for (const part of msg.content) {
          if (part.type === 'text') {
            parts.push({ text: part.text })
          } else if (part.type === 'image_url') {
            const url = part.image_url.url
            if (url.startsWith('data:')) {
              const [header, data] = url.split(',')
              const mimeType = header.match(/data:(.*?);/)?.[1] || 'image/jpeg'
              parts.push({
                inlineData: {
                  mimeType,
                  data
                }
              })
            } else {
              parts.push({
                fileData: {
                  mimeType: 'image/jpeg',
                  fileUri: url
                }
              })
            }
          }
        }
      }

      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts
      })
    }

    return { contents, systemInstruction }
  }

  async chat(config: ProviderConfig, options: ChatOptions): Promise<ChatResponse> {
    const model = options.model || 'gemini-pro'
    const url = `${this.getBaseUrl(config)}/models/${model}:generateText?key=${config.apiKey}`
    
    const { contents, systemInstruction } = this.transformMessages(options.messages)
    
    const body: any = {
      contents,
      generationConfig: {
        temperature: options.temperature,
        maxOutputTokens: options.maxTokens,
        topP: options.topP
      }
    }

    if (systemInstruction) {
      body.systemInstruction = systemInstruction
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      signal: options.signal
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`[gemini] API error (${response.status}): ${error}`)
    }

    const data = await response.json()

    return {
      id: `gemini-${Date.now()}`,
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
      model,
      provider: 'gemini',
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0
      },
      finishReason: data.candidates?.[0]?.finishReason === 'STOP' ? 'stop' : 'length'
    }
  }

  async *chatStream(config: ProviderConfig, options: ChatOptions): AsyncGenerator<StreamChunk> {
    const model = options.model || 'gemini-pro'
    const url = `${this.getBaseUrl(config)}/models/${model}:streamGenerateContent?key=${config.apiKey}&alt=sse`
    
    const { contents, systemInstruction } = this.transformMessages(options.messages)
    
    const body: any = {
      contents,
      generationConfig: {
        temperature: options.temperature,
        maxOutputTokens: options.maxTokens,
        topP: options.topP
      }
    }

    if (systemInstruction) {
      body.systemInstruction = systemInstruction
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      signal: options.signal
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`[gemini] API error (${response.status}): ${error}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Response body is not readable')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue

          const data = trimmed.slice(6)

          try {
            const parsed = JSON.parse(data)
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || ''
            
            yield {
              id: `gemini-${Date.now()}`,
              delta: text,
              done: false
            }

            if (parsed.candidates?.[0]?.finishReason === 'STOP') {
              yield { id: '', delta: '', done: true }
              return
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  async validateConfig(config: ProviderConfig): Promise<boolean> {
    try {
      const url = `${this.getBaseUrl(config)}/models?key=${config.apiKey}`
      const response = await fetch(url)
      return response.ok
    } catch {
      return false
    }
  }

  async listModels(config: ProviderConfig): Promise<ModelInfo[]> {
    const url = `${this.getBaseUrl(config)}/models?key=${config.apiKey}`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`)
    }

    const data = await response.json()
    const models = data.models || []

    return models.map((m: any) => ({
      id: m.name?.replace('models/', '') || '',
      name: m.displayName || m.name,
      contextWindow: m.inputTokenLimit || 32768,
      maxOutput: m.outputTokenLimit || 8192,
      supportsVision: m.supportedGenerationMethods?.includes('generateContent'),
      supportsStreaming: true
    }))
  }
}

export const gemini = new GeminiProvider()
