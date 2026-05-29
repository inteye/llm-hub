# @inteye/llm-hub

轻量级前端大模型接入 SDK，支持用户自助配置 API Key，内置 14 个国内外主流大模型平台。

## 特性

- 🔌 统一 API 访问 14 个 LLM 供应商
- 🔑 用户自助配置 API Key
- 🌐 浏览器 & SSR 支持
- 📦 轻量级，零运行时依赖
- 🔧 可扩展的供应商系统
- 🔄 支持动态获取模型列表
- ✏️ 支持自定义模型名称

## 安装

```bash
npm install @inteye/llm-hub
# or
pnpm add @inteye/llm-hub
# or
yarn add @inteye/llm-hub
```

## 快速开始

```typescript
import { createClient } from '@inteye/llm-hub'
import { openai, deepseek, qwen, zhipu } from '@inteye/llm-hub/providers'

// 创建客户端
const client = createClient({
  storage: 'localStorage',  // 持久化存储
  providers: [openai, anthropic, deepseek, qwen]
})

// 用户配置 API Key
await client.configure('deepseek', {
  apiKey: 'sk-xxx',
  defaultModel: 'deepseek-chat'
})

// 调用 LLM
const response = await client.chat({
  provider: 'deepseek',
  model: 'deepseek-chat',
  messages: [
    { role: 'user', content: '你好！' }
  ]
})

console.log(response.content)
```

## 流式响应

```typescript
const stream = client.chatStream({
  provider: 'openai',
  model: 'gpt-4o',
  messages: [{ role: 'user', content: '写一首诗' }]
})

for await (const chunk of stream) {
  process.stdout.write(chunk.delta)
}
```

## 动态获取模型

```typescript
// 从 API 获取可用模型列表
const models = await client.fetchModels('openai')
console.log(models)

// 检查是否支持动态获取
if (client.canFetchModels('openai')) {
  console.log('支持从 API 获取模型列表')
}
```

## SSR 支持

```typescript
import { createClient } from '@inteye/llm-hub'
import { openai } from '@inteye/llm-hub/providers'

// Node.js 环境使用 memory 存储
const client = createClient({
  storage: 'memory',
  providers: [openai]
})

// 使用环境变量配置
await client.configure('openai', {
  apiKey: process.env.OPENAI_API_KEY
})
```

## 自定义供应商

```typescript
import { OpenAICompatibleProvider } from '@inteye/llm-hub/providers'

const myProvider = new OpenAICompatibleProvider({
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

## 内置供应商

| 供应商 | 模型 | 动态获取 |
|--------|------|----------|
| OpenAI | GPT-4o, GPT-4, GPT-3.5 Turbo, o1 | ✅ |
| Anthropic | Claude 3.5 Sonnet, Claude 3 Opus | ❌ |
| Google Gemini | Gemini 1.5 Pro/Flash, Gemini Pro | ✅ |
| DeepSeek | DeepSeek Chat, Coder, Reasoner | ✅ |
| 通义千问 | Qwen-Turbo/Plus/Max | ✅ |
| 智谱AI | GLM-4, GLM-4V, GLM-3-Turbo | ✅ |
| Moonshot | Moonshot V1 8K/32K/128K | ✅ |
| Groq | Llama 3.1, Mixtral, Gemma | ✅ |
| MiniMax | ABAB 6.5/6/5.5 | ✅ |
| Mistral | Mistral Large/Medium/Small, Mixtral | ✅ |
| 百川智能 | 百川 4, 百川 3 Turbo | ✅ |
| 零一万物 | Yi Large/Medium/Spark | ✅ |
| 阶跃星辰 | Step 1/2 | ✅ |
| xAI | Grok Beta | ✅ |

## API 参考

### `createClient(options)`

创建客户端实例。

**参数：**
- `storage`: `'localStorage'` | `'sessionStorage'` | `'memory'` | `StorageAdapter`
- `providers`: `ProviderAdapter[]` - 供应商适配器数组
- `prefix`: `string` - 存储 key 前缀，默认 `'llm-hub'`

### `client.configure(provider, config)`

配置供应商。

**参数：**
- `provider`: 供应商名称
- `config`: `{ apiKey: string, baseUrl?: string, defaultModel?: string }`

### `client.chat(options)`

发送对话请求。

**参数：**
- `provider`: 供应商名称
- `model`: 模型名称
- `messages`: 消息数组
- `temperature?`: 温度参数
- `maxTokens?`: 最大 token 数

### `client.chatStream(options)`

发送流式对话请求，返回 `AsyncGenerator<StreamChunk>`。

### `client.fetchModels(provider)`

从 API 获取模型列表，不支持时返回内置列表。

### `client.validateProvider(provider)`

验证供应商配置是否有效。

## 存储类型

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| `localStorage` | 浏览器持久存储 | Web 应用 |
| `sessionStorage` | 会话存储 | 临时会话 |
| `memory` | 内存存储 | SSR / 测试 |

## 许可证

MIT
