import { html, css, nothing } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-lazy-image
 * @summary A lazy-loading image component with placeholder, error states, hover animation, and click-to-preview.
 *
 * @slot placeholder - Custom placeholder content shown while loading.
 * @slot error - Custom error content shown when image fails to load.
 *
 * @csspart image - The image element.
 * @csspart placeholder - The placeholder container.
 * @csspart error - The error container.
 * @csspart preview-overlay - The preview overlay container.
 * @csspart preview-image - The preview image element.
 *
 * @cssproperty --md-lazy-image-object-fit - Object fit style.
 * @cssproperty --md-lazy-image-placeholder-bg - Placeholder background color.
 * @cssproperty --md-lazy-image-placeholder-color - Placeholder icon color.
 * @cssproperty --md-lazy-image-placeholder-icon-size - Placeholder icon size.
 * @cssproperty --md-lazy-image-error-icon-size - Error icon size.
 * @cssproperty --md-lazy-image-shimmer-bg - Shimmer animation highlight color.
 * @cssproperty --md-lazy-image-hover-scale - Hover scale transform (default: 1.05).
 * @cssproperty --md-lazy-image-hover-duration - Hover animation duration (default: 300ms).
 * @cssproperty --md-lazy-image-hover-easing - Hover animation easing (default: ease-out).
 * @cssproperty --md-lazy-image-hover-filter - Hover filter effect (default: none).
 * @cssproperty --md-lazy-image-preview-bg - Preview overlay background (default: rgba(0,0,0,0.85)).
 * @cssproperty --md-lazy-image-preview-duration - Preview open/close animation duration (default: 250ms).
 *
 * @event mac-load - Emitted when the image loads successfully.
 * @event mac-error - Emitted when the image fails to load.
 * @event mac-preview-open - Emitted when the preview overlay opens.
 * @event mac-preview-close - Emitted when the preview overlay closes.
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

      /* Loading shimmer effect */
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

      /* ─── Preview Overlay ─── */

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

  /** The image source URL. */
  @property() src = ''

  /** The image alt text. */
  @property() alt = ''

  /** The image width. */
  @property() width?: string

  /** The image height. */
  @property() height?: string

  /** The CSS object-fit value. */
  @property({ attribute: 'object-fit' }) objectFit:
    | 'cover'
    | 'contain'
    | 'fill'
    | 'none'
    | 'scale-down' = 'cover'

  /** A placeholder image URL shown while loading. */
  @property() placeholder?: string

  /** IntersectionObserver rootMargin. */
  @property({ attribute: 'root-margin' }) rootMargin = '0px'

  /** IntersectionObserver threshold. */
  @property({ type: Number }) threshold = 0

  /** Whether to enable click-to-preview. */
  @property({ type: Boolean }) preview = false

  /** The image URL for preview mode. Falls back to src if not set. */
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
        class="preview-overlay ${this._previewOpen ? 'open' : ''} ${this._previewAnimating
          ? 'animating'
          : ''}"
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
        ${hasPlaceholderSlot
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
              `}
      </div>
    `
  }

  private _renderError() {
    if (!this._error) return nothing

    const hasErrorSlot = this.querySelector('[slot="error"]') !== null

    return html`
      <div part="error" class="error">
        ${hasErrorSlot
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
            `}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-lazy-image': MacLazyImage
  }
}
