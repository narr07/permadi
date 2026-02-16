// server/api/gallery-likes.get.ts
// GET /api/gallery-likes?image=path/to/image.jpg
// Returns like count for a specific gallery item using image as identifier
import { eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const image = query.image as string

  if (!image) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid image query parameter is required',
    })
  }

  const results = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.galleryLikes)
    .where(eq(schema.galleryLikes.galleryStem, image))

  return {
    image,
    count: results[0]?.count ?? 0,
  }
})
