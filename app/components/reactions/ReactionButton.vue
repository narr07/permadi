<script setup lang="ts">
import type { ReactionType } from '~/stores/useReactionsStore'
import { Motion } from 'motion-v'
import { computed, ref } from 'vue'
import { MAX_REACTION_LIMIT, useReactionsStore } from '~/stores/useReactionsStore'
import EmojiParticle from './EmojiParticle.vue'

const props = defineProps<{
	slug: string
	type: ReactionType
	emoji: string
	title: string
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
	<div class="relative inline-flex flex-col items-center">
		<!-- Partikel emoji melayang -->
		<EmojiParticle
			v-for="particle in particles"
			:id="particle.id"
			:key="particle.id"
			:emoji="particle.emoji"
			@remove="removeParticle"
		/>

		<!-- Tombol Reaksi (Bento Compact Pill) -->
		<Motion
			:while-hover="{ scale: isMaxedOut ? 1 : 1.08 }"
			:while-tap="{ scale: isMaxedOut ? 1 : 0.92 }"
			:transition="{ type: 'spring', stiffness: 400, damping: 17 }"
		>
			<button
				type="button"
				:title="isMaxedOut ? `Maksimal (${MAX_REACTION_LIMIT}/${MAX_REACTION_LIMIT}) tercapai!` : `${title} (${userCount}/${MAX_REACTION_LIMIT})`"
				:disabled="isMaxedOut"
				class="group relative flex items-center gap-1 border rounded-full px-2 py-1 text-xs font-medium transition-all duration-150 sm:gap-1.5 sm:px-2.5 sm:py-1"
				:class="[
					isMaxedOut
						? 'border-brand-500/40 bg-brand-50/80 text-brand-900 dark:bg-brand-950/50 dark:text-brand-300 dark:border-brand-400/40 cursor-default shadow-2xs'
						: userCount > 0
							? 'border-brand-200 bg-brand-50/50 text-brand-900 dark:border-brand-800/80 dark:bg-brand-950/30 dark:text-brand-200 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/60'
							: 'border-transparent bg-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100',
				]"
				@click="handleClick"
			>
				<!-- Icon Emoji -->
				<span class="text-sm transition-transform duration-150 group-hover:scale-110 sm:text-base">
					{{ emoji }}
				</span>

				<!-- Counter Badge -->
				<span
					class="text-[11px] font-semibold font-mono tabular-nums sm:text-xs"
					:class="isMaxedOut || userCount > 0 ? 'text-brand-900 dark:text-brand-300 font-bold' : 'text-slate-700 dark:text-slate-300'"
				>
					{{ totalCount }}
				</span>

				<!-- Mini User Indicator Badge -->
				<span
					v-if="userCount > 0"
					class="shadow-2xs absolute h-3.5 min-w-3.5 flex items-center justify-center border border-white rounded-full px-0.5 text-[9px] font-bold -right-1 -top-1 dark:border-slate-900"
					:class="isMaxedOut ? 'bg-accent text-slate-950' : 'bg-brand-600 text-white dark:bg-brand-500'"
				>
					{{ userCount }}
				</span>
			</button>
		</Motion>
	</div>
</template>
