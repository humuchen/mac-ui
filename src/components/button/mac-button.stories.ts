import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-button'

const meta: Meta = {
  title: 'Components/Button',
  component: 'mac-button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'text'],
      description: 'The button variant style',
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The button size',
      table: { defaultValue: { summary: 'md' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    loading: {
      control: 'boolean',
      description: 'Shows a loading spinner',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'The button type (form behavior)',
      table: { defaultValue: { summary: 'button' } },
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    type: 'button',
  },
}

export default meta
type Story = StoryObj

export const Primary: Story = {
  args: { variant: 'primary' },
  render: (args) =>
    html`<mac-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      type=${args.type}
      >Click Me</mac-button
    >`,
}

export const Secondary: Story = {
  args: { variant: 'secondary' },
  render: (args) =>
    html`<mac-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      >Secondary</mac-button
    >`,
}

export const Text: Story = {
  args: { variant: 'text' },
  render: (args) =>
    html`<mac-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      >Text Button</mac-button
    >`,
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
  render: (args) =>
    html`<mac-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      type=${args.type}
      >Small</mac-button
    >`,
}

export const Large: Story = {
  args: { size: 'lg' },
  render: (args) =>
    html`<mac-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      type=${args.type}
      >Large</mac-button
    >`,
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) =>
    html`<mac-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      type=${args.type}
      >Disabled</mac-button
    >`,
}

export const Loading: Story = {
  args: { loading: true },
  render: (args) =>
    html`<mac-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      type=${args.type}
      >Loading</mac-button
    >`,
}

export const WithSlots: Story = {
  args: { variant: 'primary' },
  render: (args) => html`
    <mac-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      type=${args.type}
    >
      <span slot="prefix">📥</span>
      Download
      <span slot="suffix">→</span>
    </mac-button>
  `,
}

export const AllVariants: Story = {
  render: (args) => html`
    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
      <mac-button
        variant="primary"
        size=${args.size}
        ?disabled=${args.disabled}
        ?loading=${args.loading}
        type=${args.type}
        >Primary</mac-button
      >
      <mac-button
        variant="secondary"
        size=${args.size}
        ?disabled=${args.disabled}
        ?loading=${args.loading}
        type=${args.type}
        >Secondary</mac-button
      >
      <mac-button
        variant="text"
        size=${args.size}
        ?disabled=${args.disabled}
        ?loading=${args.loading}
        type=${args.type}
        >Text</mac-button
      >
    </div>
  `,
}
