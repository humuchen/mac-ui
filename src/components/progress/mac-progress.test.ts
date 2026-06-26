import { describe, it, expect } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacProgress } from './mac-progress'

// Ensure component registration is not tree-shaken
void MacProgress

describe('MacProgress', () => {
  it('is defined', () => {
    expect(customElements.get('mac-progress')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacProgress>('<mac-progress></mac-progress>')
    expect(el.percentage).to.equal(0)
    expect(el.type).to.equal('line')
    expect(el.status).to.equal('default')
    expect(el.size).to.equal('md')
    expect(el.showText).to.be.true
    expect(el.processing).to.be.false
  })

  it('renders line progress by default', async () => {
    const el = await fixture<MacProgress>('<mac-progress percentage="50"></mac-progress>')
    const track = el.shadowRoot!.querySelector('.progress-line__track')
    expect(track).to.not.be.null
    const fill = el.shadowRoot!.querySelector('.progress-line__fill') as HTMLElement
    expect(fill.style.width).to.equal('50%')
  })

  it('renders circle progress when type is circle', async () => {
    const el = await fixture<MacProgress>(
      '<mac-progress type="circle" percentage="75"></mac-progress>',
    )
    const circle = el.shadowRoot!.querySelector('.progress-circle')
    expect(circle).to.not.be.null
    const svg = el.shadowRoot!.querySelector('.progress-circle__svg')
    expect(svg).to.not.be.null
  })

  it('displays percentage text when showText is true', async () => {
    const el = await fixture<MacProgress>('<mac-progress percentage="42"></mac-progress>')
    const text = el.shadowRoot!.querySelector('[part="text"]')
    expect(text).to.not.be.null
    expect(text!.textContent).to.equal('42%')
  })

  it('hides percentage text when showText is false', async () => {
    const el = await fixture<MacProgress>(
      '<mac-progress percentage="42" .showText=${false}></mac-progress>',
    )
    const text = el.shadowRoot!.querySelector('[part="text"]')
    expect(text).to.be.null
  })

  it('clamps percentage to 0-100 range', async () => {
    const el = await fixture<MacProgress>('<mac-progress percentage="-10"></mac-progress>')
    const fill = el.shadowRoot!.querySelector('.progress-line__fill') as HTMLElement
    expect(fill.style.width).to.equal('0%')

    const el2 = await fixture<MacProgress>('<mac-progress percentage="150"></mac-progress>')
    const fill2 = el2.shadowRoot!.querySelector('.progress-line__fill') as HTMLElement
    expect(fill2.style.width).to.equal('100%')
  })

  it('applies status color classes', async () => {
    const el = await fixture<MacProgress>('<mac-progress status="success"></mac-progress>')
    const fill = el.shadowRoot!.querySelector('.progress-line__fill')
    expect(fill!.classList.contains('progress-line__fill--success')).to.be.true
  })

  it('applies custom color style', async () => {
    const el = await fixture<MacProgress>(
      '<mac-progress color="#ff0000" percentage="50"></mac-progress>',
    )
    const fill = el.shadowRoot!.querySelector('.progress-line__fill') as HTMLElement
    expect(fill.style.backgroundColor).to.equal('rgb(255, 0, 0)')
  })

  it('applies size classes', async () => {
    const el = await fixture<MacProgress>('<mac-progress size="sm"></mac-progress>')
    const line = el.shadowRoot!.querySelector('.progress-line')
    expect(line!.classList.contains('progress-line--sm')).to.be.true
  })

  /* ═══════════════════════════════════════════════════
     Processing tests
     ═══════════════════════════════════════════════════ */
  it('shows processing animation on line progress', async () => {
    const el = await fixture<MacProgress>('<mac-progress processing></mac-progress>')
    const fill = el.shadowRoot!.querySelector('.progress-line__fill')
    expect(fill!.classList.contains('progress-line__fill--processing')).to.be.true
    expect((fill as HTMLElement).style.width).to.equal('100%')
  })

  it('hides percentage text when processing', async () => {
    const el = await fixture<MacProgress>(
      '<mac-progress processing percentage="50"></mac-progress>',
    )
    const text = el.shadowRoot!.querySelector('[part="text"]')
    expect(text).to.be.null
  })

  it('shows processing animation on circle progress', async () => {
    const el = await fixture<MacProgress>('<mac-progress type="circle" processing></mac-progress>')
    const fill = el.shadowRoot!.querySelector('.progress-circle__fill')
    expect(fill!.classList.contains('progress-circle__fill--processing')).to.be.true
  })

  /* ═══════════════════════════════════════════════════
     Multi-circle tests
     ═══════════════════════════════════════════════════ */
  it('renders multiple circles when circles prop is set', async () => {
    const el = await fixture<MacProgress>(
      '<mac-progress type="circle" .circles=${[{percentage: 80}, {percentage: 60}]}></mac-progress>',
    )
    const circles = el.shadowRoot!.querySelectorAll('.progress-circle__fill')
    expect(circles.length).to.be.at.least(2)
  })

  /* ═══════════════════════════════════════════════════
     Gradient tests
     ═══════════════════════════════════════════════════ */
  it('renders line progress with gradient', async () => {
    const el = await fixture<MacProgress>(
      '<mac-progress percentage="50" .gradient=${{from: "#3b82f6", to: "#22c55e"}}></mac-progress>',
    )
    const fill = el.shadowRoot!.querySelector('.progress-line__fill') as HTMLElement
    expect(fill.style.background).to.include('linear-gradient')
  })

  it('renders circle progress with gradient', async () => {
    const el = await fixture<MacProgress>(
      '<mac-progress type="circle" percentage="50" .gradient=${{from: "#3b82f6", to: "#22c55e"}}></mac-progress>',
    )
    const defs = el.shadowRoot!.querySelector('defs')
    expect(defs).to.not.be.null
    const linearGradient = defs!.querySelector('linearGradient')
    expect(linearGradient).to.not.be.null
  })
})
