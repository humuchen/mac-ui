import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-infinite-scroll'

const meta: Meta = {
  title: 'Components/InfiniteScroll',
  component: 'mac-infinite-scroll',
  tags: ['autodocs'],
  argTypes: {
    hasMore: {
      control: 'boolean',
      description: 'Whether there is more data to load',
      table: { defaultValue: { summary: 'true' } },
    },
    loading: {
      control: 'boolean',
      description: 'Whether data is currently loading',
      table: { defaultValue: { summary: 'false' } },
    },
    error: {
      control: 'boolean',
      description: 'Whether the last load attempt failed',
      table: { defaultValue: { summary: 'false' } },
    },
    threshold: {
      control: 'number',
      description: 'Distance in pixels from the bottom to trigger loading',
      table: { defaultValue: { summary: '100' } },
    },
    immediateCheck: {
      control: 'boolean',
      description: 'Check immediately after mount if content does not fill the container',
      table: { defaultValue: { summary: 'true' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disable auto-loading',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    hasMore: true,
    loading: false,
    error: false,
    threshold: 100,
    immediateCheck: true,
    disabled: false,
  },
}

export default meta
type Story = StoryObj

const generateItems = (start: number, count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: start + i,
    title: `Item ${start + i}`,
    desc: `This is the description for item ${start + i}`,
  }))

export const Basic: Story = {
  render: (args) => {
    let items = generateItems(1, 10)
    let loading = args.loading
    let hasMore = args.hasMore
    let error = args.error

    const handleLoadMore = (e: Event) => {
      const el = (e as CustomEvent).target as HTMLElement
      loading = true
      el.setAttribute('loading', '')
      // Simulate async loading
      setTimeout(() => {
        if (Math.random() > 0.9 && items.length < 30) {
          error = true
          loading = false
          el.removeAttribute('loading')
          el.setAttribute('error', '')
          return
        }
        const newItems = generateItems(items.length + 1, 5)
        items = [...items, ...newItems]
        loading = false
        hasMore = items.length < 30
        el.removeAttribute('loading')
        if (!hasMore) {
          el.removeAttribute('has-more')
        }
        // Update list content
        const listEl = el.querySelector('.demo-list')!
        newItems.forEach((item) => {
          const div = document.createElement('div')
          div.className = 'demo-item'
          div.innerHTML = `<strong>${item.title}</strong><p>${item.desc}</p>`
          listEl.appendChild(div)
        })
      }, 800)
    }

    const handleRetry = (e: Event) => {
      const el = (e as CustomEvent).target as HTMLElement
      error = false
      el.removeAttribute('error')
      handleLoadMore(e)
    }

    return html`
      <mac-infinite-scroll
        style="height: 400px; border: 1px solid var(--md-color-border); border-radius: var(--md-radius-md);"
        ?has-more=${hasMore}
        ?loading=${loading}
        ?error=${error}
        .threshold=${args.threshold}
        ?immediate-check=${args.immediateCheck}
        ?disabled=${args.disabled}
        @mac-load-more=${handleLoadMore}
        @mac-retry=${handleRetry}
      >
        <div class="demo-list" style="padding: 16px;">
          ${items.map(
            (item) => html`
              <div
                class="demo-item"
                style="padding: 12px; border-bottom: 1px solid var(--md-color-border);"
              >
                <strong>${item.title}</strong>
                <p style="margin: 4px 0 0; color: var(--md-color-text-secondary); font-size: 13px;">
                  ${item.desc}
                </p>
              </div>
            `,
          )}
        </div>
      </mac-infinite-scroll>
    `
  },
}

export const CustomSlots: Story = {
  render: () => html`
    <mac-infinite-scroll
      style="height: 400px; border: 1px solid var(--md-color-border); border-radius: var(--md-radius-md);"
      has-more
      .threshold=${100}
    >
      <div style="padding: 16px;">
        ${Array.from(
          { length: 8 },
          (_, i) => html`
            <div style="padding: 12px; border-bottom: 1px solid var(--md-color-border);">
              <strong>Item ${i + 1}</strong>
            </div>
          `,
        )}
      </div>
      <div
        slot="loading"
        style="display: flex; align-items: center; gap: 8px; padding: 16px; color: var(--md-color-primary);"
      >
        <span>Loading more items...</span>
      </div>
      <div
        slot="finished"
        style="padding: 16px; text-align: center; color: var(--md-color-text-secondary);"
      >
        🎉 All loaded!
      </div>
      <div slot="error" style="padding: 16px; text-align: center; color: var(--md-color-danger);">
        ❌ Something went wrong.
        <button id="retry-btn" style="color: var(--md-color-primary); cursor: pointer;">
          Retry
        </button>
      </div>
    </mac-infinite-scroll>
  `,
}

export const FinishedState: Story = {
  render: () => html`
    <mac-infinite-scroll
      style="height: 400px; border: 1px solid var(--md-color-border); border-radius: var(--md-radius-md);"
      .hasMore=${false}
    >
      <div style="padding: 16px;">
        ${Array.from(
          { length: 20 },
          (_, i) => html`
            <div style="padding: 12px; border-bottom: 1px solid var(--md-color-border);">
              <strong>Item ${i + 1}</strong>
            </div>
          `,
        )}
      </div>
    </mac-infinite-scroll>
  `,
}

export const ErrorState: Story = {
  render: () => html`
    <mac-infinite-scroll
      style="height: 400px; border: 1px solid var(--md-color-border); border-radius: var(--md-radius-md);"
      has-more
      error
    >
      <div style="padding: 16px;">
        ${Array.from(
          { length: 5 },
          (_, i) => html`
            <div style="padding: 12px; border-bottom: 1px solid var(--md-color-border);">
              <strong>Item ${i + 1}</strong>
            </div>
          `,
        )}
      </div>
    </mac-infinite-scroll>
  `,
}

export const LoadingState: Story = {
  render: () => html`
    <mac-infinite-scroll
      style="height: 400px; border: 1px solid var(--md-color-border); border-radius: var(--md-radius-md);"
      has-more
      loading
    >
      <div style="padding: 16px;">
        ${Array.from(
          { length: 5 },
          (_, i) => html`
            <div style="padding: 12px; border-bottom: 1px solid var(--md-color-border);">
              <strong>Item ${i + 1}</strong>
            </div>
          `,
        )}
      </div>
    </mac-infinite-scroll>
  `,
}

export const Disabled: Story = {
  render: () => html`
    <mac-infinite-scroll
      style="height: 400px; border: 1px solid var(--md-color-border); border-radius: var(--md-radius-md);"
      has-more
      disabled
    >
      <div style="padding: 16px;">
        ${Array.from(
          { length: 5 },
          (_, i) => html`
            <div style="padding: 12px; border-bottom: 1px solid var(--md-color-border);">
              <strong>Item ${i + 1}</strong>
            </div>
          `,
        )}
      </div>
    </mac-infinite-scroll>
  `,
}
