<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		label?: string
		color?: 'primary' | 'neutral' | 'success' | 'warning' | 'error' | string
		class?: any
	}>(),
	{
		label: '',
		color: 'primary',
		class: undefined,
	},
)

const colorClasses = computed(() => {
	switch (props.color) {
		case 'success':
			return 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-300'
		case 'warning':
			return 'bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-300'
		case 'error':
		case 'danger':
			return 'bg-rose-500/15 text-rose-700 border-rose-500/30 dark:text-rose-300'
		case 'neutral':
			return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/10 dark:text-slate-300 dark:border-white/10'
		case 'primary':
		default:
			return 'bg-brand-500/15 text-brand-800 border-brand-500/30 dark:text-brand-300 dark:bg-brand-500/20'
	}
})
</script>

<template>
	<span
		class="inline-flex items-center border rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide font-sans transition-all"
		:class="[colorClasses, props.class]"
	>
		<slot>{{ props.label }}</slot>
	</span>
</template>
