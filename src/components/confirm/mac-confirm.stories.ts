import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import { MacConfirm } from './mac-confirm'
import '../button/mac-button'

const meta: Meta = {
  title: 'Components/Confirm',
  component: 'mac-confirm',
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Dialog title text',
    },
    content: {
      control: 'text',
      description: 'Dialog body content text',
    },
    confirmText: {
      control: 'text',
      description: 'Confirm button text',
      table: { defaultValue: { summary: '确认' } },
    },
    cancelText: {
      control: 'text',
      description: 'Cancel button text',
      table: { defaultValue: { summary: '取消' } },
    },
    danger: {
      control: 'boolean',
      description: 'Danger style for confirm button',
      table: { defaultValue: { summary: 'false' } },
    },
    showIcon: {
      control: 'boolean',
      description: 'Whether to show the icon',
      table: { defaultValue: { summary: 'true' } },
    },
    width: {
      control: 'text',
      description: 'Dialog width',
      table: { defaultValue: { summary: '420px' } },
    },
    maskClosable: {
      control: 'boolean',
      description: 'Whether clicking the mask closes the dialog',
      table: { defaultValue: { summary: 'true' } },
    },
    visible: {
      control: 'boolean',
      description: 'Whether the dialog is visible',
      table: { defaultValue: { summary: 'false' } },
    },
    titleAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Title alignment',
      table: { defaultValue: { summary: 'left' } },
    },
    showDivider: {
      control: 'boolean',
      description: 'Whether to show the divider line between title/body and body/footer',
      table: { defaultValue: { summary: 'true' } },
    },
  },
  args: {
    title: '确认删除此项目？',
    content: '删除后将无法恢复，所有关联数据将被永久移除。',
    confirmText: '确认',
    cancelText: '取消',
    danger: false,
    showIcon: true,
    width: '420px',
    maskClosable: true,
    visible: false,
    titleAlign: 'left',
    showDivider: true,
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: (args) => html`
    <div
      style="position:relative;height:300px;background:linear-gradient(160deg,#0a1628,#1a3555);border-radius:12px;overflow:hidden;"
    >
      <mac-confirm
        .title=${args.title}
        .content=${args.content}
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
        ?danger=${args.danger}
        ?show-icon=${args.showIcon}
        .width=${args.width}
        ?mask-closable=${args.maskClosable}
        .titleAlign=${args.titleAlign}
        ?show-divider=${args.showDivider}
        ?visible=${true}
        @mac-confirm-ok=${() => console.log('ok')}
        @mac-confirm-cancel=${() => console.log('cancel')}
      ></mac-confirm>
    </div>
  `,
}

export const Danger: Story = {
  args: {
    title: '确认删除此项目？',
    content: '删除后将无法恢复，所有关联数据将被永久移除。',
    danger: true,
    visible: false,
  },
  render: (args) => html`
    <div
      style="position:relative;height:300px;background:linear-gradient(160deg,#0a1628,#1a3555);border-radius:12px;overflow:hidden;"
    >
      <mac-confirm
        .title=${args.title}
        .content=${args.content}
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
        ?danger=${args.danger}
        ?show-icon=${args.showIcon}
        .width=${args.width}
        ?mask-closable=${args.maskClosable}
        .titleAlign=${args.titleAlign}
        ?show-divider=${args.showDivider}
        ?visible=${true}
      ></mac-confirm>
    </div>
  `,
}

export const NoIcon: Story = {
  args: {
    title: '是否保存更改？',
    content: '当前有未保存的修改，关闭前是否保存？',
    showIcon: false,
    confirmText: '保存',
    cancelText: '不保存',
    visible: false,
  },
  render: (args) => html`
    <div
      style="position:relative;height:300px;background:linear-gradient(160deg,#0a1628,#1a3555);border-radius:12px;overflow:hidden;"
    >
      <mac-confirm
        .title=${args.title}
        .content=${args.content}
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
        ?danger=${args.danger}
        ?show-icon=${args.showIcon}
        .width=${args.width}
        ?mask-closable=${args.maskClosable}
        .titleAlign=${args.titleAlign}
        ?show-divider=${args.showDivider}
        ?visible=${true}
      ></mac-confirm>
    </div>
  `,
}

export const OnlyTitle: Story = {
  args: {
    title: '确认执行此操作？',
    content: '',
    visible: false,
  },
  render: (args) => html`
    <div
      style="position:relative;height:300px;background:linear-gradient(160deg,#0a1628,#1a3555);border-radius:12px;overflow:hidden;"
    >
      <mac-confirm
        .title=${args.title}
        .content=${args.content}
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
        ?danger=${args.danger}
        ?show-icon=${args.showIcon}
        .width=${args.width}
        ?mask-closable=${args.maskClosable}
        .titleAlign=${args.titleAlign}
        ?show-divider=${args.showDivider}
        ?visible=${true}
      ></mac-confirm>
    </div>
  `,
}

export const CustomWidth: Story = {
  args: {
    title: ' wide dialog',
    content: 'This dialog uses a custom width of 520px to accommodate more content.',
    width: '520px',
    visible: false,
  },
  render: (args) => html`
    <div
      style="position:relative;height:300px;background:linear-gradient(160deg,#0a1628,#1a3555);border-radius:12px;overflow:hidden;"
    >
      <mac-confirm
        .title=${args.title}
        .content=${args.content}
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
        ?danger=${args.danger}
        ?show-icon=${args.showIcon}
        .width=${args.width}
        ?mask-closable=${args.maskClosable}
        .titleAlign=${args.titleAlign}
        ?show-divider=${args.showDivider}
        ?visible=${true}
      ></mac-confirm>
    </div>
  `,
}

export const WithSlot: Story = {
  args: {
    title: '自定义内容',
    visible: false,
  },
  render: (args) => html`
    <div
      style="position:relative;height:300px;background:linear-gradient(160deg,#0a1628,#1a3555);border-radius:12px;overflow:hidden;"
    >
      <mac-confirm
        .title=${args.title}
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
        ?danger=${args.danger}
        .width=${args.width}
        ?mask-closable=${args.maskClosable}
        .titleAlign=${args.titleAlign}
        ?show-divider=${args.showDivider}
        ?visible=${true}
      >
        <div style="display:flex;flex-direction:column;gap:8px;">
          <p style="margin:0;">这里可以放置任何自定义内容。</p>
          <input
            type="text"
            placeholder="请输入确认信息"
            style="padding:6px 10px;border-radius:6px;border:1px solid rgba(0,0,0,0.1);background:rgba(255,255,255,0.6);font-size:13px;"
          />
        </div>
      </mac-confirm>
    </div>
  `,
}

export const TitleAlignCenter: Story = {
  args: {
    title: '标题居中',
    content: 'titleAlign 设置为 center 时，标题与图标整体居中显示。',
    titleAlign: 'center',
    visible: false,
  },
  render: (args) => html`
    <div
      style="position:relative;height:300px;background:linear-gradient(160deg,#0a1628,#1a3555);border-radius:12px;overflow:hidden;"
    >
      <mac-confirm
        .title=${args.title}
        .content=${args.content}
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
        ?danger=${args.danger}
        ?show-icon=${args.showIcon}
        .width=${args.width}
        ?mask-closable=${args.maskClosable}
        .titleAlign=${args.titleAlign}
        ?show-divider=${args.showDivider}
        ?visible=${true}
      ></mac-confirm>
    </div>
  `,
}

export const TitleAlignRight: Story = {
  args: {
    title: '标题居右',
    content: 'titleAlign 设置为 right 时，标题与图标整体靠右显示。',
    titleAlign: 'right',
    visible: false,
  },
  render: (args) => html`
    <div
      style="position:relative;height:300px;background:linear-gradient(160deg,#0a1628,#1a3555);border-radius:12px;overflow:hidden;"
    >
      <mac-confirm
        .title=${args.title}
        .content=${args.content}
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
        ?danger=${args.danger}
        ?show-icon=${args.showIcon}
        .width=${args.width}
        ?mask-closable=${args.maskClosable}
        .titleAlign=${args.titleAlign}
        ?show-divider=${args.showDivider}
        ?visible=${true}
      ></mac-confirm>
    </div>
  `,
}

export const NoDivider: Story = {
  args: {
    title: '无分隔线',
    content: 'showDivider 设置为 false 时，标题栏底部和按钮栏顶部不显示分隔线。',
    showDivider: false,
    visible: false,
  },
  render: (args) => html`
    <div
      style="position:relative;height:300px;background:linear-gradient(160deg,#0a1628,#1a3555);border-radius:12px;overflow:hidden;"
    >
      <mac-confirm
        .title=${args.title}
        .content=${args.content}
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
        ?danger=${args.danger}
        ?show-icon=${args.showIcon}
        .width=${args.width}
        ?mask-closable=${args.maskClosable}
        .titleAlign=${args.titleAlign}
        ?show-divider=${args.showDivider}
        ?visible=${true}
      ></mac-confirm>
    </div>
  `,
}

export const ImperativeAPI: Story = {
  render: () => html`
    <div style="padding:80px 0;text-align:center;">
      <mac-button
        @mac-click=${() => {
          MacConfirm.open({
            title: '确认删除？',
            content: '此操作不可撤销，请谨慎操作。',
            danger: true,
            onOk: () => console.log('deleted'),
            onCancel: () => console.log('cancelled'),
          })
        }}
        >打开 Confirm</mac-button
      >
    </div>
  `,
}
