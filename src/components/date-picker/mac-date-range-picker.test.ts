import { describe, it, expect, afterEach } from 'vitest'
import { fixture, html, oneEvent, elementUpdated } from '@open-wc/testing-helpers'
import './mac-date-range-picker'
import type { MacDateRangePicker } from './mac-date-range-picker'

describe('MacDateRangePicker', () => {
  afterEach(() => {
    // Clean up any portals created during tests
    const portals = document.querySelectorAll('.mac-date-range-picker-portal')
    portals.forEach((p) => p.remove())
  })

  it('renders with placeholder', async () => {
    const el = await fixture<MacDateRangePicker>(
      html`<mac-date-range-picker placeholder="请选择"></mac-date-range-picker>`,
    )
    expect(el.shadowRoot!.textContent).toContain('请选择')
  })

  it('renders with default value', async () => {
    const el = await fixture<MacDateRangePicker>(
      html`<mac-date-range-picker
        .defaultValue=${['2024-06-01', '2024-06-15']}
      ></mac-date-range-picker>`,
    )
    expect(el.shadowRoot!.textContent).toContain('2024-06-01')
    expect(el.shadowRoot!.textContent).toContain('2024-06-15')
  })

  it('opens panel on click', async () => {
    const el = await fixture<MacDateRangePicker>(
      html`<mac-date-range-picker></mac-date-range-picker>`,
    )
    const trigger = el.shadowRoot!.querySelector('.picker-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)
    // Panel is now rendered in portal (document.body)
    const portal = document.querySelector('.mac-date-range-picker-portal')
    expect(portal).toBeTruthy()
    expect(portal!.classList.contains('open')).toBe(true)
  })

  it('does not open when disabled', async () => {
    const el = await fixture<MacDateRangePicker>(
      html`<mac-date-range-picker disabled></mac-date-range-picker>`,
    )
    const trigger = el.shadowRoot!.querySelector('.picker-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)
    // No portal should be created when disabled
    const portal = document.querySelector('.mac-date-range-picker-portal.open')
    expect(portal).toBeFalsy()
  })

  it('selects range and emits mac-change', async () => {
    const el = await fixture<MacDateRangePicker>(
      html`<mac-date-range-picker></mac-date-range-picker>`,
    )
    const trigger = el.shadowRoot!.querySelector('.picker-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)

    // Panel is now in portal
    const portal = document.querySelector('.mac-date-range-picker-portal')
    const days = portal!.querySelectorAll('.day')
    const currentDays = Array.from(days).filter(
      (d) => !d.classList.contains('day--other') && !d.classList.contains('day--disabled'),
    )
    expect(currentDays.length).toBeGreaterThan(2)
    ;(currentDays[0] as HTMLElement).click()
    await elementUpdated(el)

    const listener2 = oneEvent(el, 'mac-change')
    ;(currentDays[5] as HTMLElement).click()
    const ev = await listener2
    expect((ev as CustomEvent).detail.value).toBeInstanceOf(Array)
    expect((ev as CustomEvent).detail.value.length).toBe(2)
    expect((ev as CustomEvent).detail.start).toBeTruthy()
    expect((ev as CustomEvent).detail.end).toBeTruthy()
  })

  it('clears value when clear button clicked', async () => {
    const el = await fixture<MacDateRangePicker>(
      html`<mac-date-range-picker
        .defaultValue=${['2024-06-01', '2024-06-15']}
        clearable
      ></mac-date-range-picker>`,
    )
    const clearBtn = el.shadowRoot!.querySelector('.picker-clear') as HTMLElement
    expect(clearBtn).toBeTruthy()

    const listener = oneEvent(el, 'mac-change')
    clearBtn.click()
    const ev = await listener
    expect((ev as CustomEvent).detail.value).toEqual(['', ''])
  })

  it('navigates months with prev/next buttons', async () => {
    const el = await fixture<MacDateRangePicker>(
      html`<mac-date-range-picker></mac-date-range-picker>`,
    )
    const trigger = el.shadowRoot!.querySelector('.picker-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)

    // Panel is now in portal
    const portal = document.querySelector('.mac-date-range-picker-portal')
    const titles = portal!.querySelectorAll('.panel-header-title')
    const initialTexts = Array.from(titles).map((t) => t.textContent)

    const nextBtns = portal!.querySelectorAll('.panel-nav-btn')
    ;(nextBtns[1] as HTMLElement).click()
    await elementUpdated(el)

    const newTitles = portal!.querySelectorAll('.panel-header-title')
    expect(newTitles[0].textContent).not.toBe(initialTexts[0])
  })

  it('works in controlled mode', async () => {
    const el = await fixture<MacDateRangePicker>(
      html`<mac-date-range-picker .value=${['2024-06-01', '2024-06-15']}></mac-date-range-picker>`,
    )
    expect(el.shadowRoot!.textContent).toContain('2024-06-01')

    el.value = ['2024-07-01', '2024-07-20']
    await elementUpdated(el)
    expect(el.shadowRoot!.textContent).toContain('2024-07-01')
    expect(el.shadowRoot!.textContent).toContain('2024-07-20')
  })
})
