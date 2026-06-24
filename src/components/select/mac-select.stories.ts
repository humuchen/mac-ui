import type { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit'
import './mac-select'

const meta: Meta = {
  title: 'Components/Select',
  component: 'mac-select',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The select value',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
      table: { defaultValue: { summary: 'Select an option' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Select size',
      table: { defaultValue: { summary: 'md' } },
    },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'glass'],
      description: 'Visual variant',
      table: { defaultValue: { summary: 'default' } },
    },
    label: {
      control: 'text',
      description: 'Select label',
    },
    required: {
      control: 'boolean',
      description: 'Shows required indicator',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the select',
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
      description: 'Helper text below the select',
    },
    multiple: {
      control: 'boolean',
      description: 'Enables multiple selection',
    },
    clearable: {
      control: 'boolean',
      description: 'Shows a clear button',
    },
    searchable: {
      control: 'boolean',
      description: 'Enables search functionality',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading state',
    },
  },
  args: {
    value: '',
    placeholder: 'Select an option',
    size: 'md',
    variant: 'default',
    label: '',
    required: false,
    disabled: false,
    error: false,
    success: false,
    helperText: '',
    multiple: false,
    clearable: false,
    searchable: false,
    loading: false,
  },
}

export default meta
type Story = StoryObj

export const Basic: Story = {
  render: (args) => {
    const options = [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'orange', label: 'Orange' },
      { value: 'grape', label: 'Grape' },
    ]

    return html`
      <mac-select
        .options=${options}
        .value=${args.value}
        placeholder=${args.placeholder}
        size=${args.size}
        variant=${args.variant}
        label=${args.label}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?error=${args.error}
        ?success=${args.success}
        helper-text=${args.helperText}
        ?multiple=${args.multiple}
        ?clearable=${args.clearable}
        ?searchable=${args.searchable}
        ?loading=${args.loading}
      ></mac-select>
    `
  },
}

export const Variants: Story = {
  args: { variant: 'default' },
  render: (args) => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
    ]

    return html`
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <mac-select variant="default" label="Default" .options=${options} .value=${args.value} ?disabled=${args.disabled} ?required=${args.required} ?error=${args.error} ?success=${args.success} ?multiple=${args.multiple} ?clearable=${args.clearable} ?searchable=${args.searchable} ?loading=${args.loading}></mac-select>
        <mac-select variant="filled" label="Filled" .options=${options} .value=${args.value} ?disabled=${args.disabled} ?required=${args.required} ?error=${args.error} ?success=${args.success} ?multiple=${args.multiple} ?clearable=${args.clearable} ?searchable=${args.searchable} ?loading=${args.loading}></mac-select>
        <mac-select variant="glass" label="Glass" .options=${options} .value=${args.value} ?disabled=${args.disabled} ?required=${args.required} ?error=${args.error} ?success=${args.success} ?multiple=${args.multiple} ?clearable=${args.clearable} ?searchable=${args.searchable} ?loading=${args.loading}></mac-select>
      </div>
    `
  },
}

export const Sizes: Story = {
  args: { size: 'md' },
  render: (args) => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ]

    return html`
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <mac-select size="sm" label="Small" .options=${options} .value=${args.value} variant=${args.variant} ?disabled=${args.disabled} ?required=${args.required} ?error=${args.error} ?success=${args.success} ?multiple=${args.multiple} ?clearable=${args.clearable} ?searchable=${args.searchable} ?loading=${args.loading}></mac-select>
        <mac-select size="md" label="Medium" .options=${options} .value=${args.value} variant=${args.variant} ?disabled=${args.disabled} ?required=${args.required} ?error=${args.error} ?success=${args.success} ?multiple=${args.multiple} ?clearable=${args.clearable} ?searchable=${args.searchable} ?loading=${args.loading}></mac-select>
        <mac-select size="lg" label="Large" .options=${options} .value=${args.value} variant=${args.variant} ?disabled=${args.disabled} ?required=${args.required} ?error=${args.error} ?success=${args.success} ?multiple=${args.multiple} ?clearable=${args.clearable} ?searchable=${args.searchable} ?loading=${args.loading}></mac-select>
      </div>
    `
  },
}

export const States: Story = {
  args: { error: false, success: false, disabled: false },
  render: (args) => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ]

    return html`
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <mac-select label="Normal" .options=${options} .value=${args.value} variant=${args.variant} size=${args.size} ?required=${args.required} ?multiple=${args.multiple} ?clearable=${args.clearable} ?searchable=${args.searchable} ?loading=${args.loading}></mac-select>
        <mac-select label="Error" .options=${options} error helper-text="This field has an error" .value=${args.value} variant=${args.variant} size=${args.size} ?disabled=${args.disabled} ?required=${args.required} ?success=${args.success} ?multiple=${args.multiple} ?clearable=${args.clearable} ?searchable=${args.searchable} ?loading=${args.loading}></mac-select>
        <mac-select label="Success" .options=${options} success value="1" helper-text="Looks good!" .value=${args.value} variant=${args.variant} size=${args.size} ?disabled=${args.disabled} ?required=${args.required} ?error=${args.error} ?multiple=${args.multiple} ?clearable=${args.clearable} ?searchable=${args.searchable} ?loading=${args.loading}></mac-select>
        <mac-select label="Disabled" .options=${options} disabled value="1" .value=${args.value} variant=${args.variant} size=${args.size} ?required=${args.required} ?error=${args.error} ?success=${args.success} ?multiple=${args.multiple} ?clearable=${args.clearable} ?searchable=${args.searchable} ?loading=${args.loading}></mac-select>
      </div>
    `
  },
}

export const WithIcons: Story = {
  render: (args) => {
    const options = [
      { value: 'apple', label: 'Apple', icon: '🍎' },
      { value: 'banana', label: 'Banana', icon: '🍌' },
      { value: 'orange', label: 'Orange', icon: '🍊' },
      { value: 'grape', label: 'Grape', icon: '🍇' },
    ]

    return html`
      <mac-select label="Select Fruit" .options=${options} placeholder="Choose a fruit" .value=${args.value} variant=${args.variant} size=${args.size} ?disabled=${args.disabled} ?required=${args.required} ?error=${args.error} ?success=${args.success} ?multiple=${args.multiple} ?clearable=${args.clearable} ?searchable=${args.searchable} ?loading=${args.loading}></mac-select>
    `
  },
}

export const WithDescriptions: Story = {
  render: (args) => {
    const options = [
      {
        value: 'free',
        label: 'Free',
        description: 'Perfect for getting started',
        icon: '🆓',
      },
      {
        value: 'pro',
        label: 'Pro - $9/month',
        description: 'Best for professionals',
        icon: '⭐',
      },
      {
        value: 'enterprise',
        label: 'Enterprise - $29/month',
        description: 'For large teams',
        icon: '🏢',
      },
    ]

    return html`
      <mac-select label="Choose Plan" .options=${options} placeholder="Select a plan" .value=${args.value} variant=${args.variant} size=${args.size} ?disabled=${args.disabled} ?required=${args.required} ?error=${args.error} ?success=${args.success} ?multiple=${args.multiple} ?clearable=${args.clearable} ?searchable=${args.searchable} ?loading=${args.loading}></mac-select>
    `
  },
}

export const Searchable: Story = {
  args: { searchable: true },
  render: (args) => {
    const options = [
      { value: 'af', label: 'Afghanistan' },
      { value: 'al', label: 'Albania' },
      { value: 'dz', label: 'Algeria' },
      { value: 'ad', label: 'Andorra' },
      { value: 'ao', label: 'Angola' },
      { value: 'ag', label: 'Antigua and Barbuda' },
      { value: 'ar', label: 'Argentina' },
      { value: 'am', label: 'Armenia' },
      { value: 'au', label: 'Australia' },
      { value: 'at', label: 'Austria' },
      { value: 'az', label: 'Azerbaijan' },
    ]

    return html`
      <mac-select
        label="Country"
        .options=${options}
        searchable
        search-placeholder="Search countries..."
        placeholder="Select a country"
        .value=${args.value}
        variant=${args.variant}
        size=${args.size}
        ?disabled=${args.disabled}
        ?required=${args.required}
        ?error=${args.error}
        ?success=${args.success}
        ?multiple=${args.multiple}
        ?clearable=${args.clearable}
        ?loading=${args.loading}
      ></mac-select>
    `
  },
}

export const Multiple: Story = {
  args: { multiple: true, clearable: true },
  render: (args) => {
    const options = [
      { value: 'react', label: 'React', icon: '⚛️' },
      { value: 'vue', label: 'Vue', icon: '💚' },
      { value: 'angular', label: 'Angular', icon: '🅰️' },
      { value: 'svelte', label: 'Svelte', icon: '🔥' },
      { value: 'solid', label: 'Solid', icon: '💎' },
    ]

    return html`
      <mac-select
        label="Frameworks"
        .options=${options}
        multiple
        clearable
        placeholder="Select frameworks"
        .value=${args.value}
        variant=${args.variant}
        size=${args.size}
        ?disabled=${args.disabled}
        ?required=${args.required}
        ?error=${args.error}
        ?success=${args.success}
        ?searchable=${args.searchable}
        ?loading=${args.loading}
      ></mac-select>
    `
  },
}

export const OptionGroups: Story = {
  render: (args) => {
    const groups = [
      {
        label: 'Fruits',
        options: [
          { value: 'apple', label: 'Apple', icon: '🍎' },
          { value: 'banana', label: 'Banana', icon: '🍌' },
          { value: 'orange', label: 'Orange', icon: '🍊' },
        ],
      },
      {
        label: 'Vegetables',
        options: [
          { value: 'carrot', label: 'Carrot', icon: '🥕' },
          { value: 'broccoli', label: 'Broccoli', icon: '🥦' },
          { value: 'tomato', label: 'Tomato', icon: '🍅' },
        ],
      },
    ]

    return html`
      <mac-select label="Food" .groups=${groups} searchable placeholder="Select food" .value=${args.value} variant=${args.variant} size=${args.size} ?disabled=${args.disabled} ?required=${args.required} ?error=${args.error} ?success=${args.success} ?multiple=${args.multiple} ?clearable=${args.clearable} ?loading=${args.loading}></mac-select>
    `
  },
}

export const Loading: Story = {
  args: { loading: true },
  render: (args) => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ]

    return html`
      <mac-select label="Loading" .options=${options} loading placeholder="Loading options..." .value=${args.value} variant=${args.variant} size=${args.size} ?disabled=${args.disabled} ?required=${args.required} ?error=${args.error} ?success=${args.success} ?multiple=${args.multiple} ?clearable=${args.clearable} ?searchable=${args.searchable}></mac-select>
    `
  },
}

export const Clearable: Story = {
  args: { clearable: true },
  render: (args) => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
    ]

    return html`
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <mac-select label="Single Select" .options=${options} clearable value="1" .value=${args.value} variant=${args.variant} size=${args.size} ?disabled=${args.disabled} ?required=${args.required} ?error=${args.error} ?success=${args.success} ?multiple=${args.multiple} ?searchable=${args.searchable} ?loading=${args.loading}></mac-select>
        <mac-select label="Multiple Select" .options=${options} multiple clearable .value=${['1', '2']} variant=${args.variant} size=${args.size} ?disabled=${args.disabled} ?required=${args.required} ?error=${args.error} ?success=${args.success} ?searchable=${args.searchable} ?loading=${args.loading}></mac-select>
      </div>
    `
  },
}

export const CompleteExample: Story = {
  render: (args) => {
    const countryGroups = [
      {
        label: 'North America',
        options: [
          { value: 'us', label: 'United States', icon: '🇺🇸' },
          { value: 'ca', label: 'Canada', icon: '🇨🇦' },
          { value: 'mx', label: 'Mexico', icon: '🇲🇽' },
        ],
      },
      {
        label: 'Europe',
        options: [
          { value: 'uk', label: 'United Kingdom', icon: '🇬🇧' },
          { value: 'de', label: 'Germany', icon: '🇩🇪' },
          { value: 'fr', label: 'France', icon: '🇫🇷' },
        ],
      },
      {
        label: 'Asia',
        options: [
          { value: 'jp', label: 'Japan', icon: '🇯🇵' },
          { value: 'cn', label: 'China', icon: '🇨🇳' },
          { value: 'kr', label: 'South Korea', icon: '🇰🇷' },
        ],
      },
    ]

    return html`
      <div style="max-width: 400px;">
        <mac-select
          label="Select Country"
          .groups=${countryGroups}
          searchable
          search-placeholder="Search countries..."
          clearable
          helper-text="Choose your country of residence"
          .value=${args.value}
          variant=${args.variant}
          size=${args.size}
          ?disabled=${args.disabled}
          ?required=${args.required}
          ?error=${args.error}
          ?success=${args.success}
          ?multiple=${args.multiple}
          ?loading=${args.loading}
        ></mac-select>
      </div>
    `
  },
}

export const GlassSelect: Story = {
  args: { variant: 'glass' },
  render: (args) => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
    ]

    return html`
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px; border-radius: 16px;">
        <div style="max-width: 400px;">
          <mac-select variant="glass" label="Glass Select" .options=${options} placeholder="Select an option" .value=${args.value} size=${args.size} ?disabled=${args.disabled} ?required=${args.required} ?error=${args.error} ?success=${args.success} ?multiple=${args.multiple} ?clearable=${args.clearable} ?searchable=${args.searchable} ?loading=${args.loading}></mac-select>
        </div>
      </div>
    `
  },
}
