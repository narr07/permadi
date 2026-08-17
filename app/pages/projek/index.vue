<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const { locale } = useI18n()
const { getCategoryLabel } = useCategoryLabel()

const collection = computed(() => (locale.value === 'id' ? 'projek_id' : 'projek_en'))
const currentPath = computed(() => (locale.value === 'id' ? '/id/projek' : '/en/projects'))

// Data halaman projek (deskripsi dan header)
const { data: page } = await useAsyncData(
	() => `projek-page-${locale.value}`,
	() => queryCollection(locale.value === 'id' ? 'pages_id' : 'pages_en').path(currentPath.value).first(),
	{ watch: [locale] },
)

// Koleksi semua studi kasus projek
const { data: projects } = await useAsyncData(
	() => `projek-list-${locale.value}`,
	() => queryCollection(collection.value).order('date', 'DESC').all(),
	{ watch: [locale] },
)

// State filter tag
const selectedTag = ref('ALL')
const isTagDropdownOpen = ref(false)
const tagDropdownRef = ref<HTMLElement | null>(null)
const tagSearchQuery = ref('')

onClickOutside(tagDropdownRef, () => {
	if (isTagDropdownOpen.value) {
		isTagDropdownOpen.value = false
	}
})

// Daftar seluruh tag teknologi unik
const allTags = computed(() => {
	if (!projects.value)
		return []
	const tagsSet = new Set<string>()
	projects.value.forEach((item: any) => {
		if (item.category)
			tagsSet.add(item.category)
		const tags = item.tags || item.tech || []
		tags.forEach((t: string) => tagsSet.add(t))
	})
	return Array.from(tagsSet)
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
	if (projects.value) {
		for (const item of projects.value) {
			if (item.category) {
				map[item.category] = (map[item.category] || 0) + 1
			}
			const tags = item.tags || item.tech || []
			for (const tag of tags) {
				map[tag] = (map[tag] || 0) + 1
			}
		}
	}
	return map
})

// Filter projek berdasarkan tag / kategori
const filteredProjects = computed(() => {
	if (!projects.value)
		return []
	return projects.value
		.filter((item: any) => {
			return selectedTag.value === 'ALL'
				|| item.category === selectedTag.value
				|| (item.tags && item.tags.includes(selectedTag.value))
				|| (item.tech && item.tech.includes(selectedTag.value))
		})
		.map((item: any) => {
			const projectSlug = item.slug || (item.path ? item.path.split('/').pop() : item.stem)
			const basePath = locale.value === 'id' ? `/id/projek/${projectSlug}` : `/en/projects/${projectSlug}`
			return {
				...item,
				url: basePath,
			}
		})
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
						<span>{{ page?.eyebrow || (locale === 'id' ? 'Karya & Eksplorasi' : 'Work & Case Studies') }}</span>
					</div>

					<h1 class="heading-page">
						{{ page?.title || (locale === 'id' ? 'Projek & Studi Kasus' : 'Projects & Case Studies') }}
					</h1>

					<p class="heading-page-sub">
						{{ page?.description || (locale === 'id' ? 'Koleksi aplikasi web terkurasi, modul UI, dan sistem performa tinggi.' : 'A curated collection of web applications, UI modules, and high-performance systems.') }}
					</p>
				</div>

				<!-- Sisi Kanan / Actions: Total Karya & Tag Dropdown Filter -->
				<!-- Mobile: grid 2 kolom simetris; Desktop: flex-col teratur -->
				<div class="z-20 grid grid-cols-2 w-full shrink-0 gap-2.5 md:w-auto md:flex md:flex-col">
					<!-- Mini Bento Stat Pill: Total Karya -->
					<div class="shadow-xs h-11 flex items-center gap-2 border border-slate-200/70 rounded-xl bg-white px-3.5 md:w-48 dark:border-slate-700/60 dark:bg-slate-800/80 sm:px-4">
						<span class="i-hugeicons-folder-02 shrink-0 text-sm text-brand-700 dark:text-brand-400" />
						<span class="truncate text-xs text-slate-800 font-bold font-mono dark:text-slate-100">
							{{ projects?.length || 0 }} {{ locale === 'id' ? 'Projek' : 'Projects' }}
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
											{{ projects?.length || 0 }}
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

		<!-- Bento Grid Projects (1 col mobile, 2 col tablet, 3 col desktop) -->
		<div
			v-if="filteredProjects.length > 0"
			class="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2 sm:gap-6"
		>
			<NuxtLink
				v-for="(item, index) in filteredProjects"
				:key="item.url"
				:to="item.url"
				class="bento-card-clean group block flex flex-col justify-between overflow-hidden p-5 sm:p-6"
				:class="index === 0 && selectedTag === 'ALL'
					? 'lg:col-span-2 sm:col-span-2 md:flex-row md:items-center md:gap-6 bg-brand-900 dark:bg-brand-200 border-brand-800 dark:border-brand-300 shadow-md'
					: 'col-span-1'"
			>
				<!-- Thumbnail (Hanya 1 Gambar) -->
				<div
					v-if="item.image || (item.images && item.images[0])"
					class="mb-4 aspect-video shrink-0 overflow-hidden border border-slate-200/50 rounded-bento bg-slate-100 dark:border-slate-800/50 dark:bg-slate-800"
					:class="index === 0 && selectedTag === 'ALL' ? 'md:mb-0 md:w-1/2' : 'w-full'"
				>
					<NuxtImg
						:src="item.image || item.images[0]"
						:alt="item.title"
						format="webp"
						quality="85"
						class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						loading="lazy"
					/>
				</div>

				<!-- Content & Details -->
				<div
					class="flex flex-1 flex-col justify-between"
					:class="index === 0 && selectedTag === 'ALL' ? 'md:py-2' : ''"
				>
					<div>
						<div class="mb-2.5 flex items-center justify-between gap-2">
							<div class="min-w-0 flex items-center gap-1.5 overflow-hidden">
								<span
									v-if="index === 0 && selectedTag === 'ALL'"
									class="inline-flex shrink-0 items-center gap-1 border border-brand-700 rounded-full bg-brand-800/90 px-2.5 py-0.5 text-[11px] text-brand-200 font-semibold dark:border-brand-400/80 dark:bg-brand-300/90 dark:text-brand-950"
								>
									<span class="i-hugeicons-sparkles text-[11px]" />
									{{ locale === 'id' ? 'Terbaru' : 'Latest' }}
								</span>

								<!-- Category Badge -->
								<span
									v-if="item.category"
									class="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase"
									:class="index === 0 && selectedTag === 'ALL'
										? 'bg-brand-800 text-brand-200 dark:bg-brand-300 dark:text-brand-950 border border-brand-700'
										: 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60'"
								>
									{{ getCategoryLabel(item.category) }}
								</span>

								<span
									v-for="(tag, tIdx) in (item.tags || item.tech || []).slice(0, 3)"
									:key="tag"
									class="truncate rounded-full px-2 py-0.5 text-[11px] font-medium"
									:class="[
										index === 0 && selectedTag === 'ALL'
											? 'bg-brand-800/70 dark:bg-brand-300/70 text-brand-200 dark:text-brand-950 border border-brand-700/70 dark:border-brand-400/60'
											: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
										tIdx > (index === 0 && selectedTag === 'ALL' ? 0 : 1) ? 'hidden sm:inline-block' : '',
									]"
								>
									{{ tag }}
								</span>
							</div>
							<span
								class="shrink-0 text-[11px] font-mono"
								:class="index === 0 && selectedTag === 'ALL'
									? 'text-brand-300 dark:text-brand-800 font-medium'
									: 'text-slate-600 dark:text-slate-400'"
							>
								{{ item.date }}
							</span>
						</div>

						<h2
							class="line-clamp-2 text-lg font-bold leading-snug tracking-normal font-heading transition-colors duration-200 sm:text-xl"
							:class="index === 0 && selectedTag === 'ALL'
								? 'text-white dark:text-brand-950 group-hover:text-yellow-400 dark:group-hover:text-brand-700 md:text-2xl lg:text-3xl'
								: 'text-brand-950 dark:text-brand-100 group-hover:text-brand-900 dark:group-hover:text-yellow-600'"
						>
							{{ item.title }}
						</h2>

						<p
							class="line-clamp-3 mt-2 text-xs leading-relaxed sm:text-sm"
							:class="index === 0 && selectedTag === 'ALL'
								? 'text-brand-200/90 dark:text-brand-900/90'
								: 'text-slate-700 dark:text-slate-300'"
						>
							{{ item.description }}
						</p>
					</div>

					<div
						class="mt-5 flex items-center justify-between border-t pt-3.5 text-xs"
						:class="index === 0 && selectedTag === 'ALL'
							? 'border-brand-800/80 dark:border-brand-300/80'
							: 'border-slate-200/60 dark:border-slate-800/60'"
					>
						<span
							class="flex items-center gap-1 font-bold transition-all group-hover:translate-x-1"
							:class="index === 0 && selectedTag === 'ALL'
								? 'text-white dark:text-brand-950 group-hover:text-yellow-400 dark:group-hover:text-brand-700'
								: 'text-brand-800 dark:text-brand-400 group-hover:text-brand-950 dark:group-hover:text-yellow-600'"
						>
							{{ locale === 'id' ? 'Lihat Studi Kasus' : 'Explore Case Study' }} <span>↗</span>
						</span>
						<div
							v-if="item.demoUrl || item.link || item.githubUrl || item.repo"
							class="flex items-center gap-2"
							@click.stop
						>
							<a
								v-if="item.githubUrl || item.repo"
								:href="item.githubUrl || item.repo"
								target="_blank"
								rel="noopener"
								class="icon-btn !h-7 !w-7"
								:class="index === 0 && selectedTag === 'ALL' ? 'text-brand-200 dark:text-brand-900 hover:bg-white/10 dark:hover:bg-black/10' : ''"
								aria-label="GitHub Repository"
							>
								<span class="i-hugeicons-github text-xs" />
							</a>
							<a
								v-if="item.demoUrl || item.link"
								:href="item.demoUrl || item.link"
								target="_blank"
								rel="noopener"
								class="icon-btn !h-7 !w-7"
								:class="index === 0 && selectedTag === 'ALL' ? 'text-brand-200 dark:text-brand-900 hover:bg-white/10 dark:hover:bg-black/10' : ''"
								aria-label="Live Demo"
							>
								<span class="i-hugeicons-link-square-02 text-xs" />
							</a>
						</div>
					</div>
				</div>
			</NuxtLink>
		</div>

		<!-- Empty State Jika Tidak Ada Hasil Pencarian -->
		<div
			v-else
			class="bento-card-clean my-8 p-12 text-center"
		>
			<span class="i-hugeicons-folder-open mx-auto mb-3 block text-4xl text-slate-400" />
			<h3 class="text-lg text-slate-900 font-semibold font-heading dark:text-white">
				{{ locale === 'id' ? 'Tidak ada projek ditemukan' : 'No projects found' }}
			</h3>
			<p class="mb-4 mt-1 text-xs text-slate-600 dark:text-slate-400">
				{{ locale === 'id' ? 'Coba ubah kata kunci pencarian atau bersihkan filter tag.' : 'Try changing search keywords or resetting active tag filters.' }}
			</p>
			<button
				type="button"
				class="rounded-full bg-brand-700 px-4 py-2 text-xs text-white font-bold transition-colors hover:bg-brand-800"
				@click="selectedTag = 'ALL'; searchQuery = ''"
			>
				{{ locale === 'id' ? 'Reset Pencarian' : 'Reset Filter' }}
			</button>
		</div>
	</div>
</template>
