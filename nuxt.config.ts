import { apiPlugin } from "@storyblok/vue";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ssr: process.env.NUXT_PUBLIC_NODE_ENV === 'production' ? true : false,
  // Leave here other things like: css, modules, i18n, nitro
  devtools: { enabled: false },
  modules: [
    [
      "@storyblok/nuxt",
      {
        accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
        use: [apiPlugin]
      },
    ],
    "@nuxt/ui",
    "@nuxtjs/google-fonts",
    "@nuxtjs/fontaine",
    "nuxt-icon",
    "@nuxt/image",
    "nuxt-swiper",
    "@vueuse/nuxt",
    "@hypernym/nuxt-anime",
    "@nuxtjs/i18n",
    "@nuxtseo/module",
    "nuxt-og-image",
    "nuxt-simple-robots",
    "nuxt-simple-sitemap",
    "nuxt-delay-hydration",
    '@vite-pwa/nuxt',
  ],
  delayHydration: {
    mode: "mount",
  },
  i18n: {
    strategy: "prefix_except_default",
    locales: ["id", "en"],
    defaultLocale: "id", // default locale
  },
  ui: {
    icons: ["ph", "skill-icons"],
  },
  image: {
    storyblok: {
      baseURL: "https://a.storyblok.com",
    },
  },
  colorMode: {
    preference: "light",
  },
  googleFonts: {
    display: "swap",
    prefetch: true,
    preconnect: true,
    preload: true,
    families: {
      "Bricolage Grotesque": "200..800",
      "Hanken Grotesk": {
        wght: "100..900",
        ital: "100..900",
      },
    },
  },
  fontMetrics: {
    fonts: [
      {
        family: "Bricolage Grotesque",
        fallbacks: ["Hanken Grotesk", "Inter", "Rubik"],
        fallbackName: "Bricolage Grotesque",
      },
      {
        family: "Hanken Grotesk",
        fallbacks: ["Hanken Grotesk"],
        fallbackName: "Hanken Grotesk",
      },
    ],
  },
  site: {
    url: process.env.NUXT_SITE_URL || "https://localhost:3000/",
    name: "Dinar Permadi Yusup",
    description: "Personal website of Dinar Permadi Yusup",
    defaultLocale: "id",
  },
  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },
  routeRules: {
    // revalidated every 60 seconds, in the background
    // "/**": {
    //   prerender: true,
    //   // isr: 60,
    //   swr: 60 * 10,
    // },
    "/": {
      prerender: true,
      swr: 60 * 10,
      // isr: 60,
    },
    // "/en/**": {
    //   prerender: true,
    //   swr: 60 * 10,
    //   // isr: 60,
    // },
    "/blog/**": {
      swr: 60 * 10,
      prerender: true,
      // isr: 60,
      // isr: true,
    },
    // "/blog/**": { isr: true },
    "/gallery/**": {
      swr: 60 * 10,
      prerender: true,
      // isr: 60, // isr: true,
    },
    // swr: 60 * 10,
    "/api/**": { cors: true },
  },
  // runtimeConfig: {
  //   public: {
  //     NODE_ENV: process.env.NODE_ENV
  //   }
  // },
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Dinar Permadi Yusup",
      short_name: "narr07",
      theme_color: "#023230",
      icons: [
        {
          src: "icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "icon-192-maskable.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "icon-512-maskable.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    // client: {
    //   installPrompt: true,
    //   // you don't need to include this: only for testing purposes
    //   // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
    //   periodicSyncForUpdates: 20,
    // },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
  },
});
