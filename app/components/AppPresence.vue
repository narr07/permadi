<script setup lang="ts">
// Jumlah pengunjung yang sedang membuka situs, lewat satu WebSocket ke /_presence.
// Diadaptasi dari ThePresenceIndicator di roe.dev (https://github.com/danielroe/roe.dev, MIT, Daniel Roe).
// Server mengirim "connections:<n>" setiap ada pengunjung datang atau pergi.

const { locale } = useI18n()

const PING_INTERVAL = 30_000
const MAX_RETRIES = 6

const count = ref<number | null>(null)

// Angka 1 berarti hanya pembaca sendiri, jadi indikator baru muncul bila ada orang lain
const visible = computed(() => (count.value ?? 0) >= 2)

const copy = computed(() => {
	const n = count.value ?? 0
	return locale.value === 'id'
		? { short: `${n} online`, full: `${n} orang sedang membuka permadi.dev saat ini` }
		: { short: `${n} online`, full: `${n} people are on permadi.dev right now` }
})

let socket: WebSocket | undefined
let pingTimer: ReturnType<typeof setInterval> | undefined
let retryTimer: ReturnType<typeof setTimeout> | undefined
let retries = 0
let stopped = false

function connect() {
	const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
	const ws = new WebSocket(`${protocol}://${location.host}/_presence`)
	socket = ws

	ws.addEventListener('open', () => {
		retries = 0
		// Tanpa lalu lintas, koneksi yang diam bisa diputus jaringan; ping dijawab Cloudflare tanpa biaya CPU
		pingTimer = setInterval(() => {
			if (ws.readyState === WebSocket.OPEN)
				ws.send('ping')
		}, PING_INTERVAL)
	})

	ws.addEventListener('message', (event) => {
		if (typeof event.data !== 'string')
			return
		const [type, value] = event.data.split(':')
		if (type !== 'connections' || !value)
			return
		const n = Number.parseInt(value, 10)
		if (Number.isFinite(n))
			count.value = n
	})

	ws.addEventListener('close', () => {
		clearInterval(pingTimer)
		if (socket === ws)
			socket = undefined
		if (stopped || retries >= MAX_RETRIES) {
			count.value = null
			return
		}
		retryTimer = setTimeout(connect, Math.min(30_000, 1000 * 2 ** retries++))
	})
}

onNuxtReady(connect)

onBeforeUnmount(() => {
	stopped = true
	clearTimeout(retryTimer)
	clearInterval(pingTimer)
	socket?.close()
})
</script>

<template>
	<Transition
		enter-active-class="motion-safe:transition-opacity motion-safe:duration-200"
		enter-from-class="opacity-0"
		leave-active-class="motion-safe:transition-opacity motion-safe:duration-150"
		leave-to-class="opacity-0"
	>
		<p
			v-if="visible"
			class="m-0 h-8 inline-flex items-center gap-2 border border-slate-300 bg-white px-3 text-xs text-slate-700 font-sans tabular-nums dark:border-[#134e43] dark:bg-[#001e1c] dark:text-slate-200"
			:title="copy.full"
		>
			<!-- Penanda keadaan langsung: diam, tanpa denyut atau glow -->
			<span
				class="inline-block h-2 w-2 bg-brand-600 dark:bg-brand-400"
				aria-hidden="true"
			/>
			<span aria-hidden="true">{{ copy.short }}</span>
			<span class="sr-only">{{ copy.full }}</span>
		</p>
	</Transition>
</template>
