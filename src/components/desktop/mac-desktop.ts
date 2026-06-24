import { html, css } from 'lit'
import { property, customElement, query } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'
import type { MacDesktopIcon } from '../desktop-icon/mac-desktop-icon'

export interface DesktopIconData {
  id: string
  label: string
  color?: string
  x?: number
  y?: number
  iconSrc?: string
}

/**
 * @tag mac-desktop
 * @summary A macOS-style desktop container with icon layout, drag management, and integrated dock.
 *
 * @slot - Default slot for mac-desktop-icon elements.
 * @slot wallpaper - Custom wallpaper content.
 * @slot dock - Dock bar content (mac-dock-item elements).
 *
 * @csspart base - The desktop base container.
 * @csspart wallpaper - The wallpaper layer.
 * @csspart dock - The dock container area.
 *
 * @event mac-layout-change - Emitted when layout mode changes.
 * @event mac-icons-reorder - Emitted when icons are reordered.
 */
@customElement('mac-desktop')
export class MacDesktop extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .desktop {
        position: relative;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        border-radius: var(--md-radius-lg);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .desktop-wallpaper {
        position: absolute;
        inset: 0;
        z-index: 0;
      }

      .desktop-wallpaper ::slotted(*) {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .desktop-icons {
        position: relative;
        z-index: 1;
        flex: 1;
        width: 100%;
      }

      /* ─── Dock Area ─── */

      .desktop-dock {
        position: relative;
        z-index: 100;
        display: flex;
        justify-content: center;
        padding-bottom: var(--md-dock-dock-bottom);
        flex-shrink: 0;
      }

      .desktop-dock ::slotted(mac-dock) {
        width: auto;
      }

      /* ─── Selection Rectangle (Liquid Glass) ─── */

      .selection-rect {
        position: absolute;
        border: 0.5px solid var(--md-mac-selection-rect-border);
        background: var(--md-mac-selection-rect-bg);
        backdrop-filter: blur(2px) saturate(120%);
        -webkit-backdrop-filter: blur(2px) saturate(120%);
        border-radius: var(--md-radius-sm);
        z-index: 50;
        pointer-events: none;
        display: none;
        box-shadow: inset 0 0 0 0.5px var(--md-mac-selection-rect-inner);
      }

      .selection-rect.active {
        display: block;
      }

      /* ─── Context Menu (Liquid Glass) ─── */

      .context-menu {
        position: absolute;
        z-index: 200;
        min-width: 220px;
        background: var(--md-glass-menu-bg);
        backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        -webkit-backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        border-radius: var(--md-dock-container-radius);
        padding: var(--md-dock-container-padding);
        box-shadow:
          var(--md-shadow-menu),
          inset 0 0 0 0.5px var(--md-glass-menu-border),
          inset 0 1px 0 var(--md-glass-menu-highlight);
        font-family: var(--md-font-family);
        font-size: var(--md-font-size-menu);
        color: var(--md-mac-text-primary);
        display: none;
        letter-spacing: -0.01em;
      }

      .context-menu.visible {
        display: block;
      }

      .context-menu-item {
        padding: var(--md-spacing-xs) 14px;
        cursor: default;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--md-dock-container-gap);
        border-radius: var(--md-dock-container-radius);
        margin: 0 var(--md-spacing-xs);
        transition:
          background-color var(--md-transition-menu),
          color var(--md-transition-menu);
      }

      .context-menu-item:hover {
        background: var(--md-dock-item-hover-bg);
        color: var(--md-dock-item-hover-color);
        box-shadow: var(--md-dock-item-hover-shadow);
      }

      .context-menu-item .shortcut {
        font-size: var(--md-font-size-sm);
        opacity: var(--md-opacity-shortcut);
        font-family: var(--md-font-family);
      }

      .context-menu-item:hover .shortcut {
        opacity: var(--md-opacity-shortcut-hover);
        color: rgba(255, 255, 255, 0.85);
      }

      .context-menu-separator {
        height: var(--md-dock-separator-width);
        background: var(--md-dock-separator-color);
        margin: var(--md-dock-separator-margin);
      }
    `,
  ]

  /** Layout mode */
  @property({ reflect: true }) layout: 'vertical' | 'horizontal' = 'vertical'

  /** Grid cell size in pixels */
  @property({ type: Number }) cellSize = 90

  /** Grid spacing in pixels */
  @property({ type: Number }) spacing = 8

  /** Padding from desktop edges */
  @property({ type: Number }) padding = 16

  /** Wallpaper image URL */
  @property({ reflect: true }) wallpaper = ''

  /** Whether to show the dock */
  @property({ type: Boolean, reflect: true }) showDock = true

  @query('.selection-rect')
  private _selectionRect!: HTMLDivElement

  @query('.context-menu')
  private _contextMenu!: HTMLDivElement

  @query('.desktop-icons')
  private _desktopIcons!: HTMLDivElement

  // Selection state
  private _selectedIds: Set<string> = new Set()

  // Selection rectangle state
  private _isSelecting = false
  private _selStartX = 0
  private _selStartY = 0

  // Drag state
  private _isDragging = false
  private _draggingIcons: Map<MacDesktopIcon, { startX: number; startY: number }> = new Map()
  private _dragPointerStartX = 0
  private _dragPointerStartY = 0
  private _hasDragMoved = false
  private _dragCleanup: (() => void) | null = null

  // Selection drag cleanup
  private _selDragCleanup: (() => void) | null = null

  override firstUpdated(): void {
    this._arrangeIcons()
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has('layout')) {
      this._arrangeIcons()
    }
  }

  private _getIconElements(): MacDesktopIcon[] {
    return Array.from(this.querySelectorAll('mac-desktop-icon')) as MacDesktopIcon[]
  }

  /**
   * 通过 composedPath 在事件路径中查找 mac-desktop-icon 元素。
   * 这是跨越 Shadow DOM 边界识别事件目标的最可靠方式。
   */
  private _findIconInComposedPath(path: EventTarget[]): MacDesktopIcon | null {
    for (const target of path) {
      if (target instanceof HTMLElement && target.tagName === 'MAC-DESKTOP-ICON') {
        return target as MacDesktopIcon
      }
    }
    return null
  }

  /** Arrange icons according to current layout mode */
  private _arrangeIcons(): void {
    const icons = this._getIconElements()
    if (icons.length === 0) return

    const desktopRect = this._desktopIcons?.getBoundingClientRect()
    if (!desktopRect || desktopRect.width === 0) return

    const { width, height } = desktopRect
    const { cellSize, spacing, padding } = this

    if (this.layout === 'vertical') {
      const maxPerCol = Math.floor((height - padding * 2 + spacing) / (cellSize + spacing))
      icons.forEach((icon, i) => {
        const col = Math.floor(i / maxPerCol)
        const row = i % maxPerCol
        icon.x = padding + col * (cellSize + spacing)
        icon.y = padding + row * (cellSize + spacing)
      })
    } else {
      const maxPerRow = Math.floor((width - padding * 2 + spacing) / (cellSize + spacing))
      icons.forEach((icon, i) => {
        const row = Math.floor(i / maxPerRow)
        const col = i % maxPerRow
        icon.x = padding + col * (cellSize + spacing)
        icon.y = padding + row * (cellSize + spacing)
      })
    }

    this.emit('mac-icons-reorder', { detail: { layout: this.layout } })
  }

  // ─── Selection ───

  private _selectIcon(iconId: string, additive: boolean): void {
    if (!additive) {
      this._selectedIds.clear()
    }
    this._selectedIds.add(iconId)
    this._applySelection()
  }

  private _deselectAll(): void {
    this._selectedIds.clear()
    this._applySelection()
  }

  private _applySelection(): void {
    this._getIconElements().forEach((icon) => {
      icon.selected = this._selectedIds.has(icon.iconId)
    })
  }

  // ─── Selection Rectangle ───

  private _startSelection(clientX: number, clientY: number): void {
    const rect = this._desktopIcons.getBoundingClientRect()
    this._isSelecting = true
    this._selStartX = clientX - rect.left
    this._selStartY = clientY - rect.top
    this._selectionRect.classList.add('active')
    this._updateSelectionRect(this._selStartX, this._selStartY, 0, 0)
  }

  private _updateSelectionRect(x: number, y: number, w: number, h: number): void {
    const sr = this._selectionRect
    sr.style.left = `${x}px`
    sr.style.top = `${y}px`
    sr.style.width = `${w}px`
    sr.style.height = `${h}px`
  }

  private _endSelection(): void {
    this._isSelecting = false
    this._selectionRect.classList.remove('active')
  }

  private _checkSelectionOverlap(sx: number, sy: number, sw: number, sh: number): void {
    const desktopRect = this._desktopIcons.getBoundingClientRect()
    this._getIconElements().forEach((icon) => {
      const iconRect = icon.getBoundingClientRect()
      const ix = iconRect.left - desktopRect.left
      const iy = iconRect.top - desktopRect.top
      const iw = iconRect.width
      const ih = iconRect.height

      const overlaps = ix < sx + sw && ix + iw > sx && iy < sy + sh && iy + ih > sy
      if (overlaps) {
        this._selectedIds.add(icon.iconId)
      } else {
        this._selectedIds.delete(icon.iconId)
      }
    })
    this._applySelection()
  }

  // ─── Icon Drag ───

  private _startIconDrag(clickedIcon: MacDesktopIcon, clientX: number, clientY: number): void {
    const iconId = clickedIcon.iconId

    if (!this._selectedIds.has(iconId)) {
      this._selectIcon(iconId, false)
    }

    this._draggingIcons.clear()
    this._isDragging = true
    this._hasDragMoved = false
    this._dragPointerStartX = clientX
    this._dragPointerStartY = clientY

    this._getIconElements().forEach((icon) => {
      if (this._selectedIds.has(icon.iconId)) {
        this._draggingIcons.set(icon, { startX: icon.x, startY: icon.y })
      }
    })

    const onMove = (ev: MouseEvent | TouchEvent) => {
      ev.preventDefault()
      const cx = 'touches' in ev ? ev.touches[0].clientX : ev.clientX
      const cy = 'touches' in ev ? ev.touches[0].clientY : ev.clientY
      const dx = cx - this._dragPointerStartX
      const dy = cy - this._dragPointerStartY

      if (!this._hasDragMoved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
        this._hasDragMoved = true
        this._draggingIcons.forEach((_pos, icon) => {
          icon.dragging = true
        })
      }

      if (this._hasDragMoved) {
        this._draggingIcons.forEach((startPos, icon) => {
          icon.x = Math.max(0, startPos.startX + dx)
          icon.y = Math.max(0, startPos.startY + dy)
        })
      }
    }

    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onUp)

      this._draggingIcons.forEach((_pos, icon) => {
        icon.dragging = false
      })

      this._isDragging = false
      this._draggingIcons.clear()
      this._dragCleanup = null
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('touchend', onUp)

    this._dragCleanup = onUp
  }

  // ─── Context Menu ───

  private _showContextMenu(x: number, y: number): void {
    const menu = this._contextMenu
    const container = this._desktopIcons
    const containerRect = container.getBoundingClientRect()

    menu.classList.add('visible')

    // 边界检测：菜单显示后再测量实际尺寸
    const menuRect = menu.getBoundingClientRect()
    const menuW = menuRect.width
    const menuH = menuRect.height
    const containerW = containerRect.width
    const containerH = containerRect.height

    // 右边溢出
    if (x + menuW > containerW) {
      x = containerW - menuW - 4
    }
    // 左边溢出
    if (x < 4) {
      x = 4
    }
    // 下边溢出
    if (y + menuH > containerH) {
      y = y - menuH
    }
    // 上边溢出
    if (y < 4) {
      y = 4
    }

    menu.style.left = `${x}px`
    menu.style.top = `${y}px`
  }

  private _hideContextMenu(): void {
    this._contextMenu.classList.remove('visible')
  }

  // ─── Render ───

  override render() {
    return html`
      <div class="desktop" part="base" @contextmenu=${this._onContextMenu}>
        <div class="desktop-wallpaper" part="wallpaper">
          ${this.wallpaper
            ? html`<img
                src="${this.wallpaper}"
                alt=""
                style="width:100%;height:100%;object-fit:cover;"
              />`
            : html`<slot name="wallpaper"></slot>`}
        </div>

        <div class="desktop-icons" @mousedown=${this._onDesktopMouseDown}>
          <slot></slot>
        </div>

        ${this.showDock
          ? html`
              <div class="desktop-dock" part="dock">
                <slot name="dock"></slot>
              </div>
            `
          : ''}

        <div class="selection-rect"></div>

        <div class="context-menu">
          <div class="context-menu-item" @click=${this._onArrangeVertical}>按垂直方向排列</div>
          <div class="context-menu-item" @click=${this._onArrangeHorizontal}>按水平方向排列</div>
          <div class="context-menu-separator"></div>
          <div class="context-menu-item" @click=${this._onCleanUp}>整理图标</div>
          <div class="context-menu-separator"></div>
          <div class="context-menu-item" @click=${this._onSelectAll}>
            全选
            <span class="shortcut">⌘A</span>
          </div>
        </div>
      </div>
    `
  }

  // ─── Event Handlers ───

  private _onDesktopMouseDown(e: MouseEvent): void {
    if (e.button !== 0) return

    const iconEl = this._findIconInComposedPath(e.composedPath())

    if (iconEl) {
      this._hideContextMenu()

      const iconId = iconEl.iconId
      const shiftKey = e.shiftKey

      if (shiftKey) {
        if (this._selectedIds.has(iconId)) {
          this._selectedIds.delete(iconId)
        } else {
          this._selectedIds.add(iconId)
        }
        this._applySelection()
      } else if (!this._selectedIds.has(iconId)) {
        this._selectIcon(iconId, false)
      }

      this._startIconDrag(iconEl, e.clientX, e.clientY)
    } else {
      this._hideContextMenu()
      this._deselectAll()
      this._startSelection(e.clientX, e.clientY)

      const onMove = (ev: MouseEvent) => {
        if (!this._isSelecting) return
        const rect = this._desktopIcons.getBoundingClientRect()
        const cx = ev.clientX - rect.left
        const cy = ev.clientY - rect.top

        const x = Math.min(this._selStartX, cx)
        const y = Math.min(this._selStartY, cy)
        const w = Math.abs(cx - this._selStartX)
        const h = Math.abs(cy - this._selStartY)

        this._updateSelectionRect(x, y, w, h)
        this._checkSelectionOverlap(x, y, w, h)
      }

      const onUp = () => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
        this._endSelection()
        this._selDragCleanup = null
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
      this._selDragCleanup = onUp
    }
  }

  private _onContextMenu(e: MouseEvent): void {
    e.preventDefault()
    const rect = this._desktopIcons.getBoundingClientRect()
    this._showContextMenu(e.clientX - rect.left, e.clientY - rect.top)
  }

  // Context menu actions
  private _onArrangeVertical(): void {
    this.layout = 'vertical'
    this._arrangeIcons()
    this._hideContextMenu()
    this.emit('mac-layout-change', { detail: { layout: 'vertical' } })
  }

  private _onArrangeHorizontal(): void {
    this.layout = 'horizontal'
    this._arrangeIcons()
    this._hideContextMenu()
    this.emit('mac-layout-change', { detail: { layout: 'horizontal' } })
  }

  private _onCleanUp(): void {
    this._arrangeIcons()
    this._hideContextMenu()
  }

  private _onSelectAll(): void {
    this._selectedIds.clear()
    this._getIconElements().forEach((icon) => this._selectedIds.add(icon.iconId))
    this._applySelection()
    this._hideContextMenu()
  }

  // ─── Lifecycle ───

  override connectedCallback(): void {
    super.connectedCallback()
    document.addEventListener('click', this._globalClickHandler)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    document.removeEventListener('click', this._globalClickHandler)
    this._dragCleanup?.()
    this._selDragCleanup?.()
  }

  private _globalClickHandler = (e: MouseEvent): void => {
    if (!this.contains(e.target as Node)) {
      this._hideContextMenu()
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-desktop': MacDesktop
  }
}
