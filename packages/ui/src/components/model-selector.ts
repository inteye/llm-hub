import { LLMHubClient, ModelInfo } from 'llm-hub'

export interface ModelSelectorOptions {
  client: LLMHubClient
  onSelect?: (provider: string, model: string) => void
  allowCustomModel?: boolean
}

export class ModelSelector {
  private client: LLMHubClient
  private container: HTMLDivElement | null = null
  private onSelect?: (provider: string, model: string) => void
  private allowCustomModel: boolean
  private selectedProvider: string | null = null
  private selectedModel: string | null = null
  private customModel: string = ''
  private availableModels: ModelInfo[] = []
  private loading: boolean = false

  constructor(options: ModelSelectorOptions) {
    this.client = options.client
    this.onSelect = options.onSelect
    this.allowCustomModel = options.allowCustomModel ?? true
  }

  async render(container: HTMLElement): Promise<void> {
    this.container = document.createElement('div')
    this.container.className = 'llm-hub-model-selector'
    container.appendChild(this.container)

    await this.update()
  }

  async update(): Promise<void> {
    if (!this.container) return

    const availableProviders = await this.client.getAvailableProviders()
    this.container.innerHTML = this.renderSelector(availableProviders)
    this.attachEventListeners()
  }

  getSelected(): { provider: string; model: string } | null {
    if (this.selectedProvider) {
      const model = this.selectedModel || this.customModel
      if (model) {
        return { provider: this.selectedProvider, model }
      }
    }
    return null
  }

  private renderSelector(availableProviders: string[]): string {
    if (availableProviders.length === 0) {
      return '<div class="llm-hub-empty">No providers configured. Please configure an API key first.</div>'
    }

    const providerOptions = availableProviders.map(name => {
      const provider = this.client.getProvider(name)
      return `
        <option value="${name}" ${name === this.selectedProvider ? 'selected' : ''}>
          ${provider?.icon || ''} ${provider?.displayName || name}
        </option>
      `
    }).join('')

    let modelSection = ''
    if (this.selectedProvider) {
      const canFetch = this.client.canFetchModels(this.selectedProvider)
      const models = this.availableModels.length > 0 ? this.availableModels : this.client.listModels(this.selectedProvider)

      const modelOptions = models.map(m => `
        <option value="${m.id}" ${m.id === this.selectedModel ? 'selected' : ''}>
          ${m.name}
        </option>
      `).join('')

      modelSection = `
        <div class="llm-hub-model-section">
          <div class="llm-hub-model-select-row">
            <select class="llm-hub-select" data-type="model">
              <option value="">Select Model</option>
              ${modelOptions}
              ${this.allowCustomModel ? '<option value="__custom__">Custom Model...</option>' : ''}
            </select>
            ${canFetch ? `
              <button class="llm-hub-btn-refresh" data-action="fetchModels" title="Fetch models from API">
                ${this.loading ? '⏳' : '🔄'}
              </button>
            ` : ''}
          </div>
          ${(this.selectedModel === '__custom__' || (this.allowCustomModel && this.selectedModel === null && this.customModel)) ? `
            <input type="text" class="llm-hub-input" data-field="customModel" 
                   value="${this.customModel}" placeholder="Enter model name (e.g., gpt-4o)">
          ` : ''}
        </div>
      `
    }

    return `
      <div class="llm-hub-select-group">
        <select class="llm-hub-select" data-type="provider">
          <option value="">Select Provider</option>
          ${providerOptions}
        </select>
        ${modelSection}
      </div>
    `
  }

  private attachEventListeners(): void {
    if (!this.container) return

    const providerSelect = this.container.querySelector('[data-type="provider"]') as HTMLSelectElement
    const modelSelect = this.container.querySelector('[data-type="model"]') as HTMLSelectElement
    const customInput = this.container.querySelector('[data-field="customModel"]') as HTMLInputElement
    const fetchBtn = this.container.querySelector('[data-action="fetchModels"]') as HTMLButtonElement

    providerSelect?.addEventListener('change', async () => {
      this.selectedProvider = providerSelect.value || null
      this.selectedModel = null
      this.customModel = ''
      this.availableModels = []
      await this.update()
    })

    modelSelect?.addEventListener('change', () => {
      this.selectedModel = modelSelect.value || null
      if (this.selectedModel === '__custom__') {
        this.selectedModel = null
        this.update()
        return
      }
      if (this.selectedProvider && this.selectedModel) {
        this.onSelect?.(this.selectedProvider, this.selectedModel)
      }
    })

    customInput?.addEventListener('input', () => {
      this.customModel = customInput.value
      if (this.selectedProvider && this.customModel) {
        this.onSelect?.(this.selectedProvider, this.customModel)
      }
    })

    fetchBtn?.addEventListener('click', async () => {
      if (!this.selectedProvider || this.loading) return
      
      this.loading = true
      fetchBtn.textContent = '⏳'
      fetchBtn.disabled = true

      try {
        this.availableModels = await this.client.fetchModels(this.selectedProvider)
        this.update()
      } catch (error) {
        console.error('Failed to fetch models:', error)
        alert('Failed to fetch models. Using built-in list.')
      } finally {
        this.loading = false
      }
    })
  }
}
