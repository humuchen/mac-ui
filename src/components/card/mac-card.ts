import { html, css } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * @tag mac-card
 * @summary macOS 风格的卡片容器组件。
 *
 * @slot - 卡片的主体内容。
 * @slot header - 卡片的头部。
 * @slot footer - 卡片的底部。
 * @slot media - 卡片的媒体区域（顶部）。
 *
 * @csspart base - 卡片的基础容器。
 * @csspart header - 头部容器。
 * @csspart body - 主体容器。
 * @csspart footer - 底部容器。
 * @csspart media - 媒体容器。
 */
@customElement('mac-card')
export class MacCard extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
      }

      /* ════════════════════════════════════════════════════════
         卡片基础容器
         ════════════════════════════════════════════════════════ */
      .card {
        position: relative;
        background-color: var(--md-color-bg);
        border-radius: 12px;
        overflow: hidden;
        transition:
          transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1),
          box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1),
          border-color 200ms ease,
          background-color 200ms ease;
      }

      /* ════════════════════════════════════════════════════════
         变体：默认
         ════════════════════════════════════════════════════════ */
      .card--default {
        border: 1px solid rgba(0, 0, 0, 0.06);
        box-shadow:
          0 0.5px 1px rgba(0, 0, 0, 0.04),
          0 1px 2px rgba(0, 0, 0, 0.04),
          0 2px 4px rgba(0, 0, 0, 0.02);
      }

      /* ════════════════════════════════════════════════════════
         变体：悬浮
         ════════════════════════════════════════════════════════ */
      .card--elevated {
        border: none;
        box-shadow:
          0 1px 1px rgba(0, 0, 0, 0.02),
          0 2px 2px rgba(0, 0, 0, 0.02),
          0 4px 4px rgba(0, 0, 0, 0.02),
          0 8px 8px rgba(0, 0, 0, 0.02),
          0 16px 16px rgba(0, 0, 0, 0.02),
          0 0 0 1px rgba(0, 0, 0, 0.03);
      }

      /* ════════════════════════════════════════════════════════
         变体：毛玻璃
         ════════════════════════════════════════════════════════ */
      .card--glass {
        background: rgba(255, 255, 255, 0.72);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.4),
          inset 0 -1px 0 rgba(0, 0, 0, 0.02),
          0 1px 3px rgba(0, 0, 0, 0.06),
          0 8px 24px rgba(0, 0, 0, 0.08);
      }

      /* ════════════════════════════════════════════════════════
         变体：描边
         ════════════════════════════════════════════════════════ */
      .card--outlined {
        background: transparent;
        border: 1.5px solid rgba(0, 0, 0, 0.08);
        box-shadow: none;
      }

      /* ════════════════════════════════════════════════════════
         变体：渐变
         ════════════════════════════════════════════════════════ */
      .card--gradient {
        border: none;
        background: linear-gradient(
          135deg,
          rgba(0, 122, 255, 0.06) 0%,
          rgba(88, 86, 214, 0.06) 50%,
          rgba(191, 90, 242, 0.06) 100%
        );
        box-shadow:
          0 1px 2px rgba(0, 122, 255, 0.04),
          0 4px 12px rgba(0, 122, 255, 0.06),
          inset 0 1px 0 rgba(255, 255, 255, 0.6);
      }

      /* ════════════════════════════════════════════════════════
         悬停效果 - 按变体区分
         ════════════════════════════════════════════════════════ */
      .card--hoverable:hover {
        transform: translateY(-4px) scale(1.01);
      }

      .card--default.card--hoverable:hover {
        border-color: rgba(0, 122, 255, 0.2);
        box-shadow:
          0 4px 8px rgba(0, 0, 0, 0.04),
          0 8px 16px rgba(0, 0, 0, 0.04),
          0 16px 32px rgba(0, 0, 0, 0.04);
      }

      .card--elevated.card--hoverable:hover {
        box-shadow:
          0 2px 2px rgba(0, 0, 0, 0.02),
          0 4px 4px rgba(0, 0, 0, 0.02),
          0 8px 8px rgba(0, 0, 0, 0.02),
          0 16px 16px rgba(0, 0, 0, 0.02),
          0 32px 32px rgba(0, 0, 0, 0.04),
          0 0 0 1px rgba(0, 122, 255, 0.1);
      }

      .card--glass.card--hoverable:hover {
        background: rgba(255, 255, 255, 0.82);
        border-color: rgba(255, 255, 255, 0.3);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.5),
          0 4px 12px rgba(0, 0, 0, 0.08),
          0 16px 48px rgba(0, 0, 0, 0.12);
      }

      .card--outlined.card--hoverable:hover {
        border-color: var(--md-color-primary);
        border-width: 2px;
        box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
      }

      .card--gradient.card--hoverable:hover {
        background: linear-gradient(
          135deg,
          rgba(0, 122, 255, 0.1) 0%,
          rgba(88, 86, 214, 0.1) 50%,
          rgba(191, 90, 242, 0.1) 100%
        );
        box-shadow:
          0 4px 16px rgba(0, 122, 255, 0.12),
          0 8px 32px rgba(88, 86, 214, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.7);
      }

      /* ════════════════════════════════════════════════════════
         可点击 / 激活状态
         ════════════════════════════════════════════════════════ */
      .card--clickable {
        cursor: pointer;
        user-select: none;
      }

      .card--clickable:active {
        transform: translateY(0) scale(0.98);
        transition:
          transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1),
          box-shadow 120ms ease;
      }

      .card--clickable:focus-visible {
        outline: none;
        box-shadow:
          0 0 0 3px rgba(0, 122, 255, 0.2),
          0 1px 3px rgba(0, 0, 0, 0.04),
          0 4px 8px rgba(0, 0, 0, 0.02);
      }

      /* ════════════════════════════════════════════════════════
         媒体区域
         ════════════════════════════════════════════════════════ */
      .card__media {
        position: relative;
        overflow: hidden;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
      }

      .card__media::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          transparent 0%,
          transparent 50%,
          rgba(0, 0, 0, 0.02) 100%
        );
        pointer-events: none;
        z-index: 1;
      }

      .card--hoverable:hover .card__media::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(0, 122, 255, 0.04);
        pointer-events: none;
        z-index: 2;
      }

      .card__media--ratio-16-9 {
        padding-bottom: 56.25%;
      }

      .card__media--ratio-4-3 {
        padding-bottom: 75%;
      }

      .card__media--ratio-1-1 {
        padding-bottom: 100%;
      }

      .card__media-content {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 0;
      }

      .card__media-content ::slotted(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .card--hoverable:hover .card__media-content ::slotted(img) {
        transform: scale(1.03);
      }

      /* ════════════════════════════════════════════════════════
         头部区域
         ════════════════════════════════════════════════════════ */
      ::slotted([slot='header']) {
        display: block;
      }

      .card__header-wrapper {
        padding: 16px 20px 12px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.04);
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, transparent 100%);
      }

      /* ════════════════════════════════════════════════════════
         主体区域
         ════════════════════════════════════════════════════════ */
      .card__body {
        padding: 20px;
        line-height: 1.6;
        color: var(--md-color-text);
      }

      .card__body ::slotted(h1),
      .card__body ::slotted(h2),
      .card__body ::slotted(h3) {
        margin: 0 0 8px;
        font-weight: 600;
        color: var(--md-color-text);
      }

      .card__body ::slotted(p) {
        margin: 0 0 12px;
        color: var(--md-color-text-secondary);
      }

      .card__body ::slotted(p:last-child) {
        margin-bottom: 0;
      }

      /* ════════════════════════════════════════════════════════
         底部区域
         ════════════════════════════════════════════════════════ */
      ::slotted([slot='footer']) {
        display: block;
      }

      .card__footer-wrapper {
        padding: 12px 20px 16px;
        border-top: 1px solid rgba(0, 0, 0, 0.04);
        background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.01) 100%);
      }

      /* 毛玻璃变体头部/底部 */
      .card--glass .card__header-wrapper,
      .card--glass .card__footer-wrapper {
        border-color: rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.08);
      }

      /* 渐变变体头部/底部 */
      .card--gradient .card__header-wrapper {
        border-color: rgba(0, 122, 255, 0.08);
        background: rgba(255, 255, 255, 0.3);
      }

      .card--gradient .card__footer-wrapper {
        border-color: rgba(191, 90, 242, 0.08);
        background: rgba(255, 255, 255, 0.2);
      }

      /* ════════════════════════════════════════════════════════
         强调边框
         ════════════════════════════════════════════════════════ */
      .card--accent-top::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #007aff 0%, #5856d6 50%, #bf5af2 100%);
        border-radius: 12px 12px 0 0;
        z-index: 10;
      }

      .card--accent-left::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 3px;
        background: linear-gradient(180deg, #007aff 0%, #5856d6 50%, #bf5af2 100%);
        border-radius: 12px 0 0 12px;
        z-index: 10;
      }

      /* ════════════════════════════════════════════════════════
         加载状态
         ════════════════════════════════════════════════════════ */
      .card--loading {
        pointer-events: none;
      }

      .card--loading .card__body,
      .card--loading ::slotted([slot='header']),
      .card--loading ::slotted([slot='footer']) {
        position: relative;
        color: transparent !important;
      }

      .card--loading .card__body::before,
      .card--loading ::slotted([slot='header'])::before,
      .card--loading ::slotted([slot='footer'])::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          rgba(0, 0, 0, 0.02) 0%,
          rgba(0, 0, 0, 0.06) 20%,
          rgba(0, 0, 0, 0.1) 40%,
          rgba(0, 0, 0, 0.06) 60%,
          rgba(0, 0, 0, 0.02) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.8s ease-in-out infinite;
        border-radius: 6px;
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      /* ════════════════════════════════════════════════════════
         响应式设计
         ════════════════════════════════════════════════════════ */
      @media (max-width: 768px) {
        .card {
          border-radius: 10px;
        }

        .card__body {
          padding: 16px;
        }

        .card__header-wrapper {
          padding: 14px 16px 10px;
        }

        .card__footer-wrapper {
          padding: 10px 16px 14px;
        }

        .card--accent-top::before {
          height: 2.5px;
        }

        .card--accent-left::before {
          width: 2.5px;
        }

        /* 在移动端减少变换强度 */
        .card--hoverable:hover {
          transform: translateY(-2px) scale(1.005);
        }

        .card--clickable:active {
          transform: scale(0.99);
        }
      }

      @media (max-width: 480px) {
        .card__body {
          padding: 14px;
        }

        .card__header-wrapper {
          padding: 12px 14px 8px;
        }

        .card__footer-wrapper {
          padding: 8px 14px 12px;
        }
      }

      /* ════════════════════════════════════════════════════════
         暗黑模式
         ════════════════════════════════════════════════════════ */
      :host([data-theme='dark']) .card--default {
        background: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 255, 255, 0.08);
        box-shadow:
          0 1px 2px rgba(0, 0, 0, 0.2),
          0 2px 4px rgba(0, 0, 0, 0.15);
      }

      :host([data-theme='dark']) .card--elevated {
        background: rgba(255, 255, 255, 0.06);
        box-shadow:
          0 2px 2px rgba(0, 0, 0, 0.1),
          0 4px 4px rgba(0, 0, 0, 0.1),
          0 8px 8px rgba(0, 0, 0, 0.08),
          0 16px 16px rgba(0, 0, 0, 0.06),
          0 0 0 1px rgba(255, 255, 255, 0.04);
      }

      :host([data-theme='dark']) .card--glass {
        background: rgba(30, 30, 30, 0.72);
        border-color: rgba(255, 255, 255, 0.08);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.06),
          0 4px 16px rgba(0, 0, 0, 0.3);
      }

      :host([data-theme='dark']) .card--outlined {
        border-color: rgba(255, 255, 255, 0.12);
      }

      :host([data-theme='dark']) .card--gradient {
        background: linear-gradient(
          135deg,
          rgba(0, 122, 255, 0.12) 0%,
          rgba(88, 86, 214, 0.12) 50%,
          rgba(191, 90, 242, 0.12) 100%
        );
        box-shadow:
          0 2px 8px rgba(0, 122, 255, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.08);
      }

      :host([data-theme='dark']) .card--default.card--hoverable:hover {
        border-color: rgba(0, 122, 255, 0.3);
        box-shadow:
          0 4px 8px rgba(0, 0, 0, 0.25),
          0 8px 16px rgba(0, 0, 0, 0.2);
      }

      :host([data-theme='dark']) .card--elevated.card--hoverable:hover {
        box-shadow:
          0 4px 4px rgba(0, 0, 0, 0.15),
          0 8px 8px rgba(0, 0, 0, 0.12),
          0 16px 16px rgba(0, 0, 0, 0.1),
          0 32px 32px rgba(0, 0, 0, 0.08),
          0 0 0 1px rgba(0, 122, 255, 0.15);
      }

      :host([data-theme='dark']) .card--glass.card--hoverable:hover {
        background: rgba(40, 40, 40, 0.82);
        border-color: rgba(255, 255, 255, 0.12);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          0 8px 24px rgba(0, 0, 0, 0.4);
      }

      :host([data-theme='dark']) .card--outlined.card--hoverable:hover {
        border-color: var(--md-color-primary);
      }

      :host([data-theme='dark']) .card--gradient.card--hoverable:hover {
        background: linear-gradient(
          135deg,
          rgba(0, 122, 255, 0.18) 0%,
          rgba(88, 86, 214, 0.18) 50%,
          rgba(191, 90, 242, 0.18) 100%
        );
      }

      :host([data-theme='dark']) .card__header-wrapper,
      :host([data-theme='dark']) .card__footer-wrapper {
        border-color: rgba(255, 255, 255, 0.06);
        background: rgba(255, 255, 255, 0.02);
      }

      :host([data-theme='dark']) .card--glass .card__header-wrapper,
      :host([data-theme='dark']) .card--glass .card__footer-wrapper {
        border-color: rgba(255, 255, 255, 0.06);
        background: rgba(255, 255, 255, 0.04);
      }

      :host([data-theme='dark']) .card__media {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
      }

      :host([data-theme='dark']) .card--loading .card__body::before,
      :host([data-theme='dark']) .card--loading ::slotted([slot='header'])::before,
      :host([data-theme='dark']) .card--loading ::slotted([slot='footer'])::before {
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.02) 0%,
          rgba(255, 255, 255, 0.06) 20%,
          rgba(255, 255, 255, 0.1) 40%,
          rgba(255, 255, 255, 0.06) 60%,
          rgba(255, 255, 255, 0.02) 100%
        );
        background-size: 200% 100%;
      }

      :host([data-theme='dark']) .card--accent-top::before {
        background: linear-gradient(90deg, #0a84ff 0%, #5e5ce6 50%, #bf5af2 100%);
      }

      :host([data-theme='dark']) .card--accent-left::before {
        background: linear-gradient(180deg, #0a84ff 0%, #5e5ce6 50%, #bf5af2 100%);
      }

      :host([data-theme='dark']) .card--clickable:focus-visible {
        box-shadow:
          0 0 0 3px rgba(10, 132, 255, 0.3),
          0 2px 4px rgba(0, 0, 0, 0.2);
      }
    `,
  ]

  /** 卡片的视觉变体。 */
  @property({ reflect: true }) variant: 'default' | 'elevated' | 'glass' | 'outlined' | 'gradient' =
    'default'

  /** 卡片是否有悬停效果。 */
  @property({ type: Boolean, reflect: true }) hoverable = false

  /** 卡片是否可点击。 */
  @property({ type: Boolean, reflect: true }) clickable = false

  /** 显示加载状态。 */
  @property({ type: Boolean, reflect: true }) loading = false

  /** 添加强调边框。 */
  @property({ reflect: true }) accent?: 'top' | 'left'

  /** 媒体宽高比。 */
  @property({ reflect: true }) mediaRatio?: '16-9' | '4-3' | '1-1'

  override willUpdate() {
    const theme = this._resolvedTheme
    if (theme) {
      this.setAttribute('data-theme', theme)
    } else {
      this.removeAttribute('data-theme')
    }
  }

  override render() {
    const classes = [
      'card',
      `card--${this.variant}`,
      this.hoverable ? 'card--hoverable' : '',
      this.clickable ? 'card--clickable' : '',
      this.loading ? 'card--loading' : '',
      this.accent ? `card--accent-${this.accent}` : '',
    ]
      .filter(Boolean)
      .join(' ')

    return html`
      <div part="base" class=${classes}>
        <div
          part="media"
          class="card__media ${this.mediaRatio ? `card__media--ratio-${this.mediaRatio}` : ''}"
        >
          <div class="card__media-content">
            <slot name="media"></slot>
          </div>
        </div>
        <div class="card__header-wrapper" part="header">
          <slot name="header"></slot>
        </div>
        <div class="card__body" part="body">
          <slot></slot>
        </div>
        <div class="card__footer-wrapper" part="footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-card': MacCard
  }
}
