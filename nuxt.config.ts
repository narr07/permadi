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
    'motion-v/nuxt',
    '@nuxthub/core',
  ],

  // NuxtHub configuration for D1 database
  hub: {
    db: {
      dialect: 'sqlite',
      driver: 'd1',
      connection: {
        databaseId: '4f1034fd-0882-4869-b853-37933b6a5ce6',
      },
    },
  },

  i18n: {
    baseUrl: 'https://permadi.pages.dev',
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
    customRoutes: 'config',
    pages: {
      'blog': {
        en: '/blog',
      },
      'blog-slug': {
        en: '/blog/[slug]',
      },
      'gallery': {
        id: '/galeri',
      },
      'project': {
        id: '/projek',
      },

    },
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

  routeRules: {
    '/api/**': { prerender: false },
  },

  nitro: {
    prerender: {
      routes: ['/', '/en'],
      crawlLinks: true,
      failOnError: false,
      ignore: ['/api'],
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

  hooks: {
    'content:file:afterParse': (ctx: any) => {
      // Get file ID (e.g., "id_pages/id/blog/2.Title.md")
      const fileId = ctx.file?.id || ''

      // Only apply to blog posts
      if (fileId.includes('/blog/') || fileId.includes('blog/')) {
        // Extract filename from file ID
        const parts = fileId.split('/')
        const filename = parts[parts.length - 1] || ''

        // Extract idBlog from filename prefix (e.g., "1.Title.md" -> 1)
        const match = filename.match(/^(\d+)\./)
        if (match) {
          ctx.content.idBlog = Number.parseInt(match[1], 10)
        }

        // Calculate reading time based on word count
        const wordsPerMinute = 180
        const text = typeof ctx.file?.body === 'string' ? ctx.file.body : ''
        const wordCount = text.split(/\s+/).filter(Boolean).length
        ctx.content.readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute))
      }
    },
  },
})
