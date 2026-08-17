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
	<td
		class="px-5 py-3.5 text-sm text-slate-700 leading-normal font-sans dark:text-slate-200"
		:class="props.class"
	>
		<slot />
	</td>
</template>
