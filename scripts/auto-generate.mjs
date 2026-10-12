#!/usr/bin/env node

/**
 * Auto-Generate Blog Articles (Bilingual ID & EN)
 * Powered by Gemini API & Google Trends with artikelgen standards.
 *
 * FITUR KEAMANAN & KUALITAS:
 * 1. Targeted Trends: Hanya meriset Google Trends berdasarkan kata kunci pilar (edu, art, tech), BUKAN trending harian acak (bola/gosip).
 * 2. Strict Topic Guardrail: Memfilter kata-kata terlarang dan memvalidasi kesesuaian kategori.
 * 3. Human-Grade Editorial: Mengikuti standar artikelgen (BLUF, anti-slop, E-E-A-T, no intro klise).
 *
 * Usage:
 *   node scripts/auto-generate.mjs
 *   node scripts/auto-generate.mjs --dry-run
 *   node scripts/auto-generate.mjs --category tech
 *   node scripts/auto-generate.mjs --topic "Panduan Nuxt 4 Server Components"
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// Auto-load .env if GEMINI_API_KEY is not already set
if (!process.env.GEMINI_API_KEY) {
	const envPath = path.join(rootDir, '.env')
	if (fs.existsSync(envPath)) {
		try {
			if (typeof process.loadEnvFile === 'function') {
				process.loadEnvFile(envPath)
			}
			else {
				const envContent = fs.readFileSync(envPath, 'utf8')
				for (const line of envContent.split(/\r?\n/)) {
					const [k, ...v] = line.split('=')
					if (k?.trim() === 'GEMINI_API_KEY') {
						process.env.GEMINI_API_KEY = v.join('=').trim()
					}
				}
			}
		}
		catch {
			// ignore
		}
	}
}

const CONTENT_ID_DIR = path.join(rootDir, 'content', 'id', 'blog')
const CONTENT_EN_DIR = path.join(rootDir, 'content', 'en', 'blog')
const PUBLIC_ARTICLE_DIR = path.join(rootDir, 'public', 'article')

const CATEGORIES = ['edu', 'art', 'tech']

// Parse CLI flags
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const categoryArgIdx = args.indexOf('--category')
const cliCategory = categoryArgIdx !== -1 ? args[categoryArgIdx + 1] : process.env.OVERRIDE_CATEGORY
const topicArgIdx = args.indexOf('--topic')
const cliTopic = topicArgIdx !== -1 ? args[topicArgIdx + 1] : process.env.OVERRIDE_TOPIC

// Kata kunci jangkar pilar situs untuk pencarian tren terarah di Google
const CATEGORY_ANCHORS = {
	edu: [
		'model pembelajaran inovatif',
		'kurikulum merdeka sd',
		'teori belajar pedagogi',
		'pembelajaran berdiferensiasi',
		'deep learning kurikulum merdeka',
		'asesmen formatif dan sumatif',
		'metode accelerated learning',
		'sintaks problem based learning',
		'sintaks project based learning',
		'discovery learning inkuiri',
		'media pembelajaran interaktif',
		'manajemen kelas sekolah dasar',
		'taksonomi bloom revisi',
		'pembelajaran berbasis steam',
		'modul ajar kurikulum merdeka',
	],
	art: [
		'teori warna desain',
		'teori desain grafis',
		'design trend ui ux',
		'prinsip gestalt desain',
		'psikologi warna branding',
		'swiss style design',
		'tipografi web font',
		'desain antarmuka ui',
		'grid system modular',
		'hierarki visual website',
		'golden ratio desain',
		'desain aksesibilitas kontras',
		'bento grid design',
		'micro interaction ui',
	],
	tech: [
		'nuxt js',
		'unocss',
		'nextjs',
		'tailwind css',
		'nuxt content',
		'nuxt ui',
		'vue 3',
		'flutter dart',
		'python tutorial',
		'rust programming',
		'tauri app',
		'cloudflare workers',
		'modern web performance',
		'edge serverless',
		'core web vitals nuxt',
	],
}

// Kata-kata terlarang (Blacklist) untuk mencegah topik sampah/gosip/clickbait/unduhan
const BLACKLIST_WORDS = [
	'gaji',
	'lirik',
	'chord',
	'koleksi',
	'download',
	'crack',
	'bocor',
	'link',
	'viral',
	'skandal',
	'kasus',
	'artis',
	'pacar',
	'menikah',
	'polisi',
	'terbaru 2024',
	'login',
	'daftar',
	'lowongan',
	'jadwal libur',
	'kartu prakerja',
	'pdf',
	'docx',
	'doc',
	'ppt',
	'soal',
	'kunci jawaban',
	'unduh',
	'rpp 1 lembar',
]

// Fallback seed topics terverifikasi sesuai pilar permadi.dev
const TOPIC_SEEDS = {
	edu: [
		'Penerapan Model Pembelajaran Berdiferensiasi di Kelas Sekolah Dasar',
		'Strategi Flipped Classroom Efektif untuk Meningkatkan Keaktifan Belajar',
		'Integrasi Asesmen Diagnostik Awal dalam Kurikulum Merdeka Belajar',
		'Metode Blended Learning Praktis untuk Pembelajaran Kolaboratif Abad 21',
		'Pengembangan Media Pembelajaran Interaktif Berbasis Gamifikasi di Kelas',
		'Teknik Refleksi Pembelajaran Bermakna Guru dan Murid di Sekolah Dasar',
		'Implementasi Sintaks Project Based Learning PjBL pada Fase Fondasi dan Lanjutan',
		'Sintaks Problem Based Learning PBL untuk Mengasah Keterampilan Berpikir Kritis',
		'Penerapan Teori Belajar Konstruktivisme Vygotsky dan Zone of Proximal Development',
		'Pendekatan Deep Learning dalam Kurikulum Merdeka untuk Penguasaan Konsep Mendalam',
		'Panduan Menyusun Asesmen Formatif yang Autentik Tanpa Beban Administrasi Berlebih',
		'Strategi Accelerated Learning untuk Mengoptimalkan Daya Ingat dan Retensi Siswa',
		'Penerapan Model Pembelajaran Inquiry dan Discovery Learning di Kelas Sains',
		'Optimalisasi Taksonomi Bloom Revisi dalam Perumusan Tujuan Pembelajaran TP dan ATP',
		'Strategi Cooperative Learning Tipe Jigsaw dan STAD untuk Kerjasama Tim Siswa',
		'Pembelajaran Berbasis STEAM Menggunakan Bahan Terbuka Loose Parts di Sekolah',
		'Manajemen Kelas Positif Disiplin Positif Restitusi untuk Mengatasi Konflik Murid',
		'Integrasi Profil Pelajar Pancasila P5 dalam Proyek Pembelajaran Kontekstual',
		'Teknik Ice Breaking Edukatif Berbasis Gerak dan Lagu untuk Mengembalikan Fokus Siswa',
		'Penyusunan Modul Ajar Kurikulum Merdeka yang Efektif dan Berpusat pada Murid',
	],
	art: [
		'Penerapan Teori Warna HSL dan Palet Harmonik dalam Desain Antarmuka Web Modern',
		'Prinsip Desain Gestalt dan Pengaruhnya terhadap Pola Keputusan Pengguna UI',
		'Evolusi Design Trend dari Skeuomorphism Menuju Bento Grid dan Neo Brutalism',
		'Penerapan Rasio Emas Golden Ratio 1.618 dalam Tipografi dan Layout Modular',
		'Filosofi Swiss Style Desain Grafis Grid Sistem Asimetris dan Keterbacaan Visual',
		'Prinsip Hirarki Visual dan Penggunaan Whitespace untuk Memandu Alur Pandang Mata',
		'Psikologi Warna dalam Identitas Brand Personality dan Peningkatan Konversi Aplikasi',
		'Panduan Memilih Font Pairing Serif dan Sans Serif untuk Keterbacaan Layar Optimal',
		'Standar Aksesibilitas Desain Web WCAG 2.1 untuk Kontras Warna dan Ukuran Font',
		'Desain Sistem Berbasis Token Warna dan Tipografi Skalabel untuk Tim Desain',
		'Eksplorasi Tipografi Neo-Grotesque dan Karakteristik Font Helvetica Akzidenz Grotesk',
		'Anatomi Tipografi Digital dari Kerning Tracking Leading Hingga X-Height Huruf',
		'Penerapan Sistem Grid Modular 12 Kolom pada Desain Web Responsif Multi-Device',
		'Desain Antarmuka Minimalis Menghilangkan Elemen Dekoratif yang Membebani Kognitif',
		'Tren Desain Bento Grid Cara Mengorganisir Informasi Kompleks Menjadi Kartu Visual',
		'Teori Kontras Simultan dan Interaksi Warna dalam Desain Komponen UI Mode Gelap',
		'Peran Mikro Interaksi dan Feedback Visual dalam Membangun Rasa Kendali Pengguna',
		'Psikologi Bentuk Geometris Lingkaran Kotak Segitiga dalam Desain Ikon dan Logo',
		'Penerapan Komposisi Rule of Thirds dan Dinamika Visual pada Desain Poster Editorial',
		'Panduan Transisi Mode Gelap Dark Mode Menggunakan Nilai Saturation dan Lightness HSL',
	],
	tech: [
		'Arsitektur Aplikasi Desktop Modern Menggunakan Tauri 2.0 dan Frontend Vue 3',
		'Manajemen State dan Optimalisasi Kinerja Rendering pada Aplikasi Flutter dan Dart',
		'Pengembangan Alat CLI Otomasi dan Scripting Cepat Berbasis Python di Terminal',
		'Dasar Manajemen Memori Ownership dan Borrowing di Rust untuk Developer Web',
		'Optimalisasi Performa Core Web Vitals LCP INP CLS pada Framework Nuxt 4',
		'Arsitektur Edge Serverless Menggunakan Cloudflare D1 SQLite dan NuxtHub Core',
		'Panduan Migrasi TypeScript Strict Mode pada Basis Kode Vue 3 Composition API',
		'Manajemen State Reaktif Skalabel Menggunakan Pinia pada Skala Aplikasi Besar',
		'Strategi Caching dan Edge Routing Cepat untuk Website Statis dan SSG',
		'Integrasi Nuxt Content v3 untuk Pengelolaan Dokumentasi Berbasis Basis Data Lokal',
		'Mengoptimalkan Ukuran CSS Bundle Menggunakan UnoCSS Engine Dibanding Tailwind Bawaan',
		'Membangun Antarmuka Komponen Aksesibel Menggunakan Nuxt UI v3 dan Tailwind Variants',
		'Konfigurasi Cross-Platform Flutter untuk Android Desktop dan Web dalam Satu Basis Kode',
		'Pembuatan REST API Cepat dan Tervalidasi Menggunakan Python FastAPI dan Pydantic',
		'Ekosistem Cargo dan Kompilasi Multi-Platform Binary Ringan Menggunakan Rust',
		'Implementasi Server-Side Rendering SSR dan Hybrid Rendering Nitro di Lingkungan Cloudflare',
		'Panduan Penggunaan VueUse Composables Terbaik untuk Mempercepat Pengembangan Nuxt',
		'Strategi Optimasi Gambar Web Modern Menggunakan Format AVIF dan WebP Responsif',
		'Integrasi Database SQLite Drizzle ORM pada Lingkungan Edge Worker Tanpa Server',
		'Mengamankan Aplikasi Web Edge dari Bot dan Serangan DDoS dengan Cloudflare Turnstile',
	],
}

// Category fallback cover image mapping
const FALLBACK_COVERS = {
	edu: 'belajar.webp',
	art: 'swiss-style-design.webp',
	tech: 'backend-edge-serverless.webp',
	default: 'depan-laptop.webp',
}

/**
 * 1. Find next article number and auto-rotate category
 */
function getNextArticleInfo(targetCategory) {
	if (!fs.existsSync(CONTENT_ID_DIR)) {
		throw new Error(`Directory not found: ${CONTENT_ID_DIR}`)
	}

	const files = fs.readdirSync(CONTENT_ID_DIR).filter(f => f.endsWith('.md'))

	let maxNumber = 0
	let lastCategory = 'tech'

	for (const file of files) {
		const match = file.match(/^(\d+)\.(.+)\.md$/)
		if (match) {
			const num = parseInt(match[1], 10)
			if (num > maxNumber) {
				maxNumber = num
				// Read category from the latest file
				try {
					const content = fs.readFileSync(path.join(CONTENT_ID_DIR, file), 'utf8')
					const catMatch = content.match(/category:\s*([a-zA-Z]+)/)
					if (catMatch) {
						lastCategory = catMatch[1].toLowerCase()
					}
				}
				catch {
					// ignore
				}
			}
		}
	}

	const nextNumber = maxNumber + 1

	let category = targetCategory
	if (!category || category === 'auto' || !CATEGORIES.includes(category)) {
		// Rotate: edu -> art -> tech -> edu
		const lastIndex = CATEGORIES.indexOf(lastCategory)
		const nextIndex = (lastIndex + 1) % CATEGORIES.length
		category = CATEGORIES[nextIndex]
	}

	return { nextNumber, category, lastCategory }
}

/**
 * 2. Fetch Targeted Google Search Trends for Specific Category
 */
async function fetchTargetedTrends(category) {
	const anchors = CATEGORY_ANCHORS[category] || CATEGORY_ANCHORS.tech
	// Acak salah satu kata kunci jangkar pilar
	const randomAnchor = anchors[Math.floor(Math.random() * anchors.length)]

	try {
		console.log(`[Trends] Querying Google Suggest trends for anchor: "${randomAnchor}"...`)
		const url = `https://suggestqueries.google.com/complete/search?client=chrome&hl=id&gl=ID&q=${encodeURIComponent(randomAnchor)}`
		const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(5000) })

		if (response.ok) {
			const data = await response.json()
			const queries = data?.[1] || []

			// Filter query yang bersih dan relevan
			const validQueries = queries.filter((q) => {
				const lower = q.toLowerCase()
				// Tidak boleh memuat kata blacklist
				if (BLACKLIST_WORDS.some(bw => lower.includes(bw)))
					return false
				// Panjang minimal 3 kata agar cukup spesifik
				return lower.split(' ').length >= 3
			})

			if (validQueries.length > 0) {
				// Pilih salah satu query pencarian populer
				const selectedQuery = validQueries[Math.floor(Math.random() * validQueries.length)]
				return { topic: selectedQuery, source: `google-suggest (${randomAnchor})` }
			}
		}
	}
	catch (err) {
		console.warn(`[Trends] Notice: Could not fetch Google Suggest (${err.message}). Using curated pool.`)
	}

	return null
}

/**
 * 3. Resolve Final Verified Topic
 */
async function getTopicForCategory(category, customTopic) {
	if (customTopic && customTopic.trim().length > 0) {
		return { topic: customTopic.trim(), source: 'custom' }
	}

	// Coba cari tren pencarian nyata dari Google untuk pilar ini
	const trendResult = await fetchTargetedTrends(category)
	if (trendResult && trendResult.topic) {
		return trendResult
	}

	// Jika Google tidak memberikan query spesifik, ambil dari bank pilar terverifikasi
	const pool = TOPIC_SEEDS[category] || TOPIC_SEEDS.tech
	const randomTopic = pool[Math.floor(Math.random() * pool.length)]
	return { topic: randomTopic, source: 'curated-pillar-bank' }
}

/**
 * 4. Call Gemini API with Strict Guardrails
 */
async function callGemini(apiKey, { number, category, topic }) {
	const today = new Date().toISOString().split('T')[0]

	const categoryGuidelines = {
		edu: 'Pilar Edukasi & Pedagogi: Kurikulum Merdeka (Deep Learning, Capaian Pembelajaran CP/TP, Modul Ajar, P5), model pembelajaran inovatif (PBL, PjBL, Discovery, Inquiry, Accelerated Learning, Flipped Classroom), teori belajar (Konstruktivisme, Kognitif, Vygotsky, Taksonomi Bloom), asesmen autentik (diagnostik, formatif, sumatif), pembelajaran berdiferensiasi (konten, proses, produk), manajemen kelas, dan media ajar interaktif. DILARANG membahas gosip dinas/sekolah, berita politik/gaji/tunjangan, atau lowongan kerja.',
		art: 'Pilar Desain & Seni: Teori warna (HSL, palet harmonik, kontras, psikologi warna), teori desain (Gestalt, Golden Ratio 1.618, hierarki visual, whitespace, keterbacaan), design trends terkini (Bento Grid, Swiss Style, Neo-brutalism, minimalis), tipografi web & font pairing, sistem grid modular, aksesibilitas WCAG, serta UI/UX design. DILARANG membahas karya seni abstrak non-aplikatif, gosip desainer, atau clickbait.',
		tech: 'Pilar Teknologi & Rekayasa Perangkat Lunak: Nuxt/Vue, Flutter & Dart, Python automation/scripting, Rust & Tauri (aplikasi desktop modern), Cloudflare Workers, Edge Computing, Core Web Vitals, atau TypeScript. DILARANG membahas berita kripto, gosip gadget konsumsi, atau berita clickbait.',
	}

	const systemInstruction = `Anda adalah Dinar Permadi Yusup, seorang praktisi pendidikan, desainer visual, dan web developer Indonesia.
Anda menulis artikel blog profesional untuk website pribadi 'permadi.dev' (dibangun dengan Nuxt Content).

BATASAN KETAT TOPIK (GUARDRAILS):
- Kategori aktif: ${category.toUpperCase()}
- Ruang lingkup: ${categoryGuidelines[category]}
- DILARANG KERAS keluar dari koridor kategori di atas! Jangan membahas gosip, politik, clickbait, atau topik yang tidak relevan dengan keahlian Dinar Permadi Yusup.
- Tujuan utama artikel: Memberikan panduan praktis, mendalam, dan bernilai abadi (evergreen & actionable) yang membangun Topical Authority dan E-E-A-T Google.

STANDAR PENULISAN (ARTIKELGEN & ANTI-SLOP):
- Gaya bahasa: Human-written authentic tone (Anti-AI Slop, lugas, cerdas, tidak kaku tapi berbobot).
- HINDARI KATA PEMBUKA KLISE SEPERTI: "Dalam era digital yang serba cepat ini", "Pernahkah Anda membayangkan", "Mari kita bahas secara mendalam". Langsung masuk ke pokok permasalahan (Bottom Line Up Front / BLUF).
- Format bilingual: Buat versi Bahasa Indonesia (ID) dan Bahasa Inggris (EN). Versi EN ditulis dengan gaya bahasa natural native speaker, bukan terjemahan mesin kaku.
- Elemen Konten:
  * Wajib menyertakan minimal 1 tabel Markdown (perbandingan atau ringkasan teknis).
  * Struktur heading H2 (##) dan H3 (###) yang rapi dan terarah.
  * Daftar bullet points yang padat informasi.
- SEO & Karakter:
  * Title ID & EN: 50-58 karakter (HINDARI tanda titik dua ':').
  * Description ID & EN: 70-105 karakter padat dan jelas.
  * Tags: 3-5 tags spesifik dalam huruf kecil (misal: kurikulum-merdeka, model-pembelajaran).
  * Slug: 15-35 karakter, huruf kecil dengan tanda hubung (-) tanpa angka/nomor.
  * Image Alt Text: Deskriptif padat (10-100 karakter).
  * Panjang artikel: Minimal 900 - 1400 kata dengan bahasan tuntas.`

	const userPrompt = `Tuliskan artikel blog bilingual berkualitas tinggi untuk website permadi.dev:
Nomor Urut: ${number}
Kategori: ${category}
Topik Acuan: "${topic}"
Tanggal Publikasi: ${today}

Kembalikan output HANYA DALAM FORMAT JSON MURNI (application/json) dengan skema:
{
  "slug_id": "string (slug url bahasa indonesia tanpa nomor)",
  "slug_en": "string (slug url bahasa inggris tanpa nomor)",
  "slug_image": "string (slug file gambar ilustrasi, misal: ${category}-topik-slug)",
  "title_id": "string (50-58 karakter tanpa tanda titik dua)",
  "title_en": "string (50-58 characters without colon)",
  "description_id": "string (70-105 karakter)",
  "description_en": "string (70-105 characters)",
  "tags_id": ["tag1", "tag2", "tag3", "tag4"],
  "tags_en": ["tag1", "tag2", "tag3", "tag4"],
  "image_alt_id": "string (alt text gambar ilustrasi indonesia)",
  "image_alt_en": "string (alt text image illustration english)",
  "body_id": "string (isi teks artikel lengkap bahasa indonesia dalam format Markdown tanpa frontmatter)",
  "body_en": "string (full article body in English in Markdown format without frontmatter)"
}`

	const modelsToTry = [
		process.env.GEMINI_MODEL || 'gemini-3.8-flash',
		'gemini-3.5-flash',
		'gemini-3.8-flash-lite',
		'gemini-flash-latest',
	]

	let lastError = null

	for (const model of modelsToTry) {
		try {
			console.log(`[Gemini] Requesting article to model ${model}...`)
			const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					system_instruction: {
						parts: [{ text: systemInstruction }],
					},
					contents: [
						{
							role: 'user',
							parts: [{ text: userPrompt }],
						},
					],
					generationConfig: {
						responseMimeType: 'application/json',
						temperature: 0.65,
					},
				}),
			})

			if (!response.ok) {
				const errText = await response.text()
				throw new Error(`HTTP ${response.status} ${response.statusText}: ${errText}`)
			}

			const data = await response.json()
			const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text
			if (!rawText) {
				throw new Error('Empty response from Gemini API')
			}

			return JSON.parse(rawText)
		}
		catch (err) {
			console.warn(`[Gemini] Attempt failed with ${model}: ${err.message}`)
			lastError = err
		}
	}

	throw lastError || new Error('All Gemini models failed.')
}

/**
 * 5. Ensure Cover Image exists (fallback if needed)
 */
function ensureCoverImage(imageSlug, category) {
	if (!fs.existsSync(PUBLIC_ARTICLE_DIR)) {
		fs.mkdirSync(PUBLIC_ARTICLE_DIR, { recursive: true })
	}

	const targetFile = path.join(PUBLIC_ARTICLE_DIR, `${imageSlug}.webp`)
	if (fs.existsSync(targetFile)) {
		return targetFile
	}

	// Copy from category fallback
	const fallbackName = FALLBACK_COVERS[category] || FALLBACK_COVERS.default
	const fallbackPath = path.join(PUBLIC_ARTICLE_DIR, fallbackName)

	if (fs.existsSync(fallbackPath)) {
		fs.copyFileSync(fallbackPath, targetFile)
		console.log(`[Image] Fallback cover assigned: '${fallbackName}' -> '${imageSlug}.webp'`)
	}
	else {
		console.warn(`[Image] Fallback cover not found at ${fallbackPath}.`)
	}

	return targetFile
}

/**
 * Main execution
 */
async function main() {
	console.log('=== Automated Blog Article Generator (Strict Guardrail Edition) ===')

	const apiKey = process.env.GEMINI_API_KEY
	if (!apiKey && !isDryRun) {
		console.error('Error: GEMINI_API_KEY environment variable is required.')
		process.exit(1)
	}

	const info = getNextArticleInfo(cliCategory)
	console.log(`Next Article Number: #${info.nextNumber}`)
	console.log(`Selected Pillar Category: [${info.category.toUpperCase()}] (Previous: ${info.lastCategory})`)

	const topicData = await getTopicForCategory(info.category, cliTopic)
	console.log(`Target Topic: "${topicData.topic}"`)
	console.log(`Discovery Source: ${topicData.source}`)

	if (isDryRun && !apiKey) {
		console.log('\n[Dry-Run Notice] No GEMINI_API_KEY detected. Calculation & guardrail verified successfully.')
		console.log(`Planned ID File: content/id/blog/${info.nextNumber}.<slug-id>.md`)
		console.log(`Planned EN File: content/en/blog/${info.nextNumber}.<slug-en>.md`)
		return
	}

	console.log('\nGenerating article content via Gemini API...')
	const generated = await callGemini(apiKey, {
		number: info.nextNumber,
		category: info.category,
		topic: topicData.topic,
	})

	const today = new Date().toISOString().split('T')[0]
	const cleanSlugId = (generated.slug_id || 'artikel').replace(/^\d+\./, '').toLowerCase().trim()
	const cleanSlugEn = (generated.slug_en || 'article').replace(/^\d+\./, '').toLowerCase().trim()
	const imageSlug = (generated.slug_image || cleanSlugId).replace(/\.webp$/, '').toLowerCase().trim()

	const idFileName = `${info.nextNumber}.${cleanSlugId}.md`
	const enFileName = `${info.nextNumber}.${cleanSlugEn}.md`

	// Ensure tags are arrays
	const tagsId = Array.isArray(generated.tags_id) ? generated.tags_id : [info.category]
	const tagsEn = Array.isArray(generated.tags_en) ? generated.tags_en : [info.category]

	// Format Indonesian Markdown
	const idMarkdown = `---
title: "${generated.title_id.replace(/"/g, '\\"')}"
category: ${info.category}
date: ${today}
description: "${generated.description_id.replace(/"/g, '\\"')}"
tags:
${tagsId.map(t => `  - ${t}`).join('\n')}
---

${generated.body_id.includes(`/article/`) ? generated.body_id : `![${generated.image_alt_id || generated.title_id}](/article/${imageSlug}.webp)\n\n${generated.body_id}`}
`

	// Format English Markdown
	const enMarkdown = `---
title: "${generated.title_en.replace(/"/g, '\\"')}"
category: ${info.category}
date: ${today}
description: "${generated.description_en.replace(/"/g, '\\"')}"
tags:
${tagsEn.map(t => `  - ${t}`).join('\n')}
---

${generated.body_en.includes(`/article/`) ? generated.body_en : `![${generated.image_alt_en || generated.title_en}](/article/${imageSlug}.webp)\n\n${generated.body_en}`}
`

	if (isDryRun) {
		console.log('\n[Dry-Run] Target Files:')
		console.log(`- ${path.join('content/id/blog', idFileName)}`)
		console.log(`- ${path.join('content/en/blog', enFileName)}`)
		console.log('\n--- Indonesian Preview ---')
		console.log(`${idMarkdown.slice(0, 500)}\n...\n`)
		console.log('--- English Preview ---')
		console.log(`${enMarkdown.slice(0, 500)}\n...\n`)
		return
	}

	// Write files
	const idFilePath = path.join(CONTENT_ID_DIR, idFileName)
	const enFilePath = path.join(CONTENT_EN_DIR, enFileName)

	fs.writeFileSync(idFilePath, idMarkdown, 'utf8')
	fs.writeFileSync(enFilePath, enMarkdown, 'utf8')
	console.log(`[Success] Written: ${idFilePath}`)
	console.log(`[Success] Written: ${enFilePath}`)

	// Ensure cover image
	ensureCoverImage(imageSlug, info.category)

	console.log('\n[Complete] Article generation finished successfully.')
}

main().catch((err) => {
	console.error('\n[Error] Auto-generation failed:', err.message)
	process.exit(1)
})
