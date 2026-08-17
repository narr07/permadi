<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		cols?: number | string
		class?: any
	}>(),
	{
		cols: 2,
		class: undefined,
	},
)
</script>

<template>
	<div
		class="grid grid-cols-1 my-8 gap-4 lg:grid-cols-2 sm:grid-cols-2"
		:class="props.class"
	>
		<slot />
	</div>
</template>
