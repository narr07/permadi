// Heartbeat WebSocket penghitung pengunjung (server/routes/_presence.ts): Cloudflare menjawab "ping"
// dengan "pong" tanpa membangunkan Durable Object, jadi koneksi yang diam tetap hidup tanpa memakai CPU.

// Kelas ini hanya ada di runtime Workers (tidak di mode dev Node), jadi diambil dari globalThis
type AutoResponsePair = new (request: string, response: string) => unknown
const Pair = (globalThis as { WebSocketRequestResponsePair?: AutoResponsePair }).WebSocketRequestResponsePair

export default defineNitroPlugin((nitroApp) => {
	nitroApp.hooks.hook('cloudflare:durable:init', (_durable, { state }) => {
		if (Pair)
			state.setWebSocketAutoResponse(new Pair('ping', 'pong') as Parameters<typeof state.setWebSocketAutoResponse>[0])
	})
})
