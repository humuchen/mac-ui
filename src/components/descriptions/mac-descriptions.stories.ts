import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-descriptions'

const meta: Meta = {
  title: 'Components/Descriptions',
  component: 'mac-descriptions',
  tags: ['autodocs'],
  argTypes: {
    labelPlacement: {
      control: 'select',
      options: ['left', 'top'],
      description: 'Label placement: left (beside value) or top (above value)',
      table: { defaultValue: { summary: 'left' } },
    },
    labelAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Label text alignment',
      table: { defaultValue: { summary: 'left' } },
    },
    column: {
      control: 'number',
      description: 'Number of label-value pairs per row',
      table: { defaultValue: { summary: '3' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Component size',
      table: { defaultValue: { summary: 'md' } },
    },
    bordered: {
      control: 'boolean',
      description: 'Show bordered style',
      table: { defaultValue: { summary: 'false' } },
    },
    title: {
      control: 'text',
      description: 'Title text',
    },
    separator: {
      control: 'text',
      description: 'Separator between label and value (left placement, non-bordered)',
      table: { defaultValue: { summary: ':' } },
    },
  },
  args: {
    labelPlacement: 'left',
    labelAlign: 'left',
    column: 3,
    size: 'md',
    bordered: false,
    title: '',
    separator: ':',
  },
}

export default meta
type Story = StoryObj

const userInfo = [
  { label: '用户名', value: 'zhangsan' },
  { label: '手机号', value: '138-0000-1234' },
  { label: '邮箱', value: 'zhangsan@example.com' },
  { label: '住址', value: '北京市朝阳区建国路 88 号' },
  { label: '注册时间', value: '2024-01-15' },
  { label: '状态', value: '已激活' },
]

export const Basic: Story = {
  render: (args) => html`
    <mac-descriptions
      label-placement=${args.labelPlacement}
      label-align=${args.labelAlign}
      .column=${args.column}
      .size=${args.size}
      ?bordered=${args.bordered}
      .title=${args.title}
      .separator=${args.separator}
      .items=${userInfo}
    ></mac-descriptions>
  `,
}

export const WithTitle: Story = {
  render: () => html` <mac-descriptions title="用户信息" .items=${userInfo}></mac-descriptions> `,
}

export const WithExtra: Story = {
  render: () => html`
    <mac-descriptions title="用户信息">
      <mac-button slot="extra" size="sm" variant="primary">编辑</mac-button>
      ${userInfo.map(
        (item) => html`
          <mac-description-item label=${item.label} value=${item.value}></mac-description-item>
        `,
      )}
    </mac-descriptions>
  `,
}

export const LabelPlacementTop: Story = {
  render: () => html`
    <mac-descriptions
      title="产品详情"
      label-placement="top"
      .items=${[
        { label: '产品名称', value: 'MacBook Pro 16"' },
        { label: '芯片', value: 'Apple M3 Pro' },
        { label: '内存', value: '36 GB' },
        { label: '存储', value: '1 TB SSD' },
        { label: '显示屏', value: '16.2 英寸 Liquid Retina XDR' },
        { label: '电池续航', value: '最长可达 22 小时' },
      ]}
    ></mac-descriptions>
  `,
}

export const LabelPlacementTopBordered: Story = {
  render: () => html`
    <mac-descriptions
      title="服务器配置"
      label-placement="top"
      bordered
      .items=${[
        { label: '主机名', value: 'prod-server-01' },
        { label: 'IP 地址', value: '192.168.1.100' },
        { label: '操作系统', value: 'macOS Sonoma 14.5' },
        { label: 'CPU', value: 'Apple M2 Ultra (24 核)' },
        { label: '内存', value: '192 GB' },
        { label: '磁盘', value: '8 TB NVMe SSD' },
      ]}
    ></mac-descriptions>
  `,
}

export const Bordered: Story = {
  render: () => html`
    <mac-descriptions
      title="服务器配置"
      bordered
      .items=${[
        { label: '主机名', value: 'prod-server-01' },
        { label: 'IP 地址', value: '192.168.1.100' },
        { label: '操作系统', value: 'macOS Sonoma 14.5' },
        { label: 'CPU', value: 'Apple M2 Ultra (24 核)' },
        { label: '内存', value: '192 GB' },
        { label: '磁盘', value: '8 TB NVMe SSD' },
      ]}
    ></mac-descriptions>
  `,
}

export const LabelAlign: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px">
      <mac-descriptions
        title="左对齐 (默认)"
        label-align="left"
        .items=${userInfo.slice(0, 3)}
      ></mac-descriptions>
      <mac-descriptions
        title="居中对齐"
        label-align="center"
        .items=${userInfo.slice(0, 3)}
      ></mac-descriptions>
      <mac-descriptions
        title="右对齐"
        label-align="right"
        .items=${userInfo.slice(0, 3)}
      ></mac-descriptions>
    </div>
  `,
}

export const Separator: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px">
      <mac-descriptions title="默认分隔符 (:)" .items=${userInfo.slice(0, 3)}></mac-descriptions>
      <mac-descriptions
        title="自定义分隔符 (—)"
        separator="—"
        .items=${userInfo.slice(0, 3)}
      ></mac-descriptions>
      <mac-descriptions
        title="无分隔符"
        separator=""
        .items=${userInfo.slice(0, 3)}
      ></mac-descriptions>
    </div>
  `,
}

export const SmallSize: Story = {
  render: () => html`
    <mac-descriptions
      title="摘要"
      size="sm"
      .items=${[
        { label: '名称', value: '项目 A' },
        { label: '类型', value: 'Web 应用' },
        { label: '版本', value: 'v2.1.0' },
      ]}
    ></mac-descriptions>
  `,
}

export const LargeSize: Story = {
  render: () => html`
    <mac-descriptions
      title="系统信息"
      size="lg"
      .items=${[
        { label: '系统版本', value: 'macOS 15.0 Sequoia' },
        { label: '处理器', value: 'Apple M3 Max' },
        { label: '启动磁盘', value: 'Macintosh HD' },
      ]}
    ></mac-descriptions>
  `,
}

export const TwoColumns: Story = {
  render: () => html`
    <mac-descriptions
      title="个人信息"
      .column=${2}
      .items=${[
        { label: '姓名', value: '李明' },
        { label: '年龄', value: '28' },
        { label: '职业', value: '前端工程师' },
        { label: '城市', value: '上海' },
        { label: '简介', value: '热爱开源，专注于 Web 技术和用户体验设计', span: 2 },
      ]}
    ></mac-descriptions>
  `,
}

export const Span: Story = {
  render: () => html`
    <mac-descriptions
      title="订单信息"
      .column=${3}
      .items=${[
        { label: '订单号', value: 'ORD-2024-001234' },
        { label: '下单时间', value: '2024-06-15 14:30' },
        { label: '状态', value: '已发货' },
        { label: '收货地址', value: '上海市浦东新区张江高科技园区碧波路 690 号', span: 2 },
        { label: '邮编', value: '201203' },
        { label: '备注', value: '请尽快发货，谢谢', span: 3 },
      ]}
    ></mac-descriptions>
  `,
}

export const SlotMode: Story = {
  render: () => html`
    <mac-descriptions title="设备信息" column="2">
      <mac-description-item label="设备" value="iPhone 15 Pro Max"></mac-description-item>
      <mac-description-item label="系统" value="iOS 18.0"></mac-description-item>
      <mac-description-item label="芯片" value="A17 Pro"></mac-description-item>
      <mac-description-item label="存储" value="512 GB"></mac-description-item>
      <mac-description-item label="颜色" value="原色钛金属"></mac-description-item>
      <mac-description-item label="序列号" value="F2LXN4CH1N"></mac-description-item>
    </mac-descriptions>
  `,
}

export const ItemStyle: Story = {
  render: () => html`
    <mac-descriptions
      title="自定义样式"
      .items=${[
        { label: '普通项', value: '默认样式' },
        { label: '高亮标签', value: '红色标签', labelStyle: 'color: #ef4444; font-weight: 600' },
        { label: '高亮内容', value: '绿色内容', contentStyle: 'color: #22c55e; font-weight: 600' },
        { label: '普通项', value: '默认样式' },
      ]}
    ></mac-descriptions>
  `,
}

export const AllSizesBordered: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px">
      <mac-descriptions
        title="Small"
        size="sm"
        bordered
        .items=${userInfo.slice(0, 3)}
      ></mac-descriptions>
      <mac-descriptions
        title="Medium"
        size="md"
        bordered
        .items=${userInfo.slice(0, 3)}
      ></mac-descriptions>
      <mac-descriptions
        title="Large"
        size="lg"
        bordered
        .items=${userInfo.slice(0, 3)}
      ></mac-descriptions>
    </div>
  `,
}

export const AllSizesTopPlacement: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:16px">
      <mac-descriptions
        title="Small"
        size="sm"
        label-placement="top"
        .items=${userInfo.slice(0, 3)}
      ></mac-descriptions>
      <mac-descriptions
        title="Medium"
        size="md"
        label-placement="top"
        .items=${userInfo.slice(0, 3)}
      ></mac-descriptions>
      <mac-descriptions
        title="Large"
        size="lg"
        label-placement="top"
        .items=${userInfo.slice(0, 3)}
      ></mac-descriptions>
    </div>
  `,
}
