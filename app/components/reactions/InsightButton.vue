<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { Motion } from 'motion-v'
import { computed, ref } from 'vue'
import { useReactionsStore } from '~/stores/useReactionsStore'

const props = defineProps<{
	slug: string
}>()

const { locale } = useI18n()
const store = useReactionsStore()
const articleState = computed(() => store.getArticleState(props.slug))

const isOpen = ref(false)
const popoverRef = ref<HTMLElement | null>()

onClickOutside(popoverRef, () => {
	isOpen.value = false
})

const views = computed(() => articleState.value.views || 0)
const shares = computed(() => articleState.value.shares || 0)
const reactionsTotal = computed(() => {
	const t = articleState.value.total
	return (t.CLAPPING || 0) + (t.THINKING || 0) + (t.AMAZED || 0)
})

function formatNumber(num: number): string {
	if (num >= 1000000)
		return `${(num / 1000000).toFixed(1)}M`
	if (num >= 1000)
		return `${(num / 1000).toFixed(1)}k`
	return num.toLocaleString()
}
</script>

<template>
	<div
		ref="popoverRef"
		class="relative inline-flex items-center"
	>
		<!-- Insight Popover Panel (Bento Card Style, Wide & Clean) -->
		<Motion
			v-if="isOpen"
			:initial="{ opacity: 0, y: 12, scale: 0.94 }"
			:animate="{ opacity: 1, y: 0, scale: 1 }"
			:exit="{ opacity: 0, y: 8, scale: 0.96 }"
			:transition="{ duration: 0.18, ease: 'easeOut' }"
			class="absolute bottom-full right-0 z-50 mb-3.5 w-80 border border-emerald-500/30 rounded-2xl bg-emerald-950/95 p-4 text-slate-100 shadow-2xl backdrop-blur-2xl sm:right-1/2 sm:w-92 sm:translate-x-1/2"
		>
			<!-- Header with Locale Support -->
			<div class="mb-3 flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
				<div class="flex items-center gap-2 text-xs text-emerald-300 font-bold tracking-wider font-heading uppercase">
					<span class="i-lucide-bar-chart-2 text-sm text-emerald-400" />
					<span>{{ locale === 'id' ? 'Statistik Artikel' : 'Article Insights' }}</span>
				</div>
				<button
					type="button"
					class="rounded-lg p-1 text-slate-400 transition-colors hover:bg-emerald-900/60 hover:text-white"
					:aria-label="locale === 'id' ? 'Tutup' : 'Close'"
					@click="isOpen = false"
				>
					<span class="i-lucide-x text-sm" />
				</button>
			</div>

			<!-- 3 Main Metrics Grid (Bento Style) -->
			<div class="grid grid-cols-3 gap-2.5 py-1 text-center">
				<div class="flex flex-col items-center border border-emerald-500/15 rounded-xl bg-emerald-900/35 p-2.5 shadow-inner">
					<span class="text-[11px] text-meta text-slate-300 font-medium">Views</span>
					<span class="mt-1 text-lg text-emerald-300 font-bold font-mono">
						{{ formatNumber(views) }}
					</span>
				</div>

				<div class="flex flex-col items-center border border-emerald-500/15 rounded-xl bg-emerald-900/35 p-2.5 shadow-inner">
					<span class="text-[11px] text-meta text-slate-300 font-medium">Shares</span>
					<span class="mt-1 text-lg text-teal-300 font-bold font-mono">
						{{ formatNumber(shares) }}
					</span>
				</div>

				<div class="flex flex-col items-center border border-emerald-500/15 rounded-xl bg-emerald-900/35 p-2.5 shadow-inner">
					<span class="text-[11px] text-meta text-slate-300 font-medium">Reactions</span>
					<span class="mt-1 text-lg text-cyan-300 font-bold font-mono">
						{{ formatNumber(reactionsTotal) }}
					</span>
				</div>
			</div>

			<!-- Reaction Breakdown Pills -->
			<div class="mt-3 flex items-center justify-between border-t border-emerald-500/20 px-1 pt-2.5 text-xs text-slate-300">
				<span class="inline-flex items-center gap-1 font-mono">👏 {{ articleState.total.CLAPPING || 0 }}</span>
				<span class="inline-flex items-center gap-1 font-mono">🧐 {{ articleState.total.THINKING || 0 }}</span>
				<span class="inline-flex items-center gap-1 font-mono">😲 {{ articleState.total.AMAZED || 0 }}</span>
			</div>
		</Motion>

		<!-- Toggle Button -->
		<Motion
			:while-hover="{ scale: 1.12 }"
			:while-tap="{ scale: 0.9 }"
			:transition="{ type: 'spring', stiffness: 400, damping: 17 }"
		>
			<button
				type="button"
				:title="locale === 'id' ? 'Lihat Statistik Artikel' : 'View Article Insights'"
				:aria-label="locale === 'id' ? 'Lihat Statistik Artikel' : 'View Article Insights'"
				class="h-8 w-8 flex items-center justify-center border rounded-xl transition-all duration-200 sm:h-10 sm:w-10 sm:rounded-2xl"
				:class="[
					isOpen
						? 'border-emerald-400 bg-emerald-900/60 text-emerald-300 shadow-[0_0_16px_rgba(20,184,152,0.3)]'
						: 'border-emerald-900/60 bg-emerald-950/30 text-emerald-300 hover:border-emerald-400/60 hover:bg-emerald-900/40 hover:text-white',
				]"
				@click="isOpen = !isOpen"
			>
				<span class="i-lucide-bar-chart-2 text-sm sm:text-base" />
			</button>
		</Motion>
	</div>
</template>
