import { OpenAICompatibleProvider } from './base'
import { ModelInfo } from '../types'

export const baichuanModels: ModelInfo[] = [
  {
    id: 'Baichuan4',
    name: '百川 4',
    contextWindow: 32768,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'Baichuan3-Turbo',
    name: '百川 3 Turbo',
    contextWindow: 32768,
    maxOutput: 4096,
    supportsStreaming: true
  },
  {
    id: 'Baichuan3-Turbo-128k',
    name: '百川 3 Turbo 128K',
    contextWindow: 131072,
    maxOutput: 4096,
    supportsStreaming: true
  },
  {
    id: 'Baichuan2-Turbo',
    name: '百川 2 Turbo',
    contextWindow: 32768,
    maxOutput: 4096,
    supportsStreaming: true
  }
]

export const baichuan = new OpenAICompatibleProvider({
  name: 'baichuan',
  displayName: '百川智能',
  icon: '🏔️',
  defaultBaseUrl: 'https://api.baichuan-ai.com/v1',
  models: baichuanModels
})
