<script setup lang="ts">
	const route = useRoute()
	const { locale, locales } = useI18n()
	const localePath = useLocalePath()
	const setI18nParams = useSetI18nParams()

	const requestedSlug = computed(() => route.params.slug as string)
	const collection = computed(() => (locale.value === 'id' ? 'projek_id' : 'projek_en'))

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

			// Fallback: Jika slug bahasa Inggris diakses di locale ini
			if (!matched) {
				const enProjects = await queryCollection('projek_en').all()
				const enMatched = enProjects.find((p: any) => {
					return p.slug === requestedSlug.value || cleanSlug(p.path) === requestedSlug.value
				})
				if (enMatched) {
					matched = allProjects.find((p: any) => p.idProjek === enMatched.idProjek || p.idItem === enMatched.idItem)
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
		{ watch: [requestedSlug] }
	)

	if (project.value?.translations) {
		setI18nParams(project.value.translations)
	}

	if (!project.value?.doc) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Projek tidak ditemukan',
		})
	}

	useSeoMeta({
		title: computed(() => project.value?.doc?.title),
		description: computed(() => project.value?.doc?.description),
	})
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<!-- Back Button -->
		<NuxtLink
			:to="localePath('/projek')"
			class="focus-ring inline-flex items-center gap-1.5 text-meta text-xs font-semibold hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-8"
		>
			<span class="i-lucide-arrow-left text-sm" /> Kembali ke Semua Projek
		</NuxtLink>

		<!-- Project Article Container -->
		<article v-if="project?.doc" class="max-w-3xl mx-auto">
			<!-- Header -->
			<header class="mb-10 pb-8 border-b border-slate-200/80 dark:border-slate-800/80">
				<div class="flex flex-wrap items-center gap-2 mb-4">
					<span v-for="tag in project.doc.tags" :key="tag" class="badge-neutral text-xs">
						{{ tag }}
					</span>
				</div>
				<h1 class="heading-hero text-slate-900 dark:text-white text-3xl sm:text-4xl md:text-5xl leading-tight">
					{{ project.doc.title }}
				</h1>
				<p class="text-body text-slate-600 dark:text-slate-300 text-lg mt-4 leading-relaxed">
					{{ project.doc.description }}
				</p>
				<div class="flex flex-wrap items-center justify-between gap-4 text-meta text-xs mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
					<div class="flex items-center gap-4">
						<span class="flex items-center gap-1.5 font-medium">
							<span class="i-lucide-calendar text-sm text-brand-500" />
							{{ project.doc.date }}
						</span>
						<span>•</span>
						<span class="flex items-center gap-1.5 font-medium">
							<span class="i-lucide-clock text-sm text-brand-500" />
							{{ project.doc.readingTime || 5 }} min read
						</span>
					</div>

					<!-- External Links -->
					<div class="flex items-center gap-2">
						<a
							v-if="project.doc.githubUrl"
							:href="project.doc.githubUrl"
							target="_blank"
							rel="noopener"
							class="btn-ghost !px-3 !py-1 text-xs border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5"
						>
							<span class="i-simple-icons-github text-xs" /> Source Code
						</a>
						<a
							v-if="project.doc.demoUrl"
							:href="project.doc.demoUrl"
							target="_blank"
							rel="noopener"
							class="btn-primary !px-3.5 !py-1 text-xs inline-flex items-center gap-1.5"
						>
							<span class="i-lucide-external-link text-xs" /> Live Demo
						</a>
					</div>
				</div>
			</header>

			<!-- Prose Content -->
			<div class="prose prose-slate dark:prose-invert max-w-none font-sans text-slate-700 dark:text-slate-200 leading-relaxed">
				<ContentRenderer :value="project.doc" />
			</div>
		</article>
	</div>
</template>
