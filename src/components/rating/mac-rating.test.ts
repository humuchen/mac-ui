import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacRating } from './mac-rating'

// Ensure component registration is not tree-shaken
void MacRating

describe('MacRating', () => {
  it('is defined', () => {
    expect(customElements.get('mac-rating')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacRating>('<mac-rating></mac-rating>')
    expect(el.value).to.equal(0)
    expect(el.max).to.equal(5)
    expect(el.allowHalf).to.be.false
    expect(el.readonly).to.be.false
    expect(el.disabled).to.be.false
    expect(el.showValue).to.be.false
    expect(el.icon).to.equal('star')
  })

  it('reflects value and max attributes', async () => {
    const el = await fixture<MacRating>('<mac-rating value="3" max="10"></mac-rating>')
    expect(el.value).to.equal(3)
    expect(el.max).to.equal(10)
  })

  it('reflects allow-half attribute', async () => {
    const el = await fixture<MacRating>('<mac-rating allow-half></mac-rating>')
    expect(el.allowHalf).to.be.true
  })

  it('reflects readonly and disabled attributes', async () => {
    const el = await fixture<MacRating>('<mac-rating readonly disabled></mac-rating>')
    expect(el.readonly).to.be.true
    expect(el.disabled).to.be.true
  })

  it('reflects icon attribute', async () => {
    const el = await fixture<MacRating>('<mac-rating icon="heart"></mac-rating>')
    expect(el.icon).to.equal('heart')
  })

  it('emits mac-rating-change when clicked', async () => {
    const el = await fixture<MacRating>('<mac-rating></mac-rating>')
    const changeSpy = vi.fn()
    el.addEventListener('mac-rating-change', changeSpy)
    const clickZone = el.shadowRoot!.querySelector('.click-zone--right')!
    clickZone.dispatchEvent(new MouseEvent('click'))
    expect(changeSpy).toHaveBeenCalledOnce()
  })

  it('renders correct number of icons', async () => {
    const el = await fixture<MacRating>('<mac-rating max="3"></mac-rating>')
    const wrappers = el.shadowRoot!.querySelectorAll('.icon-wrapper')
    expect(wrappers.length).to.equal(3)
  })
})
