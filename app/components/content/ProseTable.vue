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
	<div
		class="prose-table-container custom-scrollbar my-6 block max-w-full w-full overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs dark:border-slate-800 dark:bg-slate-950"
		:class="props.class"
		style="-webkit-overflow-scrolling: touch;"
	>
		<table class="min-w-full w-full border-collapse text-left text-sm font-sans">
			<slot />
		</table>
	</div>
</template>
