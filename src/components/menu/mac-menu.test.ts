import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fixture, html, elementUpdated } from '@open-wc/testing-helpers'
import '../dropdown/mac-dropdown'
import './mac-menu'
import type { MacMenu } from './mac-menu'
import type { DropdownItem } from '../dropdown/mac-dropdown'

describe('MacMenu', () => {
  let el: MacMenu

  const basicItems: DropdownItem[] = [
    { value: 'item1', label: 'Item 1' },
    { value: 'item2', label: 'Item 2' },
    { divider: true, value: '', label: '' },
    { value: 'item3', label: 'Item 3' },
  ]

  beforeEach(async () => {
    el = await fixture<MacMenu>(html`<mac-menu></mac-menu>`)
  })

  it('should be defined', () => {
    expect(el).toBeDefined()
    expect(el.tagName.toLowerCase()).toBe('mac-menu')
  })

  it('should have default properties', () => {
    expect(el.items).toEqual([])
    expect(el.value).toBe('')
    expect(el.visible).toBe(false)
    expect(el.x).toBe(0)
    expect(el.y).toBe(0)
  })

  it('should not be visible by default', () => {
    expect(el.visible).toBe(false)
  })

  it('should show menu at specified position', async () => {
    el.show(100, 100, basicItems)
    await elementUpdated(el)

    expect(el.visible).toBe(true)
    expect(el.x).toBe(100)
    expect(el.y).toBe(100)
    expect(el.items).toEqual(basicItems)
  })

  it('should hide menu', async () => {
    el.show(100, 100, basicItems)
    await elementUpdated(el)
    expect(el.visible).toBe(true)

    el.hide()
    await elementUpdated(el)
    expect(el.visible).toBe(false)
  })

  it('should toggle menu visibility', async () => {
    expect(el.visible).toBe(false)

    el.toggle(100, 100, basicItems)
    await elementUpdated(el)
    expect(el.visible).toBe(true)

    el.toggle(100, 100, basicItems)
    await elementUpdated(el)
    expect(el.visible).toBe(false)
  })

  it('should emit mac-menu-open event when shown', async () => {
    const handler = vi.fn()
    el.addEventListener('mac-menu-open', handler)

    el.show(100, 100, basicItems)
    await elementUpdated(el)

    expect(handler).toHaveBeenCalledOnce()
  })

  it('should emit mac-menu-close event when hidden', async () => {
    const handler = vi.fn()
    el.addEventListener('mac-menu-close', handler)

    el.show(100, 100, basicItems)
    await elementUpdated(el)

    el.hide()
    await elementUpdated(el)

    expect(handler).toHaveBeenCalledOnce()
  })

  it('should close on Escape key', async () => {
    el.show(100, 100, basicItems)
    await elementUpdated(el)
    expect(el.visible).toBe(true)

    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(event)
    await elementUpdated(el)

    expect(el.visible).toBe(false)
  })

  it('should close on outside click', async () => {
    el.show(100, 100, basicItems)
    await elementUpdated(el)
    expect(el.visible).toBe(true)

    // Simulate clicking outside the menu
    const event = new MouseEvent('mousedown', {
      bubbles: true,
      clientX: 0,
      clientY: 0,
    })
    document.body.dispatchEvent(event)
    await elementUpdated(el)

    expect(el.visible).toBe(false)
  })
})
