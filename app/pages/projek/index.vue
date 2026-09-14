<script setup lang="ts">
const { locale } = useI18n()
const { getCategoryLabel } = useCategoryLabel()
const { formatDate } = useFormatDate()

const collection = computed(() => (locale.value === 'id' ? 'projek_id' : 'projek_en'))
const currentPath = computed(() => (locale.value === 'id' ? '/id/projek' : '/projects'))

// Page metadata
const { data: page } = await useAsyncData(
	() => `projek-page-${locale.value}`,
	() => queryCollection(locale.value === 'id' ? 'pages_id' : 'pages_en').path(currentPath.value).select('title', 'description', 'eyebrow').first(),
	{ watch: [locale] },
)

// All projects collection (SSR)
const { data: projects } = await useAsyncData(
	() => `projek-list-${locale.value}`,
	() => queryCollection(collection.value)
		.order('date', 'DESC')
		.all(),
	{ watch: [locale] },
)

// Active filter tag
const selectedTag = ref('ALL')

// Extract top unique tags/categories
const filterTabs = computed(() => {
	if (!projects.value)
		return ['ALL']
	const tagsSet = new Set<string>()
	projects.value.forEach((item: any) => {
		if (item.category) {
			tagsSet.add(String(item.category).trim().toUpperCase())
		}
		const tags = item.tags || item.tech || []
		tags.forEach((t: string) => {
			const upper = String(t).trim().toUpperCase()
			if (['NUXT', 'VUE', 'FLUTTER', 'WEB', 'TOOLS', 'UI'].includes(upper)) {
				tagsSet.add(upper)
			}
		})
	})
	return ['ALL', ...Array.from(tagsSet)]
})

const route = useRoute()
const router = useRouter()

// Pagination: 7 projects per page (1 lead + 6 grid)
const projectsPerPage = 7

const currentPage = computed(() => {
	const p = Number(route.query.page)
	return p > 0 && !isNaN(p) ? Math.floor(p) : 1
})

watch(currentPage, () => {
	if (import.meta.client) {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
	}
})

function selectTag(tag: string) {
	selectedTag.value = tag
	if (route.query.page) {
		const q = { ...route.query }
		delete q.page
		router.push({ path: currentPath.value, query: q })
	}
}

// Filtered project list
const filteredProjects = computed(() => {
	if (!projects.value)
		return []
	return projects.value
		.filter((item: any) => {
			if (selectedTag.value === 'ALL')
				return true
			const target = selectedTag.value.toUpperCase()
			const cat = String(item.category || '').toUpperCase()
			const tags = (item.tags || item.tech || []).map((t: string) => String(t).toUpperCase())
			return cat === target || tags.includes(target)
		})
		.map((item: any, idx: number) => {
			const projectSlug = item.slug || (item.path ? item.path.split('/').pop().replace(/^\d+\./, '') : '')
			const basePath = locale.value === 'id' ? `/id/projek/${projectSlug}` : `/projects/${projectSlug}`
			return {
				...item,
				url: basePath,
				indexNum: String(idx + 1).padStart(2, '0'),
			}
		})
})

const totalPages = computed(() => {
	return Math.ceil(filteredProjects.value.length / projectsPerPage) || 1
})

const paginatedProjects = computed(() => {
	const start = (currentPage.value - 1) * projectsPerPage
	return filteredProjects.value.slice(start, start + projectsPerPage)
})

const leadProject = computed(() => {
	if (currentPage.value === 1 && selectedTag.value === 'ALL' && paginatedProjects.value.length > 0) {
		return paginatedProjects.value[0]
	}
	return null
})

const gridProjects = computed(() => {
	if (leadProject.value) {
		return paginatedProjects.value.slice(1)
	}
	return paginatedProjects.value
})

function getPaginationUrl(pageNumber: number) {
	const query: Record<string, any> = { ...route.query }
	if (pageNumber <= 1) {
		delete query.page
	}
	else {
		query.page = pageNumber
	}
	return {
		path: currentPath.value,
		query,
	}
}

useSeoMeta({
	title: computed(() => page.value?.title || (locale.value === 'id' ? 'Projek & Studi Kasus' : 'Projects & Case Studies')),
	description: computed(() => page.value?.description || (locale.value === 'id' ? 'Portofolio projek rekayasa web dan desain grafis.' : 'Web engineering and graphic design project portfolio.')),
})

defineOgImage('Bento', {
	title: page.value?.title || 'Projek & Studi Kasus',
	description: page.value?.description || 'Arsip studi kasus karya Dinar Permadi Yusup.',
})
</script>

<template>
	<div class="w-full bg-white dark:bg-[#001e1c]">
		<!-- Band 01: Swiss Masthead & Parameters Spec Rail -->
		<header class="w-full border-b border-slate-200/80 dark:border-[#134e43]">
			<div class="grid grid-cols-1 lg:grid-cols-12">
				<!-- Meta Rail (4 Columns) -->
				<div class="lg:col-span-4 p-6 sm:p-8 lg:p-10 lg:border-r border-b lg:border-b-0 border-slate-200/80 dark:border-[#134e43] bg-slate-50/50 dark:bg-[#002420]/40 flex flex-col justify-between">
					<div>
						<div class="mb-4 flex items-center justify-between font-mono text-[11px] font-bold tracking-[0.2em] uppercase">
							<div class="flex items-center gap-2 text-brand-700 dark:text-accent">
								<span class="w-2 h-2 rounded-none bg-brand-500 inline-block" />
								<span>01 // KATALOG KARYA</span>
							</div>
							<span class="text-slate-900/40 tabular-nums dark:text-slate-50/40">
								VOL. 26
							</span>
						</div>

						<span class="block font-mono text-[11px] uppercase tracking-[0.15em] text-slate-900/50 dark:text-slate-50/50 mb-1.5">
							KLASIFIKASI ARSIP
						</span>
						<h2 class="font-heading font-700 text-2xl sm:text-3xl text-slate-900 dark:text-slate-50 leading-tight">
							{{ page?.eyebrow || (locale === 'id' ? 'Karya & Rekayasa' : 'Work & Systems') }}
						</h2>
					</div>

					<!-- Spec Parameters Table -->
					<div class="mt-8 pt-6 border-t border-slate-200/80 dark:border-[#134e43]">
						<div class="divide-y divide-slate-200/80 dark:divide-[#134e43] font-mono text-xs">
							<div class="flex items-baseline justify-between py-2">
								<span class="text-slate-900/60 dark:text-slate-50/60">TOTAL SPESIMEN</span>
								<span class="font-bold text-slate-900 dark:text-slate-50 tabular-nums">{{ projects?.length || 0 }} Proyek</span>
							</div>

							<div class="flex items-baseline justify-between py-2">
								<span class="text-slate-900/60 dark:text-slate-50/60">FILTER AKTIF</span>
								<span class="font-bold text-brand-600 dark:text-brand-400 uppercase">{{ selectedTag === 'ALL' ? (locale === 'id' ? 'SEMUA' : 'ALL') : selectedTag }}</span>
							</div>


							<div class="flex items-baseline justify-between py-2">
								<span class="text-slate-900/60 dark:text-slate-50/60">STATUS</span>
								<span class="text-brand-600 dark:text-brand-400 font-semibold">TERDOKUMENTASI</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Typographic Statement Field (8 Columns) -->
				<div class="lg:col-span-8 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
					<div>
						<div class="mb-4 font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-brand-700 dark:text-accent">
							ARSIP TERKURASI // 2024–2026
						</div>

						<h1 class="font-heading font-700 text-3xl sm:text-5xl lg:text-6xl tracking-[-0.035em] text-slate-900 dark:text-slate-50 leading-[0.95] text-balance mb-6">
							{{ page?.title || (locale === 'id' ? 'Portofolio Projek & Studi Kasus' : 'Projects & Case Studies') }}
						</h1>

						<p class="font-sans text-base sm:text-lg text-slate-900/80 dark:text-slate-50/80 leading-relaxed max-w-[56ch]">
							{{ page?.description || (locale === 'id' ? 'Dokumentasi rekayasa aplikasi web modern, sistem komponen UI, aplikasi mobile Flutter, dan eksplorasi identitas visual berbasis kisi rasional.' : 'Curated documentation of web applications, UI component systems, mobile apps, and graphic identity design.') }}
						</p>
					</div>

					<div class="mt-8 pt-6 border-t border-slate-200/80 dark:border-[#134e43] font-mono text-xs text-slate-900/50 dark:text-slate-50/50 flex items-center justify-between">
						<span>DIREKTORI REKAYASA DIGITAL</span>
					</div>
				</div>
			</div>
		</header>

		<!-- Band 02: Architectural Filter Strip -->
		<nav
			aria-label="Filter kategori proyek"
			class="w-full border-b border-slate-200/80 dark:border-[#134e43] bg-slate-50/60 dark:bg-[#002420]/40 px-6 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs"
		>
			<div class="flex flex-wrap items-center gap-2">
				<span class="text-slate-900/50 dark:text-slate-50/50 uppercase mr-1 text-[11px]">FILTER:</span>
				<button
					v-for="tag in filterTabs"
					:key="tag"
					type="button"
					class="px-3.5 py-1.5 border uppercase font-bold tracking-wider transition-colors cursor-pointer"
					:class="selectedTag === tag
						? 'swiss-filter-active'
						: 'bg-white dark:bg-[#001e1c] text-slate-900/75 dark:text-slate-50/75 border-slate-300 dark:border-[#134e43] hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400'"
					@click="selectTag(tag)"
				>
					<span>{{ tag === 'ALL' ? (locale === 'id' ? 'SEMUA' : 'ALL') : tag }}</span>
				</button>
			</div>

			<span class="text-slate-900/40 dark:text-slate-50/40 tabular-nums uppercase text-[11px]">
				MENAMPILKAN {{ filteredProjects.length }} DARI {{ projects?.length || 0 }} KARYA
			</span>
		</nav>

		<!-- Band 03: Lead Featured Project (When On First Page & All Topics) -->
		<article
			v-if="leadProject"
			class="w-full border-b border-slate-200/80 dark:border-[#134e43]"
		>
			<div class="grid grid-cols-1 lg:grid-cols-12">
				<!-- Lead Info (Cols 1 to 5) -->
				<div class="lg:col-span-5 p-6 sm:p-8 lg:p-10 lg:border-r border-b lg:border-b-0 border-slate-200/80 dark:border-[#134e43] flex flex-col justify-between">
					<div>
						<div class="mb-4 flex items-center justify-between font-mono text-[11px] font-bold tracking-widest uppercase">
							<span class="text-brand-700 dark:text-accent">
								SPESIMEN 01 // UNGGULAN
							</span>
							<span class="text-slate-900/40 dark:text-slate-50/40 tabular-nums">
								{{ formatDate(leadProject.date) }}
							</span>
						</div>

						<h2 class="font-heading font-700 text-2xl sm:text-4xl text-slate-900 dark:text-slate-50 leading-tight mb-4">
							<NuxtLink :to="leadProject.url" class="hover:text-brand-600 transition-colors">
								{{ leadProject.title }}
							</NuxtLink>
						</h2>

						<p class="font-sans text-xs sm:text-sm text-slate-900/75 dark:text-slate-50/75 leading-relaxed mb-6">
							{{ leadProject.description }}
						</p>

						<!-- Tech Tags -->
						<div class="flex flex-wrap gap-1.5 mb-6">
							<span
								v-for="tech in (leadProject.tags || leadProject.tech || []).slice(0, 5)"
								:key="tech"
								class="px-2 py-1 font-mono text-[10px] uppercase border border-slate-300 dark:border-[#134e43] text-slate-900/75 dark:text-slate-50/75"
							>
								{{ tech }}
							</span>
						</div>
					</div>

					<div class="pt-6 border-t border-slate-200/80 dark:border-[#134e43] flex flex-wrap items-center justify-between gap-3">
						<NuxtLink
							:to="leadProject.url"
							class="px-5 py-2.5 bg-brand-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider hover:bg-brand-400 transition-colors flex items-center gap-2"
						>
							<span>BUKA STUDI KASUS</span>
							<span class="i-ph-arrow-up-right text-sm" />
						</NuxtLink>

						<div
							v-if="leadProject.demoUrl || leadProject.link || leadProject.githubUrl || leadProject.repo"
							class="flex items-center gap-3 font-mono text-xs"
						>
							<a
								v-if="leadProject.githubUrl || leadProject.repo"
								:href="leadProject.githubUrl || leadProject.repo"
								target="_blank"
								rel="noopener noreferrer"
								class="text-slate-900/70 hover:text-brand-600 dark:text-slate-50/70 dark:hover:text-brand-400 underline underline-offset-4"
							>
								GITHUB ↗
							</a>
							<a
								v-if="leadProject.demoUrl || leadProject.link"
								:href="leadProject.demoUrl || leadProject.link"
								target="_blank"
								rel="noopener noreferrer"
								class="text-slate-900/70 hover:text-brand-600 dark:text-slate-50/70 dark:hover:text-brand-400 underline underline-offset-4"
							>
								DEMO ↗
							</a>
						</div>
					</div>
				</div>

				<!-- Lead Media Frame (Cols 6 to 12) -->
				<div class="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-slate-50/40 dark:bg-[#002420]/20">
					<div
						v-if="leadProject.image || (leadProject.images && leadProject.images[0])"
						class="w-full aspect-video border border-slate-200/80 dark:border-[#134e43] overflow-hidden"
					>
						<NuxtImg
							:src="leadProject.image || leadProject.images[0]"
							:alt="leadProject.title"
							format="webp"
							quality="85"
							class="w-full h-full object-cover"
							loading="eager"
						/>
					</div>

					<div class="mt-4 flex items-center justify-between font-mono text-[10px] text-slate-900/50 dark:text-slate-50/50 uppercase tracking-widest">
						<span>FIG. 01.01 // PRATINJAU VISUAL ANTARMUKA</span>
						<span>RASIO: 16:9</span>
					</div>
				</div>
			</div>
		</article>

		<!-- Band 04: Continuous Specimen Grid for All Other Projects -->
		<div
			v-if="gridProjects.length > 0"
			class="w-full border-b border-slate-200/80 dark:border-[#134e43]"
		>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 divide-slate-200/80 dark:divide-[#134e43]">
				<article
					v-for="(item, idx) in gridProjects"
					:key="item.url"
					class="flex flex-col justify-between p-6 sm:p-8 transition-colors duration-150 group hover:(bg-slate-50/80 dark:bg-[#002420]/40)"
					:class="[
						idx % 3 !== 2 ? 'lg:border-r border-slate-200/80 dark:border-[#134e43]' : '',
						idx % 2 !== 1 ? 'md:border-r lg:border-r-0 border-slate-200/80 dark:border-[#134e43]' : '',
						idx >= 3 ? 'lg:border-t border-slate-200/80 dark:border-[#134e43]' : '',
						idx >= 2 ? 'md:border-t lg:border-t-0 border-slate-200/80 dark:border-[#134e43]' : '',
					]"
				>
					<div>
						<!-- Thumbnail -->
						<div
							v-if="item.image || (item.images && item.images[0])"
							class="w-full aspect-video border border-slate-200/80 dark:border-[#134e43] mb-6 overflow-hidden"
						>
							<NuxtImg
								:src="item.image || item.images[0]"
								:alt="item.title"
								format="webp"
								quality="80"
								class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
								loading="lazy"
							/>
						</div>

						<!-- Item Meta -->
						<div class="mb-3 flex items-center justify-between font-mono text-[11px]">
							<span class="font-bold text-brand-600 dark:text-brand-400">
								SPESIMEN {{ item.indexNum }} // [{{ item.category?.toUpperCase() || 'WEB' }}]
							</span>
							<span class="text-slate-900/40 dark:text-slate-50/40 tabular-nums">
								{{ formatDate(item.date) }}
							</span>
						</div>

						<h3 class="font-heading font-700 text-xl text-slate-900 dark:text-slate-50 leading-snug mb-3 transition-colors group-hover:text-brand-700 dark:group-hover:text-brand-300">
							<NuxtLink :to="item.url">
								{{ item.title }}
							</NuxtLink>
						</h3>

						<p class="font-sans text-xs sm:text-sm text-slate-900/70 dark:text-slate-50/70 leading-relaxed mb-6">
							{{ item.description }}
						</p>
					</div>

					<div class="pt-4 border-t border-slate-200/80 dark:border-[#134e43] flex items-center justify-between">
						<NuxtLink
							:to="item.url"
							class="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 dark:text-slate-50 group-hover:text-brand-600 dark:group-hover:text-brand-400 uppercase tracking-wider"
						>
							<span>STUDI KASUS</span>
							<span class="i-ph-arrow-up-right text-sm transition-transform group-hover:(translate-x-0.5 -translate-y-0.5)" />
						</NuxtLink>

						<div
							v-if="item.demoUrl || item.link || item.githubUrl || item.repo"
							class="flex items-center gap-2 text-slate-900/50 dark:text-slate-50/50"
						>
							<a
								v-if="item.githubUrl || item.repo"
								:href="item.githubUrl || item.repo"
								target="_blank"
								rel="noopener noreferrer"
								class="hover:text-brand-600 dark:hover:text-brand-400"
								aria-label="GitHub Repository"
							>
								<span class="i-ph-github-logo text-sm" />
							</a>
							<a
								v-if="item.demoUrl || item.link"
								:href="item.demoUrl || item.link"
								target="_blank"
								rel="noopener noreferrer"
								class="hover:text-brand-600 dark:hover:text-brand-400"
								aria-label="Demo"
							>
								<span class="i-ph-arrow-square-out text-sm" />
							</a>
						</div>
					</div>
				</article>
			</div>
		</div>

		<!-- Empty State -->
		<div
			v-else-if="!leadProject"
			class="p-12 text-center border-b border-slate-200/80 dark:border-[#134e43]"
		>
			<span class="font-mono text-sm text-slate-900/50 dark:text-slate-50/50 uppercase tracking-widest block mb-2">
				TIDAK ADA SPESIMEN DITEMUKAN
			</span>
			<p class="font-sans text-xs text-slate-900/70 dark:text-slate-50/70 mb-4">
				Tidak ada projek yang sesuai dengan filter #{{ selectedTag }}.
			</p>
			<button
				type="button"
				class="px-4 py-2 border border-slate-900 dark:border-slate-50 font-mono text-xs font-bold uppercase tracking-wider"
				@click="selectTag('ALL')"
			>
				RESET FILTER
			</button>
		</div>

		<!-- Band 05: Pagination Strip -->
		<nav
			v-if="totalPages > 1"
			:aria-label="locale === 'id' ? 'Navigasi Halaman Projek' : 'Project Page Navigation'"
			class="px-6 py-6 sm:px-8 border-b border-slate-200/80 dark:border-[#134e43] bg-slate-50/50 dark:bg-[#002420]/30 flex flex-wrap items-center justify-between gap-4 font-mono text-xs"
		>
			<div class="flex items-center gap-2">
				<span class="text-slate-900/50 dark:text-slate-50/50 uppercase">HALAMAN:</span>
				<NuxtLink
					v-for="pageNum in totalPages"
					:key="pageNum"
					:to="getPaginationUrl(pageNum)"
					class="w-8 h-8 flex items-center justify-center font-bold transition-colors"
					:class="pageNum === currentPage
						? 'bg-brand-500 text-slate-950'
						: 'border border-slate-300 dark:border-[#134e43] text-slate-900 dark:text-slate-50 hover:border-brand-500'"
				>
					{{ pageNum }}
				</NuxtLink>
			</div>

			<div class="flex items-center gap-3">
				<NuxtLink
					v-if="currentPage > 1"
					:to="getPaginationUrl(currentPage - 1)"
					class="px-3 py-1.5 border border-slate-300 dark:border-[#134e43] font-bold uppercase hover:border-brand-500 transition-colors"
				>
					← SEBELUMNYA
				</NuxtLink>
				<NuxtLink
					v-if="currentPage < totalPages"
					:to="getPaginationUrl(currentPage + 1)"
					class="px-3 py-1.5 border border-slate-300 dark:border-[#134e43] font-bold uppercase hover:border-brand-500 transition-colors"
				>
					BERIKUTNYA →
				</NuxtLink>
			</div>
		</nav>

		<!-- Bottom Archival Colophon -->
		<div class="px-6 py-4 sm:px-8 bg-slate-50/80 dark:bg-[#002420]/60 font-mono text-[11px] text-slate-900/50 dark:text-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
			<div>
				DOKUMENTASI SISTEM REKAYASA &amp; STUDI KASUS // PERMADI.DEV
			</div>
			<div>
				MAJALENGKA, INDONESIA
			</div>
		</div>
	</div>
</template>

<style scoped>
.swiss-filter-active {
	background-color: #001e1c !important;
	color: #ffffff !important;
	border-color: #001e1c !important;
}

:global(.dark) .swiss-filter-active {
	background-color: #f8fafa !important;
	color: #001e1c !important;
	border-color: #f8fafa !important;
}
</style>

