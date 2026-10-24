<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

// Struktur mengikuti komponen chat Nuxt UI (ChatMessages, ChatMessage, ChatTool, ChatReasoning,
// ChatPrompt, ChatPromptSubmit) seperti dipakai asisten nuxt.com, ditulis ulang dengan UnoCSS
// karena situs ini tidak memakai @nuxt/ui.

const { locale } = useI18n()

const GATEWAY_URL = 'https://8787-agqwzwuabezjc5sxhm4y77kkyy.instabox.tech/v1/chat'
const MAX_MESSAGE_LENGTH = 2000
const DAILY_LIMIT = 10

type ChatStatus = 'ready' | 'submitted' | 'streaming' | 'error'

interface SourceItem {
	title: string
	url: string
}

interface ChatMessage {
	id: number
	role: 'user' | 'assistant'
	content: string
	search?: { state: 'start' | 'done', query?: string, count?: number }
	searchOpen?: boolean
	sources?: SourceItem[]
	reasoning?: string
	reasoningStartedAt?: number
	reasoningMs?: number
	reasoningOpen?: boolean
	reasoningTouched?: boolean
	model?: string
	error?: boolean
	retryable?: boolean
}

const isOpen = ref(false)
const input = ref('')
const status = ref<ChatStatus>('ready')
const messages = ref<ChatMessage[]>([])
const isAtBottom = ref(true)
const copiedId = ref<number | null>(null)
const remaining = ref<number | null>(null)

const scrollRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const toggleRef = ref<HTMLButtonElement | null>(null)

// Dimuat saat jawaban pertama dirender, agar Comark + rangi tidak membebani muatan awal tiap halaman
const ChatMarkdown = defineAsyncComponent(() => import('~/components/chat/ChatMarkdown'))
const streamingCaret = { class: 'inline-block w-2 h-[1em] bg-current align-middle ml-px opacity-70 animate-pulse' }

let nextId = 0
let abortController: AbortController | null = null

const isBusy = computed(() => status.value === 'submitted' || status.value === 'streaming')
const lastMessage = computed(() => messages.value[messages.value.length - 1])

const copy = computed(() => {
	if (locale.value === 'id') {
		return {
			toggleOpen: 'Tanya AI',
			toggleClose: 'Tutup',
			title: 'Tanya isi blog & projek',
			subtitle: 'Jawaban diambil dari artikel dan projek di situs ini',
			welcome: 'Halo! Saya bisa menjawab pertanyaan seputar artikel blog dan projek Permadi. Setiap jawaban disertai daftar halaman sumbernya.',
			suggestionsLabel: 'Coba tanyakan',
			suggestions: [
				'Apa itu metode accelerated learning?',
				'Ceritakan projek Majalengka Tech',
				'Bagaimana kurikulum di Indonesia berkembang?',
				'Apa ciri desain Swiss style?',
			],
			placeholder: 'Tanyakan seputar artikel atau projek...',
			hint: 'Enter untuk kirim, Shift + Enter untuk baris baru',
			quota: (n: number) => `Sisa ${n} dari ${DAILY_LIMIT} pertanyaan hari ini`,
			searching: 'Mencari di artikel dan projek...',
			searched: (n: number) => n > 0 ? `Menemukan ${n} sumber` : 'Tidak menemukan sumber yang cocok',
			thinking: 'Berpikir...',
			thought: (ms?: number) => ms && ms >= 1000 ? `Berpikir selama ${Math.round(ms / 1000)} dtk` : 'Berpikir sejenak',
			answeredBy: 'Dijawab oleh',
			newChat: 'Mulai percakapan baru',
			close: 'Tutup chat (Esc)',
			send: 'Kirim pertanyaan',
			stop: 'Hentikan jawaban',
			retry: 'Coba lagi',
			copy: 'Salin jawaban',
			copied: 'Tersalin',
			scrollDown: 'Gulir ke pesan terbaru',
			tooLong: `Pertanyaan terlalu panjang. Maksimal ${MAX_MESSAGE_LENGTH} karakter.`,
			errorPrefix: 'Jawaban gagal dimuat',
			errorNetwork: 'Server asisten tidak bisa dihubungi. Periksa koneksi Anda, lalu coba lagi.',
			errorStream: 'Jawaban terputus di tengah jalan. Coba kirim ulang pertanyaannya.',
			limitDaily: (reset?: string) => `Batas ${DAILY_LIMIT} pertanyaan per hari sudah tercapai.${reset ? ` Kuota terisi lagi sekitar pukul ${reset}.` : ' Coba lagi besok.'}`,
			limitMinute: 'Pertanyaan dikirim terlalu cepat. Tunggu satu menit, lalu coba lagi.',
			limitReached: 'Kuota pertanyaan hari ini sudah habis.',
			stopped: 'Jawaban dihentikan.',
		}
	}
	return {
		toggleOpen: 'Ask AI',
		toggleClose: 'Close',
		title: 'Ask about the blog & projects',
		subtitle: 'Answers come from the articles and projects on this site',
		welcome: 'Hi! I can answer questions about Permadi\'s blog articles and projects. Every answer lists the pages it came from.',
		suggestionsLabel: 'Try asking',
		suggestions: [
			'What is accelerated learning?',
			'Tell me about the Majalengka Tech project',
			'How has Indonesia\'s curriculum changed?',
			'What defines Swiss design style?',
		],
		placeholder: 'Ask about an article or project...',
		hint: 'Enter to send, Shift + Enter for a new line',
		quota: (n: number) => `${n} of ${DAILY_LIMIT} questions left today`,
		searching: 'Searching articles and projects...',
		searched: (n: number) => n > 0 ? `Found ${n} ${n === 1 ? 'source' : 'sources'}` : 'No matching sources found',
		thinking: 'Thinking...',
		thought: (ms?: number) => ms && ms >= 1000 ? `Thought for ${Math.round(ms / 1000)}s` : 'Thought briefly',
		answeredBy: 'Answered by',
		newChat: 'Start a new conversation',
		close: 'Close chat (Esc)',
		send: 'Send question',
		stop: 'Stop answer',
		retry: 'Try again',
		copy: 'Copy answer',
		copied: 'Copied',
		scrollDown: 'Scroll to latest message',
		tooLong: `Your question is too long. The limit is ${MAX_MESSAGE_LENGTH} characters.`,
		errorPrefix: 'The answer failed to load',
		errorNetwork: 'The assistant server could not be reached. Check your connection, then try again.',
		errorStream: 'The answer was cut off. Try sending the question again.',
		limitDaily: (reset?: string) => `You have reached the limit of ${DAILY_LIMIT} questions per day.${reset ? ` Your quota refills around ${reset}.` : ' Try again tomorrow.'}`,
		limitMinute: 'Questions are coming in too fast. Wait a minute, then try again.',
		limitReached: 'Today\'s question quota is used up.',
		stopped: 'Answer stopped.',
	}
})

const showSuggestions = computed(() => messages.value.every(m => m.role === 'assistant'))
const isTooLong = computed(() => input.value.length > MAX_MESSAGE_LENGTH)
const quotaExhausted = computed(() => remaining.value === 0)
const canSubmit = computed(() => input.value.trim().length > 0 && !isTooLong.value && !quotaExhausted.value)

function welcomeMessage(): ChatMessage {
	return { id: nextId++, role: 'assistant', content: copy.value.welcome }
}

function openChat() {
	isOpen.value = true
	if (messages.value.length === 0)
		messages.value.push(welcomeMessage())
	nextTick(() => {
		textareaRef.value?.focus()
		scrollToBottom()
	})
}

function closeChat() {
	isOpen.value = false
	nextTick(() => toggleRef.value?.focus())
}

function toggleChat() {
	if (isOpen.value)
		closeChat()
	else
		openChat()
}

function newChat() {
	stop()
	messages.value = [welcomeMessage()]
	status.value = 'ready'
	textareaRef.value?.focus()
}

// Auto-scroll hanya saat pengguna memang berada di dasar percakapan,
// supaya membaca jawaban sebelumnya tidak terganggu token yang masuk.
function onScroll() {
	const el = scrollRef.value
	if (!el)
		return
	isAtBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < 80
}

function scrollToBottom(smooth = false) {
	const el = scrollRef.value
	if (!el)
		return
	el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
	isAtBottom.value = true
}

// Markdown dirender async oleh MDC, jadi tinggi konten diikuti lewat ResizeObserver,
// bukan per token
let contentObserver: ResizeObserver | null = null
watch(contentRef, (el) => {
	contentObserver?.disconnect()
	contentObserver = null
	if (!el)
		return
	contentObserver = new ResizeObserver(() => {
		if (isAtBottom.value)
			scrollToBottom()
	})
	contentObserver.observe(el)
})

function autoResize() {
	const el = textareaRef.value
	if (!el)
		return
	el.style.height = 'auto'
	el.style.height = `${Math.min(el.scrollHeight, 160)}px`
}

function onPromptKeydown(e: KeyboardEvent) {
	if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
		e.preventDefault()
		submit()
	}
}

function onWindowKeydown(e: KeyboardEvent) {
	if (e.key === 'Escape' && isOpen.value)
		closeChat()
}

onMounted(() => window.addEventListener('keydown', onWindowKeydown))
onUnmounted(() => {
	window.removeEventListener('keydown', onWindowKeydown)
	abortController?.abort()
	contentObserver?.disconnect()
})

function submit() {
	if (isBusy.value || !canSubmit.value)
		return
	const query = input.value.trim()
	input.value = ''
	nextTick(autoResize)
	ask(query)
}

function sendSuggestion(prompt: string) {
	if (!isBusy.value && !quotaExhausted.value)
		ask(prompt)
}

function stop() {
	abortController?.abort()
}

function retry() {
	const lastUser = [...messages.value].reverse().find(m => m.role === 'user')
	if (!lastUser || isBusy.value)
		return
	// Buang pertanyaan dan jawaban gagal terakhir, lalu kirim ulang
	messages.value.splice(messages.value.lastIndexOf(lastUser))
	ask(lastUser.content)
}

function toggleReasoning(msg: ChatMessage) {
	msg.reasoningTouched = true
	msg.reasoningOpen = !msg.reasoningOpen
}

async function copyMessage(msg: ChatMessage) {
	try {
		await navigator.clipboard.writeText(msg.content)
		copiedId.value = msg.id
		setTimeout(() => {
			if (copiedId.value === msg.id)
				copiedId.value = null
		}, 2000)
	}
	catch {}
}

function formatClock(timestamp?: number | null) {
	if (!timestamp)
		return undefined
	return new Date(timestamp).toLocaleTimeString(locale.value === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' })
}

function isLiveMessage(msg: ChatMessage) {
	return isBusy.value && msg.id === lastMessage.value?.id
}

function markAnswerStarted(target: ChatMessage) {
	if (target.reasoningStartedAt && target.reasoningMs === undefined)
		target.reasoningMs = Date.now() - target.reasoningStartedAt
	// Seperti ChatReasoning: tutup otomatis setelah selesai, kecuali pengguna membukanya sendiri
	if (!target.reasoningTouched)
		target.reasoningOpen = false
}

async function ask(query: string) {
	const history = messages.value
		.filter(m => m.content && !m.error)
		.slice(-6)
		.map(m => ({ role: m.role, content: m.content }))

	messages.value.push({ id: nextId++, role: 'user', content: query })
	messages.value.push({ id: nextId++, role: 'assistant', content: '' })
	// Ambil proxy reaktif dari array agar perubahan konten ikut ter-render
	const target = messages.value[messages.value.length - 1]!

	status.value = 'submitted'
	await nextTick()
	scrollToBottom()

	abortController = new AbortController()
	const { signal } = abortController
	const payload = JSON.stringify({ message: query, lang: locale.value, history })

	const fail = (text: string, retryable = true) => {
		target.error = true
		target.retryable = retryable
		target.content = text
		status.value = 'error'
	}

	try {
		// Same-origin /api/chat (lolos CORS & CSP), fallback langsung ke gateway bila proxy mati
		let res: Response | null = await fetch('/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: payload,
			signal,
		}).catch((err) => {
			if (signal.aborted)
				throw err
			return null
		})

		if (!res || (!res.ok && res.status >= 500)) {
			res = await fetch(GATEWAY_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: payload,
				signal,
			})
		}

		if (!res.ok) {
			const errJson = await res.json().catch(() => ({}))
			if (res.status === 429 && errJson.code === 'minute_limit') {
				fail(copy.value.limitMinute)
			}
			else if (res.status === 429) {
				remaining.value = 0
				fail(copy.value.limitDaily(formatClock(errJson.resetAt)), false)
			}
			else {
				fail(`${copy.value.errorPrefix} (${res.status}). ${errJson.message || errJson.statusMessage || ''}`.trim())
			}
			return
		}

		if (!res.body)
			throw new Error('ReadableStream not supported')

		const reader = res.body.getReader()
		const decoder = new TextDecoder('utf-8')
		let buffer = ''
		let currentEvent = 'message'

		while (true) {
			const { value, done } = await reader.read()
			if (done)
				break

			buffer += decoder.decode(value, { stream: true })
			const lines = buffer.split('\n')
			buffer = lines.pop() || ''

			for (const line of lines) {
				const trimmed = line.trim()
				if (!trimmed)
					continue

				if (trimmed.startsWith('event: ')) {
					currentEvent = trimmed.slice(7)
					continue
				}
				if (!trimmed.startsWith('data: '))
					continue

				let data: any
				try {
					data = JSON.parse(trimmed.slice(6))
				}
				catch {
					continue
				}

				switch (currentEvent) {
					case 'search':
						target.search = data
						break
					case 'sources':
						target.sources = data
						break
					case 'reasoning':
						status.value = 'streaming'
						if (!target.reasoningStartedAt) {
							target.reasoningStartedAt = Date.now()
							target.reasoning = ''
							if (!target.reasoningTouched)
								target.reasoningOpen = true
						}
						target.reasoning += data.text || ''
						break
					case 'token':
						if (!data.token)
							break
						if (!target.content)
							markAnswerStarted(target)
						status.value = 'streaming'
						target.content += data.token
						break
					case 'error':
						fail(copy.value.errorStream)
						break
					case 'done':
						target.model = data.model
						if (typeof data.remaining === 'number')
							remaining.value = data.remaining
						break
				}
			}
		}
		markAnswerStarted(target)
		if (status.value !== 'error')
			status.value = 'ready'
	}
	catch {
		if (signal.aborted) {
			markAnswerStarted(target)
			if (!target.content)
				target.content = copy.value.stopped
			status.value = 'ready'
		}
		else {
			fail(copy.value.errorNetwork)
		}
	}
	finally {
		abortController = null
	}
}
</script>

<template>
	<!-- Tombol pembuka -->
	<div class="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6 print:hidden">
		<button
			ref="toggleRef"
			type="button"
			class="h-12 inline-flex cursor-pointer items-center gap-2 border px-4 text-sm font-semibold font-sans shadow-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2 focus-visible:outline"
			:class="isOpen
				? 'border-transparent bg-slate-900 text-white dark:bg-brand-400 dark:text-slate-950'
				: 'border-slate-300 bg-white text-slate-900 hover:border-brand-600 dark:border-[#134e43] dark:bg-[#001e1c] dark:text-slate-100 dark:hover:border-brand-400'"
			:aria-expanded="isOpen"
			aria-controls="chat-widget-panel"
			:aria-label="isOpen ? copy.close : copy.toggleOpen"
			@click="toggleChat"
		>
			<span
				class="text-lg"
				:class="isOpen ? 'i-carbon-close' : 'i-carbon-chat text-brand-700 dark:text-brand-400'"
				aria-hidden="true"
			/>
			<span class="hidden sm:inline">{{ isOpen ? copy.toggleClose : copy.toggleOpen }}</span>
		</button>
	</div>

	<Transition
		enter-active-class="transition duration-200 ease-out"
		enter-from-class="opacity-0 translate-y-3"
		enter-to-class="opacity-100 translate-y-0"
		leave-active-class="transition duration-150 ease-in"
		leave-from-class="opacity-100 translate-y-0"
		leave-to-class="opacity-0 translate-y-3"
	>
		<section
			v-if="isOpen"
			id="chat-widget-panel"
			class="fixed inset-x-4 bottom-20 z-50 h-[640px] max-h-[calc(100dvh-7rem)] flex flex-col overflow-hidden border border-slate-200 rounded-lg bg-white text-slate-800 shadow-2xl sm:inset-x-auto sm:bottom-22 sm:right-6 sm:w-[440px] dark:border-[#134e43] dark:bg-[#001e1c] dark:text-slate-100"
			role="dialog"
			aria-labelledby="chat-widget-title"
			aria-describedby="chat-widget-subtitle"
		>
			<!-- Header -->
			<header class="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-[#134e43]">
				<div class="min-w-0">
					<h2
						id="chat-widget-title"
						class="text-sm text-slate-950 font-semibold font-sans dark:text-slate-50"
					>
						{{ copy.title }}
					</h2>
					<p
						id="chat-widget-subtitle"
						class="mt-0.5 text-xs text-slate-600 font-sans dark:text-slate-400"
					>
						{{ copy.subtitle }}
					</p>
				</div>
				<div class="flex shrink-0 items-center gap-1">
					<button
						type="button"
						class="chat-icon-btn"
						:title="copy.newChat"
						:aria-label="copy.newChat"
						@click="newChat"
					>
						<span
							class="i-carbon-add-comment text-base"
							aria-hidden="true"
						/>
					</button>
					<button
						type="button"
						class="chat-icon-btn"
						:title="copy.close"
						:aria-label="copy.close"
						@click="closeChat"
					>
						<span
							class="i-carbon-close text-base"
							aria-hidden="true"
						/>
					</button>
				</div>
			</header>

			<!-- ChatMessages -->
			<div class="relative min-h-0 flex-1">
				<div
					ref="scrollRef"
					class="h-full overflow-y-auto px-4 pt-4"
					role="log"
					aria-live="polite"
					:aria-busy="isBusy"
					@scroll.passive="onScroll"
				>
					<div ref="contentRef">
						<article
							v-for="msg in messages"
							:key="msg.id"
							class="relative w-full scroll-mt-4"
						>
							<!-- Pesan pengguna: sisi kanan, varian soft -->
							<div
								v-if="msg.role === 'user'"
								class="ms-auto max-w-[85%] flex justify-end pb-6"
							>
								<div class="min-h-10 whitespace-pre-wrap break-words rounded-lg bg-slate-100 px-3.5 py-2.5 text-sm text-slate-900 leading-relaxed font-sans dark:bg-[#0a3a35] dark:text-slate-50">
									{{ msg.content }}
								</div>
							</div>

							<!-- Pesan asisten: sisi kiri, varian naked selebar panel -->
							<div
								v-else
								class="w-full flex flex-col gap-2.5 pb-6"
							>
								<!-- ChatTool: langkah pencarian sumber -->
								<div
									v-if="msg.search"
									class="chat-step"
								>
									<button
										type="button"
										class="chat-step-trigger group"
										:disabled="msg.search.state !== 'done' || !msg.sources?.length"
										:aria-expanded="!!msg.searchOpen"
										:aria-controls="`chat-sources-${msg.id}`"
										@click="msg.searchOpen = !msg.searchOpen"
									>
										<span class="chat-step-leading">
											<span
												class="chat-step-icon"
												:class="msg.search.state === 'done' ? 'i-carbon-document-multiple-01' : 'i-carbon-search'"
												:data-open="msg.searchOpen || undefined"
												aria-hidden="true"
											/>
											<span
												v-if="msg.sources?.length"
												class="chat-step-chevron i-carbon-chevron-down"
												:data-open="msg.searchOpen || undefined"
												aria-hidden="true"
											/>
										</span>
										<span
											class="truncate"
											:class="{ 'chat-shimmer': msg.search.state !== 'done' && isLiveMessage(msg) }"
										>
											{{ msg.search.state === 'done' ? copy.searched(msg.search.count ?? msg.sources?.length ?? 0) : copy.searching }}
										</span>
										<span
											v-if="msg.search.state === 'done' && msg.search.query"
											class="ms-1 truncate text-slate-500 dark:text-slate-400"
										>"{{ msg.search.query }}"</span>
									</button>

									<!-- Daftar sumber, seperti ToolSources di nuxt.com -->
									<div
										v-show="msg.searchOpen && msg.sources?.length"
										:id="`chat-sources-${msg.id}`"
										class="pt-2"
									>
										<ul class="max-h-44 overflow-y-auto border border-slate-200 rounded-md p-1 dark:border-[#134e43]">
											<li
												v-for="src in msg.sources"
												:key="src.url"
											>
												<NuxtLink
													:to="resolveChatLink(src.url).to"
													:external="resolveChatLink(src.url).external"
													:target="resolveChatLink(src.url).external ? '_blank' : undefined"
													class="min-w-0 flex items-center gap-2 rounded px-2 py-1.5 text-sm text-slate-700 font-sans transition-colors hover:bg-slate-100 dark:text-slate-300 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset--2 focus-visible:outline dark:hover:bg-[#0a3a35] dark:hover:text-slate-50"
												>
													<span
														class="i-carbon-document shrink-0 text-brand-700 dark:text-brand-400"
														aria-hidden="true"
													/>
													<span class="truncate">{{ src.title }}</span>
													<span class="ms-auto max-w-[40%] shrink-0 truncate text-xs text-slate-500 font-mono dark:text-slate-400">{{ resolveChatLink(src.url).label }}</span>
												</NuxtLink>
											</li>
										</ul>
									</div>
								</div>

								<!-- ChatReasoning: proses berpikir model -->
								<div
									v-if="msg.reasoning"
									class="chat-step"
								>
									<button
										type="button"
										class="chat-step-trigger group"
										:aria-expanded="!!msg.reasoningOpen"
										:aria-controls="`chat-reasoning-${msg.id}`"
										@click="toggleReasoning(msg)"
									>
										<span class="chat-step-leading">
											<span
												class="chat-step-icon i-carbon-idea"
												:data-open="msg.reasoningOpen || undefined"
												aria-hidden="true"
											/>
											<span
												class="chat-step-chevron i-carbon-chevron-down"
												:data-open="msg.reasoningOpen || undefined"
												aria-hidden="true"
											/>
										</span>
										<span
											class="truncate"
											:class="{ 'chat-shimmer': isLiveMessage(msg) && msg.reasoningMs === undefined }"
										>
											{{ isLiveMessage(msg) && msg.reasoningMs === undefined ? copy.thinking : copy.thought(msg.reasoningMs) }}
										</span>
									</button>
									<div
										v-show="msg.reasoningOpen"
										:id="`chat-reasoning-${msg.id}`"
										class="mt-2 max-h-[200px] overflow-y-auto whitespace-pre-wrap border-l-2 border-slate-200 pl-3 text-sm text-slate-600 leading-relaxed font-sans dark:border-[#1b5e52] dark:text-slate-400"
									>
										{{ msg.reasoning }}
									</div>
								</div>

								<p
									v-if="msg.error"
									class="flex items-start gap-2 border border-red-300 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-800 font-sans dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-200"
									role="alert"
								>
									<span
										class="i-carbon-warning-alt mt-0.5 shrink-0"
										aria-hidden="true"
									/>
									<span>{{ msg.content }}</span>
								</p>

								<!-- Comark (seperti nuxt.com): aman untuk teks model, paham markdown yang belum lengkap saat streaming -->
								<div
									v-else-if="msg.content"
									class="chat-prose"
								>
									<ChatMarkdown
										:value="msg.content"
										:streaming="isLiveMessage(msg)"
										:caret="isLiveMessage(msg) ? streamingCaret : false"
									/>
								</div>

								<!-- Indikator sebelum langkah pertama tiba -->
								<p
									v-else-if="isLiveMessage(msg) && !msg.search && !msg.reasoning"
									class="chat-shimmer text-sm font-sans"
								>
									{{ copy.searching }}
								</p>

								<!-- Aksi pesan -->
								<div
									v-if="msg.content && (msg.model || msg.error) && !isLiveMessage(msg)"
									class="flex items-center gap-1 text-slate-600 dark:text-slate-400"
								>
									<button
										v-if="msg.error && msg.retryable && msg.id === lastMessage?.id"
										type="button"
										class="chat-action-btn"
										@click="retry"
									>
										<span
											class="i-carbon-renew"
											aria-hidden="true"
										/>
										{{ copy.retry }}
									</button>
									<template v-else-if="!msg.error">
										<button
											type="button"
											class="chat-action-btn"
											:aria-label="copy.copy"
											@click="copyMessage(msg)"
										>
											<span
												:class="copiedId === msg.id ? 'i-carbon-checkmark' : 'i-carbon-copy'"
												aria-hidden="true"
											/>
											<span>{{ copiedId === msg.id ? copy.copied : copy.copy }}</span>
										</button>
										<span
											v-if="msg.model && msg.model !== 'direct'"
											class="ms-auto text-[11px] font-mono"
										>
											{{ copy.answeredBy }} {{ msg.model.split('/').pop() }}
										</span>
									</template>
								</div>
							</div>
						</article>

						<!-- Saran pertanyaan, hanya sebelum pengguna bertanya -->
						<div
							v-if="showSuggestions"
							class="pb-4"
						>
							<p class="text-xs text-slate-600 font-semibold font-sans dark:text-slate-400">
								{{ copy.suggestionsLabel }}
							</p>
							<div class="mt-2 flex flex-col items-start gap-1.5">
								<button
									v-for="sug in copy.suggestions"
									:key="sug"
									type="button"
									class="border border-slate-200 rounded-md px-3 py-1.5 text-left text-sm text-slate-800 font-sans transition-colors disabled:cursor-not-allowed dark:border-[#134e43] hover:border-brand-600 dark:text-slate-200 hover:text-brand-800 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2 focus-visible:outline dark:hover:border-brand-400 dark:hover:text-brand-300"
									:disabled="quotaExhausted"
									@click="sendSuggestion(sug)"
								>
									{{ sug }}
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Tombol kembali ke pesan terbaru -->
				<button
					v-if="!isAtBottom"
					type="button"
					class="chat-icon-btn absolute bottom-3 left-1/2 border border-slate-200 bg-white shadow-md -translate-x-1/2 dark:border-[#134e43] dark:bg-[#002420]"
					:aria-label="copy.scrollDown"
					:title="copy.scrollDown"
					@click="scrollToBottom(true)"
				>
					<span
						class="i-carbon-arrow-down text-base"
						aria-hidden="true"
					/>
				</button>
			</div>

			<!-- ChatPrompt -->
			<form
				class="shrink-0 p-3 pt-2"
				@submit.prevent="submit"
			>
				<div
					class="chat-prompt flex flex-col gap-1.5 border border-slate-300 rounded-lg bg-white px-3 py-2 transition-colors dark:border-[#1b5e52] focus-within:border-brand-700 dark:bg-[#00211e] dark:focus-within:border-brand-400"
				>
					<label
						for="chat-widget-input"
						class="sr-only"
					>{{ copy.placeholder }}</label>
					<textarea
						id="chat-widget-input"
						ref="textareaRef"
						v-model="input"
						rows="1"
						:placeholder="quotaExhausted ? copy.limitReached : copy.placeholder"
						:disabled="quotaExhausted"
						:aria-describedby="isTooLong ? 'chat-widget-error' : 'chat-widget-hint'"
						:aria-invalid="isTooLong"
						class="max-h-40 w-full resize-none bg-transparent py-1 text-base text-slate-900 leading-relaxed font-sans outline-none disabled:cursor-not-allowed sm:text-sm dark:text-slate-50 placeholder:text-slate-500 dark:placeholder:text-slate-400"
						@input="autoResize"
						@keydown="onPromptKeydown"
					/>
					<div class="flex items-center justify-between gap-2">
						<p
							v-if="isTooLong"
							id="chat-widget-error"
							class="text-xs text-red-700 font-sans dark:text-red-300"
						>
							{{ copy.tooLong }}
						</p>
						<p
							v-else
							id="chat-widget-hint"
							class="text-xs text-slate-600 font-sans dark:text-slate-400"
							:class="{ 'hidden sm:block': remaining === null }"
						>
							{{ remaining === null ? copy.hint : copy.quota(remaining) }}
						</p>

						<!-- ChatPromptSubmit: kirim saat siap, hentikan saat menjawab, ulangi saat gagal -->
						<button
							v-if="isBusy"
							type="button"
							class="chat-submit-btn ms-auto"
							:aria-label="copy.stop"
							:title="copy.stop"
							@click="stop"
						>
							<span
								class="i-carbon-stop-filled text-sm"
								aria-hidden="true"
							/>
						</button>
						<button
							v-else-if="status === 'error' && lastMessage?.retryable && !input.trim()"
							type="button"
							class="chat-submit-btn ms-auto"
							:aria-label="copy.retry"
							:title="copy.retry"
							@click="retry"
						>
							<span
								class="i-carbon-renew text-sm"
								aria-hidden="true"
							/>
						</button>
						<button
							v-else
							type="submit"
							class="chat-submit-btn ms-auto"
							:disabled="!canSubmit"
							:aria-label="copy.send"
							:title="copy.send"
						>
							<span
								class="i-carbon-arrow-up text-sm"
								aria-hidden="true"
							/>
						</button>
					</div>
				</div>
			</form>
		</section>
	</Transition>
</template>

<style scoped>
.chat-icon-btn {
	--at-apply: inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#0a3a35] dark:hover:text-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2;
}

.chat-action-btn {
	--at-apply: inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2 text-xs font-sans transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-[#0a3a35] dark:hover:text-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2;
}

.chat-submit-btn {
	--at-apply: inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md bg-brand-900 text-white transition-colors hover:bg-brand-950 dark:bg-brand-400 dark:text-slate-950 dark:hover:bg-brand-300 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2;
}

/* ChatTool / ChatReasoning: baris langkah yang bisa dibuka, ikon berganti chevron saat hover atau terbuka */
.chat-step-trigger {
	--at-apply: flex w-full min-w-0 cursor-pointer items-center gap-1.5 rounded-sm text-left text-sm text-slate-600 font-sans transition-colors hover:text-slate-950 disabled:cursor-default disabled:hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-50 dark:disabled:hover:text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2;
}

.chat-step-leading {
	--at-apply: relative h-4 w-4 shrink-0;
}

.chat-step-icon,
.chat-step-chevron {
	--at-apply: absolute inset-0 h-4 w-4 transition-[opacity,transform] duration-200 ease-out;
}

.chat-step-chevron {
	opacity: 0;
}

.chat-step-trigger:not(:disabled):hover .chat-step-icon,
.chat-step-icon[data-open] {
	opacity: 0;
}

.chat-step-trigger:not(:disabled):hover .chat-step-chevron,
.chat-step-chevron[data-open] {
	opacity: 1;
}

.chat-step-chevron[data-open] {
	transform: rotate(180deg);
}

/* ChatShimmer: kilau teks hanya selama langkah berjalan, berhenti begitu selesai */
.chat-shimmer {
	background: linear-gradient(90deg, currentColor 0%, currentColor 40%, rgb(20 184 152) 50%, currentColor 60%, currentColor 100%);
	background-size: 250% 100%;
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
	animation: chat-shimmer 1.8s linear infinite;
	--at-apply: text-slate-600 dark:text-slate-400;
}

@keyframes chat-shimmer {
	from {
		background-position: 100% 0;
	}
	to {
		background-position: 0% 0;
	}
}

@media (prefers-reduced-motion: reduce) {
	.chat-shimmer {
		animation: none;
		-webkit-text-fill-color: currentColor;
	}

	.chat-step-icon,
	.chat-step-chevron {
		transition: none;
	}
}

/* Seperti ChatPrompt Nuxt UI: cincin fokus ada di kotak prompt, bukan di textarea */
.chat-prompt textarea:focus-visible {
	outline: none;
}

.chat-prompt:has(textarea:focus-visible) {
	box-shadow: 0 0 0 3px rgb(20 184 152 / 0.3);
}

/* Prose ringkas untuk jawaban markdown: komponen Prose situs dibuat untuk artikel penuh */
.chat-prose {
	--at-apply: text-sm text-slate-800 leading-relaxed font-sans dark:text-slate-200;
}

.chat-prose > :deep(div > :first-child) {
	margin-top: 0;
}

.chat-prose > :deep(div > :last-child) {
	margin-bottom: 0;
}

.chat-prose :deep(p) {
	margin: 0.6em 0;
}

.chat-prose :deep(ul),
.chat-prose :deep(ol) {
	margin: 0.6em 0;
	padding-left: 1.25rem;
}

.chat-prose :deep(ul) {
	list-style: disc;
}

.chat-prose :deep(ol) {
	list-style: decimal;
}

.chat-prose :deep(li + li) {
	margin-top: 0.25rem;
}

.chat-prose :deep(li)::marker {
	--at-apply: text-brand-700 dark:text-brand-400;
}

.chat-prose :deep(h1),
.chat-prose :deep(h2),
.chat-prose :deep(h3),
.chat-prose :deep(h4) {
	margin: 1em 0 0.4em;
	font-size: 0.9375rem;
	font-weight: 600;
	line-height: 1.4;
}

.chat-prose :deep(strong) {
	--at-apply: font-semibold text-slate-950 dark:text-slate-50;
}

.chat-prose :deep(:not(pre) > code) {
	--at-apply: rounded bg-slate-100 px-1 py-0.5 text-[0.85em] font-mono dark:bg-[#0a3a35];
}

.chat-prose :deep(blockquote) {
	--at-apply: border-l-2 border-slate-300 pl-3 text-slate-700 dark:border-[#1b5e52] dark:text-slate-300;
	margin: 0.6em 0;
}

.chat-prose :deep(hr) {
	--at-apply: border-slate-200 dark:border-[#134e43];
	margin: 1em 0;
}

/* Bingkai tabel ada di ChatProseTable; sel cukup garis pemisah */
.chat-prose :deep(th),
.chat-prose :deep(td) {
	--at-apply: border-b border-slate-200 px-2.5 py-1.5 text-left align-top dark:border-[#134e43];
}

.chat-prose :deep(tbody tr:last-child td) {
	border-bottom: 0;
}

.chat-prose :deep(th) {
	--at-apply: bg-slate-50 font-semibold text-slate-950 dark:bg-[#00211e] dark:text-slate-50;
}
</style>
