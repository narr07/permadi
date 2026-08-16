import { defineCollection, defineContentConfig, property } from '@nuxt/content'
import { z } from 'zod'

function createLinkSchema() {
	return z.object({
		label: z.string(),
		to: z.string(),
		icon: z.string().optional(),
		trailing: z.boolean().optional(),
		target: z.string().optional(),
		variant: z.string().optional(),
	})
}

const pageSchema = z.object({
	// Sembunyikan field bawaan Nuxt Content (seo & navigation) di Studio UI menggunakan helper property()
	seo: property(
		z
			.object({
				title: z.string().optional(),
				description: z.string().optional(),
			})
			.optional(),
	).editor({ hidden: true }),

	navigation: property(
		z
			.union([
				z.boolean(),
				z.object({
					title: z.string().optional(),
					description: z.string().optional(),
					icon: z.string().optional(),
				}),
			])
			.optional(),
	).editor({ hidden: true }),

	// Field terstruktur halaman utama & kontak
	eyebrow: z.string().optional(),
	section_label: z.string().optional(),
	headline: z.string().optional(),
	subheadline: z.string().optional(),
	lead: z.string().optional(),
	bio: z.string().optional(),
	email_card: z
		.object({
			label: z.string().optional(),
			email: z.string().optional(),
			description: z.string().optional(),
			button_text: z.string().optional(),
			meta: z.string().optional(),
		})
		.optional(),
	status_card: z
		.object({
			label: z.string().optional(),
			title: z.string().optional(),
			description: z.string().optional(),
			location: z.string().optional(),
			timezone: z.string().optional(),
		})
		.optional(),
	social_card: z
		.object({
			label: z.string().optional(),
			title: z.string().optional(),
			description: z.string().optional(),
			items: z
				.array(
					z.object({
						name: z.string(),
						url: z.string(),
						icon: z.string().optional(),
					}),
				)
				.optional(),
		})
		.optional(),
	newsletter_card: z
		.object({
			label: z.string().optional(),
			title: z.string().optional(),
			description: z.string().optional(),
		})
		.optional(),
	hero: z
		.object({
			name: z.string().optional(),
			title: z.string().optional(),
			status: z.string().optional(),
			kicker: z.string().optional(),
			headline: z.string().optional(),
			headline_italic: z.string().optional(),
			headline_suffix: z.string().optional(),
			description: z.string().optional(),
			avatar: z.string().optional(),
			location: z.string().optional(),
			timezone: z.string().optional(),
			links: z.array(createLinkSchema()).optional(),
		})
		.optional(),
	project_section: z
		.object({
			label: z.string().optional(),
			fallback_title: z.string().optional(),
			fallback_description: z.string().optional(),
			all_link_text: z.string().optional(),
		})
		.optional(),
	philosophy: z
		.object({
			number: z.string().optional(),
			quote: z.string().optional(),
			quote_bold: z.string().optional(),
			label: z.string().optional(),
		})
		.optional(),
	principles: z
		.array(
			z.object({
				title: z.string(),
				description: z.string(),
			}),
		)
		.optional(),
	journey: z
		.object({
			title: z.string().optional(),
			description: z.string().optional(),
		})
		.optional(),
	story_card: z
		.object({
			label: z.string().optional(),
			title: z.string().optional(),
			lead: z.string().optional(),
			bio: z.string().optional(),
			link_text: z.string().optional(),
		})
		.optional(),
	toolkit_card: z
		.object({
			label: z.string().optional(),
			title: z.string().optional(),
			tools: z
				.array(
					z.object({
						name: z.string(),
						desc: z.string(),
					}),
				)
				.optional(),
		})
		.optional(),
	channels: z.record(z.string(), z.string()).optional(),
	explore: z
		.object({
			label: z.string().optional(),
			text: z.string().optional(),
		})
		.optional(),
	archive: z
		.object({
			label: z.string().optional(),
			title: z.string().optional(),
			description: z.string().optional(),
			link_text: z.string().optional(),
		})
		.optional(),
	writing: z
		.object({
			label: z.string().optional(),
			title: z.string().optional(),
			all_link_text: z.string().optional(),
		})
		.optional(),
})

export default defineContentConfig({
	collections: {
		// Halaman utama EN (/en, /en/blog, /en/projects, /en/gallery, /en/about, /en/contact)
		pages_en: defineCollection({
			type: 'page',
			source: {
				include: 'en/*.yml',
				prefix: '/en',
			},
			schema: pageSchema,
		}),

		// Halaman utama ID (/id, /id/blog, /id/projek, /id/galeri, /id/tentang, /id/kontak)
		pages_id: defineCollection({
			type: 'page',
			source: {
				include: 'id/*.yml',
				prefix: '/id',
			},
			schema: pageSchema,
		}),

		// Blog EN
		blog_en: defineCollection({
			type: 'page',
			source: {
				include: 'en/blog/**',
				prefix: '/en/blog',
			},
			schema: z.object({
				seo: property(z.any().optional()).editor({ hidden: true }),
				navigation: property(z.any().optional()).editor({ hidden: true }),
				idItem: property(z.number().optional()).editor({ hidden: true }),
				idBlog: property(z.number().optional()).editor({ hidden: true }),
				readingTime: property(z.number().optional()).editor({ hidden: true }),
				slug: property(z.string().optional()).editor({ hidden: true }),
				plainText: property(z.string().optional()).editor({ hidden: true }),
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
				seo: property(z.any().optional()).editor({ hidden: true }),
				navigation: property(z.any().optional()).editor({ hidden: true }),
				idItem: property(z.number().optional()).editor({ hidden: true }),
				idBlog: property(z.number().optional()).editor({ hidden: true }),
				readingTime: property(z.number().optional()).editor({ hidden: true }),
				slug: property(z.string().optional()).editor({ hidden: true }),
				plainText: property(z.string().optional()).editor({ hidden: true }),
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
				seo: property(z.any().optional()).editor({ hidden: true }),
				navigation: property(z.any().optional()).editor({ hidden: true }),
				idItem: property(z.number().optional()).editor({ hidden: true }),
				idProjek: property(z.number().optional()).editor({ hidden: true }),
				readingTime: property(z.number().optional()).editor({ hidden: true }),
				slug: property(z.string().optional()).editor({ hidden: true }),
				plainText: property(z.string().optional()).editor({ hidden: true }),
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
				seo: property(z.any().optional()).editor({ hidden: true }),
				navigation: property(z.any().optional()).editor({ hidden: true }),
				idItem: property(z.number().optional()).editor({ hidden: true }),
				idProjek: property(z.number().optional()).editor({ hidden: true }),
				readingTime: property(z.number().optional()).editor({ hidden: true }),
				slug: property(z.string().optional()).editor({ hidden: true }),
				plainText: property(z.string().optional()).editor({ hidden: true }),
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
