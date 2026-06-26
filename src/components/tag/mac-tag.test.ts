import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacTag } from './mac-tag'

// Ensure component registration is not tree-shaken
void MacTag

describe('MacTag', () => {
  it('is defined', () => {
    expect(customElements.get('mac-tag')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacTag>('<mac-tag>Tag</mac-tag>')
    expect(el.type).to.equal('default')
    expect(el.size).to.equal('md')
    expect(el.closable).to.be.false
    expect(el.round).to.be.false
    expect(el.bordered).to.be.true
    expect(el.disabled).to.be.false
  })

  it('renders with type attribute', async () => {
    const el = await fixture<MacTag>('<mac-tag type="primary">Tag</mac-tag>')
    expect(el.type).to.equal('primary')
  })

  it('renders with size attribute', async () => {
    const el = await fixture<MacTag>('<mac-tag size="lg">Tag</mac-tag>')
    expect(el.size).to.equal('lg')
  })

  it('shows close button when closable', async () => {
    const el = await fixture<MacTag>('<mac-tag closable>Tag</mac-tag>')
    const closeBtn = el.shadowRoot!.querySelector('.close')
    expect(closeBtn).to.not.be.null
  })

  it('does not show close button when not closable', async () => {
    const el = await fixture<MacTag>('<mac-tag>Tag</mac-tag>')
    const closeBtn = el.shadowRoot!.querySelector('.close')
    expect(closeBtn).to.be.null
  })

  it('emits mac-close when close button is clicked', async () => {
    const el = await fixture<MacTag>('<mac-tag closable>Tag</mac-tag>')
    const closeSpy = vi.fn()
    el.addEventListener('mac-close', closeSpy)
    const closeBtn = el.shadowRoot!.querySelector('.close')!
    ;(closeBtn as HTMLButtonElement).click()
    expect(closeSpy).toHaveBeenCalledOnce()
  })

  it('reflects type attribute to CSS class', async () => {
    const el = await fixture<MacTag>('<mac-tag type="success">Tag</mac-tag>')
    const tag = el.shadowRoot!.querySelector('.tag')!
    expect(tag.classList.contains('tag--success')).to.be.true
  })

  it('reflects round attribute to CSS class', async () => {
    const el = await fixture<MacTag>('<mac-tag round>Tag</mac-tag>')
    const tag = el.shadowRoot!.querySelector('.tag')!
    expect(tag.classList.contains('tag--round')).to.be.true
  })

  it('reflects disabled attribute to CSS class', async () => {
    const el = await fixture<MacTag>('<mac-tag disabled>Tag</mac-tag>')
    const tag = el.shadowRoot!.querySelector('.tag')!
    expect(tag.classList.contains('tag--disabled')).to.be.true
  })

  it('reflects bordered=false to CSS class', async () => {
    const el = await fixture<MacTag>('<mac-tag>Tag</mac-tag>')
    el.bordered = false
    await el.updateComplete
    const tag = el.shadowRoot!.querySelector('.tag')!
    expect(tag.classList.contains('tag--borderless')).to.be.true
  })

  it('does not add borderless class when bordered is true', async () => {
    const el = await fixture<MacTag>('<mac-tag bordered>Tag</mac-tag>')
    const tag = el.shadowRoot!.querySelector('.tag')!
    expect(tag.classList.contains('tag--borderless')).to.be.false
  })

  it('renders all type variants correctly', async () => {
    const types = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const
    for (const type of types) {
      const el = await fixture<MacTag>(`<mac-tag type="${type}">Tag</mac-tag>`)
      const tag = el.shadowRoot!.querySelector('.tag')!
      expect(tag.classList.contains(`tag--${type}`)).to.be.true
    }
  })
})
