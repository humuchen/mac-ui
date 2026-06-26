import { html, css, nothing } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-radio
 * @summary A radio button component with macOS-style design.
 *
 * @slot - The radio's label.
 *
 * @csspart base - The radio's base container.
 * @csspart control - The radio control circle.
 * @csspart label - The label element.
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
        transition: opacity 150ms;
      }

      .radio--disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      /* Control */
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
        transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
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

      /* Inner dot */
      .control::after {
        content: '';
        width: var(--md-radio-dot-size);
        height: var(--md-radio-dot-size);
        border-radius: 50%;
        background: var(--md-radio-dot-color);
        transform: scale(0);
        transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      .radio--checked .control::after {
        transform: scale(1);
      }

      /* Focus */
      .radio:focus-visible .control {
        outline: 2px solid var(--md-color-primary);
        outline-offset: 2px;
      }

      /* Label */
      .label {
        font-size: var(--md-radio-font-size);
        color: var(--md-radio-label-color);
        transition: color 150ms;
      }

      .radio:hover:not(.radio--disabled) .label {
        color: var(--md-radio-label-hover-color);
      }

      /* Sizes — md is the default on :host, only override sm/lg */
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

  /** The radio's value. */
  @property() value = ''

  /** Whether the radio is checked (controlled). */
  @property({ type: Boolean, reflect: true }) checked = false

  /** Whether the radio is checked by default (uncontrolled). */
  @property({ type: Boolean, attribute: 'default-checked' }) defaultChecked = false

  /** Disables the radio. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** The radio's label text. */
  @property() label = ''

  /** The radio's size. */
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
    // Sync default size to DOM so CSS :host([size]) selectors work
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

  /** Called by the parent group to sync value. */
  _setGroupValue(value: string | undefined) {
    this._groupValue = value
  }

  private _handleClick() {
    if (this.disabled) return
    if (this._isChecked) return // radio cannot be unchecked by clicking

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
        ${this.label
          ? html`<span part="label" class="label">${this.label}</span>`
          : html`<span part="label" class="label"><slot></slot></span>`}
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
 * @summary A radio group component with macOS-style design.
 *
 * @slot - Default slot for mac-radio elements.
 *
 * @csspart base - The group's base container.
 *
 * @event mac-change - Emitted when the selected value changes.
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

  /** The group's value (controlled). */
  @property() value?: string

  /** The default value (uncontrolled). */
  @property({ attribute: 'default-value' }) defaultValue?: string

  /** The radio name attribute. */
  @property() name = ''

  /** The group's size. */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** Disables all radios in the group. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** The layout direction. */
  @property({ reflect: true }) direction: 'horizontal' | 'vertical' = 'horizontal'

  /** Options array for simplified usage. */
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
    // Apply group-level size
    if (this.size) {
      radio.setAttribute('size', this.size)
    }
    // Apply group-level disabled
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
    // Re-register radios when slot content changes
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
        ${hasSlotContent
          ? html`<slot @slotchange=${this._handleSlotChange}></slot>`
          : nothing}
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
