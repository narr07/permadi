<script setup lang="ts">
import type { Ref } from 'vue'
import { computed, getCurrentInstance, inject, onMounted, ref, useSlots } from 'vue'

const props = withDefaults(
	defineProps<{
		question?: string
		icon?: string
		defaultOpen?: boolean
	}>(),
	{
		question: 'Pertanyaan FAQ',
		icon: undefined,
		defaultOpen: false,
	},
)

const slots = useSlots()
const instance = getCurrentInstance()
const autoId = `faq-${instance?.uid || Math.random().toString(36).slice(2)}`

const faqActiveId = inject<Ref<string | null> | null>('faqActiveId', null)
const faqSetSingleActive = inject<((id: string | null) => void) | null>('faqSetSingleActive', null)
const registerFaqItem = inject<((id: string, q: string, a: string) => number) | null>('faqRegisterItem', null)

const itemNumber = ref(1)
const isLocalOpen = ref(Boolean(props.defaultOpen))

const isOpen = computed(() => {
	if (faqActiveId && faqActiveId.value !== undefined && faqSetSingleActive) {
		return faqActiveId.value === autoId
	}
	return isLocalOpen.value
})

function handleToggle() {
	if (faqSetSingleActive) {
		faqSetSingleActive(isOpen.value ? null : autoId)
	}
	else {
		isLocalOpen.value = !isLocalOpen.value
	}
}

function extractSlotText(): string {
	const defaultSlot = slots.default?.()
	if (!defaultSlot)
		return ''

	function getText(nodes: any): string {
		if (!nodes)
			return ''
		if (typeof nodes === 'string')
			return nodes
		if (Array.isArray(nodes))
			return nodes.map(getText).join(' ')
		if (typeof nodes.children === 'string')
			return nodes.children
		if (Array.isArray(nodes.children))
			return nodes.children.map(getText).join(' ')
		return ''
	}

	return getText(defaultSlot).trim()
}

onMounted(() => {
	if (registerFaqItem) {
		itemNumber.value = registerFaqItem(
			autoId,
			props.question || 'Pertanyaan FAQ',
			extractSlotText(),
		)
	}
})
</script>

<template>
	<div
		class="shadow-2xs overflow-hidden border border-[#115e4f]/20 rounded-2xl bg-white/90 transition-all duration-300 dark:border-[#134e43]/50 dark:bg-[#001412]/80"
		:class="[
			isOpen ? 'ring-1 ring-brand-500/40 dark:ring-brand-400/30 shadow-xs' : 'hover:border-brand-500/35 dark:hover:border-brand-400/30',
		]"
	>
		<!-- Accordion Question Button -->
		<button
			type="button"
			class="w-full flex cursor-pointer items-center justify-between gap-4 px-4.5 py-3.5 text-left transition-colors hover:bg-brand-50/40 sm:px-5 sm:py-4 dark:hover:bg-white/5"
			:aria-expanded="isOpen"
			@click="handleToggle"
		>
			<div class="flex items-center gap-3">
				<!-- Custom Icon or Auto Number Badge -->
				<span
					v-if="props.icon"
					:class="props.icon"
					class="shrink-0 text-base text-brand-600 dark:text-brand-400"
				/>
				<span
					v-else
					class="h-6 w-6 flex shrink-0 items-center justify-center border border-brand-500/30 rounded-full bg-brand-500/10 text-xs text-brand-700 font-bold font-mono dark:border-brand-500/25 dark:bg-brand-500/15 dark:text-brand-300"
				>
					{{ itemNumber }}
				</span>
				<span class="text-sm text-slate-800 font-semibold font-sans sm:text-base dark:text-slate-100">
					{{ props.question }}
				</span>
			</div>

			<span
				class="i-hugeicons-arrow-down-01 shrink-0 text-base text-slate-400 transition-transform duration-300 dark:text-slate-500"
				:class="{ 'rotate-180 text-brand-500 dark:text-brand-400': isOpen }"
			/>
		</button>

		<!-- Accordion Answer Body -->
		<div
			v-show="isOpen"
			class="border-t border-[#115e4f]/15 px-4.5 pb-4.5 pt-3 text-sm text-slate-600 leading-relaxed font-sans dark:border-[#134e43]/40 sm:px-5 dark:text-slate-300"
		>
			<slot />
		</div>
	</div>
</template>
