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
    'nuxt-delay-hydration',
    '@vueuse/motion/nuxt',
    '@nuxtjs/i18n',
  ],
  i18n: {
    locales: [
      { code: 'en', name: 'English', language: 'en-US', file: 'en.ts' },
      { code: 'id', name: 'Indonesia', language: 'id-ID', file: 'id.ts' },
    ],
    strategy: 'prefix_except_default',
    defaultLocale: 'id',
    langDir: 'lang',
  },
  hub: {
    database: true,
  },
  delayHydration: {
    mode: 'mount',
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  fonts: {
    experimental: {
      processCSSVariables: true,
    },
    families: [
      { name: 'Display', weights: ['200', '300', '400', '500', '700', '900'], display: 'swap' },
      { name: 'Marr', weights: ['100', '300', '400', '500', '700', '900'], display: 'swap' },
    ],
  },
  content: {
    database: {
      type: 'd1',
      binding: 'permadi',
    },
    studio: {
      enabled: true,
      gitInfo: {
        name: 'permadi',
        owner: 'narr07',
        url: 'https://github.com/narr07/permadi',
      },
    },
    build: {
      pathMeta: { forceLeadingSlash: true },
      markdown: {

        toc: {
          depth: 4,
          searchDepth: 4,
        },
        highlight: {
          // Theme used in all color schemes.
          theme: {
            default: 'houston',
            dark: 'aurora-x',
          },
        },
      },
    },
  },
  css: ['~/assets/css/main.css'],
  future: {
    compatibilityVersion: 4,
  },
  routeRules: {
    '/': { prerender: true },
    '/blog': { prerender: true },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  compatibilityDate: '2024-11-27',
})
