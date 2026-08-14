<script setup lang="ts">
	const route = useRoute()
	const cleanPath = computed(() => {
		const path = route.path.replace(/\/+$/, '')
		return path === '' ? '/' : path
	})

	const { data: page } = await useAsyncData(
		() => 'content-' + cleanPath.value,
		async () => {
			const path = cleanPath.value

			// 1. Cek di collection 'pages'
			const mainPage = await queryCollection('pages').path(path).first()
			if (mainPage) {
				return mainPage
			}

			// 2. Cek di collection 'blog'
			const blogPost = await queryCollection('blog').path(path).first()
			if (blogPost) {
				return blogPost
			}

			// 3. Cek di collection 'projek'
			const projekItem = await queryCollection('projek').path(path).first()
			if (projekItem) {
				return projekItem
			}

			return null
		},
		{
			watch: [cleanPath],
		}
	)

	if (!page.value) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Halaman tidak ditemukan',
			fatal: false,
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
			<ContentRenderer
				:value="page"
			/>
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
