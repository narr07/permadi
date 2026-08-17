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

// 🛑 Sembunyikan field bawaan Nuxt Content (seo & navigation) di Nuxt Studio UI
const hiddenSeo = property(
	z.object({
		title: z.string().optional(),
		description: z.string().optional(),
	}).optional(),
).editor({ hidden: true })

const hiddenNavigation = property(
	z.union([
		z.boolean(),
		z.object({
			title: z.string().optional(),
			description: z.string().optional(),
			icon: z.string().optional(),
		}),
	]).optional(),
).editor({ hidden: true })

// =========================================================================
// 1. SKEMA KHUSUS BERANDA (HOME) — Urut dari Atas-Kiri ke Bawah-Kanan
// =========================================================================
const homeSchema = z.object({
	seo: hiddenSeo,
	navigation: hiddenNavigation,

	// Header / Intro Paling Atas
	eyebrow: z.string().optional(),
	headline: z.string().optional(),
	description: z.string().optional(),

	// Hero Card Utama (Kiri Atas)
	hero: z.object({
		status: z.string().optional(),
		kicker: z.string().optional(),
		headline: z.string().optional(),
		headline_italic: z.string().optional(),
		headline_suffix: z.string().optional(),
		description: z.string().optional(),
		location: z.string().optional(),
		timezone: z.string().optional(),
		links: z.array(createLinkSchema()).optional(),
	}).optional(),

	// Projek Terpilih (Kanan Atas)
	project_section: z.object({
		label: z.string().optional(),
		fallback_title: z.string().optional(),
		fallback_description: z.string().optional(),
		all_link_text: z.string().optional(),
	}).optional(),

	// Filosofi Bento (Kiri Tengah - Kartu Kuning)
	philosophy: z.object({
		number: z.string().optional(),
		quote: z.string().optional(),
		quote_bold: z.string().optional(),
		label: z.string().optional(),
	}).optional(),

	// Eksplorasi Visual (Tengah)
	explore: z.object({
		label: z.string().optional(),
		text: z.string().optional(),
	}).optional(),

	// Arsip Visual / Galeri (Kanan Tengah)
	archive: z.object({
		label: z.string().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
		link_text: z.string().optional(),
	}).optional(),

	// Tulisan & Catatan Terbaru (Paling Bawah / 12 Kolom Penuh)
	writing: z.object({
		label: z.string().optional(),
		title: z.string().optional(),
		all_link_text: z.string().optional(),
	}).optional(),
})

// =========================================================================
// 2. SKEMA KHUSUS TENTANG (ABOUT)
// =========================================================================
const aboutSchema = z.object({
	seo: hiddenSeo,
	navigation: hiddenNavigation,

	section_label: z.string().optional(),
	headline: z.string().optional(),
	lead: z.string().optional(),
	description: z.string().optional(),

	story_card: z.object({
		label: z.string().optional(),
		title: z.string().optional(),
		lead: z.string().optional(),
		bio: z.string().optional(),
		link_text: z.string().optional(),
	}).optional(),

	toolkit_card: z.object({
		label: z.string().optional(),
		title: z.string().optional(),
		tools: z.array(z.object({
			name: z.string(),
			desc: z.string(),
		})).optional(),
	}).optional(),

	principles: z.array(z.object({
		title: z.string(),
		description: z.string(),
	})).optional(),

	journey: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
	}).optional(),
})

// =========================================================================
// 3. SKEMA KHUSUS KONTAK (CONTACT)
// =========================================================================
const contactSchema = z.object({
	seo: hiddenSeo,
	navigation: hiddenNavigation,

	section_label: z.string().optional(),
	headline: z.string().optional(),
	lead: z.string().optional(),
	description: z.string().optional(),

	email_card: z.object({
		label: z.string().optional(),
		email: z.string().optional(),
		description: z.string().optional(),
		button_text: z.string().optional(),
		meta: z.string().optional(),
	}).optional(),

	status_card: z.object({
		label: z.string().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
		location: z.string().optional(),
		timezone: z.string().optional(),
	}).optional(),

	social_card: z.object({
		label: z.string().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
		items: z.array(z.object({
			name: z.string(),
			url: z.string(),
			icon: z.string().optional(),
		})).optional(),
	}).optional(),

	newsletter_card: z.object({
		label: z.string().optional(),
		title: z.string().optional(),
		description: z.string().optional(),
	}).optional(),
})

// =========================================================================
// 4. SKEMA HEADER HALAMAN DAFTAR (Blog, Projek, Galeri)
// =========================================================================
const catalogSchema = z.object({
	seo: hiddenSeo,
	navigation: hiddenNavigation,

	eyebrow: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
})

export default defineContentConfig({
	collections: {
		// --- 1. BERANDA (HOME) ---
		home_en: defineCollection({
			type: 'page',
			source: 'en/0.index.yml',
			schema: homeSchema,
		}),
		home_id: defineCollection({
			type: 'page',
			source: 'id/0.index.yml',
			schema: homeSchema,
		}),

		// --- 2. TENTANG (ABOUT) ---
		tentang_en: defineCollection({
			type: 'page',
			source: 'en/4.about.yml',
			schema: aboutSchema,
		}),
		tentang_id: defineCollection({
			type: 'page',
			source: 'id/4.tentang.yml',
			schema: aboutSchema,
		}),

		// --- 3. KONTAK (CONTACT) ---
		kontak_en: defineCollection({
			type: 'page',
			source: 'en/5.contact.yml',
			schema: contactSchema,
		}),
		kontak_id: defineCollection({
			type: 'page',
			source: 'id/5.kontak.yml',
			schema: contactSchema,
		}),

		// --- 4. HEADER DAFTAR (Blog, Projek, Galeri) ---
		pages_en: defineCollection({
			type: 'page',
			source: {
				include: 'en/*.yml',
				exclude: ['en/0.index.yml', 'en/4.about.yml', 'en/5.contact.yml'],
			},
			schema: catalogSchema,
		}),
		pages_id: defineCollection({
			type: 'page',
			source: {
				include: 'id/*.yml',
				exclude: ['id/0.index.yml', 'id/4.tentang.yml', 'id/5.kontak.yml'],
			},
			schema: catalogSchema,
		}),

		// --- 5. ARTIKEL BLOG ---
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
				coverAlt: z.string().optional(),
				coverCaption: z.string().optional(),
				draft: z.boolean().default(false),
				featured: z.boolean().default(false),
			}),
		}),
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
				coverAlt: z.string().optional(),
				coverCaption: z.string().optional(),
				draft: z.boolean().default(false),
				featured: z.boolean().default(false),
			}),
		}),

		// --- 6. PROJEK PORTOFOLIO ---
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
				tools: z.array(z.string()).default([]),
				demo: z.string().optional(),
				repo: z.string().optional(),
				cover: z.string().optional(),
				coverAlt: z.string().optional(),
				coverCaption: z.string().optional(),
				draft: z.boolean().default(false),
				featured: z.boolean().default(false),
			}),
		}),
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
				tools: z.array(z.string()).default([]),
				demo: z.string().optional(),
				repo: z.string().optional(),
				cover: z.string().optional(),
				coverAlt: z.string().optional(),
				coverCaption: z.string().optional(),
				draft: z.boolean().default(false),
				featured: z.boolean().default(false),
			}),
		}),
	},
})
