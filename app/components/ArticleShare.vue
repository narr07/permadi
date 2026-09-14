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
		icon: 'i-swisspost-twitterx',
		hoverClass: 'hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white',
	},
	{
		name: 'whatsapp' as const,
		label: 'WhatsApp',
		shortLabel: 'WA',
		icon: 'i-swisspost-whatsapp',
		hoverClass: 'hover:border-[#25D366] hover:text-[#25D366]',
	},
	{
		name: 'linkedin' as const,
		label: 'LinkedIn',
		shortLabel: 'LinkedIn',
		icon: 'i-swisspost-linkedin',
		hoverClass: 'hover:border-[#0A66C2] hover:text-[#0A66C2]',
	},
	{
		name: 'telegram' as const,
		label: 'Telegram',
		shortLabel: 'Telegram',
		icon: 'i-swisspost-send',
		hoverClass: 'hover:border-[#26A5E4] hover:text-[#26A5E4]',
	},
	{
		name: 'threads' as const,
		label: 'Threads',
		shortLabel: 'Threads',
		icon: 'i-swisspost-comment',
		hoverClass: 'hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white',
	},
	{
		name: 'facebook' as const,
		label: 'Facebook',
		shortLabel: 'FB',
		icon: 'i-swisspost-facebook',
		hoverClass: 'hover:border-[#1877F2] hover:text-[#1877F2]',
	},
]

const shareUrl = computed(() => {
	if (props.url) {
		return props.url.startsWith('http') ? props.url : `https://permadi.dev${props.url}`
	}
	return `https://permadi.dev${route.fullPath}`
})

async function handleCopyLink() {
	const linkToCopy = (import.meta.client && window.location?.href) ? window.location.href : shareUrl.value
	try {
		if (navigator.clipboard) {
			await navigator.clipboard.writeText(linkToCopy)
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
	<!-- 1. Sidebar Compact Swiss Variant -->
	<div
		v-if="variant === 'sidebar'"
		class="border border-slate-200/80 bg-white p-4 dark:border-[#134e43] dark:bg-[#002420]/40"
	>
		<div class="mb-3 flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5 dark:border-[#134e43]">
			<div class="flex items-center gap-1.5 text-[11px] text-brand-700 font-bold tracking-[0.15em] font-mono uppercase dark:text-accent">
				<span class="inline-block h-1.5 w-1.5 bg-brand-500" />
				<span>{{ locale === 'id' ? 'BAGIKAN' : 'SHARE' }}</span>
			</div>

			<!-- Quick Copy Button -->
			<button
				type="button"
				class="inline-flex cursor-pointer items-center gap-1.5 border border-slate-300 bg-slate-50 px-2 py-1 text-[10px] text-slate-800 font-bold font-mono uppercase transition-colors duration-150 active:scale-[0.98] dark:border-[#134e43] dark:bg-[#001e1c] hover:bg-slate-900 dark:text-slate-200 hover:text-white dark:hover:bg-brand-500 dark:hover:text-slate-950"
				:aria-label="locale === 'id' ? 'Salin tautan artikel' : 'Copy article link'"
				@click="handleCopyLink"
			>
				<span
					:class="copied ? 'i-swisspost-checkmark text-emerald-600 dark:text-slate-950' : 'i-swisspost-link'"
					class="shrink-0 text-xs"
				/>
				<span>{{ copied ? (locale === 'id' ? 'TERSALIN' : 'COPIED') : (locale === 'id' ? 'SALIN' : 'COPY') }}</span>
			</button>
		</div>

		<!-- 6-Col Grid of Swiss Post Social Icons -->
		<div class="grid grid-cols-6 gap-1.5">
			<SocialShare
				v-for="net in networks"
				:key="net.name"
				:network="net.name"
				:styled="false"
				:label="false"
				:icon="false"
				:title="title"
				:description="description"
				:url="shareUrl"
				rel="nofollow noopener noreferrer"
				user="dinarpermadi07"
				class="group aspect-square flex items-center justify-center border border-slate-300 bg-white p-1 text-slate-800 transition-colors duration-150 active:scale-[0.98] dark:border-[#134e43] dark:bg-[#001e1c] hover:bg-slate-900 dark:text-slate-200 hover:text-white dark:hover:bg-brand-500 dark:hover:text-slate-950"
				:aria-label="`Share to ${net.label}`"
				@click="onShareClick(net.name)"
			>
				<span
					:class="net.icon"
					class="shrink-0 text-xs"
				/>
			</SocialShare>
		</div>
	</div>

	<!-- 2. Standard Default Wide Swiss Modular Plate -->
	<aside
		v-else
		aria-label="Social Share"
		class="my-10 border border-slate-200/80 bg-white p-6 dark:border-[#134e43] dark:bg-[#002420]/30 sm:p-8"
	>
		<!-- Header / Eyebrow + Title Section -->
		<div class="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-center dark:border-[#134e43]">
			<div>
				<div class="mb-2 flex items-center gap-2 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:text-accent">
					<span class="inline-block h-1.5 w-1.5 bg-brand-500" />
					<span>■ 03 // {{ locale === 'id' ? 'BAGIKAN TULISAN' : 'SHARE PUBLICATION' }}</span>
				</div>
				<h2 class="text-base text-slate-900 font-700 leading-snug tracking-tight font-heading sm:text-xl dark:text-slate-50">
					{{ locale === 'id' ? 'Menemukan naskah ini bermanfaat? Bagikan ke jejaring Anda' : 'Found this publication insightful? Share it with your network' }}
				</h2>
			</div>

			<!-- Swiss Hairline Copy Button -->
			<button
				type="button"
				class="inline-flex cursor-pointer items-center self-start gap-2 border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 font-bold font-mono uppercase transition-colors duration-150 active:scale-[0.98] sm:self-auto dark:border-[#134e43] dark:bg-[#001e1c] hover:bg-slate-900 dark:text-slate-100 hover:text-white dark:hover:bg-brand-500 dark:hover:text-slate-950"
				:aria-label="locale === 'id' ? 'Salin tautan artikel' : 'Copy article link'"
				@click="handleCopyLink"
			>
				<span
					:class="copied ? 'i-swisspost-checkmark text-emerald-600 dark:text-slate-950' : 'i-swisspost-link'"
					class="shrink-0 text-xs"
				/>
				<span>{{ copied ? (locale === 'id' ? 'TAUTAN TERSALIN!' : 'LINK COPIED!') : (locale === 'id' ? 'SALIN TAUTAN' : 'COPY LINK') }}</span>
			</button>
		</div>

		<!-- Social Share Buttons Grid: 6 Modular Columns -->
		<div class="grid grid-cols-2 gap-2 md:grid-cols-6 sm:grid-cols-3 sm:gap-3">
			<SocialShare
				v-for="net in networks"
				:key="net.name"
				:network="net.name"
				:styled="false"
				:label="false"
				:icon="false"
				:title="title"
				:description="description"
				:url="shareUrl"
				rel="nofollow noopener noreferrer"
				user="dinarpermadi07"
				class="group flex items-center justify-center gap-2 border border-slate-300 bg-slate-50/70 px-3 py-2.5 text-xs text-slate-800 font-bold tracking-wider font-mono uppercase transition-colors duration-150 active:scale-[0.98] dark:border-[#134e43] dark:bg-[#001e1c] hover:bg-slate-900 dark:text-slate-200 hover:text-white dark:hover:bg-brand-500 dark:hover:text-slate-950"
				:aria-label="`Bagikan ke ${net.label}`"
				@click="onShareClick(net.name)"
			>
				<span
					:class="net.icon"
					class="shrink-0 text-sm"
				/>
				<span>{{ net.shortLabel }}</span>
			</SocialShare>
		</div>

		<!-- Swiss Footnote / Ledger Strip -->
		<div class="mt-6 flex items-center justify-between border-t border-slate-200/80 pt-3 text-[10px] text-slate-900/40 font-mono uppercase dark:border-[#134e43] dark:text-slate-50/40">
			<span>DISTRIBUSI TERBUKA // DOKUMEN PUBLIK</span>
			<span class="tabular-nums">PERMADI.DEV</span>
		</div>
	</aside>
</template>
