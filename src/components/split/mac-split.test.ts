import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacSplit, MacSplitPane } from './mac-split'

// Ensure component registration is not tree-shaken
void MacSplit
void MacSplitPane

describe('MacSplit', () => {
  it('is defined', () => {
    expect(customElements.get('mac-split')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacSplit>('<mac-split></mac-split>')
    expect(el.direction).to.equal('horizontal')
    expect(el.split).to.equal(0.5)
    expect(el.unit).to.equal('ratio')
    expect(el.min).to.equal(0)
    expect(el.max).to.equal(0)
    expect(el.disabled).to.be.false
  })

  it('reflects direction attribute', async () => {
    const el = await fixture<MacSplit>('<mac-split direction="vertical"></mac-split>')
    expect(el.direction).to.equal('vertical')
  })

  it('reflects split and unit attributes', async () => {
    const el = await fixture<MacSplit>('<mac-split split="200" unit="pixel"></mac-split>')
    expect(el.split).to.equal(200)
    expect(el.unit).to.equal('pixel')
  })

  it('reflects disabled attribute', async () => {
    const el = await fixture<MacSplit>('<mac-split disabled></mac-split>')
    expect(el.disabled).to.be.true
  })

  it('emits mac-split-change when split changes', async () => {
    const el = await fixture<MacSplit>('<mac-split></mac-split>')
    const changeSpy = vi.fn()
    el.addEventListener('mac-split-change', changeSpy)
    el.split = 0.7
    await el.updateComplete
    expect(changeSpy).toHaveBeenCalled()
  })

  it('renders split structure', async () => {
    const el = await fixture<MacSplit>('<mac-split></mac-split>')
    const split = el.shadowRoot!.querySelector('.split')
    expect(split).to.not.be.null
    const resizer = el.shadowRoot!.querySelector('.resizer')
    expect(resizer).to.not.be.null
  })
})

describe('MacSplitPane', () => {
  it('is defined', () => {
    expect(customElements.get('mac-split-pane')).to.be.instanceOf(Function)
  })

  it('renders pane structure', async () => {
    const el = await fixture<MacSplitPane>('<mac-split-pane></mac-split-pane>')
    const pane = el.shadowRoot!.querySelector('.pane')
    expect(pane).to.not.be.null
  })
})
