<script setup lang="ts">
import type { GalleryItem } from '~~/server/api/cloudinary-gallery.get'
import { onClickOutside } from '@vueuse/core'

const { locale } = useI18n()

// 1. Fetch page metadata
const pageCollection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
const currentPath = computed(() => (locale.value === 'id' ? '/id/galeri' : '/gallery'))

const { data: page } = await useAsyncData(
	() => `galeri-page-${locale.value}`,
	() => queryCollection(pageCollection.value).path(currentPath.value).select('title', 'description', 'eyebrow').first(),
	{ watch: [locale] },
)

// 2. Fetch gallery items from Cloudinary API with SWR
const { data: cloudinaryItems } = await useAsyncData<GalleryItem[]>(
	'cloudinary-gallery-list',
	() => $fetch<GalleryItem[]>('/api/cloudinary-gallery'),
	{
		default: () => [],
	},
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

function selectTag(tag: string) {
	selectedTag.value = tag
	isTagDropdownOpen.value = false
	tagSearchQuery.value = ''
}

const filteredGallery = computed(() => {
	if (selectedTag.value === 'ALL')
		return allItems.value
	return allItems.value.filter((item: any) => item.tags?.includes(selectedTag.value))
})

// 3. Batch Loading & Infinite Scroll
const itemsPerPage = 12
const currentLimit = ref(itemsPerPage)

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
	}, 250)
}

const loadedImages = ref<Record<string, boolean>>({})

function onImageLoad(id: string) {
	loadedImages.value[id] = true
}

const sentinelEl = ref<HTMLElement | null>(null)

onMounted(() => {
	if (typeof IntersectionObserver !== 'undefined') {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && hasMore.value) {
					loadMore()
				}
			},
			{ rootMargin: '300px' },
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

// 4. Single Specimen Modal
const selectedPhoto = ref<any | null>(null)
const currentModalIndex = ref<number>(-1)
const isModalImageLoaded = ref(false)

const hasPrevPhoto = computed(() => currentModalIndex.value > 0)
const hasNextPhoto = computed(() => currentModalIndex.value < filteredGallery.value.length - 1)

function openModal(item: any) {
	const idx = filteredGallery.value.findIndex((p: any) => p.public_id === item.public_id)
	currentModalIndex.value = idx !== -1 ? idx : 0
	selectedPhoto.value = filteredGallery.value[currentModalIndex.value] || item
	isModalImageLoaded.value = false
}

function closeModal() {
	selectedPhoto.value = null
	currentModalIndex.value = -1
	isModalImageLoaded.value = false
}

function prevPhoto() {
	if (hasPrevPhoto.value) {
		currentModalIndex.value--
		selectedPhoto.value = filteredGallery.value[currentModalIndex.value]
		isModalImageLoaded.value = false
	}
}

function nextPhoto() {
	if (hasNextPhoto.value) {
		currentModalIndex.value++
		if (currentModalIndex.value >= currentLimit.value) {
			currentLimit.value = Math.min(filteredGallery.value.length, currentLimit.value + itemsPerPage)
		}
		selectedPhoto.value = filteredGallery.value[currentModalIndex.value]
		isModalImageLoaded.value = false
	}
}

onMounted(() => {
	function handleKeydown(e: KeyboardEvent) {
		if (selectedPhoto.value) {
			if (e.key === 'Escape') {
				closeModal()
			}
			else if (e.key === 'ArrowLeft') {
				prevPhoto()
			}
			else if (e.key === 'ArrowRight') {
				nextPhoto()
			}
		}
	}
	window.addEventListener('keydown', handleKeydown)
	onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
})

const site = useSiteConfig()
const canonicalUrl = computed(() => `${site.url}/${locale.value === 'id' ? 'id/galeri' : 'gallery'}`)

useHead(() => {
	const firstImage = displayedItems.value[0]?.image || allItems.value[0]?.image
	return {
		link: [
			{
				rel: 'canonical',
				href: canonicalUrl.value,
			},
			{
				rel: 'preconnect',
				href: 'https://res.cloudinary.com',
			},
			...(firstImage
				? [
						{
							rel: 'preload',
							as: 'image',
							href: firstImage,
							fetchpriority: 'high',
						},
					]
				: []),
		],
	}
})

useSeoMeta({
	title: () => page.value?.title || (locale.value === 'id' ? 'Galeri Visual & Dokumentasi | Permadi' : 'Visual Gallery & Documentation | Permadi'),
	description: () => page.value?.description || (locale.value === 'id' ? 'Arsip dokumentasi visual, seni grafis, dan fotografi karya Dinar Permadi Yusup.' : 'Visual documentation archive, graphic arts, and photography by Dinar Permadi Yusup.'),
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
	title: page.value?.title || (locale.value === 'id' ? 'Galeri Visual' : 'Visual Gallery'),
	description: page.value?.description || (locale.value === 'id' ? 'Dokumentasi Visual & Fotografi' : 'Visual Documentation & Photography'),
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
])
</script>

<template>
	<div class="w-full bg-white dark:bg-[#001e1c]">
		<header class="w-full border-b border-slate-200/80 p-6 dark:border-[#134e43] lg:p-12 sm:p-10">
			<h1 class="mb-6 text-balance text-3xl text-slate-900 font-900 leading-[0.95] tracking-[-0.035em] font-heading lg:text-6xl sm:text-5xl dark:text-slate-50">
				{{ page?.title || $t('galeri.default_title') }}
			</h1>

			<p class="max-w-[56ch] text-base text-slate-800 leading-relaxed font-sans sm:text-lg dark:text-slate-200">
				{{ page?.description || $t('galeri.default_description') }}
			</p>
		</header>

		<!-- Filter Strip -->
		<nav
			aria-label="Filter galeri visual"
			class="w-full flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-slate-50/60 px-6 py-3.5 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/40 sm:px-8"
		>
			<!-- Tag Filter Buttons -->
			<div class="flex flex-wrap items-center gap-2">
				<!-- All Topics -->
				<button
					type="button"
					class="cursor-pointer whitespace-nowrap border px-3.5 py-1.5 font-bold tracking-wider uppercase transition-all duration-150 active:scale-95 hover:-translate-y-0.5"
					:class="selectedTag === 'ALL'
						? 'swiss-filter-active'
						: 'bg-white dark:bg-[#001e1c] border-slate-300 dark:border-[#134e43] text-slate-800 dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400'"
					@click="selectTag('ALL')"
				>
					<span>{{ $t('galeri.filter_all') }}</span>
				</button>

				<!-- Individual Tags -->
				<button
					v-for="tag in availableTags"
					:key="tag"
					type="button"
					class="cursor-pointer whitespace-nowrap border px-3.5 py-1.5 tracking-wider uppercase transition-all duration-150 active:scale-95 hover:-translate-y-0.5"
					:class="selectedTag === tag
						? 'swiss-filter-active font-bold'
						: 'bg-white dark:bg-[#001e1c] border-slate-300 dark:border-[#134e43] text-slate-800 dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400'"
					@click="selectTag(tag)"
				>
					<span>#{{ tag }}</span>
				</button>
			</div>

			<span class="text-[11px] text-slate-600 uppercase tabular-nums dark:text-slate-400">
				{{ locale === 'id' ? `Menampilkan ${displayedItems.length} dari ${filteredGallery.length} karya` : `Showing ${displayedItems.length} of ${filteredGallery.length} works` }}
			</span>
		</nav>

		<!-- Image Grid -->
		<div
			v-if="displayedItems.length > 0"
			class="w-full border-b border-slate-200/80 dark:border-[#134e43]"
		>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
				<div
					v-for="(item, i) in displayedItems"
					:key="item.public_id || i"
					tabindex="0"
					role="button"
					:aria-label="item.title || (locale === 'id' ? 'Buka foto' : 'Open photo')"
					class="group flex flex-col cursor-pointer select-none justify-between border-b border-slate-200/80 p-6 transition-colors duration-200 dark:border-[#134e43] sm:p-8 hover:(bg-[#e2f4f0] dark:bg-[#003832])"
					:class="[
						i % 3 !== 2 ? 'lg:border-r' : 'lg:border-r-0',
						i % 2 !== 1 ? 'md:border-r' : 'md:border-r-0',
					]"
					@click="openModal(item)"
					@keydown.enter.prevent="openModal(item)"
					@keydown.space.prevent="openModal(item)"
				>
					<div>
						<!-- Image Frame -->
						<div class="mb-4 aspect-[4/3] w-full overflow-hidden border border-slate-200/80 bg-slate-100 relative dark:border-[#134e43] dark:bg-[#001714]">
							<!-- LQIP Pixelated Placeholder -->
							<img
								v-if="item.placeholder_image"
								:src="item.placeholder_image"
								alt=""
								aria-hidden="true"
								decoding="async"
								class="pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
								:class="loadedImages[item.public_id] ? 'opacity-0' : 'opacity-100'"
								style="image-rendering: pixelated;"
							>

							<!-- High-Res Main Image (NuxtImg) -->
							<NuxtImg
								:src="item.secure_url || item.image"
								:alt="item.title || (locale === 'id' ? 'Foto galeri' : 'Gallery photo')"
								format="webp"
								quality="85"
								sizes="xs:100vw sm:100vw md:50vw lg:400px"
								class="relative z-1 h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.03]"
								:class="loadedImages[item.public_id] ? 'opacity-100' : 'opacity-0'"
								:loading="i < 3 ? 'eager' : 'lazy'"
								:fetchpriority="i === 0 ? 'high' : 'auto'"
								@load="onImageLoad(item.public_id)"
							/>
						</div>

						<!-- Photo Details -->
						<div class="mb-2.5 flex flex-wrap gap-1.5" v-if="item.tags && item.tags.length">
							<span
								v-for="tag in item.tags.slice(0, 3)"
								:key="tag"
								class="border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-700 uppercase font-mono dark:border-[#134e43] dark:text-slate-300"
							>
								#{{ tag }}
							</span>
						</div>

						<h2 class="text-base text-slate-900 font-700 leading-snug font-heading transition-colors dark:text-slate-50 group-hover:text-brand-700 dark:group-hover:text-brand-300">
							{{ item.title }}
						</h2>
					</div>
				</div>
			</div>
		</div>

		<!-- Infinite Scroll Trigger Sentinel & Load More Strip -->
		<div
			ref="sentinelEl"
			class="w-full flex flex-col items-center justify-center border-b border-slate-200/80 bg-slate-50/60 p-6 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/30"
		>
			<div
				v-if="isLoadingMore"
				class="flex items-center gap-2 text-brand-700 font-bold tracking-wider uppercase dark:text-accent"
			>
				<span class="i-swisspost-reloadright animate-spin text-sm" />
				<span>{{ locale === 'id' ? 'Memuat foto…' : 'Loading photos…' }}</span>
			</div>

			<button
				v-else-if="hasMore"
				type="button"
				class="flex cursor-pointer items-center gap-2 border border-slate-300 px-5 py-2.5 text-slate-900 font-bold tracking-wider uppercase transition-all duration-150 active:scale-95 dark:border-[#134e43] hover:border-brand-500 dark:text-slate-50 hover:text-brand-600 hover:-translate-y-0.5 dark:hover:text-accent"
				@click="loadMore"
			>
				{{ $t('galeri.load_more') }}
			</button>
		</div>

		<!-- Empty State -->
		<div
			v-if="displayedItems.length === 0"
			class="w-full border-b border-slate-200/80 bg-white p-12 text-center text-xs font-mono dark:border-[#134e43] dark:bg-[#001e1c]"
		>
			<div class="mb-2 text-sm text-brand-600 font-bold dark:text-accent">
				{{ $t('galeri.empty_title') }}
			</div>
			<p class="text-slate-700 dark:text-slate-300">
				{{ $t('galeri.empty_desc') }}
			</p>
		</div>

		<!-- Page Content Markdown if any -->
		<article
			v-if="page"
			class="mx-auto max-w-4xl px-6 py-12 font-sans prose prose-slate dark:prose-invert sm:px-8"
		>
			<ContentRenderer :value="page" />
		</article>

		<!-- Lightbox Modal -->
		<ClientOnly>
			<Teleport to="body">
				<Transition
					enter-active-class="transition duration-150 ease-out"
					enter-from-class="opacity-0 scale-98"
					enter-to-class="opacity-100 scale-100"
					leave-active-class="transition duration-100 ease-in"
					leave-from-class="opacity-100 scale-100"
					leave-to-class="opacity-0 scale-98"
				>
					<div
						v-if="selectedPhoto"
						class="backdrop-blur-xs fixed inset-0 z-100 flex items-center justify-center bg-slate-950/85 p-3 text-xs font-mono sm:p-6"
						@click.self="closeModal"
					>
						<div class="relative max-w-5xl w-full flex flex-col border border-slate-200/80 bg-white shadow-2xl dark:border-[#134e43] dark:bg-[#001e1c]">
							<!-- Inspection Sheet Header -->
							<div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-[#134e43] dark:bg-[#002420]/60 sm:p-4">
								<span class="truncate text-[11px] text-slate-900 font-bold tracking-wider uppercase dark:text-slate-50">
									{{ selectedPhoto.title }}
								</span>

								<!-- Action Controls -->
								<div class="flex items-center gap-2 text-xs font-mono">
									<!-- Prev Button -->
									<button
										type="button"
										:disabled="!hasPrevPhoto"
										class="cursor-pointer border border-slate-300 px-2 py-1 text-[10px] font-bold uppercase transition-all duration-150 dark:border-[#134e43]"
										:class="hasPrevPhoto ? 'hover:border-brand-500 hover:text-brand-600 dark:hover:text-accent hover:-translate-y-0.5 active:scale-95' : 'opacity-40 cursor-not-allowed'"
										:title="$t('galeri.prev_photo_title')"
										@click="prevPhoto"
									>
										{{ $t('galeri.prev_photo') }}
									</button>

									<!-- Next Button -->
									<button
										type="button"
										:disabled="!hasNextPhoto"
										class="cursor-pointer border border-slate-300 px-2 py-1 text-[10px] font-bold uppercase transition-all duration-150 dark:border-[#134e43]"
										:class="hasNextPhoto ? 'hover:border-brand-500 hover:text-brand-600 dark:hover:text-accent hover:-translate-y-0.5 active:scale-95' : 'opacity-40 cursor-not-allowed'"
										:title="$t('galeri.next_photo_title')"
										@click="nextPhoto"
									>
										{{ $t('galeri.next_photo') }}
									</button>

									<!-- Download HD Button -->
									<a
										v-if="selectedPhoto.download_url || selectedPhoto.full_image"
										:href="selectedPhoto.download_url || selectedPhoto.full_image"
										target="_blank"
										rel="noopener"
										download
										class="hidden cursor-pointer items-center gap-1 border border-slate-300 px-2 py-1 text-[10px] font-bold uppercase transition-all duration-150 sm:inline-flex active:scale-95 dark:border-[#134e43] hover:border-brand-500 hover:text-brand-600 hover:-translate-y-0.5 dark:hover:text-accent"
									>
										<span class="i-swisspost-download text-xs" />
										<span>{{ $t('galeri.download_hd') }}</span>
									</a>

									<!-- Close Button -->
									<button
										type="button"
										class="cursor-pointer border border-slate-300 px-2.5 py-1 text-[10px] font-bold uppercase transition-all duration-150 active:scale-95 dark:border-[#134e43] hover:text-rose-600 hover:-translate-y-0.5 dark:hover:text-rose-400"
										:title="$t('galeri.close_title')"
										@click="closeModal"
									>
										✕
									</button>
								</div>
							</div>

							<!-- Image Canvas -->
							<div class="relative max-h-[70vh] min-h-[300px] w-full flex items-center justify-center overflow-hidden bg-slate-950 p-2 sm:p-4">
								<!-- LQIP Pixelated Placeholder (Aktif saat foto modal sedang di-fetch) -->
								<img
									v-if="selectedPhoto.placeholder_image"
									:src="selectedPhoto.placeholder_image"
									alt=""
									aria-hidden="true"
									class="pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ease-out"
									:class="isModalImageLoaded ? 'opacity-0' : 'opacity-100'"
									style="image-rendering: pixelated;"
								>

								<NuxtImg
									:src="selectedPhoto.preview_image || selectedPhoto.full_image || selectedPhoto.image"
									:alt="selectedPhoto.title"
									format="webp"
									quality="90"
									sizes="xs:100vw sm:100vw md:90vw lg:1200px"
									class="relative z-10 max-h-[66vh] max-w-full w-auto object-contain transition-opacity duration-500 ease-out"
									:class="isModalImageLoaded ? 'opacity-100' : 'opacity-0'"
									@load="isModalImageLoaded = true"
								/>
							</div>

							<!-- License & Tags -->
							<div class="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/80 bg-slate-50/80 p-3.5 text-[11px] text-slate-700 dark:border-[#134e43] dark:bg-[#002420]/60 sm:p-4 dark:text-slate-300">
								<span>{{ $t('galeri.license_label') }}</span>

								<div
									v-if="selectedPhoto.tags && selectedPhoto.tags.length"
									class="flex items-center gap-1.5"
								>
									<span
										v-for="tag in selectedPhoto.tags"
										:key="tag"
										class="border border-slate-300 px-1.5 py-0.5 text-[10px] uppercase dark:border-[#134e43]"
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
