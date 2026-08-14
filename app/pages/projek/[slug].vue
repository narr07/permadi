<script setup lang="ts">
	const route = useRoute()
	const requestedSlug = computed(() => route.params.slug as string)

	function cleanSlug(pathStr: string): string {
		const parts = pathStr.split('/')
		const lastPart = parts[parts.length - 1] || ''
		return lastPart.replace(/^\d+\./, '')
	}

	const { data: project } = await useAsyncData(
		() => `projek-item-id-${requestedSlug.value}`,
		async () => {
			const allProjects = await queryCollection('projek_id').all()
			let matched = allProjects.find((p: any) => {
				return p.slug === requestedSlug.value || cleanSlug(p.path) === requestedSlug.value
			})

			// Fallback jika slug bahasa Inggris diakses
			if (!matched) {
				const enProjects = await queryCollection('projek_en').all()
				const enMatched = enProjects.find((p: any) => {
					return p.slug === requestedSlug.value || cleanSlug(p.path) === requestedSlug.value
				})
				if (enMatched) {
					matched = allProjects.find((p: any) => p.idProjek === enMatched.idProjek || p.idItem === enMatched.idItem)
				}
			}

			return matched
		},
		{ watch: [requestedSlug] }
	)

	if (!project.value) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Projek tidak ditemukan',
		})
	}

	useSeoMeta({
		title: computed(() => project.value?.title),
		description: computed(() => project.value?.description),
	})
</script>

<template>
	<main class="page-container">
		<article v-if="project">
			<ContentRenderer :value="project" />
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
