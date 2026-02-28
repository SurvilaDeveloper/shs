// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const repo = "shs";

export default defineConfig({
  site: "https://surviladeveloper.github.io",

  // SOLO usar base en producción (GitHub Pages)
  base: import.meta.env.PROD ? `/${repo}/` : "/",

  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});