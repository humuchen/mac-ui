import { html, css, nothing } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

export interface TreeOption {
  value: string
  label: string
  disabled?: boolean
  children?: TreeOption[]
}

type CheckState = 'unchecked' | 'half-checked' | 'checked'

@customElement('mac-tree-select')
export class MacTreeSelect extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
      }
      .tree-select {
        position: relative;
      }

      /* Trigger */
      .tree-trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--md-spacing-sm);
        padding: var(--md-select-trigger-padding-vertical)
          var(--md-select-trigger-padding-horizontal);
        border-radius: var(--md-radius-lg);
        background: var(--md-color-bg);
        cursor: pointer;
        transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;
        min-height: var(--md-select-trigger-min-height);
        border: 1px solid var(--md-color-border);
      }
      .tree-trigger:hover:not(.tree-trigger--disabled) {
        border-color: var(--md-color-primary);
      }
      .tree-trigger.open,
      .tree-trigger:focus-within {
        border-color: var(--md-color-primary);
        box-shadow:
          0 0 0 3px rgba(0, 122, 255, 0.1),
          0 2px 8px rgba(0, 122, 255, 0.08);
      }
      .tree-trigger--disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
        background: var(--md-color-bg-secondary);
      }
      .tree-trigger--error {
        border-color: var(--md-color-danger);
      }
      .tree-trigger--error.open,
      .tree-trigger--error:focus-within {
        box-shadow:
          0 0 0 3px rgba(255, 59, 48, 0.1),
          0 2px 8px rgba(255, 59, 48, 0.08);
      }
      .tree-trigger--success {
        border-color: var(--md-color-success);
      }

      .tree-value {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .tree-placeholder {
        color: #9ca3af;
      }

      .tree-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        flex: 1;
      }
      .tree-tag {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 8px;
        background: var(--md-select-tag-bg);
        border-radius: 12px;
        font-size: 12px;
        color: var(--md-select-tag-text);
      }
      .tree-tag-remove {
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
      .tree-tag-remove:hover {
        background: rgba(0, 0, 0, 0.15);
      }

      .tree-actions {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .tree-clear {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border: none;
        background: rgba(0, 0, 0, 0.06);
        border-radius: 50%;
        cursor: pointer;
        color: var(--md-color-text-secondary);
        font-size: 10px;
        transition: all 200ms;
        padding: 0;
        flex-shrink: 0;
      }
      .tree-clear:hover {
        background: rgba(0, 0, 0, 0.1);
        color: var(--md-color-text);
      }
      .tree-arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        color: #9ca3af;
        transition: transform 200ms;
        flex-shrink: 0;
      }
      .tree-trigger.open .tree-arrow {
        transform: rotate(180deg);
      }

      /* Dropdown Panel */
      .tree-dropdown {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        width: 320px;
        max-height: 400px;
        overflow-y: auto;
        background: var(--md-color-bg);
        border: 1px solid var(--md-color-border);
        border-radius: 12px;
        box-shadow:
          0 12px 40px rgba(0, 0, 0, 0.12),
          0 4px 12px rgba(0, 0, 0, 0.08);
        z-index: 1000;
        opacity: 0;
        transform: translateY(-8px) scale(0.96);
        pointer-events: none;
        transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
        padding: 12px;
      }
      .tree-dropdown.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }
      .tree-dropdown--inline {
        position: static;
        opacity: 1;
        transform: none;
        pointer-events: auto;
        box-shadow: none;
      }

      /* Search */
      .tree-search {
        padding-bottom: 8px;
        margin-bottom: 8px;
        border-bottom: 1px solid var(--md-color-border);
      }
      .tree-search-input {
        width: 100%;
        padding: 6px 10px;
        border: 1px solid var(--md-color-border);
        border-radius: var(--md-radius-md);
        font-size: var(--md-font-size-sm);
        outline: none;
        transition: border-color 200ms;
        background: var(--md-color-bg);
        color: var(--md-color-text);
        box-sizing: border-box;
      }
      .tree-search-input:focus {
        border-color: var(--md-color-primary);
      }

      /* Tree Node */
      .tree-node {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 7px 10px;
        border-radius: var(--md-radius-md);
        cursor: pointer;
        transition: background 150ms;
        user-select: none;
        margin: 1px 0;
      }
      .tree-node:hover:not(.tree-node--disabled) {
        background: rgba(0, 122, 255, 0.06);
      }
      .tree-node--selected {
        background: rgba(0, 122, 255, 0.1);
        color: var(--md-color-primary);
      }
      .tree-node--disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .tree-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border: none;
        background: transparent;
        cursor: pointer;
        color: var(--md-color-text-secondary);
        padding: 0;
        flex-shrink: 0;
        transition: transform 150ms;
        border-radius: var(--md-radius-sm);
      }
      .tree-toggle:hover {
        background: rgba(0, 0, 0, 0.04);
        color: var(--md-color-text);
      }
      .tree-toggle--expanded {
        transform: rotate(90deg);
      }
      .tree-toggle--placeholder {
        visibility: hidden;
        pointer-events: none;
      }

      .tree-checkbox {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border: 2px solid var(--md-color-border);
        border-radius: 5px;
        cursor: pointer;
        flex-shrink: 0;
        transition: all 150ms;
        position: relative;
      }
      .tree-checkbox:hover {
        border-color: var(--md-color-primary);
      }
      .tree-checkbox--checked {
        background: var(--md-color-primary);
        border-color: var(--md-color-primary);
      }
      .tree-checkbox--half {
        background: var(--md-color-primary);
        border-color: var(--md-color-primary);
      }
      .tree-checkbox--half::after {
        content: '';
        display: block;
        width: 9px;
        height: 2.5px;
        background: #fff;
        border-radius: 1.5px;
      }
      .tree-checkbox--checked::after {
        content: '';
        display: block;
        width: 5px;
        height: 9px;
        border: solid #fff;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        margin-bottom: 2px;
      }

      .tree-label {
        flex: 1;
        font-size: var(--md-font-size-sm);
        color: var(--md-color-text);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .tree-node--selected .tree-label {
        color: var(--md-color-primary);
        font-weight: 600;
      }

      .tree-children {
        padding-left: 0;
      }

      /* Empty */
      .tree-empty {
        padding: 24px;
        text-align: center;
        color: var(--md-color-text-secondary);
        font-size: var(--md-font-size-sm);
      }

      /* Sizes */
      .tree-trigger--sm {
        padding: var(--sm-select-trigger-padding-vertical)
          var(--sm-select-trigger-padding-horizontal);
        font-size: var(--sm-select-trigger-font-size);
        min-height: var(--sm-select-trigger-min-height);
      }
      .tree-trigger--lg {
        padding: var(--lg-select-trigger-padding-vertical)
          var(--lg-select-trigger-padding-horizontal);
        font-size: var(--lg-select-trigger-font-size);
        min-height: var(--lg-select-trigger-min-height);
      }

      :host([data-theme='dark']) .tree-clear {
        background: rgba(255, 255, 255, 0.1);
      }
      :host([data-theme='dark']) .tree-clear:hover {
        background: rgba(255, 255, 255, 0.15);
      }
      :host([data-theme='dark']) .tree-tag {
        background: var(--md-select-tag-dark-bg);
      }
      :host([data-theme='dark']) .tree-toggle:hover {
        color: var(--md-color-text);
      }
      :host([data-theme='dark']) .tree-search-input {
        background: var(--md-color-bg);
        border-color: var(--md-color-border);
        color: var(--md-color-text);
      }
    `,
  ]

  @property({ type: Array }) options: TreeOption[] = []
  @property() value: string | string[] = ''
  @property({ attribute: 'default-value' }) defaultValue: string | string[] = ''
  @property() placeholder = 'Select'
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: Boolean, reflect: true }) error = false
  @property({ type: Boolean, reflect: true }) success = false
  @property({ type: Boolean }) clearable = false
  @property({ type: Boolean }) multiple = false
  @property({ type: Boolean }) searchable = false
  @property({ type: Boolean, reflect: true }) panel = false
  @property({ type: Boolean, attribute: 'checkable' }) checkable = false
  @property({ type: Boolean, attribute: 'default-expand-all' }) defaultExpandAll = false
  @property({ attribute: 'search-placeholder' }) searchPlaceholder = 'Search...'
  @property({ attribute: 'empty-text' }) emptyText = 'No data'

  @state() private _open = false
  @state() private _expandedKeys = new Set<string>()
  @state() private _searchQuery = ''

  private get _ctrl() {
    return this.hasAttribute('value')
  }
  private get _resVal(): string | string[] {
    return this._ctrl ? this.value : this.defaultValue
  }

  override connectedCallback() {
    super.connectedCallback()
    if (this.defaultExpandAll) {
      this._expandAll(this.options)
    }
    if (!this.panel) document.addEventListener('click', this._onDocClick)
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('click', this._onDocClick)
  }

  private _onDocClick = (e: Event) => {
    if (!e.composedPath().includes(this)) this._close()
  }

  private _toggle() {
    if (this.disabled || this.panel) return
    this._open ? this._close() : this._openDropdown()
  }

  private _openDropdown() {
    this._open = true
  }

  private _close() {
    if (this.panel) return
    this._open = false
    this._searchQuery = ''
  }

  private _expandAll(opts: TreeOption[]) {
    for (const opt of opts) {
      if (opt.children && opt.children.length > 0) {
        this._expandedKeys.add(opt.value)
        this._expandAll(opt.children)
      }
    }
  }

  /* ── Value helpers ── */
  private _getSelectedSet(): Set<string> {
    const v = this._resVal
    if (this.multiple) {
      return new Set(Array.isArray(v) ? v : v ? [v] : [])
    }
    return v ? new Set([v as string]) : new Set()
  }

  private _getLabel(value: string): string {
    const find = (opts: TreeOption[]): string | undefined => {
      for (const opt of opts) {
        if (opt.value === value) return opt.label
        if (opt.children) {
          const found = find(opt.children)
          if (found) return found
        }
      }
      return undefined
    }
    return find(this.options) || value
  }

  private _isSelected(value: string): boolean {
    return this._getSelectedSet().has(value)
  }

  private _getCheckState(opt: TreeOption): CheckState {
    const selected = this._getSelectedSet()
    if (!opt.children || opt.children.length === 0) {
      return selected.has(opt.value) ? 'checked' : 'unchecked'
    }
    const childrenStates = opt.children.map((c) => this._getCheckState(c))
    if (childrenStates.every((s) => s === 'checked')) return 'checked'
    if (childrenStates.some((s) => s === 'checked' || s === 'half-checked')) return 'half-checked'
    return 'unchecked'
  }

  /* ── Selection ── */
  private _select(value: string, label: string) {
    if (this.multiple) {
      const set = this._getSelectedSet()
      if (set.has(value)) {
        set.delete(value)
      } else {
        set.add(value)
      }
      const arr = Array.from(set)
      if (this._ctrl) this._emit(arr)
      else {
        this.defaultValue = arr
        this._emit(arr)
      }
    } else {
      if (this._ctrl) this._emit(value)
      else {
        this.defaultValue = value
        this._emit(value)
      }
      this._close()
    }
  }

  private _toggleCheck(opt: TreeOption) {
    const state = this._getCheckState(opt)
    const shouldCheck = state !== 'checked'
    const set = this._getSelectedSet()

    const toggleNode = (o: TreeOption) => {
      if (o.disabled) return
      if (shouldCheck) {
        set.add(o.value)
      } else {
        set.delete(o.value)
      }
      if (o.children) {
        o.children.forEach(toggleNode)
      }
    }

    toggleNode(opt)

    const arr = Array.from(set)
    if (this._ctrl) this._emit(arr)
    else {
      this.defaultValue = arr
      this._emit(arr)
    }
  }

  private _removeTag(value: string, e: Event) {
    e.stopPropagation()
    if (this.multiple) {
      const set = this._getSelectedSet()
      set.delete(value)
      const arr = Array.from(set)
      if (this._ctrl) this._emit(arr)
      else {
        this.defaultValue = arr
        this._emit(arr)
      }
    }
  }

  private _clear(e: Event) {
    e.stopPropagation()
    if (this.multiple) {
      if (this._ctrl) this._emit([])
      else {
        this.defaultValue = []
        this._emit([])
      }
    } else {
      if (this._ctrl) this._emit('')
      else {
        this.defaultValue = ''
        this._emit('')
      }
    }
  }

  private _emit(value: string | string[]) {
    this.emit('mac-change', { detail: { value } })
  }

  /* ── Expand / Collapse ── */
  private _toggleExpand(value: string, e: Event) {
    e.stopPropagation()
    if (this._expandedKeys.has(value)) {
      this._expandedKeys.delete(value)
    } else {
      this._expandedKeys.add(value)
    }
    this.requestUpdate()
  }

  /* ── Search ── */
  private _filterOptions(opts: TreeOption[], query: string): TreeOption[] {
    const q = query.toLowerCase()
    const result: TreeOption[] = []

    for (const opt of opts) {
      const matchLabel = opt.label.toLowerCase().includes(q)
      const matchValue = opt.value.toLowerCase().includes(q)
      const selfMatch = matchLabel || matchValue

      if (!opt.children || opt.children.length === 0) {
        if (selfMatch) result.push(opt)
        continue
      }

      const childMatches = this._filterOptions(opt.children, query)
      if (selfMatch || childMatches.length > 0) {
        result.push({ ...opt, children: childMatches })
        // Auto-expand when filtering
        this._expandedKeys.add(opt.value)
      }
    }

    return result
  }

  /* ── Keyboard ── */
  private _onKey(e: KeyboardEvent) {
    if (this.disabled || this.panel) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this._toggle()
    }
    if (e.key === 'Escape') this._close()
  }

  /* ── Render helpers ── */
  private _renderNode(opt: TreeOption, depth = 0): ReturnType<typeof html> {
    const hasChildren = opt.children && opt.children.length > 0
    const expanded = this._expandedKeys.has(opt.value)
    const selected = this._isSelected(opt.value)
    const checkState = this.multiple && this.checkable ? this._getCheckState(opt) : undefined
    const showCheck = this.multiple && this.checkable

    return html`
      <div>
        <div
          class="tree-node ${selected ? 'tree-node--selected' : ''} ${opt.disabled
            ? 'tree-node--disabled'
            : ''}"
          style="padding-left: ${depth * 16}px"
          @click=${() => {
            if (opt.disabled) return
            if (showCheck) {
              this._toggleCheck(opt)
            } else {
              this._select(opt.value, opt.label)
            }
          }}
        >
          <button
            class="tree-toggle ${hasChildren ? '' : 'tree-toggle--placeholder'} ${expanded
              ? 'tree-toggle--expanded'
              : ''}"
            @click=${hasChildren ? (e: Event) => this._toggleExpand(opt.value, e) : undefined}
            tabindex="-1"
            type="button"
          >
            ${hasChildren
              ? html`<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" />
                </svg>`
              : nothing}
          </button>

          ${showCheck
            ? html`
                <span
                  class="tree-checkbox ${checkState === 'checked'
                    ? 'tree-checkbox--checked'
                    : checkState === 'half-checked'
                      ? 'tree-checkbox--half'
                      : ''}"
                  @click=${(e: Event) => {
                    e.stopPropagation()
                    if (!opt.disabled) this._toggleCheck(opt)
                  }}
                ></span>
              `
            : nothing}

          <span class="tree-label">${opt.label}</span>
        </div>

        ${hasChildren && expanded
          ? html`<div class="tree-children">
              ${opt.children!.map((c) => this._renderNode(c, depth + 1))}
            </div>`
          : nothing}
      </div>
    `
  }

  private _renderTrigger() {
    const val = this._resVal
    const hasValue = this.multiple ? Array.isArray(val) && val.length > 0 : val !== ''
    const size = this._resolvedSize

    const display = this.multiple
      ? Array.isArray(val) && val.length > 0
        ? html`
            <div class="tree-tags">
              ${val.map(
                (v) => html`
                  <span class="tree-tag">
                    ${this._getLabel(v)}
                    <button
                      class="tree-tag-remove"
                      @click=${(e: Event) => this._removeTag(v, e)}
                      tabindex="-1"
                      type="button"
                    >
                      ✕
                    </button>
                  </span>
                `,
              )}
            </div>
          `
        : html`<span class="tree-placeholder">${this.placeholder}</span>`
      : hasValue
        ? html`<span class="tree-value">${this._getLabel(val as string)}</span>`
        : html`<span class="tree-placeholder">${this.placeholder}</span>`

    return html`
      <div
        class="tree-trigger tree-trigger--${size} ${this._open ? 'open' : ''} ${this.error
          ? 'tree-trigger--error'
          : ''} ${this.success ? 'tree-trigger--success' : ''} ${this.disabled
          ? 'tree-trigger--disabled'
          : ''}"
        part="trigger"
        @click=${this._toggle}
        @keydown=${this._onKey}
        tabindex=${this.disabled ? '-1' : '0'}
        role="combobox"
        aria-expanded=${this._open}
      >
        <div class="tree-value">${display}</div>
        <div class="tree-actions">
          ${this.clearable && hasValue && !this.disabled
            ? html`<button class="tree-clear" @click=${this._clear} tabindex="-1" type="button">
                ✕
              </button>`
            : nothing}
          <span class="tree-arrow">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" />
            </svg>
          </span>
        </div>
      </div>
    `
  }

  private _renderDropdown() {
    const filtered = this._searchQuery
      ? this._filterOptions([...this.options], this._searchQuery)
      : this.options

    return html`
      <div
        class="tree-dropdown ${this._open ? 'open' : ''} ${this.panel
          ? 'tree-dropdown--inline'
          : ''}"
        part="dropdown"
      >
        ${this.searchable
          ? html`
              <div class="tree-search">
                <input
                  class="tree-search-input"
                  type="text"
                  placeholder=${this.searchPlaceholder}
                  .value=${this._searchQuery}
                  @input=${(e: Event) => {
                    this._searchQuery = (e.target as HTMLInputElement).value
                  }}
                  @keydown=${(e: KeyboardEvent) => e.stopPropagation()}
                />
              </div>
            `
          : nothing}
        ${filtered.length === 0
          ? html`<div class="tree-empty">${this.emptyText}</div>`
          : filtered.map((opt) => this._renderNode(opt))}
      </div>
    `
  }

  override render() {
    return html`
      <div class="tree-select" part="base">
        ${this.panel ? nothing : this._renderTrigger()} ${this._renderDropdown()}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-tree-select': MacTreeSelect
  }
}
