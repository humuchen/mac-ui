import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-checkbox'

const meta: Meta = {
  title: 'Data Entry/Checkbox',
  component: 'mac-checkbox',
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    value: { control: 'text' },
    label: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  parameters: {
    docs: {
      description: {
        component: 'A checkbox component with macOS-style design.',
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => html`
    <mac-checkbox>选项</mac-checkbox>
    <mac-checkbox checked>已选中</mac-checkbox>
  `,
}

export const Checked: Story = {
  render: () => html` <mac-checkbox .defaultChecked=${true}>默认选中</mac-checkbox> `,
}

export const Indeterminate: Story = {
  render: () => html` <mac-checkbox .indeterminate=${true}>半选状态</mac-checkbox> `,
}

export const Disabled: Story = {
  render: () => html`
    <mac-checkbox disabled>未选中禁用</mac-checkbox>
    <mac-checkbox .defaultChecked=${true} disabled>已选中禁用</mac-checkbox>
    <mac-checkbox .indeterminate=${true} disabled>半选禁用</mac-checkbox>
  `,
}

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <mac-checkbox size="sm" checked>Small</mac-checkbox>
      <mac-checkbox size="md" checked>Medium</mac-checkbox>
      <mac-checkbox size="lg" checked>Large</mac-checkbox>
    </div>
  `,
}

export const LabelProp: Story = {
  render: () => html` <mac-checkbox label="使用 label 属性"></mac-checkbox> `,
}

export const GroupDefault: Story = {
  render: () => html`
    <mac-checkbox-group .defaultValue=${['a', 'c']}>
      <mac-checkbox value="a">选项 A</mac-checkbox>
      <mac-checkbox value="b">选项 B</mac-checkbox>
      <mac-checkbox value="c">选项 C</mac-checkbox>
      <mac-checkbox value="d" disabled>选项 D（禁用）</mac-checkbox>
    </mac-checkbox-group>
  `,
}

export const GroupVertical: Story = {
  render: () => html`
    <mac-checkbox-group .defaultValue=${['b']} direction="vertical">
      <mac-checkbox value="a">选项 A</mac-checkbox>
      <mac-checkbox value="b">选项 B</mac-checkbox>
      <mac-checkbox value="c">选项 C</mac-checkbox>
    </mac-checkbox-group>
  `,
}

export const GroupWithOptions: Story = {
  render: () => html`
    <mac-checkbox-group
      .defaultValue=${['apple']}
      .options=${[
        { value: 'apple', label: '苹果' },
        { value: 'banana', label: '香蕉' },
        { value: 'orange', label: '橙子' },
        { value: 'grape', label: '葡萄', disabled: true },
      ]}
    ></mac-checkbox-group>
  `,
}

export const GroupSizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <mac-checkbox-group size="sm" .defaultValue=${['a']}>
        <mac-checkbox value="a">Small</mac-checkbox>
        <mac-checkbox value="b">Small</mac-checkbox>
      </mac-checkbox-group>
      <mac-checkbox-group size="md" .defaultValue=${['a']}>
        <mac-checkbox value="a">Medium</mac-checkbox>
        <mac-checkbox value="b">Medium</mac-checkbox>
      </mac-checkbox-group>
      <mac-checkbox-group size="lg" .defaultValue=${['a']}>
        <mac-checkbox value="a">Large</mac-checkbox>
        <mac-checkbox value="b">Large</mac-checkbox>
      </mac-checkbox-group>
    </div>
  `,
}

export const GroupMax: Story = {
  render: () => html`
    <mac-checkbox-group .defaultValue=${['a']} .max=${2}>
      <mac-checkbox value="a">选项 A</mac-checkbox>
      <mac-checkbox value="b">选项 B</mac-checkbox>
      <mac-checkbox value="c">选项 C</mac-checkbox>
      <mac-checkbox value="d">选项 D</mac-checkbox>
    </mac-checkbox-group>
  `,
}

export const Controlled: Story = {
  render: () => {
    const handleChange = (e: CustomEvent) => {
      const el = document.getElementById('controlled-group') as any
      if (el) {
        el.value = e.detail.value
      }
    }
    return html`
      <mac-checkbox-group id="controlled-group" .value=${['a', 'b']} @mac-change=${handleChange}>
        <mac-checkbox value="a">选项 A</mac-checkbox>
        <mac-checkbox value="b">选项 B</mac-checkbox>
        <mac-checkbox value="c">选项 C</mac-checkbox>
      </mac-checkbox-group>
    `
  },
}
