import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-group-button'

const meta: Meta = {
  title: 'Components/GroupButton',
  component: 'mac-group-button',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The currently selected value',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the buttons',
      table: { defaultValue: { summary: 'md' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all buttons',
    },
    items: {
      control: 'object',
      description: 'The array of button items',
    },
  },
  args: {
    size: 'md',
    disabled: false,
    value: 'day',
    items: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
      { value: 'year', label: 'Year' },
    ],
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: (args) =>
    html`<mac-group-button
      .items=${args.items}
      value=${args.value}
      size=${args.size}
      ?disabled=${args.disabled}
      @mac-change=${(e: CustomEvent) => console.log('Changed:', e.detail)}
    ></mac-group-button>`,
}

export const Small: Story = {
  args: {
    size: 'sm',
    value: 'list',
    items: [
      { value: 'list', label: 'List' },
      { value: 'grid', label: 'Grid' },
    ],
  },
  render: (args) =>
    html`<mac-group-button
      .items=${args.items}
      value=${args.value}
      size=${args.size}
    ></mac-group-button>`,
}

export const Large: Story = {
  args: {
    size: 'lg',
    value: 'all',
    items: [
      { value: 'all', label: 'All Files' },
      { value: 'recent', label: 'Recent' },
      { value: 'favorites', label: 'Favorites' },
    ],
  },
  render: (args) =>
    html`<mac-group-button
      .items=${args.items}
      value=${args.value}
      size=${args.size}
    ></mac-group-button>`,
}

export const WithDisabledItems: Story = {
  args: {
    value: 'option1',
    items: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', disabled: true },
      { value: 'option3', label: 'Option 3' },
      { value: 'option4', label: 'Option 4', disabled: true },
    ],
  },
  render: (args) =>
    html`<mac-group-button
      .items=${args.items}
      value=${args.value}
      size=${args.size}
    ></mac-group-button>`,
}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'tab1',
    items: [
      { value: 'tab1', label: 'Tab 1' },
      { value: 'tab2', label: 'Tab 2' },
      { value: 'tab3', label: 'Tab 3' },
    ],
  },
  render: (args) =>
    html`<mac-group-button
      .items=${args.items}
      value=${args.value}
      ?disabled=${args.disabled}
    ></mac-group-button>`,
}

export const TwoButtons: Story = {
  args: {
    value: 'on',
    items: [
      { value: 'on', label: 'On' },
      { value: 'off', label: 'Off' },
    ],
  },
  render: (args) =>
    html`<mac-group-button
      .items=${args.items}
      value=${args.value}
    ></mac-group-button>`,
}

export const ManyButtons: Story = {
  args: {
    value: '1',
    items: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' },
      { value: '6', label: '6' },
    ],
  },
  render: (args) =>
    html`<mac-group-button
      .items=${args.items}
      value=${args.value}
    ></mac-group-button>`,
}

export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;">
      <div>
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">Small</p>
        <mac-group-button
          .items=${[
            { value: 'list', label: 'List' },
            { value: 'grid', label: 'Grid' },
          ]}
          value="list"
          size="sm"
        ></mac-group-button>
      </div>
      <div>
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">Medium</p>
        <mac-group-button
          .items=${[
            { value: 'list', label: 'List' },
            { value: 'grid', label: 'Grid' },
          ]}
          value="list"
          size="md"
        ></mac-group-button>
      </div>
      <div>
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">Large</p>
        <mac-group-button
          .items=${[
            { value: 'list', label: 'List' },
            { value: 'grid', label: 'Grid' },
          ]}
          value="list"
          size="lg"
        ></mac-group-button>
      </div>
    </div>
  `,
}
