export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { chatProxySecret } = useRuntimeConfig(event)

	const GATEWAY_URL
		= process.env.CHAT_GATEWAY_URL
			|| 'https://8787-agqwzwuabezjc5sxhm4y77kkyy.instabox.tech/v1/chat'

	// Gateway membatasi chat per IP. Tanpa header ini ia hanya melihat IP Cloudflare,
	// jadi IP pengunjung diteruskan bersama secret bersama yang diverifikasi gateway.
	const clientIp = getRequestHeader(event, 'cf-connecting-ip')
		|| getRequestIP(event, { xForwardedFor: true })
		|| ''

	try {
		const res = await fetch(GATEWAY_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(chatProxySecret && clientIp
					? { 'X-Proxy-Secret': chatProxySecret, 'X-Client-IP': clientIp }
					: {}),
			},
			body: JSON.stringify(body),
		})

		// Error gateway (400, 429, ...) diteruskan apa adanya agar widget bisa membaca code & resetAt
		if (!res.ok) {
			setResponseStatus(event, res.status)
			const errText = await res.text()
			try {
				return JSON.parse(errText)
			}
			catch {
				return { error: 'Gateway error', message: errText || 'Gateway error' }
			}
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
			statusCode: 502,
			statusMessage: err.message || 'Failed to connect to AI Gateway',
		})
	}
})
