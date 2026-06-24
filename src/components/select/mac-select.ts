import { html, css, nothing } from 'lit'
import { property, customElement, state, query } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  icon?: string
  description?: string
}

export interface OptionGroup {
  label: string
  options: SelectOption[]
}

/**
 * @tag mac-select
 * @summary A select dropdown component with macOS-style design.
 *
 * @csspart base - The select's base container.
 * @csspart trigger - The trigger button.
 * @csspart dropdown - The dropdown menu.
 * @csspart option - An option in the dropdown.
 */
@customElement('mac-select')
export class MacSelect extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
      }

      .select-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: var(--md-spacing-xs);
      }

      /* Trigger Button */
      .select-trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--md-spacing-sm);
        padding: var(--md-select-trigger-padding-vertical)
          var(--md-select-trigger-padding-horizontal);
        border-radius: var(--md-select-trigger-radius);
        background-color: var(--md-color-bg);
        cursor: pointer;
        transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;
        min-height: var(--md-select-trigger-min-height);
      }

      .select-trigger--default {
        border: 1px solid var(--md-color-border);
      }

      .select-trigger--filled {
        border: none;
        background: rgba(0, 0, 0, 0.03);
      }

      .select-trigger--glass {
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(10px) saturate(180%);
        -webkit-backdrop-filter: blur(10px) saturate(180%);
      }

      /* Focus States */
      .select-trigger--default:focus-within,
      .select-trigger--default.open {
        border-color: var(--md-color-primary);
        box-shadow: var(--md-select-container-focus-shadow);
      }

      .select-trigger--filled:focus-within,
      .select-trigger--filled.open {
        background: rgba(0, 0, 0, 0.05);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .select-trigger--glass:focus-within,
      .select-trigger--glass.open {
        border-color: var(--md-select-container-focus-border);
        background: rgba(255, 255, 255, 0.12);
        box-shadow: var(--md-select-container-focus-glass-shadow);
      }

      /* Error & Success States */
      .select-trigger--error.select-trigger--default {
        border-color: var(--md-color-danger);
      }

      .select-trigger--success.select-trigger--default {
        border-color: var(--md-color-success);
      }

      /* Disabled State */
      .select-trigger--disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      /* Selected Value Display */
      .select-value {
        flex: 1;
        display: flex;
        align-items: center;
        gap: var(--md-spacing-sm);
        overflow: hidden;
      }

      .select-placeholder {
        color: var(--md-color-text-secondary);
      }

      .select-value-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* Multiple Selected Tags */
      .select-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        flex: 1;
      }

      .select-tag {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 8px;
        background: var(--md-select-tag-bg);
        border-radius: 12px;
        font-size: 12px;
        color: var(--md-select-tag-text);
      }

      .select-tag-remove {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 14px;
        height: 14px;
        border: none;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        cursor: pointer;
        font-size: 10px;
        color: inherit;
        padding: 0;
        transition: background 200ms;
      }

      .select-tag-remove:hover {
        background: rgba(0, 0, 0, 0.15);
      }

      /* Arrow Icon */
      .select-arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        transition: transform 200ms;
        color: var(--md-color-text-secondary);
      }

      .select-trigger.open .select-arrow {
        transform: rotate(180deg);
      }

      /* Clear Button */
      .select-clear {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border: none;
        background: rgba(0, 0, 0, 0.06);
        border-radius: 50%;
        cursor: pointer;
        color: var(--md-color-text-secondary);
        font-size: 12px;
        transition: all 200ms;
        padding: 0;
      }

      .select-clear:hover {
        background: rgba(0, 0, 0, 0.1);
        color: var(--md-color-text);
      }

      /* Dropdown Menu */
      .select-dropdown {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        min-width: 100%;
        max-height: 300px;
        overflow-y: auto;
        background: var(--md-color-bg);
        border: 1px solid var(--md-color-border);
        border-radius: var(--md-radius-md);
        box-shadow:
          0 4px 16px rgba(0, 0, 0, 0.12),
          0 2px 8px rgba(0, 0, 0, 0.08);
        z-index: 1000;
        opacity: 0;
        transform: translateY(-8px);
        pointer-events: none;
        transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      .select-dropdown.open {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      /* Search Input */
      .select-search {
        padding: var(--md-spacing-sm);
        border-bottom: 1px solid var(--md-color-border);
        position: sticky;
        top: 0;
        background: var(--md-color-bg);
        z-index: 1;
      }

      .select-search-input {
        width: 100%;
        padding: var(--md-spacing-xs) var(--md-spacing-sm);
        border: 1px solid var(--md-color-border);
        border-radius: var(--md-radius-sm);
        font-size: 14px;
        outline: none;
        transition: border-color 200ms;
      }

      .select-search-input:focus {
        border-color: var(--md-color-primary);
      }

      /* Option Groups */
      .select-group-label {
        padding: var(--md-spacing-xs) var(--md-spacing-md);
        font-size: 12px;
        font-weight: 600;
        color: var(--md-color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        background: rgba(0, 0, 0, 0.02);
        position: sticky;
        top: 0;
      }

      .select-group-label:first-child {
        border-radius: var(--md-radius-md) var(--md-radius-md) 0 0;
      }

      /* Options */
      .select-option {
        display: flex;
        align-items: center;
        gap: var(--md-spacing-sm);
        padding: var(--md-spacing-sm) var(--md-spacing-md);
        cursor: pointer;
        transition: background 150ms;
        position: relative;
      }

      .select-option:hover {
        background: var(--md-select-item-hover-bg);
      }

      .select-option.selected {
        background: var(--md-select-item-selected-bg);
      }

      .select-option.focused {
        background: var(--md-select-item-focused-bg);
      }

      .select-option.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      .select-option-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        font-size: 16px;
      }

      .select-option-content {
        flex: 1;
        min-width: 0;
      }

      .select-option-label {
        font-size: 14px;
        color: var(--md-color-text);
      }

      .select-option-description {
        font-size: 12px;
        color: var(--md-color-text-secondary);
        margin-top: 2px;
      }

      .select-option-check {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        color: var(--md-color-primary);
        font-size: 14px;
      }

      /* Empty State */
      .select-empty {
        padding: var(--md-spacing-lg);
        text-align: center;
        color: var(--md-color-text-secondary);
      }

      /* Loading State */
      .select-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--md-spacing-lg);
      }

      .loading-spinner {
        width: 20px;
        height: 20px;
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

      /* Label */
      .select-label {
        font-size: var(--md-font-size-base);
        color: var(--md-color-text);
        font-weight: 500;
      }

      .select-label--required::after {
        content: ' *';
        color: var(--md-color-danger);
      }

      /* Helper Text */
      .select-helper-text {
        font-size: var(--md-font-size-sm);
        color: var(--md-color-text-secondary);
      }

      .select-helper-text--error {
        color: var(--md-color-danger);
      }

      .select-helper-text--success {
        color: var(--md-color-success);
      }

      /* Sizes */
      .select-trigger--sm {
        padding: var(--sm-select-trigger-padding-vertical)
          var(--sm-select-trigger-padding-horizontal);
        font-size: var(--sm-select-trigger-font-size);
        min-height: var(--sm-select-trigger-min-height);
      }

      .select-trigger--lg {
        padding: var(--lg-select-trigger-padding-vertical)
          var(--lg-select-trigger-padding-horizontal);
        font-size: var(--lg-select-trigger-font-size);
        min-height: var(--lg-select-trigger-min-height);
      }

      /* Dark Mode */
      @media (prefers-color-scheme: dark) {
        .select-trigger--filled {
          background: var(--md-select-container-dark-filled-bg);
        }

        .select-trigger--glass {
          background: var(--md-select-container-dark-glass-bg);
        }

        .select-dropdown {
          background: var(--md-select-container-dark-bg);
          border-color: var(--md-select-container-dark-border);
        }

        .select-option:hover {
          background: var(--md-select-item-dark-hover-bg);
        }

        .select-option.selected {
          background: var(--md-select-item-dark-selected-bg);
        }

        .select-option.focused {
          background: var(--md-select-item-dark-focused-bg);
        }

        .select-tag {
          background: var(--md-select-tag-dark-bg);
        }

        .select-clear {
          background: var(--md-select-clear-dark-bg);
        }

        .select-clear:hover {
          background: var(--md-select-clear-dark-hover-bg);
        }
      }
    `,
  ]

  /** The select's value (single select: string, multiple select: string[]). */
  @property({ type: String }) value: string | string[] = ''

  /** The select's placeholder. */
  @property() placeholder = 'Select an option'

  /** The select's options. */
  @property({ type: Array }) options: SelectOption[] = []

  /** Option groups. */
  @property({ type: Array }) groups: OptionGroup[] = []

  /** The select's size. */
  @property({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md'

  /** The visual variant. */
  @property({ reflect: true }) variant: 'default' | 'filled' | 'glass' = 'default'

  /** The select's label. */
  @property() label = ''

  /** Shows a required indicator. */
  @property({ type: Boolean }) required = false

  /** Disables the select. */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** The select's error state. */
  @property({ type: Boolean, reflect: true }) error = false

  /** The select's success state. */
  @property({ type: Boolean, reflect: true }) success = false

  /** The select's helper text. */
  @property({ attribute: 'helper-text' }) helperText = ''

  /** Enables multiple selection. */
  @property({ type: Boolean }) multiple = false

  /** Shows a clear button. */
  @property({ type: Boolean }) clearable = false

  /** Enables search functionality. */
  @property({ type: Boolean }) searchable = false

  /** Shows a loading state. */
  @property({ type: Boolean }) loading = false

  /** Placeholder for search input. */
  @property({ attribute: 'search-placeholder' }) searchPlaceholder = 'Search...'

  /** Empty text when no options. */
  @property({ attribute: 'empty-text' }) emptyText = 'No options available'

  @state() private _open = false

  @state() private _searchQuery = ''

  @state() private _focusedIndex = -1

  @query('.select-trigger') private _trigger!: HTMLElement

  @query('.select-dropdown') private _dropdown!: HTMLElement

  private _handleDocumentClick = (e: Event) => {
    const path = e.composedPath()
    if (!path.includes(this)) {
      this._close()
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    document.addEventListener('click', this._handleDocumentClick)
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('click', this._handleDocumentClick)
  }

  private _toggle() {
    if (this.disabled) return
    this._open ? this._close() : this._openDropdown()
  }

  private _openDropdown() {
    this._open = true
    this._focusedIndex = -1
  }

  private _close() {
    this._open = false
    this._searchQuery = ''
    this._focusedIndex = -1
  }

  private _getAllOptions(): SelectOption[] {
    if (this.groups.length > 0) {
      return this.groups.flatMap((g) => g.options)
    }
    return this.options
  }

  private _getFilteredOptions(): (SelectOption | { type: 'group'; label: string })[] {
    const allOptions = this._getAllOptions()
    const filtered = this._searchQuery
      ? allOptions.filter(
          (opt) =>
            opt.label.toLowerCase().includes(this._searchQuery.toLowerCase()) ||
            opt.value.toLowerCase().includes(this._searchQuery.toLowerCase()),
        )
      : allOptions

    if (this.groups.length > 0 && !this._searchQuery) {
      const result: (SelectOption | { type: 'group'; label: string })[] = []
      this.groups.forEach((group) => {
        result.push({ type: 'group', label: group.label })
        result.push(...group.options)
      })
      return result
    }

    return filtered
  }

  private _isSelected(value: string): boolean {
    if (this.multiple) {
      return Array.isArray(this.value) && this.value.includes(value)
    }
    return this.value === value
  }

  private _selectOption(option: SelectOption) {
    if (option.disabled) return

    if (this.multiple) {
      const currentValue = Array.isArray(this.value) ? [...this.value] : []
      const index = currentValue.indexOf(option.value)

      if (index > -1) {
        currentValue.splice(index, 1)
      } else {
        currentValue.push(option.value)
      }

      this.value = currentValue
      this.emit('mac-change', { detail: { value: currentValue } })
    } else {
      this.value = option.value
      this._close()
      this.emit('mac-change', { detail: { value: option.value } })
    }
  }

  private _removeTag(value: string, e: Event) {
    e.stopPropagation()
    if (Array.isArray(this.value)) {
      const newValue = this.value.filter((v) => v !== value)
      this.value = newValue
      this.emit('mac-change', { detail: { value: newValue } })
    }
  }

  private _clear(e: Event) {
    e.stopPropagation()
    this.value = this.multiple ? [] : ''
    this.emit('mac-change', { detail: { value: this.value } })
  }

  private _handleKeyDown(e: KeyboardEvent) {
    if (this.disabled) return

    const filteredOptions = this._getFilteredOptions().filter(
      (item): item is SelectOption => 'value' in item,
    )

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (this._open && this._focusedIndex > -1) {
          const option = filteredOptions[this._focusedIndex]
          if (option) this._selectOption(option)
        } else {
          this._toggle()
        }
        break

      case 'Escape':
        this._close()
        break

      case 'ArrowDown':
        e.preventDefault()
        if (!this._open) {
          this._openDropdown()
        } else {
          this._focusedIndex = Math.min(this._focusedIndex + 1, filteredOptions.length - 1)
          this._scrollToOption()
        }
        break

      case 'ArrowUp':
        e.preventDefault()
        if (this._open) {
          this._focusedIndex = Math.max(this._focusedIndex - 1, 0)
          this._scrollToOption()
        }
        break

      case 'Tab':
        this._close()
        break
    }
  }

  private _scrollToOption() {
    const option = this._dropdown?.querySelector('.select-option.focused') as HTMLElement
    if (option) {
      option.scrollIntoView({ block: 'nearest' })
    }
  }

  private _getDisplayValue(): string {
    if (this.multiple && Array.isArray(this.value)) {
      if (this.value.length === 0) return ''
      const selectedOptions = this._getAllOptions().filter((opt) => this.value.includes(opt.value))
      return `${this.value.length} selected`
    }

    const option = this._getAllOptions().find((opt) => opt.value === this.value)
    return option?.label || ''
  }

  override render() {
    const displayValue = this._getDisplayValue()
    const hasValue = this.multiple
      ? Array.isArray(this.value) && this.value.length > 0
      : this.value !== ''
    const filteredOptions = this._getFilteredOptions()

    return html`
      <div class="select-wrapper" part="base">
        ${this.label
          ? html`
              <label class="select-label ${this.required ? 'select-label--required' : ''}">
                ${this.label}
              </label>
            `
          : nothing}

        <div
          class="select-trigger
            select-trigger--${this.variant}
            select-trigger--${this.size}
            ${this._open ? 'open' : ''}
            ${this.error ? 'select-trigger--error' : ''}
            ${this.success ? 'select-trigger--success' : ''}
            ${this.disabled ? 'select-trigger--disabled' : ''}"
          part="trigger"
          @click=${this._toggle}
          @keydown=${this._handleKeyDown}
          tabindex=${this.disabled ? '-1' : '0'}
          role="combobox"
          aria-expanded=${this._open}
          aria-haspopup="listbox"
        >
          <div class="select-value">
            ${this.multiple && Array.isArray(this.value) && this.value.length > 0
              ? html`
                  <div class="select-tags">
                    ${this.value.map((v) => {
                      const opt = this._getAllOptions().find((o) => o.value === v)
                      return html`
                        <span class="select-tag">
                          ${opt?.icon ? html`<span>${opt.icon}</span>` : nothing} ${opt?.label || v}
                          <button
                            class="select-tag-remove"
                            @click=${(e: Event) => this._removeTag(v, e)}
                          >
                            ✕
                          </button>
                        </span>
                      `
                    })}
                  </div>
                `
              : hasValue
                ? html`
                    ${(() => {
                      const opt = this._getAllOptions().find((o) => o.value === this.value)
                      return html`
                        ${opt?.icon
                          ? html`<span class="select-option-icon">${opt.icon}</span>`
                          : nothing}
                        <span class="select-value-text">${displayValue}</span>
                      `
                    })()}
                  `
                : html`<span class="select-placeholder">${this.placeholder}</span>`}
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            ${this.clearable && hasValue && !this.disabled
              ? html` <button class="select-clear" @click=${this._clear} tabindex="-1">✕</button> `
              : nothing}

            <span class="select-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" />
              </svg>
            </span>
          </div>
        </div>

        <div
          class="select-dropdown ${this._open ? 'open' : ''}"
          part="dropdown"
          role="listbox"
          aria-multiselectable=${this.multiple}
        >
          ${this.searchable
            ? html`
                <div class="select-search">
                  <input
                    class="select-search-input"
                    type="text"
                    placeholder=${this.searchPlaceholder}
                    .value=${this._searchQuery}
                    @input=${(e: Event) => {
                      this._searchQuery = (e.target as HTMLInputElement).value
                      this._focusedIndex = -1
                    }}
                    @keydown=${(e: KeyboardEvent) => {
                      e.stopPropagation()
                    }}
                  />
                </div>
              `
            : nothing}
          ${this.loading
            ? html`
                <div class="select-loading">
                  <div class="loading-spinner"></div>
                </div>
              `
            : filteredOptions.length === 0
              ? html`<div class="select-empty">${this.emptyText}</div>`
              : html`
                  ${filteredOptions.map((item, index) => {
                    if ('type' in item && item.type === 'group') {
                      return html` <div class="select-group-label">${item.label}</div> `
                    }

                    const option = item as SelectOption
                    const isSelected = this._isSelected(option.value)
                    const isFocused = index === this._focusedIndex

                    return html`
                      <div
                        class="select-option
                          ${isSelected ? 'selected' : ''}
                          ${isFocused ? 'focused' : ''}
                          ${option.disabled ? 'disabled' : ''}"
                        part="option"
                        @click=${() => this._selectOption(option)}
                        @mouseenter=${() => (this._focusedIndex = index)}
                        role="option"
                        aria-selected=${isSelected}
                        aria-disabled=${option.disabled}
                      >
                        ${option.icon
                          ? html`<span class="select-option-icon">${option.icon}</span>`
                          : nothing}
                        <div class="select-option-content">
                          <div class="select-option-label">${option.label}</div>
                          ${option.description
                            ? html`<div class="select-option-description">
                                ${option.description}
                              </div>`
                            : nothing}
                        </div>
                        ${isSelected
                          ? html`
                              <span class="select-option-check">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                  <path
                                    d="M13.5 4.5L6 12l-3.5-3.5"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    fill="none"
                                  />
                                </svg>
                              </span>
                            `
                          : nothing}
                      </div>
                    `
                  })}
                `}
        </div>

        ${this.helperText
          ? html`
              <div
                class="select-helper-text
                  ${this.error ? 'select-helper-text--error' : ''}
                  ${this.success ? 'select-helper-text--success' : ''}"
              >
                ${this.helperText}
              </div>
            `
          : nothing}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-select': MacSelect
  }
}
