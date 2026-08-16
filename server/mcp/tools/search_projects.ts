import { defineMcpTool } from '@nuxtjs/mcp-toolkit/server'
import { z } from 'zod'

export default defineMcpTool({
	name: 'search_projects',
	description: 'Mencari dan mendaftar karya portofolio projek web dan aplikasi secara otomatis langsung dari Nuxt Content database.',
	inputSchema: {
		query: z.string().optional().describe('Kata kunci nama projek, deskripsi, atau teknologi (misal: Nuxt, Supabase, PDF)'),
		locale: z.enum(['id', 'en']).optional().default('id').describe('Bahasa projek (id atau en)'),
	},
	handler: async ({ query, locale }, { event }) => {
		const collectionName = locale === 'id' ? 'projek_id' : 'projek_en'

		try {
			const items = await queryCollection(event, collectionName).all()

			let results = items as any[]
			if (query) {
				const q = query.toLowerCase()
				results = results.filter((item: any) =>
					item.title?.toLowerCase().includes(q)
					|| item.description?.toLowerCase().includes(q)
					|| item.plainText?.toLowerCase().includes(q)
					|| (Array.isArray(item.tech) && item.tech.some((t: string) => t.toLowerCase().includes(q)))
					|| (Array.isArray(item.tags) && item.tags.some((t: string) => t.toLowerCase().includes(q))),
				)
			}

			return {
				total: results.length,
				locale,
				source: 'Nuxt Content Database',
				projects: results.map((item: any) => ({
					slug: item.slug,
					title: item.title,
					description: item.description,
					category: item.category,
					tech: item.tech || item.tags || [],
					date: item.date,
					featured: Boolean(item.featured),
					demoUrl: item.demoUrl || item.link,
					githubUrl: item.githubUrl || item.repo,
					url: `https://permadi.dev/${locale}/${locale === 'id' ? 'projek' : 'projects'}/${item.slug}`,
					rawMarkdownUrl: `https://permadi.dev/raw/${locale}/${locale === 'id' ? 'projek' : 'projects'}/${item.slug}.md`,
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
