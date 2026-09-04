<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const { locale } = useI18n()
const localePath = useLocalePath()
const { getCategoryLabel } = useCategoryLabel()
const { formatDate } = useFormatDate()
const pageCollection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
const blogCollection = computed(() => (locale.value === 'id' ? 'blog_id' : 'blog_en'))
const currentPath = computed(() => `/${locale.value}/blog`)

const selectedTag = ref<string>('ALL')
const isTagDropdownOpen = ref(false)
const tagDropdownRef = ref<HTMLElement | null>(null)
const tagSearchQuery = ref('')

onClickOutside(tagDropdownRef, () => {
	if (isTagDropdownOpen.value) {
		isTagDropdownOpen.value = false
	}
})

const { data: page } = await useAsyncData(
	() => `blog-index-${locale.value}`,
	() => queryCollection(pageCollection.value).path(currentPath.value).first(),
	{ watch: [locale] },
)

const { data: posts } = await useAsyncData(
	() => `blog-posts-list-${locale.value}`,
	() => queryCollection(blogCollection.value).order('date', 'DESC').all(),
	{ watch: [locale] },
)

function cleanSlug(pathStr: string): string {
	const parts = pathStr.split('/')
	const lastPart = parts[parts.length - 1] || ''
	return lastPart.replace(/^\d+\./, '')
}

const allTags = computed(() => {
	if (!posts.value)
		return []
	const tagSet = new Set<string>()
	for (const post of posts.value) {
		if (post.category) {
			tagSet.add(post.category)
		}
		if (Array.isArray(post.tags)) {
			post.tags.forEach((tag: string) => tagSet.add(tag))
		}
	}
	return Array.from(tagSet)
})

const filteredDropdownTags = computed(() => {
	const q = tagSearchQuery.value.trim().toLowerCase()
	if (!q)
		return allTags.value
	return allTags.value.filter((t: string) => t.toLowerCase().includes(q))
})

const route = useRoute()
const router = useRouter()

// 4. Bento SEO-Friendly Pagination (1 Hero Full Width + 6 Grid = 7 Artikel)
const postsPerPage = 7

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
	if (posts.value) {
		for (const post of posts.value) {
			if (post.category) {
				map[post.category] = (map[post.category] || 0) + 1
			}
			if (Array.isArray(post.tags)) {
				for (const tag of post.tags) {
					map[tag] = (map[tag] || 0) + 1
				}
			}
		}
	}
	return map
})

const filteredPosts = computed(() => {
	if (!posts.value)
		return []
	return posts.value
		.filter((post: any) => {
			return selectedTag.value === 'ALL'
				|| post.category === selectedTag.value
				|| post.tags?.includes(selectedTag.value)
		})
		.map((post: any) => ({
			...post,
			url: `/${locale.value}/blog/${post.slug || cleanSlug(post.path)}`,
		}))
})

const totalPages = computed(() => {
	return Math.ceil(filteredPosts.value.length / postsPerPage) || 1
})

const paginatedPosts = computed(() => {
	const start = (currentPage.value - 1) * postsPerPage
	return filteredPosts.value.slice(start, start + postsPerPage)
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
		<!-- Page Header (Clean Bento Style without gradient) -->
		<header
			class="bento-card-clean relative z-30 mb-8 bg-slate-50/70 p-6 sm:mb-10 !overflow-visible dark:bg-slate-900/60 sm:p-8"
		>
			<div class="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
				<!-- Sisi Kiri: Eyebrow + Judul + Deskripsi -->
				<div class="max-w-2xl">
					<div class="mb-3.5 inline-flex items-center border border-brand-200/60 rounded-xl bg-brand-100/70 px-3 py-1 text-xs text-brand-950 font-semibold dark:border-brand-800/60 dark:bg-brand-950 dark:text-brand-300">
						<span>{{ page?.eyebrow || (locale === 'id' ? 'Artikel & Catatan' : 'Articles & Insights') }}</span>
					</div>

					<h1 class="heading-page">
						{{ page?.title || (locale === 'id' ? 'Blog & Catatan Teknis' : 'Blog & Technical Notes') }}
					</h1>

					<p class="heading-page-sub">
						{{ page?.description || (locale === 'id' ? 'Kumpulan artikel seputar pemrograman, rekayasa web, eksplorasi desain grafis, dan teknologi pendidikan oleh Permadi.' : 'Articles and practical notes on software development, web engineering, graphic design, and educational technology by Permadi.') }}
					</p>
				</div>

				<!-- Sisi Kanan / Actions: Total Artikel & Tag Dropdown Filter -->
				<!-- Mobile: grid 2 kolom simetris; Desktop: flex-col teratur -->
				<div class="z-20 grid grid-cols-2 w-full shrink-0 gap-2.5 md:w-auto md:flex md:flex-col">
					<!-- Mini Bento Stat Pill: Total Artikel -->
					<div class="shadow-xs h-11 flex items-center gap-2 border border-slate-200/70 rounded-xl bg-white px-3.5 md:w-48 dark:border-slate-700/60 dark:bg-slate-800/80 sm:px-4">
						<span class="i-hugeicons-book-open-01 shrink-0 text-sm text-brand-700 dark:text-brand-400" />
						<span class="truncate text-xs text-slate-800 font-bold font-mono dark:text-slate-100">
							{{ posts?.length || 0 }} {{ locale === 'id' ? 'Artikel' : 'Articles' }}
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
								class="absolute right-0 top-full z-50 mt-2 max-w-[90vw] w-64 flex flex-col overflow-hidden border border-slate-200 rounded-2xl bg-white p-2 shadow-2xl sm:w-72 dark:border-[#134e43] dark:bg-[#001714]"
							>
								<!-- Tag Search Input inside Dropdown -->
								<div
									v-if="allTags.length > 5"
									class="mb-1.5 shrink-0 border-b border-slate-100 px-1 pb-2 dark:border-white/10"
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
								<div class="custom-scrollbar max-h-60 overflow-y-auto overscroll-contain pr-1 space-y-0.5">
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
											{{ posts?.length || 0 }}
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

		<!-- Bento Grid Articles -->
		<template v-if="filteredPosts.length > 0">
			<div class="bento-grid">
				<NuxtLink
					v-for="(post, index) in paginatedPosts"
					:key="post.url"
					:to="post.url"
					class="group bento-card-outline block flex flex-col justify-between bento-lift p-5 sm:p-6"
					:class="currentPage === 1 && index === 0 && selectedTag === 'ALL'
						? 'featured-post-card lg:col-span-12 md:col-span-12 bg-brand-900 dark:bg-[#002b27] border-brand-800 dark:border-[#134e43] shadow-md !text-white'
						: 'lg:col-span-6 md:col-span-6'"
				>
					<div>
						<!-- Badges Row (Category + Tags) -->
						<div class="mb-2 flex flex-wrap items-center gap-1.5">
							<!-- Category Badge -->
							<span
								v-if="post.category"
								class="inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase"
								:class="currentPage === 1 && index === 0 && selectedTag === 'ALL'
									? '!bg-white/20 !text-white !border !border-white/30'
									: 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60'"
							>
								{{ getCategoryLabel(post.category) }}
							</span>

							<!-- Primary Tag (Full badge) -->
							<span
								v-if="post.tags?.[0]"
								class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium"
								:class="currentPage === 1 && index === 0 && selectedTag === 'ALL'
									? '!bg-brand-400/25 !text-brand-200 !border !border-brand-400/30'
									: 'bg-brand-500/10 dark:bg-brand-400/10 text-brand-700 dark:text-brand-300 border border-brand-500/20 dark:border-brand-400/20'"
							>
								#{{ post.tags[0] }}
							</span>

							<!-- Secondary Tag (Desktop only) -->
							<span
								v-if="post.tags?.[1]"
								class="hidden items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium sm:inline-flex"
								:class="currentPage === 1 && index === 0 && selectedTag === 'ALL'
									? '!bg-white/15 !text-slate-100 !border !border-white/20'
									: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50'"
							>
								#{{ post.tags[1] }}
							</span>

							<!-- Extra Tags Count Pill -->
							<span
								v-if="post.tags && post.tags.length > 2"
								class="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-mono"
								:class="currentPage === 1 && index === 0 && selectedTag === 'ALL'
									? '!bg-white/15 !text-brand-200'
									: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'"
							>
								+{{ post.tags.length - 2 }}
							</span>
						</div>

						<!-- Date Badge -->
						<div
							v-if="post.date"
							class="mb-3.5 flex items-center"
						>
							<span
								class="shadow-xs inline-flex items-center gap-1.5 border rounded-full px-2.5 py-0.5 text-[11px] font-bold font-mono transition-colors"
								:class="currentPage === 1 && index === 0 && selectedTag === 'ALL'
									? 'bg-white/15 text-white border-white/20'
									: 'border-slate-200/90 bg-slate-100 text-slate-800 dark:border-slate-700/80 dark:bg-slate-800/90 dark:text-slate-200'"
							>
								<span
									class="i-hugeicons-calendar-03 text-xs"
									:class="currentPage === 1 && index === 0 && selectedTag === 'ALL' ? 'text-accent' : 'text-brand-600 dark:text-brand-400'"
								/>
								<span>{{ formatDate(post.date) }}</span>
							</span>
						</div>

						<!-- Title -->
						<h2
							class="sm:text-2xls line-clamp-2 text-xl font-bold leading-snug font-heading transition-colors duration-200 lg:text-2xl"
							:class="currentPage === 1 && index === 0 && selectedTag === 'ALL'
								? '!text-white group-hover:!text-accent md:text-3xl lg:text-4xl'
								: 'text-slate-900 dark:text-slate-100 group-hover:text-brand-900 dark:group-hover:text-accent'"
						>
							{{ post.title }}
						</h2>

						<!-- Description -->
						<p
							class="line-clamp-2 mt-2 text-xs leading-relaxed transition-colors duration-200 sm:text-sm"
							:class="currentPage === 1 && index === 0 && selectedTag === 'ALL'
								? '!text-slate-100 group-hover:!text-white'
								: 'text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'"
						>
							{{ post.description }}
						</p>
					</div>

					<!-- Footer Meta -->
					<div
						class="mt-5 flex items-center justify-between border-t pt-3.5 text-xs"
						:class="currentPage === 1 && index === 0 && selectedTag === 'ALL'
							? '!border-white/20 !text-slate-200'
							: 'border-slate-200/60 dark:border-slate-800/60 text-slate-600 dark:text-slate-400'"
					>
						<span class="flex items-center gap-1.5 text-[11px] font-mono">
							<span
								class="i-hugeicons-clock-01 text-xs"
								:class="currentPage === 1 && index === 0 && selectedTag === 'ALL' ? '!text-brand-300' : 'text-brand-700 dark:text-brand-400'"
							/>
							{{ locale === 'id' ? `${post.readingTime || 5} menit baca` : `${post.readingTime || 5} min read` }}
						</span>
						<span
							class="flex items-center gap-1 text-xs font-bold transition-all group-hover:translate-x-0.5"
							:class="currentPage === 1 && index === 0 && selectedTag === 'ALL'
								? '!text-white group-hover:!text-accent font-bold'
								: 'text-brand-800 dark:text-brand-300 group-hover:text-brand-950 dark:group-hover:text-accent font-semibold'"
						>
							{{ locale === 'id' ? 'Baca Artikel' : 'Read Article' }} <span class="i-hugeicons-arrow-right-01 text-xs" />
						</span>
					</div>
				</NuxtLink>
			</div>

			<!-- Bento SEO-Friendly Pagination -->
			<nav
				v-if="totalPages > 1"
				:aria-label="locale === 'id' ? 'Navigasi Halaman Artikel' : 'Article Page Navigation'"
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
		</template>

		<!-- Empty State -->
		<EmptyState
			v-else
			icon="i-hugeicons-search-01"
			title="Tidak Ada Artikel Ditemukan"
			description="Coba ubah kata kunci pencarian atau pilih filter kategori topik lain."
			:actions="[{ label: 'Reset Filter', to: localePath('/blog') }]"
		/>
	</div>
</template>
