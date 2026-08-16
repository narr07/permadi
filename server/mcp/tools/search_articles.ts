import { defineMcpTool } from '@nuxtjs/mcp-toolkit/server'
import { z } from 'zod'

export default defineMcpTool({
	name: 'search_articles',
	description: 'Mencari artikel blog teknis & edukasi secara otomatis langsung dari Nuxt Content database (mendukung pencarian judul, konten, kategori, dan tags).',
	inputSchema: {
		query: z.string().optional().describe('Kata kunci pencarian judul, topik, atau kata di dalam artikel'),
		category: z.string().optional().describe('Filter kategori spesifik (misal: Pendidikan, Tipografi)'),
		locale: z.enum(['id', 'en']).optional().default('id').describe('Bahasa artikel (id atau en)'),
	},
	handler: async ({ query, category, locale }, { event }) => {
		const collectionName = locale === 'id' ? 'blog_id' : 'blog_en'

		try {
			let queryBuilder = queryCollection(event, collectionName)

			if (category) {
				queryBuilder = queryBuilder.where('category', '=', category)
			}

			const items = await queryBuilder.all()

			let results = items as any[]
			if (query) {
				const q = query.toLowerCase()
				results = results.filter((item: any) =>
					item.title?.toLowerCase().includes(q) ||
					item.description?.toLowerCase().includes(q) ||
					item.plainText?.toLowerCase().includes(q) ||
					(Array.isArray(item.tags) && item.tags.some((t: string) => t.toLowerCase().includes(q)))
				)
			}

			return {
				total: results.length,
				locale,
				source: 'Nuxt Content Database',
				articles: results.map((item: any) => ({
					slug: item.slug,
					title: item.title,
					description: item.description,
					category: item.category,
					date: item.date,
					tags: item.tags || [],
					readingTime: item.readingTime ? `${item.readingTime} min read` : undefined,
					url: `https://permadi.dev/${locale}/blog/${item.slug}`,
					rawMarkdownUrl: `https://permadi.dev/raw/${locale}/blog/${item.slug}.md`,
				})),
			}
		}
		catch (error: any) {
			return {
				error: `Gagal membaca database Nuxt Content: ${error.message}`,
				locale,
			}
		}
	},
})
