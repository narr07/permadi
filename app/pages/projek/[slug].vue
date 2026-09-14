<script setup lang="ts">
const route = useRoute()
const { locale, locales } = useI18n()
const setI18nParams = useSetI18nParams()
const { getCategoryLabel } = useCategoryLabel()
const { formatDate } = useFormatDate()

const requestedSlug = computed(() => route.params.slug as string)
const collection = computed(() => (locale.value === 'id' ? 'projek_id' : 'projek_en'))

function cleanSlug(pathStr: string): string {
	const parts = pathStr.split('/')
	const lastPart = parts[parts.length - 1] || ''
	return lastPart.replace(/^\d+\./, '')
}

// Fetch project by slug safely
const { data: project } = await useAsyncData(
	() => `projek-item-${locale.value}-${requestedSlug.value}`,
	async () => {
		const colName = collection.value as any
		const allDocs = await queryCollection(colName).all()

		// Match slug or cleaned path
		let matched = allDocs.find((d: any) => {
			const s = d.slug || cleanSlug(d.path || '')
			return s === requestedSlug.value
		})

		// Fallback: If slug in other language was visited, find matching document
		if (!matched) {
			const otherCol = (locale.value === 'id' ? 'projek_en' : 'projek_id') as any
			const otherDocs = await queryCollection(otherCol).all()
			const otherMatched = otherDocs.find((d: any) => {
				const s = d.slug || cleanSlug(d.path || '')
				return s === requestedSlug.value
			})
			if (otherMatched) {
				const matchId = otherMatched.idProjek || otherMatched.idItem
				if (matchId) {
					matched = allDocs.find((d: any) => (d.idProjek === matchId || d.idItem === matchId))
				}
			}
		}

		if (!matched)
			return null

		// Find translations for language switcher
		const translations: Record<string, { slug: string }> = {}
		const matchId = matched.idProjek || matched.idItem

		for (const loc of locales.value) {
			const locCode = typeof loc === 'string' ? loc : loc.code
			if (locCode === locale.value) {
				translations[locCode] = {
					slug: matched.slug || cleanSlug(matched.path || requestedSlug.value),
				}
				continue
			}

			const locCol = (locCode === 'id' ? 'projek_id' : 'projek_en') as any
			const otherLocDocs = await queryCollection(locCol).all()
			const trDoc = otherLocDocs.find((d: any) => (matchId && (d.idProjek === matchId || d.idItem === matchId)))
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

if (!project.value?.doc) {
	throw createError({
		statusCode: 404,
		statusMessage: locale.value === 'id' ? 'Projek tidak ditemukan' : 'Project not found',
	})
}

const site = useSiteConfig()
const canonicalUrl = computed(() => {
	const currentSlug = project.value?.doc?.slug || cleanSlug(project.value?.doc?.path || requestedSlug.value)
	const prefix = locale.value === 'id' ? '/id/projek' : '/projects'
	return `${site.url}${prefix}/${currentSlug}`
})

useSeoMeta({
	title: () => project.value?.doc?.title,
	description: () => project.value?.doc?.description,
	author: () => 'Dinar Permadi Yusup',
	colorScheme: 'light dark',
	themeColor: '#14b898',
	ogTitle: () => project.value?.doc?.title,
	ogDescription: () => project.value?.doc?.description,
	ogType: 'website',
	ogUrl: () => canonicalUrl.value,
})

defineOgImage('Bento', {
	title: project.value?.doc?.title,
	description: project.value?.doc?.description,
	category: locale.value === 'id' ? 'Studi Kasus Projek' : 'Project Case Study',
})

const allScreenshots = computed(() => {
	const doc = project.value?.doc
	if (!doc)
		return []
	const list: string[] = []
	if (doc.image) {
		list.push(doc.image)
	}
	if (doc.images && Array.isArray(doc.images)) {
		list.push(...doc.images)
	}
	return Array.from(new Set(list))
})
</script>

<template>
	<div
		v-if="project?.doc"
		class="w-full bg-white dark:bg-[#001e1c]"
	>
		<!-- Navigation Top Rail -->
		<nav
			aria-label="Breadcrumb navigasi"
			class="w-full flex items-center justify-between border-b border-slate-200/80 bg-slate-50/60 px-6 py-3.5 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/40 sm:px-8"
		>
			<NuxtLink
				:to="locale === 'id' ? '/id/projek' : '/projects'"
				class="group inline-flex items-center gap-2 text-slate-900 font-bold tracking-wider uppercase transition-all duration-150 active:scale-95 dark:text-slate-50 hover:text-brand-600 dark:hover:text-brand-400"
			>
				<span class="i-swisspost-arrowleft text-xs transition-transform duration-150 group-hover:-translate-x-1" />
				<span>{{ locale === 'id' ? 'KEMBALI KE ARSIP PROJEK' : 'BACK TO PROJECTS ARCHIVE' }}</span>
			</NuxtLink>

			<div class="flex items-center gap-3 text-slate-600 uppercase dark:text-slate-400">
				<span class="hidden sm:inline">SPESIFIKASI STUDI KASUS</span>
				<span class="text-brand-600 font-bold dark:text-brand-400">[{{ project.doc.category?.toUpperCase() || 'WEB' }}]</span>
			</div>
		</nav>

		<!-- Header Band: Parameter Rail + Display Title -->
		<header class="w-full border-b border-slate-200/80 dark:border-[#134e43]">
			<div class="grid grid-cols-1 lg:grid-cols-12">
				<!-- Parameter Spec Sheet (Cols 1 to 4) -->
				<div class="flex flex-col justify-between border-b border-slate-200/80 bg-slate-50/50 p-6 lg:col-span-4 lg:border-b-0 lg:border-r dark:border-[#134e43] dark:bg-[#002420]/40 lg:p-10 sm:p-8">
					<div>
						<div class="mb-4 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:text-accent">
							PARAMETER TEKNIS
						</div>

						<div class="text-xs font-mono divide-y divide-slate-200/80 dark:divide-[#134e43]">
							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-700 dark:text-slate-300">TANGGAL RILIS</span>
								<span class="text-slate-900 font-semibold tabular-nums dark:text-slate-50">{{ formatDate(project.doc.date) }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-700 dark:text-slate-300">WAKTU BACA</span>
								<span class="text-slate-900 tabular-nums dark:text-slate-50">{{ project.doc.readingTime || 4 }} Menit</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-700 dark:text-slate-300">KATEGORI</span>
								<span class="text-brand-600 font-bold uppercase dark:text-brand-400">{{ getCategoryLabel(project.doc.category) }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-700 dark:text-slate-300">PENGEMBANG</span>
								<span class="text-slate-900 dark:text-slate-50">Dinar Permadi Yusup</span>
							</div>
						</div>
					</div>

					<!-- Direct Action Buttons -->
					<div class="mt-8 flex flex-col gap-2.5 border-t border-slate-200/80 pt-6 dark:border-[#134e43]">
						<a
							v-if="project.doc.link"
							:href="project.doc.link"
							target="_blank"
							rel="noopener noreferrer"
							class="w-full flex items-center justify-between bg-brand-500 px-5 py-3 text-xs text-slate-950 font-bold tracking-wider font-mono uppercase transition-colors hover:bg-brand-400"
						>
							<span>KUNJUNGI WEB DEMO</span>
							<span class="i-swisspost-linkexternal text-sm" />
						</a>

						<a
							v-if="project.doc.repo"
							:href="project.doc.repo"
							target="_blank"
							rel="noopener noreferrer"
							class="w-full flex items-center justify-between border border-slate-300 px-5 py-3 text-xs text-slate-900 font-bold tracking-wider font-mono uppercase transition-colors dark:border-[#134e43] hover:border-brand-500 dark:text-slate-50 hover:text-brand-600 dark:hover:text-brand-400"
						>
							<span>REPOSITORI GITHUB</span>
							<span class="i-swisspost-github text-sm" />
						</a>
					</div>
				</div>

				<!-- Typographic Statement Field (Cols 5 to 12) -->
				<div class="flex flex-col justify-between p-6 lg:col-span-8 lg:p-12 sm:p-10">
					<div>
						<div class="mb-4 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:text-accent">
							STUDI KASUS SISTEM
						</div>

						<h1 class="mb-6 text-balance text-3xl text-slate-900 font-900 leading-[0.95] tracking-[-0.035em] font-heading lg:text-6xl sm:text-5xl dark:text-slate-50">
							{{ project.doc.title }}
						</h1>

						<p class="mb-8 max-w-[58ch] text-base text-slate-800 leading-relaxed font-sans sm:text-lg dark:text-slate-200">
							{{ project.doc.description }}
						</p>

						<!-- Tech Stack Tags -->
						<div class="flex flex-wrap gap-2">
							<span
								v-for="tech in (project.doc.tags || project.doc.tech || [])"
								:key="tech"
								class="border border-slate-300 px-2.5 py-1 text-xs text-slate-800 font-mono uppercase dark:border-[#134e43] dark:text-slate-200"
							>
								#{{ tech }}
							</span>
						</div>
					</div>

					<div class="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-6 text-xs text-slate-600 font-mono dark:border-[#134e43] dark:text-slate-400">
						<span>ARSIP PERMADI.DEV</span>
					</div>
				</div>
			</div>
		</header>

		<!-- Visual Media Band -->
		<section
			v-if="allScreenshots.length > 0"
			class="w-full border-b border-slate-200/80 dark:border-[#134e43]"
		>
			<div class="bg-slate-50/30 p-6 dark:bg-[#002420]/20 lg:p-10 sm:p-8">
				<div class="mx-auto max-w-4xl">
					<div class="aspect-video w-full overflow-hidden border border-slate-200/80 dark:border-[#134e43]">
						<NuxtImg
							:src="allScreenshots[0]"
							:alt="project.doc.title"
							format="webp"
							quality="85"
							class="h-full w-full object-cover"
							loading="eager"
						/>
					</div>

					<div class="mt-3 flex items-center justify-between text-[10px] text-slate-600 tracking-widest font-mono uppercase dark:text-slate-400">
						<span>FIG. 01 // TAMPILAN UTAMA ANTARMUKA SISTEM</span>
						<span>RESOLUSI TINGGI (16:9)</span>
					</div>
				</div>

				<!-- Additional Gallery Strip if Available -->
				<div
					v-if="allScreenshots.length > 1"
					class="grid grid-cols-1 mx-auto mt-6 max-w-4xl gap-4 sm:grid-cols-2"
				>
					<div
						v-for="(img, idx) in allScreenshots.slice(1)"
						:key="idx"
						class="border border-slate-200/80 dark:border-[#134e43]"
					>
						<NuxtImg
							:src="img"
							:alt="`${project.doc.title} pratinjau ${idx + 2}`"
							format="webp"
							quality="80"
							class="aspect-video w-full object-cover"
							loading="lazy"
						/>
						<div class="border-t border-slate-200/80 bg-white p-2 text-[9px] text-slate-600 font-mono uppercase dark:border-[#134e43] dark:bg-[#001e1c] dark:text-slate-400">
							FIG. 0{{ idx + 2 }} // TAMPILAN DETAIL
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Content Prose Band -->
		<main class="w-full border-b border-slate-200/80 p-6 dark:border-[#134e43] lg:p-14 sm:p-10">
			<div class="mx-auto max-w-3xl">
				<div class="mb-8 border-b border-slate-200/80 pb-3 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:border-[#134e43] dark:text-accent">
					DOKUMENTASI TEKNIS &amp; CATATAN REKAYASA
				</div>

				<div class="max-w-none text-slate-800 leading-relaxed font-sans prose prose-slate dark:text-slate-100 dark:prose-invert">
					<ContentRenderer :value="project.doc" />
				</div>
			</div>
		</main>

		<!-- Bottom Archival Colophon Strip -->
		<footer class="w-full flex flex-col items-start justify-between gap-4 bg-slate-50/80 px-6 py-6 text-xs font-mono sm:flex-row sm:items-center dark:bg-[#002420]/60 sm:px-8">
			<NuxtLink
				:to="locale === 'id' ? '/id/projek' : '/projects'"
				class="group inline-flex items-center gap-2 text-slate-900 font-bold tracking-wider uppercase transition-all duration-150 active:scale-95 dark:text-slate-50 hover:text-brand-600 dark:hover:text-brand-400"
			>
				<span class="i-swisspost-arrowleft text-xs transition-transform duration-150 group-hover:-translate-x-1" />
				<span>KEMBALI KE SELURUH PROJEK</span>
			</NuxtLink>

			<div class="text-slate-600 dark:text-slate-400">
				DINAR PERMADI YUSUP
			</div>
		</footer>
	</div>
</template>
