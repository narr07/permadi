// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    [
      "@storyblok/nuxt",
      {
        accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
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
  ],
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
});
