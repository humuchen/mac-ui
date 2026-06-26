import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacAlert } from './mac-alert'

// Ensure component registration is not tree-shaken
void MacAlert

describe('MacAlert', () => {
  it('is defined', () => {
    expect(customElements.get('mac-alert')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacAlert>('<mac-alert>Content</mac-alert>')
    expect(el.type).to.equal('default')
    expect(el.title).to.equal('')
    expect(el.bordered).to.be.true
    expect(el.showIcon).to.be.true
    expect(el.closable).to.be.false
  })

  it('renders title when provided', async () => {
    const el = await fixture<MacAlert>('<mac-alert title="Alert Title">Content</mac-alert>')
    const title = el.shadowRoot!.querySelector('.alert__title')
    expect(title).to.not.be.null
    expect(title!.textContent).to.equal('Alert Title')
  })

  it('shows icon by default', async () => {
    const el = await fixture<MacAlert>('<mac-alert>Content</mac-alert>')
    const icon = el.shadowRoot!.querySelector('.alert__icon')
    expect(icon).to.not.be.null
    const svg = icon!.querySelector('svg')
    expect(svg).to.not.be.null
  })

  it('hides icon when showIcon is false', async () => {
    const el = await fixture<MacAlert>('<mac-alert .showIcon=${false}>Content</mac-alert>')
    const icon = el.shadowRoot!.querySelector('.alert__icon')
    expect(icon).to.be.null
  })

  it('applies bordered class by default', async () => {
    const el = await fixture<MacAlert>('<mac-alert>Content</mac-alert>')
    const alert = el.shadowRoot!.querySelector('.alert')
    expect(alert!.classList.contains('alert--bordered')).to.be.true
  })

  it('applies borderless class when bordered is false', async () => {
    const el = await fixture<MacAlert>('<mac-alert .bordered=${false}>Content</mac-alert>')
    const alert = el.shadowRoot!.querySelector('.alert')
    expect(alert!.classList.contains('alert--borderless')).to.be.true
  })

  it('applies type color classes', async () => {
    const el = await fixture<MacAlert>('<mac-alert type="success">Content</mac-alert>')
    const alert = el.shadowRoot!.querySelector('.alert')
    expect(alert!.classList.contains('alert--success')).to.be.true
  })

  it('shows close button when closable', async () => {
    const el = await fixture<MacAlert>('<mac-alert closable>Content</mac-alert>')
    const closeBtn = el.shadowRoot!.querySelector('.alert__close')
    expect(closeBtn).to.not.be.null
  })

  it('emits mac-close when close button clicked', async () => {
    const el = await fixture<MacAlert>('<mac-alert closable>Content</mac-alert>')
    const closeSpy = vi.fn()
    el.addEventListener('mac-close', closeSpy)
    const closeBtn = el.shadowRoot!.querySelector('.alert__close')!
    ;(closeBtn as HTMLButtonElement).click()
    expect(closeSpy).toHaveBeenCalledOnce()
  })

  it('renders slot content as description', async () => {
    const el = await fixture<MacAlert>('<mac-alert>Hello World</mac-alert>')
    const description = el.shadowRoot!.querySelector('.alert__description')
    expect(description).to.not.be.null
    expect(description!.textContent).to.contain('Hello World')
  })

  it('renders custom icon slot', async () => {
    const el = await fixture<MacAlert>(`<mac-alert><span slot="icon">★</span>Content</mac-alert>`)
    const iconSlot = el.shadowRoot!.querySelector('slot[name="icon"]')
    expect(iconSlot).to.not.be.null
  })

  it('renders action slot', async () => {
    const el = await fixture<MacAlert>(
      `<mac-alert>Content<button slot="action">Action</button></mac-alert>`,
    )
    const actionSlot = el.shadowRoot!.querySelector('slot[name="action"]')
    expect(actionSlot).to.not.be.null
  })
})
