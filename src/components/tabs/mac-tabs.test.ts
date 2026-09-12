import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacTabs, MacTabPane } from './mac-tabs'

// Ensure component registration is not tree-shaken
void MacTabs
void MacTabPane

describe('MacTabs', () => {
  it('is defined', () => {
    expect(customElements.get('mac-tabs')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacTabs>('<mac-tabs></mac-tabs>')
    expect(el.type).to.equal('line')
    expect(el.value).to.equal('')
    expect(el.defaultValue).to.equal('')
    expect(el.closable).to.be.false
    expect(el.addable).to.be.false
    expect(el.animated).to.be.true
    expect(el.trigger).to.equal('click')
    expect(el.items).to.deep.equal([])
  })

  it('reflects type attribute', async () => {
    const el = await fixture<MacTabs>('<mac-tabs type="card"></mac-tabs>')
    expect(el.type).to.equal('card')
  })

  it('reflects closable and addable attributes', async () => {
    const el = await fixture<MacTabs>('<mac-tabs closable addable></mac-tabs>')
    expect(el.closable).to.be.true
    expect(el.addable).to.be.true
  })

  it('reflects animated attribute', async () => {
    const el = await fixture<MacTabs>('<mac-tabs animated="false"></mac-tabs>')
    expect(el.animated).to.be.false
  })

  it('emits mac-tabs-change when tab selected', async () => {
    const el = await fixture<MacTabs>(
      '<mac-tabs><mac-tab-pane tab-key="1" label="Tab 1">Content 1</mac-tab-pane></mac-tabs>',
    )
    const changeSpy = vi.fn()
    el.addEventListener('mac-tabs-change', changeSpy)
    await el.updateComplete
    const tabItem = el.shadowRoot!.querySelector('.tab-item')
    expect(tabItem).to.not.be.null
    ;(tabItem as HTMLElement).click()
    expect(changeSpy).toHaveBeenCalled()
  })

  it('renders nav structure', async () => {
    const el = await fixture<MacTabs>('<mac-tabs></mac-tabs>')
    const nav = el.shadowRoot!.querySelector('.nav')
    expect(nav).to.not.be.null
  })
})

describe('MacTabPane', () => {
  it('is defined', () => {
    expect(customElements.get('mac-tab-pane')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacTabPane>('<mac-tab-pane></mac-tab-pane>')
    expect(el.tabKey).to.equal('')
    expect(el.label).to.equal('')
    expect(el.disabled).to.be.false
    expect(el.closable).to.be.false
    expect(el.active).to.be.false
  })

  it('reflects tab-key and label attributes', async () => {
    const el = await fixture<MacTabPane>('<mac-tab-pane tab-key="1" label="Tab 1"></mac-tab-pane>')
    expect(el.tabKey).to.equal('1')
    expect(el.label).to.equal('Tab 1')
  })

  it('reflects active attribute', async () => {
    const el = await fixture<MacTabPane>('<mac-tab-pane active></mac-tab-pane>')
    expect(el.active).to.be.true
  })
})
