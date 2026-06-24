import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-desktop-icon'

const meta: Meta = {
  title: 'Components/DesktopIcon',
  component: 'mac-desktop-icon',
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Icon label text',
    },
    iconId: {
      control: 'text',
      description: 'Unique icon identifier',
    },
    color: {
      control: 'color',
      description: 'Default icon placeholder color',
      table: { defaultValue: { summary: '#007AFF' } },
    },
    selected: {
      control: 'boolean',
      description: 'Whether the icon is selected',
    },
    draggable: {
      control: 'boolean',
      description: 'Whether drag is enabled',
      table: { defaultValue: { summary: 'true' } },
    },
  },
  args: {
    label: 'Finder',
    iconId: 'finder',
    color: '#007AFF',
    selected: false,
    draggable: true,
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: (args) => html`
    <div
      style="width: 200px; height: 120px; background: linear-gradient(135deg, #1a1a2e, #0f3460); border-radius: 8px; position: relative;"
    >
      <mac-desktop-icon
        icon-id=${args.iconId}
        label=${args.label}
        color=${args.color}
        ?selected=${args.selected}
        ?draggable=${args.draggable}
        .x=${60}
        .y=${10}
      ></mac-desktop-icon>
    </div>
  `,
}

export const Selected: Story = {
  args: { selected: true },
  render: (args) => html`
    <div
      style="width: 200px; height: 120px; background: linear-gradient(135deg, #1a1a2e, #0f3460); border-radius: 8px; position: relative;"
    >
      <mac-desktop-icon
        icon-id=${args.iconId}
        label=${args.label}
        color=${args.color}
        ?selected=${args.selected}
        ?draggable=${args.draggable}
        .x=${60}
        .y=${10}
      ></mac-desktop-icon>
    </div>
  `,
}

export const ColorVariants: Story = {
  args: {
    selected: false,
    draggable: true,
  },
  render: (args) => html`
    <div
      style="width: 500px; height: 120px; background: linear-gradient(135deg, #1a1a2e, #0f3460); border-radius: 8px; position: relative; display: flex; gap: 8px; padding: 16px;"
    >
      <mac-desktop-icon
        icon-id="c1"
        label="Finder"
        color="#007AFF"
        ?selected=${args.selected}
        ?draggable=${args.draggable}
        .x=${16}
        .y=${10}
      ></mac-desktop-icon>
      <mac-desktop-icon
        icon-id="c2"
        label="Safari"
        color="#5AC8FA"
        ?selected=${args.selected}
        ?draggable=${args.draggable}
        .x=${106}
        .y=${10}
      ></mac-desktop-icon>
      <mac-desktop-icon
        icon-id="c3"
        label="邮件"
        color="#34C759"
        ?selected=${args.selected}
        ?draggable=${args.draggable}
        .x=${196}
        .y=${10}
      ></mac-desktop-icon>
      <mac-desktop-icon
        icon-id="c4"
        label="音乐"
        color="#FF2D55"
        ?selected=${args.selected}
        ?draggable=${args.draggable}
        .x=${286}
        .y=${10}
      ></mac-desktop-icon>
      <mac-desktop-icon
        icon-id="c5"
        label="设置"
        color="#8E8E93"
        ?selected=${args.selected}
        ?draggable=${args.draggable}
        .x=${376}
        .y=${10}
      ></mac-desktop-icon>
    </div>
  `,
}
