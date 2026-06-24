import { html, css, nothing } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-button
 * @summary A versatile button component.
 *
 * @slot - The button's label.
 * @slot prefix - Content before the label.
 * @slot suffix - Content after the label.
 *
 * @csspart base - The button's base container.
 * @csspart label - The button's label.
 * @csspart prefix - The prefix container.
 * @csspart suffix - The suffix container.
 *
 * @event mac-click - Emitted when the button is clicked.
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

      /* Variants */
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

      /* Sizes */
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

      /* Disabled */
      .button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      /* Loading */
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

  /** The button's variant style. */
  @property({ reflect: true }) variant: 'primary' | 'secondary' | 'text' = 'primary'

  /** The button's size. */
  @property({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md'

  /** Disables the button. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** Shows a loading spinner. */
  @property({ type: Boolean, reflect: true }) loading = false

  /** The button's type (form behavior). */
  @property() type: 'button' | 'submit' | 'reset' = 'button'

  override render() {
    const isDisabled = this.disabled || this.loading

    return html`
      <button
        part="base"
        class="button button--${this.variant} button--${this.size} ${this.loading
          ? 'button--loading'
          : ''}"
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
