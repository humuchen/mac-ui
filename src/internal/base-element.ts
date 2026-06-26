import { LitElement, PropertyValues } from 'lit'
import { state, property } from 'lit/decorators.js'

export abstract class BaseElement extends LitElement {
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  }

  /** Component-level theme override. Takes precedence over mac-config-provider. */
  @property({ reflect: true }) theme?: 'light' | 'dark'

  @state() private _globalSize?: 'sm' | 'md' | 'lg'
  @state() private _globalTheme?: 'light' | 'dark'

  private _configProvider: HTMLElement | null = null
  private _configObserver: MutationObserver | null = null

  override connectedCallback() {
    super.connectedCallback()
    this._configProvider = this._findConfigProvider()
    if (this._configProvider) {
      this._readConfigFromProvider()
      this._configObserver = new MutationObserver(() => this._readConfigFromProvider())
      this._configObserver.observe(this._configProvider, { attributes: true })
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    if (this._configObserver) {
      this._configObserver.disconnect()
      this._configObserver = null
    }
    this._configProvider = null
  }

  private _findConfigProvider(): HTMLElement | null {
    let el: Element | null = this
    while (el) {
      if (el.tagName.toLowerCase() === 'mac-config-provider') {
        return el as HTMLElement
      }
      el = el.parentElement
    }
    return null
  }

  private _readConfigFromProvider() {
    if (!this._configProvider) return
    const size = this._configProvider.getAttribute('size') as 'sm' | 'md' | 'lg' | null
    const theme = this._configProvider.getAttribute('data-theme') as 'light' | 'dark' | null
    this._globalSize = size ?? undefined
    this._globalTheme = theme ?? undefined
  }

  protected get _resolvedSize(): 'sm' | 'md' | 'lg' {
    return (
      ((this as unknown as Record<string, unknown>).size as 'sm' | 'md' | 'lg' | undefined) ??
      this._globalSize ??
      'md'
    )
  }

  protected get _resolvedTheme(): 'light' | 'dark' | undefined {
    return this.theme ?? this._globalTheme ?? undefined
  }

  override update(changedProperties: PropertyValues) {
    const theme = this._resolvedTheme
    if (theme) {
      this.setAttribute('data-theme', theme)
    } else {
      this.removeAttribute('data-theme')
    }
    super.update(changedProperties)
  }

  protected emit(name: string, options?: CustomEventInit): void {
    this.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        composed: true,
        ...options,
      }),
    )
  }
}
