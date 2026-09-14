<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { onClickOutside, useEventListener } from '@vueuse/core'
import AppReactionsBar from '~/components/reactions/AppReactionsBar.vue'

const route = useRoute()
const { locale, locales } = useI18n()
const localePath = useLocalePath()
const setI18nParams = useSetI18nParams()
const { getCategoryLabel } = useCategoryLabel()
const { formatDate } = useFormatDate()

const activeSection = ref('general')
const isTocDropdownOpen = ref(false)
const tocDropdownRef = ref<HTMLElement | null>(null)

onClickOutside(tocDropdownRef, () => {
	if (isTocDropdownOpen.value) {
		isTocDropdownOpen.value = false
	}
})

useEventListener('keydown', (e: KeyboardEvent) => {
	if (e.key === 'Escape' && isTocDropdownOpen.value) {
		isTocDropdownOpen.value = false
	}
})

function toggleTocDropdown() {
	isTocDropdownOpen.value = !isTocDropdownOpen.value
}

function selectHeading(id: string) {
	scrollToHeading(id)
	isTocDropdownOpen.value = false
}

function scrollToHeading(id: string) {
	if (!import.meta.client)
		return
	const el = document.getElementById(id)
	if (el) {
		const offset = 80
		const bodyRect = document.body.getBoundingClientRect().top
		const elRect = el.getBoundingClientRect().top
		window.scrollTo({
			top: elRect - bodyRect - offset,
			behavior: 'smooth',
		})
		activeSection.value = id
		history.replaceState(null, '', `#${encodeURIComponent(id)}`)
	}
}

function scrollToTop() {
	if (!import.meta.client)
		return
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	})
}

onMounted(() => {
	if (!import.meta.client)
		return

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				activeSection.value = entry.target.id || entry.target.textContent || 'general'
			}
		})
	}, {
		rootMargin: '-60px 0px -60% 0px',
		threshold: 0.1,
	})

	const headings = document.querySelectorAll('article h2, article h3')
	headings.forEach(h => observer.observe(h))

	onUnmounted(() => {
		observer.disconnect()
	})
})

const requestedSlug = computed(() => route.params.slug as string)
const collection = computed(() => (locale.value === 'id' ? 'blog_id' : 'blog_en'))

function cleanSlug(pathStr: string): string {
	const parts = pathStr.split('/')
	const lastPart = parts[parts.length - 1] || ''
	return lastPart.replace(/^\d+\./, '')
}

// Fetch single blog post safely in-memory
const { data: post } = await useAsyncData(
	() => `blog-post-${locale.value}-${requestedSlug.value}`,
	async () => {
		const colName = collection.value as any
		const allDocs = await queryCollection(colName).all()

		// 1. Match slug or cleanSlug(path)
		let matched = allDocs.find((d: any) => {
			const s = d.slug || cleanSlug(d.path || '')
			return s === requestedSlug.value
		})

		// 2. Fallback: Check other locale collection
		if (!matched) {
			const otherCol = (locale.value === 'id' ? 'blog_en' : 'blog_id') as any
			const otherDocs = await queryCollection(otherCol).all()
			const otherMatched = otherDocs.find((d: any) => {
				const s = d.slug || cleanSlug(d.path || '')
				return s === requestedSlug.value
			})
			if (otherMatched) {
				const matchId = otherMatched.idBlog || otherMatched.idItem
				if (matchId) {
					matched = allDocs.find((d: any) => (d.idBlog === matchId || d.idItem === matchId))
				}
			}
		}

		if (!matched)
			return null

		// 3. Compute surround in-memory without second DB query
		const sorted = [...allDocs].sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
		const idx = sorted.findIndex((d: any) => d.path === matched.path)
		const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null
		const next = idx > 0 ? sorted[idx - 1] : null

		// 4. Translations mapping for switcher
		const translations: Record<string, { slug: string }> = {}
		const matchId = matched.idBlog || matched.idItem

		for (const loc of locales.value) {
			const locCode = typeof loc === 'string' ? loc : loc.code
			if (locCode === locale.value) {
				translations[locCode] = {
					slug: matched.slug || cleanSlug(matched.path || requestedSlug.value),
				}
				continue
			}

			const locCol = (locCode === 'id' ? 'blog_id' : 'blog_en') as any
			const otherLocDocs = await queryCollection(locCol).all()
			const trDoc = otherLocDocs.find((d: any) => (matchId && (d.idBlog === matchId || d.idItem === matchId)))
			if (trDoc) {
				translations[locCode] = {
					slug: trDoc.slug || cleanSlug(trDoc.path),
				}
			}
		}

		return {
			doc: matched,
			translations,
			surround: [prev, next],
		}
	},
	{ watch: [locale, requestedSlug] },
)

const contentIdentifier = computed(() => {
	if (!post.value?.doc)
		return ''
	const doc = post.value.doc as any
	if (doc.idBlog)
		return `blog-${doc.idBlog}`
	return doc.slug || cleanSlug(doc.path)
})

watch(
	() => post.value?.translations,
	(newTranslations) => {
		if (newTranslations) {
			setI18nParams(newTranslations)
		}
	},
	{ immediate: true },
)

provide('pageTitle', computed(() => post.value?.doc?.title || ''))

if (!post.value?.doc) {
	throw createError({
		statusCode: 404,
		statusMessage: locale.value === 'id' ? 'Artikel tidak ditemukan' : 'Post not found',
	})
}

const surround = computed(() => post.value?.surround || [null, null])

const tocLinks = computed(() => {
	const rawLinks = post.value?.doc?.body?.toc?.links || post.value?.doc?.toc?.links || []
	const links = [...rawLinks]

	const bodyStr = JSON.stringify(post.value?.doc?.body || '').toLowerCase()
	const hasConclusion = bodyStr.includes('conclusion')
	const hasFaq = bodyStr.includes('faq')

	const alreadyHasConclusion = links.some((l: any) => {
		const id = (l.id || '').toLowerCase()
		const text = (l.text || '').toLowerCase()
		return id.includes('kesimpulan') || id.includes('conclusion') || text.includes('kesimpulan') || text.includes('conclusion')
	})

	const alreadyHasFaq = links.some((l: any) => {
		const id = (l.id || '').toLowerCase()
		const text = (l.text || '').toLowerCase()
		return id.includes('faq') || text.includes('faq')
	})

	if (hasConclusion && !alreadyHasConclusion) {
		links.push({
			id: locale.value === 'id' ? 'kesimpulan' : 'conclusion',
			text: locale.value === 'id' ? 'Kesimpulan' : 'Conclusion',
			depth: 2,
		})
	}

	if (hasFaq && !alreadyHasFaq) {
		links.push({
			id: 'faq',
			text: 'FAQ',
			depth: 2,
		})
	}

	return links
})

const currentActiveHeadingText = computed(() => {
	if (!tocLinks.value.length)
		return ''
	const found = tocLinks.value.find((l: any) => l.id === activeSection.value)
	if (found)
		return found.text
	return tocLinks.value[0]?.text || ''
})

const activeHeadingIndex = computed(() => {
	if (!tocLinks.value.length)
		return 0
	const idx = tocLinks.value.findIndex((l: any) => l.id === activeSection.value)
	return idx >= 0 ? idx : 0
})

const site = useSiteConfig()
const canonicalUrl = computed(() => {
	const currentSlug = post.value?.doc?.slug || cleanSlug(post.value?.doc?.path || requestedSlug.value)
	const prefix = locale.value === 'id' ? '/id/blog' : '/blog'
	return `${site.url}${prefix}/${currentSlug}`
})

useSeoMeta({
	title: () => post.value?.doc?.title,
	description: () => post.value?.doc?.description,
	author: () => 'Dinar Permadi Yusup',
	colorScheme: 'light dark',
	themeColor: '#14b898',
	ogTitle: () => post.value?.doc?.title,
	ogDescription: () => post.value?.doc?.description,
	ogType: 'article',
	ogUrl: () => canonicalUrl.value,
})

defineOgImage('Bento', {
	title: post.value?.doc?.title,
	description: post.value?.doc?.description,
	category: locale.value === 'id' ? 'Artikel & Catatan' : 'Blog & Article',
})
</script>

<template>
	<div
		v-if="post?.doc"
		class="w-full bg-white dark:bg-[#001e1c]"
	>
		<!-- Navigation Top Rail -->
		<nav
			aria-label="Breadcrumb navigasi"
			class="w-full border-b border-slate-200/80 dark:border-[#134e43] bg-slate-50/60 dark:bg-[#002420]/40 px-6 sm:px-8 py-3.5 flex items-center justify-between font-mono text-xs"
		>
			<NuxtLink
				:to="locale === 'id' ? '/id/blog' : '/blog'"
				class="inline-flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider hover:text-brand-600 dark:text-slate-50 dark:hover:text-brand-400"
			>
				<span class="i-ph-arrow-left text-xs" />
				<span>{{ locale === 'id' ? 'KEMBALI KE ARSIP BLOG' : 'BACK TO BLOG ARCHIVE' }}</span>
			</NuxtLink>

			<div class="flex items-center gap-3 text-slate-900/40 dark:text-slate-50/40 uppercase">
				<span class="hidden sm:inline">DOKUMEN TEKNIS</span>
				<span class="font-bold text-brand-600 dark:text-brand-400">[{{ (post.doc.category || 'UMUM').toUpperCase() }}]</span>
			</div>
		</nav>

		<!-- Header Band: Parameter Spec Sheet + Display Title (4:8 Split) -->
		<header class="w-full border-b border-slate-200/80 dark:border-[#134e43]">
			<div class="grid grid-cols-1 lg:grid-cols-12">
				<!-- Parameter Spec Sheet & TOC rail (Cols 1 to 4) -->
				<div class="lg:col-span-4 p-6 sm:p-8 lg:p-10 lg:border-r border-b lg:border-b-0 border-slate-200/80 dark:border-[#134e43] bg-slate-50/50 dark:bg-[#002420]/40 flex flex-col justify-between">
					<div>
						<div class="mb-4 font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-brand-700 dark:text-accent">
							PARAMETER NASKAH
						</div>

						<div class="divide-y divide-slate-200/80 dark:divide-[#134e43] font-mono text-xs mb-8">
							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-900/60 dark:text-slate-50/60">TANGGAL RILIS</span>
								<span class="text-slate-900 dark:text-slate-50 tabular-nums font-semibold">{{ formatDate(post.doc.date) }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-900/60 dark:text-slate-50/60">WAKTU BACA</span>
								<span class="text-slate-900 dark:text-slate-50 tabular-nums">{{ post.doc.readingTime || 5 }} Menit</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-900/60 dark:text-slate-50/60">KATEGORI</span>
								<span class="text-brand-600 dark:text-brand-400 font-bold uppercase">{{ getCategoryLabel(post.doc.category) }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-900/60 dark:text-slate-50/60">PENULIS</span>
								<span class="text-slate-900 dark:text-slate-50 font-medium">Dinar Permadi Yusup</span>
							</div>
						</div>
					</div>

					<div class="mt-8 pt-6 border-t border-slate-200/80 dark:border-[#134e43] font-mono text-xs text-slate-900/50 dark:text-slate-50/50 flex items-center justify-between">
						<span>LISENSI KONTEN</span>
						<span>CC BY-NC-SA 4.0</span>
					</div>
				</div>

				<!-- Typographic Statement Field (Cols 5 to 12) -->
				<div class="lg:col-span-8 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
					<div>
						<div class="mb-4 font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-brand-700 dark:text-accent">
							WACANA TEKNIS &amp; PEDAGOGIS
						</div>

						<h1 class="font-heading font-700 text-3xl sm:text-5xl lg:text-6xl tracking-[-0.035em] text-slate-900 dark:text-slate-50 leading-[0.95] text-balance mb-6">
							{{ post.doc.title }}
						</h1>

						<p class="font-sans text-base sm:text-lg text-slate-900/80 dark:text-slate-50/80 leading-relaxed max-w-[58ch] mb-8">
							{{ post.doc.description }}
						</p>

						<!-- Tech Tags -->
						<div class="flex flex-wrap gap-2">
							<span
								v-for="tag in (post.doc.tags || [])"
								:key="tag"
								class="px-2.5 py-1 font-mono text-xs uppercase border border-slate-300 dark:border-[#134e43] text-slate-900/80 dark:text-slate-50/80"
							>
								#{{ tag }}
							</span>
						</div>
					</div>

					<div class="mt-8 pt-6 border-t border-slate-200/80 dark:border-[#134e43] font-mono text-xs text-slate-900/50 dark:text-slate-50/50 flex items-center justify-between">
						<span>ARSIP PERMADI.DEV</span>
					</div>
				</div>
			</div>
		</header>

		<!-- Sticky Swiss Reading Navigation Strip & Architectural TOC Dropdown -->
		<div
			v-if="tocLinks.length > 0"
			ref="tocDropdownRef"
			class="sticky top-14 z-30 w-full border-b border-slate-200/80 dark:border-[#134e43] bg-white/95 dark:bg-[#001e1c]/95 backdrop-blur-xs font-mono text-xs"
			aria-label="Status Membaca dan Daftar Isi"
		>
			<!-- Top Strip Bar -->
			<div class="px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4">
				<!-- Current Section Indicator -->
				<div class="flex items-center gap-2 truncate text-[11px]">
					<span class="w-1.5 h-1.5 bg-brand-500 inline-block shrink-0" />
					<span class="text-slate-900/50 dark:text-slate-50/50 shrink-0 font-bold uppercase tracking-wider">
						SEKSI [{{ String(activeHeadingIndex + 1).padStart(2, '0') }}/{{ String(tocLinks.length).padStart(2, '0') }}]:
					</span>
					<span class="text-slate-900 dark:text-slate-50 font-bold truncate">
						{{ currentActiveHeadingText }}
					</span>
				</div>

				<!-- Navigation Actions -->
				<div class="flex items-center gap-2.5 shrink-0 text-[11px] font-bold uppercase tracking-wider">
					<!-- Dropdown Trigger Button -->
					<button
						type="button"
						class="px-2.5 py-1 border border-slate-300 dark:border-[#134e43] hover:border-brand-500 hover:text-brand-600 dark:hover:text-accent transition-colors flex items-center gap-1.5 cursor-pointer"
						:class="isTocDropdownOpen ? 'bg-slate-900 text-white dark:bg-brand-500 dark:text-slate-950 border-transparent' : 'text-slate-800 dark:text-slate-200'"
						:aria-expanded="isTocDropdownOpen"
						@click="toggleTocDropdown"
					>
						<span>DAFTAR ISI ({{ String(tocLinks.length).padStart(2, '0') }})</span>
						<span :class="isTocDropdownOpen ? 'i-ph-caret-up' : 'i-ph-caret-down'" class="text-xs" />
					</button>

					<span class="text-slate-300 dark:text-[#134e43]">|</span>

					<!-- Top of Page Action -->
					<button
						type="button"
						class="text-slate-900/60 hover:text-brand-600 dark:text-slate-50/60 dark:hover:text-accent transition-colors cursor-pointer"
						@click="scrollToTop"
					>
						PUNCAK ↑
					</button>
				</div>
			</div>

			<!-- Dropdown Architectural Modular Index Panel -->
			<div
				v-if="isTocDropdownOpen"
				class="w-full border-t border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#001e1c] shadow-2xl overflow-hidden font-mono text-xs"
			>
				<!-- Dropdown Panel Header -->
				<div class="px-6 py-2.5 border-b border-slate-200/80 dark:border-[#134e43] bg-slate-50/80 dark:bg-[#002420]/60 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
					<div class="flex items-center gap-2 text-brand-700 dark:text-accent">
						<span class="w-1.5 h-1.5 bg-brand-500 inline-block" />
						<span>INDIKATOR STRUKTUR ARTIKEL // {{ String(tocLinks.length).padStart(2, '0') }} SEKSI</span>
					</div>
					<button
						type="button"
						class="text-slate-900/50 hover:text-slate-900 dark:text-slate-50/50 dark:hover:text-slate-50 text-[10px] cursor-pointer"
						@click="isTocDropdownOpen = false"
					>
						TUTUP [ESC] ✕
					</button>
				</div>

				<!-- 3-Column Scrollable Modular Ledger Grid -->
				<div class="max-h-[55vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200/80 dark:divide-[#134e43]">
					<a
						v-for="(link, idx) in tocLinks"
						:key="link.id"
						:href="`#${link.id}`"
						class="group p-3.5 sm:p-4 flex items-start gap-3 transition-colors cursor-pointer border-b md:border-b-0 border-slate-200/80 dark:border-[#134e43]"
						:class="link.id === activeSection ? 'bg-brand-500/10 dark:bg-[#002420] text-brand-700 dark:text-accent font-bold' : 'hover:bg-slate-50 dark:hover:bg-[#002420]/40 text-slate-900/80 dark:text-slate-50/80'"
						@click.prevent="selectHeading(link.id)"
					>
						<span
							class="shrink-0 font-mono text-xs tabular-nums"
							:class="link.id === activeSection ? 'text-brand-600 dark:text-accent font-bold' : 'text-slate-400 dark:text-slate-500 group-hover:text-brand-600'"
						>
							{{ String(idx + 1).padStart(2, '0') }}.
						</span>
						<div class="flex-1 min-w-0">
							<span class="font-mono text-xs leading-snug line-clamp-2">
								{{ link.text }}
							</span>
						</div>
						<span
							v-if="link.id === activeSection"
							class="shrink-0 text-[10px] text-brand-600 dark:text-accent font-bold uppercase"
						>
							AKTIF
						</span>
						<span
							v-else
							class="shrink-0 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
						>
							→
						</span>
					</a>
				</div>

				<!-- Dropdown Panel Footer Strip -->
				<div class="px-6 py-2 border-t border-slate-200/80 dark:border-[#134e43] bg-slate-50/50 dark:bg-[#002420]/30 flex items-center justify-between text-[10px] text-slate-900/40 dark:text-slate-50/40">
					<span>ARSIP DOKUMENTASI PERMADI.DEV</span>
					<span>KLIK SEKSI UNTUK BERPINDAH LANGSUNG</span>
				</div>
			</div>
		</div>

		<!-- Band 02: Primary Technical Reading Canvas (Full-Width, Spacious & Monumental) -->
		<main class="w-full border-b border-slate-200/80 dark:border-[#134e43] p-6 sm:p-10 lg:p-14">
			<div class="max-w-4xl mx-auto">
				<!-- Section Sub-Header -->
				<div class="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-brand-700 dark:text-accent mb-8 pb-3 border-b border-slate-200/80 dark:border-[#134e43] flex items-center justify-between">
					<span>■ 02 // DOKUMENTASI LENGKAP &amp; BEDAH TEKNIS</span>
					<span class="tabular-nums text-slate-900/40 dark:text-slate-50/40">KORPUS 01</span>
				</div>

				<!-- Expansive Full-Measure Prose Content -->
				<div class="prose prose-slate dark:prose-invert max-w-[76ch] font-sans text-slate-900/85 dark:text-slate-50/85 leading-relaxed">
					<ContentRenderer :value="post.doc" />
				</div>

				<!-- Reactions Bar Component -->
				<div class="mt-14 pt-8 border-t border-slate-200/80 dark:border-[#134e43]">
					<AppReactionsBar
						v-if="post?.doc"
						:slug="contentIdentifier"
						:active-section="activeSection"
					/>
				</div>
			</div>
		</main>

		<!-- Surround Articles Navigation (Previous / Next) -->
		<nav
			v-if="surround && (surround[0] || surround[1])"
			class="w-full border-b border-slate-200/80 dark:border-[#134e43] grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 dark:divide-[#134e43]"
			aria-label="Navigasi Naskah Sebelumnya dan Berikutnya"
		>
			<!-- Previous Article -->
			<div class="p-6 sm:p-8 flex flex-col justify-between group hover:bg-slate-50/80 dark:hover:bg-[#002420]/40 transition-colors">
				<div v-if="surround[0]">
					<span class="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-900/50 dark:text-slate-50/50 block mb-2">
						← NASKAH SEBELUMNYA
					</span>
					<h3 class="font-heading font-700 text-lg text-slate-900 dark:text-slate-50 leading-snug group-hover:text-brand-600 transition-colors">
						<NuxtLink :to="locale === 'id' ? `/id/blog/${surround[0].slug || cleanSlug(surround[0].path)}` : `/blog/${surround[0].slug || cleanSlug(surround[0].path)}`">
							{{ surround[0].title }}
						</NuxtLink>
					</h3>
				</div>
				<div v-else class="text-slate-900/30 dark:text-slate-50/30 font-mono text-xs uppercase">
					AWAL ARSIP PUBLIKASI
				</div>
			</div>

			<!-- Next Article -->
			<div class="p-6 sm:p-8 flex flex-col justify-between text-right group hover:bg-slate-50/80 dark:hover:bg-[#002420]/40 transition-colors">
				<div v-if="surround[1]">
					<span class="font-mono text-[11px] font-bold uppercase tracking-widest text-slate-900/50 dark:text-slate-50/50 block mb-2">
						NASKAH BERIKUTNYA →
					</span>
					<h3 class="font-heading font-700 text-lg text-slate-900 dark:text-slate-50 leading-snug group-hover:text-brand-600 transition-colors">
						<NuxtLink :to="locale === 'id' ? `/id/blog/${surround[1].slug || cleanSlug(surround[1].path)}` : `/blog/${surround[1].slug || cleanSlug(surround[1].path)}`">
							{{ surround[1].title }}
						</NuxtLink>
					</h3>
				</div>
				<div v-else class="text-slate-900/30 dark:text-slate-50/30 font-mono text-xs uppercase">
					AKHIR ARSIP PUBLIKASI
				</div>
			</div>
		</nav>

		<!-- Bottom Archival Colophon Strip -->
		<footer class="w-full bg-slate-50/80 dark:bg-[#002420]/60 px-6 py-6 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
			<NuxtLink
				:to="locale === 'id' ? '/id/blog' : '/blog'"
				class="inline-flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider hover:text-brand-600 dark:text-slate-50 dark:hover:text-brand-400"
			>
				<span class="i-ph-arrow-left text-xs" />
				<span>KEMBALI KE SELURUH NASKAH</span>
			</NuxtLink>

			<div class="text-slate-900/50 dark:text-slate-50/50">
				DINAR PERMADI YUSUP
			</div>
		</footer>
	</div>
</template>
