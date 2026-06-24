import { html, css, nothing } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-text-ellipsis
 * @summary A text ellipsis component that supports line clamping, click-to-expand, and tooltip.
 *
 * @slot - Default slot for the text content.
 * @slot tooltip - Custom tooltip content shown on hover when text is truncated.
 *
 * @cssproperty --md-ellipsis-color - Text color.
 * @cssproperty --md-ellipsis-expand-color - Expand trigger link color.
 * @cssproperty --md-ellipsis-tooltip-bg - Tooltip background color.
 * @cssproperty --md-ellipsis-tooltip-color - Tooltip text color.
 *
 * @event mac-ellipsis-expand - Emitted when the text is expanded or collapsed. `detail: { expanded: boolean }`
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

      .expand-trigger {
        color: var(--md-ellipsis-expand-color);
        cursor: pointer;
        font-weight: 500;
        white-space: nowrap;
        user-select: none;
        transition: opacity var(--md-transition-fast);
      }

      .expand-trigger:hover {
        opacity: 0.8;
      }

      /* Tooltip */
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

  /** Maximum number of lines to show before truncating. */
  @property({ type: Number, attribute: 'line-clamp' }) lineClamp = 3

  /** How to trigger expand. 'click' shows an expand link; 'none' disables expand. */
  @property({ attribute: 'expand-trigger' }) expandTrigger: 'click' | 'none' = 'none'

  /** Whether the text is currently expanded. */
  @property({ type: Boolean, reflect: true }) expanded = false

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
    // Temporarily remove clamp to measure full height
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

  private _handleExpandClick(e: Event) {
    e.stopPropagation()
    this.expanded = !this.expanded
    this.emit('mac-ellipsis-expand', { detail: { expanded: this.expanded } })
  }

  // --- Tooltip ---
  private _handleMouseEnter() {
    if (!this._isTruncated || this.expanded) return
    // Check if tooltip slot has content
    const tooltipNodes = this._tooltipSlot?.assignedNodes() ?? []
    if (tooltipNodes.length === 0) return
    this._showTooltip()
  }

  private _handleMouseLeave() {
    this._hideTooltip()
  }

  private _showTooltip() {
    if (this._tooltipVisible) return
    this._tooltipVisible = true

    // Create tooltip portal
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

    // Get tooltip slot content
    const tooltipNodes = this._tooltipSlot?.assignedNodes() ?? []
    const content = tooltipNodes
      .map((n) => (n instanceof Element ? n.innerHTML : (n.textContent ?? '')))
      .join('')
    this._tooltipEl.innerHTML = content

    // Position
    const rect = this.getBoundingClientRect()
    this._tooltipEl.style.left = `${rect.left}px`
    this._tooltipEl.style.top = `${rect.bottom + 6}px`

    requestAnimationFrame(() => {
      if (!this._tooltipEl) return
      // Adjust if overflows viewport
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
    const showExpand = this.expandTrigger === 'click' && this._isTruncated

    return html`
      <div
        class="ellipsis-wrapper"
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
      >
        <div
          class="ellipsis-content ${isClamped ? 'clamped' : ''} ${this.expanded ? 'expanded' : ''}"
          style="--_line-clamp: ${this.lineClamp}"
        >
          <slot></slot>
        </div>

        ${showExpand
          ? html`
              <span class="expand-trigger" @click=${this._handleExpandClick}>
                ${this.expanded ? 'Collapse' : 'Expand'}
              </span>
            `
          : nothing}
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
