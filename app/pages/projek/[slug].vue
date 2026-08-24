<script setup lang="ts">
import Conclusion from '~/components/content/Conclusion.vue'
import Faq from '~/components/content/Faq.vue'
import FaqItem from '~/components/content/FaqItem.vue'
import ProseAccordion from '~/components/content/ProseAccordion.vue'
import ProseAccordionItem from '~/components/content/ProseAccordionItem.vue'
import ProseBadge from '~/components/content/ProseBadge.vue'
import ProseCallout from '~/components/content/ProseCallout.vue'
import ProseCard from '~/components/content/ProseCard.vue'
import ProseCardGroup from '~/components/content/ProseCardGroup.vue'
import ProseCaution from '~/components/content/ProseCaution.vue'
import ProseCodeGroup from '~/components/content/ProseCodeGroup.vue'
import ProseCodeInline from '~/components/content/ProseCodeInline.vue'
import ProseCollapsible from '~/components/content/ProseCollapsible.vue'
import ProseFaq from '~/components/content/ProseFaq.vue'
import ProseImg from '~/components/content/ProseImg.vue'
import ProseNote from '~/components/content/ProseNote.vue'
import ProsePre from '~/components/content/ProsePre.vue'
import ProsePrompt from '~/components/content/ProsePrompt.vue'
import ProseSteps from '~/components/content/ProseSteps.vue'
import ProseTable from '~/components/content/ProseTable.vue'
import ProseTabs from '~/components/content/ProseTabs.vue'
import ProseTabsItem from '~/components/content/ProseTabsItem.vue'
import ProseTip from '~/components/content/ProseTip.vue'
import ProseWarning from '~/components/content/ProseWarning.vue'

const route = useRoute()
const { locale, locales } = useI18n()
const setI18nParams = useSetI18nParams()
const { getCategoryLabel } = useCategoryLabel()
const { formatDate } = useFormatDate()

const mdcComponents = {
	'img': ProseImg,
	'pre': ProsePre,
	'code-inline': ProseCodeInline,
	'prose-code-inline': ProseCodeInline,
	'accordion': ProseAccordion,
	'accordion-item': ProseAccordionItem,
	'code-group': ProseCodeGroup,
	'tabs': ProseTabs,
	'tabs-item': ProseTabsItem,
	'callout': ProseCallout,
	'steps': ProseSteps,
	'collapsible': ProseCollapsible,
	'card': ProseCard,
	'card-group': ProseCardGroup,
	'faq': Faq,
	'faq-item': FaqItem,
	'conclusion': Conclusion,
	'prompt': ProsePrompt,
	'note': ProseNote,
	'tip': ProseTip,
	'warning': ProseWarning,
	'caution': ProseCaution,
	'badge': ProseBadge,
	'table': ProseTable,
	Conclusion,
	Faq,
	FaqItem,
	ProseFaq,
	ProsePrompt,
	ProseNote,
	ProseTip,
	ProseWarning,
	ProseCaution,
	ProseBadge,
	ProseAccordion,
	ProseAccordionItem,
	ProseCodeGroup,
	ProseTabs,
	ProseTabsItem,
	ProseCallout,
	ProseSteps,
	ProseCollapsible,
	ProseCard,
	ProseCardGroup,
}

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

		if (!matched)
			return null

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
	{ watch: [locale, requestedSlug] },
)

watch(
	() => project.value?.translations,
	(newTranslations) => {
		if (newTranslations) {
			setI18nParams(newTranslations)
		}
	},
	{ immediate: true },
)

provide('pageTitle', computed(() => project.value?.doc?.title || ''))

if (!project.value?.doc) {
	throw createError({
		statusCode: 404,
		statusMessage: locale.value === 'id' ? 'Projek tidak ditemukan' : 'Project not found',
	})
}

useSeoMeta({
	title: computed(() => project.value?.doc?.title),
	description: computed(() => project.value?.doc?.description),
	ogTitle: computed(() => project.value?.doc?.title),
	ogDescription: computed(() => project.value?.doc?.description),
})

defineOgImage('Bento', {
	title: project.value?.doc?.title,
	description: project.value?.doc?.description,
	category: locale.value === 'id' ? 'Studi Kasus Projek' : 'Project Case Study',
})

// Koleksi tangkapan layar untuk Bento Gallery
const allScreenshots = computed(() => {
	const doc = project.value?.doc
	if (!doc)
		return []
	const list: string[] = []
	if (doc.images && Array.isArray(doc.images)) {
		list.push(...doc.images)
	}
	else if (doc.image) {
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
		activeLightboxIndex.value
			= (activeLightboxIndex.value - 1 + allScreenshots.value.length) % allScreenshots.value.length
	}
}

onMounted(() => {
	function handleKeydown(e: KeyboardEvent) {
		if (activeLightboxIndex.value === null)
			return
		if (e.key === 'Escape')
			closeLightbox()
		else if (e.key === 'ArrowRight')
			nextImage()
		else if (e.key === 'ArrowLeft')
			prevImage()
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
			class="mb-6 inline-flex items-center gap-1.5 text-xs text-slate-700 font-semibold transition-colors dark:text-slate-200 hover:text-brand-900 focus-ring dark:hover:text-brand-300"
		>
			<span class="i-hugeicons-arrow-left-01 text-sm" /> {{ locale === 'id' ? 'Kembali ke Semua Projek' : 'Back to All Projects' }}
		</NuxtLink>

		<!-- Project Article Container -->
		<article
			v-if="project?.doc"
			class="mx-auto max-w-4xl"
		>
			<!-- Bento Card Header with Spotlight -->
			<header
				v-spotlight
				class="bento-card-clean relative mb-10 overflow-hidden border border-slate-200/80 rounded-bento bg-white/90 p-6 shadow-sm dark:border-[#134e43] dark:bg-[#002b27]/90 md:p-9 sm:p-8"
			>
				<!-- Category & Tags Badge Row -->
				<div class="mb-3.5 flex flex-wrap items-center gap-2">
					<span
						v-if="project.doc.category"
						class="inline-flex items-center gap-1.5 border border-brand-200/60 rounded-full bg-brand-100/80 px-3 py-1 text-xs text-brand-800 font-semibold tracking-wider uppercase dark:border-brand-800/60 dark:bg-brand-950 dark:text-brand-300"
					>
						<span class="status-dot animate-pulse" />
						{{ getCategoryLabel(project.doc.category) }}
					</span>
					<span
						v-for="tag in (project.doc.tags || project.doc.tech || [])"
						:key="tag"
						class="border border-slate-200/60 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700 font-medium dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-300"
					>
						#{{ tag }}
					</span>
				</div>

				<!-- Title (Barlow, Bold, Responsive) -->
				<h1 class="text-2xl text-slate-900 font-extrabold leading-[1.18] tracking-tight font-heading lg:text-[2.5rem] md:text-4xl sm:text-3xl dark:text-white">
					{{ project.doc.title }}
				</h1>

				<!-- Description Lead Text (Refined compact size) -->
				<p class="mt-3.5 max-w-3xl text-body text-sm text-slate-600 leading-relaxed sm:text-[15px] dark:text-slate-300">
					{{ project.doc.description }}
				</p>

				<!-- Bento Metadata & Action Footer -->
				<div class="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/70 pt-5 text-xs dark:border-slate-800/70">
					<div class="flex flex-wrap items-center gap-2 sm:gap-3">
						<div class="inline-flex items-center gap-1.5 border border-slate-200/60 rounded-xl bg-slate-100/80 px-3 py-1.5 text-slate-700 font-medium dark:border-[#134e43] dark:bg-[#042f27] dark:text-slate-200">
							<span class="i-hugeicons-calendar-03 text-sm text-brand-700 dark:text-brand-400" />
							<span>{{ formatDate(project.doc.date) || '2025' }}</span>
						</div>
						<div class="inline-flex items-center gap-1.5 border border-slate-200/60 rounded-xl bg-slate-100/80 px-3 py-1.5 text-slate-700 font-medium dark:border-[#134e43] dark:bg-[#042f27] dark:text-slate-200">
							<span class="i-hugeicons-clock-01 text-sm text-brand-700 dark:text-brand-400" />
							<span>{{ locale === 'id' ? `${project.doc.readingTime || 4} menit baca` : `${project.doc.readingTime || 4} min read` }}</span>
						</div>
					</div>

					<!-- External Links -->
					<div class="flex items-center gap-2">
						<a
							v-if="project.doc.repo"
							:href="project.doc.repo"
							target="_blank"
							rel="noopener"
							class="btn-ghost inline-flex items-center gap-1.5 border border-slate-200 text-xs font-semibold dark:border-slate-700 !px-3.5 !py-1.5"
						>
							<span class="i-hugeicons-github text-xs" /> {{ locale === 'id' ? 'Kode Sumber' : 'Source Code' }}
						</a>
						<a
							v-if="project.doc.link"
							:href="project.doc.link"
							target="_blank"
							rel="noopener"
							class="btn-primary inline-flex items-center gap-1.5 text-xs !px-4 !py-1.5"
						>
							<span class="i-hugeicons-link-square-02 text-xs" /> {{ locale === 'id' ? 'Kunjungi Web' : 'Live Demo' }}
						</a>
					</div>
				</div>
			</header>

			<!-- 1. BENTO SHOWCASE GALLERY (Bento Style Grid) -->
			<section
				v-if="allScreenshots.length > 0"
				class="mb-12"
			>
				<div class="mb-4 flex items-center justify-between">
					<span class="flex items-center gap-1.5 text-meta text-xs text-brand-800 font-semibold uppercase dark:text-brand-400">
						<span class="i-hugeicons-image-02 text-xs" /> {{ locale === 'id' ? 'Galeri Pratinjau & Tangkapan Layar' : 'Screenshots & Visual Preview' }}
					</span>
					<span class="text-meta text-xs">
						{{ allScreenshots.length }} {{ locale === 'id' ? 'Gambar' : 'Screenshots' }} • {{ locale === 'id' ? 'Klik untuk perbesar' : 'Click to expand' }}
					</span>
				</div>

				<div class="grid grid-cols-1 gap-3 lg:grid-cols-12 sm:grid-cols-6 sm:gap-4">
					<!-- Hero Bento Card (Span 8 if multiple, span 12 if single) -->
					<div
						role="button"
						tabindex="0"
						:aria-label="locale === 'id' ? 'Buka galeri pratinjau gambar utama' : 'Open main preview screenshot'"
						class="bento-card-clean group relative cursor-pointer overflow-hidden rounded-bento bg-slate-100 dark:bg-slate-800/80 !p-0 focus-ring"
						:class="allScreenshots.length === 1 ? 'col-span-12 aspect-video' : 'col-span-12 lg:col-span-8 aspect-video'"
						@click="openLightbox(0)"
						@keydown.enter.prevent="openLightbox(0)"
						@keydown.space.prevent="openLightbox(0)"
					>
						<NuxtImg
							:src="allScreenshots[0]"
							:alt="project.doc.title"
							format="webp"
							quality="85"
							loading="eager"
							fetchpriority="high"
							preload
							decoding="async"
							class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
						<div class="absolute inset-0 flex items-end justify-between from-slate-950/80 via-transparent to-transparent bg-gradient-to-t p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
							<span class="flex items-center gap-1.5 border border-white/10 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs text-white font-semibold backdrop-blur-md">
								<span class="i-hugeicons-image-02 text-xs text-brand-400" /> {{ locale === 'id' ? 'Tampilan Utama' : 'Featured Preview' }}
							</span>
							<span class="shadow-xs rounded-full bg-brand-500/90 px-2.5 py-1 text-xs text-white font-medium backdrop-blur-md">
								{{ locale === 'id' ? 'Buka Pratinjau' : 'Open Preview' }}
							</span>
						</div>
					</div>

					<!-- Secondary Bento Tiles -->
					<template v-if="allScreenshots.length > 1">
						<div
							v-for="(img, idx) in allScreenshots.slice(1)"
							:key="idx"
							role="button"
							tabindex="0"
							:aria-label="`${project.doc.title} - ${locale === 'id' ? 'Buka gambar pratinjau' : 'Open screenshot preview'} ${idx + 2}`"
							class="bento-card-clean group relative cursor-pointer overflow-hidden rounded-bento bg-slate-100 dark:bg-slate-800/80 !p-0 focus-ring"
							:class="allScreenshots.length === 2 ? 'col-span-12 lg:col-span-4 aspect-video' : (idx === 0 ? 'col-span-12 sm:col-span-6 lg:col-span-4 aspect-video' : 'col-span-6 sm:col-span-3 lg:col-span-4 aspect-video')"
							@click="openLightbox(idx + 1)"
							@keydown.enter.prevent="openLightbox(idx + 1)"
							@keydown.space.prevent="openLightbox(idx + 1)"
						>
							<NuxtImg
								:src="img"
								:alt="`${project.doc.title} ${idx + 2}`"
								format="webp"
								quality="80"
								loading="lazy"
								decoding="async"
								class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div class="absolute inset-0 flex items-center justify-center bg-slate-950/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
								<span class="border border-white/20 rounded-full bg-white/20 p-2 text-white backdrop-blur-md">
									<span class="i-hugeicons-search-01 text-base" />
								</span>
							</div>
						</div>
					</template>
				</div>
			</section>

			<!-- 2. Prose Case Study Content -->
			<div class="max-w-none text-slate-700 leading-relaxed font-sans prose prose-slate dark:text-slate-200 dark:prose-invert">
				<ContentRenderer
					:value="project.doc"
					:components="mdcComponents"
				/>
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
					class="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/90 p-3 backdrop-blur-md sm:p-6"
					@click.self="closeLightbox"
				>
					<div class="relative max-w-5xl w-full flex flex-col items-center">
						<!-- Close Button -->
						<button
							type="button"
							class="absolute right-0 border border-white/10 rounded-full bg-slate-900/60 p-2 text-white/70 backdrop-blur-md transition-colors -top-12 sm:right-0 hover:text-white"
							aria-label="Tutup"
							@click="closeLightbox"
						>
							<span class="i-hugeicons-cancel-01 text-lg" />
						</button>

						<!-- Image Container -->
						<div class="relative max-h-[82vh] w-full flex items-center justify-center overflow-hidden border border-white/10 rounded-bento bg-slate-900/80 shadow-2xl">
							<img
								:src="allScreenshots[activeLightboxIndex]"
								:alt="project?.doc?.title"
								class="max-h-[80vh] max-w-full w-auto rounded-bento object-contain"
							>

							<!-- Prev / Next Navigation -->
							<button
								v-if="allScreenshots.length > 1"
								type="button"
								class="absolute left-3 top-1/2 border border-white/10 rounded-full bg-slate-900/70 p-2.5 text-white backdrop-blur-md transition-all -translate-y-1/2 active:scale-95 hover:bg-slate-900"
								aria-label="Sebelumnya"
								@click="prevImage"
							>
								<span class="i-hugeicons-arrow-left-01 text-base" />
							</button>
							<button
								v-if="allScreenshots.length > 1"
								type="button"
								class="absolute right-3 top-1/2 border border-white/10 rounded-full bg-slate-900/70 p-2.5 text-white backdrop-blur-md transition-all -translate-y-1/2 active:scale-95 hover:bg-slate-900"
								aria-label="Selanjutnya"
								@click="nextImage"
							>
								<span class="i-hugeicons-arrow-right-01 text-base" />
							</button>
						</div>

						<!-- Lightbox Caption & Thumbnails Strip -->
						<div class="mt-4 w-full flex items-center justify-between px-2 text-xs text-white/70">
							<span class="mr-4 truncate text-white font-medium">
								{{ project?.doc?.title }} ({{ activeLightboxIndex + 1 }} / {{ allScreenshots.length }})
							</span>
							<div class="flex items-center gap-1.5 overflow-x-auto py-1">
								<button
									v-for="(thumb, tIdx) in allScreenshots"
									:key="tIdx"
									type="button"
									class="h-7 w-10 shrink-0 cursor-pointer overflow-hidden border rounded transition-all"
									:class="tIdx === activeLightboxIndex ? 'border-brand-400 ring-2 ring-brand-400/50 scale-105' : 'border-white/20 opacity-50 hover:opacity-100'"
									@click="openLightbox(tIdx)"
								>
									<img
										:src="thumb"
										class="h-full w-full object-cover"
									>
								</button>
							</div>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>
