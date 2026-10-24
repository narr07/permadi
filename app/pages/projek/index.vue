<script setup lang="ts">
const { locale, t } = useI18n()
const { getCategoryLabel } = useCategoryLabel()
const { formatDate } = useFormatDate()

const collection = computed(() => (locale.value === 'id' ? 'projek_id' : 'projek_en'))
const currentPath = computed(() => (locale.value === 'id' ? '/id/projek' : '/projects'))

// Page metadata
const { data: page } = await useAsyncData(
	() => `projek-page-${locale.value}`,
	() => queryCollection(locale.value === 'id' ? 'pages_id' : 'pages_en').path(currentPath.value).select('title', 'description').first(),
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

// Active filter category ('ALL' | 'web' | 'mobile' | 'design' | 'software')
const selectedTag = ref('ALL')

// Fixed 3 categories as defined in content.config.ts schema
const projectCategories = ['ALL', 'web', 'mobile', 'design', 'software'] as const

function getFilterLabel(key: string): string {
	if (key === 'ALL') {
		return t('projek.filter_all')
	}
	return getCategoryLabel(key)
}

const route = useRoute()
const router = useRouter()

const filterOptions = computed(() => projectCategories.map(key => ({ value: key, label: getFilterLabel(key) })))

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

// Filtered project list strictly by category
const filteredProjects = computed(() => {
	if (!projects.value)
		return []
	return projects.value
		.filter((item: any) => {
			if (selectedTag.value === 'ALL')
				return true
			return String(item.category || '').toLowerCase().trim() === selectedTag.value.toLowerCase().trim()
		})
		.map((item: any) => {
			const projectSlug = item.slug || (item.path ? item.path.split('/').pop().replace(/^\d+\./, '') : '')
			const basePath = locale.value === 'id' ? `/id/projek/${projectSlug}` : `/projects/${projectSlug}`
			return {
				...item,
				url: basePath,
			}
		})
})

// Halaman 1 tanpa filter: 1 projek unggulan + 6 kartu; halaman lain: 6 kartu
const showLead = computed(() => selectedTag.value === 'ALL')
const { totalPages, lead: leadProject, grid: gridProjects } = useLeadPagination(filteredProjects, currentPage, showLead)

// Kartu yang mengisi satu baris penuh beralih ke tata letak horizontal agar gambarnya tidak raksasa
function projectCardClass(index: number, total: number) {
	const span = gridCardSpan(index, total)
	const item = gridProjects.value[index] as any
	const hasImage = Boolean(item?.image || item?.images?.[0])
	return [
		span.md,
		span.lg,
		hasImage && span.mdFullRow ? 'wide-md' : '',
		hasImage && span.lgFullRow ? 'wide-lg' : '',
	]
}

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
	<div class="relative w-full bg-white dark:bg-[#001e1c]">
		<header class="w-full border-b border-slate-200/80 p-6 dark:border-[#134e43] lg:p-12 sm:p-10">
			<h1 class="mb-6 text-balance text-3xl text-slate-900 font-900 leading-[0.95] tracking-[-0.035em] font-heading lg:text-6xl sm:text-5xl dark:text-slate-50">
				{{ page?.title || $t('projek.default_title') }}
			</h1>

			<p class="max-w-[56ch] text-base text-slate-800 leading-relaxed font-sans sm:text-lg dark:text-slate-200">
				{{ page?.description || $t('projek.default_description') }}
			</p>
		</header>

		<AppFilterTabs
			:options="filterOptions"
			:model-value="selectedTag"
			:label="locale === 'id' ? 'Filter kategori projek' : 'Filter project category'"
			@update:model-value="selectTag"
		>
			{{ $t('projek.showing_count', { count: filteredProjects.length, total: projects?.length || 0 }) }}
		</AppFilterTabs>

		<!-- Lead Project (first page, all categories) -->
		<article
			v-if="leadProject"
			class="w-full border-b border-slate-200/80 dark:border-[#134e43]"
		>
			<div class="grid grid-cols-1 lg:grid-cols-12">
				<!-- Lead Info (Cols 1 to 5) -->
				<div class="flex flex-col justify-between p-6 lg:col-span-5 lg:border-r lg:border-slate-200/80 lg:p-10 sm:p-8 lg:dark:border-[#134e43]">
					<div>
						<div class="mb-4 text-[11px] text-slate-600 font-bold tracking-widest font-mono uppercase tabular-nums dark:text-slate-400">
							{{ getCategoryLabel(leadProject.category) }} · {{ formatDate(leadProject.date) }}
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
							class="group flex cursor-pointer items-center gap-2 bg-brand-500 px-5 py-2.5 text-xs text-slate-950 font-bold tracking-wider font-mono uppercase shadow-xs transition-all duration-150 active:scale-95 hover:bg-brand-400"
						>
							<span>{{ $t('projek.view_detail') }}</span>
							<span class="i-carbon-arrow-up-right text-sm transition-transform duration-150 group-hover:(translate-x-0.5 -translate-y-0.5)" />
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

				<!-- Lead Media Frame (Cols 6 to 12); di mobile tampil di atas info -->
				<div class="order-first flex flex-col justify-center border-b border-slate-200/80 bg-slate-50/40 p-6 lg:order-none lg:col-span-7 lg:border-b-0 dark:border-[#134e43] dark:bg-[#002420]/20 lg:p-10 sm:p-8">
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

				</div>
			</div>
		</article>

		<!-- Project Grid -->
		<div
			v-if="gridProjects.length > 0"
			class="w-full border-b border-slate-200/80 dark:border-[#134e43]"
		>
			<!-- Garis grid dari gap-px di atas latar garis, sehingga tetap rapi berapa pun lebar kartu -->
			<div class="grid grid-cols-1 gap-px bg-slate-200/80 lg:grid-cols-6 md:grid-cols-4 dark:bg-[#134e43]">
				<article
					v-for="(item, idx) in gridProjects"
					:key="item.url"
					class="project-card group grid gap-x-8 bg-white p-6 transition-colors duration-200 dark:bg-[#001e1c] hover:(bg-[#e2f4f0] dark:bg-[#003832]) sm:p-8"
					:class="projectCardClass(idx, gridProjects.length)"
				>
					<!-- Thumbnail -->
					<div
						v-if="item.image || (item.images && item.images[0])"
						class="project-thumb mb-6 aspect-video w-full overflow-hidden border border-slate-200/80 dark:border-[#134e43]"
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

					<div>
						<!-- Item Meta -->
						<div class="mb-3 flex items-center justify-between text-[11px] font-mono">
							<span class="text-brand-600 font-bold uppercase dark:text-brand-400">
								{{ getCategoryLabel(item.category) }}
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
							class="inline-flex items-center gap-1.5 text-xs text-slate-900 font-bold tracking-wider font-mono uppercase transition-all duration-150 active:scale-95 dark:text-slate-50 group-hover:text-brand-600 dark:group-hover:text-brand-400"
						>
							<span>{{ $t('projek.read_story') }}</span>
							<span class="i-carbon-arrow-up-right text-sm transition-transform group-hover:(translate-x-0.5 -translate-y-0.5)" />
						</NuxtLink>

						<div
							v-if="item.demoUrl || item.link || item.githubUrl || item.repo"
							class="flex items-center gap-4 text-slate-600 dark:text-slate-400"
						>
							<a
								v-if="item.githubUrl || item.repo"
								:href="item.githubUrl || item.repo"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex cursor-pointer items-center justify-center border border-slate-300 p-1.5 text-slate-800 transition-all duration-150 active:scale-90 dark:border-[#134e43] hover:border-brand-500 dark:text-slate-200 hover:text-brand-600 hover:text-brand-700 dark:hover:border-brand-400 dark:hover:text-accent dark:hover:text-brand-400"
								aria-label="GitHub Repository"
							>
								<span class="i-ant-design-github-filled text-sm" />
							</a>
							<a
								v-if="item.demoUrl || item.link"
								:href="item.demoUrl || item.link"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex cursor-pointer items-center justify-center border border-slate-300 p-1.5 text-slate-800 transition-all duration-150 active:scale-90 dark:border-[#134e43] hover:border-brand-500 dark:text-slate-200 hover:text-brand-600 hover:text-brand-700 dark:hover:border-brand-400 dark:hover:text-accent dark:hover:text-brand-400"
								aria-label="Demo"
							>
								<span class="i-carbon-launch text-sm" />
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
				{{ $t('projek.empty_title') }}
			</span>
			<p class="mb-4 text-xs text-slate-700 font-sans dark:text-slate-300">
				{{ $t('projek.empty_desc', { tag: getFilterLabel(selectedTag) }) }}
			</p>
			<button
				type="button"
				class="border border-slate-900 px-4 py-2 text-xs font-bold tracking-wider font-mono uppercase dark:border-slate-50"
				@click="selectTag('ALL')"
			>
				{{ $t('projek.reset_filter') }}
			</button>
		</div>

		<!-- Pagination -->
		<nav
			v-if="totalPages > 1"
			:aria-label="locale === 'id' ? 'Navigasi Halaman Projek' : 'Project Page Navigation'"
			class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 bg-slate-50/50 px-6 py-6 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/30 sm:px-8"
		>
			<div class="flex items-center gap-2">
				<NuxtLink
					v-for="pageNum in totalPages"
					:key="pageNum"
					:to="getPaginationUrl(pageNum)"
					class="h-8 w-8 flex items-center justify-center font-bold transition-colors"
					:class="pageNum === currentPage
						? 'swiss-filter-active'
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
					{{ $t('projek.prev') }}
				</NuxtLink>
				<NuxtLink
					v-if="currentPage < totalPages"
					:to="getPaginationUrl(currentPage + 1)"
					class="border border-slate-300 px-3 py-1.5 font-bold uppercase transition-colors dark:border-[#134e43] hover:border-brand-500"
				>
					{{ $t('projek.next') }}
				</NuxtLink>
			</div>
		</nav>
	</div>
</template>

<style scoped>
/* Kartu: gambar, teks (mengisi ruang), footer di dasar */
.project-card {
	grid-template-rows: auto 1fr auto;
}

/* Kartu selebar baris: gambar di kiri, teks + footer di kanan */
@media (min-width: 768px) and (max-width: 1023.98px) {
	.project-card.wide-md {
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr auto;
	}

	.project-card.wide-md .project-thumb {
		grid-row: span 2;
		margin-bottom: 0;
	}
}

@media (min-width: 1024px) {
	.project-card.wide-lg {
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr auto;
	}

	.project-card.wide-lg .project-thumb {
		grid-row: span 2;
		margin-bottom: 0;
	}
}

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
