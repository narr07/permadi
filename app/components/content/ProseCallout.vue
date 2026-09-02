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
		 * Optional leading icon (e.g. i-hugeicons-information-circle, i-hugeicons-bulb, i-hugeicons-alert-02)
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
			return 'i-hugeicons-checkmark-circle-02'
		case 'warning':
			return 'i-hugeicons-alert-02'
		case 'error':
			return 'i-hugeicons-alert-circle'
		case 'info':
			return 'i-hugeicons-information-circle'
		case 'accent':
			return 'i-hugeicons-sparkles'
		case 'neutral':
			return 'i-hugeicons-note-01'
		case 'primary':
		default:
			return 'i-hugeicons-bulb'
	}
})

const colorConfig = computed(() => {
	switch (resolvedColor.value) {
		case 'warning':
		case 'yellow':
			return {
				border: 'border-[#ffd803]',
				bg: 'bg-[#ffd803]/90 shadow-md',
				icon: 'text-slate-950',
				text: 'text-slate-950',
				hover: props.to ? 'hover:bg-[#ffd803] hover:shadow-lg' : '',
			}
		case 'accent':
			return {
				border: 'border-[#f9bc60]',
				bg: 'bg-[#f9bc60]/90 shadow-md',
				icon: 'text-slate-950',
				text: 'text-slate-950',
				hover: props.to ? 'hover:bg-[#f9bc60] hover:shadow-lg' : '',
			}
		case 'error':
		case 'danger':
		case 'red':
			return {
				border: 'border-[#ef4565]',
				bg: 'bg-[#ef4565]/90 shadow-md',
				icon: 'text-white',
				text: 'text-white',
				hover: props.to ? 'hover:bg-[#ef4565] hover:shadow-lg' : '',
			}
		case 'info':
		case 'blue':
			return {
				border: 'border-[#3da9fc]',
				bg: 'bg-[#3da9fc]/90 shadow-md',
				icon: 'text-white',
				text: 'text-white',
				hover: props.to ? 'hover:bg-[#3da9fc] hover:shadow-lg' : '',
			}
		case 'success':
		case 'green':
			return {
				border: 'border-[#2cb67d]',
				bg: 'bg-[#2cb67d]/90 shadow-md',
				icon: 'text-white',
				text: 'text-white',
				hover: props.to ? 'hover:bg-[#2cb67d] hover:shadow-lg' : '',
			}
		case 'neutral':
		case 'gray':
			return {
				border: 'border-[#90b4ce]',
				bg: 'bg-[#90b4ce]/90 shadow-md',
				icon: 'text-slate-950',
				text: 'text-slate-950',
				hover: props.to ? 'hover:bg-[#90b4ce] hover:shadow-lg' : '',
			}
		case 'primary':
		default:
			return {
				border: 'border-brand-500/40 dark:border-brand-400/35',
				bg: 'bg-white dark:bg-slate-950 shadow-xs',
				icon: 'text-[#0f7662] dark:text-[#5eeacf]',
				text: 'text-slate-950 dark:text-slate-100',
				hover: props.to ? 'hover:border-brand-500 hover:shadow-md dark:hover:border-brand-400' : '',
			}
	}
})
</script>

<template>
	<div
		class="bento-callout group relative my-6 overflow-hidden border rounded-2xl p-4 transition-all duration-300 sm:p-5"
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
			<span class="i-lucide-external-link text-xs" />
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
				class="callout-body min-w-0 flex-1 text-sm leading-relaxed"
				:class="colorConfig.text"
			>
				<slot />
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Ensure inner prose elements blend seamlessly */
.callout-body :deep(p:first-child) {
	margin-top: 0 !important;
}
.callout-body :deep(p:last-child) {
	margin-bottom: 0 !important;
}
.callout-body :deep(p),
.callout-body :deep(li),
.callout-body :deep(span) {
	color: inherit !important;
	margin-top: 0.35rem;
	margin-bottom: 0.35rem;
}
.callout-body :deep(a) {
	color: inherit !important;
	text-decoration: underline !important;
	text-underline-offset: 2.5px !important;
	font-weight: 700 !important;
	position: relative;
	z-index: 20;
}
.callout-body :deep(strong),
.callout-body :deep(b) {
	color: inherit !important;
	font-weight: 700 !important;
}
.callout-body :deep(code) {
	color: inherit !important;
	background-color: rgba(125, 125, 125, 0.14) !important;
	border: 1px dashed currentColor !important;
}
</style>
