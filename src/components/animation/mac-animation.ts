import { html, css, PropertyValues, nothing } from 'lit'
import { property, customElement, query } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import {
  builtInKeyframes,
  getAnimation,
  BUILT_IN_ANIMATION_NAMES,
  type AnimationOptions,
} from './animations'

/**
 * @tag mac-animation
 * @summary 动画容器组件（高阶组件模式）。
 *
 * 将需要应用动画的目标元素放在 `<mac-animation>` 内部，被包裹内容将自动应用指定动画。
 * 同时支持「样式类模式」—— 导出 `animationStyleSheet` / `buildAnimationShorthand` / `getAnimationStyleObject`。
 *
 * @slot - 需要应用动画的目标内容
 *
 * @event mac-animation-start - 动画开始时触发
 * @event mac-animation-end - 动画结束时触发
 * @event mac-animation-iteration - 动画每次重复时触发
 *
 * @csspart wrapper - 包裹动画内容的容器
 */
@customElement('mac-animation')
export class MacAnimation extends BaseElement {
  static override styles = [
    sharedStyles,
    builtInKeyframes,
    css`
      :host {
        display: inline-block;
      }
      .mac-anim-wrapper {
        display: inline-block;
        /* 硬件加速：减少动画抖动 */
        will-change: transform, opacity;
        backface-visibility: hidden;
      }
      :host([block]) {
        display: block;
      }
      :host([block]) .mac-anim-wrapper {
        display: block;
      }
    `,
  ]

  /** 动画类型名称（内置 27 种，或通过 registerAnimation 注册的自定义动画） */
  @property({ reflect: true }) type = 'fadeIn'

  /** 动画时长，如 '1s' / '500ms' */
  @property() duration = '1s'

  /** 延迟时间 */
  @property() delay = '0s'

  /** 重复次数：数字或 'infinite' */
  @property() iterationCount: number | 'infinite' = 1

  /** 动画方向 */
  @property() direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse' = 'normal'

  /** 填充模式 */
  @property() fillMode: 'none' | 'forwards' | 'backwards' | 'both' = 'both'

  /** 缓动函数 */
  @property() timingFunction = 'ease'

  /** 是否暂停（暂停 / 继续控制） */
  @property({ type: Boolean, reflect: true }) paused = false

  /** 是否以块级元素渲染（默认 inline-block） */
  @property({ type: Boolean, reflect: true }) block = false

  /** 动画结束后是否自动移除动画样式（便于反复触发） */
  @property({ type: Boolean }) autoClear = false

  @query('.mac-anim-wrapper') private _wrapper!: HTMLElement

  /** 用于强制重启动画的内部计数 */
  private _runToken = 0

  override updated(changed: PropertyValues) {
    super.updated(changed)
    // 属性变更后，将动画样式同步到包裹元素
    this._applyAnimation()
  }

  /** 当前动画是否可用 */
  private _resolveAnimation() {
    const def = getAnimation(this.type)
    return def
  }

  /** 计算并应用 inline animation 样式 */
  private _applyAnimation() {
    const wrapper = this._wrapper
    if (!wrapper) return

    const def = this._resolveAnimation()
    if (!def) {
      wrapper.style.animation = ''
      return
    }

    const opts: AnimationOptions = {
      duration: this.duration,
      delay: this.delay,
      iterationCount: this.iterationCount,
      direction: this.direction,
      fillMode: this.fillMode,
      timingFunction: this.timingFunction,
      paused: this.paused,
    }

    const parts = [
      `mac-${def.name}`,
      opts.duration ?? '1s',
      opts.timingFunction ?? 'ease',
      opts.delay ?? '0s',
      String(opts.iterationCount ?? 1),
      opts.direction ?? 'normal',
      opts.fillMode ?? 'both',
      opts.paused ? 'paused' : 'running',
    ]
    wrapper.style.animation = parts.join(' ')
  }

  /** 渲染自定义（非内置）动画的 keyframes 到 Shadow DOM */
  private _renderCustomKeyframes() {
    const def = this._resolveAnimation()
    if (!def) return nothing
    // 内置动画已存在于静态 styles，无需重复注入
    if (BUILT_IN_ANIMATION_NAMES.has(def.name)) return nothing
    return html`<style>
      ${def.keyframes}
    </style>`
  }

  override render() {
    return html`
      ${this._renderCustomKeyframes()}
      <div
        class="mac-anim-wrapper"
        part="wrapper"
        data-run=${this._runToken}
        @animationstart=${this._onAnimationStart}
        @animationiteration=${this._onAnimationIteration}
        @animationend=${this._onAnimationEnd}
      >
        <slot></slot>
      </div>
    `
  }

  /* ─────────── 生命周期事件 ─────────── */
  private _onAnimationStart = () => {
    this.emit('mac-animation-start')
  }

  private _onAnimationIteration = () => {
    this.emit('mac-animation-iteration')
  }

  private _onAnimationEnd = () => {
    this.emit('mac-animation-end')
    if (this.autoClear) {
      // 保留终态视觉，仅移除动画以允许后续 restart
      this._wrapper?.style.setProperty('animation', 'none')
    }
  }

  /* ─────────── 公共方法（暂停 / 继续 / 重启 / 停止） ─────────── */

  /** 暂停动画 */
  public pause() {
    if (!this.paused) this.paused = true
  }

  /** 继续动画 */
  public resume() {
    if (this.paused) this.paused = false
  }

  /** 重启动画（从头开始播放一次） */
  public restart() {
    const wrapper = this._wrapper
    if (!wrapper) return
    // 先移除动画并强制回流，再重新应用
    wrapper.style.animation = 'none'
    // 强制 reflow
    void wrapper.offsetWidth
    this._runToken++
    this._applyAnimation()
  }

  /** 停止动画并清除样式 */
  public stop() {
    const wrapper = this._wrapper
    if (wrapper) wrapper.style.animation = 'none'
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-animation': MacAnimation
  }
}
