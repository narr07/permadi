// server/api/gallery-likes/batch.get.ts
// GET /api/gallery-likes/batch?stems=id/gallery/ani,id/gallery/ijem
// Returns like counts for multiple gallery items
import { inArray, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const stemsParam = query.stems as string

  if (!stemsParam) {
    return {}
  }

  const stems = stemsParam
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  if (stems.length === 0) {
    return {}
  }

  // Get like counts grouped by stem
  const results = await db
    .select({
      galleryStem: schema.galleryLikes.galleryStem,
      count: sql<number>`count(*)`,
    })
    .from(schema.galleryLikes)
    .where(inArray(schema.galleryLikes.galleryStem, stems))
    .groupBy(schema.galleryLikes.galleryStem)

  // Build response: { stem: { count } }
  const counts: Record<string, { count: number }> = {}

  for (const stem of stems) {
    counts[stem] = { count: 0 }
  }

  for (const row of results) {
    if (counts[row.galleryStem]) {
      counts[row.galleryStem].count = row.count
    }
  }

  return counts
})
