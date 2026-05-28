import { StorageAdapter } from '../types'

export class LocalStorageAdapter implements StorageAdapter {
  private prefix: string

  constructor(prefix = 'llm-hub') {
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = localStorage.getItem(this.getKey(key))
      if (value === null) return null
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(this.getKey(key), JSON.stringify(value))
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(this.getKey(key))
  }

  async clear(): Promise<void> {
    const keys = await this.keys()
    for (const key of keys) {
      localStorage.removeItem(this.getKey(key))
    }
  }

  async keys(): Promise<string[]> {
    const keys: string[] = []
    const prefix = this.prefix + ':'
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(prefix)) {
        keys.push(key.slice(prefix.length))
      }
    }
    return keys
  }
}
