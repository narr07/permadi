// server/database/schema.ts
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const likes = sqliteTable('likes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  articleId: text('article_id').notNull(), // ID artikel yang disukai
  userIp: text('user_ip').notNull(), // Alamat IP pengguna
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(), // Waktu saat like dibuat
})
