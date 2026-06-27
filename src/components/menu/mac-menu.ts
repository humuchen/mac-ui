import { html, css } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'
import type { DropdownItem } from '../dropdown/mac-dropdown'

/**
 * @tag mac-menu
 * @summary A standalone menu component that can be displayed at any position.
 *
 * @csspart base - The menu's base container.
 * @csspart item - A menu item.
 */
@customElement('mac-menu')
export class MacMenu extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: none;
        position: fixed;
        z-index: 99999;
      }

      :host([visible]) {
        display: block;
      }
    `,
  ]

  /** Menu items. */
  @property({ type: Array }) items: DropdownItem[] = []

  /** The currently active/selected value. */
  @property({ type: String }) value = ''

  /** Whether the menu is visible. */
  @property({ type: Boolean, reflect: true }) visible = false

  /** Menu position (x coordinate). */
  @property({ type: Number }) x = 0

  /** Menu position (y coordinate). */
  @property({ type: Number }) y = 0

  @state() private _menuEl: HTMLElement | null = null
  @state() private _submenuOpen: string | null = null

  private static _stylesInjected = false

  /**
   * Show the menu at specified position with given items.
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param items - Menu items to display
   */
  show(x: number, y: number, items?: DropdownItem[]) {
    if (items) this.items = items
    this.x = x
    this.y = y
    this.visible = true
    this._createMenu()
    this.emit('mac-menu-open')
  }

  /**
   * Hide the menu.
   */
  hide() {
    this.visible = false
    this._removeMenu()
    this.emit('mac-menu-close')
  }

  /**
   * Toggle menu visibility.
   */
  toggle(x: number, y: number, items?: DropdownItem[]) {
    if (this.visible) {
      this.hide()
    } else {
      this.show(x, y, items)
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    MacMenu._injectStyles()
    document.addEventListener('mousedown', this._handleDocumentClick)
    document.addEventListener('keydown', this._handleKeyDown)
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('mousedown', this._handleDocumentClick)
    document.removeEventListener('keydown', this._handleKeyDown)
    this._removeMenu()
  }

  private static _injectStyles() {
    if (MacMenu._stylesInjected) return
    MacMenu._stylesInjected = true

    // Use the same portal styles as dropdown
    const vars = document.createElement('style')
    vars.id = 'mac-menu-theme-vars'
    vars.textContent = `
      :root {
        /* 间距系统 */
        --md-spacing-xs: 4px;
        --md-spacing-sm: 8px;
        --md-spacing-md: 12px;
        --md-spacing-lg: 16px;
        --md-spacing-container: 5px;

        /* 圆角系统 */
        --md-radius-sm: 4px;
        --md-radius-menu: 8px;

        /* 毛玻璃效果 */
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

        /* 动画系统 */
        --md-transition-fast: 60ms cubic-bezier(0.25, 0.1, 0.25, 1);
        --md-transition-menu: 120ms cubic-bezier(0.25, 0.1, 0.25, 1);
        --md-transition-slow: 200ms cubic-bezier(0.25, 0.1, 0.25, 1);

        /* Light Mode */
        --md-menu-container-bg: rgba(255, 255, 255, 0.78);
        --md-menu-container-border: rgba(0, 0, 0, 0.04);
        --md-menu-container-shadow:
          0 0 0 1px rgba(0, 0, 0, 0.05),
          0 2px 4px rgba(0, 0, 0, 0.04),
          0 8px 16px rgba(0, 0, 0, 0.08),
          0 24px 48px rgba(0, 0, 0, 0.12);

        --md-menu-item-padding: 6px 12px;
        --md-menu-item-gap: 10px;
        --md-menu-item-hover-bg: rgba(0, 122, 255, 0.12);
        --md-menu-item-active-bg: rgba(0, 122, 255, 0.9);
        --md-menu-item-active-color: #ffffff;
        --md-menu-item-color: #1d1d1f;
        --md-menu-item-danger-color: #ff3b30;
        --md-menu-item-danger-hover-bg: rgba(255, 59, 48, 0.1);
        --md-menu-item-disabled-opacity: 0.35;

        --md-menu-shortcut-color: #86868b;
        --md-menu-arrow-color: #86868b;
        --md-menu-divider-color: rgba(0, 0, 0, 0.06);
        --md-menu-divider-margin: 5px 10px;

        /* Dark Mode */
        --md-menu-container-dark-bg: rgba(30, 30, 30, 0.92);
        --md-menu-container-dark-border: rgba(255, 255, 255, 0.08);
        --md-menu-item-dark-hover-bg: rgba(255, 255, 255, 0.1);
        --md-menu-item-dark-active-bg: rgba(10, 132, 255, 0.95);
        --md-menu-item-dark-color: #f5f5f7;
        --md-menu-shortcut-dark-color: #98989d;
        --md-menu-divider-dark-color: rgba(255, 255, 255, 0.06);

        --md-mac-text-white-soft: rgba(255, 255, 255, 0.95);
      }
    `
    document.head.appendChild(vars)

    const style = document.createElement('style')
    style.id = 'mac-menu-portal-styles'
    style.textContent = `
      .mac-menu-portal {
        position: fixed;
        min-width: 180px;
        max-width: 280px;
        padding: var(--md-spacing-container);
        background: var(--md-menu-container-bg);
        backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate)) brightness(var(--md-glass-brightness));
        -webkit-backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate)) brightness(var(--md-glass-brightness));
        border: 0.5px solid var(--md-menu-container-border);
        border-radius: var(--md-radius-menu);
        box-shadow: var(--md-menu-container-shadow);
        z-index: 99999;
        opacity: 0;
        transform: scale(0.95) translateY(-8px);
        pointer-events: none;
        transition:
          opacity var(--md-transition-menu),
          transform var(--md-transition-menu);
        font-family: var(--md-font-family);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .mac-menu-portal.open {
        opacity: 1;
        transform: scale(1) translateY(0);
        pointer-events: auto;
        box-shadow:
          0 0 0 1px rgba(0, 0, 0, 0.06),
          0 4px 8px rgba(0, 0, 0, 0.06),
          0 12px 24px rgba(0, 0, 0, 0.1),
          0 32px 64px rgba(0, 0, 0, 0.15);
      }

      .mac-menu-portal .menu-item {
        display: flex;
        align-items: center;
        gap: var(--md-menu-item-gap);
        padding: var(--md-menu-item-padding);
        border-radius: var(--md-radius-sm);
        cursor: pointer;
        transition: background var(--md-transition-fast);
        user-select: none;
        white-space: nowrap;
        position: relative;
        font-size: var(--md-font-size-menu);
        font-weight: var(--md-font-weight-regular);
        line-height: 1.5;
        color: var(--md-menu-item-color);
        outline: none;
      }

      .mac-menu-portal .menu-item:hover:not(.disabled) {
        background: var(--md-menu-item-hover-bg);
      }

      .mac-menu-portal .menu-item:focus-visible:not(.disabled) {
        background: var(--md-menu-item-hover-bg);
        box-shadow: inset 0 0 0 1px rgba(0, 122, 255, 0.3);
      }

      .mac-menu-portal .menu-item.active {
        background: var(--md-menu-item-active-bg);
        color: var(--md-menu-item-active-color);
        font-weight: var(--md-font-weight-medium);
      }

      .mac-menu-portal .menu-item.active:hover {
        background: rgba(0, 100, 200, 0.95);
      }

      .mac-menu-portal .menu-item.disabled {
        opacity: var(--md-menu-item-disabled-opacity);
        cursor: not-allowed;
      }

      .mac-menu-portal .menu-item.danger {
        color: var(--md-menu-item-danger-color);
      }

      .mac-menu-portal .menu-item.danger:hover:not(.disabled) {
        background: var(--md-menu-item-danger-hover-bg);
      }

      .mac-menu-portal .menu-item-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        font-size: 14px;
        flex-shrink: 0;
        opacity: 0.9;
      }

      .mac-menu-portal .menu-item.active .menu-item-icon {
        opacity: 1;
      }

      .mac-menu-portal .menu-item-label {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .mac-menu-portal .menu-item-shortcut {
        font-size: var(--md-font-size-xs);
        color: var(--md-menu-shortcut-color);
        margin-left: auto;
        padding-left: var(--md-spacing-lg);
        opacity: 0.7;
        font-weight: var(--md-font-weight-medium);
      }

      .mac-menu-portal .menu-item.active .menu-item-shortcut {
        color: var(--md-mac-text-white-soft);
        opacity: 0.9;
      }

      .mac-menu-portal .menu-item-arrow {
        display: flex;
        align-items: center;
        margin-left: auto;
        padding-left: var(--md-spacing-sm);
        color: var(--md-menu-arrow-color);
        opacity: 0.6;
        font-size: 12px;
      }

      .mac-menu-portal .menu-item.active .menu-item-arrow {
        color: var(--md-mac-text-white-soft);
        opacity: 0.9;
      }

      .mac-menu-portal .menu-divider {
        height: 1px;
        background: var(--md-menu-divider-color);
        margin: var(--md-menu-divider-margin);
      }

      /* Dark Mode */
      .mac-menu-portal[data-theme='dark'] {
        background: var(--md-menu-container-dark-bg);
        border-color: var(--md-menu-container-dark-border);
        box-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.05),
          0 2px 4px rgba(0, 0, 0, 0.3),
          0 8px 16px rgba(0, 0, 0, 0.4),
          0 24px 48px rgba(0, 0, 0, 0.5);
      }

      .mac-menu-portal[data-theme='dark'].open {
        box-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.08),
          0 4px 8px rgba(0, 0, 0, 0.4),
          0 12px 24px rgba(0, 0, 0, 0.5),
          0 32px 64px rgba(0, 0, 0, 0.6);
      }

      .mac-menu-portal[data-theme='dark'] .menu-item:hover:not(.disabled) {
        background: var(--md-menu-item-dark-hover-bg);
      }

      .mac-menu-portal[data-theme='dark'] .menu-item:focus-visible:not(.disabled) {
        background: var(--md-menu-item-dark-hover-bg);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
      }

      .mac-menu-portal[data-theme='dark'] .menu-item.active {
        background: var(--md-menu-item-dark-active-bg);
        color: var(--md-menu-item-active-color);
      }

      .mac-menu-portal[data-theme='dark'] .menu-item.danger:hover:not(.disabled) {
        background: rgba(255, 59, 48, 0.15);
      }

      .mac-menu-portal[data-theme='dark'] .menu-divider {
        background: var(--md-menu-divider-dark-color);
      }

      .mac-menu-portal[data-theme='dark'] .menu-item {
        color: var(--md-menu-item-dark-color);
      }

      .mac-menu-portal[data-theme='dark'] .menu-item-shortcut {
        color: var(--md-menu-shortcut-dark-color);
      }

      .mac-menu-portal[data-theme='dark'] .menu-item-arrow {
        color: var(--md-menu-shortcut-dark-color);
      }

      /* Mobile responsive */
      @media (max-width: 768px) {
        .mac-menu-portal {
          min-width: calc(100vw - 32px) !important;
          max-width: calc(100vw - 32px) !important;
          border-radius: 12px;
        }

        .mac-menu-portal .menu-item {
          padding: 12px 16px !important;
          font-size: var(--md-font-size-lg) !important;
          gap: var(--md-spacing-md);
        }

        .mac-menu-portal .menu-item-icon {
          width: 20px;
          height: 20px;
          font-size: 16px;
        }
      }
    `
    document.head.appendChild(style)
  }

  private _handleDocumentClick = (e: Event) => {
    if (!this.visible || !this._menuEl) return
    const target = e.target as Node
    if (this._menuEl.contains(target) || this.contains(target)) return
    this.hide()
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.visible) {
      e.preventDefault()
      this.hide()
    }
  }

  private _createMenu() {
    this._removeMenu()

    const menu = document.createElement('div')
    menu.className = 'mac-menu-portal open'
    menu.setAttribute('data-theme', this._isDark() ? 'dark' : 'light')

    menu.innerHTML = this._renderItems()

    // Calculate position
    const pos = this._calcPosition()
    menu.style.left = `${pos.left}px`
    menu.style.top = `${pos.top}px`

    document.body.appendChild(menu)
    this._menuEl = menu

    // Attach event listeners to items
    this._attachItemListeners(menu)
  }

  private _removeMenu() {
    if (this._menuEl) {
      this._menuEl.remove()
      this._menuEl = null
    }
  }

  private _calcPosition() {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const isMobile = vw <= 768
    const menuWidth = isMobile ? vw - 32 : 220
    const menuHeight = this.items.length * 32 + 8

    let left = isMobile ? 16 : this.x
    let top = this.y

    // Adjust to viewport
    if (left + menuWidth > vw - 8) left = vw - menuWidth - 8
    if (top + menuHeight > vh - 8) top = vh - menuHeight - 8
    if (left < 8) left = 8
    if (top < 8) top = 8

    return { left, top }
  }

  private _renderItems(): string {
    return this.items
      .map((item) => {
        if (item.divider) {
          return '<div class="menu-divider"></div>'
        }

        const classes = ['menu-item']
        if (item.disabled) classes.push('disabled')
        if (item.danger) classes.push('danger')
        if (item.value === this.value) classes.push('active')

        return `
          <div class="${classes.join(' ')}" data-value="${item.value}">
            ${item.icon ? `<span class="menu-item-icon">${item.icon}</span>` : ''}
            <span class="menu-item-label">${item.label}</span>
            ${item.shortcut ? `<span class="menu-item-shortcut">${item.shortcut}</span>` : ''}
          </div>
        `
      })
      .join('')
  }

  private _attachItemListeners(menu: HTMLElement) {
    const items = menu.querySelectorAll('.menu-item:not(.disabled)')
    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        const value = (item as HTMLElement).dataset.value!
        const menuItem = this.items.find((i) => i.value === value)
        if (menuItem && !menuItem.disabled && !menuItem.children) {
          this.value = value
          this.hide()
          this.emit('mac-menu-select', { detail: { value, item: menuItem } })
        }
      })
    })
  }

  private _isDark(): boolean {
    const theme = document.documentElement.getAttribute('data-theme')
    if (theme === 'dark') return true
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  override render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-menu': MacMenu
  }
}
