<script setup lang="ts">
	const { locale, t } = useI18n()
	const localePath = useLocalePath()
	const pageCollection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
	const projectCollection = computed(() => (locale.value === 'id' ? 'projek_id' : 'projek_en'))
	const currentPath = computed(() => (locale.value === 'id' ? '/id/projek' : '/en/projects'))

	const searchQuery = ref('')
	const selectedTag = ref<string>('ALL')

	const { data: page } = await useAsyncData(
		() => 'projek-index-' + locale.value,
		() => queryCollection(pageCollection.value).path(currentPath.value).first(),
		{ watch: [locale] }
	)

	const { data: projects } = await useAsyncData(
		() => 'projek-list-' + locale.value,
		() => queryCollection(projectCollection.value).order('date', 'DESC').all(),
		{ watch: [locale] }
	)

	function cleanSlug(pathStr: string): string {
		const parts = pathStr.split('/')
		const lastPart = parts[parts.length - 1] || ''
		return lastPart.replace(/^\d+\./, '')
	}

	const allTags = computed(() => {
		if (!projects.value) return []
		const tagSet = new Set<string>()
		for (const item of projects.value) {
			if (Array.isArray(item.tags)) {
				item.tags.forEach((tag: string) => tagSet.add(tag))
			}
		}
		return Array.from(tagSet)
	})

	const filteredProjects = computed(() => {
		if (!projects.value) return []
		return projects.value
			.filter((item: any) => {
				const q = searchQuery.value.trim().toLowerCase()
				const matchesQuery =
					!q ||
					item.title?.toLowerCase().includes(q) ||
					item.description?.toLowerCase().includes(q) ||
					item.tags?.some((tag: string) => tag.toLowerCase().includes(q)) ||
					item.plainText?.toLowerCase().includes(q)

				const matchesTag = selectedTag.value === 'ALL' || item.tags?.includes(selectedTag.value)
				return matchesQuery && matchesTag
			})
			.map((item: any) => {
				const projectSlug = item.slug || cleanSlug(item.path)
				const basePath = locale.value === 'id' ? `/id/projek/${projectSlug}` : `/en/projects/${projectSlug}`
				return {
					...item,
					url: basePath,
				}
			})
	})

	useSeoMeta({
		title: computed(() => page.value?.title || (locale.value === 'id' ? 'Projek — Dinar Permadi Yusup' : 'Projects — Dinar Permadi Yusup')),
		description: computed(() => page.value?.description || (locale.value === 'id' ? 'Portofolio karya, sistem desain, dan aplikasi web yang dibangun dengan standar performa tinggi.' : 'Curated portfolio of frontend engineering, design systems, and web projects.')),
	})
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<!-- Page Header -->
		<header class="max-w-3xl mb-8 sm:mb-12">
			<span class="badge-neutral text-brand-600 dark:text-brand-400 font-semibold mb-3">
				<span class="i-hugeicons-code-folder text-xs mr-1 inline-block" /> {{ locale === 'id' ? 'Karya & Eksplorasi' : 'Work & Explorations' }}
			</span>
			<h1 class="heading-hero text-slate-900 dark:text-white">
				{{ page?.title || (locale === 'id' ? 'Projek & Studi Kasus' : 'Projects & Case Studies') }}
			</h1>
			<p class="text-body text-slate-600 dark:text-slate-300 mt-2 text-lg">
				{{ page?.description || (locale === 'id' ? 'Koleksi aplikasi web terkurasi, modul UI, dan studi kasus sistem performa tinggi.' : 'A curated collection of web applications, UI modules, and high-performance case studies.') }}
			</p>
		</header>

		<!-- Filter & Search Toolbar -->
		<div class="bento-card-subtle mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
			<!-- Search Input -->
			<div class="relative flex-1 max-w-md">
				<span class="i-hugeicons-search-01 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
				<input
					v-model="searchQuery"
					type="text"
					:placeholder="locale === 'id' ? 'Cari projek berdasarkan nama atau topik...' : 'Search project by name or tech stack...'"
					class="focus-ring w-full pl-10 pr-4 py-2 text-xs rounded-bento bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
				>
			</div>

			<!-- Filter Tags -->
			<div class="flex items-center gap-1.5 flex-wrap">
				<button
					type="button"
					class="focus-ring px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer"
					:class="selectedTag === 'ALL' ? 'bg-brand-500 text-white shadow-xs font-semibold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
					@click="selectedTag = 'ALL'"
				>
					{{ locale === 'id' ? 'Semua' : 'All' }}
				</button>
				<button
					v-for="tag in allTags"
					:key="tag"
					type="button"
					class="focus-ring px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer"
					:class="selectedTag === tag ? 'bg-brand-500 text-white shadow-xs font-semibold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
					@click="selectedTag = tag"
				>
					#{{ tag }}
				</button>
			</div>
		</div>

		<!-- Bento Grid Projects (1 col mobile, 2 col tablet, 3 col desktop) -->
		<div v-if="filteredProjects.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
			<NuxtLink
				v-for="(item, index) in filteredProjects"
				:key="item.url"
				:to="item.url"
				class="bento-card-outline bento-lift flex flex-col justify-between group block overflow-hidden"
				:class="index === 0
					? 'lg:col-span-2 sm:col-span-2 md:flex-row md:items-center md:gap-6 bg-brand-50/25 dark:bg-brand-950/25 bento-highlight'
					: 'col-span-1'"
			>
				<!-- Thumbnail (Hanya 1 Gambar) -->
				<div
					v-if="item.image || (item.images && item.images[0])"
					class="mb-4 rounded-bento overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-video border border-slate-200/50 dark:border-slate-800/50 shrink-0"
					:class="index === 0 ? 'md:mb-0 md:w-1/2' : 'w-full'"
				>
					<NuxtImg
						:src="item.image || item.images[0]"
						:alt="item.title"
						format="webp"
						quality="85"
						class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						loading="lazy"
					/>
				</div>

				<!-- Content & Details -->
				<div class="flex-1 flex flex-col justify-between" :class="index === 0 ? 'md:py-2' : ''">
					<div>
						<div class="flex items-center justify-between gap-2 mb-2.5">
							<div class="flex flex-wrap gap-1.5">
								<span v-if="index === 0" class="badge-neutral text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-100/70 dark:bg-brand-900/50">
									<span class="i-hugeicons-sparkles text-[11px] mr-0.5" /> Terbaru
								</span>
								<span v-for="tag in (item.tags || item.tech || [])" :key="tag" class="badge-neutral text-xs">
									{{ tag }}
								</span>
							</div>
							<span class="text-meta text-xs">
								{{ item.date }}
							</span>
						</div>

						<h2
							class="font-heading font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
							:class="index === 0 ? 'text-g2 sm:text-g3' : 'text-g1 sm:text-g2'"
						>
							{{ item.title }}
						</h2>

						<p class="text-body mt-2 text-slate-600 dark:text-slate-300 text-sm line-clamp-3">
							{{ item.description }}
						</p>
					</div>

					<div class="mt-5 pt-3.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-meta text-xs">
						<span class="text-brand-600 dark:text-brand-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
							Lihat Detail Case Study <span class="i-hugeicons-arrow-right-01 text-xs" />
						</span>
						<div v-if="item.demoUrl || item.link || item.githubUrl || item.repo" class="flex items-center gap-2" @click.stop>
							<a
								v-if="item.githubUrl || item.repo"
								:href="item.githubUrl || item.repo"
								target="_blank"
								rel="noopener"
								class="icon-btn !w-7 !h-7"
								aria-label="GitHub Repository"
							>
								<span class="i-hugeicons-github text-xs" />
							</a>
							<a
								v-if="item.demoUrl || item.link"
								:href="item.demoUrl || item.link"
								target="_blank"
								rel="noopener"
								class="icon-btn !w-7 !h-7"
								aria-label="Live Demo"
							>
								<span class="i-hugeicons-link-square-02 text-xs" />
							</a>
						</div>
					</div>
				</div>
			</NuxtLink>
		</div>

		<!-- Empty State -->
		<EmptyState
			v-else
			icon="i-hugeicons-code-folder"
			title="Tidak Ada Projek Ditemukan"
			description="Coba gunakan kata kunci pencarian yang lain atau reset filter kategori."
			:actions="[{ label: 'Lihat Semua Projek', to: '/id/projek' }]"
		/>
	</div>
</template>
