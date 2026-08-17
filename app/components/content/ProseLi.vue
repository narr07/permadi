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
	<li
		class="text-sm text-slate-700 leading-relaxed font-sans sm:text-base dark:text-slate-200"
		:class="props.class"
	>
		<slot />
	</li>
</template>
