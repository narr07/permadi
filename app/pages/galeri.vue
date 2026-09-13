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
	title: page.value?.title || 'Galeri Visual',
	description: page.value?.description || 'Dokumentasi Visual & Fotografi',
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
	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
		<!-- Band 01: Swiss Broadside Masthead (4:8 Asymmetric Grid) -->
		<header class="w-full border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#001e1c]">
			<div class="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 dark:divide-[#134e43]">
				<!-- Parameters Rail (Cols 1 to 4) -->
				<div class="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-slate-50/40 dark:bg-[#002420]/20">
					<div>
						<div class="mb-4 font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-brand-700 dark:text-accent">
							■ 03 // ARSIP VISUAL VOL. 26
						</div>

						<div class="divide-y divide-slate-200/80 dark:divide-[#134e43] font-mono text-xs">
							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-900/60 dark:text-slate-50/60">TOTAL SPESIMEN</span>
								<span class="text-slate-900 dark:text-slate-50 tabular-nums font-bold">{{ allItems.length }} Dokumen</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-900/60 dark:text-slate-50/60">HOSTING MEDIA</span>
								<span class="text-slate-900 dark:text-slate-50 font-medium">CLOUDINARY EDGE</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-900/60 dark:text-slate-50/60">OPTIMASI FORMAT</span>
								<span class="text-brand-600 dark:text-accent font-bold">WEBP / AVIF LQIP</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-900/60 dark:text-slate-50/60">KURASI</span>
								<span class="text-slate-900 dark:text-slate-50 font-medium">Dinar Permadi Yusup</span>
							</div>
						</div>
					</div>

					<div class="mt-8 pt-6 border-t border-slate-200/80 dark:border-[#134e43] font-mono text-xs text-slate-900/50 dark:text-slate-50/50 flex items-center justify-between">
						<span>HAK CIPTA</span>
						<span>CC BY-NC-ND 4.0</span>
					</div>
				</div>

				<!-- Monumental Typographic Statement Field (Cols 5 to 12) -->
				<div class="lg:col-span-8 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
					<div>
						<div class="mb-4 font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-brand-700 dark:text-accent">
							DOKUMENTASI VISUAL &amp; STUDIO
						</div>

						<h1 class="font-heading font-800 text-3xl sm:text-5xl lg:text-6xl tracking-[-0.035em] text-slate-900 dark:text-slate-50 leading-[0.95] text-balance mb-6">
							{{ page?.title || (locale === 'id' ? 'Galeri Visual & Dokumentasi' : 'Visual Gallery & Documentation') }}
						</h1>

						<p class="font-sans text-base sm:text-lg text-slate-900/80 dark:text-slate-50/80 leading-relaxed max-w-[58ch] mb-8">
							{{ page?.description || (locale === 'id' ? 'Koleksi dokumentasi workspace, seni visual, dan tangkapan karya desain yang dioptimasi secara presisi melalui Cloudinary Edge CDN.' : 'A curated collection of visual experiments, photography, and workspace snapshots served via Cloudinary CDN.') }}
						</p>

						<div class="flex flex-wrap gap-2 font-mono text-xs text-slate-900/60 dark:text-slate-50/60">
							<span class="px-2.5 py-1 border border-slate-300 dark:border-[#134e43] uppercase">#FOTOGRAFI</span>
							<span class="px-2.5 py-1 border border-slate-300 dark:border-[#134e43] uppercase">#WORKSPACE</span>
							<span class="px-2.5 py-1 border border-slate-300 dark:border-[#134e43] uppercase">#ARSITEKTUR</span>
							<span class="px-2.5 py-1 border border-slate-300 dark:border-[#134e43] uppercase">#DESAIN</span>
						</div>
					</div>

					<div class="mt-8 pt-6 border-t border-slate-200/80 dark:border-[#134e43] font-mono text-xs text-slate-900/50 dark:text-slate-50/50 flex items-center justify-between">
						<span>ARSIP PERMADI.DEV</span>
						<span>KISI MODULAR 12-KOLOM</span>
					</div>
				</div>
			</div>
		</header>

		<!-- Band 02: Swiss Filter Strip & Metric Ledger Bar -->
		<div class="w-full border-x border-b border-slate-200/80 dark:border-[#134e43] bg-slate-50/70 dark:bg-[#002420]/30 px-4 sm:px-6 py-3 font-mono text-xs flex items-center justify-between gap-4 flex-wrap">
			<!-- Tag Filter Buttons -->
			<div class="flex items-center gap-1.5 flex-wrap">
				<span class="text-slate-900/50 dark:text-slate-50/50 font-bold uppercase mr-1 text-[11px]">
					FILTER:
				</span>

				<!-- All Topics -->
				<button
					type="button"
					class="px-2.5 py-1 border font-bold uppercase tracking-wider text-[11px] transition-colors cursor-pointer"
					:class="selectedTag === 'ALL'
						? 'bg-slate-900 text-white dark:bg-brand-500 dark:text-slate-950 border-transparent'
						: 'border-slate-300 dark:border-[#134e43] text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#002420]'"
					@click="selectTag('ALL')"
				>
					SEMUA ({{ allItems.length }})
				</button>

				<!-- Individual Tags -->
				<button
					v-for="tag in availableTags"
					:key="tag"
					type="button"
					class="px-2.5 py-1 border uppercase tracking-wider text-[11px] transition-colors cursor-pointer"
					:class="selectedTag === tag
						? 'bg-slate-900 text-white dark:bg-brand-500 dark:text-slate-950 border-transparent font-bold'
						: 'border-slate-300 dark:border-[#134e43] text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#002420]'"
					@click="selectTag(tag)"
				>
					#{{ tag }} ({{ tagCounts[tag] || 0 }})
				</button>
			</div>

			<!-- Quick Metric Indicator -->
			<div class="text-[11px] font-bold uppercase tracking-wider text-slate-900/50 dark:text-slate-50/50 tabular-nums">
				DITAMPILKAN: {{ displayedItems.length }} / {{ filteredGallery.length }}
			</div>
		</div>

		<!-- Band 03: The Swiss Modular Image Grid (Rigorous 3-Column Ledger) -->
		<div
			v-if="displayedItems.length > 0"
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-x border-b border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#001e1c]"
		>
			<div
				v-for="(item, i) in displayedItems"
				:key="item.public_id || i"
				tabindex="0"
				role="button"
				:aria-label="item.title || (locale === 'id' ? 'Buka spesimen foto' : 'Open photo specimen')"
				class="group flex flex-col justify-between border-b md:border-b-0 border-r-0 md:border-r border-slate-200/80 dark:border-[#134e43] transition-colors hover:bg-slate-50/80 dark:hover:bg-[#002420]/40 cursor-pointer select-none font-mono text-xs"
				@click="openModal(item)"
				@keydown.enter.prevent="openModal(item)"
				@keydown.space.prevent="openModal(item)"
			>
				<!-- Specimen Header Rail -->
				<div class="px-4 py-3 border-b border-slate-200/80 dark:border-[#134e43] flex items-center justify-between bg-slate-50/50 dark:bg-[#002420]/30 text-[10px] font-bold uppercase tracking-wider">
					<div class="flex items-center gap-1.5 text-brand-700 dark:text-accent">
						<span class="w-1.5 h-1.5 bg-brand-500 inline-block" />
						<span>SPESIMEN {{ String(i + 1).padStart(2, '0') }}</span>
					</div>
					<span class="text-slate-900/40 dark:text-slate-50/40 tabular-nums">
						{{ item.width || 720 }}×{{ item.height || 540 }} HD
					</span>
				</div>

				<!-- Image Frame (Pure Rectilinear Architecture) -->
				<div class="relative w-full aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-[#001714]">
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
					<img
						:src="item.image"
						:alt="item.title || 'Foto galeri'"
						decoding="async"
						:width="item.width || 720"
						:height="item.height || 540"
						class="relative z-1 h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
						:class="i === 0 || loadedImages[item.public_id] ? 'opacity-100' : 'opacity-0'"
						:loading="i < 6 ? 'eager' : 'lazy'"
						:fetchpriority="i === 0 ? 'high' : 'auto'"
						@load="onImageLoad(item.public_id)"
					>
				</div>

				<!-- Specimen Footer Details -->
				<div class="p-4 flex flex-col justify-between flex-1 border-t border-slate-200/80 dark:border-[#134e43]">
					<div>
						<h2 class="font-heading font-800 text-base text-slate-900 dark:text-slate-50 leading-snug group-hover:text-brand-600 dark:group-hover:text-accent transition-colors mb-2">
							{{ item.title }}
						</h2>

						<div
							v-if="item.tags && item.tags.length"
							class="flex flex-wrap gap-1.5 mb-4"
						>
							<span
								v-for="tag in item.tags.slice(0, 3)"
								:key="tag"
								class="px-1.5 py-0.5 border border-slate-200 dark:border-[#134e43] text-[10px] text-slate-900/70 dark:text-slate-50/70 uppercase"
							>
								#{{ tag }}
							</span>
						</div>
					</div>

					<div class="pt-3 border-t border-slate-100 dark:border-[#134e43]/40 flex items-center justify-between text-[11px] text-slate-900/50 dark:text-slate-50/50">
						<span>DOKUMEN FOTO</span>
						<span class="group-hover:text-brand-600 dark:group-hover:text-accent font-bold flex items-center gap-1 transition-colors">
							INSPEKSI <span class="i-lucide-arrow-up-right text-xs" />
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Infinite Scroll Trigger Sentinel & Load More Strip -->
		<div
			ref="sentinelEl"
			class="w-full border-x border-b border-slate-200/80 dark:border-[#134e43] bg-slate-50/60 dark:bg-[#002420]/30 p-6 flex flex-col items-center justify-center font-mono text-xs"
		>
			<div
				v-if="isLoadingMore"
				class="flex items-center gap-2 text-brand-700 dark:text-accent font-bold uppercase tracking-wider"
			>
				<span class="i-lucide-loader-2 animate-spin text-sm" />
				<span>{{ locale === 'id' ? 'MEMUAT SPESIMEN LAINNYA...' : 'LOADING MORE SPECIMENS...' }}</span>
			</div>

			<button
				v-else-if="hasMore"
				type="button"
				class="px-5 py-2.5 border border-slate-300 dark:border-[#134e43] hover:border-brand-500 hover:text-brand-600 dark:hover:text-accent text-slate-900 dark:text-slate-50 font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
				@click="loadMore"
			>
				<span>↓ {{ locale === 'id' ? 'MUAT LEBIH BANYAK FOTO' : 'LOAD MORE PHOTOS' }}</span>
				<span class="text-slate-900/40 dark:text-slate-50/40 tabular-nums">
					({{ filteredGallery.length - displayedItems.length }} TERSISA)
				</span>
			</button>

			<div
				v-else
				class="text-[11px] font-bold uppercase tracking-wider text-slate-900/40 dark:text-slate-50/40"
			>
				■ AKHIR ARSIP FOTO // {{ filteredGallery.length }} TOTAL SPESIMEN TERCATAT
			</div>
		</div>

		<!-- Empty State -->
		<div
			v-if="displayedItems.length === 0"
			class="w-full border-x border-b border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#001e1c] p-12 text-center font-mono text-xs"
		>
			<div class="mb-2 text-brand-600 dark:text-accent font-bold text-sm">
				■ TIDAK ADA SPESIMEN TERSEDIA
			</div>
			<p class="text-slate-900/60 dark:text-slate-50/60">
				{{ locale === 'id' ? 'Tidak ada foto yang cocok dengan filter tag terpilih.' : 'No photos match the selected tag filter.' }}
			</p>
		</div>

		<!-- Page Content Markdown if any -->
		<article
			v-if="page"
			class="mt-12 max-w-4xl mx-auto prose prose-slate dark:prose-invert font-sans"
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
						class="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/85 backdrop-blur-xs p-3 sm:p-6 font-mono text-xs"
						@click.self="closeModal"
					>
						<div class="relative max-w-5xl w-full border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#001e1c] shadow-2xl flex flex-col">
							<!-- Inspection Sheet Header -->
							<div class="p-3.5 sm:p-4 border-b border-slate-200/80 dark:border-[#134e43] bg-slate-50/80 dark:bg-[#002420]/60 flex items-center justify-between gap-4 flex-wrap">
								<div class="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px] truncate">
									<span class="w-2 h-2 bg-brand-500 inline-block shrink-0" />
									<span class="text-brand-700 dark:text-accent shrink-0">
										SPESIMEN [{{ String(currentModalIndex + 1).padStart(2, '0') }}/{{ String(filteredGallery.length).padStart(2, '0') }}]
									</span>
									<span class="text-slate-300 dark:text-[#134e43]">|</span>
									<span class="text-slate-900 dark:text-slate-50 truncate">
										{{ selectedPhoto.title }}
									</span>
								</div>

								<!-- Action Controls -->
								<div class="flex items-center gap-2 font-mono text-xs">
									<!-- Prev Button -->
									<button
										type="button"
										:disabled="!hasPrevPhoto"
										class="px-2 py-1 border border-slate-300 dark:border-[#134e43] transition-colors cursor-pointer text-[10px] uppercase font-bold"
										:class="hasPrevPhoto ? 'hover:border-brand-500 hover:text-brand-600 dark:hover:text-accent' : 'opacity-40 cursor-not-allowed'"
										title="Foto Sebelumnya (Panah Kiri)"
										@click="prevPhoto"
									>
										← SEBELUMNYA
									</button>

									<!-- Next Button -->
									<button
										type="button"
										:disabled="!hasNextPhoto"
										class="px-2 py-1 border border-slate-300 dark:border-[#134e43] transition-colors cursor-pointer text-[10px] uppercase font-bold"
										:class="hasNextPhoto ? 'hover:border-brand-500 hover:text-brand-600 dark:hover:text-accent' : 'opacity-40 cursor-not-allowed'"
										title="Foto Selanjutnya (Panah Kanan)"
										@click="nextPhoto"
									>
										BERIKUTNYA →
									</button>

									<!-- Download HD Button -->
									<a
										v-if="selectedPhoto.download_url || selectedPhoto.full_image"
										:href="selectedPhoto.download_url || selectedPhoto.full_image"
										target="_blank"
										rel="noopener"
										download
										class="px-2 py-1 border border-slate-300 dark:border-[#134e43] hover:border-brand-500 hover:text-brand-600 dark:hover:text-accent transition-colors cursor-pointer text-[10px] uppercase font-bold hidden sm:inline-flex items-center gap-1"
									>
										<span class="i-lucide-download text-xs" />
										<span>UNDUH HD</span>
									</a>

									<!-- Close Button -->
									<button
										type="button"
										class="px-2.5 py-1 border border-slate-300 dark:border-[#134e43] hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer text-[10px] uppercase font-bold"
										title="Tutup (Esc)"
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
							<div class="p-3.5 sm:p-4 border-t border-slate-200/80 dark:border-[#134e43] bg-slate-50/80 dark:bg-[#002420]/60 flex items-center justify-between gap-4 flex-wrap text-[11px] text-slate-900/70 dark:text-slate-50/70">
								<div class="flex items-center gap-2 flex-wrap">
									<span class="font-bold text-slate-900 dark:text-slate-50">PARAMETER:</span>
									<span class="tabular-nums">{{ selectedPhoto.width || 720 }}×{{ selectedPhoto.height || 540 }} PX</span>
									<span>//</span>
									<span>FORMAT: CLOUDINARY SWR</span>
									<span>//</span>
									<span>LISENSI: CC BY-NC-ND 4.0</span>
								</div>

								<div
									v-if="selectedPhoto.tags && selectedPhoto.tags.length"
									class="flex items-center gap-1.5"
								>
									<span
										v-for="tag in selectedPhoto.tags"
										:key="tag"
										class="px-1.5 py-0.5 border border-slate-300 dark:border-[#134e43] text-[10px] uppercase"
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
