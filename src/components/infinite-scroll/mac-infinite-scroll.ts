import { html, css, nothing } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-infinite-scroll
 * @summary 无限滚动组件，滚动到底部时触发加载更多数据。
 *
 * @slot - 默认插槽，用于列表内容。
 * @slot loading - 自定义加载指示器内容。
 * @slot finished - 没有更多数据时显示的自定义内容。
 * @slot error - 加载失败时显示的自定义内容。添加点击监听器以触发重试。
 *
 * @csspart loading - 加载状态容器。
 * @csspart finished - 完成状态容器。
 * @csspart error - 错误状态容器。
 *
 * @cssproperty --md-infinite-scroll-padding - 状态区域内边距。
 * @cssproperty --md-infinite-scroll-color - 状态文字颜色。
 * @cssproperty --md-infinite-scroll-font-size - 状态字体大小。
 * @cssproperty --md-infinite-scroll-gap - 旋转器与文字之间的间距。
 * @cssproperty --md-infinite-scroll-spinner-size - 旋转器大小。
 *
 * @event mac-load-more - 应该加载更多数据时触发。
 * @event mac-retry - 点击重试按钮时触发。
 */
@customElement('mac-infinite-scroll')
export class MacInfiniteScroll extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
        height: 100%;
        overflow: auto;
      }

      .scroll-container {
        min-height: 100%;
      }

      .sentinel {
        height: 1px;
      }

      .status {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--md-infinite-scroll-padding, var(--md-spacing-md));
        color: var(--md-infinite-scroll-color, var(--md-color-text-secondary));
        font-size: var(--md-infinite-scroll-font-size, var(--md-font-size-sm));
        gap: var(--md-infinite-scroll-gap, var(--md-spacing-sm));
      }

      .loading-spinner {
        width: var(--md-infinite-scroll-spinner-size, 16px);
        height: var(--md-infinite-scroll-spinner-size, 16px);
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      .retry-btn {
        cursor: pointer;
        color: var(--md-color-primary);
        text-decoration: underline;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ]

  /** 是否还有更多数据可加载。 */
  @property({ type: Boolean }) hasMore = true

  /** 当前是否正在加载数据。 */
  @property({ type: Boolean }) loading = false

  /** 上次加载尝试是否失败。 */
  @property({ type: Boolean }) error = false

  /** 距离底部触发加载的像素距离。 */
  @property({ type: Number }) threshold = 100

  /** 挂载后是否立即检查，当内容未填满容器时。 */
  @property({ type: Boolean, attribute: 'immediate-check' }) immediateCheck = true

  /** 是否禁用自动加载。 */
  @property({ type: Boolean }) disabled = false

  @state() private _internalLoading = false

  private _observer?: IntersectionObserver
  private _sentinelEl?: HTMLElement

  override firstUpdated() {
    this._sentinelEl = this.renderRoot.querySelector('.sentinel') as HTMLElement
    this._setupObserver()
    if (this.immediateCheck) {
      requestAnimationFrame(() => this._checkIfNeedLoad())
    }
  }

  override updated(changed: Map<string, unknown>) {
    if (
      changed.has('disabled') ||
      changed.has('hasMore') ||
      changed.has('loading') ||
      changed.has('error')
    ) {
      if (!this.disabled && this.hasMore && !this.loading && !this.error) {
        requestAnimationFrame(() => this._checkIfNeedLoad())
      }
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    this._cleanupObserver()
  }

  private _setupObserver() {
    if (!this._sentinelEl) return
    this._cleanupObserver()

    if (typeof IntersectionObserver !== 'undefined') {
      const rootMargin = `${this.threshold}px`
      this._observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry.isIntersecting) {
            this._tryLoadMore()
          }
        },
        {
          root: this,
          rootMargin: `0px 0px ${rootMargin} 0px`,
          threshold: 0,
        },
      )
      this._observer.observe(this._sentinelEl)
    } else {
      // 对于不支持 IntersectionObserver 的环境的降级处理
      this.addEventListener('scroll', this._handleScroll)
    }
  }

  private _cleanupObserver() {
    if (this._observer) {
      this._observer.disconnect()
      this._observer = undefined
    }
    this.removeEventListener('scroll', this._handleScroll)
  }

  private _handleScroll = () => {
    if (this.disabled || !this.hasMore || this.loading || this.error || this._internalLoading)
      return
    const scrollBottom = this.scrollTop + this.clientHeight
    if (scrollBottom >= this.scrollHeight - this.threshold) {
      this._tryLoadMore()
    }
  }

  private _checkIfNeedLoad() {
    if (!this.hasMore || this.loading || this.error || this.disabled || this._internalLoading)
      return
    // 如果内容未填满容器，触发加载
    if (this.scrollHeight <= this.clientHeight) {
      this._tryLoadMore()
    }
  }

  private _tryLoadMore() {
    if (!this.hasMore || this.loading || this.error || this.disabled || this._internalLoading)
      return
    this._internalLoading = true
    this.emit('mac-load-more')
    // 短暂延迟后重置内部加载状态，以防止快速重新触发
    // 如果使用者未及时设置 loading=true
    setTimeout(() => {
      this._internalLoading = false
    }, 100)
  }

  private _handleRetry() {
    this.emit('mac-retry')
  }

  override render() {
    const hasLoadingSlot = this.querySelector('[slot="loading"]') !== null
    const hasFinishedSlot = this.querySelector('[slot="finished"]') !== null
    const hasErrorSlot = this.querySelector('[slot="error"]') !== null

    return html`
      <div class="scroll-container">
        <slot></slot>
        <div class="sentinel"></div>
        ${this._renderStatus(hasLoadingSlot, hasFinishedSlot, hasErrorSlot)}
      </div>
    `
  }

  private _renderStatus(hasLoadingSlot: boolean, hasFinishedSlot: boolean, hasErrorSlot: boolean) {
    if (this.loading) {
      return html`
        <div class="status" part="loading">
          ${
            hasLoadingSlot
              ? html`<slot name="loading"></slot>`
              : html`<span class="loading-spinner"></span><span>加载中...</span>`
          }
        </div>
      `
    }

    if (this.error) {
      return html`
        <div class="status" part="error">
          ${
            hasErrorSlot
              ? html`<slot name="error"></slot>`
              : html`<span>加载失败</span
                  ><span class="retry-btn" @click=${this._handleRetry}>重试</span>`
          }
        </div>
      `
    }

    if (!this.hasMore) {
      return html`
        <div class="status" part="finished">
          ${hasFinishedSlot ? html`<slot name="finished"></slot>` : html`<span>没有更多数据</span>`}
        </div>
      `
    }

    return nothing
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-infinite-scroll': MacInfiniteScroll
  }
}
