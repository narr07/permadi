<script setup lang="ts">
import { computed, provide, ref } from 'vue'

const props = withDefaults(
	defineProps<{
		title?: string
		description?: string
		icon?: string
		single?: boolean
		hideHeader?: boolean
		class?: any
	}>(),
	{
		title: undefined,
		description: '',
		icon: 'i-hugeicons-help-circle',
		single: true,
		hideHeader: false,
		class: undefined,
	},
)

const { locale } = useI18n()

const resolvedTitle = computed(() => {
	if (props.title)
		return props.title
	return locale.value === 'id' ? 'Pertanyaan yang Sering Diajukan (FAQ)' : 'Frequently Asked Questions (FAQ)'
})

const headingId = computed(() => 'faq')

const activeId = ref<string | null>(null)
const registeredIds = ref<string[]>([])

function registerItem(id: string): number {
	if (!registeredIds.value.includes(id)) {
		registeredIds.value.push(id)
	}
	return registeredIds.value.indexOf(id) + 1
}

function toggleItem(id: string) {
	if (props.single) {
		activeId.value = activeId.value === id ? null : id
	}
	else {
		// Toggle via individual state handled in item if single is false
	}
}

provide('faqRegister', registerItem)
provide('faqActiveId', activeId)
provide('faqToggle', toggleItem)
provide('faqSingle', computed(() => props.single))
</script>

<template>
	<section
		class="faq-container my-8 flex flex-col scroll-mt-24 gap-4"
		:class="props.class"
	>
		<!-- Embedded FAQ Section Header (Identical alignment to Conclusion) -->
		<div
			v-if="!props.hideHeader"
			class="mb-4.5 flex items-center gap-3.5 border-b border-slate-200/80 pb-4 dark:border-slate-800"
		>
			<div class="size-10 flex shrink-0 items-center justify-center border border-brand-500/30 rounded-xl bg-brand-500/10 text-brand-600 dark:border-brand-500/20 dark:bg-brand-500/15 dark:text-brand-400">
				<span
					:class="props.icon"
					class="text-xl"
				/>
			</div>

			<div
				v-if="props.description"
				class="flex flex-col justify-center"
			>
				<h2
					:id="headingId"
					class="text-xl text-slate-900 font-extrabold tracking-tight font-heading !my-0 !border-0 !p-0 sm:text-2xl dark:text-slate-100"
				>
					{{ resolvedTitle }}
				</h2>
				<p class="mt-1 text-xs text-slate-500 font-sans sm:text-sm dark:text-slate-400">
					{{ props.description }}
				</p>
			</div>

			<h2
				v-else
				:id="headingId"
				class="text-xl text-slate-900 font-extrabold tracking-tight font-heading !my-0 !border-0 !p-0 sm:text-2xl dark:text-slate-100"
			>
				{{ resolvedTitle }}
			</h2>
		</div>

		<!-- Slot for :::faq-item or nested FAQ blocks -->
		<div class="flex flex-col gap-3.5 sm:gap-4">
			<slot />
		</div>
	</section>
</template>
