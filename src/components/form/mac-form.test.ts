import { describe, it, expect } from 'vitest'
import { fixture, html, oneEvent, elementUpdated } from '@open-wc/testing-helpers'
import './mac-form'
import './mac-form-item'
import '../input/mac-input'
import '../input-number/mac-input-number'
import type { MacForm } from './mac-form'

describe('MacForm', () => {
  it('renders form with model', async () => {
    const el = await fixture<MacForm>(html`
      <mac-form .model=${{ name: 'test' }}>
        <mac-form-item label="Name" path="name">
          <mac-input></mac-input>
        </mac-form-item>
      </mac-form>
    `)
    expect(el.model.name).toBe('test')
  })

  it('syncs model value to child control', async () => {
    const el = await fixture<MacForm>(html`
      <mac-form .model=${{ name: 'hello' }}>
        <mac-form-item label="Name" path="name">
          <mac-input></mac-input>
        </mac-form-item>
      </mac-form>
    `)
    await elementUpdated(el)
    const input = el.querySelector('mac-input') as any
    expect(input.value).toBe('hello')
  })

  it('updates model on input change', async () => {
    const el = await fixture<MacForm>(html`
      <mac-form .model=${{ name: '' }}>
        <mac-form-item label="Name" path="name">
          <mac-input></mac-input>
        </mac-form-item>
      </mac-form>
    `)
    await elementUpdated(el)
    const input = el.querySelector('mac-input') as any
    input.value = 'new value'
    input.dispatchEvent(new CustomEvent('mac-change', { detail: { value: 'new value' } }))
    await elementUpdated(el)
    expect(el.model.name).toBe('new value')
  })

  it('emits mac-change on field update', async () => {
    const el = await fixture<MacForm>(html`
      <mac-form .model=${{ name: '' }}>
        <mac-form-item label="Name" path="name">
          <mac-input></mac-input>
        </mac-form-item>
      </mac-form>
    `)
    await elementUpdated(el)
    const listener = oneEvent(el, 'mac-change')
    const input = el.querySelector('mac-input') as any
    input.dispatchEvent(new CustomEvent('mac-change', { detail: { value: 'changed' } }))
    const ev = await listener
    expect((ev as CustomEvent).detail.value).toBe('changed')
    expect((ev as CustomEvent).detail.path).toBe('name')
  })

  it('emits mac-submit on form submit', async () => {
    const el = await fixture<MacForm>(html`
      <mac-form .model=${{ name: 'test' }}>
        <mac-form-item label="Name" path="name">
          <mac-input></mac-input>
        </mac-form-item>
      </mac-form>
    `)
    const listener = oneEvent(el, 'mac-submit')
    const form = el.shadowRoot!.querySelector('form') as HTMLFormElement
    form.dispatchEvent(new SubmitEvent('submit', { cancelable: true, bubbles: true }))
    const ev = await listener
    expect((ev as CustomEvent).detail.model).toEqual({ name: 'test' })
  })

  it('validates required field', async () => {
    const el = await fixture<MacForm>(html`
      <mac-form .model=${{ name: '' }}>
        <mac-form-item label="Name" path="name" required>
          <mac-input></mac-input>
        </mac-form-item>
      </mac-form>
    `)
    const valid = await el.validate()
    expect(valid).toBe(false)
  })

  it('passes validation with valid value', async () => {
    const el = await fixture<MacForm>(html`
      <mac-form .model=${{ name: 'john' }}>
        <mac-form-item label="Name" path="name" required>
          <mac-input></mac-input>
        </mac-form-item>
      </mac-form>
    `)
    const valid = await el.validate()
    expect(valid).toBe(true)
  })

  it('validates with form-level rules', async () => {
    const el = await fixture<MacForm>(html`
      <mac-form
        .model=${{ email: 'invalid' }}
        .rules=${{
          email: [{ type: 'email', message: '邮箱格式错误' }],
        }}
      >
        <mac-form-item label="Email" path="email">
          <mac-input></mac-input>
        </mac-form-item>
      </mac-form>
    `)
    const valid = await el.validate()
    expect(valid).toBe(false)
  })

  it('validates with item-level rule', async () => {
    const el = await fixture<MacForm>(html`
      <mac-form .model=${{ name: 'ab' }}>
        <mac-form-item label="Name" path="name" .rule=${{ min: 3, message: '至少3个字符' }}>
          <mac-input></mac-input>
        </mac-form-item>
      </mac-form>
    `)
    const valid = await el.validate()
    expect(valid).toBe(false)
  })

  it('validates with custom validator', async () => {
    const el = await fixture<MacForm>(html`
      <mac-form .model=${{ age: 200 }}>
        <mac-form-item
          label="Age"
          path="age"
          .rule=${{
            validator: (value: unknown) => {
              const num = Number(value)
              if (num < 1 || num > 120) return '年龄不合法'
              return true
            },
          }}
        >
          <mac-input-number></mac-input-number>
        </mac-form-item>
      </mac-form>
    `)
    const valid = await el.validate()
    expect(valid).toBe(false)
  })

  it('validates with pattern rule', async () => {
    const el = await fixture<MacForm>(html`
      <mac-form .model=${{ phone: '123' }}>
        <mac-form-item
          label="Phone"
          path="phone"
          .rule=${{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误' }}
        >
          <mac-input></mac-input>
        </mac-form-item>
      </mac-form>
    `)
    const valid = await el.validate()
    expect(valid).toBe(false)
  })

  it('resets validation state', async () => {
    const el = await fixture<MacForm>(html`
      <mac-form .model=${{ name: '' }}>
        <mac-form-item label="Name" path="name" required>
          <mac-input></mac-input>
        </mac-form-item>
      </mac-form>
    `)
    await el.validate()
    el.reset()
    await elementUpdated(el)
    // After reset, validate should pass if no value but we check the internal state
    const valid = await el.validate()
    expect(valid).toBe(false)
  })

  it('clears form model', async () => {
    const el = await fixture<MacForm>(html`
      <mac-form .model=${{ name: 'test', age: 20 }}>
        <mac-form-item label="Name" path="name">
          <mac-input></mac-input>
        </mac-form-item>
      </mac-form>
    `)
    el.clear()
    expect(el.model).toEqual({})
  })

  it('syncs disabled to child controls', async () => {
    const el = await fixture<MacForm>(html`
      <mac-form .model=${{ name: '' }} disabled>
        <mac-form-item label="Name" path="name">
          <mac-input></mac-input>
        </mac-form-item>
      </mac-form>
    `)
    await elementUpdated(el)
    const input = el.querySelector('mac-input') as any
    expect(input.disabled).toBe(true)
  })

  it('syncs size to child controls', async () => {
    const el = await fixture<MacForm>(html`
      <mac-form .model=${{ name: '' }} size="lg">
        <mac-form-item label="Name" path="name">
          <mac-input></mac-input>
        </mac-form-item>
      </mac-form>
    `)
    await elementUpdated(el)
    const input = el.querySelector('mac-input') as any
    expect(input.size).toBe('lg')
  })

  it('validates with len rule', async () => {
    const el = await fixture<MacForm>(html`
      <mac-form .model=${{ code: '1234' }}>
        <mac-form-item label="Code" path="code" .rule=${{ len: 6, message: '必须为6位' }}>
          <mac-input></mac-input>
        </mac-form-item>
      </mac-form>
    `)
    const valid = await el.validate()
    expect(valid).toBe(false)
  })

  it('validates with max rule', async () => {
    const el = await fixture<MacForm>(html`
      <mac-form .model=${{ name: 'abcdefghij' }}>
        <mac-form-item label="Name" path="name" .rule=${{ max: 5, message: '最多5个字符' }}>
          <mac-input></mac-input>
        </mac-form-item>
      </mac-form>
    `)
    const valid = await el.validate()
    expect(valid).toBe(false)
  })
})
