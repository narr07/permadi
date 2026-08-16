<script setup lang="ts">
	import { onClickOutside } from '@vueuse/core'

	const { locale, t } = useI18n()
	const localePath = useLocalePath()
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
		() => 'blog-index-' + locale.value,
		() => queryCollection(pageCollection.value).path(currentPath.value).first(),
		{ watch: [locale] }
	)

	const { data: posts } = await useAsyncData(
		() => 'blog-posts-list-' + locale.value,
		() => queryCollection(blogCollection.value).order('date', 'DESC').all(),
		{ watch: [locale] }
	)

	function cleanSlug(pathStr: string): string {
		const parts = pathStr.split('/')
		const lastPart = parts[parts.length - 1] || ''
		return lastPart.replace(/^\d+\./, '')
	}

	const allTags = computed(() => {
		if (!posts.value) return []
		const tagSet = new Set<string>()
		for (const post of posts.value) {
			if (Array.isArray(post.tags)) {
				post.tags.forEach((tag: string) => tagSet.add(tag))
			}
		}
		return Array.from(tagSet)
	})

	const filteredDropdownTags = computed(() => {
		const q = tagSearchQuery.value.trim().toLowerCase()
		if (!q) return allTags.value
		return allTags.value.filter((t: string) => t.toLowerCase().includes(q))
	})

	function selectTag(tag: string) {
		selectedTag.value = tag
		isTagDropdownOpen.value = false
		tagSearchQuery.value = ''
	}

	const tagCounts = computed(() => {
		const map: Record<string, number> = {}
		if (posts.value) {
			for (const post of posts.value) {
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
		if (!posts.value) return []
		return posts.value
			.filter((post: any) => {
				return selectedTag.value === 'ALL' || post.tags?.includes(selectedTag.value)
			})
			.map((post: any) => ({
				...post,
				url: `/${locale.value}/blog/${post.slug || cleanSlug(post.path)}`,
			}))
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
		<!-- Page Header with Bento Spotlight Effect -->
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
						<span>{{ locale === 'id' ? 'Artikel & Opini' : 'Articles & Thoughts' }}</span>
					</div>

					<h1 class="heading-page">
						{{ page?.title || (locale === 'id' ? 'Blog & Tulisan' : 'Blog & Articles') }}
					</h1>

					<p class="heading-page-sub">
						{{ page?.description || (locale === 'id' ? 'Eksplorasi mendalam seputar Nuxt, TypeScript, sistem desain Bento, dan web performance.' : 'In-depth exploration of Nuxt, TypeScript, Bento design systems, and web performance.') }}
					</p>
				</div>

				<!-- Sisi Kanan / Actions: Total Artikel & Tag Dropdown Filter -->
				<!-- Mobile: grid 2 kolom simetris; Desktop: flex-col teratur -->
				<div class="grid grid-cols-2 md:flex md:flex-col gap-2.5 w-full md:w-auto shrink-0 z-20">
					<!-- Mini Bento Stat Pill: Total Artikel -->
					<div class="h-11 px-3.5 sm:px-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 shadow-xs flex items-center gap-2 md:w-48">
						<span class="i-hugeicons-book-open-01 text-brand-700 dark:text-brand-400 text-sm shrink-0" />
						<span class="text-xs font-bold text-slate-800 dark:text-slate-100 font-mono truncate">
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
							class="w-full h-11 flex items-center justify-between gap-2 px-3.5 sm:px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer border shadow-xs"
							:class="selectedTag !== 'ALL'
								? 'bg-brand-700 text-white border-brand-600 shadow-brand-700/20'
								: 'bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-200/70 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800'"
							:aria-expanded="isTagDropdownOpen"
							aria-label="Pilih topik filter"
							@click="isTagDropdownOpen = !isTagDropdownOpen"
						>
							<span class="flex items-center gap-2 truncate">
								<span
									class="i-hugeicons-filter-horizontal text-sm shrink-0"
									:class="selectedTag !== 'ALL' ? 'text-white' : 'text-brand-700 dark:text-brand-400'"
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
									v-if="allTags.length > 5"
									class="px-1 pb-2 mb-1.5 border-b border-slate-100 dark:border-white/10"
								>
									<div class="relative">
										<span class="i-hugeicons-search-01 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
										<input
											v-model="tagSearchQuery"
											type="text"
											:placeholder="locale === 'id' ? 'Cari tag...' : 'Search tags...'"
											class="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#002420] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none"
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
											? 'bg-brand-500/15 dark:bg-brand-500/25 text-brand-800 dark:text-brand-300 font-bold'
											: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'"
										@click="selectTag('ALL')"
									>
										<span class="flex items-center gap-2">
											<span class="i-hugeicons-grid-view text-xs" />
											{{ locale === 'id' ? 'Semua Topik' : 'All Topics' }}
										</span>
										<span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-400 font-mono font-medium">
											{{ posts?.length || 0 }}
										</span>
									</button>

									<!-- Tags Options -->
									<button
										v-for="tag in filteredDropdownTags"
										:key="tag"
										type="button"
										class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left cursor-pointer"
										:class="selectedTag === tag
											? 'bg-brand-500/15 dark:bg-brand-500/25 text-brand-800 dark:text-brand-300 font-bold'
											: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'"
										@click="selectTag(tag)"
									>
										<span class="flex items-center gap-2 truncate">
											<span class="i-hugeicons-tag-01 text-xs shrink-0" />
											<span class="truncate">#{{ tag }}</span>
										</span>
										<span
											v-if="tagCounts[tag]"
											class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-400 font-mono font-medium shrink-0 ml-2"
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

		<!-- Bento Grid Articles -->
		<div v-if="filteredPosts.length > 0" class="bento-grid">
			<NuxtLink
				v-for="(post, index) in filteredPosts"
				:key="post.url"
				:to="post.url"
				class="bento-card-outline bento-lift p-5 sm:p-6 flex flex-col justify-between group block"
				:class="index === 0 && selectedTag === 'ALL'
					? 'lg:col-span-12 md:col-span-12 bg-brand-900 dark:bg-brand-200 border-brand-800 dark:border-brand-300 shadow-md'
					: 'lg:col-span-6 md:col-span-6'"
			>
				<div>
					<div class="flex items-center justify-between gap-2 mb-3.5">
						<div class="flex items-center gap-1.5 min-w-0 overflow-hidden">
							<!-- Latest Article Badge -->
							<span
								v-if="index === 0 && selectedTag === 'ALL'"
								class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-800/90 dark:bg-brand-300/90 text-brand-200 dark:text-brand-950 border border-brand-700 dark:border-brand-400/80 shrink-0"
							>
								<span class="i-hugeicons-sparkles text-[11px]" />
								{{ locale === 'id' ? 'Terbaru' : 'Latest' }}
							</span>

							<!-- Primary Tag -->
							<span
								v-if="post.tags?.[0]"
								class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium truncate max-w-[130px] sm:max-w-none"
								:class="index === 0 && selectedTag === 'ALL'
									? 'bg-brand-800/70 dark:bg-brand-300/70 text-brand-200 dark:text-brand-950 border border-brand-700/70 dark:border-brand-400/60'
									: 'bg-brand-500/10 dark:bg-brand-400/10 text-brand-700 dark:text-brand-300 border border-brand-500/20 dark:border-brand-400/20'"
							>
								#{{ post.tags[0] }}
							</span>

							<!-- Secondary Tag (Desktop only) -->
							<span
								v-if="post.tags?.[1]"
								class="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium truncate"
								:class="index === 0 && selectedTag === 'ALL'
									? 'bg-brand-800/50 dark:bg-brand-300/50 text-brand-200 dark:text-brand-950 border border-brand-700/50 dark:border-brand-400/50'
									: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50'"
							>
								#{{ post.tags[1] }}
							</span>
						</div>

						<!-- Date -->
						<span
							class="text-[11px] font-mono shrink-0"
							:class="index === 0 && selectedTag === 'ALL'
								? 'text-brand-300 dark:text-brand-800 font-medium'
								: 'text-slate-600 dark:text-slate-400'"
						>
							{{ post.date }}
						</span>
					</div>

					<!-- Title -->
					<h2
						class="font-heading font-bold transition-colors duration-200 text-lg sm:text-xl leading-snug tracking-normal line-clamp-2"
						:class="index === 0 && selectedTag === 'ALL'
							? 'text-white dark:text-brand-950 group-hover:text-yellow-400 dark:group-hover:text-brand-700 md:text-2xl lg:text-3xl'
							: 'text-brand-950 dark:text-brand-100 group-hover:text-brand-900 dark:group-hover:text-yellow-600'"
					>
						{{ post.title }}
					</h2>

					<!-- Description -->
					<p
						class="text-xs sm:text-sm line-clamp-2 leading-relaxed mt-2"
						:class="index === 0 && selectedTag === 'ALL'
							? 'text-brand-200/90 dark:text-brand-900/90'
							: 'text-brand-900 dark:text-brand-300'"
					>
						{{ post.description }}
					</p>
				</div>

				<!-- Footer Meta -->
				<div
					class="mt-5 pt-3.5 border-t flex items-center justify-between text-xs"
					:class="index === 0 && selectedTag === 'ALL'
						? 'border-brand-800/80 dark:border-brand-300/80 text-brand-300 dark:text-brand-900'
						: 'border-slate-200/60 dark:border-slate-800/60 text-slate-600 dark:text-slate-400'"
				>
					<span class="flex items-center gap-1.5 font-mono text-[11px]">
						<span
							class="i-hugeicons-clock-01 text-xs"
							:class="index === 0 && selectedTag === 'ALL' ? 'text-brand-400 dark:text-brand-700' : 'text-brand-700 dark:text-brand-400'"
						/>
						{{ post.readingTime || 5 }} min read
					</span>
					<span
						class="font-bold group-hover:translate-x-0.5 transition-all flex items-center gap-1 text-xs"
						:class="index === 0 && selectedTag === 'ALL'
							? 'text-white dark:text-brand-950 group-hover:text-yellow-400 dark:group-hover:text-brand-700 font-bold'
							: 'text-brand-800 dark:text-brand-400 group-hover:text-brand-950 dark:group-hover:text-yellow-600'"
					>
						{{ locale === 'id' ? 'Baca Artikel' : 'Read Article' }} <span class="i-hugeicons-arrow-right-01 text-xs" />
					</span>
				</div>
			</NuxtLink>
		</div>

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
