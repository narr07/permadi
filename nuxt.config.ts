// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxt/content',
		'@nuxtjs/i18n',
	],
	i18n: {
		baseUrl: 'https://permadi.dev',
		defaultLocale: 'en',
		strategy: 'prefix',
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
	hooks: {
		'content:file:afterParse'(ctx: any) {
			const fileId = ctx.file?.id || ''
			const parts = fileId.split('/')
			const filename = parts[parts.length - 1] || ''

			// Ekstrak ID numerik & slug bersih dari awalan file (contoh: "1.personal-portfolio-bento-redesign.md" -> id: 1, slug: "personal-portfolio-bento-redesign")
			const match = filename.match(/^(\d+)\.(.+)\.(md|json)$/)
			if (match) {
				const numId = Number.parseInt(match[1], 10)
				const cleanSlug = match[2]

				ctx.content.idItem = numId
				ctx.content.slug = cleanSlug

				if (fileId.includes('blog')) {
					ctx.content.idBlog = numId
				}
				if (fileId.includes('projek') || fileId.includes('projects')) {
					ctx.content.idProjek = numId
				}
			}

			// Ekstrak plain text isi konten untuk sistem pencarian komprehensif (Full-Text Search)
			const text = typeof ctx.file?.body === 'string' ? ctx.file.body : ''
			const cleanPlainText = text.replace(/[#*`_\[\]()>$-]/g, ' ').replace(/\s+/g, ' ').trim()
			ctx.content.plainText = cleanPlainText

			// Hitung reading time berdasarkan jumlah kata
			const wordsPerMinute = 180
			const wordCount = text.split(/\s+/).filter(Boolean).length
			ctx.content.readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute))
		},
	},
	routeRules: {
		// Root redirect
		'/': { redirect: '/en' },

		// Seluruh halaman HTML: Selalu sajikan versi terbaru tanpa cache browser/edge basi setelah deploy baru
		'/**': {
			headers: {
				'Cache-Control': 'public, max-age=0, must-revalidate',
			},
		},

		// Aset statis Nuxt JS/CSS (dengan hash unik di filename): Boleh di-cache secara permanen
		'/_nuxt/**': {
			headers: {
				'Cache-Control': 'public, max-age=31536000, immutable',
			},
		},

		// API routes tidak di-prerender
		'/api/**': {
			prerender: false,
			headers: {
				'Cache-Control': 'no-store, no-cache, must-revalidate',
			},
		},

		// Cache gambar OG di Cloudflare edge
		'/__og-image__/**': {
			headers: {
				'Cache-Control': 'public, max-age=604800, s-maxage=86400, stale-while-revalidate=86400',
			},
		},

		// Cache gambar IPX / proxy
		'/_ipx/**': {
			headers: {
				'Cache-Control': 'public, max-age=604800, s-maxage=86400, stale-while-revalidate=86400',
			},
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
			routes: ['/en', '/id'],
			crawlLinks: true,
		},
		cloudflare: {
			nodeCompat: true,
		},
	},
	devtools: { enabled: true },
	compatibilityDate: '2024-04-03',
})
