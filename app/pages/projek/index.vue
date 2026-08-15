<script setup lang="ts">
	const { locale } = useI18n()
	const localePath = useLocalePath()

	const collection = computed(() => (locale.value === 'id' ? 'projek_id' : 'projek_en'))
	const currentPath = computed(() => (locale.value === 'id' ? '/id/projek' : '/en/projects'))

	// Data halaman projek (deskripsi dan header)
	const { data: page } = await useAsyncData(
		() => `projek-page-${locale.value}`,
		() => queryCollection(locale.value === 'id' ? 'pages_id' : 'pages_en').path(currentPath.value).first(),
		{ watch: [locale] }
	)

	// Koleksi semua studi kasus projek
	const { data: projects } = await useAsyncData(
		() => `projek-list-${locale.value}`,
		() => queryCollection(collection.value).order('date', 'DESC').all(),
		{ watch: [locale] }
	)

	// State filter tag
	const selectedTag = ref('ALL')

	// Daftar seluruh tag teknologi unik
	const allTags = computed(() => {
		if (!projects.value) return []
		const tagsSet = new Set<string>()
		projects.value.forEach((item: any) => {
			const tags = item.tags || item.tech || []
			tags.forEach((t: string) => tagsSet.add(t))
		})
		return Array.from(tagsSet)
	})

	const tagCounts = computed(() => {
		const map: Record<string, number> = {}
		if (projects.value) {
			for (const item of projects.value) {
				const tags = item.tags || item.tech || []
				for (const tag of tags) {
					map[tag] = (map[tag] || 0) + 1
				}
			}
		}
		return map
	})

	// Filter projek berdasarkan tag
	const filteredProjects = computed(() => {
		if (!projects.value) return []
		return projects.value
			.filter((item: any) => {
				return selectedTag.value === 'ALL'
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
		<!-- Page Header -->
		<header class="max-w-3xl mb-8 sm:mb-10">
			<span class="section-label text-brand-600 dark:text-brand-400 font-bold mb-3 block">
				{{ locale === 'id' ? 'Karya & Eksplorasi' : 'Work & Explorations' }}
			</span>
			<h1 class="font-heading font-black text-slate-900  text-4xl sm:text-6xl leading-[0.95] tracking-tight mb-4">
				{{ page?.title || (locale === 'id' ? 'Projek & Studi Kasus' : 'Projects & Case Studies') }}
			</h1>
			<p class="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
				{{ page?.description || (locale === 'id' ? 'Koleksi aplikasi web terkurasi, modul UI, dan studi kasus sistem performa tinggi.' : 'A curated collection of web applications, UI modules, and high-performance case studies.') }}
			</p>
		</header>

		<!-- Bento Topic / Tag Filter Toolbar -->
		<BentoTagFilter
			v-model="selectedTag"
			:tags="allTags"
			:counts="tagCounts"
			:total-count="filteredProjects.length"
			type="project"
		/>

		<!-- Bento Grid Projects (1 col mobile, 2 col tablet, 3 col desktop) -->
		<div v-if="filteredProjects.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
			<NuxtLink
				v-for="(item, index) in filteredProjects"
				:key="item.url"
				:to="item.url"
				class="bento-card-clean flex flex-col justify-between group block overflow-hidden p-5 sm:p-6"
				:class="index === 0
					? 'lg:col-span-2 sm:col-span-2 md:flex-row md:items-center md:gap-6 bg-brand-50/20 dark:bg-brand-950/20'
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
						class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
						loading="lazy"
					/>
				</div>

				<!-- Content & Details -->
				<div class="flex-1 flex flex-col justify-between" :class="index === 0 ? 'md:py-2' : ''">
					<div>
						<div class="flex items-center justify-between gap-2 mb-2.5">
							<div class="flex flex-wrap gap-1.5">
								<span v-if="index === 0" class="px-2.5 py-0.5 rounded-full text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-100/80 dark:bg-brand-900/60">
									<span class="i-hugeicons-sparkles text-[11px] mr-0.5" /> {{ locale === 'id' ? 'Terbaru' : 'Latest' }}
								</span>
								<span v-for="tag in (item.tags || item.tech || [])" :key="tag" class="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
									{{ tag }}
								</span>
							</div>
							<span class="text-xs font-mono text-slate-400">
								{{ item.date }}
							</span>
						</div>

						<h2
							class="font-heading font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
							:class="index === 0 ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'"
						>
							{{ item.title }}
						</h2>

						<p class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2 line-clamp-3 leading-relaxed">
							{{ item.description }}
						</p>
					</div>

					<div class="mt-5 pt-3.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
						<span class="text-brand-600 dark:text-brand-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
							{{ locale === 'id' ? 'Lihat Studi Kasus' : 'Explore Case Study' }} <span>↗</span>
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

		<!-- Empty State Jika Tidak Ada Hasil Pencarian -->
		<div v-else class="bento-card-clean p-12 text-center my-8">
			<span class="i-hugeicons-folder-open text-4xl text-slate-400 mx-auto block mb-3" />
			<h3 class="font-heading font-semibold text-lg text-slate-900 dark:text-white">
				{{ locale === 'id' ? 'Tidak ada projek ditemukan' : 'No projects found' }}
			</h3>
			<p class="text-xs text-slate-500 mt-1 mb-4">
				{{ locale === 'id' ? 'Coba ubah kata kunci pencarian atau bersihkan filter tag.' : 'Try changing search keywords or resetting active tag filters.' }}
			</p>
			<button
				type="button"
				class="px-4 py-2 rounded-full text-xs font-bold bg-brand-500 text-white"
				@click="selectedTag = 'ALL'; searchQuery = ''"
			>
				{{ locale === 'id' ? 'Reset Pencarian' : 'Reset Filter' }}
			</button>
		</div>
	</div>
</template>
