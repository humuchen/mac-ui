import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacDropdown } from './mac-dropdown'

// Ensure component registration is not tree-shaken
void MacDropdown

describe('MacDropdown', () => {
  it('is defined', () => {
    expect(customElements.get('mac-dropdown')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacDropdown>('<mac-dropdown></mac-dropdown>')
    expect(el.items).to.deep.equal([])
    expect(el.placement).to.equal('bottom-start')
    expect(el.value).to.equal('')
    expect(el.disabled).to.be.false
    expect(el.openOnHover).to.be.false
    expect(el.hoverDelay).to.equal(150)
    expect(el.trigger).to.equal('click')
  })

  it('reflects placement attribute', async () => {
    const el = await fixture<MacDropdown>('<mac-dropdown placement="top-end"></mac-dropdown>')
    expect(el.placement).to.equal('top-end')
  })

  it('reflects disabled attribute', async () => {
    const el = await fixture<MacDropdown>('<mac-dropdown disabled></mac-dropdown>')
    expect(el.disabled).to.be.true
  })

  it('reflects trigger attribute', async () => {
    const el = await fixture<MacDropdown>('<mac-dropdown trigger="contextmenu"></mac-dropdown>')
    expect(el.trigger).to.equal('contextmenu')
  })

  it('renders trigger slot', async () => {
    const el = await fixture<MacDropdown>(
      '<mac-dropdown><button slot="trigger">Open</button></mac-dropdown>',
    )
    const triggerSlot = el.shadowRoot!.querySelector('slot[name="trigger"]')
    expect(triggerSlot).to.not.be.null
  })
})
