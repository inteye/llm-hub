import { createClient } from '../packages/core/src/index'
import { builtinProviders } from '../packages/core/src/providers/index'

async function main() {
  console.log('=== llm-hub Node.js 测试 ===\n')

  // 1. 创建客户端，使用所有内置供应商
  const client = createClient({
    storage: 'memory',
    providers: builtinProviders
  })

  // 2. 查看已注册的供应商
  console.log(`已注册 ${client.listProviders().length} 个供应商:\n`)
  client.listProviders().forEach(p => {
    const canFetch = client.canFetchModels(p.name)
    console.log(`  ${p.icon || '•'} ${p.displayName} (${p.name})`)
    console.log(`    模型: ${p.models.slice(0, 3).map(m => m.name).join(', ')}${p.models.length > 3 ? '...' : ''}`)
    console.log(`    动态获取: ${canFetch ? '✅' : '❌'}`)
  })

  // 3. 配置 API Key
  console.log('\n配置 DeepSeek...')
  await client.configure('deepseek', {
    apiKey: 'sk-your-api-key-here',
    defaultModel: 'deepseek-chat'
  })

  // 4. 验证配置
  console.log('已配置的供应商:', await client.getAvailableProviders())

  // 5. 测试自定义模型
  console.log('\n测试自定义模型配置...')
  await client.configure('openai', {
    apiKey: 'sk-custom-key',
    defaultModel: 'my-custom-model'
  })
  const openaiConfig = await client.getConfigAsync('openai')
  console.log(`OpenAI 自定义模型: ${openaiConfig?.defaultModel}`)

  console.log('\n=== 测试完成 ===')
}

main().catch(console.error)
