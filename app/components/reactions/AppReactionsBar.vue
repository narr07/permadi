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
	if (!reactionsTotal.value)
		return 0
	return Math.round(((articleState.value.total.CLAPPING || 0) / reactionsTotal.value) * 100)
})

const thinkingPercentage = computed(() => {
	if (!reactionsTotal.value)
		return 0
	return Math.round(((articleState.value.total.THINKING || 0) / reactionsTotal.value) * 100)
})

const amazedPercentage = computed(() => {
	if (!reactionsTotal.value)
		return 0
	return Math.round(((articleState.value.total.AMAZED || 0) / reactionsTotal.value) * 100)
})
</script>

<template>
	<!-- Swiss Editorial Reaction & Engagement Ledger -->
	<section
		aria-label="Respon dan Evaluasi Naskah"
		class="not-prose my-12 select-none border border-slate-200/80 bg-white font-mono dark:border-[#134e43] dark:bg-[#001e1c]"
	>
		<!-- Ledger Masthead -->
		<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 bg-slate-50/70 px-5 py-3.5 text-xs dark:border-[#134e43] dark:bg-[#002420]/50 sm:px-6">
			<div class="flex items-center gap-2 text-[11px] text-brand-700 font-bold tracking-[0.2em] uppercase dark:text-accent">
				<span class="inline-block h-2 w-2 bg-brand-500" />
				<span>■ 04 // EVALUASI NASKAH &amp; RESPON PEMBACA</span>
			</div>
			<div class="text-[11px] text-slate-600 tabular-nums dark:text-slate-400">
				TOTAL: {{ formatNumber(reactionsTotal) }} RESPON TERCATAT
			</div>
		</div>

		<!-- Explanatory Prompt -->
		<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 px-5 py-3 text-xs text-slate-700 dark:border-[#134e43] dark:text-slate-300">
			<span>{{ locale === 'id' ? 'Bagaimana impresi teknis Anda terhadap naskah ini? Tinggalkan respon tipografis:' : 'What is your technical evaluation of this document? Leave a response:' }}</span>
			<span class="text-[10px] text-slate-600 uppercase dark:text-slate-400">BATAS: 10 RESPON / KATEGORI</span>
		</div>

		<!-- 4-Column Modular Ledger Grid -->
		<div class="grid grid-cols-2 md:grid-cols-4 divide-y divide-slate-200/80 sm:divide-x sm:divide-y-0 dark:divide-[#134e43]">
			<!-- Reaction Cells 01, 02, 03 -->
			<div
				v-for="(item, idx) in reactionsList"
				:key="item.type"
				class="h-full border-b border-slate-200/80 md:border-b-0 dark:border-[#134e43]"
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
					class="group h-full w-full flex flex-col cursor-pointer select-none justify-between bg-white p-4 text-left text-xs font-mono transition-all duration-150 active:scale-[0.98] dark:bg-[#001e1c] sm:p-5"
					:class="isInsightOpen ? 'bg-slate-100 dark:bg-[#002420]' : 'hover:bg-slate-50 dark:hover:bg-[#002420]/40 text-slate-800 dark:text-slate-200'"
					@click="isInsightOpen = !isInsightOpen"
				>
					<!-- Top Strip -->
					<div class="mb-3 flex items-center justify-between gap-2">
						<span class="text-[11px] text-slate-600 font-bold tabular-nums dark:text-slate-400">
							[04]
						</span>
						<span class="text-xl transition-transform duration-150 group-hover:scale-115 sm:text-2xl">
							📊
						</span>
					</div>

					<!-- Title -->
					<div class="mb-4 truncate text-[11px] text-slate-900 font-bold tracking-wider uppercase dark:text-slate-50">
						{{ locale === 'id' ? 'STATISTIK' : 'INSIGHTS' }}
					</div>

					<!-- Bottom Status -->
					<div class="w-full flex items-baseline justify-between border-t border-slate-200/80 pt-3 text-[11px] dark:border-[#134e43]">
						<span class="text-sm text-brand-600 font-bold tabular-nums sm:text-base dark:text-accent">
							{{ formatNumber(views) }}
						</span>
						<span class="text-[10px] text-slate-600 font-semibold uppercase tabular-nums dark:text-slate-400">
							{{ isInsightOpen ? 'TUTUP ▲' : 'METRIK ▼' }}
						</span>
					</div>
				</button>
			</div>
		</div>

		<!-- Collapsible Swiss Analytics Matrix Ledger -->
		<div
			v-if="isInsightOpen"
			class="border-t border-slate-200/80 bg-slate-50/50 p-5 dark:border-[#134e43] dark:bg-[#002420]/30 sm:p-6"
		>
			<div class="mb-4 flex items-center justify-between border-b border-slate-200/80 pb-2 text-[11px] font-bold tracking-wider uppercase dark:border-[#134e43]">
				<div class="flex items-center gap-2 text-brand-700 dark:text-accent">
					<span class="inline-block h-1.5 w-1.5 bg-brand-500" />
					<span>LEDGER PARAMETER ANALITIK DOKUMEN</span>
				</div>
				<button
					type="button"
					class="cursor-pointer text-slate-600 transition-transform duration-150 active:scale-95 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
					@click="isInsightOpen = false"
				>
					TUTUP ✕
				</button>
			</div>

			<!-- 3 Specimen Metrics -->
			<div class="grid grid-cols-1 mb-5 border border-slate-200/80 bg-white sm:grid-cols-3 divide-y dark:border-[#134e43] dark:bg-[#001e1c] sm:divide-x sm:divide-y-0">
				<div class="p-3.5 text-center">
					<span class="mb-1 block text-[10px] text-slate-600 font-bold tracking-wider uppercase dark:text-slate-400">
						TOTAL TAYANGAN
					</span>
					<span class="text-xl text-slate-900 font-bold tabular-nums sm:text-2xl dark:text-slate-50">
						{{ formatNumber(views) }}
					</span>
				</div>

				<div class="p-3.5 text-center">
					<span class="mb-1 block text-[10px] text-slate-600 font-bold tracking-wider uppercase dark:text-slate-400">
						REFERENSI &amp; TAUTAN
					</span>
					<span class="text-xl text-brand-600 font-bold tabular-nums sm:text-2xl dark:text-accent">
						{{ formatNumber(shares) }}
					</span>
				</div>

				<div class="p-3.5 text-center">
					<span class="mb-1 block text-[10px] text-slate-600 font-bold tracking-wider uppercase dark:text-slate-400">
						TOTAL REAKSI
					</span>
					<span class="text-xl text-slate-900 font-bold tabular-nums sm:text-2xl dark:text-slate-50">
						{{ formatNumber(reactionsTotal) }}
					</span>
				</div>
			</div>

			<!-- Hairline Distribution Bars -->
			<div class="text-xs space-y-3">
				<div class="space-y-1">
					<div class="flex justify-between text-[11px]">
						<span>👏 TEPUK TANGAN (CLAPPING)</span>
						<span class="font-bold tabular-nums">{{ articleState.total.CLAPPING || 0 }} ({{ clapPercentage }}%)</span>
					</div>
					<div class="h-1.5 w-full bg-slate-200/80 dark:bg-[#134e43]">
						<div
							class="h-full bg-brand-500 transition-all duration-300"
							:style="{ width: `${clapPercentage}%` }"
						/>
					</div>
				</div>

				<div class="space-y-1">
					<div class="flex justify-between text-[11px]">
						<span>🧐 INSIGHTFUL (THINKING)</span>
						<span class="font-bold tabular-nums">{{ articleState.total.THINKING || 0 }} ({{ thinkingPercentage }}%)</span>
					</div>
					<div class="h-1.5 w-full bg-slate-200/80 dark:bg-[#134e43]">
						<div
							class="h-full bg-brand-600 transition-all duration-300 dark:bg-brand-400"
							:style="{ width: `${thinkingPercentage}%` }"
						/>
					</div>
				</div>

				<div class="space-y-1">
					<div class="flex justify-between text-[11px]">
						<span>😲 IMPRESIF (AMAZED)</span>
						<span class="font-bold tabular-nums">{{ articleState.total.AMAZED || 0 }} ({{ amazedPercentage }}%)</span>
					</div>
					<div class="h-1.5 w-full bg-slate-200/80 dark:bg-[#134e43]">
						<div
							class="h-full bg-brand-700 transition-all duration-300 dark:bg-accent"
							:style="{ width: `${amazedPercentage}%` }"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
