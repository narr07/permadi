// server/api/gallery-likes.post.ts
// POST /api/gallery-likes
// Toggle like on a gallery item (like/unlike based on IP)
import { and, eq, gt, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const stem = body?.stem as string

  if (!stem || typeof stem !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid stem is required in request body',
    })
  }

  // Get client IP address
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'

  // Check rate limit: max 10 likes per IP in 24 hours
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const rateLimitCheck = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.galleryLikes)
    .where(
      and(
        eq(schema.galleryLikes.ipAddress, ip),
        gt(schema.galleryLikes.createdAt, twentyFourHoursAgo),
      ),
    )

  if (rateLimitCheck[0]?.count >= 10) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Rate limit exceeded. Maximum 10 likes per 24 hours.',
    })
  }
  const existing = await db
    .select({ id: schema.galleryLikes.id })
    .from(schema.galleryLikes)
    .where(
      and(
        eq(schema.galleryLikes.galleryStem, stem),
        eq(schema.galleryLikes.ipAddress, ip),
      ),
    )
    .limit(1)

  let liked: boolean

  if (existing.length > 0) {
    // Already liked → unlike (remove the record)
    await db
      .delete(schema.galleryLikes)
      .where(
        and(
          eq(schema.galleryLikes.galleryStem, stem),
          eq(schema.galleryLikes.ipAddress, ip),
        ),
      )
    liked = false
  }
  else {
    // Not liked → like (insert new record)
    await db.insert(schema.galleryLikes).values({
      galleryStem: stem,
      ipAddress: ip,
    })
    liked = true
  }

  // Return updated count
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.galleryLikes)
    .where(eq(schema.galleryLikes.galleryStem, stem))

  return {
    stem,
    count: countResult[0]?.count ?? 0,
    liked,
  }
})
