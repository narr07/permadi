<script setup lang="ts">
import ProseCallout from './ProseCallout.vue'

const props = withDefaults(
	defineProps<{
		icon?: string
		to?: string
		target?: string
		class?: any
	}>(),
	{
		icon: undefined,
		to: undefined,
		target: undefined,
		class: undefined,
	},
)
</script>

<template>
	<ProseCallout
		type="note"
		:icon="props.icon"
		:to="props.to"
		:target="props.target"
		:class="props.class"
	>
		<slot />
	</ProseCallout>
</template>
