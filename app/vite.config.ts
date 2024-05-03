///<reference types="vitest" />

import react from "@vitejs/plugin-react"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import preload from "vite-plugin-preload"
import { VitePWA } from "vite-plugin-pwa"
import manifest from "./manifest"

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom',
    root: './tests',
    globals: true,
    alias: {
      // "@": path.resolve(__dirname, "./src"),
      '@': fileURLToPath(new URL('./src', import.meta.url)),

      // '@/': new URL('./src/', import.meta.url).pathname,
    }
  },
  base: "/",
  plugins: [
    react(),
    preload(),
    VitePWA({
      registerType: "autoUpdate",

      // strategies: 'injectManifest',
      devOptions: {
        enabled: false,
      },
      manifest,
      minify: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // '@/': new URL('./src/', import.meta.url).pathname,
      // "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString()
          }
          return null
        },
      },
    },
  },
})
