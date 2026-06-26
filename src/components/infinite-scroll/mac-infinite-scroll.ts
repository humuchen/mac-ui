import { html, css, nothing } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-infinite-scroll
 * @summary An infinite scroll component that triggers loading more data when scrolling to the bottom.
 *
 * @slot - Default slot for list content.
 * @slot loading - Custom loading indicator content.
 * @slot finished - Custom content shown when there is no more data.
 * @slot error - Custom content shown when loading fails. Add a click listener to emit retry.
 *
 * @csspart loading - The loading status container.
 * @csspart finished - The finished status container.
 * @csspart error - The error status container.
 *
 * @cssproperty --md-infinite-scroll-padding - Status area padding.
 * @cssproperty --md-infinite-scroll-color - Status text color.
 * @cssproperty --md-infinite-scroll-font-size - Status font size.
 * @cssproperty --md-infinite-scroll-gap - Gap between spinner and text.
 * @cssproperty --md-infinite-scroll-spinner-size - Spinner size.
 *
 * @event mac-load-more - Emitted when more data should be loaded.
 * @event mac-retry - Emitted when the retry button is clicked.
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

  /** Whether there is more data to load. */
  @property({ type: Boolean }) hasMore = true

  /** Whether data is currently loading. */
  @property({ type: Boolean }) loading = false

  /** Whether the last load attempt failed. */
  @property({ type: Boolean }) error = false

  /** Distance in pixels from the bottom to trigger loading. */
  @property({ type: Number }) threshold = 100

  /** Whether to check immediately after mount if content does not fill the container. */
  @property({ type: Boolean, attribute: 'immediate-check' }) immediateCheck = true

  /** Whether to disable auto-loading. */
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
      // Fallback for environments without IntersectionObserver
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
    // If content does not fill the container, trigger loading
    if (this.scrollHeight <= this.clientHeight) {
      this._tryLoadMore()
    }
  }

  private _tryLoadMore() {
    if (!this.hasMore || this.loading || this.error || this.disabled || this._internalLoading)
      return
    this._internalLoading = true
    this.emit('mac-load-more')
    // Reset internal loading after a short delay to prevent rapid re-triggering
    // if the consumer does not set loading=true promptly
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
          ${hasLoadingSlot
            ? html`<slot name="loading"></slot>`
            : html`<span class="loading-spinner"></span><span>Loading...</span>`}
        </div>
      `
    }

    if (this.error) {
      return html`
        <div class="status" part="error">
          ${hasErrorSlot
            ? html`<slot name="error"></slot>`
            : html`<span>Failed to load</span
                ><span class="retry-btn" @click=${this._handleRetry}>Retry</span>`}
        </div>
      `
    }

    if (!this.hasMore) {
      return html`
        <div class="status" part="finished">
          ${hasFinishedSlot ? html`<slot name="finished"></slot>` : html`<span>No more data</span>`}
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
