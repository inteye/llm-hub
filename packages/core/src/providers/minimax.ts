import { OpenAICompatibleProvider } from './base'
import { ModelInfo } from '../types'

export const minimaxModels: ModelInfo[] = [
  {
    id: 'abab6.5-chat',
    name: 'ABAB 6.5',
    contextWindow: 8192,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'abab6.5s-chat',
    name: 'ABAB 6.5S',
    contextWindow: 4096,
    maxOutput: 2048,
    supportsStreaming: true
  },
  {
    id: 'abab6-chat',
    name: 'ABAB 6',
    contextWindow: 8192,
    maxOutput: 4096,
    supportsStreaming: true
  },
  {
    id: 'abab5.5-chat',
    name: 'ABAB 5.5',
    contextWindow: 16384,
    maxOutput: 4096,
    supportsStreaming: true
  }
]

export const minimax = new OpenAICompatibleProvider({
  name: 'minimax',
  displayName: 'MiniMax',
  icon: '🔮',
  defaultBaseUrl: 'https://api.minimax.chat/v1',
  models: minimaxModels
})
