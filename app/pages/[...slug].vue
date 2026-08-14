<script setup lang="ts">
	const route = useRoute()
	const { locale } = useI18n()

	const cleanPath = computed(() => {
		const path = route.path.replace(/\/+$/, '')
		return path === '' ? '/' : path
	})

	const pagesCollection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
	const blogCollection = computed(() => (locale.value === 'id' ? 'blog_id' : 'blog_en'))
	const projekCollection = computed(() => (locale.value === 'id' ? 'projek_id' : 'projek_en'))

	const { data: page } = await useAsyncData(
		() => 'content-' + cleanPath.value,
		async () => {
			const path = cleanPath.value

			// 1. Cek di collection pages sesuai locale
			const mainPage = await queryCollection(pagesCollection.value).path(path).first()
			if (mainPage) {
				return mainPage
			}

			// 2. Cek di collection blog sesuai locale
			const blogPost = await queryCollection(blogCollection.value).path(path).first()
			if (blogPost) {
				return blogPost
			}

			// 3. Cek di collection projek sesuai locale
			const projekItem = await queryCollection(projekCollection.value).path(path).first()
			if (projekItem) {
				return projekItem
			}

			return null
		},
		{
			watch: [cleanPath, locale],
		}
	)

	if (!page.value) {
		throw createError({
			statusCode: 404,
			statusMessage: locale.value === 'id' ? 'Halaman tidak ditemukan' : 'Page not found',
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
