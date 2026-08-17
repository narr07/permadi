<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		title?: string
		description?: string
		icon?: string
		to?: string
		target?: string
		color?: 'primary' | 'neutral' | string
		class?: any
	}>(),
	{
		title: '',
		description: '',
		icon: undefined,
		to: undefined,
		target: undefined,
		color: 'primary',
		class: undefined,
	},
)

const isExternal = computed(() => {
	return props.to && (props.to.startsWith('http://') || props.to.startsWith('https://'))
})
</script>

<template>
	<div
		class="bento-card-clean group shadow-xs relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 transition-all duration-300 sm:p-6"
		:class="[
			props.to ? 'cursor-pointer hover:border-brand-500/50 hover:shadow-md dark:hover:border-brand-400/50' : '',
			props.class,
		]"
	>
		<NuxtLink
			v-if="props.to"
			:to="props.to"
			:target="props.target || (isExternal ? '_blank' : undefined)"
			class="absolute inset-0 z-10"
			:aria-label="props.title || 'Card link'"
		/>

		<div>
			<div class="mb-4 flex items-center justify-between">
				<div
					v-if="props.icon"
					class="h-10 w-10 flex items-center justify-center border border-brand-500/30 rounded-xl bg-brand-500/10 text-brand-600 dark:border-brand-500/20 dark:bg-brand-500/15 dark:text-brand-400"
				>
					<span
						:class="props.icon"
						class="text-xl"
					/>
				</div>

				<span
					v-if="props.to"
					class="text-slate-400 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-slate-500 group-hover:-translate-y-0.5"
					:class="isExternal ? 'i-hugeicons-arrow-up-right-01 text-base' : 'i-hugeicons-arrow-right-01 text-base'"
				/>
			</div>

			<h3
				v-if="props.title"
				class="mb-2 text-base text-slate-900 font-bold tracking-tight font-sans transition-colors dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400"
			>
				{{ props.title }}
			</h3>

			<div class="text-sm text-slate-600 leading-relaxed font-sans dark:text-slate-300">
				<slot>
					{{ props.description }}
				</slot>
			</div>
		</div>
	</div>
</template>
