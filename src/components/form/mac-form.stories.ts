import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-form'
import './mac-form-item'
import '../input/mac-input'
import '../input-number/mac-input-number'
import '../radio/mac-radio'
import '../button/mac-button'

const meta: Meta = {
  title: 'Data Entry/Form',
  component: 'mac-form',
  tags: ['autodocs'],
  argTypes: {
    model: { control: 'object' },
    rules: { control: 'object' },
    labelWidth: { control: 'text' },
    labelAlign: { control: 'select', options: ['left', 'right', 'top'] },
    showLabel: { control: 'boolean' },
    showFeedback: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: 'A form component for collecting and validating user input.',
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => {
    const handleSubmit = (e: CustomEvent) => {
      console.log('Submit:', e.detail.model)
      alert(JSON.stringify(e.detail.model, null, 2))
    }
    return html`
      <mac-form
        .model=${{ username: '', email: '' }}
        .rules=${{
          username: [{ required: true, message: '请输入用户名' }],
          email: [
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '邮箱格式不正确' },
          ],
        }}
        @mac-submit=${handleSubmit}
      >
        <mac-form-item label="用户名" path="username">
          <mac-input placeholder="请输入用户名"></mac-input>
        </mac-form-item>
        <mac-form-item label="邮箱" path="email">
          <mac-input placeholder="请输入邮箱"></mac-input>
        </mac-form-item>
        <mac-form-item style="text-align:right;">
          <mac-button variant="primary">提交</mac-button>
        </mac-form-item>
      </mac-form>
    `
  },
}

export const LabelAlign: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <mac-form .model=${{ name: '' }} label-align="left" label-width="100px">
        <mac-form-item label="左对齐" path="name">
          <mac-input placeholder="label-align=left"></mac-input>
        </mac-form-item>
      </mac-form>
      <mac-form .model=${{ name: '' }} label-align="right" label-width="100px">
        <mac-form-item label="右对齐" path="name">
          <mac-input placeholder="label-align=right"></mac-input>
        </mac-form-item>
      </mac-form>
      <mac-form .model=${{ name: '' }} label-align="top">
        <mac-form-item label="顶部对齐" path="name">
          <mac-input placeholder="label-align=top"></mac-input>
        </mac-form-item>
      </mac-form>
    </div>
  `,
}

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <mac-form .model=${{ name: '' }} size="sm" label-width="80px">
        <mac-form-item label="Small" path="name">
          <mac-input placeholder="small"></mac-input>
        </mac-form-item>
      </mac-form>
      <mac-form .model=${{ name: '' }} size="md" label-width="80px">
        <mac-form-item label="Medium" path="name">
          <mac-input placeholder="medium"></mac-input>
        </mac-form-item>
      </mac-form>
      <mac-form .model=${{ name: '' }} size="lg" label-width="80px">
        <mac-form-item label="Large" path="name">
          <mac-input placeholder="large"></mac-input>
        </mac-form-item>
      </mac-form>
    </div>
  `,
}

export const ValidationRules: Story = {
  render: () => {
    const handleSubmit = (e: CustomEvent) => {
      const form = (e.target as HTMLElement).closest('mac-form') as any
      if (form) {
        form.validate().then((valid: boolean) => {
          if (valid) {
            alert('验证通过！')
          }
        })
      }
    }
    return html`
      <mac-form
        .model=${{ username: '', age: undefined as number | undefined, email: '', phone: '' }}
        .rules=${{
          username: [
            { required: true, message: '用户名不能为空' },
            { min: 3, max: 10, message: '用户名长度 3-10 个字符' },
          ],
          age: [
            { required: true, message: '年龄不能为空' },
            {
              validator: (value: unknown) => {
                const num = Number(value)
                if (isNaN(num) || num < 1 || num > 120) return '年龄必须在 1-120 之间'
                return true
              },
            },
          ],
          email: [
            { required: true, message: '邮箱不能为空' },
            { type: 'email', message: '请输入正确的邮箱地址' },
          ],
          phone: [
            {
              pattern: /^1[3-9]\d{9}$/,
              message: '请输入正确的手机号',
              trigger: 'blur',
            },
          ],
        }}
      >
        <mac-form-item label="用户名" path="username">
          <mac-input placeholder="3-10 个字符"></mac-input>
        </mac-form-item>
        <mac-form-item label="年龄" path="age">
          <mac-input-number placeholder="1-120"></mac-input-number>
        </mac-form-item>
        <mac-form-item label="邮箱" path="email">
          <mac-input placeholder="example@mail.com"></mac-input>
        </mac-form-item>
        <mac-form-item label="手机号" path="phone">
          <mac-input placeholder="11位手机号"></mac-input>
        </mac-form-item>
        <mac-form-item>
          <mac-button type="primary" @click=${handleSubmit}>验证</mac-button>
        </mac-form-item>
      </mac-form>
    `
  },
}

export const InlineRules: Story = {
  render: () => {
    const handleSubmit = (e: CustomEvent) => {
      const form = (e.target as HTMLElement).closest('mac-form') as any
      if (form) {
        form.validate().then((valid: boolean) => {
          if (valid) alert('验证通过！')
        })
      }
    }
    return html`
      <mac-form .model=${{ name: '', desc: '' }}>
        <mac-form-item
          label="名称"
          path="name"
          required
          .rule=${{ min: 2, max: 20, message: '名称长度 2-20 个字符' }}
        >
          <mac-input placeholder="请输入名称"></mac-input>
        </mac-form-item>
        <mac-form-item
          label="描述"
          path="desc"
          .rule=${{ max: 100, message: '描述不能超过 100 个字符' }}
        >
          <mac-input placeholder="请输入描述"></mac-input>
        </mac-form-item>
        <mac-form-item>
          <mac-button type="primary" @click=${handleSubmit}>验证</mac-button>
        </mac-form-item>
      </mac-form>
    `
  },
}

export const Disabled: Story = {
  render: () => html`
    <mac-form .model=${{ name: '只读' }} disabled label-width="80px">
      <mac-form-item label="名称" path="name">
        <mac-input></mac-input>
      </mac-form-item>
      <mac-form-item label="邮箱" path="email">
        <mac-input placeholder="禁用状态"></mac-input>
      </mac-form-item>
    </mac-form>
  `,
}

export const NoFeedback: Story = {
  render: () => html`
    <mac-form .model=${{ name: '' }} show-feedback="false" label-width="80px">
      <mac-form-item label="名称" path="name" required>
        <mac-input placeholder="不显示错误提示"></mac-input>
      </mac-form-item>
    </mac-form>
  `,
}

export const NoLabel: Story = {
  render: () => html`
    <mac-form .model=${{ name: '' }} show-label="false">
      <mac-form-item path="name" required>
        <mac-input placeholder="无标签"></mac-input>
      </mac-form-item>
    </mac-form>
  `,
}
