import { defineConfig } from 'astro/config';
import image from '@astrojs/image';
import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://eleno.net',
  compressHTML: true,

  vite: {
    build: {
      rollupOptions: {
        external: ['framer-motion'],
      },
    },
    server: {
      fs: {
        allow: ['../app', '../landingpage'],
      },
    },
  },
  integrations: [image(), react(), sitemap()],
});
