import { describe, it, expect } from 'vitest'
import { fixture, html, oneEvent, elementUpdated } from '@open-wc/testing-helpers'
import './mac-tree'
import type { MacTree, TreeNodeData } from './mac-tree'

const sampleData: TreeNodeData[] = [
  {
    key: '1',
    label: 'Root',
    children: [
      { key: '1-1', label: 'Child 1' },
      { key: '1-2', label: 'Child 2' },
    ],
  },
  { key: '2', label: 'Leaf' },
]

describe('MacTree', () => {
  it('renders tree nodes', async () => {
    const el = await fixture<MacTree>(html`<mac-tree .data=${sampleData}></mac-tree>`)
    const nodes = el.shadowRoot!.querySelectorAll('.tree-node')
    expect(nodes.length).toBe(2)
    expect(nodes[0].textContent).toContain('Root')
    expect(nodes[1].textContent).toContain('Leaf')
  })

  it('shows empty text when no data', async () => {
    const el = await fixture<MacTree>(html`<mac-tree .data=${[]} empty-text="Empty"></mac-tree>`)
    expect(el.shadowRoot!.textContent).toContain('Empty')
  })

  it('expands node on toggle click', async () => {
    const el = await fixture<MacTree>(html`<mac-tree .data=${sampleData}></mac-tree>`)
    const toggle = el.shadowRoot!.querySelector('.tree-toggle') as HTMLElement
    toggle.click()
    await elementUpdated(el)
    const children = el.shadowRoot!.querySelectorAll('.tree-children')
    expect(children.length).toBe(1)
  })

  it('emits mac-expand on toggle', async () => {
    const el = await fixture<MacTree>(html`<mac-tree .data=${sampleData}></mac-tree>`)
    const listener = oneEvent(el, 'mac-expand')
    const toggle = el.shadowRoot!.querySelector('.tree-toggle') as HTMLElement
    toggle.click()
    const ev = await listener
    expect((ev as CustomEvent).detail.key).toBe('1')
    expect((ev as CustomEvent).detail.expanded).toBe(true)
  })

  it('selects node on click', async () => {
    const el = await fixture<MacTree>(html`<mac-tree .data=${sampleData}></mac-tree>`)
    const node = el.shadowRoot!.querySelectorAll('.tree-node')[1] as HTMLElement
    node.click()
    await elementUpdated(el)
    expect(node.classList.contains('tree-node--selected')).toBe(true)
  })

  it('emits mac-select on click', async () => {
    const el = await fixture<MacTree>(html`<mac-tree .data=${sampleData}></mac-tree>`)
    const listener = oneEvent(el, 'mac-select')
    const node = el.shadowRoot!.querySelectorAll('.tree-node')[1] as HTMLElement
    node.click()
    const ev = await listener
    expect((ev as CustomEvent).detail.key).toBe('2')
    expect((ev as CustomEvent).detail.selected).toBe(true)
  })

  it('supports multiple selection', async () => {
    const el = await fixture<MacTree>(html`<mac-tree .data=${sampleData} multiple></mac-tree>`)
    const nodes = el.shadowRoot!.querySelectorAll('.tree-node')
    ;(nodes[0] as HTMLElement).click()
    await elementUpdated(el)
    ;(nodes[1] as HTMLElement).click()
    await elementUpdated(el)
    const selected = el.shadowRoot!.querySelectorAll('.tree-node--selected')
    expect(selected.length).toBe(2)
  })

  it('does not select disabled node', async () => {
    const data: TreeNodeData[] = [{ key: 'd', label: 'Disabled', disabled: true }]
    const el = await fixture<MacTree>(html`<mac-tree .data=${data}></mac-tree>`)
    const node = el.shadowRoot!.querySelector('.tree-node') as HTMLElement
    node.click()
    await elementUpdated(el)
    expect(node.classList.contains('tree-node--selected')).toBe(false)
  })

  it('renders checkboxes when checkable', async () => {
    const el = await fixture<MacTree>(html`<mac-tree .data=${sampleData} checkable></mac-tree>`)
    const checkboxes = el.shadowRoot!.querySelectorAll('.tree-checkbox')
    expect(checkboxes.length).toBe(2)
  })

  it('toggles check on checkbox click', async () => {
    const el = await fixture<MacTree>(html`<mac-tree .data=${sampleData} checkable></mac-tree>`)
    const checkbox = el.shadowRoot!.querySelector('.tree-checkbox') as HTMLElement
    checkbox.click()
    await elementUpdated(el)
    expect(checkbox.classList.contains('tree-checkbox--checked')).toBe(true)
  })

  it('emits mac-check on checkbox click', async () => {
    const el = await fixture<MacTree>(html`<mac-tree .data=${sampleData} checkable></mac-tree>`)
    const listener = oneEvent(el, 'mac-check')
    const checkbox = el.shadowRoot!.querySelector('.tree-checkbox') as HTMLElement
    checkbox.click()
    const ev = await listener
    expect((ev as CustomEvent).detail.key).toBe('1')
    expect((ev as CustomEvent).detail.checked).toBe(true)
  })

  it('expands all with default-expand-all', async () => {
    const el = await fixture<MacTree>(
      html`<mac-tree .data=${sampleData} default-expand-all></mac-tree>`,
    )
    await elementUpdated(el)
    const children = el.shadowRoot!.querySelectorAll('.tree-children .tree-node')
    expect(children.length).toBe(2)
  })

  it('respects controlled expandedKeys', async () => {
    const el = await fixture<MacTree>(
      html`<mac-tree .data=${sampleData} .expandedKeys=${['1']}></mac-tree>`,
    )
    const children = el.shadowRoot!.querySelectorAll('.tree-children .tree-node')
    expect(children.length).toBe(2)
  })
})
