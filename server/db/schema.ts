// Drizzle ORM schema for reactions and gallery likes
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const reactions = sqliteTable('reactions', {
  id: integer().primaryKey({ autoIncrement: true }),
  postId: integer('post_id').notNull(), // idBlog dari artikel (sama untuk semua bahasa)
  reactionType: text('reaction_type').notNull(), // 'love', 'like', 'sad'
  ipAddress: text('ip_address').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const galleryLikes = sqliteTable('gallery_likes', {
  id: integer().primaryKey({ autoIncrement: true }),
  galleryStem: text('gallery_stem').notNull(), // stem dari gallery item (e.g., 'ijem')
  ipAddress: text('ip_address').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})
