/**
 * Perpustakaan buku pribadi sebagai referensi generator artikel.
 *
 * Sumber: books/Buku <Kategori> Markdown/*.md (hasil OCR, tidak di-commit).
 * Repo publik, jadi yang di-commit hanya data/book-index.enc: JSON potongan buku,
 * dikompres brotli lalu dienkripsi AES-256-GCM dengan kunci BOOK_INDEX_KEY
 * (base64, 32 byte) yang hanya ada di .env lokal dan GitHub Secret.
 */

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const MAGIC = Buffer.from('BKIX')
const FORMAT_VERSION = 1
const HEADER_LEN = MAGIC.length + 1 + 32 + 12 + 16

// Folder sumber → kategori generator
const FOLDER_CATEGORY = {
	'Buku Desaun Markdown': 'art',
	'Buku Pendidikan Markdown': 'edu',
	'Buku Teknologi Markdown': 'tech',
}

const CHUNK_MIN_WORDS = 220
const CHUNK_MAX_WORDS = 380

// Bagian yang hanya berisi daftar, bukan isi buku
const SKIP_HEADING = /daftar pustaka|kepustakaan|bibliograf|referen[cs]|^index$|^indeks$|daftar isi|^contents$|table of contents|riwayat penulis|about the author|tentang penulis|acknowledg|ucapan terima kasih/i

const STOPWORDS = new Set(`
yang dan di ke dari untuk dengan pada dalam adalah ini itu atau juga akan tidak bisa dapat ada oleh
sebagai karena agar supaya saat ketika seperti lebih sangat secara bagi para kita kami anda mereka dia
nya pun lah kah telah sudah belum masih hanya saja tersebut setiap semua antara tentang hal cara apa
bagaimana mengapa kapan dimana siapa mana harus perlu banyak sedikit baru lain the and for with that this
from are was were has have had not but you your our their its his her they them what when where which
who how why into onto about than then there these those such can could would should will shall may might
also very more most some any all each other only just over under after before while being been does did
`.split(/\s+/).filter(Boolean))

function fold(text) {
	return text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
}

/** Token pencarian: huruf kecil, tanpa diakritik, tanpa stopword, akhiran -s jamak dibuang. */
export function tokenize(text) {
	const out = []
	for (const raw of fold(text).split(/[^\p{L}\p{N}]+/u)) {
		if (raw.length < 3 || STOPWORDS.has(raw))
			continue
		out.push(raw.length > 4 && raw.endsWith('s') && !raw.endsWith('ss') ? raw.slice(0, -1) : raw)
	}
	return out
}

function cleanText(text) {
	return text
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/[*_]{2,}/g, '')
		.replace(/[ \t]+/g, ' ')
		.trim()
}

function wordCount(text) {
	return text.split(/\s+/).filter(Boolean).length
}

/** OCR kadang menghasilkan deret angka/simbol; potongan seperti itu tidak berguna sebagai referensi. */
function looksLikeProse(text) {
	const letters = (text.match(/\p{L}/gu) || []).length
	return letters / Math.max(text.length, 1) > 0.6
}

function chunkBook(markdown) {
	const chunks = []
	let heading = ''
	let buffer = []
	let bufferWords = 0

	const flush = () => {
		const text = buffer.join('\n\n').trim()
		if (bufferWords >= 40 && looksLikeProse(text) && !SKIP_HEADING.test(heading))
			chunks.push([heading, text])
		buffer = []
		bufferWords = 0
	}

	for (const block of markdown.split(/\n\s*\n/)) {
		const trimmed = block.trim()
		const headingMatch = trimmed.match(/^#{1,6}\s+(\S.*)$/)
		if (headingMatch && !trimmed.includes('\n')) {
			if (bufferWords >= CHUNK_MIN_WORDS)
				flush()
			heading = cleanText(headingMatch[1]).slice(0, 120)
			continue
		}
		const text = cleanText(trimmed)
		if (!text)
			continue
		const words = text.split(/\s+/)
		// Paragraf yang sangat panjang dipecah agar satu potongan tidak melebihi batas
		for (let i = 0; i < words.length; i += CHUNK_MAX_WORDS) {
			const piece = words.slice(i, i + CHUNK_MAX_WORDS)
			if (bufferWords + piece.length > CHUNK_MAX_WORDS && bufferWords > 0)
				flush()
			buffer.push(piece.join(' '))
			bufferWords += piece.length
			if (bufferWords >= CHUNK_MIN_WORDS)
				flush()
		}
	}
	flush()
	return chunks
}

/** Bangun perpustakaan dari folder books. Mengembalikan null bila folder sumber tidak ada. */
export function buildLibraryFromDir(booksDir) {
	if (!fs.existsSync(booksDir))
		return null
	const books = []
	const chunks = []
	for (const [folder, cat] of Object.entries(FOLDER_CATEGORY)) {
		const dir = path.join(booksDir, folder)
		if (!fs.existsSync(dir))
			continue
		for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort()) {
			const bookIdx = books.push({ name: file.replace(/\.md$/, ''), cat }) - 1
			for (const [heading, text] of chunkBook(fs.readFileSync(path.join(dir, file), 'utf8')))
				chunks.push([bookIdx, heading, text])
		}
	}
	return books.length ? { v: FORMAT_VERSION, books, chunks } : null
}

function parseKey(keyB64) {
	const key = Buffer.from(keyB64 || '', 'base64')
	if (key.length !== 32)
		throw new Error('BOOK_INDEX_KEY harus base64 dari 32 byte (jalankan: node scripts/build-book-index.mjs --gen-key)')
	return key
}

export function generateKey() {
	return crypto.randomBytes(32).toString('base64')
}

/** HMAC isi perpustakaan; dipakai untuk melewati penulisan ulang bila buku tidak berubah. */
function contentMac(key, json) {
	return crypto.createHmac('sha256', key).update(json).digest()
}

export function readIndexMac(file) {
	if (!fs.existsSync(file))
		return null
	const buf = fs.readFileSync(file)
	if (buf.length < HEADER_LEN || !buf.subarray(0, 4).equals(MAGIC))
		return null
	return buf.subarray(5, 37)
}

export function encryptLibrary(library, keyB64) {
	const key = parseKey(keyB64)
	const json = JSON.stringify(library)
	const mac = contentMac(key, json)
	const compressed = zlib.brotliCompressSync(json, {
		params: {
			[zlib.constants.BROTLI_PARAM_QUALITY]: 9,
			[zlib.constants.BROTLI_PARAM_SIZE_HINT]: json.length,
		},
	})
	const iv = crypto.randomBytes(12)
	const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
	const body = Buffer.concat([cipher.update(compressed), cipher.final()])
	return {
		mac,
		buffer: Buffer.concat([MAGIC, Buffer.from([FORMAT_VERSION]), mac, iv, cipher.getAuthTag(), body]),
	}
}

export function computeLibraryMac(library, keyB64) {
	return contentMac(parseKey(keyB64), JSON.stringify(library))
}

export function decryptLibrary(buf, keyB64) {
	const key = parseKey(keyB64)
	if (buf.length < HEADER_LEN || !buf.subarray(0, 4).equals(MAGIC))
		throw new Error('book-index.enc bukan berkas indeks buku yang valid')
	if (buf[4] !== FORMAT_VERSION)
		throw new Error(`versi book-index.enc ${buf[4]} tidak didukung`)
	const iv = buf.subarray(37, 49)
	const tag = buf.subarray(49, 65)
	const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
	decipher.setAuthTag(tag)
	const compressed = Buffer.concat([decipher.update(buf.subarray(HEADER_LEN)), decipher.final()])
	return JSON.parse(zlib.brotliDecompressSync(compressed).toString('utf8'))
}

/**
 * Muat perpustakaan: folder books lokal bila ada (paling baru), selain itu indeks terenkripsi.
 * Tidak pernah melempar error; generator tetap jalan tanpa buku bila keduanya tidak tersedia.
 */
export function loadLibrary({ booksDir, indexFile, key }) {
	try {
		const local = buildLibraryFromDir(booksDir)
		if (local)
			return { library: local, source: 'local books' }
		if (!fs.existsSync(indexFile))
			return { library: null, source: 'missing index file' }
		if (!key)
			return { library: null, source: 'BOOK_INDEX_KEY not set' }
		return { library: decryptLibrary(fs.readFileSync(indexFile), key), source: 'encrypted index' }
	}
	catch (err) {
		return { library: null, source: `error: ${err.message}` }
	}
}

/**
 * Cari potongan buku paling relevan dengan BM25.
 * @param {object} library hasil loadLibrary
 * @param {string[]} queries istilah atau frasa (ID dan EN)
 */
export function searchLibrary(library, queries, { category, limit = 8, perBook = 2, maxWords = 3200 } = {}) {
	const terms = [...new Set(queries.flatMap(q => tokenize(q)))]
	if (!library || !terms.length)
		return []
	const phrases = [...new Set(queries.map(q => fold(q).trim()).filter(q => q.includes(' ')))]
	const termIndex = new Map(terms.map((t, i) => [t, i]))
	const df = Array.from({ length: terms.length }).fill(0)
	const stats = []
	let totalLen = 0

	for (let c = 0; c < library.chunks.length; c++) {
		const [, heading, text] = library.chunks[c]
		const tokens = tokenize(`${heading} ${text}`)
		totalLen += tokens.length
		let tf = null
		for (const tok of tokens) {
			const i = termIndex.get(tok)
			if (i === undefined)
				continue
			tf ??= Array.from({ length: terms.length }).fill(0)
			tf[i]++
		}
		if (!tf)
			continue
		tf.forEach((n, i) => n && df[i]++)
		stats.push({ c, len: tokens.length, tf })
	}

	const N = library.chunks.length
	const avgdl = totalLen / Math.max(N, 1)
	const idf = df.map(n => Math.log(1 + (N - n + 0.5) / (n + 0.5)))
	const k1 = 1.2
	const b = 0.75

	const scored = []
	for (const { c, len, tf } of stats) {
		const matched = tf.filter(Boolean).length
		if (matched < Math.min(2, terms.length))
			continue
		let score = 0
		tf.forEach((n, i) => {
			if (n)
				score += idf[i] * (n * (k1 + 1)) / (n + k1 * (1 - b + b * len / avgdl))
		})
		const [bookIdx, heading, text] = library.chunks[c]
		if (phrases.length) {
			const hay = fold(`${heading} ${text}`)
			score += phrases.filter(p => hay.includes(p)).length * 2
		}
		if (category && library.books[bookIdx].cat === category)
			score *= 1.15
		scored.push({ score, bookIdx, heading, text })
	}

	scored.sort((x, y) => y.score - x.score)
	const floor = (scored[0]?.score || 0) * 0.35
	const perBookCount = new Map()
	const picked = []
	let words = 0
	for (const hit of scored) {
		if (picked.length >= limit || hit.score < floor)
			break
		const used = perBookCount.get(hit.bookIdx) || 0
		const wc = wordCount(hit.text)
		if (used >= perBook || words + wc > maxWords)
			continue
		perBookCount.set(hit.bookIdx, used + 1)
		words += wc
		picked.push({ book: library.books[hit.bookIdx].name, heading: hit.heading, text: hit.text, score: hit.score })
	}
	return picked
}
