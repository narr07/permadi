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
			class="w-full border-b border-slate-200/80 dark:border-[#134e43] bg-slate-50/60 dark:bg-[#002420]/40 px-6 sm:px-8 py-3.5 flex items-center justify-between font-mono text-xs"
		>
			<NuxtLink
				:to="locale === 'id' ? '/id/projek' : '/projects'"
				class="inline-flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider hover:text-brand-600 dark:text-slate-50 dark:hover:text-brand-400"
			>
				<span class="i-lucide-arrow-left text-xs" />
				<span>{{ locale === 'id' ? 'KEMBALI KE ARSIP PROJEK' : 'BACK TO PROJECTS ARCHIVE' }}</span>
			</NuxtLink>

			<div class="flex items-center gap-3 text-slate-900/40 dark:text-slate-50/40 uppercase">
				<span class="hidden sm:inline">SPESIFIKASI STUDI KASUS</span>
				<span class="font-bold text-brand-600 dark:text-brand-400">[{{ project.doc.category?.toUpperCase() || 'WEB' }}]</span>
			</div>
		</nav>

		<!-- Header Band: Parameter Rail + Display Title -->
		<header class="w-full border-b border-slate-200/80 dark:border-[#134e43]">
			<div class="grid grid-cols-1 lg:grid-cols-12">
				<!-- Parameter Spec Sheet (Cols 1 to 4) -->
				<div class="lg:col-span-4 p-6 sm:p-8 lg:p-10 lg:border-r border-b lg:border-b-0 border-slate-200/80 dark:border-[#134e43] bg-slate-50/50 dark:bg-[#002420]/40 flex flex-col justify-between">
					<div>
						<div class="mb-4 font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-brand-700 dark:text-accent">
							PARAMETER TEKNIS
						</div>

						<div class="divide-y divide-slate-200/80 dark:divide-[#134e43] font-mono text-xs">
							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-900/60 dark:text-slate-50/60">TANGGAL RILIS</span>
								<span class="text-slate-900 dark:text-slate-50 tabular-nums font-semibold">{{ formatDate(project.doc.date) }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-900/60 dark:text-slate-50/60">WAKTU BACA</span>
								<span class="text-slate-900 dark:text-slate-50 tabular-nums">{{ project.doc.readingTime || 4 }} Menit</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-900/60 dark:text-slate-50/60">KATEGORI</span>
								<span class="text-brand-600 dark:text-brand-400 font-bold uppercase">{{ getCategoryLabel(project.doc.category) }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-900/60 dark:text-slate-50/60">PENGEMBANG</span>
								<span class="text-slate-900 dark:text-slate-50">Dinar Permadi Yusup</span>
							</div>
						</div>
					</div>

					<!-- Direct Action Buttons -->
					<div class="mt-8 pt-6 border-t border-slate-200/80 dark:border-[#134e43] flex flex-col gap-2.5">
						<a
							v-if="project.doc.link"
							:href="project.doc.link"
							target="_blank"
							rel="noopener noreferrer"
							class="w-full px-5 py-3 bg-brand-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider hover:bg-brand-400 transition-colors flex items-center justify-between"
						>
							<span>KUNJUNGI WEB DEMO</span>
							<span class="i-lucide-external-link text-sm" />
						</a>

						<a
							v-if="project.doc.repo"
							:href="project.doc.repo"
							target="_blank"
							rel="noopener noreferrer"
							class="w-full px-5 py-3 border border-slate-300 dark:border-[#134e43] text-slate-900 dark:text-slate-50 font-mono font-bold text-xs uppercase tracking-wider hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center justify-between"
						>
							<span>REPOSITORI GITHUB</span>
							<span class="i-lucide-github text-sm" />
						</a>
					</div>
				</div>

				<!-- Typographic Statement Field (Cols 5 to 12) -->
				<div class="lg:col-span-8 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
					<div>
						<div class="mb-4 font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-brand-700 dark:text-accent">
							STUDI KASUS SISTEM
						</div>

						<h1 class="font-heading font-800 text-3xl sm:text-5xl lg:text-6xl tracking-[-0.035em] text-slate-900 dark:text-slate-50 leading-[0.95] text-balance mb-6">
							{{ project.doc.title }}
						</h1>

						<p class="font-sans text-base sm:text-lg text-slate-900/80 dark:text-slate-50/80 leading-relaxed max-w-[58ch] mb-8">
							{{ project.doc.description }}
						</p>

						<!-- Tech Stack Tags -->
						<div class="flex flex-wrap gap-2">
							<span
								v-for="tech in (project.doc.tags || project.doc.tech || [])"
								:key="tech"
								class="px-2.5 py-1 font-mono text-xs uppercase border border-slate-300 dark:border-[#134e43] text-slate-900/80 dark:text-slate-50/80"
							>
								#{{ tech }}
							</span>
						</div>
					</div>

					<div class="mt-8 pt-6 border-t border-slate-200/80 dark:border-[#134e43] font-mono text-xs text-slate-900/50 dark:text-slate-50/50 flex items-center justify-between">
						<span>ARSIP PERMADI.DEV</span>
						<span>KISI MODULAR 12-KOLOM</span>
					</div>
				</div>
			</div>
		</header>

		<!-- Visual Media Band -->
		<section
			v-if="allScreenshots.length > 0"
			class="w-full border-b border-slate-200/80 dark:border-[#134e43]"
		>
			<div class="p-6 sm:p-8 lg:p-10 bg-slate-50/30 dark:bg-[#002420]/20">
				<div class="max-w-4xl mx-auto">
					<div class="w-full aspect-video border border-slate-200/80 dark:border-[#134e43] overflow-hidden">
						<NuxtImg
							:src="allScreenshots[0]"
							:alt="project.doc.title"
							format="webp"
							quality="85"
							class="w-full h-full object-cover"
							loading="eager"
						/>
					</div>

					<div class="mt-3 flex items-center justify-between font-mono text-[10px] text-slate-900/50 dark:text-slate-50/50 uppercase tracking-widest">
						<span>FIG. 01 // TAMPILAN UTAMA ANTARMUKA SISTEM</span>
						<span>RESOLUSI TINGGI (16:9)</span>
					</div>
				</div>

				<!-- Additional Gallery Strip if Available -->
				<div
					v-if="allScreenshots.length > 1"
					class="max-w-4xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
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
							class="w-full aspect-video object-cover"
							loading="lazy"
						/>
						<div class="p-2 bg-white dark:bg-[#001e1c] border-t border-slate-200/80 dark:border-[#134e43] font-mono text-[9px] text-slate-900/50 dark:text-slate-50/50 uppercase">
							FIG. 0{{ idx + 2 }} // TAMPILAN DETAIL
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Content Prose Band -->
		<main class="w-full border-b border-slate-200/80 dark:border-[#134e43] p-6 sm:p-10 lg:p-14">
			<div class="max-w-3xl mx-auto">
				<div class="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-brand-700 dark:text-accent mb-8 pb-3 border-b border-slate-200/80 dark:border-[#134e43]">
					DOKUMENTASI TEKNIS &amp; CATATAN REKAYASA
				</div>

				<div class="prose prose-slate dark:prose-invert max-w-none font-sans text-slate-900/85 dark:text-slate-50/85 leading-relaxed">
					<ContentRenderer :value="project.doc" />
				</div>
			</div>
		</main>

		<!-- Bottom Archival Colophon Strip -->
		<footer class="w-full bg-slate-50/80 dark:bg-[#002420]/60 px-6 py-6 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
			<NuxtLink
				:to="locale === 'id' ? '/id/projek' : '/projects'"
				class="inline-flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider hover:text-brand-600 dark:text-slate-50 dark:hover:text-brand-400"
			>
				<span class="i-lucide-arrow-left text-xs" />
				<span>KEMBALI KE SELURUH PROJEK</span>
			</NuxtLink>

			<div class="text-slate-900/50 dark:text-slate-50/50">
				DINAR PERMADI YUSUP · SISTEM KISI MODULAR 12-KOLOM
			</div>
		</footer>
	</div>
</template>
