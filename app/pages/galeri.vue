<script setup lang="ts">
import type { GalleryItem } from '~~/server/api/cloudinary-gallery.get'
import { onClickOutside } from '@vueuse/core'

const { locale } = useI18n()

// 1. Fetch page data (pages_id atau pages_en)
const pageCollection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
const currentPath = computed(() => (locale.value === 'id' ? '/id/galeri' : '/en/gallery'))

const { data: page } = await useAsyncData(
	() => `galeri-page-${locale.value}`,
	() => queryCollection(pageCollection.value).path(currentPath.value).first(),
	{ watch: [locale] },
)

// 2. Fetch gallery items dari Cloudinary API
const { data: cloudinaryItems } = await useAsyncData<GalleryItem[]>(
	'cloudinary-gallery-list',
	() => $fetch('/api/cloudinary-gallery').catch(() => []),
)

const allItems = computed(() => cloudinaryItems.value || [])

// Filter Tag
const selectedTag = ref<string>('ALL')
const isTagDropdownOpen = ref(false)
const tagDropdownRef = ref<HTMLElement | null>(null)
const tagSearchQuery = ref('')

onClickOutside(tagDropdownRef, () => {
	if (isTagDropdownOpen.value) {
		isTagDropdownOpen.value = false
	}
})

const availableTags = computed(() => {
	const tagSet = new Set<string>()
	allItems.value.forEach((item: any) => {
		if (Array.isArray(item.tags)) {
			item.tags.forEach((tag: string) => tagSet.add(tag))
		}
	})
	return Array.from(tagSet).sort()
})

const filteredDropdownTags = computed(() => {
	const q = tagSearchQuery.value.trim().toLowerCase()
	if (!q)
		return availableTags.value
	return availableTags.value.filter((t: string) => t.toLowerCase().includes(q))
})

function selectTag(tag: string) {
	selectedTag.value = tag
	isTagDropdownOpen.value = false
	tagSearchQuery.value = ''
}

const tagCounts = computed(() => {
	const map: Record<string, number> = {}
	allItems.value.forEach((item: any) => {
		if (Array.isArray(item.tags)) {
			item.tags.forEach((tag: string) => {
				map[tag] = (map[tag] || 0) + 1
			})
		}
	})
	return map
})

const filteredGallery = computed(() => {
	if (selectedTag.value === 'ALL')
		return allItems.value
	return allItems.value.filter((item: any) => item.tags?.includes(selectedTag.value))
})

// 3. INFINITE SCROLL & BATCH LOADING (8 foto per batch agar sangat ringan dan bebas lag)
const itemsPerPage = 8
const currentLimit = ref(itemsPerPage)

// Reset limit saat filter tag berganti
watch(selectedTag, () => {
	currentLimit.value = itemsPerPage
})

const displayedItems = computed(() => {
	return filteredGallery.value.slice(0, currentLimit.value)
})

const hasMore = computed(() => {
	return currentLimit.value < filteredGallery.value.length
})

const isLoadingMore = ref(false)

function loadMore() {
	if (isLoadingMore.value || !hasMore.value)
		return
	isLoadingMore.value = true
	setTimeout(() => {
		currentLimit.value += itemsPerPage
		isLoadingMore.value = false
	}, 300)
}

// Intersection Observer Sentinel for Auto Infinite Scroll
const sentinelEl = ref<HTMLElement | null>(null)

onMounted(() => {
	if (typeof IntersectionObserver !== 'undefined') {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && hasMore.value) {
					loadMore()
				}
			},
			{ rootMargin: '250px' },
		)

		if (sentinelEl.value) {
			observer.observe(sentinelEl.value)
		}

		watch(sentinelEl, (newEl) => {
			if (newEl)
				observer.observe(newEl)
		})
	}
})

// 4. Single Photo Modal (Progressive Instant Preview)
const selectedPhoto = ref<any | null>(null)
const isModalImageLoaded = ref(false)

function openModal(item: any) {
	selectedPhoto.value = item
	isModalImageLoaded.value = false
}

function closeModal() {
	selectedPhoto.value = null
	isModalImageLoaded.value = false
}

onMounted(() => {
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && selectedPhoto.value) {
			closeModal()
		}
	}
	window.addEventListener('keydown', handleKeydown)
	onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
})

const site = useSiteConfig()
const canonicalUrl = computed(() => `${site.url}/${locale.value}/${locale.value === 'id' ? 'galeri' : 'gallery'}`)

useHead({
	link: [
		{
			rel: 'canonical',
			href: () => canonicalUrl.value,
		},
	],
})

useSeoMeta({
	title: () => page.value?.title,
	description: () => page.value?.description,
	author: () => 'Dinar Permadi Yusup',
	colorScheme: 'light dark',
	themeColor: '#14b898',
	ogTitle: () => page.value?.title,
	ogDescription: () => page.value?.description,
	ogImageAlt: () => page.value?.title,
	ogType: 'website',
	ogUrl: () => canonicalUrl.value,
	ogSiteName: 'Permadi',
	ogLocale: () => (locale.value === 'id' ? 'id_ID' : 'en_US'),
	twitterCard: 'summary_large_image',
	twitterSite: '@dinarpermadi07',
	twitterCreator: '@dinarpermadi07',
	twitterTitle: () => page.value?.title,
	twitterDescription: () => page.value?.description,
	robots: 'index, follow, max-image-preview:large',
})

defineOgImage('Bento', {
	title: page.value?.title,
	description: page.value?.description,
	category: locale.value === 'id' ? 'Galeri Visual & Dokumentasi' : 'Visual Gallery & Documentation',
})

useSchemaOrg([
	defineWebPage({
		'@type': ['CollectionPage', 'ImageGallery'],
		'name': () => page.value?.title || (locale.value === 'id' ? 'Galeri Visual & Dokumentasi' : 'Visual Gallery & Documentation'),
		'description': () => page.value?.description || '',
		'url': () => canonicalUrl.value,
	}),
	defineBreadcrumb({
		itemListElement: [
			{
				name: (): string => (locale.value === 'id' ? 'Beranda' : 'Home'),
				item: (): string => `/${locale.value}`,
			},
			{
				name: (): string => (locale.value === 'id' ? 'Galeri' : 'Gallery'),
				item: (): string => canonicalUrl.value,
			},
		],
	}),
	// Google Images Licensable & Metadata Schema
	...computed(() => {
		const licenseUrl = 'https://creativecommons.org/licenses/by-nc-nd/4.0/'
		const acquirePage = `${site.url}/${locale.value}/${locale.value === 'id' ? 'kontak' : 'contact'}`
		return allItems.value.map((item: any) => ({
			'@type': 'ImageObject',
			'contentUrl': item.full_image || item.secure_url || item.image,
			'url': item.full_image || item.secure_url || item.image,
			'name': item.title || item.alt || 'Permadi Visual Artwork',
			'caption': item.alt || item.title || 'Dokumentasi visual dan karya desain Dinar Permadi Yusup',
			'description': item.alt || item.title || (locale.value === 'id' ? 'Karya visual dan dokumentasi desain grafis Dinar Permadi Yusup.' : 'Visual artwork and design documentation by Dinar Permadi Yusup.'),
			'license': licenseUrl,
			'acquireLicensePage': acquirePage,
			'creditText': 'Dinar Permadi Yusup | Permadi',
			'copyrightNotice': '© Dinar Permadi Yusup',
			'datePublished': item.created_at ? new Date(item.created_at).toISOString() : undefined,
			'creator': {
				'@id': 'https://permadi.dev/#identity',
			},
		}))
	}).value,
])
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<!-- Header (Clean Bento Style without gradient) -->
		<header
			class="bento-card-clean relative z-30 mb-8 bg-slate-50/70 p-6 sm:mb-10 !overflow-visible dark:bg-slate-900/60 sm:p-8"
		>
			<div class="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
				<!-- Sisi Kiri: Eyebrow + Judul + Deskripsi -->
				<div class="max-w-2xl">
					<div class="mb-3.5 inline-flex items-center border border-brand-200/60 rounded-xl bg-brand-100/70 px-3 py-1 text-xs text-brand-950 font-semibold dark:border-brand-800/60 dark:bg-brand-950 dark:text-brand-300">
						<span>{{ page?.eyebrow || (locale === 'id' ? 'Dokumentasi & Visual' : 'Snapshots & Visuals') }}</span>
					</div>

					<h1 class="heading-page">
						{{ page?.title || (locale === 'id' ? 'Galeri Visual' : 'Visual Gallery') }}
					</h1>

					<p class="heading-page-sub">
						{{ page?.description || (locale === 'id' ? 'Koleksi dokumentasi workspace, seni visual, dan tangkapan karya yang dioptimasi via Cloudinary CDN.' : 'A curated collection of visual experiments, photography, and workspace snapshots served via Cloudinary CDN.') }}
					</p>
				</div>

				<!-- Sisi Kanan / Actions: Total Foto & Tag Dropdown Filter -->
				<!-- Mobile: grid 2 kolom simetris; Desktop: flex-col teratur -->
				<div class="z-20 grid grid-cols-2 w-full shrink-0 gap-2.5 md:w-auto md:flex md:flex-col">
					<!-- Mini Bento Stat Pill: Total Foto -->
					<div class="shadow-xs h-11 flex items-center gap-2 border border-slate-200/70 rounded-xl bg-white px-3.5 md:w-48 dark:border-slate-700/60 dark:bg-slate-800/80 sm:px-4">
						<span class="i-hugeicons-image-02 shrink-0 text-sm text-brand-700 dark:text-brand-400" />
						<span class="truncate text-xs text-slate-800 font-bold font-mono dark:text-slate-100">
							{{ allItems?.length || 0 }} {{ locale === 'id' ? 'Foto' : 'Photos' }}
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
									{{ selectedTag === 'ALL' ? (locale === 'id' ? 'Semua Topik' : 'All Topics') : `#${selectedTag}` }}
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
									v-if="availableTags.length > 5"
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
											{{ allItems?.length || 0 }}
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
											<span class="truncate">#{{ tag }}</span>
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
										class="py-4 text-center text-xs text-slate-500"
									>
										{{ locale === 'id' ? 'Tag tidak ditemukan' : 'No tag found' }}
									</div>
								</div>
							</div>
						</Transition>
					</div>
				</div>
			</div>
		</header>

		<!-- Bento Grid Gallery (2 Kolom di Mobile, 12 Kolom di Desktop) -->
		<div
			v-if="displayedItems.length > 0"
			class="grid grid-cols-2 gap-3 lg:grid-cols-12 sm:gap-4"
		>
			<div
				v-for="(item, i) in displayedItems"
				:key="item.public_id || i"
				tabindex="0"
				role="button"
				:aria-label="item.title || (locale === 'id' ? 'Buka foto galeri' : 'Open gallery photo')"
				class="group bento-card-outline relative cursor-pointer overflow-hidden bento-lift rounded-xl bg-slate-100 sm:rounded-bento dark:bg-slate-800 !p-0"
				:class="i % 5 === 0 ? 'col-span-2 lg:col-span-8 aspect-video' : (i % 5 === 1 ? 'col-span-1 lg:col-span-4 aspect-square sm:aspect-auto' : 'col-span-1 lg:col-span-4 aspect-square sm:aspect-video')"
				@click="openModal(item)"
				@keydown.enter.prevent="openModal(item)"
				@keydown.space.prevent="openModal(item)"
			>
				<!-- Background Microscopic LQIP Placeholder (Instan ~150 bytes) -->
				<img
					v-if="item.placeholder_image"
					:src="item.placeholder_image"
					:alt="item.title || 'Placeholder'"
					aria-hidden="true"
					width="20"
					height="20"
					class="pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover blur-md filter"
				>

				<!-- Gambar List Cepat & Ringan (Direct Cloudinary CDN URL) -->
				<img
					:src="item.image"
					:alt="item.title || (locale === 'id' ? 'Foto galeri' : 'Gallery photo')"
					decoding="async"
					:width="item.width || 360"
					:height="item.height || 360"
					class="relative z-1 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
					:loading="i < 2 ? 'eager' : 'lazy'"
					:fetchpriority="i === 0 ? 'high' : 'auto'"
				>

				<!-- Overlay on Hover -->
				<div class="absolute inset-0 flex flex-col justify-end from-slate-950/80 via-slate-950/20 to-transparent bg-gradient-to-t p-2.5 text-white opacity-0 transition-opacity duration-300 sm:p-4 group-hover:opacity-100">
					<div class="flex items-center justify-between gap-1 sm:gap-2">
						<h2 class="truncate text-xs text-white font-semibold font-heading transition-colors duration-100 sm:text-sm group-hover:text-brand-300 dark:group-hover:text-accent">
							{{ item.title }}
						</h2>
						<span class="shrink-0 rounded-full bg-white/20 p-1 backdrop-blur-md sm:p-1.5">
							<span class="i-hugeicons-search-01 text-[10px] sm:text-xs" />
						</span>
					</div>
					<div
						v-if="item.tags && item.tags.length"
						class="mt-1 flex flex-wrap gap-1 sm:mt-1.5"
					>
						<span
							v-for="tag in item.tags.slice(0, 2)"
							:key="tag"
							class="max-w-[80px] truncate rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] text-slate-200 backdrop-blur-md sm:px-2 sm:text-[10px]"
						>
							#{{ tag }}
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Infinite Scroll Trigger Sentinel & Loading Indicator -->
		<div
			ref="sentinelEl"
			class="flex flex-col items-center justify-center py-8"
		>
			<div
				v-if="isLoadingMore"
				class="flex items-center gap-2 text-meta text-xs text-brand-800 font-medium dark:text-brand-400"
			>
				<span class="i-hugeicons-loading-03 animate-spin text-base" />
				{{ locale === 'id' ? 'Memuat foto lainnya...' : 'Loading more photos...' }}
			</div>

			<button
				v-else-if="hasMore"
				type="button"
				class="btn-ghost inline-flex cursor-pointer items-center gap-1.5 border border-slate-300 px-5 py-2 text-xs font-semibold dark:border-slate-700 hover:border-brand-700 dark:hover:border-brand-500"
				@click="loadMore"
			>
				<span class="i-hugeicons-arrow-down-01 text-sm" />
				{{ locale === 'id' ? 'Muat Lebih Banyak Foto' : 'Load More Photos' }}
			</button>
		</div>

		<!-- Empty State -->
		<div
			v-if="displayedItems.length === 0"
			class="bento-card-subtle py-16 text-center"
		>
			<span class="i-hugeicons-image-02 mx-auto mb-2 block text-4xl text-slate-400 opacity-50" />
			<p class="text-base text-slate-700 font-medium dark:text-slate-300">
				{{ locale === 'id' ? 'Belum ada foto galeri yang ditemukan' : 'No gallery photos found' }}
			</p>
			<p class="mt-1 text-meta text-xs">
				{{ locale === 'id' ? 'Pastikan folder "gallery" di Cloudinary telah memiliki aset foto.' : 'Make sure the "gallery" folder in your Cloudinary account has uploaded photos.' }}
			</p>
		</div>

		<!-- Page Content Markdown if any -->
		<article
			v-if="page"
			class="mt-12 max-w-3xl prose prose-slate dark:prose-invert"
		>
			<ContentRenderer :value="page" />
		</article>

		<!-- SINGLE PHOTO MODAL (Wrapped in ClientOnly with Symmetrical Actions) -->
		<ClientOnly>
			<Teleport to="body">
				<Transition
					enter-active-class="transition duration-200 ease-out"
					enter-from-class="opacity-0 scale-95"
					enter-to-class="opacity-100 scale-100"
					leave-active-class="transition duration-150 ease-in"
					leave-from-class="opacity-100 scale-100"
					leave-to-class="opacity-0 scale-95"
				>
					<div
						v-if="selectedPhoto"
						class="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/90 p-3 backdrop-blur-md sm:p-6"
						@click.self="closeModal"
					>
						<div class="relative max-w-4xl w-full flex flex-col items-center">
							<!-- Symmetrical Modal Header Bar -->
							<div class="mb-3 w-full flex items-center justify-between px-1">
								<span class="max-w-[70%] truncate text-sm text-white/90 font-semibold font-heading">
									{{ selectedPhoto.title }}
								</span>
								<div class="flex items-center gap-2">
									<!-- Open High Res Direct Link Button -->
									<a
										v-if="selectedPhoto.full_image || selectedPhoto.image"
										:href="selectedPhoto.full_image || selectedPhoto.image"
										target="_blank"
										rel="noopener"
										class="h-9 w-9 inline-flex cursor-pointer items-center justify-center border border-white/15 rounded-full bg-slate-900/80 text-white/80 backdrop-blur-md transition hover:border-brand-400/50 hover:bg-slate-800 hover:text-white"
										:aria-label="locale === 'id' ? 'Buka resolusi penuh' : 'Open full resolution'"
										:title="locale === 'id' ? 'Buka resolusi penuh' : 'Open full resolution'"
									>
										<span class="i-hugeicons-maximize-02 text-base" />
									</a>
									<!-- Close Button -->
									<button
										type="button"
										class="h-9 w-9 inline-flex cursor-pointer items-center justify-center border border-white/15 rounded-full bg-slate-900/80 text-white/80 backdrop-blur-md transition hover:border-red/50 hover:bg-slate-800 hover:text-white"
										:aria-label="locale === 'id' ? 'Tutup' : 'Close'"
										@click="closeModal"
									>
										<span class="i-hugeicons-cancel-01 text-base" />
									</button>
								</div>
							</div>

							<!-- High Quality Single Image with Progressive Cached Placeholder -->
							<div class="relative max-h-[80vh] min-h-[240px] w-full flex items-center justify-center overflow-hidden border border-white/10 rounded-bento bg-slate-900/90 shadow-2xl sm:min-h-[360px]">
								<!-- 1. Blurred instant placeholder from already cached grid thumbnail (0ms rendering delay) -->
								<img
									:src="selectedPhoto.image"
									:alt="selectedPhoto.title"
									aria-hidden="true"
									class="pointer-events-none absolute inset-0 h-full w-full scale-105 object-contain opacity-50 blur-lg filter transition-opacity duration-500"
									:class="isModalImageLoaded ? 'opacity-0' : 'opacity-50'"
								>

								<!-- 2. Optimized crisp modal preview image (loads fast ~80-120KB) -->
								<img
									:src="selectedPhoto.preview_image || selectedPhoto.image"
									:alt="selectedPhoto.title"
									decoding="async"
									class="relative z-10 max-h-[75vh] max-w-full w-auto rounded-bento object-contain transition-opacity duration-300"
									:class="isModalImageLoaded ? 'opacity-100' : 'opacity-0'"
									@load="isModalImageLoaded = true"
								>

								<!-- 3. Micro loading indicator while HD visual is decoding -->
								<div
									v-if="!isModalImageLoaded"
									class="absolute z-20 flex items-center gap-2 border border-white/10 rounded-full bg-slate-950/75 px-3 py-1.5 text-xs text-white/90 backdrop-blur-md"
								>
									<span class="i-hugeicons-loading-03 animate-spin text-sm text-brand-400" />
									<span>{{ locale === 'id' ? 'Memuat visual HD...' : 'Loading HD visual...' }}</span>
								</div>
							</div>

							<!-- Caption Details & Tags -->
							<div class="mt-3.5 w-full flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-white/80">
								<div
									v-if="selectedPhoto.tags && selectedPhoto.tags.length"
									class="flex flex-wrap items-center gap-1.5"
								>
									<span
										v-for="tag in selectedPhoto.tags"
										:key="tag"
										class="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] text-white"
									>
										#{{ tag }}
									</span>
								</div>
							</div>
						</div>
					</div>
				</Transition>
			</Teleport>
		</ClientOnly>
	</div>
</template>
