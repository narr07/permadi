// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxt/content',
	],
	content: {
		database: {
			type: 'd1',
			bindingName: 'DB',
		},
	},
	nitro: {
		preset: 'cloudflare_pages',
		prerender: {
			routes: ['/'],
			crawlLinks: true,
		},
		cloudflare: {
			nodeCompat: true,
		},
	},
	devtools: { enabled: true },
	compatibilityDate: '2024-04-03',
})
