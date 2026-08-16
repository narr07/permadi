import { defineMcpPrompt, completable } from '@nuxtjs/mcp-toolkit/server'
import { z } from 'zod'

export default defineMcpPrompt({
	name: 'design_system_consultation',
	title: 'Konsultasi Sistem Desain Bento & Golden Ratio',
	description: 'Prompt untuk berdiskusi mengenai arsitektur sistem desain Bento Grid, skala tipografi Golden Ratio, dan styling UnoCSS yang diterapkan di Permadi.dev.',
	inputSchema: {
		topic: completable(
			z.string().describe('Topik sistem desain'),
			(value) => {
				const topics = ['bento-grid', 'golden-ratio-typography', 'unocss-tokens', 'wcag-accessibility', 'micro-interactions']
				return topics.filter(t => t.toLowerCase().includes((value || '').toLowerCase()))
			}
		),
	},
	handler: async ({ topic }) => {
		return [
			{
				role: 'user',
				content: {
					type: 'text',
					text: `Gunakan tool get_profile dan get_tech_stack untuk meninjau prinsip desain Permadi (permadi.dev). Jelaskan konsep dan implementasi terbaik mengenai: "${topic}" dalam konteks framework Nuxt 4, UnoCSS, dan desain Bento Grid modern berstandar WCAG AAA.`,
				},
			},
		]
	},
})
