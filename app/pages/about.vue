<script setup lang="ts">
	const { locale } = useI18n()
	const collection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
	const currentPath = computed(() => (locale.value === 'id' ? '/id/tentang' : '/en/about'))

	const { data: page } = await useAsyncData(
		() => 'about-page-' + locale.value,
		() => queryCollection(collection.value).path(currentPath.value).first(),
		{ watch: [locale] }
	)

	if (!page.value) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Page not found',
		})
	}

	useSeoMeta({
		title: computed(() => page.value?.title),
		description: computed(() => page.value?.description),
	})
</script>

<template>
	<main class="page-container">
		<article v-if="page">
			<ContentRenderer :value="page" />
		</article>
	</main>
</template>

<style scoped>
	.page-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		line-height: 1.6;
	}
</style>
