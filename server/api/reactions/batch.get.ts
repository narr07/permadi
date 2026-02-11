// server/api/reactions/batch.get.ts
// GET /api/reactions/batch?postIds=1,2,3
// Returns reaction counts for multiple blog posts
import { inArray, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const postIdsParam = query.postIds as string

  if (!postIdsParam) {
    return {}
  }

  // Parse comma-separated post IDs
  const postIds = postIdsParam
    .split(',')
    .map(id => Number.parseInt(id.trim(), 10))
    .filter(id => !Number.isNaN(id))

  if (postIds.length === 0) {
    return {}
  }

  // Get reaction counts grouped by postId and type
  const results = await db
    .select({
      postId: schema.reactions.postId,
      reactionType: schema.reactions.reactionType,
      count: sql<number>`count(*)`,
    })
    .from(schema.reactions)
    .where(inArray(schema.reactions.postId, postIds))
    .groupBy(schema.reactions.postId, schema.reactions.reactionType)

  // Transform to object format: { postId: { love: 0, like: 0, sad: 0 } }
  const counts: Record<number, Record<string, number>> = {}

  for (const id of postIds) {
    counts[id] = { love: 0, like: 0, sad: 0 }
  }

  for (const row of results) {
    if (counts[row.postId]) {
      counts[row.postId][row.reactionType] = row.count
    }
  }

  return counts
})
