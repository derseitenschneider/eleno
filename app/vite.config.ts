///<reference types="vitest" />

import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { lightManifestDesktop } from './manifest'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    // preload(), // Disabled to prevent PDF chunk from loading on initial page load
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: false,
      },
      manifest: lightManifestDesktop,
      minify: true,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        globIgnores: ['**/pdf-renderer-*.js'],
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
    // Disable module preload generation to prevent PDF chunk loading on startup
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Group PDF-related dependencies together
          // These will ALL be lazy-loaded as one chunk when PDF exports are used
          // if (id.includes('@react-pdf') ||
          //     id.includes('fontkit') ||
          //     id.includes('restructure') ||
          //     id.includes('unicode-properties') ||
          //     id.includes('pdfkit') ||
          //     id.includes('yoga-layout') ||  // Used by PDF renderer
          //     id.includes('brotli') ||        // Used by fontkit
          //     id.includes('react-pdf-html') || // PDF HTML rendering
          //     id.includes('pako')) {           // Compression used by PDF
          //   return 'pdf-renderer';
          // }

          // Keep core React ecosystem together
          if (id.includes('react-router') || id.includes('@remix-run')) {
            return 'react-router'
          }

          // Group UI libraries
          if (id.includes('@radix-ui')) {
            return 'radix-ui'
          }

          // Group data fetching
          if (id.includes('@tanstack')) {
            return 'tanstack-query'
          }

          // Group Supabase
          if (id.includes('@supabase')) {
            return 'supabase'
          }

          // Let Vite handle automatic splitting for the rest
          // This allows better code splitting for lazy-loaded components
          return undefined
        },
      },
    },
  },
})
