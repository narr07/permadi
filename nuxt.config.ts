import process from 'node:process'
import { browserFallbackLocale, defaultLocale } from './i18n-constants'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxtjs/seo',
    '@nuxt/content',
    // Dev-only modules: excluded in production to reduce bundle & startup time
    ...(process.env.NODE_ENV !== 'production'
      ? [
          '@nuxt/a11y',
          '@nuxt/eslint',
          '@nuxt/hints',
        ]
      : []),
    '@nuxt/image',
    '@vueuse/nuxt',
    'nuxt-studio',
    '@nuxtjs/i18n',
    'motion-v/nuxt',
    '@nuxthub/core',
    '@nuxt/scripts',
    'nuxt-llms',
    '@stefanobartoletti/nuxt-social-share',
    'nuxt-delay-hydration',
  ],
  site: {
    url: 'https://permadi.dev',
    name: 'Permadi',
    description: 'Dinar Permadi Yusup is a teacher, programmer and designer.',
    defaultLocale: 'id',
    trailingSlash: false,
  },
  seo: {
    redirectToCanonicalSiteUrl: true,
    meta: {
      author: 'Dinar Permadi Yusup',
      applicationName: 'Permadi',
      description: 'Dinar Permadi Yusup is a teacher, programmer and designer.',
      themeColor: [
        { content: '#134e43', media: '(prefers-color-scheme: dark)' },
        { content: '#5eeacf', media: '(prefers-color-scheme: light)' },
      ],
      colorScheme: 'dark light',
    },
  },
  sitemap: {
    sitemaps: true,
    sources: ['/api/__sitemap__/urls'],
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
    description: 'Dinar Permadi Yusup is a teacher, programmer and designer.',
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
  fonts: {
    defaults: {
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
    },
    families: [
      {
        name: 'PermadiBody',
        provider: 'local',
        global: true,
      },
      {
        name: 'PermadiHeading',
        provider: 'local',
        global: true,
      },
    ],
  },
  app: {
    head: {
      titleTemplate: '%s | Permadi',
      htmlAttrs: { lang: 'id' },
    },
  },
  schemaOrg: {
    identity: {
      type: 'Person',
      name: 'Dinar Permadi Yusup',
      url: 'https://permadi.dev',
      image: '/permadi.jpg',
      jobTitle: 'Teacher',
      sameAs: [
        'https://github.com/narr07',
      ],
    },
  },
  delayHydration: {
    mode: 'mount',
    debug: process.env.NODE_ENV === 'development',
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
    defaultScriptOptions: {
      bundle: true,
      trigger: 'onNuxtReady',
    },
    registry: {
      googleAnalytics: {
        id: 'G-5LEXR84KHW',
      },
    },
  },
  // NuxtHub configuration for D1 database + cache
  hub: {
    cache: true,
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
        language: 'id-ID',
        name: 'Indonesia',
        file: 'id.json',
      },
      {
        code: 'en',
        language: 'en-US',
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
      'projek-slug': {
        en: '/project/[slug]',
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
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  compatibilityDate: '2026-01-01',
  routeRules: {
    // Prerender hanya halaman utama (statis, jarang berubah)
    '/': { prerender: true },
    '/en': { prerender: true },

    // SWR: halaman di-render on-demand lalu di-cache di Cloudflare KV
    // Build cepat karena tidak perlu render semua halaman saat build
    // Cache 24 jam, setelah expired akan re-render di background
    '/blog': { swr: 86400 },
    '/en/blog': { swr: 86400 },
    '/galeri': { swr: 86400 },
    '/en/gallery': { swr: 86400 },
    '/projek': { swr: 86400 },
    '/en/project': { swr: 86400 },
    '/projek/**': { swr: 86400 },
    '/en/project/**': { swr: 86400 },
    '/blog/**': { swr: 86400 },
    '/en/blog/**': { swr: 86400 },
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
  socialShare: {
    baseUrl: 'https://permadi.dev',
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      routes: ['/', '/en'],
      crawlLinks: false, // ISR handles dynamic pages on-demand, no need to crawl
      failOnError: false,
      ignore: ['/api'],
    },
    cloudflare: {
      pages: {
        routes: {
          exclude: [
            '/_ipx/*',
          ],
        },
      },
    },
  },
  experimental: {
    scanPageMeta: true, // Required for defineI18nRoute
    payloadExtraction: true, // Extracts state to smaller json payloads
    renderJsonPayloads: true, // Ensures JSON payload is rendered
    // viewTransition: true,
  },
  vite: {
    build: {
      // Minify logic and removing console.log in production
      target: 'esnext',
      minify: 'esbuild',
      cssMinify: true,
    },
    optimizeDeps: {
      // Opt-in lazy discovery to reduce initial boot delay
      include: ['vue', 'vue-router', '@vueuse/core'],
    },
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
  colorMode: {
    preference: 'dark', // mode default
  },
})
