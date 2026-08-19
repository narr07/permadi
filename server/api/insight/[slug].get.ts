import { eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'
import { getSessionId } from '../../utils/session'

export default defineEventHandler(async (event) => {
	const slug = getRouterParam(event, 'slug')
	if (!slug) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Slug is required',
		})
	}

	const sessionId = await getSessionId(event)

	const defaultDetail = () => ({
		CLAPPING: 0,
		THINKING: 0,
		AMAZED: 0,
	})

	const reactionsDetail = defaultDetail()
	const userReactionsDetail = defaultDetail()
	const metaSection: Record<string, ReturnType<typeof defaultDetail>> = {}

	let views = 0
	let shares = 0

	try {
		// 1. Ambil data views & shares dari content_meta
		const metaRow = await db
			.select()
			.from(schema.contentMeta)
			.where(eq(schema.contentMeta.slug, slug))
			.get()

		if (metaRow) {
			views = metaRow.views || 0
			shares = metaRow.shares || 0
		}

		// 2. Ambil semua data reaksi untuk slug ini
		const allReactions = await db
			.select()
			.from(schema.reactions)
			.where(eq(schema.reactions.contentSlug, slug))

		let totalReactions = 0

		for (const row of allReactions) {
			const type = row.type as 'CLAPPING' | 'THINKING' | 'AMAZED'
			const count = row.count || 0
			const sec = row.section || 'general'

			if (reactionsDetail[type] !== undefined) {
				reactionsDetail[type] += count
				totalReactions += count
			}

			if (row.sessionId === sessionId && userReactionsDetail[type] !== undefined) {
				userReactionsDetail[type] += count
			}

			if (!metaSection[sec]) {
				metaSection[sec] = defaultDetail()
			}
			if (metaSection[sec][type] !== undefined) {
				metaSection[sec][type] += count
			}
		}

		return {
			meta: {
				views,
				shares,
				reactions: totalReactions,
				reactionsDetail,
			},
			metaUser: {
				reactionsDetail: userReactionsDetail,
			},
			metaSection,
		}
	}
	catch (error: any) {
		console.error('Error fetching insight from NuxtHub D1:', error)
		return {
			meta: {
				views,
				shares,
				reactions: 0,
				reactionsDetail,
			},
			metaUser: {
				reactionsDetail: userReactionsDetail,
			},
			metaSection,
		}
	}
})
