// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@unocss/nuxt',
		'@nuxtjs/color-mode',
		'@nuxt/content',
		'@nuxtjs/i18n',
		'@nuxt/image',
		'nuxt-studio',
		'@nuxtjs/seo',
	],
	site: {
		url: 'https://permadi.dev',
		name: 'Permadi',
		description: 'Web Developer & Designer portfolio and technical blog of Permadi.',
		defaultLocale: 'en',
		indexable: true,
	},

	components: {
		dirs: [
			{
				path: '~/components/content',
				global: true,
			},
			'~/components',
		],
	},
	css: [
		'~/assets/css/main.css',
	],
	colorMode: {
		classSuffix: '',
		preference: 'system',
		fallback: 'dark',
	},
	runtimeConfig: {
		cloudinaryCloudName: process.env.NUXT_CLOUDINARY_CLOUD_NAME || 'daton7ry4',
		cloudinaryApiKey: process.env.NUXT_CLOUDINARY_API_KEY || '',
		cloudinaryApiSecret: process.env.NUXT_CLOUDINARY_API_SECRET || '',
	},
	image: {
		cloudinary: {
			baseURL: 'https://res.cloudinary.com/daton7ry4/image/upload/',
		},
		format: ['webp', 'avif'],
		quality: 85,
		domains: ['res.cloudinary.com'],
		screens: {
			xs: 320,
			sm: 640,
			md: 768,
			lg: 1024,
			xl: 1280,
			xxl: 1536,
		},
	},
	studio: {
		repository: {
			provider: 'github',
			owner: 'narr07',
			repo: 'permadi',
			branch: 'main',
		},
	},
	i18n: {
		baseUrl: 'https://permadi.dev',
		defaultLocale: 'en',
		strategy: 'prefix',
		customRoutes: 'config',
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
		pages: {
			'projek/index': {
				id: '/projek',
				en: '/projects',
			},
			'projek/[slug]': {
				id: '/projek/[slug]',
				en: '/projects/[slug]',
			},
			'tentang': {
				id: '/tentang',
				en: '/about',
			},
			'kontak': {
				id: '/kontak',
				en: '/contact',
			},
			'galeri': {
				id: '/galeri',
				en: '/gallery',
			},
		},
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
			routes: [
				'/en',
				'/id',
				'/en/projects',
				'/id/projek',
				'/en/about',
				'/id/tentang',
				'/en/contact',
				'/id/kontak',
				'/en/gallery',
				'/id/galeri',
				'/en/blog',
				'/id/blog',
			],
			crawlLinks: true,
			failOnError: false,
		},
		cloudflare: {
			nodeCompat: true,
		},
	},
	devtools: { enabled: true },
	compatibilityDate: '2024-04-03',
})