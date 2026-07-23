// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  content: {
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
    experimental: {
      sqliteConnector: 'native',
    },
  },
  modules: [
    '@nuxt/content',
    '@vueuse/nuxt',
    '@nuxtjs/seo',
    'nuxt-studio',
    '@nuxt/eslint',
    '@nuxt/ui',
    'motion-v/nuxt',
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
  // ogImage: {
  //   defaults: {
  //     component: 'Permadi',
  //   },
  // },
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
      link: [
        // Preconnect to third-party origins for faster resource loading
        { rel: 'preconnect', href: 'https://res.cloudinary.com', crossorigin: 'anonymous' },
        { rel: 'dns-prefetch', href: 'https://res.cloudinary.com' },
        { rel: 'preconnect', href: 'https://analytics.google.com', crossorigin: 'anonymous' },
        { rel: 'dns-prefetch', href: 'https://analytics.google.com' },
        // Preload above-the-fold fonts to prevent CLS from font swap
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/PermadiHeading/Permadi-Heading-Bold.woff2', crossorigin: 'anonymous' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/PermadiBody/Permadi-Body-Regular.woff2', crossorigin: 'anonymous' },
      ],
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
  linkChecker: {
    runOnBuild: false,
  },
  routeRules: {
    // Cache generated OG images on Cloudflare edge (7 days)
    '/__og-image__/**': { swr: 86400 * 7 },
  },
  nitro: {
    prerender: {
      crawlLinks: true, // Discover blog/project pages + their OG images
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
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
})