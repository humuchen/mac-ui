import { html, css } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-dock-item
 * @summary A macOS-style dock item with icon, label, and bounce animation.
 *
 * @slot - The icon's visual content (image, svg, etc.).
 *
 * @csspart base - The dock item container.
 * @csspart icon - The icon image area.
 * @csspart label - The tooltip label.
 * @csspart indicator - The running indicator dot.
 *
 * @event mac-dock-item-click - Emitted on click. Detail: { itemId }
 */
@customElement('mac-dock-item')
export class MacDockItem extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: default;
        user-select: none;
        -webkit-user-select: none;
        position: relative;
        transition: transform var(--md-transition-magnify);
        will-change: transform;
      }

      .dock-item-icon {
        width: var(--md-icon-size);
        height: var(--md-icon-size);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--md-radius-icon);
        overflow: hidden;
        filter: drop-shadow(var(--md-shadow-icon));
        transition: filter var(--md-transition-magnify);
        cursor: pointer;
      }

      :host(:hover) .dock-item-icon {
        filter: drop-shadow(var(--md-shadow-icon-hover));
      }

      :host(:active) .dock-item-icon {
        filter: drop-shadow(var(--md-shadow-icon-active));
      }

      .dock-item-icon ::slotted(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--md-radius-icon);
      }

      .dock-item-icon ::slotted(svg) {
        width: 100%;
        height: 100%;
      }

      .default-icon {
        width: var(--md-icon-size);
        height: var(--md-icon-size);
        border-radius: var(--md-radius-icon);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--md-font-size-icon);
        color: var(--md-mac-text-white);
        font-weight: 600;
        background: var(--dock-item-color, var(--md-color-primary));
        box-shadow:
          inset 0 1px 0 var(--md-icon-inset-top),
          inset 0 -1px 0 var(--md-icon-inset-bottom),
          0 1px 4px rgba(0, 0, 0, 0.14);
      }

      /* ─── Tooltip Label ─── */

      .dock-item-label {
        position: absolute;
        top: var(--md-tooltip-offset);
        left: 50%;
        transform: translateX(-50%) scale(0.85);
        white-space: nowrap;
        font-family: var(--md-font-family);
        font-size: var(--md-font-size-sm);
        line-height: 1.3;
        letter-spacing: -0.01em;
        color: var(--md-mac-text-white);
        background: var(--md-tooltip-bg);
        backdrop-filter: blur(var(--md-tooltip-blur)) saturate(180%);
        -webkit-backdrop-filter: blur(var(--md-tooltip-blur)) saturate(180%);
        padding: var(--md-spacing-xs) 10px;
        border-radius: var(--md-radius-sm);
        box-shadow:
          var(--md-tooltip-shadow),
          inset 0 0 0 0.5px var(--md-tooltip-border);
        pointer-events: none;
        opacity: 0;
        transition:
          opacity 120ms ease,
          transform 120ms ease;
      }

      .dock-item-label::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 8px;
        height: 8px;
        background: var(--md-tooltip-bg);
        border-radius: 0 0 2px 2px;
        clip-path: polygon(0 0, 100% 0, 50% 100%);
      }

      :host(:hover) .dock-item-label {
        opacity: 1;
        transform: translateX(-50%) scale(1);
      }

      /* ─── Running Indicator ─── */

      .dock-indicator {
        width: var(--md-indicator-size);
        height: var(--md-indicator-size);
        border-radius: 50%;
        background: rgba(255, 255, 255, var(--md-opacity-indicator));
        margin-top: var(--md-indicator-margin-top);
        opacity: 0;
        transition: opacity var(--md-transition-fast);
      }

      :host([running]) .dock-indicator {
        opacity: 1;
      }

      /* ─── Bounce Animation ─── */

      :host([bouncing]) {
        animation: dock-bounce 1s ease;
      }

      @keyframes dock-bounce {
        0% {
          transform: translateY(0);
        }
        25% {
          transform: translateY(-24px);
        }
        50% {
          transform: translateY(0);
        }
        75% {
          transform: translateY(-12px);
        }
        100% {
          transform: translateY(0);
        }
      }
    `,
  ]

  /** Item identifier */
  @property({ reflect: true }) itemId = ''

  /** Item label (tooltip) */
  @property({ reflect: true }) label = ''

  /** Icon color for default placeholder */
  @property({ reflect: true }) color = '#007AFF'

  /** Whether the app is running */
  @property({ type: Boolean, reflect: true }) running = false

  /** Whether the icon is currently bouncing */
  @property({ type: Boolean, reflect: true }) bouncing = false

  override render() {
    return html`
      <div class="dock-item-icon" part="icon">
        <slot>
          <div
            class="default-icon"
            style="--dock-item-color: ${this.color}; background: var(--dock-item-color)"
          >
            ${this.label ? this.label.charAt(0).toUpperCase() : '?'}
          </div>
        </slot>
      </div>
      <div class="dock-item-label" part="label">${this.label}</div>
      <div class="dock-indicator" part="indicator"></div>
    `
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.addEventListener('click', this._handleClick)
    this.addEventListener('animationend', this._onBounceEnd)
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this.removeEventListener('click', this._handleClick)
    this.removeEventListener('animationend', this._onBounceEnd)
  }

  private _handleClick(): void {
    this.bouncing = true
    this.emit('mac-dock-item-click', { detail: { itemId: this.itemId } })
  }

  private _onBounceEnd(): void {
    this.bouncing = false
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-dock-item': MacDockItem
  }
}
