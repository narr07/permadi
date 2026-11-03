// Rute media Nuxt Studio mengambil URL eksternal apa pun yang ditaruh di path lalu menyajikannya dari origin
// permadi.dev (termasuk SVG yang bisa berisi skrip). Gambar situs sendiri selalu memakai path lokal,
// jadi id yang membawa skema (https:, http:, data:, dst.) ditolak sebelum handler Studio berjalan.
const IPX_PREFIX = '/__nuxt_studio/ipx/'
const HAS_SCHEME = /[a-z][a-z0-9+.-]*:/i

export default defineEventHandler((event) => {
	const path = event.path
	if (!path.startsWith(IPX_PREFIX))
		return

	let decoded = path
	try {
		decoded = decodeURIComponent(path)
	}
	catch {
		throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
	}

	if (HAS_SCHEME.test(decoded.slice(IPX_PREFIX.length)))
		throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
})
