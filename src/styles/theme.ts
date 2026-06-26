import { css, CSSResult } from 'lit'

/**
 * Theme tokens following the naming convention:
 * --{size}-{component}-{part}-{state}
 *
 * size:    sm | md | lg
 * component: button | input | select | dropdown | card | dialog | dock | glass | mac | icon | tooltip | text-shadow | magnify | indicator | separator | color | spacing | radius | font | transition | opacity
 * part:    container | item | label | trigger | tag | shortcut | arrow | divider | separator | highlight | shadow | bg | border | padding | font-size
 * state:   hover | active | focus | disabled | danger | error | success | dark (optional)
 */
export const themeTokens: CSSResult = css`
  :host {
    /* ═══════════════════════════════════════════════════
       基础颜色  --{size}-color-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-color-primary: #3b82f6;
    --md-color-primary-hover: #2563eb;
    --md-color-primary-active: #1d4ed8;
    --md-color-success: #22c55e;
    --md-color-warning: #f59e0b;
    --md-color-danger: #ef4444;
    --md-color-text: #1f2937;
    --md-color-text-secondary: #6b7280;
    --md-color-border: #d1d5db;
    --md-color-bg: #ffffff;
    --md-color-bg-secondary: #f9fafb;

    /* ═══════════════════════════════════════════════════
       间距  --{size}-spacing-{part}
       ═══════════════════════════════════════════════════ */
    --md-spacing-xs: 4px;
    --md-spacing-sm: 8px;
    --md-spacing-md: 12px;
    --md-spacing-lg: 16px;
    --md-spacing-xl: 24px;
    --md-spacing-2xl: 48px;

    /* ═══════════════════════════════════════════════════
       圆角  --{size}-radius-{part}
       ═══════════════════════════════════════════════════ */
    --md-radius-sm: 4px;
    --md-radius-md: 6px;
    --md-radius-lg: 8px;
    --md-radius-dock: 18px;
    --md-radius-menu: 10px;
    --md-radius-icon: 12px;
    --md-radius-icon-lg: 14px;

    /* ═══════════════════════════════════════════════════
       字体  --{size}-font-{part}
       ═══════════════════════════════════════════════════ */
    --md-font-family:
      -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
    --md-font-size-xs: 11px;
    --md-font-size-sm: 12px;
    --md-font-size-menu: 13px;
    --md-font-size-base: 14px;
    --md-font-size-lg: 16px;
    --md-font-size-icon: 22px;
    --md-font-size-icon-lg: 24px;

    /* ═══════════════════════════════════════════════════
       过渡  --{size}-transition-{part}
       ═══════════════════════════════════════════════════ */
    --md-transition-fast: 150ms ease;
    --md-transition-normal: 250ms ease;
    --md-transition-magnify: 180ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --md-transition-menu: 80ms ease;
    --md-transition-drag: 200ms ease;

    /* ═══════════════════════════════════════════════════
       透明度  --{size}-opacity-{part}
       ═══════════════════════════════════════════════════ */
    --md-opacity-hover: 0.06;
    --md-opacity-drag: 0.3;
    --md-opacity-shortcut: 0.5;
    --md-opacity-shortcut-hover: 0.7;
    --md-opacity-indicator: 0.7;

    /* ═══════════════════════════════════════════════════
       Button 按钮  --{size}-button-{part}-{state}
       ═══════════════════════════════════════════════════ */
    /* sm */
    --sm-button-padding-vertical: var(--md-spacing-xs);
    --sm-button-padding-horizontal: var(--md-spacing-sm);
    --sm-button-font-size: var(--md-font-size-sm);
    --sm-button-gap: var(--md-spacing-xs);
    --sm-button-radius: var(--md-radius-md);

    /* md (default) */
    --md-button-padding-vertical: var(--md-spacing-sm);
    --md-button-padding-horizontal: var(--md-spacing-lg);
    --md-button-font-size: var(--md-font-size-base);
    --md-button-gap: var(--md-spacing-xs);
    --md-button-radius: var(--md-radius-md);

    /* lg */
    --lg-button-padding-vertical: var(--md-spacing-md);
    --lg-button-padding-horizontal: var(--md-spacing-xl);
    --lg-button-font-size: var(--md-font-size-lg);
    --lg-button-gap: var(--md-spacing-sm);
    --lg-button-radius: var(--md-radius-md);

    /* ═══════════════════════════════════════════════════
       Input 输入框  --{size}-input-{part}-{state}
       ═══════════════════════════════════════════════════ */
    /* sm */
    --sm-input-padding-vertical: var(--md-spacing-xs);
    --sm-input-padding-horizontal: var(--md-spacing-sm);
    --sm-input-font-size: var(--md-font-size-sm);
    --sm-input-radius: var(--md-radius-md);

    /* md (default) */
    --md-input-padding-vertical: var(--md-spacing-sm);
    --md-input-padding-horizontal: var(--md-spacing-md);
    --md-input-font-size: var(--md-font-size-base);
    --md-input-radius: var(--md-radius-md);

    /* lg */
    --lg-input-padding-vertical: var(--md-spacing-md);
    --lg-input-padding-horizontal: var(--md-spacing-lg);
    --lg-input-font-size: var(--md-font-size-lg);
    --lg-input-radius: var(--md-radius-md);

    /* ═══════════════════════════════════════════════════
       Radio 单选框  --{size}-radio-{part}-{state}
       ═══════════════════════════════════════════════════ */
    /* sm */
    --sm-radio-size: 14px;
    --sm-radio-dot-size: 6px;
    --sm-radio-gap: 6px;
    --sm-radio-font-size: var(--md-font-size-sm);

    /* md (default) */
    --md-radio-size: 18px;
    --md-radio-dot-size: 8px;
    --md-radio-gap: 8px;
    --md-radio-font-size: var(--md-font-size-base);

    /* lg */
    --lg-radio-size: 22px;
    --lg-radio-dot-size: 10px;
    --lg-radio-gap: 10px;
    --lg-radio-font-size: var(--md-font-size-lg);

    /* radio 颜色 */
    --md-radio-bg: transparent;
    --md-radio-bg-active: var(--md-color-primary);
    --md-radio-border-color: var(--md-color-border);
    --md-radio-border-hover-color: var(--md-color-text-secondary);
    --md-radio-border-active-color: var(--md-color-primary);
    --md-radio-border-active-hover-color: var(--md-color-primary-hover);
    --md-radio-dot-color: #fff;
    --md-radio-label-color: var(--md-color-text);
    --md-radio-label-hover-color: var(--md-color-text);
    --md-radio-group-gap: var(--md-spacing-md);

    /* ═══════════════════════════════════════════════════
       Checkbox 复选框  --{size}-checkbox-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-checkbox-bg: transparent;
    --md-checkbox-bg-active: var(--md-color-primary);
    --md-checkbox-border-color: var(--md-color-border);
    --md-checkbox-border-hover-color: var(--md-color-text-secondary);
    --md-checkbox-border-active-color: var(--md-color-primary);
    --md-checkbox-border-active-hover-color: var(--md-color-primary-hover);
    --md-checkbox-check-color: #fff;
    --md-checkbox-label-color: var(--md-color-text);
    --md-checkbox-label-hover-color: var(--md-color-text);
    --md-checkbox-group-gap: var(--md-spacing-md);

    /* ═══════════════════════════════════════════════════
       Select 选择器  --{size}-select-{part}-{state}
       ═══════════════════════════════════════════════════ */
    /* sm */
    --sm-select-trigger-padding-vertical: var(--md-spacing-xs);
    --sm-select-trigger-padding-horizontal: var(--md-spacing-sm);
    --sm-select-trigger-font-size: var(--md-font-size-sm);
    --sm-select-trigger-min-height: 28px;
    --sm-select-trigger-radius: var(--md-radius-md);

    /* md (default) */
    --md-select-trigger-padding-vertical: var(--md-spacing-sm);
    --md-select-trigger-padding-horizontal: var(--md-spacing-md);
    --md-select-trigger-font-size: var(--md-font-size-base);
    --md-select-trigger-min-height: 32px;
    --md-select-trigger-radius: var(--md-radius-md);

    /* lg */
    --lg-select-trigger-padding-vertical: var(--md-spacing-md);
    --lg-select-trigger-padding-horizontal: var(--md-spacing-lg);
    --lg-select-trigger-font-size: var(--md-font-size-lg);
    --lg-select-trigger-min-height: 40px;
    --lg-select-trigger-radius: var(--md-radius-md);

    /* select 状态颜色 */
    --md-select-item-hover-bg: rgba(0, 122, 255, 0.05);
    --md-select-item-selected-bg: rgba(0, 122, 255, 0.08);
    --md-select-item-focused-bg: rgba(0, 122, 255, 0.1);
    --md-select-tag-bg: rgba(0, 122, 255, 0.1);
    --md-select-tag-text: #007aff;
    --md-select-container-focus-shadow:
      0 0 0 3px rgba(0, 122, 255, 0.1), 0 2px 8px rgba(0, 122, 255, 0.08);
    --md-select-container-focus-border: rgba(0, 122, 255, 0.5);
    --md-select-container-focus-glass-shadow:
      0 0 0 3px rgba(0, 122, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.15);

    /* select 暗色模式 */
    --md-select-item-dark-hover-bg: rgba(255, 255, 255, 0.05);
    --md-select-item-dark-selected-bg: rgba(0, 122, 255, 0.15);
    --md-select-item-dark-focused-bg: rgba(255, 255, 255, 0.08);
    --md-select-tag-dark-bg: rgba(0, 122, 255, 0.2);
    --md-select-container-dark-bg: rgba(30, 30, 30, 0.95);
    --md-select-container-dark-border: rgba(255, 255, 255, 0.1);
    --md-select-container-dark-filled-bg: rgba(255, 255, 255, 0.05);
    --md-select-container-dark-glass-bg: rgba(255, 255, 255, 0.05);
    --md-select-clear-dark-bg: rgba(255, 255, 255, 0.1);
    --md-select-clear-dark-hover-bg: rgba(255, 255, 255, 0.15);

    /* ═══════════════════════════════════════════════════
       Dropdown 下拉菜单  --{size}-dropdown-{part}-{state}
       ═══════════════════════════════════════════════════ */
    /* sm */
    --sm-dropdown-item-padding-vertical: 4px;
    --sm-dropdown-item-padding-horizontal: var(--md-spacing-sm);
    --sm-dropdown-item-font-size: var(--md-font-size-sm);
    --sm-dropdown-container-padding: var(--md-spacing-xs);
    --sm-dropdown-container-radius: var(--md-radius-menu);

    /* md (default) */
    --md-dropdown-item-padding-vertical: 6px;
    --md-dropdown-item-padding-horizontal: var(--md-spacing-md);
    --md-dropdown-item-font-size: var(--md-font-size-menu);
    --md-dropdown-container-padding: var(--md-spacing-xs);
    --md-dropdown-container-radius: var(--md-radius-menu);

    /* lg */
    --lg-dropdown-item-padding-vertical: 8px;
    --lg-dropdown-item-padding-horizontal: var(--md-spacing-lg);
    --lg-dropdown-item-font-size: var(--md-font-size-base);
    --lg-dropdown-container-padding: var(--md-spacing-sm);
    --lg-dropdown-container-radius: var(--md-radius-menu);

    /* dropdown 状态颜色 */
    --md-dropdown-container-bg: rgba(246, 246, 246, 0.72);
    --md-dropdown-container-border: rgba(255, 255, 255, 0.25);
    --md-dropdown-container-shadow: 0 8px 40px rgba(0, 0, 0, 0.14), 0 2px 12px rgba(0, 0, 0, 0.08);
    --md-dropdown-item-hover-bg: rgba(0, 122, 255, 0.18);
    --md-dropdown-item-active-bg: rgba(0, 122, 255, 0.82);
    --md-dropdown-item-active-hover-bg: rgba(0, 88, 208, 0.88);
    --md-dropdown-item-active-color: #fff;
    --md-dropdown-item-color: #1d1d1f;
    --md-dropdown-item-danger-color: rgba(220, 53, 46, 0.8);
    --md-dropdown-item-danger-hover-bg: rgba(220, 53, 46, 0.15);
    --md-dropdown-item-disabled-opacity: 0.4;
    --md-dropdown-shortcut-color: #6b7280;
    --md-dropdown-arrow-color: #6b7280;
    --md-dropdown-divider-color: rgba(0, 0, 0, 0.08);

    /* dropdown 暗色模式 */
    --md-dropdown-container-dark-bg: rgba(40, 40, 40, 0.85);
    --md-dropdown-item-dark-hover-bg: rgba(255, 255, 255, 0.08);
    --md-dropdown-item-dark-active-bg: rgba(0, 122, 255, 0.82);
    --md-dropdown-item-dark-color: #e0e0e0;
    --md-dropdown-shortcut-dark-color: #8e8ea0;
    --md-dropdown-divider-dark-color: rgba(255, 255, 255, 0.08);

    /* ═══════════════════════════════════════════════════
       Card 卡片  --{size}-card-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-card-container-bg: var(--md-color-bg);
    --md-card-container-border: var(--md-color-border);
    --md-card-container-radius: var(--md-radius-lg);
    --md-card-body-padding: var(--md-spacing-lg);
    --md-card-header-padding: var(--md-spacing-lg);
    --md-card-footer-padding: var(--md-spacing-lg);
    --md-card-close-inset: var(--md-spacing-lg);
    --md-card-close-radius: var(--md-radius-sm);

    /* ═══════════════════════════════════════════════════
       Dialog 对话框  --{size}-dialog-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-dialog-min-width: 280px;
    --md-dialog-min-height: 160px;
    --md-dialog-container-radius: var(--md-radius-dock);
    --md-dialog-container-bg: var(--md-glass-menu-bg);
    --md-dialog-container-shadow: 0 22px 70px rgba(0, 0, 0, 0.28), 0 0 0 0.5px rgba(0, 0, 0, 0.12);
    --md-dialog-header-padding: 0 var(--md-spacing-md);
    --md-dialog-header-bg: rgba(255, 255, 255, 0.06);
    --md-dialog-header-border: var(--md-glass-separator);
    --md-dialog-header-height: 38px;
    --md-dialog-body-padding: var(--md-spacing-lg);
    --md-dialog-body-font-size: var(--md-font-size-base);
    --md-dialog-title-font-size: var(--md-font-size-menu);
    --md-dialog-title-color: var(--md-mac-text-primary);
    --md-dialog-title-inactive-color: rgba(29, 29, 31, 0.4);
    --md-dialog-traffic-close-bg: #ff5f57;
    --md-dialog-traffic-minimize-bg: #febc2e;
    --md-dialog-traffic-maximize-bg: #28c840;
    --md-dialog-traffic-border: rgba(0, 0, 0, 0.12);
    --md-dialog-traffic-inactive-bg: #d4d4d4;
    --md-dialog-traffic-close-stroke: #4d0000;
    --md-dialog-traffic-minimize-stroke: #995700;
    --md-dialog-traffic-maximize-stroke: #006500;
    --md-dialog-resize-border: rgba(0, 0, 0, 0.18);

    /* dialog 暗色模式 */
    --md-dialog-container-dark-bg: rgba(40, 40, 40, 0.85);
    --md-dialog-container-dark-shadow:
      0 22px 70px rgba(0, 0, 0, 0.5), 0 0 0 0.5px rgba(255, 255, 255, 0.08);
    --md-dialog-header-dark-bg: rgba(255, 255, 255, 0.04);
    --md-dialog-header-dark-border: rgba(255, 255, 255, 0.08);
    --md-dialog-title-dark-color: rgba(255, 255, 255, 0.92);
    --md-dialog-title-dark-inactive-color: rgba(255, 255, 255, 0.3);
    --md-dialog-body-dark-color: rgba(255, 255, 255, 0.88);
    --md-dialog-resize-dark-border: rgba(255, 255, 255, 0.2);

    /* ═══════════════════════════════════════════════════
       GroupButton 按钮组  --{size}-group-button-{part}-{state}
       ═══════════════════════════════════════════════════ */
    /* sm */
    --sm-group-button-item-padding-vertical: var(--md-spacing-xs);
    --sm-group-button-item-padding-horizontal: var(--md-spacing-md);
    --sm-group-button-item-font-size: var(--md-font-size-sm);
    --sm-group-button-container-radius: var(--md-radius-lg);

    /* md (default) */
    --md-group-button-item-padding-vertical: var(--md-spacing-sm);
    --md-group-button-item-padding-horizontal: var(--md-spacing-lg);
    --md-group-button-item-font-size: var(--md-font-size-menu);
    --md-group-button-container-radius: var(--md-radius-lg);

    /* lg */
    --lg-group-button-item-padding-vertical: var(--md-spacing-md);
    --lg-group-button-item-padding-horizontal: var(--md-spacing-xl);
    --lg-group-button-item-font-size: var(--md-font-size-base);
    --lg-group-button-container-radius: var(--md-radius-lg);

    /* group-button 状态颜色 */
    --md-group-button-item-color: var(--md-mac-text-primary);
    --md-group-button-item-active-color: var(--md-mac-accent);
    --md-group-button-item-selected-color: var(--md-mac-text-white);
    --md-group-button-item-selected-bg: var(--md-mac-selection-label-bg);
    --md-group-button-item-focus-outline: var(--md-mac-accent);

    /* ═══════════════════════════════════════════════════
       Dock 停靠栏  --{size}-dock-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-dock-container-padding: 4px 8px 4px;
    --md-dock-container-radius: var(--md-radius-dock);
    --md-dock-container-gap: 12px;
    --md-dock-container-bottom: 8px;
    --md-dock-container-shadow: 0 8px 40px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.08);
    --md-dock-separator-width: 1px;
    --md-dock-separator-height: 40px;
    --md-dock-separator-color: rgba(255, 255, 255, 0.18);
    --md-dock-separator-margin: 0 6px;
    --md-dock-item-hover-bg: var(--md-mac-accent-hover);
    --md-dock-item-hover-color: var(--md-mac-text-white);
    --md-dock-item-hover-shadow: 0 1px 4px rgba(0, 88, 208, 0.25);
    --md-dock-item-danger-bg: var(--md-mac-danger);
    --md-dock-item-danger-shadow: 0 1px 4px rgba(220, 53, 46, 0.25);
    --md-dock-item-danger-text: var(--md-mac-danger-text);
    --md-dock-item-danger-border: var(--md-mac-danger-border);
    --md-dock-item-danger-dropzone-bg: var(--md-mac-danger-bg);
    --md-dock-item-font-size: var(--md-font-size-lg);
    --md-dock-icon-size: 48px;
    --md-dock-icon-size-desktop: 56px;
    --md-dock-icon-wrapper-width: 80px;
    --md-dock-indicator-size: 4px;
    --md-dock-indicator-margin-top: 2px;
    --md-dock-magnify-range: 120px;
    --md-dock-magnify-scale: 1.6;
    --md-dock-magnify-threshold: 5px;

    /* ═══════════════════════════════════════════════════
       Glass 毛玻璃  --{size}-glass-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-glass-container-bg: rgba(255, 255, 255, 0.12);
    --md-glass-container-border: rgba(255, 255, 255, 0.2);
    --md-glass-highlight-top: rgba(255, 255, 255, 0.25);
    --md-glass-highlight-bottom: rgba(255, 255, 255, 0.05);
    --md-glass-menu-bg: rgba(246, 246, 246, 0.72);
    --md-glass-menu-border: rgba(255, 255, 255, 0.25);
    --md-glass-menu-highlight: rgba(255, 255, 255, 0.35);
    --md-glass-separator: rgba(0, 0, 0, 0.08);
    --md-glass-blur: 40px;
    --md-glass-saturate: 200%;

    /* ═══════════════════════════════════════════════════
       macOS 风格  --{size}-mac-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-mac-accent: #0058d0;
    --md-mac-accent-hover: rgba(0, 88, 208, 0.88);
    --md-mac-danger: rgba(220, 53, 46, 0.88);
    --md-mac-danger-bg: rgba(220, 53, 46, 0.15);
    --md-mac-danger-border: rgba(220, 53, 46, 0.4);
    --md-mac-danger-text: rgba(220, 53, 46, 0.8);
    --md-mac-selection: rgba(0, 122, 255, 0.18);
    --md-mac-selection-border: rgba(0, 122, 255, 0.35);
    --md-mac-selection-label-bg: rgba(0, 122, 255, 0.82);
    --md-mac-selection-rect-border: rgba(15, 43, 74, 0.5);
    --md-mac-selection-rect-bg: rgba(0, 122, 255, 0.08);
    --md-mac-selection-rect-inner: rgba(0, 122, 255, 0.12);
    --md-mac-text-primary: #1d1d1f;
    --md-mac-text-white: #fff;
    --md-mac-text-white-soft: rgba(255, 255, 255, 0.92);

    /* ═══════════════════════════════════════════════════
       Icon 图标  --{size}-icon-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-icon-size: 48px;
    --md-icon-size-desktop: 56px;
    --md-icon-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
    --md-icon-hover-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    --md-icon-active-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    --md-icon-drag-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
    --md-icon-ghost-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    --md-icon-desktop-drag-shadow: 0 8px 32px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.12);
    --md-icon-inset-top: rgba(255, 255, 255, 0.18);
    --md-icon-inset-bottom: rgba(0, 0, 0, 0.12);
    --md-icon-inset-top-soft: rgba(255, 255, 255, 0.15);
    --md-icon-inset-bottom-soft: rgba(0, 0, 0, 0.1);

    /* ═══════════════════════════════════════════════════
       Menu 菜单  --{size}-menu-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-menu-shadow: 0 8px 40px rgba(0, 0, 0, 0.14), 0 2px 12px rgba(0, 0, 0, 0.08);
    --md-menu-item-hover-shadow: 0 1px 4px rgba(0, 88, 208, 0.25);
    --md-menu-item-danger-hover-shadow: 0 1px 4px rgba(220, 53, 46, 0.25);

    /* ═══════════════════════════════════════════════════
       Tooltip 提示  --{size}-tooltip-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-tooltip-bg: rgba(30, 30, 30, 0.82);
    --md-tooltip-blur: 16px;
    --md-tooltip-border: rgba(255, 255, 255, 0.12);
    --md-tooltip-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
    --md-tooltip-offset: -32px;

    /* ═══════════════════════════════════════════════════
       TextEllipsis 文本省略  --{size}-ellipsis-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-ellipsis-color: var(--md-color-text);
    --md-ellipsis-expand-color: var(--md-color-primary);
    --md-ellipsis-tooltip-bg: var(--md-tooltip-bg);
    --md-ellipsis-tooltip-color: #fff;

    /* ═══════════════════════════════════════════════════
       Rating 评分  --{size}-rating-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-rating-icon-size: var(--md-icon-size-lg);
    --md-rating-gap: var(--md-spacing-xs);
    --md-rating-color-active: var(--md-color-warning);
    --md-rating-color-inactive: var(--md-color-border);
    --md-rating-color-hover: var(--md-color-warning);
    --md-rating-color-disabled: var(--md-color-border);

    /* sm */
    --sm-rating-icon-size: var(--md-icon-size-sm);
    --sm-rating-gap: 2px;

    /* lg */
    --lg-rating-icon-size: var(--md-icon-size-xl, 36px);
    --lg-rating-gap: var(--md-spacing-sm);

    /* dark */
    --md-rating-color-dark-active: #fbbf24;
    --md-rating-color-dark-inactive: #4b5563;
    --md-rating-color-dark-hover: #fcd34d;

    /* ═══════════════════════════════════════════════════
       Descriptions 描述  --{size}-descriptions-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-descriptions-container-bg: var(--md-glass-menu-bg);
    --md-descriptions-container-border: var(--md-glass-separator);
    --md-descriptions-container-radius: var(--md-radius-dock);
    --md-descriptions-container-shadow: var(--md-menu-shadow);
    --md-descriptions-header-padding: var(--md-spacing-md) var(--md-spacing-lg);
    --md-descriptions-header-border: var(--md-glass-separator);
    --md-descriptions-title-font-size: var(--md-font-size-menu);
    --md-descriptions-title-color: var(--md-color-text);
    --md-descriptions-label-color: var(--md-color-text-secondary);
    --md-descriptions-label-bg: rgba(0, 0, 0, 0.02);
    --md-descriptions-label-width: 120px;
    --md-descriptions-value-color: var(--md-color-text);
    --md-descriptions-value-bg: transparent;
    --md-descriptions-row-border: var(--md-glass-separator);
    --md-descriptions-cell-padding: var(--md-spacing-sm) var(--md-spacing-lg);

    /* sm */
    --sm-descriptions-cell-padding: var(--md-spacing-xs) var(--md-spacing-md);
    --sm-descriptions-label-width: 100px;

    /* lg */
    --lg-descriptions-cell-padding: var(--md-spacing-md) var(--md-spacing-xl);
    --lg-descriptions-label-width: 140px;

    /* dark */
    --md-descriptions-container-dark-bg: rgba(40, 40, 40, 0.85);
    --md-descriptions-container-dark-border: rgba(255, 255, 255, 0.08);
    --md-descriptions-header-dark-border: rgba(255, 255, 255, 0.08);
    --md-descriptions-title-dark-color: rgba(255, 255, 255, 0.92);
    --md-descriptions-label-dark-color: rgba(255, 255, 255, 0.55);
    --md-descriptions-label-dark-bg: rgba(255, 255, 255, 0.04);
    --md-descriptions-value-dark-color: rgba(255, 255, 255, 0.88);
    --md-descriptions-row-dark-border: rgba(255, 255, 255, 0.06);

    /* ═══════════════════════════════════════════════════
       NumberAnimation 数值动画  --{size}-number-animation-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-number-animation-font-size: var(--md-font-size-display, 48px);
    --md-number-animation-color: var(--md-color-text);
    --md-number-animation-font-weight: 600;
    --md-number-animation-font-family: var(--md-font-family);
    --md-number-animation-prefix-color: var(--md-color-text-secondary);
    --md-number-animation-suffix-color: var(--md-color-text-secondary);

    /* sm */
    --sm-number-animation-font-size: var(--md-font-size-xl, 24px);

    /* md */
    --md-number-animation-font-size-md: var(--md-font-size-display, 48px);

    /* lg */
    --lg-number-animation-font-size: var(--md-font-size-hero, 72px);

    /* dark */
    --md-number-animation-color-dark: rgba(255, 255, 255, 0.92);
    --md-number-animation-prefix-dark-color: rgba(255, 255, 255, 0.55);
    --md-number-animation-suffix-dark-color: rgba(255, 255, 255, 0.55);

    /* ═══════════════════════════════════════════════════
       TextShadow 文字阴影  --{size}-text-shadow-{part}
       ═══════════════════════════════════════════════════ */
    --md-text-shadow-label: 0 1px 4px rgba(0, 0, 0, 0.55);
    --md-text-shadow-none: none;

    /* ═══════════════════════════════════════════════════
       Tabs 标签页  --{size}-tabs-{part}-{state}
       ═══════════════════════════════════════════════════ */
    /* sm */
    --sm-tabs-item-padding-vertical: var(--md-spacing-xs);
    --sm-tabs-item-padding-horizontal: var(--md-spacing-sm);
    --sm-tabs-item-font-size: var(--md-font-size-sm);
    --sm-tabs-item-gap: 2px;
    --sm-tabs-pane-padding: var(--md-spacing-md) 0;

    /* md (default) */
    --md-tabs-item-padding-vertical: var(--md-spacing-sm);
    --md-tabs-item-padding-horizontal: var(--md-spacing-md);
    --md-tabs-item-font-size: var(--md-font-size-base);
    --md-tabs-item-gap: var(--md-spacing-xs);
    --md-tabs-pane-padding: var(--md-spacing-lg) 0;

    /* lg */
    --lg-tabs-item-padding-vertical: var(--md-spacing-md);
    --lg-tabs-item-padding-horizontal: var(--md-spacing-lg);
    --lg-tabs-item-font-size: var(--md-font-size-lg);
    --lg-tabs-item-gap: var(--md-spacing-sm);
    --lg-tabs-pane-padding: var(--md-spacing-xl) 0;

    /* tabs 状态颜色 */
    --md-tabs-item-color: var(--md-color-text-secondary);
    --md-tabs-item-hover-color: var(--md-color-text);
    --md-tabs-item-active-color: var(--md-mac-accent);
    --md-tabs-item-disabled-color: var(--md-color-text-secondary);
    --md-tabs-indicator-color: var(--md-mac-accent);
    --md-tabs-indicator-height: 2px;
    --md-tabs-indicator-radius: 1px;
    --md-tabs-close-color: var(--md-color-text-secondary);
    --md-tabs-close-hover-color: var(--md-color-text);
    --md-tabs-close-hover-bg: rgba(0, 0, 0, 0.06);
    --md-tabs-add-color: var(--md-color-text-secondary);
    --md-tabs-add-hover-color: var(--md-color-text);
    --md-tabs-add-hover-bg: rgba(0, 0, 0, 0.06);
    --md-tabs-nav-border: var(--md-glass-separator);

    /* tabs segment 类型 */
    --md-tabs-segment-bg: rgba(0, 0, 0, 0.04);
    --md-tabs-segment-item-color: var(--md-color-text-secondary);
    --md-tabs-segment-item-active-bg: var(--md-color-bg);
    --md-tabs-segment-item-active-color: var(--md-color-text);
    --md-tabs-segment-item-hover-bg: rgba(0, 0, 0, 0.04);
    --md-tabs-segment-radius: var(--md-radius-md);

    /* tabs 暗色模式 */
    --md-tabs-item-dark-color: rgba(255, 255, 255, 0.55);
    --md-tabs-item-dark-hover-color: rgba(255, 255, 255, 0.88);
    --md-tabs-item-dark-active-color: rgba(0, 122, 255, 0.9);
    --md-tabs-item-dark-disabled-color: rgba(255, 255, 255, 0.3);
    --md-tabs-indicator-dark-color: rgba(0, 122, 255, 0.9);
    --md-tabs-close-dark-color: rgba(255, 255, 255, 0.4);
    --md-tabs-close-dark-hover-color: rgba(255, 255, 255, 0.8);
    --md-tabs-close-dark-hover-bg: rgba(255, 255, 255, 0.08);
    --md-tabs-add-dark-color: rgba(255, 255, 255, 0.4);
    --md-tabs-add-dark-hover-color: rgba(255, 255, 255, 0.8);
    --md-tabs-add-dark-hover-bg: rgba(255, 255, 255, 0.08);
    --md-tabs-nav-dark-border: rgba(255, 255, 255, 0.08);
    --md-tabs-segment-dark-bg: rgba(255, 255, 255, 0.06);
    --md-tabs-segment-item-dark-color: rgba(255, 255, 255, 0.55);
    --md-tabs-segment-item-dark-active-bg: rgba(255, 255, 255, 0.12);
    --md-tabs-segment-item-dark-active-color: rgba(255, 255, 255, 0.92);
    --md-tabs-segment-item-dark-hover-bg: rgba(255, 255, 255, 0.08);

    /* ═══════════════════════════════════════════════════
       Drawer 抽屉  --md-drawer-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-drawer-bg: rgba(246, 246, 246, 0.88);
    --md-drawer-border: rgba(0, 0, 0, 0.06);
    --md-drawer-shadow: -8px 0 40px rgba(0, 0, 0, 0.1), -2px 0 12px rgba(0, 0, 0, 0.06);
    --md-drawer-header-padding: var(--md-spacing-md) var(--md-spacing-lg);
    --md-drawer-header-border: rgba(0, 0, 0, 0.06);
    --md-drawer-title-font-size: var(--md-font-size-lg);
    --md-drawer-title-color: var(--md-color-text);
    --md-drawer-body-padding: var(--md-spacing-lg);
    --md-drawer-footer-padding: var(--md-spacing-md) var(--md-spacing-lg);
    --md-drawer-footer-border: rgba(0, 0, 0, 0.06);
    --md-drawer-close-color: var(--md-color-text-secondary);
    --md-drawer-close-hover-bg: rgba(0, 0, 0, 0.06);
    --md-drawer-mask-bg: rgba(0, 0, 0, 0.3);
    --md-drawer-radius: var(--md-radius-lg);

    /* drawer 暗色模式 */
    --md-drawer-dark-bg: rgba(40, 40, 40, 0.92);
    --md-drawer-dark-border: rgba(255, 255, 255, 0.08);
    --md-drawer-dark-shadow: -8px 0 40px rgba(0, 0, 0, 0.3), -2px 0 12px rgba(0, 0, 0, 0.2);
    --md-drawer-header-dark-border: rgba(255, 255, 255, 0.06);
    --md-drawer-title-dark-color: rgba(255, 255, 255, 0.92);
    --md-drawer-footer-dark-border: rgba(255, 255, 255, 0.06);
    --md-drawer-close-dark-color: rgba(255, 255, 255, 0.55);
    --md-drawer-close-dark-hover-bg: rgba(255, 255, 255, 0.08);
    --md-drawer-mask-dark-bg: rgba(0, 0, 0, 0.5);

    /* ═══════════════════════════════════════════════════
       Popconfirm 弹出确认  --md-popconfirm-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-popconfirm-bg: rgba(246, 246, 246, 0.88);
    --md-popconfirm-border: rgba(0, 0, 0, 0.06);
    --md-popconfirm-shadow: 0 8px 40px rgba(0, 0, 0, 0.12), 0 2px 12px rgba(0, 0, 0, 0.06);
    --md-popconfirm-radius: var(--md-radius-lg);
    --md-popconfirm-padding: var(--md-spacing-lg);
    --md-popconfirm-icon-color: #f5a623;
    --md-popconfirm-title-color: var(--md-color-text);
    --md-popconfirm-title-font-size: var(--md-font-size-base);
    --md-popconfirm-desc-color: var(--md-color-text-secondary);
    --md-popconfirm-desc-font-size: var(--md-font-size-sm);
    --md-popconfirm-btn-gap: var(--md-spacing-sm);

    /* popconfirm 暗色模式 */
    --md-popconfirm-dark-bg: rgba(40, 40, 40, 0.92);
    --md-popconfirm-dark-border: rgba(255, 255, 255, 0.08);
    --md-popconfirm-dark-shadow: 0 8px 40px rgba(0, 0, 0, 0.3), 0 2px 12px rgba(0, 0, 0, 0.2);
    --md-popconfirm-title-dark-color: rgba(255, 255, 255, 0.92);
    --md-popconfirm-desc-dark-color: rgba(255, 255, 255, 0.45);

    /* ═══════════════════════════════════════════════════
       Split 面板分割  --md-split-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-split-resizer-size: 1px;
    --md-split-resizer-color: var(--md-color-border);
    --md-split-resizer-hover-color: var(--md-color-primary);
    --md-split-resizer-handle-bg: var(--md-color-bg-secondary);
    --md-split-resizer-handle-dot-color: var(--md-color-text-secondary);

    /* ═══════════════════════════════════════════════════
       LazyImage 图片懒加载  --md-lazy-image-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-lazy-image-object-fit: cover;
    --md-lazy-image-placeholder-bg: var(--md-color-bg-secondary);
    --md-lazy-image-placeholder-color: var(--md-color-text-secondary);
    --md-lazy-image-placeholder-icon-size: 32px;
    --md-lazy-image-error-icon-size: 32px;
    --md-lazy-image-shimmer-bg: rgba(255, 255, 255, 0.5);
    --md-lazy-image-hover-scale: 1.05;
    --md-lazy-image-hover-duration: 300ms;
    --md-lazy-image-hover-easing: ease-out;
    --md-lazy-image-hover-filter: none;
    --md-lazy-image-preview-bg: rgba(0, 0, 0, 0.85);
    --md-lazy-image-preview-duration: 250ms;

    /* ═══════════════════════════════════════════════════
       InfiniteScroll 无限滚动  --md-infinite-scroll-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-infinite-scroll-padding: var(--md-spacing-md);
    --md-infinite-scroll-color: var(--md-color-text-secondary);
    --md-infinite-scroll-font-size: var(--md-font-size-sm);
    --md-infinite-scroll-gap: var(--md-spacing-sm);
    --md-infinite-scroll-spinner-size: 16px;

    /* ═══════════════════════════════════════════════════
       Carousel 轮播图  --md-carousel-{part}-{state}
       ═══════════════════════════════════════════════════ */
    --md-carousel-arrow-size: 36px;
    --md-carousel-arrow-bg: rgba(255, 255, 255, 0.72);
    --md-carousel-arrow-color: var(--md-mac-text-primary);
    --md-carousel-arrow-hover-bg: rgba(255, 255, 255, 0.92);
    --md-carousel-arrow-offset: 12px;
    --md-carousel-dot-size: 8px;
    --md-carousel-dot-active-width: 20px;
    --md-carousel-dot-active-radius: 4px;
    --md-carousel-dot-bg: rgba(255, 255, 255, 0.5);
    --md-carousel-dot-hover-bg: rgba(255, 255, 255, 0.75);
    --md-carousel-dot-active-bg: rgba(255, 255, 255, 0.92);
    --md-carousel-dot-gap: 8px;
    --md-carousel-dots-offset: 16px;
    --md-carousel-line-width: 16px;
    --md-carousel-line-height: 3px;
    --md-carousel-line-radius: 2px;
    --md-carousel-line-active-width: 24px;

    /* ═══════════════════════════════════════════════════
       Tag 标签  --{size}-tag-{part}-{state}
       ═══════════════════════════════════════════════════ */
    /* sm */
    --sm-tag-padding-vertical: 1px;
    --sm-tag-padding-horizontal: 6px;
    --sm-tag-font-size: var(--md-font-size-xs);
    --sm-tag-gap: 2px;
    --sm-tag-radius: var(--md-radius-sm);
    --sm-tag-round-radius: 10px;
    --sm-tag-closable-padding-right: 4px;
    --sm-tag-close-size: 12px;

    /* md (default) */
    --md-tag-padding-vertical: 2px;
    --md-tag-padding-horizontal: 8px;
    --md-tag-font-size: var(--md-font-size-sm);
    --md-tag-gap: 4px;
    --md-tag-radius: var(--md-radius-sm);
    --md-tag-round-radius: 12px;
    --md-tag-closable-padding-right: 6px;
    --md-tag-close-size: 14px;

    /* lg */
    --lg-tag-padding-vertical: 4px;
    --lg-tag-padding-horizontal: 12px;
    --lg-tag-font-size: var(--md-font-size-base);
    --lg-tag-gap: 6px;
    --lg-tag-radius: var(--md-radius-md);
    --lg-tag-round-radius: 16px;
    --lg-tag-closable-padding-right: 8px;
    --lg-tag-close-size: 16px;

    /* tag default */
    --md-tag-default-bg: var(--md-color-bg-secondary);
    --md-tag-default-text: var(--md-color-text);
    --md-tag-default-border: var(--md-color-border);
    --md-tag-default-close-hover-bg: rgba(0, 0, 0, 0.06);
    --md-tag-default-close-hover-color: var(--md-color-text);

    /* tag primary */
    --md-tag-primary-bg: rgba(0, 122, 255, 0.1);
    --md-tag-primary-text: #007aff;
    --md-tag-primary-border: rgba(0, 122, 255, 0.2);
    --md-tag-primary-close-hover-bg: rgba(0, 122, 255, 0.15);
    --md-tag-primary-close-hover-color: #0058d0;

    /* tag success */
    --md-tag-success-bg: rgba(34, 197, 94, 0.1);
    --md-tag-success-text: #16a34a;
    --md-tag-success-border: rgba(34, 197, 94, 0.2);
    --md-tag-success-close-hover-bg: rgba(34, 197, 94, 0.15);
    --md-tag-success-close-hover-color: #15803d;

    /* tag warning */
    --md-tag-warning-bg: rgba(245, 158, 11, 0.1);
    --md-tag-warning-text: #d97706;
    --md-tag-warning-border: rgba(245, 158, 11, 0.2);
    --md-tag-warning-close-hover-bg: rgba(245, 158, 11, 0.15);
    --md-tag-warning-close-hover-color: #b45309;

    /* tag danger */
    --md-tag-danger-bg: rgba(239, 68, 68, 0.1);
    --md-tag-danger-text: #dc2626;
    --md-tag-danger-border: rgba(239, 68, 68, 0.2);
    --md-tag-danger-close-hover-bg: rgba(239, 68, 68, 0.15);
    --md-tag-danger-close-hover-color: #b91c1c;

    /* tag info */
    --md-tag-info-bg: rgba(107, 114, 128, 0.1);
    --md-tag-info-text: #4b5563;
    --md-tag-info-border: rgba(107, 114, 128, 0.2);
    --md-tag-info-close-hover-bg: rgba(107, 114, 128, 0.15);
    --md-tag-info-close-hover-color: #374151;
  }

  :host([data-theme='dark']) {
    /* 基础颜色 */
    --md-color-text: rgba(255, 255, 255, 0.92);
    --md-color-text-secondary: rgba(255, 255, 255, 0.55);
    --md-color-border: rgba(255, 255, 255, 0.1);
    --md-color-bg: rgba(30, 30, 30, 0.95);
    --md-color-bg-secondary: rgba(255, 255, 255, 0.05);

    /* Glass 毛玻璃 */
    --md-glass-menu-bg: rgba(40, 40, 40, 0.85);
    --md-glass-separator: rgba(255, 255, 255, 0.08);

    /* macOS 风格 */
    --md-mac-text-primary: rgba(255, 255, 255, 0.92);
  }
`
