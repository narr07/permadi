// Tautan ke domain sendiri dibuka sebagai navigasi internal agar widget chat tetap terbuka
export function resolveChatLink(url: string) {
	try {
		const parsed = new URL(url, window.location.origin)
		if (parsed.origin === window.location.origin || parsed.hostname.endsWith('permadi.dev'))
			return { to: `${parsed.pathname}${parsed.search}${parsed.hash}`, external: false, label: parsed.pathname }
		return { to: url, external: true, label: parsed.hostname }
	}
	catch {
		return { to: url, external: true, label: url }
	}
}
