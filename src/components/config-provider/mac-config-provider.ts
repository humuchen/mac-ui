import { html, css } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'

/**
 * @tag mac-config-provider
 * @summary 将主题和尺寸设置传递给子组件的配置提供者。
 *
 * @slot - 将继承配置的子组件。
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

  /** 全局主题：'light'、'dark' 或 'auto'（跟随系统偏好）。 */
  @property({ reflect: true }) theme: 'light' | 'dark' = 'light'

  /** 全局尺寸：'sm'、'md' 或 'lg'。 */
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
