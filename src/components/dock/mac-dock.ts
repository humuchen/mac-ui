import { html, css } from 'lit'
import { property, customElement, query } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'
import type { MacDockItem } from './mac-dock-item'

/**
 * @tag mac-dock
 * @summary 带有液态玻璃背景、放大效果、右键菜单和拖拽移除功能的 macOS 27 Golden Gate 风格 Dock。
 *
 * @slot - 用于放置 mac-dock-item 元素的默认插槽。
 * @slot separator - 区域之间的自定义分隔符内容。
 *
 * @csspart base - Dock 容器。
 * @csspart glass - 液态玻璃背景层。
 * @csspart items - 项目容器。
 *
 * @event mac-dock-item-click - 从 dock 项目转发。Detail: { itemId }
 * @event mac-dock-item-remove - 项目被移除时触发。Detail: { itemId }
 */
@customElement('mac-dock')
export class MacDock extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: flex;
        justify-content: center;
        position: relative;
        z-index: 100;
      }

      .dock {
        position: relative;
        display: flex;
        align-items: flex-end;
        padding: var(--md-dock-padding);
        border-radius: var(--md-radius-dock);
      }

      /* ─── 液态玻璃背景 ─── */

      .dock-glass {
        position: absolute;
        inset: 0;
        border-radius: var(--md-radius-dock);
        background: var(--md-glass-bg);
        backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        -webkit-backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        border: 0.5px solid var(--md-glass-border);
        box-shadow:
          var(--md-shadow-dock),
          inset 0 1px 0 var(--md-glass-highlight-top),
          inset 0 -0.5px 0 var(--md-glass-highlight-bottom);
        pointer-events: none;
        z-index: -1;
      }

      /* ─── 项目容器 ─── */

      .dock-items {
        display: flex;
        align-items: flex-end;
        gap: var(--md-dock-gap);
      }

      /* ─── 分隔符 ─── */

      .dock-separator {
        width: var(--md-separator-width);
        height: var(--md-separator-height);
        background: var(--md-separator-color);
        margin: var(--md-separator-margin);
        align-self: center;
        border-radius: 1px;
        flex-shrink: 0;
      }

      /* ─── 右键菜单（液态玻璃） ─── */

      .dock-context-menu {
        position: fixed;
        z-index: 200;
        min-width: 200px;
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

      .dock-context-menu.visible {
        display: block;
      }

      .dock-context-menu-item {
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

      .dock-context-menu-item:hover {
        background: var(--md-dock-item-hover-bg);
        color: var(--md-dock-item-hover-color);
        box-shadow: var(--md-dock-item-hover-shadow);
      }

      .dock-context-menu-item.danger:hover {
        background: var(--md-dock-item-danger-bg);
        box-shadow: var(--md-dock-item-danger-shadow);
      }

      .dock-context-menu-separator {
        height: var(--md-dock-separator-width);
        background: var(--md-dock-separator-color);
        margin: var(--md-dock-separator-margin);
      }

      /* ─── 拖拽移除区域 ─── */
      .drag-remove-indicator {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        background: var(--md-dock-item-danger-dropzone-bg);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 2px dashed var(--md-dock-item-danger-border);
        border-radius: 20px;
        padding: var(--md-spacing-xl) var(--md-spacing-2xl);
        font-family: var(--md-font-family);
        font-size: var(--md-dock-item-font-size);
        color: var(--md-dock-item-danger-text);
        opacity: 0;
        transition:
          opacity var(--md-transition-drag),
          transform var(--md-transition-drag);
        pointer-events: none;
      }
      /* ─── 拖拽中的项目幽灵 ─── */

      :host {
        --dock-drag-opacity: 1;
      }

      /* ─── 放置指示器 ─── */

      ::slotted(.drop-indicator) {
        width: 3px;
        height: var(--md-icon-size, 48px);
        background: var(--md-mac-accent, #007aff);
        border-radius: 2px;
        align-self: center;
        margin: 0 2px;
        box-shadow: 0 0 6px rgba(0, 122, 255, 0.5);
      }
    `,
  ]

  /** 放大比例因子（1.0 = 不放大） */
  @property({ type: Number }) magnification = 1.6

  /** 基础图标大小，单位为像素 */
  @property({ type: Number }) iconSize = 48

  /** 放大范围，单位为像素（影响邻近项目的光标距离） */
  @property({ type: Number }) magnifyRange = 120

  /** Dock 的位置 */
  @property({ reflect: true }) position: 'bottom' | 'left' | 'right' = 'bottom'

  @query('.dock-items')
  private _dockItems!: HTMLDivElement

  @query('.dock-context-menu')
  private _contextMenu!: HTMLDivElement

  private _isHovering = false
  private _rafId: number | null = null

  // 右键菜单状态
  private _contextMenuItem: MacDockItem | null = null

  // 拖拽移除状态
  private _isDragging = false
  private _dragItem: MacDockItem | null = null
  private _dragStartX = 0
  private _dragStartY = 0
  private _dragOffsetX = 0
  private _dragOffsetY = 0
  private _hasDragMoved = false
  private _dragGhost: HTMLElement | null = null
  private _lastMoveEvent: MouseEvent | null = null
  private _dragCleanup: (() => void) | null = null

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('mac-dock-item-click', this._forwardItemClick as EventListener)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('mac-dock-item-click', this._forwardItemClick as EventListener)
    if (this._rafId) cancelAnimationFrame(this._rafId)
    document.removeEventListener('click', this._globalClickHandler)
    this._dragCleanup?.()
  }

  private _forwardItemClick(e: CustomEvent): void {
    this.emit('mac-dock-item-click', { detail: e.detail })
  }

  private _getDockItems(): MacDockItem[] {
    return Array.from(this.querySelectorAll('mac-dock-item')) as MacDockItem[]
  }

  private _findDockItemInPath(path: EventTarget[]): MacDockItem | null {
    for (const target of path) {
      if (target instanceof HTMLElement && target.tagName === 'MAC-DOCK-ITEM') {
        return target as MacDockItem
      }
    }
    return null
  }

  /**
   * 核心放大算法：根据鼠标位置计算每个图标的缩放比例。
   * 使用高斯分布，距离鼠标越近的图标放大越多，实现 macOS 风格的平滑放大效果。
   */
  private _applyMagnification(clientX: number, clientY: number): void {
    const items = this._getDockItems()
    if (items.length === 0) return

    const isHorizontal = this.position === 'bottom'
    const cursorPos = isHorizontal ? clientX : clientY

    items.forEach((item) => {
      if (item === this._dragItem) return
      const itemRect = item.getBoundingClientRect()
      const itemCenter = isHorizontal
        ? itemRect.left + itemRect.width / 2
        : itemRect.top + itemRect.height / 2

      const distance = Math.abs(cursorPos - itemCenter)
      const maxDist = this.magnifyRange

      let scale = 1
      if (distance < maxDist) {
        const ratio = distance / maxDist
        scale = 1 + (this.magnification - 1) * (0.5 + 0.5 * Math.cos(ratio * Math.PI))
      }

      item.style.transform = `scale(${scale})`
      item.style.transformOrigin = isHorizontal ? 'bottom center' : 'center left'

      // 放大时增加水平 margin，撑开图标间距
      const extraMargin = (scale - 1) * this.iconSize * 0.3
      if (isHorizontal) {
        item.style.marginLeft = `${extraMargin}px`
        item.style.marginRight = `${extraMargin}px`
      } else {
        item.style.marginTop = `${extraMargin}px`
        item.style.marginBottom = `${extraMargin}px`
      }
    })
  }

  private _resetMagnification(): void {
    const items = this._getDockItems()
    items.forEach((item) => {
      item.style.transform = 'scale(1)'
      item.style.marginLeft = ''
      item.style.marginRight = ''
      item.style.marginTop = ''
      item.style.marginBottom = ''
    })
  }

  // ─── 右键菜单（通过事件委托） ───

  private _onDockContextMenu(e: MouseEvent): void {
    e.stopPropagation()
    e.preventDefault()
    const item = this._findDockItemInPath(e.composedPath())
    if (!item) return

    this._contextMenuItem = item
    let x = e.clientX
    let y = e.clientY

    this._contextMenu.classList.add('visible')

    // 边界检测：菜单显示后再测量实际尺寸
    const menuRect = this._contextMenu.getBoundingClientRect()
    const menuW = menuRect.width
    const menuH = menuRect.height

    // 右边溢出
    if (x + menuW > window.innerWidth) {
      x = window.innerWidth - menuW - 4
    }
    // 左边溢出
    if (x < 4) {
      x = 4
    }
    // 下边溢出
    if (y + menuH > window.innerHeight) {
      y = y - menuH
    }
    // 上边溢出
    if (y < 4) {
      y = 4
    }

    this._contextMenu.style.left = `${x}px`
    this._contextMenu.style.top = `${y}px`

    document.addEventListener('click', this._globalClickHandler, { once: true })
  }

  private _globalClickHandler = (e: MouseEvent): void => {
    if (!this.contains(e.target as Node)) {
      this._hideContextMenu()
    }
  }

  private _hideContextMenu(): void {
    this._contextMenu?.classList.remove('visible')
    this._contextMenuItem = null
  }

  private _onContextMenuOpen(): void {
    // macOS "选项" 占位符
  }

  private _onContextRemoveFromDock(): void {
    if (this._contextMenuItem) {
      const itemId = this._contextMenuItem.itemId
      this.emit('mac-dock-item-remove', { detail: { itemId } })
      this._contextMenuItem.remove()
    }
    this._hideContextMenu()
  }

  // ─── 拖拽移除（通过 mousedown 事件委托） ───

  private _cleanupDrag(): void {
    if (this._dragCleanup) {
      this._dragCleanup()
      this._dragCleanup = null
    }
  }

  private _onDockMouseDown(e: MouseEvent): void {
    this._hideContextMenu()
    if (e.button !== 0) return

    const item = this._findDockItemInPath(e.composedPath())
    if (!item) return

    // 阻止事件冒泡到 desktop 组件触发框选
    e.stopPropagation()

    // 清理之前的拖拽状态和监听器
    this._cleanupDrag()

    this._dragItem = item
    this._dragStartX = e.clientX
    this._dragStartY = e.clientY
    this._hasDragMoved = false
    this._isDragging = false

    // 记录鼠标在图标内的偏移比例（0~1）
    const itemRect = item.getBoundingClientRect()
    this._dragOffsetX = (e.clientX - itemRect.left) / itemRect.width
    this._dragOffsetY = (e.clientY - itemRect.top) / itemRect.height

    const onMove = (ev: MouseEvent) => {
      this._lastMoveEvent = ev
      const dx = ev.clientX - this._dragStartX
      const dy = ev.clientY - this._dragStartY

      if (!this._hasDragMoved && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        this._hasDragMoved = true
        this._isDragging = true
        this._resetMagnification()
        this._createDragGhost(item)
        item.style.opacity = '0.3'
      }

      if (this._hasDragMoved && this._dragGhost) {
        const ghostSize = 48
        this._dragGhost.style.left = `${ev.clientX - ghostSize * this._dragOffsetX}px`
        this._dragGhost.style.top = `${ev.clientY - ghostSize * this._dragOffsetY}px`

        const dockRect = this.getBoundingClientRect()
        const isOutsideDock =
          ev.clientX < dockRect.left ||
          ev.clientX > dockRect.right ||
          ev.clientY < dockRect.top - 20 ||
          ev.clientY > dockRect.bottom + 20

        const removeZone = this.shadowRoot?.querySelector('.drag-remove-zone')
        if (removeZone) {
          removeZone.classList.toggle('active', isOutsideDock)
        }

        // 拖拽排序：检测目标位置
        if (!isOutsideDock) {
          this._updateDropIndicator(ev.clientX)
        } else {
          this._removeDropIndicator()
        }
      }
    }

    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      this._dragCleanup = null

      if (this._hasDragMoved) {
        const dockRect = this.getBoundingClientRect()
        const lastMoveEvent = this._lastMoveEvent
        const isOutsideDock = lastMoveEvent
          ? lastMoveEvent.clientX < dockRect.left ||
            lastMoveEvent.clientX > dockRect.right ||
            lastMoveEvent.clientY < dockRect.top - 20 ||
            lastMoveEvent.clientY > dockRect.bottom + 20
          : false

        if (isOutsideDock && this._dragItem) {
          const itemId = this._dragItem.itemId
          this.emit('mac-dock-item-remove', { detail: { itemId } })
          this._dragItem.remove()
        } else if (this._dragItem) {
          // 在 dock 内放下：执行排序
          const targetItem = this._findDropTarget(lastMoveEvent?.clientX ?? 0)
          if (targetItem && targetItem !== this._dragItem) {
            const items = this._getDockItems()
            const dragIdx = items.indexOf(this._dragItem)
            const targetIdx = items.indexOf(targetItem)
            if (dragIdx < targetIdx) {
              this.insertBefore(this._dragItem, targetItem.nextSibling)
            } else {
              this.insertBefore(this._dragItem, targetItem)
            }
            this.emit('mac-dock-item-reorder', {
              detail: {
                itemId: this._dragItem.itemId,
                targetItemId: targetItem.itemId,
              },
            })
          }
          this._dragItem.style.opacity = '1'
        }

        this._removeDragGhost()
        this._removeDropIndicator()
        const removeZone = this.shadowRoot?.querySelector('.drag-remove-zone')
        if (removeZone) removeZone.classList.remove('active')
      }

      this._isDragging = false
      this._dragItem = null
      this._hasDragMoved = false
      this._lastMoveEvent = null
    }

    this._dragCleanup = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      if (this._dragItem) {
        this._dragItem.style.opacity = '1'
      }
      this._removeDragGhost()
      this._removeDropIndicator()
      const removeZone = this.shadowRoot?.querySelector('.drag-remove-zone')
      if (removeZone) removeZone.classList.remove('active')
      this._isDragging = false
      this._dragItem = null
      this._hasDragMoved = false
      this._lastMoveEvent = null
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  private _createDragGhost(item: MacDockItem): void {
    const ghost = document.createElement('div')
    const iconRect = this._dragItem?.shadowRoot
      ?.querySelector('.dock-item-icon')
      ?.getBoundingClientRect() ?? { left: 0, top: 0 }

    ghost.style.cssText = `
      position: fixed;
      z-index: 10000;
      pointer-events: none;
      width: 48px;
      height: 48px;
      left: ${iconRect.left}px;
      top: ${iconRect.top}px;
      border-radius: 12px;
      filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.35));
      transition: none;
    `

    // 复制图标视觉内容
    const iconEl = item.shadowRoot?.querySelector('.default-icon') as HTMLElement | null
    if (iconEl) {
      const clone = iconEl.cloneNode(true) as HTMLElement
      clone.style.cssText = `
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        color: #fff;
        font-weight: 600;
        background: ${item.color};
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.12);
      `
      ghost.appendChild(clone)
    } else {
      // 自定义图标（slot 内容）：用 canvas 截图
      const iconContainer = item.shadowRoot?.querySelector('.dock-item-icon') as HTMLElement | null
      if (iconContainer) {
        const slotted = iconContainer.querySelector('slot')
        if (slotted && slotted.assignedNodes().length > 0) {
          const img = slotted.assignedNodes().find((n) => n instanceof HTMLImageElement) as
            HTMLImageElement | undefined
          if (img) {
            const imgClone = document.createElement('img')
            imgClone.src = img.src
            imgClone.style.cssText = 'width:48px;height:48px;object-fit:cover;border-radius:12px;'
            ghost.appendChild(imgClone)
          }
        }
      }
    }

    document.body.appendChild(ghost)
    this._dragGhost = ghost
  }

  private _removeDragGhost(): void {
    if (this._dragGhost) {
      this._dragGhost.remove()
      this._dragGhost = null
    }
  }

  // ─── 放置指示器与重新排序 ───

  private _dropIndicator: HTMLDivElement | null = null

  private _findDropTarget(clientX: number): MacDockItem | null {
    const items = this._getDockItems().filter((i) => i !== this._dragItem)
    if (items.length === 0) return null

    let closest: MacDockItem | null = null
    let closestDist = Infinity

    for (const item of items) {
      const rect = item.getBoundingClientRect()
      const center = rect.left + rect.width / 2
      const dist = Math.abs(clientX - center)
      if (dist < closestDist) {
        closestDist = dist
        closest = item
      }
    }
    return closest
  }

  private _updateDropIndicator(clientX: number): void {
    const targetItem = this._findDropTarget(clientX)
    if (!targetItem || targetItem === this._dragItem) {
      this._removeDropIndicator()
      return
    }

    if (!this._dropIndicator) {
      this._dropIndicator = document.createElement('div')
      this._dropIndicator.className = 'drop-indicator'
    }

    const targetRect = targetItem.getBoundingClientRect()
    const targetCenter = targetRect.left + targetRect.width / 2
    const insertBefore = clientX < targetCenter

    // 将指示器插入到 slot 容器中（light DOM）
    if (insertBefore) {
      targetItem.parentNode?.insertBefore(this._dropIndicator, targetItem)
    } else {
      targetItem.parentNode?.insertBefore(this._dropIndicator, targetItem.nextSibling)
    }
  }

  private _removeDropIndicator(): void {
    if (this._dropIndicator) {
      this._dropIndicator.remove()
      this._dropIndicator = null
    }
  }

  // ─── 事件处理 ───

  private _onMouseMove(e: MouseEvent): void {
    if (!this._isHovering || this._isDragging) return
    this._applyMagnification(e.clientX, e.clientY)
  }

  private _onMouseEnter(): void {
    this._isHovering = true
  }

  private _onMouseLeave(): void {
    this._isHovering = false
    this._resetMagnification()
  }

  override render() {
    return html`
      <div
        class="dock"
        part="base"
        @mousemove=${this._onMouseMove}
        @mouseenter=${this._onMouseEnter}
        @mouseleave=${this._onMouseLeave}
        @mousedown=${this._onDockMouseDown}
        @contextmenu=${this._onDockContextMenu}
      >
        <div class="dock-glass" part="glass"></div>
        <div class="dock-items" part="items">
          <slot></slot>
        </div>

        <!-- Right-click context menu -->
        <div class="dock-context-menu">
          <div class="dock-context-menu-item" @click=${this._onContextMenuOpen}>选项</div>
          <div class="dock-context-menu-separator"></div>
          <div class="dock-context-menu-item danger" @click=${this._onContextRemoveFromDock}>
            从 Dock 中移除
          </div>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-dock': MacDock
  }
}
