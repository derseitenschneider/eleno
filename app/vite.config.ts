import fs from 'fs/promises'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/app',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        dir: 'build',
      },
    },
  },
})
