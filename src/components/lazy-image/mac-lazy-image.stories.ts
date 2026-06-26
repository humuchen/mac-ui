import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-lazy-image'

const meta: Meta = {
  title: 'Components/LazyImage',
  component: 'mac-lazy-image',
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'The image source URL',
    },
    alt: {
      control: 'text',
      description: 'The image alt text',
    },
    width: {
      control: 'text',
      description: 'Image width',
    },
    height: {
      control: 'text',
      description: 'Image height',
    },
    objectFit: {
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
      description: 'CSS object-fit value',
      table: { defaultValue: { summary: 'cover' } },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder image URL',
    },
    rootMargin: {
      control: 'text',
      description: 'IntersectionObserver rootMargin',
      table: { defaultValue: { summary: '0px' } },
    },
    threshold: {
      control: 'number',
      description: 'IntersectionObserver threshold',
      table: { defaultValue: { summary: '0' } },
    },
    preview: {
      control: 'boolean',
      description: 'Enable click-to-preview',
      table: { defaultValue: { summary: 'false' } },
    },
    previewSrc: {
      control: 'text',
      description: 'Custom preview image URL (falls back to src)',
    },
  },
  args: {
    src: 'https://picsum.photos/400/300?random=1',
    alt: 'Lazy loaded image',
    width: '400px',
    height: '300px',
    objectFit: 'cover',
    rootMargin: '0px',
    threshold: 0,
    preview: false,
    previewSrc: '',
  },
}

export default meta
type Story = StoryObj

export const Basic: Story = {
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <p>Scroll down to see lazy loading in action:</p>
      <div
        style="height: 600px; display: flex; align-items: center; justify-content: center; background: var(--md-color-bg-secondary); border-radius: 8px;"
      >
        <span style="color: var(--md-color-text-secondary);">Scroll down ↓</span>
      </div>
      <mac-lazy-image
        .src=${args.src}
        alt=${args.alt}
        width=${args.width}
        height=${args.height}
        object-fit=${args.objectFit}
        root-margin=${args.rootMargin}
        .threshold=${args.threshold}
      ></mac-lazy-image>
    </div>
  `,
}

export const WithPlaceholderImage: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <p>With a low-res placeholder image:</p>
      <div
        style="height: 400px; display: flex; align-items: center; justify-content: center; background: var(--md-color-bg-secondary); border-radius: 8px;"
      >
        <span style="color: var(--md-color-text-secondary);">Scroll down ↓</span>
      </div>
      <mac-lazy-image
        src="https://picsum.photos/400/300?random=2"
        alt="Image with placeholder"
        width="400px"
        height="300px"
        placeholder="https://picsum.photos/40/30?random=2"
      ></mac-lazy-image>
    </div>
  `,
}

export const WithCustomPlaceholder: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <p>With custom placeholder slot:</p>
      <div
        style="height: 400px; display: flex; align-items: center; justify-content: center; background: var(--md-color-bg-secondary); border-radius: 8px;"
      >
        <span style="color: var(--md-color-text-secondary);">Scroll down ↓</span>
      </div>
      <mac-lazy-image
        src="https://picsum.photos/400/300?random=3"
        alt="Image with custom placeholder"
        width="400px"
        height="300px"
      >
        <div
          slot="placeholder"
          style="display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--md-color-text-secondary);"
        >
          <span>Loading...</span>
        </div>
      </mac-lazy-image>
    </div>
  `,
}

export const ErrorState: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px;">
      <mac-lazy-image
        src="https://invalid-url.example/broken.jpg"
        alt="Broken image"
        width="200px"
        height="150px"
      ></mac-lazy-image>
      <mac-lazy-image
        src="https://invalid-url.example/broken.jpg"
        alt="Broken image with custom error"
        width="200px"
        height="150px"
      >
        <div
          slot="error"
          style="display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--md-color-danger);"
        >
          <span>Failed to load</span>
        </div>
      </mac-lazy-image>
    </div>
  `,
}

export const Gallery: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
      ${Array.from(
        { length: 9 },
        (_, i) => html`
          <mac-lazy-image
            src="https://picsum.photos/300/200?random=${i + 10}"
            alt="Gallery image ${i + 1}"
            width="100%"
            height="200px"
            object-fit="cover"
          ></mac-lazy-image>
        `,
      )}
    </div>
  `,
}

export const ObjectFitVariants: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      ${['cover', 'contain', 'fill', 'none', 'scale-down'].map(
        (fit) => html`
          <div style="text-align: center;">
            <mac-lazy-image
              src="https://picsum.photos/400/300?random=20"
              alt="Object fit ${fit}"
              width="150px"
              height="150px"
              .objectFit=${fit as 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'}
              style="border: 1px solid var(--md-color-border); border-radius: var(--md-radius-md);"
            ></mac-lazy-image>
            <p style="margin: 8px 0 0; font-size: 12px; color: var(--md-color-text-secondary);">
              ${fit}
            </p>
          </div>
        `,
      )}
    </div>
  `,
}

export const WithPreview: Story = {
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <p>Click the image to open preview:</p>
      <mac-lazy-image
        .src=${args.src}
        alt=${args.alt}
        width=${args.width}
        height=${args.height}
        object-fit=${args.objectFit}
        .preview=${true}
      ></mac-lazy-image>
    </div>
  `,
}

export const WithCustomPreviewImage: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <p>Click to preview a larger image:</p>
      <mac-lazy-image
        src="https://picsum.photos/400/300?random=50"
        alt="Thumbnail"
        width="200px"
        height="150px"
        object-fit="cover"
        .preview=${true}
        preview-src="https://picsum.photos/1200/800?random=50"
      ></mac-lazy-image>
    </div>
  `,
}

export const WithHoverAnimation: Story = {
  render: () => html`
    <div style="display: flex; gap: 24px; flex-wrap: wrap;">
      <div style="text-align: center;">
        <p style="margin: 0 0 8px; font-size: 12px; color: var(--md-color-text-secondary);">
          Default scale hover
        </p>
        <mac-lazy-image
          src="https://picsum.photos/300/200?random=60"
          alt="Scale hover"
          width="200px"
          height="150px"
          .preview=${true}
        ></mac-lazy-image>
      </div>
      <div style="text-align: center;">
        <p style="margin: 0 0 8px; font-size: 12px; color: var(--md-color-text-secondary);">
          Custom brightness hover
        </p>
        <mac-lazy-image
          src="https://picsum.photos/300/200?random=61"
          alt="Brightness hover"
          width="200px"
          height="150px"
          .preview=${true}
          style="--md-lazy-image-hover-scale: 1.0; --md-lazy-image-hover-filter: brightness(1.15);"
        ></mac-lazy-image>
      </div>
      <div style="text-align: center;">
        <p style="margin: 0 0 8px; font-size: 12px; color: var(--md-color-text-secondary);">
          Larger scale + faster
        </p>
        <mac-lazy-image
          src="https://picsum.photos/300/200?random=62"
          alt="Large scale hover"
          width="200px"
          height="150px"
          .preview=${true}
          style="--md-lazy-image-hover-scale: 1.15; --md-lazy-image-hover-duration: 150ms;"
        ></mac-lazy-image>
      </div>
    </div>
  `,
}

export const GalleryWithPreview: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
      ${Array.from(
        { length: 6 },
        (_, i) => html`
          <mac-lazy-image
            src="https://picsum.photos/300/200?random=${i + 70}"
            alt="Gallery image ${i + 1}"
            width="100%"
            height="200px"
            object-fit="cover"
            .preview=${true}
            preview-src="https://picsum.photos/1200/800?random=${i + 70}"
            style="border-radius: var(--md-radius-md);"
          ></mac-lazy-image>
        `,
      )}
    </div>
  `,
}
