<script setup lang="ts">
	import ProseImg from '~/components/content/ProseImg.vue'
	import ProsePre from '~/components/content/ProsePre.vue'
	import ProseCode from '~/components/content/ProseCode.vue'

	const route = useRoute()
	const { locale, locales } = useI18n()
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

	const cleanPath = computed(() => {
		const path = route.path.replace(/\/+$/, '')
		return path === '' ? `/${locale.value}` : path
	})

	const pagesCollection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
	const blogCollection = computed(() => (locale.value === 'id' ? 'blog_id' : 'blog_en'))
	const projekCollection = computed(() => (locale.value === 'id' ? 'projek_id' : 'projek_en'))

	// Helper untuk membersihkan slug dari path
	function cleanSlug(pathStr: string): string {
		const parts = pathStr.split('/')
		const lastPart = parts[parts.length - 1] || ''
		return lastPart.replace(/^\d+\./, '')
	}

	// Peta terjemahan rute halaman utama (EN ↔ ID)
	const pageSlugMap: Record<string, { en: string; id: string }> = {
		about: { en: 'about', id: 'tentang' },
		tentang: { en: 'about', id: 'tentang' },
		contact: { en: 'contact', id: 'kontak' },
		kontak: { en: 'contact', id: 'kontak' },
		projects: { en: 'projects', id: 'projek' },
		projek: { en: 'projects', id: 'projek' },
		gallery: { en: 'gallery', id: 'galeri' },
		galeri: { en: 'gallery', id: 'galeri' },
		blog: { en: 'blog', id: 'blog' },
	}

	const { data: page } = await useAsyncData(
		() => 'content-' + cleanPath.value,
		async () => {
			const path = cleanPath.value

			// 1. Cek di collection pages utama (/en, /en/blog, /en/projects, /en/gallery, /en/about, /en/contact, /id/*)
			const mainPage = await queryCollection(pagesCollection.value).path(path).first()
			if (mainPage) {
				const parts = path.split('/').filter(Boolean)
				const pageSegment = parts[1] // misal: 'about', 'tentang', 'projects', 'projek', dsb.

				const translations: Record<string, { slug: string[] }> = {}
				for (const loc of locales.value) {
					const locCode = (typeof loc === 'string' ? loc : loc.code) as 'en' | 'id'
					if (pageSegment && pageSlugMap[pageSegment]) {
						translations[locCode] = {
							slug: [pageSlugMap[pageSegment][locCode] || pageSegment],
						}
					} else {
						translations[locCode] = {
							slug: pageSegment ? [pageSegment] : [],
						}
					}
				}

				return {
					doc: mainPage,
					type: 'page',
					translations,
				}
			}

			const parts = path.split('/').filter(Boolean)
			const section = parts[1]
			const requestedSlug = parts[2]

			// 2. Cek di collection blog
			if (section === 'blog') {
				const allPosts = await queryCollection(blogCollection.value).all()
				const matched = allPosts.find((p: any) => {
					return p.slug === requestedSlug || cleanSlug(p.path) === requestedSlug || p.path === path
				})

				if (matched) {
					// Cari padanan artikel di bahasa lain berdasarkan idBlog / idItem
					const translations: Record<string, { slug: string[] }> = {}

					for (const loc of locales.value) {
						const locCode = typeof loc === 'string' ? loc : loc.code
						const locCol = (locCode === 'id' ? 'blog_id' : 'blog_en') as any
						const locPosts = await queryCollection(locCol).all()
						const trDoc = locPosts.find((p: any) => p.idBlog === matched.idBlog || p.idItem === matched.idItem)
						if (trDoc) {
							translations[locCode] = {
								slug: ['blog', trDoc.slug || cleanSlug(trDoc.path)],
							}
						}
					}

					return {
						doc: matched,
						type: 'blog',
						translations,
					}
				}
			}

			// 3. Cek di collection projek / projects
			if (section === 'projek' || section === 'projects') {
				const allProjects = await queryCollection(projekCollection.value).all()
				const matched = allProjects.find((p: any) => {
					return p.slug === requestedSlug || cleanSlug(p.path) === requestedSlug || p.path === path
				})

				if (matched) {
					// Cari padanan projek di bahasa lain berdasarkan idProjek / idItem
					const translations: Record<string, { slug: string[] }> = {}

					for (const loc of locales.value) {
						const locCode = (typeof loc === 'string' ? loc : loc.code) as 'en' | 'id'
						const locCol = (locCode === 'id' ? 'projek_id' : 'projek_en') as any
						const locProjects = await queryCollection(locCol).all()
						const trDoc = locProjects.find((p: any) => p.idProjek === matched.idProjek || p.idItem === matched.idItem)
						if (trDoc) {
							const targetSection = locCode === 'id' ? 'projek' : 'projects'
							translations[locCode] = {
								slug: [targetSection, trDoc.slug || cleanSlug(trDoc.path)],
							}
						}
					}

					return {
						doc: matched,
						type: 'projek',
						translations,
					}
				}
			}

			return null
		},
		{
			watch: [cleanPath, locale],
		}
	)

	// Daftarkan dynamic params i18n switcher secara sinkron saat SSR
	if (page.value?.translations) {
		setI18nParams(page.value.translations)
	}

	watch(
		() => page.value?.translations,
		(newTranslations) => {
			if (newTranslations) {
				setI18nParams(newTranslations)
			}
		}
	)

	if (!page.value?.doc) {
		throw createError({
			statusCode: 404,
			statusMessage: locale.value === 'id' ? 'Halaman tidak ditemukan' : 'Page not found',
			fatal: false,
		})
	}

	useSeoMeta({
		title: computed(() => page.value?.doc?.title),
		description: computed(() => page.value?.doc?.description),
	})
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<article v-if="page?.doc" class="max-w-3xl mx-auto">
			<header class="mb-10 pb-8 border-b border-slate-200/80 dark:border-slate-800/80">
				<h1 class="heading-hero text-slate-900 dark:text-white text-3xl sm:text-4xl md:text-5xl leading-tight">
					{{ page.doc.title }}
				</h1>
				<p v-if="page.doc.description" class="text-body text-slate-600 dark:text-slate-300 text-lg mt-3 leading-relaxed">
					{{ page.doc.description }}
				</p>
			</header>

			<div class="prose prose-slate dark:prose-invert max-w-none font-sans text-slate-700 dark:text-slate-200 leading-relaxed">
				<ContentRenderer
					:value="page.doc"
					:components="mdcComponents"
				/>
			</div>
		</article>
	</div>
</template>
