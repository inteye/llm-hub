import { describe, it, expect } from 'vitest'
import { LLMHubClient, createClient } from '../src/core/client'
import { openai } from '../src/providers/openai'
import { deepseek } from '../src/providers/deepseek'

describe('LLMHubClient', () => {
  it('should create a client with default options', () => {
    const client = createClient()
    expect(client).toBeInstanceOf(LLMHubClient)
  })

  it('should create a client with providers', () => {
    const client = createClient({
      providers: [openai, deepseek]
    })
    
    expect(client.listProviders()).toHaveLength(2)
    expect(client.getProvider('openai')).toBeDefined()
    expect(client.getProvider('deepseek')).toBeDefined()
  })

  it('should register providers after creation', () => {
    const client = createClient()
    client.registerProvider(openai)
    
    expect(client.getProvider('openai')).toBeDefined()
  })

  it('should configure and get config', async () => {
    const client = createClient({
      storage: 'memory',
      providers: [openai]
    })
    
    await client.configure('openai', {
      apiKey: 'test-key',
      defaultModel: 'gpt-4'
    })
    
    const config = await client.getConfigAsync('openai')
    expect(config?.apiKey).toBe('test-key')
    expect(config?.defaultModel).toBe('gpt-4')
  })

  it('should remove config', async () => {
    const client = createClient({
      storage: 'memory',
      providers: [openai]
    })
    
    await client.configure('openai', { apiKey: 'test-key' })
    await client.removeConfig('openai')
    
    const config = await client.getConfigAsync('openai')
    expect(config).toBeUndefined()
  })

  it('should list available providers', async () => {
    const client = createClient({
      storage: 'memory',
      providers: [openai, deepseek]
    })
    
    await client.configure('openai', { apiKey: 'test-key' })
    
    const available = await client.getAvailableProviders()
    expect(available).toContain('openai')
    expect(available).not.toContain('deepseek')
  })

  it('should get model list', () => {
    const client = createClient({
      providers: [openai]
    })
    
    const models = client.listModels('openai')
    expect(models.length).toBeGreaterThan(0)
    expect(models[0].id).toBeDefined()
    expect(models[0].name).toBeDefined()
  })

  it('should emit config change events', async () => {
    const client = createClient({
      storage: 'memory',
      providers: [openai]
    })
    
    let eventReceived = false
    client.on('configChange', (provider) => {
      eventReceived = true
      expect(provider).toBe('openai')
    })
    
    await client.configure('openai', { apiKey: 'test-key' })
    expect(eventReceived).toBe(true)
  })

  it('should return undefined for unregistered provider', () => {
    const client = createClient()
    
    expect(client.getProvider('nonexistent')).toBeUndefined()
  })

  it('should throw error when configuring unregistered provider', async () => {
    const client = createClient()
    
    await expect(
      client.configure('nonexistent', { apiKey: 'test' })
    ).rejects.toThrow()
  })
})
