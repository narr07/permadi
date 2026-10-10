<script setup lang="ts">
interface ProjectItem {
	path?: string
	title?: string
	description?: string
	tags?: string[]
	date?: string
	year?: string | number
}

interface ProjectSectionData {
	label?: string
	all_link_text?: string
	all_link_to?: string
}

const props = defineProps<{
	projects?: ProjectItem[]
	projectSection?: ProjectSectionData
}>()

const { locale } = useI18n()
const listPath = computed(() => locale.value === 'id' ? '/id/projek' : '/projects')

const displayProjects = computed(() =>
	(props.projects || []).slice(0, 3).map(p => ({
		title: p.title,
		description: p.description,
		tags: p.tags || [],
		link: p.path || listPath.value,
		year: p.year ? String(p.year) : p.date ? String(new Date(p.date).getFullYear()) : '',
	})),
)
</script>

<template>
	<section
		v-if="displayProjects.length > 0"
		class="w-full border-b border-slate-200/80 bg-white dark:border-[#134e43] dark:bg-[#001e1c]"
	>
		<!-- Header Strip -->
		<h2 class="border-b border-slate-200/80 px-6 py-4 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:border-[#134e43] sm:px-8 sm:py-5 dark:text-accent">
			{{ projectSection?.label || (locale === 'id' ? 'Projek pilihan' : 'Selected projects') }}
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 divide-y divide-slate-200/80 md:divide-x md:divide-y-0 dark:divide-[#134e43]">
			<article
				v-for="p in displayProjects"
				:key="p.link"
				class="group flex flex-col justify-between p-6 transition-colors duration-150 hover:(bg-[#e2f4f0] dark:bg-[#003832]) lg:p-10 sm:p-8"
			>
				<div>
					<span
						v-if="p.year"
						class="mb-6 block text-xs text-brand-600 font-bold font-mono tabular-nums dark:text-brand-400"
					>
						{{ p.year }}
					</span>

					<h3 class="mb-4 text-xl text-slate-900 font-900 leading-snug font-heading transition-colors sm:text-2xl dark:text-slate-50 group-hover:text-brand-700 dark:group-hover:text-brand-300">
						<NuxtLink :to="p.link">
							{{ p.title }}
						</NuxtLink>
					</h3>

					<p
						v-if="p.description"
						class="mb-8 text-xs text-slate-700 leading-relaxed font-sans sm:text-sm dark:text-slate-300"
					>
						{{ p.description }}
					</p>
				</div>

				<div
					v-if="p.tags.length > 0"
					class="flex flex-wrap gap-2 border-t border-slate-200/80 pt-6 dark:border-[#134e43]"
				>
					<span
						v-for="tag in p.tags"
						:key="tag"
						class="border border-slate-300 px-2 py-1 text-[10px] text-slate-800 font-mono uppercase transition-colors duration-150 dark:border-[#134e43] group-hover:border-brand-500/60 dark:text-slate-200"
					>
						{{ tag }}
					</span>
				</div>
			</article>
		</div>

		<!-- Footer Link Strip -->
		<div class="flex justify-end border-t border-slate-200/80 bg-slate-50/50 px-6 py-3.5 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/30 sm:px-8">
			<NuxtLink
				:to="projectSection?.all_link_to || listPath"
				class="text-slate-900 font-bold tracking-wider uppercase underline underline-offset-4 dark:text-slate-50 hover:text-brand-600 dark:hover:text-brand-400"
			>
				{{ projectSection?.all_link_text || (locale === 'id' ? 'Semua projek' : 'All projects') }}
			</NuxtLink>
		</div>
	</section>
</template>
