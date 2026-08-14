<script setup lang="ts">
	const route = useRoute()
	const { locale, locales } = useI18n()
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
	<main class="page-container">
		<article v-if="post?.doc">
			<ContentRenderer :value="post.doc" />
		</article>

		<!-- Navigasi Artikel Sebelumnya & Selanjutnya (queryCollectionItemSurroundings) -->
		<nav
			v-if="surround"
			class="surround-nav"
			aria-label="Article Navigation"
		>
			<NuxtLink
				v-if="surround[0]"
				:to="`/${locale}/blog/${surround[0].slug || cleanSlug(surround[0].path)}`"
				class="surround-card prev"
			>
				<span class="surround-dir">← {{ locale === 'id' ? 'Artikel Sebelumnya' : 'Previous Article' }}</span>
				<strong class="surround-title">{{ surround[0].title }}</strong>
			</NuxtLink>
			<div
				v-else
				class="surround-empty"
			/>

			<NuxtLink
				v-if="surround[1]"
				:to="`/${locale}/blog/${surround[1].slug || cleanSlug(surround[1].path)}`"
				class="surround-card next"
			>
				<span class="surround-dir">{{ locale === 'id' ? 'Artikel Selanjutnya' : 'Next Article' }} →</span>
				<strong class="surround-title">{{ surround[1].title }}</strong>
			</NuxtLink>
		</nav>
	</main>
</template>

<style scoped>
	.page-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		line-height: 1.6;
	}

	.surround-nav {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1rem;
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid #e4e4e7;
	}

	.surround-card {
		display: flex;
		flex-direction: column;
		padding: 1rem 1.25rem;
		border: 1px solid #e4e4e7;
		border-radius: 8px;
		text-decoration: none;
		color: inherit;
		background: #fafafa;
		transition: all 0.2s ease;
	}

	.surround-card:hover {
		border-color: #18181b;
		background: #ffffff;
		transform: translateY(-2px);
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
	}

	.surround-card.next {
		text-align: right;
	}

	.surround-dir {
		font-size: 0.75rem;
		color: #71717a;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 0.35rem;
	}

	.surround-title {
		font-size: 0.95rem;
		color: #18181b;
		line-height: 1.4;
	}

	.surround-empty {
		display: none;
	}

	@media (min-width: 600px) {
		.surround-empty {
			display: block;
		}
	}
</style>
