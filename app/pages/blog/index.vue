<script setup lang="ts">
	const { locale, t } = useI18n()
	const localePath = useLocalePath()
	const pageCollection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
	const blogCollection = computed(() => (locale.value === 'id' ? 'blog_id' : 'blog_en'))
	const currentPath = computed(() => `/${locale.value}/blog`)

	const selectedTag = ref<string>('ALL')

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
			<!-- <span class="badge-neutral text-brand-600 dark:text-brand-400 font-semibold mb-3">
				<span class="i-hugeicons-book-open-01 text-xs mr-1 inline-block" /> Articles & Essays
			</span> -->
			<h1 class="heading-hero text-slate-900 ">
				{{ page?.title || 'Blog & Tulisan' }}
			</h1>
			<p class="text-body text-slate-600 dark:text-slate-300 mt-2 text-lg">
				{{ page?.description || 'Eksplorasi mendalam seputar Nuxt, TypeScript, sistem desain Bento, dan web performance.' }}
			</p>
		</header>

		<!-- Bento Topic / Tag Filter Toolbar -->
		<BentoTagFilter
			v-model="selectedTag"
			:tags="allTags"
			:counts="tagCounts"
			:total-count="filteredPosts.length"
			type="blog"
		/>

		<!-- Bento Grid Articles -->
		<div v-if="filteredPosts.length > 0" class="bento-grid">
			<NuxtLink
				v-for="(post, index) in filteredPosts"
				:key="post.url"
				:to="post.url"
				class="bento-card-outline bento-lift flex flex-col justify-between group block"
				:class="index === 0 && selectedTag === 'ALL' ? 'lg:col-span-12 md:col-span-12 bento-highlight bg-brand-50/20 dark:bg-brand-950/20' : 'lg:col-span-6 md:col-span-6'"
			>
				<div>
					<div v-if="post.cover" class="mb-4 rounded-bento overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-video border border-slate-200/50 dark:border-slate-800/50">
						<NuxtImg
							:src="post.cover"
							:alt="post.title"
							format="webp"
							quality="85"
							class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
							loading="lazy"
						/>
					</div>

					<div class="flex items-center justify-between gap-2 mb-3">
						<div class="flex flex-wrap gap-1.5">
							<span v-for="tag in post.tags" :key="tag" class="badge-neutral text-xs">
								#{{ tag }}
							</span>
						</div>
						<span class="text-meta text-xs whitespace-nowrap">
							{{ post.date }}
						</span>
					</div>

					<h2
						class="font-heading font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
						:class="index === 0 && !searchQuery && selectedTag === 'ALL' ? 'text-g3 md:text-g4' : 'text-g2'"
					>
						{{ post.title }}
					</h2>

					<p class="text-body mt-2.5 text-slate-600 dark:text-slate-300 line-clamp-3">
						{{ post.description }}
					</p>
				</div>

				<div class="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-meta text-xs">
					<span class="flex items-center gap-1">
						<span class="i-hugeicons-clock-01 text-xs text-brand-500" />
						{{ post.readingTime || 5 }} min read
					</span>
					<span class="text-brand-600 dark:text-brand-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
						Baca Artikel <span class="i-hugeicons-arrow-right-01 text-xs" />
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
