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
	<tr
		class="transition-colors hover:bg-brand-50/40 dark:hover:bg-white/5"
		:class="props.class"
	>
		<slot />
	</tr>
</template>
