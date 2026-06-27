import { describe, it, expect, beforeEach } from 'vitest'
import { html, fixture, elementUpdated, oneEvent } from '@open-wc/testing-helpers'
import './mac-tree-select'
import type { MacTreeSelect, TreeOption } from './mac-tree-select'

const treeData: TreeOption[] = [
  {
    value: '1',
    label: 'Node 1',
    children: [
      { value: '1-1', label: 'Node 1-1' },
      { value: '1-2', label: 'Node 1-2' },
    ],
  },
  {
    value: '2',
    label: 'Node 2',
    children: [{ value: '2-1', label: 'Node 2-1' }],
  },
  { value: '3', label: 'Node 3' },
]

describe('mac-tree-select', () => {
  let el: MacTreeSelect

  beforeEach(async () => {
    el = await fixture<MacTreeSelect>(html`
      <mac-tree-select .options=${treeData}></mac-tree-select>
    `)
    await elementUpdated(el)
  })

  it('renders with placeholder', () => {
    expect(el.shadowRoot?.textContent).toContain('Select')
  })

  it('opens dropdown on trigger click', async () => {
    const trigger = el.shadowRoot!.querySelector('.tree-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)
    expect(el.shadowRoot?.querySelector('.tree-dropdown.open')).toBeTruthy()
  })

  it('selects a value in single mode', async () => {
    const trigger = el.shadowRoot!.querySelector('.tree-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)

    const node = el.shadowRoot!.querySelector('.tree-label') as HTMLElement
    node.click()
    await elementUpdated(el)

    expect(el.defaultValue).toBe('1')
  })

  it('emits mac-change event on select', async () => {
    const trigger = el.shadowRoot!.querySelector('.tree-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)

    setTimeout(() => {
      const node = el.shadowRoot!.querySelector('.tree-label') as HTMLElement
      node.click()
    })

    const ev = await oneEvent(el, 'mac-change')
    expect(ev.detail.value).toBe('1')
  })

  it('toggles expand/collapse', async () => {
    const trigger = el.shadowRoot!.querySelector('.tree-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)

    const toggle = el.shadowRoot!.querySelector(
      '.tree-toggle:not(.tree-toggle--placeholder)',
    ) as HTMLElement
    toggle.click()
    await elementUpdated(el)

    const children = el.shadowRoot!.querySelector('.tree-children')
    expect(children).toBeTruthy()

    toggle.click()
    await elementUpdated(el)
    expect(el.shadowRoot!.querySelector('.tree-children')).toBeFalsy()
  })

  it('supports multiple selection', async () => {
    el.multiple = true
    await elementUpdated(el)

    const trigger = el.shadowRoot!.querySelector('.tree-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)

    const nodes = el.shadowRoot!.querySelectorAll('.tree-label')
    ;(nodes[0] as HTMLElement).click()
    await elementUpdated(el)
    ;(nodes[1] as HTMLElement).click()
    await elementUpdated(el)

    expect(Array.isArray(el.defaultValue)).toBe(true)
  })

  it('filters options on search', async () => {
    el.searchable = true
    await elementUpdated(el)

    const trigger = el.shadowRoot!.querySelector('.tree-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)

    const input = el.shadowRoot!.querySelector('.tree-search-input') as HTMLInputElement
    input.value = '2-1'
    input.dispatchEvent(new Event('input'))
    await elementUpdated(el)

    const labels = el.shadowRoot!.querySelectorAll('.tree-label')
    expect(labels.length).toBeGreaterThan(0)
    expect(Array.from(labels).some((l) => l.textContent?.includes('2-1'))).toBe(true)
  })

  it('clears value on clear button click', async () => {
    el.clearable = true
    el.defaultValue = '1'
    await elementUpdated(el)

    const clearBtn = el.shadowRoot!.querySelector('.tree-clear') as HTMLElement
    clearBtn.click()
    await elementUpdated(el)

    expect(el.defaultValue).toBe('')
  })

  it('renders in panel mode without trigger', async () => {
    el.panel = true
    await elementUpdated(el)

    expect(el.shadowRoot!.querySelector('.tree-trigger')).toBeFalsy()
    expect(el.shadowRoot!.querySelector('.tree-dropdown--inline')).toBeTruthy()
  })
})
