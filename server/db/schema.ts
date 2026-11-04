import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const contentMeta = sqliteTable('content_meta', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	slug: text('slug').notNull().unique(),
	views: integer('views').notNull().default(0),
	shares: integer('shares').notNull().default(0),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull(),
})

export const reactions = sqliteTable('reactions', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	contentSlug: text('content_slug').notNull(),
	type: text('type').notNull(), // 'CLAPPING' | 'THINKING' | 'AMAZED'
	section: text('section').notNull(), // ID heading subtopik aktif
	count: integer('count').notNull().default(1),
	sessionId: text('session_id').notNull(),
	createdAt: text('created_at').notNull(),
})

export const contentActivity = sqliteTable('content_activity', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	contentSlug: text('content_slug').notNull(),
	activityType: text('activity_type').notNull(), // 'VIEW' | 'SHARE'
	network: text('network'), // 'whatsapp' | 'x' | 'linkedin' | 'copy_link' dll
	sessionId: text('session_id').notNull(),
	createdAt: text('created_at').notNull(),
})

// Masukan pengunjung tentang situs (bukan per artikel). Privat: tidak pernah ditampilkan di situs.
export const siteFeedback = sqliteTable('site_feedback', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	category: text('category').notNull(), // 'design' | 'content' | 'bug' | 'other'
	message: text('message').notNull(),
	email: text('email'),
	page: text('page'), // path halaman tempat formulir dibuka
	locale: text('locale'),
	ipHash: text('ip_hash').notNull(), // SHA-256 IP + salt, untuk batas kiriman; IP asli tidak disimpan
	createdAt: text('created_at').notNull(),
})

export type Reaction = typeof reactions.$inferSelect
export type NewReaction = typeof reactions.$inferInsert
export type ContentMeta = typeof contentMeta.$inferSelect
export type NewContentMeta = typeof contentMeta.$inferInsert
export type ContentActivity = typeof contentActivity.$inferSelect
export type NewContentActivity = typeof contentActivity.$inferInsert
