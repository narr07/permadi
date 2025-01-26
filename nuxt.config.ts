// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxt/content',
    '@nuxthub/core',
    'nuxt-delay-hydration',
    '@vueuse/motion/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/scripts',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-vitalizer',
  ],
  experimental: {
    componentIslands: true,

  },

  i18n: {
    skipSettingLocaleOnNavigate: false,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
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
          depth: 3,
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
      ],
    },
  },

  routeRules: {

    '/': { prerender: true },

    // Halaman blog menggunakan ISR dengan waktu 1 jam (3600 detik)
    '/blog': { isr: 3600 }, // Halaman utama blog
    '/blog/**': { isr: 3600 }, // Setiap artikel blog

    // Halaman project menggunakan ISR dengan waktu 30 menit (1800 detik)
    '/project': { isr: 3600 }, // Halaman utama project
    '/project/**': { isr: 3600 }, // Setiap detail project
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  site: {
    url: 'https://permadi.dev',
    name: 'Dinar Permadi Yusup',
    description: 'Dinar Permadi Yusup is a teacher, programmer, and designer. With this website, I would like to share my knowledge in learning design and programming.',
    defaultLocale: 'id', // not needed if you have @nuxtjs/i18n installed
    logo: '/logo.png',
  },
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
  image: {
    // The screen sizes predefined by `@nuxt/image`:
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      'xxl': 1536,
      '2xl': 1536,
    },
  },
  compatibilityDate: '2024-11-27',
})