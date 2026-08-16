<script setup lang="ts">
withDefaults(
	defineProps<{
		code?: string
		language?: string
	}>(),
	{
		code: '',
		language: '',
	},
)
</script>

<template>
	<code class="break-words border border-slate-200/80 rounded-md bg-slate-100/90 px-1.5 py-0.5 text-[0.875em] text-brand-800 font-medium font-mono dark:border-slate-800 dark:bg-white/5 dark:text-brand-300"><slot /></code>
</template>
