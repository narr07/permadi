<script setup lang="ts">
import { computed, provide, ref } from 'vue'

const props = withDefaults(
	defineProps<{
		title?: string
		description?: string
		single?: boolean
	}>(),
	{
		title: undefined,
		description: '',
		single: false,
	},
)

const { locale } = useI18n()

const resolvedTitle = computed(() => {
	if (props.title)
		return props.title
	return locale.value === 'id' ? 'FAQ' : 'FAQ'
})

const activeId = ref<string | null>(null)
const registeredFaqs = ref<Array<{ id: string, q: string, a: string }>>([])

function setSingleActive(id: string | null) {
	activeId.value = activeId.value === id ? null : id
}

function registerFaqItem(id: string, q: string, a: string) {
	const existing = registeredFaqs.value.find(item => item.id === id)
	if (existing) {
		existing.q = q
		existing.a = a
	}
	else {
		registeredFaqs.value.push({ id, q, a })
	}
	return registeredFaqs.value.findIndex(item => item.id === id) + 1
}

if (props.single) {
	provide('faqActiveId', activeId)
	provide('faqSetSingleActive', setSingleActive)
}
else {
	provide('faqActiveId', null)
	provide('faqSetSingleActive', null)
}
provide('faqRegisterItem', registerFaqItem)
</script>

<template>
	<section
		id="faq"
		class="my-10 scroll-mt-24 overflow-hidden border border-[#115e4f]/25 rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-[#134e43]/60 dark:bg-[#001c19]/70 sm:p-7"
	>
		<!-- FAQ Section Header (Question Mark Icon) -->
		<div class="mb-6 flex items-start justify-between gap-4 border-b border-[#115e4f]/15 pb-5 dark:border-[#134e43]/40">
			<div class="flex items-center gap-3.5">
				<div class="h-10 w-10 flex shrink-0 items-center justify-center border border-brand-500/30 rounded-2xl bg-brand-500/10 text-brand-600 dark:border-brand-500/25 dark:bg-brand-500/15 dark:text-brand-400">
					<span class="i-hugeicons-help-circle text-xl" />
				</div>
				<div>
					<h2 class="text-xl text-slate-900 font-bold tracking-tight font-heading !my-0 sm:text-2xl dark:text-slate-100">
						{{ resolvedTitle }}
					</h2>
					<p
						v-if="props.description"
						class="mt-1 text-xs text-slate-500 font-sans sm:text-sm dark:text-slate-400"
					>
						{{ props.description }}
					</p>
				</div>
			</div>

			<span class="border border-brand-500/20 rounded-full bg-brand-500/10 px-2.5 py-1 text-[11px] text-brand-700 font-semibold tracking-wider font-mono dark:text-brand-300">
				FAQ
			</span>
		</div>

		<!-- Container Slot for FaqItem components -->
		<div class="flex flex-col gap-3">
			<slot />
		</div>
	</section>
</template>
