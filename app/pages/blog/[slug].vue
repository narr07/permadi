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
const localePath = useLocalePath()
const setI18nParams = useSetI18nParams()
const { getCategoryLabel } = useCategoryLabel()

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
			const otherPosts = await queryCollection(otherCollection).all()
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
			const locPosts = await queryCollection(locCol).all()
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

useSeoMeta({
	title: computed(() => post.value?.doc?.title),
	description: computed(() => post.value?.doc?.description),
	ogTitle: computed(() => post.value?.doc?.title),
	ogDescription: computed(() => post.value?.doc?.description),
})

defineOgImage('Bento', {
	title: post.value?.doc?.title,
	description: post.value?.doc?.description,
	category: locale.value === 'id' ? 'Artikel Blog' : 'Blog Article',
})
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
					:class="tocLinks.length > 0 ? 'lg:col-span-9' : 'w-full'"
				>
					<!-- Bento Card Header (Clean, No Spotlight) -->
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
						<h1 class="text-2xl text-slate-900 font-extrabold leading-[1.18] tracking-tight font-heading lg:text-[2.5rem] md:text-4xl sm:text-3xl dark:text-white">
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
									<span>{{ post.doc.date }}</span>
								</div>
								<div class="inline-flex items-center gap-1.5 border border-slate-200/60 rounded-xl bg-slate-100/80 px-3 py-1.5 text-slate-700 font-medium dark:border-[#134e43] dark:bg-[#042f27] dark:text-slate-200">
									<span class="i-hugeicons-clock-01 text-sm text-brand-700 dark:text-brand-400" />
									<span>{{ post.doc.readingTime || 5 }} min read</span>
								</div>
							</div>

							<div class="inline-flex items-center gap-2 text-xs text-slate-600 font-medium dark:text-slate-300">
								<span class="h-6 w-6 flex items-center justify-center rounded-full bg-brand-700 text-[10px] text-white font-bold font-heading dark:bg-brand-500">
									DP
								</span>
								<span>Dinar Permadi</span>
							</div>
						</div>
					</header>

					<!-- Prose Content -->
					<div class="max-w-none text-slate-700 leading-relaxed font-sans prose prose-slate dark:text-slate-200 dark:prose-invert">
						<ContentRenderer
							:value="post.doc"
							:components="mdcComponents"
						/>
					</div>

					<!-- Mobile/Tablet Social Share Card (under article) -->
					<div :class="tocLinks.length > 0 ? 'lg:hidden' : ''">
						<ArticleShare
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
							<strong class="mt-2 block text-g1 text-slate-900 font-semibold font-heading transition-colors dark:text-white group-hover:text-brand-800 dark:group-hover:text-brand-300">
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
							<strong class="mt-2 block text-g1 text-slate-900 font-semibold font-heading transition-colors dark:text-white group-hover:text-brand-800 dark:group-hover:text-brand-300">
								{{ surround[1].title }}
							</strong>
						</NuxtLink>
					</nav>
				</article>

				<!-- Desktop Sticky Sidebar (TOC & Compact Share Card, Span 3) -->
				<aside
					v-if="tocLinks.length > 0"
					:aria-label="locale === 'id' ? 'Daftar Isi dan Bagikan' : 'Table of Contents and Share'"
					class="sticky top-20 hidden flex-col self-start gap-3.5 lg:col-span-3 lg:flex"
				>
					<ContentToc
						:links="tocLinks"
						mode="desktop"
					/>

					<!-- Bento Share Card on Desktop under TOC -->
					<ArticleShare
						:title="post.doc.title"
						:description="post.doc.description"
						variant="sidebar"
					/>
				</aside>
			</div>
		</div>
	</div>
</template>
