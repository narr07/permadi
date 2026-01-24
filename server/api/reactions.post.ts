// POST /api/reactions
// Add a reaction to a blog post by idBlog with rate limiting
import { and, eq, gt, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const postId = body?.postId ? Number.parseInt(String(body.postId), 10) : null

  if (!postId || Number.isNaN(postId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid postId is required in request body',
    })
  }

  const reactionType = body?.type
  if (!reactionType || !['love', 'like', 'sad'].includes(reactionType)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid reaction type. Must be: love, like, or sad',
    })
  }

  // Get client IP address
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'

  // Check rate limit: max 10 reactions per IP in 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const rateLimitCheck = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.reactions)
    .where(
      and(
        eq(schema.reactions.ipAddress, ip),
        gt(schema.reactions.createdAt, twentyFourHoursAgo),
      ),
    )

  if (rateLimitCheck[0]?.count >= 10) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Rate limit exceeded. Maximum 10 reactions per 24 hours.',
    })
  }

  // Insert the reaction
  await db.insert(schema.reactions).values({
    postId,
    reactionType,
    ipAddress: ip,
  })

  // Return updated counts
  const results = await db
    .select({
      reactionType: schema.reactions.reactionType,
      count: sql<number>`count(*)`,
    })
    .from(schema.reactions)
    .where(eq(schema.reactions.postId, postId))
    .groupBy(schema.reactions.reactionType)

  const counts: Record<string, number> = {
    love: 0,
    like: 0,
    sad: 0,
  }

  for (const row of results) {
    counts[row.reactionType] = row.count
  }

  return {
    success: true,
    counts,
  }
})
