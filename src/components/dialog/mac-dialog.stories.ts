import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-dialog'

const meta: Meta = {
  title: 'Components/Dialog',
  component: 'mac-dialog',
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Dialog title text',
    },
    draggable: {
      control: 'boolean',
      description: 'Whether the dialog can be dragged',
    },
    resizable: {
      control: 'boolean',
      description: 'Whether the dialog can be resized',
    },
    showButtons: {
      control: 'boolean',
      description: 'Whether to show traffic light buttons',
    },
    active: {
      control: 'boolean',
      description: 'Whether the dialog is active (focused)',
    },
    width: {
      control: { type: 'number', min: 280, max: 1200 },
      description: 'Dialog width in pixels',
    },
    height: {
      control: { type: 'number', min: 160, max: 800 },
      description: 'Dialog height in pixels',
    },
  },
  args: {
    title: 'Finder',
    draggable: true,
    resizable: true,
    showButtons: true,
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
      <mac-dialog
        title=${args.title}
        ?draggable=${args.draggable}
        ?resizable=${args.resizable}
        ?show-buttons=${args.showButtons}
        ?active=${args.active}
        .width=${args.width}
        .height=${args.height}
        x="160"
        y="70"
      >
        <p style="margin: 0; color: #1d1d1f;">
          This is a macOS-style dialog window. Drag the title bar to move it, and drag the edges or
          corners to resize it.
        </p>
      </mac-dialog>
    </div>
  `,
}

export const MultipleDialogs: Story = {
  render: (args) => html`
    <div style="${containerStyle}">
      <mac-dialog
        title=${args.title}
        draggable=${args.draggable}
        resizable=${args.resizable}
        show-buttons=${args.showButtons}
        active
        .width=${420}
        .height=${300}
        x="60"
        y="40"
        @mac-dialog-focus=${(e: Event) => {
          const dialog = e.target as HTMLElement
          dialog.setAttribute('active', '')
          dialog.parentElement?.querySelectorAll('mac-dialog').forEach((d) => {
            if (d !== dialog) d.removeAttribute('active')
          })
        }}
      >
        <p style="margin: 0; color: #1d1d1f;">Finder window — click to focus.</p>
      </mac-dialog>

      <mac-dialog
        title="Notes"
        draggable=${args.draggable}
        resizable=${args.resizable}
        show-buttons=${args.showButtons}
        .width=${360}
        .height=${260}
        x="280"
        y="120"
        @mac-dialog-focus=${(e: Event) => {
          const dialog = e.target as HTMLElement
          dialog.setAttribute('active', '')
          dialog.parentElement?.querySelectorAll('mac-dialog').forEach((d) => {
            if (d !== dialog) d.removeAttribute('active')
          })
        }}
      >
        <p style="margin: 0; color: #1d1d1f;">Notes window — click to bring to front.</p>
      </mac-dialog>

      <mac-dialog
        title="Terminal"
        draggable=${args.draggable}
        resizable=${args.resizable}
        show-buttons=${args.showButtons}
        .width=${400}
        .height=${240}
        x="180"
        y="200"
        @mac-dialog-focus=${(e: Event) => {
          const dialog = e.target as HTMLElement
          dialog.setAttribute('active', '')
          dialog.parentElement?.querySelectorAll('mac-dialog').forEach((d) => {
            if (d !== dialog) d.removeAttribute('active')
          })
        }}
      >
        <p style="margin: 0; font-family: monospace; color: #1d1d1f;">
          $ echo "Hello, macOS!"<br />Hello, macOS!<br />$ _
        </p>
      </mac-dialog>
    </div>
  `,
}

export const InactiveDialog: Story = {
  args: { active: false },
  render: (args) => html`
    <div style="${containerStyle}">
      <mac-dialog
        title=${args.title}
        ?draggable=${args.draggable}
        ?resizable=${args.resizable}
        ?show-buttons=${args.showButtons}
        ?active=${args.active}
        .width=${args.width}
        .height=${args.height}
        x="200"
        y="110"
      >
        <p style="margin: 0; color: #1d1d1f;">
          This dialog is in an inactive state. Notice the greyed-out traffic lights and faded title.
        </p>
      </mac-dialog>
    </div>
  `,
}

export const NoResize: Story = {
  args: { resizable: false },
  render: (args) => html`
    <div style="${containerStyle}">
      <mac-dialog
        title=${args.title}
        ?draggable=${args.draggable}
        ?resizable=${args.resizable}
        ?show-buttons=${args.showButtons}
        ?active=${args.active}
        .width=${args.width}
        .height=${args.height}
        x="220"
        y="130"
      >
        <p style="margin: 0; color: #1d1d1f;">
          This dialog can be dragged but not resized. No resize handles are shown.
        </p>
      </mac-dialog>
    </div>
  `,
}

export const NoButtons: Story = {
  args: { showButtons: false },
  render: (args) => html`
    <div style="${containerStyle}">
      <mac-dialog
        title=${args.title}
        ?draggable=${args.draggable}
        ?resizable=${args.resizable}
        ?show-buttons=${args.showButtons}
        ?active=${args.active}
        .width=${args.width}
        .height=${args.height}
        x="200"
        y="110"
      >
        <p style="margin: 0; color: #1d1d1f;">
          This dialog has no traffic light buttons. You can use the slot="titlebar" to add custom
          controls.
        </p>
      </mac-dialog>
    </div>
  `,
}
