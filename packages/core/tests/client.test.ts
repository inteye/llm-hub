import { describe, it, expect } from 'vitest'
import { LLMHubClient, createClient } from '../src/core/client'
import { builtinProviders } from '../src/providers/index'

describe('LLMHubClient', () => {
  it('should create a client with default options', () => {
    const client = createClient()
    expect(client).toBeInstanceOf(LLMHubClient)
  })

  it('should create a client with all builtin providers', () => {
    const client = createClient({
      providers: builtinProviders
    })
    
    expect(client.listProviders()).toHaveLength(builtinProviders.length)
  })

  it('should register providers after creation', () => {
    const client = createClient()
    client.registerProvider(builtinProviders[0])
    
    expect(client.getProvider(builtinProviders[0].name)).toBeDefined()
  })

  it('should configure and get config', async () => {
    const client = createClient({
      storage: 'memory',
      providers: builtinProviders
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
      providers: builtinProviders
    })
    
    await client.configure('openai', { apiKey: 'test-key' })
    await client.removeConfig('openai')
    
    const config = await client.getConfigAsync('openai')
    expect(config).toBeUndefined()
  })

  it('should list available providers', async () => {
    const client = createClient({
      storage: 'memory',
      providers: builtinProviders
    })
    
    await client.configure('openai', { apiKey: 'test-key' })
    await client.configure('deepseek', { apiKey: 'test-key' })
    
    const available = await client.getAvailableProviders()
    expect(available).toContain('openai')
    expect(available).toContain('deepseek')
    expect(available).not.toContain('anthropic')
  })

  it('should get model list for each provider', () => {
    const client = createClient({
      providers: builtinProviders
    })
    
    for (const provider of builtinProviders) {
      const models = client.listModels(provider.name)
      expect(models.length).toBeGreaterThan(0)
      expect(models[0].id).toBeDefined()
      expect(models[0].name).toBeDefined()
    }
  })

  it('should emit config change events', async () => {
    const client = createClient({
      storage: 'memory',
      providers: builtinProviders
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

  it('should check if provider supports fetching models', () => {
    const client = createClient({
      providers: builtinProviders
    })
    
    // OpenAI compatible providers should support fetching
    expect(client.canFetchModels('openai')).toBe(true)
    expect(client.canFetchModels('deepseek')).toBe(true)
    expect(client.canFetchModels('zhipu')).toBe(true)
    
    // Anthropic does not support fetching
    expect(client.canFetchModels('anthropic')).toBe(false)
  })
})
