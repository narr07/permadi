import { db, schema } from 'hub:db'
import { getSessionId } from '../utils/session'

export default defineEventHandler(async (event) => {
	const results: Record<string, any> = {}

	// Test 1: Session ID
	try {
		const sessionId = await getSessionId(event)
		results.session = { success: true, sessionId }
	}
	catch (err: any) {
		results.session = { success: false, error: err.message, stack: err.stack }
	}

	// Test 2: Check hub:db and schema.reactions
	try {
		const count = await db.select().from(schema.reactions)
		results.reactionsTable = { success: true, rowsCount: count.length }
	}
	catch (err: any) {
		results.reactionsTable = { success: false, error: err.message, stack: err.stack }
	}

	// Test 3: Check schema.contentMeta
	try {
		const meta = await db.select().from(schema.contentMeta)
		results.contentMetaTable = { success: true, rowsCount: meta.length }
	}
	catch (err: any) {
		results.contentMetaTable = { success: false, error: err.message, stack: err.stack }
	}

	// Test 4: Check schema.contentActivity
	try {
		const activity = await db.select().from(schema.contentActivity)
		results.contentActivityTable = { success: true, rowsCount: activity.length }
	}
	catch (err: any) {
		results.contentActivityTable = { success: false, error: err.message, stack: err.stack }
	}

	// Test 5: Check raw Cloudflare env binding
	try {
		const cf = (event.context as any).cloudflare
		results.cloudflareContext = {
			hasContext: !!cf,
			hasEnv: !!cf?.env,
			hasDBBinding: !!cf?.env?.DB,
			envKeys: cf?.env ? Object.keys(cf.env) : [],
		}
	}
	catch (err: any) {
		results.cloudflareContext = { success: false, error: err.message }
	}

	return results
})
