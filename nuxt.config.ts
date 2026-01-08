// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui'
  ],
  eslint: {
    config: {
      standalone: false
    }
  },
  css: ['~/assets/css/main.css'],
  icon: {
    customCollections: [{
      prefix: 'narr',
      dir: './app/assets/icons'
    }]
  }
})