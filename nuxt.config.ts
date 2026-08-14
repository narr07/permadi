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
		// Prerender halaman utama
		'/': { redirect: '/en' },
		'/en': { prerender: true },
		'/id': { prerender: true },

		// SWR: render on-demand dan di-cache di Cloudflare (24 jam)
		'/en/blog': { swr: 86400 },
		'/id/blog': { swr: 86400 },
		'/en/projects': { swr: 86400 },
		'/id/projek': { swr: 86400 },
		'/en/gallery': { swr: 86400 },
		'/id/galeri': { swr: 86400 },
		'/en/about': { swr: 86400 },
		'/id/tentang': { swr: 86400 },
		'/en/contact': { swr: 86400 },
		'/id/kontak': { swr: 86400 },

		'/en/blog/**': { swr: 86400 },
		'/id/blog/**': { swr: 86400 },
		'/en/projects/**': { swr: 86400 },
		'/id/projek/**': { swr: 86400 },

		'/api/**': { prerender: false },

		// Cache generated OG images di Cloudflare edge (7 hari)
		'/__og-image__/**': { swr: 86400 * 7 },

		// Cache gambar IPX / proxy
		'/_ipx/**': {
			swr: 86400,
			cache: {
				maxAge: 60 * 60 * 24 * 7,
			},
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
