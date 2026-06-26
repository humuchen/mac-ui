import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacCarousel, MacCarouselItem } from './mac-carousel'

// Ensure component registration is not tree-shaken
void MacCarousel
void MacCarouselItem

describe('MacCarousel', () => {
  it('is defined', () => {
    expect(customElements.get('mac-carousel')).to.be.instanceOf(Function)
    expect(customElements.get('mac-carousel-item')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacCarousel>(`
      <mac-carousel>
        <mac-carousel-item>Slide 1</mac-carousel-item>
        <mac-carousel-item>Slide 2</mac-carousel-item>
      </mac-carousel>
    `)
    expect(el.currentIndex).to.equal(0)
    expect(el.defaultIndex).to.equal(0)
    expect(el.autoplay).to.be.false
    expect(el.interval).to.equal(5000)
    expect(el.loop).to.be.true
    expect(el.direction).to.equal('horizontal')
    expect(el.effect).to.equal('slide')
    expect(el.slidesPerView).to.equal(1)
    expect(el.showArrow).to.be.true
    expect(el.showDots).to.be.true
    expect(el.dotType).to.equal('dot')
    expect(el.dotPosition).to.equal('bottom')
    expect(el.draggable).to.be.false
    expect(el.keyboard).to.be.false
    expect(el.wheel).to.be.false
    expect(el.transitionDuration).to.equal(300)
  })

  it('detects slide count from slot', async () => {
    const el = await fixture<MacCarousel>(`
      <mac-carousel>
        <mac-carousel-item>A</mac-carousel-item>
        <mac-carousel-item>B</mac-carousel-item>
        <mac-carousel-item>C</mac-carousel-item>
      </mac-carousel>
    `)
    await el.updateComplete
    expect((el as any)._slideCount).to.equal(3)
  })

  it('navigates to next slide on arrow click', async () => {
    const el = await fixture<MacCarousel>(`
      <mac-carousel>
        <mac-carousel-item>Slide 1</mac-carousel-item>
        <mac-carousel-item>Slide 2</mac-carousel-item>
      </mac-carousel>
    `)
    await el.updateComplete
    const changeSpy = vi.fn()
    el.addEventListener('mac-carousel-change', changeSpy)
    const nextArrow = el.shadowRoot!.querySelector('.arrow--next') as HTMLButtonElement
    nextArrow.click()
    expect(changeSpy).toHaveBeenCalledOnce()
    expect(changeSpy.mock.calls[0][0].detail.index).to.equal(1)
  })

  it('navigates to prev slide on arrow click', async () => {
    const el = await fixture<MacCarousel>(`
      <mac-carousel current-index="1">
        <mac-carousel-item>Slide 1</mac-carousel-item>
        <mac-carousel-item>Slide 2</mac-carousel-item>
      </mac-carousel>
    `)
    await el.updateComplete
    const changeSpy = vi.fn()
    el.addEventListener('mac-carousel-change', changeSpy)
    const prevArrow = el.shadowRoot!.querySelector('.arrow--prev') as HTMLButtonElement
    prevArrow.click()
    expect(changeSpy).toHaveBeenCalledOnce()
    expect(changeSpy.mock.calls[0][0].detail.index).to.equal(0)
  })

  it('loops from last to first', async () => {
    const el = await fixture<MacCarousel>(`
      <mac-carousel current-index="1">
        <mac-carousel-item>Slide 1</mac-carousel-item>
        <mac-carousel-item>Slide 2</mac-carousel-item>
      </mac-carousel>
    `)
    await el.updateComplete
    const changeSpy = vi.fn()
    el.addEventListener('mac-carousel-change', changeSpy)
    const nextArrow = el.shadowRoot!.querySelector('.arrow--next') as HTMLButtonElement
    nextArrow.click()
    expect(changeSpy.mock.calls[0][0].detail.index).to.equal(0)
  })

  it('does not loop when loop=false', async () => {
    const el = await fixture<MacCarousel>(`
      <mac-carousel current-index="1" loop="false">
        <mac-carousel-item>Slide 1</mac-carousel-item>
        <mac-carousel-item>Slide 2</mac-carousel-item>
      </mac-carousel>
    `)
    await el.updateComplete
    const changeSpy = vi.fn()
    el.addEventListener('mac-carousel-change', changeSpy)
    const nextArrow = el.shadowRoot!.querySelector('.arrow--next') as HTMLButtonElement
    nextArrow.click()
    expect(changeSpy).not.toHaveBeenCalled()
  })

  it('emits mac-carousel-change on dot click', async () => {
    const el = await fixture<MacCarousel>(`
      <mac-carousel>
        <mac-carousel-item>Slide 1</mac-carousel-item>
        <mac-carousel-item>Slide 2</mac-carousel-item>
        <mac-carousel-item>Slide 3</mac-carousel-item>
      </mac-carousel>
    `)
    await el.updateComplete
    const changeSpy = vi.fn()
    el.addEventListener('mac-carousel-change', changeSpy)
    const dots = el.shadowRoot!.querySelectorAll('.dot')
    ;(dots[2] as HTMLButtonElement).click()
    expect(changeSpy).toHaveBeenCalledOnce()
    expect(changeSpy.mock.calls[0][0].detail.index).to.equal(2)
  })

  it('hides arrows when show-arrow is false', async () => {
    const el = await fixture<MacCarousel>(`
      <mac-carousel show-arrow="false">
        <mac-carousel-item>Slide 1</mac-carousel-item>
        <mac-carousel-item>Slide 2</mac-carousel-item>
      </mac-carousel>
    `)
    await el.updateComplete
    const arrows = el.shadowRoot!.querySelectorAll('.arrow')
    expect(arrows.length).to.equal(0)
  })

  it('hides dots when show-dots is false', async () => {
    const el = await fixture<MacCarousel>(`
      <mac-carousel show-dots="false">
        <mac-carousel-item>Slide 1</mac-carousel-item>
        <mac-carousel-item>Slide 2</mac-carousel-item>
      </mac-carousel>
    `)
    await el.updateComplete
    const dots = el.shadowRoot!.querySelector('.dots')
    expect(dots).to.be.null
  })

  it('renders line dots when dot-type="line"', async () => {
    const el = await fixture<MacCarousel>(`
      <mac-carousel dot-type="line">
        <mac-carousel-item>Slide 1</mac-carousel-item>
        <mac-carousel-item>Slide 2</mac-carousel-item>
      </mac-carousel>
    `)
    await el.updateComplete
    const dot = el.shadowRoot!.querySelector('.dot')
    expect(dot!.classList.contains('dot--line')).to.be.true
  })

  it('applies vertical direction attribute', async () => {
    const el = await fixture<MacCarousel>(`
      <mac-carousel direction="vertical">
        <mac-carousel-item>Slide 1</mac-carousel-item>
        <mac-carousel-item>Slide 2</mac-carousel-item>
      </mac-carousel>
    `)
    expect(el.direction).to.equal('vertical')
    expect(el.getAttribute('direction')).to.equal('vertical')
  })

  it('applies fade effect', async () => {
    const el = await fixture<MacCarousel>(`
      <mac-carousel effect="fade">
        <mac-carousel-item>Slide 1</mac-carousel-item>
        <mac-carousel-item>Slide 2</mac-carousel-item>
      </mac-carousel>
    `)
    await el.updateComplete
    expect(el.effect).to.equal('fade')
    const track = el.shadowRoot!.querySelector('.track')
    expect(track!.classList.contains('track--fade')).to.be.true
  })

  it('applies dot-position attribute', async () => {
    const el = await fixture<MacCarousel>(`
      <mac-carousel dot-position="left">
        <mac-carousel-item>Slide 1</mac-carousel-item>
        <mac-carousel-item>Slide 2</mac-carousel-item>
      </mac-carousel>
    `)
    expect(el.dotPosition).to.equal('left')
    expect(el.getAttribute('dot-position')).to.equal('left')
  })

  it('sets slides-per-view property', async () => {
    const el = await fixture<MacCarousel>(`
      <mac-carousel slides-per-view="2">
        <mac-carousel-item>Slide 1</mac-carousel-item>
        <mac-carousel-item>Slide 2</mac-carousel-item>
      </mac-carousel>
    `)
    expect(el.slidesPerView).to.equal(2)
  })

  it('supports wheel property', async () => {
    const el = await fixture<MacCarousel>(`
      <mac-carousel wheel>
        <mac-carousel-item>Slide 1</mac-carousel-item>
        <mac-carousel-item>Slide 2</mac-carousel-item>
      </mac-carousel>
    `)
    expect(el.wheel).to.be.true
  })
})
