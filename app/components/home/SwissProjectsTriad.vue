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

	const props = defineProps<{
		projects?: ProjectItem[]
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
				title: p.title || 'Studi Kasus Desain',
				description: p.description || 'Eksplorasi sistem web dan tata letak modular.',
				tags: p.tags || ['Web System'],
				link: p._path || '/projek',
				year: p.year ? String(p.year) : '2026',
			}))
		}
		return defaultShowcase
	})
</script>

<template>
	<section class="w-full border-b border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#001e1c]">
		<!-- Header Strip -->
		<div class="px-6 py-4 sm:px-8 sm:py-5 border-b border-slate-200/80 dark:border-[#134e43] flex items-center justify-between font-mono text-[11px] font-bold tracking-[0.2em] uppercase">
			<div class="flex items-center gap-2.5 text-brand-700 dark:text-accent">
				<span class="w-2 h-2 rounded-none bg-brand-500 inline-block" />
				<span>{{ label || '02 // STUDI KASUS & REKAYASA SISTEM' }}</span>
			</div>
			<span class="text-slate-900/40 tabular-nums dark:text-slate-50/40">
				ARSIP PILIHAN (03 KARYA)
			</span>
		</div>

		<!-- 3-Column Specimen Exhibition Plate -->
		<div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200/80 dark:divide-[#134e43]">
			<article
				v-for="p in displayProjects"
				:key="p.index"
				class="flex flex-col justify-between p-6 sm:p-8 lg:p-10 transition-colors duration-150 group hover:(bg-slate-50/80 dark:bg-[#002420]/50)"
			>
				<div>
					<div class="mb-6 flex items-center justify-between font-mono text-xs">
						<span class="font-bold text-brand-600 dark:text-brand-400">
							{{ p.index }} // {{ p.year }}
						</span>
						<span class="i-ph-arrow-up-right text-base text-slate-900/40 transition-transform duration-200 group-hover:(translate-x-1 -translate-y-1 text-brand-500) dark:text-slate-50/40" />
					</div>

					<h3 class="font-heading font-700 text-xl sm:text-2xl text-slate-900 mb-4 leading-snug transition-colors group-hover:text-brand-700 dark:text-slate-50 dark:group-hover:text-brand-300">
						<NuxtLink :to="localePath(p.link)">
							{{ p.title }}
						</NuxtLink>
					</h3>

					<p class="font-sans text-xs sm:text-sm text-slate-900/70 leading-relaxed mb-8 dark:text-slate-50/70">
						{{ p.description }}
					</p>
				</div>

				<div class="pt-6 border-t border-slate-200/80 dark:border-[#134e43] flex flex-wrap gap-2">
					<span
						v-for="tag in p.tags"
						:key="tag"
						class="px-2 py-1 font-mono text-[10px] uppercase border border-slate-300 dark:border-[#134e43] text-slate-900/80 dark:text-slate-50/80"
					>
						{{ tag }}
					</span>
				</div>
			</article>
		</div>

		<!-- Footer Link Strip -->
		<div class="px-6 py-3.5 sm:px-8 border-t border-slate-200/80 dark:border-[#134e43] flex items-center justify-between bg-slate-50/50 dark:bg-[#002420]/30 font-mono text-xs">
			<span class="text-slate-900/40 uppercase hidden sm:inline dark:text-slate-50/40">
				KORELASI: PENDIDIKAN × REKAYASA KODE
			</span>
			<NuxtLink
				:to="localePath('/projek')"
				class="inline-flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider underline underline-offset-4 hover:text-brand-600 dark:text-slate-50 dark:hover:text-brand-400 ml-auto"
			>
				<span>{{ allLinkText || 'BUKA SELURUH ARSIP PROJEK (01–06)' }}</span>
				<span class="i-ph-arrow-right text-xs" />
			</NuxtLink>
		</div>
	</section>
</template>
