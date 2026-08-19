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
		class="custom-scrollbar my-8 block max-w-full w-full overflow-x-auto border border-slate-200/80 rounded-2xl bg-white/70 shadow-sm backdrop-blur-md dark:border-[#134e43]/60 dark:bg-[#001c19]/80"
		:class="props.class"
		style="-webkit-overflow-scrolling: touch;"
	>
		<table class="min-w-[560px] w-full border-collapse text-left text-sm font-sans">
			<slot />
		</table>
	</div>
</template>
