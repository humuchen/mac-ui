import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-input-number'

const meta: Meta = {
  title: 'Components/InputNumber',
  component: 'mac-input-number',
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    precision: { control: 'number' },
    placeholder: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'filled', 'glass', 'underline'] },
    status: { control: 'select', options: ['error', 'warning', 'success', undefined] },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    showButton: { control: 'boolean' },
    buttonPlacement: { control: 'select', options: ['inside', 'outside'] },
    clearable: { control: 'boolean' },
    keyboard: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: {
    value: 0,
    placeholder: 'Enter a number',
  },
  render: (args) => html`
    <mac-input-number
      .value=${args.value}
      placeholder=${args.placeholder}
      @mac-input-number=${(e: CustomEvent) => console.log('input-number:', e.detail.value)}
    ></mac-input-number>
  `,
}

export const MinMax: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <mac-input-number .value=${10} min=${0} max=${100} placeholder="0 ~ 100"></mac-input-number>
      <mac-input-number
        .value=${50}
        min=${0}
        max=${100}
        step=${10}
        placeholder="Step 10"
      ></mac-input-number>
    </div>
  `,
}

export const Precision: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <mac-input-number
        .value=${3.14159}
        precision=${2}
        step=${0.01}
        placeholder="2 decimal places"
      ></mac-input-number>
      <mac-input-number
        .value=${3.14159}
        precision=${4}
        step=${0.0001}
        placeholder="4 decimal places"
      ></mac-input-number>
    </div>
  `,
}

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <mac-input-number size="sm" .value=${10}></mac-input-number>
      <mac-input-number size="md" .value=${10}></mac-input-number>
      <mac-input-number size="lg" .value=${10}></mac-input-number>
    </div>
  `,
}

export const Variants: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <mac-input-number variant="default" .value=${10}></mac-input-number>
      <mac-input-number variant="filled" .value=${10}></mac-input-number>
      <mac-input-number variant="glass" .value=${10}></mac-input-number>
      <mac-input-number variant="underline" .value=${10}></mac-input-number>
    </div>
  `,
}

export const Status: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <mac-input-number status="error" .value=${10}></mac-input-number>
      <mac-input-number status="warning" .value=${10}></mac-input-number>
      <mac-input-number status="success" .value=${10}></mac-input-number>
    </div>
  `,
}

export const ButtonPlacement: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <mac-input-number button-placement="inside" .value=${10}></mac-input-number>
      <mac-input-number button-placement="outside" .value=${10}></mac-input-number>
    </div>
  `,
}

export const HideButton: Story = {
  render: () => html` <mac-input-number ?show-button=${false} .value=${10}></mac-input-number> `,
}

export const Disabled: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <mac-input-number disabled .value=${10}></mac-input-number>
      <mac-input-number readonly .value=${10}></mac-input-number>
    </div>
  `,
}

export const Clearable: Story = {
  render: () => html` <mac-input-number clearable .value=${10}></mac-input-number> `,
}

export const PrefixSuffix: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <mac-input-number .value=${100}>
        <span slot="prefix">$</span>
      </mac-input-number>
      <mac-input-number .value=${50}>
        <span slot="suffix">%</span>
      </mac-input-number>
    </div>
  `,
}

export const Keyboard: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:8px;">
      <mac-input-number
        .value=${10}
        min=${0}
        max=${100}
        step=${5}
        placeholder="Try arrow keys, PageUp/PageDown, Home/End"
      ></mac-input-number>
      <p style="font-size:12px;color:var(--md-color-text-secondary);">
        Arrow Up/Down: ±step | Page Up/Down: ±10×step | Home: min | End: max
      </p>
    </div>
  `,
}

export const Uncontrolled: Story = {
  render: () => html`
    <mac-input-number
      default-value=${20}
      min=${0}
      max=${100}
      @mac-input-number=${(e: CustomEvent) => console.log('value:', e.detail.value)}
      @mac-change=${(e: CustomEvent) => console.log('change:', e.detail.value)}
    ></mac-input-number>
  `,
}
