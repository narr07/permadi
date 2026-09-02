<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		title?: string
		icon?: string
		class?: any
	}>(),
	{
		title: undefined,
		icon: 'i-hugeicons-bulb',
		class: undefined,
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
		class="bento-card-clean conclusion-card relative my-8 overflow-hidden border border-slate-200 rounded-2xl bg-white p-6 shadow-xs transition-all duration-300 sm:p-7 dark:border-slate-800 dark:bg-slate-950"
		:class="props.class"
	>
		<!-- Header with Symmetrical Icon + Title -->
		<div class="mb-4.5 flex items-center gap-3.5 border-b border-slate-100 pb-4 dark:border-slate-850">
			<div
				class="size-10 flex shrink-0 items-center justify-center border border-brand-500/30 rounded-xl bg-brand-500/10 text-brand-600 dark:border-brand-500/20 dark:bg-brand-500/15 dark:text-brand-400"
			>
				<span
					:class="props.icon"
					class="text-xl"
				/>
			</div>

			<h2
				:id="headingId"
				class="text-xl text-slate-900 font-extrabold tracking-tight font-heading !my-0 !border-0 !p-0 sm:text-2xl dark:text-slate-100"
			>
				{{ resolvedTitle }}
			</h2>
		</div>

		<!-- Body Content Slot -->
		<div
			class="conclusion-body text-sm text-slate-700 leading-relaxed font-sans sm:text-base dark:text-slate-300"
		>
			<slot />
		</div>
	</aside>
</template>

<style scoped>
.conclusion-body :deep(p) {
	margin-top: 0.5rem;
	margin-bottom: 0.75rem;
	line-height: 1.75;
}
.conclusion-body :deep(p:first-child) {
	margin-top: 0;
}
.conclusion-body :deep(p:last-child) {
	margin-bottom: 0;
}
.conclusion-body :deep(ul) {
	margin: 0.75rem 0;
	padding-left: 1.25rem;
	list-style-type: disc;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}
.conclusion-body :deep(ul > li) {
	line-height: 1.7;
	display: list-item;
}
.conclusion-body :deep(ul > li::marker) {
	color: #14b898;
	font-size: 1.1em;
}
.conclusion-body :deep(ol) {
	margin: 0.75rem 0;
	padding-left: 1.25rem;
	list-style-type: decimal;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}
.conclusion-body :deep(ol > li) {
	line-height: 1.7;
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
</style>
