<script setup lang="ts">
	import type { GalleryItem } from '~~/server/api/cloudinary-gallery.get'
	import { onClickOutside } from '@vueuse/core'

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
		if (!q) return availableTags.value
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

	function onHeaderMouseMove(e: MouseEvent) {
		const target = e.currentTarget as HTMLElement
		if (!target) return
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
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<!-- Header with Bento Spotlight Effect -->
		<header
			class="bento-card-clean bento-spotlight !overflow-visible relative z-30 p-6 sm:p-8 mb-8 sm:mb-10 bg-slate-50/50 dark:bg-slate-900/40"
			@mousemove="onHeaderMouseMove"
		>
			<!-- Ambient Glow Subtle Background (Clipped inside rounded frame) -->
			<div class="absolute inset-0 rounded-[20px] overflow-hidden pointer-events-none">
				<div class="absolute -right-16 -top-16 w-64 h-64 bg-brand-400/10 dark:bg-brand-400/5 rounded-full blur-3xl" />
			</div>

			<div class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
				<!-- Sisi Kiri: Eyebrow + Judul + Deskripsi -->
				<div class="max-w-2xl">
					<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-100/70 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60 mb-3.5">
						<span class="status-dot animate-pulse" />
						<span>{{ locale === 'id' ? 'Dokumentasi & Visual' : 'Snapshots & Visuals' }}</span>
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
				<div class="grid grid-cols-2 md:flex md:flex-col gap-2.5 w-full md:w-auto shrink-0 z-20">
					<!-- Mini Bento Stat Pill: Total Foto -->
					<div class="h-11 px-3.5 sm:px-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 shadow-xs flex items-center gap-2 md:w-48">
						<span class="i-hugeicons-image-02 text-brand-600 dark:text-brand-400 text-sm shrink-0" />
						<span class="text-xs font-bold text-slate-800 dark:text-slate-100 font-mono truncate">
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
							class="w-full h-11 flex items-center justify-between gap-2 px-3.5 sm:px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer border shadow-xs"
							:class="selectedTag !== 'ALL'
								? 'bg-brand-500 text-white border-brand-400 shadow-brand-500/20'
								: 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200/70 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800'"
							:aria-expanded="isTagDropdownOpen"
							aria-label="Pilih topik filter"
							@click="isTagDropdownOpen = !isTagDropdownOpen"
						>
							<span class="flex items-center gap-2 truncate">
								<span
									class="i-hugeicons-filter-horizontal text-sm shrink-0"
									:class="selectedTag !== 'ALL' ? 'text-white' : 'text-brand-600 dark:text-brand-400'"
								/>
								<span class="truncate">
									{{ selectedTag === 'ALL' ? (locale === 'id' ? 'Semua Topik' : 'All Topics') : `#${selectedTag}` }}
								</span>
							</span>
							<span
								class="i-hugeicons-arrow-down-01 text-xs shrink-0 transition-transform duration-200 ml-0.5"
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
								class="absolute right-0 top-full mt-2 w-64 sm:w-72 max-w-[90vw] z-50 rounded-2xl bg-white dark:bg-[#001714] border border-slate-200 dark:border-[#134e43] shadow-2xl p-2 max-h-80 overflow-y-auto"
							>
								<!-- Tag Search Input inside Dropdown -->
								<div
									v-if="availableTags.length > 5"
									class="px-1 pb-2 mb-1.5 border-b border-slate-100 dark:border-white/10"
								>
									<div class="relative">
										<span class="i-hugeicons-search-01 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
										<input
											v-model="tagSearchQuery"
											type="text"
											:placeholder="locale === 'id' ? 'Cari tag...' : 'Search tags...'"
											class="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#002420] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
										>
									</div>
								</div>

								<!-- List of Options -->
								<div class="space-y-0.5">
									<!-- "All Topics" Option -->
									<button
										type="button"
										class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left cursor-pointer"
										:class="selectedTag === 'ALL'
											? 'bg-brand-500/15 dark:bg-brand-500/25 text-brand-600 dark:text-brand-400 font-semibold'
											: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'"
										@click="selectTag('ALL')"
									>
										<span class="flex items-center gap-2">
											<span class="i-hugeicons-grid-view text-xs" />
											{{ locale === 'id' ? 'Semua Topik' : 'All Topics' }}
										</span>
										<span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 font-mono font-medium">
											{{ allItems?.length || 0 }}
										</span>
									</button>

									<!-- Tags Options -->
									<button
										v-for="tag in filteredDropdownTags"
										:key="tag"
										type="button"
										class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left cursor-pointer"
										:class="selectedTag === tag
											? 'bg-brand-500/15 dark:bg-brand-500/25 text-brand-600 dark:text-brand-400 font-semibold'
											: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'"
										@click="selectTag(tag)"
									>
										<span class="flex items-center gap-2 truncate">
											<span class="i-hugeicons-tag-01 text-xs shrink-0" />
											<span class="truncate">#{{ tag }}</span>
										</span>
										<span
											v-if="tagCounts[tag]"
											class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 font-mono font-medium shrink-0 ml-2"
										>
											{{ tagCounts[tag] }}
										</span>
									</button>

									<!-- Empty Filter Search -->
									<div
										v-if="filteredDropdownTags.length === 0"
										class="py-4 text-center text-xs text-slate-400"
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
		<div v-if="displayedItems.length > 0" class="grid grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
			<div
				v-for="(item, i) in displayedItems"
				:key="item.public_id || i"
				tabindex="0"
				role="button"
				:aria-label="item.title || (locale === 'id' ? 'Buka foto galeri' : 'Open gallery photo')"
				class="bento-card-outline bento-lift overflow-hidden !p-0 group relative cursor-pointer bg-slate-100 dark:bg-slate-800 rounded-xl sm:rounded-bento"
				:class="i % 5 === 0 ? 'col-span-2 lg:col-span-8 aspect-video' : (i % 5 === 1 ? 'col-span-1 lg:col-span-4 aspect-square sm:aspect-auto' : 'col-span-1 lg:col-span-4 aspect-square sm:aspect-video')"
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
					sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
					class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					loading="lazy"
				/>

				<!-- Overlay on Hover -->
				<div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2.5 sm:p-4 text-white">
					<div class="flex items-center justify-between gap-1 sm:gap-2">
						<h3 class="font-heading font-semibold text-xs sm:text-g1 text-white group-hover:text-brand-300 dark:group-hover:text-yellow-600 transition-colors duration-100 truncate">
							{{ item.title }}
						</h3>
						<span class="p-1 sm:p-1.5 rounded-full bg-white/20 backdrop-blur-md shrink-0">
							<span class="i-hugeicons-search-01 text-[10px] sm:text-xs" />
						</span>
					</div>
					<div v-if="item.tags && item.tags.length" class="flex flex-wrap gap-1 mt-1 sm:mt-1.5">
						<span v-for="tag in item.tags.slice(0, 2)" :key="tag" class="px-1.5 sm:px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[9px] sm:text-[10px] text-slate-200 truncate max-w-[80px]">
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
