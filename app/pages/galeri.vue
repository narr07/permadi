<script setup lang="ts">
	import type { GalleryItem } from '~~/server/api/cloudinary-gallery.get'

	const { locale, t } = useI18n()

	// 1. Fetch page data (pages_id atau pages_en)
	const pageCollection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
	const currentPath = computed(() => (locale.value === 'id' ? '/id/galeri' : '/en/gallery'))

	const { data: page } = await useAsyncData(
		() => `galeri-page-${locale.value}`,
		() => queryCollection(pageCollection.value).path(currentPath.value).first(),
		{ watch: [locale] }
	)

	// 2. Fetch gallery items dari Cloudinary API
	const { data: cloudinaryItems } = await useAsyncData<GalleryItem[]>(
		'cloudinary-gallery-list',
		() => $fetch('/api/cloudinary-gallery').catch(() => [])
	)

	const allItems = computed(() => cloudinaryItems.value || [])

	// Filter Tag
	const selectedTag = ref<string>('ALL')

	const availableTags = computed(() => {
		const tagSet = new Set<string>()
		allItems.value.forEach((item: any) => {
			if (Array.isArray(item.tags)) {
				item.tags.forEach((tag: string) => tagSet.add(tag))
			}
		})
		return Array.from(tagSet).sort()
	})

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
		if (selectedTag.value === 'ALL') return allItems.value
		return allItems.value.filter((item: any) => item.tags?.includes(selectedTag.value))
	})

	// 3. INFINITE SCROLL & BATCH LOADING (12 foto per batch agar sangat ringan dan cepat)
	const itemsPerPage = 12
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
		if (isLoadingMore.value || !hasMore.value) return
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
					if (entries[0].isIntersecting && hasMore.value) {
						loadMore()
					}
				},
				{ rootMargin: '250px' }
			)

			if (sentinelEl.value) {
				observer.observe(sentinelEl.value)
			}

			watch(sentinelEl, (newEl) => {
				if (newEl) observer.observe(newEl)
			})
		}
	})

	// 4. Single Photo Modal (Tanpa Carousel - Hanya Foto Yang Diklik)
	const selectedPhoto = ref<any | null>(null)

	function openModal(item: any) {
		selectedPhoto.value = item
	}

	function closeModal() {
		selectedPhoto.value = null
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
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<!-- Header -->
		<header class="max-w-3xl mb-8 sm:mb-10">
			<span class="badge-neutral text-brand-600 dark:text-brand-400 font-semibold mb-3">
				<span class="i-hugeicons-image-02 text-xs mr-1 inline-block" />
				{{ locale === 'id' ? 'Snapshot & Dokumentasi' : 'Snapshots & Visuals' }}
			</span>
			<h1 class="heading-hero text-slate-900 ">
				{{ page?.title || (locale === 'id' ? 'Galeri Visual' : 'Visual Gallery') }}
			</h1>
			<p class="text-body text-slate-600 dark:text-slate-300 mt-2 text-lg">
				{{ page?.description || (locale === 'id' ? 'Koleksi dokumentasi workspace, seni visual, dan tangkapan karya yang dioptimasi via Cloudinary CDN.' : 'A curated collection of visual experiments, photography, and workspace snapshots served via Cloudinary CDN.') }}
			</p>
		</header>

		<!-- Bento Topic / Tag Filter Toolbar -->
		<BentoTagFilter
			v-model="selectedTag"
			:tags="availableTags"
			:counts="tagCounts"
			:total-count="filteredGallery.length"
			type="blog"
			:item-label="locale === 'id' ? 'foto' : 'photos'"
		/>

		<!-- Bento Grid Gallery (List Menggunakan Kualitas Rendah & Ringan width=400, quality=65) -->
		<div v-if="displayedItems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
			<div
				v-for="(item, i) in displayedItems"
				:key="item.public_id || i"
				tabindex="0"
				role="button"
				:aria-label="item.title || (locale === 'id' ? 'Buka foto galeri' : 'Open gallery photo')"
				class="bento-card-outline bento-lift overflow-hidden !p-0 group relative cursor-pointer bg-slate-100 dark:bg-slate-800 rounded-bento"
				:class="i % 5 === 0 ? 'lg:col-span-8 aspect-video' : (i % 5 === 1 ? 'lg:col-span-4 aspect-video sm:aspect-auto' : 'lg:col-span-4 aspect-video')"
				@click="openModal(item)"
				@keydown.enter.prevent="openModal(item)"
				@keydown.space.prevent="openModal(item)"
			>
				<!-- Gambar List Cepat & Ringan -->
				<NuxtImg
					:src="item.image"
					:alt="item.title || (locale === 'id' ? 'Foto galeri' : 'Gallery photo')"
					:provider="item.image.startsWith('http') || item.image.startsWith('/projects') || item.image.startsWith('/galeri') ? undefined : 'cloudinary'"
					format="webp"
					quality="65"
					width="450"
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					loading="lazy"
				/>

				<!-- Overlay on Hover -->
				<div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
					<div class="flex items-center justify-between gap-2">
						<h3 class="font-heading font-semibold text-g1 text-white truncate">
							{{ item.title }}
						</h3>
						<span class="p-1.5 rounded-full bg-white/20 backdrop-blur-md shrink-0">
							<span class="i-hugeicons-search-01 text-xs" />
						</span>
					</div>
					<div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-1 mt-1.5">
						<span v-for="tag in item.tags" :key="tag" class="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] text-slate-200">
							#{{ tag }}
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Infinite Scroll Trigger Sentinel & Loading Indicator -->
		<div ref="sentinelEl" class="py-8 flex flex-col items-center justify-center">
			<div v-if="isLoadingMore" class="flex items-center gap-2 text-meta text-xs text-brand-600 dark:text-brand-400">
				<span class="i-hugeicons-loading-03 animate-spin text-base" />
				{{ locale === 'id' ? 'Memuat foto lainnya...' : 'Loading more photos...' }}
			</div>

			<button
				v-else-if="hasMore"
				type="button"
				class="btn-ghost text-xs border border-slate-200 dark:border-slate-700 px-5 py-2 inline-flex items-center gap-1.5 cursor-pointer hover:border-brand-500"
				@click="loadMore"
			>
				<span class="i-hugeicons-arrow-down-01 text-sm" />
				{{ locale === 'id' ? 'Muat Lebih Banyak Foto' : 'Load More Photos' }}
			</button>
		</div>

		<!-- Empty State -->
		<div v-if="displayedItems.length === 0" class="bento-card-subtle text-center py-16">
			<span class="i-hugeicons-image-02 text-4xl text-slate-400 mb-2 block mx-auto opacity-50" />
			<p class="text-g2 font-medium text-slate-700 dark:text-slate-300">
				{{ locale === 'id' ? 'Belum ada foto galeri yang ditemukan' : 'No gallery photos found' }}
			</p>
			<p class="text-meta text-xs mt-1">
				{{ locale === 'id' ? 'Pastikan folder "gallery" di Cloudinary telah memiliki aset foto.' : 'Make sure the "gallery" folder in your Cloudinary account has uploaded photos.' }}
			</p>
		</div>

		<!-- Page Content Markdown if any -->
		<article v-if="page" class="prose prose-slate dark:prose-invert max-w-3xl mt-12">
			<ContentRenderer :value="page" />
		</article>

		<!-- SINGLE PHOTO MODAL (Tanpa Carousel, Resolusi & Kualitas Tinggi) -->
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
					class="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md"
					@click.self="closeModal"
				>
					<div class="relative max-w-4xl w-full flex flex-col items-center">
						<!-- Close Button -->
						<button
							type="button"
							class="absolute -top-12 right-0 p-2 rounded-full text-white/70 hover:text-white bg-slate-900/60 border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
							:aria-label="locale === 'id' ? 'Tutup' : 'Close'"
							@click="closeModal"
						>
							<span class="i-hugeicons-cancel-01 text-lg" />
						</button>

						<!-- High Quality Single Image (quality=95, width=1200, format=webp) -->
						<div class="relative w-full rounded-bento overflow-hidden border border-white/10 shadow-2xl bg-slate-900/90 flex items-center justify-center max-h-[85vh]">
							<NuxtImg
								:src="selectedPhoto.image"
								:alt="selectedPhoto.title"
								:provider="selectedPhoto.image.startsWith('http') || selectedPhoto.image.startsWith('/projects') || selectedPhoto.image.startsWith('/galeri') ? undefined : 'cloudinary'"
								format="webp"
								quality="95"
								width="1200"
								densities="1x 2x"
								class="max-h-[80vh] w-auto max-w-full object-contain rounded-bento"
							/>
						</div>

						<!-- Caption Details -->
						<div class="mt-3.5 flex items-center justify-between w-full text-xs text-white/80 px-2">
							<span class="font-semibold text-white truncate text-sm">
								{{ selectedPhoto.title }}
							</span>
							<div v-if="selectedPhoto.tags && selectedPhoto.tags.length" class="flex items-center gap-1.5">
								<span v-for="t in selectedPhoto.tags" :key="t" class="px-2 py-0.5 rounded-full bg-white/15 text-[11px] text-white">
									#{{ t }}
								</span>
							</div>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>
