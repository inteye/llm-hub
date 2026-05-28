import { describe, it, expect } from 'vitest'
import { ProviderRegistry } from '../src/core/registry'
import { openai } from '../src/providers/openai'
import { deepseek } from '../src/providers/deepseek'

describe('ProviderRegistry', () => {
  it('should register a provider', () => {
    const registry = new ProviderRegistry()
    registry.register(openai)
    
    expect(registry.has('openai')).toBe(true)
    expect(registry.get('openai')).toBe(openai)
  })

  it('should register multiple providers', () => {
    const registry = new ProviderRegistry()
    registry.registerMany([openai, deepseek])
    
    expect(registry.list()).toHaveLength(2)
    expect(registry.names()).toContain('openai')
    expect(registry.names()).toContain('deepseek')
  })

  it('should return undefined for unregistered provider', () => {
    const registry = new ProviderRegistry()
    
    expect(registry.get('nonexistent')).toBeUndefined()
    expect(registry.has('nonexistent')).toBe(false)
  })

  it('should remove a provider', () => {
    const registry = new ProviderRegistry()
    registry.register(openai)
    
    expect(registry.remove('openai')).toBe(true)
    expect(registry.has('openai')).toBe(false)
  })

  it('should clear all providers', () => {
    const registry = new ProviderRegistry()
    registry.registerMany([openai, deepseek])
    
    registry.clear()
    expect(registry.list()).toHaveLength(0)
  })
})
