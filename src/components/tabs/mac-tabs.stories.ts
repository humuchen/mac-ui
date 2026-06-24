import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-tabs'

const meta: Meta = {
  title: 'Components/Tabs',
  component: 'mac-tabs',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['line', 'card', 'segment'],
      description: 'Tab type',
      table: { defaultValue: { summary: 'line' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Component size',
      table: { defaultValue: { summary: 'md' } },
    },
    value: {
      control: 'text',
      description: 'Active tab key (controlled mode)',
    },
    closable: {
      control: 'boolean',
      description: 'Whether tabs are closable',
      table: { defaultValue: { summary: 'false' } },
    },
    addable: {
      control: 'boolean',
      description: 'Whether to show add button',
      table: { defaultValue: { summary: 'false' } },
    },
    animated: {
      control: 'boolean',
      description: 'Whether to animate indicator',
      table: { defaultValue: { summary: 'true' } },
    },
    trigger: {
      control: 'select',
      options: ['click', 'hover'],
      description: 'Trigger mode',
      table: { defaultValue: { summary: 'click' } },
    },
  },
  args: {
    type: 'line',
    size: 'md',
    closable: false,
    addable: false,
    animated: true,
    trigger: 'click',
  },
}

export default meta
type Story = StoryObj

const tabItems = [
  { key: 'overview', label: '概览' },
  { key: 'detail', label: '详情' },
  { key: 'settings', label: '设置' },
]

export const Basic: Story = {
  render: (args) => html`
    <mac-tabs
      type=${args.type}
      size=${args.size}
      ?closable=${args.closable}
      ?addable=${args.addable}
      ?animated=${args.animated}
      trigger=${args.trigger}
      .items=${tabItems}
      default-value="overview"
    >
      <mac-tab-pane tab-key="overview" label="概览">
        <p>这是概览面板的内容。</p>
      </mac-tab-pane>
      <mac-tab-pane tab-key="detail" label="详情">
        <p>这是详情面板的内容。</p>
      </mac-tab-pane>
      <mac-tab-pane tab-key="settings" label="设置">
        <p>这是设置面板的内容。</p>
      </mac-tab-pane>
    </mac-tabs>
  `,
}

export const LineType: Story = {
  render: () => html`
    <mac-tabs
      type="line"
      default-value="tab1"
      .items=${[
        { key: 'tab1', label: '标签一' },
        { key: 'tab2', label: '标签二' },
        { key: 'tab3', label: '标签三' },
      ]}
    >
      <mac-tab-pane tab-key="tab1" label="标签一">
        <p>标签一的内容：使用 line 类型，带有滑动指示器动画。</p>
      </mac-tab-pane>
      <mac-tab-pane tab-key="tab2" label="标签二">
        <p>标签二的内容：指示器会平滑过渡到选中的标签下方。</p>
      </mac-tab-pane>
      <mac-tab-pane tab-key="tab3" label="标签三">
        <p>标签三的内容：这是 macOS 风格的默认标签类型。</p>
      </mac-tab-pane>
    </mac-tabs>
  `,
}

export const CardType: Story = {
  render: () => html`
    <mac-tabs
      type="card"
      default-value="tab1"
      .items=${[
        { key: 'tab1', label: '标签一' },
        { key: 'tab2', label: '标签二' },
        { key: 'tab3', label: '标签三' },
      ]}
    >
      <mac-tab-pane tab-key="tab1" label="标签一">
        <p>卡片类型标签页的内容。</p>
      </mac-tab-pane>
      <mac-tab-pane tab-key="tab2" label="标签二">
        <p>适用于浏览器风格的标签页。</p>
      </mac-tab-pane>
      <mac-tab-pane tab-key="tab3" label="标签三">
        <p>支持关闭和添加操作。</p>
      </mac-tab-pane>
    </mac-tabs>
  `,
}

export const SegmentType: Story = {
  render: () => html`
    <mac-tabs
      type="segment"
      default-value="all"
      .items=${[
        { key: 'all', label: '全部' },
        { key: 'active', label: '进行中' },
        { key: 'completed', label: '已完成' },
      ]}
    >
      <mac-tab-pane tab-key="all" label="全部">
        <p>显示所有项目。</p>
      </mac-tab-pane>
      <mac-tab-pane tab-key="active" label="进行中">
        <p>显示进行中的项目。</p>
      </mac-tab-pane>
      <mac-tab-pane tab-key="completed" label="已完成">
        <p>显示已完成的项目。</p>
      </mac-tab-pane>
    </mac-tabs>
  `,
}

export const ClosableAndAddable: Story = {
  render: () => html`
    <mac-tabs
      type="card"
      closable
      addable
      default-value="tab1"
      .items=${[
        { key: 'tab1', label: '文档 1' },
        { key: 'tab2', label: '文档 2' },
        { key: 'tab3', label: '文档 3' },
      ]}
    >
      <mac-tab-pane tab-key="tab1" label="文档 1">
        <p>文档 1 的内容。点击标签上的关闭按钮可以关闭。</p>
      </mac-tab-pane>
      <mac-tab-pane tab-key="tab2" label="文档 2">
        <p>文档 2 的内容。点击右侧 + 按钮可以添加新标签。</p>
      </mac-tab-pane>
      <mac-tab-pane tab-key="tab3" label="文档 3">
        <p>文档 3 的内容。</p>
      </mac-tab-pane>
    </mac-tabs>
  `,
}

export const DisabledTab: Story = {
  render: () => html`
    <mac-tabs
      default-value="tab1"
      .items=${[
        { key: 'tab1', label: '可用标签' },
        { key: 'tab2', label: '禁用标签', disabled: true },
        { key: 'tab3', label: '可用标签' },
      ]}
    >
      <mac-tab-pane tab-key="tab1" label="可用标签">
        <p>这个标签是可用的。</p>
      </mac-tab-pane>
      <mac-tab-pane tab-key="tab2" label="禁用标签" disabled>
        <p>这个标签被禁用了，无法点击。</p>
      </mac-tab-pane>
      <mac-tab-pane tab-key="tab3" label="可用标签">
        <p>这个标签也是可用的。</p>
      </mac-tab-pane>
    </mac-tabs>
  `,
}

export const HoverTrigger: Story = {
  render: () => html`
    <mac-tabs
      trigger="hover"
      default-value="tab1"
      .items=${[
        { key: 'tab1', label: '标签一' },
        { key: 'tab2', label: '标签二' },
        { key: 'tab3', label: '标签三' },
      ]}
    >
      <mac-tab-pane tab-key="tab1" label="标签一">
        <p>鼠标悬停即可切换标签。</p>
      </mac-tab-pane>
      <mac-tab-pane tab-key="tab2" label="标签二">
        <p>无需点击，悬停即激活。</p>
      </mac-tab-pane>
      <mac-tab-pane tab-key="tab3" label="标签三">
        <p>适用于快速预览场景。</p>
      </mac-tab-pane>
    </mac-tabs>
  `,
}

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px">
      <mac-tabs size="sm" default-value="overview" .items=${tabItems}>
        <mac-tab-pane tab-key="overview" label="概览"><p>Small 尺寸</p></mac-tab-pane>
        <mac-tab-pane tab-key="detail" label="详情"><p>Small 尺寸详情</p></mac-tab-pane>
        <mac-tab-pane tab-key="settings" label="设置"><p>Small 尺寸设置</p></mac-tab-pane>
      </mac-tabs>
      <mac-tabs size="md" default-value="overview" .items=${tabItems}>
        <mac-tab-pane tab-key="overview" label="概览"><p>Medium 尺寸</p></mac-tab-pane>
        <mac-tab-pane tab-key="detail" label="详情"><p>Medium 尺寸详情</p></mac-tab-pane>
        <mac-tab-pane tab-key="settings" label="设置"><p>Medium 尺寸设置</p></mac-tab-pane>
      </mac-tabs>
      <mac-tabs size="lg" default-value="overview" .items=${tabItems}>
        <mac-tab-pane tab-key="overview" label="概览"><p>Large 尺寸</p></mac-tab-pane>
        <mac-tab-pane tab-key="detail" label="详情"><p>Large 尺寸详情</p></mac-tab-pane>
        <mac-tab-pane tab-key="settings" label="设置"><p>Large 尺寸设置</p></mac-tab-pane>
      </mac-tabs>
    </div>
  `,
}

export const SegmentAllSizes: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px">
      <mac-tabs
        type="segment"
        size="sm"
        default-value="all"
        .items=${[
          { key: 'all', label: '全部' },
          { key: 'active', label: '进行中' },
          { key: 'done', label: '已完成' },
        ]}
      >
        <mac-tab-pane tab-key="all" label="全部"><p>Small segment</p></mac-tab-pane>
        <mac-tab-pane tab-key="active" label="进行中"><p>Small segment active</p></mac-tab-pane>
        <mac-tab-pane tab-key="done" label="已完成"><p>Small segment done</p></mac-tab-pane>
      </mac-tabs>
      <mac-tabs
        type="segment"
        size="md"
        default-value="all"
        .items=${[
          { key: 'all', label: '全部' },
          { key: 'active', label: '进行中' },
          { key: 'done', label: '已完成' },
        ]}
      >
        <mac-tab-pane tab-key="all" label="全部"><p>Medium segment</p></mac-tab-pane>
        <mac-tab-pane tab-key="active" label="进行中"><p>Medium segment active</p></mac-tab-pane>
        <mac-tab-pane tab-key="done" label="已完成"><p>Medium segment done</p></mac-tab-pane>
      </mac-tabs>
      <mac-tabs
        type="segment"
        size="lg"
        default-value="all"
        .items=${[
          { key: 'all', label: '全部' },
          { key: 'active', label: '进行中' },
          { key: 'done', label: '已完成' },
        ]}
      >
        <mac-tab-pane tab-key="all" label="全部"><p>Large segment</p></mac-tab-pane>
        <mac-tab-pane tab-key="active" label="进行中"><p>Large segment active</p></mac-tab-pane>
        <mac-tab-pane tab-key="done" label="已完成"><p>Large segment done</p></mac-tab-pane>
      </mac-tabs>
    </div>
  `,
}

export const ManyTabs: Story = {
  render: () => {
    const manyItems = Array.from({ length: 12 }, (_, i) => ({
      key: `tab${i + 1}`,
      label: `标签 ${i + 1}`,
    }))
    return html`
      <mac-tabs default-value="tab1" .items=${manyItems}>
        ${manyItems.map(
          (item) => html`
            <mac-tab-pane tab-key=${item.key} label=${item.label}>
              <p>${item.label} 的内容</p>
            </mac-tab-pane>
          `,
        )}
      </mac-tabs>
    `
  },
}
