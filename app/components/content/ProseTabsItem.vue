<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		label?: string
		icon?: string
		description?: string
		class?: any
	}>(),
	{
		label: 'Tab',
		icon: undefined,
		description: undefined,
		class: undefined,
	},
)
</script>

<template>
	<div :class="props.class">
		<slot>
			{{ props.description }}
		</slot>
	</div>
</template>
