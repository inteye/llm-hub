export interface TextContent {
  type: 'text'
  text: string
}

export interface ImageContent {
  type: 'image_url'
  image_url: {
    url: string
    detail?: 'auto' | 'low' | 'high'
  }
}

export type ContentPart = TextContent | ImageContent

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string | ContentPart[]
  name?: string
}

export interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

export interface ToolMessage extends Message {
  role: 'tool'
  tool_call_id: string
}
