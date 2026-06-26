import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-alert'

const meta: Meta = {
  title: 'Components/Alert',
  component: 'mac-alert',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error', 'info'],
      description: 'The alert type style',
      table: { defaultValue: { summary: 'default' } },
    },
    title: {
      control: 'text',
      description: 'The alert title',
    },
    bordered: {
      control: 'boolean',
      description: 'Whether the alert has a border',
      table: { defaultValue: { summary: 'true' } },
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show the icon',
      table: { defaultValue: { summary: 'true' } },
    },
    closable: {
      control: 'boolean',
      description: 'Whether the alert can be closed',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    type: 'default',
    title: '',
    bordered: true,
    showIcon: true,
    closable: false,
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: {
    title: 'Default Alert',
    type: 'default',
  },
  render: (args) => html`
    <mac-alert
      type=${args.type}
      title=${args.title}
      ?bordered=${args.bordered}
      ?show-icon=${args.showIcon}
      ?closable=${args.closable}
    >
      This is a default alert message.
    </mac-alert>
  `,
}

export const WithTitle: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <mac-alert title="Success" type="success"> The operation completed successfully. </mac-alert>
      <mac-alert title="Warning" type="warning">
        Please review your settings before continuing.
      </mac-alert>
      <mac-alert title="Error" type="error">
        Something went wrong. Please try again later.
      </mac-alert>
      <mac-alert title="Info" type="info"> New updates are available for your system. </mac-alert>
    </div>
  `,
}

export const WithoutTitle: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <mac-alert type="success">Operation completed successfully.</mac-alert>
      <mac-alert type="warning">Please review your settings.</mac-alert>
      <mac-alert type="error">Something went wrong.</mac-alert>
      <mac-alert type="info">New updates are available.</mac-alert>
    </div>
  `,
}

export const AllTypes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <mac-alert title="Default" type="default">This is a default alert.</mac-alert>
      <mac-alert title="Primary" type="primary">This is a primary alert.</mac-alert>
      <mac-alert title="Success" type="success">This is a success alert.</mac-alert>
      <mac-alert title="Warning" type="warning">This is a warning alert.</mac-alert>
      <mac-alert title="Error" type="error">This is an error alert.</mac-alert>
      <mac-alert title="Info" type="info">This is an info alert.</mac-alert>
    </div>
  `,
}

export const BorderedVsBorderless: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <mac-alert title="With Border" type="primary" bordered> This alert has a border. </mac-alert>
      <mac-alert title="Without Border" type="primary" .bordered=${false}>
        This alert has no border.
      </mac-alert>
    </div>
  `,
}

export const WithoutIcon: Story = {
  args: {
    showIcon: false,
    title: 'No Icon Alert',
    type: 'info',
  },
  render: (args) => html`
    <mac-alert
      type=${args.type}
      title=${args.title}
      ?bordered=${args.bordered}
      ?show-icon=${args.showIcon}
      ?closable=${args.closable}
    >
      This alert does not display an icon.
    </mac-alert>
  `,
}

export const Closable: Story = {
  render: () => html`
    <mac-alert title="Closable Alert" type="warning" closable>
      Click the close button to dismiss this alert.
    </mac-alert>
  `,
}

export const WithAction: Story = {
  render: () => html`
    <mac-alert title="Update Available" type="info">
      A new version of the software is available.
      <mac-button slot="action" size="sm" variant="primary">Update</mac-button>
    </mac-alert>
  `,
}

export const CustomIcon: Story = {
  render: () => html`
    <mac-alert title="Custom Icon" type="default">
      <span slot="icon" style="font-size: 18px;">🎉</span>
      This alert uses a custom icon via the icon slot.
    </mac-alert>
  `,
}

export const LongContent: Story = {
  render: () => html`
    <mac-alert title="Long Message" type="info">
      This is a longer message that demonstrates how the alert component handles multi-line content.
      The content area should align properly with the title, maintaining a clean and organized
      layout even with extended text.
    </mac-alert>
  `,
}
