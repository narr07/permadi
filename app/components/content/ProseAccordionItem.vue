<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'

const props = withDefaults(
	defineProps<{
		/**
		 * Heading title / label of the accordion item
		 */
		label?: string
		/**
		 * Alternative alias for label
		 */
		title?: string
		/**
		 * Optional short description text
		 */
		description?: string
		/**
		 * Leading icon name (e.g. i-hugeicons-database-01, i-hugeicons-sparkles)
		 */
		icon?: string
		/**
		 * Optional custom trailing icon
		 */
		trailingIcon?: string
		/**
		 * Whether the accordion item is opened by default
		 * @default false
		 */
		defaultOpen?: boolean
		/**
		 * Additional CSS classes
		 */
		class?: any
	}>(),
	{
		label: '',
		title: '',
		description: '',
		icon: undefined,
		trailingIcon: undefined,
		defaultOpen: false,
		class: undefined,
	},
)

const register = inject<((id: string, defaultOpen: boolean) => void) | null>('accordionRegister', null)
const toggle = inject<((id: string) => void) | null>('accordionToggle', null)
const isItemOpen = inject<((id: string) => boolean) | null>('accordionIsOpen', null)
const parentTrailingIcon = inject<any>('accordionTrailingIcon', null)

const resolvedTrailingIcon = computed(() => props.trailingIcon || parentTrailingIcon?.value || 'i-hugeicons-arrow-down-01')

const internalOpen = ref(props.defaultOpen)

// Stable instance ID
const id = ref(`item-${Math.random().toString(36).substring(2, 9)}`)

const displayTitle = computed(() => props.label || props.title || 'Accordion Item')

const isOpen = computed(() => {
	if (isItemOpen) {
		return isItemOpen(id.value)
	}
	return internalOpen.value
})

onMounted(() => {
	if (register) {
		register(id.value, props.defaultOpen)
	}
})

function handleToggle() {
	if (toggle) {
		toggle(id.value)
	}
	else {
		internalOpen.value = !internalOpen.value
	}
}

const resolvedIcon = computed(() => {
	if (!props.icon)
		return undefined
	if (props.icon === 'i-hugeicons-database')
		return 'i-hugeicons-database-01'
	if (props.icon === 'i-hugeicons-global')
		return 'i-hugeicons-globe-02'
	return props.icon
})
</script>

<template>
	<div
		class="bento-accordion-item overflow-hidden border rounded-2xl bg-white shadow-xs transition-all duration-200 dark:border-slate-800/80 dark:bg-slate-950"
		:class="[
			isOpen
				? 'border-brand-500/50 ring-1 ring-brand-500/25 dark:border-brand-400/40 dark:ring-brand-400/20'
				: 'border-slate-200/90 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700',
			props.class,
		]"
	>
		<button
			type="button"
			class="w-full flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/60"
			:aria-expanded="isOpen"
			@click="handleToggle"
		>
			<div class="flex items-center gap-3.5">
				<div
					v-if="resolvedIcon"
					class="size-8 flex shrink-0 items-center justify-center border border-brand-500/30 rounded-lg bg-brand-500/10 text-brand-600 dark:border-brand-400/25 dark:bg-brand-500/15 dark:text-brand-400"
				>
					<span
						:class="resolvedIcon"
						class="text-base"
					/>
				</div>

				<span class="text-sm text-slate-900 font-bold tracking-tight font-sans sm:text-base dark:text-slate-100">
					{{ displayTitle }}
				</span>
			</div>

			<span
				:class="[resolvedTrailingIcon, { 'rotate-180 text-brand-600 dark:text-brand-400': isOpen }]"
				class="shrink-0 text-lg text-slate-400 transition-transform duration-200 dark:text-slate-500"
			/>
		</button>

		<div
			v-show="isOpen"
			class="border-t border-slate-100 px-5 pb-5 pt-3.5 text-sm text-slate-600 leading-relaxed font-sans dark:border-slate-800/70 dark:text-slate-300"
		>
			<slot>
				{{ props.description }}
			</slot>
		</div>
	</div>
</template>
