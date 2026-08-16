<script setup lang="ts">
	import ProseImg from '~/components/content/ProseImg.vue'
	import ProsePre from '~/components/content/ProsePre.vue'
	import ProseCode from '~/components/content/ProseCode.vue'

	const route = useRoute()
	const { locale, locales } = useI18n()
	const localePath = useLocalePath()
	const setI18nParams = useSetI18nParams()

	const mdcComponents = {
		img: ProseImg,
		ProseImg,
		'prose-img': ProseImg,
		pre: ProsePre,
		ProsePre,
		'prose-pre': ProsePre,
		code: ProseCode,
		ProseCode,
		'prose-code': ProseCode,
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

			if (!matched) return null

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
		{ watch: [locale, requestedSlug] }
	)

	if (post.value?.translations) {
		setI18nParams(post.value.translations)
	}

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
			if (!post.value?.doc?.path) return [null, null]
			return queryCollectionItemSurroundings(collection.value as any, post.value.doc.path, {
				fields: ['title', 'description', 'slug'] as any,
			})
		},
		{ watch: [locale, post] }
	)

	const tocLinks = computed(() => {
		return post.value?.doc?.body?.toc?.links || post.value?.doc?.toc?.links || []
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
		<div v-if="tocLinks.length > 0" class="lg:hidden sticky top-[4.75rem] z-40 mb-6 container-bento">
			<ContentToc
				:links="tocLinks"
				mode="mobile"
			/>
		</div>

		<div class="container-bento">
			<!-- Back Button -->
			<NuxtLink
				:to="localePath('/blog')"
				class="focus-ring inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:text-brand-900 dark:hover:text-brand-300 transition-colors mb-6"
			>
				<span class="i-hugeicons-arrow-left-01 text-sm" /> {{ locale === 'id' ? 'Kembali ke Blog' : 'Back to Blog' }}
			</NuxtLink>

			<!-- Article & Desktop TOC Grid Layout -->
			<div class="grid grid-cols-1 items-start gap-8" :class="tocLinks.length > 0 ? 'lg:grid-cols-12 lg:gap-8 xl:gap-10' : 'max-w-4xl mx-auto'">
				<!-- Article Container -->
				<article v-if="post?.doc" :class="tocLinks.length > 0 ? 'lg:col-span-9' : 'w-full'">
					<!-- Bento Card Header (Clean, No Spotlight) -->
					<header
						class="bento-card-clean relative overflow-hidden p-6 sm:p-8 md:p-9 mb-10 rounded-bento bg-white/90 dark:bg-[#002b27]/90 border border-slate-200/80 dark:border-[#134e43] shadow-sm"
					>
						<!-- Category & Tags Badge Row -->
						<div class="flex flex-wrap items-center gap-2 mb-3.5">
							<span
								v-if="post.doc.category"
								class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-100/80 dark:bg-brand-950 text-brand-800 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60 uppercase tracking-wider"
							>
								<span class="status-dot animate-pulse" />
								{{ post.doc.category }}
							</span>
							<span
								v-for="tag in post.doc.tags"
								:key="tag"
								class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
							>
								#{{ tag }}
							</span>
						</div>

						<!-- Title (Barlow, Bold, Responsive) -->
						<h1 class="font-heading font-extrabold text-slate-900 dark:text-white text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] leading-[1.18] tracking-tight">
							{{ post.doc.title }}
						</h1>

						<!-- Description Lead Text (Refined compact size) -->
						<p class="text-body text-slate-600 dark:text-slate-300 text-sm sm:text-[15px] mt-3.5 leading-relaxed max-w-3xl">
							{{ post.doc.description }}
						</p>

						<!-- Bento Metadata Footer Pills -->
						<div class="relative z-10 flex flex-wrap items-center justify-between gap-4 mt-8 pt-5 border-t border-slate-200/70 dark:border-slate-800/70 text-xs">
							<div class="flex flex-wrap items-center gap-2 sm:gap-3">
								<div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-[#042f27] border border-slate-200/60 dark:border-[#134e43] text-slate-700 dark:text-slate-200 font-medium">
									<span class="i-hugeicons-calendar-03 text-sm text-brand-700 dark:text-brand-400" />
									<span>{{ post.doc.date }}</span>
								</div>
								<div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-[#042f27] border border-slate-200/60 dark:border-[#134e43] text-slate-700 dark:text-slate-200 font-medium">
									<span class="i-hugeicons-clock-01 text-sm text-brand-700 dark:text-brand-400" />
									<span>{{ post.doc.readingTime || 5 }} min read</span>
								</div>
							</div>

							<div class="inline-flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium text-xs">
								<span class="w-6 h-6 rounded-full bg-brand-700 dark:bg-brand-500 text-white flex items-center justify-center font-heading font-bold text-[10px]">
									DP
								</span>
								<span>Dinar Permadi</span>
							</div>
						</div>
					</header>

					<!-- Prose Content -->
					<div class="prose prose-slate dark:prose-invert max-w-none font-sans text-slate-700 dark:text-slate-200 leading-relaxed">
						<ContentRenderer
							:value="post.doc"
							:components="mdcComponents"
						/>
					</div>

					<!-- Bento Social Share Card -->
					<ArticleShare
						:title="post.doc.title"
						:description="post.doc.description"
					/>

					<!-- Surround Articles Navigation (Bento Cards) -->
					<nav
						v-if="surround && (surround[0] || surround[1])"
						class="mt-10 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4"
						aria-label="Article Navigation"
					>
						<NuxtLink
							v-if="surround[0]"
							:to="`/${locale}/blog/${surround[0].slug || cleanSlug(surround[0].path)}`"
							class="bento-card-clean bento-lift flex flex-col justify-between group p-4 rounded-bento"
						>
							<span class="text-meta text-xs uppercase font-semibold flex items-center gap-1 text-slate-600 dark:text-slate-400 group-hover:text-brand-800 dark:group-hover:text-brand-400 transition-colors">
								<span class="i-hugeicons-arrow-left-01 text-xs" /> {{ locale === 'id' ? 'Artikel Sebelumnya' : 'Previous Article' }}
							</span>
							<strong class="font-heading font-semibold text-g1 text-slate-900 dark:text-white group-hover:text-brand-800 dark:group-hover:text-brand-300 transition-colors mt-2 block">
								{{ surround[0].title }}
							</strong>
						</NuxtLink>
						<div v-else class="hidden sm:block" />

						<NuxtLink
							v-if="surround[1]"
							:to="`/${locale}/blog/${surround[1].slug || cleanSlug(surround[1].path)}`"
							class="bento-card-clean bento-lift flex flex-col justify-between group p-4 rounded-bento text-right"
						>
							<span class="text-meta text-xs uppercase font-semibold flex items-center justify-end gap-1 text-slate-600 dark:text-slate-400 group-hover:text-brand-800 dark:group-hover:text-brand-400 transition-colors">
								{{ locale === 'id' ? 'Artikel Selanjutnya' : 'Next Article' }} <span class="i-hugeicons-arrow-right-01 text-xs" />
							</span>
							<strong class="font-heading font-semibold text-g1 text-slate-900 dark:text-white group-hover:text-brand-800 dark:group-hover:text-brand-300 transition-colors mt-2 block">
								{{ surround[1].title }}
							</strong>
						</NuxtLink>
					</nav>
				</article>

				<!-- Desktop Sticky TOC Aside (Span 3) -->
				<aside
					v-if="tocLinks.length > 0"
					:aria-label="locale === 'id' ? 'Daftar Isi Artikel' : 'Table of Contents'"
					class="hidden lg:block lg:col-span-3 sticky top-20 self-start"
				>
					<ContentToc
						:links="tocLinks"
						mode="desktop"
					/>
				</aside>
			</div>
		</div>
	</div>
</template>
