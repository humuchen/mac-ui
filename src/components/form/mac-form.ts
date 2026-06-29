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
 * @summary 一个表单组件，用于收集和验证用户输入。
 *
 * @slot - 表单项和控件。
 *
 * @csspart base - 表单的基础容器。
 *
 * @event mac-change - 字段值变化时触发。Detail: { model, path, value }
 * @event mac-submit - 表单提交时触发。Detail: { model }
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

  /** 表单数据模型。 */
  @property({ type: Object }) model: Record<string, unknown> = {}

  /** 验证规则。 */
  @property({ type: Object }) rules: Record<string, FormRule | FormRule[]> = {}

  /** 标签宽度。 */
  @property({ attribute: 'label-width' }) labelWidth = '80px'

  /** 标签对齐方式。 */
  @property({ attribute: 'label-align' }) labelAlign: 'left' | 'right' | 'top' = 'right'

  /** 是否显示标签。 */
  @property({ type: Boolean, attribute: 'show-label' }) showLabel = true

  /** 是否显示反馈（错误信息）。 */
  @property({ type: Boolean, attribute: 'show-feedback' }) showFeedback = true

  /** 表单尺寸。 */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** 禁用所有表单项。 */
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

  /** 根据路径获取字段值。 */
  getValue(path: string): unknown {
    return this.model[path]
  }

  /** 根据路径设置字段值。 */
  setValue(path: string, value: unknown) {
    this.model = { ...this.model, [path]: value }
    this.emit('mac-change', { detail: { model: this.model, path, value } })
  }

  /** 验证所有表单项。 */
  async validate(): Promise<boolean> {
    const results = await Promise.all(this._items.map((item) => item.validate()))
    return results.every((r) => r)
  }

  /** 重置所有表单项的验证状态。 */
  reset() {
    this._items.forEach((item) => item.reset())
  }

  /** 清空表单模型。 */
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
        style="--md-form-label-width: ${this.labelWidth}; --md-form-label-align: ${
          this.labelAlign
        };"
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
