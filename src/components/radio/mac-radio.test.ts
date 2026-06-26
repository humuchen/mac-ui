import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacRadio, MacRadioGroup } from './mac-radio'

// Prevent Vite from tree-shaking the component import
void MacRadio
void MacRadioGroup

describe('MacRadio', () => {
  it('is defined', () => {
    expect(customElements.get('mac-radio')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacRadio>('<mac-radio></mac-radio>')
    expect(el.value).to.equal('')
    expect(el.checked).to.be.false
    expect(el.disabled).to.be.false
  })

  it('renders with label', async () => {
    const el = await fixture<MacRadio>('<mac-radio label="Test Label"></mac-radio>')
    const label = el.shadowRoot!.querySelector('.label')
    expect(label).to.not.be.null
    expect(label!.textContent!.trim()).to.equal('Test Label')
  })

  it('shows checked state', async () => {
    const el = await fixture<MacRadio>('<mac-radio checked></mac-radio>')
    const radio = el.shadowRoot!.querySelector('.radio')!
    expect(radio.classList.contains('radio--checked')).to.be.true
  })

  it('shows disabled state', async () => {
    const el = await fixture<MacRadio>('<mac-radio disabled></mac-radio>')
    const radio = el.shadowRoot!.querySelector('.radio')!
    expect(radio.classList.contains('radio--disabled')).to.be.true
  })

  it('emits mac-change when clicked', async () => {
    const el = await fixture<MacRadio>('<mac-radio value="test"></mac-radio>')
    const changeSpy = vi.fn()
    el.addEventListener('mac-change', changeSpy)
    const radio = el.shadowRoot!.querySelector('.radio')!
    radio.dispatchEvent(new Event('click', { bubbles: true, composed: true }))
    expect(changeSpy).toHaveBeenCalledOnce()
  })
})

describe('MacRadioGroup', () => {
  it('is defined', () => {
    expect(customElements.get('mac-radio-group')).to.be.instanceOf(Function)
  })

  it('renders with slot radios', async () => {
    const el = await fixture<MacRadioGroup>(`
      <mac-radio-group value="b">
        <mac-radio value="a" label="A"></mac-radio>
        <mac-radio value="b" label="B"></mac-radio>
      </mac-radio-group>
    `)
    const radios = el.querySelectorAll('mac-radio')
    expect(radios.length).to.equal(2)
  })

  it('renders with options array', async () => {
    const el = await fixture<MacRadioGroup>(`
      <mac-radio-group></mac-radio-group>
    `)
    el.options = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ]
    await el.updateComplete
    const radios = el.querySelectorAll('mac-radio')
    expect(radios.length).to.equal(2)
  })

  it('emits mac-change on selection', async () => {
    const el = await fixture<MacRadioGroup>(`
      <mac-radio-group>
        <mac-radio value="a" label="A"></mac-radio>
        <mac-radio value="b" label="B"></mac-radio>
      </mac-radio-group>
    `)
    const changeSpy = vi.fn()
    el.addEventListener('mac-change', changeSpy)
    const radio = el.querySelector('mac-radio[value="b"]') as MacRadio
    radio.shadowRoot!.querySelector('.radio')!.dispatchEvent(new Event('click'))
    expect(changeSpy).toHaveBeenCalledOnce()
  })

  it('disables all radios when group is disabled', async () => {
    const el = await fixture<MacRadioGroup>(`
      <mac-radio-group disabled>
        <mac-radio value="a" label="A"></mac-radio>
      </mac-radio-group>
    `)
    const radio = el.querySelector('mac-radio') as MacRadio
    expect(radio.disabled).to.be.true
  })
})
