// server/api/gallery-likes/batch.get.ts
// GET /api/gallery-likes/batch?images=img1.jpg,img2.jpg
// Returns like counts for multiple gallery items using image as identifier
import { inArray, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const imagesParam = query.images as string

  if (!imagesParam) {
    return {}
  }

  const images = imagesParam
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  if (images.length === 0) {
    return {}
  }

  // Get like counts grouped by image (stored in galleryStem column)
  const results = await db
    .select({
      image: schema.galleryLikes.galleryStem,
      count: sql<number>`count(*)`,
    })
    .from(schema.galleryLikes)
    .where(inArray(schema.galleryLikes.galleryStem, images))
    .groupBy(schema.galleryLikes.galleryStem)

  // Build response: { image: { count } }
  const counts: Record<string, { count: number }> = {}

  for (const image of images) {
    counts[image] = { count: 0 }
  }

  for (const row of results) {
    if (counts[row.image]) {
      counts[row.image].count = row.count
    }
  }

  return counts
})
