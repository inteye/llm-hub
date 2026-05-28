export { OpenAICompatibleProvider } from './base'
export { openai, openaiModels } from './openai'
export { anthropic, anthropicModels, AnthropicProvider } from './anthropic'
export { deepseek, deepseekModels } from './deepseek'
export { qwen, qwenModels } from './qwen'

import { openai } from './openai'
import { anthropic } from './anthropic'
import { deepseek } from './deepseek'
import { qwen } from './qwen'
import { ProviderAdapter } from '../types'

export const builtinProviders: ProviderAdapter[] = [
  openai,
  anthropic,
  deepseek,
  qwen
]
