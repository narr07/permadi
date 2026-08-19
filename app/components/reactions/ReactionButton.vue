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

		<!-- Tombol Reaksi -->
		<Motion
			:while-hover="{ scale: isMaxedOut ? 1 : 1.12 }"
			:while-tap="{ scale: isMaxedOut ? 1 : 0.88 }"
			:transition="{ type: 'spring', stiffness: 400, damping: 17 }"
		>
			<button
				type="button"
				:title="isMaxedOut ? `Maksimal (${MAX_REACTION_LIMIT}/${MAX_REACTION_LIMIT}) tercapai!` : `${title} (${userCount}/${MAX_REACTION_LIMIT})`"
				:disabled="isMaxedOut"
				class="group relative flex items-center gap-1 border rounded-2xl px-2.5 py-1.5 text-xs font-medium transition-all duration-200 sm:gap-1.5 sm:px-3.5 sm:py-2 sm:text-sm"
				:class="[
					isMaxedOut
						? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300 opacity-90 cursor-default shadow-[0_0_12px_rgba(20,184,152,0.15)]'
						: 'border-emerald-900/60 bg-emerald-950/30 text-emerald-100 hover:border-emerald-400/60 hover:bg-emerald-900/40 hover:shadow-[0_0_16px_rgba(20,184,152,0.2)] active:border-emerald-400',
				]"
				@click="handleClick"
			>
				<!-- Icon Emoji -->
				<span class="text-base transition-transform duration-200 group-hover:scale-110 sm:text-lg">
					{{ emoji }}
				</span>

				<!-- Counter Badge -->
				<span
					class="text-[11px] font-semibold font-mono tabular-nums sm:text-xs"
					:class="isMaxedOut ? 'text-emerald-300' : 'text-emerald-200'"
				>
					{{ totalCount }}
				</span>

				<!-- Mini User Indicator Badge (jika user sudah memberi reaksi) -->
				<span
					v-if="userCount > 0"
					class="absolute h-4 min-w-4 flex items-center justify-center rounded-full px-1 text-[10px] text-white font-bold shadow-sm -right-1.5 -top-1.5"
					:class="isMaxedOut ? 'bg-amber-500' : 'bg-emerald-500'"
				>
					{{ userCount }}
				</span>
			</button>
		</Motion>
	</div>
</template>
