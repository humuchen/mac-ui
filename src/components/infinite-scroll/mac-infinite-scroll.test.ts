import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacInfiniteScroll } from './mac-infinite-scroll'

// Ensure component registration is not tree-shaken
void MacInfiniteScroll

describe('MacInfiniteScroll', () => {
  it('is defined', () => {
    expect(customElements.get('mac-infinite-scroll')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacInfiniteScroll>('<mac-infinite-scroll></mac-infinite-scroll>')
    expect(el.hasMore).to.be.true
    expect(el.loading).to.be.false
    expect(el.error).to.be.false
    expect(el.threshold).to.equal(100)
    expect(el.immediateCheck).to.be.true
    expect(el.disabled).to.be.false
  })

  it('does not emit mac-load-more when disabled', async () => {
    const el = await fixture<MacInfiniteScroll>(
      '<mac-infinite-scroll disabled style="height:100px;"><div style="height:50px;"></div></mac-infinite-scroll>',
    )
    const loadSpy = vi.fn()
    el.addEventListener('mac-load-more', loadSpy)

    // Force check
    el['_checkIfNeedLoad']()
    await new Promise((r) => setTimeout(r, 50))

    expect(loadSpy).not.toHaveBeenCalled()
  })

  it('does not emit mac-load-more when hasMore is false', async () => {
    const el = await fixture<MacInfiniteScroll>(
      '<mac-infinite-scroll style="height:100px;" disabled><div style="height:50px;"></div></mac-infinite-scroll>',
    )
    el.hasMore = false
    el.disabled = false
    await el.updateComplete

    const loadSpy = vi.fn()
    el.addEventListener('mac-load-more', loadSpy)

    el['_checkIfNeedLoad']()
    await new Promise((r) => setTimeout(r, 50))

    expect(loadSpy).not.toHaveBeenCalled()
  })

  it('does not emit mac-load-more when loading is true', async () => {
    const el = await fixture<MacInfiniteScroll>(
      '<mac-infinite-scroll style="height:100px;" loading><div style="height:50px;"></div></mac-infinite-scroll>',
    )
    const loadSpy = vi.fn()
    el.addEventListener('mac-load-more', loadSpy)

    el['_checkIfNeedLoad']()
    await new Promise((r) => setTimeout(r, 50))

    expect(loadSpy).not.toHaveBeenCalled()
  })

  it('does not emit mac-load-more when error is true', async () => {
    const el = await fixture<MacInfiniteScroll>(
      '<mac-infinite-scroll style="height:100px;" error><div style="height:50px;"></div></mac-infinite-scroll>',
    )
    const loadSpy = vi.fn()
    el.addEventListener('mac-load-more', loadSpy)

    el['_checkIfNeedLoad']()
    await new Promise((r) => setTimeout(r, 50))

    expect(loadSpy).not.toHaveBeenCalled()
  })

  it('emits mac-retry when retry button is clicked', async () => {
    const el = await fixture<MacInfiniteScroll>('<mac-infinite-scroll error></mac-infinite-scroll>')
    const retrySpy = vi.fn()
    el.addEventListener('mac-retry', retrySpy)

    const retryBtn = el.shadowRoot!.querySelector('.retry-btn') as HTMLElement
    retryBtn?.click()

    expect(retrySpy).toHaveBeenCalledOnce()
  })

  it('shows loading spinner when loading', async () => {
    const el = await fixture<MacInfiniteScroll>(
      '<mac-infinite-scroll loading></mac-infinite-scroll>',
    )
    const spinner = el.shadowRoot!.querySelector('.loading-spinner')
    expect(spinner).to.not.be.null
  })

  it('shows finished text when hasMore is false', async () => {
    const el = await fixture<MacInfiniteScroll>('<mac-infinite-scroll></mac-infinite-scroll>')
    el.hasMore = false
    await el.updateComplete
    const finished = el.shadowRoot!.querySelector('[part="finished"]')
    expect(finished).to.not.be.null
    expect(finished!.textContent).to.include('No more data')
  })

  it('shows error text and retry button when error is true', async () => {
    const el = await fixture<MacInfiniteScroll>('<mac-infinite-scroll error></mac-infinite-scroll>')
    const errorPart = el.shadowRoot!.querySelector('[part="error"]')
    expect(errorPart).to.not.be.null
    const retryBtn = el.shadowRoot!.querySelector('.retry-btn')
    expect(retryBtn).to.not.be.null
  })
})
