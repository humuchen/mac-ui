import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-rating'

const meta: Meta = {
  title: 'Components/Rating',
  component: 'mac-rating',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'Current rating value',
      table: { defaultValue: { summary: '0' } },
    },
    max: {
      control: 'number',
      description: 'Maximum rating count',
      table: { defaultValue: { summary: '5' } },
    },
    allowHalf: {
      control: 'boolean',
      description: 'Allow half-star selection',
      table: { defaultValue: { summary: 'false' } },
    },
    readonly: {
      control: 'boolean',
      description: 'Read-only mode',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: { defaultValue: { summary: 'false' } },
    },
    showValue: {
      control: 'boolean',
      description: 'Show numeric value label',
      table: { defaultValue: { summary: 'false' } },
    },
    icon: {
      control: 'select',
      options: ['star', 'heart', 'circle', 'flame', 'thumb'],
      description: 'Icon shape',
      table: { defaultValue: { summary: 'star' } },
    },
  },
  args: {
    value: 0,
    max: 5,
    allowHalf: false,
    readonly: false,
    disabled: false,
    showValue: false,
    icon: 'star',
  },
}

export default meta
type Story = StoryObj

export const Basic: Story = {
  render: (args) => html`
    <mac-rating
      .value=${args.value}
      .max=${args.max}
      ?allow-half=${args.allowHalf}
      ?readonly=${args.readonly}
      ?disabled=${args.disabled}
      ?show-value=${args.showValue}
      .icon=${args.icon}
    ></mac-rating>
  `,
}

export const WithValue: Story = {
  args: { value: 3, showValue: true },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <mac-rating .value=${args.value} show-value></mac-rating>
      <mac-rating value="4.5" allow-half show-value></mac-rating>
      <mac-rating value="5" show-value></mac-rating>
    </div>
  `,
}

export const HalfStar: Story = {
  args: {
    allowHalf: true,
    showValue: true,
    icon: 'circle',
    value: 3.5,
  },

  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <mac-rating .value=${args.value} allow-half show-value></mac-rating>
      <mac-rating value="2.5" allow-half show-value></mac-rating>
      <mac-rating value="0.5" allow-half show-value></mac-rating>
    </div>
  `,
}

export const IconVariants: Story = {
  args: { value: 3, icon: 'star' },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Star</div>
        <mac-rating .value=${args.value} icon="star"></mac-rating>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Heart</div>
        <mac-rating value="4" icon="heart"></mac-rating>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Circle</div>
        <mac-rating value="2" icon="circle"></mac-rating>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Flame</div>
        <mac-rating value="5" icon="flame"></mac-rating>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Thumb</div>
        <mac-rating value="3" icon="thumb"></mac-rating>
      </div>
    </div>
  `,
}

export const Readonly: Story = {
  args: { value: 3.5, allowHalf: true, readonly: true, showValue: true },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <mac-rating .value=${args.value} allow-half readonly show-value></mac-rating>
      <mac-rating value="5" readonly show-value></mac-rating>
      <mac-rating value="0" readonly show-value></mac-rating>
    </div>
  `,
}

export const Disabled: Story = {
  args: { value: 3, disabled: true, showValue: true },
  render: (args) => html` <mac-rating .value=${args.value} disabled show-value></mac-rating> `,
}

export const CustomSize: Story = {
  args: { value: 3 },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Small</div>
        <mac-rating
          .value=${args.value}
          style="--md-rating-icon-size: var(--sm-rating-icon-size); --md-rating-gap: var(--sm-rating-gap);"
        ></mac-rating>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Default</div>
        <mac-rating .value=${args.value}></mac-rating>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Large</div>
        <mac-rating
          .value=${args.value}
          style="--md-rating-icon-size: var(--lg-rating-icon-size); --md-rating-gap: var(--lg-rating-gap);"
        ></mac-rating>
      </div>
    </div>
  `,
}

export const CustomColor: Story = {
  args: { value: 4 },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Red</div>
        <mac-rating
          .value=${args.value}
          style="--md-rating-color-active: #ef4444; --md-rating-color-hover: #dc2626;"
        ></mac-rating>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Blue</div>
        <mac-rating
          value="3"
          style="--md-rating-color-active: #3b82f6; --md-rating-color-hover: #2563eb;"
        ></mac-rating>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Green</div>
        <mac-rating
          value="5"
          style="--md-rating-color-active: #22c55e; --md-rating-color-hover: #16a34a;"
        ></mac-rating>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Purple</div>
        <mac-rating
          value="2"
          style="--md-rating-color-active: #a855f7; --md-rating-color-hover: #9333ea;"
        ></mac-rating>
      </div>
    </div>
  `,
}

export const MaxCount: Story = {
  args: { value: 7, max: 10, showValue: true },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <mac-rating .value=${args.value} .max=${args.max} show-value></mac-rating>
      <mac-rating value="3" max="3" show-value></mac-rating>
    </div>
  `,
}

export const ClickToClear: Story = {
  args: { value: 3, showValue: true },
  render: (args) => html`
    <div style="font-size: 13px; color: #6b7280; margin-bottom: 8px;">
      Click the same value again to clear the rating
    </div>
    <mac-rating .value=${args.value} show-value></mac-rating>
  `,
}
