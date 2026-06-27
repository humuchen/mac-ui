import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-popconfirm'

const meta: Meta = {
  title: 'Components/Popconfirm',
  component: 'mac-popconfirm',
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Confirmation title text',
    },
    description: {
      control: 'text',
      description: 'Confirmation description text',
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
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ],
      description: 'Popover placement',
      table: { defaultValue: { summary: 'top' } },
    },
    trigger: {
      control: 'select',
      options: ['click', 'hover'],
      description: 'Trigger mode',
      table: { defaultValue: { summary: 'click' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the popconfirm is disabled',
      table: { defaultValue: { summary: 'false' } },
    },
    width: {
      control: 'text',
      description: 'Popover width',
      table: { defaultValue: { summary: '240px' } },
    },
  },
  args: {
    title: '确认删除？',
    description: '',
    confirmText: '确认',
    cancelText: '取消',
    danger: false,
    showIcon: true,
    placement: 'top',
    trigger: 'click',
    disabled: false,
    width: '240px',
  },
}

export default meta
type Story = StoryObj

export const Basic: Story = {
  render: (args) => html`
    <div style="padding:80px 0;text-align:center;">
      <mac-popconfirm
        .title=${args.title}
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
        ?danger=${args.danger}
        ?show-icon=${args.showIcon}
        .placement=${args.placement}
        .trigger=${args.trigger}
        ?disabled=${args.disabled}
        .width=${args.width}
        @mac-popconfirm-confirm=${() => console.log('confirmed')}
        @mac-popconfirm-cancel=${() => console.log('cancelled')}
      >
        <mac-button>删除</mac-button>
      </mac-popconfirm>
    </div>
  `,
}

export const WithDescription: Story = {
  args: {
    title: '确认删除此项目？',
    description: '删除后将无法恢复，所有关联数据将被永久移除。',
    danger: true,
  },
  render: (args) => html`
    <div style="padding:100px 0;text-align:center;">
      <mac-popconfirm
        .title=${args.title}
        .description=${args.description}
        ?danger=${args.danger}
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
        ?show-icon=${args.showIcon}
        .placement=${args.placement}
        .trigger=${args.trigger}
        ?disabled=${args.disabled}
        .width=${args.width}
      >
        <mac-button variant="danger">删除项目</mac-button>
      </mac-popconfirm>
    </div>
  `,
}

export const DangerStyle: Story = {
  args: {
    title: '确认执行此危险操作？',
    danger: true,
  },
  render: (args) => html`
    <div style="padding:80px 0;text-align:center;">
      <mac-popconfirm
        .title=${args.title}
        ?danger=${args.danger}
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
        ?show-icon=${args.showIcon}
        .placement=${args.placement}
        .trigger=${args.trigger}
        ?disabled=${args.disabled}
        .width=${args.width}
      >
        <mac-button variant="danger">危险操作</mac-button>
      </mac-popconfirm>
    </div>
  `,
}

export const Placements: Story = {
  args: {
    confirmText: '确认',
    cancelText: '取消',
  },
  render: (args) => html`
    <div style="padding:120px 0;display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
      <mac-popconfirm
        title="顶部弹出"
        placement="top"
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
      >
        <mac-button size="sm">Top</mac-button>
      </mac-popconfirm>
      <mac-popconfirm
        title="顶部左对齐"
        placement="top-start"
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
      >
        <mac-button size="sm">Top Start</mac-button>
      </mac-popconfirm>
      <mac-popconfirm
        title="顶部右对齐"
        placement="top-end"
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
      >
        <mac-button size="sm">Top End</mac-button>
      </mac-popconfirm>
      <mac-popconfirm
        title="底部弹出"
        placement="bottom"
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
      >
        <mac-button size="sm">Bottom</mac-button>
      </mac-popconfirm>
      <mac-popconfirm
        title="左侧弹出"
        placement="left"
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
      >
        <mac-button size="sm">Left</mac-button>
      </mac-popconfirm>
      <mac-popconfirm
        title="右侧弹出"
        placement="right"
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
      >
        <mac-button size="sm">Right</mac-button>
      </mac-popconfirm>
    </div>
  `,
}

export const HoverTrigger: Story = {
  args: {
    title: '悬停触发',
    description: '鼠标悬停即可触发确认弹窗。',
    trigger: 'hover',
  },
  render: (args) => html`
    <div style="padding:80px 0;text-align:center;">
      <mac-popconfirm
        .title=${args.title}
        .description=${args.description}
        .trigger=${args.trigger}
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
        ?show-icon=${args.showIcon}
        .placement=${args.placement}
        ?disabled=${args.disabled}
        .width=${args.width}
      >
        <mac-button>悬停我</mac-button>
      </mac-popconfirm>
    </div>
  `,
}

export const NoIcon: Story = {
  args: {
    title: '没有图标的确认',
    showIcon: false,
  },
  render: (args) => html`
    <div style="padding:80px 0;text-align:center;">
      <mac-popconfirm
        .title=${args.title}
        ?show-icon=${args.showIcon}
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
        .placement=${args.placement}
        .trigger=${args.trigger}
        ?disabled=${args.disabled}
        .width=${args.width}
      >
        <mac-button>无图标</mac-button>
      </mac-popconfirm>
    </div>
  `,
}

export const CustomText: Story = {
  args: {
    title: '是否保存更改？',
    confirmText: '保存',
    cancelText: '不保存',
  },
  render: (args) => html`
    <div style="padding:80px 0;text-align:center;">
      <mac-popconfirm
        .title=${args.title}
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
        ?show-icon=${args.showIcon}
        .placement=${args.placement}
        .trigger=${args.trigger}
        ?disabled=${args.disabled}
        .width=${args.width}
      >
        <mac-button variant="primary">关闭编辑器</mac-button>
      </mac-popconfirm>
    </div>
  `,
}

export const Disabled: Story = {
  args: {
    title: '禁用状态',
    disabled: true,
  },
  render: (args) => html`
    <div style="padding:80px 0;text-align:center;">
      <mac-popconfirm
        .title=${args.title}
        ?disabled=${args.disabled}
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
        ?show-icon=${args.showIcon}
        .placement=${args.placement}
        .trigger=${args.trigger}
        .width=${args.width}
      >
        <mac-button disabled>禁用按钮</mac-button>
      </mac-popconfirm>
    </div>
  `,
}

export const CustomWidth: Story = {
  args: {
    title: '自定义宽度',
    description: '这是一个较宽的确认弹窗，可以容纳更多内容。',
    width: '320px',
  },
  render: (args) => html`
    <div style="padding:80px 0;text-align:center;">
      <mac-popconfirm
        .title=${args.title}
        .description=${args.description}
        .width=${args.width}
        .confirmText=${args.confirmText}
        .cancelText=${args.cancelText}
        ?show-icon=${args.showIcon}
        .placement=${args.placement}
        .trigger=${args.trigger}
        ?disabled=${args.disabled}
      >
        <mac-button>宽弹窗</mac-button>
      </mac-popconfirm>
    </div>
  `,
}
