import { html, css, nothing, svg } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

export type DataTableSortOrder = 'asc' | 'desc'

/**
 * 数据表格列定义
 */
export interface DataTableColumn<T = any> {
  /** 列唯一标识 */
  key: string
  /** 列标题 */
  title: string
  /** 数据字段名（缺省时取 key） */
  dataIndex?: string
  /** 列宽 */
  width?: string | number
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 是否可排序 */
  sortable?: boolean
  /** 支持的排序方向，默认 ['asc','desc']（含取消） */
  sortDirections?: DataTableSortOrder[]
  /** 默认排序方向 */
  defaultSortOrder?: DataTableSortOrder
  /** 本地排序比较函数 */
  sorter?: (a: T, b: T) => number
  /** 自定义单元格渲染 */
  render?: (row: T, index: number, column: DataTableColumn<T>) => unknown
  /** 单元格内容超出省略 */
  ellipsis?: boolean
}

/**
 * 分页配置
 */
export interface DataTablePagination {
  /** 当前页（受控） */
  current?: number
  /** 每页条数（受控） */
  pageSize?: number
  /** 默认当前页（非受控） */
  defaultCurrent?: number
  /** 默认每页条数（非受控） */
  defaultPageSize?: number
  /** 总条数（远程模式必填） */
  total?: number
  /** 可选每页条数 */
  pageSizeOptions?: number[]
  /** 显示条数选择器 */
  showSizeChanger?: boolean
  /** 显示快速跳页输入框 */
  showQuickJumper?: boolean
  /** 显示总条数 */
  showTotal?: boolean
  /** 简洁模式 */
  simple?: boolean
  /** 禁用分页 */
  disabled?: boolean
  /** 总条数文案前缀，默认「共 」 */
  prefix?: string
}

/**
 * 行选择配置
 */
export interface DataTableRowSelection<T = any> {
  /** 选择类型，默认 checkbox */
  type?: 'checkbox' | 'radio'
  /** 选中行 key（受控） */
  selectedRowKeys?: Array<string | number>
  /** 行复选框属性 */
  getCheckboxProps?: (row: T, index: number) => { disabled?: boolean }
  /** 禁用全部选择 */
  disabled?: boolean
}

export interface DataTableSortInfo {
  columnKey: string
  order: DataTableSortOrder
}

/**
 * mac-data-table-change 事件详情
 */
export interface DataTableChangeDetail {
  page: number
  pageSize: number
  sorter: DataTableSortInfo | null
}

/**
 * mac-data-table-select 事件详情
 */
export interface DataTableSelectDetail<T = any> {
  selectedRowKeys: Array<string | number>
  selectedRows: T[]
  changedRow?: T
  changedRowKey?: string | number
  type: 'single' | 'multiple' | 'all'
}

/**
 * mac-data-table-sort 事件详情
 */
export interface DataTableSortDetail {
  sorter: DataTableSortInfo | null
}

/**
 * mac-data-table-row-click 事件详情
 */
export interface DataTableRowClickDetail<T = any> {
  row: T
  index: number
}

const ICON = {
  chevronLeft: svg`<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chevronRight: svg`<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  caretUp: svg`<svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true"><path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  caretDown: svg`<svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true"><path d="M6 10l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
}

/**
 * @tag mac-data-table
 * @summary macOS 风格数据表格组件，支持可配置分页、排序与行选择。
 *
 * @slot title - 表格上方标题区域。
 * @slot footer - 分页上方底部区域（汇总等）。
 * @slot empty - 自定义空数据内容。
 *
 * @cssproperty --md-data-table-container-bg - 容器背景。
 * @cssproperty --md-data-table-container-border - 容器边框。
 * @cssproperty --md-data-table-container-radius - 容器圆角。
 * @cssproperty --md-data-table-header-bg - 表头背景。
 * @cssproperty --md-data-table-header-color - 表头文字颜色。
 * @cssproperty --md-data-table-row-hover-bg - 行悬停背景。
 * @cssproperty --md-data-table-row-selected-bg - 选中行背景。
 * @cssproperty --md-data-table-cell-padding - 单元格内边距。
 * @cssproperty --md-data-table-pagination-item-active-bg - 分页激活背景。
 *
 * @event mac-data-table-change - 分页或排序变化时触发。`detail: { page, pageSize, sorter }`
 * @event mac-data-table-select - 行选择变化时触发。`detail: { selectedRowKeys, selectedRows, type }`
 * @event mac-data-table-sort - 排序变化时触发。`detail: { sorter }`
 * @event mac-data-table-row-click - 行点击时触发。`detail: { row, index }`
 */
@customElement('mac-data-table')
export class MacDataTable extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
        --md-data-table-container-bg: var(--md-color-bg);
        --md-data-table-container-border: var(--md-color-border);
        --md-data-table-container-radius: var(--md-radius-lg);
      }

      .container {
        background: var(--md-data-table-container-bg);
        border: 0.5px solid var(--md-data-table-container-border);
        border-radius: var(--md-data-table-container-radius);
        overflow: hidden;
        position: relative;
      }

      /* ─── Title slot ─── */
      .title-bar {
        padding: var(--md-spacing-md) var(--md-spacing-lg);
        border-bottom: 0.5px solid var(--md-data-table-cell-border);
      }
      .title-bar:empty {
        display: none;
      }

      /* ─── Table scroll wrapper ─── */
      .table-wrapper {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        table-layout: auto;
      }

      thead th {
        background: var(--md-data-table-header-bg);
        color: var(--md-data-table-header-color);
        font-size: var(--md-data-table-header-font-size);
        font-weight: var(--md-data-table-header-font-weight);
        text-align: left;
        padding: var(--md-data-table-cell-padding);
        border-bottom: 0.5px solid var(--md-data-table-cell-border);
        white-space: nowrap;
        user-select: none;
        vertical-align: middle;
      }

      :host([sticky]) thead th {
        position: sticky;
        top: 0;
        z-index: 2;
      }

      tbody td {
        padding: var(--md-data-table-cell-padding);
        color: var(--md-data-table-cell-color);
        font-size: var(--md-data-table-row-font-size);
        border-bottom: 0.5px solid var(--md-data-table-cell-border);
        vertical-align: middle;
      }

      tbody tr:last-child td {
        border-bottom: none;
      }

      :host([bordered]) tbody td,
      :host([bordered]) thead th {
        border-right: 0.5px solid var(--md-data-table-cell-border);
      }
      :host([bordered]) tbody td:last-child,
      :host([bordered]) thead th:last-child {
        border-right: none;
      }

      tbody tr {
        background: var(--md-data-table-row-bg);
        transition: background var(--md-transition-fast);
      }
      tbody tr:hover {
        background: var(--md-data-table-row-hover-bg);
      }
      :host([striped]) tbody tr:nth-child(even) {
        background: var(--md-data-table-row-striped-bg);
      }
      :host([striped]) tbody tr:nth-child(even):hover {
        background: var(--md-data-table-row-hover-bg);
      }
      tbody tr.row-selected {
        background: var(--md-data-table-row-selected-bg);
      }
      tbody tr.row-selected:hover {
        background: var(--md-data-table-row-selected-hover-bg);
      }

      .cell {
        display: block;
      }
      .cell--ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
      }

      .col-left {
        text-align: left;
      }
      .col-center {
        text-align: center;
      }
      .col-right {
        text-align: right;
      }

      /* ─── Sort indicator ─── */
      .th-inner {
        display: inline-flex;
        align-items: center;
        gap: var(--md-spacing-xs);
      }
      .sort-trigger {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        line-height: 0;
        color: var(--md-data-table-sort-color);
      }
      .sort-trigger:hover {
        color: var(--md-data-table-sort-hover-color);
      }
      .sort-trigger .caret {
        opacity: 0.45;
      }
      .sort-trigger .caret.active {
        opacity: 1;
        color: var(--md-data-table-sort-active-color);
      }
      th.sortable {
        cursor: pointer;
      }

      /* ─── Selection checkbox / radio ─── */
      .checkbox,
      .radio {
        appearance: none;
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        margin: 0;
        border: 1.5px solid var(--md-color-border);
        background: transparent;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all var(--md-transition-fast);
        flex-shrink: 0;
        vertical-align: middle;
      }
      .checkbox {
        border-radius: var(--md-radius-sm);
      }
      .radio {
        border-radius: 50%;
      }
      .checkbox:hover,
      .radio:hover {
        border-color: var(--md-color-primary);
      }
      .checkbox:checked,
      .checkbox:indeterminate {
        background: var(--md-color-primary);
        border-color: var(--md-color-primary);
      }
      .radio:checked {
        border-color: var(--md-color-primary);
      }
      .checkbox:checked::after {
        content: '';
        width: 9px;
        height: 5px;
        border-left: 2px solid #fff;
        border-bottom: 2px solid #fff;
        transform: rotate(-45deg) translate(1px, -1px);
      }
      .checkbox:indeterminate::after {
        content: '';
        width: 8px;
        height: 2px;
        background: #fff;
      }
      .radio:checked::after {
        content: '';
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--md-color-primary);
      }
      .checkbox:disabled,
      .radio:disabled {
        cursor: not-allowed;
        opacity: 0.4;
      }

      .selection-cell {
        width: 40px;
        text-align: center;
      }

      /* ─── Empty / Loading ─── */
      .empty {
        text-align: center;
        color: var(--md-data-table-empty-color);
        font-size: var(--md-data-table-empty-font-size);
        padding: var(--md-data-table-empty-padding);
      }
      .empty td {
        border-bottom: none;
      }

      .loading-mask {
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.55);
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 5;
      }
      :host([data-theme='dark']) .loading-mask {
        background: rgba(30, 30, 30, 0.55);
      }
      .spinner {
        width: 28px;
        height: 28px;
        border: 2.5px solid rgba(0, 122, 255, 0.2);
        border-top-color: var(--md-color-primary);
        border-radius: 50%;
        animation: mac-dt-spin 0.7s linear infinite;
      }
      @keyframes mac-dt-spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* ─── Footer slot ─── */
      .footer-slot {
        padding: var(--md-data-table-footer-padding);
        border-top: 0.5px solid var(--md-data-table-footer-border);
        background: var(--md-data-table-footer-bg);
      }
      .footer-slot:empty {
        display: none;
      }

      /* ─── Pagination ─── */
      .pagination {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--md-data-table-pagination-gap);
        padding: var(--md-data-table-pagination-padding);
        border-top: 0.5px solid var(--md-data-table-footer-border);
        background: var(--md-data-table-footer-bg);
      }
      .pagination--simple {
        justify-content: space-between;
      }

      .pagination-total {
        color: var(--md-data-table-pagination-color);
        font-size: var(--md-data-table-pagination-font-size);
        margin-right: auto;
      }

      .pagination-list {
        display: flex;
        align-items: center;
        gap: var(--md-spacing-xs);
      }

      .pg-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: var(--md-data-table-pagination-item-min-width);
        height: var(--md-data-table-pagination-item-height);
        padding: 0 var(--md-spacing-xs);
        border: 0.5px solid var(--md-data-table-pagination-item-border);
        border-radius: var(--md-data-table-pagination-item-radius);
        background: var(--md-data-table-pagination-item-bg);
        color: var(--md-data-table-pagination-item-color);
        font-size: var(--md-data-table-pagination-font-size);
        cursor: pointer;
        transition: all var(--md-transition-fast);
        user-select: none;
        line-height: 1;
      }
      .pg-btn:hover:not(:disabled):not(.active) {
        background: var(--md-data-table-pagination-item-hover-bg);
        border-color: var(--md-data-table-pagination-item-hover-border);
      }
      .pg-btn.active {
        background: var(--md-data-table-pagination-item-active-bg);
        border-color: var(--md-data-table-pagination-item-active-border);
        color: var(--md-data-table-pagination-item-active-color);
        cursor: default;
      }
      .pg-btn:disabled {
        opacity: var(--md-data-table-pagination-item-disabled-opacity);
        cursor: not-allowed;
      }
      .pg-ellipsis {
        min-width: var(--md-data-table-pagination-item-min-width);
        height: var(--md-data-table-pagination-item-height);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--md-data-table-pagination-ellipsis-color);
      }

      .pg-size,
      .pg-jumper {
        display: inline-flex;
        align-items: center;
        gap: var(--md-spacing-xs);
        color: var(--md-data-table-pagination-color);
        font-size: var(--md-data-table-pagination-font-size);
      }

      .pg-size select {
        height: var(--md-data-table-pagination-item-height);
        min-width: var(--md-data-table-pagination-size-select-width);
        padding: 0 var(--md-spacing-xs);
        border: 0.5px solid var(--md-data-table-pagination-item-border);
        border-radius: var(--md-data-table-pagination-item-radius);
        background: var(--md-data-table-pagination-item-bg);
        color: var(--md-data-table-pagination-item-color);
        font-size: var(--md-data-table-pagination-font-size);
        cursor: pointer;
      }
      .pg-size select:focus {
        outline: none;
        border-color: var(--md-color-primary);
      }

      .pg-jumper input {
        width: var(--md-data-table-pagination-jumper-input-width);
        height: var(--md-data-table-pagination-item-height);
        padding: 0 var(--md-spacing-xs);
        border: 0.5px solid var(--md-data-table-pagination-item-border);
        border-radius: var(--md-data-table-pagination-item-radius);
        background: var(--md-data-table-pagination-item-bg);
        color: var(--md-data-table-pagination-item-color);
        font-size: var(--md-data-table-pagination-font-size);
        text-align: center;
      }
      .pg-jumper input:focus {
        outline: none;
        border-color: var(--md-color-primary);
      }

      .pagination--disabled .pg-btn,
      .pagination--disabled select,
      .pagination--disabled input {
        pointer-events: none;
        opacity: var(--md-data-table-pagination-item-disabled-opacity);
      }

      .pg-simple-input {
        width: 48px;
        height: var(--md-data-table-pagination-item-height);
        text-align: center;
        border: 0.5px solid var(--md-data-table-pagination-item-border);
        border-radius: var(--md-data-table-pagination-item-radius);
        background: var(--md-data-table-pagination-item-bg);
        color: var(--md-data-table-pagination-item-color);
        font-size: var(--md-data-table-pagination-font-size);
      }
      .pg-simple-input:focus {
        outline: none;
        border-color: var(--md-color-primary);
      }
      .pg-simple-slash {
        color: var(--md-data-table-pagination-color);
        font-size: var(--md-data-table-pagination-font-size);
      }

      /* ─── Size variants ─── */
      :host([size='sm']) {
        --md-data-table-cell-padding: var(--sm-data-table-cell-padding);
        --md-data-table-header-font-size: var(--sm-data-table-header-font-size);
        --md-data-table-row-font-size: var(--sm-data-table-row-font-size);
      }
      :host([size='lg']) {
        --md-data-table-cell-padding: var(--lg-data-table-cell-padding);
        --md-data-table-header-font-size: var(--lg-data-table-header-font-size);
        --md-data-table-row-font-size: var(--lg-data-table-row-font-size);
      }

      /* ─── Dark theme ─── */
      :host([data-theme='dark']) {
        --md-data-table-container-bg: rgba(40, 40, 40, 0.85);
        --md-data-table-container-border: rgba(255, 255, 255, 0.08);
        --md-data-table-header-bg: rgba(255, 255, 255, 0.04);
        --md-data-table-header-color: rgba(255, 255, 255, 0.55);
        --md-data-table-cell-color: rgba(255, 255, 255, 0.88);
        --md-data-table-cell-border: rgba(255, 255, 255, 0.06);
        --md-data-table-footer-border: rgba(255, 255, 255, 0.08);
        --md-data-table-footer-bg: rgba(255, 255, 255, 0.03);
        --md-data-table-empty-color: rgba(255, 255, 255, 0.45);
        --md-data-table-pagination-item-border: rgba(255, 255, 255, 0.12);
        --md-data-table-pagination-color: rgba(255, 255, 255, 0.55);
      }

      /* ─── Mobile ─── */
      @media (max-width: 768px) {
        .pagination {
          justify-content: center;
        }
        .pagination-total {
          width: 100%;
          text-align: center;
          margin-right: 0;
        }
      }
    `,
  ]

  /** 列定义 */
  @property({ type: Array }) columns: DataTableColumn[] = []

  /** 数据源 */
  @property({ type: Array }) data: any[] = []

  /** 行 key 字段名或取值函数（缺省用索引） */
  @property({ attribute: 'row-key' }) rowKey?: string | ((record: any) => string | number)

  /** 行类名生成函数 */
  @property() rowClassName?: (row: any, index: number) => string

  /** 分页配置：false 关闭，true 默认开启，对象为详细配置 */
  @property({ attribute: false }) pagination: boolean | DataTablePagination = true

  /** 行选择配置 */
  @property({ attribute: false }) rowSelection?: DataTableRowSelection

  /** 远程模式：组件不本地分页/排序，仅触发事件由外部处理 */
  @property({ type: Boolean, reflect: true }) remote = false

  /** 边框样式 */
  @property({ type: Boolean, reflect: true }) bordered = false

  /** 斑马纹 */
  @property({ type: Boolean, reflect: true }) striped = false

  /** 表头吸顶 */
  @property({ type: Boolean, reflect: true }) sticky = false

  /** 加载中 */
  @property({ type: Boolean, reflect: true }) loading = false

  /** 空数据文案 */
  @property({ attribute: 'empty-text' }) emptyText = '暂无数据'

  /** 组件尺寸 */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  @state() private _internalPage = 1
  @state() private _internalPageSize = 10
  @state() private _internalSelectedKeys: Array<string | number> = []
  @state() private _sortColumn: string | null = null
  @state() private _sortOrder: DataTableSortOrder | null = null
  @state() private _processedData: any[] = []

  private _sortInitialized = false

  override connectedCallback() {
    super.connectedCallback()
    this._initDefaults()
  }

  override willUpdate(changed: Map<string, unknown>) {
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

    this._initDefaults()

    // Initialize default sort before computing processed data so the first
    // render already reflects the default sort order.
    if (!this._sortInitialized && this.columns?.length) {
      const col = this.columns.find((c) => c.defaultSortOrder)
      if (col) {
        this._sortColumn = col.key
        this._sortOrder = col.defaultSortOrder!
      }
      this._sortInitialized = true
    }

    if (
      changed.has('data') ||
      changed.has('columns') ||
      changed.has('_sortColumn') ||
      changed.has('_sortOrder') ||
      changed.has('remote')
    ) {
      this._processedData = this._computeProcessedData()
    }

    if (changed.has('data') || changed.has('_internalPageSize') || changed.has('pagination')) {
      this._clampPage()
    }
  }

  private _initDefaults() {
    const cfg = this._paginationConfig
    if (cfg) {
      if (this._internalPage === 1 && typeof cfg.defaultCurrent === 'number') {
        this._internalPage = cfg.defaultCurrent
      }
      if (this._internalPageSize === 10 && typeof cfg.defaultPageSize === 'number') {
        this._internalPageSize = cfg.defaultPageSize
      }
    }
  }

  // ─── Pagination getters ───

  private get _paginationConfig(): DataTablePagination | null {
    if (this.pagination === false || this.pagination == null) return null
    if (this.pagination === true) return {}
    return this.pagination
  }

  private get _isPageControlled(): boolean {
    const cfg = this._paginationConfig
    return !!cfg && typeof cfg.current === 'number'
  }

  private get _isPageSizeControlled(): boolean {
    const cfg = this._paginationConfig
    return !!cfg && typeof cfg.pageSize === 'number'
  }

  private get _effectivePage(): number {
    const cfg = this._paginationConfig
    if (cfg && typeof cfg.current === 'number') return cfg.current
    return this._internalPage
  }

  private get _effectivePageSize(): number {
    const cfg = this._paginationConfig
    if (cfg && typeof cfg.pageSize === 'number') return cfg.pageSize
    return this._internalPageSize
  }

  private get _effectiveTotal(): number {
    const cfg = this._paginationConfig
    if (cfg && typeof cfg.total === 'number') return cfg.total
    return this._processedData.length
  }

  private get _pageCount(): number {
    return Math.max(1, Math.ceil(this._effectiveTotal / this._effectivePageSize))
  }

  private _clampPage() {
    const cfg = this._paginationConfig
    if (!cfg) return
    const pageCount = this._pageCount
    if (this._internalPage > pageCount) this._internalPage = pageCount
    if (this._internalPage < 1) this._internalPage = 1
  }

  // ─── Data processing ───

  private _computeProcessedData(): any[] {
    if (this.remote || !this._sortColumn || !this._sortOrder) return this.data ?? []
    const col = this.columns?.find((c) => c.key === this._sortColumn)
    if (!col?.sorter) return this.data ?? []
    const sorted = [...(this.data ?? [])]
    sorted.sort((a, b) => {
      const r = col.sorter!(a, b)
      return this._sortOrder === 'desc' ? -r : r
    })
    return sorted
  }

  private get _displayEntries(): { row: any; index: number }[] {
    const source = this.remote ? this.data : this._processedData
    const arr = source ?? []
    const cfg = this._paginationConfig
    if (!cfg || this.remote) {
      return arr.map((row, index) => ({ row, index }))
    }
    const start = (this._effectivePage - 1) * this._effectivePageSize
    const end = start + this._effectivePageSize
    const entries: { row: any; index: number }[] = []
    for (let i = start; i < Math.min(end, arr.length); i++) {
      entries.push({ row: arr[i], index: i })
    }
    return entries
  }

  private get _currentSortInfo(): DataTableSortInfo | null {
    if (!this._sortColumn || !this._sortOrder) return null
    return { columnKey: this._sortColumn, order: this._sortOrder }
  }

  // ─── Row key & selection ───

  private _getRowKey(row: any, index: number): string | number {
    if (typeof this.rowKey === 'function') return this.rowKey(row)
    if (typeof this.rowKey === 'string') return row?.[this.rowKey]
    return index
  }

  private get _isSelectionControlled(): boolean {
    return !!this.rowSelection && Array.isArray(this.rowSelection.selectedRowKeys)
  }

  private get _selectedKeys(): Array<string | number> {
    if (this._isSelectionControlled) return this.rowSelection!.selectedRowKeys!
    return this._internalSelectedKeys
  }

  private get _selectedKeySet(): Set<string | number> {
    return new Set(this._selectedKeys)
  }

  private _isRowDisabled(row: any, index: number): boolean {
    return !!this.rowSelection?.getCheckboxProps?.(row, index)?.disabled
  }

  private _emitSelect(
    selectedRowKeys: Array<string | number>,
    type: 'single' | 'multiple' | 'all',
    changedRow?: any,
    changedRowKey?: string | number,
  ) {
    const keySet = new Set(selectedRowKeys)
    const source = this.remote ? this.data : this._processedData
    const selectedRows = (source ?? []).filter(
      (r, i) => keySet.has(this._getRowKey(r, i)),
    )
    if (!this._isSelectionControlled) {
      this._internalSelectedKeys = selectedRowKeys
    }
    this.emit('mac-data-table-select', {
      detail: { selectedRowKeys, selectedRows, type, changedRow, changedRowKey },
    })
  }

  private _handleRowSelect(row: any, index: number, checked: boolean) {
    const key = this._getRowKey(row, index)
    const selType = this.rowSelection?.type ?? 'checkbox'
    if (selType === 'radio') {
      this._emitSelect([key], 'single', row, key)
      return
    }
    const cur = new Set(this._selectedKeys)
    if (checked) cur.add(key)
    else cur.delete(key)
    this._emitSelect([...cur], 'multiple', row, key)
  }

  private _handleSelectAll(checked: boolean) {
    const source = this.remote ? this.data : this._processedData
    let newKeys: Array<string | number>
    if (checked) {
      newKeys = []
      ;(source ?? []).forEach((r, i) => {
        if (!this._isRowDisabled(r, i)) newKeys.push(this._getRowKey(r, i))
      })
    } else {
      newKeys = []
    }
    this._emitSelect(newKeys, 'all')
  }

  // ─── Sort ───

  private _handleSortClick(col: DataTableColumn) {
    if (!col.sortable) return
    const directions = col.sortDirections ?? ['asc', 'desc']
    let nextOrder: DataTableSortOrder | null
    if (this._sortColumn === col.key && this._sortOrder) {
      const idx = directions.indexOf(this._sortOrder)
      nextOrder = idx >= 0 && idx < directions.length - 1 ? directions[idx + 1] : null
    } else {
      nextOrder = directions[0] ?? null
    }
    this._sortColumn = nextOrder ? col.key : null
    this._sortOrder = nextOrder
    if (!this._isPageControlled) this._internalPage = 1
    const sorter = this._currentSortInfo
    this.emit('mac-data-table-sort', { detail: { sorter } })
    this.emit('mac-data-table-change', {
      detail: { page: 1, pageSize: this._effectivePageSize, sorter },
    })
  }

  // ─── Pagination actions ───

  private _gotoPage(page: number, pageSize?: number) {
    const cfg = this._paginationConfig
    if (!cfg || cfg.disabled) return
    const newSize = pageSize ?? this._effectivePageSize
    const sizeChanged = newSize !== this._effectivePageSize
    const pageCount = Math.max(1, Math.ceil(this._effectiveTotal / newSize))
    let target = sizeChanged ? 1 : page
    target = Math.min(Math.max(1, target), pageCount)
    if (!this._isPageControlled) this._internalPage = target
    if (!this._isPageSizeControlled) this._internalPageSize = newSize
    this.emit('mac-data-table-change', {
      detail: {
        page: target,
        pageSize: newSize,
        sorter: this._currentSortInfo,
      },
    })
  }

  private _handleQuickJumper(e: KeyboardEvent) {
    if (e.key !== 'Enter') return
    const input = e.target as HTMLInputElement
    const val = parseInt(input.value, 10)
    if (!Number.isNaN(val)) {
      this._gotoPage(val)
    }
    input.value = ''
  }

  private _handleSimpleJumper(e: KeyboardEvent) {
    if (e.key !== 'Enter') return
    const input = e.target as HTMLInputElement
    const val = parseInt(input.value, 10)
    if (!Number.isNaN(val)) {
      this._gotoPage(val)
    }
  }

  private _handleSizeChange(e: Event) {
    const select = e.target as HTMLSelectElement
    const val = parseInt(select.value, 10)
    if (!Number.isNaN(val)) this._gotoPage(this._effectivePage, val)
  }

  // ─── Page list computation ───

  private _getPageList(): Array<number | 'ellipsis'> {
    const pageCount = this._pageCount
    const current = this._effectivePage
    if (pageCount <= 7) {
      return Array.from({ length: pageCount }, (_, i) => i + 1)
    }
    const pages: Array<number | 'ellipsis'> = [1]
    const left = Math.max(2, current - 1)
    const right = Math.min(pageCount - 1, current + 1)
    if (left > 2) pages.push('ellipsis')
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < pageCount - 1) pages.push('ellipsis')
    pages.push(pageCount)
    return pages
  }

  // ─── Cell rendering ───

  private _renderCellContent(row: any, index: number, col: DataTableColumn): unknown {
    if (col.render) {
      return col.render(row, index, col)
    }
    const field = col.dataIndex ?? col.key
    const val = row?.[field]
    return val == null ? '' : String(val)
  }

  private _alignClass(align?: string): string {
    return align === 'center' ? 'col-center' : align === 'right' ? 'col-right' : 'col-left'
  }

  private _widthStyle(width?: string | number): string | undefined {
    if (width == null) return undefined
    return typeof width === 'number' ? `${width}px` : width
  }

  // ─── Render ───

  override render() {
    const hasSelection = !!this.rowSelection
    const entries = this._displayEntries
    const isEmpty = entries.length === 0

    return html`
      <div class="container">
        <div class="title-bar"><slot name="title"></slot></div>
        <div class="table-wrapper">
          <table>
            ${this._renderHeader(hasSelection)}
            <tbody>
              ${isEmpty
                ? html`<tr class="empty">
                    <td colspan=${this._colspan(hasSelection)}>
                      <slot name="empty">${this.emptyText}</slot>
                    </td>
                  </tr>`
                : entries.map(({ row, index }) => this._renderRow(row, index, hasSelection))}
            </tbody>
          </table>
        </div>
        <div class="footer-slot"><slot name="footer"></slot></div>
        ${this._renderPagination()}
        ${this.loading
          ? html`<div class="loading-mask"><div class="spinner"></div></div>`
          : nothing}
      </div>
    `
  }

  private _colspan(hasSelection: boolean): number {
    return this.columns.length + (hasSelection ? 1 : 0)
  }

  private _renderHeader(hasSelection: boolean) {
    if (!this.columns?.length) return nothing
    return html`
      <thead>
        <tr>
          ${hasSelection ? this._renderSelectionHeader() : nothing}
          ${this.columns.map((col) => this._renderTh(col))}
        </tr>
      </thead>
    `
  }

  private _renderSelectionHeader() {
    const selType = this.rowSelection?.type ?? 'checkbox'
    if (selType === 'radio') {
      return html`<th class="selection-cell"></th>`
    }
    const source = this.remote ? this.data : this._processedData
    const selectable = (source ?? [])
      .map((r, i) => ({ key: this._getRowKey(r, i), disabled: this._isRowDisabled(r, i) }))
      .filter((x) => !x.disabled)
    const keySet = this._selectedKeySet
    const checkedCount = selectable.filter((s) => keySet.has(s.key)).length
    const allChecked = selectable.length > 0 && checkedCount === selectable.length
    const indeterminate = checkedCount > 0 && checkedCount < selectable.length
    return html`
      <th class="selection-cell">
        <input
          type="checkbox"
          class="checkbox"
          .checked=${allChecked}
          .indeterminate=${indeterminate}
          ?disabled=${this.rowSelection?.disabled || selectable.length === 0}
          @change=${(e: Event) =>
            this._handleSelectAll((e.target as HTMLInputElement).checked)}
        />
      </th>
    `
  }

  private _renderTh(col: DataTableColumn) {
    const isActive = this._sortColumn === col.key
    const order = isActive ? this._sortOrder : null
    const alignClass = this._alignClass(col.align)
    const thClasses = classMap({
      sortable: !!col.sortable,
      [alignClass]: true,
    })

    return html`
      <th
        class=${thClasses}
        style=${ifDefined(this._widthStyle(col.width) ? `width: ${this._widthStyle(col.width)}` : undefined)}
        @click=${() => this._handleSortClick(col)}
      >
        <span class="th-inner">
          <span>${col.title}</span>
          ${col.sortable
            ? html`<span class="sort-trigger">
                <span class=${classMap({ caret: true, active: isActive && order === 'asc' })}>
                  ${ICON.caretUp}
                </span>
                <span class=${classMap({ caret: true, active: isActive && order === 'desc' })}>
                  ${ICON.caretDown}
                </span>
              </span>`
            : nothing}
        </span>
      </th>
    `
  }

  private _renderRow(row: any, index: number, hasSelection: boolean) {
    const key = this._getRowKey(row, index)
    const selected = this._selectedKeySet.has(key)
    const customClass = this.rowClassName?.(row, index) ?? ''
    const classes = classMap({
      'row-selected': selected,
      [customClass]: !!customClass,
    })

    return html`
      <tr
        class=${classes}
        @click=${() =>
          this.emit('mac-data-table-row-click', { detail: { row, index } })}
      >
        ${hasSelection ? this._renderSelectionCell(row, index, selected) : nothing}
        ${this.columns.map((col) => this._renderTd(row, index, col))}
      </tr>
    `
  }

  private _renderSelectionCell(row: any, index: number, selected: boolean) {
    const selType = this.rowSelection?.type ?? 'checkbox'
    const disabled = this._isRowDisabled(row, index) || !!this.rowSelection?.disabled
    return html`
      <td class="selection-cell">
        <input
          type=${selType === 'radio' ? 'radio' : 'checkbox'}
          class=${selType === 'radio' ? 'radio' : 'checkbox'}
          .checked=${selected}
          ?disabled=${disabled}
          @click=${(e: Event) => e.stopPropagation()}
          @change=${(e: Event) => {
            if (selType === 'radio') {
              if (!disabled) this._handleRowSelect(row, index, true)
            } else {
              this._handleRowSelect(row, index, (e.target as HTMLInputElement).checked)
            }
          }}
        />
      </td>
    `
  }

  private _renderTd(row: any, index: number, col: DataTableColumn) {
    const alignClass = this._alignClass(col.align)
    const content = this._renderCellContent(row, index, col)
    const cellClass = col.ellipsis
      ? `cell cell--ellipsis ${alignClass}`
      : `cell ${alignClass}`
    const titleAttr = col.ellipsis && typeof content === 'string' ? content : undefined

    return html`
      <td class=${alignClass} style=${ifDefined(this._widthStyle(col.width) ? `width: ${this._widthStyle(col.width)}` : undefined)}>
        <span class=${cellClass} title=${ifDefined(titleAttr)}>${content}</span>
      </td>
    `
  }

  // ─── Pagination render ───

  private _renderPagination() {
    const cfg = this._paginationConfig
    if (!cfg) return nothing

    const current = this._effectivePage
    const pageSize = this._effectivePageSize
    const total = this._effectiveTotal
    const pageCount = this._pageCount
    const disabled = !!cfg.disabled
    const pageSizeOptions = cfg.pageSizeOptions ?? [10, 20, 50, 100]
    const showSizeChanger = cfg.showSizeChanger ?? pageSizeOptions.length > 1
    const showQuickJumper = cfg.showQuickJumper ?? false
    const showTotal = cfg.showTotal ?? true
    const simple = cfg.simple ?? false
    const prefix = cfg.prefix ?? '共 '

    const prevDisabled = disabled || current <= 1
    const nextDisabled = disabled || current >= pageCount

    if (simple) {
      return html`
        <div class=${classMap({ pagination: true, 'pagination--simple': true, 'pagination--disabled': disabled })}>
          <button
            class="pg-btn"
            ?disabled=${prevDisabled}
            @click=${() => this._gotoPage(current - 1)}
            aria-label="上一页"
          >
            ${ICON.chevronLeft}
          </button>
          <span class="pg-simple-wrap" style="display:inline-flex;align-items:center;gap:6px;">
            <input
              class="pg-simple-input"
              type="number"
              min="1"
              max=${pageCount}
              .value=${String(current)}
              ?disabled=${disabled}
              @keydown=${this._handleSimpleJumper}
            />
            <span class="pg-simple-slash">/ ${pageCount}</span>
          </span>
          <button
            class="pg-btn"
            ?disabled=${nextDisabled}
            @click=${() => this._gotoPage(current + 1)}
            aria-label="下一页"
          >
            ${ICON.chevronRight}
          </button>
        </div>
      `
    }

    const pageList = this._getPageList()
    const start = total === 0 ? 0 : (current - 1) * pageSize + 1
    const end = Math.min(current * pageSize, total)

    return html`
      <div class=${classMap({ pagination: true, 'pagination--disabled': disabled })}>
        ${showTotal
          ? html`<span class="pagination-total"
              >${prefix}${total} 条${total > 0 ? ` · 第 ${start}-${end} 条` : ''}</span
            >`
          : nothing}
        <div class="pagination-list">
          <button
            class="pg-btn"
            ?disabled=${prevDisabled}
            @click=${() => this._gotoPage(current - 1)}
            aria-label="上一页"
          >
            ${ICON.chevronLeft}
          </button>
          ${pageList.map((p) =>
            p === 'ellipsis'
              ? html`<span class="pg-ellipsis">…</span>`
              : html`<button
                  class=${classMap({ 'pg-btn': true, active: p === current })}
                  ?disabled=${disabled}
                  @click=${() => this._gotoPage(p as number)}
                >
                  ${p}
                </button>`,
          )}
          <button
            class="pg-btn"
            ?disabled=${nextDisabled}
            @click=${() => this._gotoPage(current + 1)}
            aria-label="下一页"
          >
            ${ICON.chevronRight}
          </button>
        </div>
        ${showSizeChanger
          ? html`<span class="pg-size">
              <select
                ?disabled=${disabled}
                @change=${this._handleSizeChange}
                .value=${String(pageSize)}
              >
                ${pageSizeOptions.map(
                  (opt) =>
                    html`<option value=${opt} ?selected=${opt === pageSize}>
                      ${opt} 条/页
                    </option>`,
                )}
              </select>
            </span>`
          : nothing}
        ${showQuickJumper
          ? html`<span class="pg-jumper">
              跳至<input
                type="number"
                min="1"
                ?disabled=${disabled}
                @keydown=${this._handleQuickJumper}
              />页
            </span>`
          : nothing}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-data-table': MacDataTable
  }
}
