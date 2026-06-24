import { html, css, nothing } from 'lit'
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
 * @summary A dropdown menu component with macOS-style design.
 *
 * @slot trigger - The trigger element that opens the dropdown.
 *
 * @csspart base - The dropdown's base container.
 * @csspart menu - The dropdown menu.
 * @csspart item - A menu item.
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

  /** Menu items. */
  @property({ type: Array }) items: DropdownItem[] = []

  /** Placement of the dropdown menu. */
  @property() placement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' = 'bottom-start'

  /** The currently active/selected value. */
  @property({ type: String }) value = ''

  /** Disables the dropdown. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** Opens the dropdown on hover. */
  @property({ type: Boolean, attribute: 'open-on-hover' }) openOnHover = false

  /** Hover delay in ms before opening. */
  @property({ type: Number, attribute: 'hover-delay' }) hoverDelay = 150

  /** Trigger mode: click, contextmenu, or both. */
  @property() trigger: 'click' | 'contextmenu' | 'both' = 'click'

  @state() private _open = false

  private _hoverTimeout: ReturnType<typeof setTimeout> | null = null
  private _menuEl: HTMLElement | null = null
  private _menuId = `dropdown-menu-${Math.random().toString(36).slice(2, 9)}`

  /** Injected styles for the portal menu (appended to body). */
  private static _portalStylesInjected = false

  private static _injectPortalStyles() {
    if (MacDropdown._portalStylesInjected) return
    MacDropdown._portalStylesInjected = true

    // Inject theme variables to :root so portal menus (appended to body) can access them
    const vars = document.createElement('style')
    vars.id = 'mac-dropdown-theme-vars'
    vars.textContent = `
      :root {
        --md-spacing-xs: 4px;
        --md-spacing-sm: 8px;
        --md-spacing-md: 12px;
        --md-spacing-lg: 16px;
        --md-radius-sm: 4px;
        --md-radius-menu: 10px;
        --md-glass-blur: 40px;
        --md-glass-saturate: 200%;
        --md-font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        --md-font-size-xs: 11px;
        --md-font-size-menu: 13px;
        --md-transition-menu: 80ms ease;

        --md-dropdown-container-bg: rgba(246, 246, 246, 0.72);
        --md-dropdown-container-border: rgba(255, 255, 255, 0.25);
        --md-dropdown-container-shadow: 0 8px 40px rgba(0, 0, 0, 0.14), 0 2px 12px rgba(0, 0, 0, 0.08);
        --md-dropdown-item-hover-bg: rgba(0, 122, 255, 0.18);
        --md-dropdown-item-active-bg: rgba(0, 122, 255, 0.82);
        --md-dropdown-item-active-hover-bg: rgba(0, 88, 208, 0.88);
        --md-dropdown-item-active-color: #fff;
        --md-dropdown-item-color: #1d1d1f;
        --md-dropdown-item-danger-color: rgba(220, 53, 46, 0.8);
        --md-dropdown-item-danger-hover-bg: rgba(220, 53, 46, 0.15);
        --md-dropdown-item-disabled-opacity: 0.4;
        --md-dropdown-shortcut-color: #6b7280;
        --md-dropdown-arrow-color: #6b7280;
        --md-dropdown-divider-color: rgba(0, 0, 0, 0.08);

        --md-dropdown-container-dark-bg: rgba(40, 40, 40, 0.85);
        --md-dropdown-item-dark-hover-bg: rgba(255, 255, 255, 0.08);
        --md-dropdown-item-dark-active-bg: rgba(0, 122, 255, 0.82);
        --md-dropdown-item-dark-color: #e0e0e0;
        --md-dropdown-shortcut-dark-color: #8e8ea0;
        --md-dropdown-divider-dark-color: rgba(255, 255, 255, 0.08);

        --md-mac-text-white-soft: rgba(255, 255, 255, 0.92);
      }
    `
    document.head.appendChild(vars)

    const style = document.createElement('style')
    style.id = 'mac-dropdown-portal-styles'
    style.textContent = `
      .mac-dropdown-portal {
        position: fixed;
        min-width: 200px;
        max-width: 320px;
        padding: var(--md-dropdown-container-padding);
        background: var(--md-dropdown-container-bg);
        backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        -webkit-backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        border: 1px solid var(--md-dropdown-container-border);
        border-radius: var(--md-dropdown-container-radius);
        box-shadow: var(--md-dropdown-container-shadow);
        z-index: 99999;
        opacity: 0;
        transform: scale(0.96) translateY(-4px);
        pointer-events: none;
        transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1),
                    transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
        font-family: var(--md-font-family);
      }

      .mac-dropdown-portal.open {
        opacity: 1;
        transform: scale(1) translateY(0);
        pointer-events: auto;
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
        gap: var(--md-spacing-sm);
        padding: var(--md-dropdown-item-padding-vertical) var(--md-dropdown-item-padding-horizontal);
        border-radius: var(--md-radius-sm);
        cursor: pointer;
        transition: background var(--md-transition-menu);
        user-select: none;
        white-space: nowrap;
        position: relative;
        font-size: var(--md-dropdown-item-font-size);
        line-height: 1.4;
        color: var(--md-dropdown-item-color);
      }

      .mac-dropdown-portal .dropdown-item:hover:not(.disabled) {
        background: var(--md-dropdown-item-hover-bg);
      }

      .mac-dropdown-portal .dropdown-item.active {
        background: var(--md-dropdown-item-active-bg);
        color: var(--md-dropdown-item-active-color);
      }

      .mac-dropdown-portal .dropdown-item.active:hover {
        background: var(--md-dropdown-item-active-hover-bg);
      }

      .mac-dropdown-portal .dropdown-item.disabled {
        opacity: var(--md-dropdown-item-disabled-opacity);
        cursor: not-allowed;
      }

      .mac-dropdown-portal .dropdown-item.danger {
        color: var(--md-dropdown-item-danger-color);
      }

      .mac-dropdown-portal .dropdown-item.danger:hover:not(.disabled) {
        background: var(--md-dropdown-item-danger-hover-bg);
      }

      .mac-dropdown-portal .dropdown-item-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        font-size: 14px;
        flex-shrink: 0;
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
        opacity: 0.6;
      }

      .mac-dropdown-portal .dropdown-item.active .dropdown-item-shortcut {
        color: var(--md-mac-text-white-soft);
        opacity: 0.8;
      }

      .mac-dropdown-portal .dropdown-item-arrow {
        display: flex;
        align-items: center;
        margin-left: auto;
        padding-left: var(--md-spacing-sm);
        color: var(--md-dropdown-arrow-color);
        opacity: 0.5;
      }

      .mac-dropdown-portal .dropdown-item.active .dropdown-item-arrow {
        color: var(--md-mac-text-white-soft);
        opacity: 0.8;
      }

      .mac-dropdown-portal .dropdown-divider {
        height: 1px;
        background: var(--md-dropdown-divider-color);
        margin: var(--md-spacing-xs) var(--md-spacing-sm);
      }

      /* Submenu */
      .mac-dropdown-portal .dropdown-submenu {
        position: relative;
      }

      .mac-dropdown-portal .dropdown-submenu > .mac-dropdown-submenu-portal {
        position: fixed;
        min-width: 200px;
        max-width: 320px;
        padding: var(--md-dropdown-container-padding);
        background: var(--md-dropdown-container-bg);
        backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        -webkit-backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        border: 1px solid var(--md-dropdown-container-border);
        border-radius: var(--md-dropdown-container-radius);
        box-shadow: var(--md-dropdown-container-shadow);
        z-index: 100000;
        opacity: 0;
        transform: scale(0.96) translateX(-4px);
        transform-origin: top left;
        pointer-events: none;
        transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1),
                    transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      .mac-dropdown-portal .dropdown-submenu:hover > .mac-dropdown-submenu-portal {
        opacity: 1;
        transform: scale(1) translateX(0);
        pointer-events: auto;
      }

      /* Dark Mode */
      @media (prefers-color-scheme: dark) {
        .mac-dropdown-portal,
        .mac-dropdown-portal .dropdown-submenu > .mac-dropdown-submenu-portal {
          background: var(--md-dropdown-container-dark-bg);
        }

        .mac-dropdown-portal .dropdown-item:hover:not(.disabled) {
          background: var(--md-dropdown-item-dark-hover-bg);
        }

        .mac-dropdown-portal .dropdown-item.active {
          background: var(--md-dropdown-item-dark-active-bg);
          color: var(--md-dropdown-item-active-color);
        }

        .mac-dropdown-portal .dropdown-item.danger:hover:not(.disabled) {
          background: var(--md-dropdown-item-danger-hover-bg);
        }

        .mac-dropdown-portal .dropdown-divider {
          background: var(--md-dropdown-divider-dark-color);
        }

        .mac-dropdown-portal .dropdown-item {
          color: var(--md-dropdown-item-dark-color);
        }

        .mac-dropdown-portal .dropdown-item-shortcut {
          color: var(--md-dropdown-shortcut-dark-color);
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
    this._removeMenu()
    if (this._hoverTimeout) clearTimeout(this._hoverTimeout)
  }

  private _handleDocumentClick = (e: Event) => {
    if (!this._open || !this._menuEl) return
    const target = e.target as Node
    // Check if click is inside the menu or the host element
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
   * Calculate the menu position based on trigger element or explicit coordinates.
   * Auto-adjusts to stay within the viewport.
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
    const menuWidth = 220 // estimated min-width
    const menuHeight = this.items.length * 32 + 8 // estimated height

    if (explicitPos) {
      // Context menu: position at click point, adjust to viewport
      let left = explicitPos.x
      let top = explicitPos.y

      if (left + menuWidth > vw - 8) left = vw - menuWidth - 8
      if (top + menuHeight > vh - 8) top = vh - menuHeight - 8
      if (left < 8) left = 8
      if (top < 8) top = 8

      return { left, top, placement: 'context' }
    }

    if (!anchorRect) return { left: 0, top: 0, placement: this.placement }

    let left: number
    let top: number
    let placement = this.placement

    const gap = 4

    switch (placement) {
      case 'bottom-start':
        left = anchorRect.left
        top = anchorRect.bottom + gap
        break
      case 'bottom-end':
        left = anchorRect.right - menuWidth
        top = anchorRect.bottom + gap
        break
      case 'top-start':
        left = anchorRect.left
        top = anchorRect.top - menuHeight - gap
        break
      case 'top-end':
        left = anchorRect.right - menuWidth
        top = anchorRect.top - menuHeight - gap
        break
      default:
        left = anchorRect.left
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
    const anchorRect = triggerEl?.getBoundingClientRect()

    const { left, top, placement } = this._calcPosition(anchorRect, explicitPos)

    const menu = document.createElement('div')
    menu.id = this._menuId
    menu.className = 'mac-dropdown-portal'
    menu.setAttribute('role', 'menu')
    menu.setAttribute('part', 'menu')
    if (placement.startsWith('top')) {
      menu.classList.add('animating-up')
    }
    if (placement.endsWith('end')) {
      menu.classList.add('animating-up-end')
    }

    menu.innerHTML = this._renderItemsHTML(this.items)

    // Position
    menu.style.left = `${left}px`
    menu.style.top = `${top}px`

    document.body.appendChild(menu)
    this._menuEl = menu

    // Bind events on menu items
    this._bindMenuEvents(menu)

    // Animate in on next frame
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
    if (this._menuEl) {
      this._menuEl.classList.remove('open')
      const el = this._menuEl
      // Wait for animation to finish, then remove
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
    // Hover keep-alive: when open-on-hover, cancel close timeout when mouse enters the portal menu
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

    // Submenu positioning on hover
    menu.addEventListener('mouseover', (e: Event) => {
      const target = (e.target as HTMLElement).closest('.dropdown-submenu') as HTMLElement | null
      if (!target) return

      const submenu = target.querySelector('.mac-dropdown-submenu-portal') as HTMLElement | null
      if (!submenu) return

      // Position submenu relative to the parent item
      const itemRect = target.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight

      let subLeft = itemRect.right + 2
      let subTop = itemRect.top - 4

      // If overflows right, show on left
      if (subLeft + 220 > vw) {
        subLeft = itemRect.left - 220 - 2
      }
      // If overflows bottom
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
