// server/api/unsubscribe.post.ts
// Remove a contact from the Resend Audience (unsubscribe)

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.email || typeof body.email !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Email is required',
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

  // Get the contact by email to find their ID
  const { data: contacts, error: listError } = await resend.contacts.list({ audienceId })

  if (listError) {
    throw createError({
      statusCode: 500,
      message: listError.message || 'Failed to fetch contacts',
    })
  }

  const contact = contacts?.data?.find(c => c.email === body.email)

  if (!contact) {
    throw createError({
      statusCode: 404,
      message: 'Contact not found',
    })
  }

  const { error } = await resend.contacts.update({
    id: contact.id,
    audienceId,
    unsubscribed: true,
  })

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to unsubscribe',
    })
  }

  return { success: true }
})
