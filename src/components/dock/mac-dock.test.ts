import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacDock } from './mac-dock'
import { MacDockItem } from './mac-dock-item'

// Ensure component registration is not tree-shaken
void MacDock
void MacDockItem

describe('MacDock', () => {
  it('is defined', () => {
    expect(customElements.get('mac-dock')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacDock>('<mac-dock></mac-dock>')
    expect(el.magnification).to.equal(1.6)
    expect(el.iconSize).to.equal(48)
    expect(el.magnifyRange).to.equal(120)
    expect(el.position).to.equal('bottom')
  })

  it('reflects position attribute', async () => {
    const el = await fixture<MacDock>('<mac-dock position="left"></mac-dock>')
    expect(el.position).to.equal('left')
  })

  it('reflects magnification attribute', async () => {
    const el = await fixture<MacDock>('<mac-dock magnification="2.0"></mac-dock>')
    expect(el.magnification).to.equal(2.0)
  })

  it('renders dock structure', async () => {
    const el = await fixture<MacDock>('<mac-dock></mac-dock>')
    const dock = el.shadowRoot!.querySelector('.dock')
    expect(dock).to.not.be.null
    const dockItems = el.shadowRoot!.querySelector('.dock-items')
    expect(dockItems).to.not.be.null
  })
})

describe('MacDockItem', () => {
  it('is defined', () => {
    expect(customElements.get('mac-dock-item')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacDockItem>('<mac-dock-item></mac-dock-item>')
    expect(el.itemId).to.equal('')
    expect(el.label).to.equal('')
    expect(el.color).to.equal('#007AFF')
    expect(el.running).to.be.false
    expect(el.bouncing).to.be.false
  })

  it('reflects label and color attributes', async () => {
    const el = await fixture<MacDockItem>(
      '<mac-dock-item label="Finder" color="#00C853"></mac-dock-item>',
    )
    expect(el.label).to.equal('Finder')
    expect(el.color).to.equal('#00C853')
  })

  it('emits mac-dock-item-click on click', async () => {
    const el = await fixture<MacDockItem>('<mac-dock-item item-id="app1" label="Test"></mac-dock-item>')
    const clickSpy = vi.fn()
    el.addEventListener('mac-dock-item-click', clickSpy)
    el.click()
    expect(clickSpy).toHaveBeenCalledOnce()
  })

  it('renders default icon placeholder', async () => {
    const el = await fixture<MacDockItem>('<mac-dock-item label="App"></mac-dock-item>')
    const defaultIcon = el.shadowRoot!.querySelector('.default-icon')
    expect(defaultIcon).to.not.be.null
  })
})
