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
  ],
  eslint: {
    config: {
      standalone: false, // <---
    },
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
