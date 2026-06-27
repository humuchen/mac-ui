import { html, css, nothing } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-tag
 * @summary A tag component for labeling and categorization.
 *
 * @slot - The tag's label.
 * @slot prefix - Content before the label.
 * @slot suffix - Content after the label.
 *
 * @csspart base - The tag's base container.
 * @csspart label - The tag's label.
 * @csspart prefix - The prefix container.
 * @csspart suffix - The suffix container.
 * @csspart close - The close button.
 *
 * @event mac-close - Emitted when the close button is clicked.
 */
@customElement('mac-tag')
export class MacTag extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: inline-block;
      }

      .tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--md-tag-gap);
        padding: var(--md-tag-padding-vertical) var(--md-tag-padding-horizontal);
        font-size: var(--md-tag-font-size);
        font-family: inherit;
        line-height: 1.5;
        border-radius: var(--md-tag-radius);
        border: 1px solid transparent;
        transition: all var(--md-transition-fast);
        user-select: none;
        white-space: nowrap;
        cursor: default;
      }

      .tag--round {
        border-radius: var(--md-tag-round-radius);
      }

      .tag--closable {
        padding-right: var(--md-tag-closable-padding-right);
      }

      /* Types */
      .tag--default {
        background-color: var(--md-tag-default-bg);
        color: var(--md-tag-default-text);
        border-color: var(--md-tag-default-border);
      }

      .tag--default .close:hover {
        background-color: var(--md-tag-default-close-hover-bg);
        color: var(--md-tag-default-close-hover-color);
      }

      .tag--primary {
        background-color: var(--md-tag-primary-bg);
        color: var(--md-tag-primary-text);
        border-color: var(--md-tag-primary-border);
      }

      .tag--primary .close:hover {
        background-color: var(--md-tag-primary-close-hover-bg);
        color: var(--md-tag-primary-close-hover-color);
      }

      .tag--success {
        background-color: var(--md-tag-success-bg);
        color: var(--md-tag-success-text);
        border-color: var(--md-tag-success-border);
      }

      .tag--success .close:hover {
        background-color: var(--md-tag-success-close-hover-bg);
        color: var(--md-tag-success-close-hover-color);
      }

      .tag--warning {
        background-color: var(--md-tag-warning-bg);
        color: var(--md-tag-warning-text);
        border-color: var(--md-tag-warning-border);
      }

      .tag--warning .close:hover {
        background-color: var(--md-tag-warning-close-hover-bg);
        color: var(--md-tag-warning-close-hover-color);
      }

      .tag--danger {
        background-color: var(--md-tag-danger-bg);
        color: var(--md-tag-danger-text);
        border-color: var(--md-tag-danger-border);
      }

      .tag--danger .close:hover {
        background-color: var(--md-tag-danger-close-hover-bg);
        color: var(--md-tag-danger-close-hover-color);
      }

      .tag--info {
        background-color: var(--md-tag-info-bg);
        color: var(--md-tag-info-text);
        border-color: var(--md-tag-info-border);
      }

      .tag--info .close:hover {
        background-color: var(--md-tag-info-close-hover-bg);
        color: var(--md-tag-info-close-hover-color);
      }

      /* Borderless */
      .tag--borderless {
        border-color: transparent;
      }

      /* Sizes */
      .tag--sm {
        padding: var(--sm-tag-padding-vertical) var(--sm-tag-padding-horizontal);
        font-size: var(--sm-tag-font-size);
        gap: var(--sm-tag-gap);
        border-radius: var(--sm-tag-radius);
      }

      .tag--sm.tag--round {
        border-radius: var(--sm-tag-round-radius);
      }

      .tag--sm.tag--closable {
        padding-right: var(--sm-tag-closable-padding-right);
      }

      .tag--lg {
        padding: var(--lg-tag-padding-vertical) var(--lg-tag-padding-horizontal);
        font-size: var(--lg-tag-font-size);
        gap: var(--lg-tag-gap);
        border-radius: var(--lg-tag-radius);
      }

      .tag--lg.tag--round {
        border-radius: var(--lg-tag-round-radius);
      }

      .tag--lg.tag--closable {
        padding-right: var(--lg-tag-closable-padding-right);
      }

      /* Disabled */
      .tag--disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      /* Close button */
      .close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--md-tag-close-size);
        height: var(--md-tag-close-size);
        margin-left: 2px;
        padding: 0;
        border: none;
        border-radius: 50%;
        background: transparent;
        cursor: pointer;
        font-size: inherit;
        line-height: 1;
        color: inherit;
        opacity: 0.7;
        transition: all var(--md-transition-fast);
      }

      .close:hover {
        opacity: 1;
      }

      .close:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 1px;
      }

      .tag--sm .close {
        width: var(--sm-tag-close-size);
        height: var(--sm-tag-close-size);
      }

      .tag--lg .close {
        width: var(--lg-tag-close-size);
        height: var(--lg-tag-close-size);
      }
    `,
  ]

  /** The tag's type style. */
  @property({ reflect: true }) type:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info' = 'default'

  /** The tag's size. */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** Whether the tag can be closed. */
  @property({ type: Boolean, reflect: true }) closable = false

  /** Whether the tag has rounded corners. */
  @property({ type: Boolean, reflect: true }) round = false

  /** Whether the tag has a border. */
  @property({ type: Boolean, reflect: true }) bordered = true

  /** Disables the tag. */
  @property({ type: Boolean, reflect: true }) disabled = false

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
    const size = this._resolvedSize

    return html`
      <span
        part="base"
        class="tag tag--${this.type} tag--${size} ${this.round ? 'tag--round' : ''} ${this.closable
          ? 'tag--closable'
          : ''} ${this.disabled ? 'tag--disabled' : ''} ${this.bordered ? '' : 'tag--borderless'}"
      >
        <slot name="prefix" part="prefix"></slot>
        <slot part="label"></slot>
        <slot name="suffix" part="suffix"></slot>
        ${this.closable
          ? html`
              <button
                part="close"
                class="close"
                type="button"
                aria-label="Close"
                @click=${this._handleClose}
              >
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
      </span>
    `
  }

  private _handleClose(e: Event) {
    e.stopPropagation()
    this.emit('mac-close')
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-tag': MacTag
  }
}
