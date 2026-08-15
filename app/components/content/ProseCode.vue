<script setup lang="ts">
	withDefaults(
		defineProps<{
			code?: string
			language?: string
		}>(),
		{
			code: '',
			language: '',
		}
	)
</script>

<template>
	<code class="px-1.5 py-0.5 text-[0.875em] font-mono font-medium rounded-md border border-slate-200/80 dark:border-slate-800 bg-slate-100/90 dark:bg-white/5 text-brand-600 dark:text-brand-400 break-words"><slot /></code>
</template>
