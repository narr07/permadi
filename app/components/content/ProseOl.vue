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
	<ol
		class="my-5 flex flex-col list-decimal gap-2 pl-6 font-sans marker:text-brand-700 marker:font-bold dark:marker:text-brand-400"
		:class="props.class"
	>
		<slot />
	</ol>
</template>
