import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-progress'

const meta: Meta = {
  title: 'Components/Progress',
  component: 'mac-progress',
  tags: ['autodocs'],
  argTypes: {
    percentage: {
      control: { type: 'range', min: 0, max: 100 },
      description: 'The current progress percentage (0-100)',
      table: { defaultValue: { summary: '0' } },
    },
    type: {
      control: 'select',
      options: ['line', 'circle'],
      description: 'The type of progress indicator',
      table: { defaultValue: { summary: 'line' } },
    },
    status: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: 'The status of the progress',
      table: { defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the progress component',
      table: { defaultValue: { summary: 'md' } },
    },
    showText: {
      control: 'boolean',
      description: 'Whether to show the percentage text',
      table: { defaultValue: { summary: 'true' } },
    },
    processing: {
      control: 'boolean',
      description: 'Whether the progress is in processing state',
      table: { defaultValue: { summary: 'false' } },
    },
    color: {
      control: 'color',
      description: 'Custom color for the progress fill',
    },
    strokeWidth: {
      control: { type: 'number' },
      description: 'The width of the stroke for circle progress',
      table: { defaultValue: { summary: '6' } },
    },
    width: {
      control: { type: 'number' },
      description: 'The width/height of the circle progress',
      table: { defaultValue: { summary: '120' } },
    },
    circles: {
      control: 'object',
      description:
        'Multiple circle configurations for nested ring display. Each item: { percentage, color?, strokeWidth? }',
    },
    gradient: {
      control: 'object',
      description:
        'Gradient configuration. Use { from, to, angle? } for two-color, or { angle?, stops: [{ color, offset? }, ...] } for custom multi-stop gradient',
    },
  },
  args: {
    percentage: 50,
    type: 'line',
    status: 'default',
    size: 'md',
    showText: true,
    processing: false,
    strokeWidth: 6,
    width: 120,
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  args: {
    percentage: 50,
    type: 'line',
    status: 'default',
  },
  render: (args) =>
    html`<mac-progress
      .percentage=${args.percentage}
      type=${args.type}
      status=${args.status}
      size=${args.size}
      ?showText=${args.showText}
      ?processing=${args.processing}
      color=${args.color || ''}
      .strokeWidth=${args.strokeWidth}
      .width=${args.width}
    ></mac-progress>`,
}

export const LineSizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
      <mac-progress size="sm" percentage="30"></mac-progress>
      <mac-progress size="md" percentage="50"></mac-progress>
      <mac-progress size="lg" percentage="75"></mac-progress>
    </div>
  `,
}

export const LineStatuses: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
      <mac-progress status="default" percentage="40"></mac-progress>
      <mac-progress status="success" percentage="60"></mac-progress>
      <mac-progress status="warning" percentage="80"></mac-progress>
      <mac-progress status="error" percentage="95"></mac-progress>
    </div>
  `,
}

export const WithoutText: Story = {
  args: {
    showText: false,
    percentage: 65,
  },
  render: (args) =>
    html`<mac-progress
      .percentage=${args.percentage}
      type=${args.type}
      status=${args.status}
      size=${args.size}
      ?showText=${args.showText}
      ?processing=${args.processing}
    ></mac-progress>`,
}

export const CustomColor: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
      <mac-progress color="#8b5cf6" percentage="35"></mac-progress>
      <mac-progress color="#ec4899" percentage="55"></mac-progress>
      <mac-progress color="#06b6d4" percentage="75"></mac-progress>
    </div>
  `,
}

export const LineGradient: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
      <mac-progress percentage="35" .gradient=${{ from: '#3b82f6', to: '#22c55e' }}></mac-progress>
      <mac-progress
        percentage="55"
        .gradient=${{ from: '#ec4899', to: '#f59e0b', angle: 45 }}
      ></mac-progress>
      <mac-progress
        percentage="75"
        .gradient=${{ from: '#06b6d4', to: '#8b5cf6', angle: 90 }}
      ></mac-progress>
    </div>
  `,
}

export const LineGradientCustomStops: Story = {
  name: 'Line Gradient (Custom Stops)',
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
      <mac-progress
        percentage="60"
        .gradient=${{
          angle: 90,
          stops: [
            { color: '#3b82f6', offset: 0 },
            { color: '#22c55e', offset: 50 },
            { color: '#f59e0b', offset: 100 },
          ],
        }}
      ></mac-progress>
      <mac-progress
        percentage="75"
        .gradient=${{
          angle: 45,
          stops: [
            { color: '#ec4899', offset: 0 },
            { color: '#8b5cf6', offset: 30 },
            { color: '#3b82f6', offset: 70 },
            { color: '#22c55e', offset: 100 },
          ],
        }}
      ></mac-progress>
    </div>
  `,
}

export const LineProcessing: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
      <mac-progress processing></mac-progress>
      <mac-progress processing status="success"></mac-progress>
      <mac-progress processing status="warning"></mac-progress>
      <mac-progress processing status="error"></mac-progress>
    </div>
  `,
}

export const CircleDefault: Story = {
  args: {
    type: 'circle',
    percentage: 65,
  },
  render: (args) =>
    html`<mac-progress
      .percentage=${args.percentage}
      type=${args.type}
      status=${args.status}
      size=${args.size}
      ?showText=${args.showText}
      ?processing=${args.processing}
      .strokeWidth=${args.strokeWidth}
      .width=${args.width}
    ></mac-progress>`,
}

export const CircleStatuses: Story = {
  render: () => html`
    <div style="display: flex; gap: 32px; align-items: center;">
      <mac-progress type="circle" status="default" percentage="40"></mac-progress>
      <mac-progress type="circle" status="success" percentage="60"></mac-progress>
      <mac-progress type="circle" status="warning" percentage="80"></mac-progress>
      <mac-progress type="circle" status="error" percentage="95"></mac-progress>
    </div>
  `,
}

export const CircleSizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 32px; align-items: center;">
      <mac-progress type="circle" percentage="30" width="60" strokeWidth="4"></mac-progress>
      <mac-progress type="circle" percentage="50" width="100" strokeWidth="6"></mac-progress>
      <mac-progress type="circle" percentage="75" width="140" strokeWidth="8"></mac-progress>
    </div>
  `,
}

export const CircleCustomColor: Story = {
  render: () => html`
    <div style="display: flex; gap: 32px; align-items: center;">
      <mac-progress type="circle" color="#8b5cf6" percentage="35"></mac-progress>
      <mac-progress type="circle" color="#ec4899" percentage="55"></mac-progress>
      <mac-progress type="circle" color="#06b6d4" percentage="75"></mac-progress>
    </div>
  `,
}

export const CircleGradient: Story = {
  render: () => html`
    <div style="display: flex; gap: 32px; align-items: center;">
      <mac-progress
        type="circle"
        percentage="35"
        .gradient=${{ from: '#3b82f6', to: '#22c55e' }}
      ></mac-progress>
      <mac-progress
        type="circle"
        percentage="55"
        .gradient=${{ from: '#ec4899', to: '#f59e0b' }}
      ></mac-progress>
      <mac-progress
        type="circle"
        percentage="75"
        .gradient=${{ from: '#06b6d4', to: '#8b5cf6' }}
      ></mac-progress>
    </div>
  `,
}

export const CircleGradientCustomStops: Story = {
  name: 'Circle Gradient (Custom Stops)',
  render: () => html`
    <div style="display: flex; gap: 32px; align-items: center;">
      <mac-progress
        type="circle"
        percentage="60"
        .gradient=${{
          stops: [
            { color: '#3b82f6', offset: 0 },
            { color: '#22c55e', offset: 50 },
            { color: '#f59e0b', offset: 100 },
          ],
        }}
      ></mac-progress>
      <mac-progress
        type="circle"
        percentage="75"
        .gradient=${{
          angle: 45,
          stops: [
            { color: '#ec4899', offset: 0 },
            { color: '#8b5cf6', offset: 30 },
            { color: '#3b82f6', offset: 70 },
            { color: '#22c55e', offset: 100 },
          ],
        }}
      ></mac-progress>
    </div>
  `,
}

export const CircleProcessing: Story = {
  render: () => html`
    <div style="display: flex; gap: 32px; align-items: center;">
      <mac-progress type="circle" processing></mac-progress>
      <mac-progress type="circle" processing status="success"></mac-progress>
      <mac-progress type="circle" processing status="warning"></mac-progress>
      <mac-progress type="circle" processing status="error"></mac-progress>
    </div>
  `,
}

export const CircleWithoutText: Story = {
  args: {
    type: 'circle',
    percentage: 70,
    showText: false,
  },
  render: (args) =>
    html`<mac-progress
      .percentage=${args.percentage}
      type=${args.type}
      status=${args.status}
      size=${args.size}
      ?showText=${args.showText}
      ?processing=${args.processing}
      .strokeWidth=${args.strokeWidth}
      .width=${args.width}
    ></mac-progress>`,
}

export const MultiCircle: Story = {
  render: () => html`
    <div style="display: flex; gap: 32px; align-items: center;">
      <mac-progress
        type="circle"
        width="140"
        .circles=${[
          { percentage: 80, color: '#3b82f6', strokeWidth: 8 },
          { percentage: 60, color: '#22c55e', strokeWidth: 6 },
        ]}
      ></mac-progress>
      <mac-progress
        type="circle"
        width="140"
        .circles=${[
          { percentage: 90, color: '#ec4899', strokeWidth: 6 },
          { percentage: 70, color: '#f59e0b', strokeWidth: 5 },
          { percentage: 45, color: '#06b6d4', strokeWidth: 4 },
        ]}
      ></mac-progress>
    </div>
  `,
}

export const MultiCircleWithGradient: Story = {
  render: () => html`
    <div style="display: flex; gap: 32px; align-items: center;">
      <mac-progress
        type="circle"
        width="160"
        .gradient=${{ from: '#3b82f6', to: '#22c55e' }}
        .circles=${[
          { percentage: 80, strokeWidth: 10 },
          { percentage: 55, strokeWidth: 8 },
          { percentage: 30, strokeWidth: 6 },
        ]}
      ></mac-progress>
      <mac-progress
        type="circle"
        width="160"
        .gradient=${{ from: '#ec4899', to: '#f59e0b', angle: 45 }}
        .circles=${[
          { percentage: 75, strokeWidth: 10 },
          { percentage: 50, strokeWidth: 8 },
          { percentage: 25, strokeWidth: 6 },
        ]}
      ></mac-progress>
    </div>
  `,
}

export const MultiCircleProcessing: Story = {
  render: () => html`
    <div style="display: flex; gap: 32px; align-items: center;">
      <mac-progress
        type="circle"
        width="140"
        processing
        .circles=${[
          { percentage: 80, color: '#3b82f6', strokeWidth: 8 },
          { percentage: 60, color: '#22c55e', strokeWidth: 6 },
        ]}
      ></mac-progress>
      <mac-progress
        type="circle"
        width="140"
        processing
        .circles=${[
          { percentage: 90, color: '#ec4899', strokeWidth: 6 },
          { percentage: 70, color: '#f59e0b', strokeWidth: 5 },
          { percentage: 45, color: '#06b6d4', strokeWidth: 4 },
        ]}
      ></mac-progress>
    </div>
  `,
}

export const RacingCircles: Story = {
  name: '圈圈赛跑',
  render: () => html`
    <div
      style="display: flex; gap: 48px; align-items: center; justify-content: center; padding: 48px; background: #1a1a2e; border-radius: 12px;"
    >
      <mac-progress
        type="circle"
        width="200"
        percentage="0"
        .circles=${[
          { percentage: 88, color: '#87CEEB', strokeWidth: 10 },
          { percentage: 72, color: '#2E8B57', strokeWidth: 9 },
          { percentage: 58, color: '#8B5A3C', strokeWidth: 8 },
          { percentage: 42, color: '#FF8FAB', strokeWidth: 7 },
          { percentage: 28, color: '#FFD166', strokeWidth: 6 },
        ]}
      >
        <span slot="text" style="font-size: 14px; color: #fff;">圈圈赛跑！</span>
      </mac-progress>
    </div>
  `,
}
