import { eq } from 'drizzle-orm'
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

	const body = await readBody<{ network?: string }>(event).catch(() => ({}))
	const network = (body?.network || 'unknown').substring(0, 50)
	const sessionId = await getSessionId(event)
	const nowIso = new Date().toISOString()

	try {
		// 1. Catat ke tabel content_activity
		await db.insert(schema.contentActivity).values({
			contentSlug: slug,
			activityType: 'SHARE',
			network,
			sessionId,
			createdAt: nowIso,
		})

		// 2. Increment shares di content_meta
		const existingMeta = await db
			.select()
			.from(schema.contentMeta)
			.where(eq(schema.contentMeta.slug, slug))
			.get()

		if (existingMeta) {
			await db
				.update(schema.contentMeta)
				.set({
					shares: (existingMeta.shares || 0) + 1,
					updatedAt: nowIso,
				})
				.where(eq(schema.contentMeta.slug, slug))
		}
		else {
			await db.insert(schema.contentMeta).values({
				slug,
				views: 0,
				shares: 1,
				createdAt: nowIso,
				updatedAt: nowIso,
			})
		}

		return { success: true }
	}
	catch (error: any) {
		console.error('Error recording share in NuxtHub D1:', error)
		return { success: false }
	}
})
