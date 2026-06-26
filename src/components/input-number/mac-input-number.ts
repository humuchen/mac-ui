import { html, css, nothing } from 'lit'
import { property, customElement, state, query } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-input-number
 * @summary A number input component with macOS-style design.
 *
 * @slot prefix - Content before the input.
 * @slot suffix - Content after the input.
 *
 * @csspart base - The input's base container.
 * @csspart input - The native input element.
 * @csspart buttons - The step buttons container.
 * @csspart button-plus - The plus step button.
 * @csspart button-minus - The minus step button.
 */
@customElement('mac-input-number')
export class MacInputNumber extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
      }

      .input-wrapper {
        display: flex;
        flex-direction: column;
        gap: var(--md-spacing-xs);
      }

      .input-container {
        position: relative;
        display: flex;
        align-items: center;
        border-radius: var(--md-radius-md);
        background-color: var(--md-color-bg);
        transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
      }

      .input-container--default {
        border: 1px solid var(--md-color-border);
      }

      .input-container--filled {
        border: none;
        background: rgba(0, 0, 0, 0.03);
      }

      .input-container--glass {
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(10px) saturate(180%);
        -webkit-backdrop-filter: blur(10px) saturate(180%);
      }

      .input-container--underline {
        border: none;
        border-bottom: 2px solid var(--md-color-border);
        border-radius: 0;
        background: transparent;
      }

      /* Focus States */
      .input-container--default:focus-within {
        border-color: var(--md-color-primary);
        box-shadow:
          0 0 0 3px rgba(0, 122, 255, 0.1),
          0 2px 8px rgba(0, 122, 255, 0.08);
      }

      .input-container--filled:focus-within {
        background: rgba(0, 0, 0, 0.05);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .input-container--glass:focus-within {
        border-color: rgba(0, 122, 255, 0.5);
        background: rgba(255, 255, 255, 0.12);
        box-shadow:
          0 0 0 3px rgba(0, 122, 255, 0.15),
          0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .input-container--underline:focus-within {
        border-bottom-color: var(--md-color-primary);
        box-shadow: none;
      }

      /* Error State */
      .input-container--error.input-container--default {
        border-color: var(--md-color-danger);
      }

      .input-container--error.input-container--default:focus-within {
        box-shadow:
          0 0 0 3px rgba(255, 59, 48, 0.1),
          0 2px 8px rgba(255, 59, 48, 0.08);
      }

      .input-container--error.input-container--underline {
        border-bottom-color: var(--md-color-danger);
      }

      /* Success State */
      .input-container--success.input-container--default {
        border-color: var(--md-color-success);
      }

      .input-container--success.input-container--default:focus-within {
        box-shadow:
          0 0 0 3px rgba(52, 199, 89, 0.1),
          0 2px 8px rgba(52, 199, 89, 0.08);
      }

      .input-container--success.input-container--underline {
        border-bottom-color: var(--md-color-success);
      }

      /* Warning State */
      .input-container--warning.input-container--default {
        border-color: var(--md-color-warning);
      }

      .input-container--warning.input-container--default:focus-within {
        box-shadow:
          0 0 0 3px rgba(245, 158, 11, 0.1),
          0 2px 8px rgba(245, 158, 11, 0.08);
      }

      .input-container--warning.input-container--underline {
        border-bottom-color: var(--md-color-warning);
      }

      /* Disabled State */
      .input-container--disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: var(--md-color-bg-secondary);
      }

      /* Input */
      .input {
        flex: 1;
        border: none;
        outline: none;
        padding: var(--md-input-padding-vertical) var(--md-input-padding-horizontal);
        font-size: var(--md-input-font-size);
        font-family: inherit;
        color: var(--md-color-text);
        background: transparent;
        min-width: 0;
        text-align: left;
      }

      .input::placeholder {
        color: var(--md-color-text-secondary);
        transition: opacity 200ms;
      }

      .input:focus::placeholder {
        opacity: 0.6;
      }

      .input:disabled {
        cursor: not-allowed;
      }

      /* Slots */
      ::slotted([slot='prefix']),
      ::slotted([slot='suffix']) {
        display: flex;
        align-items: center;
        padding: 0 var(--md-spacing-sm);
        color: var(--md-color-text-secondary);
      }

      /* Step Buttons */
      .buttons {
        display: flex;
        flex-direction: column;
        border-left: 1px solid var(--md-color-border);
        height: 100%;
        min-height: 28px;
      }

      .button-step {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        width: 24px;
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--md-color-text-secondary);
        padding: 0;
        transition: all 150ms;
      }

      .button-step:hover:not(:disabled) {
        background: rgba(0, 0, 0, 0.04);
        color: var(--md-color-text);
      }

      .button-step:active:not(:disabled) {
        background: rgba(0, 0, 0, 0.08);
      }

      .button-step:disabled {
        cursor: not-allowed;
        opacity: 0.4;
      }

      .button-step svg {
        width: 10px;
        height: 10px;
      }

      .button-step--plus {
        border-bottom: 1px solid var(--md-color-border);
      }

      /* Buttons outside */
      .buttons--outside {
        flex-direction: row;
        border-left: none;
        gap: var(--md-spacing-xs);
        padding: 0 var(--md-spacing-xs);
      }

      .buttons--outside .button-step {
        width: 28px;
        height: 28px;
        border-radius: var(--md-radius-sm);
        background: var(--md-color-bg-secondary);
        border: 1px solid var(--md-color-border);
      }

      .buttons--outside .button-step:hover:not(:disabled) {
        background: var(--md-color-bg);
        border-color: var(--md-color-primary);
        color: var(--md-color-primary);
      }

      .buttons--outside .button-step--plus {
        border-bottom: 1px solid var(--md-color-border);
      }

      /* Clear Button */
      .clear-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        margin-right: var(--md-spacing-sm);
        border: none;
        background: rgba(0, 0, 0, 0.06);
        border-radius: 50%;
        cursor: pointer;
        color: var(--md-color-text-secondary);
        font-size: 12px;
        transition: all 200ms;
        padding: 0;
      }

      .clear-button:hover {
        background: rgba(0, 0, 0, 0.1);
        color: var(--md-color-text);
      }

      /* Sizes */
      .input-container--sm .input {
        padding: var(--sm-input-padding-vertical) var(--sm-input-padding-horizontal);
        font-size: var(--sm-input-font-size);
      }

      .input-container--lg .input {
        padding: var(--lg-input-padding-vertical) var(--lg-input-padding-horizontal);
        font-size: var(--lg-input-font-size);
      }

      .input-container--sm .buttons {
        min-height: 24px;
      }

      .input-container--sm .button-step {
        width: 20px;
      }

      .input-container--lg .buttons {
        min-height: 36px;
      }

      .input-container--lg .button-step {
        width: 28px;
      }

      :host([data-theme='dark']) .input-container--filled {
        background: rgba(255, 255, 255, 0.05);
      }

      :host([data-theme='dark']) .input-container--filled:focus-within {
        background: rgba(255, 255, 255, 0.08);
      }

      :host([data-theme='dark']) .input-container--glass {
        background: rgba(255, 255, 255, 0.05);
      }

      :host([data-theme='dark']) .input-container--glass:focus-within {
        background: rgba(255, 255, 255, 0.08);
      }

      :host([data-theme='dark']) .button-step:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.08);
      }

      :host([data-theme='dark']) .button-step:active:not(:disabled) {
        background: rgba(255, 255, 255, 0.12);
      }

      :host([data-theme='dark']) .buttons--outside .button-step {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
      }

      :host([data-theme='dark']) .clear-button {
        background: rgba(255, 255, 255, 0.1);
      }

      :host([data-theme='dark']) .clear-button:hover {
        background: rgba(255, 255, 255, 0.15);
      }
    `,
  ]

  /** The input's value. */
  @property({ type: Number }) value?: number

  /** The default value for uncontrolled mode. */
  @property({ type: Number, attribute: 'default-value' }) defaultValue?: number

  /** The minimum value. */
  @property({ type: Number }) min?: number

  /** The maximum value. */
  @property({ type: Number }) max?: number

  /** The step value. */
  @property({ type: Number }) step = 1

  /** The precision (decimal places). */
  @property({ type: Number }) precision?: number

  /** The input's placeholder. */
  @property() placeholder = ''

  /** The input's size. */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** The visual variant. */
  @property({ reflect: true }) variant: 'default' | 'filled' | 'glass' | 'underline' = 'default'

  /** The input's status. */
  @property({ reflect: true }) status?: 'error' | 'warning' | 'success'

  /** Disables the input. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** Makes the input read-only. */
  @property({ type: Boolean }) readonly = false

  /** Shows step buttons. */
  @property({ type: Boolean, attribute: 'show-button' }) showButton = true

  /** Button placement. */
  @property({ attribute: 'button-placement' }) buttonPlacement: 'inside' | 'outside' = 'inside'

  /** Shows a clear button. */
  @property({ type: Boolean }) clearable = false

  /** The input's name (for forms). */
  @property() name = ''

  /** Enables keyboard control (arrow keys, page up/down). */
  @property({ type: Boolean }) keyboard = true

  @state() private _displayValue = ''

  @state() private _hasFocus = false

  @query('#input') private _input!: HTMLInputElement

  private get _isControlled(): boolean {
    return this.hasAttribute('value')
  }

  private get _resolvedValue(): number | undefined {
    return this._isControlled ? this.value : this.defaultValue
  }

  override connectedCallback() {
    super.connectedCallback()
    // Sync defaults to DOM so CSS :host([attr]) selectors work
    if (!this.hasAttribute('variant')) {
      this.setAttribute('variant', 'default')
    }
    this._syncDisplayValue()
  }

  override willUpdate(changed: Map<string, unknown>) {
    const size = this._resolvedSize
    if (this.getAttribute('size') !== size) {
      this.setAttribute('size', size)
    }
    const theme = this._resolvedTheme
    if (theme) {
      this.setAttribute('data-theme', theme)
    } else {
      this.removeAttribute('data-theme')
    }
    if (changed.has('value') || changed.has('defaultValue')) {
      this._syncDisplayValue()
    }
  }

  private _syncDisplayValue() {
    const val = this._resolvedValue
    this._displayValue = val !== undefined && val !== null ? this._formatValue(val) : ''
  }

  private _formatValue(val: number): string {
    if (this.precision !== undefined && this.precision >= 0) {
      return val.toFixed(this.precision)
    }
    return String(val)
  }

  private _parseValue(str: string): number | undefined {
    const trimmed = str.trim()
    if (trimmed === '' || trimmed === '-') return undefined
    const num = Number(trimmed)
    return Number.isNaN(num) ? undefined : num
  }

  private _clampAndRound(val: number): number {
    let result = val
    if (this.min !== undefined) result = Math.max(this.min, result)
    if (this.max !== undefined) result = Math.min(this.max, result)
    if (this.precision !== undefined && this.precision >= 0) {
      const factor = Math.pow(10, this.precision)
      result = Math.round(result * factor) / factor
    }
    return result
  }

  private _stepValue(direction: number) {
    if (this.disabled || this.readonly) return
    const current = this._resolvedValue ?? 0
    const newVal = this._clampAndRound(current + direction * this.step)
    this._setValue(newVal)
    this.emit('mac-change', { detail: { value: newVal } })
  }

  private _setValue(val: number | undefined) {
    if (this._isControlled) {
      this.emit('mac-input-number', { detail: { value: val } })
    } else {
      this.defaultValue = val
      this.emit('mac-input-number', { detail: { value: val } })
    }
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLInputElement
    const raw = target.value

    // Allow empty, minus sign, and decimal point during typing
    if (raw === '' || raw === '-' || raw === '-.') {
      this._displayValue = raw
      if (!this._isControlled) {
        this.defaultValue = undefined
      }
      this.emit('mac-input-number', { detail: { value: undefined } })
      return
    }

    const num = this._parseValue(raw)
    if (num !== undefined) {
      const clamped = this._clampAndRound(num)
      this._setValue(clamped)
    }
  }

  private _handleChange() {
    const num = this._parseValue(this._displayValue)
    if (num !== undefined) {
      const clamped = this._clampAndRound(num)
      if (clamped !== num) {
        this._setValue(clamped)
      }
    }
    this.emit('mac-change', { detail: { value: this._resolvedValue } })
  }

  private _handleFocus() {
    this._hasFocus = true
    this.emit('mac-focus')
  }

  private _handleBlur() {
    this._hasFocus = false
    this._handleChange()
    this.emit('mac-blur')
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (!this.keyboard || this.disabled || this.readonly) return

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        this._stepValue(1)
        break
      case 'ArrowDown':
        e.preventDefault()
        this._stepValue(-1)
        break
      case 'PageUp':
        e.preventDefault()
        this._stepValue(10)
        break
      case 'PageDown':
        e.preventDefault()
        this._stepValue(-10)
        break
      case 'Home':
        if (this.min !== undefined) {
          e.preventDefault()
          this._setValue(this.min)
          this.emit('mac-change', { detail: { value: this.min } })
        }
        break
      case 'End':
        if (this.max !== undefined) {
          e.preventDefault()
          this._setValue(this.max)
          this.emit('mac-change', { detail: { value: this.max } })
        }
        break
    }
  }

  private _clearInput() {
    this._setValue(undefined)
    this._displayValue = ''
    if (this._input) {
      this._input.value = ''
      this._input.focus()
    }
    this.emit('mac-change', { detail: { value: undefined } })
  }

  private _renderButtons() {
    if (!this.showButton) return nothing

    const isPlusDisabled =
      this.disabled || (this.max !== undefined && (this._resolvedValue ?? 0) >= this.max)
    const isMinusDisabled =
      this.disabled || (this.min !== undefined && (this._resolvedValue ?? 0) <= this.min)

    const buttons = html`
      <div part="buttons" class="buttons ${this.buttonPlacement === 'outside' ? 'buttons--outside' : ''}">
        <button
          part="button-plus"
          class="button-step button-step--plus"
          type="button"
          ?disabled=${isPlusDisabled}
          tabindex="-1"
          @click=${() => this._stepValue(1)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        <button
          part="button-minus"
          class="button-step"
          type="button"
          ?disabled=${isMinusDisabled}
          tabindex="-1"
          @click=${() => this._stepValue(-1)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14" />
          </svg>
        </button>
      </div>
    `

    if (this.buttonPlacement === 'outside') {
      return html`<div style="display:flex;align-items:center;">${buttons}</div>`
    }
    return buttons
  }

  override render() {
    const showClearButton = this.clearable && this._resolvedValue !== undefined && !this.disabled
    const size = this._resolvedSize

    return html`
      <div class="input-wrapper" part="base">
        <div
          class="input-container
            input-container--${this.variant}
            input-container--${size}
            ${this.status === 'error' ? 'input-container--error' : ''}
            ${this.status === 'success' ? 'input-container--success' : ''}
            ${this.status === 'warning' ? 'input-container--warning' : ''}
            ${this.disabled ? 'input-container--disabled' : ''}"
        >
          <slot name="prefix"></slot>
          <input
            id="input"
            part="input"
            class="input"
            type="text"
            inputmode="decimal"
            placeholder=${this.placeholder}
            .value=${this._displayValue}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            name=${this.name || nothing}
            @input=${this._handleInput}
            @change=${this._handleChange}
            @focus=${this._handleFocus}
            @blur=${this._handleBlur}
            @keydown=${this._handleKeydown}
          />
          ${showClearButton
            ? html`
                <button class="clear-button" type="button" @click=${this._clearInput} tabindex="-1">
                  ✕
                </button>
              `
            : nothing}
          ${this.buttonPlacement === 'inside' ? this._renderButtons() : nothing}
          <slot name="suffix"></slot>
        </div>
        ${this.buttonPlacement === 'outside'
          ? html`<div style="display:flex;align-items:center;margin-top:var(--md-spacing-xs);">
              ${this._renderButtons()}
            </div>`
          : nothing}
      </div>
    `
  }

  /** Sets focus on the input. */
  override focus() {
    this._input?.focus()
  }

  /** Removes focus from the input. */
  override blur() {
    this._input?.blur()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-input-number': MacInputNumber
  }
}
