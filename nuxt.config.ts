// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
  ],
  content: {
     database: {
      type: 'd1',
      bindingName: 'DB'  // Sesuaikan dengan 'Name' di Cloudflare Dashboard Anda
    },
  },
  nitro: {
    preset: 'cloudflare_pages', // Pastikan menggunakan preset yang sesuai
    prerender:{
      routes: ['/'], // Tambahkan rute yang ingin Anda prerender
      crawlLinks: true
    }
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
})
