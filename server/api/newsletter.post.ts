// server/api/newsletter.post.ts
// Send newsletter email to all subscribers in the Resend Audience
// This should be called manually or via webhook when a new blog post is published

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Simple API key protection — use a secret token to authorize sending
  const config = useRuntimeConfig()
  const authHeader = getRequestHeader(event, 'authorization')

  if (!authHeader || authHeader !== `Bearer ${config.resendApiKey}`) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  if (!body.title || !body.slug || !body.description) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: title, slug, description',
    })
  }

  const resend = useResend()
  const { audienceId } = useResendConfig()

  if (!audienceId) {
    throw createError({
      statusCode: 500,
      message: 'Audience not configured',
    })
  }

  // Get all subscribed contacts
  const { data: contacts, error: listError } = await resend.contacts.list({ audienceId })

  if (listError) {
    throw createError({
      statusCode: 500,
      message: listError.message || 'Failed to fetch contacts',
    })
  }

  const subscribedEmails = contacts?.data
    ?.filter(c => !c.unsubscribed)
    ?.map(c => c.email)
    || []

  if (subscribedEmails.length === 0) {
    return { success: true, sent: 0, message: 'No subscribers' }
  }

  const blogUrl = `https://permadi.dev/blog/${body.slug}`
  const unsubscribeUrl = `https://permadi.dev/api/unsubscribe`

  const htmlContent = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #134e43; margin: 0;">Permadi</h2>
        <p style="color: #6b7280; font-size: 14px;">Blog baru telah dipublikasikan!</p>
      </div>

      <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h1 style="font-size: 22px; color: #111827; margin: 0 0 12px 0;">${body.title}</h1>
        <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">${body.description}</p>
        <a href="${blogUrl}" style="display: inline-block; background: #134e43; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Baca Selengkapnya →</a>
      </div>

      <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px;">
          Kamu menerima email ini karena berlangganan newsletter Permadi.<br>
          <a href="${unsubscribeUrl}" style="color: #9ca3af;">Berhenti berlangganan</a>
        </p>
      </div>
    </div>
  `

  // Send to each subscriber (Resend supports max 50 recipients per send)
  const batchSize = 50
  let totalSent = 0
  const errors: string[] = []

  for (let i = 0; i < subscribedEmails.length; i += batchSize) {
    const batch = subscribedEmails.slice(i, i + batchSize)

    const { error } = await resend.emails.send({
      from: 'Dinar Permadi <narr@permadi.dev>',
      to: batch,
      subject: `📝 Blog Baru: ${body.title}`,
      html: htmlContent,
      tags: [
        { name: 'category', value: 'newsletter' },
        { name: 'slug', value: body.slug },
      ],
    })

    if (error) {
      errors.push(`Batch ${i / batchSize + 1}: ${error.message}`)
    }
    else {
      totalSent += batch.length
    }
  }

  return {
    success: errors.length === 0,
    sent: totalSent,
    total: subscribedEmails.length,
    errors: errors.length > 0 ? errors : undefined,
  }
})
