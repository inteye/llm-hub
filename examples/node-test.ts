import { createClient } from '../packages/core/src/index'
import { openai, anthropic, deepseek, qwen } from '../packages/core/src/providers/index'

async function main() {
  console.log('=== llm-hub Node.js 测试 ===\n')

  // 1. 创建客户端
  const client = createClient({
    storage: 'memory',
    providers: [openai, anthropic, deepseek, qwen]
  })

  // 2. 查看已注册的供应商
  console.log('已注册供应商:')
  client.listProviders().forEach(p => {
    console.log(`  - ${p.icon} ${p.displayName} (${p.name})`)
    console.log(`    支持动态获取模型: ${client.canFetchModels(p.name) ? '是' : '否'}`)
    console.log(`    内置模型: ${p.models.map(m => m.name).join(', ')}`)
  })

  // 3. 配置 API Key (这里使用示例 key)
  console.log('\n配置 DeepSeek...')
  await client.configure('deepseek', {
    apiKey: 'sk-your-api-key-here',
    defaultModel: 'deepseek-chat'
  })

  // 4. 验证配置
  console.log('已配置的供应商:', await client.getAvailableProviders())

  // 5. 测试动态获取模型列表
  console.log('\n测试动态获取模型列表...')
  try {
    const models = await client.fetchModels('deepseek')
    console.log(`获取到 ${models.length} 个模型:`)
    models.slice(0, 5).forEach(m => console.log(`  - ${m.id}`))
  } catch (error) {
    console.log('动态获取模型需要真实 API Key，使用内置模型列表')
    const builtinModels = client.listModels('deepseek')
    console.log(`内置模型: ${builtinModels.map(m => m.name).join(', ')}`)
  }

  // 6. 测试对话 (需要真实的 API Key)
  try {
    console.log('\n发送测试消息...')
    const response = await client.chat({
      provider: 'deepseek',
      model: 'deepseek-chat',
      messages: [
        { role: 'user', content: '用一句话介绍自己' }
      ]
    })
    console.log('响应:', response.content)
    console.log('Token 用量:', response.usage)
  } catch (error) {
    console.log('对话测试需要真实 API Key，跳过...')
  }

  // 7. 测试自定义模型
  console.log('\n测试自定义模型配置...')
  await client.configure('openai', {
    apiKey: 'sk-custom-key',
    defaultModel: 'my-custom-model'  // 支持用户自定义模型名称
  })
  const openaiConfig = await client.getConfigAsync('openai')
  console.log(`OpenAI 自定义模型: ${openaiConfig?.defaultModel}`)

  console.log('\n=== 测试完成 ===')
}

main().catch(console.error)
