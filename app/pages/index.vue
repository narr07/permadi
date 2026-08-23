<script setup lang="ts">
const { locale } = useI18n()

const blogCollection = computed(() => (locale.value === 'id' ? 'blog_id' : 'blog_en'))
const projectCollection = computed(() => (locale.value === 'id' ? 'projek_id' : 'projek_en'))
const pageCollection = computed(() => (locale.value === 'id' ? 'home_id' : 'home_en'))

// 1. Data halaman beranda dari Nuxt Content (home_id / home_en)
const { data: page } = await useAsyncData(
	() => `home-${locale.value}`,
	() => queryCollection(pageCollection.value).first(),
	{ watch: [locale] },
)

// 2. Tulisan terbaru (lazy - below fold)
const { data: latestPosts } = await useAsyncData(
	() => `home-latest-posts-${locale.value}`,
	() => queryCollection(blogCollection.value).order('date', 'DESC').limit(4).all(),
	{ watch: [locale], lazy: true },
)

// 3. Proyek unggulan terbaru (lazy - below fold)
const { data: featuredProject } = await useAsyncData(
	() => `home-featured-proj-${locale.value}`,
	() => queryCollection(projectCollection.value).order('date', 'DESC').first(),
	{ watch: [locale], lazy: true },
)

// 4. Cuplikan galeri dari Cloudinary API
const { data: galleryItems } = await useAsyncData(
	'home-galeri-preview',
	() => $fetch<any[]>('/api/cloudinary-gallery').catch(() => []),
	{ lazy: true },
)

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
		<!-- 1. Header Pengenalan Halaman (HomeIntro) -->
		<HomeIntro
			:eyebrow="page?.eyebrow"
			:headline="page?.headline"
			:description="page?.description"
		/>

		<!-- 2. Bento Grid Utama (12 Kolom Komponen Modular) -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-12 sm:gap-5">
			<!-- Hero Card Utama -->
			<HomeHero :hero="page?.hero" />

			<!-- Kartu Projek Terpilih -->
			<HomeFeaturedProject
				:project="featuredProject"
				:label="page?.project_section?.label"
				:fallback-title="page?.project_section?.fallback_title"
				:fallback-description="page?.project_section?.fallback_description"
				:all-link-text="page?.project_section?.all_link_text"
			/>

			<!-- Kartu Filosofi Bento (#facd87) -->
			<HomePhilosophy :philosophy="page?.philosophy" />

			<!-- Kartu Eksplorasi Visual -->
			<HomeExploreCard
				:gallery-item="galleryItems?.[0]"
				:label="page?.explore?.label"
				:text="page?.explore?.text"
			/>

			<!-- Kartu Arsip Galeri -->
			<HomeArchiveCard :archive="page?.archive" />

			<!-- Kartu Tulisan Terbaru (12 Kolom) -->
			<HomeLatestPosts
				:posts="latestPosts || []"
				:writing="page?.writing"
			/>
		</div>
	</div>
</template>
