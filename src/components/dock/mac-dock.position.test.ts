import { describe, it, expect, vi } from 'vitest'
import { fixture, html } from '@open-wc/testing-helpers'
import './mac-dock'
import './mac-dock-item'
import type { MacDock } from './mac-dock'

describe('MacDock context menu position', () => {
  it('positions menu at cursor (no overflow)', async () => {
    const el = await fixture<MacDock>(html`
      <mac-dock>
        <mac-dock-item item-id="finder" label="Finder" color="#1C7FE2"></mac-dock-item>
      </mac-dock>
    `)

    await el.updateComplete

    const menu = el.shadowRoot!.querySelector('.dock-context-menu') as HTMLElement

    // Mock menu size: 200 x 80
    vi.spyOn(menu, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 80,
      top: 0,
      left: 0,
      right: 200,
      bottom: 80,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })

    Object.defineProperty(window, 'innerWidth', { value: 1000, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true })

    const item = el.querySelector('mac-dock-item')!
    item.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        composed: true,
        clientX: 300,
        clientY: 500,
      }),
    )

    expect(menu.classList.contains('visible')).toBe(true)
    expect(menu.style.left).toBe('300px')
    expect(menu.style.top).toBe('500px')
  })

  it('flips menu up when overflowing bottom', async () => {
    const el = await fixture<MacDock>(html`
      <mac-dock>
        <mac-dock-item item-id="finder" label="Finder" color="#1C7FE2"></mac-dock-item>
      </mac-dock>
    `)

    await el.updateComplete

    const menu = el.shadowRoot!.querySelector('.dock-context-menu') as HTMLElement

    vi.spyOn(menu, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 80,
      top: 0,
      left: 0,
      right: 200,
      bottom: 80,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })

    Object.defineProperty(window, 'innerWidth', { value: 1000, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true })

    // Click near the bottom: y=780, menu height 80 -> 780+80=860 > 800
    const item = el.querySelector('mac-dock-item')!
    item.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        composed: true,
        clientX: 300,
        clientY: 780,
      }),
    )

    expect(menu.style.left).toBe('300px')
    // y = 780 - 80 = 700
    expect(menu.style.top).toBe('700px')
  })

  it('compensates for ancestor transform (host offset)', async () => {
    const el = await fixture<MacDock>(html`
      <mac-dock>
        <mac-dock-item item-id="finder" label="Finder" color="#1C7FE2"></mac-dock-item>
      </mac-dock>
    `)

    await el.updateComplete

    const menu = el.shadowRoot!.querySelector('.dock-context-menu') as HTMLElement

    vi.spyOn(menu, 'getBoundingClientRect').mockReturnValue({
      width: 200,
      height: 80,
      top: 0,
      left: 0,
      right: 200,
      bottom: 80,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })

    // Simulate a transformed ancestor that offsets the host element to (100, 200).
    // With position: fixed this would misplace the menu; with position: absolute
    // relative to :host the coords are converted to host-relative.
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      width: 300,
      height: 60,
      top: 200,
      left: 100,
      right: 400,
      bottom: 260,
      x: 100,
      y: 200,
      toJSON: () => ({}),
    })

    Object.defineProperty(window, 'innerWidth', { value: 1000, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true })

    const item = el.querySelector('mac-dock-item')!
    item.dispatchEvent(
      new MouseEvent('contextmenu', {
        bubbles: true,
        composed: true,
        clientX: 450,
        clientY: 500,
      }),
    )

    // x = 450 - 100 = 350, y = 500 - 200 = 300 (host-relative coords)
    expect(menu.style.left).toBe('350px')
    expect(menu.style.top).toBe('300px')
  })
})
