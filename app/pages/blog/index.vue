<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const { locale } = useI18n()
const localePath = useLocalePath()
const { getCategoryLabel } = useCategoryLabel()
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
	{ watch: [locale], lazy: true },
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

function selectTag(tag: string) {
	selectedTag.value = tag
	isTagDropdownOpen.value = false
	tagSearchQuery.value = ''
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

function onHeaderMouseMove(e: MouseEvent) {
	const target = e.currentTarget as HTMLElement
	if (!target)
		return
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

useSchemaOrg([
	defineWebPage({
		'@type': 'CollectionPage',
	}),
])
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<!-- Page Header with Bento Spotlight Effect -->
		<header
			class="bento-card-clean bento-spotlight relative z-30 mb-8 bg-slate-50/50 p-6 sm:mb-10 !overflow-visible dark:bg-slate-900/40 sm:p-8"
			@mousemove="onHeaderMouseMove"
		>
			<!-- Ambient Glow Subtle Background (Clipped inside rounded frame) -->
			<div class="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px]">
				<div class="absolute h-64 w-64 rounded-full bg-brand-400/10 blur-3xl -right-16 -top-16 dark:bg-brand-400/5" />
			</div>

			<div class="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
				<!-- Sisi Kiri: Eyebrow + Judul + Deskripsi -->
				<div class="max-w-2xl">
					<div class="mb-3.5 inline-flex items-center gap-2 border border-brand-200/60 rounded-full bg-brand-100/70 px-3 py-1 text-xs text-brand-700 font-semibold dark:border-brand-800/60 dark:bg-brand-950 dark:text-brand-300">
						<span class="status-dot animate-pulse" />
						<span>{{ page?.eyebrow || (locale === 'id' ? 'Artikel & Opini' : 'Articles & Thoughts') }}</span>
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
								class="absolute right-0 top-full z-50 mt-2 max-h-80 max-w-[90vw] w-64 overflow-y-auto border border-slate-200 rounded-2xl bg-white p-2 shadow-2xl sm:w-72 dark:border-[#134e43] dark:bg-[#001714]"
							>
								<!-- Tag Search Input inside Dropdown -->
								<div
									v-if="allTags.length > 5"
									class="mb-1.5 border-b border-slate-100 px-1 pb-2 dark:border-white/10"
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
								<div class="space-y-0.5">
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
		<div
			v-if="filteredPosts.length > 0"
			class="bento-grid"
		>
			<NuxtLink
				v-for="(post, index) in filteredPosts"
				:key="post.url"
				:to="post.url"
				class="group bento-card-outline block flex flex-col justify-between bento-lift p-5 sm:p-6"
				:class="index === 0 && selectedTag === 'ALL'
					? 'lg:col-span-12 md:col-span-12 bg-brand-900 dark:bg-brand-200 border-brand-800 dark:border-brand-300 shadow-md'
					: 'lg:col-span-6 md:col-span-6'"
			>
				<div>
					<div class="mb-3.5 flex items-center justify-between gap-2">
						<div class="min-w-0 flex items-center gap-1.5 overflow-hidden">
							<!-- Latest Article Badge -->
							<span
								v-if="index === 0 && selectedTag === 'ALL'"
								class="inline-flex shrink-0 items-center gap-1 border border-brand-700 rounded-full bg-brand-800/90 px-2.5 py-0.5 text-[11px] text-brand-200 font-semibold dark:border-brand-400/80 dark:bg-brand-300/90 dark:text-brand-950"
							>
								<span class="i-hugeicons-sparkles text-[11px]" />
								{{ locale === 'id' ? 'Terbaru' : 'Latest' }}
							</span>

							<!-- Category Badge -->
							<span
								v-if="post.category"
								class="inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase"
								:class="index === 0 && selectedTag === 'ALL'
									? 'bg-brand-800 text-brand-200 dark:bg-brand-300 dark:text-brand-950 border border-brand-700'
									: 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60'"
							>
								{{ getCategoryLabel(post.category) }}
							</span>

							<!-- Primary Tag -->
							<span
								v-if="post.tags?.[0]"
								class="max-w-[130px] inline-flex items-center truncate rounded-full px-2.5 py-0.5 text-[11px] font-medium sm:max-w-none"
								:class="index === 0 && selectedTag === 'ALL'
									? 'bg-brand-800/70 dark:bg-brand-300/70 text-brand-200 dark:text-brand-950 border border-brand-700/70 dark:border-brand-400/60'
									: 'bg-brand-500/10 dark:bg-brand-400/10 text-brand-700 dark:text-brand-300 border border-brand-500/20 dark:border-brand-400/20'"
							>
								#{{ post.tags[0] }}
							</span>

							<!-- Secondary Tag (Desktop only) -->
							<span
								v-if="post.tags?.[1]"
								class="hidden items-center truncate rounded-full px-2.5 py-0.5 text-[11px] font-medium sm:inline-flex"
								:class="index === 0 && selectedTag === 'ALL'
									? 'bg-brand-800/50 dark:bg-brand-300/50 text-brand-200 dark:text-brand-950 border border-brand-700/50 dark:border-brand-400/50'
									: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50'"
							>
								#{{ post.tags[1] }}
							</span>
						</div>

						<!-- Date -->
						<span
							class="shrink-0 text-[11px] font-mono"
							:class="index === 0 && selectedTag === 'ALL'
								? 'text-brand-300 dark:text-brand-800 font-medium'
								: 'text-slate-600 dark:text-slate-400'"
						>
							{{ post.date }}
						</span>
					</div>

					<!-- Title -->
					<h2
						class="line-clamp-2 text-lg font-bold leading-snug tracking-normal font-heading transition-colors duration-200 sm:text-xl"
						:class="index === 0 && selectedTag === 'ALL'
							? 'text-white dark:text-brand-950 group-hover:text-yellow-400 dark:group-hover:text-brand-700 md:text-2xl lg:text-3xl'
							: 'text-brand-950 dark:text-brand-100 group-hover:text-brand-900 dark:group-hover:text-yellow-600'"
					>
						{{ post.title }}
					</h2>

					<!-- Description -->
					<p
						class="line-clamp-2 mt-2 text-xs leading-relaxed sm:text-sm"
						:class="index === 0 && selectedTag === 'ALL'
							? 'text-brand-200/90 dark:text-brand-900/90'
							: 'text-brand-900 dark:text-brand-300'"
					>
						{{ post.description }}
					</p>
				</div>

				<!-- Footer Meta -->
				<div
					class="mt-5 flex items-center justify-between border-t pt-3.5 text-xs"
					:class="index === 0 && selectedTag === 'ALL'
						? 'border-brand-800/80 dark:border-brand-300/80 text-brand-300 dark:text-brand-900'
						: 'border-slate-200/60 dark:border-slate-800/60 text-slate-600 dark:text-slate-400'"
				>
					<span class="flex items-center gap-1.5 text-[11px] font-mono">
						<span
							class="i-hugeicons-clock-01 text-xs"
							:class="index === 0 && selectedTag === 'ALL' ? 'text-brand-400 dark:text-brand-700' : 'text-brand-700 dark:text-brand-400'"
						/>
						{{ post.readingTime || 5 }} min read
					</span>
					<span
						class="flex items-center gap-1 text-xs font-bold transition-all group-hover:translate-x-0.5"
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
