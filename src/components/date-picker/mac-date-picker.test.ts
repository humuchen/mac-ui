import { describe, it, expect, vi, afterEach } from 'vitest'
import { fixture, html, oneEvent, elementUpdated } from '@open-wc/testing-helpers'
import './mac-date-picker'
import type { MacDatePicker } from './mac-date-picker'

describe('MacDatePicker', () => {
  afterEach(() => {
    // Clean up any portals created during tests
    const portals = document.querySelectorAll('.mac-date-picker-portal')
    portals.forEach((p) => p.remove())
  })

  it('renders with placeholder', async () => {
    const el = await fixture<MacDatePicker>(
      html`<mac-date-picker placeholder="请选择"></mac-date-picker>`,
    )
    expect(el.shadowRoot!.textContent).toContain('请选择')
  })

  it('renders with default value', async () => {
    const el = await fixture<MacDatePicker>(
      html`<mac-date-picker .defaultValue=${'2024-06-15'}></mac-date-picker>`,
    )
    expect(el.shadowRoot!.textContent).toContain('2024-06-15')
  })

  it('opens panel on click', async () => {
    const el = await fixture<MacDatePicker>(html`<mac-date-picker></mac-date-picker>`)
    const trigger = el.shadowRoot!.querySelector('.picker-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)
    // Panel is now rendered in portal (document.body)
    const portal = document.querySelector('.mac-date-picker-portal')
    expect(portal).toBeTruthy()
    expect(portal!.classList.contains('open')).toBe(true)
  })

  it('closes panel on Escape', async () => {
    const el = await fixture<MacDatePicker>(html`<mac-date-picker></mac-date-picker>`)
    const trigger = el.shadowRoot!.querySelector('.picker-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await elementUpdated(el)
    // Panel should be removed from portal
    const portal = document.querySelector('.mac-date-picker-portal.open')
    expect(portal).toBeFalsy()
  })

  it('selects a date and emits mac-change', async () => {
    const el = await fixture<MacDatePicker>(html`<mac-date-picker></mac-date-picker>`)
    const trigger = el.shadowRoot!.querySelector('.picker-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)

    const listener = oneEvent(el, 'mac-change')
    // Panel is now in portal
    const portal = document.querySelector('.mac-date-picker-portal')
    const days = portal!.querySelectorAll('.day')
    // Click a visible current-month day
    const dayBtn = Array.from(days).find(
      (d) => !d.classList.contains('day--other-month') && !d.classList.contains('day--disabled'),
    ) as HTMLElement
    expect(dayBtn).toBeTruthy()
    dayBtn.click()

    const ev = await listener
    expect((ev as CustomEvent).detail.value).toBeTruthy()
    expect((ev as CustomEvent).detail.date).toBeInstanceOf(Date)
  })

  it('does not open when disabled', async () => {
    const el = await fixture<MacDatePicker>(html`<mac-date-picker disabled></mac-date-picker>`)
    const trigger = el.shadowRoot!.querySelector('.picker-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)
    // No portal should be created when disabled
    const portal = document.querySelector('.mac-date-picker-portal.open')
    expect(portal).toBeFalsy()
  })

  it('clears value when clear button clicked', async () => {
    const el = await fixture<MacDatePicker>(
      html`<mac-date-picker .defaultValue=${'2024-06-15'} clearable></mac-date-picker>`,
    )
    const clearBtn = el.shadowRoot!.querySelector('.picker-clear') as HTMLElement
    expect(clearBtn).toBeTruthy()

    const listener = oneEvent(el, 'mac-change')
    clearBtn.click()
    const ev = await listener
    expect((ev as CustomEvent).detail.value).toBe('')
  })

  it('navigates months with prev/next buttons', async () => {
    const el = await fixture<MacDatePicker>(html`<mac-date-picker></mac-date-picker>`)
    const trigger = el.shadowRoot!.querySelector('.picker-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)

    // Panel is now in portal
    const portal = document.querySelector('.mac-date-picker-portal')
    const title = portal!.querySelector('.panel-header-title') as HTMLElement
    const initialText = title.textContent

    const nextBtn = portal!.querySelectorAll('.panel-nav-btn')[1] as HTMLElement
    nextBtn.click()
    await elementUpdated(el)

    expect(title.textContent).not.toBe(initialText)
  })

  it('respects disabledDate function', async () => {
    const disabledDate = (date: Date) => {
      const d = new Date('2024-06-01')
      return date < d
    }
    const el = await fixture<MacDatePicker>(
      html`<mac-date-picker
        .defaultValue=${'2024-06-15'}
        .disabledDate=${disabledDate}
      ></mac-date-picker>`,
    )
    const trigger = el.shadowRoot!.querySelector('.picker-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)

    // Panel is now in portal
    const portal = document.querySelector('.mac-date-picker-portal')
    const disabledDays = portal!.querySelectorAll('.day--disabled')
    expect(disabledDays.length).toBeGreaterThan(0)
  })

  it('works in controlled mode', async () => {
    const el = await fixture<MacDatePicker>(
      html`<mac-date-picker .value=${'2024-06-15'}></mac-date-picker>`,
    )
    expect(el.shadowRoot!.textContent).toContain('2024-06-15')

    el.value = '2024-07-20'
    await elementUpdated(el)
    expect(el.shadowRoot!.textContent).toContain('2024-07-20')
  })

  it('renders inline panel when panel prop is true', async () => {
    const el = await fixture<MacDatePicker>(html`<mac-date-picker panel></mac-date-picker>`)
    // Inline panel should be in shadowRoot when panel=true
    const inlinePanel = el.shadowRoot!.querySelector('.picker-panel--inline')
    expect(inlinePanel).toBeTruthy()
  })
})
