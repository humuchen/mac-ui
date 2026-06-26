import { html, css } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

export interface ConfirmOptions {
  title?: string
  content?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  showIcon?: boolean
  width?: string | number
  maskClosable?: boolean
  theme?: 'light' | 'dark'
  titleAlign?: 'left' | 'center' | 'right'
  showDivider?: boolean
  onOk?: () => void
  onCancel?: () => void
}

/**
 * @tag mac-confirm
 * @summary A macOS-style confirmation dialog with mask and centered content.
 *
 * @slot - The dialog body content (replaces the content property).
 * @slot footer - Custom footer content (replaces default buttons).
 *
 * @csspart mask - The mask/overlay element.
 * @csspart container - The dialog container.
 * @csspart title - The title text.
 * @csspart body - The body content area.
 * @csspart footer - The footer area.
 *
 * @event mac-confirm-open - Emitted when the dialog opens.
 * @event mac-confirm-close - Emitted when the dialog closes.
 * @event mac-confirm-ok - Emitted when the OK button is clicked.
 * @event mac-confirm-cancel - Emitted when the Cancel button is clicked.
 */
@customElement('mac-confirm')
export class MacConfirm extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 99999;
        align-items: center;
        justify-content: center;
        font-family: var(--md-font-family);
      }

      :host([visible]) {
        display: flex;
      }

      .mask {
        position: absolute;
        inset: 0;
        background: var(--md-confirm-mask-bg);
        opacity: 0;
        transition: opacity var(--md-transition-normal);
      }

      :host([visible]) .mask {
        opacity: 1;
      }

      .container {
        position: relative;
        display: flex;
        flex-direction: column;
        width: var(--md-confirm-width);
        max-width: calc(100vw - 32px);
        max-height: calc(100vh - 32px);
        background: var(--md-confirm-bg);
        backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        -webkit-backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        border-radius: var(--md-confirm-radius);
        box-shadow: var(--md-confirm-shadow);
        border: 0.5px solid var(--md-confirm-border);
        overflow: hidden;
        transform: scale(0.92);
        opacity: 0;
        transition:
          transform var(--md-transition-normal),
          opacity var(--md-transition-normal);
      }

      :host([visible]) .container {
        transform: scale(1);
        opacity: 1;
      }

      /* Title */
      .titlebar {
        display: flex;
        align-items: center;
        padding: var(--md-confirm-title-padding);
        border-bottom: 0.5px solid transparent;
        min-height: 44px;
        gap: 8px;
      }

      .titlebar--divided {
        border-bottom-color: var(--md-confirm-title-border);
      }

      .titlebar--left {
        justify-content: flex-start;
      }

      .titlebar--center {
        justify-content: center;
      }

      .titlebar--right {
        justify-content: flex-end;
      }

      .titlebar-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        color: var(--md-confirm-icon-color);
      }

      .titlebar-icon svg {
        width: 20px;
        height: 20px;
      }

      .titlebar-icon--danger {
        color: var(--md-color-danger);
      }

      .title {
        font-size: var(--md-confirm-title-font-size);
        font-weight: 500;
        color: var(--md-confirm-title-color);
        line-height: 1.4;
      }

      /* Body */
      .body {
        flex: 1;
        overflow: auto;
        padding: var(--md-confirm-body-padding);
        color: var(--md-confirm-body-color);
        font-size: var(--md-confirm-body-font-size);
        line-height: 1.6;
      }

      /* Footer */
      .footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: var(--md-confirm-footer-padding);
        border-top: 0.5px solid transparent;
        gap: var(--md-confirm-btn-gap);
        flex-shrink: 0;
      }

      .footer--divided {
        border-top-color: var(--md-confirm-footer-border);
      }

      .footer-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: var(--md-confirm-btn-padding);
        border-radius: var(--md-confirm-btn-radius);
        font-size: var(--md-confirm-btn-font-size);
        font-family: inherit;
        cursor: pointer;
        transition:
          background var(--md-transition-fast),
          border-color var(--md-transition-fast);
        border: 0.5px solid transparent;
        outline: none;
        white-space: nowrap;
        line-height: 1.5;
      }

      .footer-btn--cancel {
        background: var(--md-confirm-cancel-bg);
        border-color: var(--md-confirm-cancel-border);
        color: var(--md-confirm-cancel-color);
      }

      .footer-btn--cancel:hover {
        background: var(--md-confirm-cancel-hover-bg);
      }

      .footer-btn--ok {
        background: var(--md-confirm-ok-bg);
        color: var(--md-confirm-ok-color);
        border-color: transparent;
      }

      .footer-btn--ok:hover {
        background: var(--md-confirm-ok-hover-bg);
      }

      .footer-btn--danger {
        background: var(--md-confirm-danger-bg);
        color: var(--md-confirm-danger-color);
      }

      .footer-btn--danger:hover {
        background: var(--md-confirm-danger-hover-bg);
      }

      /* Dark mode */
      :host([data-theme='dark']) .container {
        background: var(--md-confirm-dark-bg);
        box-shadow: var(--md-confirm-dark-shadow);
        border-color: var(--md-confirm-dark-border);
      }

      :host([data-theme='dark']) .title {
        color: var(--md-confirm-dark-title-color);
      }

      :host([data-theme='dark']) .body {
        color: var(--md-confirm-dark-body-color);
      }

      :host([data-theme='dark']) .titlebar--divided {
        border-bottom-color: var(--md-confirm-dark-title-border);
      }

      :host([data-theme='dark']) .footer--divided {
        border-top-color: var(--md-confirm-dark-footer-border);
      }

      :host([data-theme='dark']) .footer-btn--cancel {
        background: var(--md-confirm-dark-cancel-bg);
        border-color: var(--md-confirm-dark-cancel-border);
        color: var(--md-confirm-dark-cancel-color);
      }

      :host([data-theme='dark']) .footer-btn--cancel:hover {
        background: var(--md-confirm-dark-cancel-hover-bg);
      }

      :host([data-theme='dark']) .footer-btn--ok:hover {
        background: var(--md-confirm-dark-ok-hover-bg);
      }
    `,
  ]

  /** Dialog title text */
  @property({ reflect: true }) title = ''

  /** Dialog title alignment: left | center | right */
  @property({ reflect: true }) titleAlign: 'left' | 'center' | 'right' = 'left'

  /** Dialog body content text */
  @property() content = ''

  /** Confirm button text */
  @property({ attribute: 'confirm-text' }) confirmText = '确认'

  /** Cancel button text */
  @property({ attribute: 'cancel-text' }) cancelText = '取消'

  /** Whether the confirm button uses danger style */
  @property({ type: Boolean }) danger = false

  /** Whether to show the icon */
  @property({ type: Boolean, attribute: 'show-icon' }) showIcon = true

  /** Dialog width, e.g. '420px' or 420 */
  @property() width: string | number = '420px'

  /** Whether the dialog is visible */
  @property({ type: Boolean, reflect: true }) visible = false

  /** Whether clicking the mask closes the dialog */
  @property({ type: Boolean, attribute: 'mask-closable' }) maskClosable = true

  /** Whether to show the divider between title/body and body/footer */
  @property({ type: Boolean, attribute: 'show-divider', reflect: true }) showDivider = true

  override willUpdate(): void {
    const theme = this._resolvedTheme
    if (theme) {
      this.setAttribute('data-theme', theme)
    } else {
      this.removeAttribute('data-theme')
    }
  }

  override connectedCallback(): void {
    super.connectedCallback()
    document.addEventListener('keydown', this._handleKeyDown)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    document.removeEventListener('keydown', this._handleKeyDown)
  }

  private _handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this.visible) {
      e.preventDefault()
      this._cancel()
    }
  }

  private _onMaskClick(): void {
    if (this.maskClosable) {
      this._cancel()
    }
  }

  private _onOk(): void {
    this.emit('mac-confirm-ok')
    this.close()
  }

  private _onCancel(): void {
    this._cancel()
  }

  private _cancel(): void {
    this.emit('mac-confirm-cancel')
    this.close()
  }

  /** Open the dialog */
  open(): void {
    if (this.visible) return
    this.visible = true
    this.emit('mac-confirm-open')
  }

  /** Close the dialog */
  close(): void {
    if (!this.visible) return
    this.visible = false
    this.emit('mac-confirm-close')
  }

  private _resolvedWidth(): string {
    const w = this.width
    if (typeof w === 'number') return `${w}px`
    return w
  }

  // ─── Static imperative API ───

  private static _activeInstance: MacConfirm | null = null

  /**
   * Open a confirmation dialog imperatively.
   * Returns a promise that resolves to true (ok) or false (cancel).
   */
  static open(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
      MacConfirm.close()

      const el = document.createElement('mac-confirm') as MacConfirm
      if (options.title !== undefined) el.title = options.title
      if (options.content !== undefined) el.content = options.content
      if (options.confirmText !== undefined) el.confirmText = options.confirmText
      if (options.cancelText !== undefined) el.cancelText = options.cancelText
      if (options.danger !== undefined) el.danger = options.danger
      if (options.showIcon !== undefined) el.showIcon = options.showIcon
      if (options.width !== undefined) el.width = options.width
      if (options.maskClosable !== undefined) el.maskClosable = options.maskClosable
      if (options.theme !== undefined) el.theme = options.theme
      if (options.titleAlign !== undefined) el.titleAlign = options.titleAlign
      if (options.showDivider !== undefined) el.showDivider = options.showDivider

      const onOk = () => {
        cleanup()
        options.onOk?.()
        resolve(true)
      }
      const onCancel = () => {
        cleanup()
        options.onCancel?.()
        resolve(false)
      }
      const onClose = () => {
        // If closed without explicit ok/cancel (e.g. mask click), treat as cancel
        setTimeout(() => {
          if (MacConfirm._activeInstance === el) {
            cleanup()
            options.onCancel?.()
            resolve(false)
          }
        }, 0)
      }

      const cleanup = () => {
        el.removeEventListener('mac-confirm-ok', onOk)
        el.removeEventListener('mac-confirm-cancel', onCancel)
        el.removeEventListener('mac-confirm-close', onClose)
        if (el.parentNode) {
          el.parentNode.removeChild(el)
        }
        if (MacConfirm._activeInstance === el) {
          MacConfirm._activeInstance = null
        }
      }

      el.addEventListener('mac-confirm-ok', onOk)
      el.addEventListener('mac-confirm-cancel', onCancel)
      el.addEventListener('mac-confirm-close', onClose)

      document.body.appendChild(el)
      MacConfirm._activeInstance = el
      el.open()
    })
  }

  /** Close the currently active imperative dialog */
  static close(): void {
    if (MacConfirm._activeInstance) {
      MacConfirm._activeInstance.close()
      if (MacConfirm._activeInstance.parentNode) {
        MacConfirm._activeInstance.parentNode.removeChild(MacConfirm._activeInstance)
      }
      MacConfirm._activeInstance = null
    }
  }

  override render() {
    const width = this._resolvedWidth()

    return html`
      <div class="mask" part="mask" @click=${this._onMaskClick}></div>
      <div class="container" part="container" style="--md-confirm-width: ${width}">
        ${this.title
          ? html`
              <div
                class="titlebar titlebar--${this.titleAlign} ${this.showDivider
                  ? 'titlebar--divided'
                  : ''}"
                part="titlebar"
              >
                ${this.showIcon
                  ? html`
                      <div
                        class="titlebar-icon ${this.danger ? 'titlebar-icon--danger' : ''}"
                        part="titlebar-icon"
                      >
                        ${this.danger
                          ? html`<svg viewBox="0 0 24 24" fill="currentColor">
                              <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                              />
                            </svg>`
                          : html`<svg viewBox="0 0 24 24" fill="currentColor">
                              <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                              />
                            </svg>`}
                      </div>
                    `
                  : ''}
                <div class="title" part="title">${this.title}</div>
              </div>
            `
          : ''}
        <div class="body" part="body">
          <slot>
            ${this.content ? html`<div class="content" part="content">${this.content}</div>` : ''}
          </slot>
        </div>
        <div class="footer ${this.showDivider ? 'footer--divided' : ''}" part="footer">
          <slot name="footer">
            <button class="footer-btn footer-btn--cancel" @click=${this._onCancel}>
              ${this.cancelText}
            </button>
            <button
              class="footer-btn footer-btn--ok ${this.danger ? 'footer-btn--danger' : ''}"
              @click=${this._onOk}
            >
              ${this.confirmText}
            </button>
          </slot>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-confirm': MacConfirm
  }
}
