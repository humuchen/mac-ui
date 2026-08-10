import { describe, it, expect } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacDescriptions, MacDescriptionItem } from './mac-descriptions'

// Ensure component registration is not tree-shaken
void MacDescriptions
void MacDescriptionItem

describe('MacDescriptions', () => {
  it('is defined', () => {
    expect(customElements.get('mac-descriptions')).to.be.instanceOf(Function)
    expect(customElements.get('mac-description-item')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacDescriptions>('<mac-descriptions></mac-descriptions>')
    expect(el.labelPlacement).to.equal('left')
    expect(el.labelAlign).to.equal('left')
    expect(el.column).to.equal(3)
    expect(el.bordered).to.be.false
    expect(el.title).to.equal('')
    expect(el.separator).to.equal(':')
  })

  it('reflects label-placement attribute', async () => {
    const el = await fixture<MacDescriptions>(
      '<mac-descriptions label-placement="top"></mac-descriptions>',
    )
    expect(el.labelPlacement).to.equal('top')
  })

  it('reflects column attribute', async () => {
    const el = await fixture<MacDescriptions>('<mac-descriptions column="2"></mac-descriptions>')
    expect(el.column).to.equal(2)
  })

  it('renders items from property', async () => {
    const el = await fixture<MacDescriptions>('<mac-descriptions></mac-descriptions>')
    el.items = [
      { label: 'Name', value: 'John' },
      { label: 'Age', value: '30' },
    ]
    await el.updateComplete
    const container = el.shadowRoot!.querySelector('.container')
    expect(container).to.not.be.null
  })

  it('renders with bordered attribute', async () => {
    const el = await fixture<MacDescriptions>('<mac-descriptions bordered></mac-descriptions>')
    expect(el.bordered).to.be.true
  })
})

describe('MacDescriptionItem', () => {
  it('renders with default properties', async () => {
    const el = await fixture<MacDescriptionItem>('<mac-description-item></mac-description-item>')
    expect(el.label).to.equal('')
    expect(el.value).to.equal('')
    expect(el.span).to.equal(1)
  })

  it('reflects label and value attributes', async () => {
    const el = await fixture<MacDescriptionItem>(
      '<mac-description-item label="Name" value="John"></mac-description-item>',
    )
    expect(el.label).to.equal('Name')
    expect(el.value).to.equal('John')
  })
})
