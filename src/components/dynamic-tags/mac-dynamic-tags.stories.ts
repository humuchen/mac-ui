import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-dynamic-tags'
import '../tag/mac-tag'

const meta: Meta = {
  title: 'Data Entry/Dynamic Tags',
  component: 'mac-dynamic-tags',
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'object' },
    defaultValue: { control: 'object' },
    disabled: { control: 'boolean' },
    max: { control: 'number' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    type: { control: 'select', options: ['default', 'primary', 'success', 'warning', 'danger', 'info'] },
    round: { control: 'boolean' },
    bordered: { control: 'boolean' },
    closable: { control: 'boolean' },
    inputPlaceholder: { control: 'text' },
    inputMaxLength: { control: 'number' },
  },
  parameters: {
    docs: {
      description: {
        component: 'A dynamic tags component for adding and removing tags.',
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => html`
    <mac-dynamic-tags
      .defaultValue=${['标签1', '标签2', '标签3']}
      input-placeholder="请输入标签"
    ></mac-dynamic-tags>
  `,
}

export const Types: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <mac-dynamic-tags
        .defaultValue=${['默认', '样式']}
        type="default"
        input-placeholder="默认"
      ></mac-dynamic-tags>
      <mac-dynamic-tags
        .defaultValue=${['主要', '样式']}
        type="primary"
        input-placeholder="主要"
      ></mac-dynamic-tags>
      <mac-dynamic-tags
        .defaultValue=${['成功', '样式']}
        type="success"
        input-placeholder="成功"
      ></mac-dynamic-tags>
      <mac-dynamic-tags
        .defaultValue=${['警告', '样式']}
        type="warning"
        input-placeholder="警告"
      ></mac-dynamic-tags>
      <mac-dynamic-tags
        .defaultValue=${['危险', '样式']}
        type="danger"
        input-placeholder="危险"
      ></mac-dynamic-tags>
      <mac-dynamic-tags
        .defaultValue=${['信息', '样式']}
        type="info"
        input-placeholder="信息"
      ></mac-dynamic-tags>
    </div>
  `,
}

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <mac-dynamic-tags
        .defaultValue=${['Small']}
        size="sm"
        input-placeholder="Small"
      ></mac-dynamic-tags>
      <mac-dynamic-tags
        .defaultValue=${['Medium']}
        size="md"
        input-placeholder="Medium"
      ></mac-dynamic-tags>
      <mac-dynamic-tags
        .defaultValue=${['Large']}
        size="lg"
        input-placeholder="Large"
      ></mac-dynamic-tags>
    </div>
  `,
}

export const Round: Story = {
  render: () => html`
    <mac-dynamic-tags
      .defaultValue=${['圆角', '标签']}
      round
      type="primary"
      input-placeholder="请输入"
    ></mac-dynamic-tags>
  `,
}

export const Disabled: Story = {
  render: () => html`
    <mac-dynamic-tags
      .defaultValue=${['不可', '编辑']}
      disabled
      input-placeholder="请输入"
    ></mac-dynamic-tags>
  `,
}

export const MaxCount: Story = {
  render: () => html`
    <mac-dynamic-tags
      .defaultValue=${['标签1', '标签2']}
      .max=${4}
      input-placeholder="最多4个"
    ></mac-dynamic-tags>
  `,
}

export const NotClosable: Story = {
  render: () => html`
    <mac-dynamic-tags
      .defaultValue=${['不可', '删除']}
      .closable=${false}
      input-placeholder="请输入"
    ></mac-dynamic-tags>
  `,
}

export const Unbordered: Story = {
  render: () => html`
    <mac-dynamic-tags
      .defaultValue=${['无边框', '标签']}
      .bordered=${false}
      type="primary"
      input-placeholder="请输入"
    ></mac-dynamic-tags>
  `,
}

export const Controlled: Story = {
  render: () => {
    const handleUpdate = (e: CustomEvent) => {
      const el = document.getElementById('controlled-tags') as any
      if (el) {
        el.value = e.detail.value
      }
    }
    return html`
      <mac-dynamic-tags
        id="controlled-tags"
        .value=${['受控', '标签']}
        input-placeholder="请输入"
        @mac-update=${handleUpdate}
      ></mac-dynamic-tags>
    `
  },
}

export const WithMaxLength: Story = {
  render: () => html`
    <mac-dynamic-tags
      .defaultValue=${[]}
      input-placeholder="最多10个字符"
      .inputMaxLength=${10}
    ></mac-dynamic-tags>
  `,
}
