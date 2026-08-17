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
	<tbody
		class="divide-y divide-slate-100 dark:divide-[#134e43]/30"
		:class="props.class"
	>
		<slot />
	</tbody>
</template>
