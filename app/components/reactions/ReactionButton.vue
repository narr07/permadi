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

const isBouncing = ref(false)

function handleClick() {
	const allowed = store.addReaction(props.slug, props.type, props.section || 'general')
	if (allowed) {
		isBouncing.value = true
		setTimeout(() => {
			isBouncing.value = false
		}, 350)
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
	<div class="relative h-full w-full">
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
			class="group h-full w-full flex flex-col cursor-pointer select-none justify-between bg-white p-4 text-left text-xs font-mono transition-all duration-150 active:scale-[0.98] dark:bg-[#001e1c] sm:p-5"
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
			<div class="mb-3 flex items-center justify-between gap-2">
				<span class="text-[11px] text-slate-900/50 font-bold tabular-nums dark:text-slate-50/50">
					[{{ String(index || 1).padStart(2, '0') }}]
				</span>
				<span
					class="text-xl transition-transform duration-150 sm:text-2xl"
					:class="isBouncing ? 'animate-spring-bounce' : 'group-hover:scale-115'"
				>
					{{ emoji }}
				</span>
			</div>

			<!-- Middle: Title -->
			<div class="mb-4 truncate text-[11px] text-slate-900 font-bold tracking-wider uppercase dark:text-slate-50">
				{{ title }}
			</div>

			<!-- Bottom: Total Count & User Quota -->
			<div class="w-full flex items-baseline justify-between border-t border-slate-200/80 pt-3 text-[11px] dark:border-[#134e43]">
				<span
					class="inline-block text-sm text-brand-600 font-bold tabular-nums transition-transform duration-150 sm:text-base dark:text-accent"
					:class="isBouncing ? 'animate-count-bump' : ''"
				>
					{{ totalCount }}
				</span>
				<span
					class="text-[10px] font-semibold uppercase tabular-nums"
					:class="isMaxedOut ? 'text-brand-600 dark:text-accent font-bold' : userCount > 0 ? 'text-brand-600 dark:text-accent' : 'text-slate-900/40 dark:text-slate-50/40'"
				>
					{{ userCount > 0 ? `${userCount}/${MAX_REACTION_LIMIT}` : `+1` }}
				</span>
			</div>
		</button>
	</div>
</template>
