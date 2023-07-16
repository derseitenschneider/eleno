import { defineConfig } from 'astro/config';

import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      fs: {
        allow: ['../app', '../landingpage']
      }
    }
  },
  integrations: [image()]
});