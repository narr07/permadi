// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/fonts',
  ],

  routeRules: {
    '/': { prerender: true },
  },

  compatibilityDate: '2024-11-17',
})
