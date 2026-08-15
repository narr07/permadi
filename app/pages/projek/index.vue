<script setup lang="ts">
	const { locale, t } = useI18n()
	const localePath = useLocalePath()
	const pageCollection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
	const projectCollection = computed(() => (locale.value === 'id' ? 'projek_id' : 'projek_en'))
	const currentPath = computed(() => (locale.value === 'id' ? '/id/projek' : '/en/projects'))

	const searchQuery = ref('')
	const selectedTag = ref<string>('ALL')

	const { data: page } = await useAsyncData(
		() => 'projek-index-id',
		() => queryCollection('pages_id').path('/id/projek').first()
	)

	const { data: projects } = await useAsyncData(
		() => 'projek-list-id',
		() => queryCollection('projek_id').order('date', 'DESC').all()
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
			.map((item: any) => ({
				...item,
				url: `/id/projek/${item.slug || cleanSlug(item.path)}`,
			}))
	})

	useSeoMeta({
		title: computed(() => page.value?.title || 'Projek — Dinar Permadi Yusup'),
		description: computed(() => page.value?.description || 'Portofolio karya, sistem desain, dan aplikasi web yang dibangun dengan standar performa tinggi.'),
	})
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<!-- Page Header -->
		<header class="max-w-3xl mb-8 sm:mb-12">
			<span class="badge-neutral text-brand-600 dark:text-brand-400 font-semibold mb-3">
				<span class="i-lucide-folder-git-2 text-xs mr-1 inline-block" /> Karya & Eksplorasi
			</span>
			<h1 class="heading-hero text-slate-900 dark:text-white">
				{{ page?.title || 'Projek & Studi Kasus' }}
			</h1>
			<p class="text-body text-slate-600 dark:text-slate-300 mt-2 text-lg">
				{{ page?.description || 'Studi kasus implementasi sistem desain, frontend engineering, dan arsitektur web modern.' }}
			</p>
		</header>

		<!-- Search & Tag Filter Bar -->
		<div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
			<!-- Live Search Input -->
			<div class="relative max-w-md w-full">
				<span class="i-lucide-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
				<input
					v-model="searchQuery"
					type="search"
					class="focus-ring w-full pl-10 pr-10 py-2 rounded-bento border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-g1 placeholder:text-slate-400 text-slate-900 dark:text-white"
					:placeholder="t('search.search_projects', 'Cari projek atau teknologi...')"
				>
				<button
					v-if="searchQuery"
					type="button"
					class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
					aria-label="Bersihkan pencarian"
					@click="searchQuery = ''"
				>
					<span class="i-lucide-x text-sm" />
				</button>
			</div>

			<!-- Tag Filter Pills -->
			<div v-if="allTags.length > 0" class="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
				<button
					type="button"
					class="focus-ring px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer"
					:class="selectedTag === 'ALL' ? 'bg-brand-500 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'"
					@click="selectedTag = 'ALL'"
				>
					Semua ({{ projects?.length || 0 }})
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

		<!-- Bento Grid Projects -->
		<div v-if="filteredProjects.length > 0" class="bento-grid">
			<NuxtLink
				v-for="(item, index) in filteredProjects"
				:key="item.url"
				:to="item.url"
				class="bento-card-outline bento-lift flex flex-col justify-between group block overflow-hidden"
				:class="index === 0 && !searchQuery && selectedTag === 'ALL' ? 'lg:col-span-12 md:col-span-12 bento-highlight' : 'lg:col-span-6 md:col-span-6'"
			>
				<div>
					<div class="flex items-center justify-between gap-2 mb-3">
						<div class="flex flex-wrap gap-1.5">
							<span v-for="tag in item.tags" :key="tag" class="badge-neutral text-xs">
								{{ tag }}
							</span>
						</div>
						<span class="text-meta text-xs">
							{{ item.date }}
						</span>
					</div>

					<h2
						class="font-heading font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
						:class="index === 0 && !searchQuery && selectedTag === 'ALL' ? 'text-g3 md:text-g4' : 'text-g2'"
					>
						{{ item.title }}
					</h2>

					<p class="text-body mt-2 text-slate-600 dark:text-slate-300 line-clamp-3">
						{{ item.description }}
					</p>
				</div>

				<div class="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-meta text-xs">
					<span class="text-brand-600 dark:text-brand-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
						Lihat Detail Case Study <span class="i-lucide-arrow-right text-xs" />
					</span>
					<div v-if="item.demoUrl || item.githubUrl" class="flex items-center gap-2" @click.stop>
						<a
							v-if="item.githubUrl"
							:href="item.githubUrl"
							target="_blank"
							rel="noopener"
							class="icon-btn !w-7 !h-7"
							aria-label="GitHub Repository"
						>
							<span class="i-simple-icons-github text-xs" />
						</a>
						<a
							v-if="item.demoUrl"
							:href="item.demoUrl"
							target="_blank"
							rel="noopener"
							class="icon-btn !w-7 !h-7"
							aria-label="Live Demo"
						>
							<span class="i-lucide-external-link text-xs" />
						</a>
					</div>
				</div>
			</NuxtLink>
		</div>

		<!-- Empty State -->
		<EmptyState
			v-else
			icon="i-lucide-folder-x"
			title="Tidak Ada Projek Ditemukan"
			description="Coba gunakan kata kunci pencarian yang lain atau reset filter kategori."
			:actions="[{ label: 'Lihat Semua Projek', to: '/id/projek' }]"
		/>
	</div>
</template>
