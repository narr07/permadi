<script setup lang="ts">
import Caution from './Caution.vue'

const props = withDefaults(
	defineProps<{
		icon?: string
		to?: string
		target?: '_blank' | '_self' | '_parent' | '_top'
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
	<Caution
		:icon="props.icon"
		:to="props.to"
		:target="props.target"
		:class="props.class"
	>
		<slot />
	</Caution>
</template>
