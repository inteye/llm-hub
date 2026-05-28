import { ProviderAdapter } from '../types'

export class ProviderRegistry {
  private providers = new Map<string, ProviderAdapter>()

  register(adapter: ProviderAdapter): void {
    this.providers.set(adapter.name, adapter)
  }

  registerMany(adapters: ProviderAdapter[]): void {
    for (const adapter of adapters) {
      this.register(adapter)
    }
  }

  get(name: string): ProviderAdapter | undefined {
    return this.providers.get(name)
  }

  has(name: string): boolean {
    return this.providers.has(name)
  }

  list(): ProviderAdapter[] {
    return Array.from(this.providers.values())
  }

  names(): string[] {
    return Array.from(this.providers.keys())
  }

  remove(name: string): boolean {
    return this.providers.delete(name)
  }

  clear(): void {
    this.providers.clear()
  }
}
