///<reference types="vitest" />

import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import preload from "vite-plugin-preload"
import { VitePWA } from "vite-plugin-pwa"
import manifest from "./manifest"

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true
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
      "@": path.resolve(__dirname, "./src"),
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
