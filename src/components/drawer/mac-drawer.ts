import { html, css } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-drawer
 * @summary 一个 macOS 风格的抽屉组件，从视口边缘滑入。
 *
 * @slot - 默认插槽，用于抽屉内容。
 * @slot header - 自定义头部内容（替换默认标题和关闭按钮）。
 * @slot footer - 底部内容（例如操作按钮）。
 *
 * @cssproperty --md-drawer-bg - 抽屉面板背景。
 * @cssproperty --md-drawer-border - 抽屉面板边框。
 * @cssproperty --md-drawer-shadow - 抽屉面板阴影。
 * @cssproperty --md-drawer-header-padding - 头部内边距。
 * @cssproperty --md-drawer-header-border - 头部底边框。
 * @cssproperty --md-drawer-title-font-size - 标题字体大小。
 * @cssproperty --md-drawer-title-color - 标题文字颜色。
 * @cssproperty --md-drawer-body-padding - 内容区内边距。
 * @cssproperty --md-drawer-footer-padding - 底部内边距。
 * @cssproperty --md-drawer-footer-border - 底部顶边框。
 * @cssproperty --md-drawer-close-color - 关闭图标颜色。
 * @cssproperty --md-drawer-close-hover-bg - 关闭图标悬停背景。
 * @cssproperty --md-drawer-mask-bg - 遮罩层背景。
 * @cssproperty --md-drawer-radius - 抽屉圆角（暴露边缘）。
 *
 * @event mac-drawer-open - 抽屉打开后触发。
 * @event mac-drawer-close - 抽屉关闭后触发。
 * @event mac-drawer-after-open - 打开动画完成后触发。
 * @event mac-drawer-after-close - 关闭动画完成后触发。
 */
@customElement('mac-drawer')
export class MacDrawer extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
        --md-drawer-bg: rgba(246, 246, 246, 0.88);
        --md-drawer-border: rgba(0, 0, 0, 0.06);
        --md-drawer-shadow: -8px 0 40px rgba(0, 0, 0, 0.1), -2px 0 12px rgba(0, 0, 0, 0.06);
        --md-drawer-header-padding: var(--md-spacing-md) var(--md-spacing-lg);
        --md-drawer-header-border: rgba(0, 0, 0, 0.06);
        --md-drawer-title-font-size: var(--md-font-size-lg);
        --md-drawer-title-color: var(--md-color-text);
        --md-drawer-body-padding: var(--md-spacing-lg);
        --md-drawer-footer-padding: var(--md-spacing-md) var(--md-spacing-lg);
        --md-drawer-footer-border: rgba(0, 0, 0, 0.06);
        --md-drawer-close-color: var(--md-color-text-secondary);
        --md-drawer-close-hover-bg: rgba(0, 0, 0, 0.06);
        --md-drawer-mask-bg: rgba(0, 0, 0, 0.3);
        --md-drawer-radius: var(--md-radius-lg);
      }

      /* ─── 遮罩层 ─── */

      .mask {
        position: fixed;
        inset: 0;
        z-index: 99998;
        background: var(--md-drawer-mask-bg);
        opacity: 0;
        transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
      }

      .mask.visible {
        opacity: 1;
        pointer-events: auto;
      }

      .mask.transparent {
        background: transparent;
        pointer-events: auto;
      }

      /* ─── 抽屉面板 ─── */

      .panel {
        position: fixed;
        z-index: 99999;
        background: var(--md-drawer-bg);
        backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        -webkit-backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        border: 0.5px solid var(--md-drawer-border);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* ─── 位置方向 ─── */

      .panel.right {
        top: 0;
        right: 0;
        bottom: 0;
        height: 100%;
        border-radius: var(--md-drawer-radius) 0 0 var(--md-drawer-radius);
        box-shadow: var(--md-drawer-shadow);
        transform: translateX(100%);
      }

      .panel.right.open {
        transform: translateX(0);
      }

      .panel.left {
        top: 0;
        left: 0;
        bottom: 0;
        height: 100%;
        border-radius: 0 var(--md-drawer-radius) var(--md-drawer-radius) 0;
        box-shadow:
          8px 0 40px rgba(0, 0, 0, 0.1),
          2px 0 12px rgba(0, 0, 0, 0.06);
        transform: translateX(-100%);
      }

      .panel.left.open {
        transform: translateX(0);
      }

      .panel.top {
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        border-radius: 0 0 var(--md-drawer-radius) var(--md-drawer-radius);
        box-shadow:
          0 8px 40px rgba(0, 0, 0, 0.1),
          0 2px 12px rgba(0, 0, 0, 0.06);
        transform: translateY(-100%);
      }

      .panel.top.open {
        transform: translateY(0);
      }

      .panel.bottom {
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        border-radius: var(--md-drawer-radius) var(--md-drawer-radius) 0 0;
        box-shadow:
          0 -8px 40px rgba(0, 0, 0, 0.1),
          0 -2px 12px rgba(0, 0, 0, 0.06);
        transform: translateY(100%);
      }

      .panel.bottom.open {
        transform: translateY(0);
      }

      /* ─── 头部 ─── */

      .header {
        display: flex;
        align-items: center;
        padding: var(--md-drawer-header-padding);
        border-bottom: 0.5px solid var(--md-drawer-header-border);
        flex-shrink: 0;
      }

      .header:empty {
        display: none;
      }

      .title {
        flex: 1;
        font-size: var(--md-drawer-title-font-size);
        font-weight: 600;
        color: var(--md-drawer-title-color);
        letter-spacing: -0.01em;
      }

      .close-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: var(--md-radius-sm);
        color: var(--md-drawer-close-color);
        cursor: pointer;
        transition:
          background var(--md-transition-fast),
          color var(--md-transition-fast);
        flex-shrink: 0;
        margin-left: var(--md-spacing-sm);
      }

      .close-btn:hover {
        background: var(--md-drawer-close-hover-bg);
        color: var(--md-drawer-title-color);
      }

      .close-btn svg {
        width: 16px;
        height: 16px;
      }

      /* ─── 内容区 ─── */

      .body {
        flex: 1;
        overflow-y: auto;
        padding: var(--md-drawer-body-padding);
      }

      /* ─── 底部 ─── */

      .footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: var(--md-spacing-sm);
        padding: var(--md-drawer-footer-padding);
        border-top: 0.5px solid var(--md-drawer-footer-border);
        flex-shrink: 0;
      }

      .footer:empty {
        display: none;
      }

      /* ─── 调整大小手柄 ─── */

      .resize-handle {
        position: absolute;
        z-index: 10;
      }

      .resize-handle.right {
        left: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        cursor: ew-resize;
      }

      .resize-handle.left {
        right: 0;
        top: 0;
        bottom: 0;
        width: 4px;
        cursor: ew-resize;
      }

      .resize-handle.top {
        bottom: 0;
        left: 0;
        right: 0;
        height: 4px;
        cursor: ns-resize;
      }

      .resize-handle.bottom {
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        cursor: ns-resize;
      }

      :host([data-theme='dark']) {
        --md-drawer-bg: rgba(40, 40, 40, 0.92);
        --md-drawer-border: rgba(255, 255, 255, 0.08);
        --md-drawer-shadow: -8px 0 40px rgba(0, 0, 0, 0.3), -2px 0 12px rgba(0, 0, 0, 0.2);
        --md-drawer-header-border: rgba(255, 255, 255, 0.06);
        --md-drawer-title-color: rgba(255, 255, 255, 0.92);
        --md-drawer-footer-border: rgba(255, 255, 255, 0.06);
        --md-drawer-close-color: rgba(255, 255, 255, 0.55);
        --md-drawer-close-hover-bg: rgba(255, 255, 255, 0.08);
        --md-drawer-mask-bg: rgba(0, 0, 0, 0.5);
      }

      :host([data-theme='light']) {
        --md-drawer-bg: rgba(246, 246, 246, 0.88);
        --md-drawer-border: rgba(0, 0, 0, 0.06);
        --md-drawer-shadow: -8px 0 40px rgba(0, 0, 0, 0.1), -2px 0 12px rgba(0, 0, 0, 0.06);
        --md-drawer-header-border: rgba(0, 0, 0, 0.06);
        --md-drawer-title-color: var(--md-color-text);
        --md-drawer-footer-border: rgba(0, 0, 0, 0.06);
        --md-drawer-close-color: var(--md-color-text-secondary);
        --md-drawer-close-hover-bg: rgba(0, 0, 0, 0.06);
        --md-drawer-mask-bg: rgba(0, 0, 0, 0.3);
      }
    `,
  ]

  /** 抽屉是否打开 */
  @property({ type: Boolean, reflect: true }) open = false

  /** 抽屉放置方向 */
  @property({ reflect: true }) placement: 'top' | 'right' | 'bottom' | 'left' = 'right'

  /** 抽屉标题 */
  @property() title = ''

  /** 抽屉宽度（用于左/右放置） */
  @property({ type: String }) width = '360px'

  /** 抽屉高度（用于上/下放置） */
  @property({ type: String }) height = '360px'

  /** 是否显示关闭按钮 */
  @property({ type: Boolean }) closable = true

  /** 点击遮罩是否关闭抽屉 */
  @property({ type: Boolean, attribute: 'mask-closable' }) maskClosable = true

  /** 是否显示遮罩层 */
  @property({ attribute: 'show-mask' }) showMask: boolean | 'transparent' = true

  /** 按 ESC 键是否关闭抽屉 */
  @property({ type: Boolean, attribute: 'close-on-esc' }) closeOnEsc = true

  /** 抽屉是否可调整大小 */
  @property({ type: Boolean }) resizable = false

  /** 调整大小时的最小宽度（左/右） */
  @property({ type: String, attribute: 'min-width' }) minWidth = '200px'

  /** 调整大小时的最大宽度（左/右） */
  @property({ type: String, attribute: 'max-width' }) maxWidth = '80vw'

  /** 调整大小时的最小高度（上/下） */
  @property({ type: String, attribute: 'min-height' }) minHeight = '200px'

  /** 调整大小时的最大高度（上/下） */
  @property({ type: String, attribute: 'max-height' }) maxHeight = '80vh'

  @state() private _isOpen = false

  // Portal 元素
  private _maskEl: HTMLElement | null = null
  private _panelEl: HTMLElement | null = null

  // 调整大小状态
  private _isResizing = false
  private _resizeStartX = 0
  private _resizeStartY = 0
  private _resizeStartSize = 0

  // 样式注入
  private static _stylesInjected = false

  override willUpdate(): void {
    const theme = this._resolvedTheme
    if (theme) {
      this.setAttribute('data-theme', theme)
    } else {
      this.removeAttribute('data-theme')
    }
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has('open')) {
      if (this.open && !this._isOpen) {
        this._show()
      } else if (!this.open && this._isOpen) {
        this._hide()
      }
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this._removePortal()
    document.removeEventListener('keydown', this._handleKeyDown)
  }

  private _injectStyles(): void {
    if (MacDrawer._stylesInjected) return
    MacDrawer._stylesInjected = true

    const style = document.createElement('style')
    style.id = 'mac-drawer-portal-styles'
    style.textContent = `
      .mac-drawer-mask {
        position: fixed;
        inset: 0;
        z-index: 99998;
        background: var(--md-drawer-mask-bg, rgba(0, 0, 0, 0.3));
        opacity: 0;
        transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
      }
      .mac-drawer-mask.visible {
        opacity: 1;
        pointer-events: auto;
      }
      .mac-drawer-mask.transparent {
        background: transparent;
        pointer-events: auto;
      }
      .mac-drawer-panel {
        position: fixed;
        z-index: 99999;
        background: var(--md-drawer-bg, rgba(246, 246, 246, 0.88));
        backdrop-filter: blur(40px) saturate(200%);
        -webkit-backdrop-filter: blur(40px) saturate(200%);
        border: 0.5px solid var(--md-drawer-border, rgba(0, 0, 0, 0.06));
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      .mac-drawer-panel.right {
        top: 0; right: 0; bottom: 0;
        border-radius: 12px 0 0 12px;
        box-shadow: -8px 0 40px rgba(0,0,0,0.1), -2px 0 12px rgba(0,0,0,0.06);
        transform: translateX(100%);
      }
      .mac-drawer-panel.left {
        top: 0; left: 0; bottom: 0;
        border-radius: 0 12px 12px 0;
        box-shadow: 8px 0 40px rgba(0,0,0,0.1), 2px 0 12px rgba(0,0,0,0.06);
        transform: translateX(-100%);
      }
      .mac-drawer-panel.top {
        top: 0; left: 0; right: 0;
        border-radius: 0 0 12px 12px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.1), 0 2px 12px rgba(0,0,0,0.06);
        transform: translateY(-100%);
      }
      .mac-drawer-panel.bottom {
        bottom: 0; left: 0; right: 0;
        border-radius: 12px 12px 0 0;
        box-shadow: 0 -8px 40px rgba(0,0,0,0.1), 0 -2px 12px rgba(0,0,0,0.06);
        transform: translateY(100%);
      }
      .mac-drawer-panel.open {
        transform: translateX(0) translateY(0);
      }
      .mac-drawer-header {
        display: flex;
        align-items: center;
        padding: 12px 20px;
        border-bottom: 0.5px solid var(--md-drawer-header-border, rgba(0,0,0,0.06));
        flex-shrink: 0;
      }
      .mac-drawer-title {
        flex: 1;
        font-size: 15px;
        font-weight: 600;
        color: var(--md-drawer-title-color, rgba(0,0,0,0.88));
        letter-spacing: -0.01em;
      }
      .mac-drawer-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 6px;
        color: var(--md-drawer-close-color, rgba(0,0,0,0.45));
        cursor: pointer;
        transition: background 150ms, color 150ms;
        flex-shrink: 0;
        margin-left: 8px;
        background: none;
        border: none;
        padding: 0;
      }
      .mac-drawer-close:hover {
        background: var(--md-drawer-close-hover-bg, rgba(0,0,0,0.06));
        color: var(--md-drawer-title-color, rgba(0,0,0,0.88));
      }
      .mac-drawer-close svg {
        width: 16px;
        height: 16px;
      }
      .mac-drawer-body {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      }
      .mac-drawer-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        padding: 12px 20px;
        border-top: 0.5px solid var(--md-drawer-footer-border, rgba(0,0,0,0.06));
        flex-shrink: 0;
      }
      .mac-drawer-footer:empty {
        display: none;
      }
      .mac-drawer-resize {
        position: absolute;
        z-index: 10;
      }
      .mac-drawer-resize.right {
        left: 0; top: 0; bottom: 0;
        width: 4px;
        cursor: ew-resize;
      }
      .mac-drawer-resize.left {
        right: 0; top: 0; bottom: 0;
        width: 4px;
        cursor: ew-resize;
      }
      .mac-drawer-resize.top {
        bottom: 0; left: 0; right: 0;
        height: 4px;
        cursor: ns-resize;
      }
      .mac-drawer-resize.bottom {
        top: 0; left: 0; right: 0;
        height: 4px;
        cursor: ns-resize;
      }

      /* ─── 响应式：移动端窄屏全宽 + 安全区适配 ─── */
      @media (max-width: 768px) {
        .mac-drawer-panel.right,
        .mac-drawer-panel.left {
          /* 覆盖 JS 内联 width，移动端占满大部分屏宽 */
          width: 100% !important;
          max-width: 100% !important;
          border-radius: 0;
        }
        .mac-drawer-panel.right {
          padding-left: max(env(safe-area-inset-left, 0px), 0px);
        }
        .mac-drawer-panel.left {
          padding-right: max(env(safe-area-inset-right, 0px), 0px);
        }
        .mac-drawer-panel.top {
          padding-bottom: env(safe-area-inset-top, 0px);
        }
        .mac-drawer-panel.bottom {
          /* 底部抽屉预留 Home 指示条安全区 */
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        .mac-drawer-header {
          padding: 14px 16px;
        }
        .mac-drawer-title {
          font-size: 17px;
        }
        .mac-drawer-close {
          width: 36px;
          height: 36px;
        }
        .mac-drawer-body {
          padding: 16px;
        }
        .mac-drawer-footer {
          padding: 14px 16px;
        }
        .mac-drawer-resize {
          /* 触屏无需手动 resize */
          display: none;
        }
      }
    `
    document.head.appendChild(style)
  }

  private _applyThemeVars(): void {
    const isDark = this._resolvedTheme === 'dark'

    if (isDark) {
      document.documentElement.style.setProperty('--md-drawer-bg', 'rgba(40, 40, 40, 0.92)')
      document.documentElement.style.setProperty('--md-drawer-border', 'rgba(255, 255, 255, 0.08)')
      document.documentElement.style.setProperty(
        '--md-drawer-header-border',
        'rgba(255, 255, 255, 0.06)',
      )
      document.documentElement.style.setProperty(
        '--md-drawer-title-color',
        'rgba(255, 255, 255, 0.92)',
      )
      document.documentElement.style.setProperty(
        '--md-drawer-footer-border',
        'rgba(255, 255, 255, 0.06)',
      )
      document.documentElement.style.setProperty(
        '--md-drawer-close-color',
        'rgba(255, 255, 255, 0.55)',
      )
      document.documentElement.style.setProperty(
        '--md-drawer-close-hover-bg',
        'rgba(255, 255, 255, 0.08)',
      )
      document.documentElement.style.setProperty('--md-drawer-mask-bg', 'rgba(0, 0, 0, 0.5)')
    } else {
      document.documentElement.style.setProperty('--md-drawer-bg', 'rgba(246, 246, 246, 0.88)')
      document.documentElement.style.setProperty('--md-drawer-border', 'rgba(0, 0, 0, 0.06)')
      document.documentElement.style.setProperty('--md-drawer-header-border', 'rgba(0, 0, 0, 0.06)')
      document.documentElement.style.setProperty('--md-drawer-title-color', 'rgba(0, 0, 0, 0.88)')
      document.documentElement.style.setProperty('--md-drawer-footer-border', 'rgba(0, 0, 0, 0.06)')
      document.documentElement.style.setProperty('--md-drawer-close-color', 'rgba(0, 0, 0, 0.45)')
      document.documentElement.style.setProperty(
        '--md-drawer-close-hover-bg',
        'rgba(0, 0, 0, 0.06)',
      )
      document.documentElement.style.setProperty('--md-drawer-mask-bg', 'rgba(0, 0, 0, 0.3)')
    }
  }

  private _show(): void {
    this._injectStyles()
    this._applyThemeVars()
    this._createPortal()
    this._isOpen = true
    document.addEventListener('keydown', this._handleKeyDown)
    document.body.style.overflow = 'hidden'

    requestAnimationFrame(() => {
      if (this._maskEl) {
        this._maskEl.classList.add('visible')
      }
      if (this._panelEl) {
        this._panelEl.classList.add('open')
      }
    })

    this.emit('mac-drawer-open')

    setTimeout(() => {
      this.emit('mac-drawer-after-open')
    }, 300)
  }

  private _hide(): void {
    if (!this._isOpen) return

    if (this._maskEl) {
      this._maskEl.classList.remove('visible')
    }
    if (this._panelEl) {
      this._panelEl.classList.remove('open')
    }

    this._isOpen = false
    document.removeEventListener('keydown', this._handleKeyDown)
    document.body.style.overflow = ''

    this.emit('mac-drawer-close')

    setTimeout(() => {
      this._removePortal()
      this.emit('mac-drawer-after-close')
    }, 300)
  }

  private _createPortal(): void {
    this._removePortal()

    // 遮罩层
    const mask = document.createElement('div')
    mask.className = 'mac-drawer-mask'
    if (this.showMask === 'transparent') {
      mask.classList.add('transparent')
    } else if (this.showMask === false) {
      mask.style.display = 'none'
    }
    mask.addEventListener('click', () => {
      if (this.maskClosable) {
        this._close()
      }
    })
    document.body.appendChild(mask)
    this._maskEl = mask

    // 面板
    const panel = document.createElement('div')
    panel.className = `mac-drawer-panel ${this.placement}`

    // 设置大小
    if (this.placement === 'left' || this.placement === 'right') {
      panel.style.width = this.width
    } else {
      panel.style.height = this.height
    }

    // 头部
    const header = document.createElement('div')
    header.className = 'mac-drawer-header'

    const titleEl = document.createElement('div')
    titleEl.className = 'mac-drawer-title'
    titleEl.textContent = this.title
    header.appendChild(titleEl)

    if (this.closable) {
      const closeBtn = document.createElement('button')
      closeBtn.className = 'mac-drawer-close'
      closeBtn.innerHTML = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>`
      closeBtn.addEventListener('click', () => this._close())
      header.appendChild(closeBtn)
    }

    panel.appendChild(header)

    // 内容区 - 插槽内容将被移到这里
    const body = document.createElement('div')
    body.className = 'mac-drawer-body'

    // 将插槽子元素移动到 portal 内容区
    const children = Array.from(this.childNodes).filter(
      (node) => !((node as Element).slot === 'header' || (node as Element).slot === 'footer'),
    )
    children.forEach((child) => body.appendChild(child))
    this._slottedChildren = children

    panel.appendChild(body)

    // 底部
    const footerSlot = this.querySelector('[slot="footer"]')
    if (footerSlot) {
      const footer = document.createElement('div')
      footer.className = 'mac-drawer-footer'
      footer.appendChild(footerSlot.cloneNode(true))
      panel.appendChild(footer)
    }

    // 调整大小手柄
    if (this.resizable) {
      const resizeHandle = document.createElement('div')
      resizeHandle.className = `mac-drawer-resize ${this.placement}`
      resizeHandle.addEventListener('mousedown', (e) => this._onResizeStart(e))
      panel.appendChild(resizeHandle)
    }

    document.body.appendChild(panel)
    this._panelEl = panel
  }

  private _slottedChildren: Node[] = []

  private _removePortal(): void {
    // 将子元素返回到原始宿主
    if (this._slottedChildren.length > 0) {
      this._slottedChildren.forEach((child) => {
        if (child.parentNode) {
          child.parentNode.removeChild(child)
        }
        this.appendChild(child)
      })
      this._slottedChildren = []
    }

    if (this._maskEl) {
      this._maskEl.remove()
      this._maskEl = null
    }
    if (this._panelEl) {
      this._panelEl.remove()
      this._panelEl = null
    }
  }

  private _close(): void {
    this.open = false
    this._hide()
  }

  private _handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this.closeOnEsc && this._isOpen) {
      e.preventDefault()
      this._close()
    }
  }

  // ─── 调整大小 ───

  private _onResizeStart(e: MouseEvent): void {
    if (e.button !== 0) return
    e.preventDefault()

    this._isResizing = true
    this._resizeStartX = e.clientX
    this._resizeStartY = e.clientY

    const panel = this._panelEl
    if (!panel) return

    if (this.placement === 'left' || this.placement === 'right') {
      this._resizeStartSize = panel.offsetWidth
    } else {
      this._resizeStartSize = panel.offsetHeight
    }

    const onMove = (ev: MouseEvent) => {
      if (!this._isResizing || !this._panelEl) return

      const dx = ev.clientX - this._resizeStartX
      const dy = ev.clientY - this._resizeStartY

      if (this.placement === 'right') {
        const newWidth = Math.max(
          parseInt(this.minWidth),
          Math.min(parseInt(this.maxWidth), this._resizeStartSize - dx),
        )
        this._panelEl.style.width = `${newWidth}px`
      } else if (this.placement === 'left') {
        const newWidth = Math.max(
          parseInt(this.minWidth),
          Math.min(parseInt(this.maxWidth), this._resizeStartSize + dx),
        )
        this._panelEl.style.width = `${newWidth}px`
      } else if (this.placement === 'bottom') {
        const newHeight = Math.max(
          parseInt(this.minHeight),
          Math.min(parseInt(this.maxHeight), this._resizeStartSize - dy),
        )
        this._panelEl.style.height = `${newHeight}px`
      } else if (this.placement === 'top') {
        const newHeight = Math.max(
          parseInt(this.minHeight),
          Math.min(parseInt(this.maxHeight), this._resizeStartSize + dy),
        )
        this._panelEl.style.height = `${newHeight}px`
      }
    }

    const onUp = () => {
      this._isResizing = false
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  override render() {
    // 组件自身 DOM 不渲染任何内容；内容通过 portal 挂载到 body
    return html`<slot style="display:none"></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-drawer': MacDrawer
  }
}
