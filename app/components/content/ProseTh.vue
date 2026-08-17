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
	<th
		class="px-5 py-3.5 text-left text-xs font-bold tracking-wide font-sans"
		:class="props.class"
	>
		<slot />
	</th>
</template>
