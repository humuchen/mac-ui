import { html, css, nothing, svg } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

export interface CircleConfig {
  percentage: number
  color?: string
  strokeWidth?: number
}

export interface GradientStop {
  color: string
  offset?: number
}

export interface GradientConfig {
  from?: string
  to?: string
  angle?: number
  stops?: GradientStop[]
}

/**
 * @tag mac-progress
 * @summary A progress component for displaying completion status.
 *
 * @csspart track - The progress track container.
 * @csspart fill - The progress fill indicator.
 * @csspart text - The progress text label.
 *
 * @cssproperty --mac-progress-track-bg - Background color of the track.
 * @cssproperty --mac-progress-fill-color - Color of the fill indicator.
 */
@customElement('mac-progress')
export class MacProgress extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
        font-family: var(--md-font-family);
      }

      /* ═══════════════════════════════════════════════════
         Line Progress
         ═══════════════════════════════════════════════════ */
      .progress-line {
        display: flex;
        align-items: center;
        gap: var(--md-progress-text-gap);
        width: 100%;
      }

      .progress-line--sm {
        --_progress-height: var(--sm-progress-height);
        --_progress-font-size: var(--sm-progress-font-size);
      }

      .progress-line--md {
        --_progress-height: var(--md-progress-height);
        --_progress-font-size: var(--md-progress-font-size);
      }

      .progress-line--lg {
        --_progress-height: var(--lg-progress-height);
        --_progress-font-size: var(--lg-progress-font-size);
      }

      .progress-line__track {
        flex: 1;
        height: var(--_progress-height);
        background-color: var(--md-progress-track-bg);
        border-radius: var(--md-progress-radius);
        overflow: hidden;
      }

      .progress-line__fill {
        height: 100%;
        border-radius: var(--md-progress-radius);
        background-color: var(--md-progress-fill-default);
        transition: width var(--md-transition-normal);
      }

      .progress-line__fill--success {
        background-color: var(--md-progress-fill-success);
      }

      .progress-line__fill--warning {
        background-color: var(--md-progress-fill-warning);
      }

      .progress-line__fill--error {
        background-color: var(--md-progress-fill-error);
      }

      .progress-line__text {
        font-size: var(--_progress-font-size);
        color: var(--md-progress-text-color);
        min-width: var(--md-progress-text-min-width);
        text-align: right;
        white-space: nowrap;
      }

      /* Processing animation for line */
      .progress-line__fill--processing {
        background-image: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.15) 25%,
          transparent 25%,
          transparent 50%,
          rgba(255, 255, 255, 0.15) 50%,
          rgba(255, 255, 255, 0.15) 75%,
          transparent 75%,
          transparent
        );
        background-size: 24px 24px;
        animation: progress-line-stripes 1s linear infinite;
      }

      @keyframes progress-line-stripes {
        0% {
          background-position: 0 0;
        }
        100% {
          background-position: 24px 0;
        }
      }

      /* ═══════════════════════════════════════════════════
         Circle Progress
         ═══════════════════════════════════════════════════ */
      .progress-circle {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .progress-circle__svg {
        transform: rotate(-90deg);
      }

      .progress-circle__track {
        fill: none;
        stroke: var(--md-progress-track-bg);
      }

      .progress-circle__fill {
        fill: none;
        stroke: var(--md-progress-fill-default);
        transition: stroke-dashoffset var(--md-transition-normal);
        stroke-linecap: round;
      }

      .progress-circle__fill--success {
        stroke: var(--md-progress-fill-success);
      }

      .progress-circle__fill--warning {
        stroke: var(--md-progress-fill-warning);
      }

      .progress-circle__fill--error {
        stroke: var(--md-progress-fill-error);
      }

      .progress-circle__text {
        position: absolute;
        font-size: var(--md-progress-circle-text-size);
        color: var(--md-progress-text-color);
        font-weight: var(--md-progress-circle-text-weight);
      }

      /* Processing animation for circle */
      .progress-circle__fill--processing {
        animation: progress-circle-spin 2s linear infinite;
        transform-origin: center;
      }

      @keyframes progress-circle-spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ]

  /** The current progress percentage (0-100). */
  @property({ type: Number }) percentage = 0

  /** The type of progress indicator. */
  @property({ reflect: true }) type: 'line' | 'circle' = 'line'

  /** The status of the progress. */
  @property({ reflect: true }) status: 'default' | 'success' | 'warning' | 'error' = 'default'

  /** The size of the progress component. */
  @property({ reflect: true }) size: 'sm' | 'md' | 'lg' = 'md'

  /** Whether to show the percentage text. */
  @property({ type: Boolean, reflect: true }) showText = true

  /** Whether the progress is in processing state (shows animation). */
  @property({ type: Boolean, reflect: true }) processing = false

  /** Custom color for the progress fill. Overrides status color. */
  @property() color?: string

  /** The width of the stroke for circle progress (in pixels). */
  @property({ type: Number }) strokeWidth = 6

  /** The width/height of the circle progress (in pixels). */
  @property({ type: Number }) width = 120

  /**
   * Multiple circle configurations for nested ring display.
   * Each item defines one ring with percentage, optional color, and optional strokeWidth.
   * When set, renders multiple concentric rings instead of a single circle.
   */
  @property({ type: Array }) circles?: CircleConfig[]

  /**
   * Gradient configuration for the progress fill.
   * When set, applies a linear gradient to the fill.
   * For circle type, uses SVG linearGradient.
   * For line type, uses CSS linear-gradient.
   */
  @property({ type: Object }) gradient?: GradientConfig

  private get _normalizedPercentage(): number {
    return Math.max(0, Math.min(100, this.percentage))
  }

  private get _progressSize(): 'sm' | 'md' | 'lg' {
    return this.size ?? 'md'
  }

  private get _fillColor(): string {
    if (this.color) return this.color
    return ''
  }

  private _hasGradient(): boolean {
    if (!this.gradient) return false
    if (this.gradient.stops && this.gradient.stops.length >= 2) return true
    return !!this.gradient.from && !!this.gradient.to
  }

  private _getGradientId(index = 0): string {
    return `mac-progress-gradient-${index}`
  }

  private _renderGradientDefs(circleIndex = 0) {
    if (!this._hasGradient()) return nothing
    const grad = this.gradient!
    const angle = (grad.angle ?? 0) * (Math.PI / 180)
    const x1 = 50 - 50 * Math.cos(angle)
    const y1 = 50 - 50 * Math.sin(angle)
    const x2 = 50 + 50 * Math.cos(angle)
    const y2 = 50 + 50 * Math.sin(angle)
    const id = this._getGradientId(circleIndex)

    const stops =
      grad.stops && grad.stops.length >= 2
        ? grad.stops
        : [
            { color: grad.from!, offset: 0 },
            { color: grad.to!, offset: 100 },
          ]

    return svg`
      <linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        ${stops.map((s) => svg`<stop offset="${s.offset ?? 0}%" stop-color="${s.color}" />`)}
      </linearGradient>
    `
  }

  private _renderLine() {
    const size = this._progressSize
    const pct = this._normalizedPercentage
    const fillColor = this._fillColor
    const hasGradient = this._hasGradient()

    let fillStyle = ''
    if (hasGradient) {
      const grad = this.gradient!
      const angle = grad.angle ?? 0
      const stops =
        grad.stops && grad.stops.length >= 2
          ? grad.stops
          : [
              { color: grad.from!, offset: 0 },
              { color: grad.to!, offset: 100 },
            ]
      const stopStr = stops.map((s) => `${s.color} ${s.offset ?? 0}%`).join(', ')
      fillStyle = `background: linear-gradient(${angle}deg, ${stopStr})`
    } else if (fillColor) {
      fillStyle = `background-color: ${fillColor}`
    }

    return html`
      <div class="progress-line progress-line--${size}">
        <div class="progress-line__track" part="track">
          <div
            class="progress-line__fill progress-line__fill--${this.status} ${this.processing
              ? 'progress-line__fill--processing'
              : ''}"
            part="fill"
            style="width: ${this.processing ? '100%' : pct + '%'}; ${fillStyle}"
          ></div>
        </div>
        ${this.showText && !this.processing
          ? html`<span class="progress-line__text" part="text">${pct}%</span>`
          : nothing}
      </div>
    `
  }

  private _renderCircle() {
    const w = this.width

    if (this.circles && this.circles.length > 0) {
      return this._renderMultiCircle()
    }

    const pct = this._normalizedPercentage
    const sw = this.strokeWidth
    const r = (w - sw) / 2
    const c = 2 * Math.PI * r
    const offset = c - (pct / 100) * c
    const fillColor = this._fillColor
    const hasGradient = this._hasGradient()
    const gradientId = this._getGradientId(0)

    let strokeValue = ''
    if (hasGradient) {
      strokeValue = `url(#${gradientId})`
    } else if (fillColor) {
      strokeValue = fillColor
    }

    return html`
      <div class="progress-circle" style="width: ${w}px; height: ${w}px;">
        <svg class="progress-circle__svg" width="${w}" height="${w}" viewBox="0 0 ${w} ${w}">
          <defs>${this._renderGradientDefs(0)}</defs>
          <circle
            class="progress-circle__track"
            part="track"
            cx="${w / 2}"
            cy="${w / 2}"
            r="${r}"
            stroke-width="${sw}"
          />
          <circle
            class="progress-circle__fill progress-circle__fill--${this.status} ${this.processing
              ? 'progress-circle__fill--processing'
              : ''}"
            part="fill"
            cx="${w / 2}"
            cy="${w / 2}"
            r="${r}"
            stroke-width="${sw}"
            stroke-dasharray="${this.processing ? c * 0.25 + ' ' + c * 0.75 : c}"
            stroke-dashoffset="${this.processing ? c * 0.125 : offset}"
            stroke="${strokeValue}"
          />
        </svg>
        ${this.showText
          ? html`<span class="progress-circle__text" part="text"
              ><slot name="text">${pct}%</slot></span
            >`
          : nothing}
      </div>
    `
  }

  private _renderMultiCircle() {
    const w = this.width
    const circles = this.circles!
    const gap = 4
    const padding = 2
    const strokeWidths = circles.map((c) => c.strokeWidth ?? this.strokeWidth)

    // 计算各圈半径：index=0 是最外层（最大半径），向内逐层递减
    const radii: number[] = []
    radii[0] = (w - strokeWidths[0]) / 2 - padding
    for (let i = 1; i < circles.length; i++) {
      radii[i] = radii[i - 1] - strokeWidths[i - 1] / 2 - gap - strokeWidths[i] / 2
    }

    return html`
      <div class="progress-circle" style="width: ${w}px; height: ${w}px;">
        <svg class="progress-circle__svg" width="${w}" height="${w}" viewBox="0 0 ${w} ${w}">
          <defs>${circles.map((_, i) => this._renderGradientDefs(i))}</defs>
          ${circles.map((circle, index) => {
            const sw = strokeWidths[index]
            const r = radii[index]
            const c = 2 * Math.PI * r
            const pct = Math.max(0, Math.min(100, circle.percentage))
            const offset = c - (pct / 100) * c
            const hasGradient = this._hasGradient()
            const gradientId = this._getGradientId(index)

            let strokeValue = ''
            if (circle.color) {
              strokeValue = circle.color
            } else if (hasGradient) {
              strokeValue = `url(#${gradientId})`
            }

            // processing 动画仅作用于最内圈（数组最后一个）
            const isProcessing = this.processing && index === circles.length - 1
            return svg`
              <circle
                class="progress-circle__track"
                cx="${w / 2}"
                cy="${w / 2}"
                r="${r}"
                stroke-width="${sw}"
              />
              <circle
                class="progress-circle__fill ${
                  isProcessing ? 'progress-circle__fill--processing' : ''
                }"
                cx="${w / 2}"
                cy="${w / 2}"
                r="${r}"
                stroke-width="${sw}"
                stroke-dasharray="${isProcessing ? c * 0.25 + ' ' + c * 0.75 : c}"
                stroke-dashoffset="${isProcessing ? c * 0.125 : offset}"
                stroke="${strokeValue}"
                stroke-linecap="round"
              />
            `
          })}
        </svg>
        ${this.showText && !this.processing
          ? html`<span class="progress-circle__text" part="text"
              ><slot name="text">${this._normalizedPercentage}%</slot></span
            >`
          : nothing}
      </div>
    `
  }

  override render() {
    return this.type === 'circle' ? this._renderCircle() : this._renderLine()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-progress': MacProgress
  }
}
