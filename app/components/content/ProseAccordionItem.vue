<script setup lang="ts">
import type { ComputedRef, Ref } from 'vue'
import { computed, getCurrentInstance, inject } from 'vue'

const props = withDefaults(
	defineProps<{
		label?: string
		description?: string
		icon?: string
		defaultOpen?: boolean
		class?: any
	}>(),
	{
		label: 'FAQ Item',
		description: '',
		icon: undefined,
		defaultOpen: false,
		class: undefined,
	},
)

const activeItems = inject<Ref<Set<string | number>>>('accordionActiveItems')
const toggleItem = inject<(id: string | number) => void>('accordionToggle')
const _accordionType = inject<ComputedRef<'single' | 'multiple'>>('accordionType')

const instance = getCurrentInstance()
const itemId = computed(() => props.label || `item-${instance?.uid || Math.random()}`)

if (props.defaultOpen && activeItems?.value) {
	activeItems.value.add(itemId.value)
}

const isOpen = computed(() => {
	return activeItems?.value ? activeItems.value.has(itemId.value) : props.defaultOpen
})

function handleToggle() {
	if (toggleItem) {
		toggleItem(itemId.value)
	}
}
</script>

<template>
	<div
		class="shadow-xs overflow-hidden border border-[#115e4f]/25 rounded-2xl bg-white/70 backdrop-blur-md transition-all duration-300 dark:border-[#134e43]/60 dark:bg-[#001c19]/80"
		:class="[
			isOpen ? 'ring-1 ring-brand-500/30 dark:ring-brand-400/20' : 'hover:border-[#115e4f]/40 dark:hover:border-[#134e43]',
			props.class,
		]"
	>
		<button
			type="button"
			class="w-full flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-brand-50/50 dark:hover:bg-white/5"
			:aria-expanded="isOpen"
			@click="handleToggle"
		>
			<div class="flex items-center gap-3">
				<span
					v-if="props.icon"
					:class="props.icon"
					class="shrink-0 text-lg text-brand-600 dark:text-brand-400"
				/>
				<span class="text-sm text-slate-800 font-semibold font-sans sm:text-base dark:text-slate-100">
					{{ props.label }}
				</span>
			</div>

			<span
				class="i-hugeicons-arrow-down-01 shrink-0 text-base text-slate-400 transition-transform duration-300 dark:text-slate-500"
				:class="{ 'rotate-180 text-brand-500 dark:text-brand-400': isOpen }"
			/>
		</button>

		<div
			v-show="isOpen"
			class="border-t border-[#115e4f]/15 px-5 pb-5 pt-3 text-sm text-slate-600 leading-relaxed font-sans dark:border-[#134e43]/40 dark:text-slate-300"
		>
			<slot>
				{{ props.description }}
			</slot>
		</div>
	</div>
</template>
