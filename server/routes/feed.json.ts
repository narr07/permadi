export default defineEventHandler(async (event) => {
	const jsonFeed = await generateJsonFeed(event)
	setResponseHeader(event, 'Content-Type', 'application/feed+json; charset=utf-8')
	setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400')
	return jsonFeed
})
