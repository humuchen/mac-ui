import { html, css, nothing, svg, SVGTemplateResult } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-rating
 * @summary A macOS-style rating component with customizable icons.
 *
 * @slot icon-empty - Custom icon for empty state.
 * @slot icon-half - Custom icon for half-filled state.
 * @slot icon-full - Custom icon for full-filled state.
 *
 * @cssproperty --md-rating-icon-size - Size of each rating icon.
 * @cssproperty --md-rating-gap - Gap between icons.
 * @cssproperty --md-rating-color-active - Color of active (filled) icons.
 * @cssproperty --md-rating-color-inactive - Color of inactive (empty) icons.
 * @cssproperty --md-rating-color-hover - Color of hovered icons.
 * @cssproperty --md-rating-color-disabled - Color when disabled.
 *
 * @event mac-rating-change - Emitted when the rating value changes. `detail: { value: number }`
 */
@customElement('mac-rating')
export class MacRating extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        --md-rating-icon-size: var(--md-icon-size-lg, 24px);
        --md-rating-gap: var(--md-spacing-xs, 4px);
        --md-rating-color-active: var(--md-color-warning, #f59e0b);
        --md-rating-color-inactive: var(--md-color-border, #d1d5db);
        --md-rating-color-hover: var(--md-color-warning, #f59e0b);
        --md-rating-color-disabled: var(--md-color-border, #d1d5db);
      }

      :host([disabled]) {
        cursor: not-allowed;
        pointer-events: none;
      }

      .rating {
        display: inline-flex;
        align-items: center;
        gap: var(--md-rating-gap);
      }

      .icon-wrapper {
        position: relative;
        width: var(--md-rating-icon-size);
        height: var(--md-rating-icon-size);
        flex-shrink: 0;
      }

      .icon-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
          transform 0.15s cubic-bezier(0.4, 0, 0.2, 1),
          color 0.15s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .icon-layer svg {
        width: 100%;
        height: 100%;
      }

      .icon-layer--empty {
        color: var(--md-rating-color-inactive);
      }

      .icon-layer--full {
        color: var(--md-rating-color-active);
        clip-path: inset(0 0 0 0);
      }

      .icon-layer--half {
        color: var(--md-rating-color-active);
        clip-path: inset(0 50% 0 0);
      }

      .icon-layer--hover {
        color: var(--md-rating-color-hover);
        transform: scale(1.15);
      }

      :host([disabled]) .icon-layer--full,
      :host([disabled]) .icon-layer--half {
        color: var(--md-rating-color-disabled);
      }

      /* Clickable zones */
      .click-zone {
        position: absolute;
        top: 0;
        height: 100%;
        z-index: 1;
        cursor: pointer;
      }

      .click-zone--left {
        left: 0;
        width: 50%;
      }

      .click-zone--right {
        right: 0;
        width: 50%;
      }

      :host([disabled]) .click-zone {
        cursor: not-allowed;
      }

      /* Label */
      .label {
        margin-left: var(--md-rating-gap);
        font-size: var(--md-font-size-base, 14px);
        color: var(--md-color-text-secondary, #6b7280);
        user-select: none;
        -webkit-user-select: none;
      }

      :host([disabled]) .label {
        opacity: 0.5;
      }
    `,
  ]

  /** Current rating value (supports half-star like 3.5) */
  @property({ type: Number }) value = 0

  /** Maximum rating count */
  @property({ type: Number }) max = 5

  /** Whether to allow half-star selection */
  @property({ type: Boolean }) allowHalf = false

  /** Whether the rating is read-only */
  @property({ type: Boolean, reflect: true }) readonly = false

  /** Whether the rating is disabled */
  @property({ type: Boolean, reflect: true }) disabled = false

  /** Whether to show the numeric value label */
  @property({ type: Boolean }) showValue = false

  /** Icon shape: star, heart, circle, flame, thumb */
  @property() icon: 'star' | 'heart' | 'circle' | 'flame' | 'thumb' = 'star'

  /** Custom empty icon slot name (overrides built-in icon) */
  @property() iconEmpty = ''

  /** Custom half icon slot name (overrides built-in icon) */
  @property() iconHalf = ''

  /** Custom full icon slot name (overrides built-in icon) */
  @property() iconFull = ''

  @state() private _hoverValue: number | null = null

  // Icon SVG paths
  private static readonly _icons: Record<string, SVGTemplateResult> = {
    star: svg`<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`,
    heart: svg`<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>`,
    circle: svg`<circle cx="12" cy="12" r="10"/>`,
    flame: svg`<path d="M12 23c-4.97 0-9-3.13-9-7 0-2.38 1.41-4.56 3.5-5.8C6.17 7.82 6 5.39 7.23 3.5 8.5 1.56 10.76 1 12 1c0 0-1.5 3-1.5 5.5 0 1.5.67 2.5 2 3 1.33.5 2.5-.5 2.5-2 0-1-.5-2.5-1.5-3.5 2.5 1 4.5 3.5 4.5 6.5 0 1.5-.5 3-1.5 4 1-1 1.5-2.5 1.5-4 0-3-2-5.5-4.5-6.5 1 1 1.5 2.5 1.5 3.5 0 1.5-1.17 2.5-2.5 2-1.33-.5-2-1.5-2-3C9.5 4 11 1 12 1c1.24 0 3.5.56 4.77 2.5C18 5.39 17.83 7.82 17.5 10.2 19.59 11.44 21 13.62 21 16c0 3.87-4.03 7-9 7z"/>`,
    thumb: svg`<path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z"/>`,
  }

  private _getIconSvg(): SVGTemplateResult {
    return MacRating._icons[this.icon] ?? MacRating._icons.star
  }

  private _renderIconLayer(className: string): SVGTemplateResult {
    return svg`
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
        ${this._getIconSvg()}
      </svg>
    `
  }

  private _getDisplayValue(): number {
    return this._hoverValue ?? this.value
  }

  private _onMouseEnter(index: number, half: 'left' | 'right'): void {
    if (this.readonly || this.disabled) return
    if (this.allowHalf) {
      this._hoverValue = half === 'left' ? index - 0.5 : index
    } else {
      this._hoverValue = index
    }
  }

  private _onMouseLeave(): void {
    if (this.readonly || this.disabled) return
    this._hoverValue = null
  }

  private _onClick(index: number, half: 'left' | 'right'): void {
    if (this.readonly || this.disabled) return
    let newValue: number
    if (this.allowHalf) {
      newValue = half === 'left' ? index - 0.5 : index
    } else {
      newValue = index
    }
    // Click same value to clear
    if (newValue === this.value) {
      this.value = 0
    } else {
      this.value = newValue
    }
    this.emit('mac-rating-change', { detail: { value: this.value } })
  }

  override render() {
    const displayValue = this._getDisplayValue()
    const isInteractive = !this.readonly && !this.disabled

    return html`
      <div class="rating" @mouseleave=${isInteractive ? this._onMouseLeave : nothing}>
        ${Array.from({ length: this.max }, (_, i) => {
          const index = i + 1
          const filled = displayValue >= index
          const halfFilled = !filled && displayValue >= index - 0.5
          const isHovered = this._hoverValue !== null && index <= this._hoverValue
          const isHalfHovered =
            this._hoverValue !== null &&
            !filled &&
            index - 0.5 <= this._hoverValue &&
            index > this._hoverValue - 0.5

          return html`
            <div class="icon-wrapper">
              <!-- Empty layer (always visible) -->
              <div class="icon-layer icon-layer--empty">${this._renderIconLayer('empty')}</div>

              ${halfFilled || isHalfHovered
                ? html`
                    <div
                      class="icon-layer icon-layer--half ${isHovered ? 'icon-layer--hover' : ''}"
                    >
                      ${this._renderIconLayer('half')}
                    </div>
                  `
                : nothing}
              ${filled
                ? html`
                    <div
                      class="icon-layer icon-layer--full ${isHovered ? 'icon-layer--hover' : ''}"
                    >
                      ${this._renderIconLayer('full')}
                    </div>
                  `
                : nothing}
              ${isInteractive
                ? html`
                    <div
                      class="click-zone click-zone--left"
                      @mouseenter=${() => this._onMouseEnter(index, 'left')}
                      @click=${() => this._onClick(index, 'left')}
                    ></div>
                    <div
                      class="click-zone click-zone--right"
                      @mouseenter=${() => this._onMouseEnter(index, 'right')}
                      @click=${() => this._onClick(index, 'right')}
                    ></div>
                  `
                : nothing}
            </div>
          `
        })}
        ${this.showValue
          ? html`<span class="label">${displayValue.toFixed(this.allowHalf ? 1 : 0)}</span>`
          : nothing}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-rating': MacRating
  }
}
