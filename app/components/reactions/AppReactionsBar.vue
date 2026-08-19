<script setup lang="ts">
import { Motion } from 'motion-v'
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
		title: locale.value === 'id' ? 'Insightful / Bikin Mikir' : 'Insightful',
	},
	{
		type: 'AMAZED' as const,
		emoji: '😲',
		title: locale.value === 'id' ? 'Keren / Terpukau' : 'Amazed',
	},
])
</script>

<template>
	<!-- Pure Tailwind / UnoCSS Native Sticky Bottom Island -->
	<div class="reactions-bar-sticky pointer-events-none sticky bottom-5 z-40 my-6 flex select-none justify-center sm:bottom-7">
		<!-- Main Reactions Bar Pill Container -->
		<div
			class="pointer-events-auto relative flex items-center justify-center gap-1.5 border border-emerald-500/25 rounded-3xl bg-emerald-950/90 p-1.5 shadow-2xl backdrop-blur-xl transition-all sm:gap-3 sm:p-2.5"
		>
			<!-- Teleport Modal to Body: 100% Dead Center, No CSS Transform Clipping -->
			<ClientOnly>
				<Teleport to="body">
					<div
						v-if="isInsightOpen"
						class="pointer-events-none fixed inset-0 z-[9999] flex items-end justify-center px-4 pb-20 sm:pb-24"
					>
						<!-- Backdrop that closes modal on click -->
						<div
							class="pointer-events-auto fixed inset-0 bg-black/40 backdrop-blur-[2px]"
							@click="isInsightOpen = false"
						/>

						<!-- Popover Card (Bento Style) -->
						<Motion
							:initial="{ opacity: 0, y: 16, scale: 0.94 }"
							:animate="{ opacity: 1, y: 0, scale: 1 }"
							:exit="{ opacity: 0, y: 10, scale: 0.95 }"
							:transition="{ duration: 0.18, ease: 'easeOut' }"
							class="pointer-events-auto relative z-10 max-w-[340px] w-full border border-emerald-500/30 rounded-2xl bg-emerald-950/98 p-4 text-slate-100 shadow-2xl backdrop-blur-2xl sm:max-w-[370px]"
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
									@click="isInsightOpen = false"
								>
									<span class="i-lucide-x text-sm" />
								</button>
							</div>

							<!-- 3 Main Metrics Grid (Bento Style) -->
							<div class="grid grid-cols-3 gap-2 py-1 text-center sm:gap-2.5">
								<div class="flex flex-col items-center border border-emerald-500/15 rounded-xl bg-emerald-900/35 p-2 shadow-inner sm:p-2.5">
									<span class="text-[11px] text-meta text-slate-300 font-medium">Views</span>
									<span class="mt-1 text-base text-emerald-300 font-bold font-mono sm:text-lg">
										{{ formatNumber(views) }}
									</span>
								</div>

								<div class="flex flex-col items-center border border-emerald-500/15 rounded-xl bg-emerald-900/35 p-2 shadow-inner sm:p-2.5">
									<span class="text-[11px] text-meta text-slate-300 font-medium">Shares</span>
									<span class="mt-1 text-base text-teal-300 font-bold font-mono sm:text-lg">
										{{ formatNumber(shares) }}
									</span>
								</div>

								<div class="flex flex-col items-center border border-emerald-500/15 rounded-xl bg-emerald-900/35 p-2 shadow-inner sm:p-2.5">
									<span class="text-[11px] text-meta text-slate-300 font-medium">Reactions</span>
									<span class="mt-1 text-base text-cyan-300 font-bold font-mono sm:text-lg">
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
					</div>
				</Teleport>
			</ClientOnly>

			<!-- Reaction Buttons -->
			<ReactionButton
				v-for="item in reactionsList"
				:key="item.type"
				:slug="slug"
				:type="item.type"
				:emoji="item.emoji"
				:title="item.title"
				:section="activeSection"
			/>

			<!-- Separator -->
			<div class="h-6 w-[1px] bg-emerald-500/20" />

			<!-- Insight Trigger Button -->
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
						isInsightOpen
							? 'border-emerald-400 bg-emerald-900/60 text-emerald-300 shadow-[0_0_16px_rgba(20,184,152,0.3)]'
							: 'border-emerald-900/60 bg-emerald-950/30 text-emerald-300 hover:border-emerald-400/60 hover:bg-emerald-900/40 hover:text-white',
					]"
					@click="isInsightOpen = !isInsightOpen"
				>
					<span class="i-lucide-bar-chart-2 text-sm sm:text-base" />
				</button>
			</Motion>
		</div>
	</div>
</template>
