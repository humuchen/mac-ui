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
 * @summary 数字动画组件，在数值之间平滑过渡。
 *
 * @slot prefix - 数字前的内容（例如货币符号）。
 * @slot suffix - 数字后的内容（例如单位文本）。
 *
 * @cssproperty --md-number-animation-font-size - 数字字体大小。
 * @cssproperty --md-number-animation-color - 数字文字颜色。
 * @cssproperty --md-number-animation-font-weight - 数字字重。
 * @cssproperty --md-number-animation-font-family - 数字字体。
 * @cssproperty --md-number-animation-prefix-color - 前缀文字颜色。
 * @cssproperty --md-number-animation-suffix-color - 后缀文字颜色。
 *
 * @event mac-number-animation-start - 动画开始时触发。`detail: { from, to }`
 * @event mac-number-animation-finish - 动画结束时触发。`detail: { value }`
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

      /* ─── 尺寸：sm ─── */

      :host([size='sm']) {
        --md-number-animation-font-size: var(--md-font-size-xl, 24px);
      }

      /* ─── 尺寸：md ─── */

      :host([size='md']) {
        --md-number-animation-font-size: var(--md-font-size-display, 48px);
      }

      /* ─── 尺寸：lg ─── */

      :host([size='lg']) {
        --md-number-animation-font-size: var(--md-font-size-hero, 72px);
      }

      /* ─── 深色模式 ─── */

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

  /** 动画目标值 */
  @property({ type: Number }) to = 0

  /** 起始值 */
  @property({ type: Number }) from = 0

  /** 动画时长（毫秒） */
  @property({ type: Number }) duration = 2000

  /** 小数位数 */
  @property({ type: Number }) precision = 0

  /** 千位分隔符字符 */
  @property() separator = ''

  /** 缓动函数名称 */
  @property() easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' = 'easeOut'

  /** 连接时是否自动开始动画 */
  @property({ type: Boolean }) autoplay = true

  /** 前缀文本（替代插槽） */
  @property() prefix = ''

  /** 后缀文本（替代插槽） */
  @property() suffix = ''

  /** 组件尺寸 */
  @property({ reflect: true }) size?: 'sm' | 'md' | 'lg'

  /** 动画完成时的回调（可作为属性设置） */
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
    // 当 `to` 或 `from` 变化时重新动画
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

  /** 开始动画 */
  start(): void {
    this._stopAnimation()
    this._displayValue = this.from
    this._startTime = null
    this._isAnimating = true
    this.emit('mac-number-animation-start', { detail: { from: this.from, to: this.to } })
    this._rafId = requestAnimationFrame((t) => this._animate(t))
  }

  /** 重置到起始值 */
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
        ${
          hasPrefixSlot
            ? html`<span class="prefix"><slot name="prefix"></slot></span>`
            : this.prefix
              ? html`<span class="prefix">${this.prefix}</span>`
              : ''
        }

        <span class="value">${this._formatNumber(this._displayValue)}</span>

        ${
          hasSuffixSlot
            ? html`<span class="suffix"><slot name="suffix"></slot></span>`
            : this.suffix
              ? html`<span class="suffix">${this.suffix}</span>`
              : ''
        }
      </span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-number-animation': MacNumberAnimation
  }
}
