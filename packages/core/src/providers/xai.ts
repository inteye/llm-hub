import { OpenAICompatibleProvider } from './base'
import { ModelInfo } from '../types'

export const xaiModels: ModelInfo[] = [
  {
    id: 'grok-beta',
    name: 'Grok Beta',
    contextWindow: 131072,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'grok-vision-beta',
    name: 'Grok Vision Beta',
    contextWindow: 8192,
    maxOutput: 4096,
    supportsVision: true,
    supportsStreaming: true,
    supportsFunctionCalling: true
  }
]

export const xai = new OpenAICompatibleProvider({
  name: 'xai',
  displayName: 'xAI (Grok)',
  icon: '✖️',
  defaultBaseUrl: 'https://api.x.ai/v1',
  models: xaiModels
})
