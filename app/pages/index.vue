<script setup lang="ts">
const { locale } = useI18n()

const blogCollection = computed(() => (locale.value === 'id' ? 'blog_id' : 'blog_en'))
const projectCollection = computed(() => (locale.value === 'id' ? 'projek_id' : 'projek_en'))
const pageCollection = computed(() => (locale.value === 'id' ? 'home_id' : 'home_en'))

const { data: page } = await useAsyncData(
	() => `home-${locale.value}`,
	() => queryCollection(pageCollection.value).first(),
	{ watch: [locale] },
)

const { data: latestPosts } = await useAsyncData(
	() => `home-latest-posts-${locale.value}`,
	() => queryCollection(blogCollection.value).order('date', 'DESC').limit(4).all(),
	{ watch: [locale] },
)

const { data: featuredProject } = await useAsyncData(
	() => `home-featured-proj-${locale.value}`,
	() => queryCollection(projectCollection.value).order('date', 'DESC').first(),
	{ watch: [locale] },
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
		<HomeIntro
			:eyebrow="page?.eyebrow"
			:headline="page?.headline"
			:description="page?.description"
		/>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-12 sm:gap-5">
			<HomeHero :hero="page?.hero" />

			<LazyHomeFeaturedProject
				hydrate-on-visible
				:project="featuredProject"
				:label="page?.project_section?.label"
				:fallback-title="page?.project_section?.fallback_title"
				:fallback-description="page?.project_section?.fallback_description"
				:all-link-text="page?.project_section?.all_link_text"
			/>

			<LazyHomePhilosophy
				hydrate-on-visible
				:philosophy="page?.philosophy"
			/>

			<LazyHomeProgrammingSkills
				hydrate-on-visible
				:skills-data="page?.skills_section"
			/>

			<LazyHomeDesignSkills
				hydrate-on-visible
				:skills-data="page?.skills_section"
			/>

			<LazyHomeLatestPosts
				hydrate-on-visible
				:posts="latestPosts || []"
				:writing="page?.writing"
			/>
		</div>
	</div>
</template>
