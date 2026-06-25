import { html, css } from 'lit'
import { property, customElement, query } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-dialog
 * @summary A macOS-style dialog/window with title bar, drag, and resize support.
 *
 * @slot - The dialog body content.
 * @slot titlebar - Custom title bar content (replaces default title + buttons).
 *
 * @csspart base - The dialog container.
 * @csspart titlebar - The title bar area.
 * @csspart title - The title text.
 * @csspart body - The body content area.
 * @csspart resize-handle - The resize handle at bottom-right.
 *
 * @event mac-dialog-close - Emitted when the close button is clicked.
 * @event mac-dialog-minimize - Emitted when the minimize button is clicked.
 * @event mac-dialog-maximize - Emitted when the maximize/fullscreen button is clicked.
 * @event mac-dialog-move - Emitted when the dialog is moved. Detail: { x, y }
 * @event mac-dialog-resize - Emitted when the dialog is resized. Detail: { width, height }
 */
@customElement('mac-dialog')
export class MacDialog extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
        position: fixed;
        min-width: var(--md-dialog-min-width);
        min-height: var(--md-dialog-min-height);
        border-radius: var(--md-dialog-container-radius);
        overflow: hidden;
        box-shadow: var(--md-dialog-container-shadow);
        font-family: var(--md-font-family);
      }

      .dialog {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: var(--md-dialog-container-bg);
        backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        -webkit-backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        border-radius: var(--md-dialog-container-radius);
        overflow: hidden;
      }

      /* ─── Title Bar ─── */

      .titlebar {
        display: flex;
        align-items: center;
        height: var(--md-dialog-header-height);
        padding: var(--md-dialog-header-padding);
        background: var(--md-dialog-header-bg);
        border-bottom: 0.5px solid var(--md-dialog-header-border);
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
        border: 0.5px solid var(--md-dialog-traffic-border);
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
        background: var(--md-dialog-traffic-close-bg);
      }

      .traffic-light--minimize {
        background: var(--md-dialog-traffic-minimize-bg);
      }

      .traffic-light--maximize {
        background: var(--md-dialog-traffic-maximize-bg);
      }

      .title {
        flex: 1;
        text-align: center;
        font-size: var(--md-dialog-title-font-size);
        font-weight: 500;
        color: var(--md-dialog-title-color);
        letter-spacing: -0.01em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .titlebar-spacer {
        width: 54px;
        flex-shrink: 0;
      }

      /* ─── Body ─── */

      .body {
        flex: 1;
        overflow: auto;
        padding: var(--md-dialog-body-padding);
        color: var(--md-dialog-title-color);
        font-size: var(--md-dialog-body-font-size);
        line-height: 1.5;
      }

      /* ─── Resize Handle ─── */

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
        border-right: 2px solid var(--md-dialog-resize-border);
        border-bottom: 2px solid var(--md-dialog-resize-border);
      }

      /* ─── Edge Resize Handles ─── */

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

      /* ─── Inactive ─── */

      :host(:not([active])) .titlebar {
        background: rgba(255, 255, 255, 0.03);
      }

      :host(:not([active])) .traffic-light {
        background: var(--md-dialog-traffic-inactive-bg) !important;
      }

      :host(:not([active])) .traffic-light svg {
        opacity: 0 !important;
      }

      :host(:not([active])) .title {
        color: var(--md-dialog-title-inactive-color);
      }

      /* ─── Dark Mode (auto via OS) ─── */

      @media (prefers-color-scheme: dark) {
        :host(:not([data-theme='light'])) {
          box-shadow: var(--md-dialog-container-dark-shadow);
        }

        :host(:not([data-theme='light'])) .dialog {
          background: var(--md-dialog-container-dark-bg);
        }

        :host(:not([data-theme='light'])) .titlebar {
          background: var(--md-dialog-header-dark-bg);
          border-bottom-color: var(--md-dialog-header-dark-border);
        }

        :host(:not([data-theme='light'])) .title {
          color: var(--md-dialog-title-dark-color);
        }

        :host(:not([data-theme='light'])) .body {
          color: var(--md-dialog-body-dark-color);
        }

        :host(:not([data-theme='light']):not([active])) .titlebar {
          background: rgba(255, 255, 255, 0.02);
        }

        :host(:not([data-theme='light']):not([active])) .title {
          color: var(--md-dialog-title-dark-inactive-color);
        }

        :host(:not([data-theme='light'])) .resize-handle::after {
          border-right-color: var(--md-dialog-resize-dark-border);
          border-bottom-color: var(--md-dialog-resize-dark-border);
        }
      }

      /* ─── Dark Mode (manual via theme/data-theme="dark") ─── */

      :host([theme='dark']),
      :host([data-theme='dark']) {
        box-shadow: var(--md-dialog-container-dark-shadow);
      }

      :host([theme='dark']) .dialog,
      :host([data-theme='dark']) .dialog {
        background: var(--md-dialog-container-dark-bg);
      }

      :host([theme='dark']) .titlebar,
      :host([data-theme='dark']) .titlebar {
        background: var(--md-dialog-header-dark-bg);
        border-bottom-color: var(--md-dialog-header-dark-border);
      }

      :host([theme='dark']) .title,
      :host([data-theme='dark']) .title {
        color: var(--md-dialog-title-dark-color);
      }

      :host([theme='dark']) .body,
      :host([data-theme='dark']) .body {
        color: var(--md-dialog-body-dark-color);
      }

      :host([theme='dark']:not([active])) .titlebar,
      :host([data-theme='dark']:not([active])) .titlebar {
        background: rgba(255, 255, 255, 0.02);
      }

      :host([theme='dark']:not([active])) .title,
      :host([data-theme='dark']:not([active])) .title {
        color: var(--md-dialog-title-dark-inactive-color);
      }

      :host([theme='dark']) .resize-handle::after,
      :host([data-theme='dark']) .resize-handle::after {
        border-right-color: var(--md-dialog-resize-dark-border);
        border-bottom-color: var(--md-dialog-resize-dark-border);
      }

      /* ─── Light Mode (manual via theme/data-theme="light", overrides OS dark) ─── */

      :host([theme='light']) .titlebar,
      :host([data-theme='light']) .titlebar {
        background: var(--md-dialog-header-bg);
        border-bottom-color: var(--md-dialog-header-border);
      }

      :host([theme='light']) .title,
      :host([data-theme='light']) .title {
        color: var(--md-dialog-title-color);
      }

      :host([theme='light']) .body,
      :host([data-theme='light']) .body {
        color: var(--md-dialog-title-color);
      }

      :host([theme='light']:not([active])) .titlebar,
      :host([data-theme='light']:not([active])) .titlebar {
        background: rgba(255, 255, 255, 0.03);
      }

      :host([theme='light']:not([active])) .title,
      :host([data-theme='light']:not([active])) .title {
        color: var(--md-dialog-title-inactive-color);
      }

      :host([theme='light']) .resize-handle::after,
      :host([data-theme='light']) .resize-handle::after {
        border-right-color: var(--md-dialog-resize-border);
        border-bottom-color: var(--md-dialog-resize-border);
      }
    `,
  ]

  /** Dialog title */
  @property({ reflect: true }) title = ''

  /** Theme mode: 'auto' follows OS, 'light' forces light, 'dark' forces dark */
  @property({ reflect: true }) theme: 'auto' | 'light' | 'dark' = 'auto'

  override willUpdate(): void {
    const theme = this._resolvedTheme
    if (theme) {
      this.setAttribute('data-theme', theme)
    } else {
      this.removeAttribute('data-theme')
    }
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has('x') || changed.has('y')) {
      this._updatePosition()
    }
    if (changed.has('width') || changed.has('height')) {
      this._updateSize()
    }
    // 'auto' 不设置 attribute，让 CSS :not([theme]) 匹配 OS 媒体查询
    if (changed.has('theme')) {
      if (this.theme === 'auto') {
        this.removeAttribute('theme')
      }
    }
  }

  /** Dialog left position */
  @property({ type: Number }) x = 100

  /** Dialog top position */
  @property({ type: Number }) y = 100

  /** Dialog width */
  @property({ type: Number }) width = 480

  /** Dialog height */
  @property({ type: Number }) height = 360

  /** Whether the dialog is active (focused) */
  @property({ type: Boolean, reflect: true }) active = true

  /** Whether the dialog can be dragged */
  @property({ type: Boolean }) draggable = true

  /** Whether the dialog can be resized */
  @property({ type: Boolean }) resizable = true

  /** Whether to show traffic light buttons */
  @property({ type: Boolean }) showButtons = true

  /** Minimum width for resize */
  @property({ type: Number }) minWidth = 280

  /** Minimum height for resize */
  @property({ type: Number }) minHeight = 160

  @query('.dialog')
  private _dialog!: HTMLDivElement

  // Drag state
  private _isDragging = false
  private _dragStartX = 0
  private _dragStartY = 0
  private _dragOffsetX = 0
  private _dragOffsetY = 0

  // Resize state
  private _isResizing = false
  private _resizeDir = ''
  private _resizeStartX = 0
  private _resizeStartY = 0
  private _resizeStartW = 0
  private _resizeStartH = 0
  private _resizeStartLeft = 0
  private _resizeStartTop = 0

  // Drag/resize cleanup
  private _dragCleanup: (() => void) | null = null
  private _resizeCleanup: (() => void) | null = null

  override connectedCallback(): void {
    super.connectedCallback()
    this._updatePosition()
    this._updateSize()
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this._dragCleanup?.()
    this._resizeCleanup?.()
  }

  private _updatePosition(): void {
    this.style.left = `${this.x}px`
    this.style.top = `${this.y}px`
  }

  private _updateSize(): void {
    this.style.width = `${this.width}px`
    this.style.height = `${this.height}px`
  }

  // ─── Drag ───

  private _onTitleBarMouseDown(e: MouseEvent): void {
    if (!this.draggable || e.button !== 0) return
    // 忽略点击在红绿灯按钮上
    if ((e.target as HTMLElement).closest('.traffic-light')) return

    e.preventDefault()
    this._isDragging = true
    this._dragStartX = e.clientX
    this._dragStartY = e.clientY
    this._dragOffsetX = this.x
    this._dragOffsetY = this.y

    this.emit('mac-dialog-focus')

    const onMove = (ev: MouseEvent) => {
      if (!this._isDragging) return
      const dx = ev.clientX - this._dragStartX
      const dy = ev.clientY - this._dragStartY
      this.x = this._dragOffsetX + dx
      this.y = this._dragOffsetY + dy
      this.emit('mac-dialog-move', { detail: { x: this.x, y: this.y } })
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

  // ─── Resize ───

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
      this.emit('mac-dialog-resize', { detail: { width: this.width, height: this.height } })
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

  // ─── Traffic Light Buttons ───

  private _onClose(): void {
    this.emit('mac-dialog-close')
  }

  private _onMinimize(): void {
    this.emit('mac-dialog-minimize')
  }

  private _onMaximize(): void {
    this.emit('mac-dialog-maximize')
  }

  // ─── Render ───

  override render() {
    return html`
      <div class="dialog" part="base">
        <div class="titlebar" part="titlebar" @mousedown=${this._onTitleBarMouseDown}>
          ${this.showButtons
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
                        stroke="var(--md-dialog-traffic-close-stroke)"
                        stroke-width="1.2"
                      />
                      <line
                        x1="9"
                        y1="3"
                        x2="3"
                        y2="9"
                        stroke="var(--md-dialog-traffic-close-stroke)"
                        stroke-width="1.2"
                      />
                    </svg>
                  </div>
                  <div
                    class="traffic-light traffic-light--minimize"
                    @click=${this._onMinimize}
                    title="最小化"
                  >
                    <svg viewBox="0 0 12 12">
                      <line
                        x1="3"
                        y1="6"
                        x2="9"
                        y2="6"
                        stroke="var(--md-dialog-traffic-minimize-stroke)"
                        stroke-width="1.2"
                      />
                    </svg>
                  </div>
                  <div
                    class="traffic-light traffic-light--maximize"
                    @click=${this._onMaximize}
                    title="全屏"
                  >
                    <svg viewBox="0 0 12 12">
                      <polyline
                        points="3,8 3,3 8,3"
                        fill="none"
                        stroke="var(--md-dialog-traffic-maximize-stroke)"
                        stroke-width="1.2"
                      />
                      <polyline
                        points="9,4 9,9 4,9"
                        fill="none"
                        stroke="var(--md-dialog-traffic-maximize-stroke)"
                        stroke-width="1.2"
                      />
                    </svg>
                  </div>
                </div>
              `
            : ''}
          <div class="title" part="title">${this.title}</div>
          ${this.showButtons ? html`<div class="titlebar-spacer"></div>` : ''}
        </div>

        <div class="body" part="body">
          <slot></slot>
        </div>

        ${this.resizable
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
          : ''}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-dialog': MacDialog
  }
}
