<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		type?: 'note' | 'tip' | 'important' | 'warning' | 'caution' | 'danger' | string
		icon?: string
		to?: string
		target?: string
		class?: any
	}>(),
	{
		type: 'note',
		icon: undefined,
		to: undefined,
		target: undefined,
		class: undefined,
	},
)

const resolvedType = computed(() => (props.type || 'note').toLowerCase())

const themeConfig = computed(() => {
	switch (resolvedType.value) {
		case 'tip':
		case 'success':
			return {
				icon: props.icon || 'i-hugeicons-checkmark-circle-02',
				border: 'border-emerald-500/30 dark:border-emerald-500/20',
				bg: 'bg-emerald-50/60 dark:bg-emerald-950/25',
				iconColor: 'text-emerald-600 dark:text-emerald-400',
				textColor: 'text-emerald-950 dark:text-emerald-100',
			}
		case 'warning':
			return {
				icon: props.icon || 'i-hugeicons-alert-02',
				border: 'border-amber-500/35 dark:border-amber-500/25',
				bg: 'bg-amber-50/60 dark:bg-amber-950/25',
				iconColor: 'text-amber-600 dark:text-amber-400',
				textColor: 'text-amber-950 dark:text-amber-100',
			}
		case 'caution':
		case 'danger':
		case 'error':
			return {
				icon: props.icon || 'i-hugeicons-alert-circle',
				border: 'border-rose-500/35 dark:border-rose-500/25',
				bg: 'bg-rose-50/60 dark:bg-rose-950/25',
				iconColor: 'text-rose-600 dark:text-rose-400',
				textColor: 'text-rose-950 dark:text-rose-100',
			}
		case 'important':
		case 'info':
			return {
				icon: props.icon || 'i-hugeicons-information-circle',
				border: 'border-sky-500/35 dark:border-sky-500/25',
				bg: 'bg-sky-50/60 dark:bg-sky-950/25',
				iconColor: 'text-sky-600 dark:text-sky-400',
				textColor: 'text-sky-950 dark:text-sky-100',
			}
		case 'note':
		default:
			return {
				icon: props.icon || 'i-hugeicons-bubble-chat-notification',
				border: 'border-brand-500/30 dark:border-brand-500/20',
				bg: 'bg-brand-50/60 dark:bg-brand-950/30',
				iconColor: 'text-brand-600 dark:text-brand-400',
				textColor: 'text-brand-950 dark:text-brand-100',
			}
	}
})
</script>

<template>
	<div
		class="shadow-xs relative my-6 overflow-hidden border rounded-2xl p-4.5 backdrop-blur-md transition-all sm:p-5"
		:class="[themeConfig.border, themeConfig.bg, props.class]"
	>
		<NuxtLink
			v-if="props.to"
			:to="props.to"
			:target="props.target || (props.to.startsWith('http') ? '_blank' : undefined)"
			class="absolute inset-0 z-10"
			aria-label="Callout link"
		/>

		<div class="flex items-start gap-3.5">
			<span
				:class="[themeConfig.icon, themeConfig.iconColor]"
				class="mt-0.5 shrink-0 text-xl"
			/>
			<div
				class="prose-callout-content min-w-0 flex-1 text-sm leading-relaxed font-sans"
				:class="themeConfig.textColor"
			>
				<slot mdc-unwrap="p" />
			</div>
		</div>
	</div>
</template>

<style scoped>
:deep(p) {
	margin: 0 !important;
}
:deep(a) {
	font-weight: 600;
	text-decoration: underline;
}
</style>
