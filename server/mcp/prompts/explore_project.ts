import { defineMcpPrompt, completable } from '@nuxtjs/mcp-toolkit/server'
import { z } from 'zod'

export default defineMcpPrompt({
	name: 'explore_project',
	title: 'Bedah Studi Kasus Projek Portofolio',
	description: 'Prompt untuk menganalisis arsitektur, tantangan teknis, tech stack, dan solusi pada projek portofolio Permadi dari Nuxt Content database.',
	inputSchema: {
		projectSlug: completable(
			z.string().describe('Pilih atau ketik slug projek yang ingin dibedah'),
			async (value, context) => {
				try {
					const items = await (queryCollection(context?.event, 'projek_id') as any)
						.order('date', 'DESC')
						.limit(10)
						.all()
					const slugs = items.map((item: any) => item.slug).filter(Boolean)
					return slugs.filter((s: string) => s.toLowerCase().includes((value || '').toLowerCase()))
				}
				catch {
					return ['sdnteja2', 'kkgdrspetomo', 'nuxt-pdf-kit', 'budgetkuedu']
				}
			}
		),
		aspect: completable(
			z.string().optional().default('all').describe('Fokus aspek analisis (architecture, ui-ux, performance, atau all)'),
			(value) => {
				const aspects = ['all', 'architecture', 'ui-ux', 'performance', 'tech-stack']
				return aspects.filter(a => a.toLowerCase().includes((value || '').toLowerCase()))
			}
		),
	},
	handler: async ({ projectSlug, aspect }) => {
		return [
			{
				role: 'user',
				content: {
					type: 'text',
					text: `Gunakan tool search_projects untuk mengambil data projek "${projectSlug}" dari Nuxt Content. Lakukan analisis mendalam terhadap projek tersebut dengan fokus pada aspek: "${aspect}".\n\nSajikan dalam struktur:\n1. Ringkasan & Tujuan Projek\n2. Arsitektur Teknis & Tech Stack\n3. Fitur Utama & Keunggulan\n4. Tautan Live Demo & Repositori GitHub`,
				},
			},
		]
	},
})
