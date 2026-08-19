import type { H3Event } from 'h3'
import { getHeader, getRequestIP } from 'h3'

export async function getSessionId(event: H3Event): Promise<string> {
	try {
		const ip = getHeader(event, 'cf-connecting-ip')
			|| getRequestIP(event, { xForwardedFor: true })
			|| '127.0.0.1'
		const config = useRuntimeConfig(event)
		const salt = config.sessionSalt || 'permadi-reactions-salt-key-2026'

		const msgUint8 = new TextEncoder().encode(ip + salt)
		if (typeof crypto !== 'undefined' && crypto.subtle) {
			const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
			const hashArray = Array.from(new Uint8Array(hashBuffer))
			return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
		}

		// Fallback simple hash jika crypto.subtle tidak tersedia
		let hash = 0
		const str = ip + salt
		for (let i = 0; i < str.length; i++) {
			hash = ((hash << 5) - hash) + str.charCodeAt(i)
			hash |= 0
		}
		return Math.abs(hash).toString(16)
	}
	catch {
		return 'anonymous-session'
	}
}

