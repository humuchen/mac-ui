import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-card'

const meta: Meta = {
  title: 'Components/Card',
  component: 'mac-card',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'glass', 'outlined', 'gradient'],
      description: 'The visual variant of the card',
      table: { defaultValue: { summary: 'default' } },
    },
    hoverable: {
      control: 'boolean',
      description: 'Whether the card has a hover effect',
    },
    clickable: {
      control: 'boolean',
      description: 'Whether the card is clickable',
    },
    loading: {
      control: 'boolean',
      description: 'Shows a loading state',
    },
    accent: {
      control: 'select',
      options: [undefined, 'top', 'left'],
      description: 'Adds an accent border',
    },
    mediaRatio: {
      control: 'select',
      options: [undefined, '16-9', '4-3', '1-1'],
      description: 'Media aspect ratio',
    },
  },
  args: {
    variant: 'default',
    hoverable: false,
    clickable: false,
    loading: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/example',
    },
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: (_args) => html`
    <mac-card variant="default" style="max-width: 400px;">
      <div slot="header" style="font-weight: 600; font-size: 18px; color: #1f2937;">
        Beautiful Card Design
      </div>
      <p style="margin: 0 0 12px 0; color: #6b7280; line-height: 1.6;">
        This is a basic card with refined shadows, smooth transitions, and improved typography. It
        demonstrates the enhanced visual hierarchy and depth.
      </p>
      <p style="margin: 0; color: #9ca3af; font-size: 13px;">
        Optimized for macOS-style aesthetics.
      </p>
    </mac-card>
  `,
}

export const Variants: Story = {
  render: (_args) => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;"
    >
      <mac-card variant="default">
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">Default</div>
        <p style="margin: 0 0 8px 0; color: #6b7280;">
          Standard card with refined multi-layer shadows and subtle border.
        </p>
      </mac-card>

      <mac-card variant="elevated">
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">Elevated</div>
        <p style="margin: 0 0 8px 0; color: #6b7280;">
          Deep elevation with progressive shadow layers for premium depth.
        </p>
      </mac-card>

      <mac-card variant="glass">
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">Glass</div>
        <p style="margin: 0 0 8px 0; color: #6b7280;">
          Frosted glass with enhanced blur (20px) and saturation (180%).
        </p>
      </mac-card>

      <mac-card variant="outlined">
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">Outlined</div>
        <p style="margin: 0 0 8px 0; color: #6b7280;">
          Clean transparent background with refined border styling.
        </p>
      </mac-card>

      <mac-card variant="gradient">
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">Gradient</div>
        <p style="margin: 0 0 8px 0; color: #6b7280;">
          Vibrant tricolor gradient (Blue → Purple → Pink) with soft glow.
        </p>
      </mac-card>
    </div>
  `,
}

export const WithMedia: Story = {
  render: (_args) => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;"
    >
      <mac-card variant="elevated" mediaRatio="16-9" hoverable>
        <img
          slot="media"
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800"
          alt="Code on screen"
          style="width: 100%; height: 100%; object-fit: cover;"
        />
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">
          Technology
        </div>
        <p style="margin: 0 0 12px 0; color: #6b7280; line-height: 1.6;">
          Image scales smoothly on hover with physics-based cubic-bezier transitions.
        </p>
        <p style="margin: 0; color: #9ca3af; font-size: 13px;">16:9 aspect ratio</p>
      </mac-card>

      <mac-card variant="gradient" mediaRatio="4-3" hoverable>
        <img
          slot="media"
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"
          alt="Laptop on desk"
          style="width: 100%; height: 100%; object-fit: cover;"
        />
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">
          Workspace
        </div>
        <p style="margin: 0 0 12px 0; color: #6b7280; line-height: 1.6;">
          Gradient variant intensifies colors and shadow on hover interaction.
        </p>
        <p style="margin: 0; color: #9ca3af; font-size: 13px;">4:3 aspect ratio</p>
      </mac-card>

      <mac-card variant="glass" mediaRatio="1-1" hoverable>
        <img
          slot="media"
          src="https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=800"
          alt="Nature"
          style="width: 100%; height: 100%; object-fit: cover;"
        />
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">Nature</div>
        <p style="margin: 0 0 12px 0; color: #6b7280; line-height: 1.6;">
          Glass effect enhances transparency and blur on hover state.
        </p>
        <p style="margin: 0; color: #9ca3af; font-size: 13px;">1:1 aspect ratio</p>
      </mac-card>
    </div>
  `,
}

export const HoverableCards: Story = {
  render: (_args) => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;"
    >
      <mac-card variant="default" hoverable>
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">
          Default Hover
        </div>
        <p style="margin: 0; color: #6b7280;">
          Lifts 4px with scale(1.01) and border highlights with primary color.
        </p>
      </mac-card>

      <mac-card variant="elevated" hoverable>
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">
          Elevated Hover
        </div>
        <p style="margin: 0; color: #6b7280;">
          Progressive shadow expansion with subtle blue ring accent.
        </p>
      </mac-card>

      <mac-card variant="glass" hoverable>
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">
          Glass Hover
        </div>
        <p style="margin: 0; color: #6b7280;">
          Increases transparency (82%) and enhances white border.
        </p>
      </mac-card>

      <mac-card variant="outlined" hoverable>
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">
          Outlined Hover
        </div>
        <p style="margin: 0; color: #6b7280;">
          Border turns primary color (2px) with focus ring glow.
        </p>
      </mac-card>

      <mac-card variant="gradient" hoverable>
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">
          Gradient Hover
        </div>
        <p style="margin: 0; color: #6b7280;">
          Gradient intensifies with expanded color shadow glow.
        </p>
      </mac-card>
    </div>
  `,
}

export const ClickableCards: Story = {
  render: (_args) => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;"
    >
      <mac-card variant="elevated" clickable hoverable>
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">
          Clickable Card
        </div>
        <p style="margin: 0 0 12px 0; color: #6b7280;">
          Click to see the press effect (scale 0.98). Physics-based spring animation.
        </p>
        <div slot="footer" style="font-size: 13px; color: #9ca3af;">
          Focusable with keyboard (Tab) • Focus ring on focus-visible
        </div>
      </mac-card>

      <mac-card variant="gradient" clickable hoverable>
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">
          Interactive Card
        </div>
        <p style="margin: 0 0 12px 0; color: #6b7280;">
          Combines hover lift, click press, and focus states for accessibility.
        </p>
        <div slot="footer" style="font-size: 13px; color: #9ca3af;">
          Optimized for touch devices • Reduced transforms on mobile
        </div>
      </mac-card>
    </div>
  `,
}

export const AccentBorders: Story = {
  render: (_args) => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;"
    >
      <mac-card variant="default" accent="top" hoverable>
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">
          Top Accent
        </div>
        <p style="margin: 0 0 12px 0; color: #6b7280;">
          Tricolor gradient accent (Blue → Purple → Pink) at the top edge.
        </p>
        <p style="margin: 0; color: #9ca3af; font-size: 13px;">3px height with rounded corners</p>
      </mac-card>

      <mac-card variant="elevated" accent="left" hoverable>
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">
          Left Accent
        </div>
        <p style="margin: 0 0 12px 0; color: #6b7280;">
          Vertical gradient accent running from top to bottom on left side.
        </p>
        <p style="margin: 0; color: #9ca3af; font-size: 13px;">3px width with rounded corners</p>
      </mac-card>

      <mac-card variant="outlined" accent="top" hoverable>
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">
          Outlined + Accent
        </div>
        <p style="margin: 0 0 12px 0; color: #6b7280;">
          Outlined variant with gradient accent creates a striking visual contrast.
        </p>
        <p style="margin: 0; color: #9ca3af; font-size: 13px;">
          Best for highlighting featured content
        </p>
      </mac-card>

      <mac-card variant="gradient" accent="left" hoverable>
        <div slot="header" style="font-weight: 600; font-size: 16px; color: #1f2937;">
          Gradient + Accent
        </div>
        <p style="margin: 0 0 12px 0; color: #6b7280;">
          Combines gradient background with accent border for premium look.
        </p>
        <p style="margin: 0; color: #9ca3af; font-size: 13px;">Perfect for dashboard widgets</p>
      </mac-card>
    </div>
  `,
}

export const LoadingState: Story = {
  render: (_args) => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;"
    >
      <mac-card variant="default" loading>
        <div slot="header" style="font-weight: 600; font-size: 16px;">Loading Header</div>
        <p style="margin: 0 0 12px 0; color: #6b7280;">
          Content is loading with shimmer animation...
        </p>
        <div slot="footer">Footer loading...</div>
      </mac-card>

      <mac-card variant="elevated" loading>
        <div slot="header" style="font-weight: 600; font-size: 16px;">Loading Header</div>
        <p style="margin: 0 0 12px 0; color: #6b7280;">
          Elevated card shimmer effect (1.8s duration).
        </p>
        <div slot="footer">Footer loading...</div>
      </mac-card>

      <mac-card variant="gradient" loading>
        <div slot="header" style="font-weight: 600; font-size: 16px;">Loading Header</div>
        <p style="margin: 0 0 12px 0; color: #6b7280;">
          Gradient variant with loading shimmer overlay.
        </p>
        <div slot="footer">Footer loading...</div>
      </mac-card>
    </div>
    <p style="margin-top: 16px; color: #9ca3af; font-size: 13px;">
      Enhanced shimmer animation with 5-stop gradient for smoother loading indication.
    </p>
  `,
}

export const CompleteCard: Story = {
  render: (_args) => html`
    <mac-card variant="elevated" hoverable clickable mediaRatio="16-9" style="max-width: 500px;">
      <img
        slot="media"
        src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800"
        alt="Computer screen"
        style="width: 100%; height: 100%; object-fit: cover;"
      />
      <div slot="header" style="font-weight: 600; font-size: 18px; color: #1f2937;">
        Complete Card Example
      </div>
      <p style="margin: 0 0 12px 0; color: #6b7280; line-height: 1.6;">
        This is a complete card with all sections: media, header, body, and footer. It showcases the
        refined typography hierarchy, smooth transitions, and enhanced visual depth.
      </p>
      <p style="margin: 0 0 12px 0; color: #9ca3af; font-size: 13px;">
        Hover to see lift effect • Click for press animation • Tab for focus ring
      </p>
      <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
        <mac-button variant="secondary" size="sm">Cancel</mac-button>
        <mac-button variant="primary" size="sm">Learn More</mac-button>
      </div>
    </mac-card>
  `,
}

export const DashboardCards: Story = {
  render: (_args) => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;"
    >
      <mac-card variant="gradient" hoverable>
        <div style="display: flex; align-items: center; gap: 16px;">
          <div
            style="width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, #007aff, #5856d6); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; box-shadow: 0 4px 12px rgba(0, 122, 255, 0.25);"
          >
            📊
          </div>
          <div>
            <div style="font-size: 13px; color: #6b7280; margin-bottom: 4px;">Total Views</div>
            <div style="font-size: 28px; font-weight: 700; color: #1f2937; letter-spacing: -0.5px;">
              24,589
            </div>
          </div>
        </div>
      </mac-card>

      <mac-card variant="elevated" hoverable>
        <div style="display: flex; align-items: center; gap: 16px;">
          <div
            style="width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, #34c759, #30d158); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; box-shadow: 0 4px 12px rgba(52, 199, 89, 0.25);"
          >
            💰
          </div>
          <div>
            <div style="font-size: 13px; color: #6b7280; margin-bottom: 4px;">Revenue</div>
            <div style="font-size: 28px; font-weight: 700; color: #1f2937; letter-spacing: -0.5px;">
              $12,345
            </div>
          </div>
        </div>
      </mac-card>

      <mac-card variant="glass" hoverable>
        <div style="display: flex; align-items: center; gap: 16px;">
          <div
            style="width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, #ff9500, #ff6b00); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; box-shadow: 0 4px 12px rgba(255, 149, 0, 0.25);"
          >
            👥
          </div>
          <div>
            <div style="font-size: 13px; color: #6b7280; margin-bottom: 4px;">New Users</div>
            <div style="font-size: 28px; font-weight: 700; color: #1f2937; letter-spacing: -0.5px;">
              1,234
            </div>
          </div>
        </div>
      </mac-card>

      <mac-card variant="outlined" hoverable accent="top">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div
            style="width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, #ff3b30, #ff2d55); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; box-shadow: 0 4px 12px rgba(255, 59, 48, 0.25);"
          >
            📈
          </div>
          <div>
            <div style="font-size: 13px; color: #6b7280; margin-bottom: 4px;">Growth</div>
            <div style="font-size: 28px; font-weight: 700; color: #1f2937; letter-spacing: -0.5px;">
              +23.5%
            </div>
          </div>
        </div>
      </mac-card>
    </div>
  `,
}
