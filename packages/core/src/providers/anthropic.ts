import {
  ProviderAdapter,
  ProviderConfig,
  ChatOptions,
  ChatResponse,
  StreamChunk,
  ModelInfo,
  Message
} from '../types'

export const anthropicModels: ModelInfo[] = [
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    contextWindow: 200000,
    maxOutput: 8192,
    supportsVision: true,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    contextWindow: 200000,
    maxOutput: 8192,
    supportsVision: true,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    contextWindow: 200000,
    maxOutput: 4096,
    supportsVision: true,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    contextWindow: 200000,
    maxOutput: 4096,
    supportsVision: true,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    contextWindow: 200000,
    maxOutput: 4096,
    supportsVision: true,
    supportsStreaming: true,
    supportsFunctionCalling: true
  }
]

export class AnthropicProvider implements ProviderAdapter {
  name = 'anthropic'
  displayName = 'Anthropic'
  icon = '🧠'
  defaultBaseUrl = 'https://api.anthropic.com'
  models = anthropicModels
  supportsListModels = false

  private getBaseUrl(config: ProviderConfig): string {
    return config.baseUrl || this.defaultBaseUrl
  }

  private getHeaders(config: ProviderConfig): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
      ...config.headers
    }
  }

  private transformMessages(messages: Message[]): {
    system?: string
    messages: any[]
  } {
    let system: string | undefined
    const transformedMessages: any[] = []

    for (const msg of messages) {
      if (msg.role === 'system') {
        system = typeof msg.content === 'string' ? msg.content : msg.content.map(c => c.type === 'text' ? c.text : '').join('')
      } else {
        transformedMessages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        })
      }
    }

    return { system, messages: transformedMessages }
  }

  async chat(config: ProviderConfig, options: ChatOptions): Promise<ChatResponse> {
    const url = `${this.getBaseUrl(config)}/v1/messages`
    const headers = this.getHeaders(config)
    const { system, messages } = this.transformMessages(options.messages)

    const body: any = {
      model: options.model,
      messages,
      max_tokens: options.maxTokens || 4096
    }

    if (system) {
      body.system = system
    }

    if (options.temperature !== undefined) {
      body.temperature = options.temperature
    }

    if (options.topP !== undefined) {
      body.top_p = options.topP
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: options.signal
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`[anthropic] API error (${response.status}): ${error}`)
    }

    const data = await response.json()

    return {
      id: data.id,
      content: data.content[0]?.text || '',
      model: data.model,
      provider: 'anthropic',
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
      },
      finishReason: data.stop_reason === 'end_turn' ? 'stop' : data.stop_reason || 'stop'
    }
  }

  async *chatStream(config: ProviderConfig, options: ChatOptions): AsyncGenerator<StreamChunk> {
    const url = `${this.getBaseUrl(config)}/v1/messages`
    const headers = this.getHeaders(config)
    const { system, messages } = this.transformMessages(options.messages)

    const body: any = {
      model: options.model,
      messages,
      max_tokens: options.maxTokens || 4096,
      stream: true
    }

    if (system) {
      body.system = system
    }

    if (options.temperature !== undefined) {
      body.temperature = options.temperature
    }

    if (options.topP !== undefined) {
      body.top_p = options.topP
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: options.signal
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`[anthropic] API error (${response.status}): ${error}`)
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

            if (parsed.type === 'content_block_delta') {
              yield {
                id: '',
                delta: parsed.delta?.text || '',
                done: false
              }
            } else if (parsed.type === 'message_stop') {
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
      const url = `${this.getBaseUrl(config)}/v1/messages`
      const headers = this.getHeaders(config)

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: this.models[0].id,
          messages: [{ role: 'user', content: 'Hi' }],
          max_tokens: 1
        })
      })

      return response.ok
    } catch {
      return false
    }
  }
}

export const anthropic = new AnthropicProvider()
