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
    '@nuxtjs/seo',
    '@nuxt/scripts',
    'nuxt-llms',
  ],
  site: {
    url: 'https://permadi.dev',
    name: 'Permadi',
    description: 'Permadi is a teacher, programmer and designer.',
    defaultLocale: 'id',
  },
  ogImage: {
    fonts: [
      {
        name: 'PermadiHeading',
        weight: 700,
        path: '/fonts/PermadiBody/Permadi-Body-Bold.otf',
      },
      {
        name: 'PermadiBody',
        weight: 400,
        path: '/fonts/PermadiBody/Permadi-Body-Regular.otf',
      },
    ],
  },
  llms: {
    domain: 'https://permadi.dev',
    title: 'Permadi',
    description: 'Permadi is a teacher, programmer and designer.',
    sections: [
      {
        title: 'Pages (ID)',
        description: 'Halaman profil dan info dasar',
        contentCollection: 'id_pages',
      },
      {
        title: 'Pages (EN)',
        description: 'Profile and basic info pages',
        contentCollection: 'en_pages',
      },
      {
        title: 'Blog (ID)',
        description: 'Artikel blog',
        contentCollection: 'id_blog',
      },
      {
        title: 'Blog (EN)',
        description: 'Blog articles',
        contentCollection: 'en_blog',
      },
      {
        title: 'Projects (ID)',
        description: 'Daftar projek',
        contentCollection: 'id_project',
      },
      {
        title: 'Projects (EN)',
        description: 'List of projects',
        contentCollection: 'en_project',
      },
      {
        title: 'Gallery (ID)',
        description: 'Galeri karya',
        contentCollection: 'id_gallery',
      },
      {
        title: 'Gallery (EN)',
        description: 'Artwork gallery',
        contentCollection: 'en_gallery',
      },
    ],
  },
  content: {
    renderer: {
      anchorLinks: false,
    },
  },
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/daton7ry4/image/upload/',
    },
    format: ['webp'],
    quality: 80,
    domains: ['res.cloudinary.com'],
  },
  linkChecker: {
    runOnBuild: false,
  },
  icon: {
    customCollections: [{
      prefix: 'narr',
      dir: './app/assets/icons',
    }],
  },
  scripts: {
    registry: {
      googleAnalytics: {
        id: 'G-5LEXR84KHW',
      },
    },
  },
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
    baseUrl: 'https://permadi.dev',
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
      'galeri': {
        en: '/gallery',
      },
      'projek': {
        en: '/project',
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
    '/': { prerender: true },
    '/en': { prerender: true },
    '/blog': { prerender: true },
    '/en/blog': { prerender: true },
    '/galeri': { prerender: true },
    '/en/gallery': { prerender: true },
    '/projek': { prerender: true },
    '/en/project': { prerender: true },
    '/blog/**': { prerender: true },
    '/en/blog/**': { prerender: true },

    '/api/**': { prerender: false },
    // Cache Cloudinary images served via Nuxt Image proxy (IPX)
    '/_ipx/**': {
      swr: 86400, // Stale-while-revalidate: serve from cache, revalidate every 24h
      cache: {
        maxAge: 60 * 60 * 24 * 7, // Browser cache: 7 days
      },
      headers: {
        'Cache-Control': 'public, max-age=604800, s-maxage=86400, stale-while-revalidate=86400',
      },
    },
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
