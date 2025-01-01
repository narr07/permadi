// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxt/content',
    '@nuxthub/core',
    'nuxt-svgo',
  ],
  content: {
    database: {
      type: 'd1',
      binding: 'permadi',
    },
  },
  hub: {
    database: true,
  },
  eslint: {
    config: {
      standalone: false, // <---
    },
  },
  fonts: {
    experimental: {
      processCSSVariables: true,
    },
    families: [
      { name: 'Display', weights: ['200', '300', '400', '500', '700', '900'], display: 'swap' },
      { name: 'Narr', weights: ['100', '300', '400', '500', '700', '900'], display: 'swap' },
    ],
  },
  content: {
    studio: {
      enabled: true,
      gitInfo: {
        name: 'permadi',
        owner: 'narr07',
        url: 'https://github.com/narr07/permadi',
      },
    },
  },
  css: ['~/assets/css/main.css'],

  future: {
    compatibilityVersion: 4,
  },
  routeRules: {
    '/': { prerender: true },
  },
  compatibilityDate: '2024-11-27',
})
