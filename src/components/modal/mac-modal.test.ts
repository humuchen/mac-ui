import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacModal } from './mac-modal'

// Ensure component registration is not tree-shaken
void MacModal

describe('MacModal', () => {
  it('is defined', () => {
    expect(customElements.get('mac-modal')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacModal>('<mac-modal></mac-modal>')
    expect(el.title).to.equal('')
    expect(el.titleAlign).to.equal('center')
    expect(el.x).to.equal(100)
    expect(el.y).to.equal(100)
    expect(el.width).to.equal(480)
    expect(el.height).to.equal(360)
    expect(el.active).to.be.true
    expect(el.draggable).to.be.true
    expect(el.resizable).to.be.true
    expect(el.showButtons).to.be.true
    expect(el.showFooter).to.be.true
    expect(el.minimized).to.be.false
    expect(el.maximized).to.be.false
  })

  it('reflects title attribute', async () => {
    const el = await fixture<MacModal>('<mac-modal title="Hello"></mac-modal>')
    expect(el.title).to.equal('Hello')
  })

  it('reflects active attribute', async () => {
    const el = await fixture<MacModal>('<mac-modal active="false"></mac-modal>')
    expect(el.active).to.be.false
  })

  it('reflects minimized and maximized attributes', async () => {
    const el = await fixture<MacModal>('<mac-modal minimized maximized></mac-modal>')
    expect(el.minimized).to.be.true
    expect(el.maximized).to.be.true
  })

  it('emits mac-modal-close when close button clicked', async () => {
    const el = await fixture<MacModal>('<mac-modal></mac-modal>')
    const closeSpy = vi.fn()
    el.addEventListener('mac-modal-close', closeSpy)
    const closeBtn = el.shadowRoot!.querySelector('.traffic-light--close')!
    closeBtn.dispatchEvent(new MouseEvent('click'))
    expect(closeSpy).toHaveBeenCalledOnce()
  })

  it('renders traffic lights', async () => {
    const el = await fixture<MacModal>('<mac-modal></mac-modal>')
    const trafficLights = el.shadowRoot!.querySelector('.traffic-lights')
    expect(trafficLights).to.not.be.null
    const closeBtn = el.shadowRoot!.querySelector('.traffic-light--close')
    expect(closeBtn).to.not.be.null
  })
})
