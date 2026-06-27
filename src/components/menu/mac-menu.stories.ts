import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-menu'
import type { DropdownItem } from '../dropdown/mac-dropdown'

const meta: Meta = {
  title: 'Components/Menu',
  component: 'mac-menu',
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: 'Menu items',
    },
    value: {
      control: 'text',
      description: 'Active item value',
    },
  },
}

export default meta
type Story = StoryObj

const basicItems: DropdownItem[] = [
  { value: 'new-file', label: 'New File', icon: '📄', shortcut: '⌘N' },
  { value: 'new-folder', label: 'New Folder', icon: '📁', shortcut: '⇧⌘N' },
  { divider: true, value: '', label: '' },
  { value: 'get-info', label: 'Get Info', icon: 'ℹ️', shortcut: '⌘I' },
  { value: 'rename', label: 'Rename', icon: '✏️' },
  { divider: true, value: '', label: '' },
  { value: 'copy', label: 'Copy', icon: '📋', shortcut: '⌘C' },
  { value: 'paste', label: 'Paste', icon: '📌', shortcut: '⌘V' },
  { divider: true, value: '', label: '' },
  { value: 'delete', label: 'Move to Trash', icon: '🗑️', danger: true },
]

export const Basic: Story = {
  render: () => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      const menu = document.querySelector('mac-menu') as any
      if (menu) {
        menu.show(e.clientX, e.clientY, basicItems)
      }
    }

    return html`
      <div
        style="
          width: 400px;
          height: 300px;
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          font-size: 14px;
          user-select: none;
          position: relative;
        "
        @contextmenu=${handleContextMenu}
      >
        Right-click this area
      </div>
      <mac-menu></mac-menu>
    `
  },
}

export const WithActiveItem: Story = {
  render: () => {
    const itemsWithActive: DropdownItem[] = [
      { value: 'option1', label: 'Option 1', icon: '🔵' },
      { value: 'option2', label: 'Option 2 (Active)', icon: '✅' },
      { value: 'option3', label: 'Option 3', icon: '⚪' },
    ]

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      const menu = document.querySelector('#menu-with-active') as any
      if (menu) {
        menu.value = 'option2'
        menu.show(e.clientX, e.clientY, itemsWithActive)
      }
    }

    return html`
      <div
        style="
          width: 400px;
          height: 200px;
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          font-size: 14px;
        "
        @contextmenu=${handleContextMenu}
      >
        Right-click to show menu with active item
      </div>
      <mac-menu id="menu-with-active"></mac-menu>
    `
  },
}

export const Positioned: Story = {
  render: () => {
    const positionedItems: DropdownItem[] = [
      { value: 'item1', label: 'Menu Item 1', shortcut: '⌘1' },
      { value: 'item2', label: 'Menu Item 2', shortcut: '⌘2' },
      { value: 'item3', label: 'Menu Item 3', shortcut: '⌘3' },
    ]

    const showAtPosition = (x: number, y: number) => {
      const menu = document.querySelector('#positioned-menu') as any
      if (menu) {
        menu.show(x, y, positionedItems)
      }
    }

    return html`
      <div style="display: flex; gap: 16px; flex-direction: column;">
        <button
          @click=${() => showAtPosition(20, 20)}
          style="padding: 8px 16px; border-radius: 6px; border: 1px solid #d1d5db; background: white; cursor: pointer;"
        >
          Show at Top-Left (20, 20)
        </button>
        <button
          @click=${() => {
            const w = window.innerWidth
            showAtPosition(w - 200, 20)
          }}
          style="padding: 8px 16px; border-radius: 6px; border: 1px solid #d1d5db; background: white; cursor: pointer;"
        >
          Show at Top-Right
        </button>
        <button
          @click=${() => showAtPosition(window.innerWidth / 2, window.innerHeight / 2)}
          style="padding: 8px 16px; border-radius: 6px; border: 1px solid #d1d5db; background: white; cursor: pointer;"
        >
          Show at Center
        </button>
        <p style="color: #6b7280; font-size: 12px; margin-top: 16px;">
          Click buttons to show menu at fixed positions (viewport coordinates).
        </p>
      </div>
      <mac-menu id="positioned-menu"></mac-menu>
    `
  },
}

export const WithDanger: Story = {
  render: () => {
    const dangerItems: DropdownItem[] = [
      { value: 'edit', label: 'Edit', icon: '✏️' },
      { value: 'duplicate', label: 'Duplicate', icon: '📋' },
      { divider: true, value: '', label: '' },
      { value: 'delete', label: 'Delete', icon: '🗑️', danger: true },
      { value: 'archive', label: 'Archive', icon: '📦', danger: true },
    ]

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      const menu = document.querySelector('#danger-menu') as any
      if (menu) {
        menu.show(e.clientX, e.clientY, dangerItems)
      }
    }

    return html`
      <div
        style="
          width: 400px;
          height: 200px;
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          font-size: 14px;
        "
        @contextmenu=${handleContextMenu}
      >
        Right-click for danger items
      </div>
      <mac-menu id="danger-menu"></mac-menu>
    `
  },
}

export const ProgrammaticControl: Story = {
  render: () => {
    const programmaticItems: DropdownItem[] = [
      { value: 'action1', label: 'Action 1' },
      { value: 'action2', label: 'Action 2' },
      { value: 'action3', label: 'Action 3' },
    ]

    const showMenu = (e: MouseEvent) => {
      const menu = document.querySelector('#programmatic-menu') as any
      if (menu) {
        // Get button position and show menu below it
        const button = e.currentTarget as HTMLElement
        const rect = button.getBoundingClientRect()
        const x = rect.left
        const y = rect.bottom + 4
        menu.show(x, y, programmaticItems)
      }
    }

    const hideMenu = () => {
      const menu = document.querySelector('#programmatic-menu') as any
      menu?.hide()
    }

    const toggleMenu = (e: MouseEvent) => {
      const menu = document.querySelector('#programmatic-menu') as any
      if (menu) {
        const button = e.currentTarget as HTMLElement
        const rect = button.getBoundingClientRect()
        const x = rect.left
        const y = rect.bottom + 4
        menu.toggle(x, y, programmaticItems)
      }
    }

    return html`
      <div style="display: flex; gap: 12px; margin-top: 100px;">
        <button
          @click=${showMenu}
          style="padding: 8px 16px; border-radius: 6px; border: 1px solid #d1d5db; background: white; cursor: pointer;"
        >
          Show Menu
        </button>
        <button
          @click=${hideMenu}
          style="padding: 8px 16px; border-radius: 6px; border: 1px solid #d1d5db; background: white; cursor: pointer;"
        >
          Hide Menu
        </button>
        <button
          @click=${toggleMenu}
          style="padding: 8px 16px; border-radius: 6px; border: 1px solid #d1d5db; background: white; cursor: pointer;"
        >
          Toggle Menu
        </button>
      </div>
      <p style="color: #6b7280; font-size: 12px; margin-top: 16px;">
        Click buttons to control the menu programmatically. Menu will appear below the clicked
        button.
      </p>
      <mac-menu id="programmatic-menu"></mac-menu>
    `
  },
}

export const ThemeAdaptation: Story = {
  render: () => {
    const themeItems: DropdownItem[] = [
      { value: 'light', label: 'Light Theme', icon: '☀️' },
      { value: 'dark', label: 'Dark Theme', icon: '🌙' },
      { value: 'auto', label: 'Auto (System)', icon: '🔄' },
      { divider: true, value: '', label: '' },
      { value: 'info', label: 'Menu adapts to theme', icon: 'ℹ️' },
    ]

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      const menu = document.querySelector('#theme-menu') as any
      if (menu) {
        menu.show(e.clientX, e.clientY, themeItems)
      }
    }

    const toggleTheme = (theme: 'light' | 'dark') => {
      document.documentElement.setAttribute('data-theme', theme)
    }

    return html`
      <div style="display: flex; gap: 16px; margin-bottom: 16px;">
        <button
          @click=${() => toggleTheme('light')}
          style="padding: 8px 16px; border-radius: 6px; border: 1px solid #d1d5db; background: white; cursor: pointer;"
        >
          Set Light Theme
        </button>
        <button
          @click=${() => toggleTheme('dark')}
          style="padding: 8px 16px; border-radius: 6px; border: 1px solid #d1d5db; background: #1d1d1f; color: white; cursor: pointer;"
        >
          Set Dark Theme
        </button>
      </div>
      <div
        style="
          width: 400px;
          height: 200px;
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          font-size: 14px;
        "
        @contextmenu=${handleContextMenu}
      >
        Right-click to show themed menu
      </div>
      <p style="color: #6b7280; font-size: 12px; margin-top: 16px;">
        The menu automatically adapts to the current theme. Try switching between light and dark
        themes, then right-click to see the difference.
      </p>
      <mac-menu id="theme-menu" theme="light"></mac-menu>
    `
  },
}
