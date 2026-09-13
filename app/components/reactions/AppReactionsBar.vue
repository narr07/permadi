<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useReactionsStore } from '~/stores/useReactionsStore'
import ReactionButton from './ReactionButton.vue'

const props = withDefaults(defineProps<{
	slug: string
	activeSection?: string
}>(), {
	activeSection: 'general',
})

const { locale } = useI18n()
const store = useReactionsStore()
const isInsightOpen = ref(false)

onMounted(() => {
	if (props.slug) {
		store.fetchReactions(props.slug)
		store.recordView(props.slug)
	}
})

const articleState = computed(() => store.getArticleState(props.slug))
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

const reactionsList = computed(() => [
	{
		type: 'CLAPPING' as const,
		emoji: '👏',
		title: locale.value === 'id' ? 'Tepuk Tangan' : 'Clap',
	},
	{
		type: 'THINKING' as const,
		emoji: '🧐',
		title: locale.value === 'id' ? 'Insightful' : 'Insightful',
	},
	{
		type: 'AMAZED' as const,
		emoji: '😲',
		title: locale.value === 'id' ? 'Impresif' : 'Amazed',
	},
])

const clapPercentage = computed(() => {
	if (!reactionsTotal.value) return 0
	return Math.round(((articleState.value.total.CLAPPING || 0) / reactionsTotal.value) * 100)
})

const thinkingPercentage = computed(() => {
	if (!reactionsTotal.value) return 0
	return Math.round(((articleState.value.total.THINKING || 0) / reactionsTotal.value) * 100)
})

const amazedPercentage = computed(() => {
	if (!reactionsTotal.value) return 0
	return Math.round(((articleState.value.total.AMAZED || 0) / reactionsTotal.value) * 100)
})
</script>

<template>
	<!-- Swiss Editorial Reaction & Engagement Ledger -->
	<section
		aria-label="Respon dan Evaluasi Naskah"
		class="not-prose my-12 border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#001e1c] font-mono select-none"
	>
		<!-- Ledger Masthead -->
		<div class="px-5 py-3.5 sm:px-6 border-b border-slate-200/80 dark:border-[#134e43] bg-slate-50/70 dark:bg-[#002420]/50 flex items-center justify-between flex-wrap gap-2 text-xs">
			<div class="flex items-center gap-2 font-bold tracking-[0.2em] uppercase text-[11px] text-brand-700 dark:text-accent">
				<span class="w-2 h-2 bg-brand-500 inline-block" />
				<span>■ 04 // EVALUASI NASKAH &amp; RESPON PEMBACA</span>
			</div>
			<div class="text-[11px] text-slate-900/50 dark:text-slate-50/50 tabular-nums">
				TOTAL: {{ formatNumber(reactionsTotal) }} RESPON TERCATAT
			</div>
		</div>

		<!-- Explanatory Prompt -->
		<div class="px-5 py-3 border-b border-slate-200/80 dark:border-[#134e43] text-xs text-slate-900/70 dark:text-slate-50/70 flex items-center justify-between flex-wrap gap-2">
			<span>{{ locale === 'id' ? 'Bagaimana impresi teknis Anda terhadap naskah ini? Tinggalkan respon tipografis:' : 'What is your technical evaluation of this document? Leave a response:' }}</span>
			<span class="text-[10px] text-slate-900/40 dark:text-slate-50/40 uppercase">BATAS: 10 RESPON / KATEGORI</span>
		</div>

		<!-- 4-Column Modular Ledger Grid -->
		<div class="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 dark:divide-[#134e43]">
			<!-- Reaction Cells 01, 02, 03 -->
			<div
				v-for="(item, idx) in reactionsList"
				:key="item.type"
				class="h-full border-b md:border-b-0 border-slate-200/80 dark:border-[#134e43]"
			>
				<ReactionButton
					:slug="slug"
					:type="item.type"
					:emoji="item.emoji"
					:title="item.title"
					:index="idx + 1"
					:section="activeSection"
				/>
			</div>

			<!-- Reaction Cell 04: Analytics / Insight Toggle Cell -->
			<div class="h-full">
				<button
					type="button"
					:aria-expanded="isInsightOpen"
					class="group w-full h-full p-4 sm:p-5 flex flex-col justify-between text-left transition-all font-mono text-xs cursor-pointer select-none bg-white dark:bg-[#001e1c]"
					:class="isInsightOpen ? 'bg-slate-100 dark:bg-[#002420]' : 'hover:bg-slate-50 dark:hover:bg-[#002420]/40 text-slate-900/80 dark:text-slate-50/80'"
					@click="isInsightOpen = !isInsightOpen"
				>
					<!-- Top Strip -->
					<div class="flex items-center justify-between gap-2 mb-3">
						<span class="text-[11px] font-bold tabular-nums text-slate-900/50 dark:text-slate-50/50">
							[04]
						</span>
						<span class="text-xl sm:text-2xl transition-transform duration-150 group-hover:scale-115">
							📊
						</span>
					</div>

					<!-- Title -->
					<div class="font-bold uppercase tracking-wider text-[11px] text-slate-900 dark:text-slate-50 mb-4 truncate">
						{{ locale === 'id' ? 'STATISTIK' : 'INSIGHTS' }}
					</div>

					<!-- Bottom Status -->
					<div class="pt-3 border-t border-slate-200/80 dark:border-[#134e43] flex items-baseline justify-between text-[11px] w-full">
						<span class="font-bold tabular-nums text-sm sm:text-base text-brand-600 dark:text-accent">
							{{ formatNumber(views) }}
						</span>
						<span class="text-[10px] uppercase font-semibold tabular-nums text-slate-900/50 dark:text-slate-50/50">
							{{ isInsightOpen ? 'TUTUP ▲' : 'METRIK ▼' }}
						</span>
					</div>
				</button>
			</div>
		</div>

		<!-- Collapsible Swiss Analytics Matrix Ledger -->
		<div
			v-if="isInsightOpen"
			class="border-t border-slate-200/80 dark:border-[#134e43] bg-slate-50/50 dark:bg-[#002420]/30 p-5 sm:p-6"
		>
			<div class="mb-4 pb-2 border-b border-slate-200/80 dark:border-[#134e43] flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
				<div class="flex items-center gap-2 text-brand-700 dark:text-accent">
					<span class="w-1.5 h-1.5 bg-brand-500 inline-block" />
					<span>LEDGER PARAMETER ANALITIK DOKUMEN</span>
				</div>
				<button
					type="button"
					class="text-slate-900/50 hover:text-slate-900 dark:text-slate-50/50 dark:hover:text-slate-50 cursor-pointer"
					@click="isInsightOpen = false"
				>
					TUTUP ✕
				</button>
			</div>

			<!-- 3 Specimen Metrics -->
			<div class="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#001e1c] mb-5">
				<div class="p-3.5 text-center">
					<span class="text-[10px] text-slate-900/50 dark:text-slate-50/50 font-bold uppercase tracking-wider block mb-1">
						TOTAL TAYANGAN
					</span>
					<span class="text-xl sm:text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
						{{ formatNumber(views) }}
					</span>
				</div>

				<div class="p-3.5 text-center">
					<span class="text-[10px] text-slate-900/50 dark:text-slate-50/50 font-bold uppercase tracking-wider block mb-1">
						REFERENSI &amp; TAUTAN
					</span>
					<span class="text-xl sm:text-2xl font-bold tabular-nums text-brand-600 dark:text-accent">
						{{ formatNumber(shares) }}
					</span>
				</div>

				<div class="p-3.5 text-center">
					<span class="text-[10px] text-slate-900/50 dark:text-slate-50/50 font-bold uppercase tracking-wider block mb-1">
						TOTAL REAKSI
					</span>
					<span class="text-xl sm:text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
						{{ formatNumber(reactionsTotal) }}
					</span>
				</div>
			</div>

			<!-- Hairline Distribution Bars -->
			<div class="space-y-3 text-xs">
				<div class="space-y-1">
					<div class="flex justify-between text-[11px]">
						<span>👏 TEPUK TANGAN (CLAPPING)</span>
						<span class="tabular-nums font-bold">{{ articleState.total.CLAPPING || 0 }} ({{ clapPercentage }}%)</span>
					</div>
					<div class="w-full h-1.5 bg-slate-200/80 dark:bg-[#134e43]">
						<div class="h-full bg-brand-500 transition-all duration-300" :style="{ width: `${clapPercentage}%` }" />
					</div>
				</div>

				<div class="space-y-1">
					<div class="flex justify-between text-[11px]">
						<span>🧐 INSIGHTFUL (THINKING)</span>
						<span class="tabular-nums font-bold">{{ articleState.total.THINKING || 0 }} ({{ thinkingPercentage }}%)</span>
					</div>
					<div class="w-full h-1.5 bg-slate-200/80 dark:bg-[#134e43]">
						<div class="h-full bg-brand-600 dark:bg-brand-400 transition-all duration-300" :style="{ width: `${thinkingPercentage}%` }" />
					</div>
				</div>

				<div class="space-y-1">
					<div class="flex justify-between text-[11px]">
						<span>😲 IMPRESIF (AMAZED)</span>
						<span class="tabular-nums font-bold">{{ articleState.total.AMAZED || 0 }} ({{ amazedPercentage }}%)</span>
					</div>
					<div class="w-full h-1.5 bg-slate-200/80 dark:bg-[#134e43]">
						<div class="h-full bg-brand-700 dark:bg-accent transition-all duration-300" :style="{ width: `${amazedPercentage}%` }" />
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
