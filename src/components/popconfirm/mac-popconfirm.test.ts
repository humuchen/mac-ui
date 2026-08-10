import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacPopconfirm } from './mac-popconfirm'

// Ensure component registration is not tree-shaken
void MacPopconfirm

describe('MacPopconfirm', () => {
  it('is defined', () => {
    expect(customElements.get('mac-popconfirm')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacPopconfirm>('<mac-popconfirm></mac-popconfirm>')
    expect(el.title).to.equal('')
    expect(el.description).to.equal('')
    expect(el.confirmText).to.equal('确认')
    expect(el.cancelText).to.equal('取消')
    expect(el.danger).to.be.false
    expect(el.showIcon).to.be.true
    expect(el.placement).to.equal('top')
    expect(el.trigger).to.equal('click')
    expect(el.disabled).to.be.false
    expect(el.width).to.equal('240px')
  })

  it('reflects title and description attributes', async () => {
    const el = await fixture<MacPopconfirm>(
      '<mac-popconfirm title="Delete?" description="This action cannot be undone."></mac-popconfirm>',
    )
    expect(el.title).to.equal('Delete?')
    expect(el.description).to.equal('This action cannot be undone.')
  })

  it('reflects placement attribute', async () => {
    const el = await fixture<MacPopconfirm>('<mac-popconfirm placement="bottom"></mac-popconfirm>')
    expect(el.placement).to.equal('bottom')
  })

  it('reflects danger attribute', async () => {
    const el = await fixture<MacPopconfirm>('<mac-popconfirm danger></mac-popconfirm>')
    expect(el.danger).to.be.true
  })

  it('reflects disabled attribute', async () => {
    const el = await fixture<MacPopconfirm>('<mac-popconfirm disabled></mac-popconfirm>')
    expect(el.disabled).to.be.true
  })

  it('renders trigger slot', async () => {
    const el = await fixture<MacPopconfirm>(
      '<mac-popconfirm><button>Delete</button></mac-popconfirm>',
    )
    const trigger = el.shadowRoot!.querySelector('.trigger')
    expect(trigger).to.not.be.null
  })
})
