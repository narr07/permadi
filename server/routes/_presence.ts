import type { Peer } from 'crossws'

// Jumlah pengunjung yang sedang membuka situs. Diadaptasi dari ThePresenceIndicator di roe.dev
// (https://github.com/danielroe/roe.dev, MIT, Daniel Roe). Di sana hitungannya disatukan lewat Redis;
// di sini preset cloudflare_durable mengarahkan semua WebSocket ke satu Durable Object, jadi jumlah
// koneksi terbuka di objek itu sudah jumlah pengunjung di seluruh situs.

const TOPIC = 'presence'
// Hanya halaman situs ini yang boleh membuka koneksi, agar angka tidak bisa digelembungkan dari luar
const ALLOWED_HOSTS = new Set(['permadi.dev', 'localhost', '127.0.0.1'])
const OPEN = 1

function openCount(peer: Peer, exclude?: Peer) {
	let n = 0
	for (const p of peer.peers) {
		if (p !== exclude && p.websocket.readyState === OPEN)
			n++
	}
	return n
}

function announce(peer: Peer, count: number, includeSelf: boolean) {
	const message = `connections:${count}`
	peer.publish(TOPIC, message)
	if (includeSelf)
		peer.send(message)
}

export default defineWebSocketHandler({
	upgrade(request) {
		let host = ''
		try {
			host = new URL(request.headers.get('origin') || '').hostname
		}
		catch {}
		if (!ALLOWED_HOSTS.has(host))
			return new Response('Forbidden', { status: 403 })
	},
	open(peer) {
		peer.subscribe(TOPIC)
		announce(peer, openCount(peer), true)
	},
	// Heartbeat "ping" dijawab otomatis oleh Cloudflare (lihat server/plugins/presence.ts);
	// cadangan untuk mode dev dan bila jawaban otomatis belum terpasang
	message(peer, message) {
		if (message.text() === 'ping')
			peer.send('pong')
	},
	close(peer) {
		announce(peer, openCount(peer, peer), false)
	},
	error(peer) {
		announce(peer, openCount(peer, peer), false)
	},
})
