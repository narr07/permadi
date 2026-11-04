#!/usr/bin/env node

/**
 * Bangun data/book-index.enc dari books/Buku * Markdown/*.md.
 *
 * Usage:
 *   node scripts/build-book-index.mjs            bangun ulang (dilewati bila isi buku tidak berubah)
 *   node scripts/build-book-index.mjs --force    tulis ulang walau tidak berubah
 *   node scripts/build-book-index.mjs --gen-key  buat BOOK_INDEX_KEY baru dan simpan ke .env
 *   node scripts/build-book-index.mjs --search "fitts law" "hukum fitts"   uji pencarian
 *
 * Setiap tulis ulang menambah ±7 MB ke riwayat git, jadi jalankan hanya saat buku berubah.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
	buildLibraryFromDir,
	computeLibraryMac,
	encryptLibrary,
	generateKey,
	loadLibrary,
	readIndexMac,
	searchLibrary,
} from './lib/book-library.mjs'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envPath = path.join(rootDir, '.env')
const booksDir = path.join(rootDir, 'books')
const indexFile = path.join(rootDir, 'data', 'book-index.enc')
const args = process.argv.slice(2)

function readEnvKey() {
	if (process.env.BOOK_INDEX_KEY)
		return process.env.BOOK_INDEX_KEY
	if (!fs.existsSync(envPath))
		return ''
	const line = fs.readFileSync(envPath, 'utf8').split(/\r?\n/).find(l => l.trim().startsWith('BOOK_INDEX_KEY='))
	return line ? line.slice(line.indexOf('=') + 1).trim() : ''
}

if (args.includes('--gen-key')) {
	if (readEnvKey()) {
		console.error('BOOK_INDEX_KEY sudah ada di .env. Hapus dulu bila memang ingin mengganti kunci (indeks lama tidak akan bisa dibuka).')
		process.exit(1)
	}
	const key = generateKey()
	const prefix = fs.existsSync(envPath) && !fs.readFileSync(envPath, 'utf8').endsWith('\n') ? '\n' : ''
	fs.appendFileSync(envPath, `${prefix}BOOK_INDEX_KEY=${key}\n`)
	console.log('Kunci baru disimpan ke .env sebagai BOOK_INDEX_KEY.')
	console.log('Simpan juga ke GitHub Secret: gh secret set BOOK_INDEX_KEY (lalu tempel nilainya dari .env).')
	process.exit(0)
}

const key = readEnvKey()

const searchIdx = args.indexOf('--search')
if (searchIdx !== -1) {
	const queries = args.slice(searchIdx + 1)
	const { library, source } = loadLibrary({ booksDir, indexFile, key })
	console.log(`Sumber: ${source}`)
	for (const hit of searchLibrary(library, queries))
		console.log(`\n[${hit.score.toFixed(2)}] ${hit.book} › ${hit.heading}\n${hit.text.slice(0, 300)}…`)
	process.exit(0)
}

if (!key) {
	console.error('BOOK_INDEX_KEY belum ada. Jalankan: node scripts/build-book-index.mjs --gen-key')
	process.exit(1)
}

const library = buildLibraryFromDir(booksDir)
if (!library) {
	console.error(`Tidak ada buku di ${booksDir}`)
	process.exit(1)
}

const mac = computeLibraryMac(library, key)
const oldMac = readIndexMac(indexFile)
if (!args.includes('--force') && oldMac && oldMac.equals(mac)) {
	console.log(`Isi buku tidak berubah (${library.books.length} buku); ${path.relative(rootDir, indexFile)} dibiarkan.`)
	process.exit(0)
}

const { buffer } = encryptLibrary(library, key)
fs.mkdirSync(path.dirname(indexFile), { recursive: true })
fs.writeFileSync(indexFile, buffer)
console.log(`${library.books.length} buku, ${library.chunks.length} potongan → ${path.relative(rootDir, indexFile)} (${(buffer.length / 1024 / 1024).toFixed(1)} MB, terenkripsi)`)
