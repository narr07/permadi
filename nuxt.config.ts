// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "nuxt-vercel-analytics",
    "@nuxt/ui",
    ["@storyblok/nuxt", { accessToken: "wAaK3C23s1FMyTl7x3Q7Qgtt" }],
    '@nuxtjs/google-fonts'
  ],
  ui: {
    icons: ['ph', 'skill-icons']
  },
  googleFonts: {
    display: "swap",
    prefetch: true,
    preconnect: true,
    preload: true,
    // download: true,
    // outputDir: "assets",
    // stylePath: "fonts.css",
    // fontsDir: "fonts",
    // overwriting: true,
    // fontsPath: 'fonts',
    families: {
      "Bricolage Grotesque": '200..800',
      "Hanken Grotesk": {
        wght: '100..900',
        ital: '100..900',
      },
    },
  },
});
