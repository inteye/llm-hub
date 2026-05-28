import { StorageAdapter, StorageType } from '../types'
import { MemoryStorage } from './memory'
import { LocalStorageAdapter } from './localStorage'
import { SessionStorageAdapter } from './sessionStorage'

export { MemoryStorage } from './memory'
export { LocalStorageAdapter } from './localStorage'
export { SessionStorageAdapter } from './sessionStorage'

export function createStorage(type: StorageType | StorageAdapter, prefix?: string): StorageAdapter {
  if (typeof type === 'object') {
    return type
  }

  switch (type) {
    case 'localStorage':
      return new LocalStorageAdapter(prefix)
    case 'sessionStorage':
      return new SessionStorageAdapter(prefix)
    case 'memory':
      return new MemoryStorage()
    default:
      return new MemoryStorage()
  }
}
