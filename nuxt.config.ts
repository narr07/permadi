// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxthub/core',
		'@pinia/nuxt',
		'motion-v/nuxt',
		'@nuxt/eslint',
		'@unocss/nuxt',
		'@nuxtjs/color-mode',
		'@nuxt/content',
		'@nuxtjs/i18n',
		'@nuxt/image',
		'nuxt-studio',
		'@nuxtjs/seo',
		'nuxt-llms',
		'@nuxt/scripts',
		'@nuxtjs/mcp-toolkit',
		'@stefanobartoletti/nuxt-social-share',
		'@nuxt/a11y',
	],
	a11y: {
		defaultHighlight: false,
		logIssues: true,
		axe: {
			runOptions: {
				runOnly: ['wcag2a', 'wcag2aa'],
			},
		},
		report: {
			enabled: true,
			output: 'a11y-report.md',
			failOnViolation: false,
		},
	},
	hub: {
		db: {
			dialect: 'sqlite',
			driver: 'd1',
			connection: {
				databaseId: process.env.NUXT_HUB_DATABASE_ID || 'ec2dcc68-5b36-4991-a8aa-ca9e1076956b',
			},
		},
		dir: '.data',
		remote: false,
	},
	eslint: {
		config: {
			standalone: false,
		},
	},
	experimental: {
		viewTransition: true,
	},
	site: {
		url: 'https://permadi.dev',
		name: 'Permadi',
		description: 'Web Developer & Designer portfolio and technical blog of Permadi.',
		defaultLocale: 'en',
		indexable: true,
	},
	sitemap: {
		zeroRuntime: true,
	},
	socialShare: {
		baseUrl: 'https://permadi.dev',
	},
	mcp: {
		name: 'Permadi Dev MCP Server',
		route: '/mcp',
		dir: 'mcp',
	},
	llms: {
		domain: 'https://permadi.dev',
		title: 'Dinar Permadi Yusup | Permadi (Web Developer & Designer)',
		description: 'Dokumentasi, artikel blog teknis, dan portofolio karya frontend developer & desainer grafis (Dinar Permadi Yusup) dalam Bahasa Indonesia dan English.',
		notes: [
			'Website ini tersedia penuh dalam dua bahasa: Bahasa Indonesia (/id) dan English (/en).',
			'This website is fully available in two languages: Indonesian (/id) and English (/en).',
			'Raw markdown format for all pages, blog posts, and projects is accessible directly via the /raw/<path>.md endpoint.',
		],
		sections: [
			{
				title: 'Artikel Blog (Bahasa Indonesia)',
				description: 'Kumpulan artikel teknis, opini desain, dan panduan seputar pengembangan web, tipografi, dan pendidikan.',
				contentCollection: 'blog_id',
			},
			{
				title: 'Blog Articles (English)',
				description: 'Collection of technical articles, design insights, and guides on web development, typography, and education.',
				contentCollection: 'blog_en',
			},
			{
				title: 'Portofolio & Studi Kasus Projek (Bahasa Indonesia)',
				description: 'Dokumentasi dan studi kasus aplikasi web, antarmuka, dan karya desain pilihan.',
				contentCollection: 'projek_id',
			},
			{
				title: 'Projects & Case Studies (English)',
				description: 'Documentation and case studies of selected web applications, interfaces, and design works.',
				contentCollection: 'projek_en',
			},
			{
				title: 'Halaman Utama & Profil (Bahasa Indonesia)',
				description: 'Informasi profil, biografi, filosofi desain, dan kontak Dinar Permadi Yusup dalam Bahasa Indonesia.',
				contentCollection: 'pages_id',
			},
			{
				title: 'Main Pages & Profile (English)',
				description: 'Profile information, biography, design philosophy, and contact details in English.',
				contentCollection: 'pages_en',
			},
		],
	},

	app: {
		head: {
			link: [
				{
					rel: 'preconnect',
					href: 'https://fonts.googleapis.com',
				},
				{
					rel: 'preconnect',
					href: 'https://fonts.gstatic.com',
					crossorigin: '',
				},
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@400;500;600&display=swap',
				},
			],
		},
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
		geminiApiKey: process.env.GEMINI_API_KEY || '',
		sessionSalt: process.env.NUXT_SESSION_SALT || 'permadi-reactions-salt-key-2026',
		cloudinaryCloudName: process.env.NUXT_CLOUDINARY_CLOUD_NAME || 'daton7ry4',
		cloudinaryApiKey: process.env.NUXT_CLOUDINARY_API_KEY || '',
		cloudinaryApiSecret: process.env.NUXT_CLOUDINARY_API_SECRET || '',
		public: {
			cloudflareAnalyticsToken: process.env.NUXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN || '',
			googleAnalyticsId: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'G-5LEXR84KHW',
		},
	},
	scripts: {
		registry: {
			cloudflareWebAnalytics: {
				token: process.env.NUXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN || '',
			},
			googleAnalytics: {
				id: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'G-5LEXR84KHW',
			},
		},
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
	content: {
		database: {
			type: 'd1',
			bindingName: 'DB',
		},
		build: {
			markdown: {
				highlight: {
					theme: {
						default: 'vitesse-dark',
						dark: 'vitesse-dark',
					},
					langs: [
						'ts',
						'tsx',
						'js',
						'jsx',
						'json',
						'vue',
						'html',
						'css',
						'bash',
						'sh',
						'yaml',
						'yml',
						'md',
						'mdc',
						'diff',
						'py',
						'python',
						'dart',
						'go',
						'kotlin',
						'sql',
						'rust',
						'graphql',
						'dockerfile',
					],
				},
			},
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
		'content:file:afterParse': function (ctx: any) {
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
			const cleanPlainText = text.replace(/[#*`_[\]()>$-]/g, ' ').replace(/\s+/g, ' ').trim()
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

		// Cache gambar OG di Cloudflare edge (12 jam = 43200 detik, tanpa cache browser lokal)
		'/_og/**': {
			headers: {
				'Cache-Control': 'public, max-age=0, s-maxage=43200, must-revalidate',
				'CDN-Cache-Control': 'max-age=43200',
			},
		},
		'/__og-image__/**': {
			headers: {
				'Cache-Control': 'public, max-age=0, s-maxage=43200, must-revalidate',
				'CDN-Cache-Control': 'max-age=43200',
			},
		},

		// Cache gambar IPX / proxy
		'/_ipx/**': {
			headers: {
				'Cache-Control': 'public, max-age=604800, s-maxage=86400, stale-while-revalidate=86400',
			},
		},
	},
	ogImage: {
		zeroRuntime: true,
	},
	nitro: {
		preset: 'cloudflare_pages',
		prerender: {
			concurrency: 1,
			interval: 50,
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
				'/feed.xml',
				'/feed.atom',
				'/feed.json',
			],
			crawlLinks: true,
			failOnError: false,
		},
		cloudflare: {
			nodeCompat: true,
			pages: {
				routes: {
					include: ['/*'],
					exclude: [
						'/_nuxt/*',
						'/_og/s/*',
						'/_og-static-fonts/*',
						'/_scripts/*',
						'/_studio-app/*',
						'/_payload.json',
						'/*/_payload.json',
						'/*/*/_payload.json',
						'/images/*',
						'/article/*',
						'/projects/*',
						'/logo/*',
						'/fonts/*',
						'/icons/*',
						'/favicon*',
						'/apple-touch-icon.png',
						'/web-app-manifest-*.png',
						'/*.svg',
						'/*.ico',
						'/*.webmanifest',
						'/feed.*',
						'/sitemap*.xml',
						'/robots.txt',
						'/llms*.txt',
						'/__sitemap__/*',
						'/__nuxt_content/*',
						'/dump.*.sql',
						'/en/blog/*',
						'/id/blog/*',
						'/en/projects/*',
						'/id/projek/*',
					],
				},
			},
		},
	},
	devtools: { enabled: true },
	compatibilityDate: '2024-04-03',
})
