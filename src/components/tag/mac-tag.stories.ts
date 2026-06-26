import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-tag'

const meta: Meta = {
  title: 'Components/Tag',
  component: 'mac-tag',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger', 'info'],
      description: 'The tag type style',
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The tag size',
      table: { defaultValue: { summary: 'md' } },
    },
    closable: {
      control: 'boolean',
      description: 'Whether the tag can be closed',
    },
    round: {
      control: 'boolean',
      description: 'Whether the tag has rounded corners',
    },
    bordered: {
      control: 'boolean',
      description: 'Whether the tag has a border',
      table: { defaultValue: { summary: 'true' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the tag',
    },
  },
  args: {
    type: 'default',
    size: 'md',
    closable: false,
    round: false,
    bordered: true,
    disabled: false,
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: { type: 'default' },
  render: (args) =>
    html`<mac-tag
      type=${args.type}
      size=${args.size}
      ?closable=${args.closable}
      ?round=${args.round}
      ?bordered=${args.bordered}
      ?disabled=${args.disabled}
      >Tag</mac-tag
    >`,
}

export const Primary: Story = {
  args: { type: 'primary' },
  render: (args) =>
    html`<mac-tag
      type=${args.type}
      size=${args.size}
      ?closable=${args.closable}
      ?round=${args.round}
      ?bordered=${args.bordered}
      ?disabled=${args.disabled}
      >Primary</mac-tag
    >`,
}

export const Success: Story = {
  args: { type: 'success' },
  render: (args) =>
    html`<mac-tag
      type=${args.type}
      size=${args.size}
      ?closable=${args.closable}
      ?round=${args.round}
      ?bordered=${args.bordered}
      ?disabled=${args.disabled}
      >Success</mac-tag
    >`,
}

export const Warning: Story = {
  args: { type: 'warning' },
  render: (args) =>
    html`<mac-tag
      type=${args.type}
      size=${args.size}
      ?closable=${args.closable}
      ?round=${args.round}
      ?bordered=${args.bordered}
      ?disabled=${args.disabled}
      >Warning</mac-tag
    >`,
}

export const Danger: Story = {
  args: { type: 'danger' },
  render: (args) =>
    html`<mac-tag
      type=${args.type}
      size=${args.size}
      ?closable=${args.closable}
      ?round=${args.round}
      ?bordered=${args.bordered}
      ?disabled=${args.disabled}
      >Danger</mac-tag
    >`,
}

export const Info: Story = {
  args: { type: 'info' },
  render: (args) =>
    html`<mac-tag
      type=${args.type}
      size=${args.size}
      ?closable=${args.closable}
      ?round=${args.round}
      ?bordered=${args.bordered}
      ?disabled=${args.disabled}
      >Info</mac-tag
    >`,
}

export const Small: Story = {
  args: { size: 'sm' },
  render: (args) =>
    html`<mac-tag
      type=${args.type}
      size=${args.size}
      ?closable=${args.closable}
      ?round=${args.round}
      ?bordered=${args.bordered}
      ?disabled=${args.disabled}
      >Small</mac-tag
    >`,
}

export const Large: Story = {
  args: { size: 'lg' },
  render: (args) =>
    html`<mac-tag
      type=${args.type}
      size=${args.size}
      ?closable=${args.closable}
      ?round=${args.round}
      ?bordered=${args.bordered}
      ?disabled=${args.disabled}
      >Large</mac-tag
    >`,
}

export const Closable: Story = {
  args: { closable: true },
  render: (args) =>
    html`<mac-tag
      type=${args.type}
      size=${args.size}
      ?closable=${args.closable}
      ?round=${args.round}
      ?bordered=${args.bordered}
      ?disabled=${args.disabled}
      >Closable</mac-tag
    >`,
}

export const Round: Story = {
  args: { round: true },
  render: (args) =>
    html`<mac-tag
      type=${args.type}
      size=${args.size}
      ?closable=${args.closable}
      ?round=${args.round}
      ?bordered=${args.bordered}
      ?disabled=${args.disabled}
      >Round</mac-tag
    >`,
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) =>
    html`<mac-tag
      type=${args.type}
      size=${args.size}
      ?closable=${args.closable}
      ?round=${args.round}
      ?bordered=${args.bordered}
      ?disabled=${args.disabled}
      >Disabled</mac-tag
    >`,
}

export const AllTypes: Story = {
  render: (args) => html`
    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
      <mac-tag
        type="default"
        size=${args.size}
        ?closable=${args.closable}
        ?round=${args.round}
        ?disabled=${args.disabled}
        >Default</mac-tag
      >
      <mac-tag
        type="primary"
        size=${args.size}
        ?closable=${args.closable}
        ?round=${args.round}
        ?disabled=${args.disabled}
        >Primary</mac-tag
      >
      <mac-tag
        type="success"
        size=${args.size}
        ?closable=${args.closable}
        ?round=${args.round}
        ?disabled=${args.disabled}
        >Success</mac-tag
      >
      <mac-tag
        type="warning"
        size=${args.size}
        ?closable=${args.closable}
        ?round=${args.round}
        ?disabled=${args.disabled}
        >Warning</mac-tag
      >
      <mac-tag
        type="danger"
        size=${args.size}
        ?closable=${args.closable}
        ?round=${args.round}
        ?disabled=${args.disabled}
        >Danger</mac-tag
      >
      <mac-tag
        type="info"
        size=${args.size}
        ?closable=${args.closable}
        ?round=${args.round}
        ?disabled=${args.disabled}
        >Info</mac-tag
      >
    </div>
  `,
}

export const AllSizes: Story = {
  render: (args) => html`
    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
      <mac-tag type="primary" size="sm">Small</mac-tag>
      <mac-tag type="primary" size="md">Medium</mac-tag>
      <mac-tag type="primary" size="lg">Large</mac-tag>
    </div>
  `,
}

export const NoBorder: Story = {
  args: { bordered: false },
  render: (args) => html`
    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
      <mac-tag type="default" ?bordered=${args.bordered}>Default</mac-tag>
      <mac-tag type="primary" ?bordered=${args.bordered}>Primary</mac-tag>
      <mac-tag type="success" ?bordered=${args.bordered}>Success</mac-tag>
      <mac-tag type="warning" ?bordered=${args.bordered}>Warning</mac-tag>
      <mac-tag type="danger" ?bordered=${args.bordered}>Danger</mac-tag>
      <mac-tag type="info" ?bordered=${args.bordered}>Info</mac-tag>
    </div>
  `,
}

export const WithPrefix: Story = {
  render: (args) => html`
    <mac-tag type="primary">
      <span slot="prefix">🏷️</span>
      With Prefix
    </mac-tag>
  `,
}
