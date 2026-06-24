import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacInput } from './mac-input'

describe('MacInput', () => {
  it('is defined', () => {
    expect(customElements.get('mac-input')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacInput>('<mac-input></mac-input>')
    expect(el.value).to.equal('')
    expect(el.size).to.equal('md')
    expect(el.disabled).to.be.false
    expect(el.error).to.be.false
  })

  it('renders with label', async () => {
    const el = await fixture<MacInput>('<mac-input label="Name"></mac-input>')
    const label = el.shadowRoot!.querySelector('.label')
    expect(label).to.not.be.null
    expect(label!.textContent!.trim()).to.equal('Name')
  })

  it('shows required indicator', async () => {
    const el = await fixture<MacInput>('<mac-input label="Name" required></mac-input>')
    const label = el.shadowRoot!.querySelector('.label')!
    expect(label.classList.contains('label--required')).to.be.true
  })

  it('shows error state', async () => {
    const el = await fixture<MacInput>('<mac-input error helper-text="Error message"></mac-input>')
    const container = el.shadowRoot!.querySelector('.input-container')!
    expect(container.classList.contains('input-container--error')).to.be.true
    const helperText = el.shadowRoot!.querySelector('.helper-text--error')
    expect(helperText).to.not.be.null
  })

  it('emits mac-input on value change', async () => {
    const el = await fixture<MacInput>('<mac-input></mac-input>')
    const inputSpy = vi.fn()
    el.addEventListener('mac-input', inputSpy)
    const input = el.shadowRoot!.querySelector('input')!
    input.value = 'test'
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    expect(inputSpy).toHaveBeenCalledOnce()
  })

  it('disables input when disabled attribute is set', async () => {
    const el = await fixture<MacInput>('<mac-input disabled></mac-input>')
    const input = el.shadowRoot!.querySelector('input')! as HTMLInputElement
    expect(input.disabled).to.be.true
  })
})
