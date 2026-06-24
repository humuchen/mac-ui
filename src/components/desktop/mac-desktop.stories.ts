import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-desktop'
import '../desktop-icon/mac-desktop-icon'
import '../dock/mac-dock'
import '../dock/mac-dock-item'

const meta: Meta = {
  title: 'Components/Desktop',
  component: 'mac-desktop',
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Icon layout mode',
      table: { defaultValue: { summary: 'vertical' } },
    },
    cellSize: {
      control: 'number',
      description: 'Grid cell size in pixels',
      table: { defaultValue: { summary: '90' } },
    },
    spacing: {
      control: 'number',
      description: 'Grid spacing in pixels',
      table: { defaultValue: { summary: '8' } },
    },
    padding: {
      control: 'number',
      description: 'Padding from desktop edges',
      table: { defaultValue: { summary: '16' } },
    },
    wallpaper: {
      control: 'text',
      description: 'Wallpaper image URL',
    },
    showDock: {
      control: 'boolean',
      description: 'Whether to show the dock',
      table: { defaultValue: { summary: 'true' } },
    },
  },
  args: {
    layout: 'vertical',
    cellSize: 90,
    spacing: 8,
    padding: 16,
    wallpaper: '',
    showDock: true,
  },
}

export default meta
type Story = StoryObj

const desktopIcons = html`
  <mac-desktop-icon icon-id="macintosh" label="Macintosh HD" color="#8E8E93"></mac-desktop-icon>
  <mac-desktop-icon icon-id="documents" label="Documents" color="#007AFF"></mac-desktop-icon>
  <mac-desktop-icon icon-id="downloads" label="Downloads" color="#34C759"></mac-desktop-icon>
  <mac-desktop-icon icon-id="projects" label="Projects" color="#FF9500"></mac-desktop-icon>
  <mac-desktop-icon icon-id="notes" label="Notes.txt" color="#FFCC00"></mac-desktop-icon>
  <mac-desktop-icon icon-id="readme" label="README.md" color="#5856D6"></mac-desktop-icon>
`

const dockSlot = html`
  <mac-dock slot="dock">
    <mac-dock-item item-id="finder" label="Finder" color="#1C7FE2" running></mac-dock-item>
    <mac-dock-item item-id="safari" label="Safari" color="#007AFF" running></mac-dock-item>
    <mac-dock-item item-id="messages" label="Messages" color="#34C759"></mac-dock-item>
    <mac-dock-item item-id="mail" label="Mail" color="#007AFF" running></mac-dock-item>
    <mac-dock-item item-id="music" label="Music" color="#FC3C44"></mac-dock-item>
    <mac-dock-item item-id="terminal" label="Terminal" color="#000000" running></mac-dock-item>
  </mac-dock>
`

export const Basic: Story = {
  args: {
    showDock: false,
  },

  render: (args) => html`
    <mac-desktop
      .layout=${args.layout}
      .cellSize=${args.cellSize}
      .spacing=${args.spacing}
      .padding=${args.padding}
      .wallpaper=${args.wallpaper}
      ?show-dock=${args.showDock}
      style="width: 100%; height: 600px; display: block;"
    >
      ${desktopIcons} ${dockSlot}
    </mac-desktop>
  `,
}

export const WithWallpaper: Story = {
  args: { wallpaper: 'https://picsum.photos/seed/macos-sonoma/1920/1080' },
  render: (args) => html`
    <mac-desktop
      .wallpaper=${args.wallpaper}
      .layout=${args.layout}
      .cellSize=${args.cellSize}
      .spacing=${args.spacing}
      .padding=${args.padding}
      ?show-dock=${args.showDock}
      style="width: 100%; height: 600px; display: block;"
    >
      ${desktopIcons} ${dockSlot}
    </mac-desktop>
  `,
}

export const WithoutDock: Story = {
  args: { showDock: false },
  render: (args) => html`
    <mac-desktop
      .layout=${args.layout}
      .cellSize=${args.cellSize}
      .spacing=${args.spacing}
      .padding=${args.padding}
      .wallpaper=${args.wallpaper}
      ?show-dock=${args.showDock}
      style="width: 100%; height: 600px; display: block;"
    >
      ${desktopIcons}
    </mac-desktop>
  `,
}

export const HorizontalLayout: Story = {
  args: { layout: 'horizontal' },
  render: (args) => html`
    <mac-desktop
      .layout=${args.layout}
      .cellSize=${args.cellSize}
      .spacing=${args.spacing}
      .padding=${args.padding}
      .wallpaper=${args.wallpaper}
      ?show-dock=${args.showDock}
      style="width: 100%; height: 600px; display: block;"
    >
      ${desktopIcons} ${dockSlot}
    </mac-desktop>
  `,
}

export const CustomIconImages: Story = {
  args: {
    layout: 'vertical',
    cellSize: 90,
    spacing: 8,
    padding: 16,
    showDock: true,
  },
  render: (args) => html`
    <mac-desktop
      .layout=${args.layout}
      .cellSize=${args.cellSize}
      .spacing=${args.spacing}
      .padding=${args.padding}
      ?show-dock=${args.showDock}
      style="width: 100%; height: 600px; display: block;"
    >
      <mac-desktop-icon icon-id="folder1" label="Work">
        <img src="https://picsum.photos/seed/folder1/112/112" alt="Work" />
      </mac-desktop-icon>
      <mac-desktop-icon icon-id="folder2" label="Personal">
        <img src="https://picsum.photos/seed/folder2/112/112" alt="Personal" />
      </mac-desktop-icon>
      <mac-desktop-icon icon-id="file1" label="Report.pdf">
        <img src="https://picsum.photos/seed/file1/112/112" alt="Report" />
      </mac-desktop-icon>
      <mac-desktop-icon icon-id="file2" label="Photo.jpg">
        <img src="https://picsum.photos/seed/file2/112/112" alt="Photo" />
      </mac-desktop-icon>
      ${dockSlot}
    </mac-desktop>
  `,
}

export const RightClickMenu: Story = {
  args: {
    layout: 'vertical',
    cellSize: 90,
    spacing: 8,
    padding: 16,
    showDock: true,
  },
  render: (args) => html`
    <div style="margin-bottom: 12px; font-size: 13px; color: #6b7280;">
      Right-click on the desktop to see the context menu with layout options
    </div>
    <mac-desktop
      .layout=${args.layout}
      .cellSize=${args.cellSize}
      .spacing=${args.spacing}
      .padding=${args.padding}
      ?show-dock=${args.showDock}
      style="width: 100%; height: 600px; display: block;"
    >
      ${desktopIcons} ${dockSlot}
    </mac-desktop>
  `,
}

export const IconSelection: Story = {
  args: {
    layout: 'vertical',
    cellSize: 90,
    spacing: 8,
    padding: 16,
    showDock: true,
  },
  render: (args) => html`
    <div style="margin-bottom: 12px; font-size: 13px; color: #6b7280;">
      Click to select, Shift+click for multi-select, drag on empty area for box selection
    </div>
    <mac-desktop
      .layout=${args.layout}
      .cellSize=${args.cellSize}
      .spacing=${args.spacing}
      .padding=${args.padding}
      ?show-dock=${args.showDock}
      style="width: 100%; height: 600px; display: block;"
    >
      ${desktopIcons} ${dockSlot}
    </mac-desktop>
  `,
}

export const IconDrag: Story = {
  args: {
    layout: 'vertical',
    cellSize: 90,
    spacing: 8,
    padding: 16,
    showDock: true,
  },
  render: (args) => html`
    <div style="margin-bottom: 12px; font-size: 13px; color: #6b7280;">
      Drag icons to reposition them on the desktop
    </div>
    <mac-desktop
      .layout=${args.layout}
      .cellSize=${args.cellSize}
      .spacing=${args.spacing}
      .padding=${args.padding}
      ?show-dock=${args.showDock}
      style="width: 100%; height: 600px; display: block;"
    >
      ${desktopIcons} ${dockSlot}
    </mac-desktop>
  `,
}

export const DenseGrid: Story = {
  args: {
    layout: 'vertical',
    cellSize: 80,
    spacing: 4,
    padding: 12,
    showDock: true,
  },
  render: (args) => html`
    <mac-desktop
      .layout=${args.layout}
      .cellSize=${args.cellSize}
      .spacing=${args.spacing}
      .padding=${args.padding}
      ?show-dock=${args.showDock}
      style="width: 100%; height: 600px; display: block;"
    >
      <mac-desktop-icon icon-id="hd" label="Macintosh HD" color="#8E8E93"></mac-desktop-icon>
      <mac-desktop-icon icon-id="doc" label="Documents" color="#007AFF"></mac-desktop-icon>
      <mac-desktop-icon icon-id="dl" label="Downloads" color="#34C759"></mac-desktop-icon>
      <mac-desktop-icon icon-id="proj" label="Projects" color="#FF9500"></mac-desktop-icon>
      <mac-desktop-icon icon-id="note" label="Notes.txt" color="#FFCC00"></mac-desktop-icon>
      <mac-desktop-icon icon-id="read" label="README.md" color="#5856D6"></mac-desktop-icon>
      <mac-desktop-icon icon-id="src" label="src" color="#30D158"></mac-desktop-icon>
      <mac-desktop-icon icon-id="test" label="tests" color="#FF375F"></mac-desktop-icon>
      <mac-desktop-icon icon-id="cfg" label=".config" color="#636366"></mac-desktop-icon>
      <mac-desktop-icon icon-id="pkg" label="package.json" color="#BF5AF2"></mac-desktop-icon>
      ${dockSlot}
    </mac-desktop>
  `,
}
