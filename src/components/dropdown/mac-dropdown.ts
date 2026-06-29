import { html, css } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

export interface DropdownItem {
  value: string
  label: string
  icon?: string
  disabled?: boolean
  danger?: boolean
  shortcut?: string
  divider?: boolean
  children?: DropdownItem[]
}

/**
 * @tag mac-dropdown
 * @summary 一个 macOS 风格的下拉菜单组件。
 *
 * @slot trigger - 触发下拉菜单打开的元素。
 *
 * @csspart base - 下拉菜单的基础容器。
 * @csspart menu - 下拉菜单。
 * @csspart item - 菜单项。
 */
@customElement('mac-dropdown')
export class MacDropdown extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: inline-block;
      }

      .dropdown {
        position: relative;
        display: inline-block;
      }

      .dropdown-trigger {
        display: inline-flex;
        cursor: pointer;
      }
    `,
  ]

  /** 菜单项。 */
  @property({ type: Array }) items: DropdownItem[] = []

  /** 下拉菜单的位置。 */
  @property() placement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' = 'bottom-start'

  /** 当前激活/选中的值。 */
  @property({ type: String }) value = ''

  /** 禁用下拉菜单。 */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** 悬停时打开下拉菜单。 */
  @property({ type: Boolean, attribute: 'open-on-hover' }) openOnHover = false

  /** 悬停延迟（毫秒）。 */
  @property({ type: Number, attribute: 'hover-delay' }) hoverDelay = 150

  /** 触发模式：click、contextmenu 或 both。 */
  @property() trigger: 'click' | 'contextmenu' | 'both' = 'click'

  @state() private _open = false

  private _hoverTimeout: ReturnType<typeof setTimeout> | null = null
  private _menuEl: HTMLElement | null = null
  private _menuId = `dropdown-menu-${Math.random().toString(36).slice(2, 9)}`
  private _scrollHandler: (() => void) | null = null
  private _triggerEl: HTMLElement | null = null

  /** 为 portal 菜单注入的样式（挂载到 body）。 */
  private static _portalStylesInjected = false

  private static _injectPortalStyles() {
    if (MacDropdown._portalStylesInjected) return
    MacDropdown._portalStylesInjected = true

    // 向 :root 注入主题变量，以便 portal 菜单（挂载到 body）可以访问
    const vars = document.createElement('style')
    vars.id = 'mac-dropdown-theme-vars'
    vars.textContent = `
      :root {
        /* 间距系统 - 更精细的间距层次 */
        --md-spacing-xs: 4px;
        --md-spacing-sm: 8px;
        --md-spacing-md: 12px;
        --md-spacing-lg: 16px;
        --md-spacing-xl: 20px;
        --md-spacing-container: 5px;

        /* 圆角系统 - 更柔和的圆角 */
        --md-radius-sm: 4px;
        --md-radius-md: 6px;
        --md-radius-lg: 8px;
        --md-radius-xl: 12px;
        --md-radius-menu: 8px;

        /* 毛玻璃效果 - 更精致的模糊 */
        --md-glass-blur: 50px;
        --md-glass-saturate: 180%;
        --md-glass-brightness: 1.05;

        /* 字体系统 */
        --md-font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
        --md-font-size-xs: 11px;
        --md-font-size-sm: 12px;
        --md-font-size-menu: 13px;
        --md-font-size-lg: 15px;
        --md-font-weight-regular: 400;
        --md-font-weight-medium: 500;

        /* 动画系统 - macOS27 标准动画曲线 */
        --md-transition-fast: 150ms ease;
        --md-transition-menu: 250ms ease;
        --md-transition-slow: 250ms ease;

        /* Light Mode - 更精致的配色 */
        --md-dropdown-container-bg: rgba(255, 255, 255, 0.78);
        --md-dropdown-container-border: rgba(0, 0, 0, 0.04);
        --md-dropdown-container-shadow: 
          0 0 0 1px rgba(0, 0, 0, 0.05),
          0 2px 4px rgba(0, 0, 0, 0.04),
          0 8px 16px rgba(0, 0, 0, 0.08),
          0 24px 48px rgba(0, 0, 0, 0.12);
        --md-dropdown-container-padding: 5px;

        --md-dropdown-item-padding: 6px 12px;
        --md-dropdown-item-gap: 10px;
        --md-dropdown-item-hover-bg: rgba(0, 122, 255, 0.12);
        --md-dropdown-item-active-bg: rgba(0, 122, 255, 0.9);
        --md-dropdown-item-active-hover-bg: rgba(0, 100, 200, 0.95);
        --md-dropdown-item-active-color: #ffffff;
        --md-dropdown-item-color: #1d1d1f;
        --md-dropdown-item-danger-color: #ff3b30;
        --md-dropdown-item-danger-hover-bg: rgba(255, 59, 48, 0.1);
        --md-dropdown-item-disabled-opacity: 0.35;

        --md-dropdown-shortcut-color: #86868b;
        --md-dropdown-arrow-color: #86868b;
        --md-dropdown-divider-color: rgba(0, 0, 0, 0.06);
        --md-dropdown-divider-margin: 5px 10px;

        /* Dark Mode - 更深邃的暗色模式 */
        --md-dropdown-container-dark-bg: rgba(30, 30, 30, 0.92);
        --md-dropdown-container-dark-border: rgba(255, 255, 255, 0.08);
        --md-dropdown-container-dark-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.05),
          0 2px 4px rgba(0, 0, 0, 0.3),
          0 8px 16px rgba(0, 0, 0, 0.4),
          0 24px 48px rgba(0, 0, 0, 0.5);

        --md-dropdown-item-dark-hover-bg: rgba(255, 255, 255, 0.1);
        --md-dropdown-item-dark-active-bg: rgba(10, 132, 255, 0.95);
        --md-dropdown-item-dark-color: #f5f5f7;
        --md-dropdown-shortcut-dark-color: #98989d;
        --md-dropdown-divider-dark-color: rgba(255, 255, 255, 0.06);

        --md-mac-text-white-soft: rgba(255, 255, 255, 0.95);
      }
    `
    document.head.appendChild(vars)

    const style = document.createElement('style')
    style.id = 'mac-dropdown-portal-styles'
    style.textContent = `
      .mac-dropdown-portal {
        position: fixed;
        min-width: 180px;
        max-width: 280px;
        padding: var(--md-dropdown-container-padding);
        background: var(--md-dropdown-container-bg);
        backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate)) brightness(var(--md-glass-brightness));
        -webkit-backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate)) brightness(var(--md-glass-brightness));
        border: 0.5px solid var(--md-dropdown-container-border);
        border-radius: var(--md-radius-menu);
        box-shadow: var(--md-dropdown-container-shadow);
        z-index: 99999;
        opacity: 0;
        transform: scale(0.95) translateY(-8px);
        pointer-events: none;
        transition:
          opacity var(--md-transition-menu),
          transform var(--md-transition-menu),
          box-shadow var(--md-transition-slow);
        font-family: var(--md-font-family);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .mac-dropdown-portal.open {
        opacity: 1;
        transform: scale(1) translateY(0);
        pointer-events: auto;
        box-shadow:
          0 0 0 1px rgba(0, 0, 0, 0.06),
          0 4px 8px rgba(0, 0, 0, 0.06),
          0 12px 24px rgba(0, 0, 0, 0.1),
          0 32px 64px rgba(0, 0, 0, 0.15);
      }

      .mac-dropdown-portal.animating-up {
        transform-origin: bottom left;
      }

      .mac-dropdown-portal.animating-up-end {
        transform-origin: bottom right;
      }

      .mac-dropdown-portal .dropdown-item {
        display: flex;
        align-items: center;
        gap: var(--md-dropdown-item-gap);
        padding: var(--md-dropdown-item-padding);
        border-radius: var(--md-radius-sm);
        cursor: pointer;
        transition: background var(--md-transition-fast);
        user-select: none;
        white-space: nowrap;
        position: relative;
        font-size: var(--md-font-size-menu);
        font-weight: var(--md-font-weight-regular);
        line-height: 1.5;
        color: var(--md-dropdown-item-color);
        outline: none;
      }

      .mac-dropdown-portal .dropdown-item:hover:not(.disabled) {
        background: var(--md-dropdown-item-hover-bg);
      }

      .mac-dropdown-portal .dropdown-item:focus-visible:not(.disabled) {
        background: var(--md-dropdown-item-hover-bg);
        box-shadow: inset 0 0 0 1px rgba(0, 122, 255, 0.3);
      }

      .mac-dropdown-portal .dropdown-item.active {
        background: var(--md-dropdown-item-active-bg);
        color: var(--md-dropdown-item-active-color);
        font-weight: var(--md-font-weight-medium);
      }

      .mac-dropdown-portal .dropdown-item.active:hover {
        background: var(--md-dropdown-item-active-hover-bg);
      }

      .mac-dropdown-portal .dropdown-item.active:focus-visible {
        background: var(--md-dropdown-item-active-hover-bg);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3);
      }

      .mac-dropdown-portal .dropdown-item.disabled {
        opacity: var(--md-dropdown-item-disabled-opacity);
        cursor: not-allowed;
        color: var(--md-dropdown-item-color);
      }

      .mac-dropdown-portal .dropdown-item.danger {
        color: var(--md-dropdown-item-danger-color);
      }

      .mac-dropdown-portal .dropdown-item.danger:hover:not(.disabled) {
        background: var(--md-dropdown-item-danger-hover-bg);
        color: var(--md-dropdown-item-danger-color);
      }

      .mac-dropdown-portal .dropdown-item-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        font-size: 14px;
        flex-shrink: 0;
        opacity: 0.9;
      }

      .mac-dropdown-portal .dropdown-item.active .dropdown-item-icon {
        opacity: 1;
      }

      .mac-dropdown-portal .dropdown-item-label {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .mac-dropdown-portal .dropdown-item-shortcut {
        font-size: var(--md-font-size-xs);
        color: var(--md-dropdown-shortcut-color);
        margin-left: auto;
        padding-left: var(--md-spacing-lg);
        opacity: 0.7;
        font-weight: var(--md-font-weight-medium);
      }

      .mac-dropdown-portal .dropdown-item.active .dropdown-item-shortcut {
        color: var(--md-mac-text-white-soft);
        opacity: 0.9;
      }

      .mac-dropdown-portal .dropdown-item-arrow {
        display: flex;
        align-items: center;
        margin-left: auto;
        padding-left: var(--md-spacing-sm);
        color: var(--md-dropdown-arrow-color);
        opacity: 0.6;
        font-size: 12px;
      }

      .mac-dropdown-portal .dropdown-item.active .dropdown-item-arrow {
        color: var(--md-mac-text-white-soft);
        opacity: 0.9;
      }

      .mac-dropdown-portal .dropdown-divider {
        height: 1px;
        background: var(--md-dropdown-divider-color);
        margin: var(--md-dropdown-divider-margin);
      }

      /* 子菜单 */
      .mac-dropdown-portal .dropdown-submenu {
        position: relative;
      }

      .mac-dropdown-portal .dropdown-submenu > .mac-dropdown-submenu-portal {
        position: fixed;
        min-width: 180px;
        max-width: 280px;
        padding: var(--md-dropdown-container-padding);
        background: var(--md-dropdown-container-bg);
        backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate)) brightness(var(--md-glass-brightness));
        -webkit-backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate)) brightness(var(--md-glass-brightness));
        border: 0.5px solid var(--md-dropdown-container-border);
        border-radius: var(--md-radius-menu);
        box-shadow: var(--md-dropdown-container-shadow);
        z-index: 100000;
        opacity: 0;
        transform: scale(0.95) translateX(-6px);
        transform-origin: top left;
        pointer-events: none;
        transition:
          opacity var(--md-transition-menu),
          transform var(--md-transition-menu);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .mac-dropdown-portal .dropdown-submenu:hover > .mac-dropdown-submenu-portal {
        opacity: 1;
        transform: scale(1) translateX(0);
        pointer-events: auto;
      }

      /* 深色模式 */
      .mac-dropdown-portal[data-theme='dark'],
      .mac-dropdown-portal[data-theme='dark'] .dropdown-submenu > .mac-dropdown-submenu-portal {
        background: var(--md-dropdown-container-dark-bg);
        border-color: var(--md-dropdown-container-dark-border);
        box-shadow: var(--md-dropdown-container-dark-shadow);
      }

      .mac-dropdown-portal[data-theme='dark'].open {
        box-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.08),
          0 4px 8px rgba(0, 0, 0, 0.4),
          0 12px 24px rgba(0, 0, 0, 0.5),
          0 32px 64px rgba(0, 0, 0, 0.6);
      }

      .mac-dropdown-portal[data-theme='dark'] .dropdown-item:hover:not(.disabled) {
        background: var(--md-dropdown-item-dark-hover-bg);
      }

      .mac-dropdown-portal[data-theme='dark'] .dropdown-item:focus-visible:not(.disabled) {
        background: var(--md-dropdown-item-dark-hover-bg);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
      }

      .mac-dropdown-portal[data-theme='dark'] .dropdown-item.active {
        background: var(--md-dropdown-item-dark-active-bg);
        color: var(--md-dropdown-item-active-color);
      }

      .mac-dropdown-portal[data-theme='dark'] .dropdown-item.active:hover {
        background: var(--md-dropdown-item-dark-active-bg);
      }

      .mac-dropdown-portal[data-theme='dark'] .dropdown-item.danger:hover:not(.disabled) {
        background: rgba(255, 59, 48, 0.15);
      }

      .mac-dropdown-portal[data-theme='dark'] .dropdown-divider {
        background: var(--md-dropdown-divider-dark-color);
      }

      .mac-dropdown-portal[data-theme='dark'] .dropdown-item {
        color: var(--md-dropdown-item-dark-color);
      }

      .mac-dropdown-portal[data-theme='dark'] .dropdown-item-shortcut {
        color: var(--md-dropdown-shortcut-dark-color);
      }

      .mac-dropdown-portal[data-theme='dark'] .dropdown-item-arrow {
        color: var(--md-dropdown-shortcut-dark-color);
      }

      /* ─── 响应式：移动端浮层更宽 + 触控目标更大 ─── */
      @media (max-width: 768px) {
        .mac-dropdown-portal {
          min-width: calc(100vw - 32px) !important;
          max-width: calc(100vw - 32px) !important;
          border-radius: var(--md-radius-xl);
        }

        .mac-dropdown-portal .dropdown-item {
          padding: 12px 16px !important;
          font-size: var(--md-font-size-lg) !important;
          gap: var(--md-spacing-md);
        }

        .mac-dropdown-portal .dropdown-item-icon {
          width: 20px;
          height: 20px;
          font-size: 16px;
        }

        .mac-dropdown-portal .dropdown-item-shortcut {
          font-size: var(--md-font-size-sm);
        }

        .mac-dropdown-portal .dropdown-submenu > .mac-dropdown-submenu-portal {
          min-width: calc(100vw - 32px) !important;
          max-width: calc(100vw - 32px) !important;
        }
      }
    `
    document.head.appendChild(style)
  }

  override connectedCallback() {
    super.connectedCallback()
    MacDropdown._injectPortalStyles()
    document.addEventListener('mousedown', this._handleDocumentClick)
    document.addEventListener('keydown', this._handleKeyDown)
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('mousedown', this._handleDocumentClick)
    document.removeEventListener('keydown', this._handleKeyDown)
    this._removeScrollListener()
    this._removeMenu()
    if (this._hoverTimeout) clearTimeout(this._hoverTimeout)
  }

  private _addScrollListener() {
    if (this._scrollHandler) return
    this._scrollHandler = () => {
      if (this._open && this._menuEl && this._triggerEl) {
        const anchorRect = this._triggerEl.getBoundingClientRect()
        const { left, top } = this._calcPosition(anchorRect)
        this._menuEl.style.left = `${left}px`
        this._menuEl.style.top = `${top}px`
      }
    }
    window.addEventListener('scroll', this._scrollHandler, true)
    window.addEventListener('resize', this._scrollHandler)
  }

  private _removeScrollListener() {
    if (this._scrollHandler) {
      window.removeEventListener('scroll', this._scrollHandler, true)
      window.removeEventListener('resize', this._scrollHandler)
      this._scrollHandler = null
    }
  }

  private _handleDocumentClick = (e: Event) => {
    if (!this._open || !this._menuEl) return
    const target = e.target as Node
    // 检查点击是否在菜单或宿主元素内
    if (this._menuEl.contains(target) || this.contains(target)) return
    this._close()
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this._open) {
      e.preventDefault()
      this._close()
    }
  }

  private _openMenu() {
    if (this.disabled) return
    this._open = true
    this._createMenu()
    this.emit('mac-dropdown-open')
  }

  private _close() {
    if (!this._open) return
    this._open = false
    this._removeMenu()
    this.emit('mac-dropdown-close')
  }

  private _toggle() {
    this._open ? this._close() : this._openMenu()
  }

  private _handleTriggerClick(e: Event) {
    if (this.trigger === 'contextmenu') return
    e.preventDefault()
    this._toggle()
  }

  private _handleContextMenu(e: Event) {
    if (this.trigger === 'click') return
    e.preventDefault()
    e.stopPropagation()

    const ce = e as MouseEvent
    this._open = true
    this._createMenu({ x: ce.clientX, y: ce.clientY })
    this.emit('mac-dropdown-open')
  }

  private _handleMouseEnter() {
    if (!this.openOnHover) return
    if (this._hoverTimeout) clearTimeout(this._hoverTimeout)
    this._hoverTimeout = setTimeout(() => this._openMenu(), this.hoverDelay)
  }

  private _handleMouseLeave() {
    if (!this.openOnHover) return
    if (this._hoverTimeout) clearTimeout(this._hoverTimeout)
    this._hoverTimeout = setTimeout(() => this._close(), 200)
  }

  private _selectItem(item: DropdownItem) {
    if (item.disabled) return
    if (item.children) return

    this.value = item.value
    this._close()
    this.emit('mac-dropdown-select', { detail: { value: item.value, item } })
  }

  /**
   * 根据触发元素或显式坐标计算菜单位置。
   * 自动调整以保持在视口内。
   */
  private _calcPosition(
    anchorRect?: DOMRect,
    explicitPos?: { x: number; y: number },
  ): {
    left: number
    top: number
    placement: string
  } {
    const vw = window.innerWidth
    const vh = window.innerHeight
    // 移动端：浮层宽度为视口宽 - 32px（与 CSS media query 一致），水平居中
    const isMobile = vw <= 768
    const menuWidth = isMobile ? vw - 32 : 220 // estimated min-width
    const menuHeight = this.items.length * 32 + 8 // estimated height

    if (explicitPos) {
      // Context menu: position at click point, adjust to viewport
      let left = isMobile ? 16 : explicitPos.x
      let top = explicitPos.y

      if (left + menuWidth > vw - 8) left = vw - menuWidth - 8
      if (top + menuHeight > vh - 8) top = vh - menuHeight - 8
      if (left < 8) left = 8
      if (top < 8) top = 8

      return { left, top, placement: 'context' }
    }

    if (!anchorRect) return { left: 0, top: 0, placement: this.placement }

    let left = 0
    let top: number
    let placement = this.placement

    const gap = 4

    // 移动端：忽略 placement 的水平对齐，统一水平居中
    if (isMobile) {
      left = Math.max(8, (vw - menuWidth) / 2)
    }

    switch (placement) {
      case 'bottom-start':
        if (!isMobile) left = anchorRect.left
        top = anchorRect.bottom + gap
        break
      case 'bottom-end':
        if (!isMobile) left = anchorRect.right - menuWidth
        top = anchorRect.bottom + gap
        break
      case 'top-start':
        if (!isMobile) left = anchorRect.left
        top = anchorRect.top - menuHeight - gap
        break
      case 'top-end':
        if (!isMobile) left = anchorRect.right - menuWidth
        top = anchorRect.top - menuHeight - gap
        break
      default:
        if (!isMobile) left = anchorRect.left
        top = anchorRect.bottom + gap
    }

    // Auto-flip: if bottom overflows, flip to top
    if ((placement === 'bottom-start' || placement === 'bottom-end') && top + menuHeight > vh - 8) {
      top = anchorRect.top - menuHeight - gap
      placement = placement.replace('bottom', 'top') as typeof placement
    }
    // Auto-flip: if top overflows, flip to bottom
    if ((placement === 'top-start' || placement === 'top-end') && top < 8) {
      top = anchorRect.bottom + gap
      placement = placement.replace('top', 'bottom') as typeof placement
    }
    // Horizontal: if overflows right, shift left
    if (left + menuWidth > vw - 8) {
      left = vw - menuWidth - 8
    }
    // Horizontal: if overflows left, shift right
    if (left < 8) {
      left = 8
    }

    return { left, top, placement }
  }

  private _createMenu(explicitPos?: { x: number; y: number }) {
    this._removeMenu()

    const triggerEl = this.shadowRoot?.querySelector('.dropdown-trigger')
    this._triggerEl = triggerEl as HTMLElement
    const anchorRect = triggerEl?.getBoundingClientRect()

    const { left, top, placement } = this._calcPosition(anchorRect, explicitPos)

    const menu = document.createElement('div')
    menu.id = this._menuId
    menu.className = 'mac-dropdown-portal'
    menu.setAttribute('role', 'menu')
    menu.setAttribute('part', 'menu')
    const theme = this._resolvedTheme
    if (theme) {
      menu.setAttribute('data-theme', theme)
    }
    if (placement.startsWith('top')) {
      menu.classList.add('animating-up')
    }
    if (placement.endsWith('end')) {
      menu.classList.add('animating-up-end')
    }

    menu.innerHTML = this._renderItemsHTML(this.items)

    // 位置
    menu.style.left = `${left}px`
    menu.style.top = `${top}px`

    document.body.appendChild(menu)
    this._menuEl = menu

    // 绑定菜单项事件
    this._bindMenuEvents(menu)

    // 添加滚动监听器以更新位置
    if (!explicitPos) {
      this._addScrollListener()
    }

    // 在下一帧执行进入动画
    requestAnimationFrame(() => {
      // Re-calculate position with actual menu dimensions
      if (explicitPos) {
        const menuRect = menu.getBoundingClientRect()
        const vw = window.innerWidth
        const vh = window.innerHeight
        let newLeft = left
        let newTop = top
        if (newLeft + menuRect.width > vw - 8) newLeft = vw - menuRect.width - 8
        if (newTop + menuRect.height > vh - 8) newTop = vh - menuRect.height - 8
        if (newLeft < 8) newLeft = 8
        if (newTop < 8) newTop = 8
        menu.style.left = `${newLeft}px`
        menu.style.top = `${newTop}px`
      } else if (anchorRect) {
        // Re-adjust with actual menu size
        const menuRect = menu.getBoundingClientRect()
        const vw = window.innerWidth
        const vh = window.innerHeight
        let newLeft = left
        let newTop = top
        if (newLeft + menuRect.width > vw - 8) newLeft = vw - menuRect.width - 8
        if (newTop + menuRect.height > vh - 8) {
          newTop = (anchorRect as DOMRect).top - menuRect.height - 4
          menu.classList.add('animating-up')
        }
        if (newLeft < 8) newLeft = 8
        if (newTop < 8) newTop = 8
        menu.style.left = `${newLeft}px`
        menu.style.top = `${newTop}px`
      }

      menu.classList.add('open')
    })
  }

  private _removeMenu() {
    this._removeScrollListener()
    this._triggerEl = null
    if (this._menuEl) {
      this._menuEl.classList.remove('open')
      const el = this._menuEl
      // 等待动画完成后移除
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el)
      }, 150)
      this._menuEl = null
    }
  }

  private _renderItemsHTML(items: DropdownItem[]): string {
    return items
      .map((item) => {
        if (item.divider) {
          return '<div class="dropdown-divider"></div>'
        }

        const isActive = this.value === item.value
        const hasChildren = item.children && item.children.length > 0

        const classes = [
          'dropdown-item',
          isActive ? 'active' : '',
          item.disabled ? 'disabled' : '',
          item.danger ? 'danger' : '',
          hasChildren ? 'dropdown-submenu' : '',
        ]
          .filter(Boolean)
          .join(' ')

        const iconHTML = item.icon ? `<span class="dropdown-item-icon">${item.icon}</span>` : ''
        const shortcutHTML =
          item.shortcut && !hasChildren
            ? `<span class="dropdown-item-shortcut">${item.shortcut}</span>`
            : ''
        const arrowHTML = hasChildren
          ? `<span class="dropdown-item-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M4.5 2.5l3.5 3.5-3.5 3.5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg></span>`
          : ''
        const submenuHTML = hasChildren
          ? `<div class="mac-dropdown-submenu-portal" role="menu">${this._renderItemsHTML(item.children!)}</div>`
          : ''

        return `<div class="${classes}" data-value="${item.value}" data-disabled="${!!item.disabled}" data-has-children="${!!hasChildren}" role="menuitem" aria-disabled="${!!item.disabled}" aria-haspopup="${!!hasChildren}">${iconHTML}<span class="dropdown-item-label">${item.label}</span>${shortcutHTML}${arrowHTML}${submenuHTML}</div>`
      })
      .join('')
  }

  private _bindMenuEvents(menu: HTMLElement) {
    // 悬停保活：当 open-on-hover 时，鼠标进入 portal 菜单时取消关闭超时
    menu.addEventListener('mouseenter', () => {
      if (this.openOnHover && this._hoverTimeout) {
        clearTimeout(this._hoverTimeout)
        this._hoverTimeout = null
      }
    })
    menu.addEventListener('mouseleave', () => {
      if (this.openOnHover) {
        if (this._hoverTimeout) clearTimeout(this._hoverTimeout)
        this._hoverTimeout = setTimeout(() => this._close(), 200)
      }
    })

    menu.addEventListener('click', (e: Event) => {
      const target = (e.target as HTMLElement).closest('.dropdown-item') as HTMLElement | null
      if (!target) return

      const isDisabled = target.dataset.disabled === 'true'
      const hasChildren = target.dataset.hasChildren === 'true'
      if (isDisabled || hasChildren) return

      const value = target.dataset.value
      if (value) {
        const item = this._findItem(this.items, value)
        if (item) this._selectItem(item)
      }
    })

    // 悬停时子菜单位置
    menu.addEventListener('mouseover', (e: Event) => {
      const target = (e.target as HTMLElement).closest('.dropdown-submenu') as HTMLElement | null
      if (!target) return

      const submenu = target.querySelector('.mac-dropdown-submenu-portal') as HTMLElement | null
      if (!submenu) return

      // 相对于父项定位子菜单
      const itemRect = target.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight

      let subLeft = itemRect.right + 2
      let subTop = itemRect.top - 4

      // 如果右侧溢出，则在左侧显示
      if (subLeft + 220 > vw) {
        subLeft = itemRect.left - 220 - 2
      }
      // 如果底部溢出
      requestAnimationFrame(() => {
        const subRect = submenu.getBoundingClientRect()
        if (subTop + subRect.height > vh - 8) {
          subTop = vh - subRect.height - 8
        }
        if (subTop < 8) subTop = 8
        submenu.style.left = `${subLeft}px`
        submenu.style.top = `${subTop}px`
      })
    })
  }

  private _findItem(items: DropdownItem[], value: string): DropdownItem | null {
    for (const item of items) {
      if (item.value === value) return item
      if (item.children) {
        const found = this._findItem(item.children, value)
        if (found) return found
      }
    }
    return null
  }

  override render() {
    return html`
      <div
        class="dropdown"
        part="base"
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
      >
        <div
          class="dropdown-trigger"
          @click=${this._handleTriggerClick}
          @contextmenu=${this._handleContextMenu}
        >
          <slot name="trigger"></slot>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-dropdown': MacDropdown
  }
}
