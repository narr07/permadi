export default defineEventHandler(async (event) => {
	const body = await readBody<{ email?: string }>(event)

	if (!body?.email || typeof body.email !== 'string') {
		throw createError({
			statusCode: 400,
			statusMessage: 'Email is required',
		})
	}

	const email = body.email.trim().toLowerCase()
	const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-z]{2,}$/i
	if (!emailRegex.test(email)) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid email format',
		})
	}

	const { audienceId, apiKey } = useResendConfig()

	if (!apiKey || !audienceId) {
		throw createError({
			statusCode: 503,
			statusMessage: 'Resend is not configured on server (RESEND_API_KEY / RESEND_AUDIENCE_ID missing)',
		})
	}

	try {
		const data = await resendCreateContact(audienceId, email)
		return {
			success: true,
			id: data?.id,
			message: 'subscribed',
		}
	}
	catch (err: unknown) {
		const errorObj = err as { data?: { message?: string }, message?: string }
		const message = errorObj?.data?.message || errorObj?.message || ''

		// If contact already exists in audience, treat as already subscribed
		if (message.toLowerCase().includes('already exists')) {
			return {
				success: true,
				message: 'already_subscribed',
			}
		}

		throw createError({
			statusCode: 500,
			statusMessage: message || 'Failed to subscribe',
		})
	}
})
