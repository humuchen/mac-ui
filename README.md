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

### MacConfigProvider

A configuration provider that passes theme and size settings to all child components.

| Property | Type                   | Default   | Description                       |
| -------- | ---------------------- | --------- | --------------------------------- |
| `theme`  | `'light' \| 'dark'`    | `'light'` | Global theme for child components |
| `size`   | `'sm' \| 'md' \| 'lg'` | `'md'`    | Global size for child components  |

**Slots:** default (child components)

```html
<mac-config-provider theme="dark" size="lg">
  <mac-button>Large Dark Button</mac-button>
  <mac-input label="Name"></mac-input>
</mac-config-provider>
```

### MacLazyImage

A lazy-loading image component with placeholder, error states, hover animation, and click-to-preview.

| Property      | Type                                                       | Default   | Description                     |
| ------------- | ---------------------------------------------------------- | --------- | ------------------------------- |
| `src`         | `string`                                                   | `''`      | Image source URL                |
| `alt`         | `string`                                                   | `''`      | Image alt text                  |
| `width`       | `string`                                                   | —         | Image width                     |
| `height`      | `string`                                                   | —         | Image height                    |
| `object-fit`  | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` | CSS object-fit value            |
| `placeholder` | `string`                                                   | —         | Placeholder image URL           |
| `root-margin` | `string`                                                   | `'0px'`   | IntersectionObserver rootMargin |
| `threshold`   | `number`                                                   | `0`       | IntersectionObserver threshold  |
| `preview`     | `boolean`                                                  | `false`   | Enable click-to-preview         |
| `preview-src` | `string`                                                   | `''`      | Custom preview image URL        |

**Slots:** `placeholder`, `error`

**Events:** `mac-load`, `mac-error`, `mac-preview-open`, `mac-preview-close`

**CSS Parts:** `image`, `placeholder`, `error`, `preview-overlay`, `preview-image`

**CSS Properties:** `--md-lazy-image-hover-scale`, `--md-lazy-image-hover-duration`, `--md-lazy-image-hover-easing`, `--md-lazy-image-hover-filter`, `--md-lazy-image-preview-bg`, `--md-lazy-image-preview-duration`

```html
<mac-lazy-image src="photo.jpg" alt="Photo" width="400px" height="300px"></mac-lazy-image>

<mac-lazy-image
  src="thumb.jpg"
  preview
  preview-src="full.jpg"
  width="200px"
  height="150px"
></mac-lazy-image>

<mac-lazy-image
  src="photo.jpg"
  width="300px"
  height="200px"
  style="--md-lazy-image-hover-scale: 1.1;"
></mac-lazy-image>
```

### MacDialog

A macOS-style dialog/window with title bar, drag, and resize support.

| Property      | Type      | Default | Description                   |
| ------------- | --------- | ------- | ----------------------------- |
| `title`       | `string`  | `''`    | Dialog title                  |
| `x`           | `number`  | `100`   | Left position (px)            |
| `y`           | `number`  | `100`   | Top position (px)             |
| `width`       | `number`  | `480`   | Dialog width (px)             |
| `height`      | `number`  | `360`   | Dialog height (px)            |
| `active`      | `boolean` | `true`  | Whether the dialog is focused |
| `draggable`   | `boolean` | `true`  | Enable dragging               |
| `resizable`   | `boolean` | `true`  | Enable resizing               |
| `showButtons` | `boolean` | `true`  | Show traffic light buttons    |
| `minWidth`    | `number`  | `280`   | Minimum width for resize      |
| `minHeight`   | `number`  | `160`   | Minimum height for resize     |

**Slots:** default (body), `titlebar`

**Events:** `mac-dialog-close`, `mac-dialog-minimize`, `mac-dialog-maximize`, `mac-dialog-move`, `mac-dialog-resize`

**CSS Parts:** `base`, `titlebar`, `title`, `body`, `resize-handle`

```html
<mac-dialog title="Settings" x="200" y="150" width="500" height="400">
  <p>Dialog content here.</p>
</mac-dialog>
```

### MacDrawer

A macOS-style drawer that slides in from the edge of the viewport.

| Property        | Type                                     | Default   | Description                |
| --------------- | ---------------------------------------- | --------- | -------------------------- |
| `open`          | `boolean`                                | `false`   | Whether the drawer is open |
| `placement`     | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` | Slide-in direction         |
| `title`         | `string`                                 | `''`      | Drawer title               |
| `width`         | `string`                                 | `'360px'` | Drawer width               |
| `height`        | `string`                                 | `'360px'` | Drawer height              |
| `closable`      | `boolean`                                | `true`    | Show close button          |
| `mask-closable` | `boolean`                                | `true`    | Click mask to close        |
| `show-mask`     | `boolean \| 'transparent'`               | `true`    | Show overlay mask          |
| `close-on-esc`  | `boolean`                                | `true`    | Close on Escape key        |
| `resizable`     | `boolean`                                | `false`   | Enable resizing            |
| `min-width`     | `string`                                 | `'200px'` | Minimum width              |
| `max-width`     | `string`                                 | `'80vw'`  | Maximum width              |
| `min-height`    | `string`                                 | `'200px'` | Minimum height             |
| `max-height`    | `string`                                 | `'80vh'`  | Maximum height             |

**Slots:** default (content), `header`, `footer`

**Events:** `mac-drawer-open`, `mac-drawer-close`, `mac-drawer-after-open`, `mac-drawer-after-close`

```html
<mac-drawer title="Notifications" placement="right" .open="${true}">
  <p>Notification list here.</p>
  <div slot="footer">
    <mac-button>Mark all read</mac-button>
  </div>
</mac-drawer>
```

### MacDock

A macOS-style dock with Liquid Glass background, magnification effect, and drag-to-remove.

| Property        | Type                            | Default    | Description                  |
| --------------- | ------------------------------- | ---------- | ---------------------------- |
| `magnification` | `number`                        | `1.6`      | Magnification scale on hover |
| `iconSize`      | `number`                        | `48`       | Base icon size (px)          |
| `magnifyRange`  | `number`                        | `120`      | Magnification range (px)     |
| `position`      | `'bottom' \| 'left' \| 'right'` | `'bottom'` | Dock position                |

**Slots:** default (mac-dock-item elements), `separator`

**Events:** `mac-dock-item-click`, `mac-dock-item-remove`

**CSS Parts:** `base`, `glass`, `items`

### MacDockItem

A dock item with icon, label, and bounce animation.

| Property   | Type      | Default     | Description                   |
| ---------- | --------- | ----------- | ----------------------------- |
| `itemId`   | `string`  | `''`        | Unique item identifier        |
| `label`    | `string`  | `''`        | Tooltip label                 |
| `color`    | `string`  | `'#007AFF'` | Default icon background color |
| `running`  | `boolean` | `false`     | Show running indicator dot    |
| `bouncing` | `boolean` | `false`     | Trigger bounce animation      |

**Slots:** default (icon content)

**Events:** `mac-dock-item-click`

**CSS Parts:** `base`, `icon`, `label`, `indicator`

```html
<mac-dock>
  <mac-dock-item item-id="finder" label="Finder" color="#007AFF">
    <img src="finder-icon.svg" />
  </mac-dock-item>
  <mac-dock-item item-id="safari" label="Safari" color="#34C759" running>
    <img src="safari-icon.svg" />
  </mac-dock-item>
</mac-dock>
```

### MacDesktop

A macOS-style desktop container with icon layout, drag management, and integrated dock.

| Property    | Type                         | Default      | Description                   |
| ----------- | ---------------------------- | ------------ | ----------------------------- |
| `layout`    | `'vertical' \| 'horizontal'` | `'vertical'` | Icon layout direction         |
| `cellSize`  | `number`                     | `90`         | Grid cell size (px)           |
| `spacing`   | `number`                     | `8`          | Spacing between icons (px)    |
| `padding`   | `number`                     | `16`         | Padding around icon area (px) |
| `wallpaper` | `string`                     | `''`         | Wallpaper image URL           |
| `showDock`  | `boolean`                    | `true`       | Show dock area                |

**Slots:** default (mac-desktop-icon elements), `wallpaper`, `dock`

**Events:** `mac-layout-change`, `mac-icons-reorder`

**CSS Parts:** `base`, `wallpaper`, `dock`

### MacDesktopIcon

A desktop icon with selection state.

| Property   | Type      | Default | Description            |
| ---------- | --------- | ------- | ---------------------- |
| `iconId`   | `string`  | auto    | Unique icon identifier |
| `label`    | `string`  | `''`    | Icon label text        |
| `selected` | `boolean` | `false` | Selection state        |
| `dragging` | `boolean` | `false` | Dragging state         |

**Slots:** default (icon content)

**Events:** `mac-icon-dblclick`

**CSS Parts:** `base`, `icon`, `label`

```html
<mac-desktop wallpaper="bg.jpg">
  <mac-desktop-icon icon-id="app1" label="My App">
    <img src="app-icon.svg" />
  </mac-desktop-icon>
</mac-desktop>
```

### MacDropdown

A dropdown menu component with macOS-style design.

| Property        | Type                                                         | Default          | Description              |
| --------------- | ------------------------------------------------------------ | ---------------- | ------------------------ |
| `items`         | `DropdownItem[]`                                             | `[]`             | Menu items               |
| `placement`     | `'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom-start'` | Menu placement           |
| `value`         | `string`                                                     | `''`             | Currently selected value |
| `disabled`      | `boolean`                                                    | `false`          | Disable the dropdown     |
| `open-on-hover` | `boolean`                                                    | `false`          | Open on hover            |
| `hover-delay`   | `number`                                                     | `150`            | Hover delay (ms)         |
| `trigger`       | `'click' \| 'contextmenu' \| 'both'`                         | `'click'`        | Trigger mode             |

**Slots:** `trigger`

**CSS Parts:** `base`, `menu`, `item`

```html
<mac-dropdown .items=${[
  { value: 'copy', label: 'Copy' },
  { value: 'paste', label: 'Paste' },
  { value: 'delete', label: 'Delete', danger: true }
]}>
  <mac-button slot="trigger">Menu</mac-button>
</mac-dropdown>
```

### MacSelect

A select dropdown component with macOS-style design.

| Property      | Type                               | Default              | Description              |
| ------------- | ---------------------------------- | -------------------- | ------------------------ |
| `value`       | `string \| string[]`               | `''`                 | Selected value(s)        |
| `placeholder` | `string`                           | `'Select an option'` | Placeholder text         |
| `options`     | `SelectOption[]`                   | `[]`                 | Options list             |
| `groups`      | `OptionGroup[]`                    | `[]`                 | Grouped options          |
| `size`        | `'sm' \| 'md' \| 'lg'`             | —                    | Component size           |
| `variant`     | `'default' \| 'filled' \| 'glass'` | `'default'`          | Visual variant           |
| `label`       | `string`                           | `''`                 | Label text               |
| `required`    | `boolean`                          | `false`              | Required indicator       |
| `disabled`    | `boolean`                          | `false`              | Disable the select       |
| `error`       | `boolean`                          | `false`              | Error state              |
| `success`     | `boolean`                          | `false`              | Success state            |
| `helper-text` | `string`                           | `''`                 | Helper text below input  |
| `multiple`    | `boolean`                          | `false`              | Allow multiple selection |
| `clearable`   | `boolean`                          | `false`              | Show clear button        |
| `searchable`  | `boolean`                          | `false`              | Enable search/filter     |

**Events:** `mac-change`, `mac-focus`, `mac-blur`

**CSS Parts:** `base`, `trigger`, `dropdown`, `option`

```html
<mac-select label="Country" placeholder="Select a country" .options=${[
  { value: 'us', label: 'United States' },
  { value: 'cn', label: 'China' },
  { value: 'jp', label: 'Japan' }
]}></mac-select>
```

### MacGroupButton

A macOS-style segmented control component.

| Property   | Type                   | Default | Description         |
| ---------- | ---------------------- | ------- | ------------------- |
| `items`    | `GroupButtonItem[]`    | `[]`    | Button items        |
| `value`    | `string`               | `''`    | Selected value      |
| `size`     | `'sm' \| 'md' \| 'lg'` | —       | Component size      |
| `disabled` | `boolean`              | `false` | Disable the control |

**Events:** `mac-change`

**CSS Parts:** `container`, `slider`, `button`

```html
<mac-group-button .items=${[
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' }
]} value="day"></mac-group-button>
```

### MacTabs

A macOS-style tabs component with animated indicator.

| Property        | Type                            | Default   | Description                                |
| --------------- | ------------------------------- | --------- | ------------------------------------------ |
| `type`          | `'line' \| 'card' \| 'segment'` | `'line'`  | Tabs style                                 |
| `size`          | `'sm' \| 'md' \| 'lg'`          | —         | Component size                             |
| `value`         | `string`                        | `''`      | Active tab key                             |
| `default-value` | `string`                        | `''`      | Default active tab key                     |
| `closable`      | `boolean`                       | `false`   | Show close button on tabs                  |
| `addable`       | `boolean`                       | `false`   | Show add button                            |
| `animated`      | `boolean`                       | `true`    | Enable indicator animation                 |
| `trigger`       | `'click' \| 'hover'`            | `'click'` | Tab switching trigger                      |
| `items`         | `TabItem[]`                     | `[]`      | Tab items (key, label, disabled, closable) |

**Slots:** default (mac-tab-pane elements), `prefix`, `suffix`

**Events:** `mac-tabs-change`, `mac-tabs-close`, `mac-tabs-add`

```html
<mac-tabs .items=${[
  { key: 'general', label: 'General' },
  { key: 'security', label: 'Security' },
  { key: 'about', label: 'About' }
]} value="general">
  <mac-tab-pane tab-key="general">General settings</mac-tab-pane>
  <mac-tab-pane tab-key="security">Security settings</mac-tab-pane>
</mac-tabs>
```

### MacRating

A rating component with customizable icons.

| Property     | Type                                                  | Default  | Description             |
| ------------ | ----------------------------------------------------- | -------- | ----------------------- |
| `value`      | `number`                                              | `0`      | Current rating value    |
| `max`        | `number`                                              | `5`      | Maximum rating          |
| `allow-half` | `boolean`                                             | `false`  | Allow half-star ratings |
| `readonly`   | `boolean`                                             | `false`  | Read-only mode          |
| `disabled`   | `boolean`                                             | `false`  | Disable interaction     |
| `show-value` | `boolean`                                             | `false`  | Show numeric value      |
| `icon`       | `'star' \| 'heart' \| 'circle' \| 'flame' \| 'thumb'` | `'star'` | Icon shape              |

**Slots:** `icon-empty`, `icon-half`, `icon-full`

**Events:** `mac-rating-change`

**CSS Properties:** `--md-rating-icon-size`, `--md-rating-gap`, `--md-rating-color-active`, `--md-rating-color-inactive`

```html
<mac-rating value="4" max="5"></mac-rating>
<mac-rating value="3.5" allow-half readonly></mac-rating>
```

### MacTextEllipsis

A text ellipsis component with line clamping, click-to-expand, and tooltip.

| Property         | Type                | Default  | Description                 |
| ---------------- | ------------------- | -------- | --------------------------- |
| `line-clamp`     | `number`            | `3`      | Number of lines to show     |
| `expand-trigger` | `'click' \| 'none'` | `'none'` | Trigger for expand/collapse |
| `expanded`       | `boolean`           | `false`  | Whether text is expanded    |
| `tooltip`        | `boolean`           | `false`  | Show tooltip on hover       |

**Slots:** default (text content), `tooltip`

**Events:** `mac-ellipsis-expand`

**CSS Properties:** `--md-ellipsis-color`, `--md-ellipsis-expand-color`, `--md-ellipsis-tooltip-bg`

```html
<mac-text-ellipsis line-clamp="2" expand-trigger="click" tooltip>
  This is a very long text that will be truncated after two lines...
</mac-text-ellipsis>
```

### MacNumberAnimation

A number animation component that smoothly transitions between numeric values.

| Property    | Type                                               | Default     | Description             |
| ----------- | -------------------------------------------------- | ----------- | ----------------------- |
| `to`        | `number`                                           | `0`         | Target value            |
| `from`      | `number`                                           | `0`         | Starting value          |
| `duration`  | `number`                                           | `2000`      | Animation duration (ms) |
| `precision` | `number`                                           | `0`         | Decimal places          |
| `separator` | `string`                                           | `''`        | Thousands separator     |
| `easing`    | `'linear' \| 'easeIn' \| 'easeOut' \| 'easeInOut'` | `'easeOut'` | Easing function         |
| `autoplay`  | `boolean`                                          | `true`      | Auto-start animation    |
| `prefix`    | `string`                                           | `''`        | Text before number      |
| `suffix`    | `string`                                           | `''`        | Text after number       |
| `size`      | `'sm' \| 'md' \| 'lg'`                             | —           | Component size          |

**Slots:** `prefix`, `suffix`

**Events:** `mac-number-animation-start`, `mac-number-animation-finish`

**CSS Properties:** `--md-number-animation-font-size`, `--md-number-animation-color`, `--md-number-animation-font-weight`

```html
<mac-number-animation
  from="0"
  to="10000"
  duration="2000"
  separator=","
  prefix="$"
></mac-number-animation>
```

### MacPopconfirm

A popover confirmation component.

| Property       | Type                                         | Default   | Description                     |
| -------------- | -------------------------------------------- | --------- | ------------------------------- |
| `title`        | `string`                                     | `''`      | Confirmation title              |
| `description`  | `string`                                     | `''`      | Confirmation description        |
| `confirm-text` | `string`                                     | `'确认'`  | Confirm button text             |
| `cancel-text`  | `string`                                     | `'取消'`  | Cancel button text              |
| `danger`       | `boolean`                                    | `false`   | Danger style for confirm button |
| `show-icon`    | `boolean`                                    | `true`    | Show warning icon               |
| `placement`    | `'top' \| 'top-start' \| ... \| 'right-end'` | `'top'`   | Popover placement               |
| `trigger`      | `'click' \| 'hover'`                         | `'click'` | Trigger mode                    |
| `disabled`     | `boolean`                                    | `false`   | Disable the popconfirm          |
| `width`        | `string`                                     | `'240px'` | Popover width                   |

**Slots:** default (trigger element), `action`

**Events:** `mac-popconfirm-confirm`, `mac-popconfirm-cancel`, `mac-popconfirm-open`, `mac-popconfirm-close`

```html
<mac-popconfirm title="Are you sure?" description="This action cannot be undone." danger>
  <mac-button variant="text" danger>Delete</mac-button>
</mac-popconfirm>
```

### MacDescriptions

A descriptions list component for displaying key-value pairs.

| Property          | Type                            | Default  | Description           |
| ----------------- | ------------------------------- | -------- | --------------------- |
| `label-placement` | `'left' \| 'top'`               | `'left'` | Label position        |
| `label-align`     | `'left' \| 'center' \| 'right'` | `'left'` | Label text alignment  |
| `column`          | `number`                        | `3`      | Number of columns     |
| `size`            | `'sm' \| 'md' \| 'lg'`          | —        | Component size        |
| `bordered`        | `boolean`                       | `false`  | Show borders          |
| `title`           | `string`                        | `''`     | List title            |
| `separator`       | `string`                        | `':'`    | Label-value separator |
| `items`           | `DescriptionItem[]`             | `[]`     | Description items     |

**Slots:** default (mac-description-item elements), `title`, `extra`

```html
<mac-descriptions title="User Info" :items=${[
  { label: 'Name', value: 'John' },
  { label: 'Email', value: 'john@example.com' },
  { label: 'Phone', value: '123-456-7890' }
]}></mac-descriptions>
```

### MacInfiniteScroll

An infinite scroll component that triggers loading more data when scrolling to the bottom.

| Property          | Type      | Default | Description                       |
| ----------------- | --------- | ------- | --------------------------------- |
| `has-more`        | `boolean` | `true`  | Whether more data is available    |
| `loading`         | `boolean` | `false` | Whether data is loading           |
| `error`           | `boolean` | `false` | Whether last load failed          |
| `threshold`       | `number`  | `100`   | Trigger distance from bottom (px) |
| `immediate-check` | `boolean` | `true`  | Check immediately after mount     |
| `disabled`        | `boolean` | `false` | Disable auto-loading              |

**Slots:** default (list content), `loading`, `finished`, `error`

**Events:** `mac-load-more`, `mac-retry`

**CSS Parts:** `loading`, `finished`, `error`

```html
<mac-infinite-scroll @mac-load-more="${loadMore}" :has-more="${hasMore}" :loading="${loading}">
  <div>Item 1</div>
  <div>Item 2</div>
</mac-infinite-scroll>
```

### MacSplit / MacSplitPane

A resizable split panel component.

**MacSplit Properties:**

| Property    | Type                         | Default        | Description                        |
| ----------- | ---------------------------- | -------------- | ---------------------------------- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Split direction                    |
| `split`     | `number`                     | `0.5`          | Split position (0-1 or px)         |
| `unit`      | `'ratio' \| 'pixel'`         | `'ratio'`      | Unit type for split value          |
| `min`       | `number`                     | `0`            | Minimum panel size                 |
| `max`       | `number`                     | `0`            | Maximum panel size (0 = unlimited) |
| `disabled`  | `boolean`                    | `false`        | Disable resizing                   |

**Slots:** `first`, `second`

**Events:** `mac-split-change`, `mac-split-drag-start`, `mac-split-drag-end`

**CSS Parts:** `base`, `first`, `second`, `resizer`, `resizer-line`

```html
<mac-split direction="horizontal" split="0.3">
  <div slot="first">Left panel</div>
  <div slot="second">Right panel</div>
</mac-split>
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

- Node.js >= 20+
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

## License

MIT
