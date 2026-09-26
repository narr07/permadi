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

// 2. Fetch gallery items from Cloudinary API with SWR (Lazy & Non-blocking)
const nuxtApp = useNuxtApp()
const { data: cloudinaryItems, refresh: refreshGallery } = await useAsyncData<GalleryItem[]>(
	'cloudinary-gallery-list',
	async () => {
		try {
			const res = await $fetch<GalleryItem[]>('/api/cloudinary-gallery', {
				timeout: 3000,
			})
			if (Array.isArray(res) && res.length > 0) {
				return res
			}
			return (nuxtApp.payload.data['cloudinary-gallery-list'] as GalleryItem[]) || []
		}
		catch (err) {
			console.warn('[Gallery] Failed to fetch latest gallery items:', err)
			return (nuxtApp.payload.data['cloudinary-gallery-list'] as GalleryItem[]) || []
		}
	},
	{
		default: () => [],
		lazy: true,
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
	refreshGallery()

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
	<div class="mx-auto max-w-6xl px-4 py-10 lg:px-8 sm:px-6 sm:py-14">
		<!-- Band 01: Swiss Broadside Masthead (4:8 Asymmetric Grid) -->
		<header class="w-full border border-slate-200/80 bg-white dark:border-[#134e43] dark:bg-[#001e1c]">
			<div class="grid grid-cols-1 lg:grid-cols-12 divide-y divide-slate-200/80 lg:divide-x lg:divide-y-0 dark:divide-[#134e43]">
				<!-- Parameters Rail (Cols 1 to 4) -->
				<div class="flex flex-col justify-between bg-slate-50/40 p-6 lg:col-span-4 dark:bg-[#002420]/20 sm:p-8">
					<div>
						<div class="mb-4 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:text-accent">
							{{ $t('galeri.archive_badge') }}
						</div>

						<div class="text-xs font-mono divide-y divide-slate-200/80 dark:divide-[#134e43]">
							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-700 dark:text-slate-300">{{ $t('galeri.total_label') }}</span>
								<span class="text-slate-900 font-bold tabular-nums dark:text-slate-50">{{ allItems.length }} {{ $t('galeri.unit') }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-700 dark:text-slate-300">{{ $t('galeri.hosting') }}</span>
								<span class="text-slate-900 font-medium dark:text-slate-50">CLOUDINARY EDGE</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-700 dark:text-slate-300">{{ $t('galeri.optimization') }}</span>
								<span class="text-brand-600 font-bold dark:text-accent">WEBP / AVIF LQIP</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-700 dark:text-slate-300">{{ $t('galeri.curator') }}</span>
								<span class="text-slate-900 font-medium dark:text-slate-50">Dinar Permadi Yusup</span>
							</div>
						</div>
					</div>

					<div class="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-6 text-xs text-slate-600 font-mono dark:border-[#134e43] dark:text-slate-400">
						<span>{{ $t('galeri.copyright') }}</span>
						<span>CC BY-NC-ND 4.0</span>
					</div>
				</div>

				<!-- Monumental Typographic Statement Field (Cols 5 to 12) -->
				<div class="flex flex-col justify-between p-6 lg:col-span-8 lg:p-12 sm:p-10">
					<div>
						<div class="mb-4 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:text-accent">
							{{ $t('galeri.subhead_badge') }}
						</div>

						<h1 class="mb-6 text-balance text-3xl text-slate-900 font-900 leading-[0.95] tracking-[-0.035em] font-heading lg:text-6xl sm:text-5xl dark:text-slate-50">
							{{ page?.title || $t('galeri.default_title') }}
						</h1>

						<p class="mb-8 max-w-[58ch] text-base text-slate-800 leading-relaxed font-sans sm:text-lg dark:text-slate-200">
							{{ page?.description || $t('galeri.default_description') }}
						</p>

						<div class="flex flex-wrap gap-2 text-xs text-slate-700 font-mono dark:text-slate-300">
							<span
								v-for="tag in (locale === 'id' ? ['#FOTOGRAFI', '#WORKSPACE', '#ARSITEKTUR', '#DESAIN'] : ['#PHOTOGRAPHY', '#WORKSPACE', '#ARCHITECTURE', '#DESIGN'])"
								:key="tag"
								class="border border-slate-300 px-2.5 py-1 uppercase dark:border-[#134e43]"
							>
								{{ tag }}
							</span>
						</div>
					</div>

					<div class="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-6 text-xs text-slate-600 font-mono dark:border-[#134e43] dark:text-slate-400">
						<span>{{ $t('projek.archive_tag') }}</span>
					</div>
				</div>
			</div>
		</header>

		<!-- Band 02: Swiss Filter Strip & Metric Ledger Bar -->
		<div class="w-full flex flex-wrap items-center justify-between gap-4 border-x border-b border-slate-200/80 bg-slate-50/70 px-4 py-3 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/30 sm:px-6">
			<!-- Tag Filter Buttons -->
			<div class="flex flex-wrap items-center gap-1.5">
				<span class="mr-1 text-[11px] text-slate-600 font-bold uppercase dark:text-slate-400">
					{{ $t('galeri.filter_label') }}
				</span>

				<!-- All Topics -->
				<button
					type="button"
					class="cursor-pointer border px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase transition-all duration-150 active:scale-95 hover:-translate-y-0.5"
					:class="selectedTag === 'ALL'
						? 'bg-slate-900 text-white dark:bg-brand-500 dark:text-slate-950 border-transparent'
						: 'border-slate-300 dark:border-[#134e43] text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#002420]'"
					@click="selectTag('ALL')"
				>
					{{ $t('galeri.filter_all') }} ({{ allItems.length }})
				</button>

				<!-- Individual Tags -->
				<button
					v-for="tag in availableTags"
					:key="tag"
					type="button"
					class="cursor-pointer border px-2.5 py-1 text-[11px] tracking-wider uppercase transition-all duration-150 active:scale-95 hover:-translate-y-0.5"
					:class="selectedTag === tag
						? 'bg-slate-900 text-white dark:bg-brand-500 dark:text-slate-950 border-transparent font-bold'
						: 'border-slate-300 dark:border-[#134e43] text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#002420]'"
					@click="selectTag(tag)"
				>
					#{{ tag }} ({{ tagCounts[tag] || 0 }})
				</button>
			</div>

			<!-- Quick Metric Indicator -->
			<div class="text-[11px] text-slate-600 font-bold tracking-wider uppercase tabular-nums dark:text-slate-400">
				{{ locale === 'id' ? 'DITAMPILKAN:' : 'DISPLAYING:' }} {{ displayedItems.length }} / {{ filteredGallery.length }}
			</div>
		</div>

		<!-- Band 03: The Swiss Modular Image Grid (Rigorous 3-Column Ledger) -->
		<div
			v-if="displayedItems.length > 0"
			class="grid grid-cols-1 border-x border-b border-slate-200/80 bg-white lg:grid-cols-3 md:grid-cols-2 dark:border-[#134e43] dark:bg-[#001e1c]"
		>
			<div
				v-for="(item, i) in displayedItems"
				:key="item.public_id || i"
				tabindex="0"
				role="button"
				:aria-label="item.title || (locale === 'id' ? 'Buka spesimen foto' : 'Open photo specimen')"
				class="group flex flex-col cursor-pointer select-none justify-between border-b border-r-0 border-slate-200/80 text-xs font-mono transition-all duration-150 active:scale-[0.99] md:border-b-0 md:border-r dark:border-[#134e43] hover:bg-slate-50/80 dark:hover:bg-[#002420]/40"
				@click="openModal(item)"
				@keydown.enter.prevent="openModal(item)"
				@keydown.space.prevent="openModal(item)"
			>
				<!-- Specimen Header Rail -->
				<div class="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[10px] font-bold tracking-wider uppercase dark:border-[#134e43] dark:bg-[#002420]/30">
					<div class="flex items-center gap-1.5 text-brand-700 dark:text-accent">
						<span class="inline-block h-1.5 w-1.5 bg-brand-500" />
						<span>{{ locale === 'id' ? 'SPESIMEN' : 'SPECIMEN' }} {{ String(i + 1).padStart(2, '0') }}</span>
					</div>
					<span class="text-slate-600 tabular-nums dark:text-slate-400">
						{{ item.width || 720 }}×{{ item.height || 540 }} HD
					</span>
				</div>

				<!-- Image Frame (Pure Rectilinear Architecture) -->
				<div class="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-[#001714]">
					<!-- LQIP Pixelated Placeholder -->
					<img
						v-if="item.placeholder_image"
						:src="item.placeholder_image"
						alt=""
						aria-hidden="true"
						decoding="async"
						class="pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
						:class="loadedImages[item.public_id] ? 'opacity-0' : 'opacity-100'"
						style="image-rendering: pixelated;"
					>

					<!-- High-Res Main Image -->
					<imgt
						:src="item.image"
						:alt="item.title || (locale === 'id' ? 'Foto galeri' : 'Gallery photo specimen')"
						decoding="async"
						:width="item.width || 720"
						:height="item.height || 540"
						class="relative z-1 h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
						:class="i === 0 || loadedImages[item.public_id] ? 'opacity-100' : 'opacity-0'"
						:loading="i < 6 ? 'eager' : 'lazy'"
						:fetchpriority="i === 0 ? 'high' : 'auto'"
						@load="onImageLoad(item.public_id)"
					/></div>

				<!-- Specimen Footer Details -->
				<div class="flex flex-1 flex-col justify-between border-t border-slate-200/80 p-4 dark:border-[#134e43]">
					<div>
						<h2 class="mb-2 text-base text-slate-900 font-900 leading-snug font-heading transition-colors dark:text-slate-50 group-hover:text-brand-600 dark:group-hover:text-accent">
							{{ item.title }}
						</h2>

						<div
							v-if="item.tags && item.tags.length"
							class="mb-4 flex flex-wrap gap-1.5"
						>
							<span
								v-for="tag in item.tags.slice(0, 3)"
								:key="tag"
								class="border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-700 uppercase dark:border-[#134e43] dark:text-slate-300"
							>
								#{{ tag }}
							</span>
						</div>
					</div>

					<div class="flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-600 dark:border-[#134e43]/40 dark:text-slate-400">
						<span>DOKUMEN FOTO</span>
						<span class="flex items-center gap-1 font-bold transition-colors group-hover:text-brand-600 dark:group-hover:text-accent">
							INSPEKSI <span class="i-swisspost-arrowupright text-xs transition-transform duration-150 group-hover:(translate-x-0.5 -translate-y-0.5)" />
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Infinite Scroll Trigger Sentinel & Load More Strip -->
		<div
			ref="sentinelEl"
			class="w-full flex flex-col items-center justify-center border-x border-b border-slate-200/80 bg-slate-50/60 p-6 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/30"
		>
			<div
				v-if="isLoadingMore"
				class="flex items-center gap-2 text-brand-700 font-bold tracking-wider uppercase dark:text-accent"
			>
				<span class="i-swisspost-reloadright animate-spin text-sm" />
				<span>{{ locale === 'id' ? 'MEMUAT SPESIMEN LAINNYA...' : 'LOADING MORE SPECIMENS...' }}</span>
			</div>

			<button
				v-else-if="hasMore"
				type="button"
				class="flex cursor-pointer items-center gap-2 border border-slate-300 px-5 py-2.5 text-slate-900 font-bold tracking-wider uppercase transition-all duration-150 active:scale-95 dark:border-[#134e43] hover:border-brand-500 dark:text-slate-50 hover:text-brand-600 hover:-translate-y-0.5 dark:hover:text-accent"
				@click="loadMore"
			>
				<span>↓ {{ $t('galeri.load_more') }}</span>
				<span class="text-slate-600 tabular-nums dark:text-slate-400">
					({{ filteredGallery.length - displayedItems.length }} {{ $t('galeri.remaining') }})
				</span>
			</button>

			<div
				v-else
				class="text-[11px] text-slate-600 font-bold tracking-wider uppercase dark:text-slate-400"
			>
				{{ $t('galeri.end_of_archive', { count: filteredGallery.length }) }}
			</div>
		</div>

		<!-- Empty State -->
		<div
			v-if="displayedItems.length === 0"
			class="w-full border-x border-b border-slate-200/80 bg-white p-12 text-center text-xs font-mono dark:border-[#134e43] dark:bg-[#001e1c]"
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
			class="mx-auto mt-12 max-w-4xl font-sans prose prose-slate dark:prose-invert"
		>
			<ContentRenderer :value="page" />
		</article>

		<!-- Band 05: Swiss Specimen Inspection Sheet (Lightbox Modal) -->
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
								<div class="flex items-center gap-2 truncate text-[11px] font-bold tracking-wider uppercase">
									<span class="inline-block h-2 w-2 shrink-0 bg-brand-500" />
									<span class="shrink-0 text-brand-700 dark:text-accent">
										{{ $t('galeri.specimen_label') }} [{{ String(currentModalIndex + 1).padStart(2, '0') }}/{{ String(filteredGallery.length).padStart(2, '0') }}]
									</span>
									<span class="text-slate-300 dark:text-[#134e43]">|</span>
									<span class="truncate text-slate-900 dark:text-slate-50">
										{{ selectedPhoto.title }}
									</span>
								</div>

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
								<img
									:src="selectedPhoto.preview_image || selectedPhoto.image"
									:alt="selectedPhoto.title"
									decoding="async"
									class="relative z-10 max-h-[66vh] max-w-full w-auto object-contain transition-opacity duration-300"
									:class="isModalImageLoaded ? 'opacity-100' : 'opacity-0'"
									@load="isModalImageLoaded = true"
								>
							</div>

							<!-- Technical Parameters Ledger -->
							<div class="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/80 bg-slate-50/80 p-3.5 text-[11px] text-slate-700 dark:border-[#134e43] dark:bg-[#002420]/60 sm:p-4 dark:text-slate-300">
								<div class="flex flex-wrap items-center gap-2">
									<span class="text-slate-900 font-bold dark:text-slate-50">{{ $t('galeri.param_label') }}</span>
									<span class="tabular-nums">{{ selectedPhoto.width || 720 }}×{{ selectedPhoto.height || 540 }} PX</span>
									<span>//</span>
									<span>FORMAT: CLOUDINARY SWR</span>
									<span>//</span>
									<span>{{ $t('galeri.license_label') }}</span>
								</div>

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
