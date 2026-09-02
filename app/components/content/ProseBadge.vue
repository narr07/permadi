<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		/**
		 * The text label to display inside the badge
		 */
		label?: string
		/**
		 * Badge color theme
		 * @default 'primary'
		 */
		color?: 'primary' | 'neutral' | 'accent' | 'success' | 'warning' | 'error' | 'info'
		/**
		 * Badge visual variant style
		 * @default 'subtle'
		 */
		variant?: 'subtle' | 'solid' | 'outline' | 'soft'
		/**
		 * Badge size
		 * @default 'sm'
		 */
		size?: 'xs' | 'sm' | 'md' | 'lg'
		/**
		 * Leading icon name (e.g. i-vscode-icons-file-type-nuxt)
		 */
		icon?: string
		/**
		 * Additional CSS classes
		 */
		class?: any
	}>(),
	{
		label: '',
		color: 'primary',
		variant: 'subtle',
		size: 'sm',
		icon: undefined,
		class: undefined,
	},
)

const resolvedColor = computed(() => {
	const c = (props.color || props.type || 'primary').toLowerCase()
	if (c === 'danger')
		return 'error'
	return c
})

const resolvedVariant = computed(() => (props.variant || 'subtle').toLowerCase())

const sizeClasses = computed(() => {
	switch (props.size) {
		case 'xs':
			return 'text-[10px] px-1.5 py-0.5 gap-1 rounded'
		case 'md':
			return 'text-xs px-2.5 py-1 gap-1.5 rounded-md'
		case 'lg':
			return 'text-sm px-3 py-1.5 gap-1.5 rounded-md'
		case 'sm':
		default:
			return 'text-[11px] px-2 py-0.5 gap-1 rounded-md'
	}
})

const colorVariantClasses = computed(() => {
	const c = resolvedColor.value
	const v = resolvedVariant.value

	// Primary (Brand Teal)
	if (c === 'primary') {
		if (v === 'solid')
			return 'bg-[#0f7662] text-white border-transparent dark:bg-[#14b898] dark:text-[#000b07]'
		if (v === 'outline')
			return 'border border-brand-500/50 text-[#0f7662] dark:text-[#5eeacf] dark:border-brand-400/50 bg-transparent'
		if (v === 'soft')
			return 'bg-brand-500/10 text-[#0f7662] dark:bg-brand-500/20 dark:text-[#5eeacf] border-transparent'
		// subtle (default)
		return 'bg-brand-500/10 text-[#0f7662] border border-brand-500/25 dark:bg-brand-500/15 dark:text-[#5eeacf] dark:border-brand-400/30'
	}

	// Accent (Brand Gold / Accent #f9bc60)
	if (c === 'accent') {
		if (v === 'solid')
			return 'bg-[#f9bc60] text-slate-950 border-transparent'
		if (v === 'outline')
			return 'border border-[#f9bc60]/60 text-[#b47818] dark:text-[#f9bc60] bg-transparent'
		if (v === 'soft')
			return 'bg-[#f9bc60]/15 text-[#9a6410] dark:bg-[#f9bc60]/20 dark:text-[#facd87] border-transparent'
		// subtle
		return 'bg-[#f9bc60]/15 text-[#9a6410] border border-[#f9bc60]/35 dark:bg-[#f9bc60]/20 dark:text-[#facd87] dark:border-[#f9bc60]/35'
	}

	// Success (Green #2cb67d)
	if (c === 'success') {
		if (v === 'solid')
			return 'bg-[#2cb67d] text-white border-transparent dark:text-slate-950'
		if (v === 'outline')
			return 'border border-[#2cb67d]/60 text-[#1b8054] dark:text-[#2cb67d] bg-transparent'
		if (v === 'soft')
			return 'bg-[#2cb67d]/15 text-[#1b8054] dark:bg-[#2cb67d]/20 dark:text-[#4ee2a5] border-transparent'
		return 'bg-[#2cb67d]/15 text-[#1b8054] border border-[#2cb67d]/35 dark:bg-[#2cb67d]/20 dark:text-[#4ee2a5] dark:border-[#2cb67d]/35'
	}

	// Warning (Yellow / Amber #ffd803)
	if (c === 'warning') {
		if (v === 'solid')
			return 'bg-[#d97706] text-white border-transparent dark:bg-[#ffd803] dark:text-slate-950'
		if (v === 'outline')
			return 'border border-amber-500/60 text-amber-800 dark:text-[#ffd803] bg-transparent'
		if (v === 'soft')
			return 'bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border-transparent'
		return 'bg-amber-500/15 text-amber-800 border border-amber-500/35 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-400/35'
	}

	// Error / Danger (Red #ef4565)
	if (c === 'error') {
		if (v === 'solid')
			return 'bg-[#ef4565] text-white border-transparent'
		if (v === 'outline')
			return 'border border-[#ef4565]/60 text-[#c72847] dark:text-[#ef4565] bg-transparent'
		if (v === 'soft')
			return 'bg-[#ef4565]/15 text-[#c72847] dark:bg-[#ef4565]/20 dark:text-[#ff7891] border-transparent'
		return 'bg-[#ef4565]/15 text-[#c72847] border border-[#ef4565]/35 dark:bg-[#ef4565]/20 dark:text-[#ff7891] dark:border-[#ef4565]/35'
	}

	// Info (Blue #3da9fc)
	if (c === 'info') {
		if (v === 'solid')
			return 'bg-[#3da9fc] text-white border-transparent dark:text-slate-950'
		if (v === 'outline')
			return 'border border-[#3da9fc]/60 text-[#1976d2] dark:text-[#3da9fc] bg-transparent'
		if (v === 'soft')
			return 'bg-[#3da9fc]/15 text-[#1976d2] dark:bg-[#3da9fc]/20 dark:text-[#6ec5ff] border-transparent'
		return 'bg-[#3da9fc]/15 text-[#1976d2] border border-[#3da9fc]/35 dark:bg-[#3da9fc]/20 dark:text-[#6ec5ff] dark:border-[#3da9fc]/35'
	}

	// Neutral (Slate)
	if (v === 'solid')
		return 'bg-slate-900 text-white border-transparent dark:bg-white dark:text-slate-950'
	if (v === 'outline')
		return 'border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300 bg-transparent'
	if (v === 'soft')
		return 'bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 border-transparent'
	return 'bg-slate-100 text-slate-700 border border-slate-200/90 dark:bg-slate-800/70 dark:text-slate-300 dark:border-slate-700/80'
})
</script>

<template>
	<span
		class="prose-badge inline-flex select-none items-center align-middle font-medium font-sans leading-none transition-colors"
		:class="[
			sizeClasses,
			colorVariantClasses,
			props.class,
		]"
	>
		<span
			v-if="props.icon"
			:class="props.icon"
			class="shrink-0 text-[1.15em]"
		/>
		<span><slot>{{ props.label }}</slot></span>
	</span>
</template>

