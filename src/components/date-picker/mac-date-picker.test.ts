import { describe, it, expect } from 'vitest'
import { fixture, html, oneEvent, elementUpdated } from '@open-wc/testing-helpers'
import './mac-date-picker'
import type { MacDatePicker } from './mac-date-picker'

describe('MacDatePicker', () => {
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
    const el = await fixture<MacDatePicker>(
      html`<mac-date-picker></mac-date-picker>`,
    )
    const trigger = el.shadowRoot!.querySelector('.picker-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)
    expect(el.shadowRoot!.querySelector('.picker-panel')!.classList.contains('open')).toBe(true)
  })

  it('closes panel on Escape', async () => {
    const el = await fixture<MacDatePicker>(
      html`<mac-date-picker></mac-date-picker>`,
    )
    const trigger = el.shadowRoot!.querySelector('.picker-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await elementUpdated(el)
    expect(el.shadowRoot!.querySelector('.picker-panel')!.classList.contains('open')).toBe(false)
  })

  it('selects a date and emits mac-change', async () => {
    const el = await fixture<MacDatePicker>(
      html`<mac-date-picker></mac-date-picker>`,
    )
    const trigger = el.shadowRoot!.querySelector('.picker-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)

    const listener = oneEvent(el, 'mac-change')
    const days = el.shadowRoot!.querySelectorAll('.day')
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
    const el = await fixture<MacDatePicker>(
      html`<mac-date-picker disabled></mac-date-picker>`,
    )
    const trigger = el.shadowRoot!.querySelector('.picker-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)
    expect(el.shadowRoot!.querySelector('.picker-panel')!.classList.contains('open')).toBe(false)
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
    const el = await fixture<MacDatePicker>(
      html`<mac-date-picker></mac-date-picker>`,
    )
    const trigger = el.shadowRoot!.querySelector('.picker-trigger') as HTMLElement
    trigger.click()
    await elementUpdated(el)

    const title = el.shadowRoot!.querySelector('.panel-header-title') as HTMLElement
    const initialText = title.textContent

    const nextBtn = el.shadowRoot!.querySelectorAll('.panel-nav-btn')[1] as HTMLElement
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

    const disabledDays = el.shadowRoot!.querySelectorAll('.day--disabled')
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
})
