import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-text-ellipsis'

const longText = `Apple 在 WWDC25 上发布了全新的 Liquid Glass 设计语言，这是一种灵感源自玻璃材质的视觉系统，为 iOS、macOS、iPadOS 等所有平台带来了统一而富有深度的界面风格。Liquid Glass 通过半透明、折射和动态模糊效果，让界面元素呈现出如同真实玻璃般的层次感与光影变化。开发者现在可以利用 SwiftUI 和新的 API 轻松地将 Liquid Glass 风格集成到自己的应用中。`

const mediumText = `SwiftUI 是 Apple 推出的现代声明式 UI 框架，让开发者能够以更少的代码构建更出色的应用。从 iOS 14 的 Widget 到 iOS 18 的新 API，SwiftUI 不断扩展其能力边界。`

const meta: Meta = {
  title: 'Components/TextEllipsis',
  component: 'mac-text-ellipsis',
  tags: ['autodocs'],
  argTypes: {
    lineClamp: {
      control: 'number',
      description: 'Maximum number of lines before truncating',
      table: { defaultValue: { summary: '3' } },
    },
    expandTrigger: {
      control: 'select',
      options: ['none', 'click'],
      description: 'How to trigger expand',
      table: { defaultValue: { summary: 'none' } },
    },
    expanded: {
      control: 'boolean',
      description: 'Whether the text is expanded',
    },
    tooltip: {
      control: 'boolean',
      description:
        'Show tooltip on hover when text is truncated (uses full text if no tooltip slot)',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    lineClamp: 3,
    expandTrigger: 'none',
    expanded: false,
    tooltip: false,
  },
}

export default meta
type Story = StoryObj

export const Basic: Story = {
  render: (args) => html`
    <div style="width: 400px;">
      <mac-text-ellipsis
        .lineClamp=${args.lineClamp}
        expand-trigger=${args.expandTrigger}
        ?expanded=${args.expanded}
      >
        ${longText}
      </mac-text-ellipsis>
    </div>
  `,
}

export const LineClamp2: Story = {
  args: { lineClamp: 2 },
  render: (args) => html`
    <div style="width: 400px;">
      <p style="font-size: 12px; color: #8e8ea0; margin-bottom: 8px;">line-clamp="2"</p>
      <mac-text-ellipsis
        .lineClamp=${args.lineClamp}
        expand-trigger=${args.expandTrigger}
        ?expanded=${args.expanded}
      >
        ${longText}
      </mac-text-ellipsis>
    </div>
  `,
}

export const LineClamp1: Story = {
  args: { lineClamp: 1 },
  render: (args) => html`
    <div style="width: 400px;">
      <p style="font-size: 12px; color: #8e8ea0; margin-bottom: 8px;">line-clamp="1" 单行省略</p>
      <mac-text-ellipsis
        .lineClamp=${args.lineClamp}
        expand-trigger=${args.expandTrigger}
        ?expanded=${args.expanded}
      >
        ${longText}
      </mac-text-ellipsis>
    </div>
  `,
}

export const ClickToExpand: Story = {
  args: { lineClamp: 3, expandTrigger: 'click' },
  render: (args) => html`
    <div style="width: 400px;">
      <p style="font-size: 12px; color: #8e8ea0; margin-bottom: 8px;">
        expand-trigger="click" 点击展开/收起
      </p>
      <mac-text-ellipsis
        .lineClamp=${args.lineClamp}
        expand-trigger=${args.expandTrigger}
        ?expanded=${args.expanded}
      >
        ${longText}
      </mac-text-ellipsis>
    </div>
  `,
}

export const ClickToExpandLine2: Story = {
  args: { lineClamp: 2, expandTrigger: 'click' },
  render: (args) => html`
    <div style="width: 400px;">
      <p style="font-size: 12px; color: #8e8ea0; margin-bottom: 8px;">
        line-clamp="2" + expand-trigger="click"
      </p>
      <mac-text-ellipsis
        .lineClamp=${args.lineClamp}
        expand-trigger=${args.expandTrigger}
        ?expanded=${args.expanded}
      >
        ${longText}
      </mac-text-ellipsis>
    </div>
  `,
}

export const WithTooltipSlot: Story = {
  args: { lineClamp: 2 },
  render: (args) => html`
    <div style="width: 400px;">
      <p style="font-size: 12px; color: #8e8ea0; margin-bottom: 8px;">
        悬停省略文本显示自定义 Tooltip (slot)
      </p>
      <mac-text-ellipsis
        .lineClamp=${args.lineClamp}
        expand-trigger=${args.expandTrigger}
        ?expanded=${args.expanded}
      >
        ${longText}
        <span slot="tooltip">${longText}</span>
      </mac-text-ellipsis>
    </div>
  `,
}

export const WithTooltipBoolean: Story = {
  args: { lineClamp: 2, tooltip: true },
  render: (args) => html`
    <div style="width: 400px;">
      <p style="font-size: 12px; color: #8e8ea0; margin-bottom: 8px;">
        悬停省略文本显示默认 Tooltip (boolean)
      </p>
      <mac-text-ellipsis
        .lineClamp=${args.lineClamp}
        expand-trigger=${args.expandTrigger}
        ?expanded=${args.expanded}
        ?tooltip=${args.tooltip}
      >
        ${longText}
      </mac-text-ellipsis>
    </div>
  `,
}

export const WithTooltipAndExpand: Story = {
  args: { lineClamp: 2, expandTrigger: 'click', tooltip: true },
  render: (args) => html`
    <div style="width: 400px;">
      <p style="font-size: 12px; color: #8e8ea0; margin-bottom: 8px;">
        expand-trigger="click" + tooltip boolean
      </p>
      <mac-text-ellipsis
        .lineClamp=${args.lineClamp}
        expand-trigger=${args.expandTrigger}
        ?expanded=${args.expanded}
        ?tooltip=${args.tooltip}
      >
        ${longText}
      </mac-text-ellipsis>
    </div>
  `,
}

export const ShortText: Story = {
  args: { lineClamp: 3, expandTrigger: 'click' },
  render: (args) => html`
    <div style="width: 400px;">
      <p style="font-size: 12px; color: #8e8ea0; margin-bottom: 8px;">
        文本未超出时不显示省略和展开
      </p>
      <mac-text-ellipsis
        .lineClamp=${args.lineClamp}
        expand-trigger=${args.expandTrigger}
        ?expanded=${args.expanded}
      >
        ${mediumText}
      </mac-text-ellipsis>
    </div>
  `,
}

export const DifferentWidths: Story = {
  args: { lineClamp: 2, expandTrigger: 'click', tooltip: true },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <div style="width: 300px;">
        <p style="font-size: 12px; color: #8e8ea0; margin-bottom: 8px;">width: 300px</p>
        <mac-text-ellipsis
          .lineClamp=${args.lineClamp}
          expand-trigger=${args.expandTrigger}
          ?expanded=${args.expanded}
        >
          ${longText}
        </mac-text-ellipsis>
      </div>
      <div style="width: 500px;">
        <p style="font-size: 12px; color: #8e8ea0; margin-bottom: 8px;">width: 500px</p>
        <mac-text-ellipsis
          .lineClamp=${args.lineClamp}
          expand-trigger=${args.expandTrigger}
          ?expanded=${args.expanded}
        >
          ${longText}
        </mac-text-ellipsis>
      </div>
      <div style="width: 100%;">
        <p style="font-size: 12px; color: #8e8ea0; margin-bottom: 8px;">width: 100%</p>
        <mac-text-ellipsis
          .lineClamp=${args.lineClamp}
          expand-trigger=${args.expandTrigger}
          ?expanded=${args.expanded}
          ?tooltip=${args.tooltip}
        >
          ${longText}
        </mac-text-ellipsis>
      </div>
    </div>
  `,
}
