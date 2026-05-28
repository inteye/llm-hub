import { Message } from './message'

export interface ProviderConfig {
  apiKey: string
  baseUrl?: string
  defaultModel?: string
  headers?: Record<string, string>
}

export interface ModelInfo {
  id: string
  name: string
  contextWindow: number
  maxOutput?: number
  supportsVision?: boolean
  supportsStreaming?: boolean
  supportsFunctionCalling?: boolean
  price?: {
    input: number
    output: number
  }
}

export interface ChatOptions {
  provider: string
  model: string
  messages: Message[]
  temperature?: number
  maxTokens?: number
  topP?: number
  signal?: AbortSignal
}

export interface ChatResponse {
  id: string
  content: string
  model: string
  provider: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  finishReason: 'stop' | 'length' | 'tool_calls' | 'content_filter'
}

export interface StreamChunk {
  id: string
  delta: string
  done: boolean
}

export interface ProviderAdapter {
  name: string
  displayName: string
  icon?: string
  defaultBaseUrl: string
  models: ModelInfo[]
  supportsListModels?: boolean

  chat(config: ProviderConfig, options: ChatOptions): Promise<ChatResponse>
  chatStream(config: ProviderConfig, options: ChatOptions): AsyncGenerator<StreamChunk>
  validateConfig(config: ProviderConfig): Promise<boolean>
  listModels?(config: ProviderConfig): Promise<ModelInfo[]>
}
