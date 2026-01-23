// https://nuxt.com/docs/api/configuration/nuxt-config
import { browserFallbackLocale, defaultLocale, languageCodes, languageNames, locales } from './i18n-constants'

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
    detectBrowserLanguage: {
      fallbackLocale: browserFallbackLocale,
    },
    locales: locales.map(locale => ({
      code: locale,
      name: languageNames[locale],
      language: languageCodes[locale],
      dir: 'ltr' as const,
    })),
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
      routes: ['/'],
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
