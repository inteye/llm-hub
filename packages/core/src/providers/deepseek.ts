import { OpenAICompatibleProvider } from './base'
import { ModelInfo } from '../types'

export const deepseekModels: ModelInfo[] = [
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    contextWindow: 32768,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder',
    contextWindow: 32768,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek Reasoner',
    contextWindow: 65536,
    maxOutput: 8192,
    supportsStreaming: true,
    supportsFunctionCalling: true
  }
]

export const deepseek = new OpenAICompatibleProvider({
  name: 'deepseek',
  displayName: 'DeepSeek',
  icon: '🔮',
  defaultBaseUrl: 'https://api.deepseek.com/v1',
  models: deepseekModels
})
