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

const resolvedIcon = computed(() => {
	if (!props.icon)
		return undefined
	if (props.icon === 'i-ph-database')
		return 'i-ph-database-01'
	if (props.icon === 'i-ph-globe')
		return 'i-ph-globe-hemisphere-west'
	return props.icon
})
</script>

<template>
	<div
		class="prose-card group relative flex flex-col justify-between overflow-hidden border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#002b27] p-5 shadow-xs transition-all duration-300 sm:p-6"
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
					v-if="resolvedIcon"
					class="h-10 w-10 flex items-center justify-center border border-brand-500/30 rounded-xl bg-brand-500/10 text-brand-600 dark:border-brand-500/20 dark:bg-brand-500/15 dark:text-brand-400"
				>
					<span
						:class="resolvedIcon"
						class="text-xl"
					/>
				</div>

				<span
					v-if="props.to"
					class="text-slate-400 transition-transform duration-300 group-hover:translate-x-0.5 dark:text-slate-500 group-hover:-translate-y-0.5"
					:class="isExternal ? 'i-ph-arrow-up-right text-base' : 'i-ph-arrow-right text-base'"
				/>
			</div>

			<p
				v-if="props.title"
				class="card-title mb-2 text-base text-slate-900 font-bold tracking-tight font-sans transition-colors dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400"
			>
				{{ props.title }}
			</p>

			<div class="card-description text-sm text-slate-600 leading-relaxed font-sans dark:text-slate-300">
				<slot>
					{{ props.description }}
				</slot>
			</div>
		</div>
	</div>
</template>
