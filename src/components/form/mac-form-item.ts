import { html, css, nothing } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'
import type { MacForm, FormRule } from './mac-form'

/**
 * @tag mac-form-item
 * @summary A form item component for wrapping form controls with label and validation.
 *
 * @slot - The form control element.
 *
 * @csspart base - The form item's base container.
 * @csspart label - The label element.
 * @csspart content - The content wrapper.
 * @csspart error - The error message element.
 */
@customElement('mac-form-item')
export class MacFormItem extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
      }

      .form-item {
        display: flex;
        align-items: flex-start;
        gap: var(--md-form-item-gap, var(--md-spacing-sm));
      }

      .form-item--top {
        flex-direction: column;
        gap: var(--md-spacing-xs);
      }

      .form-item--top .form-item__label {
        width: auto !important;
        text-align: left !important;
        padding-top: 0 !important;
      }

      .form-item__label {
        flex-shrink: 0;
        width: var(--md-form-label-width, 80px);
        text-align: var(--md-form-label-align, right);
        font-size: var(--md-form-label-font-size, var(--md-font-size-base));
        color: var(--md-form-label-color, var(--md-color-text));
        line-height: var(--md-form-control-height, 32px);
        padding-top: var(--md-form-label-padding-top, 0px);
        transition: color 200ms;
      }

      .form-item__label--left {
        text-align: left;
      }

      .form-item__label--right {
        text-align: right;
      }

      .form-item__label--top {
        text-align: left;
      }

      .form-item__content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--md-spacing-xs);
        min-width: 0;
      }

      .form-item__error {
        font-size: var(--md-font-size-sm);
        color: var(--md-color-danger);
        line-height: 1.4;
        animation: slideIn 200ms ease;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .required {
        color: var(--md-color-danger);
        margin-right: 2px;
      }

      /* Size overrides */
      :host([size='sm']) .form-item__label {
        font-size: var(--md-font-size-sm);
        line-height: 28px;
      }

      :host([size='lg']) .form-item__label {
        font-size: var(--md-font-size-lg);
        line-height: 40px;
      }

      :host([data-theme='dark']) .form-item__label {
        color: rgba(255, 255, 255, 0.92);
      }
    `,
  ]

  /** The item's label. */
  @property() label = ''

  /** The field path in the model. */
  @property() path = ''

  /** Validation rule(s). */
  @property({ type: Object }) rule?: FormRule | FormRule[]

  /** Whether the field is required. */
  @property({ type: Boolean }) required = false

  /** Whether to show the label. */
  @property({ type: Boolean, attribute: 'show-label' }) showLabel?: boolean

  /** Whether to show feedback (error messages). */
  @property({ type: Boolean, attribute: 'show-feedback' }) showFeedback?: boolean

  /** The item's size. */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** Disables the item. */
  @property({ type: Boolean, reflect: true }) disabled = false

  @state() private _errorMessage = ''

  private _form?: MacForm
  private _control?: HTMLElement
  private _mutationObserver?: MutationObserver

  override connectedCallback() {
    super.connectedCallback()
    this._form = this._findForm()
    this._form?._registerItem(this)
    this._mutationObserver = new MutationObserver(() => this._attachListeners())
    this._mutationObserver.observe(this, { childList: true, subtree: true })
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    this._form?._unregisterItem(this)
    if (this._control) {
      this._control.removeEventListener('mac-change', this._handleChange as EventListener)
      this._control.removeEventListener('mac-input', this._handleInput as EventListener)
      this._control.removeEventListener('mac-blur', this._handleBlur as EventListener)
    }
    this._mutationObserver?.disconnect()
  }

  override updated() {
    this._attachListeners()
    this._syncValueToControl()
    this._syncDisabledToControl()
    this._syncSizeToControl()
  }

  private _findForm(): MacForm | undefined {
    let el: Element | null = this
    while (el) {
      if (el.tagName.toLowerCase() === 'mac-form') {
        return el as MacForm
      }
      el = el.parentElement
    }
    return undefined
  }

  private _findControl(): HTMLElement | undefined {
    const slot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement | undefined
    if (!slot) return undefined
    const assigned = slot.assignedElements({ flatten: true })
    for (const el of assigned) {
      const found = this._findFirstControl(el as HTMLElement)
      if (found) return found
    }
    return undefined
  }

  private _findFirstControl(el: HTMLElement): HTMLElement | undefined {
    const tag = el.tagName.toLowerCase()
    if (tag === 'mac-form-item') return undefined
    if (['mac-input', 'mac-input-number', 'mac-select', 'mac-radio-group', 'mac-radio', 'mac-dynamic-tags'].includes(tag)) {
      return el
    }
    const children = Array.from(el.children) as HTMLElement[]
    for (const child of children) {
      const found = this._findFirstControl(child)
      if (found) return found
    }
    return undefined
  }

  private _getValue(): unknown {
    if (this._form && this.path) {
      return this._form.getValue(this.path)
    }
    return undefined
  }

  private _syncValueToControl() {
    const control = this._findControl()
    if (!control || !this.path) return
    const value = this._getValue()
    if ('value' in control && (control as any).value !== value) {
      ;(control as any).value = value ?? ''
    }
  }

  private _syncDisabledToControl() {
    const control = this._findControl()
    if (!control) return
    const disabled = this.disabled || this._form?.disabled
    if ('disabled' in control) {
      ;(control as any).disabled = !!disabled
    }
  }

  private _syncSizeToControl() {
    const control = this._findControl()
    if (!control) return
    const size = this.size || this._form?.size
    if (size && 'size' in control) {
      ;(control as any).size = size
    }
  }

  private _attachListeners() {
    const control = this._findControl()
    if (!control || this._control === control) return
    if (this._control) {
      this._control.removeEventListener('mac-change', this._handleChange as EventListener)
      this._control.removeEventListener('mac-input', this._handleInput as EventListener)
      this._control.removeEventListener('mac-blur', this._handleBlur as EventListener)
    }
    this._control = control
    control.addEventListener('mac-change', this._handleChange as EventListener)
    control.addEventListener('mac-input', this._handleInput as EventListener)
    control.addEventListener('mac-blur', this._handleBlur as EventListener)
  }

  private _handleChange = (e: CustomEvent) => {
    const value = e.detail?.value
    this._updateValue(value)
    this.validate('change')
  }

  private _handleInput = (e: CustomEvent) => {
    const value = e.detail?.value
    this._updateValue(value)
    this.validate('input')
  }

  private _handleBlur = () => {
    this.validate('blur')
  }

  private _updateValue(value: unknown) {
    if (this._form && this.path) {
      this._form.setValue(this.path, value)
    }
  }

  private _setControlStatus(status: 'error' | 'success' | undefined) {
    const control = this._findControl()
    if (!control) return
    // Boolean error / success (input, select)
    if ('error' in control) {
      ;(control as any).error = status === 'error'
    }
    if ('success' in control) {
      ;(control as any).success = status === 'success'
    }
    // Status string (input-number)
    if ('status' in control) {
      ;(control as any).status = status
    }
  }

  /** Validates the form item. */
  async validate(trigger?: 'blur' | 'change' | 'input'): Promise<boolean> {
    const rules = this._resolvedRules
    if (!rules || rules.length === 0) {
      this._errorMessage = ''
      this._setControlStatus(undefined)
      return true
    }

    const value = this._getValue()

    for (const rule of rules) {
      const triggers = Array.isArray(rule.trigger) ? rule.trigger : [rule.trigger || 'change']
      if (trigger && !triggers.includes(trigger)) continue

      // required
      if (rule.required) {
        const isEmpty =
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        if (isEmpty) {
          this._errorMessage = rule.message || `${this.label || this.path} 是必填项`
          this._setControlStatus('error')
          return false
        }
      }

      // Skip other checks if value is empty and not required
      if (
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        continue
      }

      // type
      if (rule.type) {
        const valid = this._checkType(value, rule.type)
        if (!valid) {
          this._errorMessage = rule.message || `${this.label || this.path} 格式不正确`
          this._setControlStatus('error')
          return false
        }
      }

      // min / max
      if (rule.min !== undefined || rule.max !== undefined) {
        const len =
          typeof value === 'string'
            ? value.length
            : Array.isArray(value)
              ? value.length
              : Number(value)
        if (rule.min !== undefined && len < rule.min) {
          this._errorMessage = rule.message || `${this.label || this.path} 不能小于 ${rule.min}`
          this._setControlStatus('error')
          return false
        }
        if (rule.max !== undefined && len > rule.max) {
          this._errorMessage = rule.message || `${this.label || this.path} 不能大于 ${rule.max}`
          this._setControlStatus('error')
          return false
        }
      }

      // len
      if (rule.len !== undefined) {
        const len =
          typeof value === 'string'
            ? value.length
            : Array.isArray(value)
              ? value.length
              : Number(value)
        if (len !== rule.len) {
          this._errorMessage = rule.message || `${this.label || this.path} 长度必须为 ${rule.len}`
          this._setControlStatus('error')
          return false
        }
      }

      // pattern
      if (rule.pattern && typeof value === 'string') {
        if (!rule.pattern.test(value)) {
          this._errorMessage = rule.message || `${this.label || this.path} 格式不正确`
          this._setControlStatus('error')
          return false
        }
      }

      // validator
      if (rule.validator) {
        try {
          const result = await rule.validator(value)
          if (result !== true) {
            this._errorMessage =
              typeof result === 'string'
                ? result
                : rule.message || `${this.label || this.path} 验证失败`
            this._setControlStatus('error')
            return false
          }
        } catch {
          this._errorMessage = rule.message || `${this.label || this.path} 验证失败`
          this._setControlStatus('error')
          return false
        }
      }
    }

    this._errorMessage = ''
    this._setControlStatus('success')
    return true
  }

  /** Resets the validation state. */
  reset() {
    this._errorMessage = ''
    this._setControlStatus(undefined)
  }

  private _checkType(value: unknown, type: string): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string'
      case 'number':
        return typeof value === 'number'
      case 'boolean':
        return typeof value === 'boolean'
      case 'array':
        return Array.isArray(value)
      case 'email':
        return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      case 'url':
        return typeof value === 'string' && /^https?:\/\/.+/.test(value)
      case 'date':
        return value instanceof Date || !isNaN(Date.parse(String(value)))
      default:
        return true
    }
  }

  private get _resolvedRules(): FormRule[] {
    const rules: FormRule[] = []
    if (this.required) {
      rules.push({ required: true, message: `${this.label || this.path} 是必填项` })
    }
    if (this.rule) {
      rules.push(...(Array.isArray(this.rule) ? this.rule : [this.rule]))
    }
    if (this._form && this.path && this._form.rules[this.path]) {
      const formRules = this._form.rules[this.path]
      rules.push(...(Array.isArray(formRules) ? formRules : [formRules]))
    }
    return rules
  }

  private get _showLabel(): boolean {
    return this.showLabel !== undefined ? this.showLabel : (this._form?.showLabel ?? true)
  }

  private get _showFeedback(): boolean {
    return this.showFeedback !== undefined ? this.showFeedback : (this._form?.showFeedback ?? true)
  }

  private get _labelAlign(): 'left' | 'right' | 'top' {
    return (this._form?.labelAlign as 'left' | 'right' | 'top') || 'right'
  }

  override render() {
    const labelAlign = this._labelAlign
    const isTop = labelAlign === 'top'

    return html`
      <div
        part="base"
        class="form-item ${isTop ? 'form-item--top' : ''}"
      >
        ${this._showLabel && this.label
          ? html`
              <label
                part="label"
                class="form-item__label form-item__label--${labelAlign}"
              >
                ${this.required || this._resolvedRules.some((r) => r.required)
                  ? html`<span class="required">*</span>`
                  : nothing}
                ${this.label}
              </label>
            `
          : nothing}
        <div part="content" class="form-item__content">
          <slot></slot>
          ${this._showFeedback && this._errorMessage
            ? html`<div part="error" class="form-item__error">${this._errorMessage}</div>`
            : nothing}
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-form-item': MacFormItem
  }
}
