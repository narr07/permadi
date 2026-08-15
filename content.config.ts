import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
	collections: {
		// Halaman utama EN (/en, /en/blog, /en/projects, /en/gallery, /en/about, /en/contact)
		pages_en: defineCollection({
			type: 'page',
			source: {
				include: 'en/*.md',
				prefix: '/en',
			},
			schema: z.object({
				plainText: z.string().optional(),
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

		// Halaman utama ID (/id, /id/blog, /id/projek, /id/galeri, /id/tentang, /id/kontak)
		pages_id: defineCollection({
			type: 'page',
			source: {
				include: 'id/*.md',
				prefix: '/id',
			},
			schema: z.object({
				plainText: z.string().optional(),
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

		// Blog EN
		blog_en: defineCollection({
			type: 'page',
			source: {
				include: 'en/blog/**',
				prefix: '/en/blog',
			},
			schema: z.object({
				idItem: z.number().optional(),
				idBlog: z.number().optional(),
				readingTime: z.number().optional(),
				slug: z.string().optional(),
				plainText: z.string().optional(),
				category: z.string().optional(),
				date: z.union([z.string(), z.date()]).transform(d => typeof d === 'string' ? d : d.toISOString().split('T')[0]).default('2025-01-01'),
				tags: z.array(z.string()).default([]),
				cover: z.string().optional(),
				aspectRatio: z.string().default('aspect-article'),
				readTime: z.string().optional(),
				featured: z.boolean().default(false),
			}),
		}),

		// Blog ID
		blog_id: defineCollection({
			type: 'page',
			source: {
				include: 'id/blog/**',
				prefix: '/id/blog',
			},
			schema: z.object({
				idItem: z.number().optional(),
				idBlog: z.number().optional(),
				readingTime: z.number().optional(),
				slug: z.string().optional(),
				plainText: z.string().optional(),
				category: z.string().optional(),
				date: z.union([z.string(), z.date()]).transform(d => typeof d === 'string' ? d : d.toISOString().split('T')[0]).default('2025-01-01'),
				tags: z.array(z.string()).default([]),
				cover: z.string().optional(),
				aspectRatio: z.string().default('aspect-article'),
				readTime: z.string().optional(),
				featured: z.boolean().default(false),
			}),
		}),

		// Projects EN
		projek_en: defineCollection({
			type: 'page',
			source: {
				include: 'en/projects/**',
				prefix: '/en/projects',
			},
			schema: z.object({
				idItem: z.number().optional(),
				idProjek: z.number().optional(),
				readingTime: z.number().optional(),
				slug: z.string().optional(),
				plainText: z.string().optional(),
				category: z.string().optional(),
				date: z.union([z.string(), z.date()]).transform(d => typeof d === 'string' ? d : d.toISOString().split('T')[0]).default('2025-01-01'),
				tags: z.array(z.string()).default([]),
				tech: z.array(z.string()).optional(),
				image: z.string().optional(),
				images: z.array(z.string()).optional(),
				aspectRatio: z.string().default('aspect-video'),
				featured: z.boolean().default(false),
				demoUrl: z.string().optional(),
				link: z.string().optional(),
				githubUrl: z.string().optional(),
				repo: z.string().optional(),
			}),
		}),

		// Projek ID
		projek_id: defineCollection({
			type: 'page',
			source: {
				include: 'id/projek/**',
				prefix: '/id/projek',
			},
			schema: z.object({
				idItem: z.number().optional(),
				idProjek: z.number().optional(),
				readingTime: z.number().optional(),
				slug: z.string().optional(),
				plainText: z.string().optional(),
				category: z.string().optional(),
				date: z.union([z.string(), z.date()]).transform(d => typeof d === 'string' ? d : d.toISOString().split('T')[0]).default('2025-01-01'),
				tags: z.array(z.string()).default([]),
				tech: z.array(z.string()).optional(),
				image: z.string().optional(),
				images: z.array(z.string()).optional(),
				aspectRatio: z.string().default('aspect-video'),
				featured: z.boolean().default(false),
				demoUrl: z.string().optional(),
				link: z.string().optional(),
				githubUrl: z.string().optional(),
				repo: z.string().optional(),
			}),
		}),

		// Galeri foto & cuplikan visual
		galeri: defineCollection({
			type: 'data',
			source: {
				include: 'galeri/**',
			},
			schema: z.object({
				title: z.string(),
				title_en: z.string().optional(),
				description: z.string().optional(),
				description_en: z.string().optional(),
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
