import { OpenAICompatibleProvider } from './base'
import { ModelInfo } from '../types'

export const zhipuModels: ModelInfo[] = [
  {
    id: 'glm-4',
    name: 'GLM-4',
    contextWindow: 128000,
    maxOutput: 4096,
    supportsVision: true,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'glm-4-flash',
    name: 'GLM-4-Flash',
    contextWindow: 128000,
    maxOutput: 4096,
    supportsVision: true,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'glm-4v',
    name: 'GLM-4V',
    contextWindow: 2048,
    maxOutput: 1024,
    supportsVision: true,
    supportsStreaming: true
  },
  {
    id: 'glm-4-air',
    name: 'GLM-4-Air',
    contextWindow: 128000,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'glm-4-airx',
    name: 'GLM-4-AirX',
    contextWindow: 8192,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'glm-4-long',
    name: 'GLM-4-Long',
    contextWindow: 1000000,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'glm-3-turbo',
    name: 'GLM-3-Turbo',
    contextWindow: 128000,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  }
]

export const zhipu = new OpenAICompatibleProvider({
  name: 'zhipu',
  displayName: '智谱AI',
  icon: '🧠',
  defaultBaseUrl: 'https://open.bigmodel.cn/api/paas/v4',
  models: zhipuModels
})
