<script setup lang="ts">
import { computed, provide, ref } from 'vue'

export interface AccordionItemData {
	label?: string
	title?: string
	description?: string
	icon?: string
	defaultOpen?: boolean
	disabled?: boolean
	[key: string]: any
}

const props = withDefaults(
	defineProps<{
		/**
		 * Allow multiple accordion items to be active at the same time
		 * @default false
		 */
		multiple?: boolean
		/**
		 * Optional icon displayed on the right side of the trigger
		 * @default 'i-hugeicons-arrow-down-01'
		 */
		trailingIcon?: string
		/**
		 * Programmatic array of items (alternative to slots)
		 */
		items?: AccordionItemData[]
		/**
		 * Additional CSS classes
		 */
		class?: any
	}>(),
	{
		multiple: false,
		trailingIcon: 'i-hugeicons-arrow-down-01',
		items: undefined,
		class: undefined,
	},
)

const isMultiple = computed(() => !!props.multiple)

const openItems = ref<string[]>([])

function registerItem(id: string, defaultOpen = false) {
	if (defaultOpen && !openItems.value.includes(id)) {
		if (!isMultiple.value) {
			openItems.value = [id]
		}
		else {
			openItems.value.push(id)
		}
	}
}

function toggleItem(id: string) {
	const index = openItems.value.indexOf(id)
	if (!isMultiple.value) {
		if (index > -1) {
			openItems.value = []
		}
		else {
			openItems.value = [id]
		}
	}
	else {
		if (index > -1) {
			openItems.value.splice(index, 1)
		}
		else {
			openItems.value.push(id)
		}
	}
}

function isItemOpen(id: string) {
	return openItems.value.includes(id)
}

provide('accordionRegister', registerItem)
provide('accordionToggle', toggleItem)
provide('accordionIsOpen', isItemOpen)
provide('accordionMultiple', isMultiple)
provide('accordionTrailingIcon', computed(() => props.trailingIcon || 'i-hugeicons-arrow-down-01'))
</script>

<template>
	<div
		class="prose-accordion my-6 flex flex-col gap-3 rounded-2xl"
		:class="props.class"
	>
		<!-- If programmatic items array is passed -->
		<template v-if="props.items && props.items.length">
			<ProseAccordionItem
				v-for="(item, idx) in props.items"
				:key="item.label || item.title || idx"
				:label="item.label || item.title"
				:icon="item.icon"
				:description="item.description"
				:default-open="item.defaultOpen"
			/>
		</template>

		<!-- Default slot for :::prose-accordion-item components -->
		<slot v-else />
	</div>
</template>
