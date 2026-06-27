import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-carousel'

const carouselStyles = html`
  <style>
    .demo-slide {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 300px;
      font-size: 48px;
      font-weight: 600;
      color: #fff;
      border-radius: var(--md-radius-lg);
    }
    .demo-slide--1 {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .demo-slide--2 {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    .demo-slide--3 {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    .demo-slide--4 {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }
    .demo-slide--5 {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }
  </style>
`

const meta: Meta = {
  title: 'Components/Carousel',
  component: 'mac-carousel',
  tags: ['autodocs'],
  argTypes: {
    currentIndex: {
      control: 'number',
      description: 'Current active slide index (controlled)',
    },
    defaultIndex: {
      control: 'number',
      description: 'Default active slide index',
    },
    autoplay: {
      control: 'boolean',
      description: 'Whether to autoplay',
    },
    interval: {
      control: 'number',
      description: 'Autoplay interval in ms',
    },
    loop: {
      control: 'boolean',
      description: 'Whether to loop playback',
    },
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Slide direction',
    },
    effect: {
      control: 'select',
      options: ['slide', 'fade', 'custom'],
      description: 'Transition effect',
    },
    slidesPerView: {
      control: 'number',
      description: 'Number of slides per view',
    },
    showArrow: {
      control: 'boolean',
      description: 'Whether to show arrows',
    },
    showDots: {
      control: 'boolean',
      description: 'Whether to show dots',
    },
    dotType: {
      control: 'select',
      options: ['dot', 'line'],
      description: 'Dot indicator style',
    },
    dotPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Position of indicator dots',
    },
    draggable: {
      control: 'boolean',
      description: 'Whether draggable',
    },
    keyboard: {
      control: 'boolean',
      description: 'Whether to support keyboard',
    },
    wheel: {
      control: 'boolean',
      description: 'Whether to support mouse wheel',
    },
    transitionDuration: {
      control: 'number',
      description: 'Transition duration in ms',
    },
  },
  args: {
    currentIndex: 0,
    defaultIndex: 0,
    autoplay: false,
    interval: 5000,
    loop: true,
    direction: 'horizontal',
    effect: 'slide',
    slidesPerView: 1,
    showArrow: true,
    showDots: true,
    dotType: 'dot',
    dotPosition: 'bottom',
    draggable: false,
    keyboard: false,
    wheel: false,
    transitionDuration: 300,
  },
}

export default meta
type Story = StoryObj

const demoSlides = html`
  <mac-carousel-item><div class="demo-slide demo-slide--1">1</div></mac-carousel-item>
  <mac-carousel-item><div class="demo-slide demo-slide--2">2</div></mac-carousel-item>
  <mac-carousel-item><div class="demo-slide demo-slide--3">3</div></mac-carousel-item>
  <mac-carousel-item><div class="demo-slide demo-slide--4">4</div></mac-carousel-item>
  <mac-carousel-item><div class="demo-slide demo-slide--5">5</div></mac-carousel-item>
`

export const Default: Story = {
  render: (args) => html`
    ${carouselStyles}
    <mac-carousel
      style="width: 100%; max-width: 600px; height: 300px;"
      current-index=${args.currentIndex}
      default-index=${args.defaultIndex}
      ?autoplay=${args.autoplay}
      interval=${args.interval}
      ?loop=${args.loop}
      direction=${args.direction}
      effect=${args.effect}
      slides-per-view=${args.slidesPerView}
      ?show-arrow=${args.showArrow}
      ?show-dots=${args.showDots}
      dot-type=${args.dotType}
      dot-position=${args.dotPosition}
      ?draggable=${args.draggable}
      ?keyboard=${args.keyboard}
      ?wheel=${args.wheel}
      transition-duration=${args.transitionDuration}
    >
      ${demoSlides}
    </mac-carousel>
  `,
}

export const Autoplay: Story = {
  args: { autoplay: true, interval: 3000 },
  render: (args) => html`
    ${carouselStyles}
    <mac-carousel
      style="width: 100%; max-width: 600px; height: 300px;"
      ?autoplay=${args.autoplay}
      interval=${args.interval}
      ?loop=${args.loop}
      direction=${args.direction}
      effect=${args.effect}
      slides-per-view=${args.slidesPerView}
      ?show-arrow=${args.showArrow}
      ?show-dots=${args.showDots}
      dot-type=${args.dotType}
      dot-position=${args.dotPosition}
    >
      ${demoSlides}
    </mac-carousel>
  `,
}

export const Vertical: Story = {
  args: { direction: 'vertical', dotPosition: 'right' },
  render: (args) => html`
    ${carouselStyles}
    <mac-carousel
      style="width: 100%; max-width: 600px; height: 300px;"
      direction=${args.direction}
      dot-position=${args.dotPosition}
      ?loop=${args.loop}
      ?show-arrow=${args.showArrow}
      ?show-dots=${args.showDots}
    >
      ${demoSlides}
    </mac-carousel>
  `,
}

export const FadeEffect: Story = {
  args: { effect: 'fade' },
  render: (args) => html`
    ${carouselStyles}
    <mac-carousel
      style="width: 100%; max-width: 600px; height: 300px;"
      effect=${args.effect}
      ?autoplay=${args.autoplay}
      interval=${args.interval}
      ?loop=${args.loop}
      ?show-arrow=${args.showArrow}
      ?show-dots=${args.showDots}
    >
      ${demoSlides}
    </mac-carousel>
  `,
}

export const SlidesPerView: Story = {
  args: { slidesPerView: 2 },
  render: (args) => html`
    ${carouselStyles}
    <mac-carousel
      style="width: 100%; max-width: 600px; height: 300px;"
      slides-per-view=${args.slidesPerView}
      ?loop=${args.loop}
      ?show-arrow=${args.showArrow}
      ?show-dots=${args.showDots}
    >
      ${demoSlides}
    </mac-carousel>
  `,
}

export const DotPositionLeft: Story = {
  args: { dotPosition: 'left' },
  render: (args) => html`
    ${carouselStyles}
    <mac-carousel
      style="width: 100%; max-width: 600px; height: 300px;"
      dot-position=${args.dotPosition}
      ?show-dots=${args.showDots}
      dot-type=${args.dotType}
    >
      ${demoSlides}
    </mac-carousel>
  `,
}

export const NoLoop: Story = {
  args: { loop: false },
  render: (args) => html`
    ${carouselStyles}
    <mac-carousel
      style="width: 100%; max-width: 600px; height: 300px;"
      ?loop=${args.loop}
      ?show-arrow=${args.showArrow}
      ?show-dots=${args.showDots}
    >
      ${demoSlides}
    </mac-carousel>
  `,
}

export const NoArrows: Story = {
  args: { showArrow: false },
  render: (args) => html`
    ${carouselStyles}
    <mac-carousel
      style="width: 100%; max-width: 600px; height: 300px;"
      ?show-arrow=${args.showArrow}
      ?show-dots=${args.showDots}
      dot-type=${args.dotType}
    >
      ${demoSlides}
    </mac-carousel>
  `,
}

export const NoDots: Story = {
  args: { showDots: false },
  render: (args) => html`
    ${carouselStyles}
    <mac-carousel
      style="width: 100%; max-width: 600px; height: 300px;"
      ?show-arrow=${args.showArrow}
      ?show-dots=${args.showDots}
    >
      ${demoSlides}
    </mac-carousel>
  `,
}

export const LineDots: Story = {
  args: { dotType: 'line' },
  render: (args) => html`
    ${carouselStyles}
    <mac-carousel
      style="width: 100%; max-width: 600px; height: 300px;"
      dot-type=${args.dotType}
      ?show-dots=${args.showDots}
    >
      ${demoSlides}
    </mac-carousel>
  `,
}

export const Draggable: Story = {
  args: { draggable: true },
  render: (args) => html`
    ${carouselStyles}
    <mac-carousel
      style="width: 100%; max-width: 600px; height: 300px;"
      ?draggable=${args.draggable}
      ?loop=${args.loop}
    >
      ${demoSlides}
    </mac-carousel>
  `,
}

export const Keyboard: Story = {
  args: { keyboard: true },
  render: (args) => html`
    ${carouselStyles}
    <mac-carousel
      style="width: 100%; max-width: 600px; height: 300px;"
      ?keyboard=${args.keyboard}
      ?loop=${args.loop}
    >
      ${demoSlides}
    </mac-carousel>
  `,
}

export const Wheel: Story = {
  args: { wheel: true },
  render: (args) => html`
    ${carouselStyles}
    <mac-carousel
      style="width: 100%; max-width: 600px; height: 300px;"
      ?wheel=${args.wheel}
      ?loop=${args.loop}
    >
      ${demoSlides}
    </mac-carousel>
  `,
}
