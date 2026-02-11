// server/api/reactions.get.ts
// GET /api/reactions?postId=1
// Returns reaction counts for a specific blog post by idBlog
import { eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const postId = query.postId ? Number.parseInt(String(query.postId), 10) : null

  if (!postId || Number.isNaN(postId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid postId query parameter is required',
    })
  }

  // Get reaction counts grouped by type
  const results = await db
    .select({
      reactionType: schema.reactions.reactionType,
      count: sql<number>`count(*)`,
    })
    .from(schema.reactions)
    .where(eq(schema.reactions.postId, postId))
    .groupBy(schema.reactions.reactionType)

  // Transform to object format
  const counts: Record<string, number> = {
    love: 0,
    like: 0,
    sad: 0,
  }

  for (const row of results) {
    counts[row.reactionType] = row.count
  }

  return counts
})
