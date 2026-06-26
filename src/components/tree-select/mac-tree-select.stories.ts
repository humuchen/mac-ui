import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-tree-select'
import type { TreeOption } from './mac-tree-select'

const treeData: TreeOption[] = [
  {
    value: 'fruits',
    label: 'Fruits',
    children: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
    ],
  },
  {
    value: 'vegetables',
    label: 'Vegetables',
    children: [
      {
        value: 'leafy',
        label: 'Leafy Greens',
        children: [
          { value: 'spinach', label: 'Spinach' },
          { value: 'lettuce', label: 'Lettuce' },
        ],
      },
      {
        value: 'root',
        label: 'Root Vegetables',
        children: [
          { value: 'carrot', label: 'Carrot' },
          { value: 'potato', label: 'Potato' },
        ],
      },
    ],
  },
  { value: 'grains', label: 'Grains' },
]

const meta: Meta = {
  title: 'Data Entry/TreeSelect',
  component: 'mac-tree-select',
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    defaultValue: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    clearable: { control: 'boolean' },
    error: { control: 'boolean' },
    success: { control: 'boolean' },
    multiple: { control: 'boolean' },
    searchable: { control: 'boolean' },
    panel: { control: 'boolean' },
    checkable: { control: 'boolean' },
    defaultExpandAll: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: 'A tree select component with macOS-style design.',
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => html`<mac-tree-select .options=${treeData}></mac-tree-select>`,
}

export const WithValue: Story = {
  render: () =>
    html`<mac-tree-select .options=${treeData} .defaultValue=${'apple'}></mac-tree-select>`,
}

export const DefaultExpandAll: Story = {
  render: () => html`<mac-tree-select .options=${treeData} default-expand-all></mac-tree-select>`,
}

export const Multiple: Story = {
  render: () =>
    html`<mac-tree-select
      .options=${treeData}
      multiple
      .defaultValue=${['apple', 'carrot']}
    ></mac-tree-select>`,
}

export const Checkable: Story = {
  render: () =>
    html`<mac-tree-select
      .options=${treeData}
      multiple
      checkable
      default-expand-all
    ></mac-tree-select>`,
}

export const Searchable: Story = {
  render: () => html`<mac-tree-select .options=${treeData} searchable></mac-tree-select>`,
}

export const Clearable: Story = {
  render: () =>
    html`<mac-tree-select
      .options=${treeData}
      clearable
      .defaultValue=${'banana'}
    ></mac-tree-select>`,
}

export const Disabled: Story = {
  render: () =>
    html`<mac-tree-select
      .options=${treeData}
      disabled
      .defaultValue=${'apple'}
    ></mac-tree-select>`,
}

export const ErrorState: Story = {
  render: () =>
    html`<mac-tree-select .options=${treeData} error .defaultValue=${'apple'}></mac-tree-select>`,
}

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <mac-tree-select size="sm" .options=${treeData}></mac-tree-select>
      <mac-tree-select size="md" .options=${treeData}></mac-tree-select>
      <mac-tree-select size="lg" .options=${treeData}></mac-tree-select>
    </div>
  `,
}

export const PanelOnly: Story = {
  render: () =>
    html`<mac-tree-select panel .options=${treeData} default-expand-all></mac-tree-select>`,
}

export const PanelOnlyCheckable: Story = {
  render: () =>
    html`<mac-tree-select
      panel
      .options=${treeData}
      multiple
      checkable
      default-expand-all
    ></mac-tree-select>`,
}

export const PanelOnlySearchable: Story = {
  render: () =>
    html`<mac-tree-select
      panel
      .options=${treeData}
      searchable
      default-expand-all
    ></mac-tree-select>`,
}

export const Controlled: Story = {
  render: () => {
    const handleChange = (e: CustomEvent) => {
      const el = document.getElementById('controlled-tree') as any
      if (el) el.value = e.detail.value
    }
    return html`
      <mac-tree-select
        id="controlled-tree"
        .options=${treeData}
        .value=${'apple'}
        @mac-change=${handleChange}
      ></mac-tree-select>
    `
  },
}
