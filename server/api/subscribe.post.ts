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

  const resend = useResend()
  const { audienceId } = useResendConfig()

  if (!audienceId) {
    throw createError({
      statusCode: 500,
      message: 'Audience not configured',
    })
  }

  const { data, error } = await resend.contacts.create({
    email: body.email,
    firstName: body.firstName || '',
    lastName: body.lastName || '',
    audienceId,
    unsubscribed: false,
  })

  if (error) {
    // If contact already exists, treat as success
    if (error.message?.includes('already exists')) {
      return { success: true, message: 'already_subscribed' }
    }
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to subscribe',
    })
  }

  return { success: true, id: data?.id }
})
