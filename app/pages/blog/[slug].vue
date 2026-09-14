<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core'
import { onMounted, onUnmounted, ref } from 'vue'
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
			class="w-full flex items-center justify-between border-b border-slate-200/80 bg-slate-50/60 px-6 py-3.5 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/40 sm:px-8"
		>
			<NuxtLink
				:to="locale === 'id' ? '/id/blog' : '/blog'"
				class="group inline-flex items-center gap-2 text-slate-900 font-bold tracking-wider uppercase transition-all duration-150 active:scale-95 dark:text-slate-50 hover:text-brand-600 dark:hover:text-brand-400"
			>
				<span class="i-ph-arrow-left text-xs transition-transform duration-150 group-hover:-translate-x-1" />
				<span>{{ locale === 'id' ? 'KEMBALI KE ARSIP BLOG' : 'BACK TO BLOG ARCHIVE' }}</span>
			</NuxtLink>

			<div class="flex items-center gap-3 text-slate-900/40 uppercase dark:text-slate-50/40">
				<span class="hidden sm:inline">DOKUMEN TEKNIS</span>
				<span class="text-brand-600 font-bold dark:text-brand-400">[{{ (post.doc.category || 'UMUM').toUpperCase() }}]</span>
			</div>
		</nav>

		<!-- Header Band: Parameter Spec Sheet + Display Title (4:8 Split) -->
		<header class="w-full border-b border-slate-200/80 dark:border-[#134e43]">
			<div class="grid grid-cols-1 lg:grid-cols-12">
				<!-- Parameter Spec Sheet & TOC rail (Cols 1 to 4) -->
				<div class="flex flex-col justify-between border-b border-slate-200/80 bg-slate-50/50 p-6 lg:col-span-4 lg:border-b-0 lg:border-r dark:border-[#134e43] dark:bg-[#002420]/40 lg:p-10 sm:p-8">
					<div>
						<div class="mb-4 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:text-accent">
							PARAMETER NASKAH
						</div>

						<div class="mb-8 text-xs font-mono divide-y divide-slate-200/80 dark:divide-[#134e43]">
							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-900/60 dark:text-slate-50/60">TANGGAL RILIS</span>
								<span class="text-slate-900 font-semibold tabular-nums dark:text-slate-50">{{ formatDate(post.doc.date) }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-900/60 dark:text-slate-50/60">WAKTU BACA</span>
								<span class="text-slate-900 tabular-nums dark:text-slate-50">{{ post.doc.readingTime || 5 }} Menit</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-900/60 dark:text-slate-50/60">KATEGORI</span>
								<span class="text-brand-600 font-bold uppercase dark:text-brand-400">{{ getCategoryLabel(post.doc.category) }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-900/60 dark:text-slate-50/60">PENULIS</span>
								<span class="text-slate-900 font-medium dark:text-slate-50">Dinar Permadi Yusup</span>
							</div>
						</div>
					</div>

					<div class="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-6 text-xs text-slate-900/50 font-mono dark:border-[#134e43] dark:text-slate-50/50">
						<span>LISENSI KONTEN</span>
						<span>CC BY-NC-SA 4.0</span>
					</div>
				</div>

				<!-- Typographic Statement Field (Cols 5 to 12) -->
				<div class="flex flex-col justify-between p-6 lg:col-span-8 lg:p-12 sm:p-10">
					<div>
						<div class="mb-4 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:text-accent">
							WACANA TEKNIS &amp; PEDAGOGIS
						</div>

						<h1 class="mb-6 text-balance text-3xl text-slate-900 font-700 leading-[0.95] tracking-[-0.035em] font-heading lg:text-6xl sm:text-5xl dark:text-slate-50">
							{{ post.doc.title }}
						</h1>

						<p class="mb-8 max-w-[58ch] text-base text-slate-900/80 leading-relaxed font-sans sm:text-lg dark:text-slate-50/80">
							{{ post.doc.description }}
						</p>

						<!-- Tech Tags -->
						<div class="flex flex-wrap gap-2">
							<span
								v-for="tag in (post.doc.tags || [])"
								:key="tag"
								class="border border-slate-300 px-2.5 py-1 text-xs text-slate-900/80 font-mono uppercase dark:border-[#134e43] dark:text-slate-50/80"
							>
								#{{ tag }}
							</span>
						</div>
					</div>

					<div class="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-6 text-xs text-slate-900/50 font-mono dark:border-[#134e43] dark:text-slate-50/50">
						<span>ARSIP PERMADI.DEV</span>
					</div>
				</div>
			</div>
		</header>

		<!-- Sticky Swiss Reading Navigation Strip & Architectural TOC Dropdown -->
		<div
			v-if="tocLinks.length > 0"
			ref="tocDropdownRef"
			class="backdrop-blur-xs sticky top-14 z-30 w-full border-b border-slate-200/80 bg-white/95 text-xs font-mono dark:border-[#134e43] dark:bg-[#001e1c]/95"
			aria-label="Status Membaca dan Daftar Isi"
		>
			<!-- Top Strip Bar -->
			<div class="flex items-center justify-between gap-4 px-4 py-2.5 sm:px-8">
				<!-- Current Section Indicator -->
				<div class="flex items-center gap-2 truncate text-[11px]">
					<span class="inline-block h-1.5 w-1.5 shrink-0 bg-brand-500" />
					<span class="shrink-0 text-slate-900/50 font-bold tracking-wider uppercase dark:text-slate-50/50">
						SEKSI [{{ String(activeHeadingIndex + 1).padStart(2, '0') }}/{{ String(tocLinks.length).padStart(2, '0') }}]:
					</span>
					<span class="truncate text-slate-900 font-bold dark:text-slate-50">
						{{ currentActiveHeadingText }}
					</span>
				</div>

				<!-- Navigation Actions -->
				<div class="flex shrink-0 items-center gap-2.5 text-[11px] font-bold tracking-wider uppercase">
					<!-- Dropdown Trigger Button -->
					<button
						type="button"
						class="flex cursor-pointer items-center gap-1.5 border border-slate-300 px-2.5 py-1 transition-all duration-150 active:scale-95 dark:border-[#134e43] hover:border-brand-500 hover:text-brand-600 dark:hover:text-accent"
						:class="isTocDropdownOpen ? 'bg-slate-900 text-white dark:bg-brand-500 dark:text-slate-950 border-transparent' : 'text-slate-800 dark:text-slate-200'"
						:aria-expanded="isTocDropdownOpen"
						@click="toggleTocDropdown"
					>
						<span>DAFTAR ISI ({{ String(tocLinks.length).padStart(2, '0') }})</span>
						<span
							:class="isTocDropdownOpen ? 'rotate-180' : 'rotate-0'"
							class="i-ph-caret-down text-xs transition-transform duration-200"
						/>
					</button>

					<span class="text-slate-300 dark:text-[#134e43]">|</span>

					<!-- Top of Page Action -->
					<button
						type="button"
						class="cursor-pointer text-slate-900/60 transition-all duration-150 active:scale-95 dark:text-slate-50/60 hover:text-brand-600 hover:-translate-y-0.5 dark:hover:text-accent"
						@click="scrollToTop"
					>
						PUNCAK ↑
					</button>
				</div>
			</div>

			<!-- Dropdown Architectural Modular Index Panel -->
			<div
				v-if="isTocDropdownOpen"
				class="w-full overflow-hidden border-t border-slate-200/80 bg-white text-xs font-mono shadow-2xl dark:border-[#134e43] dark:bg-[#001e1c]"
			>
				<!-- Dropdown Panel Header -->
				<div class="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/80 px-6 py-2.5 text-[11px] font-bold tracking-wider uppercase dark:border-[#134e43] dark:bg-[#002420]/60">
					<div class="flex items-center gap-2 text-brand-700 dark:text-accent">
						<span class="inline-block h-1.5 w-1.5 bg-brand-500" />
						<span>INDIKATOR STRUKTUR ARTIKEL // {{ String(tocLinks.length).padStart(2, '0') }} SEKSI</span>
					</div>
					<button
						type="button"
						class="cursor-pointer text-[10px] text-slate-900/50 dark:text-slate-50/50 hover:text-slate-900 dark:hover:text-slate-50"
						@click="isTocDropdownOpen = false"
					>
						TUTUP [ESC] ✕
					</button>
				</div>

				<!-- 3-Column Scrollable Modular Ledger Grid -->
				<div class="grid grid-cols-1 max-h-[55vh] overflow-y-auto lg:grid-cols-3 md:grid-cols-2 divide-y divide-slate-200/80 md:divide-x md:divide-y-0 dark:divide-[#134e43]">
					<a
						v-for="(link, idx) in tocLinks"
						:key="link.id"
						:href="`#${link.id}`"
						class="group flex cursor-pointer items-start gap-3 border-b border-slate-200/80 p-3.5 transition-colors md:border-b-0 dark:border-[#134e43] sm:p-4"
						:class="link.id === activeSection ? 'bg-brand-500/10 dark:bg-[#002420] text-brand-700 dark:text-accent font-bold' : 'hover:bg-slate-50 dark:hover:bg-[#002420]/40 text-slate-900/80 dark:text-slate-50/80'"
						@click.prevent="selectHeading(link.id)"
					>
						<span
							class="shrink-0 text-xs font-mono tabular-nums"
							:class="link.id === activeSection ? 'text-brand-600 dark:text-accent font-bold' : 'text-slate-400 dark:text-slate-500 group-hover:text-brand-600'"
						>
							{{ String(idx + 1).padStart(2, '0') }}.
						</span>
						<div class="min-w-0 flex-1">
							<span class="line-clamp-2 text-xs leading-snug font-mono">
								{{ link.text }}
							</span>
						</div>
						<span
							v-if="link.id === activeSection"
							class="shrink-0 text-[10px] text-brand-600 font-bold uppercase dark:text-accent"
						>
							AKTIF
						</span>
						<span
							v-else
							class="shrink-0 text-[10px] text-slate-400 opacity-0 transition-opacity group-hover:opacity-100"
						>
							→
						</span>
					</a>
				</div>

				<!-- Dropdown Panel Footer Strip -->
				<div class="flex items-center justify-between border-t border-slate-200/80 bg-slate-50/50 px-6 py-2 text-[10px] text-slate-900/40 dark:border-[#134e43] dark:bg-[#002420]/30 dark:text-slate-50/40">
					<span>ARSIP DOKUMENTASI PERMADI.DEV</span>
					<span>KLIK SEKSI UNTUK BERPINDAH LANGSUNG</span>
				</div>
			</div>
		</div>

		<!-- Band 02: Primary Technical Reading Canvas (Full-Width, Spacious & Monumental) -->
		<main class="w-full border-b border-slate-200/80 p-6 dark:border-[#134e43] lg:p-14 sm:p-10">
			<div class="mx-auto max-w-4xl">
				<!-- Section Sub-Header -->
				<div class="mb-8 flex items-center justify-between border-b border-slate-200/80 pb-3 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:border-[#134e43] dark:text-accent">
					<span>■ 02 // DOKUMENTASI LENGKAP &amp; BEDAH TEKNIS</span>
					<span class="text-slate-900/40 tabular-nums dark:text-slate-50/40">KORPUS 01</span>
				</div>

				<!-- Expansive Full-Measure Prose Content -->
				<div class="max-w-[76ch] text-slate-900/85 leading-relaxed font-sans prose prose-slate dark:text-slate-50/85 dark:prose-invert">
					<ContentRenderer :value="post.doc" />
				</div>

				<!-- Reactions Bar Component -->
				<div class="mt-14 border-t border-slate-200/80 pt-8 dark:border-[#134e43]">
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
			class="grid grid-cols-1 w-full border-b border-slate-200/80 sm:grid-cols-2 divide-y divide-slate-200/80 dark:border-[#134e43] sm:divide-x sm:divide-y-0 dark:divide-[#134e43]"
			aria-label="Navigasi Naskah Sebelumnya dan Berikutnya"
		>
			<!-- Previous Article -->
			<div class="group flex flex-col justify-between p-6 transition-colors hover:bg-slate-50/80 sm:p-8 dark:hover:bg-[#002420]/40">
				<div v-if="surround[0]">
					<span class="mb-2 block text-[11px] text-slate-900/50 font-bold tracking-widest font-mono uppercase dark:text-slate-50/50">
						← NASKAH SEBELUMNYA
					</span>
					<h3 class="text-lg text-slate-900 font-700 leading-snug font-heading transition-colors dark:text-slate-50 group-hover:text-brand-600">
						<NuxtLink :to="locale === 'id' ? `/id/blog/${surround[0].slug || cleanSlug(surround[0].path)}` : `/blog/${surround[0].slug || cleanSlug(surround[0].path)}`">
							{{ surround[0].title }}
						</NuxtLink>
					</h3>
				</div>
				<div
					v-else
					class="text-xs text-slate-900/30 font-mono uppercase dark:text-slate-50/30"
				>
					AWAL ARSIP PUBLIKASI
				</div>
			</div>

			<!-- Next Article -->
			<div class="group flex flex-col justify-between p-6 text-right transition-colors hover:bg-slate-50/80 sm:p-8 dark:hover:bg-[#002420]/40">
				<div v-if="surround[1]">
					<span class="mb-2 block text-[11px] text-slate-900/50 font-bold tracking-widest font-mono uppercase dark:text-slate-50/50">
						NASKAH BERIKUTNYA →
					</span>
					<h3 class="text-lg text-slate-900 font-700 leading-snug font-heading transition-colors dark:text-slate-50 group-hover:text-brand-600">
						<NuxtLink :to="locale === 'id' ? `/id/blog/${surround[1].slug || cleanSlug(surround[1].path)}` : `/blog/${surround[1].slug || cleanSlug(surround[1].path)}`">
							{{ surround[1].title }}
						</NuxtLink>
					</h3>
				</div>
				<div
					v-else
					class="text-xs text-slate-900/30 font-mono uppercase dark:text-slate-50/30"
				>
					AKHIR ARSIP PUBLIKASI
				</div>
			</div>
		</nav>

		<!-- Bottom Archival Colophon Strip -->
		<footer class="w-full flex flex-col items-start justify-between gap-4 bg-slate-50/80 px-6 py-6 text-xs font-mono sm:flex-row sm:items-center dark:bg-[#002420]/60 sm:px-8">
			<NuxtLink
				:to="locale === 'id' ? '/id/blog' : '/blog'"
				class="inline-flex items-center gap-2 text-slate-900 font-bold tracking-wider uppercase dark:text-slate-50 hover:text-brand-600 dark:hover:text-brand-400"
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
