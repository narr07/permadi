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
		() => `projek-item-${locale.value}-${requestedSlug.value}`,
		async () => {
			const colName = collection.value
			const allProjects = await queryCollection(colName).all()
			let matched = allProjects.find((p: any) => {
				return p.slug === requestedSlug.value || cleanSlug(p.path) === requestedSlug.value
			})

			// Fallback: Jika slug bahasa lain diakses
			if (!matched) {
				const otherCol = (locale.value === 'id' ? 'projek_en' : 'projek_id') as any
				const otherProjects = await queryCollection(otherCol).all()
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

	watch(
		() => project.value?.translations,
		(newTranslations) => {
			if (newTranslations) {
				setI18nParams(newTranslations)
			}
		},
		{ immediate: true }
	)

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

	// Koleksi tangkapan layar untuk Bento Gallery
	const allScreenshots = computed(() => {
		const doc = project.value?.doc
		if (!doc) return []
		const list: string[] = []
		if (doc.images && Array.isArray(doc.images)) {
			list.push(...doc.images)
		} else if (doc.image) {
			list.push(doc.image)
		}
		// Hapus duplikasi jika ada
		return Array.from(new Set(list))
	})

	// State & Handler Lightbox interaktif
	const activeLightboxIndex = ref<number | null>(null)

	function openLightbox(index: number) {
		activeLightboxIndex.value = index
	}

	function closeLightbox() {
		activeLightboxIndex.value = null
	}

	function nextImage() {
		if (activeLightboxIndex.value !== null && allScreenshots.value.length > 0) {
			activeLightboxIndex.value = (activeLightboxIndex.value + 1) % allScreenshots.value.length
		}
	}

	function prevImage() {
		if (activeLightboxIndex.value !== null && allScreenshots.value.length > 0) {
			activeLightboxIndex.value =
				(activeLightboxIndex.value - 1 + allScreenshots.value.length) % allScreenshots.value.length
		}
	}

	onMounted(() => {
		function handleKeydown(e: KeyboardEvent) {
			if (activeLightboxIndex.value === null) return
			if (e.key === 'Escape') closeLightbox()
			else if (e.key === 'ArrowRight') nextImage()
			else if (e.key === 'ArrowLeft') prevImage()
		}
		window.addEventListener('keydown', handleKeydown)
		onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
	})
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<!-- Back Button -->
		<NuxtLink
			:to="locale === 'id' ? '/id/projek' : '/en/projects'"
			class="focus-ring inline-flex items-center gap-1.5 text-meta text-xs font-semibold hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-8"
		>
			<span class="i-hugeicons-arrow-left-01 text-sm" /> {{ locale === 'id' ? 'Kembali ke Semua Projek' : 'Back to All Projects' }}
		</NuxtLink>

		<!-- Project Article Container -->
		<article v-if="project?.doc" class="max-w-4xl mx-auto">
			<!-- Header -->
			<header class="mb-10 pb-8 border-b border-slate-200/80 dark:border-slate-800/80">
				<div class="flex flex-wrap items-center gap-2 mb-4">
					<span v-for="tag in (project.doc.tags || project.doc.tech || [])" :key="tag" class="badge-neutral text-xs">
						#{{ tag }}
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
							<span class="i-hugeicons-calendar-03 text-sm text-brand-500" />
							{{ project.doc.date || '2025' }}
						</span>
						<span>•</span>
						<span class="flex items-center gap-1.5 font-medium">
							<span class="i-hugeicons-clock-01 text-sm text-brand-500" />
							{{ project.doc.readingTime || 4 }} min read
						</span>
					</div>

					<!-- External Links -->
					<div class="flex items-center gap-2">
						<a
							v-if="project.doc.githubUrl || project.doc.repo"
							:href="project.doc.githubUrl || project.doc.repo"
							target="_blank"
							rel="noopener"
							class="btn-ghost !px-3.5 !py-1.5 text-xs border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5"
						>
							<span class="i-hugeicons-github text-xs" /> Source Code
						</a>
						<a
							v-if="project.doc.demoUrl || project.doc.link"
							:href="project.doc.demoUrl || project.doc.link"
							target="_blank"
							rel="noopener"
							class="btn-primary !px-4 !py-1.5 text-xs inline-flex items-center gap-1.5"
						>
							<span class="i-hugeicons-link-square-02 text-xs" /> Live Demo
						</a>
					</div>
				</div>
			</header>

			<!-- 1. BENTO SHOWCASE GALLERY (Bento Style Grid) -->
			<section v-if="allScreenshots.length > 0" class="mb-12">
				<div class="flex items-center justify-between mb-4">
					<span class="text-meta text-xs uppercase font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
						<span class="i-hugeicons-image-02 text-xs" /> {{ locale === 'id' ? 'Galeri Pratinjau & Tangkapan Layar' : 'Screenshots & Visual Preview' }}
					</span>
					<span class="text-meta text-xs">
						{{ allScreenshots.length }} {{ locale === 'id' ? 'Gambar' : 'Screenshots' }} • {{ locale === 'id' ? 'Klik untuk perbesar' : 'Click to expand' }}
					</span>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-3 sm:gap-4">
					<!-- Hero Bento Card (Span 8 if multiple, span 12 if single) -->
					<div
						class="bento-card-clean !p-0 overflow-hidden cursor-pointer group relative bg-slate-100 dark:bg-slate-800/80 rounded-bento"
						:class="allScreenshots.length === 1 ? 'col-span-12 aspect-video' : 'col-span-12 lg:col-span-8 aspect-video'"
						@click="openLightbox(0)"
					>
						<NuxtImg
							:src="allScreenshots[0]"
							:alt="project.doc.title"
							format="webp"
							quality="85"
							class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
							<span class="text-white text-xs font-semibold flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10">
								<span class="i-hugeicons-image-02 text-xs text-brand-400" /> {{ locale === 'id' ? 'Tampilan Utama' : 'Featured Preview' }}
							</span>
							<span class="text-white text-xs font-medium bg-brand-500/90 px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs">
								{{ locale === 'id' ? 'Buka Pratinjau' : 'Open Preview' }}
							</span>
						</div>
					</div>

					<!-- Secondary Bento Tiles -->
					<template v-if="allScreenshots.length > 1">
						<div
							v-for="(img, idx) in allScreenshots.slice(1)"
							:key="idx"
							class="bento-card-clean !p-0 overflow-hidden cursor-pointer group relative bg-slate-100 dark:bg-slate-800/80 rounded-bento"
							:class="allScreenshots.length === 2 ? 'col-span-12 lg:col-span-4 aspect-video' : (idx === 0 ? 'col-span-12 sm:col-span-6 lg:col-span-4 aspect-video' : 'col-span-6 sm:col-span-3 lg:col-span-4 aspect-video')"
							@click="openLightbox(idx + 1)"
						>
							<NuxtImg
								:src="img"
								:alt="`${project.doc.title} - Screenshot ${idx + 2}`"
								format="webp"
								quality="85"
								class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								loading="lazy"
							/>
							<div class="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
								<span class="p-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
									<span class="i-hugeicons-search-01 text-base" />
								</span>
							</div>
						</div>
					</template>
				</div>
			</section>

			<!-- 2. Prose Case Study Content -->
			<div class="prose prose-slate dark:prose-invert max-w-none font-sans text-slate-700 dark:text-slate-200 leading-relaxed">
				<ContentRenderer :value="project.doc" />
			</div>
		</article>

		<!-- 3. FULLSCREEN BENTO LIGHTBOX MODAL -->
		<Teleport to="body">
			<Transition
				enter-active-class="transition duration-200 ease-out"
				enter-from-class="opacity-0"
				enter-to-class="opacity-100"
				leave-active-class="transition duration-150 ease-in"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
			>
				<div
					v-if="activeLightboxIndex !== null"
					class="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md"
					@click.self="closeLightbox"
				>
					<div class="relative max-w-5xl w-full flex flex-col items-center">
						<!-- Close Button -->
						<button
							type="button"
							class="absolute -top-12 right-0 sm:right-0 p-2 rounded-full text-white/70 hover:text-white bg-slate-900/60 border border-white/10 backdrop-blur-md transition-colors"
							aria-label="Tutup"
							@click="closeLightbox"
						>
							<span class="i-hugeicons-cancel-01 text-lg" />
						</button>

						<!-- Image Container -->
						<div class="relative w-full rounded-bento overflow-hidden border border-white/10 shadow-2xl bg-slate-900/80 flex items-center justify-center max-h-[82vh]">
							<img
								:src="allScreenshots[activeLightboxIndex]"
								:alt="project?.doc?.title"
								class="max-h-[80vh] w-auto max-w-full object-contain rounded-bento"
							>

							<!-- Prev / Next Navigation -->
							<button
								v-if="allScreenshots.length > 1"
								type="button"
								class="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white border border-white/10 backdrop-blur-md transition-all active:scale-95"
								aria-label="Sebelumnya"
								@click="prevImage"
							>
								<span class="i-hugeicons-arrow-left-01 text-base" />
							</button>
							<button
								v-if="allScreenshots.length > 1"
								type="button"
								class="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white border border-white/10 backdrop-blur-md transition-all active:scale-95"
								aria-label="Selanjutnya"
								@click="nextImage"
							>
								<span class="i-hugeicons-arrow-right-01 text-base" />
							</button>
						</div>

						<!-- Lightbox Caption & Thumbnails Strip -->
						<div class="mt-4 flex items-center justify-between w-full text-xs text-white/70 px-2">
							<span class="font-medium text-white truncate mr-4">
								{{ project?.doc?.title }} ({{ activeLightboxIndex + 1 }} / {{ allScreenshots.length }})
							</span>
							<div class="flex items-center gap-1.5 overflow-x-auto py-1">
								<button
									v-for="(thumb, tIdx) in allScreenshots"
									:key="tIdx"
									type="button"
									class="w-10 h-7 rounded overflow-hidden border transition-all cursor-pointer shrink-0"
									:class="tIdx === activeLightboxIndex ? 'border-brand-400 ring-2 ring-brand-400/50 scale-105' : 'border-white/20 opacity-50 hover:opacity-100'"
									@click="openLightbox(tIdx)"
								>
									<img :src="thumb" class="w-full h-full object-cover">
								</button>
							</div>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>
