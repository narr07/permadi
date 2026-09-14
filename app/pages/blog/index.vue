<script setup lang="ts">
const { locale } = useI18n()
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

// Active filter tag
const selectedTag = ref<string>('ALL')

// Extract top unique tags/categories
const filterTabs = computed(() => {
	if (!posts.value)
		return ['ALL']
	const tagsSet = new Set<string>()
	posts.value.forEach((item: any) => {
		if (item.category) {
			tagsSet.add(String(item.category).trim().toUpperCase())
		}
		const tags = item.tags || []
		tags.forEach((t: string) => {
			const upper = String(t).trim().toUpperCase()
			if (['NUXT', 'VUE', 'CSS', 'TAILWIND', 'PENDIDIKAN', 'DESAIN', 'PERFORMANCE', 'TUTORIAL'].includes(upper)) {
				tagsSet.add(upper)
			}
		})
	})
	return ['ALL', ...Array.from(tagsSet)]
})

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

// Filtered articles list
const filteredPosts = computed(() => {
	if (!posts.value)
		return []
	return posts.value
		.filter((item: any) => {
			if (selectedTag.value === 'ALL')
				return true
			const target = selectedTag.value.toUpperCase()
			const cat = String(item.category || '').toUpperCase()
			const tags = (item.tags || []).map((t: string) => String(t).toUpperCase())
			return cat === target || tags.includes(target)
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
								<span>{{ locale === 'id' ? '02 // ARSIP TULISAN' : '02 // WRITING ARCHIVE' }}</span>
							</div>
							<span class="text-slate-600 tabular-nums dark:text-slate-400">
								VOL. 26
							</span>
						</div>

						<span class="mb-1.5 block text-[11px] text-slate-600 tracking-[0.15em] font-mono uppercase dark:text-slate-400">
							{{ locale === 'id' ? 'KLASIFIKASI NASKAH' : 'ARCHIVE INDEX' }}
						</span>
						<h2 class="text-2xl text-slate-900 font-700 leading-tight font-heading sm:text-3xl dark:text-slate-50">
							{{ page?.eyebrow || (locale === 'id' ? 'Catatan & Esai' : 'Writing & Essays') }}
						</h2>
					</div>

					<!-- Spec Parameters Table -->
					<div class="mt-8 border-t border-slate-200/80 pt-6 dark:border-[#134e43]">
						<div class="text-xs font-mono divide-y divide-slate-200/80 dark:divide-[#134e43]">
							<div class="flex items-baseline justify-between py-2">
								<span class="text-slate-700 dark:text-slate-300">{{ locale === 'id' ? 'TOTAL NASKAH' : 'TOTAL ARTICLES' }}</span>
								<span class="text-slate-900 font-bold tabular-nums dark:text-slate-50">{{ posts?.length || 0 }} {{ locale === 'id' ? 'Artikel' : 'Articles' }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2">
								<span class="text-slate-700 dark:text-slate-300">{{ locale === 'id' ? 'TOPIK AKTIF' : 'ACTIVE TOPIC' }}</span>
								<span class="text-brand-600 font-bold uppercase dark:text-brand-400">{{ selectedTag === 'ALL' ? (locale === 'id' ? 'SEMUA' : 'ALL') : selectedTag }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2">
								<span class="text-slate-700 dark:text-slate-300">STATUS</span>
								<span class="text-brand-600 font-semibold dark:text-brand-400">{{ locale === 'id' ? 'TERPUBLIKASI' : 'PUBLISHED' }}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Typographic Statement Field (8 Columns) -->
				<div class="flex flex-col justify-between p-6 lg:col-span-8 lg:p-12 sm:p-10">
					<div>
						<div class="mb-4 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:text-accent">
							{{ locale === 'id' ? 'WACANA REKAYASA & PENDIDIKAN // 2024–2026' : 'ENGINEERING & PEDAGOGY DISPATCHES // 2024–2026' }}
						</div>

						<h1 class="mb-6 text-balance text-3xl text-slate-900 font-700 leading-[0.95] tracking-[-0.035em] font-heading lg:text-6xl sm:text-5xl dark:text-slate-50">
							{{ page?.title || (locale === 'id' ? 'Blog & Catatan Lapangan' : 'Blog & Field Notes') }}
						</h1>

						<p class="max-w-[56ch] text-base text-slate-800 leading-relaxed font-sans sm:text-lg dark:text-slate-200">
							{{ page?.description || (locale === 'id' ? 'Kumpulan tulisan terkurasi seputar rekayasa aplikasi web modern, arsitektur sistem komponen, metodologi visual, dan pedagogi pendidikan sekolah dasar.' : 'Curated technical essays on modern web engineering, UI component architecture, visual methodologies, and primary education technology.') }}
						</p>
					</div>

					<div class="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-6 text-xs text-slate-600 font-mono dark:border-[#134e43] dark:text-slate-400">
						<span>{{ locale === 'id' ? 'DIREKTORI ARTIKEL PERMADI.DEV' : 'PERMADI.DEV ARTICLE DIRECTORY' }}</span>
					</div>
				</div>
			</div>
		</header>

		<!-- Band 02: Architectural Rectangular Filter Strip -->
		<nav
			aria-label="Filter topik artikel"
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
				{{ locale === 'id' ? `MENAMPILKAN ${filteredPosts.length} DARI ${posts?.length || 0} NASKAH` : `SHOWING ${filteredPosts.length} OF ${posts?.length || 0} ARTICLES` }}
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
								{{ locale === 'id' ? 'SPESIMEN 01 // NASKAH UTAMA' : 'SPECIMEN 01 // FEATURED ARTICLE' }}
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
							<span>{{ locale === 'id' ? 'BACA NASKAH LENGKAP' : 'READ FULL ARTICLE' }}</span>
							<span class="i-swisspost-arrowupright text-sm transition-transform duration-150 group-hover:(translate-x-0.5 -translate-y-0.5)" />
						</NuxtLink>

						<div class="flex items-center gap-2 text-xs text-slate-700 font-mono dark:text-slate-300">
							<span class="inline-block h-1.5 w-1.5 rounded-none bg-brand-500" />
							<span>{{ leadPost.readingTime || 5 }} {{ locale === 'id' ? 'MENIT BACA' : 'MIN READ' }}</span>
						</div>
					</div>
				</div>

				<!-- Right Editorial Excerpt Frame (Cols 8 to 12) -->
				<div class="flex flex-col justify-between bg-slate-50/40 p-6 lg:col-span-5 dark:bg-[#002420]/20 lg:p-10 sm:p-8">
					<div>
						<div class="mb-4 text-[10px] text-slate-600 tracking-widest font-mono uppercase dark:text-slate-400">
							{{ locale === 'id' ? 'RINGKASAN TEORETIS // ESENSI' : 'THEORETICAL ABSTRACT // CORE' }}
						</div>

						<blockquote class="mb-6 border-l-2 border-brand-500 pl-4 text-xl text-slate-900 font-700 leading-snug font-heading sm:text-2xl dark:text-slate-50">
							{{ locale === 'id' ? '"Arsitektur perangkat lunak yang kokoh bertumpu pada kesederhanaan struktur dan ketelitian batas komponen."' : '"Robust software architecture rests on structural simplicity and clear component boundaries."' }}
						</blockquote>

						<div class="text-xs text-slate-700 font-mono space-y-2 dark:text-slate-300">
							<div class="flex items-center justify-between border-b border-slate-200/60 py-1.5 dark:border-[#134e43]">
								<span>{{ locale === 'id' ? 'PENULIS' : 'AUTHOR' }}</span>
								<span class="text-slate-900 font-semibold dark:text-slate-50">Dinar Permadi Yusup</span>
							</div>
							<div class="flex items-center justify-between border-b border-slate-200/60 py-1.5 dark:border-[#134e43]">
								<span>{{ locale === 'id' ? 'KATEGORI' : 'CATEGORY' }}</span>
								<span class="text-brand-600 font-bold uppercase dark:text-brand-400">{{ getCategoryLabel(leadPost.category) }}</span>
							</div>
							<div class="flex items-center justify-between py-1.5">
								<span>{{ locale === 'id' ? 'LISENSI' : 'LICENSE' }}</span>
								<span>CC BY-NC-SA 4.0</span>
							</div>
						</div>
					</div>

					<div class="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-4 text-[10px] text-slate-600 tracking-widest font-mono uppercase dark:border-[#134e43] dark:text-slate-400">
						<span>REF. 01.01</span>
						<span>{{ locale === 'id' ? 'PUBLIKASI DIGITAL' : 'DIGITAL DISPATCH' }}</span>
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
					class="group flex flex-col justify-between p-6 transition-all duration-150 hover:(bg-slate-50/90 -translate-y-0.5 dark:bg-[#002420]/50) sm:p-8"
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
							<span class="text-brand-600 font-bold dark:text-brand-400">
								SPESIMEN {{ item.indexNum }} // [{{ (item.category || 'UMUM').toUpperCase() }}]
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
							<span>{{ locale === 'id' ? 'BACA CATATAN' : 'READ ARTICLE' }}</span>
							<span class="i-swisspost-arrowupright text-sm transition-transform group-hover:(translate-x-0.5 -translate-y-0.5)" />
						</NuxtLink>

						<span class="text-[11px] text-slate-600 font-mono tabular-nums dark:text-slate-400">
							{{ item.readingTime || 4 }} {{ locale === 'id' ? 'MENIT BACA' : 'MIN READ' }}
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
				{{ locale === 'id' ? 'TIDAK ADA NASKAH DITEMUKAN' : 'NO ARTICLES FOUND' }}
			</span>
			<p class="mb-4 text-xs text-slate-700 font-sans dark:text-slate-300">
				{{ locale === 'id' ? `Tidak ada artikel yang sesuai dengan filter #${selectedTag}.` : `No articles found matching filter #${selectedTag}.` }}
			</p>
			<button
				type="button"
				class="border border-slate-900 px-4 py-2 text-xs font-bold tracking-wider font-mono uppercase dark:border-slate-50"
				@click="selectTag('ALL')"
			>
				{{ locale === 'id' ? 'RESET FILTER' : 'RESET FILTER' }}
			</button>
		</div>

		<!-- Band 05: Pagination Strip -->
		<nav
			v-if="totalPages > 1"
			:aria-label="locale === 'id' ? 'Navigasi Halaman Blog' : 'Blog Page Navigation'"
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
				{{ locale === 'id' ? 'DOKUMENTASI SISTEM REKAYASA & PUBLIKASI // PERMADI.DEV' : 'ENGINEERING SYSTEMS & EDITORIAL ARCHIVE // PERMADI.DEV' }}
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
