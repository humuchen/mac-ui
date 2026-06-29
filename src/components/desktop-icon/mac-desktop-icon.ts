import { html, css } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-desktop-icon
 * @summary 带有选中状态的 macOS 风格桌面图标。
 *
 * @slot - 图标的视觉内容（图片、svg 等）。
 *
 * @csspart base - 图标的基础容器。
 * @csspart icon - 图标图像区域。
 * @csspart label - 标签文本区域。
 *
 * @event mac-icon-dblclick - 双击时触发。Detail: { iconId }
 */
@customElement('mac-desktop-icon')
export class MacDesktopIcon extends BaseElement {
  /** 自增计数器，用于为未指定 iconId 的图标自动生成唯一标识 */
  private static _autoIdCounter = 0

  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        width: var(--md-icon-wrapper-width);
        cursor: default;
        user-select: none;
        -webkit-user-select: none;
        position: absolute;
        z-index: 1;
      }

      :host([selected]) {
        z-index: 2;
      }

      :host([dragging]) {
        z-index: 100;
      }

      .icon-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--md-spacing-xs);
        padding: 6px var(--md-spacing-xs);
        border-radius: var(--md-radius-lg);
        transition:
          background-color var(--md-transition-fast),
          box-shadow var(--md-transition-fast);
        width: 100%;
        cursor: pointer;
      }

      :host(:hover) .icon-wrapper {
        background-color: rgba(255, 255, 255, var(--md-opacity-hover));
      }

      :host([selected]) .icon-wrapper {
        background-color: var(--md-mac-selection);
        box-shadow: inset 0 0 0 0.5px var(--md-mac-selection-border);
      }

      :host([dragging]) .icon-wrapper {
        background-color: var(--md-mac-selection-rect-inner);
        box-shadow: var(--md-shadow-desktop-icon-drag);
      }

      .icon-image {
        width: var(--md-icon-size-desktop);
        height: var(--md-icon-size-desktop);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--md-radius-icon-lg);
        overflow: hidden;
        filter: drop-shadow(var(--md-shadow-icon));
        transition: transform var(--md-transition-magnify);
      }

      :host(:active) .icon-image {
        transform: scale(0.9);
      }

      :host([dragging]) .icon-image {
        transform: scale(1.04);
        filter: drop-shadow(var(--md-shadow-icon-drag));
      }

      .icon-image ::slotted(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--md-radius-icon-lg);
      }

      .icon-image ::slotted(svg) {
        width: 100%;
        height: 100%;
      }

      .icon-label {
        font-family: var(--md-font-family);
        font-size: var(--md-font-size-xs);
        line-height: 1.35;
        text-align: center;
        letter-spacing: 0.01em;
        color: var(--md-mac-text-white-soft);
        max-width: 76px;
        word-wrap: break-word;
        overflow-wrap: break-word;
        text-shadow: var(--md-text-shadow-label);
        padding: 1px 5px;
        border-radius: var(--md-radius-sm);
        transition: all var(--md-transition-fast);
      }

      :host([selected]) .icon-label {
        background-color: var(--md-mac-selection-label-bg);
        color: var(--md-mac-text-white);
        text-shadow: var(--md-text-shadow-none);
        box-shadow: 0 1px 3px rgba(0, 122, 255, 0.3);
      }

      .default-icon {
        width: var(--md-icon-size-desktop);
        height: var(--md-icon-size-desktop);
        border-radius: var(--md-radius-icon-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--md-font-size-icon-lg);
        color: var(--md-mac-text-white);
        font-weight: 600;
        background: var(--icon-color, var(--md-color-primary));
        box-shadow:
          inset 0 1px 0 var(--md-icon-inset-top-soft),
          inset 0 -1px 0 var(--md-icon-inset-bottom-soft),
          0 1px 3px rgba(0, 0, 0, 0.12);
      }
    `,
  ]

  /** 图标标签文本 */
  @property({ reflect: true }) label = ''

  /** 图标标识符 */
  @property({ reflect: true }) iconId = ''

  /** 图标是否被选中 */
  @property({ type: Boolean, reflect: true }) selected = false

  /** 图标是否正在被拖拽 */
  @property({ type: Boolean, reflect: true }) dragging = false

  /** 图标 X 坐标 */
  @property({ type: Number }) x = 0

  /** 图标 Y 坐标 */
  @property({ type: Number }) y = 0

  /** 默认占位符的图标颜色 */
  @property({ reflect: true }) color = '#007AFF'

  private _clickTimer: ReturnType<typeof setTimeout> | null = null
  private _clickCount = 0

  override connectedCallback(): void {
    super.connectedCallback()
    // 若未指定 iconId，自动生成唯一标识，避免多个图标共享空字符串导致选择/拖动异常
    if (!this.iconId) {
      this.iconId = `__auto_${MacDesktopIcon._autoIdCounter++}`
    }
    this.style.position = 'absolute'
    this._updatePosition()
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has('x') || changed.has('y')) {
      this._updatePosition()
    }
  }

  private _updatePosition(): void {
    this.style.left = `${this.x}px`
    this.style.top = `${this.y}px`
  }

  override render() {
    return html`
      <div
        class="icon-wrapper"
        part="base"
        @mousedown=${this._handleMouseDown}
        @touchstart=${this._handleTouchStart}
      >
        <div class="icon-image" part="icon">
          <slot>
            <div
              class="default-icon"
              style="--icon-color: ${this.color}; background: var(--icon-color)"
            >
              ${this.label ? this.label.charAt(0).toUpperCase() : '?'}
            </div>
          </slot>
        </div>
        <span class="icon-label" part="label">${this.label}</span>
      </div>
    `
  }

  private _handleMouseDown(e: MouseEvent): void {
    if (e.button !== 0) return
    // 不阻止冒泡，让桌面组件通过 composedPath() 识别图标
    e.preventDefault()

    this._handleClick()
  }

  private _handleTouchStart(e: TouchEvent): void {
    if (e.touches.length !== 1) return
    e.preventDefault()

    this._handleClick()
  }

  private _handleClick(): void {
    this._clickCount++
    if (this._clickCount === 1) {
      this._clickTimer = setTimeout(() => {
        this._clickCount = 0
      }, 350)
    } else if (this._clickCount === 2) {
      if (this._clickTimer) clearTimeout(this._clickTimer)
      this._clickCount = 0
      this.emit('mac-icon-dblclick', {
        detail: { iconId: this.iconId },
      })
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-desktop-icon': MacDesktopIcon
  }
}
