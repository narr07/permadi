<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		class?: any
	}>(),
	{
		class: undefined,
	},
)
</script>

<template>
	<thead
		class="border-b border-slate-200/80 bg-brand-50/60 text-xs text-brand-900 font-bold tracking-wider uppercase dark:border-[#134e43]/60 dark:bg-black/30 dark:text-brand-300"
		:class="props.class"
	>
		<slot />
	</thead>
</template>
