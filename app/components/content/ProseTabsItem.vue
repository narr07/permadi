<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		/**
		 * Tab label / title
		 */
		label?: string
		/**
		 * Alternative alias for label
		 */
		title?: string
		/**
		 * Leading tab icon
		 */
		icon?: string
		/**
		 * Optional description text
		 */
		description?: string
		/**
		 * Additional CSS classes
		 */
		class?: any
	}>(),
	{
		label: 'Tab',
		title: undefined,
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
