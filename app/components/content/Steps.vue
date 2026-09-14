<script setup lang="ts">
import ProseSteps from './ProseSteps.vue'

const props = withDefaults(
	defineProps<{
		level?: string | number
		class?: any
	}>(),
	{
		level: 3,
		class: undefined,
	},
)
</script>

<template>
	<ProseSteps
		:level="props.level"
		:class="props.class"
	>
		<slot />
	</ProseSteps>
</template>
