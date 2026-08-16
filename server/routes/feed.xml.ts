export default defineEventHandler(async (event) => {
	const xml = await generateRssFeed(event)
	setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
	setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400')
	return xml
})
