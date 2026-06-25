import { html, css, nothing } from 'lit'
import { property, customElement, state, query } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-input
 * @summary A text input component with macOS-style design.
 *
 * @slot prefix - Content before the input.
 * @slot suffix - Content after the input.
 *
 * @csspart base - The input's base container.
 * @csspart input - The native input element.
 * @csspart label - The label element.
 * @csspart helper-text - The helper text element.
 */
@customElement('mac-input')
export class MacInput extends BaseElement {
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

      /* Variants */
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

      /* Label */
      .label {
        font-size: var(--md-font-size-base);
        color: var(--md-color-text);
        font-weight: 500;
        transition: color 200ms;
      }

      .label--required::after {
        content: ' *';
        color: var(--md-color-danger);
      }

      /* Floating Label */
      .input-wrapper--floating {
        position: relative;
      }

      .input-wrapper--floating .input-container {
        padding-top: 20px;
      }

      .input-wrapper--floating .input {
        padding-top: 8px;
      }

      .floating-label {
        position: absolute;
        left: var(--md-spacing-md);
        top: 50%;
        transform: translateY(-50%);
        font-size: var(--md-font-size-base);
        color: var(--md-color-text-secondary);
        pointer-events: none;
        transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
        background: transparent;
        padding: 0 4px;
      }

      .input-wrapper--floating .input:focus ~ .floating-label,
      .input-wrapper--floating .input:not(:placeholder-shown) ~ .floating-label {
        top: 12px;
        transform: translateY(0);
        font-size: 12px;
        color: var(--md-color-primary);
      }

      .input-wrapper--floating .input-container--error .input:focus ~ .floating-label,
      .input-wrapper--floating
        .input-container--error
        .input:not(:placeholder-shown)
        ~ .floating-label {
        color: var(--md-color-danger);
      }

      /* Helper Text */
      .helper-text {
        font-size: var(--md-font-size-sm);
        color: var(--md-color-text-secondary);
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .helper-text--error {
        color: var(--md-color-danger);
      }

      .helper-text--success {
        color: var(--md-color-success);
      }

      /* Character Counter */
      .char-counter {
        font-size: 12px;
        color: var(--md-color-text-secondary);
        margin-left: auto;
        opacity: 0.7;
      }

      .char-counter--warning {
        color: var(--md-color-warning);
      }

      .char-counter--error {
        color: var(--md-color-danger);
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

      /* Password Toggle */
      .password-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        margin-right: var(--md-spacing-sm);
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--md-color-text-secondary);
        font-size: 16px;
        transition: color 200ms;
        padding: 0;
      }

      .password-toggle:hover {
        color: var(--md-color-text);
      }

      /* Loading State */
      .input-container--loading {
        pointer-events: none;
      }

      .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: var(--md-spacing-sm);
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-top-color: var(--md-color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
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

      /* Dark Mode */
      @media (prefers-color-scheme: dark) {
        :host(:not([data-theme='light'])) .input-container--filled {
          background: rgba(255, 255, 255, 0.05);
        }

        :host(:not([data-theme='light'])) .input-container--filled:focus-within {
          background: rgba(255, 255, 255, 0.08);
        }

        :host(:not([data-theme='light'])) .input-container--glass {
          background: rgba(255, 255, 255, 0.05);
        }

        :host(:not([data-theme='light'])) .input-container--glass:focus-within {
          background: rgba(255, 255, 255, 0.08);
        }

        :host(:not([data-theme='light'])) .clear-button {
          background: rgba(255, 255, 255, 0.1);
        }

        :host(:not([data-theme='light'])) .clear-button:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        :host(:not([data-theme='light'])) .loading-spinner {
          border-color: rgba(255, 255, 255, 0.2);
          border-top-color: var(--md-color-primary);
        }
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

      :host([data-theme='dark']) .clear-button {
        background: rgba(255, 255, 255, 0.1);
      }

      :host([data-theme='dark']) .clear-button:hover {
        background: rgba(255, 255, 255, 0.15);
      }

      :host([data-theme='dark']) .loading-spinner {
        border-color: rgba(255, 255, 255, 0.2);
        border-top-color: var(--md-color-primary);
      }
    `,
  ]

  /** The input's value. */
  @property({ type: String }) value = ''

  /** The input's placeholder. */
  @property() placeholder = ''

  /** The input's type. */
  @property() type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' = 'text'

  /** The input's size. */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** The visual variant. */
  @property({ reflect: true }) variant: 'default' | 'filled' | 'glass' | 'underline' = 'default'

  /** The input's label. */
  @property() label = ''

  /** Shows a required indicator. */
  @property({ type: Boolean }) required = false

  /** Disables the input. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** Makes the input read-only. */
  @property({ type: Boolean }) readonly = false

  /** The input's error state. */
  @property({ type: Boolean, reflect: true }) error = false

  /** The input's success state. */
  @property({ type: Boolean, reflect: true }) success = false

  /** The input's helper text. */
  @property({ attribute: 'helper-text' }) helperText = ''

  /** The input's name (for forms). */
  @property() name = ''

  /** Shows a clear button. */
  @property({ type: Boolean, attribute: 'clearable' }) clearable = false

  /** Shows a password toggle button. */
  @property({ type: Boolean, attribute: 'show-password-toggle' }) showPasswordToggle = false

  /** Shows a character counter. */
  @property({ type: Boolean, attribute: 'show-char-counter' }) showCharCounter = false

  /** Maximum character length. */
  @property({ type: Number, attribute: 'max-length' }) maxLength?: number

  /** Shows a loading state. */
  @property({ type: Boolean, reflect: true }) loading = false

  /** Enables floating label. */
  @property({ type: Boolean }) floating = false

  @state() private _hasFocus = false

  @state() private _showPassword = false

  @query('#input') private _input!: HTMLInputElement

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

  override render() {
    const showClearButton = this.clearable && this.value && !this.disabled && !this.readonly
    const showPasswordToggle = this.showPasswordToggle && this.type === 'password' && !this.disabled
    const showCharCounter = this.showCharCounter && this.maxLength
    const charCount = this.value.length
    const isNearLimit = this.maxLength && charCount > this.maxLength * 0.8
    const isOverLimit = this.maxLength && charCount > this.maxLength

    const inputType = this.type === 'password' && this._showPassword ? 'text' : this.type
    const size = this._resolvedSize

    return html`
      <div class="input-wrapper ${this.floating ? 'input-wrapper--floating' : ''}" part="base">
        ${this.label && !this.floating
          ? html`
              <label
                class="label ${this.required ? 'label--required' : ''}"
                part="label"
                for="input"
              >
                ${this.label}
              </label>
            `
          : nothing}
        <div
          class="input-container
            input-container--${this.variant}
            input-container--${size}
            ${this.error ? 'input-container--error' : ''}
            ${this.success ? 'input-container--success' : ''}
            ${this.disabled ? 'input-container--disabled' : ''}
            ${this.loading ? 'input-container--loading' : ''}"
        >
          <slot name="prefix"></slot>
          <input
            id="input"
            part="input"
            class="input"
            type=${inputType}
            placeholder=${this.floating ? ' ' : this.placeholder}
            .value=${this.value}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            maxlength=${this.maxLength || nothing}
            name=${this.name || nothing}
            @input=${this._handleInput}
            @focus=${this._handleFocus}
            @blur=${this._handleBlur}
          />
          ${this.floating && this.label
            ? html`
                <label class="floating-label ${this.required ? 'label--required' : ''}">
                  ${this.label}
                </label>
              `
            : nothing}
          ${this.loading ? html`<span class="loading-spinner"></span>` : nothing}
          ${showPasswordToggle
            ? html`
                <button
                  class="password-toggle"
                  type="button"
                  @click=${this._togglePassword}
                  tabindex="-1"
                >
                  ${this._showPassword ? '🙈' : '👁️'}
                </button>
              `
            : nothing}
          ${showClearButton
            ? html`
                <button class="clear-button" type="button" @click=${this._clearInput} tabindex="-1">
                  ✕
                </button>
              `
            : nothing}
          <slot name="suffix"></slot>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          ${this.helperText
            ? html`
                <div
                  class="helper-text
                    ${this.error ? 'helper-text--error' : ''}
                    ${this.success ? 'helper-text--success' : ''}"
                  part="helper-text"
                >
                  ${this.helperText}
                </div>
              `
            : nothing}
          ${showCharCounter
            ? html`
                <div
                  class="char-counter
                    ${isOverLimit ? 'char-counter--error' : ''}
                    ${isNearLimit && !isOverLimit ? 'char-counter--warning' : ''}"
                >
                  ${charCount}/${this.maxLength}
                </div>
              `
            : nothing}
        </div>
      </div>
    `
  }

  private _handleInput(e: Event) {
    const target = e.target as HTMLInputElement
    this.value = target.value
    this.emit('mac-input', { detail: { value: this.value } })
  }

  private _handleFocus() {
    this._hasFocus = true
    this.emit('mac-focus')
  }

  private _handleBlur() {
    this._hasFocus = false
    this.emit('mac-blur')
  }

  private _clearInput() {
    this.value = ''
    this._input.value = ''
    this.emit('mac-input', { detail: { value: '' } })
    this._input.focus()
  }

  private _togglePassword() {
    this._showPassword = !this._showPassword
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
    'mac-input': MacInput
  }
}
