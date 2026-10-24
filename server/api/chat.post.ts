export default defineEventHandler(async (event) => {
	const body = await readBody(event)

	const GATEWAY_URL
		= process.env.CHAT_GATEWAY_URL
			|| 'https://8787-agqwzwuabezjc5sxhm4y77kkyy.instabox.tech/v1/chat'

	try {
		const res = await fetch(GATEWAY_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})

		if (!res.ok) {
			const errText = await res.text()
			throw createError({
				statusCode: res.status,
				statusMessage: errText || 'Gateway error',
			})
		}

		setResponseHeaders(event, {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive',
		})

		if (res.body) {
			return sendStream(event, res.body)
		}

		return null
	}
	catch (err: any) {
		throw createError({
			statusCode: err.statusCode || 502,
			statusMessage: err.message || 'Failed to connect to AI Gateway',
		})
	}
})
