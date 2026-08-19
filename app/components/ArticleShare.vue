<script setup lang="ts">
import { useReactionsStore } from '~/stores/useReactionsStore'

interface Props {
	title?: string
	description?: string
	url?: string
	slug?: string
	variant?: 'default' | 'sidebar'
}

const props = withDefaults(defineProps<Props>(), {
	title: '',
	description: '',
	url: '',
	slug: '',
	variant: 'default',
})

const route = useRoute()
const { locale } = useI18n()
const copied = ref(false)
const store = useReactionsStore()

const currentSlug = computed(() => {
	return props.slug || (route.params.slug as string) || ''
})

function onShareClick(network: string) {
	if (currentSlug.value) {
		store.recordShare(currentSlug.value, network)
	}
}

const networks = [
	{
		name: 'x' as const,
		label: 'X (Twitter)',
		shortLabel: 'X',
		icon: 'i-simple-icons-x',
		hoverClass: 'hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white',
	},
	{
		name: 'whatsapp' as const,
		label: 'WhatsApp',
		shortLabel: 'WA',
		icon: 'i-simple-icons-whatsapp',
		hoverClass: 'hover:border-[#25D366] hover:text-[#25D366]',
	},
	{
		name: 'linkedin' as const,
		label: 'LinkedIn',
		shortLabel: 'LinkedIn',
		icon: 'i-simple-icons-linkedin',
		hoverClass: 'hover:border-[#0A66C2] hover:text-[#0A66C2]',
	},
	{
		name: 'telegram' as const,
		label: 'Telegram',
		shortLabel: 'Telegram',
		icon: 'i-simple-icons-telegram',
		hoverClass: 'hover:border-[#26A5E4] hover:text-[#26A5E4]',
	},
	{
		name: 'threads' as const,
		label: 'Threads',
		shortLabel: 'Threads',
		icon: 'i-simple-icons-threads',
		hoverClass: 'hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white',
	},
	{
		name: 'facebook' as const,
		label: 'Facebook',
		shortLabel: 'FB',
		icon: 'i-simple-icons-facebook',
		hoverClass: 'hover:border-[#1877F2] hover:text-[#1877F2]',
	},
]

async function handleCopyLink() {
	const shareUrl = props.url || (import.meta.client ? window.location.href : 'https://permadi.dev')
	try {
		if (navigator.clipboard) {
			await navigator.clipboard.writeText(shareUrl)
			copied.value = true
			onShareClick('copy_link')
			setTimeout(() => {
				copied.value = false
			}, 2500)
		}
	}
	catch {
		// Fallback copy
	}
}
</script>

<template>
	<!-- 1. Sidebar Compact Bento Variant -->
	<div
		v-if="variant === 'sidebar'"
		class="bento-card-clean relative overflow-hidden border border-slate-200/80 rounded-bento bg-white/90 p-4 shadow-sm backdrop-blur-xl dark:border-[#134e43] dark:bg-[#002b27]/90"
	>
		<div class="mb-3 flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5 dark:border-slate-800/60">
			<div class="flex items-center gap-1.5 text-[11px] text-brand-700 font-bold tracking-wider font-sans uppercase dark:text-brand-400">
				<span class="i-hugeicons-share-01 text-xs" />
				<span>{{ locale === 'id' ? 'Bagikan' : 'Share' }}</span>
			</div>

			<!-- Quick Copy Button -->
			<button
				type="button"
				class="inline-flex cursor-pointer items-center gap-1.5 border border-slate-200/70 rounded-lg bg-slate-100/90 px-2 py-1 text-[10px] text-slate-700 font-semibold transition-all duration-200 dark:border-[#134e43] dark:bg-[#042f27] hover:bg-white dark:text-slate-200 hover:-translate-y-0.5 dark:hover:bg-[#073d32]"
				:aria-label="locale === 'id' ? 'Salin tautan artikel' : 'Copy article link'"
				@click="handleCopyLink"
			>
				<span
					:class="copied ? 'i-hugeicons-checkmark-circle-02 text-emerald-600 dark:text-emerald-400' : 'i-hugeicons-link-01 text-brand-700 dark:text-brand-400'"
					class="text-xs"
				/>
				<span>{{ copied ? (locale === 'id' ? 'Tersalin' : 'Copied') : (locale === 'id' ? 'Salin' : 'Copy') }}</span>
			</button>
		</div>

		<!-- 1 Single Horizontal Row for all Social Icons (Square Buttons) -->
		<div class="flex items-center justify-between gap-1.5">
			<SocialShare
				v-for="net in networks"
				:key="net.name"
				:network="net.name"
				:styled="false"
				:label="false"
				:title="title"
				:description="description"
				:url="url || undefined"
				user="dinarpermadi07"
				class="group hover:shadow-2xs aspect-square flex flex-1 items-center justify-center border border-slate-200/70 rounded-lg bg-slate-50 text-slate-700 transition-all duration-200 dark:border-[#134e43]/90 dark:bg-[#002420]/80 hover:bg-white dark:text-slate-300 hover:-translate-y-0.5 dark:hover:bg-[#003833]"
				:class="net.hoverClass"
				:aria-label="`Share to ${net.label}`"
				@click="onShareClick(net.name)"
			>
				<span
					:class="net.icon"
					class="shrink-0 text-xs transition-transform duration-200 group-hover:scale-110"
				/>
			</SocialShare>
		</div>
	</div>

	<!-- 2. Standard Default Wide Bento Variant -->
	<aside
		v-else
		aria-label="Social Share"
		class="bento-card-clean relative my-12 overflow-hidden border border-slate-200/80 rounded-bento bg-white/90 p-6 shadow-sm dark:border-[#134e43] dark:bg-[#002b27]/90 sm:p-7"
	>
		<!-- Header / Title Section -->
		<div class="mb-6 flex flex-col justify-between gap-3 border-b border-slate-200/60 pb-4 sm:flex-row sm:items-center dark:border-slate-800/60">
			<div>
				<div class="mb-2 inline-flex items-center gap-1.5 border border-brand-200/60 rounded-full bg-brand-100/80 px-2.5 py-0.5 text-[11px] text-brand-800 font-semibold tracking-wider uppercase dark:border-brand-800/60 dark:bg-brand-950 dark:text-brand-300">
					<span class="i-hugeicons-share-01 text-xs" />
					<span>{{ locale === 'id' ? 'Bagikan Tulisan' : 'Share Article' }}</span>
				</div>
				<h2 class="text-base text-slate-900 font-bold font-heading sm:text-lg dark:text-white">
					{{ locale === 'id' ? 'Menemukan bacaan bermanfaat? Bagikan ke jejaring Anda' : 'Found this insightful? Share it with your network' }}
				</h2>
			</div>

			<!-- Quick Copy Button -->
			<button
				type="button"
				class="inline-flex cursor-pointer items-center self-start gap-2 border border-slate-200/70 rounded-xl bg-slate-100/90 px-3.5 py-2 text-xs text-slate-700 font-semibold transition-all duration-200 sm:self-auto dark:border-[#134e43] dark:bg-[#042f27] hover:bg-white dark:text-slate-200 focus-ring hover:-translate-y-0.5 dark:hover:bg-[#073d32]"
				:aria-label="locale === 'id' ? 'Salin tautan artikel' : 'Copy article link'"
				@click="handleCopyLink"
			>
				<span
					:class="copied ? 'i-hugeicons-checkmark-circle-02 text-emerald-600 dark:text-emerald-400' : 'i-hugeicons-link-01 text-brand-700 dark:text-brand-400'"
					class="text-sm transition-transform"
				/>
				<span>{{ copied ? (locale === 'id' ? 'Tautan Tersalin!' : 'Link Copied!') : (locale === 'id' ? 'Salin Tautan' : 'Copy Link') }}</span>
			</button>
		</div>

		<!-- Social Share Buttons Grid: 1 Single Row -->
		<div class="flex items-center justify-between gap-2 sm:gap-3">
			<SocialShare
				v-for="net in networks"
				:key="net.name"
				:network="net.name"
				:styled="false"
				:label="false"
				:title="title"
				:description="description"
				:url="url || undefined"
				user="dinarpermadi07"
				class="group aspect-square flex flex-1 items-center justify-center border border-slate-200/70 rounded-xl bg-slate-50 text-slate-700 transition-all duration-200 dark:border-[#134e43]/90 dark:bg-[#002420]/80 hover:bg-white dark:text-slate-300 hover:shadow-sm hover:-translate-y-0.5 dark:hover:bg-[#003833]"
				:class="net.hoverClass"
				:aria-label="`Share to ${net.label}`"
				@click="onShareClick(net.name)"
			>
				<span
					:class="net.icon"
					class="shrink-0 text-base transition-transform duration-200 group-hover:scale-115 sm:text-lg"
				/>
			</SocialShare>
		</div>
	</aside>
</template>
