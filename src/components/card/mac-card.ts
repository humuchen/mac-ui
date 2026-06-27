import { html, css } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-card
 * @summary A card container component with macOS-style design.
 *
 * @slot - The card's body content.
 * @slot header - The card's header.
 * @slot footer - The card's footer.
 * @slot media - The card's media area (top).
 *
 * @csspart base - The card's base container.
 * @csspart header - The header container.
 * @csspart body - The body container.
 * @csspart footer - The footer container.
 * @csspart media - The media container.
 */
@customElement('mac-card')
export class MacCard extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
      }

      .card {
        position: relative;
        background-color: var(--md-color-bg);
        border-radius: var(--md-radius-lg);
        overflow: hidden;
        transition: box-shadow var(--md-transition-normal), border-color var(--md-transition-normal);
      }

      /* Variants */
      .card--default {
        border: 1px solid var(--md-color-border);
        box-shadow:
          0 1px 3px rgba(0, 0, 0, 0.04),
          0 1px 2px rgba(0, 0, 0, 0.06);
      }

      .card--elevated {
        border: none;
        box-shadow:
          0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -2px rgba(0, 0, 0, 0.1),
          0 0 0 1px rgba(0, 0, 0, 0.02);
      }

      .card--glass {
        background: var(--md-glass-bg);
        backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        -webkit-backdrop-filter: blur(var(--md-glass-blur)) saturate(var(--md-glass-saturate));
        border: 1px solid var(--md-glass-border);
        box-shadow:
          inset 0 1px 0 var(--md-glass-highlight-top),
          inset 0 -1px 0 var(--md-glass-highlight-bottom),
          var(--md-shadow-menu);
      }

      .card--outlined {
        background: transparent;
        border: 1.5px solid var(--md-color-border);
        box-shadow: none;
      }

      .card--gradient {
        border: none;
        background: linear-gradient(
          135deg,
          rgba(0, 122, 255, 0.08) 0%,
          rgba(88, 86, 214, 0.08) 100%
        );
        box-shadow:
          0 2px 8px rgba(0, 122, 255, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.5);
      }

      /* Hover Effects */
      .card--hoverable:hover {
        transform: translateY(-2px);
        box-shadow:
          0 12px 24px -8px rgba(0, 0, 0, 0.15),
          0 4px 8px -2px rgba(0, 0, 0, 0.1);
      }

      .card--glass.card--hoverable:hover {
        background: rgba(255, 255, 255, 0.16);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          0 12px 32px rgba(0, 0, 0, 0.2);
      }

      .card--gradient.card--hoverable:hover {
        background: linear-gradient(
          135deg,
          rgba(0, 122, 255, 0.12) 0%,
          rgba(88, 86, 214, 0.12) 100%
        );
        box-shadow:
          0 12px 24px rgba(0, 122, 255, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.6);
      }

      /* Clickable */
      .card--clickable {
        cursor: pointer;
        user-select: none;
      }

      .card--clickable:active {
        transform: scale(0.98);
      }

      /* Media */
      .card__media {
        position: relative;
        overflow: hidden;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      }

      .card__media::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.02) 100%);
        pointer-events: none;
      }

      .card__media--ratio-16-9 {
        padding-bottom: 56.25%;
      }

      .card__media--ratio-4-3 {
        padding-bottom: 75%;
      }

      .card__media--ratio-1-1 {
        padding-bottom: 100%;
      }

      .card__media-content {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Header */
      .card__header {
        padding: var(--md-card-header-padding);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        background: rgba(0, 0, 0, 0.01);
      }

      .card--glass .card__header {
        border-bottom-color: rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
      }

      /* Body */
      .card__body {
        padding: var(--md-card-body-padding);
      }

      /* Footer */
      .card__footer {
        padding: var(--md-card-footer-padding);
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        background: rgba(0, 0, 0, 0.01);
      }

      .card--glass .card__footer {
        border-top-color: rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
      }

      /* Accent Border */
      .card--accent-top::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #007aff 0%, #5856d6 100%);
        border-radius: var(--md-radius-lg) var(--md-radius-lg) 0 0;
      }

      .card--accent-left::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 3px;
        background: linear-gradient(180deg, #007aff 0%, #5856d6 100%);
        border-radius: var(--md-radius-lg) 0 0 var(--md-radius-lg);
      }

      /* Loading State */
      .card--loading {
        pointer-events: none;
        opacity: 0.7;
      }

      .card--loading .card__body,
      .card--loading .card__header,
      .card--loading .card__footer {
        position: relative;
        color: transparent !important;
      }

      .card--loading .card__body::after,
      .card--loading .card__header::after,
      .card--loading .card__footer::after {
        content: '';
        position: absolute;
        inset: var(--md-card-close-inset);
        background: linear-gradient(
          90deg,
          rgba(0, 0, 0, 0.03) 0%,
          rgba(0, 0, 0, 0.08) 50%,
          rgba(0, 0, 0, 0.03) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: var(--md-card-close-radius);
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      :host([data-theme='dark']) .card--default {
        background: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 255, 255, 0.1);
      }

      :host([data-theme='dark']) .card--elevated {
        background: rgba(255, 255, 255, 0.06);
        box-shadow:
          0 4px 6px -1px rgba(0, 0, 0, 0.3),
          0 2px 4px -2px rgba(0, 0, 0, 0.2),
          0 0 0 1px rgba(255, 255, 255, 0.05);
      }

      :host([data-theme='dark']) .card--outlined {
        border-color: rgba(255, 255, 255, 0.15);
      }

      :host([data-theme='dark']) .card--gradient {
        background: linear-gradient(
          135deg,
          rgba(0, 122, 255, 0.15) 0%,
          rgba(88, 86, 214, 0.15) 100%
        );
      }

      :host([data-theme='dark']) .card__header,
      :host([data-theme='dark']) .card__footer {
        border-color: rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.02);
      }
    `,
  ]

  /** The visual variant of the card. */
  @property({ reflect: true }) variant: 'default' | 'elevated' | 'glass' | 'outlined' | 'gradient' =
    'default'

  /** Whether the card has a hover effect. */
  @property({ type: Boolean, reflect: true }) hoverable = false

  /** Whether the card is clickable. */
  @property({ type: Boolean, reflect: true }) clickable = false

  /** Shows a loading state. */
  @property({ type: Boolean, reflect: true }) loading = false

  /** Adds an accent border. */
  @property({ reflect: true }) accent?: 'top' | 'left'

  /** Media aspect ratio. */
  @property({ reflect: true }) mediaRatio?: '16-9' | '4-3' | '1-1'

  override willUpdate() {
    const theme = this._resolvedTheme
    if (theme) {
      this.setAttribute('data-theme', theme)
    } else {
      this.removeAttribute('data-theme')
    }
  }

  override render() {
    const classes = [
      'card',
      `card--${this.variant}`,
      this.hoverable ? 'card--hoverable' : '',
      this.clickable ? 'card--clickable' : '',
      this.loading ? 'card--loading' : '',
      this.accent ? `card--accent-${this.accent}` : '',
    ]
      .filter(Boolean)
      .join(' ')

    return html`
      <div part="base" class=${classes}>
        <div
          part="media"
          class="card__media ${this.mediaRatio ? `card__media--ratio-${this.mediaRatio}` : ''}"
        >
          <div class="card__media-content">
            <slot name="media"></slot>
          </div>
        </div>
        <slot name="header" part="header"></slot>
        <div class="card__body" part="body">
          <slot></slot>
        </div>
        <slot name="footer" part="footer"></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-card': MacCard
  }
}
