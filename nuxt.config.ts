// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxt/content',
		'@nuxtjs/i18n',
	],
	i18n: {
		baseUrl: 'https://permadi.dev',
		defaultLocale: 'en',
		strategy: 'prefix_except_default',
		locales: [
			{
				code: 'en',
				language: 'en-US',
				name: 'English',
				file: 'en.json',
			},
			{
				code: 'id',
				language: 'id-ID',
				name: 'Bahasa Indonesia',
				file: 'id.json',
			},
		],
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: 'i18n_redirected',
			fallbackLocale: 'en',
			redirectOn: 'root',
		},
	},
	content: {
		database: {
			type: 'd1',
			bindingName: 'DB',
		},
	},
	nitro: {
		preset: 'cloudflare_pages',
		prerender: {
			routes: ['/', '/id'],
			crawlLinks: true,
		},
		cloudflare: {
			nodeCompat: true,
		},
	},
	devtools: { enabled: true },
	compatibilityDate: '2024-04-03',
})
