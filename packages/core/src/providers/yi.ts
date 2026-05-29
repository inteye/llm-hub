import { OpenAICompatibleProvider } from './base'
import { ModelInfo } from '../types'

export const yiModels: ModelInfo[] = [
  {
    id: 'yi-large',
    name: 'Yi Large',
    contextWindow: 32768,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'yi-medium',
    name: 'Yi Medium',
    contextWindow: 16384,
    maxOutput: 4096,
    supportsStreaming: true
  },
  {
    id: 'yi-medium-200k',
    name: 'Yi Medium 200K',
    contextWindow: 204800,
    maxOutput: 4096,
    supportsStreaming: true
  },
  {
    id: 'yi-spark',
    name: 'Yi Spark',
    contextWindow: 16384,
    maxOutput: 4096,
    supportsStreaming: true
  },
  {
    id: 'yi-large-turbo',
    name: 'Yi Large Turbo',
    contextWindow: 32768,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'yi-vision',
    name: 'Yi Vision',
    contextWindow: 16384,
    maxOutput: 4096,
    supportsVision: true,
    supportsStreaming: true
  }
]

export const yi = new OpenAICompatibleProvider({
  name: 'yi',
  displayName: '零一万物 (Yi)',
  icon: '🔮',
  defaultBaseUrl: 'https://api.lingyiwanwu.com/v1',
  models: yiModels
})
