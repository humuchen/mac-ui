import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacSelect } from './mac-select'

// Ensure component registration is not tree-shaken
void MacSelect

describe('MacSelect', () => {
  it('is defined', () => {
    expect(customElements.get('mac-select')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacSelect>('<mac-select></mac-select>')
    expect(el.value).to.equal('')
    expect(el.placeholder).to.equal('Select an option')
    expect(el.options).to.deep.equal([])
    expect(el.groups).to.deep.equal([])
    expect(el.variant).to.equal('default')
    expect(el.label).to.equal('')
    expect(el.required).to.be.false
    expect(el.disabled).to.be.false
    expect(el.error).to.be.false
    expect(el.success).to.be.false
    expect(el.multiple).to.be.false
    expect(el.clearable).to.be.false
    expect(el.searchable).to.be.false
    expect(el.loading).to.be.false
    expect(el.emptyText).to.equal('No options available')
  })

  it('reflects placeholder attribute', async () => {
    const el = await fixture<MacSelect>('<mac-select placeholder="Choose..."></mac-select>')
    expect(el.placeholder).to.equal('Choose...')
  })

  it('reflects variant attribute', async () => {
    const el = await fixture<MacSelect>('<mac-select variant="filled"></mac-select>')
    expect(el.variant).to.equal('filled')
  })

  it('reflects disabled and error attributes', async () => {
    const el = await fixture<MacSelect>('<mac-select disabled error></mac-select>')
    expect(el.disabled).to.be.true
    expect(el.error).to.be.true
  })

  it('reflects multiple and clearable attributes', async () => {
    const el = await fixture<MacSelect>('<mac-select multiple clearable></mac-select>')
    expect(el.multiple).to.be.true
    expect(el.clearable).to.be.true
  })

  it('renders trigger element', async () => {
    const el = await fixture<MacSelect>('<mac-select></mac-select>')
    const trigger = el.shadowRoot!.querySelector('.select-trigger')
    expect(trigger).to.not.be.null
  })

  it('reflects size attribute', async () => {
    const el = await fixture<MacSelect>('<mac-select size="lg"></mac-select>')
    expect(el.size).to.equal('lg')
  })
})
