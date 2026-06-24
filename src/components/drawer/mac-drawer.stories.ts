import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-drawer'

const meta: Meta = {
  title: 'Components/Drawer',
  component: 'mac-drawer',
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the drawer is open',
      table: { defaultValue: { summary: 'false' } },
    },
    placement: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Drawer placement direction',
      table: { defaultValue: { summary: 'right' } },
    },
    title: {
      control: 'text',
      description: 'Drawer title',
    },
    width: {
      control: 'text',
      description: 'Drawer width (left/right placement)',
      table: { defaultValue: { summary: '360px' } },
    },
    height: {
      control: 'text',
      description: 'Drawer height (top/bottom placement)',
      table: { defaultValue: { summary: '360px' } },
    },
    closable: {
      control: 'boolean',
      description: 'Whether to show close button',
      table: { defaultValue: { summary: 'true' } },
    },
    maskClosable: {
      control: 'boolean',
      description: 'Whether clicking mask closes drawer',
      table: { defaultValue: { summary: 'true' } },
    },
    showMask: {
      control: 'select',
      options: [true, false, 'transparent'],
      description: 'Mask overlay: true, false, or transparent',
      table: { defaultValue: { summary: 'true' } },
    },
    closeOnEsc: {
      control: 'boolean',
      description: 'Whether ESC closes the drawer',
      table: { defaultValue: { summary: 'true' } },
    },
    resizable: {
      control: 'boolean',
      description: 'Whether the drawer can be resized',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: {
    open: false,
    placement: 'right',
    title: '抽屉标题',
    width: '360px',
    height: '360px',
    closable: true,
    maskClosable: true,
    showMask: true,
    closeOnEsc: true,
    resizable: false,
  },
}

export default meta
type Story = StoryObj

export const Basic: Story = {
  render: (args) => html`
    <mac-button @click=${() => {
      const drawer = document.querySelector('#basic-drawer') as HTMLElement & { open: boolean }
      if (drawer) drawer.open = true
    }}>打开抽屉</mac-button>

    <mac-drawer
      id="basic-drawer"
      .placement=${args.placement}
      .title=${args.title}
      .width=${args.width}
      .height=${args.height}
      ?closable=${args.closable}
      ?mask-closable=${args.maskClosable}
      .showMask=${args.showMask}
      ?close-on-esc=${args.closeOnEsc}
      ?resizable=${args.resizable}
      @mac-drawer-close=${() => {
        const drawer = document.querySelector('#basic-drawer') as HTMLElement & { open: boolean }
        if (drawer) drawer.open = false
      }}
    >
      <p>这是一个基础抽屉组件的内容区域。</p>
      <p>你可以在这里放置任何内容。</p>
    </mac-drawer>
  `,
}

export const RightPlacement: Story = {
  args: { placement: 'right', title: '右侧抽屉', width: '400px' },
  render: (args) => html`
    <mac-button @click=${() => {
      const d = document.querySelector('#right-drawer') as HTMLElement & { open: boolean }
      if (d) d.open = true
    }}>从右侧打开</mac-button>

    <mac-drawer
      id="right-drawer"
      .placement=${args.placement}
      .title=${args.title}
      .width=${args.width}
      ?closable=${args.closable}
      ?mask-closable=${args.maskClosable}
      .showMask=${args.showMask}
      ?close-on-esc=${args.closeOnEsc}
      ?resizable=${args.resizable}
      @mac-drawer-close=${() => {
        const d = document.querySelector('#right-drawer') as HTMLElement & { open: boolean }
        if (d) d.open = false
      }}
    >
      <p>从右侧滑入的抽屉面板。</p>
      <p>这是最常见的抽屉方向，适合展示详情或表单。</p>
    </mac-drawer>
  `,
}

export const LeftPlacement: Story = {
  args: { placement: 'left', title: '左侧抽屉', width: '320px' },
  render: (args) => html`
    <mac-button @click=${() => {
      const d = document.querySelector('#left-drawer') as HTMLElement & { open: boolean }
      if (d) d.open = true
    }}>从左侧打开</mac-button>

    <mac-drawer
      id="left-drawer"
      .placement=${args.placement}
      .title=${args.title}
      .width=${args.width}
      ?closable=${args.closable}
      ?mask-closable=${args.maskClosable}
      .showMask=${args.showMask}
      ?close-on-esc=${args.closeOnEsc}
      ?resizable=${args.resizable}
      @mac-drawer-close=${() => {
        const d = document.querySelector('#left-drawer') as HTMLElement & { open: boolean }
        if (d) d.open = false
      }}
    >
      <p>从左侧滑入的抽屉面板。</p>
      <p>适合用作导航菜单或筛选面板。</p>
    </mac-drawer>
  `,
}

export const TopPlacement: Story = {
  args: { placement: 'top', title: '顶部抽屉', height: '280px' },
  render: (args) => html`
    <mac-button @click=${() => {
      const d = document.querySelector('#top-drawer') as HTMLElement & { open: boolean }
      if (d) d.open = true
    }}>从顶部打开</mac-button>

    <mac-drawer
      id="top-drawer"
      .placement=${args.placement}
      .title=${args.title}
      .height=${args.height}
      ?closable=${args.closable}
      ?mask-closable=${args.maskClosable}
      .showMask=${args.showMask}
      ?close-on-esc=${args.closeOnEsc}
      ?resizable=${args.resizable}
      @mac-drawer-close=${() => {
        const d = document.querySelector('#top-drawer') as HTMLElement & { open: boolean }
        if (d) d.open = false
      }}
    >
      <p>从顶部滑入的抽屉面板。</p>
      <p>适合展示通知、搜索或快捷操作。</p>
    </mac-drawer>
  `,
}

export const BottomPlacement: Story = {
  args: { placement: 'bottom', title: '底部抽屉', height: '320px' },
  render: (args) => html`
    <mac-button @click=${() => {
      const d = document.querySelector('#bottom-drawer') as HTMLElement & { open: boolean }
      if (d) d.open = true
    }}>从底部打开</mac-button>

    <mac-drawer
      id="bottom-drawer"
      .placement=${args.placement}
      .title=${args.title}
      .height=${args.height}
      ?closable=${args.closable}
      ?mask-closable=${args.maskClosable}
      .showMask=${args.showMask}
      ?close-on-esc=${args.closeOnEsc}
      ?resizable=${args.resizable}
      @mac-drawer-close=${() => {
        const d = document.querySelector('#bottom-drawer') as HTMLElement & { open: boolean }
        if (d) d.open = false
      }}
    >
      <p>从底部滑入的抽屉面板。</p>
      <p>适合展示操作面板、确认对话框等。</p>
    </mac-drawer>
  `,
}

export const Resizable: Story = {
  args: { resizable: true, width: '400px' },
  render: (args) => html`
    <mac-button @click=${() => {
      const d = document.querySelector('#resizable-drawer') as HTMLElement & { open: boolean }
      if (d) d.open = true
    }}>打开可调整大小的抽屉</mac-button>

    <mac-drawer
      id="resizable-drawer"
      .placement=${args.placement}
      .title=${args.title}
      .width=${args.width}
      ?closable=${args.closable}
      ?mask-closable=${args.maskClosable}
      .showMask=${args.showMask}
      ?close-on-esc=${args.closeOnEsc}
      ?resizable=${args.resizable}
      @mac-drawer-close=${() => {
        const d = document.querySelector('#resizable-drawer') as HTMLElement & { open: boolean }
        if (d) d.open = false
      }}
    >
      <p>拖动左边缘可以调整抽屉的宽度。</p>
      <p>最小宽度 200px，最大宽度 80vw。</p>
    </mac-drawer>
  `,
}

export const NoMask: Story = {
  args: { showMask: false, width: '320px' },
  render: (args) => html`
    <mac-button @click=${() => {
      const d = document.querySelector('#nomask-drawer') as HTMLElement & { open: boolean }
      if (d) d.open = true
    }}>打开无遮罩抽屉</mac-button>

    <mac-drawer
      id="nomask-drawer"
      .placement=${args.placement}
      .title=${args.title}
      .width=${args.width}
      .showMask=${args.showMask}
      ?closable=${args.closable}
      ?mask-closable=${args.maskClosable}
      ?close-on-esc=${args.closeOnEsc}
      ?resizable=${args.resizable}
      @mac-drawer-close=${() => {
        const d = document.querySelector('#nomask-drawer') as HTMLElement & { open: boolean }
        if (d) d.open = false
      }}
    >
      <p>没有遮罩层的抽屉面板。</p>
      <p>用户可以同时与页面其他内容交互。</p>
    </mac-drawer>
  `,
}

export const TransparentMask: Story = {
  args: { showMask: 'transparent', width: '320px' },
  render: (args) => html`
    <mac-button @click=${() => {
      const d = document.querySelector('#transparent-drawer') as HTMLElement & { open: boolean }
      if (d) d.open = true
    }}>打开透明遮罩抽屉</mac-button>

    <mac-drawer
      id="transparent-drawer"
      .placement=${args.placement}
      .title=${args.title}
      .width=${args.width}
      .showMask=${args.showMask}
      ?closable=${args.closable}
      ?mask-closable=${args.maskClosable}
      ?close-on-esc=${args.closeOnEsc}
      ?resizable=${args.resizable}
      @mac-drawer-close=${() => {
        const d = document.querySelector('#transparent-drawer') as HTMLElement & { open: boolean }
        if (d) d.open = false
      }}
    >
      <p>遮罩层是透明的，但点击遮罩区域仍可关闭抽屉。</p>
    </mac-drawer>
  `,
}

export const WithFooter: Story = {
  args: { width: '400px' },
  render: (args) => html`
    <mac-button @click=${() => {
      const d = document.querySelector('#footer-drawer') as HTMLElement & { open: boolean }
      if (d) d.open = true
    }}>打开带底部按钮的抽屉</mac-button>

    <mac-drawer
      id="footer-drawer"
      .placement=${args.placement}
      .title=${args.title}
      .width=${args.width}
      ?closable=${args.closable}
      ?mask-closable=${args.maskClosable}
      .showMask=${args.showMask}
      ?close-on-esc=${args.closeOnEsc}
      ?resizable=${args.resizable}
      @mac-drawer-close=${() => {
        const d = document.querySelector('#footer-drawer') as HTMLElement & { open: boolean }
        if (d) d.open = false
      }}
    >
      <p>这是一个带底部操作按钮的抽屉。</p>
      <p>请在下方确认你的操作。</p>
      <div slot="footer" style="display:flex;gap:8px;justify-content:flex-end;width:100%;">
        <mac-button size="sm" @click=${() => {
          const d = document.querySelector('#footer-drawer') as HTMLElement & { open: boolean }
          if (d) d.open = false
        }}>取消</mac-button>
        <mac-button size="sm" variant="primary" @click=${() => {
          const d = document.querySelector('#footer-drawer') as HTMLElement & { open: boolean }
          if (d) d.open = false
        }}>确认</mac-button>
      </div>
    </mac-drawer>
  `,
}

export const NoClosable: Story = {
  args: { closable: false, width: '320px' },
  render: (args) => html`
    <mac-button @click=${() => {
      const d = document.querySelector('#noclose-drawer') as HTMLElement & { open: boolean }
      if (d) d.open = true
    }}>打开无关闭按钮的抽屉</mac-button>

    <mac-drawer
      id="noclose-drawer"
      .placement=${args.placement}
      .title=${args.title}
      .width=${args.width}
      ?closable=${args.closable}
      ?mask-closable=${args.maskClosable}
      .showMask=${args.showMask}
      ?close-on-esc=${args.closeOnEsc}
      ?resizable=${args.resizable}
      @mac-drawer-close=${() => {
        const d = document.querySelector('#noclose-drawer') as HTMLElement & { open: boolean }
        if (d) d.open = false
      }}
    >
      <p>没有右上角关闭按钮，只能通过点击遮罩或按 ESC 关闭。</p>
    </mac-drawer>
  `,
}
