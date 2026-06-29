import { html, css, nothing, svg } from 'lit'
import { property, customElement, state, query } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-carousel-item
 * @summary mac-carousel 的幻灯片项。
 *
 * @slot - 幻灯片内容。
 */
@customElement('mac-carousel-item')
export class MacCarouselItem extends BaseElement {
  static override styles = [
    css`
      :host {
        display: block;
        flex-shrink: 0;
        width: 100%;
        height: 100%;
      }
    `,
  ]

  override render() {
    return html`<slot></slot>`
  }
}

/**
 * @tag mac-carousel
 * @summary 用于循环展示内容的轮播组件。
 *
 * @slot - 用于放置 mac-carousel-item 元素的默认插槽。
 *
 * @csspart base - 轮播的基础容器。
 * @csspart track - 滑动轨道容器。
 * @csspart arrow - 导航箭头。
 * @csspart dots - 指示器圆点容器。
 * @csspart dot - 单个指示器圆点。
 *
 * @event mac-carousel-change - 当前幻灯片变化时触发。`detail: { index: number, fromIndex: number }`
 */
@customElement('mac-carousel')
export class MacCarousel extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
        position: relative;
        overflow: hidden;
        --mac-carousel-slides-per-view: 1;
      }

      .carousel {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      /* ─── 滑动效果 ─── */
      .track--slide {
        display: flex;
        width: 100%;
        height: 100%;
        will-change: transform;
      }

      :host([direction='vertical']) .track--slide {
        flex-direction: column;
      }

      .track--slide ::slotted(mac-carousel-item) {
        flex-shrink: 0;
        width: calc(100% / var(--mac-carousel-slides-per-view));
        height: 100%;
      }

      :host([direction='vertical']) .track--slide ::slotted(mac-carousel-item) {
        width: 100%;
        height: calc(100% / var(--mac-carousel-slides-per-view));
      }

      /* ─── 淡入淡出效果 ─── */
      .track--fade {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .track--fade ::slotted(mac-carousel-item) {
        position: absolute;
        top: 0;
        left: 0;
        width: calc(100% / var(--mac-carousel-slides-per-view));
        height: 100%;
        opacity: 0;
        transition: opacity var(--md-transition-normal);
        z-index: 0;
      }

      :host([direction='vertical']) .track--fade ::slotted(mac-carousel-item) {
        width: 100%;
        height: calc(100% / var(--mac-carousel-slides-per-view));
      }

      .track--fade ::slotted(mac-carousel-item.active) {
        opacity: 1;
        z-index: 1;
      }

      /* ─── 自定义效果 ─── */
      .track--custom {
        display: flex;
        width: 100%;
        height: 100%;
      }

      :host([direction='vertical']) .track--custom {
        flex-direction: column;
      }

      .track--custom ::slotted(mac-carousel-item) {
        flex-shrink: 0;
        width: calc(100% / var(--mac-carousel-slides-per-view));
        height: 100%;
      }

      :host([direction='vertical']) .track--custom ::slotted(mac-carousel-item) {
        width: 100%;
        height: calc(100% / var(--mac-carousel-slides-per-view));
      }

      /* ─── 箭头 ─── */
      .arrow {
        position: absolute;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--md-carousel-arrow-size);
        height: var(--md-carousel-arrow-size);
        border-radius: 50%;
        background: var(--md-carousel-arrow-bg);
        color: var(--md-carousel-arrow-color);
        border: none;
        cursor: pointer;
        opacity: 0.7;
        transition:
          opacity var(--md-transition-fast),
          background var(--md-transition-fast);
        z-index: 10;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        pointer-events: auto;
      }

      .arrow:hover {
        opacity: 1;
        background: var(--md-carousel-arrow-hover-bg);
      }

      .arrow:focus-visible {
        outline: 2px solid var(--md-color-primary);
        outline-offset: 2px;
      }

      .arrow svg {
        width: 18px;
        height: 18px;
      }

      /* 水平箭头 */
      :host([direction='horizontal']) .arrow--prev {
        top: 50%;
        left: var(--md-carousel-arrow-offset);
        transform: translateY(-50%);
      }

      :host([direction='horizontal']) .arrow--next {
        top: 50%;
        right: var(--md-carousel-arrow-offset);
        transform: translateY(-50%);
      }

      /* 垂直箭头 */
      :host([direction='vertical']) .arrow--prev {
        top: var(--md-carousel-arrow-offset);
        left: 50%;
        transform: translateX(-50%);
      }

      :host([direction='vertical']) .arrow--next {
        bottom: var(--md-carousel-arrow-offset);
        left: 50%;
        transform: translateX(-50%);
      }

      /* ─── 圆点 ─── */
      .dots {
        position: absolute;
        display: flex;
        align-items: center;
        gap: var(--md-carousel-dot-gap);
        z-index: 10;
      }

      .dot {
        cursor: pointer;
        transition: all var(--md-transition-fast);
        border: none;
        background: var(--md-carousel-dot-bg);
        padding: 0;
      }

      .dot:hover {
        background: var(--md-carousel-dot-hover-bg);
      }

      .dot--active {
        background: var(--md-carousel-dot-active-bg);
      }

      /* 圆点类型：圆点 */
      .dot--dot {
        width: var(--md-carousel-dot-size);
        height: var(--md-carousel-dot-size);
        border-radius: 50%;
      }

      .dot--dot.dot--active {
        width: var(--md-carousel-dot-active-width);
        border-radius: var(--md-carousel-dot-active-radius);
      }

      /* 圆点类型：线条 */
      .dot--line {
        width: var(--md-carousel-line-width);
        height: var(--md-carousel-line-height);
        border-radius: var(--md-carousel-line-radius);
      }

      .dot--line.dot--active {
        width: var(--md-carousel-line-active-width);
      }

      /* 水平方向的圆点位置 */
      :host([direction='horizontal'][dot-position='top']) .dots {
        top: var(--md-carousel-dots-offset);
        left: 50%;
        transform: translateX(-50%);
      }

      :host([direction='horizontal'][dot-position='bottom']) .dots {
        bottom: var(--md-carousel-dots-offset);
        left: 50%;
        transform: translateX(-50%);
      }

      :host([direction='horizontal'][dot-position='left']) .dots {
        left: var(--md-carousel-dots-offset);
        top: 50%;
        transform: translateY(-50%);
        flex-direction: column;
      }

      :host([direction='horizontal'][dot-position='right']) .dots {
        right: var(--md-carousel-dots-offset);
        top: 50%;
        transform: translateY(-50%);
        flex-direction: column;
      }

      /* 垂直方向的圆点位置 */
      :host([direction='vertical'][dot-position='top']) .dots {
        top: var(--md-carousel-dots-offset);
        left: 50%;
        transform: translateX(-50%);
      }

      :host([direction='vertical'][dot-position='bottom']) .dots {
        bottom: var(--md-carousel-dots-offset);
        left: 50%;
        transform: translateX(-50%);
      }

      :host([direction='vertical'][dot-position='left']) .dots {
        left: var(--md-carousel-dots-offset);
        top: 50%;
        transform: translateY(-50%);
        flex-direction: column;
      }

      :host([direction='vertical'][dot-position='right']) .dots {
        right: var(--md-carousel-dots-offset);
        top: 50%;
        transform: translateY(-50%);
        flex-direction: column;
      }
    `,
  ]

  /** 当前激活的幻灯片索引（受控模式）。 */
  @property({ type: Number, attribute: 'current-index' }) currentIndex = 0

  /** 默认激活的幻灯片索引（非受控模式）。 */
  @property({ type: Number, attribute: 'default-index' }) defaultIndex = 0

  /** 是否自动播放。 */
  @property({ type: Boolean }) autoplay = false

  /** 自动播放间隔，单位为毫秒。 */
  @property({ type: Number }) interval = 5000

  /** 是否循环播放。 */
  @property({ type: Boolean }) loop = true

  /** 滑动方向。 */
  @property({ reflect: true }) direction: 'horizontal' | 'vertical' = 'horizontal'

  /** 过渡效果。 */
  @property({ reflect: true }) effect: 'slide' | 'fade' | 'custom' = 'slide'

  /** 每次显示的幻灯片数量。 */
  @property({ type: Number, attribute: 'slides-per-view', reflect: true }) slidesPerView = 1

  /** 是否显示导航箭头。 */
  @property({ type: Boolean, attribute: 'show-arrow' }) showArrow = true

  /** 是否显示指示器圆点。 */
  @property({ type: Boolean, attribute: 'show-dots' }) showDots = true

  /** 指示器圆点样式。 */
  @property({ attribute: 'dot-type' }) dotType: 'dot' | 'line' = 'dot'

  /** 指示器圆点的位置。 */
  @property({ attribute: 'dot-position', reflect: true }) dotPosition:
    'top' | 'bottom' | 'left' | 'right' = 'bottom'

  /** 轮播是否可拖拽。 */
  @property({ type: Boolean }) draggable = false

  /** 是否支持键盘导航。 */
  @property({ type: Boolean }) keyboard = false

  /** 是否支持鼠标滚轮导航。 */
  @property({ type: Boolean }) wheel = false

  /** 幻灯片过渡时长，单位为毫秒。 */
  @property({ type: Number, attribute: 'transition-duration' }) transitionDuration = 300

  @state() private _activeIndex = 0
  @state() private _slideCount = 0
  @state() private _isDragging = false
  @state() private _dragOffset = 0

  @query('.track') private _track!: HTMLElement

  private _autoplayTimer: ReturnType<typeof setInterval> | null = null
  private _dragStartPos = 0
  private _dragStartIndex = 0
  private _isWheeling = false

  private get _isControlled(): boolean {
    return this.hasAttribute('current-index')
  }

  get _resolvedIndex(): number {
    return this._isControlled ? this.currentIndex : this._activeIndex
  }

  override connectedCallback() {
    super.connectedCallback()
    // 将默认值同步到 DOM，以便 CSS :host([attr]) 选择器匹配
    if (!this.hasAttribute('direction')) {
      this.setAttribute('direction', 'horizontal')
    }
    if (!this.hasAttribute('dot-position')) {
      this.setAttribute('dot-position', 'bottom')
    }
    this._updateSlideCount()
    this._initActiveIndex()
    this._startAutoplay()
    if (this.keyboard) {
      this.addEventListener('keydown', this._handleKeydown)
      this.setAttribute('tabindex', '0')
    }
    if (this.wheel) {
      this.addEventListener('wheel', this._handleWheel, { passive: false })
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    this._stopAutoplay()
    if (this.keyboard) {
      this.removeEventListener('keydown', this._handleKeydown)
    }
    if (this.wheel) {
      this.removeEventListener('wheel', this._handleWheel)
    }
  }

  override willUpdate(changed: Map<string, unknown>) {
    if (changed.has('currentIndex')) {
      this._activeIndex = this.currentIndex
    }
    if (changed.has('slidesPerView') && this.slidesPerView > 0) {
      this.style.setProperty('--mac-carousel-slides-per-view', String(this.slidesPerView))
    }
    const theme = this._resolvedTheme
    if (theme) {
      this.setAttribute('data-theme', theme)
    } else {
      this.removeAttribute('data-theme')
    }
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('autoplay')) {
      this.autoplay ? this._startAutoplay() : this._stopAutoplay()
    }
    if (changed.has('interval')) {
      this._stopAutoplay()
      this._startAutoplay()
    }
    if (changed.has('slidesPerView')) {
      this._applyTransform()
    }
    if (changed.has('effect')) {
      this._syncFadeActiveClass()
    }
    if (changed.has('wheel')) {
      if (this.wheel) {
        this.addEventListener('wheel', this._handleWheel, { passive: false })
      } else {
        this.removeEventListener('wheel', this._handleWheel)
      }
    }
    if (changed.has('keyboard')) {
      if (this.keyboard) {
        this.addEventListener('keydown', this._handleKeydown)
        this.setAttribute('tabindex', '0')
      } else {
        this.removeEventListener('keydown', this._handleKeydown)
        this.removeAttribute('tabindex')
      }
    }
    this._applyTransform()
  }

  private _getItems(): Element[] {
    return Array.from(this.querySelectorAll(':scope > mac-carousel-item'))
  }

  private _updateSlideCount() {
    this._slideCount = this._getItems().length
  }

  private _initActiveIndex() {
    if (this._isControlled) {
      this._activeIndex = this.currentIndex
    } else if (this.defaultIndex > 0) {
      this._activeIndex = Math.min(this.defaultIndex, Math.max(0, this._slideCount - 1))
    }
  }

  private _handleSlotChange() {
    this._updateSlideCount()
    this._syncFadeActiveClass()
    if (this.autoplay && this._slideCount > 1) {
      this._startAutoplay()
    }
    this.requestUpdate()
  }

  private _applyTransform() {
    if (!this._track) return
    if (this.effect === 'fade' || this.effect === 'custom') {
      this._track.style.transform = ''
      this._track.style.transition = ''
      return
    }
    const index = this._resolvedIndex
    const offset = this._isDragging ? this._dragOffset : 0
    const step = 100 / this.slidesPerView

    if (this.direction === 'horizontal') {
      const translateX = -(index * step) + offset
      this._track.style.transform = `translateX(${translateX}%)`
    } else {
      const translateY = -(index * step) + offset
      this._track.style.transform = `translateY(${translateY}%)`
    }

    if (this._isDragging) {
      this._track.style.transition = 'none'
    } else {
      this._track.style.transition = `transform ${this.transitionDuration}ms ease`
    }
  }

  private _syncFadeActiveClass() {
    const items = this._getItems()
    if (this.effect !== 'fade') {
      items.forEach((item) => item.classList.remove('active'))
      return
    }
    const activeIndex = this._resolvedIndex
    items.forEach((item, i) => {
      if (i === activeIndex) {
        item.classList.add('active')
      } else {
        item.classList.remove('active')
      }
    })
  }

  private _goTo(index: number, fromUser = false) {
    const count = this._slideCount
    if (count <= 0) return

    let target = index
    if (this.loop) {
      if (target < 0) target = count - 1
      if (target >= count) target = 0
    } else {
      target = Math.max(0, Math.min(count - 1, target))
    }

    const fromIndex = this._resolvedIndex
    if (target === fromIndex && !fromUser) return

    if (!this._isControlled) {
      this._activeIndex = target
    }

    this.emit('mac-carousel-change', {
      detail: { index: target, fromIndex },
    })

    this._syncFadeActiveClass()
    this.requestUpdate()
  }

  private _prev() {
    this._goTo(this._resolvedIndex - 1, true)
  }

  private _next() {
    this._goTo(this._resolvedIndex + 1, true)
  }

  private _startAutoplay() {
    if (!this.autoplay || this._slideCount <= 1) return
    this._stopAutoplay()
    this._autoplayTimer = setInterval(() => {
      this._next()
    }, this.interval)
  }

  private _stopAutoplay() {
    if (this._autoplayTimer) {
      clearInterval(this._autoplayTimer)
      this._autoplayTimer = null
    }
  }

  private _handleMouseEnter() {
    if (this.autoplay) this._stopAutoplay()
  }

  private _handleMouseLeave() {
    if (this.autoplay && !this._isDragging) {
      this._startAutoplay()
    }
    if (this._isDragging) {
      this._endDrag()
    }
  }

  /* ─── 拖拽 ─── */

  private _startDrag(clientPos: number) {
    if (!this.draggable || this._slideCount <= 1 || this.effect === 'fade') return
    this._isDragging = true
    this._dragStartPos = clientPos
    this._dragStartIndex = this._resolvedIndex
    this._dragOffset = 0
    this._stopAutoplay()
    this._applyTransform()
  }

  private _moveDrag(clientPos: number) {
    if (!this._isDragging) return
    const rect = this.getBoundingClientRect()
    const size = this.direction === 'horizontal' ? rect.width : rect.height
    if (size === 0) return
    const delta = clientPos - this._dragStartPos
    this._dragOffset = (delta / size) * 100
    this._applyTransform()
  }

  private _endDrag() {
    if (!this._isDragging) return
    this._isDragging = false

    const threshold = 20
    if (this._dragOffset > threshold) {
      this._goTo(this._dragStartIndex - 1, true)
    } else if (this._dragOffset < -threshold) {
      this._goTo(this._dragStartIndex + 1, true)
    } else {
      this._goTo(this._dragStartIndex, true)
    }
    this._dragOffset = 0
    this._applyTransform()

    if (this.autoplay) this._startAutoplay()
  }

  private _onPointerDown = (e: PointerEvent) => {
    if (!this.draggable) return
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    this._startDrag(this.direction === 'horizontal' ? e.clientX : e.clientY)
  }

  private _onPointerMove = (e: PointerEvent) => {
    this._moveDrag(this.direction === 'horizontal' ? e.clientX : e.clientY)
  }

  private _onPointerUp = () => {
    this._endDrag()
  }

  /* ─── 键盘 ─── */

  private _handleKeydown = (e: KeyboardEvent) => {
    const isHorizontal = this.direction === 'horizontal'
    if ((isHorizontal && e.key === 'ArrowLeft') || (!isHorizontal && e.key === 'ArrowUp')) {
      e.preventDefault()
      this._prev()
    } else if (
      (isHorizontal && e.key === 'ArrowRight') ||
      (!isHorizontal && e.key === 'ArrowDown')
    ) {
      e.preventDefault()
      this._next()
    }
  }

  /* ─── 滚轮 ─── */

  private _handleWheel = (e: WheelEvent) => {
    if (!this.wheel || this._isWheeling) return
    e.preventDefault()

    const isHorizontal = this.direction === 'horizontal'
    const delta = isHorizontal ? e.deltaX : e.deltaY
    if (Math.abs(delta) < 20) return

    this._isWheeling = true
    if (delta > 0) {
      this._next()
    } else {
      this._prev()
    }

    setTimeout(() => {
      this._isWheeling = false
    }, this.transitionDuration + 100)
  }

  /* ─── 渲染 ─── */

  private _renderArrow(direction: 'prev' | 'next') {
    const isPrev = direction === 'prev'
    const isVertical = this.direction === 'vertical'

    return html`
      <button
        part="arrow"
        class="arrow arrow--${direction}"
        type="button"
        aria-label=${isPrev ? '上一张幻灯片' : '下一张幻灯片'}
        @click=${() => (isPrev ? this._prev() : this._next())}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          ${
            isVertical
              ? isPrev
                ? svg`<path d="M12 19V5M5 12l7-7 7 7" />`
                : svg`<path d="M12 5v14M5 12l7 7 7-7" />`
              : isPrev
                ? svg`<path d="M15 18l-6-6 6-6" />`
                : svg`<path d="M9 18l6-6-6-6" />`
          }
        </svg>
      </button>
    `
  }

  private _renderDots() {
    if (!this.showDots || this._slideCount <= 1) return nothing

    return html`
      <div part="dots" class="dots">
        ${Array.from(
          { length: this._slideCount },
          (_, i) => html`
            <button
              part="dot"
              class="dot dot--${this.dotType} ${i === this._resolvedIndex ? 'dot--active' : ''}"
              type="button"
              aria-label="跳转到第 ${i + 1} 张幻灯片"
              aria-current=${i === this._resolvedIndex ? 'true' : 'false'}
              @click=${() => this._goTo(i, true)}
            ></button>
          `,
        )}
      </div>
    `
  }

  override render() {
    const trackClass = `track track--${this.effect}`

    return html`
      <div
        part="base"
        class="carousel"
        @mouseenter=${this._handleMouseEnter}
        @mouseleave=${this._handleMouseLeave}
        @pointerdown=${this.draggable ? this._onPointerDown : nothing}
        @pointermove=${this.draggable ? this._onPointerMove : nothing}
        @pointerup=${this.draggable ? this._onPointerUp : nothing}
      >
        <div part="track" class="${trackClass}">
          <slot @slotchange=${this._handleSlotChange}></slot>
        </div>
        ${this.showArrow && this._slideCount > 1 ? this._renderArrow('prev') : nothing}
        ${this.showArrow && this._slideCount > 1 ? this._renderArrow('next') : nothing}
        ${this._renderDots()}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-carousel': MacCarousel
    'mac-carousel-item': MacCarouselItem
  }
}
