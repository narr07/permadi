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

  const { audienceId } = useResendConfig()

  if (!audienceId) {
    throw createError({
      statusCode: 500,
      message: 'Audience not configured',
    })
  }

  // Get the contact by email to find their ID
  const contacts = await resendListContacts(audienceId)
  const contact = contacts?.data?.find(c => c.email === body.email)

  if (!contact) {
    throw createError({
      statusCode: 404,
      message: 'Contact not found',
    })
  }

  await resendUpdateContact(audienceId, contact.id, { unsubscribed: true })

  return { success: true }
})
