import { html, css } from 'lit'
import { property, customElement } from 'lit/decorators.js'
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
 * @summary 带遮罩和居中内容的 macOS 风格确认对话框。
 *
 * @slot - 对话框主体内容（替换 content 属性）。
 * @slot footer - 自定义底部内容（替换默认按钮）。
 *
 * @csspart mask - 遮罩/覆盖层元素。
 * @csspart container - 对话框容器。
 * @csspart title - 标题文本。
 * @csspart body - 主体内容区域。
 * @csspart footer - 底部区域。
 *
 * @event mac-confirm-open - 对话框打开时触发。
 * @event mac-confirm-close - 对话框关闭时触发。
 * @event mac-confirm-ok - 点击确定按钮时触发。
 * @event mac-confirm-cancel - 点击取消按钮时触发。
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

      /* 标题 */
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

      /* 主体 */
      .body {
        flex: 1;
        overflow: auto;
        padding: var(--md-confirm-body-padding);
        color: var(--md-confirm-body-color);
        font-size: var(--md-confirm-body-font-size);
        line-height: 1.6;
      }

      /* 底部 */
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

      /* 暗黑模式 */
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

  /** 对话框标题文本 */
  @property({ reflect: true }) title = ''

  /** 对话框标题对齐方式：left | center | right */
  @property({ reflect: true }) titleAlign: 'left' | 'center' | 'right' = 'left'

  /** 对话框主体内容文本 */
  @property() content = ''

  /** 确认按钮文本 */
  @property({ attribute: 'confirm-text' }) confirmText = '确认'

  /** 取消按钮文本 */
  @property({ attribute: 'cancel-text' }) cancelText = '取消'

  /** 确认按钮是否使用危险样式 */
  @property({ type: Boolean }) danger = false

  /** 是否显示图标 */
  @property({ type: Boolean, attribute: 'show-icon' }) showIcon = true

  /** 对话框宽度，例如 '420px' 或 420 */
  @property() width: string | number = '420px'

  /** 对话框是否可见 */
  @property({ type: Boolean, reflect: true }) visible = false

  /** 点击遮罩是否关闭对话框 */
  @property({ type: Boolean, attribute: 'mask-closable' }) maskClosable = true

  /** 是否在标题/主体和主体/底部之间显示分隔线 */
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

  /** 打开对话框 */
  open(): void {
    if (this.visible) return
    this.visible = true
    this.emit('mac-confirm-open')
  }

  /** 关闭对话框 */
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

  // ─── 静态命令式 API ───

  private static _activeInstance: MacConfirm | null = null

  /**
   * 以命令式方式打开确认对话框。
   * 返回一个 Promise，解析为 true（确定）或 false（取消）。
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
        // 如果未明确点击确定/取消而关闭（例如点击遮罩），则视为取消
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

  /** 关闭当前活动的命令式对话框 */
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
        ${
          this.title
            ? html`
                <div
                  class="titlebar titlebar--${this.titleAlign} ${
                    this.showDivider ? 'titlebar--divided' : ''
                  }"
                  part="titlebar"
                >
                  ${
                    this.showIcon
                      ? html`
                          <div
                            class="titlebar-icon ${this.danger ? 'titlebar-icon--danger' : ''}"
                            part="titlebar-icon"
                          >
                            ${
                            this.danger
                              ? html`<svg viewBox="0 0 24 24" fill="currentColor">
                                  <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                                  />
                                </svg>`
                              : html`<svg viewBox="0 0 24 24" fill="currentColor">
                                  <path
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                                  />
                                </svg>`
                          }
                          </div>
                        `
                      : ''
                  }
                  <div class="title" part="title">${this.title}</div>
                </div>
              `
            : ''
        }
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
