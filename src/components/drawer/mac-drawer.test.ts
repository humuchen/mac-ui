import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacDrawer } from './mac-drawer'

// Ensure component registration is not tree-shaken
void MacDrawer

describe('MacDrawer', () => {
  it('is defined', () => {
    expect(customElements.get('mac-drawer')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacDrawer>('<mac-drawer></mac-drawer>')
    expect(el.open).to.be.false
    expect(el.placement).to.equal('right')
    expect(el.title).to.equal('')
    expect(el.width).to.equal('360px')
    expect(el.height).to.equal('360px')
    expect(el.closable).to.be.true
    expect(el.maskClosable).to.be.true
    expect(el.closeOnEsc).to.be.true
    expect(el.resizable).to.be.false
  })

  it('reflects placement attribute', async () => {
    const el = await fixture<MacDrawer>('<mac-drawer placement="left"></mac-drawer>')
    expect(el.placement).to.equal('left')
  })

  it('reflects open attribute', async () => {
    const el = await fixture<MacDrawer>('<mac-drawer open></mac-drawer>')
    expect(el.open).to.be.true
  })

  it('reflects title attribute', async () => {
    const el = await fixture<MacDrawer>('<mac-drawer title="Settings"></mac-drawer>')
    expect(el.title).to.equal('Settings')
  })

  it('reflects resizable attribute', async () => {
    const el = await fixture<MacDrawer>('<mac-drawer resizable></mac-drawer>')
    expect(el.resizable).to.be.true
  })

  it('emits mac-drawer-open when opened', async () => {
    const el = await fixture<MacDrawer>('<mac-drawer></mac-drawer>')
    const openSpy = vi.fn()
    el.addEventListener('mac-drawer-open', openSpy)
    el.open = true
    await el.updateComplete
    expect(openSpy).toHaveBeenCalled()
  })
})
