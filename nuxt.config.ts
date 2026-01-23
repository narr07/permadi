// https://nuxt.com/docs/api/configuration/nuxt-config
import { browserFallbackLocale, defaultLocale } from './i18n-constants'

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

  i18n: {
    vueI18n: './i18n.config.ts',
    strategy: 'prefix_except_default',
    defaultLocale,
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
      fallbackLocale: browserFallbackLocale,
      redirectOn: 'root',
    },
    locales: [
      {
        code: 'id',
        name: 'Indonesia',
        file: 'id.json',
      },
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
      },
    ],
  },

  studio: {
    route: '/narr',
    repository: {
      provider: 'github',
      owner: 'narr07',
      repo: 'permadi',
      branch: 'master',
    },
  },

  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  compatibilityDate: '2026-01-01',

  nitro: {
    prerender: {
      routes: ['/', '/en'],
      crawlLinks: true,
    },
  },

  experimental: {
    scanPageMeta: true, // Required for defineI18nRoute
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
})
