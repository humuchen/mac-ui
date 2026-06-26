import { html, css, nothing } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-alert
 * @summary An alert component for displaying warning messages.
 *
 * @slot - The alert's description content.
 * @slot icon - Custom icon content.
 * @slot action - Action content displayed on the right side.
 *
 * @csspart base - The alert's base container.
 * @csspart icon - The icon container.
 * @csspart title - The title text.
 * @csspart content - The description content.
 * @csspart close - The close button.
 *
 * @event mac-close - Emitted when the close button is clicked.
 */
@customElement('mac-alert')
export class MacAlert extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
        font-family: var(--md-font-family);
      }

      .alert {
        display: flex;
        align-items: flex-start;
        gap: var(--md-alert-gap);
        padding: var(--md-alert-padding);
        border-radius: var(--md-alert-radius);
        font-size: var(--md-alert-font-size);
        line-height: 1.5;
        transition: all var(--md-transition-fast);
      }

      .alert--bordered {
        border: 1px solid var(--md-alert-border-color);
      }

      .alert--borderless {
        border-color: transparent;
      }

      /* Types */
      .alert--default {
        background-color: var(--md-alert-default-bg);
        --md-alert-border-color: var(--md-alert-default-border);
        --md-alert-icon-color: var(--md-alert-default-icon);
        --md-alert-title-color: var(--md-alert-default-title);
        --md-alert-content-color: var(--md-alert-default-content);
      }

      .alert--primary {
        background-color: var(--md-alert-primary-bg);
        --md-alert-border-color: var(--md-alert-primary-border);
        --md-alert-icon-color: var(--md-alert-primary-icon);
        --md-alert-title-color: var(--md-alert-primary-title);
        --md-alert-content-color: var(--md-alert-primary-content);
      }

      .alert--success {
        background-color: var(--md-alert-success-bg);
        --md-alert-border-color: var(--md-alert-success-border);
        --md-alert-icon-color: var(--md-alert-success-icon);
        --md-alert-title-color: var(--md-alert-success-title);
        --md-alert-content-color: var(--md-alert-success-content);
      }

      .alert--warning {
        background-color: var(--md-alert-warning-bg);
        --md-alert-border-color: var(--md-alert-warning-border);
        --md-alert-icon-color: var(--md-alert-warning-icon);
        --md-alert-title-color: var(--md-alert-warning-title);
        --md-alert-content-color: var(--md-alert-warning-content);
      }

      .alert--error {
        background-color: var(--md-alert-error-bg);
        --md-alert-border-color: var(--md-alert-error-border);
        --md-alert-icon-color: var(--md-alert-error-icon);
        --md-alert-title-color: var(--md-alert-error-title);
        --md-alert-content-color: var(--md-alert-error-content);
      }

      .alert--info {
        background-color: var(--md-alert-info-bg);
        --md-alert-border-color: var(--md-alert-info-border);
        --md-alert-icon-color: var(--md-alert-info-icon);
        --md-alert-title-color: var(--md-alert-info-title);
        --md-alert-content-color: var(--md-alert-info-content);
      }

      /* Icon */
      .alert__icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--md-alert-icon-size);
        height: var(--md-alert-icon-size);
        margin-top: 1px;
        color: var(--md-alert-icon-color);
      }

      .alert__icon ::slotted(*),
      .alert__icon svg {
        width: var(--md-alert-icon-size);
        height: var(--md-alert-icon-size);
      }

      /* Content area */
      .alert__content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: var(--md-alert-content-gap);
      }

      .alert__title {
        font-weight: 500;
        color: var(--md-alert-title-color);
        font-size: var(--md-alert-title-font-size);
        line-height: 1.4;
      }

      .alert__description {
        color: var(--md-alert-content-color);
        line-height: 1.6;
      }

      /* Action */
      .alert__action {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        margin-left: auto;
        padding-left: var(--md-alert-gap);
      }

      /* Close button */
      .alert__close {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--md-alert-close-size);
        height: var(--md-alert-close-size);
        margin-top: 1px;
        margin-left: auto;
        padding: 0;
        border: none;
        border-radius: var(--md-alert-close-radius);
        background: transparent;
        cursor: pointer;
        color: var(--md-alert-content-color);
        opacity: 0.6;
        transition: all var(--md-transition-fast);
      }

      .alert__close:hover {
        opacity: 1;
        background-color: var(--md-alert-close-hover-bg);
      }

      .alert__close:focus-visible {
        outline: 2px solid var(--md-color-primary);
        outline-offset: 1px;
      }

      .alert__close svg {
        width: var(--md-alert-close-icon-size);
        height: var(--md-alert-close-icon-size);
      }
    `,
  ]

  /** The alert's type style. */
  @property({ reflect: true }) type:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info' = 'default'

  /** The alert's title. */
  @property({ reflect: true }) title = ''

  /** Whether the alert has a border. */
  @property({ type: Boolean, reflect: true }) bordered = true

  /** Whether to show the icon. */
  @property({ type: Boolean, attribute: 'show-icon', reflect: true }) showIcon = true

  /** Whether the alert can be closed. */
  @property({ type: Boolean, reflect: true }) closable = false

  private get _defaultIcon() {
    switch (this.type) {
      case 'success':
        return html`<svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>`
      case 'warning':
        return html`<svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>`
      case 'error':
        return html`<svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>`
      case 'info':
      case 'primary':
        return html`<svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>`
      default:
        return html`<svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>`
    }
  }

  private _handleClose(e: Event) {
    e.stopPropagation()
    this.emit('mac-close')
  }

  override render() {
    const hasIcon = this.showIcon
    const hasTitle = this.title.length > 0
    const hasDefaultSlot = true

    return html`
      <div
        part="base"
        class="alert alert--${this.type} ${this.bordered ? 'alert--bordered' : 'alert--borderless'}"
        role="alert"
      >
        ${hasIcon
          ? html`
              <div class="alert__icon" part="icon">
                <slot name="icon">${this._defaultIcon}</slot>
              </div>
            `
          : nothing}
        <div class="alert__content" part="content">
          ${hasTitle ? html`<div class="alert__title" part="title">${this.title}</div>` : nothing}
          <div class="alert__description">
            <slot></slot>
          </div>
        </div>
        <slot name="action" part="action"></slot>
        ${this.closable
          ? html`
              <button
                part="close"
                class="alert__close"
                type="button"
                aria-label="Close"
                @click=${this._handleClose}
              >
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            `
          : nothing}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-alert': MacAlert
  }
}
