// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    [
      "@storyblok/nuxt",
      {
        accessToken: process.env.STORYBLOK_ACCESS_TOKEN,
      },
    ],
    "@nuxt/ui",
    "nuxt-vercel-analytics",
    "@nuxtjs/google-fonts",
  ],
  ui: {
    icons: ["ph", "skill-icons"],
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
});
