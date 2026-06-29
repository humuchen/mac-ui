import { html, css, nothing } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-checkbox
 * @summary macOS 风格的复选框组件。
 *
 * @slot - 复选框的标签。
 *
 * @csspart base - 复选框的基础容器。
 * @csspart control - 复选框的控制框。
 * @csspart label - 标签元素。
 */
@customElement('mac-checkbox')
export class MacCheckbox extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: inline-flex;
      }

      .checkbox {
        display: inline-flex;
        align-items: center;
        gap: var(--md-checkbox-gap);
        cursor: pointer;
        user-select: none;
        transition: opacity var(--md-transition-fast);
      }

      .checkbox--disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      /* 控制框 */
      .control {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: var(--md-checkbox-size);
        height: var(--md-checkbox-size);
        border-radius: var(--md-checkbox-radius);
        border: 2px solid var(--md-checkbox-border-color);
        background: var(--md-checkbox-bg);
        transition:
          border-color var(--md-transition-fast),
          background var(--md-transition-fast);
      }

      .checkbox:hover:not(.checkbox--disabled) .control {
        border-color: var(--md-checkbox-border-hover-color);
      }

      .checkbox--checked .control,
      .checkbox--indeterminate .control {
        border-color: var(--md-checkbox-border-active-color);
        background: var(--md-checkbox-bg-active);
      }

      .checkbox--checked:hover:not(.checkbox--disabled) .control,
      .checkbox--indeterminate:hover:not(.checkbox--disabled) .control {
        border-color: var(--md-checkbox-border-active-hover-color);
      }

      /* 对勾标记 */
      .control::after {
        content: '';
        position: absolute;
        width: 55%;
        height: 30%;
        border-left: 2px solid var(--md-checkbox-check-color);
        border-bottom: 2px solid var(--md-checkbox-check-color);
        transform: rotate(-45deg) scale(0);
        margin-top: -1px;
        transition: transform var(--md-transition-fast);
      }

      .checkbox--checked .control::after {
        transform: rotate(-45deg) scale(1);
      }

      /* 半选横线 */
      .control::before {
        content: '';
        position: absolute;
        width: 60%;
        height: 2px;
        background: var(--md-checkbox-check-color);
        transform: scaleX(0);
        transition: transform var(--md-transition-fast);
      }

      .checkbox--indeterminate .control::before {
        transform: scaleX(1);
      }

      .checkbox--indeterminate .control::after {
        transform: rotate(-45deg) scale(0);
      }

      /* 聚焦 */
      .checkbox:focus-visible .control {
        outline: 2px solid var(--md-color-primary);
        outline-offset: 2px;
      }

      /* 标签 */
      .label {
        font-size: var(--md-checkbox-font-size);
        color: var(--md-checkbox-label-color);
        transition: color var(--md-transition-fast);
      }

      .checkbox:hover:not(.checkbox--disabled) .label {
        color: var(--md-checkbox-label-hover-color);
      }

      /* 尺寸 — md 是 :host 上的默认值，仅覆盖 sm/lg */
      :host {
        --md-checkbox-size: 18px;
        --md-checkbox-gap: 8px;
        --md-checkbox-font-size: var(--md-font-size-base);
        --md-checkbox-radius: 4px;
      }

      :host([size='sm']) {
        --md-checkbox-size: 14px;
        --md-checkbox-gap: 6px;
        --md-checkbox-font-size: var(--md-font-size-sm);
        --md-checkbox-radius: 3px;
      }

      :host([size='lg']) {
        --md-checkbox-size: 22px;
        --md-checkbox-gap: 10px;
        --md-checkbox-font-size: var(--md-font-size-lg);
        --md-checkbox-radius: 5px;
      }
    `,
  ]

  /** 复选框的值。 */
  @property() value = ''

  /** 复选框是否被选中（受控模式）。 */
  @property({ type: Boolean, reflect: true }) checked = false

  /** 复选框默认是否被选中（非受控模式）。 */
  @property({ type: Boolean, attribute: 'default-checked' }) defaultChecked = false

  /** 复选框是否处于半选状态。 */
  @property({ type: Boolean, reflect: true }) indeterminate = false

  /** 禁用复选框。 */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** 复选框的标签文本。 */
  @property() label = ''

  /** 复选框的尺寸。 */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  @state() private _groupValue?: string[]

  private get _isControlled(): boolean {
    return this.hasAttribute('checked')
  }

  private get _isChecked(): boolean {
    if (this._groupValue !== undefined) {
      return this._groupValue.includes(this.value)
    }
    return this._isControlled ? this.checked : this.defaultChecked
  }

  override connectedCallback() {
    super.connectedCallback()
    const resolvedSize = this._resolvedSize
    if (!this.hasAttribute('size') && resolvedSize !== 'md') {
      this.setAttribute('size', resolvedSize)
    }
    this._registerToGroup()
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    this._unregisterFromGroup()
  }

  private _registerToGroup() {
    const group = this._findGroup()
    if (group) {
      group._registerCheckbox(this)
    }
  }

  private _unregisterFromGroup() {
    const group = this._findGroup()
    if (group) {
      group._unregisterCheckbox(this)
    }
  }

  private _findGroup(): MacCheckboxGroup | null {
    let el: Element | null = this
    while (el) {
      if (el.tagName.toLowerCase() === 'mac-checkbox-group') {
        return el as MacCheckboxGroup
      }
      el = el.parentElement
    }
    return null
  }

  /** 由父组调用以同步值。 */
  _setGroupValue(value: string[] | undefined) {
    this._groupValue = value
  }

  private _handleClick() {
    if (this.disabled) return
    const group = this._findGroup()
    const newChecked = !this._isChecked

    if (group) {
      group._toggleValue(this.value, newChecked)
    } else {
      if (!this._isControlled) {
        this.defaultChecked = newChecked
      }
      this.indeterminate = false
      this.emit('mac-change', { detail: { value: this.value, checked: newChecked } })
    }
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      this._handleClick()
    }
  }

  override render() {
    const isChecked = this._isChecked
    const isIndeterminate = this.indeterminate && !isChecked

    return html`
      <div
        part="base"
        class="checkbox
          ${isChecked ? 'checkbox--checked' : ''}
          ${isIndeterminate ? 'checkbox--indeterminate' : ''}
          ${this.disabled ? 'checkbox--disabled' : ''}"
        tabindex=${this.disabled ? '-1' : '0'}
        role="checkbox"
        aria-checked=${isIndeterminate ? 'mixed' : isChecked}
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
      >
        <span part="control" class="control"></span>
        ${
          this.label
            ? html`<span part="label" class="label">${this.label}</span>`
            : html`<span part="label" class="label"><slot></slot></span>`
        }
      </div>
    `
  }
}

export interface CheckboxOption {
  value: string
  label: string
  disabled?: boolean
}

/**
 * @tag mac-checkbox-group
 * @summary macOS 风格的复选框组组件。
 *
 * @slot - 用于放置 mac-checkbox 元素的默认插槽。
 *
 * @csspart base - 组的基础容器。
 *
 * @event mac-change - 选中值变化时触发。
 */
@customElement('mac-checkbox-group')
export class MacCheckboxGroup extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
      }

      .group {
        display: flex;
        flex-wrap: wrap;
        gap: var(--md-checkbox-group-gap);
      }

      .group--vertical {
        flex-direction: column;
      }

      .group--horizontal {
        flex-direction: row;
        align-items: center;
      }
    `,
  ]

  /** 组的值（受控模式）。 */
  @property({ type: Array }) value: string[] = []

  /** 默认值（非受控模式）。 */
  @property({ type: Array, attribute: 'default-value' }) defaultValue: string[] = []

  /** 复选框的 name 属性。 */
  @property() name = ''

  /** 组的尺寸。 */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** 禁用组内所有复选框。 */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** 布局方向。 */
  @property({ reflect: true }) direction: 'horizontal' | 'vertical' = 'horizontal'

  /** 简化用法时的选项数组。 */
  @property({ type: Array }) options?: CheckboxOption[]

  /** 最大可选数量。 */
  @property({ type: Number }) max?: number

  private _checkboxes: MacCheckbox[] = []

  private get _isControlled(): boolean {
    return this.hasAttribute('value')
  }

  private get _resolvedValue(): string[] {
    return this._isControlled ? this.value : this.defaultValue
  }

  override connectedCallback() {
    super.connectedCallback()
    if (!this.hasAttribute('direction')) {
      this.setAttribute('direction', 'horizontal')
    }
  }

  override updated() {
    this._syncCheckboxes()
    this._applyGroupProps()
  }

  _registerCheckbox(checkbox: MacCheckbox) {
    if (!this._checkboxes.includes(checkbox)) {
      this._checkboxes.push(checkbox)
      checkbox._setGroupValue(this._resolvedValue)
    }
    this._applyPropsToCheckbox(checkbox)
  }

  private _applyGroupProps() {
    this._checkboxes.forEach((cb) => this._applyPropsToCheckbox(cb))
  }

  private _applyPropsToCheckbox(checkbox: MacCheckbox) {
    if (this.size) {
      checkbox.setAttribute('size', this.size)
    }
    if (this.disabled) {
      checkbox.disabled = true
    } else if (!checkbox.hasAttribute('disabled')) {
      checkbox.disabled = false
    }
  }

  _unregisterCheckbox(checkbox: MacCheckbox) {
    const index = this._checkboxes.indexOf(checkbox)
    if (index !== -1) {
      this._checkboxes.splice(index, 1)
    }
  }

  _toggleValue(value: string, checked: boolean) {
    let newValue: string[]
    if (checked) {
      if (this.max && this._resolvedValue.length >= this.max) {
        return
      }
      newValue = [...this._resolvedValue, value]
    } else {
      newValue = this._resolvedValue.filter((v) => v !== value)
    }

    if (this._isControlled) {
      this.emit('mac-change', { detail: { value: newValue } })
    } else {
      this.defaultValue = newValue
      this._syncCheckboxes()
      this.emit('mac-change', { detail: { value: newValue } })
    }
  }

  private _syncCheckboxes() {
    const val = this._resolvedValue
    this._checkboxes.forEach((cb) => {
      cb._setGroupValue(val)
    })
  }

  private _handleSlotChange() {
    this._checkboxes = []
    const checkboxes = this.querySelectorAll('mac-checkbox')
    checkboxes.forEach((cb) => this._registerCheckbox(cb as MacCheckbox))
    this._syncCheckboxes()
  }

  override render() {
    const hasSlotContent = !this.options || this.options.length === 0

    return html`
      <div
        part="base"
        class="group group--${this.direction}"
        role="group"
        aria-disabled=${this.disabled}
      >
        ${this.options?.map(
          (option) => html`
            <mac-checkbox
              .value=${option.value}
              .label=${option.label}
              .disabled=${option.disabled || this.disabled}
              .size=${this.size}
            ></mac-checkbox>
          `,
        )}
        ${hasSlotContent ? html`<slot @slotchange=${this._handleSlotChange}></slot>` : nothing}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-checkbox': MacCheckbox
    'mac-checkbox-group': MacCheckboxGroup
  }
}
