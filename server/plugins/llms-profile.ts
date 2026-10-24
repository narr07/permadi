// Halaman Tentang & Kontak berupa YAML tanpa body markdown, jadi Nuxt Content hanya
// menulis judulnya ke /llms-full.txt. Plugin ini menambahkan isinya sebagai markdown.
const PROFILE_COLLECTIONS = ['tentang_id', 'kontak_id', 'tentang_en', 'kontak_en'] as const

// Kunci navigasi/tampilan yang tidak membawa informasi
const SKIP_KEYS = /^(?:icon|image|button_text|link_text|section_label)$|_to$|_text$/
// Field internal Nuxt Content di tingkat atas; title & description sudah jadi judul bagian
const SKIP_TOP_KEYS = /^(?:_.*|id|title|description|path|stem|extension|meta|body|seo|navigation)$/

function flatten(value: unknown, lines: string[]) {
	if (value == null)
		return
	if (typeof value === 'string' || typeof value === 'number') {
		const text = String(value).trim()
		if (text)
			lines.push(text)
		return
	}
	if (Array.isArray(value)) {
		for (const item of value) {
			if (item && typeof item === 'object' && !Array.isArray(item)) {
				const parts = Object.entries(item)
					.filter(([k, v]) => !SKIP_KEYS.test(k) && (typeof v === 'string' || typeof v === 'number'))
					.map(([, v]) => String(v).trim())
					.filter(Boolean)
				if (parts.length)
					lines.push(`- ${parts.join(': ')}`)
			}
			else {
				flatten(item, lines)
			}
		}
		return
	}
	if (typeof value === 'object') {
		for (const [k, v] of Object.entries(value)) {
			if (!SKIP_KEYS.test(k))
				flatten(v, lines)
		}
	}
}

export default defineNitroPlugin((nitroApp) => {
	// Generator llms-full Nuxt Content crash pada dokumen YAML (body null): beri body minimark kosong
	nitroApp.hooks.hook('content:llms:generate:document', (_event, doc) => {
		if (!doc.body)
			doc.body = { type: 'minimark', value: [] }
	})

	nitroApp.hooks.hook('llms:generate:full', async (event, _options, contents) => {
		for (const collection of PROFILE_COLLECTIONS) {
			const doc = await queryCollection(event, collection).first()
			if (!doc)
				continue
			const lines: string[] = []
			for (const [key, value] of Object.entries(doc)) {
				if (!SKIP_TOP_KEYS.test(key) && !SKIP_KEYS.test(key))
					flatten(value, lines)
			}
			// Bahasa Inggris adalah locale default tanpa prefix (/about, bukan /en/about)
			const route = doc.path.replace(/^\/en(?=\/|$)/, '') || '/'
			contents.push([
				`# ${doc.title}`,
				doc.description ? `> ${doc.description}` : '',
				`URL: https://permadi.dev${route}`,
				lines.join('\n'),
			].filter(Boolean).join('\n\n'))
		}
	})
})
