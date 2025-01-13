// server/api/likes/add.post.ts
import { defineEventHandler, readBody } from 'h3'

import { likes } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const db = hubDatabase()
  const body = await readBody(event)

  // Validasi input
  if (!body.articleId) {
    return { success: false, message: 'Article ID is required.' }
  }

  // Ambil alamat IP dari header
  const userIp = event.node.req.headers['x-forwarded-for'] || event.node.req.connection.remoteAddress

  // Hitung jumlah like dari IP ini dalam waktu 10 menit terakhir
  const tenMinutesAgo = Date.now() - (10 * 60 * 1000)

  try {
    const countResult = await db
      .prepare(`
        SELECT COUNT(*) AS count
        FROM likes
        WHERE user_ip = ?1 AND created_at > ?2
      `)
      .bind(userIp, tenMinutesAgo)
      .first('count')

    if (countResult >= 10) {
      return { success: false, message: 'Limit exceeded. You can only like up to 10 times in 10 minutes.' }
    }

    // Tambahkan like baru ke database
    await db
      .prepare(`
        INSERT INTO likes (article_id, user_ip, created_at)
        VALUES (?1, ?2, ?3)
      `)
      .bind(body.articleId, userIp, Date.now())
      .run()

    return { success: true }
  }
  catch (error) {
    console.error('Error adding like:', error)
    return { success: false, message: 'Internal Server Error' }
  }
})
