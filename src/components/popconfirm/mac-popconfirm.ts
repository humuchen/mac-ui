import { html, css, nothing } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-popconfirm
 * @summary A macOS-style popover confirmation component.
 *
 * @slot - The trigger element.
 * @slot action - Custom action buttons (replaces default confirm/cancel).
 *
 * @cssproperty --md-popconfirm-bg - Popover background.
 * @cssproperty --md-popconfirm-border - Popover border.
 * @cssproperty --md-popconfirm-shadow - Popover shadow.
 * @cssproperty --md-popconfirm-radius - Popover border radius.
 * @cssproperty --md-popconfirm-padding - Popover padding.
 * @cssproperty --md-popconfirm-icon-color - Icon color.
 * @cssproperty --md-popconfirm-title-color - Title text color.
 * @cssproperty --md-popconfirm-title-font-size - Title font size.
 * @cssproperty --md-popconfirm-desc-color - Description text color.
 * @cssproperty --md-popconfirm-desc-font-size - Description font size.
 * @cssproperty --md-popconfirm-btn-gap - Action button gap.
 *
 * @event mac-popconfirm-confirm - Emitted when confirm button is clicked.
 * @event mac-popconfirm-cancel - Emitted when cancel button is clicked.
 * @event mac-popconfirm-open - Emitted when popover opens.
 * @event mac-popconfirm-close - Emitted when popover closes.
 */
@customElement('mac-popconfirm')
export class MacPopconfirm extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: inline-block;
        --md-popconfirm-bg: rgba(246, 246, 246, 0.88);
        --md-popconfirm-border: rgba(0, 0, 0, 0.06);
        --md-popconfirm-shadow: 0 8px 40px rgba(0, 0, 0, 0.12), 0 2px 12px rgba(0, 0, 0, 0.06);
        --md-popconfirm-radius: var(--md-radius-lg);
        --md-popconfirm-padding: var(--md-spacing-lg);
        --md-popconfirm-icon-color: #f5a623;
        --md-popconfirm-title-color: var(--md-color-text);
        --md-popconfirm-title-font-size: var(--md-font-size-base);
        --md-popconfirm-desc-color: var(--md-color-text-secondary);
        --md-popconfirm-desc-font-size: var(--md-font-size-sm);
        --md-popconfirm-btn-gap: var(--md-spacing-sm);
      }

      .trigger {
        display: inline-flex;
        cursor: pointer;
      }
    `,
  ]

  /** Confirmation title text */
  @property() title = ''

  /** Confirmation description text */
  @property() description = ''

  /** Confirm button text */
  @property({ attribute: 'confirm-text' }) confirmText = '确认'

  /** Cancel button text */
  @property({ attribute: 'cancel-text' }) cancelText = '取消'

  /** Whether the confirm button is in danger style */
  @property({ type: Boolean, attribute: 'danger' }) danger = false

  /** Whether to show the icon */
  @property({ type: Boolean, attribute: 'show-icon' }) showIcon = true

  /** Popover placement */
  @property() placement:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end' = 'top'

  /** Trigger mode */
  @property() trigger: 'click' | 'hover' = 'click'

  /** Whether the popconfirm is disabled */
  @property({ type: Boolean }) disabled = false

  /** Width of the popover */
  @property({ type: String }) width = '240px'

  @state() private _visible = false

  private _popoverEl: HTMLElement | null = null
  private _hoverTimeout: ReturnType<typeof setTimeout> | null = null
  private _popoverId = `popconfirm-${Math.random().toString(36).slice(2, 9)}`

  private static _portalStylesInjected = false

  override connectedCallback(): void {
    super.connectedCallback()
    MacPopconfirm._injectPortalStyles()
    document.addEventListener('mousedown', this._handleDocumentClick)
    document.addEventListener('keydown', this._handleKeyDown)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    document.removeEventListener('mousedown', this._handleDocumentClick)
    document.removeEventListener('keydown', this._handleKeyDown)
    this._removePopover()
    if (this._hoverTimeout) clearTimeout(this._hoverTimeout)
  }

  override willUpdate(): void {
    const theme = this._resolvedTheme
    if (theme) {
      this.setAttribute('data-theme', theme)
    } else {
      this.removeAttribute('data-theme')
    }
  }

  private static _injectPortalStyles(): void {
    if (MacPopconfirm._portalStylesInjected) return
    MacPopconfirm._portalStylesInjected = true

    const style = document.createElement('style')
    style.id = 'mac-popconfirm-portal-styles'
    style.textContent = `
      .mac-popconfirm-portal {
        position: fixed;
        z-index: 99999;
        min-width: 200px;
        background: var(--md-popconfirm-bg, rgba(246, 246, 246, 0.88));
        backdrop-filter: blur(40px) saturate(200%);
        -webkit-backdrop-filter: blur(40px) saturate(200%);
        border: 0.5px solid var(--md-popconfirm-border, rgba(0, 0, 0, 0.06));
        border-radius: var(--md-popconfirm-radius, 12px);
        box-shadow: var(--md-popconfirm-shadow, 0 8px 40px rgba(0, 0, 0, 0.12), 0 2px 12px rgba(0, 0, 0, 0.06));
        padding: var(--md-popconfirm-padding, 16px);
        opacity: 0;
        transform: scale(0.96);
        pointer-events: none;
        transition: opacity 180ms cubic-bezier(0.4, 0, 0.2, 1),
                    transform 180ms cubic-bezier(0.4, 0, 0.2, 1);
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
      }

      .mac-popconfirm-portal.visible {
        opacity: 1;
        transform: scale(1);
        pointer-events: auto;
      }

      /* Arrow */
      .mac-popconfirm-portal .popconfirm-arrow {
        position: absolute;
        width: 10px;
        height: 10px;
        background: var(--md-popconfirm-bg, rgba(246, 246, 246, 0.88));
        border: 0.5px solid var(--md-popconfirm-border, rgba(0, 0, 0, 0.06));
        transform: rotate(45deg);
      }

      .mac-popconfirm-portal[data-placement^="top"] .popconfirm-arrow {
        bottom: -5.5px;
        border-top: none;
        border-left: none;
      }

      .mac-popconfirm-portal[data-placement^="bottom"] .popconfirm-arrow {
        top: -5.5px;
        border-bottom: none;
        border-right: none;
      }

      .mac-popconfirm-portal[data-placement^="left"] .popconfirm-arrow {
        right: -5.5px;
        border-bottom: none;
        border-left: none;
      }

      .mac-popconfirm-portal[data-placement^="right"] .popconfirm-arrow {
        left: -5.5px;
        border-top: none;
        border-right: none;
      }

      /* Content */
      .mac-popconfirm-portal .popconfirm-body {
        display: flex;
        gap: 10px;
      }

      .mac-popconfirm-portal .popconfirm-icon {
        flex-shrink: 0;
        display: flex;
        align-items: flex-start;
        padding-top: 1px;
        color: var(--md-popconfirm-icon-color, #f5a623);
      }

      .mac-popconfirm-portal .popconfirm-icon svg {
        width: 18px;
        height: 18px;
      }

      .mac-popconfirm-portal .popconfirm-content {
        flex: 1;
        min-width: 0;
      }

      .mac-popconfirm-portal .popconfirm-title {
        font-size: var(--md-popconfirm-title-font-size, 14px);
        font-weight: 500;
        color: var(--md-popconfirm-title-color, rgba(0, 0, 0, 0.88));
        line-height: 1.5;
      }

      .mac-popconfirm-portal .popconfirm-desc {
        font-size: var(--md-popconfirm-desc-font-size, 13px);
        color: var(--md-popconfirm-desc-color, rgba(0, 0, 0, 0.45));
        line-height: 1.5;
        margin-top: 4px;
      }

      .mac-popconfirm-portal .popconfirm-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: var(--md-popconfirm-btn-gap, 8px);
        margin-top: 12px;
      }

      .mac-popconfirm-portal .popconfirm-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 28px;
        padding: 0 14px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 400;
        cursor: pointer;
        transition: background 150ms, color 150ms, border-color 150ms;
        border: 0.5px solid rgba(0, 0, 0, 0.12);
        background: rgba(255, 255, 255, 0.8);
        color: rgba(0, 0, 0, 0.88);
        white-space: nowrap;
        user-select: none;
      }

      .mac-popconfirm-portal .popconfirm-btn:hover {
        background: rgba(255, 255, 255, 1);
      }

      .mac-popconfirm-portal .popconfirm-btn:active {
        background: rgba(240, 240, 240, 0.9);
      }

      .mac-popconfirm-portal .popconfirm-btn-confirm {
        background: rgba(0, 122, 255, 0.88);
        color: #fff;
        border-color: transparent;
      }

      .mac-popconfirm-portal .popconfirm-btn-confirm:hover {
        background: rgba(0, 100, 220, 0.92);
      }

      .mac-popconfirm-portal .popconfirm-btn-confirm:active {
        background: rgba(0, 80, 190, 0.95);
      }

      .mac-popconfirm-portal .popconfirm-btn-danger {
        background: rgba(220, 53, 46, 0.88);
        color: #fff;
        border-color: transparent;
      }

      .mac-popconfirm-portal .popconfirm-btn-danger:hover {
        background: rgba(200, 40, 35, 0.92);
      }

      .mac-popconfirm-portal .popconfirm-btn-danger:active {
        background: rgba(180, 30, 25, 0.95);
      }

      /* Dark Mode */
      @media (prefers-color-scheme: dark) {
        .mac-popconfirm-portal {
          --md-popconfirm-bg: rgba(40, 40, 40, 0.92);
          --md-popconfirm-border: rgba(255, 255, 255, 0.08);
          --md-popconfirm-shadow: 0 8px 40px rgba(0, 0, 0, 0.3), 0 2px 12px rgba(0, 0, 0, 0.2);
          --md-popconfirm-title-color: rgba(255, 255, 255, 0.92);
          --md-popconfirm-desc-color: rgba(255, 255, 255, 0.45);
          --md-popconfirm-icon-color: #f5a623;
        }

        .mac-popconfirm-portal .popconfirm-arrow {
          background: rgba(40, 40, 40, 0.92);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .mac-popconfirm-portal .popconfirm-btn {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.88);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .mac-popconfirm-portal .popconfirm-btn:hover {
          background: rgba(255, 255, 255, 0.12);
        }
      }

      .mac-popconfirm-portal[data-theme='dark'] {
        --md-popconfirm-bg: rgba(40, 40, 40, 0.92);
        --md-popconfirm-border: rgba(255, 255, 255, 0.08);
        --md-popconfirm-shadow: 0 8px 40px rgba(0, 0, 0, 0.3), 0 2px 12px rgba(0, 0, 0, 0.2);
        --md-popconfirm-title-color: rgba(255, 255, 255, 0.92);
        --md-popconfirm-desc-color: rgba(255, 255, 255, 0.45);
        --md-popconfirm-icon-color: #f5a623;
      }

      .mac-popconfirm-portal[data-theme='dark'] .popconfirm-arrow {
        background: rgba(40, 40, 40, 0.92);
        border-color: rgba(255, 255, 255, 0.08);
      }

      .mac-popconfirm-portal[data-theme='dark'] .popconfirm-btn {
        background: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.88);
        border-color: rgba(255, 255, 255, 0.12);
      }

      .mac-popconfirm-portal[data-theme='dark'] .popconfirm-btn:hover {
        background: rgba(255, 255, 255, 0.12);
      }
    `
    document.head.appendChild(style)
  }

  private _applyThemeVars(): void {
    const isDark = this._resolvedTheme === 'dark'

    const root = this._popoverEl || document.documentElement
    if (isDark) {
      root.style.setProperty('--md-popconfirm-bg', 'rgba(40, 40, 40, 0.92)')
      root.style.setProperty('--md-popconfirm-border', 'rgba(255, 255, 255, 0.08)')
      root.style.setProperty(
        '--md-popconfirm-shadow',
        '0 8px 40px rgba(0,0,0,0.3), 0 2px 12px rgba(0,0,0,0.2)',
      )
      root.style.setProperty('--md-popconfirm-title-color', 'rgba(255, 255, 255, 0.92)')
      root.style.setProperty('--md-popconfirm-desc-color', 'rgba(255, 255, 255, 0.45)')
    } else {
      root.style.setProperty('--md-popconfirm-bg', 'rgba(246, 246, 246, 0.88)')
      root.style.setProperty('--md-popconfirm-border', 'rgba(0, 0, 0, 0.06)')
      root.style.setProperty(
        '--md-popconfirm-shadow',
        '0 8px 40px rgba(0,0,0,0.12), 0 2px 12px rgba(0,0,0,0.06)',
      )
      root.style.setProperty('--md-popconfirm-title-color', 'rgba(0, 0, 0, 0.88)')
      root.style.setProperty('--md-popconfirm-desc-color', 'rgba(0, 0, 0, 0.45)')
    }
  }

  // ─── Event Handlers ───

  private _handleDocumentClick = (e: Event): void => {
    if (!this._visible || !this._popoverEl) return
    const target = e.target as Node
    if (this._popoverEl.contains(target) || this.contains(target)) return
    this._hide()
  }

  private _handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this._visible) {
      e.preventDefault()
      this._cancel()
    }
  }

  private _handleTriggerClick(e: Event): void {
    if (this.disabled) return
    if (this.trigger !== 'click') return
    e.preventDefault()
    this._visible ? this._hide() : this._show()
  }

  private _handleMouseEnter(): void {
    if (this.disabled || this.trigger !== 'hover') return
    if (this._hoverTimeout) clearTimeout(this._hoverTimeout)
    this._hoverTimeout = setTimeout(() => this._show(), 150)
  }

  private _handleMouseLeave(): void {
    if (this.trigger !== 'hover') return
    if (this._hoverTimeout) clearTimeout(this._hoverTimeout)
    this._hoverTimeout = setTimeout(() => this._hide(), 200)
  }

  // ─── Show / Hide ───

  private _show(): void {
    if (this._visible) return
    this._visible = true
    this._createPopover()
    this.emit('mac-popconfirm-open')
  }

  private _hide(): void {
    if (!this._visible) return
    this._visible = false
    this._removePopover()
    this.emit('mac-popconfirm-close')
  }

  private _confirm(): void {
    this.emit('mac-popconfirm-confirm')
    this._hide()
  }

  private _cancel(): void {
    this.emit('mac-popconfirm-cancel')
    this._hide()
  }

  // ─── Positioning ───

  private _calcPosition(
    anchorRect: DOMRect,
    popoverRect: { width: number; height: number },
  ): { left: number; top: number; adjustedPlacement: string } {
    const gap = 10
    const pw = popoverRect.width
    const ph = popoverRect.height
    const vw = window.innerWidth
    const vh = window.innerHeight

    let left = 0
    let top = 0
    let adjustedPlacement: MacPopconfirm['placement'] = this.placement

    const place = (placement: string) => {
      switch (placement) {
        case 'top':
          left = anchorRect.left + anchorRect.width / 2 - pw / 2
          top = anchorRect.top - ph - gap
          break
        case 'top-start':
          left = anchorRect.left
          top = anchorRect.top - ph - gap
          break
        case 'top-end':
          left = anchorRect.right - pw
          top = anchorRect.top - ph - gap
          break
        case 'bottom':
          left = anchorRect.left + anchorRect.width / 2 - pw / 2
          top = anchorRect.bottom + gap
          break
        case 'bottom-start':
          left = anchorRect.left
          top = anchorRect.bottom + gap
          break
        case 'bottom-end':
          left = anchorRect.right - pw
          top = anchorRect.bottom + gap
          break
        case 'left':
          left = anchorRect.left - pw - gap
          top = anchorRect.top + anchorRect.height / 2 - ph / 2
          break
        case 'left-start':
          left = anchorRect.left - pw - gap
          top = anchorRect.top
          break
        case 'left-end':
          left = anchorRect.left - pw - gap
          top = anchorRect.bottom - ph
          break
        case 'right':
          left = anchorRect.right + gap
          top = anchorRect.top + anchorRect.height / 2 - ph / 2
          break
        case 'right-start':
          left = anchorRect.right + gap
          top = anchorRect.top
          break
        case 'right-end':
          left = anchorRect.right + gap
          top = anchorRect.bottom - ph
          break
      }
    }

    place(this.placement)

    // Auto-flip: if overflows viewport, try opposite placement
    const isTop = this.placement.startsWith('top')
    const isBottom = this.placement.startsWith('bottom')
    const isLeft = this.placement.startsWith('left')
    const isRight = this.placement.startsWith('right')

    if (isTop && top < 8) {
      const flipped = this.placement.replace('top', 'bottom') as MacPopconfirm['placement']
      const prevTop = top
      place(flipped)
      if (top + ph <= vh - 8) {
        adjustedPlacement = flipped
      } else {
        top = prevTop // revert
      }
    } else if (isBottom && top + ph > vh - 8) {
      const flipped = this.placement.replace('bottom', 'top') as MacPopconfirm['placement']
      const prevTop = top
      place(flipped)
      if (top >= 8) {
        adjustedPlacement = flipped
      } else {
        top = prevTop
      }
    } else if (isLeft && left < 8) {
      const flipped = this.placement.replace('left', 'right') as MacPopconfirm['placement']
      const prevLeft = left
      place(flipped)
      if (left + pw <= vw - 8) {
        adjustedPlacement = flipped
      } else {
        left = prevLeft
      }
    } else if (isRight && left + pw > vw - 8) {
      const flipped = this.placement.replace('right', 'left') as MacPopconfirm['placement']
      const prevLeft = left
      place(flipped)
      if (left >= 8) {
        adjustedPlacement = flipped
      } else {
        left = prevLeft
      }
    }

    // Clamp to viewport
    if (left + pw > vw - 8) left = vw - pw - 8
    if (left < 8) left = 8
    if (top + ph > vh - 8) top = vh - ph - 8
    if (top < 8) top = 8

    return { left, top, adjustedPlacement }
  }

  private _positionArrow(popover: HTMLElement, anchorRect: DOMRect): void {
    const arrow = popover.querySelector('.popconfirm-arrow') as HTMLElement
    if (!arrow) return

    const popoverRect = popover.getBoundingClientRect()
    const placement = popover.getAttribute('data-placement') || this.placement

    arrow.style.left = ''
    arrow.style.top = ''
    arrow.style.right = ''
    arrow.style.bottom = ''

    const arrowSize = 10
    const halfArrow = arrowSize / 2
    const padding = 14 // min distance from edge

    if (placement.startsWith('top') || placement.startsWith('bottom')) {
      const anchorCenter = anchorRect.left + anchorRect.width / 2
      let arrowLeft = anchorCenter - popoverRect.left - halfArrow
      arrowLeft = Math.max(padding, Math.min(popoverRect.width - padding - arrowSize, arrowLeft))
      arrow.style.left = `${arrowLeft}px`
    } else {
      const anchorCenter = anchorRect.top + anchorRect.height / 2
      let arrowTop = anchorCenter - popoverRect.top - halfArrow
      arrowTop = Math.max(padding, Math.min(popoverRect.height - padding - arrowSize, arrowTop))
      arrow.style.top = `${arrowTop}px`
    }
  }

  // ─── Portal ───

  private _createPopover(): void {
    this._removePopover()

    const triggerEl = this.shadowRoot?.querySelector('.trigger')
    const anchorRect = triggerEl?.getBoundingClientRect()
    if (!anchorRect) return

    const popover = document.createElement('div')
    popover.id = this._popoverId
    popover.className = 'mac-popconfirm-portal'
    popover.setAttribute('data-placement', this.placement)
    const resolvedTheme = this._resolvedTheme
    if (resolvedTheme) {
      popover.setAttribute('data-theme', resolvedTheme)
    }
    popover.style.width = this.width

    // Arrow
    const arrow = document.createElement('div')
    arrow.className = 'popconfirm-arrow'
    popover.appendChild(arrow)

    // Body
    const body = document.createElement('div')
    body.className = 'popconfirm-body'

    // Icon
    if (this.showIcon) {
      const iconWrap = document.createElement('div')
      iconWrap.className = 'popconfirm-icon'
      iconWrap.innerHTML = `<svg viewBox="0 0 18 18" fill="currentColor"><path d="M9 2.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM9 1a8 8 0 110 16A8 8 0 019 1zm-.25 4.5a.75.75 0 011.5 0v4a.75.75 0 01-1.5 0v-4zM9 12a1 1 0 100 2 1 1 0 000-2z"/></svg>`
      body.appendChild(iconWrap)
    }

    // Content
    const content = document.createElement('div')
    content.className = 'popconfirm-content'

    if (this.title) {
      const titleEl = document.createElement('div')
      titleEl.className = 'popconfirm-title'
      titleEl.textContent = this.title
      content.appendChild(titleEl)
    }

    if (this.description) {
      const descEl = document.createElement('div')
      descEl.className = 'popconfirm-desc'
      descEl.textContent = this.description
      content.appendChild(descEl)
    }

    body.appendChild(content)
    popover.appendChild(body)

    // Actions
    const actions = document.createElement('div')
    actions.className = 'popconfirm-actions'

    // Check for custom action slot
    const customActionSlot = this.querySelector('[slot="action"]')
    if (customActionSlot) {
      actions.appendChild(customActionSlot.cloneNode(true))
    } else {
      // Cancel button
      const cancelBtn = document.createElement('button')
      cancelBtn.className = 'popconfirm-btn popconfirm-btn-cancel'
      cancelBtn.textContent = this.cancelText
      cancelBtn.addEventListener('click', () => this._cancel())
      actions.appendChild(cancelBtn)

      // Confirm button
      const confirmBtn = document.createElement('button')
      confirmBtn.className = `popconfirm-btn popconfirm-btn-confirm${this.danger ? ' popconfirm-btn-danger' : ''}`
      confirmBtn.textContent = this.confirmText
      confirmBtn.addEventListener('click', () => this._confirm())
      actions.appendChild(confirmBtn)
    }

    popover.appendChild(actions)

    // Hover keep-alive
    popover.addEventListener('mouseenter', () => {
      if (this.trigger === 'hover' && this._hoverTimeout) {
        clearTimeout(this._hoverTimeout)
        this._hoverTimeout = null
      }
    })
    popover.addEventListener('mouseleave', () => {
      if (this.trigger === 'hover') {
        if (this._hoverTimeout) clearTimeout(this._hoverTimeout)
        this._hoverTimeout = setTimeout(() => this._hide(), 200)
      }
    })

    // Render invisibly first to measure actual dimensions
    popover.style.visibility = 'hidden'
    popover.style.left = '-9999px'
    popover.style.top = '-9999px'
    document.body.appendChild(popover)
    this._popoverEl = popover

    // Measure and position
    requestAnimationFrame(() => {
      if (!this._popoverEl) return
      const popoverRect = popover.getBoundingClientRect()
      const { left, top, adjustedPlacement } = this._calcPosition(anchorRect, {
        width: popoverRect.width,
        height: popoverRect.height,
      })

      popover.setAttribute('data-placement', adjustedPlacement)
      popover.style.left = `${left}px`
      popover.style.top = `${top}px`
      popover.style.visibility = ''

      this._positionArrow(popover, anchorRect)
      popover.classList.add('visible')
    })
  }

  private _removePopover(): void {
    if (this._popoverEl) {
      this._popoverEl.classList.remove('visible')
      const el = this._popoverEl
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el)
      }, 180)
      this._popoverEl = null
    }
  }

  override render() {
    return html`
      <div
        class="trigger"
        @click=${this._handleTriggerClick}
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
      >
        <slot></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-popconfirm': MacPopconfirm
  }
}
