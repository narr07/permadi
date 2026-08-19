import { and, eq } from 'drizzle-orm'
import { db, schema } from 'hub:db'
import { getSessionId } from '../../utils/session'

const MAX_REACTION_LIMIT = 20
const VALID_TYPES = ['CLAPPING', 'THINKING', 'AMAZED'] as const
type ReactionType = typeof VALID_TYPES[number]

export default defineEventHandler(async (event) => {
	const slug = getRouterParam(event, 'slug')
	if (!slug) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Slug is required',
		})
	}

	const body = await readBody<{
		type: ReactionType
		section?: string
		count?: number
	}>(event)

	if (!body || !VALID_TYPES.includes(body.type)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid reaction type',
		})
	}

	const requestedCount = Math.min(Math.max(1, body.count || 1), MAX_REACTION_LIMIT)
	const section = (body.section || 'general').trim().substring(0, 100)
	const sessionId = await getSessionId(event)

	try {
		// 1. Hitung berapa reaksi yang sudah diberikan user ini untuk type tertentu
		const userReactions = await db
			.select()
			.from(schema.reactions)
			.where(
				and(
					eq(schema.reactions.contentSlug, slug),
					eq(schema.reactions.sessionId, sessionId),
					eq(schema.reactions.type, body.type),
				),
			)

		const currentCount = userReactions.reduce((acc, r) => acc + (r.count || 0), 0)

		if (currentCount >= MAX_REACTION_LIMIT) {
			return {
				success: false,
				message: 'Reaction limit reached for this session',
				currentCount,
				addedCount: 0,
			}
		}

		// Hitung kuota yang tersisa
		const allowedCount = Math.min(requestedCount, MAX_REACTION_LIMIT - currentCount)

		if (allowedCount <= 0) {
			return {
				success: false,
				message: 'No remaining quota',
				currentCount,
				addedCount: 0,
			}
		}

		// 2. Insert row baru ke NuxtHub D1
		const now = new Date().toISOString()
		await db.insert(schema.reactions).values({
			contentSlug: slug,
			type: body.type,
			section,
			count: allowedCount,
			sessionId,
			createdAt: now,
		})

		return {
			success: true,
			addedCount: allowedCount,
			totalUserCount: currentCount + allowedCount,
		}
	}
	catch (error: any) {
		console.error('Error saving reaction to NuxtHub D1:', error)
		throw createError({
			statusCode: 500,
			statusMessage: error?.message || 'Failed to record reaction',
		})
	}
})
