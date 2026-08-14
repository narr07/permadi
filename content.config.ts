import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
	collections: {
		// Halaman statis utama (misal index, tentang, kontak)
		pages: defineCollection({
			type: 'page',
			source: {
				include: '*.md',
			},
			schema: z.object({
				hero: z
					.object({
						name: z.string().optional(),
						title: z.string().optional(),
						description: z.string().optional(),
						avatar: z.string().optional(),
					})
					.optional(),
			}),
		}),

		// Artikel Blog / Tulisan
		blog: defineCollection({
			type: 'page',
			source: {
				include: 'blog/**',
			},
			schema: z.object({
				date: z.string(),
				tags: z.array(z.string()).default([]),
				cover: z.string().optional(),
				aspectRatio: z.string().default('aspect-article'),
				readTime: z.string().optional(),
				featured: z.boolean().default(false),
			}),
		}),

		// Portofolio / Studi Kasus Proyek
		projek: defineCollection({
			type: 'page',
			source: {
				include: 'projek/**',
			},
			schema: z.object({
				date: z.string(),
				tags: z.array(z.string()).default([]),
				image: z.string().optional(),
				aspectRatio: z.string().default('aspect-video'),
				featured: z.boolean().default(false),
				demoUrl: z.string().optional(),
				githubUrl: z.string().optional(),
			}),
		}),

		// Galeri foto & cuplikan desain
		galeri: defineCollection({
			type: 'data',
			source: {
				include: 'galeri/**',
			},
			schema: z.object({
				title: z.string(),
				description: z.string().optional(),
				image: z.string(),
				aspectRatio: z.enum([
					'aspect-profile',
					'aspect-video',
					'aspect-article',
					'aspect-thumbnail',
					'aspect-photo',
				]).default('aspect-photo'),
				category: z.string().optional(),
				date: z.string().optional(),
				order: z.number().default(0),
			}),
		}),

		// Data profil, tech stack, dan tautan sosial
		data: defineCollection({
			type: 'data',
			source: {
				include: 'data/**',
			},
			schema: z.record(z.string(), z.any()),
		}),
	},
})
