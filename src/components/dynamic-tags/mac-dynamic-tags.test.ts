import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fixture, html, oneEvent, elementUpdated } from '@open-wc/testing-helpers'
import './mac-dynamic-tags'
import '../tag/mac-tag'
import type { MacDynamicTags } from './mac-dynamic-tags'

describe('MacDynamicTags', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  it('renders with default value', async () => {
    const el = await fixture<MacDynamicTags>(html`
      <mac-dynamic-tags .defaultValue=${['a', 'b', 'c']}></mac-dynamic-tags>
    `)
    const tags = el.shadowRoot!.querySelectorAll('mac-tag')
    expect(tags.length).toBe(3)
    expect(tags[0].textContent).toContain('a')
    expect(tags[1].textContent).toContain('b')
    expect(tags[2].textContent).toContain('c')
  })

  it('renders with empty default', async () => {
    const el = await fixture<MacDynamicTags>(html`<mac-dynamic-tags></mac-dynamic-tags>`)
    const tags = el.shadowRoot!.querySelectorAll('mac-tag')
    expect(tags.length).toBe(0)
  })

  it('shows add button when not at max', async () => {
    const el = await fixture<MacDynamicTags>(html`
      <mac-dynamic-tags .defaultValue=${['a']} .max=${3}></mac-dynamic-tags>
    `)
    const addBtn = el.shadowRoot!.querySelector('.add-button')
    expect(addBtn).not.toBeNull()
  })

  it('hides add button when at max', async () => {
    const el = await fixture<MacDynamicTags>(html`
      <mac-dynamic-tags .defaultValue=${['a', 'b']} .max=${2}></mac-dynamic-tags>
    `)
    const addBtn = el.shadowRoot!.querySelector('.add-button')
    expect(addBtn).toBeNull()
  })

  it('shows input when clicking add button', async () => {
    const el = await fixture<MacDynamicTags>(html`<mac-dynamic-tags></mac-dynamic-tags>`)
    const addBtn = el.shadowRoot!.querySelector('.add-button') as HTMLButtonElement
    addBtn.click()
    await elementUpdated(el)
    const input = el.shadowRoot!.querySelector('.input')
    expect(input).not.toBeNull()
  })

  it('adds tag on Enter key', async () => {
    const el = await fixture<MacDynamicTags>(html`<mac-dynamic-tags></mac-dynamic-tags>`)
    const addBtn = el.shadowRoot!.querySelector('.add-button') as HTMLButtonElement
    addBtn.click()
    await elementUpdated(el)

    const input = el.shadowRoot!.querySelector('.input') as HTMLInputElement
    input.value = 'new-tag'
    input.dispatchEvent(new Event('input'))

    const listener = oneEvent(el, 'mac-update')
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    const ev = await listener

    expect((ev as CustomEvent).detail.value).toEqual(['new-tag'])
  })

  it('adds tag on blur', async () => {
    const el = await fixture<MacDynamicTags>(html`<mac-dynamic-tags></mac-dynamic-tags>`)
    const addBtn = el.shadowRoot!.querySelector('.add-button') as HTMLButtonElement
    addBtn.click()
    await elementUpdated(el)

    const input = el.shadowRoot!.querySelector('.input') as HTMLInputElement
    input.value = 'blur-tag'
    input.dispatchEvent(new Event('input'))

    const listener = oneEvent(el, 'mac-update')
    input.dispatchEvent(new Event('blur'))
    vi.advanceTimersByTime(200)
    const ev = await listener

    expect((ev as CustomEvent).detail.value).toEqual(['blur-tag'])
  })

  it('does not add empty tag', async () => {
    const el = await fixture<MacDynamicTags>(html`<mac-dynamic-tags></mac-dynamic-tags>`)
    const addBtn = el.shadowRoot!.querySelector('.add-button') as HTMLButtonElement
    addBtn.click()
    await elementUpdated(el)

    const input = el.shadowRoot!.querySelector('.input') as HTMLInputElement
    input.value = '   '
    input.dispatchEvent(new Event('input'))

    const listener = oneEvent(el, 'mac-update')
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))

    const result = await Promise.race([
      listener,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 200)),
    ])
    expect(result).toBeNull()
  })

  it('prevents duplicate tags', async () => {
    const el = await fixture<MacDynamicTags>(html`
      <mac-dynamic-tags .defaultValue=${['existing']}></mac-dynamic-tags>
    `)
    const addBtn = el.shadowRoot!.querySelector('.add-button') as HTMLButtonElement
    addBtn.click()
    await elementUpdated(el)

    const input = el.shadowRoot!.querySelector('.input') as HTMLInputElement
    input.value = 'existing'
    input.dispatchEvent(new Event('input'))

    const listener = oneEvent(el, 'mac-update')
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))

    const result = await Promise.race([
      listener,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 300)),
    ])
    expect(result).toBeNull()
  })

  it('hides input on Escape', async () => {
    const el = await fixture<MacDynamicTags>(html`<mac-dynamic-tags></mac-dynamic-tags>`)
    const addBtn = el.shadowRoot!.querySelector('.add-button') as HTMLButtonElement
    addBtn.click()
    await elementUpdated(el)

    const input = el.shadowRoot!.querySelector('.input') as HTMLInputElement
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await elementUpdated(el)

    expect(el.shadowRoot!.querySelector('.input')).toBeNull()
    expect(el.shadowRoot!.querySelector('.add-button')).not.toBeNull()
  })

  it('removes tag on close', async () => {
    const el = await fixture<MacDynamicTags>(html`
      <mac-dynamic-tags .defaultValue=${['a', 'b', 'c']}></mac-dynamic-tags>
    `)
    const tags = el.shadowRoot!.querySelectorAll('mac-tag')
    const listener = oneEvent(el, 'mac-update')
    tags[1].dispatchEvent(new CustomEvent('mac-close'))
    const ev = await listener

    expect((ev as CustomEvent).detail.value).toEqual(['a', 'c'])
  })

  it('emits mac-add event', async () => {
    const el = await fixture<MacDynamicTags>(html`<mac-dynamic-tags></mac-dynamic-tags>`)
    const addBtn = el.shadowRoot!.querySelector('.add-button') as HTMLButtonElement
    addBtn.click()
    await elementUpdated(el)

    const input = el.shadowRoot!.querySelector('.input') as HTMLInputElement
    input.value = 'added'
    input.dispatchEvent(new Event('input'))

    const listener = oneEvent(el, 'mac-add')
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    const ev = await listener

    expect((ev as CustomEvent).detail.value).toBe('added')
    expect((ev as CustomEvent).detail.index).toBe(0)
  })

  it('emits mac-remove event', async () => {
    const el = await fixture<MacDynamicTags>(html`
      <mac-dynamic-tags .defaultValue=${['a', 'b']}></mac-dynamic-tags>
    `)
    const tags = el.shadowRoot!.querySelectorAll('mac-tag')
    const listener = oneEvent(el, 'mac-remove')
    tags[0].dispatchEvent(new CustomEvent('mac-close'))
    const ev = await listener

    expect((ev as CustomEvent).detail.value).toBe('a')
    expect((ev as CustomEvent).detail.index).toBe(0)
  })

  it('respects disabled state', async () => {
    const el = await fixture<MacDynamicTags>(html`
      <mac-dynamic-tags .defaultValue=${['a']} disabled></mac-dynamic-tags>
    `)
    const addBtn = el.shadowRoot!.querySelector('.add-button') as HTMLButtonElement | null
    expect(addBtn).toBeNull()
  })

  it('respects closable=false', async () => {
    const el = await fixture<MacDynamicTags>(html`
      <mac-dynamic-tags .defaultValue=${['a']} .closable=${false}></mac-dynamic-tags>
    `)
    const tag = el.shadowRoot!.querySelector('mac-tag')
    expect(tag!.closable).toBe(false)
  })

  it('propagates size to tags', async () => {
    const el = await fixture<MacDynamicTags>(html`
      <mac-dynamic-tags .defaultValue=${['a']} size="lg"></mac-dynamic-tags>
    `)
    const tag = el.shadowRoot!.querySelector('mac-tag')
    expect(tag!.getAttribute('size')).toBe('lg')
  })

  it('propagates type to tags', async () => {
    const el = await fixture<MacDynamicTags>(html`
      <mac-dynamic-tags .defaultValue=${['a']} type="success"></mac-dynamic-tags>
    `)
    const tag = el.shadowRoot!.querySelector('mac-tag')
    expect(tag!.getAttribute('type')).toBe('success')
  })

  it('works in controlled mode', async () => {
    const el = await fixture<MacDynamicTags>(html`
      <mac-dynamic-tags .value=${['x', 'y']}></mac-dynamic-tags>
    `)
    let tags = el.shadowRoot!.querySelectorAll('mac-tag')
    expect(tags.length).toBe(2)

    el.value = ['x', 'y', 'z']
    await elementUpdated(el)
    tags = el.shadowRoot!.querySelectorAll('mac-tag')
    expect(tags.length).toBe(3)
  })
})
