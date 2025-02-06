export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxthub/core',
  ],
  content: {
    database: {
      type: 'd1',
      binding: 'permadi'
    },
    preview: {
      api: 'https://api.nuxt.studio',
      gitInfo: {
        name: 'permadi',
        owner: 'narr07',
        url: 'github.com/narr07/permadi',
      }
    }
  },
  hub: {
    database: true,
  },
  i18n: {
    locales: [
      { code: 'id', name: 'Indonesia', language: 'id_ID', dir: 'ltr' },
      { code: 'en', name: 'English', language: 'en-US', dir: 'ltr' },
    ],
    strategy: 'prefix_except_default',
    defaultLocale: 'id',
  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      helloText: 'Hello from the Edge 👋',
    },
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-30', 
  eslint: {
    config: {
      standalone: false,
    },
  },
})