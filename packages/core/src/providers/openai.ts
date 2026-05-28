import { OpenAICompatibleProvider } from './base'
import { ModelInfo } from '../types'

export const openaiModels: ModelInfo[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    contextWindow: 128000,
    maxOutput: 16384,
    supportsVision: true,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    contextWindow: 128000,
    maxOutput: 16384,
    supportsVision: true,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    contextWindow: 128000,
    maxOutput: 4096,
    supportsVision: true,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    contextWindow: 8192,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    contextWindow: 16385,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'o1',
    name: 'o1',
    contextWindow: 200000,
    maxOutput: 100000,
    supportsVision: true,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'o1-mini',
    name: 'o1-mini',
    contextWindow: 128000,
    maxOutput: 65536,
    supportsStreaming: true,
    supportsFunctionCalling: true
  }
]

export const openai = new OpenAICompatibleProvider({
  name: 'openai',
  displayName: 'OpenAI',
  icon: '🤖',
  defaultBaseUrl: 'https://api.openai.com/v1',
  models: openaiModels
})
