import { OpenAICompatibleProvider } from './base'
import { ModelInfo } from '../types'

export const mistralModels: ModelInfo[] = [
  {
    id: 'mistral-large-latest',
    name: 'Mistral Large',
    contextWindow: 128000,
    maxOutput: 4096,
    supportsVision: false,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'mistral-medium-latest',
    name: 'Mistral Medium',
    contextWindow: 32000,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'mistral-small-latest',
    name: 'Mistral Small',
    contextWindow: 32000,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'open-mixtral-8x22b',
    name: 'Mixtral 8x22B',
    contextWindow: 65536,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'open-mixtral-8x7b',
    name: 'Mixtral 8x7B',
    contextWindow: 32768,
    maxOutput: 4096,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'open-mistral-7b',
    name: 'Mistral 7B',
    contextWindow: 32768,
    maxOutput: 4096,
    supportsStreaming: true
  },
  {
    id: 'codestral-latest',
    name: 'Codestral',
    contextWindow: 32000,
    maxOutput: 4096,
    supportsStreaming: true
  }
]

export const mistral = new OpenAICompatibleProvider({
  name: 'mistral',
  displayName: 'Mistral',
  icon: '🌊',
  defaultBaseUrl: 'https://api.mistral.ai/v1',
  models: mistralModels
})
