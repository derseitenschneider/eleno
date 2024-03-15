/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'
import preload from 'vite-plugin-preload'
import manifest from './manifest'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',

  plugins: [
    react(),
    preload(),
    VitePWA({
      registerType: 'autoUpdate',

      // strategies: 'injectManifest',
      devOptions: {
        enabled: true,
      },
      manifest,
      minify: true,
    }),
  ],
  build: {
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString()
          }
          return null
        },
      },
    },
  },
})
