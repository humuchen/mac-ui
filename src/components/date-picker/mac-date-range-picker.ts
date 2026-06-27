import { html, css, nothing, render } from 'lit'
import { property, customElement, state, query } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'
import { fmtDate, prsDate, sameDay, calDays, WDS } from './date-picker-utils'

function inRange(d: Date, s?: Date, e?: Date) {
  if (!s || !e) return false
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const a = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime()
  const b = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime()
  return t >= Math.min(a, b) && t <= Math.max(a, b)
}

@customElement('mac-date-range-picker')
export class MacDateRangePicker extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
      }
      .picker {
        position: relative;
      }
      .picker-trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--md-spacing-sm);
        padding: var(--md-select-trigger-padding-vertical)
          var(--md-select-trigger-padding-horizontal);
        border-radius: var(--md-radius-lg);
        background: var(--md-color-bg);
        cursor: pointer;
        transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;
        min-height: var(--md-select-trigger-min-height);
        border: 1px solid var(--md-color-border);
      }
      .picker-trigger:hover:not(.picker-trigger--disabled) {
        border-color: var(--md-color-primary);
      }
      .picker-trigger.open,
      .picker-trigger:focus-within {
        border-color: var(--md-color-primary);
        box-shadow:
          0 0 0 3px rgba(0, 122, 255, 0.1),
          0 2px 8px rgba(0, 122, 255, 0.08);
      }
      .picker-trigger--disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
        background: var(--md-color-bg-secondary);
      }
      .picker-trigger--error {
        border-color: var(--md-color-danger);
      }
      .picker-trigger--error.open,
      .picker-trigger--error:focus-within {
        box-shadow:
          0 0 0 3px rgba(255, 59, 48, 0.1),
          0 2px 8px rgba(255, 59, 48, 0.08);
      }
      .picker-trigger--success {
        border-color: var(--md-color-success);
      }
      .picker-value {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .picker-placeholder {
        color: #9ca3af;
      }
      .picker-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        color: #9ca3af;
        transition: transform 200ms;
        flex-shrink: 0;
      }
      .picker-trigger.open .picker-icon {
        transform: rotate(180deg);
      }
      .picker-clear {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border: none;
        background: rgba(0, 0, 0, 0.06);
        border-radius: 50%;
        cursor: pointer;
        color: var(--md-color-text-secondary);
        font-size: 10px;
        transition: all 200ms;
        padding: 0;
        flex-shrink: 0;
      }
      .picker-clear:hover {
        background: rgba(0, 0, 0, 0.1);
        color: var(--md-color-text);
      }

      .picker-trigger--sm {
        padding: var(--sm-select-trigger-padding-vertical)
          var(--sm-select-trigger-padding-horizontal);
        font-size: var(--sm-select-trigger-font-size);
        min-height: var(--sm-select-trigger-min-height);
      }
      .picker-trigger--lg {
        padding: var(--lg-select-trigger-padding-vertical)
          var(--lg-select-trigger-padding-horizontal);
        font-size: var(--lg-select-trigger-font-size);
        min-height: var(--lg-select-trigger-min-height);
      }

      :host([data-theme='dark']) .picker-clear {
        background: rgba(255, 255, 255, 0.1);
      }
      :host([data-theme='dark']) .picker-clear:hover {
        background: rgba(255, 255, 255, 0.15);
      }
    `,
  ]

  @property({ type: Array }) value: [string, string] = ['', '']
  @property({ type: Array, attribute: 'default-value' }) defaultValue: [string, string] = ['', '']
  @property() format = 'YYYY-MM-DD'
  @property() placeholder = 'Select range'
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'
  @property({ type: Boolean }) clearable = false
  @property({ type: Boolean, reflect: true }) error = false
  @property({ type: Boolean, reflect: true }) success = false
  @property({ attribute: false }) disabledDate?: (date: Date) => boolean

  @state() private _open = false
  @state() private _lView = new Date()
  @state() private _rView = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
  @state() private _hoverDate?: Date

  @query('.picker-trigger') private _trigger!: HTMLElement

  private _portalEl: HTMLElement | null = null
  private _portalId = `mac-date-range-picker-portal-${Math.random().toString(36).substr(2, 9)}`
  private _scrollHandler: (() => void) | null = null

  private get _ctrl() {
    return this.hasAttribute('value')
  }
  private get _res() {
    return this._ctrl ? this.value : this.defaultValue
  }
  private get _s() {
    return prsDate(this._res[0], this.format)
  }
  private get _e() {
    return prsDate(this._res[1], this.format)
  }
  private get _hasStart() {
    return !!this._res[0]
  }
  private get _hasEnd() {
    return !!this._res[1]
  }

  private static _stylesInjected = false
  private static _injectPortalStyles() {
    if (MacDateRangePicker._stylesInjected) return
    MacDateRangePicker._stylesInjected = true

    const style = document.createElement('style')
    style.id = 'mac-date-range-picker-portal-styles'
    style.textContent = `
      /* Define CSS variables for portal (in case they're not inherited) */
      .mac-date-range-picker-portal {
        --md-color-primary: #3b82f6;
        --md-color-primary-hover: #2563eb;
        --md-color-primary-active: #1d4ed8;
        --md-color-success: #22c55e;
        --md-color-warning: #f59e0b;
        --md-color-danger: #ef4444;
        --md-color-text: #1f2937;
        --md-color-text-secondary: #6b7280;
        --md-color-border: #d1d5db;
        --md-color-bg: #ffffff;
        --md-color-bg-secondary: #f9fafb;

        --md-spacing-xs: 4px;
        --md-spacing-sm: 8px;
        --md-spacing-md: 12px;
        --md-spacing-lg: 16px;

        --md-radius-sm: 4px;
        --md-radius-md: 6px;
        --md-radius-lg: 8px;

        --md-font-size-xs: 11px;
        --md-font-size-sm: 12px;
        --md-font-size-base: 14px;
        --md-font-size-lg: 16px;

        position: fixed;
        display: flex;
        gap: var(--md-spacing-md);
        background: var(--md-color-bg);
        border: 1px solid var(--md-color-border);
        border-radius: 12px;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08);
        z-index: 99999;
        opacity: 0;
        transform: translateY(-8px) scale(0.96);
        pointer-events: none;
        transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
        padding: 16px;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
      }
      .mac-date-range-picker-portal.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }
      .mac-date-range-picker-portal .panel-col {
        width: 252px;
      }

      .mac-date-range-picker-portal .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }
      .mac-date-range-picker-portal .panel-header-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--md-color-text);
      }
      .mac-date-range-picker-portal .panel-nav {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .mac-date-range-picker-portal .panel-nav-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border: none;
        background: transparent;
        border-radius: 50%;
        cursor: pointer;
        color: var(--md-color-text-secondary);
        transition: all 150ms;
        padding: 0;
      }
      .mac-date-range-picker-portal .panel-nav-btn:hover {
        background: rgba(0, 0, 0, 0.06);
        color: var(--md-color-text);
      }

      .mac-date-range-picker-portal .panel-weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
        margin-bottom: 4px;
      }
      .mac-date-range-picker-portal .weekday {
        text-align: center;
        font-size: 11px;
        font-weight: 500;
        color: #9ca3af;
        padding: 4px 0;
      }
      .mac-date-range-picker-portal .panel-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
      }
      .mac-date-range-picker-portal .day {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        border: none;
        background: transparent;
        border-radius: var(--md-radius-sm);
        cursor: pointer;
        font-size: var(--md-font-size-sm);
        color: var(--md-color-text);
        transition: all 150ms;
        padding: 0;
      }
      .mac-date-range-picker-portal .day:hover:not(.day--disabled):not(.day--selected):not(.day--in-range) {
        background: rgba(0, 122, 255, 0.1);
        border-radius: 50%;
      }
      .mac-date-range-picker-portal .day--other {
        color: var(--md-color-text-secondary);
        opacity: 0.35;
      }
      .mac-date-range-picker-portal .day--today {
        color: var(--md-color-primary);
        font-weight: 600;
        border: 1px solid var(--md-color-primary);
        border-radius: 50%;
      }
      .mac-date-range-picker-portal .day--selected {
        background: var(--md-color-primary);
        color: #fff;
        border-radius: 50%;
      }
      .mac-date-range-picker-portal .day--selected:hover {
        background: var(--md-color-primary-hover);
      }
      .mac-date-range-picker-portal .day--in-range {
        background: rgba(0, 122, 255, 0.08);
        border-radius: 0;
      }
      .mac-date-range-picker-portal .day--range-start {
        background: var(--md-color-primary);
        color: #fff;
        border-radius: 50% 0 0 50%;
      }
      .mac-date-range-picker-portal .day--range-end {
        background: var(--md-color-primary);
        color: #fff;
        border-radius: 0 50% 50% 0;
      }
      .mac-date-range-picker-portal .day--disabled {
        opacity: 0.3;
        cursor: not-allowed;
        text-decoration: line-through;
      }

      .mac-date-range-picker-portal .panel-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--md-color-border);
      }
      .mac-date-range-picker-portal .panel-footer-btn {
        font-size: var(--md-font-size-sm);
        color: var(--md-color-primary);
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 4px 12px;
        border-radius: var(--md-radius-md);
        transition: background 150ms;
      }
      .mac-date-range-picker-portal .panel-footer-btn:hover {
        background: rgba(0, 122, 255, 0.08);
      }

      /* Dark theme */
      .mac-date-range-picker-portal[data-theme='dark'] {
        --md-color-text: #ffffff;
        --md-color-text-secondary: rgba(255, 255, 255, 0.6);
        --md-color-border: rgba(255, 255, 255, 0.1);
        --md-color-bg: rgba(30, 30, 30, 0.95);
        --md-color-bg-secondary: rgba(255, 255, 255, 0.05);
        background: var(--md-color-bg);
        border-color: var(--md-color-border);
      }
      .mac-date-range-picker-portal[data-theme='dark'] .panel-nav-btn:hover {
        background: rgba(255, 255, 255, 0.08);
      }
      .mac-date-range-picker-portal[data-theme='dark'] .day--selected {
        background: var(--md-color-primary);
      }
      .mac-date-range-picker-portal[data-theme='dark'] .day--range-start,
      .mac-date-range-picker-portal[data-theme='dark'] .day--range-end {
        background: var(--md-color-primary);
      }
      .mac-date-range-picker-portal[data-theme='dark'] .panel-footer-btn:hover {
        background: rgba(0, 122, 255, 0.15);
      }
    `
    document.head.appendChild(style)
  }

  override willUpdate() {
    const s = this._resolvedSize
    if (this.getAttribute('size') !== s) this.setAttribute('size', s)
    const t = this._resolvedTheme
    t ? this.setAttribute('data-theme', t) : this.removeAttribute('data-theme')
  }

  override connectedCallback() {
    super.connectedCallback()
    MacDateRangePicker._injectPortalStyles()
    const s = this._s,
      e = this._e
    if (s) this._lView = new Date(s.getFullYear(), s.getMonth(), 1)
    if (e) this._rView = new Date(e.getFullYear(), e.getMonth(), 1)
    else this._rView = new Date(this._lView.getFullYear(), this._lView.getMonth() + 1, 1)
    document.addEventListener('click', this._onDoc)
  }
  override disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('click', this._onDoc)
    this._removeScrollListener()
    this._removePortal()
  }

  private _addScrollListener() {
    if (this._scrollHandler) return
    this._scrollHandler = () => {
      if (this._open && this._portalEl && this._trigger) {
        const rect = this._trigger.getBoundingClientRect()
        this._portalEl.style.left = `${rect.left}px`
        this._portalEl.style.top = `${rect.bottom + 6}px`
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

  private _onDoc = (e: Event) => {
    if (!this._open) return

    const path = e.composedPath()
    // Close if click is outside both the trigger and the portal
    const isInsideTrigger = path.includes(this)
    const isInsidePortal = this._portalEl && path.includes(this._portalEl)

    if (!isInsideTrigger && !isInsidePortal) {
      this._close()
    }
  }
  private _toggle() {
    if (this.disabled) return
    this._open ? this._close() : this._openP()
  }
  private _openP() {
    this._open = true
    const s = this._s,
      e = this._e
    if (s) this._lView = new Date(s.getFullYear(), s.getMonth(), 1)
    if (e) this._rView = new Date(e.getFullYear(), e.getMonth(), 1)
    else this._rView = new Date(this._lView.getFullYear(), this._lView.getMonth() + 1, 1)
    this._createPortal()
  }
  private _close() {
    this._open = false
    this._hoverDate = undefined
    this._removePortal()
  }

  private _createPortal() {
    this._removePortal()

    if (!this._trigger) return

    const rect = this._trigger.getBoundingClientRect()
    const portal = document.createElement('div')
    portal.id = this._portalId
    portal.className = 'mac-date-range-picker-portal'
    portal.setAttribute('role', 'dialog')
    portal.setAttribute('aria-label', 'Date range picker')

    const theme = this._resolvedTheme
    if (theme) {
      portal.setAttribute('data-theme', theme)
    }

    // Position - center under trigger
    const left = rect.left
    const top = rect.bottom + 6
    const width = 540 // Two panels width

    portal.style.left = `${left}px`
    portal.style.top = `${top}px`
    portal.style.width = `${width}px`

    document.body.appendChild(portal)
    this._portalEl = portal

    // Render initial content
    this._updatePortalContent()

    // Add scroll listener for position updates
    this._addScrollListener()

    // Animate in
    requestAnimationFrame(() => {
      portal.classList.add('open')
    })
  }

  private _removePortal() {
    this._removeScrollListener()
    if (this._portalEl) {
      this._portalEl.classList.remove('open')
      const el = this._portalEl
      setTimeout(() => {
        if (el.parentNode) {
          el.parentNode.removeChild(el)
        }
      }, 200)
      this._portalEl = null
    }
  }

  private _updatePortalContent() {
    if (!this._portalEl) return

    const content = html`
      ${this._renderCal(this._lView, this._prevL, this._nextL)}
      ${this._renderCal(this._rView, this._prevR, this._nextR)}
    `

    // Render to portal using Lit's render function (synchronous)
    render(content, this._portalEl)
  }

  private _emit() {
    const r = this._ctrl ? this.value : this.defaultValue
    this.emit('mac-change', { detail: { value: r, start: r[0], end: r[1] } })
  }

  private _pick(date: Date) {
    if (this.disabledDate && this.disabledDate(date)) return
    const str = fmtDate(date, this.format)
    let nv: [string, string]
    if (!this._hasStart || (this._hasStart && this._hasEnd)) {
      nv = [str, '']
    } else {
      const s = this._s!
      if (date.getTime() < s.getTime()) nv = [str, this._res[0]]
      else nv = [this._res[0], str]
      this._close()
    }
    if (this._ctrl) {
      this.value = nv
      this._emit()
    } else {
      this.defaultValue = nv
      this._emit()
    }
    // Update portal content after state change
    this._updatePortalContent()
  }

  private _prevL() {
    this._lView = new Date(this._lView.getFullYear(), this._lView.getMonth() - 1, 1)
    this._updatePortalContent()
  }
  private _nextL() {
    this._lView = new Date(this._lView.getFullYear(), this._lView.getMonth() + 1, 1)
    this._updatePortalContent()
  }
  private _prevR() {
    this._rView = new Date(this._rView.getFullYear(), this._rView.getMonth() - 1, 1)
    this._updatePortalContent()
  }
  private _nextR() {
    this._rView = new Date(this._rView.getFullYear(), this._rView.getMonth() + 1, 1)
    this._updatePortalContent()
  }

  private _clear(e: Event) {
    e.stopPropagation()
    if (this._ctrl) {
      this.value = ['', '']
      this._emit()
    } else {
      this.defaultValue = ['', '']
      this._emit()
    }
  }

  private _onKey(e: KeyboardEvent) {
    if (this.disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this._toggle()
    }
    if (e.key === 'Escape') this._close()
  }

  private _renderCal(view: Date, prev: () => void, next: () => void) {
    const vy = view.getFullYear(),
      vm = view.getMonth()
    const days = calDays(vy, vm)
    const s = this._s,
      e = this._e,
      h = this._hoverDate
    const today = new Date()
    const hasBoth = this._hasStart && this._hasEnd
    const selecting = this._hasStart && !this._hasEnd

    return html`
      <div class="panel-col">
        <div class="panel-header">
          <span class="panel-header-title">${vy}年${vm + 1}月</span>
          <div class="panel-nav">
            <button class="panel-nav-btn" @click=${prev} tabindex="-1" type="button">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M10 4l-4 4 4 4" stroke="currentColor" stroke-width="1.5" fill="none" />
              </svg>
            </button>
            <button class="panel-nav-btn" @click=${next} tabindex="-1" type="button">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" />
              </svg>
            </button>
          </div>
        </div>
        <div class="panel-weekdays">${WDS.map((w) => html`<div class="weekday">${w}</div>`)}</div>
        <div class="panel-days">
          ${days.map((d) => {
            const isS = s && sameDay(d.date, s)
            const isE = e && sameDay(d.date, e)
            const isT = sameDay(d.date, today)
            const dis = this.disabledDate ? this.disabledDate(d.date) : false
            const inR = hasBoth && inRange(d.date, s!, e!)
            const preview = selecting && h && inRange(d.date, s!, h)
            const range = inR || preview
            const start =
              isS || (preview && h && s && h.getTime() < s.getTime() && sameDay(d.date, h))
            const end =
              isE || (preview && h && s && h.getTime() >= s.getTime() && sameDay(d.date, h))
            return html`<button
              class="day ${d.cur ? '' : 'day--other'} ${isT ? 'day--today' : ''} ${start
                ? 'day--range-start'
                : ''} ${end ? 'day--range-end' : ''} ${range && !start && !end
                ? 'day--in-range'
                : ''} ${dis ? 'day--disabled' : ''}"
              @click=${() => !dis && this._pick(d.date)}
              @mouseenter=${() => {
                this._hoverDate = d.date
                this._updatePortalContent()
              }}
              type="button"
              tabindex="-1"
            >
              ${d.date.getDate()}
            </button>`
          })}
        </div>
      </div>
    `
  }

  override updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties)
    // Update portal content when state changes
    if (this._open && this._portalEl) {
      this._updatePortalContent()
    }
  }

  override render() {
    const val = this._res,
      has = val[0] || val[1]
    const txt = val[0] && val[1] ? `${val[0]} ~ ${val[1]}` : val[0] || val[1] || ''
    const size = this._resolvedSize

    return html`
      <div class="picker" part="base">
        <div
          class="picker-trigger picker-trigger--${size} ${this._open ? 'open' : ''} ${this.error
            ? 'picker-trigger--error'
            : ''} ${this.success ? 'picker-trigger--success' : ''} ${this.disabled
            ? 'picker-trigger--disabled'
            : ''}"
          part="trigger"
          @click=${this._toggle}
          @keydown=${this._onKey}
          tabindex=${this.disabled ? '-1' : '0'}
          role="combobox"
          aria-expanded=${this._open}
        >
          <span class="picker-value ${txt ? '' : 'picker-placeholder'}"
            >${txt || this.placeholder}</span
          >
          <div style="display:flex;align-items:center;gap:6px;">
            ${this.clearable && has && !this.disabled
              ? html`<button class="picker-clear" @click=${this._clear} tabindex="-1" type="button">
                  ✕
                </button>`
              : nothing}
            <span class="picker-icon"
              ><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" /></svg
            ></span>
          </div>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-date-range-picker': MacDateRangePicker
  }
}
