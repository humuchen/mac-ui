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
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: (args) => html`
    <mac-card
      variant=${args.variant}
      ?hoverable=${args.hoverable}
      ?clickable=${args.clickable}
      ?loading=${args.loading}
      accent=${args.accent || ''}
      mediaRatio=${args.mediaRatio || ''}
    >
      This is a basic card with some content inside. It can contain any type of content including
      text, images, and other components.
    </mac-card>
  `,
}

export const Variants: Story = {
  render: (args) => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;"
    >
      <mac-card
        variant="default"
        hoverable=${args.hoverable}
        clickable=${args.clickable}
        loading=${args.loading}
      >
        <div slot="header" style="font-weight: 600; font-size: 16px;">Default</div>
        Standard card with subtle border and shadow.
      </mac-card>

      <mac-card
        variant="elevated"
        hoverable=${args.hoverable}
        clickable=${args.clickable}
        loading=${args.loading}
      >
        <div slot="header" style="font-weight: 600; font-size: 16px;">Elevated</div>
        Card with elevated shadow, no border.
      </mac-card>

      <mac-card
        variant="glass"
        hoverable=${args.hoverable}
        clickable=${args.clickable}
        loading=${args.loading}
      >
        <div slot="header" style="font-weight: 600; font-size: 16px;">Glass</div>
        Frosted glass effect with blur.
      </mac-card>

      <mac-card
        variant="outlined"
        hoverable=${args.hoverable}
        clickable=${args.clickable}
        loading=${args.loading}
      >
        <div slot="header" style="font-weight: 600; font-size: 16px;">Outlined</div>
        Transparent background with visible border.
      </mac-card>

      <mac-card
        variant="gradient"
        hoverable=${args.hoverable}
        clickable=${args.clickable}
        loading=${args.loading}
      >
        <div slot="header" style="font-weight: 600; font-size: 16px;">Gradient</div>
        Subtle gradient background effect.
      </mac-card>
    </div>
  `,
}

export const WithMedia: Story = {
  render: (args) => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;"
    >
      <mac-card
        variant="elevated"
        mediaRatio="16-9"
        hoverable=${args.hoverable}
        clickable=${args.clickable}
        loading=${args.loading}
      >
        <img
          slot="media"
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800"
          alt="Code on screen"
          style="width: 100%; height: 100%; object-fit: cover;"
        />
        <div slot="header" style="font-weight: 600; font-size: 16px;">Technology</div>
        <p style="margin: 0; color: #666;">
          A beautiful image card with 16:9 aspect ratio media section.
        </p>
      </mac-card>

      <mac-card
        variant="gradient"
        mediaRatio="4-3"
        hoverable=${args.hoverable}
        clickable=${args.clickable}
        loading=${args.loading}
      >
        <img
          slot="media"
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"
          alt="Laptop on desk"
          style="width: 100%; height: 100%; object-fit: cover;"
        />
        <div slot="header" style="font-weight: 600; font-size: 16px;">Workspace</div>
        <p style="margin: 0; color: #666;">
          A card with 4:3 aspect ratio media and gradient background.
        </p>
      </mac-card>
    </div>
  `,
}

export const HoverableCards: Story = {
  args: { hoverable: true },
  render: (args) => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;"
    >
      <mac-card
        variant="default"
        ?hoverable=${args.hoverable}
        ?clickable=${args.clickable}
        ?loading=${args.loading}
      >
        <div slot="header" style="font-weight: 600;">Default Hover</div>
        Hover to see the lift effect.
      </mac-card>

      <mac-card
        variant="elevated"
        ?hoverable=${args.hoverable}
        ?clickable=${args.clickable}
        ?loading=${args.loading}
      >
        <div slot="header" style="font-weight: 600;">Elevated Hover</div>
        Elevated card with hover animation.
      </mac-card>

      <mac-card
        variant="glass"
        ?hoverable=${args.hoverable}
        ?clickable=${args.clickable}
        ?loading=${args.loading}
      >
        <div slot="header" style="font-weight: 600;">Glass Hover</div>
        Glass card with enhanced blur on hover.
      </mac-card>

      <mac-card
        variant="gradient"
        ?hoverable=${args.hoverable}
        ?clickable=${args.clickable}
        ?loading=${args.loading}
      >
        <div slot="header" style="font-weight: 600;">Gradient Hover</div>
        Gradient card with intensified colors on hover.
      </mac-card>
    </div>
  `,
}

export const ClickableCards: Story = {
  args: { clickable: true, hoverable: true },
  render: (args) => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;"
    >
      <mac-card
        variant="elevated"
        ?clickable=${args.clickable}
        ?hoverable=${args.hoverable}
        ?loading=${args.loading}
      >
        <div slot="header" style="font-weight: 600;">Clickable Card</div>
        <p style="margin: 0; color: #666;">
          This card is clickable. Click to see the press effect.
        </p>
      </mac-card>

      <mac-card
        variant="gradient"
        ?clickable=${args.clickable}
        ?hoverable=${args.hoverable}
        ?loading=${args.loading}
      >
        <div slot="header" style="font-weight: 600;">Interactive Card</div>
        <p style="margin: 0; color: #666;">Combines hover and click interactions for better UX.</p>
      </mac-card>
    </div>
  `,
}

export const AccentBorders: Story = {
  render: (args) => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;"
    >
      <mac-card
        variant="default"
        accent="top"
        hoverable=${args.hoverable}
        clickable=${args.clickable}
        loading=${args.loading}
      >
        <div slot="header" style="font-weight: 600; font-size: 16px;">Top Accent</div>
        Card with a gradient accent border at the top.
      </mac-card>

      <mac-card
        variant="elevated"
        accent="left"
        hoverable=${args.hoverable}
        clickable=${args.clickable}
        loading=${args.loading}
      >
        <div slot="header" style="font-weight: 600; font-size: 16px;">Left Accent</div>
        Card with a gradient accent border on the left side.
      </mac-card>

      <mac-card
        variant="outlined"
        accent="top"
        hoverable=${args.hoverable}
        clickable=${args.clickable}
        loading=${args.loading}
      >
        <div slot="header" style="font-weight: 600; font-size: 16px;">Outlined + Accent</div>
        Outlined card with top accent border.
      </mac-card>
    </div>
  `,
}

export const LoadingState: Story = {
  args: { loading: true },
  render: (args) => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;"
    >
      <mac-card
        variant="default"
        ?loading=${args.loading}
        ?hoverable=${args.hoverable}
        ?clickable=${args.clickable}
      >
        <div slot="header">Loading Header</div>
        This content is loading...
      </mac-card>

      <mac-card
        variant="elevated"
        ?loading=${args.loading}
        ?hoverable=${args.hoverable}
        ?clickable=${args.clickable}
      >
        <div slot="header">Loading Header</div>
        This content is loading...
      </mac-card>
    </div>
  `,
}

export const CompleteCard: Story = {
  render: (args) => html`
    <mac-card
      variant="elevated"
      hoverable=${args.hoverable}
      clickable=${args.clickable}
      loading=${args.loading}
      mediaRatio="16-9"
    >
      <img
        slot="media"
        src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800"
        alt="Computer screen"
        style="width: 100%; height: 100%; object-fit: cover;"
      />
      <div slot="header" style="font-weight: 600; font-size: 18px;">Complete Card Example</div>
      <p style="margin: 0 0 12px 0; color: #666; line-height: 1.6;">
        This is a complete card example with all sections: media, header, body, and footer. It
        demonstrates how all the pieces work together to create a cohesive card component.
      </p>
      <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end;">
        <mac-button variant="secondary" size="sm">Cancel</mac-button>
        <mac-button variant="primary" size="sm">Learn More</mac-button>
      </div>
    </mac-card>
  `,
}

export const DashboardCards: Story = {
  render: (args) => html`
    <div
      style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;"
    >
      <mac-card
        variant="gradient"
        hoverable=${args.hoverable}
        clickable=${args.clickable}
        loading=${args.loading}
      >
        <div style="display: flex; align-items: center; gap: 12px;">
          <div
            style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #007aff, #5856d6); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;"
          >
            📊
          </div>
          <div>
            <div style="font-size: 14px; color: #666;">Total Views</div>
            <div style="font-size: 24px; font-weight: 600;">24,589</div>
          </div>
        </div>
      </mac-card>

      <mac-card
        variant="elevated"
        hoverable=${args.hoverable}
        clickable=${args.clickable}
        loading=${args.loading}
      >
        <div style="display: flex; align-items: center; gap: 12px;">
          <div
            style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #34c759, #30d158); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;"
          >
            💰
          </div>
          <div>
            <div style="font-size: 14px; color: #666;">Revenue</div>
            <div style="font-size: 24px; font-weight: 600;">$12,345</div>
          </div>
        </div>
      </mac-card>

      <mac-card
        variant="glass"
        hoverable=${args.hoverable}
        clickable=${args.clickable}
        loading=${args.loading}
      >
        <div style="display: flex; align-items: center; gap: 12px;">
          <div
            style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #ff9500, #ff6b00); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;"
          >
            👥
          </div>
          <div>
            <div style="font-size: 14px; color: #666;">New Users</div>
            <div style="font-size: 24px; font-weight: 600;">1,234</div>
          </div>
        </div>
      </mac-card>

      <mac-card
        variant="outlined"
        hoverable=${args.hoverable}
        clickable=${args.clickable}
        loading=${args.loading}
      >
        <div style="display: flex; align-items: center; gap: 12px;">
          <div
            style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #ff3b30, #ff2d55); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;"
          >
            📈
          </div>
          <div>
            <div style="font-size: 14px; color: #666;">Growth</div>
            <div style="font-size: 24px; font-weight: 600;">+23.5%</div>
          </div>
        </div>
      </mac-card>
    </div>
  `,
}
