// server/api/gallery-likes.post.ts
// POST /api/gallery-likes
// Add a like to a gallery item using image as identifier (same across locales)
import { and, eq, gt, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const image = body?.image as string

  if (!image || typeof image !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid image is required in request body',
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

  // Insert the like (reuse galleryStem column to store image identifier)
  await db.insert(schema.galleryLikes).values({
    galleryStem: image,
    ipAddress: ip,
  })

  // Return updated count
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.galleryLikes)
    .where(eq(schema.galleryLikes.galleryStem, image))

  return {
    image,
    count: countResult[0]?.count ?? 0,
  }
})
