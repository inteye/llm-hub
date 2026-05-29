import { OpenAICompatibleProvider } from './base'
import { ModelInfo } from '../types'

export const groqModels: ModelInfo[] = [
  {
    id: 'llama-3.1-405b-reasoning',
    name: 'Llama 3.1 405B',
    contextWindow: 131072,
    maxOutput: 32768,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'llama-3.1-70b-versatile',
    name: 'Llama 3.1 70B',
    contextWindow: 131072,
    maxOutput: 32768,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B',
    contextWindow: 131072,
    maxOutput: 8192,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B',
    contextWindow: 32768,
    maxOutput: 32768,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'gemma2-9b-it',
    name: 'Gemma 2 9B',
    contextWindow: 8192,
    maxOutput: 8192,
    supportsStreaming: true
  },
  {
    id: 'llama3-groq-8b-8192-tool-use-preview',
    name: 'Llama 3 Groq 8B (Tool Use)',
    contextWindow: 8192,
    maxOutput: 8192,
    supportsStreaming: true,
    supportsFunctionCalling: true
  },
  {
    id: 'llama3-groq-70b-8192-tool-use-preview',
    name: 'Llama 3 Groq 70B (Tool Use)',
    contextWindow: 8192,
    maxOutput: 8192,
    supportsStreaming: true,
    supportsFunctionCalling: true
  }
]

export const groq = new OpenAICompatibleProvider({
  name: 'groq',
  displayName: 'Groq',
  icon: '⚡',
  defaultBaseUrl: 'https://api.groq.com/openai/v1',
  models: groqModels
})
