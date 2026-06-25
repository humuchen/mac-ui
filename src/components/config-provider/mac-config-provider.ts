import { html, css } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'

/**
 * @tag mac-config-provider
 * @summary A configuration provider that passes theme and size settings to child components.
 *
 * @slot - Child components that will inherit the configuration.
 */
@customElement('mac-config-provider')
export class MacConfigProvider extends BaseElement {
  static override styles = [
    css`
      :host {
        display: contents;
      }
    `,
  ]

  /** Global theme: 'light', 'dark', or 'auto' (follows system preference). */
  @property({ reflect: true }) theme: 'light' | 'dark' = 'light'

  /** Global size: 'sm', 'md', or 'lg'. */
  @property({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md'

  override connectedCallback() {
    super.connectedCallback()
    this._updateDataAttributes()
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('theme') || changed.has('size')) {
      this._updateDataAttributes()
    }
  }

  private _updateDataAttributes() {
    this.setAttribute('data-theme', this.theme)
    // if (this.theme === 'auto') {
    //   this.removeAttribute('data-theme')
    // } else {
    //   this.setAttribute('data-theme', this.theme)
    // }
  }

  override render() {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-config-provider': MacConfigProvider
  }
}
