<script setup lang="ts">
import { computed, provide, ref } from 'vue'

const props = withDefaults(
	defineProps<{
		type?: 'single' | 'multiple'
		class?: any
	}>(),
	{
		type: 'multiple',
		class: undefined,
	},
)

const activeItems = ref<Set<string | number>>(new Set())

function toggleItem(id: string | number) {
	if (props.type === 'single') {
		if (activeItems.value.has(id)) {
			activeItems.value.clear()
		}
		else {
			activeItems.value.clear()
			activeItems.value.add(id)
		}
	}
	else {
		if (activeItems.value.has(id)) {
			activeItems.value.delete(id)
		}
		else {
			activeItems.value.add(id)
		}
	}
}

provide('accordionActiveItems', activeItems)
provide('accordionToggle', toggleItem)
provide('accordionType', computed(() => props.type))
</script>

<template>
	<div
		class="my-6 flex flex-col gap-3 rounded-2xl p-1"
		:class="props.class"
	>
		<slot />
	</div>
</template>
