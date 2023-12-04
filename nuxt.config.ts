/* eslint-disable node/prefer-global/process */
// import { apiPlugin } from "@storyblok/vue";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ssr: process.env.NUXT_PUBLIC_NODE_ENV === "production" ? true : false,
  // Leave here other things like: css, modules, i18n, nitro
  // runtimeConfig: {
  //   public: {
  //     NODE_ENV: process.env.NODE_ENV,
  //   },
  // },
  devtools: { enabled: false },
  modules: [
    [
      '@storyblok/nuxt',
      {
        accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
        // use: [apiPlugin],
      },
    ],
    '@nuxt/ui',
    '@nuxtjs/google-fonts',
    '@nuxtjs/fontaine',
    'nuxt-icon',
    '@nuxt/image',
    'nuxt-swiper',
    '@vueuse/nuxt',
    '@hypernym/nuxt-anime',
    '@nuxtjs/i18n',
    '@nuxtseo/module',
    'nuxt-og-image',
    'nuxt-simple-robots',
    'nuxt-simple-sitemap',
    'nuxt-delay-hydration',
    '@vite-pwa/nuxt',
    '@nuxtjs/web-vitals',
    'nuxt-gtag',
    '@nuxtjs/google-adsense',
  ],
  delayHydration: {
    mode: 'mount',
  },
  i18n: {
    strategy: 'prefix_except_default',
    locales: ['id', 'en'],
    defaultLocale: 'id', // default locale
  },
  ui: {
    icons: ['ph', 'skill-icons'],
  },
  image: {
    storyblok: {
      baseURL: 'https://a.storyblok.com',
    },
  },
  colorMode: {
    preference: 'light',
  },
  fontMetrics: {
    fonts: [
      {
        family: 'Rubik',
        fallbacks: ['Rubik'],
        fallbackName: 'Rubik',
      },
      {
        family: 'Schibsted Grotesk',
        fallbacks: ['Schibsted Grotesk'],
        fallbackName: 'Schibsted Grotesk',
      },
    ],
  },
  googleFonts: {
    display: 'swap',
    prefetch: true,
    preconnect: true,
    preload: true,
    families: {
      'Rubik': {
        wght: [300, 400, 500, 600, 700, 800, 900],
        ital: [300, 400, 500, 600, 700, 800, 900],
      },
      'Schibsted Grotesk': {
        wght: [400, 500, 600, 700, 800, 900],
        ital: [400, 500, 600, 700, 800, 900],
      },
    },
  },
  site: {
    url: process.env.NUXT_SITE_URL || 'https://localhost:3000/',
    name: 'Dinar Permadi Yusup',
    description: 'Personal website of Dinar Permadi Yusup',
    defaultLocale: 'id',
  },
  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },
  routeRules: {
    // "/**": {
    //   prerender: true,
    //   swr: 60 * 10,
    // },
    '/': {
      prerender: true,
      swr: 60 * 5,
    },
    '/en/**': {
      prerender: true,
      swr: 60 * 10,
    },
    '/blog/**': {
      swr: 60 * 10,
      prerender: true,
    },
    '/gallery/**': {
      swr: 60 * 10,
      prerender: true,
      isr: 60,
    },
    '/api/**': {
      cors: true,
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Dinar Permadi Yusup',
      short_name: 'narr07',
      theme_color: '#023230',
      icons: [
        {
          src: 'icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'icon-192-maskable.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable',
        },
        {
          src: 'icon-512-maskable.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
  gtag: {
    id: process.env.NUXT_PUBLIC_GTAG_ID || '',
  },
  googleAdsense: {
    id: 'ca-pub-5549139053730632',
  },
  webVitals: {
    ga: {
      id: process.env.NUXT_PUBLIC_GTAG_ID || '',
    },
  },
})
