import { describe, it, expect, vi } from 'vitest'
import { fixture } from '@open-wc/testing-helpers'
import { MacConfirm } from './mac-confirm'

// Ensure component registration is not tree-shaken
void MacConfirm

describe('MacConfirm', () => {
  it('is defined', () => {
    expect(customElements.get('mac-confirm')).to.be.instanceOf(Function)
  })

  it('renders with default properties', async () => {
    const el = await fixture<MacConfirm>('<mac-confirm></mac-confirm>')
    expect(el.title).to.equal('')
    expect(el.content).to.equal('')
    expect(el.confirmText).to.equal('确认')
    expect(el.cancelText).to.equal('取消')
    expect(el.danger).to.be.false
    expect(el.showIcon).to.be.true
    expect(el.width).to.equal('420px')
    expect(el.maskClosable).to.be.true
    expect(el.visible).to.be.false
    expect(el.titleAlign).to.equal('left')
    expect(el.showDivider).to.be.true
  })

  it('shows when visible is true', async () => {
    const el = await fixture<MacConfirm>('<mac-confirm visible></mac-confirm>')
    expect(el.visible).to.be.true
    expect(el.hasAttribute('visible')).to.be.true
  })

  it('renders title and content', async () => {
    const el = await fixture<MacConfirm>(
      '<mac-confirm title="确认删除？" content="删除后无法恢复" visible></mac-confirm>',
    )
    const title = el.shadowRoot!.querySelector('.title')
    const content = el.shadowRoot!.querySelector('.content')
    expect(title!.textContent).to.equal('确认删除？')
    expect(content!.textContent).to.equal('删除后无法恢复')
  })

  it('renders icon in titlebar', async () => {
    const el = await fixture<MacConfirm>(
      '<mac-confirm title="确认删除？" danger visible></mac-confirm>',
    )
    const titlebarIcon = el.shadowRoot!.querySelector('.titlebar-icon')
    const titlebar = el.shadowRoot!.querySelector('.titlebar')
    expect(titlebarIcon).to.not.be.null
    expect(titlebarIcon!.classList.contains('titlebar-icon--danger')).to.be.true
    expect(titlebar!.contains(titlebarIcon!)).to.be.true
  })

  it('applies titleAlign classes', async () => {
    const el = await fixture<MacConfirm>(
      '<mac-confirm title="Test" title-align="center" visible></mac-confirm>',
    )
    const titlebar = el.shadowRoot!.querySelector('.titlebar')
    expect(titlebar!.classList.contains('titlebar--center')).to.be.true
  })

  it('emits mac-confirm-ok when ok button is clicked', async () => {
    const el = await fixture<MacConfirm>('<mac-confirm visible></mac-confirm>')
    const okSpy = vi.fn()
    el.addEventListener('mac-confirm-ok', okSpy)
    const okBtn = el.shadowRoot!.querySelector('.footer-btn--ok')!
    ;(okBtn as HTMLButtonElement).click()
    expect(okSpy).toHaveBeenCalledOnce()
  })

  it('emits mac-confirm-cancel when cancel button is clicked', async () => {
    const el = await fixture<MacConfirm>('<mac-confirm visible></mac-confirm>')
    const cancelSpy = vi.fn()
    el.addEventListener('mac-confirm-cancel', cancelSpy)
    const cancelBtn = el.shadowRoot!.querySelector('.footer-btn--cancel')!
    ;(cancelBtn as HTMLButtonElement).click()
    expect(cancelSpy).toHaveBeenCalledOnce()
  })

  it('applies danger style to ok button', async () => {
    const el = await fixture<MacConfirm>('<mac-confirm danger visible></mac-confirm>')
    const okBtn = el.shadowRoot!.querySelector('.footer-btn--ok')
    expect(okBtn!.classList.contains('footer-btn--danger')).to.be.true
  })

  it('closes on cancel click', async () => {
    const el = await fixture<MacConfirm>('<mac-confirm visible></mac-confirm>')
    const cancelBtn = el.shadowRoot!.querySelector('.footer-btn--cancel')!
    ;(cancelBtn as HTMLButtonElement).click()
    expect(el.visible).to.be.false
  })

  it('closes on ok click', async () => {
    const el = await fixture<MacConfirm>('<mac-confirm visible></mac-confirm>')
    const okBtn = el.shadowRoot!.querySelector('.footer-btn--ok')!
    ;(okBtn as HTMLButtonElement).click()
    expect(el.visible).to.be.false
  })

  it('supports custom button text', async () => {
    const el = await fixture<MacConfirm>(
      '<mac-confirm confirm-text="保存" cancel-text="放弃" visible></mac-confirm>',
    )
    const okBtn = el.shadowRoot!.querySelector('.footer-btn--ok')
    const cancelBtn = el.shadowRoot!.querySelector('.footer-btn--cancel')
    expect(okBtn!.textContent!.trim()).to.equal('保存')
    expect(cancelBtn!.textContent!.trim()).to.equal('放弃')
  })

  it('open() sets visible to true and emits event', async () => {
    const el = await fixture<MacConfirm>('<mac-confirm></mac-confirm>')
    const openSpy = vi.fn()
    el.addEventListener('mac-confirm-open', openSpy)
    el.open()
    expect(el.visible).to.be.true
    expect(openSpy).toHaveBeenCalledOnce()
  })

  it('close() sets visible to false and emits event', async () => {
    const el = await fixture<MacConfirm>('<mac-confirm visible></mac-confirm>')
    const closeSpy = vi.fn()
    el.addEventListener('mac-confirm-close', closeSpy)
    el.close()
    expect(el.visible).to.be.false
    expect(closeSpy).toHaveBeenCalledOnce()
  })

  it('imperative open resolves true on ok', async () => {
    const promise = MacConfirm.open({ title: 'Test', content: 'Content' })
    const el = document.querySelector('mac-confirm') as MacConfirm
    const okBtn = el.shadowRoot!.querySelector('.footer-btn--ok')!
    ;(okBtn as HTMLButtonElement).click()
    const result = await promise
    expect(result).to.be.true
  })

  it('imperative open resolves false on cancel', async () => {
    const promise = MacConfirm.open({ title: 'Test', content: 'Content' })
    const el = document.querySelector('mac-confirm') as MacConfirm
    const cancelBtn = el.shadowRoot!.querySelector('.footer-btn--cancel')!
    ;(cancelBtn as HTMLButtonElement).click()
    const result = await promise
    expect(result).to.be.false
  })

  it('applies show-divider classes by default', async () => {
    const el = await fixture<MacConfirm>('<mac-confirm title="Test" visible></mac-confirm>')
    const titlebar = el.shadowRoot!.querySelector('.titlebar')
    const footer = el.shadowRoot!.querySelector('.footer')
    expect(titlebar!.classList.contains('titlebar--divided')).to.be.true
    expect(footer!.classList.contains('footer--divided')).to.be.true
  })

  it('hides divider when show-divider is false', async () => {
    const el = await fixture<MacConfirm>(
      '<mac-confirm title="Test" show-divider="false" visible></mac-confirm>',
    )
    const titlebar = el.shadowRoot!.querySelector('.titlebar')
    const footer = el.shadowRoot!.querySelector('.footer')
    expect(titlebar!.classList.contains('titlebar--divided')).to.be.false
    expect(footer!.classList.contains('footer--divided')).to.be.false
  })

  it('imperative open supports titleAlign option', async () => {
    MacConfirm.open({ title: 'Test', content: 'Content', titleAlign: 'right' })
    const el = document.querySelector('mac-confirm') as MacConfirm
    expect(el.titleAlign).to.equal('right')
    const titlebar = el.shadowRoot!.querySelector('.titlebar')
    expect(titlebar!.classList.contains('titlebar--right')).to.be.true
    el.close()
    if (el.parentNode) el.parentNode.removeChild(el)
  })
})
