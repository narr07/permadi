// server/api/gallery-likes/batch.get.ts
// GET /api/gallery-likes/batch?stems=ijem,other-artwork&ip=true
// Returns like counts for multiple gallery items + whether current IP has liked
import { and, eq, inArray, sql } from 'drizzle-orm'

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

  // Check which items are liked by current IP
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'

  const likedResults = await db
    .select({ galleryStem: schema.galleryLikes.galleryStem })
    .from(schema.galleryLikes)
    .where(
      and(
        inArray(schema.galleryLikes.galleryStem, stems),
        eq(schema.galleryLikes.ipAddress, ip),
      ),
    )

  const likedSet = new Set(likedResults.map(r => r.galleryStem))

  // Build response: { stem: { count, liked } }
  const counts: Record<string, { count: number, liked: boolean }> = {}

  for (const stem of stems) {
    counts[stem] = { count: 0, liked: likedSet.has(stem) }
  }

  for (const row of results) {
    if (counts[row.galleryStem]) {
      counts[row.galleryStem].count = row.count
    }
  }

  return counts
})
