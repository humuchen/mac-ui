import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacDesktop } from './mac-desktop'

// Ensure component registration is not tree-shaken
void MacDesktop

describe('MacDesktop', () => {
  it('is defined', () => {
    expect(customElements.get('mac-desktop')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacDesktop>('<mac-desktop></mac-desktop>')
    expect(el.layout).to.equal('vertical')
    expect(el.cellSize).to.equal(90)
    expect(el.spacing).to.equal(8)
    expect(el.padding).to.equal(16)
    expect(el.showDock).to.be.true
    expect(el.wallpaper).to.equal('')
  })

  it('reflects layout attribute', async () => {
    const el = await fixture<MacDesktop>('<mac-desktop layout="horizontal"></mac-desktop>')
    expect(el.layout).to.equal('horizontal')
  })

  it('reflects show-dock attribute', async () => {
    const el = await fixture<MacDesktop>('<mac-desktop show-dock="false"></mac-desktop>')
    expect(el.showDock).to.be.false
  })

  it('emits mac-icons-reorder when layout changes', async () => {
    const el = await fixture<MacDesktop>(
      '<mac-desktop><mac-desktop-icon label="Test" icon-id="1"></mac-desktop-icon></mac-desktop>',
    )
    const reorderSpy = vi.fn()
    el.addEventListener('mac-icons-reorder', reorderSpy)
    el.layout = 'horizontal'
    await el.updateComplete
    expect(reorderSpy).toHaveBeenCalled()
  })

  it('renders desktop structure', async () => {
    const el = await fixture<MacDesktop>('<mac-desktop></mac-desktop>')
    const desktop = el.shadowRoot!.querySelector('.desktop')
    expect(desktop).to.not.be.null
    const iconsArea = el.shadowRoot!.querySelector('.desktop-icons')
    expect(iconsArea).to.not.be.null
  })
})
