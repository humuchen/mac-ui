import { html, css } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

type EasingFn = (t: number) => number

const EASING_MAP: Record<string, EasingFn> = {
  linear: (t) => t,
  easeIn: (t) => t * t,
  easeOut: (t) => t * (2 - t),
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
}

/**
 * @tag mac-number-animation
 * @summary A number animation component that smoothly transitions between numeric values.
 *
 * @slot prefix - Content before the number (e.g. currency symbol).
 * @slot suffix - Content after the number (e.g. unit text).
 *
 * @cssproperty --md-number-animation-font-size - Number font size.
 * @cssproperty --md-number-animation-color - Number text color.
 * @cssproperty --md-number-animation-font-weight - Number font weight.
 * @cssproperty --md-number-animation-font-family - Number font family.
 * @cssproperty --md-number-animation-prefix-color - Prefix text color.
 * @cssproperty --md-number-animation-suffix-color - Suffix text color.
 *
 * @event mac-number-animation-start - Emitted when animation starts. `detail: { from, to }`
 * @event mac-number-animation-finish - Emitted when animation finishes. `detail: { value }`
 */
@customElement('mac-number-animation')
export class MacNumberAnimation extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: inline-flex;
        align-items: baseline;
        --md-number-animation-font-size: var(--md-font-size-display, 48px);
        --md-number-animation-color: var(--md-color-text);
        --md-number-animation-font-weight: 600;
        --md-number-animation-font-family: var(--md-font-family);
        --md-number-animation-prefix-color: var(--md-color-text-secondary);
        --md-number-animation-suffix-color: var(--md-color-text-secondary);
      }

      .number-animation {
        display: inline-flex;
        align-items: baseline;
        font-variant-numeric: tabular-nums;
      }

      .prefix,
      .suffix {
        font-size: calc(var(--md-number-animation-font-size) * 0.45);
        color: var(--md-number-animation-prefix-color);
        font-weight: 400;
      }

      .suffix {
        color: var(--md-number-animation-suffix-color);
      }

      .value {
        font-size: var(--md-number-animation-font-size);
        font-weight: var(--md-number-animation-font-weight);
        font-family: var(--md-number-animation-font-family);
        color: var(--md-number-animation-color);
        line-height: 1;
        letter-spacing: -0.02em;
      }

      /* ─── Size: sm ─── */

      :host([size='sm']) {
        --md-number-animation-font-size: var(--md-font-size-xl, 24px);
      }

      /* ─── Size: md ─── */

      :host([size='md']) {
        --md-number-animation-font-size: var(--md-font-size-display, 48px);
      }

      /* ─── Size: lg ─── */

      :host([size='lg']) {
        --md-number-animation-font-size: var(--md-font-size-hero, 72px);
      }

      /* ─── Dark Mode ─── */

      @media (prefers-color-scheme: dark) {
        :host(:not([data-theme='light'])) {
          --md-number-animation-color: rgba(255, 255, 255, 0.92);
          --md-number-animation-prefix-color: rgba(255, 255, 255, 0.55);
          --md-number-animation-suffix-color: rgba(255, 255, 255, 0.55);
        }
      }

      :host([data-theme='dark']) {
        --md-number-animation-color: rgba(255, 255, 255, 0.92);
        --md-number-animation-prefix-color: rgba(255, 255, 255, 0.55);
        --md-number-animation-suffix-color: rgba(255, 255, 255, 0.55);
      }

      :host([data-theme='light']) {
        --md-number-animation-color: var(--md-color-text);
        --md-number-animation-prefix-color: var(--md-color-text-secondary);
        --md-number-animation-suffix-color: var(--md-color-text-secondary);
      }
    `,
  ]

  /** Target value to animate to */
  @property({ type: Number }) to = 0

  /** Starting value */
  @property({ type: Number }) from = 0

  /** Animation duration in milliseconds */
  @property({ type: Number }) duration = 2000

  /** Number of decimal places */
  @property({ type: Number }) precision = 0

  /** Thousands separator character */
  @property() separator = ''

  /** Easing function name */
  @property() easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' = 'easeOut'

  /** Whether to auto-start animation on connect */
  @property({ type: Boolean }) autoplay = true

  /** Prefix text (alternative to slot) */
  @property() prefix = ''

  /** Suffix text (alternative to slot) */
  @property() suffix = ''

  /** Component size */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** Callback when animation finishes (can be set as property) */
  @property({ attribute: false }) onFinish?: (value: number) => void

  @state() private _displayValue = 0

  private _rafId: number | null = null
  private _startTime: number | null = null
  private _isAnimating = false

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

  override updated(changed: Map<string, unknown>): void {
    // Re-animate when `to` or `from` changes
    if (changed.has('to') || changed.has('from')) {
      if (this.autoplay && this._isAnimating === false) {
        this.start()
      }
    }
  }

  override connectedCallback(): void {
    super.connectedCallback()
    if (this.autoplay) {
      this._displayValue = this.from
      requestAnimationFrame(() => this.start())
    } else {
      this._displayValue = this.to
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback()
    this._stopAnimation()
  }

  /** Start the animation */
  start(): void {
    this._stopAnimation()
    this._displayValue = this.from
    this._startTime = null
    this._isAnimating = true
    this.emit('mac-number-animation-start', { detail: { from: this.from, to: this.to } })
    this._rafId = requestAnimationFrame((t) => this._animate(t))
  }

  /** Reset to the starting value */
  reset(): void {
    this._stopAnimation()
    this._displayValue = this.from
    this._isAnimating = false
  }

  private _stopAnimation(): void {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId)
      this._rafId = null
    }
    this._isAnimating = false
  }

  private _animate(timestamp: number): void {
    if (this._startTime === null) {
      this._startTime = timestamp
    }

    const elapsed = timestamp - this._startTime
    const progress = Math.min(elapsed / this.duration, 1)
    const easingFn = EASING_MAP[this.easing] || EASING_MAP.easeOut
    const easedProgress = easingFn(progress)

    this._displayValue = this.from + (this.to - this.from) * easedProgress

    if (progress < 1) {
      this._rafId = requestAnimationFrame((t) => this._animate(t))
    } else {
      this._displayValue = this.to
      this._isAnimating = false
      this.emit('mac-number-animation-finish', { detail: { value: this.to } })
      this.onFinish?.(this.to)
    }

    this.requestUpdate()
  }

  private _formatNumber(value: number): string {
    const fixed = value.toFixed(this.precision)
    if (!this.separator) return fixed

    const [intPart, decPart] = fixed.split('.')
    const formatted = intPart!.replace(/\B(?=(\d{3})+(?!\d))/g, this.separator)
    return decPart !== undefined ? `${formatted}.${decPart}` : formatted
  }

  override render() {
    const hasPrefixSlot = this.querySelector('[slot="prefix"]')
    const hasSuffixSlot = this.querySelector('[slot="suffix"]')

    return html`
      <span class="number-animation">
        ${hasPrefixSlot
          ? html`<span class="prefix"><slot name="prefix"></slot></span>`
          : this.prefix
            ? html`<span class="prefix">${this.prefix}</span>`
            : ''}

        <span class="value">${this._formatNumber(this._displayValue)}</span>

        ${hasSuffixSlot
          ? html`<span class="suffix"><slot name="suffix"></slot></span>`
          : this.suffix
            ? html`<span class="suffix">${this.suffix}</span>`
            : ''}
      </span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-number-animation': MacNumberAnimation
  }
}
