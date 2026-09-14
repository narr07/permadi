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
				<div class="flex flex-col justify-between border-b border-slate-200/80 bg-slate-50/50 p-6 lg:col-span-4 lg:border-b-0 lg:border-r dark:border-[#134e43] dark:bg-[#002420]/40 lg:p-10 sm:p-8">
					<div>
						<div class="mb-4 flex items-center justify-between text-[11px] font-bold tracking-[0.2em] font-mono uppercase">
							<div class="flex items-center gap-2 text-brand-700 dark:text-accent">
								<span class="inline-block h-2 w-2 rounded-none bg-brand-500" />
								<span>{{ locale === 'id' ? '01 // KATALOG KARYA' : '01 // SELECTED WORKS' }}</span>
							</div>
							<span class="text-slate-600 tabular-nums dark:text-slate-400">
								VOL. 26
							</span>
						</div>

						<span class="mb-1.5 block text-[11px] text-slate-600 tracking-[0.15em] font-mono uppercase dark:text-slate-400">
							{{ locale === 'id' ? 'KLASIFIKASI ARSIP' : 'ARCHIVE CLASSIFICATION' }}
						</span>
						<h2 class="text-2xl text-slate-900 font-700 leading-tight font-heading sm:text-3xl dark:text-slate-50">
							{{ page?.eyebrow || (locale === 'id' ? 'Karya & Rekayasa' : 'Work & Systems') }}
						</h2>
					</div>

					<!-- Spec Parameters Table -->
					<div class="mt-8 border-t border-slate-200/80 pt-6 dark:border-[#134e43]">
						<div class="text-xs font-mono divide-y divide-slate-200/80 dark:divide-[#134e43]">
							<div class="flex items-baseline justify-between py-2">
								<span class="text-slate-700 dark:text-slate-300">{{ locale === 'id' ? 'TOTAL SPESIMEN' : 'TOTAL SPECIMENS' }}</span>
								<span class="text-slate-900 font-bold tabular-nums dark:text-slate-50">{{ projects?.length || 0 }} {{ locale === 'id' ? 'Proyek' : 'Projects' }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2">
								<span class="text-slate-700 dark:text-slate-300">{{ locale === 'id' ? 'FILTER AKTIF' : 'ACTIVE FILTER' }}</span>
								<span class="text-brand-600 font-bold uppercase dark:text-brand-400">{{ selectedTag === 'ALL' ? (locale === 'id' ? 'SEMUA' : 'ALL') : selectedTag }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2">
								<span class="text-slate-700 dark:text-slate-300">STATUS</span>
								<span class="text-brand-600 font-semibold dark:text-brand-400">{{ locale === 'id' ? 'TERDOKUMENTASI' : 'DOCUMENTED' }}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Typographic Statement Field (8 Columns) -->
				<div class="flex flex-col justify-between p-6 lg:col-span-8 lg:p-12 sm:p-10">
					<div>
						<div class="mb-4 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:text-accent">
							{{ locale === 'id' ? 'ARSIP TERKURASI // 2024–2026' : 'CURATED ARCHIVE // 2024–2026' }}
						</div>

						<h1 class="mb-6 text-balance text-3xl text-slate-900 font-700 leading-[0.95] tracking-[-0.035em] font-heading lg:text-6xl sm:text-5xl dark:text-slate-50">
							{{ page?.title || (locale === 'id' ? 'Arsip Projek & Studi Kasus' : 'Projects & Case Studies Archive') }}
						</h1>

						<p class="max-w-[56ch] text-base text-slate-800 leading-relaxed font-sans sm:text-lg dark:text-slate-200">
							{{ page?.description || (locale === 'id' ? 'Dokumentasi rekayasa aplikasi web modern, sistem komponen UI, aplikasi mobile Flutter, dan eksplorasi identitas visual berbasis kisi rasional.' : 'Curated documentation of web applications, UI component systems, mobile apps, and graphic identity design.') }}
						</p>
					</div>

					<div class="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-6 text-xs text-slate-600 font-mono dark:border-[#134e43] dark:text-slate-400">
						<span>{{ locale === 'id' ? 'DIREKTORI REKAYASA DIGITAL' : 'DIGITAL ENGINEERING DIRECTORY' }}</span>
					</div>
				</div>
			</div>
		</header>

		<!-- Band 02: Architectural Filter Strip -->
		<nav
			aria-label="Filter kategori proyek"
			class="w-full flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-slate-50/60 px-6 py-3.5 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/40 sm:px-8"
		>
			<div class="flex flex-wrap items-center gap-2">
				<span class="mr-1 text-[11px] text-slate-600 uppercase dark:text-slate-400">FILTER:</span>
				<button
					v-for="tag in filterTabs"
					:key="tag"
					type="button"
					class="cursor-pointer border px-3.5 py-1.5 font-bold tracking-wider uppercase transition-all duration-150 active:scale-95 hover:-translate-y-0.5"
					:class="selectedTag === tag
						? 'swiss-filter-active'
						: 'bg-white dark:bg-[#001e1c] text-slate-800 dark:text-slate-200 border-slate-300 dark:border-[#134e43] hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400'"
					@click="selectTag(tag)"
				>
					<span>{{ tag === 'ALL' ? (locale === 'id' ? 'SEMUA' : 'ALL') : tag }}</span>
				</button>
			</div>

			<span class="text-[11px] text-slate-600 uppercase tabular-nums dark:text-slate-400">
				{{ locale === 'id' ? `MENAMPILKAN ${filteredProjects.length} DARI ${projects?.length || 0} KARYA` : `SHOWING ${filteredProjects.length} OF ${projects?.length || 0} WORKS` }}
			</span>
		</nav>

		<!-- Band 03: Lead Featured Project (When On First Page & All Topics) -->
		<article
			v-if="leadProject"
			class="w-full border-b border-slate-200/80 dark:border-[#134e43]"
		>
			<div class="grid grid-cols-1 lg:grid-cols-12">
				<!-- Lead Info (Cols 1 to 5) -->
				<div class="flex flex-col justify-between border-b border-slate-200/80 p-6 lg:col-span-5 lg:border-b-0 lg:border-r dark:border-[#134e43] lg:p-10 sm:p-8">
					<div>
						<div class="mb-4 flex items-center justify-between text-[11px] font-bold tracking-widest font-mono uppercase">
							<span class="text-brand-700 dark:text-accent">
								{{ locale === 'id' ? 'SPESIMEN 01 // UNGGULAN' : 'SPECIMEN 01 // FEATURED' }}
							</span>
							<span class="text-slate-600 tabular-nums dark:text-slate-400">
								{{ formatDate(leadProject.date) }}
							</span>
						</div>

						<h2 class="mb-4 text-2xl text-slate-900 font-700 leading-tight font-heading sm:text-4xl dark:text-slate-50">
							<NuxtLink
								:to="leadProject.url"
								class="transition-colors hover:text-brand-600"
							>
								{{ leadProject.title }}
							</NuxtLink>
						</h2>

						<p class="mb-6 text-xs text-slate-800 leading-relaxed font-sans sm:text-sm dark:text-slate-200">
							{{ leadProject.description }}
						</p>

						<!-- Tech Tags -->
						<div class="mb-6 flex flex-wrap gap-1.5">
							<span
								v-for="tech in (leadProject.tags || leadProject.tech || []).slice(0, 5)"
								:key="tech"
								class="border border-slate-300 px-2 py-1 text-[10px] text-slate-800 font-mono uppercase dark:border-[#134e43] dark:text-slate-200"
							>
								{{ tech }}
							</span>
						</div>
					</div>

					<div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-6 dark:border-[#134e43]">
						<NuxtLink
							:to="leadProject.url"
							class="group flex cursor-pointer items-center gap-2 bg-brand-500 px-5 py-2.5 text-xs text-slate-950 font-bold tracking-wider font-mono uppercase shadow-xs transition-all duration-150 active:scale-95 hover:bg-brand-400 hover:-translate-y-0.5"
						>
							<span>{{ locale === 'id' ? 'BUKA STUDI KASUS' : 'VIEW CASE STUDY' }}</span>
							<span class="i-swisspost-arrowupright text-sm transition-transform duration-150 group-hover:(translate-x-0.5 -translate-y-0.5)" />
						</NuxtLink>

						<div
							v-if="leadProject.demoUrl || leadProject.link || leadProject.githubUrl || leadProject.repo"
							class="flex items-center gap-3 text-xs font-mono"
						>
							<a
								v-if="leadProject.githubUrl || leadProject.repo"
								:href="leadProject.githubUrl || leadProject.repo"
								target="_blank"
								rel="noopener noreferrer"
								class="text-slate-700 underline underline-offset-4 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"
							>
								GITHUB ↗
							</a>
							<a
								v-if="leadProject.demoUrl || leadProject.link"
								:href="leadProject.demoUrl || leadProject.link"
								target="_blank"
								rel="noopener noreferrer"
								class="text-slate-700 underline underline-offset-4 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"
							>
								DEMO ↗
							</a>
						</div>
					</div>
				</div>

				<!-- Lead Media Frame (Cols 6 to 12) -->
				<div class="flex flex-col justify-between bg-slate-50/40 p-6 lg:col-span-7 dark:bg-[#002420]/20 lg:p-10 sm:p-8">
					<div
						v-if="leadProject.image || (leadProject.images && leadProject.images[0])"
						class="aspect-video w-full overflow-hidden border border-slate-200/80 dark:border-[#134e43]"
					>
						<NuxtImg
							:src="leadProject.image || leadProject.images[0]"
							:alt="leadProject.title"
							format="webp"
							quality="85"
							class="h-full w-full object-cover"
							loading="eager"
						/>
					</div>

					<div class="mt-4 flex items-center justify-between text-[10px] text-slate-600 tracking-widest font-mono uppercase dark:text-slate-400">
						<span>{{ locale === 'id' ? 'FIG. 01.01 // PRATINJAU VISUAL ANTARMUKA' : 'FIG. 01.01 // INTERFACE VISUAL PREVIEW' }}</span>
						<span>{{ locale === 'id' ? 'RASIO: 16:9' : 'RATIO: 16:9' }}</span>
					</div>
				</div>
			</div>
		</article>

		<!-- Band 04: Continuous Specimen Grid for All Other Projects -->
		<div
			v-if="gridProjects.length > 0"
			class="w-full border-b border-slate-200/80 dark:border-[#134e43]"
		>
			<div class="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 divide-y divide-slate-200/80 md:divide-y-0 dark:divide-[#134e43]">
				<article
					v-for="(item, idx) in gridProjects"
					:key="item.url"
					class="group flex flex-col justify-between p-6 transition-all duration-150 hover:(bg-slate-50/90 -translate-y-0.5 dark:bg-[#002420]/50) sm:p-8"
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
							class="mb-6 aspect-video w-full overflow-hidden border border-slate-200/80 dark:border-[#134e43]"
						>
							<NuxtImg
								:src="item.image || item.images[0]"
								:alt="item.title"
								format="webp"
								quality="80"
								class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
								loading="lazy"
							/>
						</div>

						<!-- Item Meta -->
						<div class="mb-3 flex items-center justify-between text-[11px] font-mono">
							<span class="text-brand-600 font-bold dark:text-brand-400">
								SPESIMEN {{ item.indexNum }} // [{{ item.category?.toUpperCase() || 'WEB' }}]
							</span>
							<span class="text-slate-600 tabular-nums dark:text-slate-400">
								{{ formatDate(item.date) }}
							</span>
						</div>

						<h3 class="mb-3 text-xl text-slate-900 font-700 leading-snug font-heading transition-colors dark:text-slate-50 group-hover:text-brand-700 dark:group-hover:text-brand-300">
							<NuxtLink :to="item.url">
								{{ item.title }}
							</NuxtLink>
						</h3>

						<p class="mb-6 text-xs text-slate-700 leading-relaxed font-sans sm:text-sm dark:text-slate-300">
							{{ item.description }}
						</p>
					</div>

					<div class="flex items-center justify-between border-t border-slate-200/80 pt-4 dark:border-[#134e43]">
						<NuxtLink
							:to="item.url"
							class="inline-flex items-center gap-1.5 text-xs text-slate-900 font-bold tracking-wider font-mono uppercase transition-all duration-150 active:scale-95 dark:text-slate-50 group-hover:text-brand-600 hover:-translate-y-0.5 dark:group-hover:text-brand-400"
						>
							<span>{{ locale === 'id' ? 'STUDI KASUS' : 'CASE STUDY' }}</span>
							<span class="i-swisspost-arrowupright text-sm transition-transform group-hover:(translate-x-0.5 -translate-y-0.5)" />
						</NuxtLink>

						<div
							v-if="item.demoUrl || item.link || item.githubUrl || item.repo"
							class="flex items-center gap-2 text-slate-600 dark:text-slate-400"
						>
							<a
								v-if="item.githubUrl || item.repo"
								:href="item.githubUrl || item.repo"
								target="_blank"
								rel="noopener noreferrer"
								class="hover:text-brand-600 dark:hover:text-brand-400"
								aria-label="GitHub Repository"
							>
								<span class="i-swisspost-github text-sm" />
							</a>
							<a
								v-if="item.demoUrl || item.link"
								:href="item.demoUrl || item.link"
								target="_blank"
								rel="noopener noreferrer"
								class="hover:text-brand-600 dark:hover:text-brand-400"
								aria-label="Demo"
							>
								<span class="i-swisspost-linkexternal text-sm" />
							</a>
						</div>
					</div>
				</article>
			</div>
		</div>

		<!-- Empty State -->
		<div
			v-else-if="!leadProject"
			class="border-b border-slate-200/80 p-12 text-center dark:border-[#134e43]"
		>
			<span class="mb-2 block text-sm text-slate-600 tracking-widest font-mono uppercase dark:text-slate-400">
				{{ locale === 'id' ? 'TIDAK ADA SPESIMEN DITEMUKAN' : 'NO SPECIMENS FOUND' }}
			</span>
			<p class="mb-4 text-xs text-slate-700 font-sans dark:text-slate-300">
				{{ locale === 'id' ? `Tidak ada projek yang sesuai dengan filter #${selectedTag}.` : `No projects matching filter #${selectedTag}.` }}
			</p>
			<button
				type="button"
				class="border border-slate-900 px-4 py-2 text-xs font-bold tracking-wider font-mono uppercase dark:border-slate-50"
				@click="selectTag('ALL')"
			>
				RESET FILTER
			</button>
		</div>

		<!-- Band 05: Pagination Strip -->
		<nav
			v-if="totalPages > 1"
			:aria-label="locale === 'id' ? 'Navigasi Halaman Projek' : 'Project Page Navigation'"
			class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 bg-slate-50/50 px-6 py-6 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/30 sm:px-8"
		>
			<div class="flex items-center gap-2">
				<span class="text-slate-600 uppercase dark:text-slate-400">{{ locale === 'id' ? 'HALAMAN:' : 'PAGE:' }}</span>
				<NuxtLink
					v-for="pageNum in totalPages"
					:key="pageNum"
					:to="getPaginationUrl(pageNum)"
					class="h-8 w-8 flex items-center justify-center font-bold transition-colors"
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
					class="border border-slate-300 px-3 py-1.5 font-bold uppercase transition-colors dark:border-[#134e43] hover:border-brand-500"
				>
					{{ locale === 'id' ? '← SEBELUMNYA' : '← PREVIOUS' }}
				</NuxtLink>
				<NuxtLink
					v-if="currentPage < totalPages"
					:to="getPaginationUrl(currentPage + 1)"
					class="border border-slate-300 px-3 py-1.5 font-bold uppercase transition-colors dark:border-[#134e43] hover:border-brand-500"
				>
					{{ locale === 'id' ? 'BERIKUTNYA →' : 'NEXT →' }}
				</NuxtLink>
			</div>
		</nav>

		<!-- Bottom Archival Colophon -->
		<div class="flex flex-col items-start justify-between gap-2 bg-slate-50/80 px-6 py-4 text-[11px] text-slate-600 font-mono sm:flex-row sm:items-center dark:bg-[#002420]/60 sm:px-8 dark:text-slate-400">
			<div>
				{{ locale === 'id' ? 'DOKUMENTASI SISTEM REKAYASA & STUDI KASUS // PERMADI.DEV' : 'ENGINEERING SYSTEMS & CASE STUDIES // PERMADI.DEV' }}
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
