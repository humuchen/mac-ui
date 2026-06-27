import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-radio'

const meta: Meta = {
  title: 'Components/Radio',
  component: 'mac-radio',
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: {
    label: 'Radio option',
    value: 'option1',
  },
  render: (args) => html`
    <mac-radio
      .value=${args.value}
      .label=${args.label}
      .checked=${args.checked}
      .disabled=${args.disabled}
      .size=${args.size}
    ></mac-radio>
  `,
}

export const Checked: Story = {
  render: () => html` <mac-radio value="a" label="Checked" checked></mac-radio> `,
}

export const Disabled: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <mac-radio value="a" label="Disabled unchecked" disabled></mac-radio>
      <mac-radio value="b" label="Disabled checked" checked disabled></mac-radio>
    </div>
  `,
}

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <mac-radio size="sm" value="a" label="Small" checked></mac-radio>
      <mac-radio size="md" value="b" label="Medium" checked></mac-radio>
      <mac-radio size="lg" value="c" label="Large" checked></mac-radio>
    </div>
  `,
}

export const SlotLabel: Story = {
  render: () => html`
    <mac-radio value="a">
      <span style="color:var(--md-color-primary);font-weight:500;">Custom slot label</span>
    </mac-radio>
  `,
}

/* ─── Radio Group Stories ─── */

export const GroupDefault: Story = {
  render: () => html`
    <mac-radio-group
      value="b"
      @mac-change=${(e: CustomEvent) => console.log('change:', e.detail.value)}
    >
      <mac-radio value="a" label="Option A"></mac-radio>
      <mac-radio value="b" label="Option B"></mac-radio>
      <mac-radio value="c" label="Option C"></mac-radio>
    </mac-radio-group>
  `,
}

export const GroupWithOptions: Story = {
  render: () => html`
    <mac-radio-group
      .options=${[
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' },
      ]}
      value="banana"
      @mac-change=${(e: CustomEvent) => console.log('change:', e.detail.value)}
    ></mac-radio-group>
  `,
}

export const GroupVertical: Story = {
  render: () => html`
    <mac-radio-group direction="vertical" value="b">
      <mac-radio value="a" label="Option A"></mac-radio>
      <mac-radio value="b" label="Option B"></mac-radio>
      <mac-radio value="c" label="Option C"></mac-radio>
    </mac-radio-group>
  `,
}

export const GroupDisabled: Story = {
  render: () => html`
    <mac-radio-group disabled value="a">
      <mac-radio value="a" label="Option A"></mac-radio>
      <mac-radio value="b" label="Option B"></mac-radio>
      <mac-radio value="c" label="Option C"></mac-radio>
    </mac-radio-group>
  `,
}

export const GroupMixedDisabled: Story = {
  render: () => html`
    <mac-radio-group value="a">
      <mac-radio value="a" label="Enabled"></mac-radio>
      <mac-radio value="b" label="Disabled" disabled></mac-radio>
      <mac-radio value="c" label="Enabled"></mac-radio>
    </mac-radio-group>
  `,
}

export const GroupSizes: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px;">
      <mac-radio-group size="sm" value="a">
        <mac-radio value="a" label="Small A"></mac-radio>
        <mac-radio value="b" label="Small B"></mac-radio>
      </mac-radio-group>
      <mac-radio-group size="md" value="a">
        <mac-radio value="a" label="Medium A"></mac-radio>
        <mac-radio value="b" label="Medium B"></mac-radio>
      </mac-radio-group>
      <mac-radio-group size="lg" value="a">
        <mac-radio value="a" label="Large A"></mac-radio>
        <mac-radio value="b" label="Large B"></mac-radio>
      </mac-radio-group>
    </div>
  `,
}

export const GroupUncontrolled: Story = {
  render: () => html`
    <mac-radio-group
      default-value="c"
      @mac-change=${(e: CustomEvent) => console.log('change:', e.detail.value)}
    >
      <mac-radio value="a" label="Option A"></mac-radio>
      <mac-radio value="b" label="Option B"></mac-radio>
      <mac-radio value="c" label="Option C"></mac-radio>
    </mac-radio-group>
  `,
}
