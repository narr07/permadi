import { defineMcpTool } from '@nuxtjs/mcp-toolkit/server'
import { z } from 'zod'

export default defineMcpTool({
	name: 'get_site_info',
	description: 'Mendapatkan informasi umum website Permadi (permadi.dev), struktur navigasi, bahasa yang didukung, dan ringkasan fitur.',
	inputSchema: {
		locale: z.enum(['id', 'en']).optional().default('id').describe('Bahasa informasi (id atau en)'),
	},
	handler: async ({ locale }) => {
		const isId = locale === 'id'
		return {
			siteName: 'Permadi',
			domain: 'https://permadi.dev',
			author: 'Dinar Permadi Yusup',
			profession: isId
				? 'Frontend Developer, Desainer Grafis, dan Guru SD'
				: 'Frontend Developer, Graphic Designer, and Elementary School Teacher',
			languages: ['Bahasa Indonesia (/id)', 'English (/en)'],
			routes: {
				home: isId ? '/id' : '/en',
				blog: isId ? '/id/blog' : '/en/blog',
				projects: isId ? '/id/projek' : '/en/projects',
				gallery: isId ? '/id/galeri' : '/en/gallery',
				about: isId ? '/id/tentang' : '/en/about',
				contact: isId ? '/id/kontak' : '/en/contact',
			},
			features: [
				'Arsitektur Nuxt 4 + UnoCSS (Bento Grid Minimalis & Tipografi Golden Ratio)',
				'Sistem Konten Berbasis Nuxt Content v3 & Cloudflare D1',
				'Dukungan Penuh Dua Bahasa (Indonesian & English via @nuxtjs/i18n)',
				'Akses Raw Markdown untuk AI/LLMs via /raw/<path>.md dan /llms.txt',
				'Dukungan MCP Toolkit (@nuxtjs/mcp-toolkit) untuk integrasi AI Assistant',
			],
		}
	},
})
