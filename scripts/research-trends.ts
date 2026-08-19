import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import https from 'node:https'
import { join } from 'node:path'

// --- HTTP Client Layer untuk Google Trends API ---
const BASE_URL = 'trends.google.com'

async function fetchGoogle(path: string, method = 'GET', body?: string, headers: Record<string, string> = {}): Promise<string> {
	return new Promise((resolve, reject) => {
		const req = https.request(
			{
				hostname: BASE_URL,
				port: 443,
				path,
				method,
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
					...headers,
					...(body ? { 'Content-Length': Buffer.byteLength(body).toString() } : {}),
				},
			},
			(res) => {
				let data = ''
				res.on('data', (chunk) => {
					data += chunk
				})
				res.on('end', () => resolve(data))
			},
		)
		req.on('error', reject)
		if (body)
			req.write(body)
		req.end()
	})
}

// 1. Ambil Autocomplete & Sugesti
async function getAutocomplete(keyword: string, hl = 'id'): Promise<string[]> {
	try {
		const raw = await fetchGoogle(`/trends/api/autocomplete/${encodeURIComponent(keyword)}?hl=${hl}&tz=-420`)
		const cleaned = raw.replace(/^\)\]\}'/, '').trim()
		const json = JSON.parse(cleaned)
		return json?.default?.topics?.map((t: any) => t.title) || []
	}
	catch {
		return []
	}
}

// 2. Ambil Daily Trends Indonesia
async function getDailyTrends(geo = 'ID', lang = 'id'): Promise<Array<{ title: string, traffic: string }>> {
	try {
		const body = new URLSearchParams({
			'f.req': `[[["i0OFE","[null,null,\\"${geo}\\",0,\\"${lang}\\",24,1]",null,"generic"]]]`,
		}).toString()

		const raw = await fetchGoogle(
			'/_/TrendsUi/data/batchexecute',
			'POST',
			body,
			{ 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
		)

		const cleaned = raw.replace(/^\)\]\}'/, '').trim()
		const parsed = JSON.parse(cleaned)
		const nestedData = JSON.parse(parsed[0][2])
		const trendingItems = nestedData[1] || []

		return trendingItems.map((item: any) => ({
			title: String(item[0] || ''),
			traffic: String(item[6] || '0'),
		})).filter((item: any) => item.title)
	}
	catch {
		return []
	}
}

// 3. Generate Search Variations (Harian, Mingguan, Bulanan, Pertanyaan)
function generateKeywordMatrix(keyword: string) {
	return {
		harian: [
			`berita ${keyword} hari ini`,
			`tren ${keyword} terkini`,
			`isu ${keyword} terbaru`,
			`update ${keyword} hari ini`,
		],
		mingguan: [
			`perkembangan ${keyword} minggu ini`,
			`metode ${keyword} populer`,
			`tips ${keyword} praktis`,
			`evaluasi ${keyword} mingguan`,
		],
		bulanan: [
			`strategi ${keyword} masa depan`,
			`panduan lengkap ${keyword}`,
			`kebijakan ${keyword} nasional`,
			`analisis tren ${keyword} tahun ini`,
		],
		pertanyaan: [
			`apa itu ${keyword}`,
			`bagaimana cara menerapkan ${keyword}`,
			`mengapa ${keyword} penting`,
			`kapan waktu tepat menggunakan ${keyword}`,
			`siapa target utama ${keyword}`,
		],
	}
}

// --- CLI Runner ---
async function main() {
	const args = process.argv.slice(2)
	const keyword = args.find(a => !a.startsWith('--'))
	const formatArg = args.find(a => a.startsWith('--format='))?.split('=')[1] || (args.includes('--csv') ? 'csv' : 'both')
	const geo = args.find(a => a.startsWith('--geo='))?.split('=')[1] || 'ID'

	if (!keyword) {
		console.log(`
🔍 Google Trends Research Exporter
===================================
Cara Pakai:
  bun run research "<kata-kunci>" [opsi]

Contoh:
  bun run research "pendidikan"
  bun run research "nuxt js" --format=csv
  bun run research "kurikulum merdeka" --format=md
  bun run research "ai developer" --geo=US

Opsi Format:
  --format=md    (Export ke file Markdown dengan tabel rapi)
  --format=csv   (Export ke file CSV spreadsheet)
  --format=both  (Default: Export kedua file MD & CSV sekaligus)
`)
		process.exit(1)
	}

	console.log(`\n⏳ Sedang meriset tren data untuk: "${keyword}" (Geo: ${geo})...`)

	const [autocompleteList, dailyTrendsList] = await Promise.all([
		getAutocomplete(keyword, 'id'),
		getDailyTrends(geo, 'id'),
	])

	const matrix = generateKeywordMatrix(keyword)
	const timestamp = new Date().toISOString().slice(0, 10)
	const safeSlug = keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-')

	const outputDir = join(process.cwd(), 'reports')
	if (!existsSync(outputDir)) {
		mkdirSync(outputDir, { recursive: true })
	}

	// --- Output MARKDOWN (.md) ---
	if (formatArg === 'md' || formatArg === 'both') {
		const mdPath = join(outputDir, `trends-${safeSlug}-${timestamp}.md`)
		const mdContent = `# Laporan Riset Tren Google: ${keyword}
Tanggal Riset: ${timestamp} | Region: ${geo}

## 1. Saran Pencarian Populer (Google Autocomplete)
| No | Kata Kunci Populer | Kategori / Konteks |
|---|---|---|
${autocompleteList.length ? autocompleteList.map((item, idx) => `| ${idx + 1} | **${item}** | Minat Tinggi |`).join('\n') : `| 1 | ${keyword} | Standar |`}

## 2. Matriks Ide Konten Berdasarkan Frekuensi Waktu
| Periode | Variasi Kata Kunci Target | Search Intent Rekomendasi |
|---|---|---|
${matrix.harian.map(k => `| **Harian** (Momen Terkini) | \`${k}\` | Informational / News |`).join('\n')}
${matrix.mingguan.map(k => `| **Mingguan** (Deep Dive) | \`${k}\` | Practical Guide / How-to |`).join('\n')}
${matrix.bulanan.map(k => `| **Bulanan** (Pilar Utama) | \`${k}\` | Cornerstone / In-depth Authority |`).join('\n')}

## 3. Analisis Pertanyaan Audiens (People Also Ask & FAQ Ide)
| No | Pertanyaan yang Sering Dicari | Fokus Jawaban dalam Artikel |
|---|---|---|
${matrix.pertanyaan.map((q, idx) => `| ${idx + 1} | **${q}?** | Berikan jawaban langsung 2–4 kalimat di section FAQ |`).join('\n')}

## 4. Top Trending Topics Hari Ini (${geo})
| No | Topik yang Sedang Trending | Volume Perkiraan |
|---|---|---|
${dailyTrendsList.slice(0, 10).map((t, idx) => `| ${idx + 1} | ${t.title} | ${t.traffic}+ |`).join('\n')}

---
*Laporan ini digenerate secara otomatis oleh Antigravity Trends Engine untuk memandu pembuatan konten SEO di permadi.dev.*
`
		writeFileSync(mdPath, mdContent, 'utf8')
		console.log(`📄 File Markdown berhasil dibuat: reports/trends-${safeSlug}-${timestamp}.md`)
	}

	// --- Output CSV (.csv) ---
	if (formatArg === 'csv' || formatArg === 'both') {
		const csvPath = join(outputDir, `trends-${safeSlug}-${timestamp}.csv`)
		const csvRows = [
			['Kategori', 'Tipe Periode', 'Kata Kunci / Pertanyaan', 'Search Intent', 'Tanggal'],
		]

		autocompleteList.forEach((item) => {
			csvRows.push(['Autocomplete', 'Populer', `"${item}"`, 'Informational', timestamp])
		})

		matrix.harian.forEach((item) => {
			csvRows.push(['Ide Konten', 'Harian', `"${item}"`, 'News / Update', timestamp])
		})

		matrix.mingguan.forEach((item) => {
			csvRows.push(['Ide Konten', 'Mingguan', `"${item}"`, 'How-To / Guide', timestamp])
		})

		matrix.bulanan.forEach((item) => {
			csvRows.push(['Ide Konten', 'Bulanan', `"${item}"`, 'Cornerstone Authority', timestamp])
		})

		matrix.pertanyaan.forEach((item) => {
			csvRows.push(['FAQ / People Also Ask', 'Pertanyaan', `"${item}?"`, 'FAQ / Solusi', timestamp])
		})

		const csvContent = csvRows.map(r => r.join(',')).join('\n')
		writeFileSync(csvPath, csvContent, 'utf8')
		console.log(`📊 File CSV berhasil dibuat:      reports/trends-${safeSlug}-${timestamp}.csv`)
	}

	console.log(`\n✅ Riset selesai! Buka folder 'reports/' untuk melihat hasil data tabelnya.\n`)
}

main()
