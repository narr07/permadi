import { and, eq, gte } from 'drizzle-orm'
import { db, schema } from 'hub:db'
import { getSessionId } from '../../../utils/session'

export default defineEventHandler(async (event) => {
	const slug = getRouterParam(event, 'slug')
	if (!slug) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Slug is required',
		})
	}

	const sessionId = await getSessionId(event)
	const now = new Date()
	const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()
	const nowIso = now.toISOString()

	try {
		// 1. Cek apakah session ini sudah mencatat view dalam 4 jam terakhir
		const recentView = await db
			.select()
			.from(schema.contentActivity)
			.where(
				and(
					eq(schema.contentActivity.contentSlug, slug),
					eq(schema.contentActivity.activityType, 'VIEW'),
					eq(schema.contentActivity.sessionId, sessionId),
					gte(schema.contentActivity.createdAt, fourHoursAgo),
				),
			)
			.get()

		if (recentView) {
			// Sudah tercatat, jangan duplikasi hitungan view
			return { success: true, isNewView: false }
		}

		// 2. Catat aktivitas view baru
		await db.insert(schema.contentActivity).values({
			contentSlug: slug,
			activityType: 'VIEW',
			sessionId,
			createdAt: nowIso,
		})

		// 3. Upsert / increment views di tabel content_meta
		const existingMeta = await db
			.select()
			.from(schema.contentMeta)
			.where(eq(schema.contentMeta.slug, slug))
			.get()

		if (existingMeta) {
			await db
				.update(schema.contentMeta)
				.set({
					views: (existingMeta.views || 0) + 1,
					updatedAt: nowIso,
				})
				.where(eq(schema.contentMeta.slug, slug))
		}
		else {
			await db.insert(schema.contentMeta).values({
				slug,
				views: 1,
				shares: 0,
				createdAt: nowIso,
				updatedAt: nowIso,
			})
		}

		return { success: true, isNewView: true }
	}
	catch (error: any) {
		console.error('Error recording view in NuxtHub D1:', error)
		return { success: false }
	}
})
