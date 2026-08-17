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
		class="custom-scrollbar shadow-xs my-8 overflow-x-auto border border-slate-200/80 rounded-2xl bg-white/70 backdrop-blur-md dark:border-[#134e43]/60 dark:bg-[#001c19]/80"
		:class="props.class"
	>
		<table class="w-full border-collapse text-left text-sm font-sans">
			<slot />
		</table>
	</div>
</template>
