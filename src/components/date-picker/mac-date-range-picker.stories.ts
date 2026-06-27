import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-date-range-picker'

const meta: Meta = {
  title: 'Data Entry/DateRangePicker',
  component: 'mac-date-range-picker',
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'object' },
    defaultValue: { control: 'object' },
    format: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    clearable: { control: 'boolean' },
    error: { control: 'boolean' },
    success: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: 'A date range picker component with macOS-style design.',
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => html`<mac-date-range-picker></mac-date-range-picker>`,
}

export const WithValue: Story = {
  render: () => html`
    <mac-date-range-picker .defaultValue=${['2024-06-01', '2024-06-15']}></mac-date-range-picker>
  `,
}

export const Disabled: Story = {
  render: () => html`
    <mac-date-range-picker
      .defaultValue=${['2024-06-01', '2024-06-15']}
      disabled
    ></mac-date-range-picker>
  `,
}

export const Clearable: Story = {
  render: () => html`
    <mac-date-range-picker
      .defaultValue=${['2024-06-01', '2024-06-15']}
      clearable
    ></mac-date-range-picker>
  `,
}

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <mac-date-range-picker
        size="sm"
        .defaultValue=${['2024-06-01', '2024-06-15']}
      ></mac-date-range-picker>
      <mac-date-range-picker
        size="md"
        .defaultValue=${['2024-06-01', '2024-06-15']}
      ></mac-date-range-picker>
      <mac-date-range-picker
        size="lg"
        .defaultValue=${['2024-06-01', '2024-06-15']}
      ></mac-date-range-picker>
    </div>
  `,
}

export const ErrorState: Story = {
  render: () => html`
    <mac-date-range-picker
      .defaultValue=${['2024-06-01', '2024-06-15']}
      error
    ></mac-date-range-picker>
  `,
}

export const DisabledDate: Story = {
  render: () => {
    const disabledDate = (date: Date) => {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      return date < now
    }
    return html`
      <mac-date-range-picker
        placeholder="不能选择今天之前的日期"
        .disabledDate=${disabledDate}
      ></mac-date-range-picker>
    `
  },
}

export const Controlled: Story = {
  render: () => {
    const handleChange = (e: CustomEvent) => {
      const el = document.getElementById('controlled-range') as any
      if (el) el.value = e.detail.value
    }
    return html`
      <mac-date-range-picker
        id="controlled-range"
        .value=${['2024-06-01', '2024-06-15']}
        @mac-change=${handleChange}
      ></mac-date-range-picker>
    `
  },
}
