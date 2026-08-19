import type { H3Event } from 'h3'
import { getRequestIP } from 'h3'

export async function getSessionId(event: H3Event): Promise<string> {
	const ip = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1'
	const salt = useRuntimeConfig().sessionSalt || 'permadi-reactions-salt-key-2026'

	const msgUint8 = new TextEncoder().encode(ip + salt)
	const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
	const hashArray = Array.from(new Uint8Array(hashBuffer))
	return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
