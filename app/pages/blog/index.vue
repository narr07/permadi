<script setup lang="ts">
const { locale, t } = useI18n()
const { getCategoryLabel } = useCategoryLabel()
const { formatDate } = useFormatDate()

const pageCollection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
const blogCollection = computed(() => (locale.value === 'id' ? 'blog_id' : 'blog_en'))
const currentPath = computed(() => (locale.value === 'id' ? '/id/blog' : '/blog'))

// Page metadata
const { data: page } = await useAsyncData(
	() => `blog-index-${locale.value}`,
	() => queryCollection(pageCollection.value).path(currentPath.value).select('title', 'description', 'eyebrow').first(),
	{ watch: [locale] },
)

// All blog articles (SSR)
const { data: posts } = await useAsyncData(
	() => `blog-posts-list-${locale.value}`,
	() => queryCollection(blogCollection.value)
		.order('date', 'DESC')
		.all(),
	{ watch: [locale] },
)

function cleanSlug(pathStr: string): string {
	const parts = pathStr.split('/')
	const lastPart = parts[parts.length - 1] || ''
	return lastPart.replace(/^\d+\./, '')
}

// Active filter category ('ALL' | 'edu' | 'tech' | 'art')
const selectedTag = ref<string>('ALL')

// Fixed 3 categories as defined in content.config.ts schema
const blogCategories = ['ALL', 'edu', 'tech', 'art'] as const

function getFilterLabel(key: string): string {
	if (key === 'ALL') {
		return t('blog.filter_all')
	}
	return getCategoryLabel(key)
}

const route = useRoute()
const router = useRouter()

// Pagination: 7 articles per page (1 lead + 6 grid)
const postsPerPage = 7

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

// Filtered articles list strictly by category
const filteredPosts = computed(() => {
	if (!posts.value)
		return []
	return posts.value
		.filter((item: any) => {
			if (selectedTag.value === 'ALL')
				return true
			return String(item.category || '').toLowerCase().trim() === selectedTag.value.toLowerCase().trim()
		})
		.map((item: any, idx: number) => {
			const postSlug = item.slug || cleanSlug(item.path || '')
			const basePath = locale.value === 'id' ? `/id/blog/${postSlug}` : `/blog/${postSlug}`
			return {
				...item,
				url: basePath,
				indexNum: String(idx + 1).padStart(2, '0'),
			}
		})
})

const totalPages = computed(() => {
	return Math.ceil(filteredPosts.value.length / postsPerPage) || 1
})

const paginatedPosts = computed(() => {
	const start = (currentPage.value - 1) * postsPerPage
	return filteredPosts.value.slice(start, start + postsPerPage)
})

const leadPost = computed(() => {
	if (currentPage.value === 1 && selectedTag.value === 'ALL' && paginatedPosts.value.length > 0) {
		return paginatedPosts.value[0]
	}
	return null
})

const gridPosts = computed(() => {
	if (leadPost.value) {
		return paginatedPosts.value.slice(1)
	}
	return paginatedPosts.value
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
	title: computed(() => page.value?.title || (locale.value === 'id' ? 'Blog & Catatan Teknis' : 'Blog & Technical Notes')),
	description: computed(() => page.value?.description || (locale.value === 'id' ? 'Kumpulan tulisan seputar pemrograman web, sistem antarmuka, dan teknologi pendidikan.' : 'Articles and notes on web engineering, UI systems, and education.')),
	ogTitle: computed(() => page.value?.title || 'Blog & Catatan Teknis'),
	ogDescription: computed(() => page.value?.description || 'Arsip catatan teknis Dinar Permadi Yusup.'),
})

defineOgImage('Bento', {
	title: page.value?.title || 'Blog & Catatan Teknis',
	description: page.value?.description || 'Arsip artikel karya Dinar Permadi Yusup.',
})

useSchemaOrg([
	defineWebPage({
		'@type': 'CollectionPage',
	}),
])
</script>

<template>
	<div class="w-full bg-white dark:bg-[#001e1c]">
		<!-- Band 01: Swiss Masthead & Archival Spec Rail (4:8 Asymmetric Split) -->
		<header class="w-full border-b border-slate-200/80 dark:border-[#134e43]">
			<div class="grid grid-cols-1 lg:grid-cols-12">
				<!-- Meta Rail (4 Columns) -->
				<div class="flex flex-col justify-between border-b border-slate-200/80 bg-slate-50/50 p-6 lg:col-span-4 lg:border-b-0 lg:border-r dark:border-[#134e43] dark:bg-[#002420]/40 lg:p-10 sm:p-8">
					<div>
						<div class="mb-4 flex items-center justify-between text-[11px] font-bold tracking-[0.2em] font-mono uppercase">
							<div class="flex items-center gap-2 text-brand-700 dark:text-accent">
								<span class="inline-block h-2 w-2 rounded-none bg-brand-500" />
								<span>{{ $t('blog.arsip_badge') }}</span>
							</div>
							<span class="text-slate-600 tabular-nums dark:text-slate-400">
								{{ $t('blog.vol') }}
							</span>
						</div>

						<span class="mb-1.5 block text-[11px] text-slate-600 tracking-[0.15em] font-mono uppercase dark:text-slate-400">
							{{ $t('blog.category_label') }}
						</span>
						<h2 class="text-2xl text-slate-900 font-700 leading-tight font-heading sm:text-3xl dark:text-slate-50">
							{{ page?.eyebrow || $t('blog.category_fallback') }}
						</h2>
					</div>

					<!-- Spec Parameters Table -->
					<div class="mt-8 border-t border-slate-200/80 pt-6 dark:border-[#134e43]">
						<div class="text-xs font-mono divide-y divide-slate-200/80 dark:divide-[#134e43]">
							<div class="flex items-baseline justify-between py-2">
								<span class="text-slate-700 dark:text-slate-300">{{ $t('blog.total_label') }}</span>
								<span class="text-slate-900 font-bold tabular-nums dark:text-slate-50">{{ posts?.length || 0 }} {{ $t('blog.unit') }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2">
								<span class="text-slate-700 dark:text-slate-300">{{ $t('blog.filter_active') }}</span>
								<span class="text-brand-600 font-bold uppercase dark:text-brand-400">{{ getFilterLabel(selectedTag) }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2">
								<span class="text-slate-700 dark:text-slate-300">{{ $t('blog.status_label') }}</span>
								<span class="text-brand-600 font-semibold dark:text-brand-400">{{ $t('blog.status_published') }}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Typographic Statement Field (8 Columns) -->
				<div class="flex flex-col justify-between p-6 lg:col-span-8 lg:p-12 sm:p-10">
					<div>
						<div class="mb-4 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:text-accent">
							{{ $t('blog.curated_badge') }}
						</div>

						<h1 class="mb-6 text-balance text-3xl text-slate-900 font-900 leading-[0.95] tracking-[-0.035em] font-heading lg:text-6xl sm:text-5xl dark:text-slate-50">
							{{ page?.title || $t('blog.default_title') }}
						</h1>

						<p class="max-w-[56ch] text-base text-slate-800 leading-relaxed font-sans sm:text-lg dark:text-slate-200">
							{{ page?.description || $t('blog.default_description') }}
						</p>
					</div>

					<div class="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-6 text-xs text-slate-600 font-mono dark:border-[#134e43] dark:text-slate-400">
						<span>{{ $t('blog.directory_tag') }}</span>
					</div>
				</div>
			</div>
		</header>

		<!-- Band 02: Architectural Rectangular Filter Strip -->
		<nav
			aria-label="Filter kategori artikel"
			class="w-full flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-slate-50/60 px-6 py-3.5 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/40 sm:px-8"
		>
			<div class="flex flex-wrap items-center gap-2">
				<span class="mr-1 text-[11px] text-slate-600 uppercase dark:text-slate-400">{{ $t('blog.filter_title') }}</span>
				<button
					v-for="catKey in blogCategories"
					:key="catKey"
					type="button"
					class="whitespace-nowrap cursor-pointer border px-3.5 py-1.5 font-bold tracking-wider uppercase transition-all duration-150 active:scale-95 hover:-translate-y-0.5"
					:class="selectedTag === catKey
						? 'swiss-filter-active'
						: 'bg-white dark:bg-[#001e1c] text-slate-800 dark:text-slate-200 border-slate-300 dark:border-[#134e43] hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400'"
					@click="selectTag(catKey)"
				>
					<span>{{ getFilterLabel(catKey) }}</span>
				</button>
			</div>

			<span class="text-[11px] text-slate-600 uppercase tabular-nums dark:text-slate-400">
				{{ $t('blog.showing_count', { count: filteredPosts.length, total: posts?.length || 0 }) }}
			</span>
		</nav>

		<!-- Band 03: Lead Featured Article Plate (When on First Page & All Topics) -->
		<article
			v-if="leadPost"
			class="w-full border-b border-slate-200/80 dark:border-[#134e43]"
		>
			<div class="grid grid-cols-1 lg:grid-cols-12">
				<!-- Lead Article Information (Cols 1 to 7) -->
				<div class="flex flex-col justify-between border-b border-slate-200/80 p-6 lg:col-span-7 lg:border-b-0 lg:border-r dark:border-[#134e43] lg:p-10 sm:p-8">
					<div>
						<div class="mb-4 flex items-center justify-between text-[11px] font-bold tracking-widest font-mono uppercase">
							<span class="text-brand-700 dark:text-accent">
								{{ $t('blog.featured_badge') }}
							</span>
							<span class="text-slate-600 tabular-nums dark:text-slate-400">
								{{ formatDate(leadPost.date) }}
							</span>
						</div>

						<h2 class="mb-4 text-2xl text-slate-900 font-700 leading-tight font-heading sm:text-4xl dark:text-slate-50">
							<NuxtLink
								:to="leadPost.url"
								class="transition-colors hover:text-brand-600"
							>
								{{ leadPost.title }}
							</NuxtLink>
						</h2>

						<p class="mb-6 max-w-[62ch] text-xs text-slate-800 leading-relaxed font-sans sm:text-sm dark:text-slate-200">
							{{ leadPost.description }}
						</p>

						<!-- Tags Strip -->
						<div class="mb-6 flex flex-wrap gap-1.5">
							<span
								v-for="tag in (leadPost.tags || []).slice(0, 5)"
								:key="tag"
								class="border border-slate-300 px-2 py-1 text-[10px] text-slate-800 font-mono uppercase dark:border-[#134e43] dark:text-slate-200"
							>
								#{{ tag }}
							</span>
						</div>
					</div>

					<div class="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/80 pt-6 dark:border-[#134e43]">
						<NuxtLink
							:to="leadPost.url"
							class="group flex cursor-pointer items-center gap-2 bg-brand-500 px-5 py-2.5 text-xs text-slate-950 font-bold tracking-wider font-mono uppercase shadow-xs transition-all duration-150 active:scale-95 hover:bg-brand-400 hover:-translate-y-0.5"
						>
							<span>{{ $t('blog.read_full') }}</span>
							<span class="i-swisspost-arrowupright text-sm transition-transform duration-150 group-hover:(translate-x-0.5 -translate-y-0.5)" />
						</NuxtLink>

						<div class="flex items-center gap-2 text-xs text-slate-700 font-mono dark:text-slate-300">
							<span class="inline-block h-1.5 w-1.5 rounded-none bg-brand-500" />
							<span>{{ leadPost.readingTime || 5 }} {{ $t('blog.min_read') }}</span>
						</div>
					</div>
				</div>

				<!-- Right Editorial Excerpt Frame (Cols 8 to 12) -->
				<div class="flex flex-col justify-between bg-slate-50/40 p-6 lg:col-span-5 dark:bg-[#002420]/20 lg:p-10 sm:p-8">
					<div>
						<div class="mb-4 text-[10px] text-slate-600 tracking-widest font-mono uppercase dark:text-slate-400">
							{{ $t('blog.summary_badge') }}
						</div>

						<blockquote class="mb-6 border-l-2 border-brand-500 pl-4 text-xl text-slate-900 font-700 leading-snug font-heading sm:text-2xl dark:text-slate-50">
							{{ $t('blog.quote_text') }}
						</blockquote>

						<div class="text-xs text-slate-700 font-mono space-y-2 dark:text-slate-300">
							<div class="flex items-center justify-between border-b border-slate-200/60 py-1.5 dark:border-[#134e43]">
								<span>{{ $t('blog.author_label') }}</span>
								<span class="text-slate-900 font-semibold dark:text-slate-50">{{ $t('blog.author_name') }}</span>
							</div>
							<div class="flex items-center justify-between border-b border-slate-200/60 py-1.5 dark:border-[#134e43]">
								<span>{{ $t('blog.category') }}</span>
								<span class="text-brand-600 font-bold uppercase dark:text-brand-400">{{ getCategoryLabel(leadPost.category) }}</span>
							</div>
							<div class="flex items-center justify-between py-1.5">
								<span>{{ $t('blog.license_label') }}</span>
								<span>{{ $t('blog.license_value') }}</span>
							</div>
						</div>
					</div>

					<div class="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-4 text-[10px] text-slate-600 tracking-widest font-mono uppercase dark:border-[#134e43] dark:text-slate-400">
						<span>{{ $t('blog.ref_badge') }}</span>
						<span>{{ $t('blog.dispatch_badge') }}</span>
					</div>
				</div>
			</div>
		</article>

		<!-- Band 04: Continuous Sequential Modular Grid for Other Articles -->
		<div
			v-if="gridPosts.length > 0"
			class="w-full border-b border-slate-200/80 dark:border-[#134e43]"
		>
			<div class="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 divide-y divide-slate-200/80 md:divide-y-0 dark:divide-[#134e43]">
				<article
					v-for="(item, idx) in gridPosts"
					:key="item.url"
					class="group flex flex-col justify-between p-6 transition-all duration-200 hover:(bg-[#e2f4f0] -translate-y-0.5 dark:bg-[#003832]) sm:p-8"
					:class="[
						idx % 3 !== 2 ? 'lg:border-r border-slate-200/80 dark:border-[#134e43]' : '',
						idx % 2 !== 1 ? 'md:border-r lg:border-r-0 border-slate-200/80 dark:border-[#134e43]' : '',
						idx >= 3 ? 'lg:border-t border-slate-200/80 dark:border-[#134e43]' : '',
						idx >= 2 ? 'md:border-t lg:border-t-0 border-slate-200/80 dark:border-[#134e43]' : '',
					]"
				>
					<div>
						<!-- Item Meta -->
						<div class="mb-3 flex items-center justify-between text-[11px] font-mono">
							<span class="text-brand-600 font-bold uppercase dark:text-brand-400">
								{{ $t('blog.item_badge', { num: item.indexNum }) }} // [{{ getCategoryLabel(item.category) }}]
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

						<p class="line-clamp-3 mb-6 text-xs text-slate-700 leading-relaxed font-sans sm:text-sm dark:text-slate-300">
							{{ item.description }}
						</p>
					</div>

					<div class="flex items-center justify-between border-t border-slate-200/80 pt-4 dark:border-[#134e43]">
						<NuxtLink
							:to="item.url"
							class="inline-flex items-center gap-1.5 text-xs text-slate-900 font-bold tracking-wider font-mono uppercase transition-all duration-150 active:scale-95 dark:text-slate-50 group-hover:text-brand-600 hover:-translate-y-0.5 dark:group-hover:text-brand-400"
						>
							<span>{{ $t('blog.read_note') }}</span>
							<span class="i-swisspost-arrowupright text-sm transition-transform group-hover:(translate-x-0.5 -translate-y-0.5)" />
						</NuxtLink>

						<span class="text-[11px] text-slate-600 font-mono tabular-nums dark:text-slate-400">
							{{ item.readingTime || 4 }} {{ $t('blog.min_read') }}
						</span>
					</div>
				</article>
			</div>
		</div>

		<!-- Empty State -->
		<div
			v-else-if="!leadPost"
			class="border-b border-slate-200/80 p-12 text-center dark:border-[#134e43]"
		>
			<span class="mb-2 block text-sm text-slate-600 tracking-widest font-mono uppercase dark:text-slate-400">
				{{ $t('blog.empty_title') }}
			</span>
			<p class="mb-4 text-xs text-slate-700 font-sans dark:text-slate-300">
				{{ $t('blog.empty_desc', { tag: getFilterLabel(selectedTag) }) }}
			</p>
			<button
				type="button"
				class="border border-slate-900 px-4 py-2 text-xs font-bold tracking-wider font-mono uppercase dark:border-slate-50"
				@click="selectTag('ALL')"
			>
				{{ $t('blog.reset_filter') }}
			</button>
		</div>

		<!-- Band 05: Pagination Strip -->
		<nav
			v-if="totalPages > 1"
			:aria-label="locale === 'id' ? 'Navigasi Halaman Blog' : 'Blog Page Navigation'"
			class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 bg-slate-50/50 px-6 py-6 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/30 sm:px-8"
		>
			<div class="flex items-center gap-2">
				<span class="text-slate-600 uppercase dark:text-slate-400">{{ $t('blog.page_label') }}</span>
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
					{{ $t('blog.prev') }}
				</NuxtLink>
				<NuxtLink
					v-if="currentPage < totalPages"
					:to="getPaginationUrl(currentPage + 1)"
					class="border border-slate-300 px-3 py-1.5 font-bold uppercase transition-colors dark:border-[#134e43] hover:border-brand-500"
				>
					{{ $t('blog.next') }}
				</NuxtLink>
			</div>
		</nav>

		<!-- Bottom Archival Colophon -->
		<div class="flex flex-col items-start justify-between gap-2 bg-slate-50/80 px-6 py-4 text-[11px] text-slate-600 font-mono sm:flex-row sm:items-center dark:bg-[#002420]/60 sm:px-8 dark:text-slate-400">
			<div>
				{{ $t('blog.footer_colophon') }}
			</div>
			<div>
				{{ $t('blog.location') }}
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
