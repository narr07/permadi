import { sum } from 'drizzle-orm'
import { db, schema } from 'hub:db'

// Total artikel dibaca, dari content_meta.views (sudah disaring per sesi tiap 4 jam di view.post.ts).
// Di-cache satu jam: footer tampil di semua halaman, jadi D1 cukup dibaca sekali per jam.
export default defineCachedEventHandler(async () => {
	const row = await db
		.select({ total: sum(schema.contentMeta.views) })
		.from(schema.contentMeta)
		.get()
	return { reads: Number(row?.total ?? 0) }
}, {
	name: 'site-reads',
	maxAge: 60 * 60,
	swr: true,
	getKey: () => 'total',
})
