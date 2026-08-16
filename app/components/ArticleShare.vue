<script setup lang="ts">
	interface Props {
		title?: string
		description?: string
		url?: string
	}

	const props = withDefaults(defineProps<Props>(), {
		title: '',
		description: '',
		url: '',
	})

	const { locale } = useI18n()
	const copied = ref(false)

	const networks = [
		{
			name: 'x' as const,
			label: 'X (Twitter)',
			icon: 'i-simple-icons-x',
			hoverClass: 'hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white',
		},
		{
			name: 'whatsapp' as const,
			label: 'WhatsApp',
			icon: 'i-simple-icons-whatsapp',
			hoverClass: 'hover:border-[#25D366] hover:text-[#25D366]',
		},
		{
			name: 'linkedin' as const,
			label: 'LinkedIn',
			icon: 'i-simple-icons-linkedin',
			hoverClass: 'hover:border-[#0A66C2] hover:text-[#0A66C2]',
		},
		{
			name: 'telegram' as const,
			label: 'Telegram',
			icon: 'i-simple-icons-telegram',
			hoverClass: 'hover:border-[#26A5E4] hover:text-[#26A5E4]',
		},
		{
			name: 'threads' as const,
			label: 'Threads',
			icon: 'i-simple-icons-threads',
			hoverClass: 'hover:border-slate-900 dark:hover:border-white hover:text-slate-900 dark:hover:text-white',
		},
		{
			name: 'facebook' as const,
			label: 'Facebook',
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
	<aside
		aria-label="Social Share"
		class="bento-card-clean relative overflow-hidden p-6 sm:p-7 rounded-bento my-12 bg-white/90 dark:bg-[#002b27]/90 border border-slate-200/80 dark:border-[#134e43] shadow-sm"
	>
		<!-- Header / Title Section -->
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
			<div>
				<div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-100/80 dark:bg-brand-950 text-brand-800 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60 uppercase tracking-wider mb-2">
					<span class="i-hugeicons-share-01 text-xs" />
					<span>{{ locale === 'id' ? 'Bagikan Tulisan' : 'Share Article' }}</span>
				</div>
				<h2 class="font-heading font-bold text-slate-900 dark:text-white text-base sm:text-lg">
					{{ locale === 'id' ? 'Menemukan bacaan bermanfaat? Bagikan ke jejaring Anda' : 'Found this insightful? Share it with your network' }}
				</h2>
			</div>

			<!-- Quick Copy Button -->
			<button
				type="button"
				class="focus-ring self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100/90 dark:bg-[#042f27] hover:bg-white dark:hover:bg-[#073d32] border border-slate-200/70 dark:border-[#134e43] text-slate-700 dark:text-slate-200 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
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

		<!-- Social Share Buttons Grid -->
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
			<SocialShare
				v-for="net in networks"
				:key="net.name"
				:network="net.name"
				:styled="false"
				:label="false"
				:title="title"
				:description="description"
				:url="url || undefined"
				:user="'dinarpermadi07'"
				class="focus-ring group relative flex items-center justify-center sm:justify-start gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-[#002420]/80 hover:bg-white dark:hover:bg-[#003833] border border-slate-200/70 dark:border-[#134e43]/90 text-slate-700 dark:text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
				:class="net.hoverClass"
			>
				<span
					:class="net.icon"
					class="text-sm shrink-0 transition-transform duration-200 group-hover:scale-110"
				/>
				<span class="truncate font-sans font-medium">{{ net.label }}</span>
			</SocialShare>
		</div>
	</aside>
</template>
