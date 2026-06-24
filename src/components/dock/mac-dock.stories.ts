import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-dock'
import './mac-dock-item'

const meta: Meta = {
  title: 'Components/Dock',
  component: 'mac-dock',
  tags: ['autodocs'],
  argTypes: {
    magnification: {
      control: 'number',
      description: 'Magnification scale factor (1.0 = no magnification)',
      table: { defaultValue: { summary: '1.6' } },
    },
    iconSize: {
      control: 'number',
      description: 'Base icon size in pixels',
      table: { defaultValue: { summary: '48' } },
    },
    magnifyRange: {
      control: 'number',
      description: 'Magnification range in pixels',
      table: { defaultValue: { summary: '120' } },
    },
    position: {
      control: 'select',
      options: ['bottom', 'left', 'right'],
      description: 'Position of the dock',
      table: { defaultValue: { summary: 'bottom' } },
    },
  },
  args: {
    magnification: 1.6,
    iconSize: 48,
    magnifyRange: 120,
    position: 'bottom',
  },
}

export default meta
type Story = StoryObj

const dockItems = html`
  <mac-dock-item item-id="finder" label="Finder" color="#1C7FE2"></mac-dock-item>
  <mac-dock-item item-id="safari" label="Safari" color="#007AFF"></mac-dock-item>
  <mac-dock-item item-id="messages" label="Messages" color="#34C759"></mac-dock-item>
  <mac-dock-item item-id="mail" label="Mail" color="#007AFF"></mac-dock-item>
  <mac-dock-item item-id="music" label="Music" color="#FC3C44"></mac-dock-item>
  <mac-dock-item item-id="photos" label="Photos" color="#FF9500"></mac-dock-item>
  <mac-dock-item item-id="notes" label="Notes" color="#FFCC00"></mac-dock-item>
  <mac-dock-item item-id="terminal" label="Terminal" color="#000000"></mac-dock-item>
`

export const Basic: Story = {
  args: {
    iconSize: 68,
  },

  render: (args) => html`
    <div
      style="
        width: 100%;
        height: 400px;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        border-radius: 12px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 16px;
        position: relative;
        overflow: hidden;
      "
    >
      <mac-dock
        .magnification=${args.magnification}
        .iconSize=${args.iconSize}
        .magnifyRange=${args.magnifyRange}
        .position=${args.position}
      >
        ${dockItems}
      </mac-dock>
    </div>
  `,
}

export const WithRunningIndicators: Story = {
  render: (args) => html`
    <div
      style="
        width: 100%;
        height: 400px;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        border-radius: 12px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 16px;
        position: relative;
        overflow: hidden;
      "
    >
      <mac-dock
        .magnification=${args.magnification}
        .iconSize=${args.iconSize}
        .magnifyRange=${args.magnifyRange}
        .position=${args.position}
      >
        <mac-dock-item item-id="finder" label="Finder" color="#1C7FE2" running></mac-dock-item>
        <mac-dock-item item-id="safari" label="Safari" color="#007AFF" running></mac-dock-item>
        <mac-dock-item item-id="messages" label="Messages" color="#34C759"></mac-dock-item>
        <mac-dock-item item-id="mail" label="Mail" color="#007AFF" running></mac-dock-item>
        <mac-dock-item item-id="music" label="Music" color="#FC3C44"></mac-dock-item>
        <mac-dock-item item-id="photos" label="Photos" color="#FF9500" running></mac-dock-item>
        <mac-dock-item item-id="notes" label="Notes" color="#FFCC00"></mac-dock-item>
        <mac-dock-item item-id="terminal" label="Terminal" color="#000000" running></mac-dock-item>
      </mac-dock>
    </div>
  `,
}

export const WithCustomIcons: Story = {
  render: (args) => html`
    <div
      style="
        width: 100%;
        height: 400px;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        border-radius: 12px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 16px;
        position: relative;
        overflow: hidden;
      "
    >
      <mac-dock
        .magnification=${args.magnification}
        .iconSize=${args.iconSize}
        .magnifyRange=${args.magnifyRange}
        .position=${args.position}
      >
        <mac-dock-item item-id="finder" label="Finder" running>
          <img src="https://picsum.photos/seed/finder/96/96" alt="Finder" />
        </mac-dock-item>
        <mac-dock-item item-id="safari" label="Safari" running>
          <img src="https://picsum.photos/seed/safari/96/96" alt="Safari" />
        </mac-dock-item>
        <mac-dock-item item-id="messages" label="Messages">
          <img src="https://picsum.photos/seed/messages/96/96" alt="Messages" />
        </mac-dock-item>
        <mac-dock-item item-id="mail" label="Mail">
          <img src="https://picsum.photos/seed/mail/96/96" alt="Mail" />
        </mac-dock-item>
        <mac-dock-item item-id="music" label="Music" running>
          <img src="https://picsum.photos/seed/music/96/96" alt="Music" />
        </mac-dock-item>
      </mac-dock>
    </div>
  `,
}

export const NoMagnification: Story = {
  args: { magnification: 1.0 },
  render: (args) => html`
    <div
      style="
        width: 100%;
        height: 400px;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        border-radius: 12px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 16px;
        position: relative;
        overflow: hidden;
      "
    >
      <mac-dock
        .magnification=${args.magnification}
        .iconSize=${args.iconSize}
        .magnifyRange=${args.magnifyRange}
        .position=${args.position}
      >
        ${dockItems}
      </mac-dock>
    </div>
  `,
}

export const SmallIcons: Story = {
  args: { iconSize: 36, magnification: 1.4, magnifyRange: 80 },
  render: (args) => html`
    <div
      style="
        width: 100%;
        height: 350px;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        border-radius: 12px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 16px;
        position: relative;
        overflow: hidden;
      "
    >
      <mac-dock
        .magnification=${args.magnification}
        .iconSize=${args.iconSize}
        .magnifyRange=${args.magnifyRange}
        .position=${args.position}
      >
        ${dockItems}
      </mac-dock>
    </div>
  `,
}

export const RightClickMenu: Story = {
  render: (args) => html`
    <div style="margin-bottom: 12px; font-size: 13px; color: #6b7280;">
      Right-click any dock item to see the context menu
    </div>
    <div
      style="
        width: 100%;
        height: 400px;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        border-radius: 12px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 16px;
        position: relative;
        overflow: hidden;
      "
    >
      <mac-dock
        .magnification=${args.magnification}
        .iconSize=${args.iconSize}
        .magnifyRange=${args.magnifyRange}
        .position=${args.position}
      >
        ${dockItems}
      </mac-dock>
    </div>
  `,
}

export const DragToRemove: Story = {
  render: (args) => html`
    <div style="margin-bottom: 12px; font-size: 13px; color: #6b7280;">
      Drag an item outside the dock to remove it
    </div>
    <div
      style="
        width: 100%;
        height: 400px;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        border-radius: 12px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 16px;
        position: relative;
        overflow: hidden;
      "
    >
      <mac-dock
        .magnification=${args.magnification}
        .iconSize=${args.iconSize}
        .magnifyRange=${args.magnifyRange}
        .position=${args.position}
      >
        ${dockItems}
      </mac-dock>
    </div>
  `,
}
