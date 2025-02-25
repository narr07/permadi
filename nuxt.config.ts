export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@nuxtjs/seo',
    '@nuxt/content',
    '@nuxthub/core',
    'nuxt-security',
    '@stefanobartoletti/nuxt-social-share',
    'nuxt-visitors',
    'nuxt-booster',
  ],
  content: {
    database: {
      type: 'd1',
      bindingName: 'permadi',
    },
    preview: {
      api: 'https://api.nuxt.studio',
      gitInfo: {
        name: 'permadi',
        owner: 'narr07',
        url: 'https://github.com/narr07/permadi/',
      },
    },
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'houston',
            dark: 'ayu-dark',
          },
          langs: ['json', 'js', 'ts', 'html', 'css', 'vue', 'diff', 'shell', 'markdown', 'yaml', 'bash', 'ini', 'c', 'cpp'],
          preload: ['json', 'js', 'ts', 'html', 'css', 'vue', 'diff', 'shell', 'markdown', 'yaml', 'bash', 'ini', 'c', 'cpp'],
        },
      },
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

    /**
     * IntersectionObserver rootMargin for Compoennts and Assets
     */
    lazyOffset: {
      component: '0%',
      asset: '0%',
    },
  },
  socialShare: {
    baseUrl: 'https://permadi.dev', // required!
    // other optional module options
  },

  site: {
    url: 'https://permadi.dev',
    name: 'Dinar Permadi Yusup',
    description: 'Dinar Permadi Yusup is a teacher, programmer, and designer. With this website, I would like to share my knowledge in learning design and programming.',
    defaultLocale: 'id', // not needed if you have @nuxtjs/i18n installed
    logo: '/logo.png',
    indexable: true,
  },
  hub: {
    database: true,
  },
  security: {
    headers: {
      contentSecurityPolicy: false,
      // contentSecurityPolicy: {
      //   'img-src': ["'self'", 'data:', 'https://ik.imagekit.io', 'https://repository-images.githubusercontent.com','https://opengraph.githubassets.com'],
      // },
      referrerPolicy: 'strict-origin-when-cross-origin',
      xFrameOptions: 'DENY',
    },
    hidePoweredBy: true,
  },
  i18n: {
    baseUrl: 'https://permadi.dev',
    strategy: 'prefix_except_default',
    defaultLocale: 'id',
    langDir: 'lang',
    locales: [
      { code: 'id', name: 'Indonesia', language: 'id_ID', dir: 'ltr', file: 'id.ts' },
      { code: 'en', name: 'English', language: 'en-US', dir: 'ltr', file: 'en.ts' },
    ],
    lazy: true,
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // recommended
      alwaysRedirect: true,
    },
    skipSettingLocaleOnNavigate: true,
  },
  image: {
    provider: 'ipx',
    formats: ['webp'],
    quality: 85,
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      '2xl': 1536,
    },
  },
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
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

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  ogImage: {
    fonts: [
      {
        name: 'Sblack',
        weight: 800,
        path: '/Sblack.ttf',
      },
      {
        name: 'Snomal',
        weight: 400,
        path: '/Snormal.ttf',
      },
    ],
  },
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
    experimental: {
      websocket: true,
    },
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-30',
  eslint: {
    config: {
      standalone: false,
    },
  },
  experimental: {
    componentIslands: true,
    viewTransition: true,
  },
  routeRules: {
    '/blog': { isr: 3600 },
    // Blog post page generated on demand once until next deployment, cached on CDN
    '/blog/**': { isr: true },
  },

})
