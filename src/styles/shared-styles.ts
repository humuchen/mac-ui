import { css, CSSResult } from 'lit'

export const sharedStyles: CSSResult = css`
  :host {
    box-sizing: border-box;
    /* 移动端触控优化：移除点击高亮（各组件可按需覆盖） */
    -webkit-tap-highlight-color: transparent;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: border-box;
  }

  :host([hidden]) {
    display: none !important;
  }

  /* ═══════════════════════════════════════════════════════════════
     响应式触控优化 —— 仅移动端生效，PC 端零影响
     ═══════════════════════════════════════════════════════════════ */
  @media (max-width: 768px) {
    :host {
      /* 支持刘海屏 / 异形屏安全区（配合 viewport-fit=cover） */
      --md-safe-area-top: env(safe-area-inset-top, 0px);
      --md-safe-area-bottom: env(safe-area-inset-bottom, 0px);
      --md-safe-area-left: env(safe-area-inset-left, 0px);
      --md-safe-area-right: env(safe-area-inset-right, 0px);
    }

    /* 交互元素：防止双击缩放、消除 300ms 延迟感 */
    :host([role='button']),
    :host(button),
    :host([data-touch]) {
      touch-action: manipulation;
    }
  }
`
