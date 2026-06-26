import { html, css, nothing } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'
import {
  pad,
  fmtDate,
  prsDate,
  sameDay,
  weekStart,
  weekNumber,
  calDays,
  WDS,
  MNS,
  QNS,
} from './date-picker-utils'

export type PickerType = 'date' | 'datetime' | 'year' | 'quarter' | 'week'
export type PanelView = 'day' | 'month' | 'year'

@customElement('mac-date-picker')
export class MacDatePicker extends BaseElement {
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
        flex-shrink: 0;
      }
      .picker-icon ::slotted(*) {
        display: flex;
        align-items: center;
        justify-content: center;
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

      .picker-panel {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        width: 288px;
        background: var(--md-color-bg);
        border: 1px solid var(--md-color-border);
        border-radius: 12px;
        box-shadow:
          0 12px 40px rgba(0, 0, 0, 0.12),
          0 4px 12px rgba(0, 0, 0, 0.08);
        z-index: 1000;
        opacity: 0;
        transform: translateY(-8px) scale(0.96);
        pointer-events: none;
        transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
        padding: 16px;
      }
      .picker-panel.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }
      .picker-panel--range {
        width: 580px;
        display: flex;
        gap: var(--md-spacing-md);
      }
      .picker-panel--inline {
        position: static;
        opacity: 1;
        transform: none;
        pointer-events: auto;
        box-shadow: none;
      }

      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }
      .panel-header-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--md-color-text);
        cursor: pointer;
        padding: 2px 8px;
        border-radius: var(--md-radius-md);
        transition: background 150ms;
      }
      .panel-header-title:hover {
        background: rgba(0, 0, 0, 0.04);
      }
      .panel-nav {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .panel-nav-btn {
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
      .panel-nav-btn:hover {
        background: rgba(0, 0, 0, 0.06);
        color: var(--md-color-text);
      }

      .panel-weekdays {
        display: grid;
        grid-template-columns: 32px repeat(7, 1fr);
        gap: 2px;
        margin-bottom: 4px;
      }
      .panel-weekdays--no-week {
        grid-template-columns: repeat(7, 1fr);
      }
      .weekday {
        text-align: center;
        font-size: 11px;
        font-weight: 500;
        color: #9ca3af;
        padding: 4px 0;
      }

      .panel-days {
        display: grid;
        grid-template-columns: 32px repeat(7, 1fr);
        gap: 2px;
      }
      .panel-days--no-week {
        grid-template-columns: repeat(7, 1fr);
      }
      .week-num {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        font-size: 10px;
        color: var(--md-color-text-secondary);
        opacity: 0.5;
        cursor: pointer;
        border: none;
        background: transparent;
        padding: 0;
        border-radius: var(--md-radius-sm);
      }
      .week-num:hover {
        color: var(--md-color-primary);
        opacity: 1;
        background: rgba(0, 122, 255, 0.06);
      }
      .day {
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
      .day:hover:not(.day--disabled):not(.day--selected):not(.day--in-range) {
        background: rgba(0, 122, 255, 0.1);
        border-radius: 50%;
      }
      .day--other {
        color: var(--md-color-text-secondary);
        opacity: 0.35;
      }
      .day--today {
        color: var(--md-color-primary);
        font-weight: 600;
        border: 1px solid var(--md-color-primary);
        border-radius: 50%;
      }
      .day--selected {
        background: var(--md-color-primary);
        color: #fff;
        border-radius: 50%;
      }
      .day--selected:hover {
        background: var(--md-color-primary-hover);
      }
      .day--disabled {
        opacity: 0.3;
        cursor: not-allowed;
        text-decoration: line-through;
      }
      .day--in-range {
        background: rgba(0, 122, 255, 0.08);
        border-radius: 0;
      }
      .day--range-start {
        background: var(--md-color-primary);
        color: #fff;
        border-radius: 50% 0 0 50%;
      }
      .day--range-end {
        background: var(--md-color-primary);
        color: #fff;
        border-radius: 0 50% 50% 0;
      }

      .panel-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }
      .grid-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 48px;
        border: none;
        background: transparent;
        border-radius: var(--md-radius-lg);
        cursor: pointer;
        font-size: var(--md-font-size-sm);
        color: var(--md-color-text);
        transition: all 150ms;
        padding: 0;
      }
      .grid-cell:hover:not(.grid-cell--disabled):not(.grid-cell--selected) {
        background: rgba(0, 122, 255, 0.1);
      }
      .grid-cell--selected {
        background: var(--md-color-primary);
        color: #fff;
      }
      .grid-cell--selected:hover {
        background: var(--md-color-primary-hover);
      }
      .grid-cell--disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .panel-year-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
      }
      .year-cell {
        height: 40px;
        font-size: var(--md-font-size-sm);
      }

      .time-row {
        display: flex;
        align-items: center;
        gap: var(--md-spacing-xs);
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--md-color-border);
        justify-content: center;
      }
      .time-input {
        width: 48px;
        padding: 6px 4px;
        border: 1px solid var(--md-color-border);
        border-radius: var(--md-radius-md);
        font-size: var(--md-font-size-sm);
        text-align: center;
        color: var(--md-color-text);
        background: var(--md-color-bg);
        outline: none;
        transition: border-color 200ms;
      }
      .time-input:focus {
        border-color: var(--md-color-primary);
      }
      .time-sep {
        color: var(--md-color-text-secondary);
        font-size: var(--md-font-size-sm);
      }

      .panel-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--md-color-border);
      }
      .panel-footer-btn {
        font-size: var(--md-font-size-sm);
        color: var(--md-color-primary);
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 4px 12px;
        border-radius: var(--md-radius-md);
        transition: background 150ms;
      }
      .panel-footer-btn:hover {
        background: rgba(0, 122, 255, 0.08);
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
      :host([data-theme='dark']) .panel-nav-btn:hover {
        background: rgba(255, 255, 255, 0.08);
      }
      :host([data-theme='dark']) .day--selected {
        background: var(--md-color-primary);
      }
      :host([data-theme='dark']) .grid-cell--selected {
        background: var(--md-color-primary);
      }
      :host([data-theme='dark']) .panel-footer-btn:hover {
        background: rgba(0, 122, 255, 0.15);
      }
      :host([data-theme='dark']) .time-input {
        background: var(--md-color-bg);
        border-color: var(--md-color-border);
        color: var(--md-color-text);
      }
    `,
  ]

  @property() value = ''
  @property({ attribute: 'default-value' }) defaultValue = ''
  @property() format = 'YYYY-MM-DD'
  @property() placeholder = 'Select date'
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'
  @property({ type: Boolean }) clearable = false
  @property({ type: Boolean, reflect: true }) error = false
  @property({ type: Boolean, reflect: true }) success = false
  @property({ attribute: false }) disabledDate?: (date: Date) => boolean
  @property({ reflect: true }) type: PickerType = 'date'
  @property({ type: Boolean, reflect: true }) panel = false
  @property({ type: Boolean, attribute: 'show-footer' }) showFooter = true

  @state() private _open = false
  @state() private _view = new Date()
  @state() private _panelView: PanelView = 'day'
  @state() private _hh = 0
  @state() private _mm = 0
  @state() private _ss = 0

  private get _ctrl() {
    return this.hasAttribute('value')
  }
  private get _resVal() {
    return this._ctrl ? this.value : this.defaultValue
  }
  private get _selDate() {
    return prsDate(this._resVal, this.format)
  }

  override willUpdate() {
    const s = this._resolvedSize
    if (this.getAttribute('size') !== s) this.setAttribute('size', s)
    const t = this._resolvedTheme
    t ? this.setAttribute('data-theme', t) : this.removeAttribute('data-theme')
  }

  override connectedCallback() {
    super.connectedCallback()
    const d = this._selDate
    if (d) {
      this._view = new Date(d.getFullYear(), d.getMonth(), 1)
      this._syncTime(d)
    }
    if (!this.panel) document.addEventListener('click', this._onDocClick)
  }
  override disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('click', this._onDocClick)
  }

  private _onDocClick = (e: Event) => {
    if (!e.composedPath().includes(this)) this._close()
  }
  private _toggle() {
    if (this.disabled || this.panel) return
    this._open ? this._close() : this._openPanel()
  }
  private _openPanel() {
    this._open = true
    const d = this._selDate
    if (d) {
      this._view = new Date(d.getFullYear(), d.getMonth(), 1)
      this._syncTime(d)
    }
    this._panelView = this.type === 'year' || this.type === 'quarter' ? 'year' : 'day'
  }
  private _close() {
    if (this.panel) return
    this._open = false
    this._panelView = 'day'
  }
  private _syncTime(d: Date) {
    this._hh = d.getHours()
    this._mm = d.getMinutes()
    this._ss = d.getSeconds()
  }

  private _emit(str: string, date: Date | null) {
    this.emit('mac-change', { detail: { value: str, date } })
  }

  private _pick(date: Date, close = true) {
    if (this.disabledDate && this.disabledDate(date)) return
    let str = fmtDate(date, this.format)
    if (this.type === 'week') {
      const ws = weekStart(date)
      str = fmtDate(ws, this.format)
      date = ws
    }
    if (this._ctrl) this._emit(str, date)
    else {
      this.defaultValue = str
      this._emit(str, date)
    }
    if (close && !this.panel) this._close()
  }

  private _pickQuarter(y: number, q: number) {
    const date = new Date(y, q * 3, 1)
    const str = `${y}-Q${q + 1}`
    if (this._ctrl) this._emit(str, date)
    else {
      this.defaultValue = str
      this._emit(str, date)
    }
    this._close()
  }

  private _pickYear(y: number) {
    if (this.type === 'year') {
      const date = new Date(y, 0, 1)
      const str = String(y)
      if (this._ctrl) this._emit(str, date)
      else {
        this.defaultValue = str
        this._emit(str, date)
      }
      this._close()
    } else {
      this._view = new Date(y, this._view.getMonth(), 1)
      this._panelView = this.type === 'quarter' ? 'year' : 'month'
    }
  }

  private _pickMonth(m: number) {
    this._view = new Date(this._view.getFullYear(), m, 1)
    this._panelView = 'day'
  }

  private _prev() {
    if (this._panelView === 'year') this._view = new Date(this._view.getFullYear() - 12, 0, 1)
    else if (this._panelView === 'month') this._view = new Date(this._view.getFullYear() - 1, 0, 1)
    else this._view = new Date(this._view.getFullYear(), this._view.getMonth() - 1, 1)
  }
  private _next() {
    if (this._panelView === 'year') this._view = new Date(this._view.getFullYear() + 12, 0, 1)
    else if (this._panelView === 'month') this._view = new Date(this._view.getFullYear() + 1, 0, 1)
    else this._view = new Date(this._view.getFullYear(), this._view.getMonth() + 1, 1)
  }

  private _today() {
    this._pick(new Date())
  }
  private _clear(e: Event) {
    e.stopPropagation()
    if (this._ctrl) this._emit('', null)
    else {
      this.defaultValue = ''
      this._emit('', null)
    }
  }

  private _timeChange(which: 'h' | 'm' | 's', v: string) {
    const n = parseInt(v, 10)
    if (isNaN(n)) return
    if (which === 'h') this._hh = Math.max(0, Math.min(23, n))
    if (which === 'm') this._mm = Math.max(0, Math.min(59, n))
    if (which === 's') this._ss = Math.max(0, Math.min(59, n))
    const d = this._selDate
    if (d) {
      const nd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), this._hh, this._mm, this._ss)
      const str = fmtDate(nd, this.format)
      if (this._ctrl) this._emit(str, nd)
      else {
        this.defaultValue = str
        this._emit(str, nd)
      }
    }
  }

  private _onKey(e: KeyboardEvent) {
    if (this.disabled || this.panel) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this._toggle()
    }
    if (e.key === 'Escape') this._close()
  }

  /* ── render helpers ── */
  private _renderHeader(title: string, clickable = false) {
    return html`
      <div class="panel-header">
        <span
          class="panel-header-title"
          ?clickable=${clickable}
          @click=${clickable ? () => (this._panelView = 'month') : undefined}
          >${title}</span
        >
        <div class="panel-nav">
          <button class="panel-nav-btn" @click=${this._prev} tabindex="-1" type="button">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10 4l-4 4 4 4" stroke="currentColor" stroke-width="1.5" fill="none" />
            </svg>
          </button>
          <button class="panel-nav-btn" @click=${this._next} tabindex="-1" type="button">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" />
            </svg>
          </button>
        </div>
      </div>
    `
  }

  private _renderDays() {
    const vy = this._view.getFullYear(),
      vm = this._view.getMonth()
    const days = calDays(vy, vm)
    const sel = this._selDate
    const today = new Date()
    const isWeek = this.type === 'week'
    const selWeek = sel && isWeek ? weekStart(sel) : null

    const rows: { wn: number; days: typeof days }[] = []
    for (let i = 0; i < days.length; i += 7) {
      rows.push({ wn: weekNumber(days[i].date), days: days.slice(i, i + 7) })
    }

    return html`
      <div class="panel-weekdays ${isWeek ? '' : 'panel-weekdays--no-week'}">
        ${isWeek ? html`<div class="weekday"></div>` : nothing}
        ${WDS.map((w) => html`<div class="weekday">${w}</div>`)}
      </div>
      ${rows.map(
        (r) => html`
          <div class="panel-days ${isWeek ? '' : 'panel-days--no-week'}">
            ${isWeek
              ? html`<button
                  class="week-num"
                  @click=${() => this._pick(r.days[0].date)}
                  type="button"
                >
                  W${r.wn}
                </button>`
              : nothing}
            ${r.days.map((d) => {
              const isSel = sel && (isWeek ? sameDay(d.date, selWeek!) : sameDay(d.date, sel))
              const isTod = sameDay(d.date, today)
              const dis = this.disabledDate ? this.disabledDate(d.date) : false
              return html`<button
                class="day ${d.cur ? '' : 'day--other'} ${isTod ? 'day--today' : ''} ${isSel
                  ? 'day--selected'
                  : ''} ${dis ? 'day--disabled' : ''}"
                @click=${() => !dis && this._pick(d.date)}
                type="button"
                tabindex="-1"
              >
                ${d.date.getDate()}
              </button>`
            })}
          </div>
        `,
      )}
    `
  }

  private _renderMonths() {
    const y = this._view.getFullYear()
    const sel = this._selDate
    return html`
      ${this._renderHeader(`${y}年`)}
      <div class="panel-grid">
        ${MNS.map((m, i) => {
          const isSel = sel && sel.getFullYear() === y && sel.getMonth() === i
          return html`<button
            class="grid-cell ${isSel ? 'grid-cell--selected' : ''}"
            @click=${() => this._pickMonth(i)}
            type="button"
          >
            ${m}
          </button>`
        })}
      </div>
    `
  }

  private _renderYears() {
    const sy = this._view.getFullYear() - 6
    const sel = this._selDate
    const selY = sel ? sel.getFullYear() : null
    return html`
      ${this._renderHeader(`${sy} - ${sy + 11}`)}
      <div class="panel-year-grid">
        ${Array.from({ length: 12 }, (_, i) => {
          const y = sy + i
          const isSel = selY === y
          return html`<button
            class="grid-cell year-cell ${isSel ? 'grid-cell--selected' : ''}"
            @click=${() => this._pickYear(y)}
            type="button"
          >
            ${y}
          </button>`
        })}
      </div>
    `
  }

  private _renderQuarters() {
    const y = this._view.getFullYear()
    const sel = this._selDate
    const qv = this._resVal
    return html`
      ${this._renderHeader(`${y}年`)}
      <div class="panel-grid">
        ${QNS.map((q, i) => {
          const isSel = qv === `${y}-Q${i + 1}`
          return html`<button
            class="grid-cell ${isSel ? 'grid-cell--selected' : ''}"
            @click=${() => this._pickQuarter(y, i)}
            type="button"
          >
            ${q}
          </button>`
        })}
      </div>
    `
  }

  private _renderTime() {
    if (this.type !== 'datetime') return nothing
    return html`
      <div class="time-row">
        <input
          class="time-input"
          type="number"
          min="0"
          max="23"
          .value=${pad(this._hh)}
          @change=${(e: Event) => this._timeChange('h', (e.target as HTMLInputElement).value)}
        />
        <span class="time-sep">:</span>
        <input
          class="time-input"
          type="number"
          min="0"
          max="59"
          .value=${pad(this._mm)}
          @change=${(e: Event) => this._timeChange('m', (e.target as HTMLInputElement).value)}
        />
        <span class="time-sep">:</span>
        <input
          class="time-input"
          type="number"
          min="0"
          max="59"
          .value=${pad(this._ss)}
          @change=${(e: Event) => this._timeChange('s', (e.target as HTMLInputElement).value)}
        />
      </div>
    `
  }

  private _renderFooter() {
    return html`
      <div class="panel-footer">
        <button class="panel-footer-btn" @click=${this._today} type="button">今天</button>
        ${this.clearable
          ? html`<button class="panel-footer-btn" @click=${this._clear} type="button">清空</button>`
          : nothing}
      </div>
    `
  }

  override render() {
    const val = this._resVal,
      has = !!val,
      size = this._resolvedSize
    const title =
      this._panelView === 'year'
        ? '选择年份'
        : this._panelView === 'month'
          ? `${this._view.getFullYear()}年`
          : `${this._view.getFullYear()}年${this._view.getMonth() + 1}月`

    const footer = this.showFooter ? this._renderFooter() : nothing
    const panelContent =
      this.type === 'quarter'
        ? html`${this._renderQuarters()}${footer}`
        : this._panelView === 'year'
          ? html`${this._renderYears()}${footer}`
          : this._panelView === 'month'
            ? html`${this._renderMonths()}${footer}`
            : html`${this._renderHeader(
                title,
                true,
              )}${this._renderDays()}${this._renderTime()}${footer}`

    if (this.panel) {
      return html`
        <div class="picker" part="base">
          <div class="picker-panel picker-panel--inline" part="panel">${panelContent}</div>
        </div>
      `
    }

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
          <span class="picker-value ${has ? '' : 'picker-placeholder'}"
            >${has ? val : this.placeholder}</span
          >
          <div style="display:flex;align-items:center;gap:6px;">
            ${this.clearable && has && !this.disabled
              ? html`<button class="picker-clear" @click=${this._clear} tabindex="-1" type="button">
                  ✕
                </button>`
              : nothing}
            <span class="picker-icon">
              <slot name="icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                >
                  <rect x="2" y="3" width="12" height="11" rx="1.5" />
                  <path d="M2 7h12" />
                  <path d="M5 1.5v3M11 1.5v3" />
                </svg>
              </slot>
            </span>
          </div>
        </div>

        <div
          class="picker-panel ${this._open ? 'open' : ''}"
          part="panel"
          role="dialog"
          aria-label="Date picker"
        >
          ${panelContent}
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-date-picker': MacDatePicker
  }
}
