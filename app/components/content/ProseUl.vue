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
	<ul
		class="my-5 flex flex-col list-disc gap-2 pl-6 font-sans marker:text-brand-600 dark:marker:text-brand-400"
		:class="props.class"
	>
		<slot />
	</ul>
</template>
