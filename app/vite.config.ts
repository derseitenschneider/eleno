///<reference types="vitest" />

import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import preload from 'vite-plugin-preload'
import { VitePWA } from 'vite-plugin-pwa'
import { lightManifest, darkManifest, lightManifestDesktop } from './manifest'

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
      // workbox: {
      //   globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      //   runtimeCaching: [
      //     {
      //       urlPattern: /manifest\.webmanifest$/,
      //       handler: 'NetworkFirst',
      //       options: {
      //         cacheName: 'manifest-cache',
      //       },
      //     },
      //     {
      //       urlPattern: /index\.html$/,
      //       handler: 'NetworkFirst',
      //       options: {
      //         cacheName: 'index-cache',
      //       },
      //     },
      //   ],
      // },
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
