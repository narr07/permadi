<script setup lang="ts">
import { computed, provide, ref } from 'vue'

const props = withDefaults(
	defineProps<{
		title?: string
		description?: string
		single?: boolean
		class?: any
	}>(),
	{
		title: undefined,
		description: '',
		single: false,
		class: undefined,
	},
)

const activeId = ref<string | null>(null)

function toggleItem(id: string) {
	activeId.value = activeId.value === id ? null : id
}

provide('faqActiveId', activeId)
provide('faqToggle', toggleItem)
provide('faqSingle', computed(() => props.single))
</script>

<template>
	<div
		class="faq-container my-8 flex flex-col gap-4.5 [counter-reset:faq-counter]"
		:class="props.class"
	>
		<!-- Optional Embedded Header -->
		<div
			v-if="props.title"
			class="mb-3 flex items-center gap-3.5 border-b border-slate-200/80 pb-4 dark:border-slate-800"
		>
			<div class="size-10 flex shrink-0 items-center justify-center border border-brand-500/30 rounded-xl bg-brand-500/10 text-brand-600 dark:border-brand-500/20 dark:bg-brand-500/15 dark:text-brand-400">
				<span class="i-hugeicons-help-circle text-xl" />
			</div>
			<div>
				<h3 class="text-xl text-slate-900 font-extrabold tracking-tight font-heading !my-0 !border-0 sm:text-2xl dark:text-slate-100">
					{{ props.title }}
				</h3>
				<p
					v-if="props.description"
					class="mt-1 text-xs text-slate-500 font-sans sm:text-sm dark:text-slate-400"
				>
					{{ props.description }}
				</p>
			</div>
		</div>

		<!-- Slot for :::faq-item components -->
		<div class="flex flex-col gap-2 sm:gap-2.5">
			<slot />
		</div>
	</div>
</template>
