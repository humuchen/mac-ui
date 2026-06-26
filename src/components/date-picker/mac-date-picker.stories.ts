import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-date-picker'

const meta: Meta = {
  title: 'Data Entry/DatePicker',
  component: 'mac-date-picker',
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    defaultValue: { control: 'text' },
    format: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    clearable: { control: 'boolean' },
    error: { control: 'boolean' },
    success: { control: 'boolean' },
    panel: { control: 'boolean' },
    showFooter: { control: 'boolean' },
    type: { control: 'select', options: ['date', 'datetime', 'year', 'quarter', 'week'] },
  },
  parameters: {
    docs: {
      description: {
        component: 'A date picker component with macOS-style design.',
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => html`<mac-date-picker></mac-date-picker>`,
}

export const WithValue: Story = {
  render: () => html` <mac-date-picker .defaultValue=${'2024-06-15'}></mac-date-picker> `,
}

export const Placeholder: Story = {
  render: () => html` <mac-date-picker placeholder="请选择日期"></mac-date-picker> `,
}

export const Disabled: Story = {
  render: () => html` <mac-date-picker .defaultValue=${'2024-06-15'} disabled></mac-date-picker> `,
}

export const Clearable: Story = {
  render: () => html` <mac-date-picker .defaultValue=${'2024-06-15'} clearable></mac-date-picker> `,
}

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <mac-date-picker size="sm" .defaultValue=${'2024-06-15'}></mac-date-picker>
      <mac-date-picker size="md" .defaultValue=${'2024-06-15'}></mac-date-picker>
      <mac-date-picker size="lg" .defaultValue=${'2024-06-15'}></mac-date-picker>
    </div>
  `,
}

export const ErrorState: Story = {
  render: () => html` <mac-date-picker .defaultValue=${'2024-06-15'} error></mac-date-picker> `,
}

export const SuccessState: Story = {
  render: () => html` <mac-date-picker .defaultValue=${'2024-06-15'} success></mac-date-picker> `,
}

export const DisabledDate: Story = {
  render: () => {
    const disabledDate = (date: Date) => {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      return date < now
    }
    return html`
      <mac-date-picker
        placeholder="不能选择今天之前的日期"
        .disabledDate=${disabledDate}
      ></mac-date-picker>
    `
  },
}

export const YearPicker: Story = {
  render: () => html`<mac-date-picker type="year" .defaultValue=${'2024'}></mac-date-picker>`,
}

export const QuarterPicker: Story = {
  render: () => html`<mac-date-picker type="quarter" .defaultValue=${'2024-Q2'}></mac-date-picker>`,
}

export const WeekPicker: Story = {
  render: () => html`<mac-date-picker type="week" .defaultValue=${'2024-06-16'}></mac-date-picker>`,
}

export const DateTimePicker: Story = {
  render: () => html`
    <mac-date-picker
      type="datetime"
      .defaultValue=${'2024-06-15 12:30:00'}
      format="YYYY-MM-DD HH:mm:ss"
    ></mac-date-picker>
  `,
}

export const Controlled: Story = {
  render: () => {
    const handleChange = (e: CustomEvent) => {
      const el = document.getElementById('controlled-picker') as any
      if (el) {
        el.value = e.detail.value
      }
    }
    return html`
      <mac-date-picker
        id="controlled-picker"
        .value=${'2024-06-15'}
        @mac-change=${handleChange}
      ></mac-date-picker>
    `
  },
}

export const PanelOnly: Story = {
  render: () => html`<mac-date-picker panel></mac-date-picker>`,
}

export const PanelOnlyWithValue: Story = {
  render: () => html`<mac-date-picker panel .defaultValue=${'2024-06-15'}></mac-date-picker>`,
}

export const PanelOnlyYear: Story = {
  render: () => html`<mac-date-picker panel type="year" .defaultValue=${'2024'}></mac-date-picker>`,
}

export const PanelOnlyQuarter: Story = {
  render: () =>
    html`<mac-date-picker panel type="quarter" .defaultValue=${'2024-Q2'}></mac-date-picker>`,
}

export const PanelOnlyWeek: Story = {
  render: () =>
    html`<mac-date-picker panel type="week" .defaultValue=${'2024-06-16'}></mac-date-picker>`,
}

export const PanelOnlyDateTime: Story = {
  render: () =>
    html`<mac-date-picker
      panel
      type="datetime"
      .defaultValue=${'2024-06-15 12:30:00'}
      format="YYYY-MM-DD HH:mm:ss"
    ></mac-date-picker>`,
}

export const HideFooter: Story = {
  render: () =>
    html`<mac-date-picker .showFooter=${false} .defaultValue=${'2024-06-15'}></mac-date-picker>`,
}

export const PanelOnlyHideFooter: Story = {
  render: () =>
    html`<mac-date-picker
      panel
      .showFooter=${false}
      .defaultValue=${'2024-06-15'}
    ></mac-date-picker>`,
}

export const CustomIcon: Story = {
  render: () => html`
    <mac-date-picker .defaultValue=${'2024-06-15'}>
      <svg
        slot="icon"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <circle cx="8" cy="8" r="6" />
        <path d="M8 5v3l2 2" />
      </svg>
    </mac-date-picker>
  `,
}
