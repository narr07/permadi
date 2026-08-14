<script setup lang="ts">
	const route = useRoute()
	const { locale, locales } = useI18n()
	const setI18nParams = useSetI18nParams()

	const requestedSlug = computed(() => route.params.slug as string)
	const collection = computed(() => (locale.value === 'id' ? 'projek_id' : 'projek_en'))

	function cleanSlug(pathStr: string): string {
		const parts = pathStr.split('/')
		const lastPart = parts[parts.length - 1] || ''
		return lastPart.replace(/^\d+\./, '')
	}

	const { data: project } = await useAsyncData(
		() => `project-item-${locale.value}-${requestedSlug.value}`,
		async () => {
			const allProjects = await queryCollection(collection.value).all()
			let matched = allProjects.find((p: any) => {
				return p.slug === requestedSlug.value || cleanSlug(p.path) === requestedSlug.value
			})

			// Fallback: Jika slug bahasa lain diakses di locale ini, temukan padanannya via idProjek
			if (!matched) {
				const otherCollection = (locale.value === 'id' ? 'projek_en' : 'projek_id') as any
				const otherProjects = await queryCollection(otherCollection).all()
				const otherMatched = otherProjects.find((p: any) => {
					return p.slug === requestedSlug.value || cleanSlug(p.path) === requestedSlug.value
				})
				if (otherMatched) {
					matched = allProjects.find((p: any) => p.idProjek === otherMatched.idProjek || p.idItem === otherMatched.idItem)
				}
			}

			if (!matched) return null

			// Cari padanan projek di bahasa lain berdasarkan idProjek / idItem
			const translations: Record<string, { slug: string }> = {}
			for (const loc of locales.value) {
				const locCode = typeof loc === 'string' ? loc : loc.code
				const locCol = (locCode === 'id' ? 'projek_id' : 'projek_en') as any
				const locProjects = await queryCollection(locCol).all()
				const trDoc = locProjects.find((p: any) => p.idProjek === matched.idProjek || p.idItem === matched.idItem)
				if (trDoc) {
					translations[locCode] = {
						slug: trDoc.slug || cleanSlug(trDoc.path),
					}
				}
			}

			return {
				doc: matched,
				translations,
			}
		},
		{ watch: [locale, requestedSlug] }
	)

	if (project.value?.translations) {
		setI18nParams(project.value.translations)
	}

	if (!project.value?.doc) {
		throw createError({
			statusCode: 404,
			statusMessage: locale.value === 'id' ? 'Projek tidak ditemukan' : 'Project not found',
		})
	}

	useSeoMeta({
		title: computed(() => project.value?.doc?.title),
		description: computed(() => project.value?.doc?.description),
	})
</script>

<template>
	<main class="page-container">
		<article v-if="project?.doc">
			<ContentRenderer :value="project.doc" />
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
