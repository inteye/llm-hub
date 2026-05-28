# llm-hub

Lightweight frontend LLM integration SDK. Supports OpenAI, Anthropic, DeepSeek, Qwen and more.

## Features

- 🔌 Unified API for multiple LLM providers
- 🔑 User self-service API key configuration
- 🌐 Browser & SSR support
- 📦 Lightweight, zero runtime dependencies
- 🎨 Optional UI components (Web Components)
- 🔧 Extensible provider system

## Installation

```bash
npm install llm-hub
# or
pnpm add llm-hub
# or
yarn add llm-hub
```

For UI components (optional):

```bash
npm install llm-hub-ui
```

## Quick Start

```typescript
import { createClient } from 'llm-hub'
import { openai, anthropic, deepseek, qwen } from 'llm-hub/providers'

// Create client
const client = createClient({
  storage: 'localStorage',  // Persist config in browser
  providers: [openai, anthropic, deepseek, qwen]
})

// User configures API key
await client.configure('deepseek', {
  apiKey: 'sk-xxx',
  defaultModel: 'deepseek-chat'
})

// Call LLM
const response = await client.chat({
  provider: 'deepseek',
  model: 'deepseek-chat',
  messages: [
    { role: 'user', content: 'Hello!' }
  ]
})

console.log(response.content)
```

## Streaming

```typescript
const stream = client.chatStream({
  provider: 'openai',
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Write a poem' }]
})

for await (const chunk of stream) {
  process.stdout.write(chunk.delta)
}
```

## UI Components

```typescript
import { ConfigDialog, ModelSelector } from 'llm-hub-ui'
import 'llm-hub-ui/style.css'

// Show configuration dialog
const dialog = new ConfigDialog({
  client,
  onSave: (provider, config) => {
    console.log('Saved:', provider, config)
  }
})

dialog.show()

// Model selector
const selector = new ModelSelector({
  client,
  onSelect: (provider, model) => {
    console.log('Selected:', provider, model)
  }
})

selector.render(document.getElementById('selector-container')!)
```

## SSR Support

```typescript
import { createClient } from 'llm-hub'
import { openai } from 'llm-hub/providers'

// In Node.js environment
const client = createClient({
  storage: 'memory',  // Use memory storage for SSR
  providers: [openai]
})

// Configure with environment variables
await client.configure('openai', {
  apiKey: process.env.OPENAI_API_KEY
})
```

## Supported Providers

| Provider | Models |
|----------|--------|
| OpenAI | GPT-4o, GPT-4, GPT-3.5 Turbo, o1 |
| Anthropic | Claude 3.5 Sonnet, Claude 3 Opus |
| DeepSeek | DeepSeek Chat, DeepSeek Coder |
| Qwen | 通义千问-Turbo/Plus/Max |

## Custom Provider

```typescript
import { OpenAICompatibleProvider } from 'llm-hub/providers'

export const myProvider = new OpenAICompatibleProvider({
  name: 'my-provider',
  displayName: 'My Provider',
  defaultBaseUrl: 'https://api.example.com/v1',
  models: [
    {
      id: 'my-model',
      name: 'My Model',
      contextWindow: 32768,
      supportsStreaming: true
    }
  ]
})

const client = createClient({
  providers: [myProvider]
})
```

## API Reference

### `createClient(options)`

Creates a new LLM Hub client.

**Options:**
- `storage`: `'localStorage'` | `'sessionStorage'` | `'memory'` | `StorageAdapter`
- `providers`: `ProviderAdapter[]`
- `prefix`: `string` (default: `'llm-hub'`)

### `client.configure(provider, config)`

Configures a provider with API key and options.

### `client.chat(options)`

Sends a chat request to the specified provider.

### `client.chatStream(options)`

Sends a streaming chat request.

### `client.validateProvider(provider)`

Validates the configuration for a provider.

## License

MIT
