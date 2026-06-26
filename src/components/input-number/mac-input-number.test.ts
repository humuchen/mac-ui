import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacInputNumber } from './mac-input-number'

// Prevent Vite from tree-shaking the component import
void MacInputNumber

describe('MacInputNumber', () => {
  it('is defined', () => {
    expect(customElements.get('mac-input-number')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacInputNumber>('<mac-input-number></mac-input-number>')
    expect(el.value).to.be.undefined
    expect(el.step).to.equal(1)
    expect(el.disabled).to.be.false
    expect(el.showButton).to.be.true
    expect(el.buttonPlacement).to.equal('inside')
  })

  it('renders with value', async () => {
    const el = await fixture<MacInputNumber>('<mac-input-number value="10"></mac-input-number>')
    const input = el.shadowRoot!.querySelector('input')! as HTMLInputElement
    expect(input.value).to.equal('10')
  })

  it('respects min and max', async () => {
    const el = await fixture<MacInputNumber>(
      '<mac-input-number value="10" min="0" max="100"></mac-input-number>',
    )
    expect(el.min).to.equal(0)
    expect(el.max).to.equal(100)
  })

  it('respects precision', async () => {
    const el = await fixture<MacInputNumber>(
      '<mac-input-number value="3.14159" precision="2"></mac-input-number>',
    )
    const input = el.shadowRoot!.querySelector('input')! as HTMLInputElement
    expect(input.value).to.equal('3.14')
  })

  it('shows step buttons by default', async () => {
    const el = await fixture<MacInputNumber>('<mac-input-number></mac-input-number>')
    const buttons = el.shadowRoot!.querySelector('.buttons')
    expect(buttons).to.not.be.null
  })

  it('hides step buttons when show-button is false', async () => {
    const el = await fixture<MacInputNumber>('<mac-input-number show-button="false"></mac-input-number>')
    const buttons = el.shadowRoot!.querySelector('.buttons')
    expect(buttons).to.be.null
  })

  it('disables input when disabled attribute is set', async () => {
    const el = await fixture<MacInputNumber>('<mac-input-number disabled></mac-input-number>')
    const input = el.shadowRoot!.querySelector('input')! as HTMLInputElement
    expect(input.disabled).to.be.true
  })

  it('shows error status', async () => {
    const el = await fixture<MacInputNumber>('<mac-input-number status="error"></mac-input-number>')
    const container = el.shadowRoot!.querySelector('.input-container')!
    expect(container.classList.contains('input-container--error')).to.be.true
  })

  it('shows success status', async () => {
    const el = await fixture<MacInputNumber>('<mac-input-number status="success"></mac-input-number>')
    const container = el.shadowRoot!.querySelector('.input-container')!
    expect(container.classList.contains('input-container--success')).to.be.true
  })

  it('emits mac-input-number on value change', async () => {
    const el = await fixture<MacInputNumber>('<mac-input-number></mac-input-number>')
    const inputSpy = vi.fn()
    el.addEventListener('mac-input-number', inputSpy)
    const input = el.shadowRoot!.querySelector('input')!
    input.value = '42'
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    expect(inputSpy).toHaveBeenCalledOnce()
  })

  it('handles keyboard arrow up', async () => {
    const el = await fixture<MacInputNumber>('<mac-input-number value="10" step="5"></mac-input-number>')
    const input = el.shadowRoot!.querySelector('input')!
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, composed: true }))
    const changeSpy = vi.fn()
    el.addEventListener('mac-input-number', changeSpy)
  })

  it('clears value when clear button is clicked', async () => {
    const el = await fixture<MacInputNumber>('<mac-input-number clearable value="10"></mac-input-number>')
    const clearBtn = el.shadowRoot!.querySelector('.clear-button')! as HTMLButtonElement
    expect(clearBtn).to.not.be.null
    clearBtn.click()
    expect(el.value).to.be.undefined
  })
})
