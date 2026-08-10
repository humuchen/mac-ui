import { describe, it, expect } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacLazyImage } from './mac-lazy-image'

// Ensure component registration is not tree-shaken
void MacLazyImage

describe('MacLazyImage', () => {
  it('is defined', () => {
    expect(customElements.get('mac-lazy-image')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacLazyImage>('<mac-lazy-image></mac-lazy-image>')
    expect(el.src).to.equal('')
    expect(el.alt).to.equal('')
    expect(el.objectFit).to.equal('cover')
    expect(el.rootMargin).to.equal('0px')
    expect(el.threshold).to.equal(0)
    expect(el.preview).to.be.false
    expect(el.previewSrc).to.equal('')
  })

  it('reflects src and alt attributes', async () => {
    const el = await fixture<MacLazyImage>(
      '<mac-lazy-image src="test.jpg" alt="Test image"></mac-lazy-image>',
    )
    expect(el.src).to.equal('test.jpg')
    expect(el.alt).to.equal('Test image')
  })

  it('reflects object-fit attribute', async () => {
    const el = await fixture<MacLazyImage>('<mac-lazy-image object-fit="contain"></mac-lazy-image>')
    expect(el.objectFit).to.equal('contain')
  })

  it('reflects preview attribute', async () => {
    const el = await fixture<MacLazyImage>('<mac-lazy-image preview></mac-lazy-image>')
    expect(el.preview).to.be.true
    expect(el.hasAttribute('preview-enabled')).to.be.true
  })

  it('renders container structure', async () => {
    const el = await fixture<MacLazyImage>('<mac-lazy-image></mac-lazy-image>')
    const container = el.shadowRoot!.querySelector('.container')
    expect(container).to.not.be.null
  })
})
