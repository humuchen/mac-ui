import { html, css } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-text-ellipsis
 * @summary 支持行数限制、点击展开和提示框的文本省略组件。
 *
 * @slot - 文本内容的默认插槽。
 * @slot tooltip - 文本被截断时悬停显示的自定义提示框内容。
 *   如果未提供且 `tooltip` 为 `true`，则将使用完整文本作为提示框内容。
 *
 * @cssproperty --md-ellipsis-color - 文本颜色。
 * @cssproperty --md-ellipsis-expand-color - 展开触发链接的颜色。
 * @cssproperty --md-ellipsis-tooltip-bg - 提示框背景色。
 * @cssproperty --md-ellipsis-tooltip-color - 提示框文本颜色。
 *
 * @event mac-ellipsis-expand - 文本展开或收起时触发。`detail: { expanded: boolean }`
 */
@customElement('mac-text-ellipsis')
export class MacTextEllipsis extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
        --md-ellipsis-color: var(--md-color-text);
        --md-ellipsis-expand-color: var(--md-color-primary);
        --md-ellipsis-tooltip-bg: var(--md-tooltip-bg);
        --md-ellipsis-tooltip-color: #fff;
      }

      .ellipsis-wrapper {
        position: relative;
        color: var(--md-ellipsis-color);
        font-size: var(--md-font-size-base);
        line-height: 1.5;
        word-break: break-word;
      }

      .ellipsis-content {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        transition: max-height var(--md-transition-normal);
      }

      .ellipsis-content.clamped {
        -webkit-line-clamp: var(--_line-clamp);
      }

      .ellipsis-content.expanded {
        display: block;
        -webkit-line-clamp: unset;
      }

      .ellipsis-content.clickable {
        cursor: pointer;
      }

      /* 提示框 */
      .tooltip-wrapper {
        position: relative;
        display: inline;
      }

      .tooltip-popup {
        position: fixed;
        z-index: 99999;
        max-width: 320px;
        padding: 6px 10px;
        background: var(--md-ellipsis-tooltip-bg);
        backdrop-filter: blur(var(--md-tooltip-blur));
        -webkit-backdrop-filter: blur(var(--md-tooltip-blur));
        border: 1px solid var(--md-tooltip-border);
        border-radius: var(--md-radius-md);
        box-shadow: var(--md-tooltip-shadow);
        color: var(--md-ellipsis-tooltip-color);
        font-size: var(--md-font-size-sm);
        line-height: 1.5;
        word-break: break-word;
        white-space: pre-wrap;
        pointer-events: none;
        opacity: 0;
        transform: translateY(4px);
        transition:
          opacity 120ms ease,
          transform 120ms ease;
      }

      .tooltip-popup.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `,
  ]

  /** 截断前显示的最大行数。 */
  @property({ type: Number, attribute: 'line-clamp' }) lineClamp = 3

  /** 如何触发展开。'click' 显示展开链接；'none' 禁用展开。 */
  @property({ attribute: 'expand-trigger' }) expandTrigger: 'click' | 'none' = 'none'

  /** 文本当前是否已展开。 */
  @property({ type: Boolean, reflect: true }) expanded = false

  /** 文本被截断时悬停是否显示提示框。 */
  @property({ type: Boolean }) tooltip = false

  @state() private _isTruncated = false
  @state() private _tooltipVisible = false

  private _contentEl: HTMLElement | null = null
  private _tooltipEl: HTMLElement | null = null
  private _tooltipSlot: HTMLSlotElement | null = null

  override firstUpdated() {
    this._contentEl = this.renderRoot.querySelector('.ellipsis-content')
    this._checkTruncation()
    this._tooltipSlot = this.renderRoot.querySelector('slot[name="tooltip"]')
    this._tooltipSlot?.addEventListener('slotchange', () => this._checkTruncation())
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('lineClamp') || changed.has('expanded')) {
      this._checkTruncation()
    }
  }

  private _checkTruncation() {
    if (!this._contentEl) return
    // 临时移除限制以测量完整高度
    const hadClamp = this._contentEl.classList.contains('clamped')
    this._contentEl.classList.remove('clamped')
    this._contentEl.classList.add('expanded')
    const fullHeight = this._contentEl.scrollHeight
    this._contentEl.classList.remove('expanded')
    if (hadClamp) this._contentEl.classList.add('clamped')

    const lineHeight = parseFloat(getComputedStyle(this._contentEl).lineHeight) || 21
    const clampedHeight = lineHeight * this.lineClamp
    this._isTruncated = fullHeight > clampedHeight + 2
  }

  private _handleContentClick() {
    if (this.expandTrigger !== 'click' || !this._isTruncated) return
    this.expanded = !this.expanded
    this.emit('mac-ellipsis-expand', { detail: { expanded: this.expanded } })
  }

  // --- 提示框 ---
  private _handleMouseEnter() {
    if (!this._isTruncated || this.expanded) return
    // 如果存在自定义插槽内容或启用了 tooltip 属性，则显示提示框
    const hasCustomTooltip = (this._tooltipSlot?.assignedNodes() ?? []).length > 0
    if (!hasCustomTooltip && !this.tooltip) return
    this._showTooltip()
  }

  private _handleMouseLeave() {
    this._hideTooltip()
  }

  private _showTooltip() {
    if (this._tooltipVisible) return
    this._tooltipVisible = true

    // 创建提示框 portal
    if (!this._tooltipEl) {
      this._tooltipEl = document.createElement('div')
      this._tooltipEl.className = 'mac-ellipsis-tooltip-portal'
      this._tooltipEl.style.cssText = `
        position: fixed;
        z-index: 99999;
        max-width: 320px;
        padding: 6px 10px;
        background: var(--md-ellipsis-tooltip-bg, rgba(30,30,30,0.82));
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 6px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.2);
        color: #fff;
        font-size: 12px;
        line-height: 1.5;
        word-break: break-word;
        white-space: pre-wrap;
        pointer-events: none;
        opacity: 0;
        transform: translateY(4px);
        transition: opacity 120ms ease, transform 120ms ease;
      `
      document.body.appendChild(this._tooltipEl)
    }

    // 获取提示框内容：优先使用自定义插槽，否则使用完整文本
    const tooltipNodes = this._tooltipSlot?.assignedNodes() ?? []
    const content = tooltipNodes.length
      ? tooltipNodes
          .map((n) => (n instanceof Element ? n.innerHTML : (n.textContent ?? '')))
          .join('')
      : (this.textContent ?? '')
    this._tooltipEl.innerHTML = content

    // 位置
    const rect = this.getBoundingClientRect()
    this._tooltipEl.style.left = `${rect.left}px`
    this._tooltipEl.style.top = `${rect.bottom + 6}px`

    requestAnimationFrame(() => {
      if (!this._tooltipEl) return
      // 如果溢出视口则调整
      const tipRect = this._tooltipEl.getBoundingClientRect()
      if (tipRect.right > window.innerWidth - 8) {
        this._tooltipEl.style.left = `${window.innerWidth - tipRect.width - 8}px`
      }
      if (tipRect.bottom > window.innerHeight - 8) {
        this._tooltipEl.style.top = `${rect.top - tipRect.height - 6}px`
      }
      this._tooltipEl.style.opacity = '1'
      this._tooltipEl.style.transform = 'translateY(0)'
    })
  }

  private _hideTooltip() {
    if (!this._tooltipEl || !this._tooltipVisible) return
    this._tooltipVisible = false
    this._tooltipEl.style.opacity = '0'
    this._tooltipEl.style.transform = 'translateY(4px)'
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    this._hideTooltip()
    if (this._tooltipEl) {
      this._tooltipEl.remove()
      this._tooltipEl = null
    }
  }

  override render() {
    const isClamped = this._isTruncated && !this.expanded
    const isClickable = this.expandTrigger === 'click' && this._isTruncated

    return html`
      <div
        class="ellipsis-wrapper"
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
      >
        <div
          class="ellipsis-content ${isClamped ? 'clamped' : ''} ${
            this.expanded ? 'expanded' : ''
          } ${isClickable ? 'clickable' : ''}"
          style="--_line-clamp: ${this.lineClamp}"
          @click=${this._handleContentClick}
        >
          <slot></slot>
        </div>
      </div>

      <slot name="tooltip" style="display:none"></slot>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-text-ellipsis': MacTextEllipsis
  }
}
