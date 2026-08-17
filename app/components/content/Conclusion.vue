<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		title?: string
		icon?: string
	}>(),
	{
		title: undefined,
		icon: 'i-hugeicons-idea-01',
	},
)

const { locale } = useI18n()

const resolvedTitle = computed(() => {
	if (props.title)
		return props.title
	return locale.value === 'id' ? 'Kesimpulan' : 'Conclusion'
})

const headingId = computed(() => {
	if (props.title) {
		return props.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
	}
	return locale.value === 'id' ? 'kesimpulan' : 'conclusion'
})
</script>

<template>
	<aside
		:id="headingId"
		class="bg-linear-to-b relative my-10 scroll-mt-24 overflow-hidden border border-brand-500/25 rounded-3xl from-[#00382f]/30 to-[#001c19]/60 p-6 shadow-lg backdrop-blur-xl transition-all duration-300 dark:border-brand-400/20 dark:from-[#002b24]/60 dark:to-[#001412]/90 sm:p-8"
	>
		<!-- Background Ambient Glow -->
		<div
			class="pointer-events-none absolute h-44 w-44 rounded-full bg-brand-500/10 blur-3xl -right-12 -top-12 dark:bg-brand-400/10"
			aria-hidden="true"
		/>
		<div
			class="pointer-events-none absolute h-44 w-44 rounded-full bg-teal-500/10 blur-3xl -bottom-12 -left-12 dark:bg-teal-400/5"
			aria-hidden="true"
		/>

		<!-- Header with H2 for SEO & TOC (Lightbulb Icon) -->
		<div class="relative mb-5 flex items-center gap-3.5 border-b border-brand-500/15 pb-4 dark:border-brand-500/20">
			<div
				class="shadow-xs h-11 w-11 flex shrink-0 items-center justify-center border border-brand-500/35 rounded-2xl bg-brand-500/15 text-brand-600 dark:border-brand-400/30 dark:bg-brand-500/20 dark:text-brand-400"
			>
				<span
					:class="props.icon"
					class="text-2xl"
				/>
			</div>
			<h2
				:id="headingId"
				class="text-xl text-slate-900 font-bold tracking-tight font-heading !my-0 sm:text-2xl dark:text-slate-100"
			>
				{{ resolvedTitle }}
			</h2>
		</div>

		<!-- Body Content Slot (Strict Vertical Downwards List) -->
		<div
			class="conclusion-body relative text-sm text-slate-700 leading-relaxed font-sans sm:text-base dark:text-slate-200"
		>
			<slot />
		</div>
	</aside>
</template>

<style scoped>
.conclusion-body :deep(p) {
	margin-bottom: 1rem;
	line-height: 1.75;
}
.conclusion-body :deep(p:last-child) {
	margin-bottom: 0;
}
.conclusion-body :deep(ul) {
	margin: 1rem 0;
	padding-left: 1.5rem;
	list-style-type: disc;
	display: flex;
	flex-direction: column;
	gap: 0.875rem;
}
.conclusion-body :deep(ul > li) {
	line-height: 1.75;
	display: list-item;
}
.conclusion-body :deep(ul > li::marker) {
	color: #14b898;
	font-size: 1.1em;
}
.conclusion-body :deep(ol) {
	margin: 1rem 0;
	padding-left: 1.5rem;
	list-style-type: decimal;
	display: flex;
	flex-direction: column;
	gap: 0.875rem;
}
.conclusion-body :deep(ol > li) {
	line-height: 1.75;
	display: list-item;
}
.conclusion-body :deep(ol > li::marker) {
	color: #14b898;
	font-weight: 700;
}
.conclusion-body :deep(strong) {
	color: inherit;
	font-weight: 700;
}
.conclusion-body :deep(em) {
	font-style: italic;
}
</style>
