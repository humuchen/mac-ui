import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-split'

const meta: Meta = {
  title: 'Components/Split',
  component: 'mac-split',
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The split direction',
      table: { defaultValue: { summary: 'horizontal' } },
    },
    split: {
      control: 'number',
      description: 'The split value (ratio 0-1 or pixel)',
      table: { defaultValue: { summary: '0.5' } },
    },
    unit: {
      control: 'select',
      options: ['ratio', 'pixel'],
      description: 'The unit of split value',
      table: { defaultValue: { summary: 'ratio' } },
    },
    min: {
      control: 'number',
      description: 'Minimum size of the first panel in pixels',
      table: { defaultValue: { summary: '0' } },
    },
    max: {
      control: 'number',
      description: 'Maximum size of the first panel in pixels (0 = no limit)',
      table: { defaultValue: { summary: '0' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables resizing',
    },
  },
  args: {
    direction: 'horizontal',
    split: 0.5,
    unit: 'ratio',
    min: 0,
    max: 0,
    disabled: false,
  },
}

export default meta
type Story = StoryObj

export const Basic: Story = {
  render: (args) => html`
    <div style="height: 300px;">
      <mac-split
        direction=${args.direction}
        .split=${args.split}
        unit=${args.unit}
        .min=${args.min}
        .max=${args.max}
        ?disabled=${args.disabled}
      >
        <div
          slot="first"
          style="padding: 16px; background: var(--md-color-bg-secondary); height: 100%; box-sizing: border-box;"
        >
          First Panel
        </div>
        <div
          slot="second"
          style="padding: 16px; background: var(--md-color-bg); height: 100%; box-sizing: border-box;"
        >
          Second Panel
        </div>
      </mac-split>
    </div>
  `,
}

export const Horizontal: Story = {
  args: { direction: 'horizontal', split: 0.4 },
  render: (args) => html`
    <div style="height: 300px;">
      <mac-split
        direction=${args.direction}
        .split=${args.split}
        unit=${args.unit}
        .min=${args.min}
        .max=${args.max}
        ?disabled=${args.disabled}
      >
        <div
          slot="first"
          style="padding: 16px; background: var(--md-color-bg-secondary); height: 100%; box-sizing: border-box;"
        >
          <h4 style="margin: 0 0 8px;">Sidebar</h4>
          <p style="margin: 0; color: var(--md-color-text-secondary);">
            Drag the resizer to adjust the width.
          </p>
        </div>
        <div
          slot="second"
          style="padding: 16px; background: var(--md-color-bg); height: 100%; box-sizing: border-box;"
        >
          <h4 style="margin: 0 0 8px;">Main Content</h4>
          <p style="margin: 0; color: var(--md-color-text-secondary);">
            This area expands to fill the remaining space.
          </p>
        </div>
      </mac-split>
    </div>
  `,
}

export const Vertical: Story = {
  args: { direction: 'vertical', split: 0.35 },
  render: (args) => html`
    <div style="height: 400px;">
      <mac-split
        direction=${args.direction}
        .split=${args.split}
        unit=${args.unit}
        .min=${args.min}
        .max=${args.max}
        ?disabled=${args.disabled}
      >
        <div
          slot="first"
          style="padding: 16px; background: var(--md-color-bg-secondary); height: 100%; box-sizing: border-box;"
        >
          <h4 style="margin: 0 0 8px;">Top Panel</h4>
          <p style="margin: 0; color: var(--md-color-text-secondary);">
            Drag the resizer to adjust the height.
          </p>
        </div>
        <div
          slot="second"
          style="padding: 16px; background: var(--md-color-bg); height: 100%; box-sizing: border-box;"
        >
          <h4 style="margin: 0 0 8px;">Bottom Panel</h4>
          <p style="margin: 0; color: var(--md-color-text-secondary);">
            This area expands to fill the remaining space.
          </p>
        </div>
      </mac-split>
    </div>
  `,
}

export const WithMinMax: Story = {
  args: { min: 100, max: 400 },
  render: (args) => html`
    <div style="height: 300px;">
      <mac-split
        direction=${args.direction}
        .split=${args.split}
        unit=${args.unit}
        .min=${args.min}
        .max=${args.max}
        ?disabled=${args.disabled}
      >
        <div
          slot="first"
          style="padding: 16px; background: var(--md-color-bg-secondary); height: 100%; box-sizing: border-box;"
        >
          <h4 style="margin: 0 0 8px;">Constrained Panel</h4>
          <p style="margin: 0; color: var(--md-color-text-secondary);">Min: 100px, Max: 400px</p>
        </div>
        <div
          slot="second"
          style="padding: 16px; background: var(--md-color-bg); height: 100%; box-sizing: border-box;"
        >
          <h4 style="margin: 0 0 8px;">Free Panel</h4>
          <p style="margin: 0; color: var(--md-color-text-secondary);">
            This panel adjusts based on the constrained panel.
          </p>
        </div>
      </mac-split>
    </div>
  `,
}

export const Disabled: Story = {
  args: { disabled: true, split: 0.3 },
  render: (args) => html`
    <div style="height: 300px;">
      <mac-split
        direction=${args.direction}
        .split=${args.split}
        unit=${args.unit}
        .min=${args.min}
        .max=${args.max}
        ?disabled=${args.disabled}
      >
        <div
          slot="first"
          style="padding: 16px; background: var(--md-color-bg-secondary); height: 100%; box-sizing: border-box;"
        >
          <h4 style="margin: 0 0 8px;">Fixed Panel</h4>
          <p style="margin: 0; color: var(--md-color-text-secondary);">Resizing is disabled.</p>
        </div>
        <div
          slot="second"
          style="padding: 16px; background: var(--md-color-bg); height: 100%; box-sizing: border-box;"
        >
          <h4 style="margin: 0 0 8px;">Main Content</h4>
        </div>
      </mac-split>
    </div>
  `,
}

export const PixelUnit: Story = {
  args: { unit: 'pixel', split: 200 },
  render: (args) => html`
    <div style="height: 300px;">
      <mac-split
        direction=${args.direction}
        .split=${args.split}
        unit=${args.unit}
        .min=${args.min}
        .max=${args.max}
        ?disabled=${args.disabled}
      >
        <div
          slot="first"
          style="padding: 16px; background: var(--md-color-bg-secondary); height: 100%; box-sizing: border-box;"
        >
          <h4 style="margin: 0 0 8px;">Fixed 200px</h4>
          <p style="margin: 0; color: var(--md-color-text-secondary);">Size is in pixels.</p>
        </div>
        <div
          slot="second"
          style="padding: 16px; background: var(--md-color-bg); height: 100%; box-sizing: border-box;"
        >
          <h4 style="margin: 0 0 8px;">Flexible Panel</h4>
        </div>
      </mac-split>
    </div>
  `,
}

export const Nested: Story = {
  render: () => html`
    <div style="height: 400px;">
      <mac-split direction="horizontal" .split=${0.3}>
        <div
          slot="first"
          style="padding: 16px; background: var(--md-color-bg-secondary); height: 100%; box-sizing: border-box;"
        >
          Left Sidebar
        </div>
        <mac-split slot="second" direction="vertical" .split=${0.4} style="height: 100%;">
          <div
            slot="first"
            style="padding: 16px; background: var(--md-color-bg); height: 100%; box-sizing: border-box;"
          >
            Top Content
          </div>
          <div
            slot="second"
            style="padding: 16px; background: var(--md-color-bg-secondary); height: 100%; box-sizing: border-box;"
          >
            Bottom Content
          </div>
        </mac-split>
      </mac-split>
    </div>
  `,
}

export const WithCards: Story = {
  render: () => html`
    <div style="height: 400px;">
      <mac-split direction="horizontal" .split=${0.5}>
        <mac-card
          slot="first"
          variant="elevated"
          style="height: 100%; display: flex; flex-direction: column;"
        >
          <div slot="header" style="font-weight: 600;">Left Card</div>
          <div style="flex: 1; padding: 16px;">
            <p>Content inside a card on the left panel.</p>
            <mac-button variant="primary">Action</mac-button>
          </div>
        </mac-card>
        <mac-card
          slot="second"
          variant="glass"
          style="height: 100%; display: flex; flex-direction: column;"
        >
          <div slot="header" style="font-weight: 600;">Right Card</div>
          <div style="flex: 1; padding: 16px;">
            <p>Content inside a glass card on the right panel.</p>
            <mac-button variant="secondary">Cancel</mac-button>
          </div>
        </mac-card>
      </mac-split>
    </div>
  `,
}
