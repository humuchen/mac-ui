import { html, css, nothing, type TemplateResult } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

export interface TreeNodeData {
  key: string
  label: string
  disabled?: boolean
  children?: TreeNodeData[]
  [key: string]: unknown
}

type CheckState = 'unchecked' | 'half-checked' | 'checked'

/**
 * @tag mac-tree
 * @summary 用于展示层级数据的树形组件。
 *
 * @csspart node - 树节点行。
 * @csspart node-label - 节点标签文本。
 * @csspart toggle - 展开/收起切换按钮。
 * @csspart checkbox - 复选框元素。
 * @csspart children - 子节点容器。
 */
@customElement('mac-tree')
export class MacTree extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
        font-family: var(--md-font-family);
      }

      .tree {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .tree-node {
        display: flex;
        align-items: center;
        gap: var(--md-spacing-xs);
        padding: var(--md-tree-node-padding);
        border-radius: var(--md-radius-md);
        cursor: pointer;
        transition: background var(--md-transition-fast);
        user-select: none;
        margin: 1px 0;
      }

      .tree-node:hover:not(.tree-node--disabled) {
        background: var(--md-tree-node-hover-bg);
      }

      .tree-node--selected {
        background: var(--md-tree-node-selected-bg);
        color: var(--md-tree-node-selected-color);
      }

      .tree-node--selected:hover:not(.tree-node--disabled) {
        background: var(--md-tree-node-selected-hover-bg);
      }

      .tree-node--disabled {
        opacity: var(--md-tree-disabled-opacity);
        cursor: not-allowed;
      }

      /* 切换按钮 */
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
        transition: transform var(--md-transition-fast);
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

      /* 复选框 */
      .tree-checkbox {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border: 2px solid var(--md-color-border);
        border-radius: 4px;
        cursor: pointer;
        flex-shrink: 0;
        transition: all var(--md-transition-fast);
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
        width: 8px;
        height: 2px;
        background: #fff;
        border-radius: 1px;
      }

      .tree-checkbox--checked::after {
        content: '';
        display: block;
        width: 4px;
        height: 8px;
        border: solid #fff;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        margin-bottom: 1px;
      }

      /* 标签 */
      .tree-label {
        flex: 1;
        font-size: var(--md-font-size-base);
        color: var(--md-color-text);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .tree-node--selected .tree-label {
        color: var(--md-tree-node-selected-color);
        font-weight: 500;
      }

      /* 子节点 */
      .tree-children {
        list-style: none;
        margin: 0;
        padding: 0;
        padding-left: var(--md-tree-indent);
      }

      /* 连接线 */
      .tree-line .tree-children {
        position: relative;
      }

      .tree-line .tree-children::before {
        content: '';
        position: absolute;
        left: 10px;
        top: 0;
        bottom: 0;
        width: 1px;
        background: var(--md-color-border);
      }

      .tree-line .tree-node {
        position: relative;
      }

      .tree-line .tree-node::before {
        content: '';
        position: absolute;
        left: -12px;
        top: 50%;
        width: 10px;
        height: 1px;
        background: var(--md-color-border);
      }

      /* 空状态 */
      .tree-empty {
        padding: var(--md-spacing-lg);
        text-align: center;
        color: var(--md-color-text-secondary);
        font-size: var(--md-font-size-sm);
      }

      /* 深色模式 */
      :host([data-theme='dark']) .tree-toggle:hover {
        color: var(--md-color-text);
      }

      :host([data-theme='dark']) .tree-checkbox {
        border-color: var(--md-color-border);
      }
    `,
  ]

  /** 树形数据数组。 */
  @property({ type: Array }) data: TreeNodeData[] = []

  /** 当前展开的节点键（受控）。 */
  @property({ type: Array }) expandedKeys: string[] = []

  /** 当前选中的节点键（受控）。 */
  @property({ type: Array }) selectedKeys: string[] = []

  /** 当前勾选的节点键（受控，用于可勾选模式）。 */
  @property({ type: Array }) checkedKeys: string[] = []

  /** 默认展开的节点键（非受控）。 */
  @property({ type: Array, attribute: 'default-expanded-keys' }) defaultExpandedKeys: string[] = []

  /** 默认选中的节点键（非受控）。 */
  @property({ type: Array, attribute: 'default-selected-keys' }) defaultSelectedKeys: string[] = []

  /** 默认勾选的节点键（非受控）。 */
  @property({ type: Array, attribute: 'default-checked-keys' }) defaultCheckedKeys: string[] = []

  /** 是否默认展开所有节点。 */
  @property({ type: Boolean, attribute: 'default-expand-all' }) defaultExpandAll = false

  /** 是否显示复选框。 */
  @property({ type: Boolean }) checkable = false

  /** 是否允许多选。 */
  @property({ type: Boolean }) multiple = false

  /** 节点是否可选中。 */
  @property({ type: Boolean }) selectable = true

  /** 是否显示连接线。 */
  @property({ type: Boolean, attribute: 'show-line' }) showLine = false

  /** 整行节点是否可点击以进行选择。 */
  @property({ type: Boolean, attribute: 'block-node' }) blockNode = true

  /** 无数据时的空文本。 */
  @property({ attribute: 'empty-text' }) emptyText = 'No data'

  @state() private _innerExpandedKeys = new Set<string>()
  @state() private _innerSelectedKeys = new Set<string>()
  @state() private _innerCheckedKeys = new Set<string>()
  @state() private _innerHalfCheckedKeys = new Set<string>()

  private _controlledExpanded = false
  private _controlledSelected = false
  private _controlledChecked = false

  override connectedCallback() {
    super.connectedCallback()
    this._controlledExpanded = this.hasAttribute('expanded-keys')
    this._controlledSelected = this.hasAttribute('selected-keys')
    this._controlledChecked = this.hasAttribute('checked-keys')

    // 从默认值初始化
    if (this.defaultExpandAll) {
      this._expandAll(this.data)
    } else if (this.defaultExpandedKeys.length > 0) {
      this._innerExpandedKeys = new Set(this.defaultExpandedKeys)
    }
    if (this.defaultSelectedKeys.length > 0) {
      this._innerSelectedKeys = new Set(this.defaultSelectedKeys)
    }
    if (this.defaultCheckedKeys.length > 0) {
      this._innerCheckedKeys = new Set(this.defaultCheckedKeys)
      this._updateHalfCheckedKeys()
    }
  }

  override willUpdate(changedProps: Map<string, unknown>) {
    super.willUpdate(changedProps)
    if (this._controlledExpanded && changedProps.has('expandedKeys')) {
      this._innerExpandedKeys = new Set(this.expandedKeys)
    }
    if (this._controlledSelected && changedProps.has('selectedKeys')) {
      this._innerSelectedKeys = new Set(this.selectedKeys)
    }
    if (this._controlledChecked && changedProps.has('checkedKeys')) {
      this._innerCheckedKeys = new Set(this.checkedKeys)
      this._updateHalfCheckedKeys()
    }
  }

  /* ── 键获取器 ── */
  private get _expanded(): Set<string> {
    return this._controlledExpanded ? new Set(this.expandedKeys) : this._innerExpandedKeys
  }

  private get _selected(): Set<string> {
    return this._controlledSelected ? new Set(this.selectedKeys) : this._innerSelectedKeys
  }

  private get _checked(): Set<string> {
    return this._controlledChecked ? new Set(this.checkedKeys) : this._innerCheckedKeys
  }

  /* ── 树辅助方法 ── */
  private _expandAll(nodes: TreeNodeData[]) {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        this._innerExpandedKeys.add(node.key)
        this._expandAll(node.children)
      }
    }
  }

  private _findNode(key: string, nodes: TreeNodeData[]): TreeNodeData | undefined {
    for (const node of nodes) {
      if (node.key === key) return node
      if (node.children) {
        const found = this._findNode(key, node.children)
        if (found) return found
      }
    }
    return undefined
  }

  private _getParentKey(
    key: string,
    nodes: TreeNodeData[],
    parentKey?: string,
  ): string | undefined {
    for (const node of nodes) {
      if (node.key === key) return parentKey
      if (node.children) {
        const found = this._getParentKey(key, node.children, node.key)
        if (found !== undefined) return found
      }
    }
    return undefined
  }

  /* ── 勾选状态 ── */
  private _getCheckState(node: TreeNodeData): CheckState {
    const checked = this._checked
    if (!node.children || node.children.length === 0) {
      return checked.has(node.key) ? 'checked' : 'unchecked'
    }
    const childStates = node.children.map((c) => this._getCheckState(c))
    if (childStates.every((s) => s === 'checked')) return 'checked'
    if (childStates.some((s) => s === 'checked' || s === 'half-checked')) return 'half-checked'
    return 'unchecked'
  }

  private _updateHalfCheckedKeys() {
    const half = new Set<string>()
    const walk = (nodes: TreeNodeData[]) => {
      for (const node of nodes) {
        if (node.children && node.children.length > 0) {
          const state = this._getCheckState(node)
          if (state === 'half-checked') {
            half.add(node.key)
          }
          walk(node.children)
        }
      }
    }
    walk(this.data)
    this._innerHalfCheckedKeys = half
  }

  /* ── 操作 ── */
  private _toggleExpand(key: string) {
    const node = this._findNode(key, this.data)
    if (!node) return

    const expanded = this._expanded
    const isExpanding = !expanded.has(key)

    if (!this._controlledExpanded) {
      if (isExpanding) {
        this._innerExpandedKeys.add(key)
      } else {
        this._innerExpandedKeys.delete(key)
      }
      this.requestUpdate()
    }

    const newExpanded = isExpanding
      ? new Set([...expanded, key])
      : new Set([...expanded].filter((k) => k !== key))

    this.emit('mac-expand', {
      detail: {
        key,
        expanded: isExpanding,
        expandedKeys: Array.from(newExpanded),
        node,
      },
    })
  }

  private _toggleSelect(key: string) {
    const node = this._findNode(key, this.data)
    if (!node || node.disabled) return

    const selected = this._selected
    const isSelected = selected.has(key)

    if (!this._controlledSelected) {
      if (this.multiple) {
        if (isSelected) {
          this._innerSelectedKeys.delete(key)
        } else {
          this._innerSelectedKeys.add(key)
        }
      } else {
        this._innerSelectedKeys = isSelected ? new Set() : new Set([key])
      }
      this.requestUpdate()
    }

    const newSelected = this.multiple
      ? isSelected
        ? new Set([...selected].filter((k) => k !== key))
        : new Set([...selected, key])
      : isSelected
        ? new Set<string>()
        : new Set([key])

    this.emit('mac-select', {
      detail: {
        key,
        selected: !isSelected,
        selectedKeys: Array.from(newSelected),
        node,
      },
    })
  }

  private _toggleCheck(key: string) {
    const node = this._findNode(key, this.data)
    if (!node || node.disabled) return

    const checked = this._checked
    const shouldCheck = !checked.has(key)

    if (!this._controlledChecked) {
      const newChecked = new Set(checked)
      const toggleNode = (n: TreeNodeData) => {
        if (n.disabled) return
        if (shouldCheck) {
          newChecked.add(n.key)
        } else {
          newChecked.delete(n.key)
        }
        if (n.children) {
          n.children.forEach(toggleNode)
        }
      }
      toggleNode(node)

      // 更新祖先节点
      const updateAncestor = (childKey: string) => {
        const parentKey = this._getParentKey(childKey, this.data)
        if (!parentKey) return
        const parent = this._findNode(parentKey, this.data)
        if (!parent || !parent.children) return

        const allChecked = parent.children.every((c) => c.disabled || newChecked.has(c.key))

        if (allChecked) {
          newChecked.add(parentKey)
        } else {
          newChecked.delete(parentKey)
        }

        updateAncestor(parentKey)
      }

      updateAncestor(key)

      this._innerCheckedKeys = newChecked
      this._updateHalfCheckedKeys()
      this.requestUpdate()
    }

    const newChecked = this._controlledChecked ? checked : this._innerCheckedKeys

    this.emit('mac-check', {
      detail: {
        key,
        checked: shouldCheck,
        checkedKeys: Array.from(newChecked),
        halfCheckedKeys: Array.from(this._innerHalfCheckedKeys),
        node,
      },
    })
  }

  /* ── 渲染 ── */
  private _renderToggle(node: TreeNodeData, expanded: boolean) {
    const hasChildren = node.children && node.children.length > 0
    return html`
      <button
        class="tree-toggle ${hasChildren ? '' : 'tree-toggle--placeholder'} ${
          expanded ? 'tree-toggle--expanded' : ''
        }"
        part="toggle"
        @click=${
          hasChildren
            ? (e: Event) => {
                e.stopPropagation()
                this._toggleExpand(node.key)
              }
            : undefined
        }
        tabindex="-1"
        type="button"
      >
        ${
          hasChildren
            ? html`<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" />
              </svg>`
            : nothing
        }
      </button>
    `
  }

  private _renderCheckbox(node: TreeNodeData) {
    const state = this._getCheckState(node)
    const className =
      state === 'checked'
        ? 'tree-checkbox--checked'
        : state === 'half-checked'
          ? 'tree-checkbox--half'
          : ''

    return html`
      <span
        class="tree-checkbox ${className}"
        part="checkbox"
        @click=${(e: Event) => {
          e.stopPropagation()
          this._toggleCheck(node.key)
        }}
      ></span>
    `
  }

  private _renderNode(node: TreeNodeData, depth = 0): TemplateResult | typeof nothing {
    const expanded = this._expanded.has(node.key)
    const selected = this._selected.has(node.key)
    const hasChildren = node.children && node.children.length > 0

    const onNodeClick = () => {
      if (node.disabled) return
      if (this.checkable && this.blockNode) {
        this._toggleCheck(node.key)
      } else if (this.selectable) {
        this._toggleSelect(node.key)
      }
    }

    return html`
      <li>
        <div
          class="tree-node ${selected ? 'tree-node--selected' : ''} ${
            node.disabled ? 'tree-node--disabled' : ''
          }"
          part="node"
          @click=${onNodeClick}
        >
          ${this._renderToggle(node, expanded)}
          ${this.checkable ? this._renderCheckbox(node) : nothing}
          <span class="tree-label" part="node-label">${node.label}</span>
        </div>
        ${
          hasChildren && expanded
            ? html`
                <ul class="tree-children" part="children">
                  ${node.children!.map((child) => this._renderNode(child, depth + 1))}
                </ul>
              `
            : nothing
        }
      </li>
    `
  }

  override render() {
    if (!this.data || this.data.length === 0) {
      return html`<div class="tree-empty">${this.emptyText}</div>`
    }

    return html`
      <ul class="tree ${this.showLine ? 'tree-line' : ''}" part="base">
        ${this.data.map((node) => this._renderNode(node))}
      </ul>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-tree': MacTree
  }
}
