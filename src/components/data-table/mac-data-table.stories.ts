import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-data-table'
import type {
  DataTableColumn,
  DataTablePagination,
  DataTableRowSelection,
} from './mac-data-table'

interface User {
  id: number
  name: string
  age: number
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
}

const columns: DataTableColumn<User>[] = [
  { key: 'name', title: '姓名', dataIndex: 'name' },
  { key: 'age', title: '年龄', dataIndex: 'age', align: 'center', sortable: true, sorter: (a, b) => a.age - b.age },
  { key: 'email', title: '邮箱', dataIndex: 'email', ellipsis: true },
  { key: 'role', title: '角色', dataIndex: 'role' },
  {
    key: 'status',
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    render: (row) => {
      const map: Record<string, string> = {
        active: '#16a34a',
        inactive: '#9ca3af',
        pending: '#f59e0b',
      }
      const labelMap: Record<string, string> = { active: '已激活', inactive: '未激活', pending: '待审核' }
      return html`<span
        style="display:inline-flex;align-items:center;gap:6px;font-size:13px;color:${map[row.status]}"
      >
        <span
          style="width:6px;height:6px;border-radius:50%;background:${map[row.status]};display:inline-block"
        ></span>
        ${labelMap[row.status]}
      </span>`
    },
  },
]

function makeData(count: number): User[] {
  const roles = ['管理员', '编辑', '访客', '开发者']
  const statuses: User['status'][] = ['active', 'inactive', 'pending']
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `用户 ${i + 1}`,
    age: 20 + (i % 40),
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
  }))
}

const meta: Meta = {
  title: 'Components/DataTable',
  component: 'mac-data-table',
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '组件尺寸',
      table: { defaultValue: { summary: 'md' } },
    },
    bordered: { control: 'boolean', description: '边框样式' },
    striped: { control: 'boolean', description: '斑马纹' },
    sticky: { control: 'boolean', description: '表头吸顶' },
    loading: { control: 'boolean', description: '加载中' },
    remote: { control: 'boolean', description: '远程模式' },
    emptyText: { control: 'text', description: '空数据文案' },
  },
  args: {
    size: 'md',
    bordered: false,
    striped: false,
    sticky: false,
    loading: false,
    remote: false,
    emptyText: '暂无数据',
  },
}
export default meta
type Story = StoryObj

export const Basic: Story = {
  render: (args) => html`
    <mac-data-table
      .columns=${columns}
      .data=${makeData(8)}
      .size=${args.size}
      ?bordered=${args.bordered}
      ?striped=${args.striped}
      ?sticky=${args.sticky}
      ?loading=${args.loading}
      ?remote=${args.remote}
      empty-text=${args.emptyText}
    ></mac-data-table>
  `,
}

export const PaginationConfig: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px">
      <mac-data-table
        .columns=${columns}
        .data=${makeData(53)}
        .pagination=${{ pageSize: 5, showSizeChanger: true, showQuickJumper: true, pageSizeOptions: [5, 10, 20] } as DataTablePagination}
      ></mac-data-table>
      <mac-data-table
        .columns=${columns}
        .data=${makeData(120)}
        .pagination=${{ pageSize: 10, showSizeChanger: true, showQuickJumper: true } as DataTablePagination}
        striped
      ></mac-data-table>
    </div>
  `,
}

export const NoPagination: Story = {
  render: () => html`
    <mac-data-table .columns=${columns} .data=${makeData(6)} .pagination=${false}></mac-data-table>
  `,
}

export const SimplePagination: Story = {
  render: () => html`
    <mac-data-table
      .columns=${columns}
      .data=${makeData(47)}
      .pagination=${{ pageSize: 5, simple: true } as DataTablePagination}
    ></mac-data-table>
  `,
}

export const ControlledPagination: Story = {
  render: () => {
    const handleChange = (e: Event) => {
      const detail = (e as CustomEvent).detail
      // 受控示例：将当前页写回组件
      const target = e.target as HTMLElement & { pagination: DataTablePagination }
      target.pagination = { ...target.pagination, current: detail.page, pageSize: detail.pageSize }
      const log = document.getElementById('controlled-log')
      if (log)
        log.textContent = `page=${detail.page}, pageSize=${detail.pageSize}, sorter=${JSON.stringify(detail.sorter)}`
    }
    return html`
      <mac-data-table
        id="controlled-table"
        .columns=${columns}
        .data=${makeData(100)}
        .pagination=${{ current: 1, pageSize: 10, showSizeChanger: true, showQuickJumper: true } as DataTablePagination}
        @mac-data-table-change=${handleChange}
      ></mac-data-table>
      <p id="controlled-log" style="margin-top:12px;font-size:13px;color:#6b7280">page=1, pageSize=10</p>
    `
  },
}

export const Sorting: Story = {
  render: () => html`
    <mac-data-table
      .columns=${[
        { key: 'name', title: '姓名', dataIndex: 'name', sortable: true, sorter: (a: User, b: User) => a.name.localeCompare(b.name) },
        { key: 'age', title: '年龄', dataIndex: 'age', align: 'center', sortable: true, defaultSortOrder: 'asc' as const, sorter: (a: User, b: User) => a.age - b.age },
        { key: 'email', title: '邮箱', dataIndex: 'email' },
        { key: 'role', title: '角色', dataIndex: 'role', sortable: true, sorter: (a: User, b: User) => a.role.localeCompare(b.role) },
      ] as DataTableColumn<User>[]}
      .data=${makeData(35)}
      .pagination=${{ pageSize: 10 }}
    ></mac-data-table>
  `,
}

export const RowSelection: Story = {
  render: () => {
    const handleSelect = (e: Event) => {
      const detail = (e as CustomEvent).detail
      const log = document.getElementById('selection-log')
      if (log) log.textContent = `已选 ${detail.selectedRowKeys.length} 行: ${JSON.stringify(detail.selectedRowKeys)}`
    }
    return html`
      <mac-data-table
        .columns=${columns}
        .data=${makeData(25)}
        row-key="id"
        .pagination=${{ pageSize: 10, showSizeChanger: true }}
        .rowSelection=${{ type: 'checkbox' } as DataTableRowSelection}
        @mac-data-table-select=${handleSelect}
      ></mac-data-table>
      <p id="selection-log" style="margin-top:12px;font-size:13px;color:#6b7280">已选 0 行</p>
    `
  },
}

export const RadioSelection: Story = {
  render: () => html`
    <mac-data-table
      .columns=${columns}
      .data=${makeData(12)}
      row-key="id"
      .pagination=${{ pageSize: 6 }}
      .rowSelection=${{ type: 'radio' } as DataTableRowSelection}
    ></mac-data-table>
  `,
}

export const RemoteMode: Story = {
  render: () => {
    const handle = (e: Event) => {
      const detail = (e as CustomEvent).detail
      const log = document.getElementById('remote-log')
      if (log)
        log.textContent = `请求: page=${detail.page}, pageSize=${detail.pageSize}, sorter=${JSON.stringify(detail.sorter)}`
    }
    return html`
      <mac-data-table
        .columns=${columns}
        .data=${makeData(10)}
        .pagination=${{ current: 1, pageSize: 10, total: 500 } as DataTablePagination}
        remote
        loading
        @mac-data-table-change=${handle}
      ></mac-data-table>
      <p id="remote-log" style="margin-top:12px;font-size:13px;color:#6b7280">
        切换分页/排序后，由后端返回对应页数据并更新 total
      </p>
    `
  },
}

export const Empty: Story = {
  render: (args) => html`
    <mac-data-table
      .columns=${columns}
      .data=${[]}
      empty-text=${args.emptyText}
    ></mac-data-table>
  `,
}

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:24px">
      <mac-data-table .columns=${columns} .data=${makeData(5)} .pagination=${false} size="sm" bordered></mac-data-table>
      <mac-data-table .columns=${columns} .data=${makeData(5)} .pagination=${false} size="md" bordered></mac-data-table>
      <mac-data-table .columns=${columns} .data=${makeData(5)} .pagination=${false} size="lg" bordered></mac-data-table>
    </div>
  `,
}

export const DarkMode: Story = {
  render: () => html`
    <div style="background:#1a1a2e;padding:24px;border-radius:12px">
      <mac-data-table
        theme="dark"
        .columns=${columns}
        .data=${makeData(28)}
        .pagination=${{ pageSize: 8, showSizeChanger: true, showQuickJumper: true }}
        striped
      ></mac-data-table>
    </div>
  `,
}

export const WithTitleAndFooter: Story = {
  render: () => html`
    <mac-data-table
      .columns=${columns}
      .data=${makeData(15)}
      .pagination=${{ pageSize: 10 }}
      bordered
    >
      <div slot="title" style="display:flex;align-items:center;justify-content:space-between">
        <strong style="font-size:15px">用户列表</strong>
        <span style="font-size:12px;color:#6b7280">共 15 条记录</span>
      </div>
      <div slot="footer" style="display:flex;justify-content:flex-end;gap:8px">
        <span style="font-size:12px;color:#6b7280">汇总：当前页展示 10 条</span>
      </div>
    </mac-data-table>
  `,
}
