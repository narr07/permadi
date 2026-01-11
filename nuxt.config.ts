// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    'motion-v/nuxt',
    'nuxt-studio',
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
  ],
  site: {
    url: 'https://permadi.pages.dev/',
    name: 'Permadi',
    description: 'Permadi is a teacher and a web developer.',
    defaultLocale: 'id',
    locales: {
      id: {
        url: 'https://permadi.pages.dev/',
        name: 'Permadi',
        description: 'Permadi adalah seorang guru dan pengembang web.',
      },
      en: {
        url: 'https://permadi.pages.dev/en',
        name: 'Permadi',
        description: 'Permadi is a teacher and a web developer.',
      },
    },
  },
  content: {
    build: {
      markdown: {
        toc: {
          depth: 2,
        },
      },
    },
    renderer: {
      anchorLinks: false,
    },
  },
  i18n: {
    baseUrl: 'https://permadi.pages.dev/',
    locales: [
      { code: 'id', name: 'Indonesia', language: 'id-ID' },
      { code: 'en', name: 'English', language: 'en-US' },
    ],
    vueI18n: '~/i18n.config.ts',
    strategy: 'prefix_except_default',
    defaultLocale: 'id',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    customRoutes: 'config',

    pages: {
      'blog': {
        en: '/blog',
      },
      'blog-slug': {
        en: '/blog/[slug]',
      },
    },
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  css: ['~/assets/css/main.css'],
  fonts: {
    families: [
      { name: 'PermadiHeading', weights: ['400', '700', '900'], display: 'swap' },
      { name: 'PermadiBody', weights: ['300', '350', '400', '700', '900'], display: 'swap' },
    ],
  },
  icon: {
    customCollections: [{
      prefix: 'narr',
      dir: './app/assets/icons',
    }],
  },
  studio: {
    route: '/narr',
  },
})
