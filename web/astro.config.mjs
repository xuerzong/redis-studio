// @ts-check
import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  site: 'https://redis-studio.xuco.me',
  base: '/',
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'en',
  },
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
  routing: {
    prefixDefaultLocale: false,
  },
})
