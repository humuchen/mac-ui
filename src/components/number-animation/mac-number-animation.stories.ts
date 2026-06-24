import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-number-animation'
import type { MacNumberAnimation } from './mac-number-animation'

const meta: Meta = {
  title: 'Components/NumberAnimation',
  component: 'mac-number-animation',
  tags: ['autodocs'],
  argTypes: {
    to: {
      control: 'number',
      description: 'Target value to animate to',
      table: { defaultValue: { summary: '0' } },
    },
    from: {
      control: 'number',
      description: 'Starting value',
      table: { defaultValue: { summary: '0' } },
    },
    duration: {
      control: 'number',
      description: 'Animation duration in ms',
      table: { defaultValue: { summary: '2000' } },
    },
    precision: {
      control: { type: 'number', min: 0, max: 6 },
      description: 'Number of decimal places',
      table: { defaultValue: { summary: '0' } },
    },
    separator: {
      control: 'text',
      description: 'Thousands separator character',
      table: { defaultValue: { summary: '' } },
    },
    easing: {
      control: 'select',
      options: ['linear', 'easeIn', 'easeOut', 'easeInOut'],
      description: 'Easing function',
      table: { defaultValue: { summary: 'easeOut' } },
    },
    autoplay: {
      control: 'boolean',
      description: 'Auto-start animation on connect',
      table: { defaultValue: { summary: 'true' } },
    },
    prefix: {
      control: 'text',
      description: 'Prefix text',
    },
    suffix: {
      control: 'text',
      description: 'Suffix text',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Component size',
      table: { defaultValue: { summary: 'md' } },
    },
  },
  args: {
    to: 1000,
    from: 0,
    duration: 2000,
    precision: 0,
    separator: '',
    easing: 'easeOut',
    autoplay: true,
    prefix: '',
    suffix: '',
    size: 'md',
  },
}

export default meta
type Story = StoryObj

export const Basic: Story = {
  render: (args) => html`
    <mac-number-animation
      .to=${args.to}
      .from=${args.from}
      .duration=${args.duration}
      .precision=${args.precision}
      .separator=${args.separator}
      .easing=${args.easing}
      ?autoplay=${args.autoplay}
      .prefix=${args.prefix}
      .suffix=${args.suffix}
      .size=${args.size}
    ></mac-number-animation>
  `,
}

export const WithSeparator: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <mac-number-animation to="1234567" separator="," duration="2500"></mac-number-animation>
      <mac-number-animation
        to="9876543.21"
        separator=" "
        precision="2"
        duration="2500"
      ></mac-number-animation>
    </div>
  `,
}

export const WithPrecision: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">2 decimal places</div>
        <mac-number-animation to="99.86" precision="2" duration="2000"></mac-number-animation>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">4 decimal places</div>
        <mac-number-animation to="3.1416" precision="4" duration="2000"></mac-number-animation>
      </div>
    </div>
  `,
}

export const WithPrefixSuffix: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <mac-number-animation
        to="12800"
        prefix="¥"
        separator=","
        duration="2000"
      ></mac-number-animation>
      <mac-number-animation
        to="99.9"
        prefix="$"
        suffix="M"
        precision="1"
        duration="2000"
      ></mac-number-animation>
      <mac-number-animation
        to="2048"
        suffix="MB"
        separator=","
        duration="2000"
      ></mac-number-animation>
    </div>
  `,
}

export const EasingComparison: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">linear</div>
        <mac-number-animation
          to="1000"
          easing="linear"
          duration="3000"
          size="sm"
        ></mac-number-animation>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">easeIn</div>
        <mac-number-animation
          to="1000"
          easing="easeIn"
          duration="3000"
          size="sm"
        ></mac-number-animation>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">easeOut</div>
        <mac-number-animation
          to="1000"
          easing="easeOut"
          duration="3000"
          size="sm"
        ></mac-number-animation>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">easeInOut</div>
        <mac-number-animation
          to="1000"
          easing="easeInOut"
          duration="3000"
          size="sm"
        ></mac-number-animation>
      </div>
    </div>
  `,
}

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Small</div>
        <mac-number-animation
          to="1024"
          size="sm"
          separator=","
          duration="2000"
        ></mac-number-animation>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Medium (default)</div>
        <mac-number-animation
          to="1024"
          size="md"
          separator=","
          duration="2000"
        ></mac-number-animation>
      </div>
      <div>
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Large</div>
        <mac-number-animation
          to="1024"
          size="lg"
          separator=","
          duration="2000"
        ></mac-number-animation>
      </div>
    </div>
  `,
}

export const Countdown: Story = {
  render: () => html`
    <mac-number-animation
      from="100"
      to="0"
      duration="5000"
      suffix="s"
      easing="linear"
    ></mac-number-animation>
  `,
}

export const ManualControl: Story = {
  render: () => {
    return html`
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;">
        <mac-number-animation
          id="manual-anim"
          to="5000"
          from="0"
          separator=","
          duration="2000"
          .autoplay=${false}
        ></mac-number-animation>
        <div style="display: flex; gap: 8px;">
          <mac-button
            size="sm"
            variant="primary"
            @click=${() => {
              const el = document.getElementById('manual-anim') as MacNumberAnimation
              el?.start()
            }}
            >Start</mac-button
          >
          <mac-button
            size="sm"
            @click=${() => {
              const el = document.getElementById('manual-anim') as MacNumberAnimation
              el?.reset()
            }}
            >Reset</mac-button
          >
        </div>
      </div>
    `
  },
}

export const FinishCallback: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
      <mac-number-animation
        id="callback-anim"
        to="9999"
        separator=","
        duration="2500"
      ></mac-number-animation>
      <div id="callback-msg" style="font-size: 13px; color: #22c55e; min-height: 20px;"></div>
      <mac-button
        size="sm"
        variant="primary"
        @click=${() => {
          const el = document.getElementById('callback-anim') as any
          const msg = document.getElementById('callback-msg')
          if (msg) msg.textContent = ''
          el.onFinish = (value: number) => {
            if (msg) msg.textContent = `Animation finished! Final value: ${value}`
          }
          el.start()
        }}
        >Replay with callback</mac-button
      >
    </div>
  `,
}

export const SlotPrefixSuffix: Story = {
  render: () => html`
    <mac-number-animation to="8848" suffix="m" separator="," duration="2000">
      <span slot="prefix" style="font-size: 14px; color: #3b82f6; margin-right: 4px;">🏔️</span>
    </mac-number-animation>
  `,
}
