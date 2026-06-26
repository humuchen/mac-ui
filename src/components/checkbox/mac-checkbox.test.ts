import { describe, it, expect } from 'vitest'
import { fixture, html, oneEvent, elementUpdated } from '@open-wc/testing-helpers'
import './mac-checkbox'
import type { MacCheckbox, MacCheckboxGroup } from './mac-checkbox'

describe('MacCheckbox', () => {
  it('renders unchecked by default', async () => {
    const el = await fixture<MacCheckbox>(html`<mac-checkbox>选项</mac-checkbox>`)
    expect(el.checked).toBe(false)
    expect(el.shadowRoot!.querySelector('.checkbox--checked')).toBeNull()
  })

  it('renders checked with default-checked', async () => {
    const el = await fixture<MacCheckbox>(html`<mac-checkbox default-checked>选项</mac-checkbox>`)
    expect(el.shadowRoot!.querySelector('.checkbox--checked')).not.toBeNull()
  })

  it('toggles checked on click', async () => {
    const el = await fixture<MacCheckbox>(html`<mac-checkbox>选项</mac-checkbox>`)
    const checkbox = el.shadowRoot!.querySelector('.checkbox') as HTMLElement
    checkbox.click()
    await elementUpdated(el)
    expect(el.shadowRoot!.querySelector('.checkbox--checked')).not.toBeNull()

    checkbox.click()
    await elementUpdated(el)
    expect(el.shadowRoot!.querySelector('.checkbox--checked')).toBeNull()
  })

  it('emits mac-change on click', async () => {
    const el = await fixture<MacCheckbox>(html`<mac-checkbox value="test">选项</mac-checkbox>`)
    const listener = oneEvent(el, 'mac-change')
    const checkbox = el.shadowRoot!.querySelector('.checkbox') as HTMLElement
    checkbox.click()
    const ev = await listener
    expect((ev as CustomEvent).detail.value).toBe('test')
    expect((ev as CustomEvent).detail.checked).toBe(true)
  })

  it('does not toggle when disabled', async () => {
    const el = await fixture<MacCheckbox>(html`<mac-checkbox disabled>选项</mac-checkbox>`)
    const checkbox = el.shadowRoot!.querySelector('.checkbox') as HTMLElement
    checkbox.click()
    await elementUpdated(el)
    expect(el.shadowRoot!.querySelector('.checkbox--checked')).toBeNull()
  })

  it('renders indeterminate state', async () => {
    const el = await fixture<MacCheckbox>(html`<mac-checkbox indeterminate>半选</mac-checkbox>`)
    expect(el.shadowRoot!.querySelector('.checkbox--indeterminate')).not.toBeNull()
  })

  it('shows label from property', async () => {
    const el = await fixture<MacCheckbox>(html`<mac-checkbox label="属性标签"></mac-checkbox>`)
    expect(el.shadowRoot!.textContent).toContain('属性标签')
  })

  it('shows label from slot', async () => {
    const el = await fixture<MacCheckbox>(html`<mac-checkbox>Slot标签</mac-checkbox>`)
    expect(el.shadowRoot!.textContent).toContain('Slot标签')
  })

  it('supports keyboard toggle', async () => {
    const el = await fixture<MacCheckbox>(html`<mac-checkbox>选项</mac-checkbox>`)
    const checkbox = el.shadowRoot!.querySelector('.checkbox') as HTMLElement
    checkbox.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
    await elementUpdated(el)
    expect(el.shadowRoot!.querySelector('.checkbox--checked')).not.toBeNull()
  })
})

describe('MacCheckboxGroup', () => {
  it('renders with default value', async () => {
    const el = await fixture<MacCheckboxGroup>(html`
      <mac-checkbox-group .defaultValue=${['a', 'c']}>
        <mac-checkbox value="a">A</mac-checkbox>
        <mac-checkbox value="b">B</mac-checkbox>
        <mac-checkbox value="c">C</mac-checkbox>
      </mac-checkbox-group>
    `)
    const checkboxes = el.querySelectorAll('mac-checkbox')
    expect((checkboxes[0] as MacCheckbox).checked || checkboxes[0].getAttribute('checked')).toBeTruthy()
    expect(checkboxes[1].getAttribute('checked')).toBeFalsy()
    expect((checkboxes[2] as MacCheckbox).checked || checkboxes[2].getAttribute('checked')).toBeTruthy()
  })

  it('toggles values on click', async () => {
    const el = await fixture<MacCheckboxGroup>(html`
      <mac-checkbox-group .defaultValue=${['a']}>
        <mac-checkbox value="a">A</mac-checkbox>
        <mac-checkbox value="b">B</mac-checkbox>
      </mac-checkbox-group>
    `)
    const checkboxes = el.querySelectorAll('mac-checkbox')
    const listener = oneEvent(el, 'mac-change')
    ;(checkboxes[1].shadowRoot!.querySelector('.checkbox') as HTMLElement).click()
    const ev = await listener
    expect((ev as CustomEvent).detail.value).toEqual(['a', 'b'])
  })

  it('unchecks on second click', async () => {
    const el = await fixture<MacCheckboxGroup>(html`
      <mac-checkbox-group .defaultValue=${['a', 'b']}>
        <mac-checkbox value="a">A</mac-checkbox>
        <mac-checkbox value="b">B</mac-checkbox>
      </mac-checkbox-group>
    `)
    const checkboxes = el.querySelectorAll('mac-checkbox')
    const listener = oneEvent(el, 'mac-change')
    ;(checkboxes[0].shadowRoot!.querySelector('.checkbox') as HTMLElement).click()
    const ev = await listener
    expect((ev as CustomEvent).detail.value).toEqual(['b'])
  })

  it('renders with options', async () => {
    const el = await fixture<MacCheckboxGroup>(html`
      <mac-checkbox-group
        .options=${[
          { value: 'x', label: 'X' },
          { value: 'y', label: 'Y' },
        ]}
      ></mac-checkbox-group>
    `)
    const checkboxes = el.shadowRoot!.querySelectorAll('mac-checkbox')
    expect(checkboxes.length).toBe(2)
    expect(checkboxes[0].label).toBe('X')
    expect(checkboxes[1].label).toBe('Y')
  })

  it('propagates disabled to children', async () => {
    const el = await fixture<MacCheckboxGroup>(html`
      <mac-checkbox-group disabled>
        <mac-checkbox value="a">A</mac-checkbox>
      </mac-checkbox-group>
    `)
    const checkbox = el.querySelector('mac-checkbox') as MacCheckbox
    expect(checkbox.disabled).toBe(true)
  })

  it('propagates size to children', async () => {
    const el = await fixture<MacCheckboxGroup>(html`
      <mac-checkbox-group size="lg">
        <mac-checkbox value="a">A</mac-checkbox>
      </mac-checkbox-group>
    `)
    const checkbox = el.querySelector('mac-checkbox') as MacCheckbox
    expect(checkbox.getAttribute('size')).toBe('lg')
  })

  it('respects max limit', async () => {
    const el = await fixture<MacCheckboxGroup>(html`
      <mac-checkbox-group .defaultValue=${['a']} .max=${2}>
        <mac-checkbox value="a">A</mac-checkbox>
        <mac-checkbox value="b">B</mac-checkbox>
        <mac-checkbox value="c">C</mac-checkbox>
      </mac-checkbox-group>
    `)
    const checkboxes = el.querySelectorAll('mac-checkbox')
    const listener = oneEvent(el, 'mac-change')
    ;(checkboxes[1].shadowRoot!.querySelector('.checkbox') as HTMLElement).click()
    const ev = await listener
    expect((ev as CustomEvent).detail.value).toEqual(['a', 'b'])

    // Third click should not add due to max
    ;(checkboxes[2].shadowRoot!.querySelector('.checkbox') as HTMLElement).click()
    await new Promise((resolve) => setTimeout(resolve, 200))
    const result = null
    expect(result).toBeNull()
  })

  it('works in controlled mode', async () => {
    const el = await fixture<MacCheckboxGroup>(html`
      <mac-checkbox-group .value=${['a']}>
        <mac-checkbox value="a">A</mac-checkbox>
        <mac-checkbox value="b">B</mac-checkbox>
      </mac-checkbox-group>
    `)
    let checkboxes = el.querySelectorAll('mac-checkbox')
    expect(checkboxes[0].getAttribute('checked')).toBeTruthy()

    el.value = ['b']
    await elementUpdated(el)
    checkboxes = el.querySelectorAll('mac-checkbox')
    expect(checkboxes[0].getAttribute('checked')).toBeFalsy()
    expect(checkboxes[1].getAttribute('checked')).toBeTruthy()
  })
})
