import { OpenAICompatibleProvider } from './base'
import { ModelInfo } from '../types'

export const qwenModels: ModelInfo[] = [
  {
    id: 'qwen-turbo',
    name: '通义千问-Turbo',
    contextWindow: 8192,
    maxOutput: 2048,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'qwen-plus',
    name: '通义千问-Plus',
    contextWindow: 32768,
    maxOutput: 8192,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'qwen-max',
    name: '通义千问-Max',
    contextWindow: 32768,
    maxOutput: 8192,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'qwen-long',
    name: '通义千问-Long',
    contextWindow: 1000000,
    maxOutput: 6000,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'qwen-vl-plus',
    name: '通义千问-VL-Plus',
    contextWindow: 32768,
    maxOutput: 4096,
    supportsVision: true,
    supportsStreaming: true
  },
  {
    id: 'qwen-vl-max',
    name: '通义千问-VL-Max',
    contextWindow: 32768,
    maxOutput: 4096,
    supportsVision: true,
    supportsStreaming: true
  }
]

export const qwen = new OpenAICompatibleProvider({
  name: 'qwen',
  displayName: '通义千问',
  icon: '🌟',
  defaultBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  models: qwenModels
})
