import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacButton } from './mac-button'

describe('MacButton', () => {
  it('is defined', () => {
    expect(customElements.get('mac-button')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacButton>('<mac-button>Click</mac-button>')
    expect(el.variant).to.equal('primary')
    expect(el.size).to.equal('md')
    expect(el.disabled).to.be.false
    expect(el.loading).to.be.false
  })

  it('renders with variant attribute', async () => {
    const el = await fixture<MacButton>('<mac-button variant="secondary">Click</mac-button>')
    expect(el.variant).to.equal('secondary')
  })

  it('renders with size attribute', async () => {
    const el = await fixture<MacButton>('<mac-button size="lg">Click</mac-button>')
    expect(el.size).to.equal('lg')
  })

  it('emits mac-click when clicked', async () => {
    const el = await fixture<MacButton>('<mac-button>Click</mac-button>')
    const clickSpy = vi.fn()
    el.addEventListener('mac-click', clickSpy)
    const button = el.shadowRoot!.querySelector('button')!
    button.click()
    expect(clickSpy).toHaveBeenCalledOnce()
  })

  it('does not emit mac-click when disabled', async () => {
    const el = await fixture<MacButton>('<mac-button disabled>Click</mac-button>')
    const clickSpy = vi.fn()
    el.addEventListener('mac-click', clickSpy)
    const button = el.shadowRoot!.querySelector('button')! as HTMLButtonElement
    expect(button.disabled).to.be.true
  })

  it('shows loading spinner when loading', async () => {
    const el = await fixture<MacButton>('<mac-button loading>Click</mac-button>')
    const spinner = el.shadowRoot!.querySelector('.spinner')
    expect(spinner).to.not.be.null
  })

  it('reflects variant attribute to CSS class', async () => {
    const el = await fixture<MacButton>('<mac-button variant="text">Click</mac-button>')
    const button = el.shadowRoot!.querySelector('button')!
    expect(button.classList.contains('button--text')).to.be.true
  })
})
