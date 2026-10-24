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
 *   node scripts/auto-generate.mjs --topic-only   (hanya pilih topik: Search Console/Trends/GKP)
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createLedger, generate, parseJson } from './lib/gemini.mjs'
import { loadServiceAccount } from './lib/google-auth.mjs'
import { fetchRisingTerms } from './lib/google-trends.mjs'
import { fetchSearchOpportunities } from './lib/search-console.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// Auto-load .env for GEMINI_API_KEY, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, etc.
const envPath = path.join(rootDir, '.env')
if (fs.existsSync(envPath)) {
	try {
		if (typeof process.loadEnvFile === 'function') {
			process.loadEnvFile(envPath)
		}
	}
	catch {}
	try {
		const envContent = fs.readFileSync(envPath, 'utf8')
		for (const line of envContent.split(/\r?\n/)) {
			const trimmed = line.trim()
			if (!trimmed || trimmed.startsWith('#'))
				continue
			const [k, ...v] = trimmed.split('=')
			const key = k?.trim()
			if (key && !process.env[key]) {
				process.env[key] = v.join('=').trim()
			}
		}
	}
	catch {}
}

const CONTENT_ID_DIR = path.join(rootDir, 'content', 'id', 'blog')
const CONTENT_EN_DIR = path.join(rootDir, 'content', 'en', 'blog')
const PUBLIC_ARTICLE_DIR = path.join(rootDir, 'public', 'article')
const DATA_DIR = path.join(rootDir, 'data')
const AI_SPEND_FILE = path.join(DATA_DIR, 'ai-spend.json')
const SEO_REFRESH_FILE = path.join(DATA_DIR, 'seo-refresh.json')

const CATEGORIES = ['edu', 'art', 'tech']

// Parse CLI flags
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
// Hanya jalankan pemilihan topik (Search Console/Trends/GKP), tanpa menulis artikel
const isTopicOnly = args.includes('--topic-only')
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
	'loker',
	'jobdesk',
	'percetakan',
	'sablon',
	'spanduk',
	'banner',
	'offset',
	'kartu nama',
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

// Batasan isi per pilar, dipakai pemilih topik dan penulis artikel
const CATEGORY_GUIDELINES = {
	edu: 'Pilar Edukasi & Pedagogi: Kurikulum Merdeka (Deep Learning, Capaian Pembelajaran CP/TP, Modul Ajar, P5), model pembelajaran inovatif (PBL, PjBL, Discovery, Inquiry, Accelerated Learning, Flipped Classroom), teori belajar (Konstruktivisme, Kognitif, Vygotsky, Taksonomi Bloom), asesmen autentik (diagnostik, formatif, sumatif), pembelajaran berdiferensiasi (konten, proses, produk), manajemen kelas, dan media ajar interaktif. DILARANG membahas gosip dinas/sekolah, berita politik/gaji/tunjangan, atau lowongan kerja.',
	art: 'Pilar Desain & Seni: Teori warna (HSL, palet harmonik, kontras, psikologi warna), teori desain (Gestalt, Golden Ratio 1.618, hierarki visual, whitespace, keterbacaan), design trends terkini (Bento Grid, Swiss Style, Neo-brutalism, minimalis), tipografi web & font pairing, sistem grid modular, aksesibilitas WCAG, serta UI/UX design. DILARANG membahas karya seni abstrak non-aplikatif, gosip desainer, atau clickbait.',
	tech: 'Pilar Teknologi & Rekayasa Perangkat Lunak: Nuxt/Vue, Flutter & Dart, Python automation/scripting, Rust & Tauri (aplikasi desktop modern), Cloudflare Workers, Edge Computing, Core Web Vitals, atau TypeScript. DILARANG membahas berita kripto, gosip gadget konsumsi, atau berita clickbait.',
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
 * 2. Ambil Riwayat Artikel yang Sudah Terbit
 * Mencegah pengulangan topik atau kata kunci yang sudah pernah dibuat artikelnya
 */
function getExistingArticleKeywords() {
	const existing = new Set()
	if (!fs.existsSync(CONTENT_ID_DIR))
		return existing

	const files = fs.readdirSync(CONTENT_ID_DIR).filter(f => f.endsWith('.md'))
	for (const file of files) {
		const slug = file.replace(/^\d+\./, '').replace(/\.md$/, '').toLowerCase()
		existing.add(slug)
		try {
			const content = fs.readFileSync(path.join(CONTENT_ID_DIR, file), 'utf8')
			const titleMatch = content.match(/title:[ \t]*["']?([^"'\r\n]+)/i)
			if (titleMatch) {
				existing.add(titleMatch[1].toLowerCase().trim())
			}

			let inTags = false
			for (const line of content.split(/\r?\n/)) {
				const trimmed = line.trim()
				if (trimmed.toLowerCase().startsWith('tags:')) {
					inTags = true
					continue
				}
				if (inTags) {
					if (trimmed.startsWith('-')) {
						const tag = trimmed.slice(1).trim().toLowerCase()
						if (tag) {
							existing.add(tag)
						}
					}
					else if (trimmed.length > 0 && !line.startsWith(' ') && !line.startsWith('\t')) {
						break
					}
				}
			}
		}
		catch {
			// ignore
		}
	}
	return existing
}

/**
 * 3. Matriks Penilaian Peluang Keyword GKP
 * Mengutamakan persaingan Rendah/Sedang dan volume pencarian 'sweet spot' (100 - 50.000)
 */
function getKeywordOpportunityScore(item) {
	let score = 0
	const compLower = (item.competition || '').toLowerCase()

	// Prioritas persaingan rendah
	if (compLower.includes('rendah') || item.competitionValue <= 20) {
		score += 50
	}
	else if (compLower.includes('sedang') || item.competitionValue <= 50) {
		score += 25
	}

	// Volume pencarian sweet spot untuk blog personal
	if (item.searches >= 500 && item.searches <= 10000) {
		score += 40
	}
	else if (item.searches >= 100 && item.searches < 500) {
		score += 30
	}
	else if (item.searches > 10000 && item.searches <= 50000) {
		score += 20
	}
	else if (item.searches > 50000) {
		score += 10
	}

	// Panjang 3-5 kata ideal untuk long-tail dengan intent jelas
	const words = item.keyword.split(' ').length
	if (words >= 3 && words <= 5) {
		score += 15
	}

	return score
}

/**
 * 4. Baca Seluruh File CSV GKP dari Folder data/<category>/
 * Pengguna cukup menaruh file CSV unduhan GKP tanggal berapa pun ke dalam folder kategori terkait
 */
function loadGkpKeywordsForCategory(category) {
	const catDir = path.join(DATA_DIR, category)
	if (!fs.existsSync(catDir))
		return []

	const csvFiles = fs.readdirSync(catDir).filter(f => f.toLowerCase().endsWith('.csv'))
	if (csvFiles.length === 0)
		return []

	const keywords = []
	const seenKw = new Set()
	const existingArticles = getExistingArticleKeywords()

	for (const file of csvFiles) {
		const filePath = path.join(catDir, file)
		let raw = ''
		try {
			// Unduhan GKP biasanya berformat UTF-16LE dengan BOM
			raw = fs.readFileSync(filePath, 'utf16le')
			if (!raw.includes('\t') && !raw.includes('Keyword')) {
				raw = fs.readFileSync(filePath, 'utf8')
			}
		}
		catch {
			continue
		}

		const lines = raw.split(/\r?\n/)
		let headerIdx = -1
		for (let i = 0; i < Math.min(10, lines.length); i++) {
			if (lines[i].includes('Keyword') && (lines[i].includes('Avg. monthly searches') || lines[i].includes('\t'))) {
				headerIdx = i
				break
			}
		}

		if (headerIdx === -1)
			continue

		const headers = lines[headerIdx].split('\t').map(h => h.trim().toLowerCase())
		const kwCol = headers.indexOf('keyword')
		const searchCol = headers.findIndex(h => h.includes('avg. monthly searches'))
		const compCol = headers.findIndex(h => h === 'competition' || h.startsWith('competition'))
		const compValCol = headers.findIndex(h => h.includes('competition (indexed value)'))

		for (let i = headerIdx + 1; i < lines.length; i++) {
			const line = lines[i].trim()
			if (!line)
				continue
			const cols = line.split('\t')
			let kw = cols[kwCol]?.trim()?.toLowerCase()
			if (!kw || kw.length < 3)
				continue

			// Normalisasi salah ketik umum dari Google Keyword Planner
			const TYPO_MAP = {
				'un ux': 'ui ux',
				'uinux': 'ui ux',
				'ui/ux': 'ui ux',
				'photoshp': 'photoshop',
				'ilustrator': 'illustrator',
				'corel draw': 'coreldraw',
				'downlod': 'download',
			}
			for (const [typo, fixed] of Object.entries(TYPO_MAP)) {
				if (kw.includes(typo)) {
					kw = kw.replaceAll(typo, fixed)
				}
			}

			if (seenKw.has(kw))
				continue

			// Filter kata terlarang (blacklist)
			if (BLACKLIST_WORDS.some(bw => kw.includes(bw)))
				continue

			// Lewati jika sudah pernah dibahas di artikel sebelumnya
			const isAlreadyCovered = [...existingArticles].some(item => item.includes(kw) || kw.includes(item))
			if (isAlreadyCovered)
				continue

			const searches = searchCol !== -1 ? parseInt(cols[searchCol]?.replace(/\D/g, '') || '0', 10) : 0
			const comp = compCol !== -1 ? cols[compCol]?.trim() : ''
			const compVal = compValCol !== -1 ? parseInt(cols[compValCol]?.replace(/\D/g, '') || '999', 10) : 999

			const words = kw.split(' ').length
			if (words < 2)
				continue

			seenKw.add(kw)
			keywords.push({
				keyword: kw,
				searches,
				competition: comp,
				competitionValue: Number.isNaN(compVal) ? 999 : compVal,
				file,
			})
		}
	}

	keywords.sort((a, b) => getKeywordOpportunityScore(b) - getKeywordOpportunityScore(a))
	return keywords
}

/**
 * 5. Cari Variasi Long-Tail & Tren Pertanyaan Riil via Google Suggest
 */
async function getGoogleSuggestVariations(anchorKeyword) {
	try {
		const url = `https://suggestqueries.google.com/complete/search?client=chrome&hl=id&gl=ID&q=${encodeURIComponent(anchorKeyword)}`
		const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(5000) })
		if (response.ok) {
			const data = await response.json()
			const queries = data?.[1] || []
			return queries.filter((q) => {
				const lower = q.toLowerCase()
				return !BLACKLIST_WORDS.some(bw => lower.includes(bw)) && lower !== anchorKeyword.toLowerCase()
			})
		}
	}
	catch {
		// ignore
	}
	return []
}

/**
 * 6. Fetch Targeted Google Search Trends for Specific Category (Anchor Fallback)
 */
async function fetchTargetedTrends(category) {
	const anchors = CATEGORY_ANCHORS[category] || CATEGORY_ANCHORS.tech
	const randomAnchor = anchors[Math.floor(Math.random() * anchors.length)]

	try {
		console.log(`[Trends] Querying Google Suggest trends for anchor: "${randomAnchor}"...`)
		const suggestions = await getGoogleSuggestVariations(randomAnchor)
		const validQueries = suggestions.filter(q => q.split(' ').length >= 3)

		if (validQueries.length > 0) {
			const selectedQuery = validQueries[Math.floor(Math.random() * validQueries.length)]
			return {
				topic: selectedQuery,
				primaryKeyword: randomAnchor,
				secondaryKeywords: validQueries.slice(0, 3),
				source: `google-suggest (${randomAnchor})`,
			}
		}
	}
	catch (err) {
		console.warn(`[Trends] Notice: Could not fetch Google Suggest (${err.message}). Using curated pool.`)
	}

	return null
}

/**
 * Artikel lama yang kata kuncinya hampir masuk halaman 1, dikumpulkan per halaman di
 * data/seo-refresh.json (di-commit bersama artikel) sebagai daftar kerja pembaruan artikel.
 */
function saveRefreshCandidates(refresh, opportunities) {
	let data = {}
	try {
		data = JSON.parse(fs.readFileSync(SEO_REFRESH_FILE, 'utf8'))
	}
	catch {}
	const today = new Date().toISOString().slice(0, 10)
	for (const { page, query } of refresh) {
		const stats = opportunities.find(o => o.query === query && o.page === page)
		if (!page || !query)
			continue
		data[page] ||= { queries: {} }
		data[page].queries[query] = { position: stats?.position ?? null, impressions: stats?.impressions ?? null, seen: today }
		data[page].updated = today
	}
	fs.writeFileSync(SEO_REFRESH_FILE, `${JSON.stringify(data, null, 2)}\n`)
}

/**
 * 7a. Topik berbasis data: kueri Search Console di halaman 2 Google (posisi 8–20) dan istilah yang
 * sedang naik di Google Trends Indonesia (BigQuery). Flash memilih satu yang cocok dengan pilar dan
 * belum punya artikel sendiri, supaya artikel baru tidak berebut kata kunci dengan artikel lama.
 */
async function pickDataDrivenTopic(apiKey, category, { ledger, profile }) {
	const account = loadServiceAccount()
	if (!account || !apiKey)
		return null

	// Situs masih muda (data Search Console tipis): ambang longgar, posisi 5–40 dengan ≥2 tayangan.
	// Perketat ke posisi 8–20 / ≥10 tayangan setelah trafik bertambah.
	const [sc, trends] = await Promise.allSettled([
		fetchSearchOpportunities(account, { minImpressions: 2, minPosition: 5, maxPosition: 40, hostname: 'permadi.dev' }),
		fetchRisingTerms(account, { country: 'ID' }),
	])
	if (sc.status === 'rejected')
		console.warn(`[SearchConsole] ${sc.reason.message}`)
	if (trends.status === 'rejected')
		console.warn(`[Trends] ${trends.reason.message}`)
	const opportunities = sc.status === 'fulfilled' ? sc.value.opportunities.slice(0, 60) : []
	const rising = trends.status === 'fulfilled' ? trends.value : []
	console.log(`[Data] ${opportunities.length} Search Console opportunities, ${rising.length} rising terms`)
	if (!opportunities.length && !rising.length)
		return null

	const articles = getInternalLinkCatalog().map(a => `- ${a.title} (${a.url})`).join('\n')
	const pick = await generate(profile.models.utility, {
		apiKey,
		ledger,
		stage: 'topic-pick',
		json: true,
		prompt: `Anda redaktur permadi.dev. Pilih SATU topik artikel baru untuk pilar "${category}": ${CATEGORY_GUIDELINES[category]}

DATA A, Search Console permadi.dev (kueri yang sudah memberi tayangan; posisi rata-rata 5–40, makin kecil makin dekat halaman 1):
${opportunities.map(o => `- "${o.query}" | posisi ${o.position} | ${o.impressions} tayangan | halaman: ${o.page}`).join('\n') || '(kosong)'}

DATA B, Google Trends Indonesia (istilah yang sedang naik minggu ini):
${rising.map(t => `- ${t.term}`).join('\n') || '(kosong)'}

ARTIKEL YANG SUDAH ADA:
${articles}

Aturan:
1. Prioritaskan DATA A: kueri yang relevan dengan pilar dan BELUM dibahas khusus oleh artikel yang ada.
2. Jika halaman yang tampil untuk sebuah kueri memang artikel yang membahas kueri itu, JANGAN jadikan topik baru (kanibalisasi); masukkan ke "refresh".
3. DATA B hanya dipakai bila istilahnya jelas relevan dengan pilar. Abaikan berita, selebritas, olahraga, politik, dan produk konsumen.
4. Bila tidak ada yang layak, isi "topic" dengan null.

Kembalikan JSON:
{"topic": "topik artikel dalam Bahasa Indonesia, atau null", "primary_keyword": "kata kunci utama dalam bentuk wajar", "secondary_keywords": ["2-4 kata kunci pendukung"], "source": "search-console atau google-trends", "reason": "alasan singkat", "refresh": [{"query": "kueri", "page": "url halaman", "position": 0}]}`,
	})

	const choice = parseJson(pick.text)
	if (choice.refresh?.length) {
		console.log(`[SearchConsole] Existing articles worth refreshing:\n${choice.refresh.map(r => `  - ${r.page} for "${r.query}" (position ${r.position})`).join('\n')}`)
		saveRefreshCandidates(choice.refresh, opportunities)
	}
	if (!choice.topic) {
		console.log(`[Data] No data-driven topic for ${category}: ${choice.reason}`)
		return null
	}
	return {
		topic: choice.topic,
		primaryKeyword: choice.primary_keyword || choice.topic,
		secondaryKeywords: choice.secondary_keywords || [],
		source: `${choice.source}: ${choice.reason}`,
	}
}

/**
 * 7. Resolve Final Verified Topic (Search Console/Trends → GKP → Suggest → curated)
 */
async function getTopicForCategory(category, customTopic, ai) {
	if (customTopic && customTopic.trim().length > 0) {
		return {
			topic: customTopic.trim(),
			primaryKeyword: customTopic.trim(),
			secondaryKeywords: [],
			source: 'custom',
		}
	}

	// 0. Data milik situs sendiri (Search Console) dan tren Indonesia, bila service account tersedia
	if (ai) {
		try {
			const dataTopic = await pickDataDrivenTopic(ai.apiKey, category, ai)
			if (dataTopic)
				return dataTopic
		}
		catch (err) {
			console.warn(`[Data] Data-driven topic failed, falling back to GKP: ${err.message}`)
		}
	}

	// 1. Prioritas Utama: Cari dari Bank Data Google Keyword Planner (data/<category>/*.csv)
	const gkpKeywords = loadGkpKeywordsForCategory(category)
	if (gkpKeywords.length > 0) {
		// Ambil dari 10 kata kunci terbaik secara acak agar tiap generate bervariasi
		const candidatePool = gkpKeywords.slice(0, 10)
		const chosen = candidatePool[Math.floor(Math.random() * candidatePool.length)]

		console.log(`[GKP] Selected seed keyword: "${chosen.keyword}" (Vol: ${chosen.searches}/mo, Comp: ${chosen.competition}, File: ${chosen.file})`)

		// 2. Sandingkan dengan Google Suggest untuk menangkap intent long-tail aktif
		const suggestions = await getGoogleSuggestVariations(chosen.keyword)
		let finalTopic = chosen.keyword

		if (suggestions.length > 0) {
			const longTail = suggestions.find(s => s.split(' ').length >= 3 && s.includes(chosen.keyword))
			if (longTail) {
				finalTopic = longTail
			}
		}

		return {
			topic: finalTopic,
			primaryKeyword: chosen.keyword,
			secondaryKeywords: suggestions.slice(0, 4),
			source: `gkp-csv (${chosen.file}) + google-suggest`,
			stats: { searches: chosen.searches, competition: chosen.competition },
		}
	}

	// 2. Fallback: Google Suggest Anchor
	const trendResult = await fetchTargetedTrends(category)
	if (trendResult && trendResult.topic) {
		return trendResult
	}

	// 3. Fallback: Curated Pillar Bank
	const pool = TOPIC_SEEDS[category] || TOPIC_SEEDS.tech
	const randomTopic = pool[Math.floor(Math.random() * pool.length)]
	return {
		topic: randomTopic,
		primaryKeyword: randomTopic,
		secondaryKeywords: [],
		source: 'curated-pillar-bank',
	}
}

/**
 * 4. Pipeline artikel bertahap: riset (Google Search) → draf ID → penyuntingan → versi EN → metadata.
 * Model termahal hanya dipakai di tahap yang menentukan mutu (draf & penyuntingan).
 * Belanja dicatat di data/ai-spend.json; bila mendekati anggaran bulanan, otomatis pindah ke profil hemat.
 */
const AI_MONTHLY_BUDGET_USD = Number(process.env.AI_MONTHLY_BUDGET_USD || 12)
// Perkiraan biaya satu artikel profil premium (teks + cover), dipakai untuk keputusan anggaran
const PREMIUM_ARTICLE_USD = 0.9

const MODEL_PROFILES = {
	premium: {
		research: ['gemini-3.8-flash', 'gemini-flash-latest'],
		writer: [process.env.GEMINI_WRITER_MODEL || 'gemini-4-argon', 'gemini-3.1-pro-preview', 'gemini-pro-latest'],
		translator: ['gemini-3.1-pro-preview', 'gemini-pro-latest', 'gemini-3.8-flash'],
		utility: ['gemini-3.8-flash', 'gemini-flash-latest'],
		image: ['gemini-3-pro-image', 'gemini-nano-banana-2.1'],
	},
	economy: {
		research: ['gemini-3.8-flash', 'gemini-flash-latest'],
		writer: ['gemini-3.8-flash', 'gemini-flash-latest'],
		translator: ['gemini-3.8-flash', 'gemini-flash-latest'],
		utility: ['gemini-3.8-flash', 'gemini-flash-latest'],
		image: ['gemini-nano-banana-2.1'],
	},
}

function chooseProfile(ledger) {
	const remaining = AI_MONTHLY_BUDGET_USD - ledger.spent
	const name = remaining >= PREMIUM_ARTICLE_USD ? 'premium' : 'economy'
	console.log(`[Budget] ${ledger.month}: $${ledger.spent.toFixed(2)} of $${AI_MONTHLY_BUDGET_USD} spent → profile "${name}"`)
	return { name, models: MODEL_PROFILES[name] }
}

const AUTHOR = `Anda adalah Dinar Permadi Yusup: guru SD di Majalengka, desainer visual, dan web developer Indonesia. Anda menulis untuk blog pribadi permadi.dev (Nuxt Content). Pembaca Anda guru, desainer, dan developer yang ingin jawaban praktis dari praktisi, bukan rangkuman generik.`

const STYLE_ID = `GAYA BAHASA INDONESIA (Smart Conversational / Modern Editorial):
- Bernas, hangat, lugas, percaya diri, seperti praktisi senior atau jurnalis majalah editorial bermutu.
- Buka langsung dengan inti jawaban (BLUF). DILARANG pembuka klise: "Dalam era digital saat ini", "Di zaman modern yang serba cepat", "Perkembangan teknologi telah membawa", "Pernahkah Anda membayangkan", "Mari kita bahas".
- DILARANG meta-talk: "Perlu diingat bahwa", "Tidak dapat dipungkiri", "Patut dicatat", "Bukan rahasia lagi".
- DILARANG jargon proposal: "dalam rangka", "guna mendukung", "optimalisasi", "sinergi", "akselerasi", "solusi tepat guna". Ubah nominalisasi pe-an/ke-an menjadi kata kerja aktif.
- DILARANG slang: "banget", "nggak", "beneran", "sat-set", "gaspol", "cuan", "doang", "nih", "dong", "lo-gue".
- Kalimat aktif dengan pelaku jelas. Variasikan panjang kalimat: pendek penegas, sedang, dan panjang penjelas.
- DILARANG em dash (—). Gunakan koma, titik dua, kurung, atau titik.
- Tanpa emoji di judul dan heading.`

const STYLE_EN = `ENGLISH STYLE:
- Natural native-speaker phrasing; never a stiff word-for-word translation.
- BANNED: "fast-paced digital world", "delve into", "dive deep", "game-changer", "tapestry", "beacon", "crucial role", "harness the power", "paradigm shift", "seamless synergy".
- Do not open consecutive paragraphs with "Furthermore", "Moreover", "Additionally".
- Prefer plain verbs: use (not utilize), help (not facilitate), speed up (not expedite), complete (not comprehensive).
- No em dashes (—). No emoji in headings.`

const STRUCTURE_RULES = `STRUKTUR & FORMAT (Nuxt Content MDC):
- Body TANPA frontmatter dan TANPA H1 (#). Subjudul memakai H2 (##) lalu H3 (###).
- Paragraf pertama: jawaban inti 40–60 kata (target featured snippet).
- Paragraf pendek: 1–4 kalimat. Tidak ada dinding teks.
- Panjang body 1500–2000 kata.
- Minimal 1 tabel perbandingan memakai SINTAKS TABEL MARKDOWN (| kolom | kolom |). DILARANG tabel atau diagram ASCII (+---+, |---|) di dalam blok kode.
- Blok kode (\`\`\`) HANYA untuk kode sungguhan, dengan nama bahasa (\`\`\`ts, \`\`\`python, dst.).
- Penekanan **tebal** atau *miring* secukupnya (1–3 kali per bagian).
- Komponen MDC yang tersedia (pakai yang relevan, sintaks persis):
  ::tip / ::note / ::warning untuk catatan praktis atau jebakan umum:
  ::tip
  Isi catatan.
  ::
  ::steps untuk panduan bertahap, setiap langkah berupa H3 di dalamnya:
  ::steps
  ### Langkah pertama
  Penjelasan.
  ::
  ::faq berisi 3–4 pertanyaan yang benar-benar dicari orang:
  ::faq
    :::faq-item
    ---
    question: Pertanyaan?
    ---
    Jawaban singkat.
    :::
  ::
  ::conclusion di akhir sebagai panduan keputusan aksi:
  ::conclusion
  Ringkasan dan langkah berikutnya.
  ::

SEO & KATA KUNCI:
- Kata kunci dari Google Keyword Planner sering berupa frasa pencarian mentah (contoh: "logo grafis png", "logo grafis adalah", salah ketik "un ux"). Pakai bentuk wajar dan baku di dalam kalimat; jangan memaksakan frasa mentah, jangan sebut asal-usul salah ketik.
- Primary keyword muncul di paragraf pertama, satu H2, dan 3–6 kali alami di body. Kerapatan 1–2,5%, tanpa keyword stuffing.

KEJUJURAN (E-E-A-T):
- Fakta, angka, nama, dan tahun hanya dari catatan riset atau pengetahuan umum yang pasti. Jika ragu, tulis secara umum tanpa angka.
- Boleh memakai sudut pandang praktisi (guru/desainer/developer), tetapi DILARANG mengarang anekdot pribadi spesifik, kutipan, testimoni, atau statistik.`

function getInternalLinkCatalog() {
	const read = (dir, prefix) => {
		const map = new Map()
		if (!fs.existsSync(dir))
			return map
		for (const file of fs.readdirSync(dir).filter(f => /^\d+\..+\.md$/.test(f))) {
			const [num] = file.split('.')
			const slug = file.replace(/^\d+\./, '').replace(/\.md$/, '')
			const rawTitle = fs.readFileSync(path.join(dir, file), 'utf8').match(/^title:(.*)$/m)?.[1] || ''
			const title = rawTitle.trim().replace(/^["']|["']$/g, '') || slug
			map.set(num, { title, url: `${prefix}/${slug}` })
		}
		return map
	}
	const id = read(CONTENT_ID_DIR, '/id/blog')
	const en = read(CONTENT_EN_DIR, '/blog')
	return [...id.entries()].map(([num, a]) => ({ title: a.title, url: a.url, en: en.get(num) }))
}

async function generateArticle(apiKey, { category, topicData, ledger, profile }) {
	const today = new Date().toISOString().split('T')[0]
	const { topic, primaryKeyword } = topicData
	// Data GKP kadang memuat frasa tanpa huruf (mis. "= 1.61803399"); buang sebelum masuk prompt
	const secondaryKeywords = (topicData.secondaryKeywords || []).filter(k => /\p{L}{3}/u.test(k))
	const { models } = profile
	const links = getInternalLinkCatalog()
	const linkListId = links.map(l => `- ${l.title}: ${l.url}`).join('\n')
	const linkMapEn = links.filter(l => l.en).map(l => `- ${l.url} → ${l.en.url} (${l.en.title})`).join('\n')
	const brief = `Topik acuan: "${topic}"
Kategori: ${category} (${CATEGORY_GUIDELINES[category]})
Primary keyword: "${primaryKeyword}"
Secondary keywords: ${secondaryKeywords.join(', ') || 'sesuaikan dengan topik'}
Tanggal terbit: ${today}`

	// Tahap 1: riset berbasis Google Search agar fakta & data terkini, bukan dari ingatan model
	console.log('\n[Pipeline 1/5] Research with Google Search grounding...')
	const research = await generate(models.research, {
		apiKey,
		ledger,
		stage: 'research',
		search: true,
		prompt: `${brief}

Lakukan riset untuk artikel blog berbahasa Indonesia tentang topik di atas. Gunakan Google Search. Tulis catatan riset dalam markdown:
1. Jawaban inti / definisi yang akurat.
2. Fakta, data, versi, atau perkembangan terbaru (sebut nama sumber dan tahunnya).
3. Langkah, contoh, atau penerapan konkret yang bisa langsung dipraktikkan.
4. Kesalahan umum dan cara menghindarinya.
5. Pertanyaan yang sering dicari orang tentang topik ini.
6. Sudut pandang yang jarang dibahas artikel lain.
Jangan mengarang. Tandai informasi yang tidak pasti dengan "(belum pasti)".`,
	})

	// Tahap 2: draf ID dalam markdown biasa (bukan JSON) agar model fokus pada tulisan
	console.log('[Pipeline 2/5] Drafting Indonesian article...')
	const draft = await generate(models.writer, {
		apiKey,
		ledger,
		stage: 'draft-id',
		system: `${AUTHOR}\n\n${STYLE_ID}\n\n${STRUCTURE_RULES}`,
		prompt: `${brief}

CATATAN RISET:
${research.text}

ARTIKEL LAIN DI SITUS (tautkan 2–3 yang benar-benar relevan dengan format [teks jangkar](url), di tempat yang wajar):
${linkListId}

Tulis body artikel lengkap dalam Bahasa Indonesia. Keluarkan HANYA markdown body artikel, tanpa pengantar atau penutup dari Anda.`,
	})

	// Tahap 3: penyuntingan oleh editor yang memeriksa daftar aturan dan fakta terhadap riset
	console.log('[Pipeline 3/5] Editing pass...')
	const edited = await generate(models.writer, {
		apiKey,
		ledger,
		stage: 'edit-id',
		system: `Anda editor senior permadi.dev. Tugas Anda menyunting draf agar layak terbit tanpa mengubah topik.\n\n${STYLE_ID}\n\n${STRUCTURE_RULES}`,
		prompt: `CATATAN RISET (acuan fakta):
${research.text}

DRAF:
${draft.text}

Sunting draf di atas. Periksa dan perbaiki:
1. Pembuka langsung menjawab inti (BLUF), tanpa klise.
2. Semua frasa terlarang, jargon, slang, dan em dash hilang.
3. Tabel memakai sintaks tabel markdown; tidak ada tabel/diagram ASCII di blok kode.
4. Kata kunci terdengar wajar, tidak dipaksakan.
5. Klaim yang tidak didukung riset dihapus atau dibuat umum.
6. Sintaks komponen MDC benar dan ditutup dengan ::.
7. Alur antarbagian mengalir, tidak ada pengulangan isi.
Keluarkan HANYA markdown body artikel hasil suntingan lengkap.`,
	})
	const bodyId = sanitizeArticleBody(edited.text)

	// Tahap 4: versi EN ditulis ulang secara natural, tautan internal dipetakan ke versi EN
	console.log('[Pipeline 4/5] Writing English edition...')
	const english = await generate(models.translator, {
		apiKey,
		ledger,
		stage: 'english',
		system: `You are the English editor of permadi.dev. You adapt Indonesian articles for an international audience so they read as if written in English from the start.\n\n${STYLE_EN}`,
		prompt: `Adapt the Indonesian article below into English.
- Keep the same structure, headings depth, tables, code blocks, and MDC components (::tip, ::steps, ::faq with :::faq-item, ::conclusion). Keep component syntax exactly; translate only the human text, including faq "question:" values.
- Use the natural English search phrasing for the keywords.
- Replace internal links using this map (drop a link if it has no English version):
${linkMapEn}
- No H1, no frontmatter. Output ONLY the English markdown body.

INDONESIAN ARTICLE:
${bodyId}`,
	})
	const bodyEn = sanitizeArticleBody(english.text)

	// Tahap 5: metadata SEO + brief ilustrasi dari artikel final
	console.log('[Pipeline 5/5] SEO metadata and cover brief...')
	const meta = await generate(models.utility, {
		apiKey,
		ledger,
		stage: 'metadata',
		json: true,
		prompt: `Buat metadata untuk artikel berikut. Primary keyword: "${primaryKeyword}". Kategori: ${category}.

Kembalikan JSON:
{
  "slug_id": "slug Indonesia 17-40 karakter, huruf kecil, tanda hubung, tanpa nomor",
  "slug_en": "English slug 17-40 characters",
  "slug_image": "${category}-<2-4 kata topik>, huruf kecil, tanda hubung",
  "title_id": "50-58 karakter, memuat primary keyword dalam bentuk wajar, tanpa titik dua",
  "title_en": "50-58 characters, no colon",
  "description_id": "70-105 karakter",
  "description_en": "70-105 characters",
  "tags_id": ["3-5 tag huruf kecil berupa istilah wajar, bukan frasa pencarian mentah"],
  "tags_en": ["3-5 lowercase tags"],
  "image_alt_id": "alt text 10-125 karakter yang menggambarkan ilustrasi cover",
  "image_alt_en": "alt text 10-125 characters",
  "image_brief": "English, 2-3 sentences. Art direction for ONE concrete editorial illustration that shows the article's core idea through recognizable objects or a scene (e.g. a teacher's desk with a lesson plan, a designer constructing a logo on a grid, a browser and phone showing a responsive layout). Name the focal subject, 2-4 supporting objects, and the composition. No abstract-only shapes, no people's faces in close-up."
}

ARTIKEL (ID):
${bodyId.slice(0, 6000)}

JUDUL-JUDUL BAGIAN (EN):
${bodyEn.split('\n').filter(l => l.startsWith('## ')).join('\n')}`,
	})

	return { ...parseJson(meta.text), body_id: bodyId, body_en: bodyEn }
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
 * 6. Cover ilustrasi editorial: Nano Banana Pro (2K) dengan pemeriksaan otomatis oleh model vision,
 * lalu Nano Banana 2.1, lalu Cloudflare FLUX (gratis). Mengembalikan true bila cover tertulis;
 * pemanggil memakai ensureCoverImage() bila false.
 */
function coverPrompt(brief, feedback) {
	return `Editorial flat vector illustration for a blog article cover. Scene: ${brief}

Style: clean modern flat 2D vector illustration with confident dark forest green #134e43 outlines and solid fills, in the discipline of the International Typographic Style. One clear focal subject placed on a golden-ratio point, asymmetric but balanced layout, generous calm negative space. Palette only: pale mint background #f0fdfa, vivid teal #14b898 for the focal accents, soft mint #99f6e4 and emerald #0d947a as secondary colors, #134e43 for outlines and dark shapes, white highlights. No gradients, no drop shadows, no photorealism, no 3D render.
Screens, papers, cards and signs show simple placeholder bars, lines and icons only: absolutely no readable or fake text, no letters, no numbers, no logos, no watermark. Wide 16:9 composition.${feedback ? `\n\nFix these problems from the previous attempt: ${feedback}` : ''}`
}

async function reviewCover(apiKey, models, ledger, { imageData, imageMime }, brief) {
	try {
		const review = await generate(models.utility, {
			apiKey,
			ledger,
			stage: 'cover-review',
			json: true,
			parts: [
				{ inlineData: { mimeType: imageMime || 'image/png', data: imageData } },
				{ text: `You review blog cover illustrations. Intended scene: "${brief}".
Reject only for real problems: garbled or fake text/letters, distorted objects or anatomy, off-brand colors (not mint/teal/forest green), scene clearly unrelated to the brief, or cluttered composition.
Return JSON: {"ok": boolean, "issues": "short English list of problems, empty if ok"}` },
			],
		})
		return parseJson(review.text)
	}
	catch (err) {
		// Pemeriksa gagal bukan alasan membuang gambar yang sudah dibayar
		console.warn(`[Image] Review skipped: ${err.message}`)
		return { ok: true, issues: '' }
	}
}

async function generateCoverImage(apiKey, { brief, ledger, profile }, imageSlug) {
	const targetFile = path.join(PUBLIC_ARTICLE_DIR, `${imageSlug}.webp`)
	if (!brief || fs.existsSync(targetFile))
		return fs.existsSync(targetFile)

	let sharp
	try {
		sharp = (await import('sharp')).default
	}
	catch {
		console.warn('[Image] sharp not installed, skipping AI cover.')
		return false
	}

	const writeCover = async (b64) => {
		fs.mkdirSync(PUBLIC_ARTICLE_DIR, { recursive: true })
		await sharp(Buffer.from(b64, 'base64'))
			.resize(1600, 900, { fit: 'cover' })
			.webp({ quality: 86 })
			.toFile(targetFile)
		console.log(`[Image] AI cover written: ${targetFile}`)
		return true
	}

	// Gemini image: maks 2 percobaan; percobaan kedua membawa catatan perbaikan dari pemeriksa
	let feedback = ''
	let lastImage = null
	for (let attempt = 1; attempt <= 2; attempt++) {
		try {
			console.log(`[Image] Generating cover (attempt ${attempt})...`)
			const result = await generate(profile.models.image, {
				apiKey,
				ledger,
				stage: `cover-${attempt}`,
				prompt: coverPrompt(brief, feedback),
				image: { aspectRatio: '16:9', imageSize: '2K' },
				timeoutMs: 180000,
			})
			if (!result.imageData)
				throw new Error('No image in response')
			lastImage = result.imageData
			const review = await reviewCover(apiKey, profile.models, ledger, result, brief)
			if (review.ok)
				return writeCover(result.imageData)
			feedback = review.issues
			console.warn(`[Image] Review rejected cover: ${feedback}`)
		}
		catch (err) {
			console.warn(`[Image] Gemini image failed: ${err.message}`)
			break
		}
	}
	// Dua percobaan ditolak pemeriksa: pakai yang terakhir daripada membuang gambar berbayar
	if (lastImage)
		return writeCover(lastImage)

	// Cadangan gratis: Cloudflare Workers AI FLUX
	const { CLOUDFLARE_ACCOUNT_ID: cfAccount, CLOUDFLARE_API_TOKEN: cfToken } = process.env
	if (cfAccount && cfToken) {
		const model = process.env.CF_IMAGE_MODEL || '@cf/black-forest-labs/flux-2-klein-4b'
		try {
			console.log(`[Image] Requesting cover from ${model}...`)
			const form = new FormData()
			form.append('prompt', coverPrompt(brief))
			form.append('width', '1600')
			form.append('height', '896')
			const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${cfAccount}/ai/run/${model}`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${cfToken}` },
				body: form,
				signal: AbortSignal.timeout(120000),
			})
			if (!response.ok)
				throw new Error(`HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`)
			const b64 = (await response.json()).result?.image
			if (b64)
				return writeCover(b64)
		}
		catch (err) {
			console.warn(`[Image] ${model} failed: ${err.message}`)
		}
	}
	return false
}

/**
 * 6. Sanitize Article Body Markdown
 * Strictly enforces that no H1 heading (# ) is present in article body.
 * - Removes leading H1 if present at the start of the body
 * - Demotes any internal H1 (# ) to H2 (## )
 */
function sanitizeArticleBody(body) {
	if (!body || typeof body !== 'string') {
		return ''
	}

	const lines = body.trim().split('\n')
	const result = []
	let hasSeenContent = false

	for (const rawLine of lines) {
		const line = rawLine.trimEnd()
		// Cek apakah baris diawali dengan single '#' (Heading 1)
		if (/^#[ \t]/.test(line)) {
			// Jika H1 muncul tepat di awal dokumen sebelum ada konten lain, hapus agar tidak duplikat dengan H1 title
			if (!hasSeenContent) {
				continue
			}
			result.push(`## ${line.replace(/^#[ \t]+/, '')}`)
		}
		else {
			if (line.trim().length > 0) {
				hasSeenContent = true
			}
			result.push(line)
		}
	}

	return result.join('\n').trim()
}

// Ledger disimpan juga saat gagal, karena panggilan yang sudah terjadi tetap ditagih
let ledger = null

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

	if (apiKey) {
		ledger = createLedger(AI_SPEND_FILE)
	}
	const profile = ledger ? chooseProfile(ledger) : null

	const topicData = await getTopicForCategory(info.category, cliTopic, apiKey ? { apiKey, ledger, profile } : null)
	console.log(`Target Topic: "${topicData.topic}"`)
	console.log(`Primary Keyword: "${topicData.primaryKeyword}"`)
	if (topicData.secondaryKeywords && topicData.secondaryKeywords.length > 0) {
		console.log(`Secondary Keywords: ${topicData.secondaryKeywords.join(', ')}`)
	}
	if (topicData.stats) {
		console.log(`Monthly Searches: ${topicData.stats.searches} | Competition: ${topicData.stats.competition}`)
	}
	console.log(`Discovery Source: ${topicData.source}`)

	if (isTopicOnly)
		return

	if (isDryRun && !apiKey) {
		console.log('\n[Dry-Run Notice] No GEMINI_API_KEY detected. Calculation & guardrail verified successfully.')
		console.log(`Planned ID File: content/id/blog/${info.nextNumber}.<slug-id>.md`)
		console.log(`Planned EN File: content/en/blog/${info.nextNumber}.<slug-en>.md`)
		return
	}

	console.log('\nGenerating article content via Gemini API...')
	const generated = await generateArticle(apiKey, {
		category: info.category,
		topicData,
		ledger,
		profile,
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

	const cleanBodyId = sanitizeArticleBody(generated.body_id)
	const cleanBodyEn = sanitizeArticleBody(generated.body_en)

	// Clean up any leading image markdown tags and normalize /images/ paths generated by the model.
	// Em dash dilarang gaya situs; sisa yang lolos dari editor diganti koma.
	const sanitizedBodyId = cleanBodyId.replace(/^!\[[^\]]*\]\([^)]+\)\s*/, '').replace(/\/images\//g, '/article/').replace(/\s*—\s*/g, ', ')
	const sanitizedBodyEn = cleanBodyEn.replace(/^!\[[^\]]*\]\([^)]+\)\s*/, '').replace(/\/images\//g, '/article/').replace(/\s*—\s*/g, ', ')

	// Format Indonesian Markdown
	const idMarkdown = `---
title: "${generated.title_id.replace(/"/g, '\\"')}"
category: ${info.category}
date: ${today}
description: "${generated.description_id.replace(/"/g, '\\"')}"
tags:
${tagsId.map(t => `  - ${t}`).join('\n')}
---

![${generated.image_alt_id || generated.title_id}](/article/${imageSlug}.webp)

${sanitizedBodyId}
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

![${generated.image_alt_en || generated.title_en}](/article/${imageSlug}.webp)

${sanitizedBodyEn}
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

	// Topic-specific AI cover; category fallback only if generation fails
	if (!await generateCoverImage(apiKey, { brief: generated.image_brief, ledger, profile }, imageSlug))
		ensureCoverImage(imageSlug, info.category)

	console.log(`\n[Complete] Article generation finished. Cost this run: $${ledger.runUsd.toFixed(3)} (month: $${ledger.spent.toFixed(2)} of $${AI_MONTHLY_BUDGET_USD})`)
}

main()
	.catch((err) => {
		console.error('\n[Error] Auto-generation failed:', err.message)
		process.exitCode = 1
	})
	.finally(() => ledger?.save(cliTopic || 'auto'))
