import { OpenAICompatibleProvider } from './base'
import { ModelInfo } from '../types'

export const stepModels: ModelInfo[] = [
  {
    id: 'step-1-8k',
    name: 'Step 1 8K',
    contextWindow: 8192,
    maxOutput: 4096,
    supportsStreaming: true
  },
  {
    id: 'step-1-32k',
    name: 'Step 1 32K',
    contextWindow: 32768,
    maxOutput: 4096,
    supportsStreaming: true
  },
  {
    id: 'step-1-128k',
    name: 'Step 1 128K',
    contextWindow: 131072,
    maxOutput: 4096,
    supportsStreaming: true
  },
  {
    id: 'step-1-flash',
    name: 'Step 1 Flash',
    contextWindow: 8192,
    maxOutput: 4096,
    supportsStreaming: true
  },
  {
    id: 'step-2-16k',
    name: 'Step 2 16K',
    contextWindow: 16384,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  }
]

export const step = new OpenAICompatibleProvider({
  name: 'step',
  displayName: '阶跃星辰 (Step)',
  icon: '🚀',
  defaultBaseUrl: 'https://api.stepfun.com/v1',
  models: stepModels
})
