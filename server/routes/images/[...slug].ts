export default defineEventHandler((event) => {
	const slug = getRouterParam(event, 'slug')
	return sendRedirect(event, `/article/${slug}`, 301)
})
