import { LLMHubClient, ProviderAdapter, ProviderConfig, ModelInfo } from 'llm-hub'

export interface ConfigDialogOptions {
  client: LLMHubClient
  providers?: string[]
  onSave?: (provider: string, config: ProviderConfig) => void
  onClose?: () => void
}

export class ConfigDialog {
  private client: LLMHubClient
  private providers: string[]
  private container: HTMLDivElement | null = null
  private onSave?: (provider: string, config: ProviderConfig) => void
  private onClose?: () => void
  private fetchedModels: Map<string, ModelInfo[]> = new Map()

  constructor(options: ConfigDialogOptions) {
    this.client = options.client
    this.providers = options.providers || options.client.listProviders().map(p => p.name)
    this.onSave = options.onSave
    this.onClose = options.onClose
  }

  async show(): Promise<void> {
    if (this.container) return

    this.container = document.createElement('div')
    this.container.className = 'llm-hub-dialog-overlay'
    this.container.innerHTML = this.render()
    document.body.appendChild(this.container)

    this.attachEventListeners()
  }

  close(): void {
    if (this.container) {
      this.container.remove()
      this.container = null
      this.onClose?.()
    }
  }

  private render(): string {
    const providerTabs = this.providers.map((name, i) => {
      const provider = this.client.getProvider(name)
      if (!provider) return ''
      return `
        <button class="llm-hub-tab ${i === 0 ? 'active' : ''}" data-provider="${name}">
          ${provider.icon || ''} ${provider.displayName}
        </button>
      `
    }).join('')

    const providerForms = this.providers.map((name, i) => {
      const provider = this.client.getProvider(name)
      if (!provider) return ''
      const config = this.client.getConfig(name)
      const canFetch = this.client.canFetchModels(name)
      const models = this.fetchedModels.get(name) || provider.models
      const isCustomModel = config?.defaultModel && !models.find(m => m.id === config.defaultModel)

      return `
        <div class="llm-hub-form ${i === 0 ? 'active' : ''}" data-provider="${name}">
          <div class="llm-hub-field">
            <label>API Key</label>
            <input type="password" class="llm-hub-input" data-field="apiKey" 
                   value="${config?.apiKey || ''}" placeholder="Enter your API key">
          </div>
          <div class="llm-hub-field">
            <label>Base URL (optional)</label>
            <input type="text" class="llm-hub-input" data-field="baseUrl" 
                   value="${config?.baseUrl || ''}" placeholder="${provider.defaultBaseUrl}">
          </div>
          <div class="llm-hub-field">
            <label>Default Model</label>
            <div class="llm-hub-model-input-row">
              <select class="llm-hub-select" data-field="defaultModel">
                <option value="">Select Model</option>
                ${models.map(m => `
                  <option value="${m.id}" ${m.id === config?.defaultModel ? 'selected' : ''}>
                    ${m.name}
                  </option>
                `).join('')}
                <option value="__custom__" ${isCustomModel ? 'selected' : ''}>Custom Model...</option>
              </select>
              ${canFetch ? `
                <button class="llm-hub-btn-refresh" data-action="fetchModels" title="Fetch models from API">
                  🔄
                </button>
              ` : ''}
            </div>
            <input type="text" class="llm-hub-input llm-hub-custom-model-input" data-field="customModel" 
                   value="${isCustomModel ? config?.defaultModel || '' : ''}" 
                   placeholder="Enter custom model name"
                   style="${isCustomModel ? '' : 'display:none'}">
          </div>
          <div class="llm-hub-actions">
            <button class="llm-hub-btn llm-hub-btn-primary" data-action="save">Save</button>
            <button class="llm-hub-btn llm-hub-btn-secondary" data-action="validate">Test Connection</button>
          </div>
        </div>
      `
    }).join('')

    return `
      <div class="llm-hub-dialog">
        <div class="llm-hub-header">
          <h2>LLM Configuration</h2>
          <button class="llm-hub-close" data-action="close">&times;</button>
        </div>
        <div class="llm-hub-tabs">${providerTabs}</div>
        <div class="llm-hub-forms">${providerForms}</div>
      </div>
    `
  }

  private attachEventListeners(): void {
    if (!this.container) return

    // Close button
    this.container.querySelector('[data-action="close"]')?.addEventListener('click', () => {
      this.close()
    })

    // Click overlay to close
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) this.close()
    })

    // Tab switching
    this.container.querySelectorAll('.llm-hub-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const provider = (tab as HTMLElement).dataset.provider
        this.switchTab(provider!)
      })
    })

    // Save buttons
    this.container.querySelectorAll('[data-action="save"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const form = (btn as HTMLElement).closest('.llm-hub-form') as HTMLElement
        const provider = form.dataset.provider!
        this.saveConfig(provider, form)
      })
    })

    // Validate buttons
    this.container.querySelectorAll('[data-action="validate"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const form = (btn as HTMLElement).closest('.llm-hub-form') as HTMLElement
        const provider = form.dataset.provider!
        await this.validateConfig(provider, form)
      })
    })

    // Fetch models buttons
    this.container.querySelectorAll('[data-action="fetchModels"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const form = (btn as HTMLElement).closest('.llm-hub-form') as HTMLElement
        const provider = form.dataset.provider!
        await this.fetchModels(provider, form, btn as HTMLButtonElement)
      })
    })

    // Model select change
    this.container.querySelectorAll('[data-field="defaultModel"]').forEach(select => {
      select.addEventListener('change', () => {
        const form = (select as HTMLElement).closest('.llm-hub-form') as HTMLElement
        const customInput = form.querySelector('.llm-hub-custom-model-input') as HTMLElement
        if (customInput) {
          customInput.style.display = (select as HTMLSelectElement).value === '__custom__' ? '' : 'none'
        }
      })
    })
  }

  private switchTab(provider: string): void {
    if (!this.container) return

    this.container.querySelectorAll('.llm-hub-tab').forEach(tab => {
      tab.classList.toggle('active', (tab as HTMLElement).dataset.provider === provider)
    })

    this.container.querySelectorAll('.llm-hub-form').forEach(form => {
      form.classList.toggle('active', (form as HTMLElement).dataset.provider === provider)
    })
  }

  private async fetchModels(provider: string, form: HTMLElement, btn: HTMLButtonElement): Promise<void> {
    const apiKey = (form.querySelector('[data-field="apiKey"]') as HTMLInputElement).value
    if (!apiKey) {
      alert('Please enter an API Key first')
      return
    }

    btn.disabled = true
    btn.textContent = '⏳'

    try {
      const models = await this.client.fetchModels(provider)
      this.fetchedModels.set(provider, models)
      
      // Update the select
      const select = form.querySelector('[data-field="defaultModel"]') as HTMLSelectElement
      const currentValue = select.value
      
      // Keep custom option
      const customOption = select.querySelector('option[value="__custom__"]')
      select.innerHTML = '<option value="">Select Model</option>' + 
        models.map(m => `<option value="${m.id}">${m.name}</option>`).join('') +
        (customOption?.outerHTML || '<option value="__custom__">Custom Model...</option>')
      
      // Restore selection
      if (currentValue && select.querySelector(`option[value="${currentValue}"]`)) {
        select.value = currentValue
      }

      alert(`Fetched ${models.length} models`)
    } catch (error) {
      console.error('Failed to fetch models:', error)
      alert('Failed to fetch models. Using built-in list.')
    } finally {
      btn.disabled = false
      btn.textContent = '🔄'
    }
  }

  private async saveConfig(provider: string, form: HTMLElement): Promise<void> {
    const apiKey = (form.querySelector('[data-field="apiKey"]') as HTMLInputElement).value
    const baseUrl = (form.querySelector('[data-field="baseUrl"]') as HTMLInputElement).value
    const modelSelect = form.querySelector('[data-field="defaultModel"]') as HTMLSelectElement
    const customInput = form.querySelector('[data-field="customModel"]') as HTMLInputElement

    let defaultModel = modelSelect.value
    if (defaultModel === '__custom__') {
      defaultModel = customInput.value
    }

    if (!apiKey) {
      alert('API Key is required')
      return
    }

    const config: ProviderConfig = {
      apiKey,
      ...(baseUrl && { baseUrl }),
      ...(defaultModel && { defaultModel })
    }

    await this.client.configure(provider, config)
    this.onSave?.(provider, config)
    alert('Configuration saved!')
  }

  private async validateConfig(provider: string, form: HTMLElement): Promise<void> {
    const apiKey = (form.querySelector('[data-field="apiKey"]') as HTMLInputElement).value
    const baseUrl = (form.querySelector('[data-field="baseUrl"]') as HTMLInputElement).value

    if (!apiKey) {
      alert('Please enter an API Key first')
      return
    }

    const btn = form.querySelector('[data-action="validate"]') as HTMLButtonElement
    btn.disabled = true
    btn.textContent = 'Testing...'

    try {
      const valid = await this.client.validateProvider(provider)
      alert(valid ? 'Connection successful!' : 'Connection failed. Please check your configuration.')
    } catch (e) {
      alert(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`)
    } finally {
      btn.disabled = false
      btn.textContent = 'Test Connection'
    }
  }
}
