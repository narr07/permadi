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
  ],
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
    locales: [
      { code: 'id', name: 'Indonesia', language: 'id-ID' },
      { code: 'en', name: 'English', language: 'en-US' },
    ],
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
