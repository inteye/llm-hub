import { describe, it, expect } from 'vitest'
import { MemoryStorage } from '../src/storage/memory'
import { createStorage } from '../src/storage/index'

describe('MemoryStorage', () => {
  it('should store and retrieve values', async () => {
    const storage = new MemoryStorage()
    
    await storage.set('key1', { value: 'test' })
    const result = await storage.get('key1')
    
    expect(result).toEqual({ value: 'test' })
  })

  it('should return null for non-existent keys', async () => {
    const storage = new MemoryStorage()
    
    const result = await storage.get('nonexistent')
    expect(result).toBeNull()
  })

  it('should remove values', async () => {
    const storage = new MemoryStorage()
    
    await storage.set('key1', 'value1')
    await storage.remove('key1')
    
    const result = await storage.get('key1')
    expect(result).toBeNull()
  })

  it('should clear all values', async () => {
    const storage = new MemoryStorage()
    
    await storage.set('key1', 'value1')
    await storage.set('key2', 'value2')
    await storage.clear()
    
    expect(await storage.get('key1')).toBeNull()
    expect(await storage.get('key2')).toBeNull()
  })

  it('should list all keys', async () => {
    const storage = new MemoryStorage()
    
    await storage.set('key1', 'value1')
    await storage.set('key2', 'value2')
    
    const keys = await storage.keys()
    expect(keys).toContain('key1')
    expect(keys).toContain('key2')
  })
})

describe('createStorage', () => {
  it('should create memory storage by default', () => {
    const storage = createStorage('memory')
    expect(storage).toBeInstanceOf(MemoryStorage)
  })

  it('should accept custom storage adapter', () => {
    const customAdapter = new MemoryStorage()
    const storage = createStorage(customAdapter)
    expect(storage).toBe(customAdapter)
  })
})
