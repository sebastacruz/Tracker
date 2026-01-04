import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'docs/bundle-analysis.html',
    }),
  ],
  base: '/Tracker/',
  build: {
    outDir: 'docs',
  },
  server: {
    port: 5173,
    open: true,
  },
})
