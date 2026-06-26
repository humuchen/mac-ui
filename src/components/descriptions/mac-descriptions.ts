import { html, css, nothing } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

export interface DescriptionItem {
  label: string
  value: string
  span?: number
  labelStyle?: string
  contentStyle?: string
}

/**
 * @tag mac-descriptions
 * @summary A macOS-style descriptions list component for displaying key-value pairs.
 *
 * @slot - Default slot for mac-description-item elements.
 * @slot title - Custom title content.
 * @slot extra - Extra content in the header (e.g. actions).
 *
 * @cssproperty --md-descriptions-container-bg - Container background.
 * @cssproperty --md-descriptions-container-border - Container border color.
 * @cssproperty --md-descriptions-container-radius - Container border radius.
 * @cssproperty --md-descriptions-container-shadow - Container shadow.
 * @cssproperty --md-descriptions-header-padding - Header padding.
 * @cssproperty --md-descriptions-header-border - Header bottom border.
 * @cssproperty --md-descriptions-title-font-size - Title font size.
 * @cssproperty --md-descriptions-title-color - Title text color.
 * @cssproperty --md-descriptions-label-color - Label text color.
 * @cssproperty --md-descriptions-label-bg - Label background.
 * @cssproperty --md-descriptions-label-width - Label width (left placement).
 * @cssproperty --md-descriptions-value-color - Value text color.
 * @cssproperty --md-descriptions-value-bg - Value background.
 * @cssproperty --md-descriptions-row-border - Row separator border.
 * @cssproperty --md-descriptions-cell-padding - Cell padding.
 * @cssproperty --md-descriptions-separator-color - Separator color.
 */
@customElement('mac-descriptions')
export class MacDescriptions extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
        --md-descriptions-container-bg: var(--md-glass-menu-bg);
        --md-descriptions-container-border: var(--md-glass-separator);
        --md-descriptions-container-radius: var(--md-radius-dock);
        --md-descriptions-container-shadow: var(--md-menu-shadow);
        --md-descriptions-header-padding: var(--md-spacing-md) var(--md-spacing-lg);
        --md-descriptions-header-border: var(--md-glass-separator);
        --md-descriptions-title-font-size: var(--md-font-size-menu);
        --md-descriptions-title-color: var(--md-color-text);
        --md-descriptions-label-color: var(--md-color-text-secondary);
        --md-descriptions-label-bg: rgba(0, 0, 0, 0.02);
        --md-descriptions-label-width: 120px;
        --md-descriptions-value-color: var(--md-color-text);
        --md-descriptions-value-bg: transparent;
        --md-descriptions-row-border: var(--md-glass-separator);
        --md-descriptions-cell-padding: var(--md-spacing-sm) var(--md-spacing-lg);
        --md-descriptions-separator-color: var(--md-color-text-secondary);
      }

      .container {
        background: var(--md-descriptions-container-bg);
        backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        -webkit-backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        border: 0.5px solid var(--md-descriptions-container-border);
        border-radius: var(--md-descriptions-container-radius);
        box-shadow: var(--md-descriptions-container-shadow);
        overflow: hidden;
      }

      /* ─── Header ─── */

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--md-descriptions-header-padding);
        border-bottom: 0.5px solid var(--md-descriptions-header-border);
      }

      .header:empty {
        display: none;
      }

      .title {
        font-size: var(--md-descriptions-title-font-size);
        font-weight: 600;
        color: var(--md-descriptions-title-color);
        letter-spacing: -0.01em;
      }

      .extra {
        margin-left: auto;
      }

      /* ─── Table Layout (label-placement: left, bordered) ─── */

      .table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
      }

      .table tr:not(:last-child) td {
        border-bottom: 0.5px solid var(--md-descriptions-row-border);
      }

      .label-cell {
        color: var(--md-descriptions-label-color);
        background: var(--md-descriptions-label-bg);
        padding: var(--md-descriptions-cell-padding);
        font-size: var(--md-font-size-sm);
        white-space: nowrap;
        vertical-align: top;
        width: var(--md-descriptions-label-width);
      }

      .value-cell {
        color: var(--md-descriptions-value-color);
        background: var(--md-descriptions-value-bg);
        padding: var(--md-descriptions-cell-padding);
        font-size: var(--md-font-size-base);
        vertical-align: top;
        word-break: break-word;
      }

      /* ─── Left placement (non-bordered): inline label: value ─── */

      .left-list {
        display: flex;
        flex-direction: column;
      }

      .left-item {
        display: flex;
        align-items: baseline;
        padding: var(--md-descriptions-cell-padding);
      }

      .left-item:not(:last-child) {
        border-bottom: 0.5px solid var(--md-descriptions-row-border);
      }

      .left-label {
        color: var(--md-descriptions-label-color);
        font-size: var(--md-font-size-sm);
        white-space: nowrap;
        min-width: var(--md-descriptions-label-width);
        max-width: var(--md-descriptions-label-width);
        flex-shrink: 0;
      }

      .left-separator {
        color: var(--md-descriptions-separator-color);
        margin: 0 var(--md-spacing-xs);
        flex-shrink: 0;
      }

      .left-value {
        color: var(--md-descriptions-value-color);
        font-size: var(--md-font-size-base);
        flex: 1;
        word-break: break-word;
      }

      /* ─── Top placement: grid layout ─── */

      .top-grid {
        display: grid;
        gap: 0;
      }

      .top-item {
        padding: var(--md-descriptions-cell-padding);
      }

      .top-item:not(:last-child) {
        border-bottom: 0.5px solid var(--md-descriptions-row-border);
      }

      .top-label {
        color: var(--md-descriptions-label-color);
        font-size: var(--md-font-size-sm);
        margin-bottom: var(--md-spacing-xs);
      }

      .top-value {
        color: var(--md-descriptions-value-color);
        font-size: var(--md-font-size-base);
        word-break: break-word;
      }

      /* ─── Top placement bordered: table with labels above ─── */

      .top-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
      }

      .top-table td {
        padding: var(--md-descriptions-cell-padding);
        vertical-align: top;
        border-right: 0.5px solid var(--md-descriptions-row-border);
        border-bottom: 0.5px solid var(--md-descriptions-row-border);
      }

      .top-table tr:last-child td {
        border-bottom: none;
      }

      .top-table td:last-child {
        border-right: none;
      }

      .top-table .top-table-label {
        color: var(--md-descriptions-label-color);
        font-size: var(--md-font-size-sm);
        background: var(--md-descriptions-label-bg);
        border-bottom: 0.5px solid var(--md-descriptions-row-border);
        padding: calc(var(--md-descriptions-cell-padding) * 0.6) var(--md-descriptions-cell-padding);
      }

      .top-table .top-table-value {
        color: var(--md-descriptions-value-color);
        font-size: var(--md-font-size-base);
        word-break: break-word;
      }

      /* ─── Bordered variant (left placement) ─── */

      :host([bordered]) .label-cell,
      :host([bordered]) .value-cell {
        border-right: 0.5px solid var(--md-descriptions-row-border);
      }

      :host([bordered]) .label-cell:last-child,
      :host([bordered]) .value-cell:last-child {
        border-right: none;
      }

      :host([bordered]) .left-item {
        background: var(--md-descriptions-label-bg);
      }

      :host([bordered]) .left-value {
        background: var(--md-descriptions-value-bg);
        padding-left: var(--md-spacing-lg);
      }

      /* ─── Label alignment ─── */

      :host([label-align='left']) .label-cell,
      :host([label-align='left']) .left-label {
        text-align: left;
      }

      :host([label-align='center']) .label-cell,
      :host([label-align='center']) .left-label {
        text-align: center;
      }

      :host([label-align='right']) .label-cell,
      :host([label-align='right']) .left-label {
        text-align: right;
      }

      :host([label-align='left']) .top-label,
      :host([label-align='left']) .top-table-label {
        text-align: left;
      }

      :host([label-align='center']) .top-label,
      :host([label-align='center']) .top-table-label {
        text-align: center;
      }

      :host([label-align='right']) .top-label,
      :host([label-align='right']) .top-table-label {
        text-align: right;
      }

      /* ─── Size: sm ─── */

      :host([size='sm']) {
        --md-descriptions-cell-padding: var(--md-spacing-xs) var(--md-spacing-md);
        --md-descriptions-label-width: 100px;
      }

      /* ─── Size: lg ─── */

      :host([size='lg']) {
        --md-descriptions-cell-padding: var(--md-spacing-md) var(--md-spacing-xl);
        --md-descriptions-label-width: 140px;
      }

      :host([data-theme='dark']) {
        --md-descriptions-container-bg: rgba(40, 40, 40, 0.85);
        --md-descriptions-container-border: rgba(255, 255, 255, 0.08);
        --md-descriptions-header-border: rgba(255, 255, 255, 0.08);
        --md-descriptions-title-color: rgba(255, 255, 255, 0.92);
        --md-descriptions-label-color: rgba(255, 255, 255, 0.55);
        --md-descriptions-label-bg: rgba(255, 255, 255, 0.04);
        --md-descriptions-value-color: rgba(255, 255, 255, 0.88);
        --md-descriptions-row-border: rgba(255, 255, 255, 0.06);
        --md-descriptions-separator-color: rgba(255, 255, 255, 0.55);
      }

      :host([data-theme='light']) {
        --md-descriptions-container-bg: var(--md-glass-menu-bg);
        --md-descriptions-container-border: var(--md-glass-separator);
        --md-descriptions-header-border: var(--md-glass-separator);
        --md-descriptions-title-color: var(--md-color-text);
        --md-descriptions-label-color: var(--md-color-text-secondary);
        --md-descriptions-label-bg: rgba(0, 0, 0, 0.02);
        --md-descriptions-value-color: var(--md-color-text);
        --md-descriptions-row-border: var(--md-glass-separator);
        --md-descriptions-separator-color: var(--md-color-text-secondary);
      }
    `,
  ]

  /** Label placement: 'left' shows label beside value, 'top' shows label above value */
  @property({ attribute: 'label-placement', reflect: true }) labelPlacement: 'left' | 'top' = 'left'

  /** Label text alignment */
  @property({ attribute: 'label-align', reflect: true }) labelAlign: 'left' | 'center' | 'right' =
    'left'

  /** Number of columns per row */
  @property({ type: Number }) column = 3

  /** Component size */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** Whether to show bordered style */
  @property({ type: Boolean, reflect: true }) bordered = false

  /** Title text */
  @property() title = ''

  /** Separator between label and value (only for label-placement='left' and not bordered) */
  @property() separator = ':'

  /** Data items (alternative to slot) */
  @property({ type: Array }) items: DescriptionItem[] = []

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

  private _getItems(): DescriptionItem[] {
    if (this.items && this.items.length > 0) {
      return this.items
    }
    const slotItems: DescriptionItem[] = []
    const slotted = this.querySelectorAll('mac-description-item')
    slotted.forEach((el) => {
      slotItems.push({
        label: el.getAttribute('label') || '',
        value: el.getAttribute('value') || el.textContent?.trim() || '',
        span: Number(el.getAttribute('span')) || 1,
        labelStyle: el.getAttribute('label-style') || undefined,
        contentStyle: el.getAttribute('content-style') || undefined,
      })
    })
    return slotItems
  }

  private _renderHeader() {
    const hasTitle = this.title || this.querySelector('[slot="title"]')
    const hasExtra = this.querySelector('[slot="extra"]')
    if (!hasTitle && !hasExtra) return nothing

    return html`
      <div class="header">
        <div class="title">
          <slot name="title">${this.title}</slot>
        </div>
        <div class="extra">
          <slot name="extra"></slot>
        </div>
      </div>
    `
  }

  /**
   * Build rows from items respecting column count and span.
   * Each row is an array of { item, effectiveSpan }.
   */
  private _buildRows(): { item: DescriptionItem; effectiveSpan: number }[][] {
    const items = this._getItems()
    const colCount = this.column
    const rows: { item: DescriptionItem; effectiveSpan: number }[][] = []

    let currentRow: { item: DescriptionItem; effectiveSpan: number }[] = []
    let currentSpan = 0

    for (const item of items) {
      const span = Math.min(item.span || 1, colCount)
      if (currentSpan + span > colCount) {
        rows.push(currentRow)
        currentRow = [{ item, effectiveSpan: span }]
        currentSpan = span
      } else {
        currentRow.push({ item, effectiveSpan: span })
        currentSpan += span
      }
    }
    if (currentRow.length > 0) {
      rows.push(currentRow)
    }

    return rows
  }

  /** label-placement: left + bordered → table with label | value columns */
  private _renderLeftBordered() {
    const rows = this._buildRows()

    return html`
      <table class="table">
        ${rows.map(
          (row) => html`
            <tr>
              ${row.map(
                ({ item, effectiveSpan }) => html`
                  <td class="label-cell" style=${item.labelStyle || ''}>${item.label}</td>
                  <td
                    class="value-cell"
                    colspan=${effectiveSpan * 2 - 1}
                    style=${item.contentStyle || ''}
                  >
                    ${item.value}
                  </td>
                `,
              )}
            </tr>
          `,
        )}
      </table>
    `
  }

  /** label-placement: left + not bordered → inline label: value list */
  private _renderLeftNonBordered() {
    const items = this._getItems()

    return html`
      <div class="left-list">
        ${items.map(
          (item) => html`
            <div class="left-item">
              <div class="left-label" style=${item.labelStyle || ''}>${item.label}</div>
              <span class="left-separator">${this.separator}</span>
              <div class="left-value" style=${item.contentStyle || ''}>${item.value}</div>
            </div>
          `,
        )}
      </div>
    `
  }

  /** label-placement: top + bordered → table with label row above value row */
  private _renderTopBordered() {
    const rows = this._buildRows()
    const colCount = this.column

    return html`
      <table class="top-table">
        ${rows.map(
          (row) => html`
            <tr>
              ${row.map(
                ({ item, effectiveSpan }) => html`
                  <td
                    class="top-table-label"
                    colspan=${effectiveSpan}
                    style=${item.labelStyle || ''}
                  >
                    ${item.label}
                  </td>
                `,
              )}
              ${row.length < colCount
                ? html`<td colspan=${colCount - row.reduce((s, r) => s + r.effectiveSpan, 0)}></td>`
                : nothing}
            </tr>
            <tr>
              ${row.map(
                ({ item, effectiveSpan }) => html`
                  <td
                    class="top-table-value"
                    colspan=${effectiveSpan}
                    style=${item.contentStyle || ''}
                  >
                    ${item.value}
                  </td>
                `,
              )}
              ${row.length < colCount
                ? html`<td colspan=${colCount - row.reduce((s, r) => s + r.effectiveSpan, 0)}></td>`
                : nothing}
            </tr>
          `,
        )}
      </table>
    `
  }

  /** label-placement: top + not bordered → grid with label above value */
  private _renderTopNonBordered() {
    const rows = this._buildRows()
    const colCount = this.column

    return html`
      <div class="top-grid" style="grid-template-columns: repeat(${colCount}, 1fr)">
        ${rows.map((row) =>
          row.map(
            ({ item, effectiveSpan }) => html`
              <div class="top-item" style="grid-column: span ${effectiveSpan}">
                <div class="top-label" style=${item.labelStyle || ''}>${item.label}</div>
                <div class="top-value" style=${item.contentStyle || ''}>${item.value}</div>
              </div>
            `,
          ),
        )}
      </div>
    `
  }

  override render() {
    const body =
      this.labelPlacement === 'top'
        ? this.bordered
          ? this._renderTopBordered()
          : this._renderTopNonBordered()
        : this.bordered
          ? this._renderLeftBordered()
          : this._renderLeftNonBordered()

    return html`
      <div class="container">
        ${this._renderHeader()} ${body}
        <slot style="display:none"></slot>
      </div>
    `
  }
}

/**
 * @tag mac-description-item
 * @summary A child item for mac-descriptions (used in slot mode).
 *
 * @property label - Label text
 * @property value - Value text (alternative to text content)
 * @property span - Number of columns this item spans
 * @property label-style - Custom CSS style for the label
 * @property content-style - Custom CSS style for the content
 */
@customElement('mac-description-item')
export class MacDescriptionItem extends BaseElement {
  static override styles = [
    css`
      :host {
        display: none;
      }
    `,
  ]

  /** Label text */
  @property() label = ''

  /** Value text (alternative to text content) */
  @property() value = ''

  /** Number of columns this item spans */
  @property({ type: Number }) span = 1

  /** Custom CSS style for the label */
  @property({ attribute: 'label-style' }) labelStyle = ''

  /** Custom CSS style for the content */
  @property({ attribute: 'content-style' }) contentStyle = ''

  override render() {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-descriptions': MacDescriptions
    'mac-description-item': MacDescriptionItem
  }
}
