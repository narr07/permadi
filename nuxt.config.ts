// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/a11y',
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@vueuse/nuxt',
    'nuxt-studio',
    '@nuxtjs/i18n',
  ],

  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  compatibilityDate: '2026-01-01',
  nitro: {
    prerender: {
    // Pre-render the homepage
      routes: ['/'],
      // Then crawl all the links on the page
      crawlLinks: true,
    },
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
})
