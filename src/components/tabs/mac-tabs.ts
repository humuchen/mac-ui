import { html, css, nothing } from 'lit'
import { property, customElement, state, query } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

export interface TabItem {
  /** Unique key */
  key: string
  /** Tab label */
  label: string
  /** Whether the tab is disabled */
  disabled?: boolean
  /** Whether the tab is closable */
  closable?: boolean
}

/**
 * @tag mac-tabs
 * @summary A macOS-style tabs component with animated indicator.
 *
 * @slot - Default slot for mac-tab-pane elements.
 * @slot prefix - Content before the tab nav.
 * @slot suffix - Content after the tab nav.
 *
 * @cssproperty --md-tabs-nav-bg - Tab navigation bar background.
 * @cssproperty --md-tabs-nav-border - Tab navigation bar bottom border.
 * @cssproperty --md-tabs-nav-padding - Tab navigation bar padding.
 * @cssproperty --md-tabs-item-color - Tab item text color.
 * @cssproperty --md-tabs-item-hover-color - Tab item hover text color.
 * @cssproperty --md-tabs-item-active-color - Tab item active text color.
 * @cssproperty --md-tabs-item-disabled-color - Tab item disabled text color.
 * @cssproperty --md-tabs-item-padding - Tab item padding.
 * @cssproperty --md-tabs-item-font-size - Tab item font size.
 * @cssproperty --md-tabs-item-gap - Gap between tab items.
 * @cssproperty --md-tabs-indicator-color - Active indicator color.
 * @cssproperty --md-tabs-indicator-height - Active indicator height.
 * @cssproperty --md-tabs-indicator-radius - Active indicator radius.
 * @cssproperty --md-tabs-pane-padding - Tab pane content padding.
 * @cssproperty --md-tabs-close-color - Close icon color.
 * @cssproperty --md-tabs-close-hover-color - Close icon hover color.
 * @cssproperty --md-tabs-close-hover-bg - Close icon hover background.
 * @cssproperty --md-tabs-add-color - Add icon color.
 * @cssproperty --md-tabs-add-hover-color - Add icon hover color.
 * @cssproperty --md-tabs-add-hover-bg - Add icon hover background.
 * @cssproperty --md-tabs-segment-bg - Segment type background.
 * @cssproperty --md-tabs-segment-item-color - Segment item text color.
 * @cssproperty --md-tabs-segment-item-active-bg - Segment active item background.
 * @cssproperty --md-tabs-segment-item-active-color - Segment active item text color.
 * @cssproperty --md-tabs-segment-item-hover-bg - Segment item hover background.
 * @cssproperty --md-tabs-segment-radius - Segment container radius.
 *
 * @event mac-tabs-change - Emitted when active tab changes. `detail: { key: string }`
 * @event mac-tabs-close - Emitted when a tab is closed. `detail: { key: string }`
 * @event mac-tabs-add - Emitted when add button is clicked.
 */
@customElement('mac-tabs')
export class MacTabs extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        --md-tabs-nav-bg: transparent;
        --md-tabs-nav-border: var(--md-glass-separator);
        --md-tabs-nav-padding: 0 var(--md-spacing-lg);
        --md-tabs-item-color: var(--md-color-text-secondary);
        --md-tabs-item-hover-color: var(--md-color-text);
        --md-tabs-item-active-color: var(--md-mac-accent);
        --md-tabs-item-disabled-color: var(--md-color-text-secondary);
        --md-tabs-item-padding: var(--md-spacing-sm) var(--md-spacing-md);
        --md-tabs-item-font-size: var(--md-font-size-base);
        --md-tabs-item-gap: var(--md-spacing-xs);
        --md-tabs-indicator-color: var(--md-mac-accent);
        --md-tabs-indicator-height: 2px;
        --md-tabs-indicator-radius: 1px;
        --md-tabs-pane-padding: var(--md-spacing-lg) 0;
        --md-tabs-close-color: var(--md-color-text-secondary);
        --md-tabs-close-hover-color: var(--md-color-text);
        --md-tabs-close-hover-bg: rgba(0, 0, 0, 0.06);
        --md-tabs-add-color: var(--md-color-text-secondary);
        --md-tabs-add-hover-color: var(--md-color-text);
        --md-tabs-add-hover-bg: rgba(0, 0, 0, 0.06);
        --md-tabs-segment-bg: rgba(0, 0, 0, 0.04);
        --md-tabs-segment-item-color: var(--md-color-text-secondary);
        --md-tabs-segment-item-active-bg: var(--md-color-bg);
        --md-tabs-segment-item-active-color: var(--md-color-text);
        --md-tabs-segment-item-hover-bg: rgba(0, 0, 0, 0.04);
        --md-tabs-segment-radius: var(--md-radius-md);
      }

      /* ─── Navigation Bar ─── */

      .nav {
        display: flex;
        align-items: center;
        background: var(--md-tabs-nav-bg);
        padding: var(--md-tabs-nav-padding);
        position: relative;
      }

      .nav-content {
        display: flex;
        align-items: center;
        gap: var(--md-tabs-item-gap);
        position: relative;
        flex: 1;
        overflow-x: auto;
        scrollbar-width: none;
      }

      .nav-content::-webkit-scrollbar {
        display: none;
      }

      /* ─── Tab Item ─── */

      .tab-item {
        display: flex;
        align-items: center;
        gap: var(--md-spacing-xs);
        padding: var(--md-tabs-item-padding);
        font-size: var(--md-tabs-item-font-size);
        color: var(--md-tabs-item-color);
        cursor: pointer;
        white-space: nowrap;
        user-select: none;
        border-radius: var(--md-radius-sm);
        transition:
          color var(--md-transition-fast),
          background var(--md-transition-fast);
        position: relative;
        flex-shrink: 0;
      }

      .tab-item:hover {
        color: var(--md-tabs-item-hover-color);
      }

      .tab-item.active {
        color: var(--md-tabs-item-active-color);
      }

      .tab-item.disabled {
        color: var(--md-tabs-item-disabled-color);
        opacity: 0.4;
        cursor: not-allowed;
      }

      .tab-item.disabled:hover {
        color: var(--md-tabs-item-disabled-color);
      }

      /* ─── Close Button ─── */

      .close-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        color: var(--md-tabs-close-color);
        transition:
          color var(--md-transition-fast),
          background var(--md-transition-fast);
        margin-left: 2px;
        flex-shrink: 0;
      }

      .close-btn:hover {
        color: var(--md-tabs-close-hover-color);
        background: var(--md-tabs-close-hover-bg);
      }

      .close-btn svg {
        width: 10px;
        height: 10px;
      }

      /* ─── Add Button ─── */

      .add-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: var(--md-radius-sm);
        color: var(--md-tabs-add-color);
        cursor: pointer;
        transition:
          color var(--md-transition-fast),
          background var(--md-transition-fast);
        flex-shrink: 0;
      }

      .add-btn:hover {
        color: var(--md-tabs-add-hover-color);
        background: var(--md-tabs-add-hover-bg);
      }

      .add-btn svg {
        width: 14px;
        height: 14px;
      }

      /* ─── Line Indicator ─── */

      .indicator {
        position: absolute;
        bottom: 0;
        height: var(--md-tabs-indicator-height);
        background: var(--md-tabs-indicator-color);
        border-radius: var(--md-tabs-indicator-radius);
        transition:
          left var(--md-transition-normal),
          width var(--md-transition-normal);
        pointer-events: none;
      }

      /* ─── Line Type: bottom border on nav ─── */

      :host([type='line']) .nav {
        border-bottom: 0.5px solid var(--md-tabs-nav-border);
      }

      /* ─── Card Type ─── */

      :host([type='card']) .tab-item {
        background: rgba(0, 0, 0, 0.03);
        border: 0.5px solid var(--md-tabs-nav-border);
        border-bottom: none;
        border-radius: var(--md-radius-md) var(--md-radius-md) 0 0;
        margin-bottom: -0.5px;
      }

      :host([type='card']) .tab-item.active {
        background: var(--md-color-bg);
        border-bottom: 0.5px solid var(--md-color-bg);
      }

      :host([type='card']) .nav {
        border-bottom: 0.5px solid var(--md-tabs-nav-border);
      }

      :host([type='card']) .indicator {
        display: none;
      }

      /* ─── Segment Type ─── */

      :host([type='segment']) .nav {
        padding: var(--md-spacing-xs);
        background: var(--md-tabs-segment-bg);
        border-radius: var(--md-tabs-segment-radius);
        border-bottom: none;
      }

      :host([type='segment']) .nav-content {
        gap: 0;
      }

      :host([type='segment']) .tab-item {
        padding: var(--md-spacing-xs) var(--md-spacing-lg);
        color: var(--md-tabs-segment-item-color);
        border-radius: var(--md-radius-sm);
        font-size: var(--md-font-size-sm);
      }

      :host([type='segment']) .tab-item:hover {
        background: var(--md-tabs-segment-item-hover-bg);
        color: var(--md-tabs-segment-item-color);
      }

      :host([type='segment']) .tab-item.active {
        background: var(--md-tabs-segment-item-active-bg);
        color: var(--md-tabs-segment-item-active-color);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }

      :host([type='segment']) .indicator {
        display: none;
      }

      /* ─── Tab Pane ─── */

      .pane-container {
        padding: var(--md-tabs-pane-padding);
      }

      /* ─── Size: sm ─── */

      :host([size='sm']) {
        --md-tabs-item-padding: var(--md-spacing-xs) var(--md-spacing-sm);
        --md-tabs-item-font-size: var(--md-font-size-sm);
        --md-tabs-item-gap: 2px;
        --md-tabs-pane-padding: var(--md-spacing-md) 0;
      }

      /* ─── Size: lg ─── */

      :host([size='lg']) {
        --md-tabs-item-padding: var(--md-spacing-md) var(--md-spacing-lg);
        --md-tabs-item-font-size: var(--md-font-size-lg);
        --md-tabs-item-gap: var(--md-spacing-sm);
        --md-tabs-pane-padding: var(--md-spacing-xl) 0;
      }

      :host([data-theme='dark']) {
        --md-tabs-nav-border: rgba(255, 255, 255, 0.08);
        --md-tabs-item-color: rgba(255, 255, 255, 0.55);
        --md-tabs-item-hover-color: rgba(255, 255, 255, 0.88);
        --md-tabs-item-active-color: rgba(0, 122, 255, 0.9);
        --md-tabs-item-disabled-color: rgba(255, 255, 255, 0.3);
        --md-tabs-indicator-color: rgba(0, 122, 255, 0.9);
        --md-tabs-close-color: rgba(255, 255, 255, 0.4);
        --md-tabs-close-hover-color: rgba(255, 255, 255, 0.8);
        --md-tabs-close-hover-bg: rgba(255, 255, 255, 0.08);
        --md-tabs-add-color: rgba(255, 255, 255, 0.4);
        --md-tabs-add-hover-color: rgba(255, 255, 255, 0.8);
        --md-tabs-add-hover-bg: rgba(255, 255, 255, 0.08);
        --md-tabs-segment-bg: rgba(255, 255, 255, 0.06);
        --md-tabs-segment-item-color: rgba(255, 255, 255, 0.55);
        --md-tabs-segment-item-active-bg: rgba(255, 255, 255, 0.12);
        --md-tabs-segment-item-active-color: rgba(255, 255, 255, 0.92);
        --md-tabs-segment-item-hover-bg: rgba(255, 255, 255, 0.08);
      }

      :host([data-theme='light']) {
        --md-tabs-nav-border: var(--md-glass-separator);
        --md-tabs-item-color: var(--md-color-text-secondary);
        --md-tabs-item-hover-color: var(--md-color-text);
        --md-tabs-item-active-color: var(--md-mac-accent);
        --md-tabs-item-disabled-color: var(--md-color-text-secondary);
        --md-tabs-indicator-color: var(--md-mac-accent);
        --md-tabs-close-color: var(--md-color-text-secondary);
        --md-tabs-close-hover-color: var(--md-color-text);
        --md-tabs-close-hover-bg: rgba(0, 0, 0, 0.06);
        --md-tabs-add-color: var(--md-color-text-secondary);
        --md-tabs-add-hover-color: var(--md-color-text);
        --md-tabs-add-hover-bg: rgba(0, 0, 0, 0.06);
        --md-tabs-segment-bg: rgba(0, 0, 0, 0.04);
        --md-tabs-segment-item-color: var(--md-color-text-secondary);
        --md-tabs-segment-item-active-bg: var(--md-color-bg);
        --md-tabs-segment-item-active-color: var(--md-color-text);
        --md-tabs-segment-item-hover-bg: rgba(0, 0, 0, 0.04);
      }

      /* ─── 响应式：移动端适配 ─── */
      @media (max-width: 768px) {
        .nav-content {
          /* 触屏惯性滚动 */
          -webkit-overflow-scrolling: touch;
          /* 允许触控横向滚动但禁用纵向 */
          touch-action: pan-x;
          scroll-snap-type: x proximity;
        }
        .tab-item {
          /* 接近 44px 触控目标，由 theme.ts 的 padding 变量已放大 */
          scroll-snap-align: start;
        }
        /* segment 类型：移动端允许换行，避免长文本被截断 */
        :host([type='segment']) .nav-content {
          flex-wrap: wrap;
          overflow-x: visible;
        }
      }
    `,
  ]

  /** Tab type: line (underline indicator), card (tab cards), segment (segmented control) */
  @property({ reflect: true }) type: 'line' | 'card' | 'segment' = 'line'

  /** Component size */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** Active tab key (controlled mode) */
  @property() value = ''

  /** Default active tab key (uncontrolled mode) */
  @property({ attribute: 'default-value' }) defaultValue = ''

  /** Whether tabs are closable */
  @property({ type: Boolean }) closable = false

  /** Whether to show add button */
  @property({ type: Boolean }) addable = false

  /** Whether to animate tab switching */
  @property({ type: Boolean }) animated = true

  /** Trigger mode: click or hover */
  @property() trigger: 'click' | 'hover' = 'click'

  /** Tab items data (alternative to slot) */
  @property({ type: Array }) items: TabItem[] = []

  @state() private _activeKey = ''

  @query('.nav-content') private _navContent!: HTMLElement

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

  override connectedCallback(): void {
    super.connectedCallback()
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has('value')) {
      this._activeKey = this.value
    }
    if (changed.has('items') || changed.has('value') || changed.has('_activeKey')) {
      this.updateComplete.then(() => {
        this._updateIndicator()
        this._syncPanes()
      })
    }
  }

  override firstUpdated(): void {
    this._initActiveKey()
    this.updateComplete.then(() => {
      this._updateIndicator()
      this._syncPanes()
    })
  }

  private _initActiveKey(): void {
    if (this.value) {
      this._activeKey = this.value
      return
    }
    if (this._activeKey) return // already initialized

    if (this.defaultValue) {
      this._activeKey = this.defaultValue
    } else {
      const items = this._getItems()
      if (items.length > 0) {
        this._activeKey = items[0].key
      }
    }
  }

  private _getItems(): TabItem[] {
    if (this.items && this.items.length > 0) {
      return this.items
    }
    const slotItems: TabItem[] = []
    const slotted = this.querySelectorAll('mac-tab-pane')
    slotted.forEach((el) => {
      slotItems.push({
        key: el.getAttribute('tab-key') || '',
        label: el.getAttribute('label') || '',
        disabled: el.hasAttribute('disabled'),
        closable: el.hasAttribute('closable'),
      })
    })
    return slotItems
  }

  private _getActiveKey(): string {
    return this.value || this._activeKey
  }

  private _selectTab(key: string): void {
    const items = this._getItems()
    const item = items.find((i) => i.key === key)
    if (!item || item.disabled) return

    if (!this.value) {
      this._activeKey = key
    }
    this.emit('mac-tabs-change', { detail: { key } })
  }

  private _closeTab(key: string, e: Event): void {
    e.stopPropagation()
    this.emit('mac-tabs-close', { detail: { key } })
  }

  private _handleAdd(): void {
    this.emit('mac-tabs-add')
  }

  private _handleTabHover(key: string): void {
    if (this.trigger !== 'hover') return
    this._selectTab(key)
  }

  private _updateIndicator(): void {
    if (this.type === 'card' || this.type === 'segment') return
    if (!this.animated) return

    const navContent = this._navContent
    if (!navContent) return

    const activeKey = this._getActiveKey()
    const tabEls = navContent.querySelectorAll('.tab-item')
    let activeEl: Element | null = null

    tabEls.forEach((el) => {
      if ((el as HTMLElement).dataset.key === activeKey) {
        activeEl = el
      }
    })

    const indicator = navContent.querySelector('.indicator') as HTMLElement | null
    if (!indicator || !activeEl) return

    const navRect = navContent.getBoundingClientRect()
    const activeRect = (activeEl as HTMLElement).getBoundingClientRect()

    indicator.style.left = `${activeRect.left - navRect.left + navContent.scrollLeft}px`
    indicator.style.width = `${activeRect.width}px`
  }

  private _syncPanes(): void {
    const activeKey = this._getActiveKey()
    const panes = this.querySelectorAll('mac-tab-pane')
    panes.forEach((pane) => {
      const paneKey = pane.getAttribute('tab-key') || ''
      if (paneKey === activeKey) {
        pane.setAttribute('active', '')
      } else {
        pane.removeAttribute('active')
      }
    })
  }

  private _renderCloseBtn(item: TabItem) {
    if (!this.closable && !item.closable) return nothing

    return html`
      <span class="close-btn" @click=${(e: Event) => this._closeTab(item.key, e)}>
        <svg
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        >
          <path d="M3 3l6 6M9 3l-6 6" />
        </svg>
      </span>
    `
  }

  private _renderAddBtn() {
    if (!this.addable) return nothing

    return html`
      <span class="add-btn" @click=${() => this._handleAdd()}>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        >
          <path d="M8 3v10M3 8h10" />
        </svg>
      </span>
    `
  }

  private _renderNav() {
    const items = this._getItems()
    const activeKey = this._getActiveKey()

    return html`
      <div class="nav">
        <slot name="prefix"></slot>
        <div class="nav-content">
          ${items.map(
            (item) => html`
              <div
                class="tab-item ${item.key === activeKey ? 'active' : ''} ${item.disabled
                  ? 'disabled'
                  : ''}"
                data-key=${item.key}
                @click=${() => this._selectTab(item.key)}
                @mouseenter=${() => this._handleTabHover(item.key)}
              >
                <span class="tab-label">${item.label}</span>
                ${this._renderCloseBtn(item)}
              </div>
            `,
          )}
          ${this.type === 'line' && this.animated ? html`<div class="indicator"></div>` : nothing}
        </div>
        ${this._renderAddBtn()}
        <slot name="suffix"></slot>
      </div>
    `
  }

  override render() {
    return html`
      ${this._renderNav()}
      <div class="pane-container">
        <slot></slot>
      </div>
    `
  }
}

/**
 * @tag mac-tab-pane
 * @summary A child pane for mac-tabs (used in slot mode).
 *
 * @property tab-key - Unique key matching the tab.
 * @property label - Tab label text.
 * @property disabled - Whether the tab is disabled.
 * @property closable - Whether the tab is closable.
 */
@customElement('mac-tab-pane')
export class MacTabPane extends BaseElement {
  static override styles = [
    css`
      :host {
        display: none;
      }

      :host([active]) {
        display: block;
      }
    `,
  ]

  /** Unique key */
  @property({ attribute: 'tab-key' }) tabKey = ''

  /** Tab label */
  @property() label = ''

  /** Whether the tab is disabled */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** Whether the tab is closable */
  @property({ type: Boolean }) closable = false

  /** Whether this pane is currently active (managed by mac-tabs) */
  @property({ type: Boolean, reflect: true }) active = false

  override render() {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-tabs': MacTabs
    'mac-tab-pane': MacTabPane
  }
}
