<script setup lang="ts">
	const route = useRoute()
	const { locale, locales } = useI18n()
	const localePath = useLocalePath()
	const setI18nParams = useSetI18nParams()

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

	useSeoMeta({
		title: computed(() => post.value?.doc?.title),
		description: computed(() => post.value?.doc?.description),
	})
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<!-- Back Button -->
		<NuxtLink
			:to="localePath('/blog')"
			class="focus-ring inline-flex items-center gap-1.5 text-meta text-xs font-semibold hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-8"
		>
			<span class="i-lucide-arrow-left text-sm" /> {{ locale === 'id' ? 'Kembali ke Blog' : 'Back to Blog' }}
		</NuxtLink>

		<!-- Article Container -->
		<article v-if="post?.doc" class="max-w-3xl mx-auto">
			<!-- Header -->
			<header class="mb-10 pb-8 border-b border-slate-200/80 dark:border-slate-800/80">
				<div class="flex flex-wrap items-center gap-2 mb-4">
					<span v-for="tag in post.doc.tags" :key="tag" class="badge-neutral text-xs">
						#{{ tag }}
					</span>
				</div>
				<h1 class="heading-hero text-slate-900 dark:text-white text-3xl sm:text-4xl md:text-5xl leading-tight">
					{{ post.doc.title }}
				</h1>
				<p class="text-body text-slate-600 dark:text-slate-300 text-lg mt-4 leading-relaxed">
					{{ post.doc.description }}
				</p>
				<div class="flex items-center gap-4 text-meta text-xs mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
					<span class="flex items-center gap-1.5 font-medium">
						<span class="i-lucide-calendar text-sm text-brand-500" />
						{{ post.doc.date }}
					</span>
					<span>•</span>
					<span class="flex items-center gap-1.5 font-medium">
						<span class="i-lucide-clock text-sm text-brand-500" />
						{{ post.doc.readingTime || 5 }} min read
					</span>
				</div>
			</header>

			<!-- Prose Content -->
			<div class="prose prose-slate dark:prose-invert max-w-none font-sans text-slate-700 dark:text-slate-200 leading-relaxed">
				<ContentRenderer :value="post.doc" />
			</div>
		</article>

		<!-- Surround Articles Navigation (Bento Cards) -->
		<nav
			v-if="surround && (surround[0] || surround[1])"
			class="max-w-3xl mx-auto mt-14 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4"
			aria-label="Article Navigation"
		>
			<NuxtLink
				v-if="surround[0]"
				:to="`/${locale}/blog/${surround[0].slug || cleanSlug(surround[0].path)}`"
				class="bento-card-outline bento-lift flex flex-col justify-between group p-4 rounded-bento"
			>
				<span class="text-meta text-xs uppercase font-semibold flex items-center gap-1 text-slate-400 group-hover:text-brand-500 transition-colors">
					<span class="i-lucide-arrow-left text-xs" /> {{ locale === 'id' ? 'Artikel Sebelumnya' : 'Previous Article' }}
				</span>
				<strong class="font-heading font-semibold text-g1 text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mt-2 block">
					{{ surround[0].title }}
				</strong>
			</NuxtLink>
			<div v-else class="hidden sm:block" />

			<NuxtLink
				v-if="surround[1]"
				:to="`/${locale}/blog/${surround[1].slug || cleanSlug(surround[1].path)}`"
				class="bento-card-outline bento-lift flex flex-col justify-between group p-4 rounded-bento text-right"
			>
				<span class="text-meta text-xs uppercase font-semibold flex items-center justify-end gap-1 text-slate-400 group-hover:text-brand-500 transition-colors">
					{{ locale === 'id' ? 'Artikel Selanjutnya' : 'Next Article' }} <span class="i-lucide-arrow-right text-xs" />
				</span>
				<strong class="font-heading font-semibold text-g1 text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mt-2 block">
					{{ surround[1].title }}
				</strong>
			</NuxtLink>
		</nav>
	</div>
</template>
