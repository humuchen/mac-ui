import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacGroupButton } from './mac-group-button'

// Prevent Vite from tree-shaking the component import
void MacGroupButton

describe('MacGroupButton', () => {
  it('is defined', () => {
    expect(customElements.get('mac-group-button')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacGroupButton>('<mac-group-button></mac-group-button>')
    expect(el.size).to.equal('md')
    expect(el.disabled).to.be.false
    expect(el.value).to.equal('')
  })

  it('renders with items', async () => {
    const el = await fixture<MacGroupButton>('<mac-group-button></mac-group-button>')
    el.items = [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
    ]
    await el.updateComplete
    const buttons = el.shadowRoot!.querySelectorAll('.button')
    expect(buttons.length).to.equal(2)
  })

  it('sets initial value from first enabled item', async () => {
    const el = await fixture<MacGroupButton>('<mac-group-button></mac-group-button>')
    el.items = [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
    ]
    await el.updateComplete
    // Wait for firstUpdated to run
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(el.value).to.equal('day')
  })

  it('renders with size attribute', async () => {
    const el = await fixture<MacGroupButton>('<mac-group-button size="lg"></mac-group-button>')
    expect(el.size).to.equal('lg')
  })

  it('emits mac-change when button is clicked', async () => {
    const el = await fixture<MacGroupButton>('<mac-group-button></mac-group-button>')
    el.items = [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
    ]
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(el.value).to.equal('day')

    const changeSpy = vi.fn()
    el.addEventListener('mac-change', changeSpy)

    const buttons = el.shadowRoot!.querySelectorAll('.button')
    ;(buttons[1] as HTMLButtonElement).click()

    expect(changeSpy).toHaveBeenCalledOnce()
    expect(changeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          value: 'week',
          item: { value: 'week', label: 'Week' },
          index: 1,
        },
      }),
    )
  })

  it('does not emit mac-change when disabled item is clicked', async () => {
    const el = await fixture<MacGroupButton>('<mac-group-button></mac-group-button>')
    el.items = [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week', disabled: true },
    ]
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(el.value).to.equal('day')

    const changeSpy = vi.fn()
    el.addEventListener('mac-change', changeSpy)

    const buttons = el.shadowRoot!.querySelectorAll('.button')
    ;(buttons[1] as HTMLButtonElement).click()

    expect(changeSpy).not.toHaveBeenCalled()
  })

  it('does not emit mac-change when component is disabled', async () => {
    const el = await fixture<MacGroupButton>('<mac-group-button disabled></mac-group-button>')
    el.items = [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
    ]
    await el.updateComplete

    const changeSpy = vi.fn()
    el.addEventListener('mac-change', changeSpy)

    const buttons = el.shadowRoot!.querySelectorAll('.button')
    ;(buttons[1] as HTMLButtonElement).click()

    expect(changeSpy).not.toHaveBeenCalled()
  })

  it('updates value when clicked', async () => {
    const el = await fixture<MacGroupButton>('<mac-group-button></mac-group-button>')
    el.items = [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
    ]
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(el.value).to.equal('day')

    const buttons = el.shadowRoot!.querySelectorAll('.button')
    ;(buttons[1] as HTMLButtonElement).click()

    await el.updateComplete
    expect(el.value).to.equal('week')
  })

  it('renders slider element', async () => {
    const el = await fixture<MacGroupButton>('<mac-group-button></mac-group-button>')
    el.items = [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
    ]
    await el.updateComplete

    const slider = el.shadowRoot!.querySelector('.slider')
    expect(slider).to.not.be.null
  })

  it('applies selected class to selected button', async () => {
    const el = await fixture<MacGroupButton>('<mac-group-button></mac-group-button>')
    el.items = [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
    ]
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(el.value).to.equal('day')

    const buttons = el.shadowRoot!.querySelectorAll('.button')
    expect(buttons[0].classList.contains('button--selected')).to.be.true
    expect(buttons[1].classList.contains('button--selected')).to.be.false
  })

  it('sets correct ARIA attributes', async () => {
    const el = await fixture<MacGroupButton>('<mac-group-button></mac-group-button>')
    el.items = [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
    ]
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(el.value).to.equal('day')

    const container = el.shadowRoot!.querySelector('.group-container')
    expect(container!.getAttribute('role')).to.equal('radiogroup')

    const buttons = el.shadowRoot!.querySelectorAll('.button')
    expect(buttons[0].getAttribute('role')).to.equal('radio')
    expect(buttons[0].getAttribute('aria-checked')).to.equal('true')
    expect(buttons[1].getAttribute('aria-checked')).to.equal('false')
  })

  it('supports keyboard navigation with arrow keys', async () => {
    const el = await fixture<MacGroupButton>('<mac-group-button></mac-group-button>')
    el.items = [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
    ]
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(el.value).to.equal('day')

    const changeSpy = vi.fn()
    el.addEventListener('mac-change', changeSpy)

    const buttons = el.shadowRoot!.querySelectorAll('.button')
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
    buttons[0].dispatchEvent(event)

    expect(changeSpy).toHaveBeenCalledOnce()
    expect(el.value).to.equal('week')
  })

  it('skips disabled items during keyboard navigation', async () => {
    const el = await fixture<MacGroupButton>('<mac-group-button></mac-group-button>')
    el.items = [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week', disabled: true },
      { value: 'month', label: 'Month' },
    ]
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(el.value).to.equal('day')

    const changeSpy = vi.fn()
    el.addEventListener('mac-change', changeSpy)

    const buttons = el.shadowRoot!.querySelectorAll('.button')
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' })
    buttons[0].dispatchEvent(event)

    expect(changeSpy).toHaveBeenCalledOnce()
    expect(el.value).to.equal('month')
  })
})
