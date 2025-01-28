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
    'nuxt-booster',
    'nuxt-security',
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
    lazy: true,
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
    assets: {
      prefix: '/_fonts/',
    },
    experimental: {
      processCSSVariables: true,
    },
    defaults: {
      preload: true,
      subsets: ['latin'],
      styles: ['normal', 'italic'],
    },
    families: [
      { name: 'Host Grotesk', provider: 'google', display: 'swap', weights: ['300', '400', '500', '600', '700', '800', '900'] },
      { name: 'Sofia Sans', provider: 'google', display: 'swap', weights: ['400', '700', '800', '900'] },
    ],
  },
  content: {
    database: {
      type: 'd1',
      binding: 'permadi',
    },
    preview: {
      api: 'https://api.nuxt.studio',
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
  // nitro: {
  //   prerender: {
  //     // Pre-render the homepage
  //     routes: ['/'],
  //     // Then crawl all the links on the page
  //     // crawlLinks: true,
  //   },

  // },

  // routeRules: {

  //   '/': { prerender: true },

  //   // Halaman blog menggunakan ISR dengan waktu 1 jam (3600 detik)
  //   '/blog': { isr: 3600, prerender: true }, // Halaman utama blog
  //   '/blog/**': { isr: 3600, prerender: true }, // Setiap artikel blog

  //   // Halaman project menggunakan ISR dengan waktu 30 menit (1800 detik)
  //   '/project': { isr: 3600, prerender: true }, // Halaman utama project
  //   '/project/**': { isr: 3600 }, // Setiap detail project
  // },
  security: {
    headers: {
      contentSecurityPolicy: false,
      // contentSecurityPolicy: {
      //   'img-src': ["'self'", 'data:', 'https://ik.imagekit.io', 'https://repository-images.githubusercontent.com','https://opengraph.githubassets.com'],
      // },
      referrerPolicy: 'strict-origin-when-cross-origin',
      xFrameOptions: 'DENY',
      crossOriginOpenerPolicy: 'same-origin', // Tambahkan COOP
      crossOriginEmbedderPolicy: 'require-corp', // Tambahkan COEP
    },
    hidePoweredBy: true,
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
    provider: 'ipx',
    formats: ['webp'],
    quality: 85,
    // The screen sizes predefined by `@nuxt/image`:
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      '2xl': 1536,
    },
  },
  booster: {
    detection: {
      performance: true,
      browserSupport: true,
      battery: true,
    },
    performanceMetrics: {
      timing: {
        fcp: 800,
        dcl: 1200,
      },
    },
    optimizeSSR: {
      cleanPreloads: true,
      cleanPrefetches: true,
      inlineStyles: true,
    },
    lazyOffset: {
      component: '0%',
      asset: '0%',
    },
  },
  // vitalizer: {
  //   disablePrefetchLinks: true,
  //   disablePreloadLinks: true,
  //   disableStylesheets: 'entry',
  // },
  // icon: {
  //   serverBundle: {
  //     collections: ['fa6-brands', 'devicon', 'file-icons', 'hugeicons', 'logos', 'lucide', 'openmoji', 'ph', 'skill-icons'],
  //   },
  // },
  colorMode: {
    preference: 'system',
    fallback: 'light',
  },
  // vite: {
  //   build: {
  //     modulePreload: false,
  //   },
  // },
  linkChecker: {
    runOnBuild: false,
  },
  compatibilityDate: '2024-11-27',
})
