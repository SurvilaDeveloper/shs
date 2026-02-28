// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

const repo = "shs"; // <- EXACTO igual al repo de GitHub

// https://astro.build/config
export default defineConfig({
  site: "https://SurvilaDeveloper.github.io",
  base: `/${repo}/`,
  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});