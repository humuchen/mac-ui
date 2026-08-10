import { describe, it, expect } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacConfigProvider } from './mac-config-provider'

// Ensure component registration is not tree-shaken
void MacConfigProvider

describe('MacConfigProvider', () => {
  it('is defined', () => {
    expect(customElements.get('mac-config-provider')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacConfigProvider>('<mac-config-provider></mac-config-provider>')
    expect(el.theme).to.equal('light')
    expect(el.size).to.equal('md')
  })

  it('reflects theme attribute', async () => {
    const el = await fixture<MacConfigProvider>('<mac-config-provider theme="dark"></mac-config-provider>')
    expect(el.theme).to.equal('dark')
    expect(el.getAttribute('data-theme')).to.equal('dark')
  })

  it('reflects size attribute', async () => {
    const el = await fixture<MacConfigProvider>('<mac-config-provider size="lg"></mac-config-provider>')
    expect(el.size).to.equal('lg')
  })

  it('renders slot content', async () => {
    const el = await fixture<MacConfigProvider>(
      '<mac-config-provider><div class="test-content">Content</div></mac-config-provider>',
    )
    const slot = el.shadowRoot!.querySelector('slot')
    expect(slot).to.not.be.null
  })
})
