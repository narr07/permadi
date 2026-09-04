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
		class="conclusion-card shadow-xs bento-card-clean relative my-8 overflow-hidden border border-slate-200 rounded-2xl bg-white p-6 transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 sm:p-7"
		:class="props.class"
	>
		<div class="dark:border-slate-850 mb-4.5 flex items-center gap-3.5 border-b border-slate-100 pb-4">
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
				class="text-xl text-slate-900 font-extrabold leading-none tracking-tight font-heading !my-0 !border-0 !p-0 sm:text-2xl dark:text-slate-100"
			>
				{{ resolvedTitle }}
			</h2>
		</div>

		<div
			class="conclusion-body text-sm text-slate-700 leading-relaxed font-sans [&_ol]:(my-3 flex flex-col list-decimal gap-2 pl-5) [&_ul]:(my-3 flex flex-col list-disc gap-2 pl-5) [&_p]:(mb-3 mt-2 leading-relaxed first:mt-0 last:mb-0) [&_ul>li::marker]:(text-[1.1em] text-brand-500) sm:text-base [&_ol>li::marker]:(text-brand-500 font-bold) dark:text-slate-300 [&_strong]:(text-inherit font-bold) [&_ol>li]:leading-relaxed [&_ul>li]:leading-relaxed"
		>
			<slot />
		</div>
	</aside>
</template>
