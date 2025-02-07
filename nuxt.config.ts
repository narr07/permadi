export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@nuxtjs/seo',
    '@nuxt/content',
    '@nuxthub/core',
    'nuxt-security',
    '@nuxtjs/html-validator',
  ],
  content: {
    database: {
      type: 'd1',
      bindingName: 'permadi',
    },
    preview: {
      api: 'https://api.nuxt.studio',
      gitInfo: {
        name: 'permadi',
        owner: 'narr07',
        url: 'https://github.com/narr07/permadi/',
      },
    },
  },
  site: {
    url: 'https://permadi.dev',
    name: 'Dinar Permadi Yusup',
    description: 'Dinar Permadi Yusup is a teacher, programmer, and designer. With this website, I would like to share my knowledge in learning design and programming.',
    defaultLocale: 'id', // not needed if you have @nuxtjs/i18n installed
    logo: '/logo.png',
  },
  hub: {
    database: true,
  },
  security: {
    headers: {
      contentSecurityPolicy: false,
      // contentSecurityPolicy: {
      //   'img-src': ["'self'", 'data:', 'https://ik.imagekit.io', 'https://repository-images.githubusercontent.com','https://opengraph.githubassets.com'],
      // },
      referrerPolicy: 'strict-origin-when-cross-origin',
      xFrameOptions: 'DENY',
    },
    hidePoweredBy: true,
  },
  i18n: {
    baseUrl: 'https://permadi.dev',
    strategy: 'prefix_except_default',
    defaultLocale: 'id',
    langDir: 'lang',
    locales: [
      { code: 'id', name: 'Indonesia', language: 'id_ID', dir: 'ltr', file: 'id.ts' },
      { code: 'en', name: 'English', language: 'en-US', dir: 'ltr', file: 'en.ts' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // recommended
      alwaysRedirect: true,
    },

  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  scripts: {
    registry: {
      googleAnalytics: {
        id: 'G-5LEXR84KHW',
      },
      googleTagManager: {
        id: 'GTM-5XT2J2S5',
      },
    },
  },
  routeRules: {
    '/': { prerender: true },
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-30',
  eslint: {
    config: {
      standalone: false,
    },
  },
})
