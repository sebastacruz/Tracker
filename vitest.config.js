import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'src/utils/calculations.js',
        'src/hooks/useSubstances.js',
        'src/hooks/useEntries.js',
      ],
      exclude: [
        'src/main.jsx',
        'src/**/*.test.{js,jsx}',
        'src/**/__tests__/**',
      ],
      thresholds: {
        'src/utils/calculations.js': {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
        'src/hooks/useSubstances.js': {
          statements: 60,
          branches: 60,
          functions: 60,
          lines: 60,
        },
        'src/hooks/useEntries.js': {
          statements: 60,
          branches: 60,
          functions: 60,
          lines: 60,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
