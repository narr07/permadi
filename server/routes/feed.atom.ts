export default defineEventHandler(async (event) => {
	const atom = await generateAtomFeed(event)
	setResponseHeader(event, 'Content-Type', 'application/atom+xml; charset=utf-8')
	setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400')
	return atom
})
