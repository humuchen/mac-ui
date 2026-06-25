import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'

import './mac-config-provider'
import '../button/mac-button'
import '../input/mac-input'
import '../select/mac-select'
import '../number-animation/mac-number-animation'

const meta: Meta = {
  title: 'Config/ConfigProvider',
  component: 'mac-config-provider',
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: 'select',
      options: ['auto', 'light', 'dark'],
      description: 'Global theme setting',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Global size setting',
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: {
    theme: 'light',
    size: 'md',
  },
  render: (args) => html`
    <mac-config-provider theme=${args.theme} size=${args.size}>
      <div style="display: flex; flex-direction: column; gap: 16px; padding: 24px;">
        <mac-button variant="primary">Primary Button</mac-button>
        <mac-button variant="secondary" size="sm">Small Button (override)</mac-button>
        <mac-input label="Input" placeholder="Type something..."></mac-input>
        <mac-select
          .options=${[
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
            { value: '3', label: 'Option 3' },
          ]}
        ></mac-select>
        <mac-number-animation .to=${100}></mac-number-animation>
      </div>
    </mac-config-provider>
  `,
}

export const LargeSize: Story = {
  args: {
    theme: 'light',
    size: 'lg',
  },
  render: (args) => html`
    <mac-config-provider theme=${args.theme} size=${args.size}>
      <div style="display: flex; flex-direction: column; gap: 16px; padding: 24px;">
        <mac-button variant="primary">Large Button</mac-button>
        <mac-input label="Large Input" placeholder="Type something..."></mac-input>
        <mac-select
          .options=${[
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
          ]}
        ></mac-select>
      </div>
    </mac-config-provider>
  `,
}

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    size: 'md',
  },
  render: (args) => html`
    <mac-config-provider theme=${args.theme} size=${args.size}>
      <div
        style="display: flex; flex-direction: column; gap: 16px; padding: 24px; background: #1a1a1a;"
      >
        <mac-button variant="primary">Dark Button</mac-button>
        <mac-button variant="secondary">Dark Secondary</mac-button>
        <mac-input label="Dark Input" placeholder="Type something..."></mac-input>
        <mac-select
          .options=${[
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
          ]}
        ></mac-select>
        <mac-number-animation .to=${10}></mac-number-animation>
      </div>
    </mac-config-provider>
  `,
}
