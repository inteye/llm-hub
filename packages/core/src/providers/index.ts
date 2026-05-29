export { OpenAICompatibleProvider } from './base'
export { openai, openaiModels } from './openai'
export { anthropic, anthropicModels, AnthropicProvider } from './anthropic'
export { gemini, geminiModels, GeminiProvider } from './gemini'
export { deepseek, deepseekModels } from './deepseek'
export { qwen, qwenModels } from './qwen'
export { zhipu, zhipuModels } from './zhipu'
export { moonshot, moonshotModels } from './moonshot'
export { groq, groqModels } from './groq'
export { minimax, minimaxModels } from './minimax'
export { mistral, mistralModels } from './mistral'
export { baichuan, baichuanModels } from './baichuan'
export { yi, yiModels } from './yi'
export { step, stepModels } from './step'
export { xai, xaiModels } from './xai'

import { openai } from './openai'
import { anthropic } from './anthropic'
import { gemini } from './gemini'
import { deepseek } from './deepseek'
import { qwen } from './qwen'
import { zhipu } from './zhipu'
import { moonshot } from './moonshot'
import { groq } from './groq'
import { minimax } from './minimax'
import { mistral } from './mistral'
import { baichuan } from './baichuan'
import { yi } from './yi'
import { step } from './step'
import { xai } from './xai'
import { ProviderAdapter } from '../types'

export const builtinProviders: ProviderAdapter[] = [
  openai,
  anthropic,
  gemini,
  deepseek,
  qwen,
  zhipu,
  moonshot,
  groq,
  minimax,
  mistral,
  baichuan,
  yi,
  step,
  xai
]
