import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacDesktopIcon } from './mac-desktop-icon'

// Ensure component registration is not tree-shaken
void MacDesktopIcon

describe('MacDesktopIcon', () => {
  it('is defined', () => {
    expect(customElements.get('mac-desktop-icon')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacDesktopIcon>('<mac-desktop-icon></mac-desktop-icon>')
    expect(el.label).to.equal('')
    expect(el.iconId).to.not.equal('')
    expect(el.selected).to.be.false
    expect(el.dragging).to.be.false
    expect(el.x).to.equal(0)
    expect(el.y).to.equal(0)
    expect(el.color).to.equal('#007AFF')
  })

  it('reflects label attribute', async () => {
    const el = await fixture<MacDesktopIcon>('<mac-desktop-icon label="Finder"></mac-desktop-icon>')
    expect(el.label).to.equal('Finder')
  })

  it('reflects selected attribute', async () => {
    const el = await fixture<MacDesktopIcon>('<mac-desktop-icon selected></mac-desktop-icon>')
    expect(el.selected).to.be.true
  })

  it('reflects x and y attributes', async () => {
    const el = await fixture<MacDesktopIcon>('<mac-desktop-icon x="100" y="200"></mac-desktop-icon>')
    expect(el.x).to.equal(100)
    expect(el.y).to.equal(200)
  })

  it('emits mac-icon-dblclick on double click', async () => {
    const el = await fixture<MacDesktopIcon>('<mac-desktop-icon label="Test"></mac-desktop-icon>')
    const dblclickSpy = vi.fn()
    el.addEventListener('mac-icon-dblclick', dblclickSpy)
    const wrapper = el.shadowRoot!.querySelector('.icon-wrapper')!
    wrapper.dispatchEvent(new MouseEvent('mousedown', { button: 0 }))
    wrapper.dispatchEvent(new MouseEvent('mousedown', { button: 0 }))
    expect(dblclickSpy).toHaveBeenCalledOnce()
  })

  it('renders default icon placeholder', async () => {
    const el = await fixture<MacDesktopIcon>('<mac-desktop-icon label="App"></mac-desktop-icon>')
    const defaultIcon = el.shadowRoot!.querySelector('.default-icon')
    expect(defaultIcon).to.not.be.null
  })
})
