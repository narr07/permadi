import { defineMcpPrompt, completable } from '@nuxtjs/mcp-toolkit/server'
import { z } from 'zod'

export default defineMcpPrompt({
	name: 'summarize_article',
	title: 'Rangkum & Jelaskan Artikel Blog',
	description: 'Prompt untuk mengambil dan merangkum inti sari materi artikel blog langsung dari Nuxt Content database.',
	inputSchema: {
		articleSlug: completable(
			z.string().describe('Pilih atau ketik slug artikel blog'),
			async (value, context) => {
				try {
					const items = await (queryCollection(context?.event, 'blog_id') as any)
						.order('date', 'DESC')
						.limit(10)
						.all()
					const slugs = items.map((item: any) => item.slug).filter(Boolean)
					return slugs.filter((s: string) => s.toLowerCase().includes((value || '').toLowerCase()))
				}
				catch {
					return [
						'sejarah-font-ttf-otf',
						'accelerated-learning-cara-belajar-cepat',
						'sejarah-accelerated-learning',
						'kedudukan-accelerated-learning-pendidikan',
						'accelerated-learning-kurikulum-merdeka',
						'rpp-accelerated-learning-master-sd-1-pertemuan',
					]
				}
			}
		),
		audience: completable(
			z.string().optional().default('general').describe('Target pembaca rangkuman (general, teacher, developer)'),
			(value) => {
				const audiences = ['general', 'teacher', 'developer', 'student']
				return audiences.filter(aud => aud.toLowerCase().includes((value || '').toLowerCase()))
			}
		),
	},
	handler: async ({ articleSlug, audience }) => {
		return [
			{
				role: 'user',
				content: {
					type: 'text',
					text: `Gunakan tool get_article_content dengan slug "${articleSlug}" untuk membaca isi artikel lengkap dari Nuxt Content. Rangkum poin-poin kunci dan gagasan utamanya untuk target pembaca: "${audience}".\n\nBuat rangkuman dengan bahasa yang menarik, mudah dipahami, dan berikan poin aksi (takeaways) yang dapat langsung dipraktikkan.`,
				},
			},
		]
	},
})
