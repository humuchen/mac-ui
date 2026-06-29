import { html, css, nothing } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-lazy-image
 * @summary 懒加载图片组件，支持占位图、错误状态、悬停动画和点击预览。
 *
 * @slot placeholder - 加载时显示的自定义占位内容。
 * @slot error - 图片加载失败时显示的自定义错误内容。
 *
 * @csspart image - 图片元素。
 * @csspart placeholder - 占位容器。
 * @csspart error - 错误容器。
 * @csspart preview-overlay - 预览遮罩容器。
 * @csspart preview-image - 预览图片元素。
 *
 * @cssproperty --md-lazy-image-object-fit - 对象适配样式。
 * @cssproperty --md-lazy-image-placeholder-bg - 占位背景颜色。
 * @cssproperty --md-lazy-image-placeholder-color - 占位图标颜色。
 * @cssproperty --md-lazy-image-placeholder-icon-size - 占位图标大小。
 * @cssproperty --md-lazy-image-error-icon-size - 错误图标大小。
 * @cssproperty --md-lazy-image-shimmer-bg - 微光动画高亮颜色。
 * @cssproperty --md-lazy-image-hover-scale - 悬停缩放变换（默认：1.05）。
 * @cssproperty --md-lazy-image-hover-duration - 悬停动画时长（默认：300ms）。
 * @cssproperty --md-lazy-image-hover-easing - 悬停动画缓动（默认：ease-out）。
 * @cssproperty --md-lazy-image-hover-filter - 悬停滤镜效果（默认：none）。
 * @cssproperty --md-lazy-image-preview-bg - 预览遮罩背景（默认：rgba(0,0,0,0.85)）。
 * @cssproperty --md-lazy-image-preview-duration - 预览打开/关闭动画时长（默认：250ms）。
 *
 * @event mac-load - 图片成功加载时触发。
 * @event mac-error - 图片加载失败时触发。
 * @event mac-preview-open - 预览遮罩打开时触发。
 * @event mac-preview-close - 预览遮罩关闭时触发。
 */
@customElement('mac-lazy-image')
export class MacLazyImage extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: inline-block;
        position: relative;
        overflow: hidden;
      }

      :host([preview-enabled]) {
        cursor: pointer;
      }

      .container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .image {
        display: block;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition:
          opacity var(--md-transition-normal),
          transform var(--md-lazy-image-hover-duration, 300ms)
            var(--md-lazy-image-hover-easing, ease-out),
          filter var(--md-lazy-image-hover-duration, 300ms)
            var(--md-lazy-image-hover-easing, ease-out);
        object-fit: var(--md-lazy-image-object-fit, cover);
      }

      .image.loaded {
        opacity: 1;
      }

      .container:hover .image.loaded {
        transform: scale(var(--md-lazy-image-hover-scale, 1.05));
        filter: var(--md-lazy-image-hover-filter, none);
      }

      .placeholder,
      .error {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--md-lazy-image-placeholder-bg, var(--md-color-bg-secondary));
        color: var(--md-lazy-image-placeholder-color, var(--md-color-text-secondary));
        transition: opacity var(--md-transition-normal);
      }

      .placeholder.hidden,
      .error.hidden {
        opacity: 0;
        pointer-events: none;
      }

      .placeholder-icon {
        width: var(--md-lazy-image-placeholder-icon-size, 32px);
        height: var(--md-lazy-image-placeholder-icon-size, 32px);
        opacity: 0.4;
      }

      .error-icon {
        width: var(--md-lazy-image-error-icon-size, 32px);
        height: var(--md-lazy-image-error-icon-size, 32px);
        opacity: 0.4;
      }

      /* 加载微光效果 */
      .placeholder.shimmer {
        background: linear-gradient(
          90deg,
          var(--md-lazy-image-placeholder-bg, var(--md-color-bg-secondary)) 25%,
          var(--md-lazy-image-shimmer-bg, rgba(255, 255, 255, 0.5)) 50%,
          var(--md-lazy-image-placeholder-bg, var(--md-color-bg-secondary)) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      /* ─── 预览遮罩层 ─── */

      .preview-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--md-lazy-image-preview-bg, rgba(0, 0, 0, 0.85));
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        opacity: 0;
        visibility: hidden;
        transition:
          opacity var(--md-lazy-image-preview-duration, 250ms) ease,
          visibility var(--md-lazy-image-preview-duration, 250ms) ease;
        cursor: zoom-out;
      }

      .preview-overlay.open {
        opacity: 1;
        visibility: visible;
      }

      .preview-image {
        max-width: 90vw;
        max-height: 90vh;
        object-fit: contain;
        border-radius: var(--md-radius-md);
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4);
        transform: scale(0.9);
        transition: transform var(--md-lazy-image-preview-duration, 250ms)
          cubic-bezier(0.16, 1, 0.3, 1);
        cursor: default;
        pointer-events: none;
        user-select: none;
        -webkit-user-drag: none;
      }

      .preview-overlay.open .preview-image {
        transform: scale(1);
      }

      .preview-close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        transition:
          background var(--md-transition-fast),
          color var(--md-transition-fast);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }

      .preview-close:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
      }

      .preview-close svg {
        width: 20px;
        height: 20px;
      }
    `,
  ]

  /** 图片源地址。 */
  @property() src = ''

  /** 图片替代文本。 */
  @property() alt = ''

  /** 图片宽度。 */
  @property() width?: string

  /** 图片高度。 */
  @property() height?: string

  /** CSS object-fit 值。 */
  @property({ attribute: 'object-fit' }) objectFit:
    'cover' | 'contain' | 'fill' | 'none' | 'scale-down' = 'cover'

  /** 加载时显示的占位图片地址。 */
  @property() placeholder?: string

  /** IntersectionObserver 的 rootMargin。 */
  @property({ attribute: 'root-margin' }) rootMargin = '0px'

  /** IntersectionObserver 的 threshold。 */
  @property({ type: Number }) threshold = 0

  /** 是否启用点击预览。 */
  @property({ type: Boolean }) preview = false

  /** 预览模式的图片地址。未设置时回退到 src。 */
  @property({ attribute: 'preview-src' }) previewSrc = ''

  @state() private _loaded = false
  @state() private _loading = false
  @state() private _error = false
  @state() private _inView = false
  @state() private _previewOpen = false
  @state() private _previewAnimating = false

  private _observer?: IntersectionObserver
  private _imgEl?: HTMLImageElement
  private _onKeydownBound = this._onKeydown.bind(this)

  override connectedCallback() {
    super.connectedCallback()
    this._setupObserver()
    this._updatePreviewAttr()
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    this._cleanupObserver()
    if (this._previewOpen) {
      this._closePreview()
    }
  }

  override willUpdate(changedProperties: Map<string, unknown>) {
    super.willUpdate(changedProperties)
    if (changedProperties.has('preview')) {
      this._updatePreviewAttr()
    }
  }

  private _updatePreviewAttr() {
    if (this.preview) {
      this.setAttribute('preview-enabled', '')
    } else {
      this.removeAttribute('preview-enabled')
    }
  }

  private _setupObserver() {
    if (this._observer) return
    this._observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          this._inView = true
          this._loadImage()
          this._cleanupObserver()
        }
      },
      {
        rootMargin: this.rootMargin,
        threshold: this.threshold,
      },
    )
    this._observer.observe(this)
  }

  private _cleanupObserver() {
    if (this._observer) {
      this._observer.disconnect()
      this._observer = undefined
    }
  }

  private _loadImage() {
    if (!this.src || this._loaded || this._loading) return

    this._loading = true
    this._error = false

    const img = new Image()
    this._imgEl = img

    img.onload = () => {
      this._loading = false
      this._loaded = true
      this._error = false
      this.emit('mac-load')
    }

    img.onerror = () => {
      this._loading = false
      this._loaded = false
      this._error = true
      this.emit('mac-error')
    }

    img.src = this.src
  }

  override render() {
    const width = this.width ?? nothing
    const height = this.height ?? nothing

    return html`
      <div
        class="container"
        style="width: ${width}; height: ${height};"
        @click=${this._onImageClick}
      >
        ${this._renderImage()} ${this._renderPlaceholder()} ${this._renderError()}
      </div>
      ${this._renderPreview()}
    `
  }

  private _onImageClick() {
    if (!this.preview || !this._loaded) return
    this._openPreview()
  }

  private _openPreview() {
    if (this._previewOpen) return
    this._previewOpen = true
    this._previewAnimating = true
    this.emit('mac-preview-open')
    document.addEventListener('keydown', this._onKeydownBound)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this._previewAnimating = false
      })
    })
  }

  private _closePreview() {
    if (!this._previewOpen) return
    this._previewAnimating = true
    requestAnimationFrame(() => {
      this._previewOpen = false
      this._previewAnimating = false
      this.emit('mac-preview-close')
      document.removeEventListener('keydown', this._onKeydownBound)
    })
  }

  private _onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this._closePreview()
    }
  }

  private _onPreviewBgClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      this._closePreview()
    }
  }

  private _renderPreview() {
    if (!this.preview) return nothing

    const previewUrl = this.previewSrc || this.src

    return html`
      <div
        part="preview-overlay"
        class="preview-overlay ${this._previewOpen ? 'open' : ''} ${
          this._previewAnimating ? 'animating' : ''
        }"
        @click=${this._onPreviewBgClick}
      >
        <img part="preview-image" class="preview-image" src=${previewUrl} alt=${this.alt} />
        <div class="preview-close" @click=${this._closePreview} title="关闭 (Esc)">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
      </div>
    `
  }

  private _renderImage() {
    if (!this._loaded) return nothing

    return html`
      <img
        part="image"
        class="image loaded"
        src=${this.src}
        alt=${this.alt}
        style="object-fit: ${this.objectFit};"
      />
    `
  }

  private _renderPlaceholder() {
    if (this._loaded || this._error) {
      return nothing
    }

    const hasPlaceholderSlot = this.querySelector('[slot="placeholder"]') !== null
    const hasPlaceholderSrc = !!this.placeholder

    return html`
      <div
        part="placeholder"
        class="placeholder ${!hasPlaceholderSlot && !hasPlaceholderSrc ? 'shimmer' : ''}"
      >
        ${
          hasPlaceholderSlot
            ? html`<slot name="placeholder"></slot>`
            : hasPlaceholderSrc
              ? html`<img
                  src=${this.placeholder!}
                  alt=""
                  style="width: 100%; height: 100%; object-fit: ${this.objectFit}; opacity: 0.6;"
                />`
              : html`
                  <svg
                    class="placeholder-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                `
        }
      </div>
    `
  }

  private _renderError() {
    if (!this._error) return nothing

    const hasErrorSlot = this.querySelector('[slot="error"]') !== null

    return html`
      <div part="error" class="error">
        ${
          hasErrorSlot
            ? html`<slot name="error"></slot>`
            : html`
                <svg
                  class="error-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
              `
        }
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-lazy-image': MacLazyImage
  }
}
