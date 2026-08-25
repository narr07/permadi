<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const { locale } = useI18n()
const { getCategoryLabel } = useCategoryLabel()
const { formatDate } = useFormatDate()

const collection = computed(() => (locale.value === 'id' ? 'projek_id' : 'projek_en'))
const currentPath = computed(() => (locale.value === 'id' ? '/id/projek' : '/en/projects'))

// Data halaman projek (deskripsi dan header)
const { data: page } = await useAsyncData(
	() => `projek-page-${locale.value}`,
	() => queryCollection(locale.value === 'id' ? 'pages_id' : 'pages_en').path(currentPath.value).first(),
	{ watch: [locale] },
)

// Koleksi semua studi kasus projek (SSR fetched)
const { data: projects } = await useAsyncData(
	() => `projek-list-${locale.value}`,
	() => queryCollection(collection.value).order('date', 'DESC').all(),
	{ watch: [locale] },
)

// State filter tag
const selectedTag = ref('ALL')
const isTagDropdownOpen = ref(false)
const tagDropdownRef = ref<HTMLElement | null>(null)
const tagSearchQuery = ref('')

onClickOutside(tagDropdownRef, () => {
	if (isTagDropdownOpen.value) {
		isTagDropdownOpen.value = false
	}
})

// Daftar seluruh tag teknologi unik
const allTags = computed(() => {
	if (!projects.value)
		return []
	const tagsSet = new Set<string>()
	projects.value.forEach((item: any) => {
		if (item.category)
			tagsSet.add(item.category)
		const tags = item.tags || item.tech || []
		tags.forEach((t: string) => tagsSet.add(t))
	})
	return Array.from(tagsSet)
})

const filteredDropdownTags = computed(() => {
	const q = tagSearchQuery.value.trim().toLowerCase()
	if (!q)
		return allTags.value
	return allTags.value.filter((t: string) => t.toLowerCase().includes(q))
})

const route = useRoute()
const router = useRouter()

// 4. Bento SEO-Friendly Pagination (1 Featured Hero + 6 Grid = 7 Projek)
const projectsPerPage = 7

const currentPage = computed(() => {
	const p = Number(route.query.page)
	return p > 0 && !isNaN(p) ? Math.floor(p) : 1
})

// Otomatis scroll ke paling atas saat halaman pagination berganti
watch(currentPage, () => {
	if (import.meta.client) {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
	}
})

function selectTag(tag: string) {
	selectedTag.value = tag
	isTagDropdownOpen.value = false
	tagSearchQuery.value = ''
	if (route.query.page) {
		const q = { ...route.query }
		delete q.page
		router.push({ path: currentPath.value, query: q })
	}
}

const tagCounts = computed(() => {
	const map: Record<string, number> = {}
	if (projects.value) {
		for (const item of projects.value) {
			if (item.category) {
				map[item.category] = (map[item.category] || 0) + 1
			}
			const tags = item.tags || item.tech || []
			for (const tag of tags) {
				map[tag] = (map[tag] || 0) + 1
			}
		}
	}
	return map
})

// Filter projek berdasarkan tag / kategori
const filteredProjects = computed(() => {
	if (!projects.value)
		return []
	return projects.value
		.filter((item: any) => {
			return selectedTag.value === 'ALL'
				|| item.category === selectedTag.value
				|| (item.tags && item.tags.includes(selectedTag.value))
				|| (item.tech && item.tech.includes(selectedTag.value))
		})
		.map((item: any) => {
			const projectSlug = item.slug || (item.path ? item.path.split('/').pop() : item.stem)
			const basePath = locale.value === 'id' ? `/id/projek/${projectSlug}` : `/en/projects/${projectSlug}`
			return {
				...item,
				url: basePath,
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

function scrollToTop() {
	if (import.meta.client) {
		window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
	}
}

function onHeaderMouseMove(e: MouseEvent) {
	const target = e.currentTarget as HTMLElement
	if (!target)
		return
	const rect = target.getBoundingClientRect()
	target.style.setProperty('--x', `${e.clientX - rect.left}px`)
	target.style.setProperty('--y', `${e.clientY - rect.top}px`)
}

useSeoMeta({
	title: computed(() => page.value?.title),
	description: computed(() => page.value?.description),
	ogTitle: computed(() => page.value?.title),
	ogDescription: computed(() => page.value?.description),
})

defineOgImage('Bento', {
	title: page.value?.title,
	description: page.value?.description,
})

useSchemaOrg([
	defineWebPage({
		'@type': 'CollectionPage',
	}),
])
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<!-- Page Header with Bento Spotlight Effect -->
		<header
			class="bento-card-clean bento-spotlight relative z-30 mb-8 bg-slate-50/50 p-6 sm:mb-10 !overflow-visible dark:bg-slate-900/40 sm:p-8"
			@mousemove="onHeaderMouseMove"
		>
			<!-- Ambient Glow Subtle Background (Clipped inside rounded frame) -->
			<div class="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px]">
				<div class="absolute h-64 w-64 rounded-full bg-brand-400/10 blur-3xl -right-16 -top-16 dark:bg-brand-400/5" />
			</div>

			<div class="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
				<!-- Sisi Kiri: Eyebrow + Judul + Deskripsi -->
				<div class="max-w-2xl">
					<div class="mb-3.5 inline-flex items-center gap-2 border border-brand-200/60 rounded-full bg-brand-100/70 px-3 py-1 text-xs text-brand-700 font-semibold dark:border-brand-800/60 dark:bg-brand-950 dark:text-brand-300">
						<span class="status-dot animate-pulse" />
						<span>{{ page?.eyebrow || (locale === 'id' ? 'Karya & Eksplorasi' : 'Work & Case Studies') }}</span>
					</div>

					<h1 class="heading-page">
						{{ page?.title || (locale === 'id' ? 'Projek & Studi Kasus' : 'Projects & Case Studies') }}
					</h1>

					<p class="heading-page-sub">
						{{ page?.description || (locale === 'id' ? 'Koleksi aplikasi web terkurasi, modul UI, dan sistem performa tinggi.' : 'A curated collection of web applications, UI modules, and high-performance systems.') }}
					</p>
				</div>

				<!-- Sisi Kanan / Actions: Total Karya & Tag Dropdown Filter -->
				<!-- Mobile: grid 2 kolom simetris; Desktop: flex-col teratur -->
				<div class="z-20 grid grid-cols-2 w-full shrink-0 gap-2.5 md:w-auto md:flex md:flex-col">
					<!-- Mini Bento Stat Pill: Total Karya -->
					<div class="shadow-xs h-11 flex items-center gap-2 border border-slate-200/70 rounded-xl bg-white px-3.5 md:w-48 dark:border-slate-700/60 dark:bg-slate-800/80 sm:px-4">
						<span class="i-hugeicons-folder-02 shrink-0 text-sm text-brand-700 dark:text-brand-400" />
						<span class="truncate text-xs text-slate-800 font-bold font-mono dark:text-slate-100">
							{{ projects?.length || 0 }} {{ locale === 'id' ? 'Projek' : 'Projects' }}
						</span>
					</div>

					<!-- Dropdown Tag Selector -->
					<div
						ref="tagDropdownRef"
						class="relative md:w-48"
					>
						<button
							type="button"
							class="shadow-xs h-11 w-full flex cursor-pointer items-center justify-between gap-2 border rounded-xl px-3.5 text-xs font-semibold transition-all sm:px-4"
							:class="selectedTag !== 'ALL'
								? 'bg-brand-700 text-white border-brand-600 shadow-brand-700/20'
								: 'bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-200/70 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800'"
							:aria-expanded="isTagDropdownOpen"
							aria-label="Pilih topik filter"
							@click="isTagDropdownOpen = !isTagDropdownOpen"
						>
							<span class="flex items-center gap-2 truncate">
								<span
									class="i-hugeicons-filter-horizontal shrink-0 text-sm"
									:class="selectedTag !== 'ALL' ? 'text-white' : 'text-brand-700 dark:text-brand-400'"
								/>
								<span class="truncate">
									{{ selectedTag === 'ALL' ? (locale === 'id' ? 'Semua Topik' : 'All Topics') : `#${getCategoryLabel(selectedTag)}` }}
								</span>
							</span>
							<span
								class="i-hugeicons-arrow-down-01 ml-0.5 shrink-0 text-xs transition-transform duration-200"
								:class="{ 'rotate-180': isTagDropdownOpen }"
							/>
						</button>

						<!-- Dropdown Popover Menu -->
						<Transition
							enter-active-class="transition duration-150 ease-out"
							enter-from-class="transform scale-95 opacity-0 -translate-y-1"
							enter-to-class="transform scale-100 opacity-100 translate-y-0"
							leave-active-class="transition duration-100 ease-in"
							leave-from-class="transform scale-100 opacity-100 translate-y-0"
							leave-to-class="transform scale-95 opacity-0 -translate-y-1"
						>
							<div
								v-if="isTagDropdownOpen"
								class="absolute right-0 top-full z-50 mt-2 max-h-80 max-w-[90vw] w-64 overflow-y-auto border border-slate-200 rounded-2xl bg-white p-2 shadow-2xl sm:w-72 dark:border-[#134e43] dark:bg-[#001714]"
							>
								<!-- Tag Search Input inside Dropdown -->
								<div
									v-if="allTags.length > 5"
									class="mb-1.5 border-b border-slate-100 px-1 pb-2 dark:border-white/10"
								>
									<div class="relative">
										<span class="i-hugeicons-search-01 absolute left-2.5 top-1/2 text-xs text-slate-500 -translate-y-1/2" />
										<input
											v-model="tagSearchQuery"
											type="text"
											:placeholder="locale === 'id' ? 'Cari tag...' : 'Search tags...'"
											class="w-full border border-slate-200 rounded-lg bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 dark:border-white/10 dark:bg-[#002420] dark:text-white placeholder:text-slate-500 focus:outline-none"
										>
									</div>
								</div>

								<!-- List of Options -->
								<div class="space-y-0.5">
									<!-- "All Topics" Option -->
									<button
										type="button"
										class="w-full flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors"
										:class="selectedTag === 'ALL'
											? 'bg-brand-500/15 dark:bg-brand-500/25 text-brand-800 dark:text-brand-300 font-bold'
											: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'"
										@click="selectTag('ALL')"
									>
										<span class="flex items-center gap-2">
											<span class="i-hugeicons-grid-view text-xs" />
											{{ locale === 'id' ? 'Semua Topik' : 'All Topics' }}
										</span>
										<span class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 font-medium font-mono dark:bg-white/10 dark:text-slate-400">
											{{ projects?.length || 0 }}
										</span>
									</button>

									<!-- Tags Options -->
									<button
										v-for="tag in filteredDropdownTags"
										:key="tag"
										type="button"
										class="w-full flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors"
										:class="selectedTag === tag
											? 'bg-brand-500/15 dark:bg-brand-500/25 text-brand-800 dark:text-brand-300 font-bold'
											: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'"
										@click="selectTag(tag)"
									>
										<span class="flex items-center gap-2 truncate">
											<span class="i-hugeicons-tag-01 shrink-0 text-xs" />
											<span class="truncate">#{{ getCategoryLabel(tag) }}</span>
										</span>
										<span
											v-if="tagCounts[tag]"
											class="ml-2 shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 font-medium font-mono dark:bg-white/10 dark:text-slate-400"
										>
											{{ tagCounts[tag] }}
										</span>
									</button>

									<!-- Empty Filter Search -->
									<div
										v-if="filteredDropdownTags.length === 0"
										class="px-3 py-4 text-center text-xs text-slate-500"
									>
										{{ locale === 'id' ? 'Topik tidak ditemukan' : 'No topics found' }}
									</div>
								</div>
							</div>
						</Transition>
					</div>
				</div>
			</div>
		</header>

		<!-- Bento Grid Projects (1 col mobile, 2 col tablet, 3 col desktop) -->
		<div
			v-if="filteredProjects.length > 0"
			class="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2 sm:gap-6"
		>
			<NuxtLink
				v-for="(item, index) in paginatedProjects"
				:key="item.url"
				v-spotlight
				:to="item.url"
				class="bento-card-clean group block flex flex-col justify-between overflow-hidden transition-all duration-300"
				:class="currentPage === 1 && index === 0 && selectedTag === 'ALL'
					? 'lg:col-span-3 sm:col-span-2 col-span-1 p-6 sm:p-7 lg:p-8 bg-gradient-to-br from-white via-brand-50/20 to-brand-100/30 dark:from-[#002b27] dark:via-[#002420] dark:to-[#001916] border-brand-300/70 dark:border-brand-700/60 shadow-lg shadow-brand-950/5'
					: 'col-span-1 p-5 sm:p-6 bg-white dark:bg-[#002b27] border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/80 dark:hover:border-brand-400/80'"
			>
				<!-- Hero Featured Layout (Ketika Item Pertama & Filter ALL di Halaman 1) -->
				<template v-if="currentPage === 1 && index === 0 && selectedTag === 'ALL'">
					<div class="grid grid-cols-1 w-full items-center gap-6 lg:grid-cols-12 md:grid-cols-12 sm:gap-8">
						<!-- Thumbnail Featured Showcase -->
						<div
							v-if="item.image || (item.images && item.images[0])"
							class="aspect-video w-full overflow-hidden border border-brand-200/70 rounded-2xl bg-slate-100 shadow-sm lg:col-span-7 md:col-span-6 dark:border-brand-800/50 dark:bg-slate-900/60"
						>
							<NuxtImg
								:src="item.image || item.images[0]"
								:alt="item.title"
								format="webp"
								quality="85"
								loading="eager"
								fetchpriority="high"
								placeholder
								decoding="async"
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>

						<!-- Content Showcase -->
						<div class="flex flex-col justify-between lg:col-span-5 md:col-span-6">
							<div>
								<div class="mb-3 flex flex-wrap items-center gap-2">
									<span class="inline-flex items-center gap-1.5 border border-brand-300 rounded-full bg-brand-100 px-3 py-1 text-xs text-brand-800 font-bold dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300">
										<span class="status-dot animate-ping" />
										{{ locale === 'id' ? 'Projek Unggulan' : 'Featured Project' }}
									</span>
									<span
										v-if="item.category"
										class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700 font-medium dark:bg-slate-800 dark:text-slate-300"
									>
										{{ getCategoryLabel(item.category) }}
									</span>
								</div>

								<h2 class="text-xl text-brand-950 font-bold tracking-tight font-heading lg:text-3xl sm:text-2xl dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-300">
									{{ item.title }}
								</h2>

								<p class="mt-3 text-xs text-slate-700 leading-relaxed sm:text-sm dark:text-slate-300">
									{{ item.description }}
								</p>

								<!-- Tags list -->
								<div
									v-if="item.tags || item.tech"
									class="mt-4 flex flex-wrap gap-1.5"
								>
									<span
										v-for="tech in (item.tags || item.tech).slice(0, 4)"
										:key="tech"
										class="border border-slate-200 rounded-md bg-white/70 px-2 py-0.5 text-[10px] text-slate-600 font-mono dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
									>
										#{{ tech }}
									</span>
								</div>
							</div>

							<div class="mt-6 flex items-center justify-between border-t border-slate-200/80 pt-4 dark:border-slate-700/80">
								<span class="flex items-center gap-1.5 text-xs text-brand-800 font-bold sm:text-sm dark:text-brand-300">
									{{ locale === 'id' ? 'Lihat Studi Kasus' : 'Explore Case Study' }}
									<span class="transition-transform group-hover:translate-x-1">→</span>
								</span>

								<!-- Live & Repo Links -->
								<div
									v-if="item.demoUrl || item.link || item.githubUrl || item.repo"
									class="flex items-center gap-2"
									@click.stop
								>
									<a
										v-if="item.githubUrl || item.repo"
										:href="item.githubUrl || item.repo"
										target="_blank"
										rel="noopener"
										class="icon-btn !h-8 !w-8"
										aria-label="GitHub Repository"
									>
										<span class="i-hugeicons-github text-sm" />
									</a>
									<a
										v-if="item.demoUrl || item.link"
										:href="item.demoUrl || item.link"
										target="_blank"
										rel="noopener"
										class="icon-btn !h-8 !w-8"
										aria-label="Live Demo"
									>
										<span class="i-hugeicons-link-square-02 text-sm" />
									</a>
								</div>
							</div>
						</div>
					</div>
				</template>

				<!-- Standard Card Layout (Untuk Projek Lainnya) -->
				<template v-else>
					<!-- Thumbnail -->
					<div
						v-if="item.image || (item.images && item.images[0])"
						class="mb-4 aspect-video w-full shrink-0 overflow-hidden border border-slate-200/50 rounded-xl bg-slate-100 dark:border-slate-800/50 dark:bg-slate-800"
					>
						<NuxtImg
							:src="item.image || item.images[0]"
							:alt="item.title"
							format="webp"
							quality="85"
							class="h-full w-full object-cover"
							loading="lazy"
							decoding="async"
							placeholder
						/>
					</div>

					<!-- Content & Details -->
					<div class="flex flex-1 flex-col justify-between">
						<div>
							<!-- Badges Row (Category + Tags) -->
							<div class="mb-2 flex flex-wrap items-center gap-1.5">
								<span
									v-if="item.category"
									class="inline-flex shrink-0 items-center border border-brand-200/60 rounded-full bg-brand-100 px-2 py-0.5 text-[11px] text-brand-800 font-semibold tracking-wide uppercase dark:border-brand-800/60 dark:bg-brand-950 dark:text-brand-300"
								>
									{{ getCategoryLabel(item.category) }}
								</span>

								<span
									v-for="(tag, tIdx) in (item.tags || item.tech || []).slice(0, 2)"
									:key="tag"
									class="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 font-medium dark:bg-slate-800 dark:text-slate-300"
									:class="tIdx > 0 ? 'hidden sm:inline-flex' : ''"
								>
									#{{ tag }}
								</span>
							</div>

							<!-- Date Badge (Inverted High-Contrast Badge) -->
							<div
								v-if="item.date"
								class="mb-3 flex items-center"
							>
								<span class="shadow-xs inline-flex items-center gap-1.5 border border-slate-900 rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] text-white font-bold font-mono transition-colors dark:border-white dark:bg-white dark:text-slate-950">
									<span class="i-hugeicons-calendar-03 text-xs text-brand-400 dark:text-brand-800" />
									<span>{{ formatDate(item.date) }}</span>
								</span>
							</div>

							<h2 class="text-base text-slate-900 font-bold leading-snug tracking-normal font-heading transition-colors duration-200 sm:text-lg dark:text-slate-100 group-hover:text-brand-700 dark:group-hover:text-brand-300">
								{{ item.title }}
							</h2>

							<p class="line-clamp-3 mt-2 text-xs text-slate-600 leading-relaxed transition-colors duration-200 sm:text-sm dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
								{{ item.description }}
							</p>
						</div>

						<div class="mt-5 flex items-center justify-between border-t border-slate-200/60 pt-3.5 text-xs dark:border-slate-800/60">
							<span class="flex items-center gap-1 text-brand-800 font-bold transition-all group-hover:translate-x-1 dark:text-brand-300 group-hover:text-brand-950 dark:group-hover:text-yellow-500">
								{{ locale === 'id' ? 'Lihat Studi Kasus' : 'Explore Case Study' }} <span>↗</span>
							</span>
							<div
								v-if="item.demoUrl || item.link || item.githubUrl || item.repo"
								class="flex items-center gap-2"
								@click.stop
							>
								<a
									v-if="item.githubUrl || item.repo"
									:href="item.githubUrl || item.repo"
									target="_blank"
									rel="noopener"
									class="icon-btn !h-7 !w-7"
									aria-label="GitHub Repository"
								>
									<span class="i-hugeicons-github text-xs" />
								</a>
								<a
									v-if="item.demoUrl || item.link"
									:href="item.demoUrl || item.link"
									target="_blank"
									rel="noopener"
									class="icon-btn !h-7 !w-7"
									aria-label="Live Demo"
								>
									<span class="i-hugeicons-link-square-02 text-xs" />
								</a>
							</div>
						</div>
					</div>
				</template>
			</NuxtLink>
		</div>

		<!-- Bento SEO-Friendly Pagination -->
		<nav
			v-if="totalPages > 1"
			:aria-label="locale === 'id' ? 'Navigasi Halaman Projek' : 'Project Page Navigation'"
			class="mt-10 flex select-none items-center justify-center gap-2 sm:mt-14"
		>
			<!-- Tombol Previous -->
			<NuxtLink
				v-if="currentPage > 1"
				:to="getPaginationUrl(currentPage - 1)"
				class="shadow-xs inline-flex items-center gap-1.5 border border-slate-200/80 rounded-xl bg-white px-3.5 py-2 text-xs text-slate-700 font-semibold transition-all dark:border-slate-700/70 hover:border-brand-500/60 dark:bg-slate-800/80 dark:text-slate-200 hover:text-brand-700 dark:hover:border-brand-400/60 dark:hover:text-brand-300"
				@click="scrollToTop"
			>
				<span class="i-hugeicons-arrow-left-01 text-xs" />
				<span class="hidden sm:inline">{{ locale === 'id' ? 'Sebelumnya' : 'Previous' }}</span>
			</NuxtLink>
			<span
				v-else
				class="inline-flex cursor-not-allowed items-center gap-1.5 border border-slate-200/40 rounded-xl bg-slate-100/50 px-3.5 py-2 text-xs text-slate-400 font-semibold dark:border-slate-800/40 dark:bg-slate-900/40 dark:text-slate-600"
				aria-disabled="true"
			>
				<span class="i-hugeicons-arrow-left-01 text-xs" />
				<span class="hidden sm:inline">{{ locale === 'id' ? 'Sebelumnya' : 'Previous' }}</span>
			</span>

			<!-- Nomor Halaman -->
			<div class="flex items-center gap-1 sm:gap-1.5">
				<NuxtLink
					v-for="pageNum in totalPages"
					:key="pageNum"
					:to="getPaginationUrl(pageNum)"
					class="h-9 w-9 flex items-center justify-center rounded-xl text-xs font-bold font-mono transition-all sm:h-10 sm:w-10 sm:text-sm"
					:class="pageNum === currentPage
						? 'bg-brand-700 text-white shadow-sm shadow-brand-700/30 dark:bg-brand-500 dark:text-slate-950'
						: 'border border-slate-200/70 dark:border-slate-700/60 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-brand-500/60 dark:hover:border-brand-400/60 hover:text-brand-700 dark:hover:text-brand-300'"
					:aria-current="pageNum === currentPage ? 'page' : undefined"
					@click="scrollToTop"
				>
					{{ pageNum }}
				</NuxtLink>
			</div>

			<!-- Tombol Next -->
			<NuxtLink
				v-if="currentPage < totalPages"
				:to="getPaginationUrl(currentPage + 1)"
				class="shadow-xs inline-flex items-center gap-1.5 border border-slate-200/80 rounded-xl bg-white px-3.5 py-2 text-xs text-slate-700 font-semibold transition-all dark:border-slate-700/70 hover:border-brand-500/60 dark:bg-slate-800/80 dark:text-slate-200 hover:text-brand-700 dark:hover:border-brand-400/60 dark:hover:text-brand-300"
				@click="scrollToTop"
			>
				<span class="hidden sm:inline">{{ locale === 'id' ? 'Berikutnya' : 'Next' }}</span>
				<span class="i-hugeicons-arrow-right-01 text-xs" />
			</NuxtLink>
			<span
				v-else
				class="inline-flex cursor-not-allowed items-center gap-1.5 border border-slate-200/40 rounded-xl bg-slate-100/50 px-3.5 py-2 text-xs text-slate-400 font-semibold dark:border-slate-800/40 dark:bg-slate-900/40 dark:text-slate-600"
				aria-disabled="true"
			>
				<span class="hidden sm:inline">{{ locale === 'id' ? 'Berikutnya' : 'Next' }}</span>
				<span class="i-hugeicons-arrow-right-01 text-xs" />
			</span>
		</nav>

		<!-- Empty State Jika Tidak Ada Hasil Pencarian -->
		<div
			v-else
			class="bento-card-clean my-8 p-12 text-center"
		>
			<span class="i-hugeicons-folder-open mx-auto mb-3 block text-4xl text-slate-400" />
			<h3 class="text-lg text-slate-900 font-semibold font-heading dark:text-white">
				{{ locale === 'id' ? 'Tidak ada projek ditemukan' : 'No projects found' }}
			</h3>
			<p class="mb-4 mt-1 text-xs text-slate-600 dark:text-slate-400">
				{{ locale === 'id' ? 'Coba ubah kata kunci pencarian atau bersihkan filter tag.' : 'Try changing search keywords or resetting active tag filters.' }}
			</p>
			<button
				type="button"
				class="rounded-full bg-brand-700 px-4 py-2 text-xs text-white font-bold transition-colors hover:bg-brand-800"
				@click="selectedTag = 'ALL'; searchQuery = ''"
			>
				{{ locale === 'id' ? 'Reset Pencarian' : 'Reset Filter' }}
			</button>
		</div>
	</div>
</template>
