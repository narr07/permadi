<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import AppReactionsBar from '~/components/reactions/AppReactionsBar.vue'

// Load prose typography CSS hanya di halaman artikel (lazy, tidak blocking)
useHead({
	link: [{ rel: 'stylesheet', href: '/prose.css', media: 'print', onload: 'this.media=\'all\'' }],
})

const route = useRoute()
const { locale, locales } = useI18n()
const localePath = useLocalePath()
const setI18nParams = useSetI18nParams()
const { getCategoryLabel } = useCategoryLabel()
const { formatDate } = useFormatDate()

const activeSection = ref('general')

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

const { data: post } = await useAsyncData(
	() => `blog-post-${locale.value}-${requestedSlug.value}`,
	async () => {
		const allPosts = await queryCollection(collection.value).all()
		let matched = allPosts.find((p: any) => {
			return p.slug === requestedSlug.value || cleanSlug(p.path) === requestedSlug.value
		})

		// Fallback: Jika slug bahasa lain diakses di locale ini, temukan padanannya via idBlog
		if (!matched) {
			const otherCollection = (locale.value === 'id' ? 'blog_en' : 'blog_id') as any
			const otherPosts = await queryCollection(otherCollection).select('path', 'slug', 'idBlog', 'idItem').all()
			const otherMatched = otherPosts.find((p: any) => {
				return p.slug === requestedSlug.value || cleanSlug(p.path) === requestedSlug.value
			})
			if (otherMatched) {
				matched = allPosts.find((p: any) => p.idBlog === otherMatched.idBlog || p.idItem === otherMatched.idItem)
			}
		}

		if (!matched)
			return null

		// Cari padanan artikel di semua bahasa terdaftar berdasarkan idBlog / idItem
		const translations: Record<string, { slug: string }> = {}
		for (const loc of locales.value) {
			const locCode = typeof loc === 'string' ? loc : loc.code
			const locCol = (locCode === 'id' ? 'blog_id' : 'blog_en') as any
			const locPosts = await queryCollection(locCol).select('path', 'slug', 'idBlog', 'idItem').all()
			const trDoc = locPosts.find((p: any) => p.idBlog === matched.idBlog || p.idItem === matched.idItem)
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

const contentIdentifier = computed(() => {
	if (!post.value?.doc)
		return ''
	const doc = post.value.doc as any
	if (doc.idBlog)
		return `blog-${doc.idBlog}`
	return doc.slug || cleanSlug(doc.path)
})

if (post.value?.translations) {
	setI18nParams(post.value.translations)
}

provide('pageTitle', computed(() => post.value?.doc?.title || ''))

if (!post.value?.doc) {
	throw createError({
		statusCode: 404,
		statusMessage: locale.value === 'id' ? 'Artikel tidak ditemukan' : 'Post not found',
	})
}

// Composable resmi Nuxt Content: queryCollectionItemSurroundings
const { data: surround } = await useAsyncData(
	() => `blog-surround-${locale.value}-${post.value?.doc?.path}`,
	async () => {
		if (!post.value?.doc?.path)
			return [null, null]
		return queryCollectionItemSurroundings(collection.value as any, post.value.doc.path, {
			fields: ['title', 'description', 'slug'] as any,
		})
	},
	{ watch: [locale, post] },
)

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

function extractTextFromAst(node: any): string {
	if (!node)
		return ''
	if (typeof node === 'string')
		return node
	if (typeof node === 'number')
		return String(node)
	if (node.type === 'text' && typeof node.value === 'string')
		return node.value
	if (Array.isArray(node)) {
		// If compact AST tuple: [tag, props, ...children]
		if (node.length >= 2 && typeof node[0] === 'string' && typeof node[1] === 'object' && !Array.isArray(node[1])) {
			return node.slice(2).map(extractTextFromAst).filter(Boolean).join(' ')
		}
		return node.map(extractTextFromAst).filter(Boolean).join(' ')
	}
	if (Array.isArray(node.children)) {
		return node.children.map(extractTextFromAst).filter(Boolean).join(' ')
	}
	if (node.value && typeof node.value !== 'string') {
		return extractTextFromAst(node.value)
	}
	return ''
}

function extractFaqsFromDoc(doc: any): Array<{ question: string, answer: string }> {
	const faqs: Array<{ question: string, answer: string }> = []
	if (!doc)
		return faqs

	// 1. Ekstrak dari frontmatter jika ada (faq / faqs)
	const rawFaqs = doc.faq || doc.faqs
	if (Array.isArray(rawFaqs)) {
		for (const item of rawFaqs) {
			if (item?.question && item?.answer) {
				faqs.push({
					question: String(item.question).replace(/^\d+\.\s*/, '').trim(),
					answer: String(item.answer).trim(),
				})
			}
		}
	}

	// 2. Ekstrak otomatis dari AST body Nuxt Content (komponen ::faq & :::faq-item)
	function walk(node: any) {
		if (!node || typeof node !== 'object')
			return

		// Case A: Nuxt Content v3 Array AST tuple: ['faq-item', props, ...children]
		if (Array.isArray(node)) {
			const tag = typeof node[0] === 'string' ? node[0].toLowerCase() : ''
			if (tag === 'faq-item' || tag === 'faqitem') {
				const props = (typeof node[1] === 'object' && !Array.isArray(node[1])) ? node[1] : {}
				const question = props?.question || ''
				const children = node.slice(2)
				const answer = extractTextFromAst(children).replace(/\s+/g, ' ').trim()
				if (question) {
					faqs.push({
						question: String(question).replace(/^\d+\.\s*/, '').trim(),
						answer: String(answer).trim(),
					})
					return
				}
			}
			node.forEach(walk)
			return
		}

		// Case B: Object AST: { tag: 'faq-item', props: { question: '...' }, children: [...] }
		const tag = (node.tag || node.name || '').toLowerCase()
		if (tag === 'faq-item' || tag === 'faqitem') {
			const question = node.props?.question || node.attributes?.question || ''
			const answer = extractTextFromAst(node.children || node.value).replace(/\s+/g, ' ').trim()
			if (question) {
				faqs.push({
					question: String(question).replace(/^\d+\.\s*/, '').trim(),
					answer: String(answer).trim(),
				})
				return
			}
		}

		if (Array.isArray(node.children)) {
			node.children.forEach(walk)
		}
		if (Array.isArray(node.value)) {
			node.value.forEach(walk)
		}
	}

	if (doc.body) {
		walk(doc.body)
	}

	return faqs
}

const extractedFaqs = computed(() => {
	return extractFaqsFromDoc(post.value?.doc)
})

const site = useSiteConfig()
const canonicalUrl = computed(() => {
	const currentSlug = post.value?.doc?.slug || cleanSlug(post.value?.doc?.path || requestedSlug.value)
	return `${site.url}/${locale.value}/blog/${currentSlug}`
})

useHead({
	link: [
		{
			rel: 'canonical',
			href: () => canonicalUrl.value,
		},
	],
})

useSeoMeta({
	title: () => post.value?.doc?.title,
	description: () => post.value?.doc?.description,
	author: () => 'Dinar Permadi Yusup',
	colorScheme: 'light dark',
	themeColor: '#14b898',
	ogTitle: () => post.value?.doc?.title,
	ogDescription: () => post.value?.doc?.description,
	ogImageAlt: () => post.value?.doc?.title,
	ogType: 'article',
	ogUrl: () => canonicalUrl.value,
	ogSiteName: 'Permadi',
	ogLocale: () => (locale.value === 'id' ? 'id_ID' : 'en_US'),
	articlePublishedTime: () => (post.value?.doc?.date ? new Date(post.value.doc.date).toISOString() : undefined),
	articleModifiedTime: () => (post.value?.doc?.date ? new Date(post.value.doc.date).toISOString() : undefined),
	articleAuthor: () => ['https://permadi.dev'],
	articleSection: () => (post.value?.doc?.category ? getCategoryLabel(post.value.doc.category) : undefined),
	articleTag: () => post.value?.doc?.tags,
	keywords: () => (Array.isArray(post.value?.doc?.tags) ? post.value.doc.tags.join(', ') : post.value?.doc?.tags),
	twitterCard: 'summary_large_image',
	twitterSite: '@dinarpermadi07',
	twitterCreator: '@dinarpermadi07',
	twitterTitle: () => post.value?.doc?.title,
	twitterDescription: () => post.value?.doc?.description,
	twitterLabel1: () => (locale.value === 'id' ? 'Waktu Membaca' : 'Reading time'),
	twitterData1: () => (post.value?.doc?.readingTime ? (locale.value === 'id' ? `${post.value.doc.readingTime} menit` : `${post.value.doc.readingTime} min read`) : undefined),
	twitterLabel2: () => (locale.value === 'id' ? 'Ditulis oleh' : 'Written by'),
	twitterData2: () => 'Dinar Permadi Yusup',
	robots: 'index, follow, max-image-preview:large',
})

defineOgImage('Bento', {
	title: post.value?.doc?.title,
	description: post.value?.doc?.description,
	category: locale.value === 'id' ? 'Artikel Blog' : 'Blog Article',
})

useSchemaOrg([
	defineArticle({
		'@type': 'BlogPosting',
		'headline': () => post.value?.doc?.title,
		'description': () => post.value?.doc?.description,
		'datePublished': () => (post.value?.doc?.date ? new Date(post.value.doc.date).toISOString() : undefined),
		'dateModified': () => (post.value?.doc?.date ? new Date(post.value.doc.date).toISOString() : undefined),
		'inLanguage': () => (locale.value === 'id' ? 'id-ID' : 'en-US'),
		'wordCount': () => (post.value?.doc?.readingTime ? post.value.doc.readingTime * 200 : 1500),
		'articleSection': () => (post.value?.doc?.category ? getCategoryLabel(post.value.doc.category) : 'Technology'),
		'keywords': () => (Array.isArray(post.value?.doc?.tags) ? post.value.doc.tags.join(', ') : undefined),
		'author': [
			{
				name: 'Dinar Permadi Yusup',
				url: 'https://permadi.dev',
				image: 'https://permadi.dev/logo.png',
				jobTitle: locale.value === 'id' ? 'Guru SD, Web Developer & Desainer Grafis' : 'Elementary School Teacher, Web Developer & Graphic Designer',
				sameAs: [
					'https://github.com/narr07',
					'https://x.com/dinarpermadi07',
					'https://www.behance.net/narr07',
					'https://www.instagram.com/narr07/',
				],
				worksFor: 'SDN Teja II',
			},
		],
	}),
	defineBreadcrumb({
		itemListElement: [
			{
				name: (): string => (locale.value === 'id' ? 'Beranda' : 'Home'),
				item: (): string => `/${locale.value}`,
			},
			{
				name: 'Blog',
				item: (): string => `/${locale.value}/blog`,
			},
			{
				name: (): string => post.value?.doc?.title || '',
				item: (): string => canonicalUrl.value,
			},
		],
	}),
	// Standar resmi Unhead Schema.org: Setiap pertanyaan didefinisikan dengan defineQuestion()
	...extractedFaqs.value.map(faq =>
		defineQuestion({
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				'text': faq.answer,
			},
		}),
	),
])
</script>

<template>
	<div class="py-6 sm:py-10">
		<!-- Mobile Collapsible TOC: Sticky tepat di bawah Floating Header Navbar -->
		<div
			v-if="tocLinks.length > 0"
			class="sticky top-[4.75rem] z-40 container-bento mb-6 lg:hidden"
		>
			<ContentToc
				:links="tocLinks"
				mode="mobile"
			/>
		</div>

		<div class="container-bento">
			<!-- Back Button -->
			<NuxtLink
				:to="localePath('/blog')"
				class="mb-6 inline-flex items-center gap-1.5 text-xs text-slate-700 font-semibold transition-colors dark:text-slate-200 hover:text-brand-900 focus-ring dark:hover:text-brand-300"
			>
				<span class="i-hugeicons-arrow-left-01 text-sm" /> {{ locale === 'id' ? 'Kembali ke Blog' : 'Back to Blog' }}
			</NuxtLink>

			<!-- Article & Desktop TOC Grid Layout -->
			<div
				class="grid grid-cols-1 items-start gap-8"
				:class="tocLinks.length > 0 ? 'lg:grid-cols-12 lg:gap-8 xl:gap-10' : 'max-w-4xl mx-auto'"
			>
				<!-- Article Container -->
				<article
					v-if="post?.doc"
					:class="tocLinks.length > 0 ? 'lg:col-span-9 min-w-0 max-w-full' : 'w-full min-w-0 max-w-full'"
				>
					<!-- Bento Card Header with Spotlight -->
					<header

						class="bento-card-clean relative mb-10 overflow-hidden border border-slate-200/80 rounded-bento bg-white/90 p-6 shadow-sm dark:border-[#134e43] dark:bg-[#002b27]/90 md:p-9 sm:p-8"
					>
						<!-- Category & Tags Badge Row -->
						<div class="mb-3.5 flex flex-wrap items-center gap-2">
							<span
								v-if="post.doc.category"
								class="inline-flex items-center gap-1.5 border border-brand-200/60 rounded-full bg-brand-100/80 px-3 py-1 text-xs text-brand-800 font-semibold tracking-wider uppercase dark:border-brand-800/60 dark:bg-brand-950 dark:text-brand-300"
							>
								<span class="status-dot animate-pulse" />
								{{ getCategoryLabel(post.doc.category) }}
							</span>
							<span
								v-for="tag in post.doc.tags"
								:key="tag"
								class="border border-slate-200/60 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700 font-medium dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-300"
							>
								#{{ tag }}
							</span>
						</div>

						<!-- Title (Barlow, Bold, Responsive) -->
						<h1 class="text-2xl text-[#000b07] font-bold leading-[1.18] tracking-tight font-heading lg:text-[2.5rem] md:text-4xl sm:text-3xl dark:text-[#f8fafa]">
							{{ post.doc.title }}
						</h1>

						<!-- Description Lead Text (Refined compact size) -->
						<p class="mt-3.5 max-w-3xl text-body text-sm text-slate-600 leading-relaxed sm:text-[15px] dark:text-slate-300">
							{{ post.doc.description }}
						</p>

						<!-- Bento Metadata Footer Pills -->
						<div class="relative z-10 mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/70 pt-5 text-xs dark:border-slate-800/70">
							<div class="flex flex-wrap items-center gap-2 sm:gap-3">
								<div class="inline-flex items-center gap-1.5 border border-slate-200/60 rounded-xl bg-slate-100/80 px-3 py-1.5 text-slate-700 font-medium dark:border-[#134e43] dark:bg-[#042f27] dark:text-slate-200">
									<span class="i-hugeicons-calendar-03 text-sm text-brand-700 dark:text-brand-400" />
									<span>{{ formatDate(post.doc.date) }}</span>
								</div>
								<div class="inline-flex items-center gap-1.5 border border-slate-200/60 rounded-xl bg-slate-100/80 px-3 py-1.5 text-slate-700 font-medium dark:border-[#134e43] dark:bg-[#042f27] dark:text-slate-200">
									<span class="i-hugeicons-clock-01 text-sm text-brand-700 dark:text-brand-400" />
									<span>{{ locale === 'id' ? `${post.doc.readingTime || 5} menit baca` : `${post.doc.readingTime || 5} min read` }}</span>
								</div>
							</div>

							<div class="inline-flex items-center gap-2 text-xs text-slate-600 font-medium dark:text-slate-300">
								<LogoNav />
								<span>Dinar Permadi</span>
							</div>
						</div>
					</header>

					<!-- Prose Content -->
					<div class="max-w-full min-w-0 text-slate-700 leading-relaxed font-sans prose prose-slate dark:text-slate-200 dark:prose-invert">
						<ContentRenderer :value="post.doc" />

						<!-- Mobile/Tablet Social Share Card (under article) -->
						<div :class="tocLinks.length > 0 ? 'lg:hidden' : ''">
							<ArticleShare
								:slug="contentIdentifier"
								:title="post.doc.title"
								:description="post.doc.description"
							/>
						</div>

						<!-- Surround Articles Navigation (Bento Cards) -->
						<nav
							v-if="surround && (surround[0] || surround[1])"
							class="grid grid-cols-1 mt-10 gap-4 border-t border-slate-200/80 pt-8 sm:grid-cols-2 dark:border-slate-800/80"
							aria-label="Article Navigation"
						>
							<NuxtLink
								v-if="surround[0]"

								:to="`/${locale}/blog/${surround[0].slug || cleanSlug(surround[0].path)}`"
								class="bento-card-clean group flex flex-col justify-between bento-lift rounded-bento p-4"
							>
								<span class="flex items-center gap-1 text-meta text-xs text-slate-600 font-semibold uppercase transition-colors dark:text-slate-400 group-hover:text-brand-800 dark:group-hover:text-brand-400">
									<span class="i-hugeicons-arrow-left-01 text-xs" /> {{ locale === 'id' ? 'Artikel Sebelumnya' : 'Previous Article' }}
								</span>
								<strong class="mt-2 block text-sm text-slate-900 font-semibold font-heading transition-colors dark:text-white group-hover:text-brand-800 dark:group-hover:text-brand-300">
									{{ surround[0].title }}
								</strong>
							</NuxtLink>
							<div
								v-else
								class="hidden sm:block"
							/>

							<NuxtLink
								v-if="surround[1]"

								:to="`/${locale}/blog/${surround[1].slug || cleanSlug(surround[1].path)}`"
								class="bento-card-clean group flex flex-col justify-between bento-lift rounded-bento p-4 text-right"
							>
								<span class="flex items-center justify-end gap-1 text-meta text-xs text-slate-600 font-semibold uppercase transition-colors dark:text-slate-400 group-hover:text-brand-800 dark:group-hover:text-brand-400">
									{{ locale === 'id' ? 'Artikel Selanjutnya' : 'Next Article' }} <span class="i-hugeicons-arrow-right-01 text-xs" />
								</span>
								<strong class="mt-2 block text-sm text-slate-900 font-semibold font-heading transition-colors dark:text-white group-hover:text-brand-800 dark:group-hover:text-brand-300">
									{{ surround[1].title }}
								</strong>
							</NuxtLink>
						</nav>

						<!-- Native CSS Sticky Reactions Bar -->
						<AppReactionsBar
							v-if="post?.doc"
							:slug="contentIdentifier"
							:active-section="activeSection"
						/>
					</div>
				</article>

				<!-- Desktop Sticky Sidebar (TOC & Compact Share Card, Span 3) -->
				<aside
					v-if="tocLinks.length > 0"
					:aria-label="locale === 'id' ? 'Daftar Isi dan Bagikan' : 'Table of Contents and Share'"
					class="sticky top-20 hidden flex-col self-start gap-3 lg:col-span-3 lg:flex"
				>
					<ContentToc
						:links="tocLinks"
						mode="desktop"
					/>

					<!-- Bento Share Card on Desktop under TOC -->
					<LazyArticleShare
						hydrate-on-visible
						:slug="contentIdentifier"
						:title="post.doc.title"
						:description="post.doc.description"
						variant="sidebar"
					/>
				</aside>
			</div>
		</div>
	</div>
</template>
