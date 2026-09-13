<script setup lang="ts">
import type { ReactionType } from '~/stores/useReactionsStore'
import { computed, ref } from 'vue'
import { MAX_REACTION_LIMIT, useReactionsStore } from '~/stores/useReactionsStore'
import EmojiParticle from './EmojiParticle.vue'

const props = defineProps<{
	slug: string
	type: ReactionType
	emoji: string
	title: string
	index?: number
	section?: string
}>()

const store = useReactionsStore()
const articleState = computed(() => store.getArticleState(props.slug))

const totalCount = computed(() => articleState.value.total[props.type] || 0)
const userCount = computed(() => articleState.value.user[props.type] || 0)
const isMaxedOut = computed(() => userCount.value >= MAX_REACTION_LIMIT)

interface ParticleItem {
	id: string
	emoji: string
}
const particles = ref<ParticleItem[]>([])

function handleClick() {
	const allowed = store.addReaction(props.slug, props.type, props.section || 'general')
	if (allowed) {
		const newParticle: ParticleItem = {
			id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
			emoji: props.emoji,
		}
		particles.value.push(newParticle)
	}
}

function removeParticle(id: string) {
	particles.value = particles.value.filter(p => p.id !== id)
}
</script>

<template>
	<div class="relative w-full h-full">
		<!-- Floating Emoji Particles -->
		<EmojiParticle
			v-for="particle in particles"
			:id="particle.id"
			:key="particle.id"
			:emoji="particle.emoji"
			@remove="removeParticle"
		/>

		<!-- Swiss Modular Reaction Cell -->
		<button
			type="button"
			:title="isMaxedOut ? `Maksimal (${MAX_REACTION_LIMIT}/${MAX_REACTION_LIMIT}) tercapai!` : `${title} (${userCount}/${MAX_REACTION_LIMIT})`"
			:disabled="isMaxedOut"
			class="group w-full h-full p-4 sm:p-5 flex flex-col justify-between text-left transition-all font-mono text-xs cursor-pointer select-none bg-white dark:bg-[#001e1c]"
			:class="[
				isMaxedOut
					? 'opacity-80 cursor-default bg-slate-50/60 dark:bg-[#002420]/50'
					: userCount > 0
						? 'bg-brand-50/40 dark:bg-[#002420]/60 text-slate-900 dark:text-slate-50 hover:bg-brand-50/70 dark:hover:bg-[#002420]'
						: 'hover:bg-slate-50 dark:hover:bg-[#002420]/40 text-slate-900/80 dark:text-slate-50/80',
			]"
			@click="handleClick"
		>
			<!-- Top Indicator Strip: Sequential number and Emoji -->
			<div class="flex items-center justify-between gap-2 mb-3">
				<span class="text-[11px] font-bold tabular-nums text-slate-900/50 dark:text-slate-50/50">
					[{{ String(index || 1).padStart(2, '0') }}]
				</span>
				<span class="text-xl sm:text-2xl transition-transform duration-150 group-hover:scale-115">
					{{ emoji }}
				</span>
			</div>

			<!-- Middle: Title -->
			<div class="font-bold uppercase tracking-wider text-[11px] text-slate-900 dark:text-slate-50 mb-4 truncate">
				{{ title }}
			</div>

			<!-- Bottom: Total Count & User Quota -->
			<div class="pt-3 border-t border-slate-200/80 dark:border-[#134e43] flex items-baseline justify-between text-[11px] w-full">
				<span class="font-bold tabular-nums text-sm sm:text-base text-brand-600 dark:text-accent">
					{{ totalCount }}
				</span>
				<span
					class="text-[10px] uppercase font-semibold tabular-nums"
					:class="isMaxedOut ? 'text-brand-600 dark:text-accent font-bold' : userCount > 0 ? 'text-brand-600 dark:text-accent' : 'text-slate-900/40 dark:text-slate-50/40'"
				>
					{{ userCount > 0 ? `${userCount}/${MAX_REACTION_LIMIT}` : `+1` }}
				</span>
			</div>
		</button>
	</div>
</template>
