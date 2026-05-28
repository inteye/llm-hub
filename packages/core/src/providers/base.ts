import {
  ProviderAdapter,
  ProviderConfig,
  ChatOptions,
  ChatResponse,
  StreamChunk,
  ModelInfo
} from '../types'

export interface OpenAICompatibleOptions {
  name: string
  displayName: string
  icon?: string
  defaultBaseUrl: string
  models: ModelInfo[]
  defaultHeaders?: Record<string, string>
  supportsListModels?: boolean
}

export class OpenAICompatibleProvider implements ProviderAdapter {
  name: string
  displayName: string
  icon?: string
  defaultBaseUrl: string
  models: ModelInfo[]
  supportsListModels: boolean
  private defaultHeaders: Record<string, string>

  constructor(options: OpenAICompatibleOptions) {
    this.name = options.name
    this.displayName = options.displayName
    this.icon = options.icon
    this.defaultBaseUrl = options.defaultBaseUrl
    this.models = options.models
    this.defaultHeaders = options.defaultHeaders || {}
    this.supportsListModels = options.supportsListModels ?? true
  }

  protected getHeaders(config: ProviderConfig): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
      ...this.defaultHeaders,
      ...config.headers
    }
  }

  protected getBaseUrl(config: ProviderConfig): string {
    return config.baseUrl || this.defaultBaseUrl
  }

  protected transformMessages(messages: ChatOptions['messages']): any[] {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  }

  async chat(config: ProviderConfig, options: ChatOptions): Promise<ChatResponse> {
    const url = `${this.getBaseUrl(config)}/chat/completions`
    const headers = this.getHeaders(config)

    const body = {
      model: options.model,
      messages: this.transformMessages(options.messages),
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      top_p: options.topP
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: options.signal
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`[${this.name}] API error (${response.status}): ${error}`)
    }

    const data = await response.json()

    return {
      id: data.id,
      content: data.choices[0].message.content || '',
      model: data.model,
      provider: this.name,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      },
      finishReason: data.choices[0].finish_reason || 'stop'
    }
  }

  async *chatStream(config: ProviderConfig, options: ChatOptions): AsyncGenerator<StreamChunk> {
    const url = `${this.getBaseUrl(config)}/chat/completions`
    const headers = this.getHeaders(config)

    const body = {
      model: options.model,
      messages: this.transformMessages(options.messages),
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      top_p: options.topP,
      stream: true
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: options.signal
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`[${this.name}] API error (${response.status}): ${error}`)
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
          if (data === '[DONE]') {
            yield { id: '', delta: '', done: true }
            return
          }

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices[0]?.delta?.content || ''
            yield {
              id: parsed.id,
              delta,
              done: false
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
      const url = `${this.getBaseUrl(config)}/models`
      const headers = {
        'Authorization': `Bearer ${config.apiKey}`
      }

      const response = await fetch(url, { headers })
      return response.ok
    } catch {
      return false
    }
  }

  async listModels(config: ProviderConfig): Promise<ModelInfo[]> {
    const url = `${this.getBaseUrl(config)}/models`
    const headers = this.getHeaders(config)

    const response = await fetch(url, { headers })

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`)
    }

    const data = await response.json()
    const models = data.data || data.models || []

    return models.map((m: any) => ({
      id: m.id,
      name: m.id,
      contextWindow: m.context_window || 4096,
      supportsStreaming: true
    }))
  }
}
