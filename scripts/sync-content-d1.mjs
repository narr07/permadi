// Menyamakan tabel Nuxt Content di D1 produksi dengan dump yang sedang ter-deploy.
//
// Halaman situs sudah di-prerender, tetapi beberapa request tetap membaca D1 saat runtime
// (halaman 404, judul galeri, /raw/*.md). Bawaan Nuxt Content memperbarui D1 sendiri saat
// request pertama setelah deploy; di Worker paket gratis (CPU 10 ms) impor itu selalu
// dihentikan di tengah jalan, lalu diulang di setiap request berikutnya. Karena itu
// integrityCheck dimatikan di nuxt.config.ts dan impornya dipindah ke sini, dijalankan
// sekali dari GitHub Actions setelah deploy.
//
// Dump diambil dari situs yang sedang live, jadi isi D1 selalu cocok dengan build yang aktif.
// Koleksi yang checksum-nya sudah sama dilewati, sehingga skrip ini aman dijalankan berulang.
//
// Env: CLOUDFLARE_API_TOKEN (izin D1 Edit), CLOUDFLARE_ACCOUNT_ID,
// opsional SITE_URL, NUXT_HUB_DATABASE_ID. Flag: --dry-run (hanya menampilkan rencana).
import { readFileSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'

const SITE_URL = (process.env.SITE_URL || 'https://permadi.dev').replace(/\/$/, '')
const DATABASE_ID = process.env.NUXT_HUB_DATABASE_ID || 'ec2dcc68-5b36-4991-a8aa-ca9e1076956b'
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN
const DRY_RUN = process.argv.includes('--dry-run')

if (!ACCOUNT_ID || !API_TOKEN) {
	console.error('CLOUDFLARE_ACCOUNT_ID dan CLOUDFLARE_API_TOKEN wajib diisi')
	process.exit(1)
}

// Nama koleksi diambil dari content.config.ts agar koleksi baru ikut tersinkron tanpa mengubah skrip ini
const collections = [...readFileSync(new URL('../content.config.ts', import.meta.url), 'utf8')
	.matchAll(/^\s+(\w+): defineCollection\(/gm)]
	.map(m => m[1])

async function d1(sql, params = []) {
	const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`, {
		method: 'POST',
		headers: { 'Authorization': `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ sql, params }),
	})
	const body = await res.json().catch(() => ({}))
	if (!res.ok || !body.success) {
		const message = body.errors?.map(e => e.message).join('; ') || `HTTP ${res.status}`
		throw new Error(message)
	}
	return body.result?.[0]?.results || []
}

async function loadDump(collection) {
	const res = await fetch(`${SITE_URL}/__nuxt_content/${collection}/sql_dump.txt`)
	if (!res.ok)
		throw new Error(`dump ${collection}: HTTP ${res.status}`)
	return JSON.parse(gunzipSync(Buffer.from(await res.text(), 'base64')).toString('utf8'))
}

let changed = 0
for (const collection of collections) {
	const statements = await loadDump(collection)
	const infoInsert = statements.find(s => s.startsWith('INSERT INTO _content_info'))
	const version = infoInsert?.match(/VALUES \('[^']+', false, '[^']*', '([^']+)'/)?.[1]
	if (!version)
		throw new Error(`dump ${collection}: checksum tidak ditemukan`)

	// Checksum saja tidak cukup: impor runtime yang berjalan bersamaan pernah meninggalkan baris info
	// "ready" sementara tabel kontennya sudah di-drop. Jumlah baris di tabel ikut dicocokkan dengan dump.
	const table = `_content_${collection}`
	const expectedRows = statements.filter(s => s.startsWith(`INSERT INTO ${table} `)).length
	const [current] = await d1('SELECT version, ready FROM _content_info WHERE id = ?', [`checksum_${collection}`]).catch(() => [])
	const [count] = await d1(`SELECT count(*) AS n FROM ${table}`).catch(() => [])
	if (current?.version === version && current.ready && count?.n === expectedRows) {
		console.log(`= ${collection}: sudah terbaru (${expectedRows} baris)`)
		continue
	}

	const reason = current?.version !== version ? 'checksum berbeda' : count ? `baris ${count.n}/${expectedRows}` : 'tabel tidak ada'
	console.log(`~ ${collection}: ${reason}, impor ulang ${statements.length} statement`)
	changed++
	if (DRY_RUN)
		continue

	// Baris info lama harus dihapus dulu: dump memasukkannya ulang dengan INSERT biasa
	await d1('DELETE FROM _content_info WHERE id = ?', [`checksum_${collection}`]).catch(() => {})
	for (const raw of statements) {
		// Tiap statement diakhiri " -- <hash>", sama seperti yang dibuang Nuxt Content saat impor
		const hash = raw.split(' -- ').pop()
		await d1(raw.slice(0, raw.length - hash.length - 4))
	}

	const [after] = await d1('SELECT version, ready FROM _content_info WHERE id = ?', [`checksum_${collection}`])
	if (after?.version !== version || !after.ready)
		throw new Error(`${collection}: verifikasi gagal setelah impor`)
}

console.log(DRY_RUN ? `${changed} koleksi perlu diperbarui (dry run)` : `${changed} koleksi diperbarui`)
