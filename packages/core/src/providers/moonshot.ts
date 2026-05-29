import { OpenAICompatibleProvider } from './base'
import { ModelInfo } from '../types'

export const moonshotModels: ModelInfo[] = [
  {
    id: 'moonshot-v1-8k',
    name: 'Moonshot V1 8K',
    contextWindow: 8192,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'moonshot-v1-32k',
    name: 'Moonshot V1 32K',
    contextWindow: 32768,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'moonshot-v1-128k',
    name: 'Moonshot V1 128K',
    contextWindow: 131072,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  }
]

export const moonshot = new OpenAICompatibleProvider({
  name: 'moonshot',
  displayName: 'Moonshot (Kimi)',
  icon: '🌙',
  defaultBaseUrl: 'https://api.moonshot.cn/v1',
  models: moonshotModels
})
