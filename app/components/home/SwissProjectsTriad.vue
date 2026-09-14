<script setup lang="ts">
interface ProjectItem {
	_path?: string
	idItem?: string
	title?: string
	description?: string
	tags?: string[]
	date?: string
	year?: string | number
	link?: string
}

interface ProjectSectionData {
	label?: string
	count_badge?: string
	correlation_badge?: string
	fallback_title?: string
	fallback_description?: string
	all_link_text?: string
	all_link_to?: string
}

const props = defineProps<{
	projects?: ProjectItem[]
	projectSection?: ProjectSectionData
	label?: string
	fallbackTitle?: string
	fallbackDescription?: string
	allLinkText?: string
}>()

const localePath = useLocalePath()

const defaultShowcase = [
	{
		index: '02.01',
		title: 'Permadi.dev — Ruang Kerja Digital',
		description: 'Arsitektur website personal berbasis Nuxt 4, UnoCSS, dan SQLite Cloudflare D1 dengan skor Core Web Vitals 100/100.',
		tags: ['Nuxt 4', 'UnoCSS', 'Cloudflare D1'],
		link: '/projek',
		year: '2026',
	},
	{
		index: '02.02',
		title: 'Media Ajar Interaktif Matematika SD',
		description: 'Platform visual pemahaman pecahan dan bilangan untuk siswa sekolah dasar, memadukan logika numerik dan animasi terarah.',
		tags: ['Flutter', 'Dart', 'Pedagogi'],
		link: '/projek',
		year: '2025',
	},
	{
		index: '02.03',
		title: 'Sistem Desain Identitas & Poster Modular',
		description: 'Eksplorasi grafis geometris, kisi modular poster, dan ketertiban tipografi menggunakan Adobe Creative Cloud.',
		tags: ['Illustrator', 'Figma', 'Swiss Grid'],
		link: '/projek',
		year: '2024',
	},
]

const displayProjects = computed(() => {
	if (props.projects && props.projects.length > 0) {
		return props.projects.slice(0, 3).map((p, idx) => ({
			index: `02.0${idx + 1}`,
			title: p.title || props.projectSection?.fallback_title || props.fallbackTitle || 'Studi Kasus Desain',
			description: p.description || props.projectSection?.fallback_description || props.fallbackDescription || 'Eksplorasi sistem web dan tata letak modular.',
			tags: p.tags || ['Web System'],
			link: p._path || '/projek',
			year: p.year ? String(p.year) : '2026',
		}))
	}
	return defaultShowcase
})
</script>

<template>
	<section class="w-full border-b border-slate-200/80 bg-white dark:border-[#134e43] dark:bg-[#001e1c]">
		<!-- Header Strip -->
		<div class="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 text-[11px] font-bold tracking-[0.2em] font-mono uppercase dark:border-[#134e43] sm:px-8 sm:py-5">
			<div class="flex items-center gap-2.5 text-brand-700 dark:text-accent">
				<span class="inline-block h-2 w-2 rounded-none bg-brand-500" />
				<span>{{ projectSection?.label || label || '02 // STUDI KASUS & REKAYASA SISTEM' }}</span>
			</div>
			<span class="text-slate-900/40 tabular-nums dark:text-slate-50/40">
				{{ projectSection?.count_badge || 'ARSIP PILIHAN (03 KARYA)' }}
			</span>
		</div>

		<!-- 3-Column Specimen Exhibition Plate -->
		<div class="grid grid-cols-1 md:grid-cols-3 divide-y divide-slate-200/80 md:divide-x md:divide-y-0 dark:divide-[#134e43]">
			<article
				v-for="p in displayProjects"
				:key="p.index"
				class="group flex flex-col justify-between p-6 transition-all duration-150 active:scale-[0.99] hover:(bg-slate-50/90 -translate-y-0.5 dark:bg-[#002420]/60) lg:p-10 sm:p-8"
			>
				<div>
					<div class="mb-6 flex items-center justify-between text-xs font-mono">
						<span class="text-brand-600 font-bold dark:text-brand-400">
							{{ p.index }} // {{ p.year }}
						</span>
						<span class="i-swisspost-arrowupright text-base text-slate-900/40 transition-transform duration-200 group-hover:(translate-x-1 text-brand-500 -translate-y-1) dark:text-slate-50/40" />
					</div>

					<h3 class="mb-4 text-xl text-slate-900 font-900 leading-snug font-heading transition-colors sm:text-2xl dark:text-slate-50 group-hover:text-brand-700 dark:group-hover:text-brand-300">
						<NuxtLink :to="localePath(p.link)">
							{{ p.title }}
						</NuxtLink>
					</h3>

					<p class="mb-8 text-xs text-slate-900/70 leading-relaxed font-sans sm:text-sm dark:text-slate-50/70">
						{{ p.description }}
					</p>
				</div>

				<div class="flex flex-wrap gap-2 border-t border-slate-200/80 pt-6 dark:border-[#134e43]">
					<span
						v-for="tag in p.tags"
						:key="tag"
						class="border border-slate-300 px-2 py-1 text-[10px] text-slate-900/80 font-mono uppercase transition-colors duration-150 dark:border-[#134e43] group-hover:border-brand-500/60 dark:text-slate-50/80"
					>
						{{ tag }}
					</span>
				</div>
			</article>
		</div>

		<!-- Footer Link Strip -->
		<div class="flex items-center justify-between border-t border-slate-200/80 bg-slate-50/50 px-6 py-3.5 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/30 sm:px-8">
			<span class="hidden text-slate-900/40 uppercase sm:inline dark:text-slate-50/40">
				{{ projectSection?.correlation_badge || 'KORELASI: PENDIDIKAN × REKAYASA KODE' }}
			</span>
			<NuxtLink
				:to="localePath(projectSection?.all_link_to || '/projek')"
				class="group ml-auto inline-flex items-center gap-2 text-slate-900 font-bold tracking-wider uppercase underline underline-offset-4 dark:text-slate-50 hover:text-brand-600 dark:hover:text-brand-400"
			>
				<span>{{ projectSection?.all_link_text || allLinkText || 'BUKA SELURUH ARSIP PROJEK (01–06)' }}</span>
				<span class="i-swisspost-arrowright text-xs transition-transform duration-150 group-hover:translate-x-1" />
			</NuxtLink>
		</div>
	</section>
</template>
