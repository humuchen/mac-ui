import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacNumberAnimation } from './mac-number-animation'

// Ensure component registration is not tree-shaken
void MacNumberAnimation

describe('MacNumberAnimation', () => {
  it('is defined', () => {
    expect(customElements.get('mac-number-animation')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacNumberAnimation>('<mac-number-animation></mac-number-animation>')
    expect(el.to).to.equal(0)
    expect(el.from).to.equal(0)
    expect(el.duration).to.equal(2000)
    expect(el.precision).to.equal(0)
    expect(el.separator).to.equal('')
    expect(el.easing).to.equal('easeOut')
    expect(el.autoplay).to.be.true
    expect(el.prefix).to.equal('')
    expect(el.suffix).to.equal('')
  })

  it('reflects to and from attributes', async () => {
    const el = await fixture<MacNumberAnimation>(
      '<mac-number-animation to="100" from="0"></mac-number-animation>',
    )
    expect(el.to).to.equal(100)
    expect(el.from).to.equal(0)
  })

  it('reflects precision and separator attributes', async () => {
    const el = await fixture<MacNumberAnimation>(
      '<mac-number-animation precision="2" separator=","></mac-number-animation>',
    )
    expect(el.precision).to.equal(2)
    expect(el.separator).to.equal(',')
  })

  it('reflects prefix and suffix attributes', async () => {
    const el = await fixture<MacNumberAnimation>(
      '<mac-number-animation prefix="$" suffix="USD"></mac-number-animation>',
    )
    expect(el.prefix).to.equal('$')
    expect(el.suffix).to.equal('USD')
  })

  it('emits mac-number-animation-start when started', async () => {
    const el = await fixture<MacNumberAnimation>(
      '<mac-number-animation to="100" from="0"></mac-number-animation>',
    )
    const startSpy = vi.fn()
    el.addEventListener('mac-number-animation-start', startSpy)
    el.start()
    expect(startSpy).toHaveBeenCalledOnce()
  })

  it('renders value display', async () => {
    const el = await fixture<MacNumberAnimation>('<mac-number-animation to="100"></mac-number-animation>')
    const valueEl = el.shadowRoot!.querySelector('.value')
    expect(valueEl).to.not.be.null
  })
})
