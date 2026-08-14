<script setup lang="ts">
	const { data: page } = await useAsyncData(
		'tentang-page-id',
		() => queryCollection('pages_id').path('/id/tentang').first()
	)

	if (!page.value) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Halaman tidak ditemukan',
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
