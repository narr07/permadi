import { defineMcpTool } from '@nuxtjs/mcp-toolkit/server'

export default defineMcpTool({
	name: 'get_tech_stack',
	description: 'Mendapatkan daftar lengkap teknologi, bahasa pemrograman, framework, dan tools yang digunakan oleh Permadi.',
	inputSchema: {},
	handler: async () => {
		return {
			featured: ['Nuxt 4', 'Vue 3', 'TypeScript', 'UnoCSS', 'Tailwind CSS v4', 'Nitro', 'Cloudflare D1', 'Motion-v', 'Zod', 'Figma'],
			categories: [
				{
					category: 'Frontend & Frameworks',
					skills: ['Nuxt 4 / 3', 'Vue.js 3 (Composition API)', 'TypeScript', 'UnoCSS & Tailwind CSS', 'Vite', 'Motion One / Motion-v', 'Reka UI / Headless UI'],
				},
				{
					category: 'Backend & Cloud / Edge',
					skills: ['Nitro Engine', 'Cloudflare Pages & Workers', 'Cloudflare D1 (SQLite Edge)', 'Drizzle ORM', 'Nuxt Content v3', 'REST API & Serverless'],
				},
				{
					category: 'Design & Design Engineering',
					skills: ['Figma (Design Tokens, Components, AutoLayout)', 'Golden Ratio Typography Scales', 'Bento Grid System Layouts', 'Accessible Contrast (WCAG 2.2 AAA)', 'Micro-animations'],
				},
				{
					category: 'Tools & Ecosystem',
					skills: ['Bun & pnpm', 'Git & GitHub', 'Nuxt Studio CMS', 'Nuxt SEO & OG Image Satori', 'Nuxt LLMs & MCP Toolkit'],
				},
			],
		}
	},
})
