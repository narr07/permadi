// server/api/blog.ts
export default eventHandler(async (event) => {
  const page = await queryCollection(event, 'blog_id').all()
  return page
})
