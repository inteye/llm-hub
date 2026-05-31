# @inteye/llm-hub-ui

@inteye/llm-hub 的可选 UI 组件包，提供配置弹窗和模型选择器。

## 特性

- 🎨 即用型配置弹窗组件
- 📋 模型选择器（支持动态获取 + 自定义输入）
- 🎯 框架无关（Web Components）
- 💎 内置精美样式
- 📱 响应式设计

## 安装

```bash
npm install @inteye/llm-hub-ui @inteye/llm-hub
# or
pnpm add @inteye/llm-hub-ui @inteye/llm-hub
```

## 快速开始

### 配置弹窗

```typescript
import { ConfigDialog } from '@inteye/llm-hub-ui'
import { createClient } from '@inteye/llm-hub'
import { openai, deepseek, qwen, zhipu } from '@inteye/llm-hub/providers'
import '@inteye/llm-hub-ui/style.css'

const client = createClient({
  storage: 'localStorage',
  providers: [openai, deepseek, qwen, zhipu]
})

// 显示配置弹窗
const dialog = new ConfigDialog({
  client,
  onSave: (provider, config) => {
    console.log('配置已保存:', provider)
  },
  onClose: () => {
    console.log('弹窗已关闭')
  }
})

// 绑定按钮事件
document.getElementById('settings-btn').addEventListener('click', () => {
  dialog.show()
})
```

### 模型选择器

```typescript
import { ModelSelector } from '@inteye/llm-hub-ui'
import '@inteye/llm-hub-ui/style.css'

const selector = new ModelSelector({
  client,
  allowCustomModel: true,  // 允许自定义模型
  onSelect: (provider, model) => {
    console.log('选择:', provider, model)
  }
})

// 渲染到容器
selector.render(document.getElementById('model-container'))
```

### HTML 使用

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/@inteye/llm-hub-ui/dist/index.css">
</head>
<body>
  <div id="settings-container"></div>
  <div id="model-container"></div>

  <script type="module">
    import { ConfigDialog, ModelSelector } from '@inteye/llm-hub-ui'
    import { createClient } from '@inteye/llm-hub'
    import { openai, deepseek, qwen, zhipu } from '@inteye/llm-hub/providers'

    const client = createClient({
      storage: 'localStorage',
      providers: [openai, deepseek, qwen, zhipu]
    })

    // 配置弹窗
    const dialog = new ConfigDialog({ client })
    document.getElementById('settings-btn').onclick = () => dialog.show()

    // 模型选择器
    const selector = new ModelSelector({
      client,
      onSelect: (provider, model) => {
        console.log('Selected:', provider, model)
      }
    })
    selector.render(document.getElementById('model-container'))
  </script>
</body>
</html>
```

## 组件说明

### ConfigDialog

配置弹窗组件，支持多供应商切换配置。

```typescript
interface ConfigDialogOptions {
  client: LLMHubClient
  providers?: string[]           // 可选，指定显示哪些供应商
  onSave?: (provider: string, config: ProviderConfig) => void
  onClose?: () => void
}
```

**功能：**
- 多供应商 Tab 切换
- API Key 配置
- Base URL 配置（支持代理）
- 默认模型选择
- 动态获取模型列表
- 自定义模型输入
- 连接测试

### ModelSelector

模型选择器组件。

```typescript
interface ModelSelectorOptions {
  client: LLMHubClient
  allowCustomModel?: boolean     // 是否允许自定义模型，默认 true
  onSelect?: (provider: string, model: string) => void
}
```

**功能：**
- 供应商下拉选择
- 模型下拉选择
- 🔄 按钮动态获取模型
- "Custom Model..." 选项支持手动输入

## 支持的供应商

| 供应商 | 类型 | 动态获取 |
|--------|------|----------|
| OpenAI | 国际 | ✅ |
| Anthropic | 国际 | ❌ |
| Google Gemini | 国际 | ✅ |
| DeepSeek | 国内 | ✅ |
| 通义千问 | 国内 | ✅ |
| 智谱AI | 国内 | ✅ |
| Moonshot | 国内 | ✅ |
| Groq | 国际 | ✅ |
| MiniMax | 国内 | ✅ |
| Mistral | 国际 | ✅ |
| 百川智能 | 国内 | ✅ |
| 零一万物 | 国内 | ✅ |
| 阶跃星辰 | 国内 | ✅ |
| xAI | 国际 | ✅ |

## 样式自定义

组件使用 CSS 变量，可轻松自定义：

```css
:root {
  --llm-hub-primary: #4f46e5;       /* 主色调 */
  --llm-hub-primary-hover: #4338ca; /* 悬停色 */
  --llm-hub-bg: #ffffff;            /* 背景色 */
  --llm-hub-border: #e5e7eb;        /* 边框色 */
  --llm-hub-text: #111827;          /* 文字色 */
  --llm-hub-radius: 8px;            /* 圆角 */
}
```

## 依赖

- `@inteye/llm-hub` ^1.0.3 (peer dependency)

## 许可证

MIT
