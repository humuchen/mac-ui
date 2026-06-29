import { html, css, nothing } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-button
 * @summary 一个多功能的按钮组件。
 *
 * @slot - 按钮的文本标签。
 * @slot prefix - 标签前的内容。
 * @slot suffix - 标签后的内容。
 *
 * @csspart base - 按钮的基础容器。
 * @csspart label - 按钮的标签。
 * @csspart prefix - 前缀容器。
 * @csspart suffix - 后缀容器。
 *
 * @event mac-click - 点击按钮时触发。
 */
@customElement('mac-button')
export class MacButton extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: inline-block;
      }

      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--md-button-gap);
        padding: var(--md-button-padding-vertical) var(--md-button-padding-horizontal);
        font-size: var(--md-button-font-size);
        font-family: inherit;
        line-height: 1.5;
        border-radius: var(--md-button-radius);
        border: 1px solid transparent;
        cursor: pointer;
        transition: all var(--md-transition-fast);
        user-select: none;
        white-space: nowrap;
      }

      .button:focus-visible {
        outline: 2px solid var(--md-color-primary);
        outline-offset: 2px;
      }

      /* 变体 */
      .button--primary {
        background-color: var(--md-color-primary);
        color: #fff;
      }

      .button--primary:hover {
        background-color: var(--md-color-primary-hover);
      }

      .button--primary:active {
        background-color: var(--md-color-primary-active);
      }

      .button--secondary {
        background-color: transparent;
        color: var(--md-color-text);
        border-color: var(--md-color-border);
      }

      .button--secondary:hover {
        color: var(--md-color-primary);
        border-color: var(--md-color-primary);
      }

      .button--text {
        background-color: transparent;
        color: var(--md-color-text);
        padding: var(--md-button-padding-vertical) var(--md-button-padding-vertical);
      }

      .button--text:hover {
        color: var(--md-color-primary);
        background-color: var(--md-color-bg-secondary);
      }

      /* 尺寸 */
      .button--sm {
        padding: var(--sm-button-padding-vertical) var(--sm-button-padding-horizontal);
        font-size: var(--sm-button-font-size);
        gap: var(--sm-button-gap);
        border-radius: var(--sm-button-radius);
      }

      .button--lg {
        padding: var(--lg-button-padding-vertical) var(--lg-button-padding-horizontal);
        font-size: var(--lg-button-font-size);
        gap: var(--lg-button-gap);
        border-radius: var(--lg-button-radius);
      }

      /* 禁用 */
      .button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      /* 加载中 */
      .button--loading {
        pointer-events: none;
      }

      .spinner {
        width: 14px;
        height: 14px;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ]

  /** 按钮的变体样式。 */
  @property({ reflect: true }) variant: 'primary' | 'secondary' | 'text' = 'primary'

  /** 按钮的尺寸。 */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** 禁用按钮。 */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** 显示加载动画。 */
  @property({ type: Boolean, reflect: true }) loading = false

  /** 按钮的类型（表单行为）。 */
  @property() type: 'button' | 'submit' | 'reset' = 'button'

  override willUpdate() {
    const size = this._resolvedSize
    if (this.getAttribute('size') !== size) {
      this.setAttribute('size', size)
    }
    const theme = this._resolvedTheme
    if (theme) {
      this.setAttribute('data-theme', theme)
    } else {
      this.removeAttribute('data-theme')
    }
  }

  override render() {
    const isDisabled = this.disabled || this.loading
    const size = this._resolvedSize

    return html`
      <button
        part="base"
        class="button button--${this.variant} button--${size} ${
          this.loading ? 'button--loading' : ''
        }"
        ?disabled=${isDisabled}
        type=${this.type}
        @click=${this._handleClick}
      >
        ${this.loading ? html`<span class="spinner" part="spinner"></span>` : nothing}
        <slot name="prefix" part="prefix"></slot>
        <slot part="label"></slot>
        <slot name="suffix" part="suffix"></slot>
      </button>
    `
  }

  private _handleClick() {
    this.emit('mac-click')
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-button': MacButton
  }
}
