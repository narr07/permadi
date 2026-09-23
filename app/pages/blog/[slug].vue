<script setup lang="ts">
import { onClickOutside, useEventListener, useThrottleFn } from '@vueuse/core'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import ArticleShare from '~/components/ArticleShare.vue'
import AppReactionsBar from '~/components/reactions/AppReactionsBar.vue'

const route = useRoute()
const { locale, locales } = useI18n()
const setI18nParams = useSetI18nParams()
const { getCategoryLabel } = useCategoryLabel()
const { formatDate } = useFormatDate()

const activeSection = ref('')
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

async function selectHeading(id: string) {
	isTocDropdownOpen.value = false
	await nextTick()
	scrollToHeading(id)
}

function scrollToHeading(id: string) {
	if (!import.meta.client)
		return
	const el = document.getElementById(id)
	if (el) {
		const headerEl = document.querySelector('header')
		const tocEl = tocDropdownRef.value
		const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 65
		const tocHeight = tocEl ? (tocEl.querySelector('.h-12') || tocEl).getBoundingClientRect().height : 48
		const offset = headerHeight + tocHeight + 20

		const elTop = window.scrollY + el.getBoundingClientRect().top
		window.scrollTo({
			top: Math.max(0, elTop - offset),
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

function flattenLinks(links: any[]): any[] {
	return links.flatMap((l: any) => [
		l,
		...(l.children ? flattenLinks(l.children) : []),
	])
}

const flatTocList = computed(() => flattenLinks(tocLinks.value || []))

const currentActiveHeadingText = computed(() => {
	const list = flatTocList.value
	if (!list.length)
		return ''
	const found = list.find((l: any) => l.id === activeSection.value)
	if (found)
		return found.text
	return list[0]?.text || ''
})

const activeHeadingIndex = computed(() => {
	const list = flatTocList.value
	if (!list.length)
		return 0
	const idx = list.findIndex((l: any) => l.id === activeSection.value)
	return idx >= 0 ? idx : 0
})

// Throttled real-time scrollspy for TOC navigation
const updateActiveHeading = useThrottleFn(() => {
	if (!import.meta.client)
		return
	const list = flatTocList.value
	if (!list.length)
		return

	const headerEl = document.querySelector('header')
	const tocEl = tocDropdownRef.value
	const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 65
	const tocHeight = tocEl ? (tocEl.querySelector('.h-12') || tocEl).getBoundingClientRect().height : 48
	const offset = headerHeight + tocHeight + 24

	for (let i = list.length - 1; i >= 0; i--) {
		const item = list[i]
		if (!item?.id)
			continue
		const el = document.getElementById(item.id)
		if (el) {
			const rect = el.getBoundingClientRect()
			if (rect.top <= offset) {
				activeSection.value = item.id
				return
			}
		}
	}

	if (list[0]?.id) {
		activeSection.value = list[0].id
	}
}, 80)

onMounted(() => {
	if (!import.meta.client)
		return

	nextTick(() => {
		updateActiveHeading()
		window.addEventListener('scroll', updateActiveHeading, { passive: true })
	})
})

onUnmounted(() => {
	if (import.meta.client) {
		window.removeEventListener('scroll', updateActiveHeading)
	}
})

watch(
	() => post.value?.doc,
	() => {
		nextTick(() => {
			updateActiveHeading()
		})
	},
	{ deep: true },
)

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
				<span class="i-swisspost-arrowleft text-xs transition-transform duration-150 group-hover:-translate-x-1" />
				<span>{{ locale === 'id' ? 'KEMBALI KE ARSIP BLOG' : 'BACK TO BLOG ARCHIVE' }}</span>
			</NuxtLink>

			<div class="flex items-center gap-3 text-slate-600 uppercase dark:text-slate-400">
				<span class="hidden sm:inline">{{ locale === 'id' ? 'DOKUMEN TEKNIS' : 'TECHNICAL DOCUMENT' }}</span>
				<span class="text-brand-600 font-bold dark:text-brand-400">[{{ (post.doc.category || (locale === 'id' ? 'UMUM' : 'GENERAL')).toUpperCase() }}]</span>
			</div>
		</nav>

		<!-- Header Band: Parameter Spec Sheet + Display Title (4:8 Split) -->
		<header class="w-full border-b border-slate-200/80 dark:border-[#134e43]">
			<div class="grid grid-cols-1 lg:grid-cols-12">
				<!-- Parameter Spec Sheet & TOC rail (Cols 1 to 4) -->
				<div class="flex flex-col justify-between border-b border-slate-200/80 bg-slate-50/50 p-6 lg:col-span-4 lg:border-b-0 lg:border-r dark:border-[#134e43] dark:bg-[#002420]/40 lg:p-10 sm:p-8">
					<div>
						<div class="mb-4 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:text-accent">
							{{ locale === 'id' ? 'PARAMETER NASKAH' : 'ARTICLE PARAMETERS' }}
						</div>

						<div class="mb-8 text-xs font-mono divide-y divide-slate-200/80 dark:divide-[#134e43]">
							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-700 dark:text-slate-300">{{ locale === 'id' ? 'TANGGAL RILIS' : 'PUBLISHED DATE' }}</span>
								<span class="text-slate-900 font-semibold tabular-nums dark:text-slate-50">{{ formatDate(post.doc.date) }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-700 dark:text-slate-300">{{ locale === 'id' ? 'WAKTU BACA' : 'READING TIME' }}</span>
								<span class="text-slate-900 tabular-nums dark:text-slate-50">{{ post.doc.readingTime || 5 }} {{ locale === 'id' ? 'Menit' : 'Min' }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-700 dark:text-slate-300">{{ locale === 'id' ? 'KATEGORI' : 'CATEGORY' }}</span>
								<span class="text-brand-600 font-bold uppercase dark:text-brand-400">{{ getCategoryLabel(post.doc.category) }}</span>
							</div>

							<div class="flex items-baseline justify-between py-2.5">
								<span class="text-slate-700 dark:text-slate-300">{{ locale === 'id' ? 'PENULIS' : 'AUTHOR' }}</span>
								<span class="text-slate-900 font-medium dark:text-slate-50">Dinar Permadi Yusup</span>
							</div>
						</div>
					</div>

					<div class="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-6 text-xs text-slate-600 font-mono dark:border-[#134e43] dark:text-slate-400">
						<span>{{ locale === 'id' ? 'LISENSI KONTEN' : 'CONTENT LICENSE' }}</span>
						<span>CC BY-NC-SA 4.0</span>
					</div>
				</div>

				<!-- Typographic Statement Field (Cols 5 to 12) -->
				<div class="flex flex-col justify-between p-6 lg:col-span-8 lg:p-12 sm:p-10">
					<div>
						<div class="mb-4 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:text-accent">
							{{ locale === 'id' ? 'WACANA TEKNIS & PEDAGOGIS' : 'TECHNICAL & PEDAGOGICAL ESSAY' }}
						</div>

						<h1 class="mb-6 text-balance text-3xl text-slate-900 font-700 leading-[0.95] tracking-[-0.035em] font-heading lg:text-6xl sm:text-5xl dark:text-slate-50">
							{{ post.doc.title }}
						</h1>

						<p class="mb-8 max-w-[58ch] text-base text-slate-800 leading-relaxed font-sans sm:text-lg dark:text-slate-200">
							{{ post.doc.description }}
						</p>

						<!-- Tech Tags -->
						<div class="flex flex-wrap gap-2">
							<span
								v-for="tag in (post.doc.tags || [])"
								:key="tag"
								class="border border-slate-300 px-2.5 py-1 text-xs text-slate-800 font-mono uppercase dark:border-[#134e43] dark:text-slate-200"
							>
								#{{ tag }}
							</span>
						</div>
					</div>

					<div class="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-6 text-xs text-slate-600 font-mono dark:border-[#134e43] dark:text-slate-400">
						<span>{{ locale === 'id' ? 'ARSIP PERMADI.DEV' : 'PERMADI.DEV ARCHIVE' }}</span>
					</div>
				</div>
			</div>
		</header>

		<!-- Sticky Swiss Reading Navigation Strip & Architectural TOC Dropdown -->
		<div
			v-if="tocLinks.length > 0"
			ref="tocDropdownRef"
			class="backdrop-blur-xs sticky z-30 w-full border-b border-slate-200/80 bg-white/95 text-xs font-mono dark:border-[#134e43] dark:bg-[#001e1c]/95"
			:style="{ top: 'var(--app-header-height, 65px)' }"
			:aria-label="locale === 'id' ? 'Status Membaca dan Daftar Isi' : 'Reading Progress and Table of Contents'"
		>
			<!-- Top Strip Bar -->
			<div class="h-12 w-full flex items-center justify-between gap-4 px-4 sm:px-8">
				<!-- Current Section Indicator -->
				<div class="min-w-0 flex flex-1 items-center gap-2.5 text-[11px] leading-none">
					<span class="inline-block h-2 w-2 shrink-0 bg-brand-500" />
					<span class="shrink-0 text-slate-600 font-bold tracking-wider uppercase tabular-nums dark:text-slate-400">
						[{{ String(activeHeadingIndex + 1).padStart(2, '0') }}/{{ String(flatTocList.length).padStart(2, '0') }}]:
					</span>
					<span class="truncate text-slate-900 font-bold dark:text-slate-50">
						{{ currentActiveHeadingText }}
					</span>
				</div>

				<!-- Navigation Actions -->
				<div class="flex shrink-0 items-center gap-3 text-[11px] font-bold tracking-wider uppercase">
					<!-- Dropdown Trigger Button -->
					<button
						type="button"
						class="h-8 inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap border border-slate-300 px-3 leading-none transition-all duration-150 active:scale-95 dark:border-[#134e43] hover:border-brand-500 hover:text-brand-600 dark:hover:text-accent"
						:class="isTocDropdownOpen ? 'bg-slate-900 text-white dark:bg-brand-500 dark:text-slate-950 border-transparent' : 'text-slate-800 dark:text-slate-200'"
						:aria-expanded="isTocDropdownOpen"
						@click="toggleTocDropdown"
					>
						<span class="whitespace-nowrap">{{ locale === 'id' ? 'DAFTAR ISI' : 'TABLE OF CONTENTS' }} ({{ String(flatTocList.length).padStart(2, '0') }})</span>
						<span
							:class="isTocDropdownOpen ? 'rotate-180' : 'rotate-0'"
							class="i-swisspost-chevrondown shrink-0 text-xs transition-transform duration-200"
						/>
					</button>

					<span class="select-none text-slate-300 dark:text-[#134e43]">|</span>

					<!-- Top of Page Action -->
					<button
						type="button"
						class="h-8 inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap text-slate-700 leading-none transition-all duration-150 active:scale-95 dark:text-slate-300 hover:text-brand-600 hover:-translate-y-0.5 dark:hover:text-accent"
						@click="scrollToTop"
					>
						{{ locale === 'id' ? 'PUNCAK ↑' : 'TOP ↑' }}
					</button>
				</div>
			</div>

			<!-- Dropdown Architectural Modular Index Panel -->
			<div
				v-if="isTocDropdownOpen"
				class="absolute left-0 right-0 top-full z-50 w-full overflow-hidden border-b border-t border-slate-200/80 bg-white text-xs font-mono shadow-2xl dark:border-[#134e43] dark:bg-[#001e1c]"
			>
				<!-- Dropdown Panel Header -->
				<div class="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/80 px-6 py-2.5 text-[11px] font-bold tracking-wider uppercase dark:border-[#134e43] dark:bg-[#002420]/60">
					<div class="flex items-center gap-2 text-brand-700 dark:text-accent">
						<span class="inline-block h-1.5 w-1.5 bg-brand-500" />
						<span>{{ locale === 'id' ? 'INDIKATOR STRUKTUR ARTIKEL' : 'ARTICLE STRUCTURE INDEX' }} // {{ String(flatTocList.length).padStart(2, '0') }} {{ locale === 'id' ? 'BAGIAN' : 'SECTIONS' }}</span>
					</div>
					<button
						type="button"
						class="cursor-pointer text-[10px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
						@click="isTocDropdownOpen = false"
					>
						{{ locale === 'id' ? 'TUTUP [ESC] ✕' : 'CLOSE [ESC] ✕' }}
					</button>
				</div>

				<!-- 3-Column Scrollable Modular Ledger Grid -->
				<div class="grid grid-cols-1 max-h-[55vh] overflow-y-auto lg:grid-cols-3 md:grid-cols-2 divide-y divide-slate-200/80 md:divide-x md:divide-y-0 dark:divide-[#134e43]">
					<a
						v-for="(link, idx) in flatTocList"
						:key="link.id"
						:href="`#${link.id}`"
						class="group flex cursor-pointer items-start gap-3 border-b border-slate-200/80 p-3.5 transition-colors md:border-b-0 dark:border-[#134e43] sm:p-4"
						:class="link.id === activeSection ? 'bg-brand-500/10 dark:bg-[#002420] text-brand-700 dark:text-accent font-bold' : 'hover:bg-slate-50 dark:hover:bg-[#002420]/40 text-slate-800 dark:text-slate-200'"
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
							{{ locale === 'id' ? 'AKTIF' : 'ACTIVE' }}
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
				<div class="flex items-center justify-between border-t border-slate-200/80 bg-slate-50/50 px-6 py-2 text-[10px] text-slate-600 dark:border-[#134e43] dark:bg-[#002420]/30 dark:text-slate-400">
					<span>{{ locale === 'id' ? 'ARSIP DOKUMENTASI PERMADI.DEV' : 'PERMADI.DEV DOCUMENTATION ARCHIVE' }}</span>
					<span>{{ locale === 'id' ? 'KLIK ITEM UNTUK BERPINDAH LANGSUNG' : 'CLICK ANY ITEM TO JUMP DIRECTLY' }}</span>
				</div>
			</div>
		</div>

		<!-- Band 02: Primary Technical Reading Canvas (Centered Swiss Reading Column) -->
		<main class="w-full border-b border-slate-200/80 p-6 dark:border-[#134e43] lg:p-14 sm:p-10">
			<div class="mx-auto max-w-3xl">
				<!-- Expansive Full-Measure Prose Content Centered -->
				<div class="max-w-none w-full text-slate-800 leading-relaxed font-sans prose prose-slate dark:text-slate-100 dark:prose-invert">
					<ContentRenderer :value="post.doc" />
				</div>

				<!-- Article Social Share Component -->
				<ArticleShare
					v-if="post?.doc"
					:slug="contentIdentifier"
					:title="post.doc.title"
					:description="post.doc.description"
					:url="canonicalUrl"
				/>

				<!-- Reactions Bar Component -->
				<div class="mt-8 border-t border-slate-200/80 pt-8 dark:border-[#134e43]">
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
			:aria-label="locale === 'id' ? 'Navigasi Naskah Sebelumnya dan Berikutnya' : 'Previous and Next Article Navigation'"
		>
			<!-- Previous Article -->
			<div class="group flex flex-col justify-between p-6 transition-colors hover:bg-slate-50/80 sm:p-8 dark:hover:bg-[#002420]/40">
				<div v-if="surround[0]">
					<span class="mb-2 block text-[11px] text-slate-600 font-bold tracking-widest font-mono uppercase dark:text-slate-400">
						{{ locale === 'id' ? '← NASKAH SEBELUMNYA' : '← PREVIOUS ARTICLE' }}
					</span>
					<h3 class="text-lg text-slate-900 font-700 leading-snug font-heading transition-colors dark:text-slate-50 group-hover:text-brand-600">
						<NuxtLink :to="locale === 'id' ? `/id/blog/${surround[0].slug || cleanSlug(surround[0].path)}` : `/blog/${surround[0].slug || cleanSlug(surround[0].path)}`">
							{{ surround[0].title }}
						</NuxtLink>
					</h3>
				</div>
				<div
					v-else
					class="text-xs text-slate-600 font-mono uppercase dark:text-slate-400"
				>
					{{ locale === 'id' ? 'AWAL ARSIP PUBLIKASI' : 'START OF ARCHIVE' }}
				</div>
			</div>

			<!-- Next Article -->
			<div class="group flex flex-col justify-between p-6 text-right transition-colors hover:bg-slate-50/80 sm:p-8 dark:hover:bg-[#002420]/40">
				<div v-if="surround[1]">
					<span class="mb-2 block text-[11px] text-slate-600 font-bold tracking-widest font-mono uppercase dark:text-slate-400">
						{{ locale === 'id' ? 'NASKAH BERIKUTNYA →' : 'NEXT ARTICLE →' }}
					</span>
					<h3 class="text-lg text-slate-900 font-700 leading-snug font-heading transition-colors dark:text-slate-50 group-hover:text-brand-600">
						<NuxtLink :to="locale === 'id' ? `/id/blog/${surround[1].slug || cleanSlug(surround[1].path)}` : `/blog/${surround[1].slug || cleanSlug(surround[1].path)}`">
							{{ surround[1].title }}
						</NuxtLink>
					</h3>
				</div>
				<div
					v-else
					class="text-xs text-slate-600 font-mono uppercase dark:text-slate-400"
				>
					{{ locale === 'id' ? 'AKHIR ARSIP PUBLIKASI' : 'END OF ARCHIVE' }}
				</div>
			</div>
		</nav>

		<!-- Bottom Archival Colophon Strip -->
		<footer class="w-full flex flex-col items-start justify-between gap-4 bg-slate-50/80 px-6 py-6 text-xs font-mono sm:flex-row sm:items-center dark:bg-[#002420]/60 sm:px-8">
			<NuxtLink
				:to="locale === 'id' ? '/id/blog' : '/blog'"
				class="inline-flex items-center gap-2 text-slate-900 font-bold tracking-wider uppercase dark:text-slate-50 hover:text-brand-600 dark:hover:text-brand-400"
			>
				<span class="i-swisspost-arrowleft text-xs" />
				<span>{{ locale === 'id' ? 'KEMBALI KE SELURUH NASKAH' : 'BACK TO ALL POSTS' }}</span>
			</NuxtLink>

			<div class="text-slate-600 dark:text-slate-400">
				DINAR PERMADI YUSUP
			</div>
		</footer>
	</div>
</template>
