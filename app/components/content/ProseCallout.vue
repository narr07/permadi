<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		/**
		 * Callout theme color
		 * @default 'primary'
		 */
		color?: 'primary' | 'neutral' | 'accent' | 'success' | 'warning' | 'error' | 'info'
		/**
		 * Optional leading icon (e.g. i-swisspost-info, i-swisspost-bulb, i-swisspost-warning)
		 */
		icon?: string
		/**
		 * Optional navigation link URL
		 */
		to?: string
		/**
		 * Target window for navigation
		 * @default undefined
		 */
		target?: '_blank' | '_self' | '_parent' | '_top'
		/**
		 * Additional CSS classes
		 */
		class?: any
	}>(),
	{
		color: 'primary',
		icon: undefined,
		to: undefined,
		target: undefined,
		class: undefined,
	},
)

const resolvedColor = computed(() => (props.color || 'primary').toLowerCase())

const resolvedTarget = computed(() => {
	if (props.target)
		return props.target
	if (props.to && (props.to.startsWith('http://') || props.to.startsWith('https://')))
		return '_blank'
	return undefined
})

const defaultIcon = computed(() => {
	if (props.icon)
		return props.icon
	switch (resolvedColor.value) {
		case 'success':
			return 'i-swisspost-checkmark'
		case 'warning':
			return 'i-swisspost-warning'
		case 'error':
			return 'i-swisspost-warning'
		case 'info':
			return 'i-swisspost-info'
		case 'accent':
			return 'i-swisspost-magicwand'
		case 'neutral':
			return 'i-swisspost-edit'
		case 'primary':
		default:
			return 'i-swisspost-bulb'
	}
})

const colorConfig = computed(() => {
	switch (resolvedColor.value) {
		case 'warning':
		case 'yellow':
			return {
				border: 'border-amber-500/40 dark:border-amber-400/30',
				bg: 'bg-amber-500/5 dark:bg-amber-950/20',
				icon: 'text-amber-600 dark:text-amber-400',
				text: 'text-slate-900 dark:text-slate-100',
				hover: props.to ? 'hover:border-amber-500 dark:hover:border-amber-400' : '',
			}
		case 'accent':
			return {
				border: 'border-amber-400/40 dark:border-amber-300/30',
				bg: 'bg-amber-400/5 dark:bg-amber-900/20',
				icon: 'text-amber-600 dark:text-amber-400',
				text: 'text-slate-900 dark:text-slate-100',
				hover: props.to ? 'hover:border-amber-400' : '',
			}
		case 'error':
		case 'danger':
		case 'red':
			return {
				border: 'border-rose-500/40 dark:border-rose-400/30',
				bg: 'bg-rose-500/5 dark:bg-rose-950/20',
				icon: 'text-rose-600 dark:text-rose-400',
				text: 'text-slate-900 dark:text-slate-100',
				hover: props.to ? 'hover:border-rose-500 dark:hover:border-rose-400' : '',
			}
		case 'info':
		case 'blue':
			return {
				border: 'border-sky-500/40 dark:border-sky-400/30',
				bg: 'bg-sky-500/5 dark:bg-sky-950/20',
				icon: 'text-sky-600 dark:text-sky-400',
				text: 'text-slate-900 dark:text-slate-100',
				hover: props.to ? 'hover:border-sky-500 dark:hover:border-sky-400' : '',
			}
		case 'success':
		case 'green':
			return {
				border: 'border-emerald-500/40 dark:border-emerald-400/30',
				bg: 'bg-emerald-500/5 dark:bg-emerald-950/20',
				icon: 'text-emerald-600 dark:text-emerald-400',
				text: 'text-slate-900 dark:text-slate-100',
				hover: props.to ? 'hover:border-emerald-500 dark:hover:border-emerald-400' : '',
			}
		case 'neutral':
		case 'gray':
			return {
				border: 'border-slate-300 dark:border-white/15',
				bg: 'bg-slate-50 dark:bg-white/[0.02]',
				icon: 'text-slate-600 dark:text-slate-400',
				text: 'text-slate-900 dark:text-slate-100',
				hover: props.to ? 'hover:border-slate-400 dark:hover:border-white/25' : '',
			}
		case 'primary':
		default:
			return {
				border: 'border-[#14b898]/40 dark:border-[#14b898]/30',
				bg: 'bg-[#14b898]/5 dark:bg-[#14b898]/10',
				icon: 'text-[#0f7662] dark:text-[#5eeacf]',
				text: 'text-slate-900 dark:text-slate-100',
				hover: props.to ? 'hover:border-[#14b898]' : '',
			}
	}
})
</script>

<template>
	<div
		class="callout-card group relative my-6 border p-4 transition-all duration-200 sm:p-5"
		:class="[
			colorConfig.border,
			colorConfig.bg,
			colorConfig.hover,
			props.to ? 'cursor-pointer' : '',
			props.class,
		]"
	>
		<!-- NuxtLink overlay for clickable callout -->
		<NuxtLink
			v-if="props.to"
			:to="props.to"
			:target="resolvedTarget"
			class="absolute inset-0 z-10"
			:aria-label="typeof props.to === 'string' ? props.to : 'Callout link'"
		/>

		<!-- External Link Icon (Top Right) -->
		<div
			v-if="props.to && resolvedTarget === '_blank'"
			class="pointer-events-none absolute right-3.5 top-3.5 text-slate-400 transition-colors group-hover:text-current"
			:class="colorConfig.icon"
		>
			<span class="i-swisspost-linkexternal text-xs" />
		</div>

		<!-- Content Layout (Leading Icon + Body) -->
		<div class="flex items-start gap-3.5">
			<div
				v-if="defaultIcon"
				class="mt-0.5 shrink-0 text-xl transition-transform duration-300 group-hover:scale-110"
				:class="[defaultIcon, colorConfig.icon]"
				aria-hidden="true"
			/>

			<div
				class="callout-body min-w-0 flex-1 text-sm leading-relaxed [&_a]:(relative z-20 color-inherit font-bold underline underline-offset-[2.5px]) [&_li]:(my-1.5 color-inherit) [&_p]:(my-1.5 color-inherit first:mt-0 last:mb-0) [&_code]:(border border-current border-dashed bg-black/10 color-inherit dark:bg-white/15) [&_span]:color-inherit [&_b]:font-bold [&_strong]:font-bold"
				:class="colorConfig.text"
			>
				<slot />
			</div>
		</div>
	</div>
</template>
