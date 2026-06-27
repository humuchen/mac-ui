---
name: 'mac-web-component'
description: 'Builds macOS-style Web Components with Lit. Invoke when creating macOS UI components, portals, tooltips, text truncation, or managing CSS variables/theming.'
---

# macOS 风格 Web Component 开发技能

基于 Lit 框架构建 macOS 风格 Web Components 的完整开发指南。

---

## 一、组件创建清单

创建新组件时，按以下步骤执行：

1. **创建组件文件** `src/components/{name}/mac-{name}.ts`
2. **创建 Storybook** `src/components/{name}/mac-{name}.stories.ts`
3. **导出注册** 在 `src/mac-ui.ts` 中添加 export
4. **添加主题变量** 在 `src/styles/theme.ts` 中添加组件专用变量
5. **组件中使用主题变量** 在组件的 CSS 中使用主题变量，引用默认值，不要直接设置颜色。不要写死对应css样式，而要引用主题变量作为默认值
6. 组件功能参考naive-ui https://www.naiveui.com/zh-CN/dark/components/
7. **新增组件适配** 新增组件时，需要考虑适配 macOS 主题，以及是否需要添加新的属性或事件。如果需要，需要在组件的 Storybook 中添加对应的示例。
   移动设备上的布局应根据屏幕尺寸自动调整，确保内容完整展示且易于操作；触控交互体验优化，包括按钮大小、间距调整以适应手指操作；保证在主流移动浏览器（如Chrome、Safari、微信内置浏览器等）中的兼容性；保证PC端现有功能和样式不变，不改变其默认行为和外观；实现响应式布局时优先考虑使用CSS媒体查询、弹性布局(Flexbox)或网格布局(CSS Grid)等标准技术方案
8. **组件动画** 组件动画需要符合 macOS 主题的动画规范，包括但不限于：
   - 点击事件触发的动画效果
   - 悬停事件触发的动画效果
   - 点击事件触发的动画效果
   - 滚动事件触发的动画效果
   - 动画时长和曲线
   - 动画延迟
   - 动画循环
   - 动画填充模式
   - 动画优先从组件库中获取

---

## 二、标准组件模板

```typescript
import { html, css, nothing } from 'lit'
import { property, customElement, state } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

/**
 * macOS 风格 Web Component 模板
 * @tag 组件名称 mac-xxx
 * @summary 组件描述
 *
 * @slot - 默认插槽描述
 * @slot tooltip - Tooltip 插槽描述
 *
 * @cssproperty --md-xxx-color - 组件颜色描述
 *
 * @event mac-xxx-change - 当组件值改变时触发
 * @eventdetail value - 新值
 */
@customElement('mac-xxx')
export class MacXxx extends BaseElement {
  static override styles = [
    themeTokens,
    sharedStyles,
    css`
      :host {
        display: block;
        /* 组件级 CSS 变量，引用主题变量作为默认值 */
        --md-xxx-color: var(--md-color-text);
      }
    `,
  ]

  /** JSDoc 注释会自动出现在 Storybook 文档中 */
  @property({ type: String }) value = ''
  @property({ type: Boolean, reflect: true }) disabled = false
  @state() private _open = false

  override render() {
    return html`...`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mac-xxx': MacXxx
  }
}
```

### 关键原则

| 原则                 | 说明                                                       |
| -------------------- | ---------------------------------------------------------- |
| 继承 BaseElement     | 提供 `emit()` 方法，自动 `bubbles + composed`              |
| styles 数组          | `[themeTokens, sharedStyles, css\`...\`]` 确保主题变量可用 |
| reflect: true        | 需要外部 CSS 选择的属性必须 reflect                        |
| declare global       | 注册 HTMLElementTagNameMap 获得类型提示                    |
| JSDoc 注释(使用中文) | 属性和组件的 JSDoc 会自动出现在 Storybook                  |
| CSS 变量默认值       | 组件级变量用 `var(--md-xxx, fallback)` 引用主题变量        |

---

## 三、核心设计模式

### 3.1 Portal 模式（浮层组件必备）

**适用场景**：下拉菜单、Tooltip、Popover 等需要脱离父容器的浮层。

**方案**：将浮层 DOM 挂载到 `document.body`，使用 `position: fixed` + 高 z-index。

### 3.2 视口边界自适应

浮层显示时需检测视口边界，自动调整位置防止被截断。

### 3.3 关闭机制（三种方式）

```typescript
// 1. 点击选项关闭
private _selectItem(item) {
  if (item.disabled) return
  this._close()
  this.emit('mac-xxx-select', { detail: { value: item.value } })
}

// 2. 点击外部关闭
private _handleDocumentClick = (e: Event) => {
  if (!this._open || !this._portalEl) return
  const target = e.target as Node
  if (this._portalEl.contains(target) || this.contains(target)) return
  this._close()
}

// 3. ESC 键关闭
private _handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && this._open) { e.preventDefault(); this._close() }
}

// 生命周期注册/注销
override connectedCallback() {
  super.connectedCallback()
  document.addEventListener('mousedown', this._handleDocumentClick)
  document.addEventListener('keydown', this._handleKeyDown)
}
override disconnectedCallback() {
  super.disconnectedCallback()
  document.removeEventListener('mousedown', this._handleDocumentClick)
  document.removeEventListener('keydown', this._handleKeyDown)
  this._removePortal()
}
```

---

## 四、CSS 变量主题管理

### 4.1 变量分层

```
theme.ts (:host)
├── 基础层（通用，无组件名）
│   ├── 颜色       --md-color-*
│   ├── 间距       --md-spacing-*
│   ├── 圆角       --md-radius-*
│   ├── 字体       --md-font-*
│   ├── 过渡       --md-transition-*
│   ├── 透明度     --md-opacity-*
│   ├── 阴影       --md-shadow-*
│   ├── 毛玻璃     --md-glass-*
│   ├── macOS 风格 --md-mac-*
│   ├── 图标       --md-icon-*
│   ├── 提示       --md-tooltip-*
│   └── 菜单       --md-menu-*
│
└── 组件层（遵循 --{size}-{component}-{part}-{state}）
    ├── Button       --{sm|md|lg}-button-{part}*
    ├── Input        --{sm|md|lg}-input-{part}*
    ├── Select       --{sm|md|lg}-select-{part}-{state}*
    ├── Dropdown     --{sm|md|lg}-dropdown-{part}-{state}*
    ├── Card         --md-card-{part}*
    ├── Dialog       --md-dialog-{part}*
    ├── GroupButton  --{sm|md|lg}-group-button-{part}-{state}*
    ├── Dock         --md-dock-{part}-{state}*
    └── TextEllipsis --md-ellipsis-{part}-{state}*
```

### 4.2 命名规范

**核心格式**：`--{尺寸}-{组件名}-{部位}-{状态}`

| 占位符   | 说明                 | 示例                                               |
| -------- | -------------------- | -------------------------------------------------- |
| {尺寸}   | 组件规格大小         | `sm` / `md` / `lg`                                 |
| {组件名} | 组件标准名称         | `button` / `dropdown` / `select`                   |
| {部位}   | 组件内部具体结构部分 | `container` / `item` / `trigger` / `label`         |
| {状态}   | 交互状态（可选）     | `hover` / `active` / `focus` / `disabled` / `dark` |

**命名规则**：

```
--{size}-{component}-{part}-{state}

尺寸变量（按 size 分组）:
  --sm-button-padding-vertical       # 小号按钮纵向内边距
  --md-button-padding-vertical       # 中号按钮纵向内边距（默认）
  --lg-button-padding-vertical       # 大号按钮纵向内边距

状态变量（按 part + state 分组）:
  --md-dropdown-container-bg              # 容器背景
  --md-dropdown-container-border          # 容器边框
  --md-dropdown-container-shadow          # 容器阴影
  --md-dropdown-item-color                # 项目文字颜色
  --md-dropdown-item-hover-bg             # 项目悬停背景
  --md-dropdown-item-active-bg            # 项目选中背景
  --md-dropdown-item-active-color         # 项目选中文字颜色
  --md-dropdown-item-disabled-opacity     # 项目禁用透明度
  --md-dropdown-shortcut-color            # 快捷键颜色
  --md-dropdown-divider-color             # 分割线颜色

暗色模式（state 为 dark）:
  --md-dropdown-container-dark-bg         # 容器暗色背景
  --md-dropdown-item-dark-hover-bg        # 项目暗色悬停背景
  --md-dropdown-item-dark-active-bg       # 项目暗色选中背景
  --md-dropdown-item-dark-color           # 项目暗色文字颜色
  --md-dropdown-shortcut-dark-color       # 快捷键暗色颜色
  --md-dropdown-divider-dark-color        # 分割线暗色颜色
```

**部位(part)常用词**：

| 部位      | 说明        | 示例变量                                |
| --------- | ----------- | --------------------------------------- |
| container | 容器/外壳   | `--md-dropdown-container-bg`            |
| item      | 列表项/选项 | `--md-dropdown-item-hover-bg`           |
| trigger   | 触发器      | `--md-select-trigger-padding-vertical`  |
| tag       | 标签        | `--md-select-tag-bg`                    |
| shortcut  | 快捷键      | `--md-dropdown-shortcut-color`          |
| arrow     | 箭头        | `--md-dropdown-arrow-color`             |
| divider   | 分割线      | `--md-dropdown-divider-color`           |
| label     | 标签文字    | `--md-group-button-item-selected-color` |
| body      | 内容区域    | `--md-dialog-body-padding`              |
| header    | 头部区域    | `--md-dialog-header-padding`            |
| footer    | 底部区域    | `--md-card-footer-padding`              |
| separator | 分隔符      | `--md-dock-separator-color`             |
| indicator | 指示器      | `--md-dock-indicator-size`              |

**基础层变量**（不属于任何组件，保持通用命名）：

```
--md-color-*        # 基础颜色
--md-spacing-*      # 间距
--md-radius-*       # 圆角
--md-font-*         # 字体
--md-transition-*   # 过渡
--md-opacity-*      # 透明度
--md-shadow-*       # 阴影
--md-glass-*        # 毛玻璃
--md-mac-*          # macOS 风格
--md-icon-*         # 图标
--md-tooltip-*      # 提示
--md-menu-*         # 菜单
```

### 4.3 硬编码替换原则

| 保留硬编码                       | 替换为变量           |
| -------------------------------- | -------------------- |
| 通用阴影透明度 `rgba(0,0,0,...)` | 主题色相关颜色       |
| 布局固定尺寸 `width: 18px`       | 间距、圆角、字号变量 |
| 动画参数                         | 过渡时间变量         |

### 4.4 组件内 CSS 变量默认值

组件样式内定义变量，引用主题变量作为默认值，用户可覆盖：

```css
:host {
  --md-ellipsis-color: var(--md-color-text);
  --md-ellipsis-expand-color: var(--md-color-primary);
}
```

---

## 五、macOS 视觉风格

### 5.1 Liquid Glass 毛玻璃

```css
background: rgba(246, 246, 246, 0.72);
backdrop-filter: blur(40px) saturate(200%);
-webkit-backdrop-filter: blur(40px) saturate(200%);
border: 1px solid rgba(255, 255, 255, 0.25);
border-radius: 10px;
box-shadow:
  0 8px 40px rgba(0, 0, 0, 0.14),
  0 2px 12px rgba(0, 0, 0, 0.08);
```

### 5.2 交互状态

```css
/* 悬停 */
background: rgba(0, 122, 255, 0.18);
/* 选中 */
background: rgba(0, 122, 255, 0.82);
color: #fff;
/* 危险 */
color: rgba(220, 53, 46, 0.8);
background: rgba(220, 53, 46, 0.15);
/* 禁用 */
opacity: 0.4;
cursor: not-allowed;
```

### 5.3 动画

```css
/* 入场 */
transform: scale(0.96) translateY(-4px) → scale(1) translateY(0) /* 曲线 */
  cubic-bezier(0.4, 0, 0.2, 1) /* 时长 */ 150ms（快速）/ 250ms（正常）;
```

---

## 六、Storybook 规范

```typescript
import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-xxx'

const meta: Meta = {
  title: 'Components/Xxx',
  component: 'mac-xxx',
  tags: ['autodocs'],
  argTypes: {
    // 属性控制配置
    lineClamp: {
      control: 'number',
      description: 'Maximum lines',
      table: { defaultValue: { summary: '3' } },
    },
    expandTrigger: {
      control: 'select',
      options: ['none', 'click'],
      description: 'Expand trigger mode',
      table: { defaultValue: { summary: 'none' } },
    },
  },
  args: {
    lineClamp: 3,
    expandTrigger: 'none',
  },
}
export default meta
type Story = StoryObj

export const Basic: Story = {
  render: (args) => html`
    <mac-xxx .lineClamp=${args.lineClamp} expand-trigger=${args.expandTrigger}>
      Content here
    </mac-xxx>
  `,
}
```

Story 命名规范：`Basic` → `WithXxx` → `XxxFeature`（如 `ClickToExpand`、`WithTooltip`）

---

## 七、文件结构

```
src/components/{component-name}/
├── mac-{component-name}.ts          # 组件实现
└── mac-{component-name}.stories.ts  # Storybook stories

src/styles/
├── theme.ts          # 主题变量定义（:host）
└── shared-styles.ts  # 共享样式（box-sizing、hidden）

src/mac-ui.ts         # 主导出文件
index.html            # Demo 页面
```

### 导出注册

```typescript
// src/mac-ui.ts
export { MacXxx } from './components/xxx/mac-xxx'
export type { XxxItem } from './components/xxx/mac-xxx' // 如有导出类型
```

---

## 八、现有组件速查

| 组件         | 标签名              | 核心特性                             |
| ------------ | ------------------- | ------------------------------------ |
| Button       | `mac-button`        | 变体、尺寸、加载态                   |
| Card         | `mac-card`          | Liquid Glass 风格                    |
| Input        | `mac-input`         | 验证、前后缀、密码切换               |
| Select       | `mac-select`        | 多选、搜索、分组                     |
| Dropdown     | `mac-dropdown`      | Portal、右键菜单、子菜单、hover 展开 |
| TextEllipsis | `mac-text-ellipsis` | 行数限制、点击展开、Tooltip slot     |
| Desktop      | `mac-desktop`       | 壁纸、图标网格                       |
| DesktopIcon  | `mac-desktop-icon`  | 拖拽、重命名                         |
| Dock         | `mac-dock`          | 放大效果、拖拽排序                   |
| DockItem     | `mac-dock-item`     | 指示器、Tooltip                      |
| Dialog       | `mac-dialog`        | 模态、动画                           |
| GroupButton  | `mac-group-button`  | 按钮组、选中态                       |
