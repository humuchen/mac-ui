import type { StorybookConfig } from '@storybook/web-components-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.ts'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    config.base = process.env.CI ? '/mac-ui/' : '/'
    if (process.env.CI) {
      config.build ??= {}
      config.build.assetsDir = ''
    }
    return config
  },
}

export default config
