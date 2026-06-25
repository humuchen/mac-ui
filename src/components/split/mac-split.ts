import { html, css } from 'lit'
import { property, customElement, state, query } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-split-pane
 * @summary A pane container used inside mac-split.
 *
 * @slot - The pane's content.
 *
 * @csspart base - The pane's base container.
 */
@customElement('mac-split-pane')
export class MacSplitPane extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
        overflow: hidden;
      }

      .pane {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    `,
  ]

  override render() {
    return html`
      <div part="base" class="pane">
        <slot></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-split-pane': MacSplitPane
  }
}

/**
 * @tag mac-split
 * @summary A resizable split panel component with macOS-style design.
 *
 * @slot first - The first panel content.
 * @slot second - The second panel content.
 *
 * @csspart base - The split container.
 * @csspart first - The first panel wrapper.
 * @csspart second - The second panel wrapper.
 * @csspart resizer - The draggable resizer bar.
 * @csspart resizer-line - The visual line inside the resizer.
 *
 * @event mac-split-change - Emitted when the split value changes. `detail: { value: number }`
 * @event mac-split-drag-start - Emitted when dragging starts.
 * @event mac-split-drag-end - Emitted when dragging ends.
 */
@customElement('mac-split')
export class MacSplit extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      .split {
        display: grid;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .split--horizontal {
        grid-template-columns:
          var(--_first-size, 50%) var(--md-split-resizer-size, 1px)
          1fr;
      }

      .split--vertical {
        grid-template-rows:
          var(--_first-size, 50%) var(--md-split-resizer-size, 1px)
          1fr;
      }

      .panel {
        overflow: hidden;
        min-width: 0;
        min-height: 0;
      }

      .resizer {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        user-select: none;
        touch-action: none;
        z-index: 1;
      }

      .split--horizontal .resizer {
        cursor: col-resize;
        width: var(--md-split-resizer-size, 1px);
      }

      .split--vertical .resizer {
        cursor: row-resize;
        height: var(--md-split-resizer-size, 1px);
      }

      .resizer__line {
        background: var(--md-split-resizer-color, var(--md-color-border));
        transition: background var(--md-transition-fast);
      }

      .split--horizontal .resizer__line {
        width: 1px;
        height: 100%;
      }

      .split--vertical .resizer__line {
        width: 100%;
        height: 1px;
      }

      .resizer:hover .resizer__line,
      .resizer--dragging .resizer__line {
        background: var(--md-split-resizer-hover-color, var(--md-color-primary));
      }

      .split--horizontal .resizer:hover .resizer__line,
      .split--horizontal .resizer--dragging .resizer__line {
        width: 2px;
      }

      .split--vertical .resizer:hover .resizer__line,
      .split--vertical .resizer--dragging .resizer__line {
        height: 2px;
      }

      .resizer__handle {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--md-radius-sm);
        background: var(--md-split-resizer-handle-bg, transparent);
        opacity: 0;
        transition: opacity var(--md-transition-fast);
      }

      .split--horizontal .resizer__handle {
        width: 8px;
        height: 24px;
      }

      .split--vertical .resizer__handle {
        width: 24px;
        height: 8px;
      }

      .resizer:hover .resizer__handle,
      .resizer--dragging .resizer__handle {
        opacity: 1;
        background: var(--md-split-resizer-handle-bg, var(--md-color-bg-secondary));
      }

      .resizer__handle-dots {
        display: flex;
        gap: 2px;
      }

      .split--horizontal .resizer__handle-dots {
        flex-direction: column;
      }

      .resizer__handle-dot {
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: var(--md-split-resizer-handle-dot-color, var(--md-color-text-secondary));
      }

      :host([disabled]) .resizer {
        cursor: default;
        pointer-events: none;
      }

      :host([disabled]) .resizer__line {
        background: var(--md-split-resizer-color, var(--md-color-border));
      }
    `,
  ]

  /** The split direction. */
  @property({ reflect: true }) direction: 'horizontal' | 'vertical' = 'horizontal'

  /** The initial split value as a ratio (0-1) or pixels. */
  @property({ type: Number }) split = 0.5

  /** The unit of the split value: 'ratio' (0-1) or 'pixel'. */
  @property({ reflect: true }) unit: 'ratio' | 'pixel' = 'ratio'

  /** Minimum size of the first panel in pixels. */
  @property({ type: Number }) min = 0

  /** Maximum size of the first panel in pixels. 0 means no limit. */
  @property({ type: Number }) max = 0

  /** Disables resizing. */
  @property({ type: Boolean, reflect: true }) disabled = false

  @state() private _dragging = false
  @state() private _currentSplit = this.split

  @query('.split') private _splitRef!: HTMLElement
  @query('.resizer') private _resizerRef!: HTMLElement

  override connectedCallback() {
    super.connectedCallback()
    this._currentSplit = this.split
  }

  override firstUpdated() {
    this._updateFirstSize()
  }

  override updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties)
    if (changedProperties.has('split')) {
      this._currentSplit = this.split
      this._updateFirstSize()
    }
    if (changedProperties.has('direction')) {
      this._updateFirstSize()
    }
  }

  private _updateFirstSize() {
    let sizeValue: string
    if (this.unit === 'pixel') {
      sizeValue = `${this._currentSplit}px`
    } else {
      sizeValue = `${this._currentSplit * 100}%`
    }
    this.style.setProperty('--_first-size', sizeValue)
  }

  private _onResizerMouseDown(e: MouseEvent) {
    if (this.disabled) return
    e.preventDefault()
    this._dragging = true
    this.emit('mac-split-drag-start')

    document.addEventListener('mousemove', this._onDocumentMouseMove)
    document.addEventListener('mouseup', this._onDocumentMouseUp)
  }

  private _onDocumentMouseMove = (e: MouseEvent) => {
    if (!this._dragging) return

    const rect = this.getBoundingClientRect()
    let newSize: number

    if (this.direction === 'horizontal') {
      newSize = e.clientX - rect.left
    } else {
      newSize = e.clientY - rect.top
    }

    // Apply min/max constraints
    if (this.min > 0) {
      newSize = Math.max(newSize, this.min)
    }
    if (this.max > 0) {
      newSize = Math.min(newSize, this.max)
    }

    // Convert to unit value
    if (this.unit === 'ratio') {
      const total = this.direction === 'horizontal' ? rect.width : rect.height
      if (total > 0) {
        newSize = newSize / total
      }
    }

    this._currentSplit = newSize
    this._updateFirstSize()
    this.emit('mac-split-change', { detail: { value: newSize } })
  }

  private _onDocumentMouseUp = () => {
    if (!this._dragging) return
    this._dragging = false
    this.emit('mac-split-drag-end')
    document.removeEventListener('mousemove', this._onDocumentMouseMove)
    document.removeEventListener('mouseup', this._onDocumentMouseUp)
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('mousemove', this._onDocumentMouseMove)
    document.removeEventListener('mouseup', this._onDocumentMouseUp)
  }

  override render() {
    const directionClass = `split--${this.direction}`

    return html`
      <div part="base" class="split ${directionClass}">
        <div part="first" class="panel">
          <slot name="first"></slot>
        </div>
        <div
          part="resizer"
          class="resizer ${this._dragging ? 'resizer--dragging' : ''}"
          @mousedown=${this._onResizerMouseDown}
        >
          <div part="resizer-line" class="resizer__line"></div>
          <div class="resizer__handle">
            <div class="resizer__handle-dots">
              <div class="resizer__handle-dot"></div>
              <div class="resizer__handle-dot"></div>
              <div class="resizer__handle-dot"></div>
            </div>
          </div>
        </div>
        <div part="second" class="panel">
          <slot name="second"></slot>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-split': MacSplit
    'mac-split-pane': MacSplitPane
  }
}
