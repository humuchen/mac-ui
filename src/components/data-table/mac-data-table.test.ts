import { describe, it, expect, vi } from 'vitest'
import { fixture, html, oneEvent, elementUpdated } from '@open-wc/testing-helpers'
import './mac-data-table'
import type { MacDataTable, DataTableColumn, DataTablePagination } from './mac-data-table'

interface Row {
  id: number
  name: string
  age: number
}

const columns: DataTableColumn<Row>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name' },
  { key: 'age', title: 'Age', dataIndex: 'age', align: 'center', sortable: true, sorter: (a, b) => a.age - b.age },
]

function makeData(n: number): Row[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: `user-${i + 1}`,
    age: 20 + (i % 30),
  }))
}

function rows(el: MacDataTable): HTMLElement[] {
  return Array.from(el.shadowRoot!.querySelectorAll('tbody tr:not(.empty)'))
}

function pageButtons(el: MacDataTable): HTMLElement[] {
  return Array.from(el.shadowRoot!.querySelectorAll('.pagination-list .pg-btn'))
}

describe('MacDataTable', () => {
  it('renders rows from data and columns', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table .columns=${columns} .data=${makeData(3)} .pagination=${false}></mac-data-table>
    `)
    expect(rows(el).length).toBe(3)
    expect(el.shadowRoot!.querySelector('th')!.textContent).toContain('Name')
  })

  it('shows empty text when no data', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table .columns=${columns} .data=${[]} empty-text="No Data"></mac-data-table>
    `)
    expect(el.shadowRoot!.querySelector('.empty')!.textContent).toContain('No Data')
  })

  it('renders custom column render', async () => {
    const cols: DataTableColumn<Row>[] = [
      { key: 'name', title: 'Name', render: (r) => `--${r.name}--` },
    ]
    const el = await fixture<MacDataTable>(html`
      <mac-data-table .columns=${cols} .data=${makeData(1)} .pagination=${false}></mac-data-table>
    `)
    expect(el.shadowRoot!.querySelector('tbody td')!.textContent).toContain('--user-1--')
  })

  it('paginates data locally by default', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table
        .columns=${columns}
        .data=${makeData(25)}
        .pagination=${{ pageSize: 10 } as DataTablePagination}
      ></mac-data-table>
    `)
    expect(rows(el).length).toBe(10)
    expect(el.shadowRoot!.querySelector('.pagination-total')!.textContent).toContain('25')
  })

  it('navigates to next page and emits change event', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table
        .columns=${columns}
        .data=${makeData(25)}
        .pagination=${{ pageSize: 10 } as DataTablePagination}
      ></mac-data-table>
    `)
    const listener = oneEvent(el, 'mac-data-table-change')
    const next = el.shadowRoot!.querySelectorAll('.pagination-list .pg-btn')
    // last button = next-page arrow
    ;(next[next.length - 1] as HTMLElement).click()
    const ev = (await listener) as CustomEvent
    expect(ev.detail.page).toBe(2)
    expect(ev.detail.pageSize).toBe(10)
    await elementUpdated(el)
    expect(rows(el)[0].textContent).toContain('user-11')
  })

  it('respects controlled pagination current', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table
        .columns=${columns}
        .data=${makeData(25)}
        .pagination=${{ current: 2, pageSize: 10 } as DataTablePagination}
      ></mac-data-table>
    `)
    const active = el.shadowRoot!.querySelector('.pg-btn.active') as HTMLElement
    expect(active.textContent?.trim()).toBe('2')
    // page 2 first row is user-11
    expect(rows(el)[0].textContent).toContain('user-11')
  })

  it('changes page size via size changer', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table
        .columns=${columns}
        .data=${makeData(25)}
        .pagination=${{ pageSize: 10, pageSizeOptions: [10, 20], showSizeChanger: true } as DataTablePagination}
      ></mac-data-table>
    `)
    const listener = oneEvent(el, 'mac-data-table-change')
    const select = el.shadowRoot!.querySelector('.pg-size select') as HTMLSelectElement
    select.value = '20'
    select.dispatchEvent(new Event('change', { bubbles: true }))
    const ev = (await listener) as CustomEvent
    expect(ev.detail.pageSize).toBe(20)
    expect(ev.detail.page).toBe(1) // resets to page 1
  })

  it('hides pagination when pagination=false', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table .columns=${columns} .data=${makeData(3)} .pagination=${false}></mac-data-table>
    `)
    expect(el.shadowRoot!.querySelector('.pagination')).toBeNull()
  })

  it('sorts locally on header click and emits sort event', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table .columns=${columns} .data=${makeData(5)} .pagination=${false}></mac-data-table>
    `)
    const listener = oneEvent(el, 'mac-data-table-sort')
    const th = el.shadowRoot!.querySelectorAll('th')[1] as HTMLElement
    th.click()
    const ev = (await listener) as CustomEvent
    expect(ev.detail.sorter.columnKey).toBe('age')
    expect(ev.detail.sorter.order).toBe('asc')
    await elementUpdated(el)
    const ages = rows(el).map((r) => r.querySelectorAll('td')[1]?.textContent?.trim())
    expect(ages).toEqual([...ages].sort((a, b) => Number(a) - Number(b)))
  })

  it('applies default sort order', async () => {
    const cols: DataTableColumn<Row>[] = [
      { key: 'age', title: 'Age', dataIndex: 'age', sortable: true, defaultSortOrder: 'desc', sorter: (a, b) => a.age - b.age },
    ]
    const el = await fixture<MacDataTable>(html`
      <mac-data-table .columns=${cols} .data=${makeData(5)} .pagination=${false}></mac-data-table>
    `)
    const active = el.shadowRoot!.querySelector('.caret.active') as HTMLElement
    expect(active).toBeTruthy()
    const ages = rows(el).map((r) => r.querySelector('td')!.textContent?.trim()).map(Number)
    expect(ages).toEqual([...ages].sort((a, b) => b - a))
  })

  it('renders selection checkboxes and selects rows', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table
        .columns=${columns}
        .data=${makeData(3)}
        row-key="id"
        .pagination=${false}
        .rowSelection=${{ type: 'checkbox' }}
      ></mac-data-table>
    `)
    const checkboxes = el.shadowRoot!.querySelectorAll('tbody .checkbox')
    expect(checkboxes.length).toBe(3)
    const listener = oneEvent(el, 'mac-data-table-select')
    ;(checkboxes[0] as HTMLElement).click()
    const ev = (await listener) as CustomEvent
    expect(ev.detail.selectedRowKeys).toEqual([1])
    expect(ev.detail.type).toBe('multiple')
    await elementUpdated(el)
    expect(rows(el)[0].classList.contains('row-selected')).toBe(true)
  })

  it('select all via header checkbox', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table
        .columns=${columns}
        .data=${makeData(4)}
        row-key="id"
        .pagination=${false}
        .rowSelection=${{ type: 'checkbox' }}
      ></mac-data-table>
    `)
    const header = el.shadowRoot!.querySelector('thead .checkbox') as HTMLInputElement
    const listener = oneEvent(el, 'mac-data-table-select')
    header.click()
    const ev = (await listener) as CustomEvent
    expect(ev.detail.selectedRowKeys.length).toBe(4)
    expect(ev.detail.type).toBe('all')
  })

  it('radio selection replaces selection', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table
        .columns=${columns}
        .data=${makeData(3)}
        row-key="id"
        .pagination=${false}
        .rowSelection=${{ type: 'radio' }}
      ></mac-data-table>
    `)
    const radios = el.shadowRoot!.querySelectorAll('tbody .radio')
    ;(radios[0] as HTMLElement).click()
    await elementUpdated(el)
    ;(radios[1] as HTMLElement).click()
    const listener = oneEvent(el, 'mac-data-table-select')
    ;(radios[2] as HTMLElement).click()
    const ev = (await listener) as CustomEvent
    expect(ev.detail.selectedRowKeys).toEqual([3])
    expect(ev.detail.type).toBe('single')
  })

  it('respects controlled selectedRowKeys', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table
        .columns=${columns}
        .data=${makeData(3)}
        row-key="id"
        .pagination=${false}
        .rowSelection=${{ type: 'checkbox', selectedRowKeys: [2] }}
      ></mac-data-table>
    `)
    expect(rows(el)[1].classList.contains('row-selected')).toBe(true)
  })

  it('emits row-click event', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table .columns=${columns} .data=${makeData(2)} .pagination=${false}></mac-data-table>
    `)
    const listener = oneEvent(el, 'mac-data-table-row-click')
    rows(el)[0].click()
    const ev = (await listener) as CustomEvent
    expect(ev.detail.row.name).toBe('user-1')
  })

  it('remote mode does not slice data locally', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table
        .columns=${columns}
        .data=${makeData(10)}
        .pagination=${{ current: 1, pageSize: 10, total: 500 } as DataTablePagination}
        remote
      ></mac-data-table>
    `)
    // total comes from config
    expect(el.shadowRoot!.querySelector('.pagination-total')!.textContent).toContain('500')
    // all 10 data rows shown (server-provided page)
    expect(rows(el).length).toBe(10)
    // many pages → ellipsis present
    expect(el.shadowRoot!.querySelector('.pg-ellipsis')).toBeTruthy()
  })

  it('shows loading mask when loading', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table .columns=${columns} .data=${makeData(2)} .pagination=${false} loading></mac-data-table>
    `)
    expect(el.shadowRoot!.querySelector('.loading-mask')).toBeTruthy()
  })

  it('renders ellipsis class on column with ellipsis', async () => {
    const cols: DataTableColumn<Row>[] = [
      { key: 'name', title: 'Name', dataIndex: 'name', ellipsis: true },
    ]
    const el = await fixture<MacDataTable>(html`
      <mac-data-table .columns=${cols} .data=${makeData(1)} .pagination=${false}></mac-data-table>
    `)
    expect(el.shadowRoot!.querySelector('.cell--ellipsis')).toBeTruthy()
  })

  it('applies size attribute', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table .columns=${columns} .data=${makeData(1)} .pagination=${false} size="lg"></mac-data-table>
    `)
    expect(el.getAttribute('size')).toBe('lg')
  })

  it('clamps page when data shrinks', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table
        .columns=${columns}
        .data=${makeData(25)}
        .pagination=${{ pageSize: 10 } as DataTablePagination}
      ></mac-data-table>
    `)
    // go to page 3
    const next = el.shadowRoot!.querySelectorAll('.pagination-list .pg-btn')
    ;(next[next.length - 1] as HTMLElement).click()
    ;(next[next.length - 1] as HTMLElement).click()
    await elementUpdated(el)
    // shrink data
    el.data = makeData(5)
    await elementUpdated(el)
    const active = el.shadowRoot!.querySelector('.pg-btn.active') as HTMLElement
    expect(Number(active.textContent?.trim())).toBe(1)
  })

  it('does not emit change when pagination disabled', async () => {
    const el = await fixture<MacDataTable>(html`
      <mac-data-table
        .columns=${columns}
        .data=${makeData(25)}
        .pagination=${{ pageSize: 10, disabled: true } as DataTablePagination}
      ></mac-data-table>
    `)
    const handler = vi.fn()
    el.addEventListener('mac-data-table-change', handler)
    const next = el.shadowRoot!.querySelectorAll('.pagination-list .pg-btn')
    ;(next[next.length - 1] as HTMLElement).click()
    expect(handler).not.toHaveBeenCalled()
  })
})
