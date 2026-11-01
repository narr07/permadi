/**
 * Pemeriksa struktur artikel blog sebelum di-commit oleh generator: frontmatter wajib,
 * tanpa H1, blok kode dan komponen MDC (::nama ... ::) tertutup rapi, dan gambar /article/ ada.
 * Mengembalikan daftar masalah; kosong berarti artikel layak terbit.
 */

import fs from 'node:fs'
import path from 'node:path'

const CATEGORIES = ['edu', 'art', 'tech']

export function validateArticle(markdown, { publicDir, label = 'article' } = {}) {
	const errors = []
	const fail = msg => errors.push(`${label}: ${msg}`)
	const text = markdown.replace(/\r\n/g, '\n')

	const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1]
	if (!frontmatter) {
		fail('frontmatter missing')
		return errors
	}
	const field = name => frontmatter.match(new RegExp(`^${name}:[ \\t]*(.*)$`, 'm'))?.[1]?.trim().replace(/^["']|["']$/g, '')
	for (const name of ['title', 'description']) {
		if (!field(name))
			fail(`frontmatter "${name}" empty`)
	}
	if (!CATEGORIES.includes(field('category')))
		fail(`frontmatter category "${field('category')}" not one of ${CATEGORIES.join(', ')}`)
	if (!/^\d{4}-\d{2}-\d{2}$/.test(field('date') || ''))
		fail(`frontmatter date "${field('date')}" not YYYY-MM-DD`)
	if (!/^tags:[ \t]*\n[ \t]+- \S/m.test(frontmatter))
		fail('frontmatter tags missing or empty')

	const body = text.slice(text.indexOf('\n---\n') + 5)
	const lines = body.split('\n')
	let fence = null
	// Tumpukan komponen MDC yang masih terbuka: jumlah titik dua + nama + nomor baris
	const open = []
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim()
		const fenceMatch = line.match(/^(`{3,}|~{3,})/)
		if (fenceMatch) {
			if (!fence)
				fence = { mark: fenceMatch[1], line: i + 1 }
			else if (line.startsWith(fence.mark) && line.slice(fence.mark.length).trim() === '')
				fence = null
			continue
		}
		if (fence)
			continue

		if (/^#[ \t]/.test(line))
			fail(`H1 heading at body line ${i + 1}`)

		const component = line.match(/^(:{2,})([a-z][\w-]*)/i)
		if (component) {
			open.push({ colons: component[1].length, name: component[2], line: i + 1 })
			continue
		}
		const close = line.match(/^(:{2,})$/)
		if (close) {
			const top = open.pop()
			if (!top)
				fail(`stray "${close[1]}" at body line ${i + 1}`)
			else if (top.colons !== close[1].length)
				fail(`"${':'.repeat(top.colons)}${top.name}" (line ${top.line}) closed with "${close[1]}" at line ${i + 1}`)
		}
	}
	if (fence)
		fail(`code block opened at body line ${fence.line} is never closed`)
	for (const c of open)
		fail(`component "${c.name}" opened at body line ${c.line} is never closed`)

	if (publicDir) {
		for (const [, src] of body.matchAll(/!\[[^\]]*\]\((\/article\/[^)\s]+)\)/g)) {
			if (!fs.existsSync(path.join(publicDir, src)))
				fail(`image ${src} not found in public/`)
		}
	}

	return errors
}
