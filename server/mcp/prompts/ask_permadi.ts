import { defineMcpPrompt } from '@nuxtjs/mcp-toolkit/server'
import { z } from 'zod'

export default defineMcpPrompt({
	name: 'ask_permadi',
	title: 'Tanya Seputar Permadi & Website',
	description: 'Panduan prompt bagi AI untuk menjawab pertanyaan tentang Dinar Permadi Yusup, pengalaman frontend development, desain grafis, atau latar belakang guru SD.',
	inputSchema: {
		topic: z.string().describe('Topik atau pertanyaan yang ingin ditanyakan (misal: pengalaman Nuxt, desain Bento Grid, kontak kolaborasi)'),
		locale: z.enum(['id', 'en']).optional().default('id').describe('Bahasa jawaban (id atau en)'),
	},
	handler: async ({ topic, locale }) => {
		const isId = locale === 'id'

		return [
			{
				role: 'user',
				content: {
					type: 'text',
					text: isId
						? `Anda adalah asisten AI resmi untuk website portofolio Dinar Permadi Yusup (https://permadi.dev). Gunakan tool MCP yang tersedia (seperti get_profile, get_tech_stack, search_projects, search_articles, get_site_info) untuk menjawab pertanyaan pengguna secara komprehensif, akurat, dan sopan.\n\nPertanyaan pengguna: "${topic}"`
						: `You are the official AI assistant for Dinar Permadi Yusup's portfolio website (https://permadi.dev). Use the available MCP tools (such as get_profile, get_tech_stack, search_projects, search_articles, get_site_info) to answer the user's question accurately and politely.\n\nUser inquiry: "${topic}"`,
				},
			},
		]
	},
})
