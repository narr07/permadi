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

	const meta = defaultDetail()
	const metaUser = defaultDetail()
	const metaSection: Record<string, ReturnType<typeof defaultDetail>> = {}

	try {
		const allRows = await db
			.select()
			.from(schema.reactions)
			.where(eq(schema.reactions.contentSlug, slug))

		for (const row of allRows) {
			const type = row.type as 'CLAPPING' | 'THINKING' | 'AMAZED'
			const count = row.count || 0
			const sec = row.section || 'general'

			// 1. Akumulasi total global
			if (meta[type] !== undefined) {
				meta[type] += count
			}

			// 2. Akumulasi user saat ini
			if (row.sessionId === sessionId && metaUser[type] !== undefined) {
				metaUser[type] += count
			}

			// 3. Akumulasi per section
			if (!metaSection[sec]) {
				metaSection[sec] = defaultDetail()
			}
			if (metaSection[sec][type] !== undefined) {
				metaSection[sec][type] += count
			}
		}

		return {
			meta: { reactionsDetail: meta },
			metaUser: { reactionsDetail: metaUser },
			metaSection,
		}
	}
	catch (error: any) {
		console.error('Error fetching reactions from NuxtHub D1:', error)
		return {
			meta: { reactionsDetail: meta },
			metaUser: { reactionsDetail: metaUser },
			metaSection,
		}
	}
})
