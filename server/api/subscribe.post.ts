// server/api/subscribe.post.ts
// Add a contact to the Resend Audience (newsletter subscription)

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.email || typeof body.email !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Email is required',
    })
  }

  // Basic email validation
  const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-z]{2,}$/i
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email format',
    })
  }

  const { audienceId } = useResendConfig()

  if (!audienceId) {
    throw createError({
      statusCode: 500,
      message: 'Audience not configured',
    })
  }

  try {
    const data = await resendCreateContact(audienceId, body.email, body.firstName || '', body.lastName || '')
    return { success: true, id: data?.id }
  }
  catch (err: any) {
    // If contact already exists, treat as success
    const message = err?.data?.message || err?.message || ''
    if (message.includes('already exists')) {
      return { success: true, message: 'already_subscribed' }
    }
    throw createError({
      statusCode: 500,
      message: message || 'Failed to subscribe',
    })
  }
})
