import { defineMcpTool } from '@nuxtjs/mcp-toolkit/server'
import { z } from 'zod'

export default defineMcpTool({
	name: 'get_profile',
	description: 'Mendapatkan profil lengkap Dinar Permadi Yusup (Permadi) — biografi, latar belakang profesional, statistik, peran, filosofi desain, dan kanal kontak/sosial.',
	inputSchema: {
		locale: z.enum(['id', 'en']).optional().default('id').describe('Bahasa data profil (id atau en)'),
	},
	handler: async ({ locale }) => {
		const isId = locale === 'id'

		return {
			name: 'Dinar Permadi Yusup',
			alias: 'Permadi',
			headline: isId
				? 'Membangun antarmuka yang rapi, cepat, dan enak dipakai.'
				: 'Crafting clean, blazing fast, and delightful web interfaces.',
			roles: [
				isId ? 'Frontend Developer (Spesialis Vue & Nuxt)' : 'Frontend Developer (Vue & Nuxt Specialist)',
				isId ? 'Desainer Grafis & UI/UX Designer' : 'Graphic Designer & UI/UX Designer',
				isId ? 'Pendidik / Guru SD di Majalengka' : 'Elementary School Educator in Majalengka',
			],
			location: 'Majalengka, Jawa Barat, Indonesia',
			email: 'dinar@permadi.dev',
			website: 'https://permadi.dev',
			bio: isId
				? 'Saya bekerja menjembatani sistem desain, tipografi berpresisi tinggi berbasis Golden Ratio, dan arsitektur kode modern untuk menciptakan produk digital yang terasa natural, cepat, dan manusiawi.'
				: 'I work bridging design systems, high-precision Golden Ratio typography, and modern code architecture to create digital products that feel natural, fast, and human.',
			stats: {
				yearsOfExperience: '5+',
				completedProjects: '30+',
				openSourceContributions: '100+',
			},
			socials: [
				{ platform: 'GitHub', username: 'narr07', url: 'https://github.com/narr07' },
				{ platform: 'X / Twitter', username: 'dinarpermadi07', url: 'https://x.com/dinarpermadi07' },
				{ platform: 'Instagram', username: 'narr07', url: 'https://www.instagram.com/narr07/' },
				{ platform: 'Behance', username: 'narr07', url: 'https://www.behance.net/narr07' },
			],
			principles: [
				{
					title: isId ? 'Konsistensi Visual & Token' : 'Visual Consistency & Tokens',
					desc: isId
						? 'Menerapkan design tokens terstruktur (11 shade level) dan tipografi matematis Golden Ratio.'
						: 'Structured design tokens with 11 shade levels and Golden Ratio typography.',
				},
				{
					title: isId ? 'Pengalaman Pengguna (DX & UX)' : 'User & Developer Experience',
					desc: isId
						? 'Antarmuka intuitif, aksesibilitas tinggi (WCAG AAA), dan mikro-interaksi responsif.'
						: 'Intuitive UI, high accessibility (WCAG AAA), and responsive micro-interactions.',
				},
				{
					title: isId ? 'Performa Web & Edge Computing' : 'High Performance & Edge Computing',
					desc: isId
						? 'Core Web Vitals optimal, SSR hydration cepat, dan Cloudflare D1/Nitro edge engine.'
						: 'Optimal Core Web Vitals, fast SSR hydration, and Cloudflare D1/Nitro edge engine.',
				},
			],
		}
	},
})
