// Galeri di-cache SWR di KV dengan key dari URL lengkap, termasuk query string. Halaman ini tidak memakai query,
// jadi query dibuang sebelum handler cache: /gallery?x=1, ?x=2, dst. tidak lagi memicu SSR + tulis KV baru
// (kuota tulis KV paket gratis hanya 1.000 per hari). Query tetap ada di browser, misalnya untuk UTM analitik.
const GALLERY_PATHS = new Set(['/gallery', '/id/galeri'])

export default defineEventHandler((event) => {
	const req = event.node.req
	const url = req.url || ''
	const queryStart = url.indexOf('?')
	if (queryStart === -1)
		return

	const path = url.slice(0, queryStart)
	if (!GALLERY_PATHS.has(path))
		return

	req.url = path
	;(req as { originalUrl?: string }).originalUrl = path
	event._path = path
})
