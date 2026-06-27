import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-input'

const meta: Meta = {
  title: 'Components/Input',
  component: 'mac-input',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The input value',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url'],
      description: 'Input type',
      table: { defaultValue: { summary: 'text' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input size',
      table: { defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'glass', 'underline'],
      description: 'Visual variant',
      table: { defaultValue: { summary: 'default' } },
    },
    label: {
      control: 'text',
      description: 'Input label',
    },
    required: {
      control: 'boolean',
      description: 'Shows required indicator',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    readonly: {
      control: 'boolean',
      description: 'Makes the input read-only',
    },
    error: {
      control: 'boolean',
      description: 'Error state',
    },
    success: {
      control: 'boolean',
      description: 'Success state',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below the input',
    },
    name: {
      control: 'text',
      description: 'Input name (for forms)',
    },
    clearable: {
      control: 'boolean',
      description: 'Shows a clear button',
    },
    showPasswordToggle: {
      control: 'boolean',
      description: 'Shows password toggle button',
    },
    showCharCounter: {
      control: 'boolean',
      description: 'Shows character counter',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character length',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading state',
    },
    floating: {
      control: 'boolean',
      description: 'Enables floating label',
    },
  },
  args: {
    value: '',
    placeholder: 'Enter text...',
    type: 'text',
    size: 'md',
    variant: 'default',
    label: '',
    required: false,
    disabled: false,
    readonly: false,
    error: false,
    success: false,
    helperText: '',
    name: '',
    clearable: false,
    showPasswordToggle: false,
    showCharCounter: false,
    loading: false,
    floating: false,
  },
}

export default meta
type Story = StoryObj

export const Basic: Story = {
  render: (args) => html`
    <mac-input
      .value=${args.value}
      placeholder=${args.placeholder}
      type=${args.type}
      size=${args.size}
      variant=${args.variant}
      label=${args.label}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?error=${args.error}
      ?success=${args.success}
      helper-text=${args.helperText}
      name=${args.name}
      ?clearable=${args.clearable}
      ?show-password-toggle=${args.showPasswordToggle}
      ?show-char-counter=${args.showCharCounter}
      max-length=${args.maxLength || ''}
      ?loading=${args.loading}
      ?floating=${args.floating}
    ></mac-input>
  `,
}

export const Variants: Story = {
  args: { variant: 'default' },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
      <mac-input
        variant="default"
        label="Default"
        placeholder="Default variant"
        .value=${args.value}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        variant="filled"
        label="Filled"
        placeholder="Filled variant"
        .value=${args.value}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        variant="glass"
        label="Glass"
        placeholder="Glass variant"
        .value=${args.value}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        variant="underline"
        label="Underline"
        placeholder="Underline variant"
        .value=${args.value}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
    </div>
  `,
}

export const Sizes: Story = {
  args: { size: 'md' },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <mac-input
        size="sm"
        label="Small"
        placeholder="Small input"
        .value=${args.value}
        type=${args.type}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        size="md"
        label="Medium"
        placeholder="Medium input"
        .value=${args.value}
        type=${args.type}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        size="lg"
        label="Large"
        placeholder="Large input"
        .value=${args.value}
        type=${args.type}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
    </div>
  `,
}

export const States: Story = {
  args: { error: false, success: false, disabled: false, readonly: false },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <mac-input
        label="Normal"
        placeholder="Normal state"
        .value=${args.value}
        type=${args.type}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        label="Error"
        error
        placeholder="Error state"
        helper-text="This field has an error"
        .value=${args.value}
        type=${args.type}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        label="Success"
        success
        placeholder="Success state"
        helper-text="Looks good!"
        .value=${args.value}
        type=${args.type}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        label="Disabled"
        disabled
        placeholder="Disabled state"
        value="Cannot edit"
        .value=${args.value}
        type=${args.type}
        size=${args.size}
        variant=${args.variant}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        label="Read Only"
        readonly
        placeholder="Read only state"
        value="Read only content"
        .value=${args.value}
        type=${args.type}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
    </div>
  `,
}

export const WithLabel: Story = {
  args: { label: 'Username' },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <mac-input
        label="Username"
        placeholder="Enter username"
        .value=${args.value}
        type=${args.type}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        label="Email"
        required
        placeholder="you@example.com"
        .value=${args.value}
        type=${args.type}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        label="Password"
        type="password"
        helper-text="Must be at least 8 characters"
        .value=${args.value}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
    </div>
  `,
}

export const FloatingLabel: Story = {
  args: { floating: true },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <mac-input
        floating
        label="Username"
        placeholder=" "
        .value=${args.value}
        type=${args.type}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
      ></mac-input>
      <mac-input
        floating
        label="Email"
        required
        placeholder=" "
        .value=${args.value}
        type=${args.type}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
      ></mac-input>
      <mac-input
        floating
        label="Password"
        type="password"
        placeholder=" "
        .value=${args.value}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
      ></mac-input>
    </div>
  `,
}

export const Clearable: Story = {
  args: { clearable: true, value: 'Type something...' },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <mac-input
        label="Clearable Input"
        clearable
        value="Type something..."
        placeholder="Enter text"
        .value=${args.value}
        type=${args.type}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        variant="filled"
        label="Filled Clearable"
        clearable
        value="Clearable content"
        placeholder="Enter text"
        .value=${args.value}
        type=${args.type}
        size=${args.size}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
    </div>
  `,
}

export const PasswordToggle: Story = {
  args: { showPasswordToggle: true },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <mac-input
        label="Password"
        type="password"
        show-password-toggle
        placeholder="Enter password"
        .value=${args.value}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        label="Confirm Password"
        type="password"
        show-password-toggle
        show-char-counter
        max-length="20"
        placeholder="Confirm password"
        .value=${args.value}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
    </div>
  `,
}

export const CharacterCounter: Story = {
  args: { showCharCounter: true, maxLength: 50 },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <mac-input
        label="Bio"
        show-char-counter
        max-length="50"
        placeholder="Tell us about yourself"
        value="I am a software developer"
        .value=${args.value}
        type=${args.type}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        label="Tweet"
        show-char-counter
        max-length="280"
        placeholder="What's happening?"
        value="Just shipped a new feature! 🚀"
        .value=${args.value}
        type=${args.type}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
    </div>
  `,
}

export const Loading: Story = {
  args: { loading: true },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <mac-input
        label="Loading"
        loading
        placeholder="Validating..."
        .value=${args.value}
        type=${args.type}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        label="Checking Username"
        loading
        value="john_doe"
        helper-text="Checking availability..."
        .value=${args.value}
        type=${args.type}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?floating=${args.floating}
      ></mac-input>
    </div>
  `,
}

export const WithIcons: Story = {
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <mac-input
        label="Search"
        placeholder="Search..."
        .value=${args.value}
        type=${args.type}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      >
        <span slot="prefix">🔍</span>
      </mac-input>
      <mac-input
        label="Email"
        type="email"
        placeholder="you@example.com"
        .value=${args.value}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      >
        <span slot="prefix">📧</span>
      </mac-input>
      <mac-input
        label="Website"
        type="url"
        placeholder="https://example.com"
        .value=${args.value}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      >
        <span slot="prefix">🌐</span>
        <span slot="suffix">🔗</span>
      </mac-input>
    </div>
  `,
}

export const InputTypes: Story = {
  args: { type: 'text' },
  render: (args) => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <mac-input
        label="Text"
        type="text"
        placeholder="Text input"
        .value=${args.value}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        label="Email"
        type="email"
        placeholder="email@example.com"
        .value=${args.value}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        label="Number"
        type="number"
        placeholder="123"
        .value=${args.value}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        label="Tel"
        type="tel"
        placeholder="+1 (555) 123-4567"
        .value=${args.value}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
      <mac-input
        label="URL"
        type="url"
        placeholder="https://example.com"
        .value=${args.value}
        size=${args.size}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?error=${args.error}
        ?success=${args.success}
        ?required=${args.required}
        ?clearable=${args.clearable}
        ?show-password-toggle=${args.showPasswordToggle}
        ?show-char-counter=${args.showCharCounter}
        ?loading=${args.loading}
        ?floating=${args.floating}
      ></mac-input>
    </div>
  `,
}

export const CompleteExample: Story = {
  render: (args) => html`
    <div style="max-width: 400px;">
      <form style="display: flex; flex-direction: column; gap: 20px;">
        <mac-input
          floating
          label="Full Name"
          required
          placeholder=" "
          clearable
          .value=${args.value}
          type=${args.type}
          size=${args.size}
          variant=${args.variant}
          ?disabled=${args.disabled}
          ?readonly=${args.readonly}
          ?error=${args.error}
          ?success=${args.success}
          ?show-password-toggle=${args.showPasswordToggle}
          ?show-char-counter=${args.showCharCounter}
          ?loading=${args.loading}
        ></mac-input>

        <mac-input
          floating
          label="Email Address"
          type="email"
          required
          placeholder=" "
          helper-text="We'll never share your email"
          .value=${args.value}
          size=${args.size}
          variant=${args.variant}
          ?disabled=${args.disabled}
          ?readonly=${args.readonly}
          ?error=${args.error}
          ?success=${args.success}
          ?clearable=${args.clearable}
          ?show-password-toggle=${args.showPasswordToggle}
          ?show-char-counter=${args.showCharCounter}
          ?loading=${args.loading}
        ></mac-input>

        <mac-input
          floating
          label="Password"
          type="password"
          required
          show-password-toggle
          show-char-counter
          max-length="20"
          placeholder=" "
          helper-text="At least 8 characters"
          .value=${args.value}
          size=${args.size}
          variant=${args.variant}
          ?disabled=${args.disabled}
          ?readonly=${args.readonly}
          ?error=${args.error}
          ?success=${args.success}
          ?clearable=${args.clearable}
          ?loading=${args.loading}
        ></mac-input>

        <mac-input
          floating
          label="Bio"
          placeholder=" "
          show-char-counter
          max-length="100"
          helper-text="Tell us about yourself"
          .value=${args.value}
          type=${args.type}
          size=${args.size}
          variant=${args.variant}
          ?disabled=${args.disabled}
          ?readonly=${args.readonly}
          ?error=${args.error}
          ?success=${args.success}
          ?required=${args.required}
          ?clearable=${args.clearable}
          ?show-password-toggle=${args.showPasswordToggle}
          ?loading=${args.loading}
        ></mac-input>
      </form>
    </div>
  `,
}

export const GlassInputs: Story = {
  args: { variant: 'glass' },
  render: (args) => html`
    <div
      style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px; border-radius: 16px;"
    >
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <mac-input
          variant="glass"
          label="Username"
          placeholder="Enter username"
          .value=${args.value}
          type=${args.type}
          size=${args.size}
          ?disabled=${args.disabled}
          ?readonly=${args.readonly}
          ?error=${args.error}
          ?success=${args.success}
          ?required=${args.required}
          ?clearable=${args.clearable}
          ?show-password-toggle=${args.showPasswordToggle}
          ?show-char-counter=${args.showCharCounter}
          ?loading=${args.loading}
          ?floating=${args.floating}
        ></mac-input>
        <mac-input
          variant="glass"
          label="Password"
          type="password"
          placeholder="Enter password"
          .value=${args.value}
          size=${args.size}
          ?disabled=${args.disabled}
          ?readonly=${args.readonly}
          ?error=${args.error}
          ?success=${args.success}
          ?required=${args.required}
          ?clearable=${args.clearable}
          ?show-password-toggle=${args.showPasswordToggle}
          ?show-char-counter=${args.showCharCounter}
          ?loading=${args.loading}
          ?floating=${args.floating}
        ></mac-input>
        <mac-input
          variant="glass"
          label="Email"
          type="email"
          placeholder="you@example.com"
          .value=${args.value}
          size=${args.size}
          ?disabled=${args.disabled}
          ?readonly=${args.readonly}
          ?error=${args.error}
          ?success=${args.success}
          ?required=${args.required}
          ?clearable=${args.clearable}
          ?show-password-toggle=${args.showPasswordToggle}
          ?show-char-counter=${args.showCharCounter}
          ?loading=${args.loading}
          ?floating=${args.floating}
        ></mac-input>
      </div>
    </div>
  `,
}
