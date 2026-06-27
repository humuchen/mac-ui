import { html, css, nothing } from 'lit'
import { property, customElement, state, query } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-dynamic-tags
 * @summary A dynamic tags component for adding and removing tags.
 *
 * @slot - Custom tag rendering. Receives tag data via data-value and data-index attributes.
 *
 * @csspart container - The tags container.
 * @csspart tag - Each tag element.
 * @csspart input - The input element for adding tags.
 * @csspart add-button - The add button shown when input is hidden.
 *
 * @event mac-update - Emitted when the value changes. Detail: { value: string[] }
 * @event mac-add - Emitted when a tag is added. Detail: { value: string, index: number }
 * @event mac-remove - Emitted when a tag is removed. Detail: { value: string, index: number }
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

      /* Inline input for adding tags */
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

      /* Add button */
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

      /* Size overrides for input and add-button */
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

      /* Disabled state */
      .container--disabled {
        opacity: 0.6;
        pointer-events: none;
      }
    `,
  ]

  /** The tags' values (controlled). */
  @property({ type: Array }) value: string[] = []

  /** The default tags' values (uncontrolled). */
  @property({ type: Array, attribute: 'default-value' }) defaultValue: string[] = []

  /** Disables the component. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** Maximum number of tags. */
  @property({ type: Number }) max?: number

  /** The tags' size. */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** The tags' type. */
  @property({ reflect: true }) type:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info' = 'default'

  /** Whether the tags have rounded corners. */
  @property({ type: Boolean, reflect: true }) round = false

  /** Whether the tags have a border. */
  @property({ type: Boolean, reflect: true }) bordered = true

  /** Whether the tags can be closed. */
  @property({ type: Boolean, reflect: true }) closable = true

  /** The input's placeholder. */
  @property({ attribute: 'input-placeholder' }) inputPlaceholder = ''

  /** The input's max length. */
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
        ${showInput
          ? html`
              <input
                part="input"
                class="input"
                type="text"
                .value=${this._inputValue}
                placeholder=${this.inputPlaceholder || '请输入'}
                ?disabled=${this.disabled}
                maxlength=${this.inputMaxLength || nothing}
                @input=${this._handleInputChange}
                @keydown=${this._handleInputKeydown}
                @blur=${this._handleInputBlur}
              />
            `
          : nothing}
        ${showAddButton
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
          : nothing}
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
    // Delay to allow click events on other elements to process
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
    // Prevent duplicates
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
