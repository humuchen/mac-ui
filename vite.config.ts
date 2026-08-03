import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [],
  build: {
    // TypeScript declarations are emitted to dist before Vite runs. Keep them.
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/mac-ui.ts'),
      name: 'mac-ui',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `mac-ui.${format}.js`,
    },
    rollupOptions: {
      external: ['lit'],
      output: {
        globals: {
          lit: 'Lit',
        },
      },
    },
    sourcemap: true,
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
