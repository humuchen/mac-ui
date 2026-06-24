import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-dropdown'

const meta: Meta = {
  title: 'Components/Dropdown',
  component: 'mac-dropdown',
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
      description: 'Menu placement',
      table: { defaultValue: { summary: 'bottom-start' } },
    },
    value: {
      control: 'text',
      description: 'Active item value',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the dropdown',
    },
    openOnHover: {
      control: 'boolean',
      description: 'Opens on hover instead of click',
    },
    hoverDelay: {
      control: 'number',
      description: 'Hover delay in ms',
      table: { defaultValue: { summary: '150' } },
    },
    trigger: {
      control: 'select',
      options: ['click', 'contextmenu', 'both'],
      description: 'Trigger mode',
      table: { defaultValue: { summary: 'click' } },
    },
  },
  args: {
    placement: 'bottom-start',
    value: '',
    disabled: false,
    openOnHover: false,
    hoverDelay: 150,
    trigger: 'click',
  },
}

export default meta
type Story = StoryObj

const basicItems = [
  { value: 'new', label: 'New File', shortcut: '⌘N' },
  { value: 'open', label: 'Open...', shortcut: '⌘O' },
  { value: 'save', label: 'Save', shortcut: '⌘S' },
  { value: 'save-as', label: 'Save As...', shortcut: '⇧⌘S' },
  { divider: true, value: '', label: '' },
  { value: 'print', label: 'Print...', shortcut: '⌘P' },
]

export const Basic: Story = {
  render: (args) => html`
    <mac-dropdown
      .items=${basicItems}
      placement=${args.placement}
      .value=${args.value}
      ?disabled=${args.disabled}
      ?open-on-hover=${args.openOnHover}
      .hoverDelay=${args.hoverDelay}
    >
      <button
        slot="trigger"
        style="
        padding: 8px 16px;
        border: 1px solid var(--md-color-border);
        border-radius: var(--md-radius-md);
        background: var(--md-color-bg);
        font-size: 14px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      "
      >
        File
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </mac-dropdown>
  `,
}

export const WithIcons: Story = {
  render: (args) => {
    const items = [
      { value: 'profile', label: 'Profile', icon: '👤' },
      { value: 'settings', label: 'Settings', icon: '⚙️', shortcut: '⌘,' },
      { value: 'themes', label: 'Themes', icon: '🎨' },
      { divider: true, value: '', label: '' },
      { value: 'help', label: 'Help', icon: '❓' },
      { value: 'about', label: 'About', icon: 'ℹ️' },
      { divider: true, value: '', label: '' },
      { value: 'logout', label: 'Log Out', icon: '🚪', danger: true },
    ]
    return html`
      <mac-dropdown
        .items=${items}
        .placement=${args.placement}
        .value=${args.value}
        ?disabled=${args.disabled}
        ?open-on-hover=${args.openOnHover}
        .hoverDelay=${args.hoverDelay}
        .trigger=${args.trigger}
      >
        <button
          slot="trigger"
          style="
          padding: 8px 16px;
          border: 1px solid var(--md-color-border);
          border-radius: var(--md-radius-md);
          background: var(--md-color-bg);
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        "
        >
          Menu
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path
              d="M1 1l4 4 4-4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </mac-dropdown>
    `
  },
}

export const WithSubmenu: Story = {
  render: (args) => {
    const items = [
      { value: 'new', label: 'New', shortcut: '⌘N' },
      { value: 'open', label: 'Open', shortcut: '⌘O' },
      {
        value: 'open-recent',
        label: 'Open Recent',
        icon: '🕐',
        children: [
          { value: 'doc1', label: 'Document 1.txt' },
          { value: 'doc2', label: 'Project.md' },
          { value: 'doc3', label: 'Notes.txt' },
          { divider: true, value: '', label: '' },
          { value: 'clear-recent', label: 'Clear Menu' },
        ],
      },
      { divider: true, value: '', label: '' },
      { value: 'save', label: 'Save', shortcut: '⌘S' },
      { value: 'save-as', label: 'Save As...', shortcut: '⇧⌘S' },
      {
        value: 'export',
        label: 'Export',
        icon: '📤',
        children: [
          { value: 'pdf', label: 'PDF' },
          { value: 'png', label: 'PNG' },
          { value: 'svg', label: 'SVG' },
          { value: 'json', label: 'JSON' },
        ],
      },
    ]
    return html`
      <mac-dropdown
        .items=${items}
        .placement=${args.placement}
        .value=${args.value}
        ?disabled=${args.disabled}
        ?open-on-hover=${args.openOnHover}
        .hoverDelay=${args.hoverDelay}
        .trigger=${args.trigger}
      >
        <button
          slot="trigger"
          style="
          padding: 8px 16px;
          border: 1px solid var(--md-color-border);
          border-radius: var(--md-radius-md);
          background: var(--md-color-bg);
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        "
        >
          File
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path
              d="M1 1l4 4 4-4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </mac-dropdown>
    `
  },
}

export const DangerItems: Story = {
  render: (args) => {
    const items = [
      { value: 'edit', label: 'Edit', icon: '✏️' },
      { value: 'duplicate', label: 'Duplicate', icon: '📋' },
      { value: 'share', label: 'Share', icon: '🔗' },
      { divider: true, value: '', label: '' },
      { value: 'delete', label: 'Delete', icon: '🗑️', danger: true },
      { value: 'archive', label: 'Archive', icon: '📦', danger: true },
    ]
    return html`
      <mac-dropdown
        .items=${items}
        .placement=${args.placement}
        .value=${args.value}
        ?disabled=${args.disabled}
        ?open-on-hover=${args.openOnHover}
        .hoverDelay=${args.hoverDelay}
        .trigger=${args.trigger}
      >
        <button
          slot="trigger"
          style="
          padding: 8px 16px;
          border: 1px solid var(--md-color-border);
          border-radius: var(--md-radius-md);
          background: var(--md-color-bg);
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        "
        >
          Actions
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path
              d="M1 1l4 4 4-4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </mac-dropdown>
    `
  },
}

export const OpenOnHover: Story = {
  args: { openOnHover: true },
  render: (args) => {
    const items = [
      { value: 'about', label: 'About This Mac' },
      { value: 'system', label: 'System Settings...', shortcut: '⌘,' },
      { divider: true, value: '', label: '' },
      { value: 'sleep', label: 'Sleep' },
      { value: 'restart', label: 'Restart...' },
      { value: 'shutdown', label: 'Shut Down...' },
      { divider: true, value: '', label: '' },
      { value: 'lock', label: 'Lock Screen', shortcut: '⌃⌘Q' },
      { value: 'logout', label: 'Log Out...', shortcut: '⇧⌘Q', danger: true },
    ]
    return html`
      <mac-dropdown
        .items=${items}
        .placement=${args.placement}
        .value=${args.value}
        ?disabled=${args.disabled}
        ?open-on-hover=${args.openOnHover}
        .hoverDelay=${args.hoverDelay}
        .trigger=${args.trigger}
      >
        <button
          slot="trigger"
          style="
          padding: 8px 16px;
          border: 1px solid var(--md-color-border);
          border-radius: var(--md-radius-md);
          background: var(--md-color-bg);
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        "
        >
          Apple Menu
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path
              d="M1 1l4 4 4-4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </mac-dropdown>
    `
  },
}

export const Placements: Story = {
  args: { placement: 'bottom-start' },
  render: (args) => {
    const items = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
    ]
    return html`
      <div style="display: flex; gap: 24px; padding: 120px 0;">
        <mac-dropdown
          .items=${items}
          placement="bottom-start"
          .value=${args.value}
          ?disabled=${args.disabled}
          ?open-on-hover=${args.openOnHover}
          .hoverDelay=${args.hoverDelay}
          .trigger=${args.trigger}
        >
          <button
            slot="trigger"
            style="padding:8px 16px;border:1px solid var(--md-color-border);border-radius:6px;background:var(--md-color-bg);font-size:14px;cursor:pointer;"
          >
            Bottom Start
          </button>
        </mac-dropdown>
        <mac-dropdown
          .items=${items}
          placement="bottom-end"
          .value=${args.value}
          ?disabled=${args.disabled}
          ?open-on-hover=${args.openOnHover}
          .hoverDelay=${args.hoverDelay}
          .trigger=${args.trigger}
        >
          <button
            slot="trigger"
            style="padding:8px 16px;border:1px solid var(--md-color-border);border-radius:6px;background:var(--md-color-bg);font-size:14px;cursor:pointer;"
          >
            Bottom End
          </button>
        </mac-dropdown>
        <mac-dropdown
          .items=${items}
          placement="top-start"
          .value=${args.value}
          ?disabled=${args.disabled}
          ?open-on-hover=${args.openOnHover}
          .hoverDelay=${args.hoverDelay}
          .trigger=${args.trigger}
        >
          <button
            slot="trigger"
            style="padding:8px 16px;border:1px solid var(--md-color-border);border-radius:6px;background:var(--md-color-bg);font-size:14px;cursor:pointer;"
          >
            Top Start
          </button>
        </mac-dropdown>
        <mac-dropdown
          .items=${items}
          placement="top-end"
          .value=${args.value}
          ?disabled=${args.disabled}
          ?open-on-hover=${args.openOnHover}
          .hoverDelay=${args.hoverDelay}
          .trigger=${args.trigger}
        >
          <button
            slot="trigger"
            style="padding:8px 16px;border:1px solid var(--md-color-border);border-radius:6px;background:var(--md-color-bg);font-size:14px;cursor:pointer;"
          >
            Top End
          </button>
        </mac-dropdown>
      </div>
    `
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => html`
    <mac-dropdown
      .items=${basicItems}
      ?disabled=${args.disabled}
      .placement=${args.placement}
      .value=${args.value}
      ?open-on-hover=${args.openOnHover}
      .hoverDelay=${args.hoverDelay}
      .trigger=${args.trigger}
    >
      <button
        slot="trigger"
        style="
        padding: 8px 16px;
        border: 1px solid var(--md-color-border);
        border-radius: var(--md-radius-md);
        background: var(--md-color-bg-secondary);
        font-size: 14px;
        cursor: not-allowed;
        opacity: 0.5;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      "
      >
        Disabled
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </mac-dropdown>
  `,
}

export const ContextMenu: Story = {
  args: { trigger: 'contextmenu' },
  render: (args) => {
    const contextItems = [
      { value: 'new-file', label: 'New File', icon: '📄', shortcut: '⌘N' },
      { value: 'new-folder', label: 'New Folder', icon: '📁', shortcut: '⇧⌘N' },
      { divider: true, value: '', label: '' },
      { value: 'get-info', label: 'Get Info', icon: 'ℹ️', shortcut: '⌘I' },
      { value: 'rename', label: 'Rename', icon: '✏️' },
      { divider: true, value: '', label: '' },
      { value: 'copy', label: 'Copy', icon: '📋', shortcut: '⌘C' },
      { value: 'paste', label: 'Paste', icon: '📌', shortcut: '⌘V' },
      { divider: true, value: '', label: '' },
      { value: 'delete', label: 'Move to Trash', icon: '🗑️', danger: true },
    ]
    return html`
      <div
        style="
          width: 400px;
          height: 200px;
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          font-size: 14px;
          user-select: none;
        "
      >
        <mac-dropdown
          .items=${contextItems}
          .trigger=${args.trigger}
          .placement=${args.placement}
          .value=${args.value}
          ?disabled=${args.disabled}
          ?open-on-hover=${args.openOnHover}
          .hoverDelay=${args.hoverDelay}
        >
          <span slot="trigger" style="cursor: context-menu;">Right-click this area</span>
        </mac-dropdown>
      </div>
    `
  },
}
