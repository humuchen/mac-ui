import { describe, it, expect } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacCard } from './mac-card'

// Prevent Vite from tree-shaking the component import
void MacCard

describe('MacCard', () => {
  it('is defined', () => {
    expect(customElements.get('mac-card')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacCard>('<mac-card>Content</mac-card>')
    expect(el.hoverable).to.be.false
    expect(el.variant).to.equal('default')
  })

  it('renders with hoverable attribute', async () => {
    const el = await fixture<MacCard>('<mac-card hoverable>Content</mac-card>')
    expect(el.hoverable).to.be.true
    const card = el.shadowRoot!.querySelector('.card')!
    expect(card.classList.contains('card--hoverable')).to.be.true
  })

  it('renders with default variant class', async () => {
    const el = await fixture<MacCard>('<mac-card>Content</mac-card>')
    const card = el.shadowRoot!.querySelector('.card')!
    expect(card.classList.contains('card--default')).to.be.true
  })

  it('renders slot content', async () => {
    const el = await fixture<MacCard>('<mac-card><p>Test content</p></mac-card>')
    const slot = el.shadowRoot!.querySelector('slot:not([name])')!
    expect(slot).to.not.be.null
  })
})
