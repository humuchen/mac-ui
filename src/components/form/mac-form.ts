import { html, css } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'
import type { MacFormItem } from './mac-form-item'

export interface FormRule {
  required?: boolean
  message?: string
  trigger?: 'blur' | 'change' | 'input' | ('blur' | 'change' | 'input')[]
  validator?: (value: unknown) => boolean | string | Promise<boolean | string>
  min?: number
  max?: number
  len?: number
  pattern?: RegExp
  type?: 'string' | 'number' | 'boolean' | 'array' | 'email' | 'url' | 'date'
}

/**
 * @tag mac-form
 * @summary A form component for collecting and validating user input.
 *
 * @slot - The form items and controls.
 *
 * @csspart base - The form's base container.
 *
 * @event mac-change - Emitted when a field value changes. Detail: { model, path, value }
 * @event mac-submit - Emitted when the form is submitted. Detail: { model }
 */
@customElement('mac-form')
export class MacForm extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
      }

      .form {
        display: flex;
        flex-direction: column;
        gap: var(--md-form-gap, var(--md-spacing-md));
      }
    `,
  ]

  /** The form data model. */
  @property({ type: Object }) model: Record<string, unknown> = {}

  /** Validation rules. */
  @property({ type: Object }) rules: Record<string, FormRule | FormRule[]> = {}

  /** The width of labels. */
  @property({ attribute: 'label-width' }) labelWidth = '80px'

  /** The alignment of labels. */
  @property({ attribute: 'label-align' }) labelAlign: 'left' | 'right' | 'top' = 'right'

  /** Whether to show labels. */
  @property({ type: Boolean, attribute: 'show-label' }) showLabel = true

  /** Whether to show feedback (error messages). */
  @property({ type: Boolean, attribute: 'show-feedback' }) showFeedback = true

  /** The form's size. */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** Disables all form items. */
  @property({ type: Boolean, reflect: true }) disabled = false

  private _items: MacFormItem[] = []

  override willUpdate() {
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
  }

  _registerItem(item: MacFormItem) {
    if (!this._items.includes(item)) {
      this._items.push(item)
    }
  }

  _unregisterItem(item: MacFormItem) {
    const index = this._items.indexOf(item)
    if (index > -1) {
      this._items.splice(index, 1)
    }
  }

  /** Gets a field value by path. */
  getValue(path: string): unknown {
    return this.model[path]
  }

  /** Sets a field value by path. */
  setValue(path: string, value: unknown) {
    this.model = { ...this.model, [path]: value }
    this.emit('mac-change', { detail: { model: this.model, path, value } })
  }

  /** Validates all form items. */
  async validate(): Promise<boolean> {
    const results = await Promise.all(this._items.map((item) => item.validate()))
    return results.every((r) => r)
  }

  /** Resets all form items' validation state. */
  reset() {
    this._items.forEach((item) => item.reset())
  }

  /** Clears the form model. */
  clear() {
    this.model = {}
    this.reset()
    this.emit('mac-change', { detail: { model: this.model, path: '', value: undefined } })
  }

  override render() {
    return html`
      <form
        part="base"
        class="form"
        @submit=${this._handleSubmit}
        style="--md-form-label-width: ${this.labelWidth}; --md-form-label-align: ${this.labelAlign};"
      >
        <slot></slot>
      </form>
    `
  }

  private _handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    this.emit('mac-submit', { detail: { model: this.model } })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-form': MacForm
  }
}
