# mac-ui 代理开发规范

## 1. 项目概述

mac-ui 是一个基于 **Lit 3** 构建的 **macOS 风格 Web Components** 组件库。

- **技术栈**：Lit 3 + TypeScript + Vite + Vitest + Storybook
- **风格目标**：macOS 27（Liquid Glass 毛玻璃、圆角、细腻动画）
- **包管理器**：pnpm（必须保持 pnpm-lock.yaml 同步）
- **发布方式**：npm publish（仅发布 dist 目录）

## 2. 组件开发规范

### 2.1 文件组织

每个组件一个目录，标准文件：

```
src/components/{name}/
├── mac-{name}.ts          # 组件实现（必须）
├── mac-{name}.stories.ts  # Storybook 示例（必须）
├── mac-{name}.test.ts     # 单元测试（必须）
└── index.ts               # 导出文件（必须）
```

### 2.2 组件类规范

- **必须**继承 `BaseElement`（位于 `src/internal/base-element.ts`）
- **必须**使用 `mac-` 前缀命名标签，如 `mac-button`
- **必须**使用 `@customElement('mac-xxx')` 装饰器注册
- **必须**在 `src/mac-ui.ts` 中导出
- 属性使用 `@property()` 装饰器；需要外部 CSS 选择的属性必须加 `reflect: true`
- Boolean 属性需要自定义 converter 处理 `"false"` 字符串（参见项目已有经验）
- 事件通过 `this.emit('mac-xxx-event', { detail: {...} })` 派发（BaseElement 提供，自动 bubbles + composed）

### 2.3 CSS 与主题

- 样式数组顺序：`[themeTokens, sharedStyles, css\`...\`]`
- 组件级 CSS 变量引用主题变量作为默认值，禁止硬编码颜色
- 命名格式：`--{size}-{component}-{part}-{state}`
- 主题变量定义在 `src/styles/theme.ts`

### 2.4 JSDoc 注释

- 使用 **中文** 编写 JSDoc
- 必须包含 `@tag`、`@summary`、`@slot`、`@csspart`、`@event` 等标签
- JSDoc 会自动生成 Storybook 文档

## 3. 测试规范

- **测试框架**：Vitest + `@open-wc/testing-helpers`
- **模板文件**：参考 `src/components/button/mac-button.test.ts`
- 每个组件至少覆盖：
  1. 组件已注册（`customElements.get`）
  2. 默认属性渲染
  3. 属性绑定响应
  4. 事件触发（如有自定义事件）
- 测试文件与组件文件同目录，命名 `mac-{name}.test.ts`

## 4. 变更审查边界

以下修改**必须**同步更新测试和 Storybook：

- 新增公共属性或事件
- 修改现有属性的默认值或类型
- 修改 slot 结构或 CSS part
- 修复需要回归验证的 bug

以下修改**建议**更新测试：

- 纯 CSS 样式调整
- 内部重构不影响公共 API

## 5. 常用命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm run dev

# 构建组件库
pnpm run build

# 运行测试
pnpm run test

# 运行测试（监听模式）
pnpm run test:watch

# 代码检查
pnpm run lint
pnpm run lint:fix

# 类型检查
pnpm run type-check

# 格式化
pnpm run format
```

## 6. 注意事项

- **SVG 渲染**：Lit 中 SVG 元素必须使用 `svg` 模板标签，不能直接放在 `html` 中
- **reflect 行为**：`reflect: true` 不会自动同步默认值到 DOM，需要在 `willUpdate` 中手动处理
- **发布**：`npm publish` 已配置为仅发布 `dist` 目录，且 prepublishOnly 会执行构建
- **CI**：PR 会自动运行 type-check、lint、test 和 build
