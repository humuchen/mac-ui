import { describe, it, expect, vi } from 'vitest'
import { fixture, elementUpdated } from '@open-wc/testing-helpers'
import { MacAnimation } from './mac-animation'
import {
  registerAnimation,
  getAnimation,
  hasAnimation,
  getAnimationNames,
  buildAnimationShorthand,
  getAnimationStyleObject,
  animationStyleSheet,
  BUILT_IN,
} from './animations'

// Ensure component registration is not tree-shaken
void MacAnimation

describe('animations registry', () => {
  it('ships at least 20 built-in animations', () => {
    expect(BUILT_IN.length).toBeGreaterThanOrEqual(20)
  })

  it('registers and resolves animations', () => {
    expect(hasAnimation('fadeIn')).to.be.true
    expect(getAnimation('fadeIn')?.category).to.equal('fade')
    expect(getAnimation('does-not-exist')).to.be.undefined
  })

  it('allows registering custom animations', () => {
    registerAnimation({
      name: 'unit-test-glow',
      description: 'test',
      category: 'special',
      keyframes: '@keyframes mac-unit-test-glow { from { opacity: 0; } to { opacity: 1; } }',
    })
    expect(hasAnimation('unit-test-glow')).to.be.true
    expect(getAnimationNames()).to.include('unit-test-glow')
  })

  it('rejects empty animation name', () => {
    expect(() =>
      registerAnimation({ name: '', description: 'x', category: 'fade', keyframes: '' }),
    ).to.throw()
  })

  it('builds animation shorthand and style objects', () => {
    const shorthand = buildAnimationShorthand('fadeIn', { duration: '0.5s' })
    expect(shorthand).to.include('mac-fadeIn')
    expect(shorthand).to.include('0.5s')

    const obj = getAnimationStyleObject('bounce', { duration: '0.8s', paused: true })
    expect(obj.animationName).to.equal('mac-bounce')
    expect(obj.animationDuration).to.equal('0.8s')
    expect(obj.animationPlayState).to.equal('paused')
  })

  it('exposes a stylesheet with keyframes and classes', () => {
    expect(animationStyleSheet.cssText).to.contain('@keyframes mac-fadeIn')
    expect(animationStyleSheet.cssText).to.contain('.mac-anim-fadeIn')
  })
})

describe('MacAnimation', () => {
  it('is defined', () => {
    expect(customElements.get('mac-animation')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacAnimation>('<mac-animation>Hi</mac-animation>')
    expect(el.type).to.equal('fadeIn')
    expect(el.duration).to.equal('1s')
    expect(el.delay).to.equal('0s')
    expect(el.iterationCount).to.equal(1)
    expect(el.direction).to.equal('normal')
    expect(el.fillMode).to.equal('both')
    expect(el.timingFunction).to.equal('ease')
    expect(el.paused).to.be.false
  })

  it('applies inline animation style to the wrapper', async () => {
    const el = await fixture<MacAnimation>(
      '<mac-animation type="bounce" duration="0.8s">Hi</mac-animation>',
    )
    const wrapper = el.shadowRoot!.querySelector<HTMLElement>('.mac-anim-wrapper')!
    expect(wrapper.style.animation).to.include('mac-bounce')
    expect(wrapper.style.animation).to.include('0.8s')
  })

  it('updates animation when properties change', async () => {
    const el = await fixture<MacAnimation>('<mac-animation>Hi</mac-animation>')
    el.type = 'pulse'
    el.duration = '2s'
    await el.updateComplete
    const wrapper = el.shadowRoot!.querySelector<HTMLElement>('.mac-anim-wrapper')!
    expect(wrapper.style.animation).to.include('mac-pulse')
    expect(wrapper.style.animation).to.include('2s')
  })

  it('pause/resume toggles the paused state and play-state', async () => {
    const el = await fixture<MacAnimation>('<mac-animation>Hi</mac-animation>')
    el.pause()
    await el.updateComplete
    expect(el.paused).to.be.true
    const wrapper = el.shadowRoot!.querySelector<HTMLElement>('.mac-anim-wrapper')!
    expect(wrapper.style.animation).to.include('paused')

    el.resume()
    await el.updateComplete
    expect(el.paused).to.be.false
    expect(wrapper.style.animation).to.include('running')
  })

  it('stop clears the animation style', async () => {
    const el = await fixture<MacAnimation>('<mac-animation>Hi</mac-animation>')
    el.stop()
    const wrapper = el.shadowRoot!.querySelector<HTMLElement>('.mac-anim-wrapper')!
    expect(wrapper.style.animation || 'none').to.equal('none')
  })

  it('restart re-applies the animation', async () => {
    const el = await fixture<MacAnimation>(
      '<mac-animation type="shake" duration="0.5s">Hi</mac-animation>',
    )
    el.stop()
    let wrapper = el.shadowRoot!.querySelector<HTMLElement>('.mac-anim-wrapper')!
    expect(wrapper.style.animation || 'none').to.equal('none')
    el.restart()
    wrapper = el.shadowRoot!.querySelector<HTMLElement>('.mac-anim-wrapper')!
    expect(wrapper.style.animation).to.include('mac-shake')
  })

  it('emits lifecycle events', async () => {
    const el = await fixture<MacAnimation>('<mac-animation>Hi</mac-animation>')
    await elementUpdated(el)
    const startSpy = vi.fn()
    const endSpy = vi.fn()
    const iterSpy = vi.fn()
    el.addEventListener('mac-animation-start', startSpy)
    el.addEventListener('mac-animation-end', endSpy)
    el.addEventListener('mac-animation-iteration', iterSpy)

    const wrapper = el.shadowRoot!.querySelector<HTMLElement>('.mac-anim-wrapper')!
    // jsdom 不会自然触发 CSS 动画事件，手动派发以验证监听链路
    wrapper.dispatchEvent(new Event('animationstart', { bubbles: true }))
    wrapper.dispatchEvent(new Event('animationiteration', { bubbles: true }))
    wrapper.dispatchEvent(new Event('animationend', { bubbles: true }))

    expect(startSpy).toHaveBeenCalledOnce()
    expect(iterSpy).toHaveBeenCalledOnce()
    expect(endSpy).toHaveBeenCalledOnce()
  })

  it('supports a custom registered animation', async () => {
    registerAnimation({
      name: 'test-wobble',
      description: 'test wobble',
      category: 'special',
      keyframes:
        '@keyframes mac-test-wobble { from { transform: rotate(0); } to { transform: rotate(10deg); } }',
    })
    const el = await fixture<MacAnimation>('<mac-animation type="test-wobble">Hi</mac-animation>')
    await el.updateComplete
    // 自定义动画应注入动态 <style>
    const style = el.shadowRoot!.querySelector('style')
    expect(style?.textContent).to.contain('@keyframes mac-test-wobble')
    const wrapper = el.shadowRoot!.querySelector<HTMLElement>('.mac-anim-wrapper')!
    expect(wrapper.style.animation).to.include('mac-test-wobble')
  })

  it('clears animation style gracefully for unknown type', async () => {
    const el = await fixture<MacAnimation>(
      '<mac-animation type="totally-unknown-xyz">Hi</mac-animation>',
    )
    await el.updateComplete
    const wrapper = el.shadowRoot!.querySelector<HTMLElement>('.mac-anim-wrapper')!
    expect(wrapper.style.animation).to.equal('')
  })
})
