import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-modal'

const meta: Meta = {
  title: 'Components/Modal',
  component: 'mac-modal',
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Modal title text',
    },
    draggable: {
      control: 'boolean',
      description: 'Whether the modal can be dragged',
    },
    resizable: {
      control: 'boolean',
      description: 'Whether the modal can be resized',
    },
    showButtons: {
      control: 'boolean',
      description: 'Whether to show traffic light buttons',
    },
    showFooter: {
      control: 'boolean',
      description: 'Whether to show the footer area',
    },
    titleAlign: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Modal title text alignment',
    },
    active: {
      control: 'boolean',
      description: 'Whether the modal is active (focused)',
    },
    width: {
      control: { type: 'number', min: 280, max: 1200 },
      description: 'Modal width in pixels',
    },
    height: {
      control: { type: 'number', min: 160, max: 800 },
      description: 'Modal height in pixels',
    },
  },
  args: {
    title: 'Finder',
    draggable: true,
    resizable: true,
    showButtons: true,
    showFooter: true,
    titleAlign: 'center',
    active: true,
    width: 480,
    height: 360,
  },
}

export default meta
type Story = StoryObj

const containerStyle = `position: relative; width: 800px; height: 500px; background: radial-gradient(ellipse at 20% 80%, #1a3a5c 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #2d1b4e 0%, transparent 50%), linear-gradient(160deg, #0a1628 0%, #132742 30%, #1a3555 50%, #0f2440 70%, #0a1628 100%); border-radius: 12px; overflow: hidden;`

export const Default: Story = {
  render: (args) => html`
    <div style="${containerStyle}">
      <mac-modal
        title=${args.title}
        .draggable=${args.draggable}
        .resizable=${args.resizable}
        .showButtons=${args.showButtons}
        .showFooter=${args.showFooter}
        .active=${args.active}
        .width=${args.width}
        .height=${args.height}
        x="160"
        y="70"
      >
        <p style="margin: 0; color: #1d1d1f;">
          This is a macOS-style modal window. Drag the title bar to move it, and drag the edges or
          corners to resize it. When showFooter is true and no custom footer slot is provided, the
          default Cancel and OK buttons are shown.
        </p>
      </mac-modal>
    </div>
  `,
}

export const MultipleModals: Story = {
  render: (args) => html`
    <div style="${containerStyle}">
      <mac-modal
        title=${args.title}
        .draggable=${args.draggable}
        .resizable=${args.resizable}
        .showButtons=${args.showButtons}
        .showFooter=${args.showFooter}
        .active=${true}
        .width=${420}
        .height=${300}
        x="60"
        y="40"
        @mac-modal-focus=${(e: Event) => {
          const modal = e.target as HTMLElement
          modal.setAttribute('active', '')
          modal.parentElement?.querySelectorAll('mac-modal').forEach((d) => {
            if (d !== modal) d.removeAttribute('active')
          })
        }}
      >
        <p style="margin: 0; color: #1d1d1f;">Finder window — click to focus.</p>
      </mac-modal>

      <mac-modal
        title="Notes"
        .draggable=${args.draggable}
        .resizable=${args.resizable}
        .showButtons=${args.showButtons}
        .showFooter=${args.showFooter}
        .width=${360}
        .height=${260}
        x="280"
        y="120"
        @mac-modal-focus=${(e: Event) => {
          const modal = e.target as HTMLElement
          modal.setAttribute('active', '')
          modal.parentElement?.querySelectorAll('mac-modal').forEach((d) => {
            if (d !== modal) d.removeAttribute('active')
          })
        }}
      >
        <p style="margin: 0; color: #1d1d1f;">Notes window — click to bring to front.</p>
      </mac-modal>

      <mac-modal
        title="Terminal"
        .draggable=${args.draggable}
        .resizable=${args.resizable}
        .showButtons=${args.showButtons}
        .showFooter=${args.showFooter}
        .width=${400}
        .height=${240}
        x="180"
        y="200"
        @mac-modal-focus=${(e: Event) => {
          const modal = e.target as HTMLElement
          modal.setAttribute('active', '')
          modal.parentElement?.querySelectorAll('mac-modal').forEach((d) => {
            if (d !== modal) d.removeAttribute('active')
          })
        }}
      >
        <p style="margin: 0; font-family: monospace; color: #1d1d1f;">
          $ echo "Hello, macOS!"<br />Hello, macOS!<br />$ _
        </p>
      </mac-modal>
    </div>
  `,
}

export const InactiveModal: Story = {
  args: { active: false },
  render: (args) => html`
    <div style="${containerStyle}">
      <mac-modal
        title=${args.title}
        .draggable=${args.draggable}
        .resizable=${args.resizable}
        .showButtons=${args.showButtons}
        .showFooter=${args.showFooter}
        .active=${args.active}
        .width=${args.width}
        .height=${args.height}
        x="200"
        y="110"
      >
        <p style="margin: 0; color: #1d1d1f;">
          This modal is in an inactive state. Notice the greyed-out traffic lights and faded title.
        </p>
      </mac-modal>
    </div>
  `,
}

export const NoResize: Story = {
  args: { resizable: false },
  render: (args) => html`
    <div style="${containerStyle}">
      <mac-modal
        title=${args.title}
        .draggable=${args.draggable}
        .resizable=${args.resizable}
        .showButtons=${args.showButtons}
        .showFooter=${args.showFooter}
        .active=${args.active}
        .width=${args.width}
        .height=${args.height}
        x="220"
        y="130"
      >
        <p style="margin: 0; color: #1d1d1f;">
          This modal can be dragged but not resized. No resize handles are shown.
        </p>
      </mac-modal>
    </div>
  `,
}

export const NoButtons: Story = {
  args: { showButtons: false },
  render: (args) => html`
    <div style="${containerStyle}">
      <mac-modal
        title=${args.title}
        .draggable=${args.draggable}
        .resizable=${args.resizable}
        .showButtons=${args.showButtons}
        .showFooter=${args.showFooter}
        .active=${args.active}
        .width=${args.width}
        .height=${args.height}
        x="200"
        y="110"
      >
        <p style="margin: 0; color: #1d1d1f;">
          This modal has no traffic light buttons. You can use the slot="titlebar" to add custom
          controls.
        </p>
      </mac-modal>
    </div>
  `,
}

export const WithFooter: Story = {
  args: { showFooter: true },
  render: (args) => html`
    <div style="${containerStyle}">
      <mac-modal
        title=${args.title}
        .draggable=${args.draggable}
        .resizable=${args.resizable}
        .showButtons=${args.showButtons}
        .showFooter=${args.showFooter}
        .active=${args.active}
        .width=${args.width}
        .height=${args.height}
        x="160"
        y="70"
      >
        <p style="margin: 0; color: #1d1d1f;">
          This modal has a custom footer. Use the <code>slot="footer"</code> to add your own footer
          content. When a footer slot is provided, the default Cancel/OK buttons are replaced.
        </p>
        <div slot="footer" style="display: flex; gap: 8px; width: 100%; justify-content: flex-end;">
          <button
            style="padding: 4px 12px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.1); background: rgba(255,255,255,0.6); cursor: pointer; font-size: 13px;"
          >
            Cancel
          </button>
          <button
            style="padding: 4px 12px; border-radius: 6px; border: none; background: #007aff; color: #fff; cursor: pointer; font-size: 13px;"
          >
            OK
          </button>
        </div>
      </mac-modal>
    </div>
  `,
}

export const NoFooter: Story = {
  args: { showFooter: false },
  render: (args) => html`
    <div style="${containerStyle}">
      <mac-modal
        title=${args.title}
        .draggable=${args.draggable}
        .resizable=${args.resizable}
        .showButtons=${args.showButtons}
        .showFooter=${args.showFooter}
        .active=${args.active}
        .width=${args.width}
        .height=${args.height}
        x="200"
        y="110"
      >
        <p style="margin: 0; color: #1d1d1f;">This modal has no footer area.</p>
      </mac-modal>
    </div>
  `,
}
