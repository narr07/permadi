import { defineMcpResource } from '@nuxtjs/mcp-toolkit/server'

export default defineMcpResource({
	uri: 'permadi://profile',
	name: 'Permadi Profile & Contact Information',
	description: 'Informasi lengkap profil, biografi, skill stack, dan kontak Dinar Permadi Yusup.',
	mimeType: 'application/json',
	handler: async () => {
		return {
			name: 'Dinar Permadi Yusup',
			alias: 'Permadi',
			domain: 'https://permadi.dev',
			email: 'dinar@permadi.dev',
			role: 'Frontend Developer, Graphic Designer & Elementary School Teacher',
			location: 'Majalengka, Indonesia',
			skills: ['Nuxt 4', 'Vue 3', 'TypeScript', 'UnoCSS', 'Tailwind CSS', 'Cloudflare D1', 'Figma'],
			github: 'https://github.com/narr07',
			x: 'https://x.com/dinarpermadi07',
			instagram: 'https://www.instagram.com/narr07/',
			behance: 'https://www.behance.net/narr07',
		}
	},
})
