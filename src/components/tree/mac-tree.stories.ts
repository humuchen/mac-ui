import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-tree'
import type { TreeNodeData } from './mac-tree'

const sampleData: TreeNodeData[] = [
  {
    key: '1',
    label: 'Documents',
    children: [
      {
        key: '1-1',
        label: 'Work',
        children: [
          { key: '1-1-1', label: 'Project A' },
          { key: '1-1-2', label: 'Project B' },
        ],
      },
      { key: '1-2', label: 'Personal' },
    ],
  },
  {
    key: '2',
    label: 'Downloads',
    children: [
      { key: '2-1', label: 'Images' },
      { key: '2-2', label: 'Videos' },
    ],
  },
  {
    key: '3',
    label: 'System',
    disabled: true,
    children: [{ key: '3-1', label: 'Library' }],
  },
]

const meta: Meta = {
  title: 'Components/Tree',
  component: 'mac-tree',
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: 'Tree data array',
    },
    checkable: {
      control: 'boolean',
      description: 'Whether to show checkboxes',
    },
    multiple: {
      control: 'boolean',
      description: 'Whether multiple selection is allowed',
    },
    selectable: {
      control: 'boolean',
      description: 'Whether nodes are selectable',
    },
    showLine: {
      control: 'boolean',
      description: 'Whether to show connecting lines',
    },
    blockNode: {
      control: 'boolean',
      description: 'Whether the whole node row is clickable',
    },
    defaultExpandAll: {
      control: 'boolean',
      description: 'Whether to expand all nodes by default',
    },
    emptyText: {
      control: 'text',
      description: 'Empty text when no data',
    },
  },
  args: {
    data: sampleData,
    checkable: false,
    multiple: false,
    selectable: true,
    showLine: false,
    blockNode: true,
    defaultExpandAll: false,
    emptyText: 'No data',
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: (args) =>
    html`<mac-tree
      .data=${args.data}
      ?checkable=${args.checkable}
      ?multiple=${args.multiple}
      ?selectable=${args.selectable}
      ?show-line=${args.showLine}
      ?block-node=${args.blockNode}
      ?default-expand-all=${args.defaultExpandAll}
      empty-text=${args.emptyText}
    ></mac-tree>`,
}

export const DefaultExpanded: Story = {
  render: () => html`<mac-tree .data=${sampleData} default-expand-all></mac-tree>`,
}

export const WithCheckboxes: Story = {
  render: () => html`<mac-tree .data=${sampleData} checkable default-expand-all></mac-tree>`,
}

export const WithLines: Story = {
  render: () => html`<mac-tree .data=${sampleData} show-line default-expand-all></mac-tree>`,
}

export const MultipleSelect: Story = {
  render: () => html`<mac-tree .data=${sampleData} multiple default-expand-all></mac-tree>`,
}

export const ControlledExpanded: Story = {
  render: () => {
    const expanded = ['1', '1-1']
    return html`<mac-tree .data=${sampleData} .expandedKeys=${expanded}></mac-tree>`
  },
}

export const Empty: Story = {
  render: () => html`<mac-tree .data=${[]}></mac-tree>`,
}
