<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

const { locale } = useI18n()

const isOpen = ref(false)
const input = ref('')
const isLoading = ref(false)
const chatContainerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

interface SourceItem {
	title: string
	url: string
}

interface ChatMessage {
	role: 'user' | 'assistant'
	content: string
	sources?: SourceItem[]
	model?: string
}

const messages = ref<ChatMessage[]>([])

// Saran topik cepat berdasarkan bahasa aktif
const quickSuggestions = computed(() => {
	if (locale.value === 'id') {
		return [
			'Apa itu metode accelerated learning?',
			'Tentang projek Majalengka Tech?',
			'Sejarah perkembangan kurikulum?',
			'Prinsip desain Swiss style?',
		]
	}
	return [
		'What is accelerated learning?',
		'Tell me about Majalengka Tech project',
		'Evolution of curriculum in Indonesia',
		'What is Swiss design style?',
	]
})

const defaultWelcome = computed(() => {
	if (locale.value === 'id') {
		return 'Halo! Saya asisten pintar untuk blog dan portofolio projek Permadi. Ada yang ingin Anda tanyakan seputar artikel atau karya kami?'
	}
	return 'Hello! I am the Q&A assistant for Permadi\'s technical blog and project portfolio. How can I assist you today?'
})

function toggleChat() {
	isOpen.value = !isOpen.value
	if (isOpen.value) {
		if (messages.value.length === 0) {
			messages.value.push({
				role: 'assistant',
				content: defaultWelcome.value,
			})
		}
		nextTick(() => {
			inputRef.value?.focus()
			scrollToBottom()
		})
	}
}

function clearChat() {
	messages.value = [
		{
			role: 'assistant',
			content: defaultWelcome.value,
		},
	]
}

function scrollToBottom() {
	if (chatContainerRef.value) {
		chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight
	}
}

function handleKeydown(e: KeyboardEvent) {
	if (e.key === 'Escape' && isOpen.value) {
		isOpen.value = false
	}
}

onMounted(() => {
	window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
	window.removeEventListener('keydown', handleKeydown)
})

function sendQuick(prompt: string) {
	input.value = prompt
	sendMessage()
}

async function sendMessage() {
	const query = input.value.trim()
	if (!query || isLoading.value)
		return

	// Tambah pesan user
	messages.value.push({ role: 'user', content: query })
	input.value = ''
	isLoading.value = true

	// Siapkan pesan balasan asisten untuk streaming
	const assistantMsgIndex = messages.value.length
	messages.value.push({ role: 'assistant', content: '' })

	await nextTick()
	scrollToBottom()

	// Siapkan history (maks 6 pesan terakhir sebelum pertanyaan ini)
	const historyPayload = messages.value
		.slice(0, -2) // kecualikan pesan user terakhir dan pesan kosong asisten
		.slice(-6)
		.map(m => ({ role: m.role, content: m.content }))

	const payload = JSON.stringify({
		message: query,
		lang: locale.value,
		history: historyPayload,
	})

	try {
		// Gunakan same-origin /api/chat (kebal CORS & CSP), fallback ke direct gateway
		let res: Response | null = await fetch('/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: payload,
		}).catch(() => null)

		if (!res || !res.ok) {
			const directRes = await fetch('https://8787-agqwzwuabezjc5sxhm4y77kkyy.instabox.tech/v1/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: payload,
			})
			res = directRes
		}

		if (!res.ok) {
			const errJson = await res.json().catch(() => ({}))
			messages.value[assistantMsgIndex].content
				= locale.value === 'id'
					? `Maaf, terjadi kesalahan (${res.status}): ${errJson.message || 'Gagal memproses jawaban.'}`
					: `Sorry, an error occurred (${res.status}): ${errJson.message || 'Failed to process answer.'}`
			return
		}

		if (!res.body) {
			throw new Error('ReadableStream not supported')
		}

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
				}
				else if (trimmed.startsWith('data: ')) {
					const dataStr = trimmed.slice(6)
					try {
						const data = JSON.parse(dataStr)
						if (currentEvent === 'token' && data.token) {
							messages.value[assistantMsgIndex].content += data.token
							scrollToBottom()
						}
						else if (currentEvent === 'sources') {
							messages.value[assistantMsgIndex].sources = data
						}
						else if (currentEvent === 'done') {
							messages.value[assistantMsgIndex].model = data.model
						}
					}
					catch {}
				}
			}
		}
	}
	catch (err: any) {
		messages.value[assistantMsgIndex].content
			= locale.value === 'id'
				? `Koneksi ke gateway AI gagal: ${err.message || 'Pastikan server aktif.'}`
				: `Failed to connect to AI gateway: ${err.message || 'Please check server.'}`
	}
	finally {
		isLoading.value = false
		await nextTick()
		scrollToBottom()
	}
}
</script>

<template>
	<!-- Floating Toggle Trigger Button -->
	<div class="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6 print:hidden">
		<button
			type="button"
			class="group h-12 inline-flex cursor-pointer items-center gap-2.5 border border-slate-300 bg-white/95 px-4 text-xs text-slate-900 font-bold tracking-wider font-mono uppercase shadow-xl backdrop-blur-md transition-all duration-200 active:scale-95 dark:border-[#134e43] hover:border-brand-500 dark:bg-[#001e1c]/95 dark:text-slate-100 hover:text-brand-600 dark:hover:border-brand-400 dark:hover:text-brand-400"
			:class="isOpen ? 'bg-slate-900 text-white dark:bg-brand-500 dark:text-slate-950 border-transparent' : ''"
			:aria-expanded="isOpen"
			aria-label="Tanya AI Asisten Permadi"
			@click="toggleChat"
		>
			<span
				v-if="!isOpen"
				class="relative h-2.5 w-2.5 flex"
			>
				<span class="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
				<span class="relative h-2.5 w-2.5 inline-flex rounded-full bg-emerald-500" />
			</span>
			<span
				:class="isOpen ? 'i-carbon-close text-base' : 'i-carbon-chat-bot text-base text-brand-600 dark:text-brand-400'"
			/>
			<span class="hidden sm:inline">
				{{ isOpen ? (locale === 'id' ? 'Tutup' : 'Close') : (locale === 'id' ? 'Tanya AI' : 'Ask AI') }}
			</span>
		</button>
	</div>

	<!-- Slide-Over / Popover Chat Window -->
	<Transition
		enter-active-class="transition duration-200 ease-out"
		enter-from-class="opacity-0 translate-y-4 scale-95"
		enter-to-class="opacity-100 translate-y-0 scale-100"
		leave-active-class="transition duration-150 ease-in"
		leave-from-class="opacity-100 translate-y-0 scale-100"
		leave-to-class="opacity-0 translate-y-4 scale-95"
	>
		<div
			v-if="isOpen"
			class="fixed bottom-20 right-4 z-50 h-[580px] max-h-[80vh] w-[calc(100vw-32px)] flex flex-col border border-slate-200/90 bg-white text-slate-800 shadow-2xl sm:bottom-22 sm:right-6 sm:w-[420px] dark:border-[#134e43] dark:bg-[#001e1c] dark:text-slate-100"
			role="dialog"
			aria-labelledby="chat-widget-title"
		>
			<!-- Window Header (Swiss Design Ledger) -->
			<div class="h-12 flex shrink-0 items-center justify-between border-b border-slate-200/80 bg-slate-50/90 px-4 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/80">
				<div class="flex items-center gap-2">
					<span class="h-2 w-2 rounded-full bg-emerald-500" />
					<span
						id="chat-widget-title"
						class="text-[11px] text-slate-900 font-bold tracking-wider uppercase dark:text-slate-50"
					>
						{{ locale === 'id' ? 'Asisten Blog & Projek' : 'Blog & Project Assistant' }}
					</span>
				</div>

				<div class="flex items-center gap-1.5">
					<button
						type="button"
						class="cursor-pointer p-1.5 text-slate-500 transition-colors dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
						title="Bersihkan Percakapan"
						@click="clearChat"
					>
						<span class="i-carbon-renew block text-sm" />
					</button>
					<button
						type="button"
						class="cursor-pointer p-1.5 text-slate-500 transition-colors dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
						title="Tutup Chat (Esc)"
						@click="isOpen = false"
					>
						<span class="i-carbon-close block text-sm" />
					</button>
				</div>
			</div>

			<!-- Messages Scroll Container -->
			<div
				ref="chatContainerRef"
				class="flex-1 overflow-y-auto p-4 text-xs leading-relaxed space-y-4"
			>
				<!-- Quick Suggestions (Hanya muncul jika belum ada interaksi user) -->
				<div
					v-if="messages.length <= 1"
					class="mb-3 space-y-1.5"
				>
					<p class="text-[10px] text-slate-500 font-mono uppercase dark:text-slate-400">
						{{ locale === 'id' ? 'Contoh Topik Pembahasan:' : 'Suggested Questions:' }}
					</p>
					<div class="flex flex-wrap gap-1.5">
						<button
							v-for="(sug, idx) in quickSuggestions"
							:key="idx"
							type="button"
							class="border border-slate-200 bg-slate-50 px-2.5 py-1 text-left text-[11px] text-slate-700 transition-colors dark:border-[#134e43] hover:border-brand-500 dark:bg-[#002420]/50 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"
							@click="sendQuick(sug)"
						>
							{{ sug }}
						</button>
					</div>
				</div>

				<!-- Message Items -->
				<div
					v-for="(msg, i) in messages"
					:key="i"
					class="flex flex-col gap-1"
					:class="msg.role === 'user' ? 'items-end' : 'items-start'"
				>
					<!-- Sender Label -->
					<span class="text-[9px] text-slate-600 tracking-widest font-mono uppercase dark:text-slate-400">
						{{ msg.role === 'user' ? (locale === 'id' ? 'Anda' : 'You') : 'Permadi AI' }}
					</span>

					<!-- Message Bubble -->
					<div
						class="max-w-[90%] whitespace-pre-wrap break-words p-3 leading-relaxed"
						:class="msg.role === 'user'
							? 'bg-slate-900 text-white dark:bg-brand-500/20 dark:text-slate-100 border border-slate-800 dark:border-brand-500/40'
							: 'bg-slate-100 text-slate-800 dark:bg-[#002420]/80 dark:text-slate-200 border border-slate-200/80 dark:border-[#134e43]'"
					>
						<span>{{ msg.content }}</span>
						<span
							v-if="isLoading && i === messages.length - 1 && !msg.content"
							class="inline-block h-3 w-1.5 animate-pulse bg-brand-500"
						/>

						<!-- Rujukan Sumber Terkait (Jika ada) -->
						<div
							v-if="msg.sources && msg.sources.length > 0"
							class="mt-3 border-t border-slate-200/80 pt-2 text-[10px] font-mono dark:border-[#134e43]"
						>
							<span class="mb-1 block text-slate-600 font-bold uppercase dark:text-slate-400">
								{{ locale === 'id' ? 'Rujukan Artikel / Projek:' : 'Sources & References:' }}
							</span>
							<ul class="space-y-1">
								<li
									v-for="(src, sIdx) in msg.sources"
									:key="sIdx"
								>
									<NuxtLink
										:to="src.url"
										class="inline-flex items-center gap-1 text-brand-600 underline dark:text-brand-400 hover:text-brand-700"
										target="_blank"
									>
										<span class="i-carbon-link text-[10px]" />
										<span class="max-w-[280px] truncate">{{ src.title }}</span>
									</NuxtLink>
								</li>
							</ul>
						</div>

						<!-- Model Attribution Badge -->
						<div
							v-if="msg.model"
							class="mt-2 text-right text-[8px] text-slate-600 font-mono dark:text-slate-400"
						>
							Powered by {{ msg.model }}
						</div>
					</div>
				</div>
			</div>

			<!-- Input Strip -->
			<form
				class="shrink-0 border-t border-slate-200/80 bg-slate-50/80 p-2.5 dark:border-[#134e43] dark:bg-[#002420]/60"
				@submit.prevent="sendMessage"
			>
				<div class="flex items-center gap-2">
					<input
						ref="inputRef"
						v-model="input"
						type="text"
						:placeholder="locale === 'id' ? 'Tanyakan seputar artikel & projek...' : 'Ask about articles or projects...'"
						class="flex-1 border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition-colors dark:border-[#134e43] focus:border-brand-500 dark:bg-[#001e1c] dark:text-slate-100 dark:focus:border-brand-400"
						:disabled="isLoading"
					>
					<button
						type="submit"
						class="h-8 w-9 inline-flex cursor-pointer items-center justify-center border border-transparent bg-slate-900 text-white transition-all dark:bg-brand-500 hover:bg-brand-600 dark:text-slate-950 disabled:opacity-50 dark:hover:bg-brand-400"
						:disabled="!input.trim() || isLoading"
						:aria-label="locale === 'id' ? 'Kirim' : 'Send'"
					>
						<span
							:class="isLoading ? 'i-carbon-renew animate-spin' : 'i-carbon-arrow-right'"
							class="text-sm"
						/>
					</button>
				</div>
			</form>
		</div>
	</Transition>
</template>
