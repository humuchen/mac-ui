import { html, css, nothing } from 'lit'
import { property, customElement, state, query } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-dynamic-tags
 * @summary 一个动态标签组件，用于添加和删除标签。
 *
 * @slot - 自定义标签渲染。通过 data-value 和 data-index 属性接收标签数据。
 *
 * @csspart container - 标签容器。
 * @csspart tag - 每个标签元素。
 * @csspart input - 用于添加标签的输入框。
 * @csspart add-button - 输入框隐藏时显示的添加按钮。
 *
 * @event mac-update - 值变化时触发。Detail: { value: string[] }
 * @event mac-add - 添加标签时触发。Detail: { value: string, index: number }
 * @event mac-remove - 删除标签时触发。Detail: { value: string, index: number }
 */
@customElement('mac-dynamic-tags')
export class MacDynamicTags extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
      }

      .container {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--md-dynamic-tags-gap, var(--md-spacing-sm));
      }

      .tag-wrapper {
        display: inline-flex;
        align-items: center;
      }

      /* 用于添加标签的内联输入框 */
      .input {
        display: inline-block;
        border: 1px solid var(--md-color-border);
        border-radius: var(--md-radius-md);
        background-color: var(--md-color-bg);
        padding: var(--md-dynamic-tags-input-padding-vertical, 2px)
          var(--md-dynamic-tags-input-padding-horizontal, 8px);
        font-size: var(--md-dynamic-tags-input-font-size, var(--md-font-size-sm));
        font-family: inherit;
        color: var(--md-color-text);
        outline: none;
        min-width: 60px;
        width: auto;
        transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      .input:focus {
        border-color: var(--md-color-primary);
        box-shadow:
          0 0 0 3px rgba(0, 122, 255, 0.1),
          0 2px 8px rgba(0, 122, 255, 0.08);
      }

      .input::placeholder {
        color: var(--md-color-text-secondary);
      }

      .input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: var(--md-color-bg-secondary);
      }

      /* 添加按钮 */
      .add-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--md-tag-gap);
        padding: var(--md-tag-padding-vertical) var(--md-tag-padding-horizontal);
        font-size: var(--md-tag-font-size);
        font-family: inherit;
        line-height: 1.5;
        border-radius: var(--md-tag-radius);
        border: 1px dashed var(--md-color-border);
        background-color: transparent;
        color: var(--md-color-text-secondary);
        cursor: pointer;
        transition: all var(--md-transition-fast);
        white-space: nowrap;
        user-select: none;
      }

      .add-button:hover {
        border-color: var(--md-color-primary);
        color: var(--md-color-primary);
      }

      .add-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* 输入框和添加按钮的尺寸覆盖 */
      :host([size='sm']) .input {
        --md-dynamic-tags-input-padding-vertical: 1px;
        --md-dynamic-tags-input-padding-horizontal: 6px;
        --md-dynamic-tags-input-font-size: var(--md-font-size-xs);
      }

      :host([size='sm']) .add-button {
        padding: 1px 6px;
        font-size: var(--md-font-size-xs);
        gap: 2px;
        border-radius: var(--md-radius-sm);
      }

      :host([size='lg']) .input {
        --md-dynamic-tags-input-padding-vertical: 4px;
        --md-dynamic-tags-input-padding-horizontal: 12px;
        --md-dynamic-tags-input-font-size: var(--md-font-size-base);
      }

      :host([size='lg']) .add-button {
        padding: 4px 12px;
        font-size: var(--md-font-size-base);
        gap: 6px;
        border-radius: var(--md-radius-md);
      }

      /* 禁用状态 */
      .container--disabled {
        opacity: 0.6;
        pointer-events: none;
      }
    `,
  ]

  /** 标签的值（受控）。 */
  @property({ type: Array }) value: string[] = []

  /** 标签的默认值（非受控）。 */
  @property({ type: Array, attribute: 'default-value' }) defaultValue: string[] = []

  /** 禁用组件。 */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** 标签的最大数量。 */
  @property({ type: Number }) max?: number

  /** 标签的尺寸。 */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** 标签的类型。 */
  @property({ reflect: true }) type:
    'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' = 'default'

  /** 标签是否圆角。 */
  @property({ type: Boolean, reflect: true }) round = false

  /** 标签是否有边框。 */
  @property({ type: Boolean, reflect: true }) bordered = true

  /** 标签是否可关闭。 */
  @property({ type: Boolean, reflect: true }) closable = true

  /** 输入框的占位符。 */
  @property({ attribute: 'input-placeholder' }) inputPlaceholder = ''

  /** 输入框的最大长度。 */
  @property({ type: Number, attribute: 'input-max-length' }) inputMaxLength?: number

  @state() private _inputVisible = false
  @state() private _inputValue = ''
  @state() private _internalValue: string[] = []

  @query('.input') private _inputRef!: HTMLInputElement

  private get _isControlled(): boolean {
    return this.hasAttribute('value')
  }

  private get _resolvedValue(): string[] {
    return this._isControlled ? this.value : this._internalValue
  }

  private get _hasSlot(): boolean {
    return (
      this.querySelector(':scope > [slot]') !== null ||
      this.querySelector(':scope > :not([slot])') !== null
    )
  }

  override connectedCallback() {
    super.connectedCallback()
    if (!this._isControlled) {
      this._internalValue = [...this.defaultValue]
    }
  }

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

  override updated(changed: Map<string | number | symbol, unknown>) {
    super.updated(changed)
    if (this._inputVisible && this._inputRef) {
      this._inputRef.focus()
    }
  }

  override render() {
    const tags = this._resolvedValue
    const showInput = this._inputVisible
    const showAddButton = !showInput && (!this.max || tags.length < this.max)

    return html`
      <div part="container" class="container ${this.disabled ? 'container--disabled' : ''}">
        ${tags.map(
          (tag, index) => html`
            <div class="tag-wrapper" part="tag" data-value="${tag}" data-index="${index}">
              <mac-tag
                size=${this._resolvedSize}
                type=${this.type}
                ?round=${this.round}
                ?bordered=${this.bordered}
                ?closable=${this.closable}
                ?disabled=${this.disabled}
                @mac-close=${() => this._handleRemove(tag, index)}
              >
                ${tag}
              </mac-tag>
            </div>
          `,
        )}
        ${
          showInput
            ? html`
                <input
                  part="input"
                  class="input"
                  type="text"
                  .value=${this._inputValue}
                  placeholder=${this.inputPlaceholder || '请输入'}
                  ?disabled=${this.disabled}
                  maxlength=${this.inputMaxLength || ''}
                  @input=${this._handleInputChange}
                  @keydown=${this._handleInputKeydown}
                  @blur=${this._handleInputBlur}
                />
              `
            : nothing
        }
        ${
          showAddButton
            ? html`
                <button
                  part="add-button"
                  class="add-button"
                  type="button"
                  ?disabled=${this.disabled}
                  @click=${this._showInput}
                >
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 2v12M2 8h12"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                  添加
                </button>
              `
            : nothing
        }
      </div>
    `
  }

  private _showInput() {
    if (this.disabled) return
    this._inputVisible = true
    this._inputValue = ''
  }

  private _hideInput() {
    this._inputVisible = false
    this._inputValue = ''
  }

  private _handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement
    this._inputValue = target.value
  }

  private _handleInputKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this._addTag()
    } else if (e.key === 'Escape') {
      this._hideInput()
    }
  }

  private _handleInputBlur() {
    // 延迟以允许其他元素上的点击事件处理
    setTimeout(() => {
      if (this._inputValue.trim()) {
        this._addTag()
      } else {
        this._hideInput()
      }
    }, 150)
  }

  private _addTag() {
    const raw = this._inputValue.trim()
    if (!raw) {
      this._hideInput()
      return
    }
    // 防止重复
    if (this._resolvedValue.includes(raw)) {
      this._hideInput()
      return
    }
    if (this.max && this._resolvedValue.length >= this.max) {
      this._hideInput()
      return
    }

    const newValue = [...this._resolvedValue, raw]
    const index = newValue.length - 1

    if (!this._isControlled) {
      this._internalValue = newValue
    }

    this.emit('mac-add', { detail: { value: raw, index } })
    this.emit('mac-update', { detail: { value: newValue } })
    this._hideInput()
  }

  private _handleRemove(tag: string, index: number) {
    if (this.disabled) return
    const newValue = this._resolvedValue.filter((_, i) => i !== index)

    if (!this._isControlled) {
      this._internalValue = newValue
    }

    this.emit('mac-remove', { detail: { value: tag, index } })
    this.emit('mac-update', { detail: { value: newValue } })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-dynamic-tags': MacDynamicTags
  }
}
