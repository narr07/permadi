import { defineCollection, defineContentConfig, property } from '@nuxt/content'
import { z } from 'zod/v4'

function createLinkSchema() {
	return z.object({
		label: property(z.string()).editor({ label: 'Teks Tombol / Label' }),
		to: property(z.string()).editor({ label: 'Tautan Tujuan (URL/Path)', tooltip: 'Contoh: /projek atau https://github.com' }),
		icon: property(z.string().optional()).editor({ input: 'icon', iconLibraries: ['hugeicons', 'simple-icons'], label: 'Ikon' }),
		trailing: property(z.boolean().optional()).editor({ label: 'Ikon di Kanan' }),
		target: property(z.string().optional()).editor({ label: 'Target', tooltip: '_blank untuk tab baru' }),
		variant: property(z.string().optional()).editor({ label: 'Varian Tombol' }),
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
	eyebrow: property(z.string().optional()).editor({ label: 'Teks Badge / Eyebrow', description: 'Teks kecil di atas headline' }),
	headline: property(z.string().optional()).editor({ label: 'Headline Utama' }),
	description: property(z.string().optional()).editor({ input: 'textarea', label: 'Deskripsi Singkat', description: 'Deskripsi intro beranda' }),

	// Hero Card Utama (Kiri Atas)
	hero: z.object({
		status: property(z.string().optional()).editor({ label: 'Status Ketersediaan', tooltip: 'Contoh: Tersedia untuk Projek Baru' }),
		kicker: property(z.string().optional()).editor({ label: 'Sub-judul Kicker' }),
		headline: property(z.string().optional()).editor({ label: 'Headline Hero' }),
		headline_italic: property(z.string().optional()).editor({ label: 'Kata Bercetak Miring' }),
		headline_suffix: property(z.string().optional()).editor({ label: 'Akhiran Headline' }),
		description: property(z.string().optional()).editor({ input: 'textarea', label: 'Deskripsi Hero Card' }),
		location: property(z.string().optional()).editor({ label: 'Lokasi' }),
		timezone: property(z.string().optional()).editor({ label: 'Zona Waktu' }),
		links: z.array(createLinkSchema()).optional(),
	}).optional(),

	// Projek Terpilih (Kanan Atas)
	project_section: z.object({
		label: property(z.string().optional()).editor({ label: 'Label Bagian' }),
		fallback_title: property(z.string().optional()).editor({ label: 'Judul Cadangan' }),
		fallback_description: property(z.string().optional()).editor({ input: 'textarea', label: 'Deskripsi Cadangan' }),
		all_link_text: property(z.string().optional()).editor({ label: 'Teks Link Lihat Semua' }),
	}).optional(),

	// Filosofi Bento (Kiri Tengah - Kartu Kuning)
	philosophy: z.object({
		number: property(z.string().optional()).editor({ label: 'Nomor Urut', tooltip: 'Contoh: 01' }),
		quote: property(z.string().optional()).editor({ input: 'textarea', label: 'Kutipan / Filosofi' }),
		quote_bold: property(z.string().optional()).editor({ label: 'Bagian Kutipan yang Tebal' }),
		label: property(z.string().optional()).editor({ label: 'Label Kartu' }),
	}).optional(),

	// Eksplorasi Visual (Tengah)
	explore: z.object({
		label: property(z.string().optional()).editor({ label: 'Label Eksplorasi' }),
		text: property(z.string().optional()).editor({ input: 'textarea', label: 'Teks Eksplorasi' }),
	}).optional(),

	// Arsip Visual / Galeri (Kanan Tengah)
	archive: z.object({
		label: property(z.string().optional()).editor({ label: 'Label Galeri' }),
		title: property(z.string().optional()).editor({ label: 'Judul Galeri' }),
		description: property(z.string().optional()).editor({ input: 'textarea', label: 'Deskripsi Galeri' }),
		link_text: property(z.string().optional()).editor({ label: 'Teks Tautan Galeri' }),
	}).optional(),

	// Tulisan & Catatan Terbaru (Paling Bawah / 12 Kolom Penuh)
	writing: z.object({
		label: property(z.string().optional()).editor({ label: 'Label Tulisan' }),
		title: property(z.string().optional()).editor({ label: 'Judul Bagian Blog' }),
		all_link_text: property(z.string().optional()).editor({ label: 'Teks Link Semua Artikel' }),
	}).optional(),
})

// =========================================================================
// 2. SKEMA KHUSUS TENTANG (ABOUT)
// =========================================================================
const aboutSchema = z.object({
	seo: hiddenSeo,
	navigation: hiddenNavigation,

	section_label: property(z.string().optional()).editor({ label: 'Label Halaman' }),
	headline: property(z.string().optional()).editor({ label: 'Headline Halaman' }),
	lead: property(z.string().optional()).editor({ input: 'textarea', label: 'Teks Pembuka (Lead)' }),
	description: property(z.string().optional()).editor({ input: 'textarea', label: 'Deskripsi Lengkap' }),

	story_card: z.object({
		label: property(z.string().optional()).editor({ label: 'Label Cerita' }),
		title: property(z.string().optional()).editor({ label: 'Judul Cerita' }),
		lead: property(z.string().optional()).editor({ input: 'textarea', label: 'Lead Cerita' }),
		bio: property(z.string().optional()).editor({ input: 'textarea', label: 'Biografi Singkat' }),
		link_text: property(z.string().optional()).editor({ label: 'Teks Link' }),
	}).optional(),

	toolkit_card: z.object({
		label: property(z.string().optional()).editor({ label: 'Label Toolkit' }),
		title: property(z.string().optional()).editor({ label: 'Judul Toolkit' }),
		tools: z.array(z.object({
			name: property(z.string()).editor({ label: 'Nama Tool/Teknologi' }),
			desc: property(z.string()).editor({ label: 'Keterangan Singkat' }),
		})).optional(),
	}).optional(),

	principles: z.array(z.object({
		title: property(z.string()).editor({ label: 'Judul Prinsip' }),
		description: property(z.string()).editor({ input: 'textarea', label: 'Penjelasan Prinsip' }),
	})).optional(),

	journey: z.object({
		title: property(z.string().optional()).editor({ label: 'Judul Perjalanan' }),
		description: property(z.string().optional()).editor({ input: 'textarea', label: 'Deskripsi Perjalanan' }),
	}).optional(),
})

// =========================================================================
// 3. SKEMA KHUSUS KONTAK (CONTACT)
// =========================================================================
const contactSchema = z.object({
	seo: hiddenSeo,
	navigation: hiddenNavigation,

	section_label: property(z.string().optional()).editor({ label: 'Label Halaman' }),
	headline: property(z.string().optional()).editor({ label: 'Headline Kontak' }),
	lead: property(z.string().optional()).editor({ input: 'textarea', label: 'Teks Pembuka (Lead)' }),
	description: property(z.string().optional()).editor({ input: 'textarea', label: 'Deskripsi Kontak' }),

	email_card: z.object({
		label: property(z.string().optional()).editor({ label: 'Label Kartu Email' }),
		email: property(z.string().optional()).editor({ label: 'Alamat Email' }),
		description: property(z.string().optional()).editor({ input: 'textarea', label: 'Deskripsi Email' }),
		button_text: property(z.string().optional()).editor({ label: 'Teks Tombol Email' }),
		meta: property(z.string().optional()).editor({ label: 'Keterangan Tambahan' }),
	}).optional(),

	status_card: z.object({
		label: property(z.string().optional()).editor({ label: 'Label Status' }),
		title: property(z.string().optional()).editor({ label: 'Judul Status' }),
		description: property(z.string().optional()).editor({ input: 'textarea', label: 'Deskripsi Status' }),
		location: property(z.string().optional()).editor({ label: 'Lokasi' }),
		timezone: property(z.string().optional()).editor({ label: 'Zona Waktu' }),
	}).optional(),

	social_card: z.object({
		label: property(z.string().optional()).editor({ label: 'Label Media Sosial' }),
		title: property(z.string().optional()).editor({ label: 'Judul Media Sosial' }),
		description: property(z.string().optional()).editor({ input: 'textarea', label: 'Deskripsi' }),
		items: z.array(z.object({
			name: property(z.string()).editor({ label: 'Nama Jejaring' }),
			url: property(z.string()).editor({ label: 'Tautan URL' }),
			icon: property(z.string().optional()).editor({ input: 'icon', iconLibraries: ['hugeicons', 'simple-icons'], label: 'Ikon' }),
		})).optional(),
	}).optional(),

	newsletter_card: z.object({
		label: property(z.string().optional()).editor({ label: 'Label Newsletter' }),
		title: property(z.string().optional()).editor({ label: 'Judul Newsletter' }),
		description: property(z.string().optional()).editor({ input: 'textarea', label: 'Deskripsi Newsletter' }),
	}).optional(),
})

// =========================================================================
// 4. SKEMA HEADER HALAMAN DAFTAR (Blog, Projek, Galeri)
// =========================================================================
const catalogSchema = z.object({
	seo: hiddenSeo,
	navigation: hiddenNavigation,

	eyebrow: property(z.string().optional()).editor({ label: 'Teks Badge / Eyebrow' }),
	title: property(z.string().optional()).editor({ label: 'Judul Halaman' }),
	description: property(z.string().optional()).editor({ input: 'textarea', label: 'Deskripsi Halaman' }),
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
				category: property(z.enum(['edu', 'tech', 'art']).optional()).editor({
					label: 'Kategori / Category',
					tooltip: 'edu (Pendidikan / Education), tech (Teknologi / Technology), art (Seni / Art)',
				}),
				date: property(z.date()).editor({ label: 'Publication Date', description: 'Choose the article publication date' }),
				tags: property(z.array(z.string()).default([])).editor({ label: 'Tags & Topics', description: 'Add tags for classification' }),
			}),
			indexes: [
				{ columns: ['date'] },
				{ columns: ['idBlog'] },
				{ columns: ['category'] },
			],
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
				category: property(z.enum(['edu', 'tech', 'art']).optional()).editor({
					label: 'Kategori / Category',
					tooltip: 'edu (Pendidikan / Education), tech (Teknologi / Technology), art (Seni / Art)',
				}),
				date: property(z.date()).editor({ label: 'Tanggal Publikasi', description: 'Pilih tanggal rilis artikel' }),
				tags: property(z.array(z.string()).default([])).editor({ label: 'Tag & Topik', description: 'Daftar topik pembahasan artikel' }),
			}),
			indexes: [
				{ columns: ['date'] },
				{ columns: ['idBlog'] },
				{ columns: ['category'] },
			],
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
				category: property(z.enum(['web', 'mobile', 'design']).optional()).editor({
					label: 'Kategori / Category',
					tooltip: 'web (Web App), mobile (Mobile App), design (Desain / Design)',
				}),
				date: property(z.date()).editor({ label: 'Release Date', description: 'Pick launch / release date' }),
				tags: property(z.array(z.string()).default([])).editor({ label: 'Technologies & Tags', description: 'List of tech stack and tags' }),
				image: property(z.string()).editor({ input: 'media', label: 'Primary Thumbnail', description: 'Main project cover image' }).optional(),
				images: property(z.array(property(z.string()).editor({ input: 'media', label: 'Screenshot Image' }))).editor({
					label: 'Gallery & Screenshots',
					description: 'Screenshot images for the Bento showcase gallery',
				}).default([]),
				link: property(z.string().optional()).editor({ label: 'Live Demo URL', tooltip: 'URL to live website or interactive demo' }),
				repo: property(z.string().optional()).editor({ label: 'GitHub Repository URL', tooltip: 'Source code repository link on GitHub' }),
			}),
			indexes: [
				{ columns: ['date'] },
				{ columns: ['idProjek'] },
				{ columns: ['category'] },
			],
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
				category: property(z.enum(['web', 'mobile', 'design']).optional()).editor({
					label: 'Kategori / Category',
					tooltip: 'web (Web App), mobile (Mobile App), design (Desain / Design)',
				}),
				date: property(z.date()).editor({ label: 'Tanggal Rilis', description: 'Pilih tanggal peluncuran projek' }),
				tags: property(z.array(z.string()).default([])).editor({ label: 'Teknologi & Tag', description: 'Daftar teknologi yang digunakan' }),
				image: property(z.string()).editor({ input: 'media', label: 'Thumbnail Utama', description: 'Gambar cover utama projek' }).optional(),
				images: property(z.array(property(z.string()).editor({ input: 'media', label: 'Gambar Screenshot' }))).editor({
					label: 'Galeri Tangkapan Layar',
					description: 'Koleksi tangkapan layar untuk showcase Bento gallery',
				}).default([]),
				link: property(z.string().optional()).editor({ label: 'Tautan Live Demo (URL)', tooltip: 'URL website atau demo langsung yang bisa dikunjungi' }),
				repo: property(z.string().optional()).editor({ label: 'Repository GitHub (Source Code)', tooltip: 'URL repositori source code di GitHub' }),
			}),
			indexes: [
				{ columns: ['date'] },
				{ columns: ['idProjek'] },
				{ columns: ['category'] },
			],
		}),
	},
})
