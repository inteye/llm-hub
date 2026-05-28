import {
  ProviderAdapter,
  ProviderConfig,
  ChatOptions,
  ChatResponse,
  StreamChunk,
  ModelInfo,
  StorageAdapter,
  StorageType
} from '../types'
import { ProviderRegistry } from './registry'
import { createStorage } from '../storage'

export type LLMHubEvent = 'configChange'

export interface CreateClientOptions {
  storage?: StorageType | StorageAdapter
  prefix?: string
  providers?: ProviderAdapter[]
}

export class LLMHubClient {
  private registry: ProviderRegistry
  private storage: StorageAdapter
  private prefix: string
  private listeners = new Map<string, Set<Function>>()

  constructor(options: CreateClientOptions = {}) {
    this.prefix = options.prefix || 'llm-hub'
    this.storage = createStorage(options.storage || 'memory', this.prefix)
    this.registry = new ProviderRegistry()

    if (options.providers) {
      this.registry.registerMany(options.providers)
    }
  }

  // Provider management
  registerProvider(adapter: ProviderAdapter): void {
    this.registry.register(adapter)
  }

  getProvider(name: string): ProviderAdapter | undefined {
    return this.registry.get(name)
  }

  listProviders(): ProviderAdapter[] {
    return this.registry.list()
  }

  // Config management
  async configure(provider: string, config: ProviderConfig): Promise<void> {
    const adapter = this.registry.get(provider)
    if (!adapter) {
      throw new Error(`Provider "${provider}" not found. Did you forget to register it?`)
    }

    const key = `config:${provider}`
    await this.storage.set(key, {
      ...config,
      updatedAt: Date.now()
    })

    this.emit('configChange', provider)
  }

  getConfig(provider: string): ProviderConfig | undefined {
    const key = `config:${provider}`
    const config = this.storage.get<ProviderConfig & { updatedAt: number }>(key)
    // Note: This is sync for memory storage, returns undefined for async storage
    // For async access, use getConfigAsync
    return config as unknown as ProviderConfig | undefined
  }

  async getConfigAsync(provider: string): Promise<ProviderConfig | undefined> {
    const key = `config:${provider}`
    return await this.storage.get<ProviderConfig>(key) || undefined
  }

  async removeConfig(provider: string): Promise<void> {
    const key = `config:${provider}`
    await this.storage.remove(key)
    this.emit('configChange', provider)
  }

  async clearConfigs(): Promise<void> {
    await this.storage.clear()
    this.emit('configChange', '*')
  }

  async getAvailableProviders(): Promise<string[]> {
    const providers = this.registry.list()
    const available: string[] = []

    for (const provider of providers) {
      const config = await this.getConfigAsync(provider.name)
      if (config?.apiKey) {
        available.push(provider.name)
      }
    }

    return available
  }

  // Model calling
  async chat(options: ChatOptions): Promise<ChatResponse> {
    const adapter = this.getRequiredProvider(options.provider)
    const config = await this.getRequiredConfig(options.provider)

    return adapter.chat(config, options)
  }

  async *chatStream(options: ChatOptions): AsyncGenerator<StreamChunk> {
    const adapter = this.getRequiredProvider(options.provider)
    const config = await this.getRequiredConfig(options.provider)

    yield* adapter.chatStream(config, options)
  }

  // Utility methods
  async validateProvider(provider: string): Promise<boolean> {
    const adapter = this.registry.get(provider)
    if (!adapter) return false

    const config = await this.getConfigAsync(provider)
    if (!config) return false

    return adapter.validateConfig(config)
  }

  listModels(provider: string): ModelInfo[] {
    const adapter = this.registry.get(provider)
    if (!adapter) return []
    return adapter.models
  }

  async fetchModels(provider: string): Promise<ModelInfo[]> {
    const adapter = this.getRequiredProvider(provider)
    const config = await this.getRequiredConfig(provider)

    if (!adapter.supportsListModels || !adapter.listModels) {
      return adapter.models
    }

    try {
      return await adapter.listModels(config)
    } catch {
      return adapter.models
    }
  }

  canFetchModels(provider: string): boolean {
    const adapter = this.registry.get(provider)
    return adapter?.supportsListModels ?? false
  }

  // Event system
  on(event: LLMHubEvent, listener: (...args: any[]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener)
  }

  off(event: LLMHubEvent, listener: Function): void {
    this.listeners.get(event)?.delete(listener)
  }

  private emit(event: LLMHubEvent, ...args: any[]): void {
    this.listeners.get(event)?.forEach(listener => {
      try {
        listener(...args)
      } catch (e) {
        console.error(`Error in event listener for "${event}":`, e)
      }
    })
  }

  // Private helpers
  private getRequiredProvider(name: string): ProviderAdapter {
    const adapter = this.registry.get(name)
    if (!adapter) {
      throw new Error(`Provider "${name}" not found. Available providers: ${this.registry.names().join(', ')}`)
    }
    return adapter
  }

  private async getRequiredConfig(provider: string): Promise<ProviderConfig> {
    const config = await this.getConfigAsync(provider)
    if (!config) {
      throw new Error(`No configuration found for provider "${provider}". Call client.configure("${provider}", { apiKey: "..." }) first.`)
    }
    return config
  }
}

export function createClient(options?: CreateClientOptions): LLMHubClient {
  return new LLMHubClient(options)
}
