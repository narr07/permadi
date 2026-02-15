// server/api/gallery-likes.get.ts
// GET /api/gallery-likes?stem=ijem
// Returns like count for a specific gallery item
import { eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const stem = query.stem as string

  if (!stem) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid stem query parameter is required',
    })
  }

  const results = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.galleryLikes)
    .where(eq(schema.galleryLikes.galleryStem, stem))

  return {
    stem,
    count: results[0]?.count ?? 0,
  }
})
