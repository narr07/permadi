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
		<!-- Insight Popover Panel (Bento Card Style) -->
		<Motion
			v-if="isOpen"
			:initial="{ opacity: 0, y: 12, scale: 0.95 }"
			:animate="{ opacity: 1, y: 0, scale: 1 }"
			:exit="{ opacity: 0, y: 8, scale: 0.96 }"
			:transition="{ duration: 0.16, ease: 'easeOut' }"
			class="absolute bottom-full right-0 z-50 mb-3 max-w-[320px] w-full border border-slate-200/90 rounded-2xl bg-white/95 p-4 text-slate-900 shadow-2xl backdrop-blur-2xl sm:right-1/2 sm:max-w-[350px] sm:translate-x-1/2 dark:border-slate-800/90 dark:bg-slate-900/95 dark:text-slate-100"
		>
			<!-- Header with Locale Support -->
			<div class="mb-3 flex items-center justify-between border-b border-slate-200/70 pb-2.5 dark:border-slate-800/70">
				<div class="flex items-center gap-2 text-xs text-brand-900 font-bold tracking-wider font-heading uppercase dark:text-brand-300">
					<span class="i-lucide-bar-chart-2 text-sm text-brand-700 dark:text-brand-400" />
					<span>{{ locale === 'id' ? 'Statistik Artikel' : 'Article Insights' }}</span>
				</div>
				<button
					type="button"
					class="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
					:aria-label="locale === 'id' ? 'Tutup' : 'Close'"
					@click="isOpen = false"
				>
					<span class="i-lucide-x text-sm" />
				</button>
			</div>

			<!-- 3 Main Metrics Grid (Bento Style) -->
			<div class="grid grid-cols-3 gap-2 py-1 text-center sm:gap-2.5">
				<div class="shadow-xs flex flex-col items-center border border-slate-200/70 rounded-xl bg-slate-50/80 p-2 dark:border-slate-800/70 dark:bg-slate-800/50 sm:p-2.5">
					<span class="text-[11px] text-meta text-slate-600 font-medium dark:text-slate-400">Views</span>
					<span class="mt-0.5 text-base text-slate-950 font-bold font-mono sm:text-lg dark:text-slate-50">
						{{ formatNumber(views) }}
					</span>
				</div>

				<div class="shadow-xs flex flex-col items-center border border-slate-200/70 rounded-xl bg-slate-50/80 p-2 dark:border-slate-800/70 dark:bg-slate-800/50 sm:p-2.5">
					<span class="text-[11px] text-meta text-slate-600 font-medium dark:text-slate-400">Shares</span>
					<span class="mt-0.5 text-base text-brand-700 font-bold font-mono sm:text-lg dark:text-brand-400">
						{{ formatNumber(shares) }}
					</span>
				</div>

				<div class="shadow-xs flex flex-col items-center border border-slate-200/70 rounded-xl bg-slate-50/80 p-2 dark:border-slate-800/70 dark:bg-slate-800/50 sm:p-2.5">
					<span class="text-[11px] text-meta text-slate-600 font-medium dark:text-slate-400">Reactions</span>
					<span class="mt-0.5 text-base text-accent font-bold font-mono sm:text-lg">
						{{ formatNumber(reactionsTotal) }}
					</span>
				</div>
			</div>

			<!-- Reaction Breakdown Pills -->
			<div class="mt-3 flex items-center justify-between border-t border-slate-200/70 px-1 pt-2.5 text-xs text-slate-600 dark:border-slate-800/70 dark:text-slate-400">
				<span class="inline-flex items-center gap-1 font-mono">👏 {{ articleState.total.CLAPPING || 0 }}</span>
				<span class="inline-flex items-center gap-1 font-mono">🧐 {{ articleState.total.THINKING || 0 }}</span>
				<span class="inline-flex items-center gap-1 font-mono">😲 {{ articleState.total.AMAZED || 0 }}</span>
			</div>
		</Motion>

		<!-- Toggle Button -->
		<Motion
			:while-hover="{ scale: 1.08 }"
			:while-tap="{ scale: 0.92 }"
			:transition="{ type: 'spring', stiffness: 400, damping: 17 }"
		>
			<button
				type="button"
				:title="locale === 'id' ? 'Lihat Statistik Artikel' : 'View Article Insights'"
				:aria-label="locale === 'id' ? 'Lihat Statistik Artikel' : 'View Article Insights'"
				class="h-7 w-7 flex items-center justify-center border rounded-full transition-all duration-150 sm:h-8 sm:w-8"
				:class="[
					isOpen
						? 'border-brand-500 bg-brand-50 text-brand-800 shadow-xs dark:border-brand-400 dark:bg-brand-950/60 dark:text-brand-300'
						: 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100',
				]"
				@click="isOpen = !isOpen"
			>
				<span class="i-lucide-bar-chart-2 text-xs sm:text-sm" />
			</button>
		</Motion>
	</div>
</template>
