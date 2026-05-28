import { StorageAdapter } from '../types'

export class MemoryStorage implements StorageAdapter {
  private store = new Map<string, string>()

  async get<T>(key: string): Promise<T | null> {
    const value = this.store.get(key)
    if (value === undefined) return null
    try {
      return JSON.parse(value) as T
    } catch {
      return value as unknown as T
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.store.set(key, JSON.stringify(value))
  }

  async remove(key: string): Promise<void> {
    this.store.delete(key)
  }

  async clear(): Promise<void> {
    this.store.clear()
  }

  async keys(): Promise<string[]> {
    return Array.from(this.store.keys())
  }
}
