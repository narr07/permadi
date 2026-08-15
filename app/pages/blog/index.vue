<script setup lang="ts">
	const { locale, t } = useI18n()
	const localePath = useLocalePath()
	const pageCollection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
	const blogCollection = computed(() => (locale.value === 'id' ? 'blog_id' : 'blog_en'))
	const currentPath = computed(() => `/${locale.value}/blog`)

	const searchQuery = ref('')
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

	const filteredPosts = computed(() => {
		if (!posts.value) return []
		return posts.value
			.filter((post: any) => {
				const q = searchQuery.value.trim().toLowerCase()
				const matchesQuery =
					!q ||
					post.title?.toLowerCase().includes(q) ||
					post.description?.toLowerCase().includes(q) ||
					post.tags?.some((tag: string) => tag.toLowerCase().includes(q)) ||
					post.plainText?.toLowerCase().includes(q)

				const matchesTag = selectedTag.value === 'ALL' || post.tags?.includes(selectedTag.value)
				return matchesQuery && matchesTag
			})
			.map((post: any) => ({
				...post,
				url: `/${locale.value}/blog/${post.slug || cleanSlug(post.path)}`,
			}))
	})

	useSeoMeta({
		title: computed(() => page.value?.title || 'Blog — Dinar Permadi Yusup'),
		description: computed(() => page.value?.description || 'Kumpulan tulisan dan eksplorasi mengenai arsitektur web, sistem desain, dan frontend engineering.'),
	})
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<!-- Page Header -->
		<header class="max-w-3xl mb-8 sm:mb-12">
			<span class="badge-neutral text-brand-600 dark:text-brand-400 font-semibold mb-3">
				<span class="i-lucide-book-open text-xs mr-1 inline-block" /> Articles & Essays
			</span>
			<h1 class="heading-hero text-slate-900 dark:text-white">
				{{ page?.title || 'Blog & Tulisan' }}
			</h1>
			<p class="text-body text-slate-600 dark:text-slate-300 mt-2 text-lg">
				{{ page?.description || 'Eksplorasi mendalam seputar Nuxt, TypeScript, sistem desain Bento, dan web performance.' }}
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
					:placeholder="t('search.search_blog', 'Cari artikel atau topik...')"
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
					Semua ({{ posts?.length || 0 }})
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

		<!-- Bento Grid Articles -->
		<div v-if="filteredPosts.length > 0" class="bento-grid">
			<NuxtLink
				v-for="(post, index) in filteredPosts"
				:key="post.url"
				:to="post.url"
				class="bento-card-outline bento-lift flex flex-col justify-between group block"
				:class="index === 0 && !searchQuery && selectedTag === 'ALL' ? 'lg:col-span-12 md:col-span-12 bento-highlight bg-brand-50/20 dark:bg-brand-950/20' : 'lg:col-span-6 md:col-span-6'"
			>
				<div>
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
						<span class="i-lucide-clock text-xs text-brand-500" />
						{{ post.readingTime || 5 }} min read
					</span>
					<span class="text-brand-600 dark:text-brand-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
						Baca Artikel <span class="i-lucide-arrow-right text-xs" />
					</span>
				</div>
			</NuxtLink>
		</div>

		<!-- Empty State -->
		<EmptyState
			v-else
			icon="i-lucide-search-x"
			title="Tidak Ada Artikel Ditemukan"
			description="Coba ubah kata kunci pencarian atau pilih filter kategori topik lain."
			:actions="[{ label: 'Reset Filter', to: localePath('/blog') }]"
		/>
	</div>
</template>
