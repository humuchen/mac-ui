import { html, css, nothing, render } from 'lit'
import { property, customElement, state, query } from 'lit/decorators.js'
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

      /* 内联面板模式（当 panel=true 时） */
      .picker-panel--inline {
        position: static;
        opacity: 1;
        transform: none;
        pointer-events: auto;
        box-shadow: none;
        width: var(--md-date-picker-panel-width);
        background: var(--md-color-bg);
        border: 1px solid var(--md-color-border);
        border-radius: var(--md-date-picker-panel-border-radius);
        padding: var(--md-date-picker-panel-padding);
      }

      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--md-date-picker-header-margin-bottom);
      }
      .panel-header-title {
        font-size: var(--md-date-picker-header-font-size);
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
        width: var(--md-date-picker-nav-btn-size);
        height: var(--md-date-picker-nav-btn-size);
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
        grid-template-columns: var(--md-date-picker-week-num-width) repeat(7, 1fr);
        gap: var(--md-date-picker-day-gap);
        margin-bottom: 4px;
      }
      .panel-weekdays--no-week {
        grid-template-columns: repeat(7, 1fr);
      }
      .weekday {
        text-align: center;
        font-size: var(--md-date-picker-weekday-font-size);
        font-weight: 500;
        color: #9ca3af;
        padding: 4px 0;
      }

      .panel-days {
        display: grid;
        grid-template-columns: var(--md-date-picker-week-num-width) repeat(7, 1fr);
        gap: var(--md-date-picker-day-gap);
      }
      .panel-days--no-week {
        grid-template-columns: repeat(7, 1fr);
      }
      .week-num {
        display: flex;
        align-items: center;
        justify-content: center;
        height: var(--md-date-picker-week-num-height);
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
        height: var(--md-date-picker-day-height);
        border: none;
        background: transparent;
        border-radius: var(--md-radius-sm);
        cursor: pointer;
        font-size: var(--md-font-size-sm);
        color: var(--md-color-text);
        transition: all 150ms;
        padding: 0;
      }
      .day:hover:not(.day--disabled):not(.day--today):not(.day--in-range) {
        background: rgba(0, 122, 255, 0.1);
        border-radius: 50%;
      }
      .day--other {
        color: var(--md-color-text-secondary);
        opacity: 0.35;
      }
      .day--today {
        background: var(--md-color-primary);
        color: #fff;
        border-radius: 50%;
      }
      .day--today:hover {
        background: var(--md-color-primary-hover);
      }
      .day--selected {
        color: var(--md-color-primary);
        font-weight: 600;
        border: 1px solid var(--md-color-primary);
        border-radius: 50%;
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
        gap: var(--md-date-picker-grid-gap);
      }
      .grid-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        height: var(--md-date-picker-grid-cell-height);
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
        gap: var(--md-date-picker-grid-gap);
      }
      .year-cell {
        height: var(--md-date-picker-year-cell-height);
        font-size: var(--md-font-size-sm);
      }

      .time-row {
        display: flex;
        align-items: center;
        gap: var(--md-spacing-xs);
        margin-top: var(--md-date-picker-footer-margin-top);
        padding-top: var(--md-date-picker-footer-margin-top);
        border-top: 1px solid var(--md-color-border);
        justify-content: center;
      }
      .time-input {
        width: var(--md-date-picker-time-input-width);
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
        margin-top: var(--md-date-picker-footer-margin-top);
        padding-top: var(--md-date-picker-footer-margin-top);
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

      :host([size='sm']) {
        --md-date-picker-panel-width: var(--sm-date-picker-panel-width);
        --md-date-picker-panel-padding: var(--sm-date-picker-panel-padding);
        --md-date-picker-panel-border-radius: var(--sm-date-picker-panel-border-radius);
        --md-date-picker-day-height: var(--sm-date-picker-day-height);
        --md-date-picker-nav-btn-size: var(--sm-date-picker-nav-btn-size);
        --md-date-picker-header-font-size: var(--sm-date-picker-header-font-size);
        --md-date-picker-header-margin-bottom: var(--sm-date-picker-header-margin-bottom);
        --md-date-picker-week-num-width: var(--sm-date-picker-week-num-width);
        --md-date-picker-week-num-height: var(--sm-date-picker-week-num-height);
        --md-date-picker-weekday-font-size: var(--sm-date-picker-weekday-font-size);
        --md-date-picker-grid-gap: var(--sm-date-picker-grid-gap);
        --md-date-picker-grid-cell-height: var(--sm-date-picker-grid-cell-height);
        --md-date-picker-year-cell-height: var(--sm-date-picker-year-cell-height);
        --md-date-picker-time-input-width: var(--sm-date-picker-time-input-width);
        --md-date-picker-footer-margin-top: var(--sm-date-picker-footer-margin-top);
        --md-date-picker-day-gap: var(--sm-date-picker-day-gap);
      }
      :host([size='lg']) {
        --md-date-picker-panel-width: var(--lg-date-picker-panel-width);
        --md-date-picker-panel-padding: var(--lg-date-picker-panel-padding);
        --md-date-picker-panel-border-radius: var(--lg-date-picker-panel-border-radius);
        --md-date-picker-day-height: var(--lg-date-picker-day-height);
        --md-date-picker-nav-btn-size: var(--lg-date-picker-nav-btn-size);
        --md-date-picker-header-font-size: var(--lg-date-picker-header-font-size);
        --md-date-picker-header-margin-bottom: var(--lg-date-picker-header-margin-bottom);
        --md-date-picker-week-num-width: var(--lg-date-picker-week-num-width);
        --md-date-picker-week-num-height: var(--lg-date-picker-week-num-height);
        --md-date-picker-weekday-font-size: var(--lg-date-picker-weekday-font-size);
        --md-date-picker-grid-gap: var(--lg-date-picker-grid-gap);
        --md-date-picker-grid-cell-height: var(--lg-date-picker-grid-cell-height);
        --md-date-picker-year-cell-height: var(--lg-date-picker-year-cell-height);
        --md-date-picker-time-input-width: var(--lg-date-picker-time-input-width);
        --md-date-picker-footer-margin-top: var(--lg-date-picker-footer-margin-top);
        --md-date-picker-day-gap: var(--lg-date-picker-day-gap);
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
      :host([data-theme='dark']) .day--today {
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
  @property() placeholder = '选择日期'
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'
  @property({ type: Boolean }) clearable = false
  @property({ type: Boolean, reflect: true }) error = false
  @property({ type: Boolean, reflect: true }) success = false
  @property({ attribute: false }) disabledDate?: (date: Date) => boolean
  @property({ reflect: true }) type: PickerType = 'date'
  @property({ type: Boolean, reflect: true }) panel = false
  @property({
    attribute: 'show-footer',
    converter: {
      fromAttribute: (value: string | null) => {
        if (value === null) return true
        return value !== 'false'
      },
      toAttribute: (value: boolean) => (value ? null : 'false'),
    },
  })
  showFooter = true

  @state() private _open = false
  @state() private _view = new Date()
  @state() private _panelView: PanelView = 'day'
  @state() private _hh = 0
  @state() private _mm = 0
  @state() private _ss = 0

  @query('.picker-trigger') private _trigger!: HTMLElement

  private _portalEl: HTMLElement | null = null
  private _portalId = `mac-date-picker-portal-${Math.random().toString(36).substr(2, 9)}`
  private _scrollHandler: (() => void) | null = null

  private get _ctrl() {
    return this.hasAttribute('value')
  }
  private get _resVal() {
    return this._ctrl ? this.value : this.defaultValue
  }
  private get _selDate() {
    return prsDate(this._resVal, this.format)
  }

  private static _stylesInjected = false
  private static _injectPortalStyles() {
    if (MacDatePicker._stylesInjected) return
    MacDatePicker._stylesInjected = true

    const style = document.createElement('style')
    style.id = 'mac-date-picker-portal-styles'
    style.textContent = `
      /* 为 portal 定义 CSS 变量（以防未被继承） */
      .mac-date-picker-portal {
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

        /* DatePicker 尺寸变量（默认 md） */
        --dp-panel-width: 288px;
        --dp-panel-padding: 16px;
        --dp-panel-border-radius: 12px;
        --dp-day-height: 32px;
        --dp-nav-btn-size: 28px;
        --dp-header-font-size: 15px;
        --dp-header-margin-bottom: 12px;
        --dp-week-num-width: 32px;
        --dp-week-num-height: 32px;
        --dp-weekday-font-size: 11px;
        --dp-grid-gap: 8px;
        --dp-grid-cell-height: 48px;
        --dp-year-cell-height: 40px;
        --dp-time-input-width: 48px;
        --dp-footer-margin-top: 12px;
        --dp-day-gap: 2px;

        position: fixed;
        width: var(--dp-panel-width);
        background: var(--md-color-bg);
        border: 1px solid var(--md-color-border);
        border-radius: var(--dp-panel-border-radius);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08);
        z-index: 99999;
        opacity: 0;
        transform: translateY(-8px) scale(0.96);
        pointer-events: none;
        transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
        padding: var(--dp-panel-padding);
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;
      }
      .mac-date-picker-portal[data-size='sm'] {
        --dp-panel-width: 264px;
        --dp-panel-padding: 12px;
        --dp-panel-border-radius: 10px;
        --dp-day-height: 28px;
        --dp-nav-btn-size: 24px;
        --dp-header-font-size: 14px;
        --dp-header-margin-bottom: 10px;
        --dp-week-num-width: 28px;
        --dp-week-num-height: 28px;
        --dp-weekday-font-size: 10px;
        --dp-grid-gap: 6px;
        --dp-grid-cell-height: 40px;
        --dp-year-cell-height: 34px;
        --dp-time-input-width: 42px;
        --dp-footer-margin-top: 10px;
      }
      .mac-date-picker-portal[data-size='lg'] {
        --dp-panel-width: 320px;
        --dp-panel-padding: 20px;
        --dp-panel-border-radius: 14px;
        --dp-day-height: 38px;
        --dp-nav-btn-size: 32px;
        --dp-header-font-size: 16px;
        --dp-header-margin-bottom: 14px;
        --dp-week-num-width: 38px;
        --dp-week-num-height: 38px;
        --dp-weekday-font-size: 12px;
        --dp-grid-gap: 10px;
        --dp-grid-cell-height: 56px;
        --dp-year-cell-height: 46px;
        --dp-time-input-width: 54px;
        --dp-footer-margin-top: 14px;
      }
      .mac-date-picker-portal.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      /* 面板内容样式 */
      .mac-date-picker-portal .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--dp-header-margin-bottom);
      }
      .mac-date-picker-portal .panel-header-title {
        font-size: var(--dp-header-font-size);
        font-weight: 600;
        color: var(--md-color-text);
        cursor: pointer;
        padding: 2px 8px;
        border-radius: var(--md-radius-md);
        transition: background 150ms;
      }
      .mac-date-picker-portal .panel-header-title:hover {
        background: rgba(0, 0, 0, 0.04);
      }
      .mac-date-picker-portal .panel-nav {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .mac-date-picker-portal .panel-nav-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--dp-nav-btn-size);
        height: var(--dp-nav-btn-size);
        border: none;
        background: transparent;
        border-radius: 50%;
        cursor: pointer;
        color: var(--md-color-text-secondary);
        transition: all 150ms;
        padding: 0;
      }
      .mac-date-picker-portal .panel-nav-btn:hover {
        background: rgba(0, 0, 0, 0.06);
        color: var(--md-color-text);
      }

      .mac-date-picker-portal .panel-weekdays {
        display: grid;
        grid-template-columns: var(--dp-week-num-width) repeat(7, 1fr);
        gap: var(--dp-day-gap);
        margin-bottom: 4px;
      }
      .mac-date-picker-portal .panel-weekdays--no-week {
        grid-template-columns: repeat(7, 1fr);
      }
      .mac-date-picker-portal .weekday {
        text-align: center;
        font-size: var(--dp-weekday-font-size);
        font-weight: 500;
        color: #9ca3af;
        padding: 4px 0;
      }

      .mac-date-picker-portal .panel-days {
        display: grid;
        grid-template-columns: var(--dp-week-num-width) repeat(7, 1fr);
        gap: var(--dp-day-gap);
      }
      .mac-date-picker-portal .panel-days--no-week {
        grid-template-columns: repeat(7, 1fr);
      }
      .mac-date-picker-portal .week-num {
        display: flex;
        align-items: center;
        justify-content: center;
        height: var(--dp-week-num-height);
        font-size: 10px;
        color: var(--md-color-text-secondary);
        opacity: 0.5;
        cursor: pointer;
        border: none;
        background: transparent;
        padding: 0;
        border-radius: var(--md-radius-sm);
      }
      .mac-date-picker-portal .week-num:hover {
        color: var(--md-color-primary);
        opacity: 1;
        background: rgba(0, 122, 255, 0.06);
      }
      .mac-date-picker-portal .day {
        display: flex;
        align-items: center;
        justify-content: center;
        height: var(--dp-day-height);
        border: none;
        background: transparent;
        border-radius: var(--md-radius-sm);
        cursor: pointer;
        font-size: var(--md-font-size-sm);
        color: var(--md-color-text);
        transition: all 150ms;
        padding: 0;
      }
      .mac-date-picker-portal .day:hover:not(.day--disabled):not(.day--today):not(.day--in-range) {
        background: rgba(0, 122, 255, 0.1);
        border-radius: 50%;
      }
      .mac-date-picker-portal .day--other {
        color: var(--md-color-text-secondary);
        opacity: 0.35;
      }
      .mac-date-picker-portal .day--today {
        background: var(--md-color-primary);
        color: #fff;
        border-radius: 50%;
      }
      .mac-date-picker-portal .day--today:hover {
        background: var(--md-color-primary-hover);
      }
      .mac-date-picker-portal .day--selected {
        color: var(--md-color-primary);
        font-weight: 600;
        border: 1px solid var(--md-color-primary);
        border-radius: 50%;
      }
      .mac-date-picker-portal .day--disabled {
        opacity: 0.3;
        cursor: not-allowed;
        text-decoration: line-through;
      }
      .mac-date-picker-portal .day--in-range {
        background: rgba(0, 122, 255, 0.08);
        border-radius: 0;
      }
      .mac-date-picker-portal .day--range-start {
        background: var(--md-color-primary);
        color: #fff;
        border-radius: 50% 0 0 50%;
      }
      .mac-date-picker-portal .day--range-end {
        background: var(--md-color-primary);
        color: #fff;
        border-radius: 0 50% 50% 0;
      }

      .mac-date-picker-portal .panel-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--dp-grid-gap);
      }
      .mac-date-picker-portal .grid-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        height: var(--dp-grid-cell-height);
        border: none;
        background: transparent;
        border-radius: var(--md-radius-lg);
        cursor: pointer;
        font-size: var(--md-font-size-sm);
        color: var(--md-color-text);
        transition: all 150ms;
        padding: 0;
      }
      .mac-date-picker-portal .grid-cell:hover:not(.grid-cell--disabled):not(.grid-cell--selected) {
        background: rgba(0, 122, 255, 0.1);
      }
      .mac-date-picker-portal .grid-cell--selected {
        background: var(--md-color-primary);
        color: #fff;
      }
      .mac-date-picker-portal .grid-cell--selected:hover {
        background: var(--md-color-primary-hover);
      }
      .mac-date-picker-portal .grid-cell--disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .mac-date-picker-portal .panel-year-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--dp-grid-gap);
      }
      .mac-date-picker-portal .year-cell {
        height: var(--dp-year-cell-height);
        font-size: var(--md-font-size-sm);
      }

      .mac-date-picker-portal .time-row {
        display: flex;
        align-items: center;
        gap: var(--md-spacing-xs);
        margin-top: var(--dp-footer-margin-top);
        padding-top: var(--dp-footer-margin-top);
        border-top: 1px solid var(--md-color-border);
        justify-content: center;
      }
      .mac-date-picker-portal .time-input {
        width: var(--dp-time-input-width);
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
      .mac-date-picker-portal .time-input:focus {
        border-color: var(--md-color-primary);
      }
      .mac-date-picker-portal .time-sep {
        color: var(--md-color-text-secondary);
        font-size: var(--md-font-size-sm);
      }

      .mac-date-picker-portal .panel-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: var(--dp-footer-margin-top);
        padding-top: var(--dp-footer-margin-top);
        border-top: 1px solid var(--md-color-border);
      }
      .mac-date-picker-portal .panel-footer-btn {
        font-size: var(--md-font-size-sm);
        color: var(--md-color-primary);
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 4px 12px;
        border-radius: var(--md-radius-md);
        transition: background 150ms;
      }
      .mac-date-picker-portal .panel-footer-btn:hover {
        background: rgba(0, 122, 255, 0.08);
      }

      /* 深色主题 */
      .mac-date-picker-portal[data-theme='dark'] {
        --md-color-text: #ffffff;
        --md-color-text-secondary: rgba(255, 255, 255, 0.6);
        --md-color-border: rgba(255, 255, 255, 0.1);
        --md-color-bg: rgba(30, 30, 30, 0.95);
        --md-color-bg-secondary: rgba(255, 255, 255, 0.05);
        background: var(--md-color-bg);
        border-color: var(--md-color-border);
      }
      .mac-date-picker-portal[data-theme='dark'] .panel-nav-btn:hover {
        background: rgba(255, 255, 255, 0.08);
      }
      .mac-date-picker-portal[data-theme='dark'] .day--today {
        background: var(--md-color-primary);
      }
      .mac-date-picker-portal[data-theme='dark'] .grid-cell--selected {
        background: var(--md-color-primary);
      }
      .mac-date-picker-portal[data-theme='dark'] .panel-footer-btn:hover {
        background: rgba(0, 122, 255, 0.15);
      }
      .mac-date-picker-portal[data-theme='dark'] .time-input {
        background: var(--md-color-bg);
        border-color: var(--md-color-border);
        color: var(--md-color-text);
      }
    `
    document.head.appendChild(style)
  }

  override willUpdate() {
    const s = this._resolvedSize
    if (this.getAttribute('size') !== s) this.setAttribute('size', s)
    const t = this._resolvedTheme
    t ? this.setAttribute('data-theme', t) : this.removeAttribute('data-theme')
    if (this._portalEl) {
      this._portalEl.setAttribute('data-size', s)
      const width = s === 'sm' ? 264 : s === 'lg' ? 320 : 288
      this._portalEl.style.width = `${width}px`
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    MacDatePicker._injectPortalStyles()
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

  private _onDocClick = (e: Event) => {
    if (!this._open) return

    const path = e.composedPath()
    // 如果点击位置同时在触发器和 portal 之外，则关闭
    const isInsideTrigger = path.includes(this)
    const isInsidePortal = this._portalEl && path.includes(this._portalEl)

    if (!isInsideTrigger && !isInsidePortal) {
      this._close()
    }
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
    this._createPortal()
  }
  private _close() {
    if (this.panel) return
    this._open = false
    this._panelView = 'day'
    this._removePortal()
  }

  private _createPortal() {
    this._removePortal()

    if (!this._trigger) return

    const rect = this._trigger.getBoundingClientRect()
    const portal = document.createElement('div')
    portal.id = this._portalId
    portal.className = 'mac-date-picker-portal'
    portal.setAttribute('role', 'dialog')
    portal.setAttribute('aria-label', '日期选择器')

    const theme = this._resolvedTheme
    if (theme) {
      portal.setAttribute('data-theme', theme)
    }

    const size = this._resolvedSize
    portal.setAttribute('data-size', size)

    // 位置
    const left = rect.left
    const top = rect.bottom + 6
    const width = size === 'sm' ? 264 : size === 'lg' ? 320 : 288

    portal.style.left = `${left}px`
    portal.style.top = `${top}px`
    portal.style.width = `${width}px`

    document.body.appendChild(portal)
    this._portalEl = portal

    // 渲染初始内容
    this._updatePortalContent()

    // 添加滚动监听器以更新位置
    this._addScrollListener()

    // 进入动画
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

  /* ── 渲染辅助函数 ── */
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
            ${
              isWeek
                ? html`<button
                    class="week-num"
                    @click=${() => this._pick(r.days[0].date)}
                    type="button"
                  >
                    W${r.wn}
                  </button>`
                : nothing
            }
            ${r.days.map((d) => {
              const isSel = sel && (isWeek ? sameDay(d.date, selWeek!) : sameDay(d.date, sel))
              const isTod = sameDay(d.date, today)
              const dis = this.disabledDate ? this.disabledDate(d.date) : false
              return html`<button
                class="day ${d.cur ? '' : 'day--other'} ${isTod ? 'day--today' : ''} ${
                  isSel ? 'day--selected' : ''
                } ${dis ? 'day--disabled' : ''}"
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
        ${
          this.clearable
            ? html`<button class="panel-footer-btn" @click=${this._clear} type="button">
                清空
              </button>`
            : nothing
        }
      </div>
    `
  }

  override updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties)
    // 状态变化时更新 portal 内容
    if (this._open && this._portalEl && !this.panel) {
      this._updatePortalContent()
    }
  }

  private _updatePortalContent() {
    if (!this._portalEl) return

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

    // 使用 Lit 的 render 函数渲染到 portal（同步）
    render(panelContent, this._portalEl)
  }

  override render() {
    const val = this._resVal,
      has = !!val,
      size = this._resolvedSize

    if (this.panel) {
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

      return html`
        <div class="picker" part="base">
          <div class="picker-panel picker-panel--inline" part="panel">${panelContent}</div>
        </div>
      `
    }

    return html`
      <div class="picker" part="base">
        <div
          class="picker-trigger picker-trigger--${size} ${this._open ? 'open' : ''} ${
            this.error ? 'picker-trigger--error' : ''
          } ${this.success ? 'picker-trigger--success' : ''} ${
            this.disabled ? 'picker-trigger--disabled' : ''
          }"
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
            ${
              this.clearable && has && !this.disabled
                ? html`<button
                    class="picker-clear"
                    @click=${this._clear}
                    tabindex="-1"
                    type="button"
                  >
                    ✕
                  </button>`
                : nothing
            }
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
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-date-picker': MacDatePicker
  }
}
