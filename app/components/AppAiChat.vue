<script setup lang="ts">
import { marked } from 'marked'

// Konfigurasi marked untuk line breaks dan GitHub Flavored Markdown
marked.setOptions({
	breaks: true,
	gfm: true,
})

interface Message {
	id: string
	role: 'user' | 'assistant'
	content: string
	timestamp: Date
}

const { locale } = useI18n()
const isOpen = ref(false)
const inputPrompt = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const copiedMsgId = ref<string | null>(null)
const sharedMsgId = ref<string | null>(null)
const remainingQuota = ref<number | null>(null)

const defaultWelcomeId = 'Halo! Saya **Permadi AI Assistant**, asisten cerdas untuk portofolio dan website Dinar Permadi Yusup. Ada yang ingin Anda ketahui tentang karya, projek, keahlian teknis, atau artikel blog saya?'
const defaultWelcomeEn = 'Hello! I am **Permadi AI Assistant**, the intelligent assistant for Dinar Permadi Yusup\'s portfolio and website. Feel free to ask anything about my projects, tech stack, articles, or design philosophy!'

const messages = ref<Message[]>([
	{
		id: 'welcome',
		role: 'assistant',
		content: locale.value === 'id' ? defaultWelcomeId : defaultWelcomeEn,
		timestamp: new Date(),
	},
])

// Update welcome message jika bahasa berubah dan belum ada chat
watch(locale, (newLoc) => {
	if (messages.value.length === 1 && messages.value[0]?.id === 'welcome') {
		messages.value[0].content = newLoc === 'id' ? defaultWelcomeId : defaultWelcomeEn
	}
})

const starterSuggestions = computed(() => {
	if (locale.value === 'id') {
		return [
			{ text: 'Apa keahlian & tech stack utama Permadi?', icon: '⚡' },
			{ text: 'Ceritakan tentang projek Portal SDN Teja II', icon: '🏫' },
			{ text: 'Apa itu metode Accelerated Learning?', icon: '🧠' },
			{ text: 'Bagaimana cara menghubungi Permadi?', icon: '📬' },
		]
	}
	return [
		{ text: 'What is Permadi\'s core tech stack?', icon: '⚡' },
		{ text: 'Tell me about the SDN Teja II project', icon: '🏫' },
		{ text: 'What is Accelerated Learning?', icon: '🧠' },
		{ text: 'How can I get in touch with Permadi?', icon: '📬' },
	]
})

function toggleChat() {
	isOpen.value = !isOpen.value
	if (isOpen.value) {
		nextTick(() => scrollToBottom())
	}
}

function scrollToBottom() {
	if (messagesContainer.value) {
		messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
	}
}

function clearChat() {
	messages.value = [
		{
			id: 'welcome',
			role: 'assistant',
			content: locale.value === 'id' ? defaultWelcomeId : defaultWelcomeEn,
			timestamp: new Date(),
		},
	]
}

async function copyMessage(msg: Message) {
	try {
		if (navigator.clipboard) {
			await navigator.clipboard.writeText(msg.content)
			copiedMsgId.value = msg.id
			setTimeout(() => {
				if (copiedMsgId.value === msg.id) {
					copiedMsgId.value = null
				}
			}, 2000)
		}
	}
	catch {
		// Fallback
	}
}

async function shareMessage(msg: Message) {
	const shareText = `${msg.content}\n\n— Permadi AI (https://permadi.dev/${locale.value})`
	try {
		if (navigator.share) {
			await navigator.share({
				title: 'Permadi AI Answer',
				text: shareText,
				url: `https://permadi.dev/${locale.value}`,
			})
		}
		else if (navigator.clipboard) {
			await navigator.clipboard.writeText(shareText)
			sharedMsgId.value = msg.id
			setTimeout(() => {
				if (sharedMsgId.value === msg.id) {
					sharedMsgId.value = null
				}
			}, 2000)
		}
	}
	catch {
		// User dismissed share dialog
	}
}

async function sendMessage(customText?: string) {
	const textToSend = (customText || inputPrompt.value).trim()
	if (!textToSend || isLoading.value)
		return

	const userMsg: Message = {
		id: String(Date.now()),
		role: 'user',
		content: textToSend,
		timestamp: new Date(),
	}

	messages.value.push(userMsg)
	inputPrompt.value = ''
	isLoading.value = true

	nextTick(() => scrollToBottom())

	try {
		const payloadMessages = messages.value
			.filter(m => m.id !== 'welcome')
			.map(m => ({
				role: m.role,
				content: m.content,
			}))

		const res: any = await $fetch('/api/chat', {
			method: 'POST',
			body: {
				messages: payloadMessages,
				locale: locale.value,
			},
		})

		if (typeof res.remainingQuota === 'number') {
			remainingQuota.value = res.remainingQuota
		}

		messages.value.push({
			id: String(Date.now() + 1),
			role: 'assistant',
			content: res.content || (locale.value === 'id' ? 'Maaf, terjadi kendala saat memproses jawaban.' : 'Sorry, an error occurred while processing the response.'),
			timestamp: new Date(),
		})
	}
	catch (err: any) {
		const errMsg = err?.data?.statusMessage || err?.message || (locale.value === 'id' ? 'Gagal terhubung ke AI Service.' : 'Failed to connect to AI Service.')
		messages.value.push({
			id: String(Date.now() + 1),
			role: 'assistant',
			content: `⚠️ **Pemberitahuan**: ${errMsg}`,
			timestamp: new Date(),
		})
	}
	finally {
		isLoading.value = false
		nextTick(() => scrollToBottom())
	}
}

function handleKeydown(e: KeyboardEvent) {
	if (e.key === 'Enter' && !e.shiftKey) {
		e.preventDefault()
		sendMessage()
	}
}

function renderMarkdown(text: string): string {
	try {
		return marked.parse(text) as string
	}
	catch {
		return text
	}
}
</script>

<template>
	<div class="fixed bottom-5 right-5 z-50 font-sans sm:bottom-7 sm:right-7">
		<!-- Floating Launcher Trigger Button -->
		<button
			type="button"
			class="ai-trigger-btn group relative flex cursor-pointer items-center gap-2.5 overflow-hidden border border-emerald-700/60 rounded-full bg-[#002b27] px-4 py-2.5 shadow-xl transition-all duration-300 hover:scale-105 dark:border-[#134e43] dark:bg-[#002420] sm:py-3 !text-white hover:shadow-2xl focus-ring"
			:aria-expanded="isOpen"
			aria-label="Toggle Permadi AI Assistant"
			@click="toggleChat"
		>
			<span class="absolute inset-0 from-emerald-600/30 to-teal-500/30 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100" />

			<div class="relative h-6 w-6 flex shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs text-slate-950 shadow-md">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-3.5 w-3.5 text-slate-950 transition-transform duration-300 group-hover:rotate-12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
					<path d="M5 3v4" />
					<path d="M19 17v4" />
					<path d="M3 5h4" />
					<path d="M17 19h4" />
				</svg>
			</div>

			<span class="ai-trigger-label relative text-xs font-bold tracking-wide sm:text-sm !text-white">
				{{ isOpen ? (locale === 'id' ? 'Tutup AI' : 'Close AI') : (locale === 'id' ? 'Tanya AI Permadi' : 'Ask Permadi AI') }}
			</span>

			<span class="relative h-2 w-2 flex shrink-0">
				<span class="absolute h-full w-full inline-flex animate-ping rounded-full bg-emerald-400 opacity-80" />
				<span class="relative h-2 w-2 inline-flex rounded-full bg-emerald-400" />
			</span>
		</button>

		<!-- Bento Chat Drawer / Floating Modal -->
		<Transition
			enter-active-class="transition duration-250 ease-out"
			enter-from-class="opacity-0 scale-95 translate-y-4"
			enter-to-class="opacity-100 scale-100 translate-y-0"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="opacity-100 scale-100 translate-y-0"
			leave-to-class="opacity-0 scale-95 translate-y-4"
		>
			<div
				v-if="isOpen"
				class="bento-card-clean absolute bottom-14 right-0 z-50 h-[590px] max-h-[calc(100vh-5rem)] max-w-[calc(100vw-2rem)] w-[360px] flex flex-col overflow-hidden border border-slate-200/80 rounded-bento bg-white/95 shadow-2xl backdrop-blur-xl sm:w-[450px] dark:border-[#134e43] dark:bg-[#002420]/95"
			>
				<!-- Modal Header -->
				<div class="flex items-center justify-between border-b border-slate-200/70 bg-slate-50/80 p-3.5 dark:border-slate-800/80 dark:bg-[#042f27]/50 sm:p-4">
					<div class="flex items-center gap-2.5">
						<div class="relative h-8 w-8 flex shrink-0 items-center justify-center rounded-full shadow-sm">
							<StaticLogo size="32" />
							<span class="absolute bottom-0 right-0 h-2.5 w-2.5 border-2 border-white rounded-full bg-emerald-500 dark:border-[#002420]" />
						</div>
						<div>
							<div class="flex items-center gap-1.5">
								<h3 class="text-xs text-slate-900 font-bold font-heading sm:text-sm dark:text-white">
									Permadi AI
								</h3>
								<span class="border border-brand-200/60 rounded bg-brand-100 px-1.5 py-0.2 text-[10px] text-brand-800 font-medium font-mono dark:border-brand-800/60 dark:bg-brand-950 dark:text-brand-300">
									Gemini
								</span>
								<span
									v-if="remainingQuota !== null"
									class="border border-emerald-200/60 rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] text-emerald-800 font-medium font-mono dark:border-emerald-800/60 dark:bg-emerald-950 dark:text-emerald-300"
									:title="locale === 'id' ? `Sisa kuota pertanyaan per jam: ${remainingQuota}/15` : `Remaining queries this hour: ${remainingQuota}/15`"
								>
									{{ remainingQuota }}/15
								</span>
							</div>
							<p class="text-[11px] text-slate-500 dark:text-slate-400">
								{{ locale === 'id' ? 'Asisten Portofolio & Artikel' : 'Portfolio & Articles Assistant' }}
							</p>
						</div>
					</div>

					<div class="flex items-center gap-1">
						<button
							type="button"
							class="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-200/60 dark:text-slate-400 hover:text-slate-900 dark:hover:bg-slate-800/60 dark:hover:text-white"
							:title="locale === 'id' ? 'Bersihkan Obrolan' : 'Clear Chat'"
							aria-label="Clear chat"
							@click="clearChat"
						>
							<span class="i-hugeicons-delete-02 text-base" />
						</button>
						<button
							type="button"
							class="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-200/60 dark:text-slate-400 hover:text-slate-900 dark:hover:bg-slate-800/60 dark:hover:text-white"
							:title="locale === 'id' ? 'Tutup' : 'Close'"
							aria-label="Close chat"
							@click="isOpen = false"
						>
							<span class="i-hugeicons-cancel-01 text-base" />
						</button>
					</div>
				</div>

				<!-- Message Feed Area -->
				<div
					ref="messagesContainer"
					class="flex-1 overflow-y-auto p-4 text-xs leading-relaxed space-y-4"
				>
					<div
						v-for="msg in messages"
						:key="msg.id"
						class="flex flex-col gap-1.5"
						:class="msg.role === 'user' ? 'items-end' : 'items-start'"
					>
						<div
							class="max-w-full flex gap-2.5"
							:class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
						>
							<!-- Assistant Avatar (Static Logo) -->
							<div
								v-if="msg.role === 'assistant'"
								class="mt-0.5 h-6 w-6 flex shrink-0 items-center justify-center rounded-full shadow-sm"
							>
								<StaticLogo size="24" />
							</div>

							<!-- Bubble -->
							<div
								class="max-w-[88%] overflow-hidden rounded-2xl px-3.5 py-2.5 shadow-sm"
								:class="msg.role === 'user'
									? 'bg-brand-700 dark:bg-brand-600 text-white rounded-br-xs font-medium'
									: 'bg-slate-100/90 dark:bg-[#042f27] text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-[#134e43] rounded-bl-xs'"
							>
								<div
									class="prose-chat break-words text-[13px] leading-relaxed"
									v-html="renderMarkdown(msg.content)"
								/>
							</div>
						</div>

						<!-- Assistant Message Action Bar (Bento Style Copy & Share) -->
						<div
							v-if="msg.role === 'assistant' && msg.id !== 'welcome'"
							class="ml-8 mt-0.5 flex items-center gap-2 text-[11px]"
						>
							<!-- Copy Button -->
							<button
								type="button"
								class="bento-action-pill shadow-2xs inline-flex cursor-pointer items-center gap-1.5 border border-slate-200/80 rounded-lg bg-slate-100/90 px-2.5 py-1 text-slate-700 transition-all duration-200 hover:scale-102 dark:border-[#134e43] dark:bg-[#042f27]/90 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-[#073d32]"
								:aria-label="locale === 'id' ? 'Salin jawaban' : 'Copy answer'"
								@click="copyMessage(msg)"
							>
								<span
									:class="copiedMsgId === msg.id ? 'i-hugeicons-checkmark-circle-02 text-emerald-600 dark:text-emerald-400' : 'i-hugeicons-copy-01'"
									class="text-xs"
								/>
								<span class="font-medium">{{ copiedMsgId === msg.id ? (locale === 'id' ? 'Tersalin' : 'Copied') : (locale === 'id' ? 'Salin' : 'Copy') }}</span>
							</button>

							<!-- Share Button -->
							<button
								type="button"
								class="bento-action-pill shadow-2xs inline-flex cursor-pointer items-center gap-1.5 border border-slate-200/80 rounded-lg bg-slate-100/90 px-2.5 py-1 text-slate-700 transition-all duration-200 hover:scale-102 dark:border-[#134e43] dark:bg-[#042f27]/90 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-[#073d32]"
								:aria-label="locale === 'id' ? 'Bagikan jawaban' : 'Share answer'"
								@click="shareMessage(msg)"
							>
								<span
									:class="sharedMsgId === msg.id ? 'i-hugeicons-checkmark-circle-02 text-emerald-600 dark:text-emerald-400' : 'i-hugeicons-share-01'"
									class="text-xs"
								/>
								<span class="font-medium">{{ sharedMsgId === msg.id ? (locale === 'id' ? 'Tersalin' : 'Copied') : (locale === 'id' ? 'Bagikan' : 'Share') }}</span>
							</button>
						</div>
					</div>

					<!-- Loading Thinking Bubble -->
					<div
						v-if="isLoading"
						class="flex items-center justify-start gap-2.5"
					>
						<div class="h-6 w-6 flex shrink-0 items-center justify-center rounded-full shadow-sm">
							<StaticLogo size="24" />
						</div>
						<div class="flex items-center gap-1.5 border border-slate-200/60 rounded-2xl bg-slate-100 px-3.5 py-2.5 text-slate-600 dark:border-[#134e43] dark:bg-[#042f27] dark:text-slate-300">
							<span
								class="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-600"
								style="animation-delay: 0ms;"
							/>
							<span
								class="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-600"
								style="animation-delay: 150ms;"
							/>
							<span
								class="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-600"
								style="animation-delay: 300ms;"
							/>
						</div>
					</div>

					<!-- Starter Suggestion Chips -->
					<div
						v-if="messages.length === 1 && !isLoading"
						class="pt-2"
					>
						<p class="mb-2 text-[11px] text-slate-500 font-semibold tracking-wider uppercase dark:text-slate-400">
							{{ locale === 'id' ? 'Pertanyaan Cepat:' : 'Quick Questions:' }}
						</p>
						<div class="flex flex-col gap-1.5">
							<button
								v-for="sug in starterSuggestions"
								:key="sug.text"
								type="button"
								class="flex cursor-pointer items-center gap-2 border border-slate-200/70 rounded-xl bg-slate-50 px-3 py-2 text-left text-xs text-slate-700 transition-all hover:translate-x-1 dark:border-[#134e43] dark:bg-[#002b27]/80 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#073d32]"
								@click="sendMessage(sug.text)"
							>
								<span>{{ sug.icon }}</span>
								<span class="truncate">{{ sug.text }}</span>
							</button>
						</div>
					</div>
				</div>

				<!-- Footer Input -->
				<div class="border-t border-slate-200/70 bg-white p-3 dark:border-slate-800/80 dark:bg-[#002420]">
					<div class="relative flex items-center gap-2">
						<textarea
							v-model="inputPrompt"
							rows="1"
							:placeholder="locale === 'id' ? 'Tanyakan seputar karya Permadi...' : 'Ask about Permadi\'s work...'"
							class="w-full resize-none border border-slate-200/80 rounded-xl bg-slate-100/90 py-2.5 pl-3.5 pr-3 text-xs text-slate-900 leading-relaxed dark:border-[#134e43] dark:bg-[#042f27] dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder-slate-400 dark:placeholder-slate-500"
							@keydown="handleKeydown"
						/>
						<button
							type="button"
							class="h-8 w-8 flex shrink-0 cursor-pointer items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm transition-all duration-200 active:scale-95 disabled:cursor-not-allowed dark:bg-brand-500 hover:bg-brand-800 disabled:opacity-40 dark:hover:bg-brand-600"
							:disabled="!inputPrompt.trim() || isLoading"
							:title="locale === 'id' ? 'Kirim pesan' : 'Send message'"
							aria-label="Send message"
							@click="() => sendMessage()"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4 text-white"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12L2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
							</svg>
						</button>
					</div>
					<div class="mt-1.5 flex items-center justify-between px-0.5 text-[10px] text-slate-500 dark:text-slate-400">
						<span>{{ locale === 'id' ? 'Didukung Google Gemini' : 'Powered by Google Gemini' }}</span>
						<span>{{ locale === 'id' ? 'Maks. 15 pesan/jam per IP' : 'Max 15 msgs/hour per IP' }}</span>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
:deep(.prose-chat) {
	color: inherit;
}
:deep(.prose-chat p) {
	margin-top: 0.35rem;
	margin-bottom: 0.35rem;
}
:deep(.prose-chat p:first-child) {
	margin-top: 0;
}
:deep(.prose-chat p:last-child) {
	margin-bottom: 0;
}
:deep(.prose-chat h1),
:deep(.prose-chat h2),
:deep(.prose-chat h3),
:deep(.prose-chat h4) {
	font-family: var(--font-heading, inherit);
	font-weight: 700;
	margin-top: 0.65rem;
	margin-bottom: 0.35rem;
	color: inherit;
}
:deep(.prose-chat h3) {
	font-size: 0.875rem;
}
:deep(.prose-chat ul),
:deep(.prose-chat ol) {
	padding-left: 1.15rem;
	margin-top: 0.35rem;
	margin-bottom: 0.35rem;
}
:deep(.prose-chat li) {
	margin-top: 0.15rem;
	margin-bottom: 0.15rem;
	list-style-type: disc;
}
:deep(.prose-chat strong) {
	font-weight: 700;
	color: inherit;
}
:deep(.prose-chat hr) {
	border-color: rgba(200, 200, 200, 0.3);
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
}
:deep(.prose-chat a) {
	color: #10b981;
	text-decoration: underline;
	font-weight: 600;
}
:deep(.prose-chat code) {
	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
	font-size: 0.75rem;
	padding: 0.1rem 0.3rem;
	border-radius: 0.25rem;
	background-color: rgba(0, 0, 0, 0.08);
}
.dark :deep(.prose-chat code) {
	background-color: rgba(255, 255, 255, 0.1);
}

.ai-trigger-btn,
.ai-trigger-btn * {
	color: #ffffff !important;
}
.ai-trigger-label {
	color: #ffffff !important;
}
</style>
