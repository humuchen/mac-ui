import { html, css } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-modal
 * @summary macOS 风格的模态框/窗口，支持标题栏、拖拽和调整大小。
 *
 * @slot - 模态框内容区。
 * @slot titlebar - 自定义标题栏内容（替换默认标题和按钮）。
 * @slot footer - 自定义底部内容。
 *
 * @csspart base - 模态框容器。
 * @csspart titlebar - 标题栏区域。
 * @csspart title - 标题文本。
 * @csspart body - 内容区域。
 * @csspart footer - 底部区域。
 * @csspart resize-handle - 右下角调整大小手柄。
 *
 * @event mac-modal-close - 点击关闭按钮时触发。
 * @event mac-modal-minimize - 点击最小化按钮时触发。
 * @event mac-modal-maximize - 点击最大化/全屏按钮时触发。
 * @event mac-modal-move - 模态框移动时触发。Detail: { x, y }
 * @event mac-modal-resize - 模态框调整大小时触发。Detail: { width, height }
 * @event mac-modal-ok - 点击默认确认按钮时触发。
 * @event mac-modal-cancel - 点击默认取消按钮时触发。
 */
@customElement('mac-modal')
export class MacModal extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
        position: fixed;
        min-width: var(--md-modal-min-width);
        min-height: var(--md-modal-min-height);
        border-radius: var(--md-modal-container-radius);
        overflow: hidden;
        box-shadow: var(--md-modal-container-shadow);
        font-family: var(--md-font-family);
      }

      .modal {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: var(--md-modal-container-bg);
        backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        -webkit-backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        border-radius: var(--md-modal-container-radius);
        overflow: hidden;
      }

      /* ─── 标题栏 ─── */

      .titlebar {
        display: flex;
        align-items: center;
        height: var(--md-modal-header-height);
        padding: var(--md-modal-header-padding);
        background: var(--md-modal-header-bg);
        border-bottom: 0.5px solid var(--md-modal-header-border);
        cursor: default;
        user-select: none;
        -webkit-user-select: none;
        flex-shrink: 0;
      }

      .traffic-lights {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-right: var(--md-spacing-md);
      }

      .traffic-light {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: filter var(--md-transition-fast);
        border: 0.5px solid var(--md-modal-traffic-border);
      }

      .traffic-light:hover {
        filter: brightness(0.85);
      }

      .traffic-light svg {
        width: 8px;
        height: 8px;
        opacity: 0;
        transition: opacity var(--md-transition-fast);
      }

      .titlebar:hover .traffic-light svg {
        opacity: 1;
      }

      .traffic-light--close {
        background: var(--md-modal-traffic-close-bg);
      }

      .traffic-light--minimize {
        background: var(--md-modal-traffic-minimize-bg);
      }

      .traffic-light--maximize {
        background: var(--md-modal-traffic-maximize-bg);
      }

      .title {
        flex: 1;
        text-align: var(--md-modal-title-align);
        font-size: var(--md-modal-title-font-size);
        font-weight: 500;
        color: var(--md-modal-title-color);
        letter-spacing: -0.01em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .titlebar-spacer {
        width: 54px;
        flex-shrink: 0;
      }

      /* ─── 内容区 ─── */

      .body {
        flex: 1;
        overflow: auto;
        padding: var(--md-modal-body-padding);
        color: var(--md-modal-title-color);
        font-size: var(--md-modal-body-font-size);
        line-height: 1.5;
      }

      /* ─── 底部 ─── */

      .footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: var(--md-modal-footer-padding);
        background: var(--md-modal-footer-bg);
        border-top: 0.5px solid var(--md-modal-footer-border);
        font-size: var(--md-modal-footer-font-size);
        color: var(--md-modal-footer-color);
        flex-shrink: 0;
        gap: var(--md-modal-footer-btn-gap);
      }

      .footer-actions {
        display: flex;
        align-items: center;
        gap: var(--md-modal-footer-btn-gap);
      }

      .footer-btn {
        padding: var(--md-modal-footer-btn-padding);
        border-radius: var(--md-modal-footer-btn-radius);
        font-size: var(--md-modal-footer-btn-font-size);
        font-family: inherit;
        cursor: pointer;
        transition: background var(--md-transition-fast);
        border: none;
        outline: none;
      }

      .footer-btn--cancel {
        background: var(--md-modal-footer-cancel-bg);
        border: 0.5px solid var(--md-modal-footer-cancel-border);
        color: var(--md-modal-footer-cancel-color);
      }

      .footer-btn--cancel:hover {
        background: var(--md-modal-footer-cancel-hover-bg);
      }

      .footer-btn--ok {
        background: var(--md-modal-footer-ok-bg);
        color: var(--md-modal-footer-ok-color);
      }

      .footer-btn--ok:hover {
        background: var(--md-modal-footer-ok-hover-bg);
      }

      ::slotted([slot='footer']) {
        display: contents;
      }

      /* ─── 调整大小手柄 ─── */

      .resize-handle {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 16px;
        height: 16px;
        cursor: nwse-resize;
        z-index: 10;
      }

      .resize-handle::after {
        content: '';
        position: absolute;
        right: 4px;
        bottom: 4px;
        width: 8px;
        height: 8px;
        border-right: 2px solid var(--md-modal-resize-border);
        border-bottom: 2px solid var(--md-modal-resize-border);
      }

      /* ─── 边缘调整大小手柄 ─── */

      .resize-n {
        position: absolute;
        top: 0;
        left: 8px;
        right: 8px;
        height: 4px;
        cursor: ns-resize;
      }

      .resize-s {
        position: absolute;
        bottom: 0;
        left: 8px;
        right: 8px;
        height: 4px;
        cursor: ns-resize;
      }

      .resize-e {
        position: absolute;
        top: 8px;
        right: 0;
        bottom: 8px;
        width: 4px;
        cursor: ew-resize;
      }

      .resize-w {
        position: absolute;
        top: 8px;
        left: 0;
        bottom: 8px;
        width: 4px;
        cursor: ew-resize;
      }

      .resize-ne {
        position: absolute;
        top: 0;
        right: 0;
        width: 8px;
        height: 8px;
        cursor: nesw-resize;
      }

      .resize-nw {
        position: absolute;
        top: 0;
        left: 0;
        width: 8px;
        height: 8px;
        cursor: nwse-resize;
      }

      .resize-se {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 16px;
        height: 16px;
        cursor: nwse-resize;
      }

      .resize-sw {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 8px;
        height: 8px;
        cursor: nesw-resize;
      }

      /* ─── 最小化 ─── */

      :host([minimized]) .body,
      :host([minimized]) .footer {
        display: none;
      }

      /* ─── 最大化 ─── */

      :host([maximized]) {
        border-radius: 0;
      }

      :host([maximized]) .modal {
        border-radius: 0;
      }

      :host([maximized]) .resize-handle,
      :host([maximized]) .resize-n,
      :host([maximized]) .resize-s,
      :host([maximized]) .resize-e,
      :host([maximized]) .resize-w,
      :host([maximized]) .resize-ne,
      :host([maximized]) .resize-nw,
      :host([maximized]) .resize-se,
      :host([maximized]) .resize-sw {
        display: none;
      }

      /* ─── 非激活状态 ─── */

      :host(:not([active])) .titlebar {
        background: rgba(255, 255, 255, 0.03);
      }

      :host(:not([active])) .traffic-light {
        background: var(--md-modal-traffic-inactive-bg) !important;
      }

      :host(:not([active])) .traffic-light svg {
        opacity: 0 !important;
      }

      :host(:not([active])) .title {
        color: var(--md-modal-title-inactive-color);
      }

      /* ─── 深色模式 ─── */

      :host([data-theme='dark']) {
        box-shadow: var(--md-modal-container-dark-shadow);
      }

      :host([data-theme='dark']) .modal {
        background: var(--md-modal-container-dark-bg);
      }

      :host([data-theme='dark']) .titlebar {
        background: var(--md-modal-header-dark-bg);
        border-bottom-color: var(--md-modal-header-dark-border);
      }

      :host([data-theme='dark']) .title {
        color: var(--md-modal-title-dark-color);
      }

      :host([data-theme='dark']) .body {
        color: var(--md-modal-body-dark-color);
      }

      :host([data-theme='dark']) .footer {
        background: var(--md-modal-footer-dark-bg);
        border-top-color: var(--md-modal-footer-dark-border);
        color: var(--md-modal-footer-dark-color);
      }

      :host([data-theme='dark']) .footer-btn--cancel {
        background: var(--md-modal-footer-cancel-dark-bg);
        border-color: var(--md-modal-footer-cancel-dark-border);
        color: var(--md-modal-footer-cancel-dark-color);
      }

      :host([data-theme='dark']) .footer-btn--cancel:hover {
        background: var(--md-modal-footer-cancel-dark-hover-bg);
      }

      :host([data-theme='dark']) .footer-btn--ok:hover {
        background: var(--md-modal-footer-ok-dark-hover-bg);
      }

      :host([data-theme='dark']:not([active])) .titlebar {
        background: rgba(255, 255, 255, 0.02);
      }

      :host([data-theme='dark']:not([active])) .title {
        color: var(--md-modal-title-dark-inactive-color);
      }

      :host([data-theme='dark']) .resize-handle::after {
        border-right-color: var(--md-modal-resize-dark-border);
        border-bottom-color: var(--md-modal-resize-dark-border);
      }

      /* ─── 浅色模式（通过 data-theme="light" 手动设置，覆盖系统深色模式） ─── */

      :host([data-theme='light']) .titlebar {
        background: var(--md-modal-header-bg);
        border-bottom-color: var(--md-modal-header-border);
      }

      :host([data-theme='light']) .title {
        color: var(--md-modal-title-color);
      }

      :host([data-theme='light']) .body {
        color: var(--md-modal-title-color);
      }

      :host([data-theme='light']:not([active])) .titlebar {
        background: rgba(255, 255, 255, 0.03);
      }

      :host([data-theme='light']:not([active])) .title {
        color: var(--md-modal-title-inactive-color);
      }

      :host([data-theme='light']) .resize-handle::after {
        border-right-color: var(--md-modal-resize-border);
        border-bottom-color: var(--md-modal-resize-border);
      }

      /* ─── 响应式：移动端全屏化 ─── */
      @media (max-width: 768px) {
        :host {
          /* 占满视口，预留安全区 */
          top: var(--md-safe-area-top, 0px);
          left: var(--md-safe-area-left, 0px);
          right: var(--md-safe-area-right, 0px);
          bottom: var(--md-safe-area-bottom, 0px);
          width: auto;
          max-width: 100%;
          max-height: 100%;
          border-radius: 0;
        }

        :host .modal {
          border-radius: 0;
        }

        /* 触屏无需调整尺寸手柄 */
        .resize-handle,
        .resize-n,
        .resize-s,
        .resize-e,
        .resize-w,
        .resize-ne,
        .resize-nw,
        .resize-se,
        .resize-sw {
          display: none;
        }

        /* 标题栏增高以适配触控 */
        .traffic-lights {
          gap: 10px;
        }

        .traffic-light {
          width: 14px;
          height: 14px;
        }

        .traffic-light svg {
          width: 9px;
          height: 9px;
        }

        .titlebar-spacer {
          width: 64px;
        }

        /* 底部按钮拉宽，便于点击 */
        .footer {
          padding-top: var(--md-spacing-sm);
          padding-bottom: var(--md-spacing-sm);
        }

        .footer-btn {
          min-height: 40px;
        }
      }
    `,
  ]

  /** 模态框标题 */
  @property({ reflect: true }) title = ''

  /** 模态框标题文本对齐方式 */
  @property({ reflect: true }) titleAlign = 'center'

  override willUpdate(): void {
    const theme = this._resolvedTheme
    if (theme) {
      this.setAttribute('data-theme', theme)
    } else {
      this.removeAttribute('data-theme')
    }
    this.style.setProperty('--md-modal-title-align', this.titleAlign)
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has('x') || changed.has('y')) {
      this._updatePosition()
    }
    if (changed.has('width') || changed.has('height')) {
      this._updateSize()
    }
  }

  /** 模态框左侧位置 */
  @property({ type: Number }) x = 100

  /** 模态框顶部位置 */
  @property({ type: Number }) y = 100

  /** 模态框宽度 */
  @property({ type: Number }) width = 480

  /** 模态框高度 */
  @property({ type: Number }) height = 360

  /** 模态框是否激活（聚焦） */
  @property({ type: Boolean, reflect: true }) active = true

  /** 模态框是否可拖拽 */
  @property({ type: Boolean }) draggable = true

  /** 模态框是否可调整大小 */
  @property({ type: Boolean }) resizable = true

  /** 是否显示红绿灯按钮 */
  @property({ type: Boolean }) showButtons = true

  /** 是否显示底部区域 */
  @property({ type: Boolean }) showFooter = true

  /** 调整大小时的最小宽度 */
  @property({ type: Number }) minWidth = 280

  /** 调整大小时的最小高度 */
  @property({ type: Number }) minHeight = 160

  /** 模态框是否最小化 */
  @property({ type: Boolean, reflect: true }) minimized = false

  /** 模态框是否最大化 */
  @property({ type: Boolean, reflect: true }) maximized = false

  // 拖拽状态
  private _isDragging = false
  private _dragStartX = 0
  private _dragStartY = 0
  private _dragOffsetX = 0
  private _dragOffsetY = 0

  // 调整大小状态
  private _isResizing = false
  private _resizeDir = ''
  private _resizeStartX = 0
  private _resizeStartY = 0
  private _resizeStartW = 0
  private _resizeStartH = 0
  private _resizeStartLeft = 0
  private _resizeStartTop = 0

  // 拖拽/调整大小清理
  private _dragCleanup: (() => void) | null = null
  private _resizeCleanup: (() => void) | null = null

  // 最小化/最大化恢复时保存的状态
  private _prevX = 100
  private _prevY = 100
  private _prevWidth = 480
  private _prevHeight = 360

  private _onWindowResize = () => {
    if (this.maximized) {
      this.width = window.innerWidth
      this.height = window.innerHeight
    }
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this._updatePosition()
    this._updateSize()
    window.addEventListener('resize', this._onWindowResize)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this._dragCleanup?.()
    this._resizeCleanup?.()
    window.removeEventListener('resize', this._onWindowResize)
  }

  private _updatePosition(): void {
    this.style.left = `${this.x}px`
    this.style.top = `${this.y}px`
  }

  private _updateSize(): void {
    this.style.width = `${this.width}px`
    this.style.height = `${this.height}px`
  }

  // ─── 拖拽 ───

  private _onTitleBarMouseDown(e: MouseEvent): void {
    if (!this.draggable || e.button !== 0 || this.maximized) return
    // 忽略红绿灯按钮上的点击
    if ((e.target as HTMLElement).closest('.traffic-light')) return

    e.preventDefault()
    this._isDragging = true
    this._dragStartX = e.clientX
    this._dragStartY = e.clientY
    this._dragOffsetX = this.x
    this._dragOffsetY = this.y

    this.emit('mac-modal-focus')

    const onMove = (ev: MouseEvent) => {
      if (!this._isDragging) return
      const dx = ev.clientX - this._dragStartX
      const dy = ev.clientY - this._dragStartY
      this.x = this._dragOffsetX + dx
      this.y = this._dragOffsetY + dy
      this.emit('mac-modal-move', { detail: { x: this.x, y: this.y } })
    }

    const onUp = () => {
      this._isDragging = false
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      this._dragCleanup = null
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    this._dragCleanup = onUp
  }

  // ─── 调整大小 ───

  private _onResizeMouseDown(dir: string, e: MouseEvent): void {
    if (!this.resizable || e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()

    this._isResizing = true
    this._resizeDir = dir
    this._resizeStartX = e.clientX
    this._resizeStartY = e.clientY
    this._resizeStartW = this.width
    this._resizeStartH = this.height
    this._resizeStartLeft = this.x
    this._resizeStartTop = this.y

    const onMove = (ev: MouseEvent) => {
      if (!this._isResizing) return
      const dx = ev.clientX - this._resizeStartX
      const dy = ev.clientY - this._resizeStartY
      const dir = this._resizeDir

      let newW = this._resizeStartW
      let newH = this._resizeStartH
      let newX = this._resizeStartLeft
      let newY = this._resizeStartTop

      // 水平方向
      if (dir.includes('e')) {
        newW = Math.max(this.minWidth, this._resizeStartW + dx)
      }
      if (dir.includes('w')) {
        const proposedW = this._resizeStartW - dx
        if (proposedW >= this.minWidth) {
          newW = proposedW
          newX = this._resizeStartLeft + dx
        } else {
          newW = this.minWidth
          newX = this._resizeStartLeft + (this._resizeStartW - this.minWidth)
        }
      }

      // 垂直方向
      if (dir.includes('s')) {
        newH = Math.max(this.minHeight, this._resizeStartH + dy)
      }
      if (dir.includes('n')) {
        const proposedH = this._resizeStartH - dy
        if (proposedH >= this.minHeight) {
          newH = proposedH
          newY = this._resizeStartTop + dy
        } else {
          newH = this.minHeight
          newY = this._resizeStartTop + (this._resizeStartH - this.minHeight)
        }
      }

      this.width = newW
      this.height = newH
      this.x = newX
      this.y = newY
      this.emit('mac-modal-resize', { detail: { width: this.width, height: this.height } })
    }

    const onUp = () => {
      this._isResizing = false
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      this._resizeCleanup = null
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    this._resizeCleanup = onUp
  }

  // ─── 红绿灯按钮 ───

  private _onClose(): void {
    this.emit('mac-modal-close')
  }

  private _onMinimize(): void {
    if (this.minimized) {
      this.minimized = false
      this.width = this._prevWidth
      this.height = this._prevHeight
      this.x = this._prevX
      this.y = this._prevY
    } else {
      if (!this.maximized) {
        this._prevWidth = this.width
        this._prevHeight = this.height
        this._prevX = this.x
        this._prevY = this.y
      }
      this.maximized = false
      this.minimized = true
      this.height = 38
    }
    this.emit('mac-modal-minimize')
  }

  private _onMaximize(): void {
    if (this.maximized) {
      this.maximized = false
      this.width = this._prevWidth
      this.height = this._prevHeight
      this.x = this._prevX
      this.y = this._prevY
    } else {
      if (!this.minimized) {
        this._prevWidth = this.width
        this._prevHeight = this.height
        this._prevX = this.x
        this._prevY = this.y
      }
      this.minimized = false
      this.maximized = true
      this.x = 0
      this.y = 0
      this.width = window.innerWidth
      this.height = window.innerHeight
    }
    this.emit('mac-modal-maximize')
  }

  private _onCancel(): void {
    this.emit('mac-modal-cancel')
  }

  private _onOk(): void {
    this.emit('mac-modal-ok')
  }

  // ─── 渲染 ───

  override render() {
    return html`
      <div class="modal" part="base">
        <div class="titlebar" part="titlebar" @mousedown=${this._onTitleBarMouseDown}>
          ${
            this.showButtons
              ? html`
                  <div class="traffic-lights">
                    <div
                      class="traffic-light traffic-light--close"
                      @click=${this._onClose}
                      title="关闭"
                    >
                      <svg viewBox="0 0 12 12">
                        <line
                          x1="3"
                          y1="3"
                          x2="9"
                          y2="9"
                          stroke="var(--md-modal-traffic-close-stroke)"
                          stroke-width="1.2"
                        />
                        <line
                          x1="9"
                          y1="3"
                          x2="3"
                          y2="9"
                          stroke="var(--md-modal-traffic-close-stroke)"
                          stroke-width="1.2"
                        />
                      </svg>
                    </div>
                    <div
                      class="traffic-light traffic-light--minimize"
                      @click=${this._onMinimize}
                      title=${this.minimized ? '恢复' : '最小化'}
                    >
                      <svg viewBox="0 0 12 12">
                        <line
                          x1="3"
                          y1="6"
                          x2="9"
                          y2="6"
                          stroke="var(--md-modal-traffic-minimize-stroke)"
                          stroke-width="1.2"
                        />
                      </svg>
                    </div>
                    <div
                      class="traffic-light traffic-light--maximize"
                      @click=${this._onMaximize}
                      title=${this.maximized ? '恢复' : '全屏'}
                    >
                      ${
                        this.maximized
                          ? html`
                              <svg viewBox="0 0 12 12">
                                <polyline
                                  points="7.5,2 10,2 10,4.5"
                                  fill="none"
                                  stroke="var(--md-modal-traffic-maximize-stroke)"
                                  stroke-width="1.2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <polyline
                                  points="4.5,10 2,10 2,7.5"
                                  fill="none"
                                  stroke="var(--md-modal-traffic-maximize-stroke)"
                                  stroke-width="1.2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            `
                          : html`
                              <svg viewBox="0 0 12 12">
                                <polyline
                                  points="4.5,2 2,2 2,4.5"
                                  fill="none"
                                  stroke="var(--md-modal-traffic-maximize-stroke)"
                                  stroke-width="1.2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <polyline
                                  points="7.5,10 10,10 10,7.5"
                                  fill="none"
                                  stroke="var(--md-modal-traffic-maximize-stroke)"
                                  stroke-width="1.2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            `
                      }
                    </div>
                  </div>
                `
              : ''
          }
          <div class="title" part="title">${this.title}</div>
          ${this.showButtons ? html`<div class="titlebar-spacer"></div>` : ''}
        </div>

        <div class="body" part="body">
          <slot></slot>
        </div>

        ${
          this.showFooter
            ? html`
                <div class="footer" part="footer">
                  <slot name="footer">
                    <div class="footer-actions">
                      <button class="footer-btn footer-btn--cancel" @click=${this._onCancel}>
                        取消
                      </button>
                      <button class="footer-btn footer-btn--ok" @click=${this._onOk}>确认</button>
                    </div>
                  </slot>
                </div>
              `
            : ''
        }
        ${
          this.resizable
            ? html`
                <div
                  class="resize-n"
                  @mousedown=${(e: MouseEvent) => this._onResizeMouseDown('n', e)}
                ></div>
                <div
                  class="resize-s"
                  @mousedown=${(e: MouseEvent) => this._onResizeMouseDown('s', e)}
                ></div>
                <div
                  class="resize-e"
                  @mousedown=${(e: MouseEvent) => this._onResizeMouseDown('e', e)}
                ></div>
                <div
                  class="resize-w"
                  @mousedown=${(e: MouseEvent) => this._onResizeMouseDown('w', e)}
                ></div>
                <div
                  class="resize-ne"
                  @mousedown=${(e: MouseEvent) => this._onResizeMouseDown('ne', e)}
                ></div>
                <div
                  class="resize-nw"
                  @mousedown=${(e: MouseEvent) => this._onResizeMouseDown('nw', e)}
                ></div>
                <div
                  class="resize-se"
                  @mousedown=${(e: MouseEvent) => this._onResizeMouseDown('se', e)}
                ></div>
                <div
                  class="resize-sw"
                  @mousedown=${(e: MouseEvent) => this._onResizeMouseDown('sw', e)}
                ></div>
                <div
                  class="resize-handle"
                  part="resize-handle"
                  @mousedown=${(e: MouseEvent) => this._onResizeMouseDown('se', e)}
                ></div>
              `
            : ''
        }
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-modal': MacModal
  }
}
