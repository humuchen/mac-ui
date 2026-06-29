import { html, css, nothing } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-radio
 * @summary macOS 风格的单选按钮组件。
 *
 * @slot - 单选按钮的标签。
 *
 * @csspart base - 单选按钮的基础容器。
 * @csspart control - 单选按钮控制圆圈。
 * @csspart label - 标签元素。
 */
@customElement('mac-radio')
export class MacRadio extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: inline-flex;
      }

      .radio {
        display: inline-flex;
        align-items: center;
        gap: var(--md-radio-gap);
        cursor: pointer;
        user-select: none;
        transition: opacity var(--md-transition-fast);
      }

      .radio--disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      /* 控制 */
      .control {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: var(--md-radio-size);
        height: var(--md-radio-size);
        border-radius: 50%;
        border: 2px solid var(--md-radio-border-color);
        background: var(--md-radio-bg);
        transition:
          border-color var(--md-transition-fast),
          background var(--md-transition-fast);
      }

      .radio:hover:not(.radio--disabled) .control {
        border-color: var(--md-radio-border-hover-color);
      }

      .radio--checked .control {
        border-color: var(--md-radio-border-active-color);
        background: var(--md-radio-bg-active);
      }

      .radio--checked:hover:not(.radio--disabled) .control {
        border-color: var(--md-radio-border-active-hover-color);
      }

      /* 内部圆点 */
      .control::after {
        content: '';
        width: var(--md-radio-dot-size);
        height: var(--md-radio-dot-size);
        border-radius: 50%;
        background: var(--md-radio-dot-color);
        transform: scale(0);
        transition: transform var(--md-transition-fast);
      }

      .radio--checked .control::after {
        transform: scale(1);
      }

      /* 聚焦 */
      .radio:focus-visible .control {
        outline: 2px solid var(--md-color-primary);
        outline-offset: 2px;
      }

      /* 标签 */
      .label {
        font-size: var(--md-radio-font-size);
        color: var(--md-radio-label-color);
        transition: color var(--md-transition-fast);
      }

      .radio:hover:not(.radio--disabled) .label {
        color: var(--md-radio-label-hover-color);
      }

      /* 尺寸 — md 是 :host 默认值，仅覆盖 sm/lg */
      :host {
        --md-radio-size: 18px;
        --md-radio-dot-size: 8px;
        --md-radio-gap: 8px;
        --md-radio-font-size: var(--md-font-size-base);
      }

      :host([size='sm']) {
        --md-radio-size: 14px;
        --md-radio-dot-size: 6px;
        --md-radio-gap: 6px;
        --md-radio-font-size: var(--md-font-size-sm);
      }

      :host([size='lg']) {
        --md-radio-size: 22px;
        --md-radio-dot-size: 10px;
        --md-radio-gap: 10px;
        --md-radio-font-size: var(--md-font-size-lg);
      }
    `,
  ]

  /** 单选按钮的值。 */
  @property() value = ''

  /** 单选按钮是否选中（受控）。 */
  @property({ type: Boolean, reflect: true }) checked = false

  /** 单选按钮默认是否选中（非受控）。 */
  @property({ type: Boolean, attribute: 'default-checked' }) defaultChecked = false

  /** 禁用单选按钮。 */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** 单选按钮的标签文本。 */
  @property() label = ''

  /** 单选按钮的尺寸。 */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  @state() private _groupValue?: string

  private get _isControlled(): boolean {
    return this.hasAttribute('checked')
  }

  private get _isChecked(): boolean {
    if (this._groupValue !== undefined) {
      return this._groupValue === this.value
    }
    return this._isControlled ? this.checked : this.defaultChecked
  }

  override connectedCallback() {
    super.connectedCallback()
    // 同步默认尺寸到 DOM，以便 CSS :host([size]) 选择器生效
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
      group._registerRadio(this)
    }
  }

  private _unregisterFromGroup() {
    const group = this._findGroup()
    if (group) {
      group._unregisterRadio(this)
    }
  }

  private _findGroup(): MacRadioGroup | null {
    let el: Element | null = this
    while (el) {
      if (el.tagName.toLowerCase() === 'mac-radio-group') {
        return el as MacRadioGroup
      }
      el = el.parentElement
    }
    return null
  }

  /** 由父级组调用以同步值。 */
  _setGroupValue(value: string | undefined) {
    this._groupValue = value
  }

  private _handleClick() {
    if (this.disabled) return
    if (this._isChecked) return // 单选按钮无法通过点击取消选中

    const group = this._findGroup()
    if (group) {
      group._selectValue(this.value)
    } else {
      if (!this._isControlled) {
        this.defaultChecked = true
      }
      this.emit('mac-change', { detail: { value: this.value, checked: true } })
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

    return html`
      <div
        part="base"
        class="radio ${isChecked ? 'radio--checked' : ''} ${this.disabled ? 'radio--disabled' : ''}"
        tabindex=${this.disabled ? '-1' : '0'}
        role="radio"
        aria-checked=${isChecked}
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

export interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

/**
 * @tag mac-radio-group
 * @summary macOS 风格的单选按钮组组件。
 *
 * @slot - 默认插槽，用于 mac-radio 元素。
 *
 * @csspart base - 组的基础容器。
 *
 * @event mac-change - 选中值变化时触发。
 */
@customElement('mac-radio-group')
export class MacRadioGroup extends BaseElement {
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
        gap: var(--md-radio-group-gap);
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

  /** 组的值（受控）。 */
  @property() value?: string

  /** 默认值（非受控）。 */
  @property({ attribute: 'default-value' }) defaultValue?: string

  /** 单选按钮 name 属性。 */
  @property() name = ''

  /** 组的尺寸。 */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** 禁用组内所有单选按钮。 */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** 布局方向。 */
  @property({ reflect: true }) direction: 'horizontal' | 'vertical' = 'horizontal'

  /** 简化使用的选项数组。 */
  @property({ type: Array }) options?: RadioOption[]

  private _radios: MacRadio[] = []

  private get _isControlled(): boolean {
    return this.hasAttribute('value')
  }

  private get _resolvedValue(): string | undefined {
    return this._isControlled ? this.value : this.defaultValue
  }

  override connectedCallback() {
    super.connectedCallback()
    if (!this.hasAttribute('direction')) {
      this.setAttribute('direction', 'horizontal')
    }
  }

  override updated() {
    this._syncRadios()
    this._applyGroupProps()
  }

  _registerRadio(radio: MacRadio) {
    if (!this._radios.includes(radio)) {
      this._radios.push(radio)
      radio._setGroupValue(this._resolvedValue)
    }
    this._applyPropsToRadio(radio)
  }

  private _applyGroupProps() {
    this._radios.forEach((radio) => this._applyPropsToRadio(radio))
  }

  private _applyPropsToRadio(radio: MacRadio) {
    // 应用组级尺寸
    if (this.size) {
      radio.setAttribute('size', this.size)
    }
    // 应用组级禁用状态
    if (this.disabled) {
      radio.disabled = true
    } else if (!radio.hasAttribute('disabled')) {
      radio.disabled = false
    }
  }

  _unregisterRadio(radio: MacRadio) {
    const index = this._radios.indexOf(radio)
    if (index !== -1) {
      this._radios.splice(index, 1)
    }
  }

  _selectValue(value: string) {
    if (this._isControlled) {
      this.emit('mac-change', { detail: { value } })
    } else {
      this.defaultValue = value
      this._syncRadios()
      this.emit('mac-change', { detail: { value } })
    }
  }

  private _syncRadios() {
    const val = this._resolvedValue
    this._radios.forEach((radio) => {
      radio._setGroupValue(val)
    })
  }

  private _handleSlotChange() {
    // 插槽内容变化时重新注册单选按钮
    this._radios = []
    const radios = this.querySelectorAll('mac-radio')
    radios.forEach((radio) => this._registerRadio(radio as MacRadio))
    this._syncRadios()
  }

  override render() {
    const hasSlotContent = !this.options || this.options.length === 0

    return html`
      <div
        part="base"
        class="group group--${this.direction}"
        role="radiogroup"
        aria-disabled=${this.disabled}
      >
        ${this.options?.map(
          (option) => html`
            <mac-radio
              .value=${option.value}
              .label=${option.label}
              .disabled=${option.disabled || this.disabled}
              .size=${this.size}
            ></mac-radio>
          `,
        )}
        ${hasSlotContent ? html`<slot @slotchange=${this._handleSlotChange}></slot>` : nothing}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-radio': MacRadio
    'mac-radio-group': MacRadioGroup
  }
}
