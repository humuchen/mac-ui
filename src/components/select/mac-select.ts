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
 * @summary macOS 风格的下拉选择组件。
 *
 * @csspart base - 选择器的基础容器。
 * @csspart trigger - 触发按钮。
 * @csspart dropdown - 下拉菜单。
 * @csspart option - 下拉菜单中的选项。
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

      /* 触发按钮 */
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
        transition:
          border-color var(--md-transition-normal),
          background var(--md-transition-normal),
          box-shadow var(--md-transition-normal);
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

      /* 聚焦状态 */
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

      /* 错误和成功状态 */
      .select-trigger--error.select-trigger--default {
        border-color: var(--md-color-danger);
      }

      .select-trigger--success.select-trigger--default {
        border-color: var(--md-color-success);
      }

      /* 禁用状态 */
      .select-trigger--disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      /* 选中值显示 */
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

      /* 多选标签 */
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
        transition: background var(--md-transition-fast);
      }

      .select-tag-remove:hover {
        background: rgba(0, 0, 0, 0.15);
      }

      /* 箭头图标 */
      .select-arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        transition: transform var(--md-transition-normal);
        color: var(--md-color-text-secondary);
      }

      .select-trigger.open .select-arrow {
        transform: rotate(180deg);
      }

      /* 清除按钮 */
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
        transition:
          background var(--md-transition-fast),
          color var(--md-transition-fast);
        padding: 0;
      }

      .select-clear:hover {
        background: rgba(0, 0, 0, 0.1);
        color: var(--md-color-text);
      }

      /* 下拉菜单 */
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
        z-index: 99999;
        opacity: 0;
        transform: translateY(-8px);
        pointer-events: none;
        transition:
          opacity var(--md-transition-normal),
          transform var(--md-transition-normal);
      }

      .select-dropdown.open {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      /* 搜索输入框 */
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
        transition: border-color var(--md-transition-normal);
      }

      .select-search-input:focus {
        border-color: var(--md-color-primary);
      }

      /* 选项分组 */
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

      /* 选项 */
      .select-option {
        display: flex;
        align-items: center;
        gap: var(--md-spacing-sm);
        padding: var(--md-spacing-sm) var(--md-spacing-md);
        cursor: pointer;
        transition: background var(--md-transition-fast);
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

      /* 空状态 */
      .select-empty {
        padding: var(--md-spacing-lg);
        text-align: center;
        color: var(--md-color-text-secondary);
      }

      /* 加载状态 */
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

      /* 标签 */
      .select-label {
        font-size: var(--md-font-size-base);
        color: var(--md-color-text);
        font-weight: 500;
      }

      .select-label--required::after {
        content: ' *';
        color: var(--md-color-danger);
      }

      /* 辅助文本 */
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

      /* 尺寸 */
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

      :host([data-theme='dark']) .select-trigger--filled {
        background: var(--md-select-container-dark-filled-bg);
      }

      :host([data-theme='dark']) .select-trigger--glass {
        background: var(--md-select-container-dark-glass-bg);
      }

      :host([data-theme='dark']) .select-dropdown {
        background: var(--md-select-container-dark-bg);
        border-color: var(--md-select-container-dark-border);
      }

      :host([data-theme='dark']) .select-option:hover {
        background: var(--md-select-item-dark-hover-bg);
      }

      :host([data-theme='dark']) .select-option.selected {
        background: var(--md-select-item-dark-selected-bg);
      }

      :host([data-theme='dark']) .select-option.focused {
        background: var(--md-select-item-dark-focused-bg);
      }

      :host([data-theme='dark']) .select-tag {
        background: var(--md-select-tag-dark-bg);
      }

      :host([data-theme='dark']) .select-clear {
        background: var(--md-select-clear-dark-bg);
      }

      :host([data-theme='dark']) .select-clear:hover {
        background: var(--md-select-clear-dark-hover-bg);
      }

      /* ─── 响应式：移动端适配 ─── */
      @media (max-width: 768px) {
        /* 下拉面板增大最大高度，方便触控滚动选择 */
        .select-dropdown {
          max-height: 50vh;
        }
        /* 搜索框字号 16px 防止 iOS 聚焦缩放 */
        .select-search-input {
          font-size: 16px;
          padding: 10px 12px;
        }
        /* 选项触控目标 ≥ 44px */
        .select-option {
          padding: 12px var(--md-spacing-md);
          font-size: 16px;
        }
        .select-option-label {
          font-size: 16px;
        }
        .select-option-description {
          font-size: 13px;
        }
        .select-option-icon {
          width: 24px;
          height: 24px;
          font-size: 20px;
        }
        .select-option-check {
          width: 22px;
          height: 22px;
          font-size: 18px;
        }
        .select-group-label {
          font-size: 13px;
          padding: 10px var(--md-spacing-md);
        }
      }
    `,
  ]

  /** 选择器的值（单选：string，多选：string[]）。 */
  @property({ type: String }) value: string | string[] = ''

  /** 选择器的占位符。 */
  @property() placeholder = 'Select an option'

  /** 选择器的选项。 */
  @property({ type: Array }) options: SelectOption[] = []

  /** 选项分组。 */
  @property({ type: Array }) groups: OptionGroup[] = []

  /** 选择器的尺寸。 */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** 视觉变体。 */
  @property({ reflect: true }) variant: 'default' | 'filled' | 'glass' = 'default'

  /** 选择器的标签。 */
  @property() label = ''

  /** 显示必填指示器。 */
  @property({ type: Boolean }) required = false

  /** 禁用选择器。 */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** 选择器的错误状态。 */
  @property({ type: Boolean, reflect: true }) error = false

  /** 选择器的成功状态。 */
  @property({ type: Boolean, reflect: true }) success = false

  /** 选择器的辅助文本。 */
  @property({ attribute: 'helper-text' }) helperText = ''

  /** 启用多选。 */
  @property({ type: Boolean }) multiple = false

  /** 显示清除按钮。 */
  @property({ type: Boolean }) clearable = false

  /** 启用搜索功能。 */
  @property({ type: Boolean }) searchable = false

  /** 显示加载状态。 */
  @property({ type: Boolean }) loading = false

  /** 搜索输入框的占位符。 */
  @property({ attribute: 'search-placeholder' }) searchPlaceholder = 'Search...'

  /** 无选项时的空文本。 */
  @property({ attribute: 'empty-text' }) emptyText = 'No options available'

  @state() private _open = false

  @state() private _searchQuery = ''

  @state() private _focusedIndex = -1

  @query('.select-trigger') private _trigger!: HTMLElement

  private _portalEl: HTMLElement | null = null
  private _portalId = `mac-select-portal-${Math.random().toString(36).substr(2, 9)}`
  private _scrollHandler: (() => void) | null = null

  private static _stylesInjected = false
  private static _injectPortalStyles() {
    if (MacSelect._stylesInjected) return
    MacSelect._stylesInjected = true

    // 向 :root 注入全局 CSS 变量，以便 portal 可以访问
    const vars = document.createElement('style')
    vars.id = 'mac-select-theme-vars'
    vars.textContent = `
      :root {
        /* 字体 */
        --md-font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;

        /* 间距 */
        --md-spacing-xs: 4px;
        --md-spacing-sm: 8px;
        --md-spacing-md: 12px;

        /* 圆角 */
        --md-radius-sm: 4px;
        --md-radius-md: 6px;

        /* 字号 */
        --md-font-size-xs: 11px;
        --md-font-size-sm: 12px;
        --md-font-size-menu: 13px;

        /* 过渡 */
        --md-transition-fast: 150ms ease;

        /* 颜色 */
        --md-color-bg: #ffffff;
        --md-color-border: #d1d5db;
        --md-color-text: #1f2937;
        --md-color-text-secondary: #6b7280;
        --md-color-primary: #3b82f6;

        /* 选择器专属 */
        --md-select-item-hover-bg: rgba(0, 122, 255, 0.05);
        --md-select-item-selected-bg: rgba(0, 122, 255, 0.08);
        --md-select-item-focused-bg: rgba(0, 122, 255, 0.1);

        /* 深色主题颜色 */
        --md-color-dark-bg: rgba(30, 30, 30, 0.95);
        --md-color-dark-border: rgba(255, 255, 255, 0.1);
        --md-color-dark-text: #f5f5f7;
        --md-color-dark-text-secondary: #98989d;
        --md-select-item-dark-hover-bg: rgba(255, 255, 255, 0.08);
        --md-select-item-dark-selected-bg: rgba(0, 122, 255, 0.15);
      }
    `
    document.head.appendChild(vars)

    const style = document.createElement('style')
    style.id = 'mac-select-portal-styles'
    style.textContent = `
      .mac-select-portal {
        position: fixed;
        min-width: 100px;
        max-height: 300px;
        overflow-y: auto;
        background: var(--md-color-bg);
        border: 1px solid var(--md-color-border);
        border-radius: var(--md-radius-md);
        box-shadow:
          0 4px 16px rgba(0, 0, 0, 0.12),
          0 2px 8px rgba(0, 0, 0, 0.08);
        z-index: 99999;
        opacity: 0;
        transform: translateY(-8px);
        pointer-events: none;
        transition:
          opacity var(--md-transition-fast),
          transform var(--md-transition-fast);
        font-family: var(--md-font-family);
      }
      .mac-select-portal.open {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      /* 搜索 */
      .mac-select-portal .select-search {
        padding: var(--md-spacing-sm);
        border-bottom: 1px solid var(--md-color-border);
      }
      .mac-select-portal .select-search-input {
        width: 100%;
        padding: var(--md-spacing-xs) var(--md-spacing-sm);
        border: 1px solid var(--md-color-border);
        border-radius: var(--md-radius-sm);
        font-size: var(--md-font-size-menu);
        background: var(--md-color-bg);
        color: var(--md-color-text);
        outline: none;
      }
      .mac-select-portal .select-search-input:focus {
        border-color: var(--md-color-primary);
      }

      /* 选项 */
      .mac-select-portal .select-options {
        padding: var(--md-spacing-xs) 0;
      }
      .mac-select-portal .select-group-label {
        padding: var(--md-spacing-xs) var(--md-spacing-md);
        font-size: var(--md-font-size-xs);
        font-weight: 600;
        color: var(--md-color-text-secondary);
        user-select: none;
      }
      .mac-select-portal .select-option {
        display: flex;
        align-items: center;
        gap: var(--md-spacing-sm);
        padding: var(--md-spacing-sm) var(--md-spacing-md);
        cursor: pointer;
        transition: background var(--md-transition-fast);
        user-select: none;
      }
      .mac-select-portal .select-option:hover:not(.disabled) {
        background: var(--md-select-item-hover-bg);
      }
      .mac-select-portal .select-option.focused {
        background: var(--md-select-item-focused-bg);
      }
      .mac-select-portal .select-option.selected {
        background: var(--md-select-item-selected-bg);
      }
      .mac-select-portal .select-option.disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .mac-select-portal .select-option-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        font-size: 16px;
      }
      .mac-select-portal .select-option-content {
        flex: 1;
      }
      .mac-select-portal .select-option-label {
        font-size: var(--md-font-size-menu);
        color: var(--md-color-text);
      }
      .mac-select-portal .select-option-description {
        font-size: var(--md-font-size-xs);
        color: var(--md-color-text-secondary);
        margin-top: 2px;
      }

      /* 空状态 */
      .mac-select-portal .select-empty {
        padding: var(--md-spacing-lg) var(--md-spacing-md);
        text-align: center;
        color: var(--md-color-text-secondary);
        font-size: var(--md-font-size-sm);
      }

      /* 深色主题 */
      .mac-select-portal[data-theme='dark'] {
        background: var(--md-color-dark-bg);
        border-color: var(--md-color-dark-border);
      }
      .mac-select-portal[data-theme='dark'] .select-search {
        border-bottom-color: var(--md-color-dark-border);
      }
      .mac-select-portal[data-theme='dark'] .select-search-input {
        background: rgba(30, 30, 30, 0.9);
        border-color: rgba(255, 255, 255, 0.15);
        color: var(--md-color-dark-text);
      }
      .mac-select-portal[data-theme='dark'] .select-group-label {
        color: var(--md-color-dark-text-secondary);
      }
      .mac-select-portal[data-theme='dark'] .select-option:hover:not(.disabled) {
        background: var(--md-select-item-dark-hover-bg);
      }
      .mac-select-portal[data-theme='dark'] .select-option.selected {
        background: var(--md-select-item-dark-selected-bg);
      }
      .mac-select-portal[data-theme='dark'] .select-option-label {
        color: var(--md-color-dark-text);
      }
      .mac-select-portal[data-theme='dark'] .select-option-description {
        color: var(--md-color-dark-text-secondary);
      }
      .mac-select-portal[data-theme='dark'] .select-empty {
        color: var(--md-color-dark-text-secondary);
      }
    `
    document.head.appendChild(style)
  }

  private _handleDocumentClick = (e: Event) => {
    const path = e.composedPath()
    if (!path.includes(this)) {
      this._close()
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    MacSelect._injectPortalStyles()
    document.addEventListener('click', this._handleDocumentClick)
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('click', this._handleDocumentClick)
    this._removeScrollListener()
    this._removePortal()
  }

  private _addScrollListener() {
    if (this._scrollHandler) return
    this._scrollHandler = () => {
      if (this._open && this._portalEl && this._trigger) {
        const rect = this._trigger.getBoundingClientRect()
        this._portalEl.style.left = `${rect.left}px`
        this._portalEl.style.top = `${rect.bottom + 4}px`
      }
    }
    window.addEventListener('scroll', this._scrollHandler, true)
    window.addEventListener('resize', this._scrollHandler)
  }

  private _removeScrollListener() {
    if (this._scrollHandler) {
      window.removeEventListener('scroll', this._scrollHandler, true)
      window.removeEventListener('resize', this._scrollHandler)
      this._scrollHandler = null
    }
  }

  private _toggle() {
    if (this.disabled) return
    this._open ? this._close() : this._openDropdown()
  }

  private _openDropdown() {
    this._open = true
    this._focusedIndex = -1
    this._createPortal()
  }

  private _close() {
    this._open = false
    this._searchQuery = ''
    this._focusedIndex = -1
    this._removePortal()
  }

  private _createPortal() {
    this._removePortal()

    if (!this._trigger) return

    const rect = this._trigger.getBoundingClientRect()
    const portal = document.createElement('div')
    portal.id = this._portalId
    portal.className = 'mac-select-portal'
    portal.setAttribute('role', 'listbox')
    portal.setAttribute('part', 'dropdown')
    portal.setAttribute('aria-multiselectable', String(this.multiple))

    const theme = this._resolvedTheme
    if (theme) {
      portal.setAttribute('data-theme', theme)
    }

    // 位置
    const left = rect.left
    const top = rect.bottom + 4
    const width = rect.width

    portal.style.left = `${left}px`
    portal.style.top = `${top}px`
    portal.style.width = `${width}px`

    // 渲染下拉内容
    portal.innerHTML = this._renderDropdownHTML()

    document.body.appendChild(portal)
    this._portalEl = portal

    // 绑定事件
    this._bindPortalEvents(portal)

    // 添加滚动监听器以更新位置
    this._addScrollListener()

    // 进入动画
    requestAnimationFrame(() => {
      portal.classList.add('open')
    })
  }

  private _removePortal() {
    this._removeScrollListener()
    if (this._portalEl) {
      this._portalEl.classList.remove('open')
      const el = this._portalEl
      setTimeout(() => {
        if (el.parentNode) {
          el.parentNode.removeChild(el)
        }
      }, 200)
      this._portalEl = null
    }
  }

  private _renderDropdownHTML(): string {
    const filteredOptions = this._getFilteredOptions()

    let html = ''

    // 搜索框
    if (this.searchable) {
      html += `
        <div class="select-search">
          <input
            class="select-search-input"
            type="text"
            placeholder="${this.searchPlaceholder}"
            data-search-input
          />
        </div>
      `
    }

    // 空状态
    if (filteredOptions.length === 0) {
      html += `<div class="select-empty">${this.emptyText}</div>`
    } else {
      // 选项列表
      html += '<div class="select-options">'
      filteredOptions.forEach((item, index) => {
        if ('type' in item && item.type === 'group') {
          html += `<div class="select-group-label">${item.label}</div>`
        } else {
          const option = item as SelectOption
          const isSelected = this._isSelected(option.value)
          const classes = [
            'select-option',
            isSelected ? 'select-option--selected' : '',
            option.disabled ? 'select-option--disabled' : '',
            index === this._focusedIndex ? 'focused' : '',
          ]
            .filter(Boolean)
            .join(' ')

          html += `
            <div
              class="${classes}"
              data-value="${option.value}"
              data-index="${index}"
              data-disabled="${!!option.disabled}"
              role="option"
              aria-selected="${isSelected}"
              aria-disabled="${!!option.disabled}"
            >
              ${option.icon ? `<span class="select-option-icon">${option.icon}</span>` : ''}
              <span class="select-option-label">${option.label}</span>
              ${option.description ? `<span class="select-option-description">${option.description}</span>` : ''}
            </div>
          `
        }
      })
      html += '</div>'
    }

    return html
  }

  private _bindPortalEvents(portal: HTMLElement) {
    // 搜索输入框事件
    const searchInput = portal.querySelector('[data-search-input]') as HTMLInputElement | null
    if (searchInput) {
      searchInput.value = this._searchQuery
      searchInput.addEventListener('input', (e) => {
        this._searchQuery = searchInput.value
        this._focusedIndex = -1
        // 重新渲染下拉内容
        portal.innerHTML = this._renderDropdownHTML()
        this._bindPortalEvents(portal)
      })
      searchInput.addEventListener('keydown', (e) => {
        e.stopPropagation()
        this._handleKeyDown(e)
      })
      // 聚焦搜索输入框
      requestAnimationFrame(() => {
        searchInput.focus()
      })
    }

    // 选项点击事件
    portal.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('.select-option') as HTMLElement | null
      if (!target) return

      const isDisabled = target.dataset.disabled === 'true'
      if (isDisabled) return

      const value = target.dataset.value
      if (value) {
        const option = this._getAllOptions().find((o) => o.value === value)
        if (option) {
          this._selectOption(option)
          // 多选时重新渲染（更新选中状态）
          if (this.multiple) {
            portal.innerHTML = this._renderDropdownHTML()
            this._bindPortalEvents(portal)
          }
        }
      }
    })
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
    const option = this._portalEl?.querySelector('.select-option.focused') as HTMLElement
    if (option) {
      option.scrollIntoView({ block: 'nearest' })
    }
  }

  private _getDisplayValue(): string {
    if (this.multiple && Array.isArray(this.value)) {
      if (this.value.length === 0) return ''
      return `${this.value.length} selected`
    }

    const option = this._getAllOptions().find((opt) => opt.value === this.value)
    return option?.label || ''
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

  override render() {
    const displayValue = this._getDisplayValue()
    const hasValue = this.multiple
      ? Array.isArray(this.value) && this.value.length > 0
      : this.value !== ''
    const filteredOptions = this._getFilteredOptions()
    const size = this._resolvedSize

    return html`
      <div class="select-wrapper" part="base">
        ${
          this.label
            ? html`
                <label class="select-label ${this.required ? 'select-label--required' : ''}">
                  ${this.label}
                </label>
              `
            : nothing
        }

        <div
          class="select-trigger
            select-trigger--${this.variant}
            select-trigger--${size}
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
            ${
              this.multiple && Array.isArray(this.value) && this.value.length > 0
                ? html`
                    <div class="select-tags">
                      ${this.value.map((v) => {
                        const opt = this._getAllOptions().find((o) => o.value === v)
                        return html`
                          <span class="select-tag">
                            ${opt?.icon ? html`<span>${opt.icon}</span>` : nothing}
                            ${opt?.label || v}
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
                          ${
                          opt?.icon
                            ? html`<span class="select-option-icon">${opt.icon}</span>`
                            : nothing
                        }
                          <span class="select-value-text">${displayValue}</span>
                        `
                      })()}
                    `
                  : html`<span class="select-placeholder">${this.placeholder}</span>`
            }
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            ${
              this.clearable && hasValue && !this.disabled
                ? html`
                    <button class="select-clear" @click=${this._clear} tabindex="-1">✕</button>
                  `
                : nothing
            }

            <span class="select-arrow">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" />
              </svg>
            </span>
          </div>
        </div>

        ${
          this.helperText
            ? html`
                <div
                  class="select-helper-text
                  ${this.error ? 'select-helper-text--error' : ''}
                  ${this.success ? 'select-helper-text--success' : ''}"
                >
                  ${this.helperText}
                </div>
              `
            : nothing
        }
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-select': MacSelect
  }
}
