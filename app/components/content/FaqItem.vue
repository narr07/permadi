<script setup lang="ts">
import type { ComputedRef, Ref } from 'vue'
import { computed, inject, ref } from 'vue'

const props = withDefaults(
	defineProps<{
		question?: string
		icon?: string
		defaultOpen?: boolean
		class?: any
	}>(),
	{
		question: 'Pertanyaan FAQ',
		icon: undefined,
		defaultOpen: false,
		class: undefined,
	},
)

const id = `faq-${Math.random().toString(36).substring(2, 9)}`

const activeId = inject<Ref<string | null> | null>('faqActiveId', null)
const toggle = inject<((id: string) => void) | null>('faqToggle', null)
const isSingle = inject<ComputedRef<boolean> | null>('faqSingle', null)

const internalOpen = ref(props.defaultOpen)

if (props.defaultOpen && isSingle?.value && activeId && activeId.value === null) {
	activeId.value = id
}

const isOpen = computed(() => {
	if (isSingle?.value && activeId) {
		return activeId.value === id
	}
	return internalOpen.value
})

function handleToggle() {
	if (isSingle?.value && toggle) {
		toggle(id)
	}
	else {
		internalOpen.value = !internalOpen.value
	}
}
</script>

<template>
	<div
		class="bento-faq-item shadow-xs overflow-hidden border border-slate-200/90 rounded-2xl bg-white transition-all duration-200 dark:border-slate-800/90 dark:bg-slate-950"
		:class="[
			isOpen
				? 'border-brand-500/50 ring-1 ring-brand-500/25 dark:border-brand-400/40 dark:ring-brand-400/20 shadow-sm'
				: 'hover:border-slate-300 dark:hover:border-slate-700',
			props.class,
		]"
	>
		<!-- Accordion Question Button -->
		<button
			type="button"
			class="w-full flex cursor-pointer items-center justify-between gap-4 px-5 py-4.5 text-left transition-colors hover:bg-slate-50/80 sm:px-6 sm:py-5 dark:hover:bg-slate-900/60"
			:aria-expanded="isOpen"
			@click="handleToggle"
		>
			<div class="flex items-center gap-3.5 sm:gap-4">
				<!-- Custom Icon or Sequential Native CSS Counter Badge -->
				<span
					v-if="props.icon"
					:class="props.icon"
					class="shrink-0 text-lg text-brand-600 dark:text-brand-400"
				/>
				<div
					v-else
					class="[counter-increment:faq-counter] size-7 flex shrink-0 items-center justify-center border border-brand-500/30 rounded-full bg-brand-500/10 text-xs text-brand-700 font-bold font-mono dark:border-brand-500/20 dark:bg-brand-500/15 dark:text-brand-300 before:content-[counter(faq-counter)]"
				/>

				<span class="text-sm text-slate-900 font-bold font-sans sm:text-base dark:text-slate-100">
					{{ props.question }}
				</span>
			</div>

			<span
				class="i-hugeicons-arrow-down-01 shrink-0 text-base text-slate-400 transition-transform duration-200 dark:text-slate-500"
				:class="{ 'rotate-180 text-brand-600 dark:text-brand-400': isOpen }"
			/>
		</button>

		<!-- Accordion Answer Body -->
		<div
			v-show="isOpen"
			class="border-t border-slate-100 px-5 pb-5 pt-4 text-sm text-slate-700 leading-relaxed font-sans dark:border-slate-800/80 sm:px-6 sm:pb-6 sm:text-base dark:text-slate-300"
		>
			<slot />
		</div>
	</div>
</template>
