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
  experimental: {
    componentIslands: true,
    viewTransition: true,
    inlineRouteRules: true,

  },
  i18n: {
    skipSettingLocaleOnNavigate: false,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // recommended
      alwaysRedirect: true,
    },
    locales: [
      { code: 'en', name: 'English', language: 'en-US', file: 'en.ts', value: 'en' },
      { code: 'id', name: 'Indonesia', language: 'id-ID', file: 'id.ts', value: 'id' },
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
    replayClick: true,
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
  nitro: {
    prerender: {
      routes: [
        '/',
        '/blog',
      ],
    },
  },
  routeRules: {
    '/': { prerender: true },
    '/blog': { prerender: true },
    '/blog/**': { isr: true },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'id',
        class: 'h-dvh',
      },
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  compatibilityDate: '2024-11-27',
})
