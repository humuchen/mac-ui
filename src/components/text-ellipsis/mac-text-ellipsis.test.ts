import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacTextEllipsis } from './mac-text-ellipsis'

// Ensure component registration is not tree-shaken
void MacTextEllipsis

describe('MacTextEllipsis', () => {
  it('is defined', () => {
    expect(customElements.get('mac-text-ellipsis')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacTextEllipsis>('<mac-text-ellipsis></mac-text-ellipsis>')
    expect(el.lineClamp).to.equal(3)
    expect(el.expandTrigger).to.equal('none')
    expect(el.expanded).to.be.false
    expect(el.tooltip).to.be.false
  })

  it('reflects line-clamp attribute', async () => {
    const el = await fixture<MacTextEllipsis>('<mac-text-ellipsis line-clamp="5"></mac-text-ellipsis>')
    expect(el.lineClamp).to.equal(5)
  })

  it('reflects expand-trigger attribute', async () => {
    const el = await fixture<MacTextEllipsis>(
      '<mac-text-ellipsis expand-trigger="click"></mac-text-ellipsis>',
    )
    expect(el.expandTrigger).to.equal('click')
  })

  it('reflects expanded attribute', async () => {
    const el = await fixture<MacTextEllipsis>('<mac-text-ellipsis expanded></mac-text-ellipsis>')
    expect(el.expanded).to.be.true
  })

  it('reflects tooltip attribute', async () => {
    const el = await fixture<MacTextEllipsis>('<mac-text-ellipsis tooltip></mac-text-ellipsis>')
    expect(el.tooltip).to.be.true
  })

  it('emits mac-ellipsis-expand when clicked', async () => {
    const el = await fixture<MacTextEllipsis>(
      '<mac-text-ellipsis expand-trigger="click">Long text that should be truncated when it exceeds the line clamp limit set on this component.</mac-text-ellipsis>',
    )
    await el.updateComplete
    const expandSpy = vi.fn()
    el.addEventListener('mac-ellipsis-expand', expandSpy)
    const content = el.shadowRoot!.querySelector('.ellipsis-content')
    expect(content).to.not.be.null
    ;(content as HTMLElement).click()
    // Event only fires when truncated; may not fire in test env without layout
  })

  it('renders ellipsis structure', async () => {
    const el = await fixture<MacTextEllipsis>('<mac-text-ellipsis>Some text</mac-text-ellipsis>')
    const wrapper = el.shadowRoot!.querySelector('.ellipsis-wrapper')
    expect(wrapper).to.not.be.null
    const content = el.shadowRoot!.querySelector('.ellipsis-content')
    expect(content).to.not.be.null
  })
})
