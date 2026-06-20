# Mac UI

A modern web component library built with [Lit](https://lit.dev/), providing framework-agnostic UI components with first-class TypeScript support.

## Features

- **Framework Agnostic** — Web Components work with React, Vue, Angular, Svelte, or vanilla JS
- **TypeScript First** — Full type declarations included
- **Theme System** — CSS custom properties for easy customization
- **Multiple Formats** — ESM, CommonJS, and UMD outputs
- **Accessible** — Built with ARIA best practices and keyboard navigation
- **Lightweight** — Tree-shakeable, only import what you need

## Installation

```bash
npm install mac-ui
# or
pnpm add mac-ui
# or
yarn add mac-ui
```

Peer dependency: `lit@^3.0.0`

## Quick Start

### Import All Components

```js
import 'mac-ui'
```

### Import Specific Components

```js
import 'mac-ui/dist/mac-ui.es.js'
```

### Use in HTML

```html
<mac-button variant="primary" size="md">Click Me</mac-button>

<mac-card hoverable>
  <div slot="header">Card Title</div>
  <p>Card content goes here.</p>
  <div slot="footer">Footer</div>
</mac-card>

<mac-input label="Email" required placeholder="you@example.com"></mac-input>
```

### Use in TypeScript

```ts
import { MacButton, MacCard, MacInput } from 'mac-ui'
```

## Components

### MacButton

A versatile button component with multiple variants and sizes.

| Property   | Type                                 | Default     | Description             |
| ---------- | ------------------------------------ | ----------- | ----------------------- |
| `variant`  | `'primary' \| 'secondary' \| 'text'` | `'primary'` | Button style variant    |
| `size`     | `'sm' \| 'md' \| 'lg'`               | `'md'`      | Button size             |
| `disabled` | `boolean`                            | `false`     | Disables the button     |
| `loading`  | `boolean`                            | `false`     | Shows a loading spinner |
| `type`     | `'button' \| 'submit' \| 'reset'`    | `'button'`  | Native button type      |

**Slots:** default (label), `prefix`, `suffix`

**Events:** `mac-click`

**CSS Parts:** `base`, `label`, `prefix`, `suffix`

```html
<mac-button variant="primary">Primary</mac-button>
<mac-button variant="secondary">Secondary</mac-button>
<mac-button variant="text">Text</mac-button>
<mac-button size="sm">Small</mac-button>
<mac-button size="lg">Large</mac-button>
<mac-button loading>Loading</mac-button>
<mac-button disabled>Disabled</mac-button>
```

### MacCard

A card container with header, body, footer, and media slots.

| Property    | Type      | Default | Description                |
| ----------- | --------- | ------- | -------------------------- |
| `hoverable` | `boolean` | `false` | Enable hover shadow effect |
| `bordered`  | `boolean` | `true`  | Show border                |

**Slots:** default (body), `header`, `footer`, `media`

**CSS Parts:** `base`, `header`, `body`, `footer`, `media`

```html
<mac-card>
  <div slot="header">Title</div>
  Body content
  <div slot="footer">Footer</div>
</mac-card>

<mac-card hoverable> Hoverable card </mac-card>
```

### MacInput

A text input with label, validation, and helper text support.

| Property      | Type                                                            | Default  | Description             |
| ------------- | --------------------------------------------------------------- | -------- | ----------------------- |
| `value`       | `string`                                                        | `''`     | Input value             |
| `placeholder` | `string`                                                        | `''`     | Placeholder text        |
| `type`        | `'text' \| 'password' \| 'email' \| 'number' \| 'tel' \| 'url'` | `'text'` | Input type              |
| `size`        | `'sm' \| 'md' \| 'lg'`                                          | `'md'`   | Input size              |
| `label`       | `string`                                                        | `''`     | Label text              |
| `required`    | `boolean`                                                       | `false`  | Show required indicator |
| `disabled`    | `boolean`                                                       | `false`  | Disable the input       |
| `readonly`    | `boolean`                                                       | `false`  | Make read-only          |
| `error`       | `boolean`                                                       | `false`  | Error state             |
| `helper-text` | `string`                                                        | `''`     | Helper text below input |
| `name`        | `string`                                                        | `''`     | Form field name         |

**Slots:** `prefix`, `suffix`

**Events:** `mac-input`, `mac-focus`, `mac-blur`

**CSS Parts:** `base`, `input`, `label`, `helper-text`

**Methods:** `focus()`, `blur()`

```html
<mac-input label="Username" placeholder="Enter username"></mac-input>
<mac-input label="Email" required error helper-text="Invalid email"></mac-input>
<mac-input label="Password" type="password" helper-text="Min 8 characters"></mac-input>
```

## Theming

All components use CSS custom properties for theming. Override these on the host element or globally:

```css
:root {
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
  --md-radius-sm: 4px;
  --md-radius-md: 6px;
  --md-radius-lg: 8px;
  --md-font-size-sm: 12px;
  --md-font-size-base: 14px;
  --md-font-size-lg: 16px;
  --md-spacing-xs: 4px;
  --md-spacing-sm: 8px;
  --md-spacing-md: 12px;
  --md-spacing-lg: 16px;
  --md-spacing-xl: 24px;
  --md-transition-fast: 150ms ease;
  --md-transition-normal: 250ms ease;
}
```

## Development

### Prerequisites

- Node.js >= 18
- pnpm

### Setup

```bash
pnpm install
```

### Available Scripts

| Command                | Description                           |
| ---------------------- | ------------------------------------- |
| `pnpm dev`             | Start dev server with demo page       |
| `pnpm build`           | Build library (types + ESM/CJS/UMD)   |
| `pnpm build:types`     | Generate TypeScript declarations only |
| `pnpm build:lib`       | Build JS bundles only                 |
| `pnpm test`            | Run tests                             |
| `pnpm test:watch`      | Run tests in watch mode               |
| `pnpm test:coverage`   | Run tests with coverage report        |
| `pnpm storybook`       | Start Storybook dev server            |
| `pnpm build-storybook` | Build static Storybook site           |
| `pnpm lint`            | Run ESLint                            |
| `pnpm lint:fix`        | Run ESLint with auto-fix              |
| `pnpm format`          | Format code with Prettier             |
| `pnpm format:check`    | Check code formatting                 |
| `pnpm type-check`      | Run TypeScript type checking          |

### Project Structure

```
src/
├── components/        # UI components
│   ├── button/        #   MacButton
│   ├── card/          #   MacCard
│   └── input/         #   MacInput
├── internal/          # Internal utilities (BaseElement)
├── styles/            # Shared styles & theme tokens
├── test/              # Test setup
├── mac-desktop-ui.ts  # Library entry point
└── vite-env.d.ts      # Asset type declarations
```

### Creating a New Component

1. Create a directory under `src/components/`
2. Extend `BaseElement` from `src/internal/base-element.ts`
3. Use `@customElement('mac-xxx')` decorator to register
4. Import and export from `src/mac-desktop-ui.ts`

```ts
import { html, css } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import { BaseElement } from '../../internal/base-element'
import { sharedStyles } from '../../styles/shared-styles'
import { themeTokens } from '../../styles/theme'

@customElement('mac-xxx')
export class MacXxx extends BaseElement {
  static override styles = [themeTokens, sharedStyles, css`...`]

  @property() value = ''

  override render() {
    return html`...`
  }
}
```

## Release

```bash
pnpm release          # patch: 0.1.0 -> 0.1.1
pnpm release:minor    # minor: 0.1.0 -> 0.2.0
pnpm release:major    # major: 0.1.0 -> 1.0.0
```

## License

MIT
