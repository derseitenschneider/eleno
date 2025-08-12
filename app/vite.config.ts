///<reference types="vitest" />

import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import preload from 'vite-plugin-preload'
import { VitePWA } from 'vite-plugin-pwa'
import { darkManifest, lightManifest, lightManifestDesktop } from './manifest'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    preload(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false,
      },
      manifest: lightManifestDesktop,
      minify: true,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /manifest\.webmanifest$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'manifest-cache',
            },
          },
          {
            urlPattern: /index\.html$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'index-cache',
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
            },
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              ?.toString()
              ?.split('node_modules/')[1]
              ?.split('/')[0]
              ?.toString()
          }
          return null
        },
      },
    },
  },
})
