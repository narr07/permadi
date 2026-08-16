import { defineMcpTool } from '@nuxtjs/mcp-toolkit/server'
import { z } from 'zod'

export default defineMcpTool({
	name: 'get_article_content',
	description: 'Mengambil isi dan teks lengkap dari sebuah artikel blog tertentu di Nuxt Content berdasarkan slug.',
	inputSchema: {
		slug: z.string().describe('Slug artikel yang ingin dibaca (misal: sejarah-font-ttf-otf)'),
		locale: z.enum(['id', 'en']).optional().default('id').describe('Bahasa artikel (id atau en)'),
	},
	handler: async ({ slug, locale }, { event }) => {
		const collectionName = locale === 'id' ? 'blog_id' : 'blog_en'

		try {
			const doc = await (queryCollection(event, collectionName) as any)
				.where('slug', '=', slug)
				.first()

			if (!doc) {
				return {
					error: `Artikel dengan slug '${slug}' tidak ditemukan di koleksi ${collectionName}.`,
					locale,
				}
			}

			return {
				slug: doc.slug,
				title: doc.title,
				description: doc.description,
				category: doc.category,
				date: doc.date,
				tags: doc.tags || [],
				readingTime: doc.readingTime ? `${doc.readingTime} min read` : undefined,
				content: doc.plainText || doc.body,
				url: `https://permadi.dev/${locale}/blog/${doc.slug}`,
				rawMarkdownUrl: `https://permadi.dev/raw/${locale}/blog/${doc.slug}.md`,
			}
		}
		catch (error: any) {
			return {
				error: `Gagal membaca artikel: ${error.message}`,
				locale,
			}
		}
	},
})
