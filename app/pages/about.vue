<script setup lang="ts">
	const { locale } = useI18n()
	const collection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
	const currentPath = computed(() => (locale.value === 'id' ? '/id/tentang' : '/en/about'))

	const { data: page } = await useAsyncData(
		() => 'about-page-' + locale.value,
		() => queryCollection(collection.value).path(currentPath.value).first(),
		{ watch: [locale] }
	)

	useSeoMeta({
		title: computed(() => page.value?.title || 'About — Dinar Permadi Yusup'),
		description: computed(() => page.value?.description || 'Profil, filosofi rekayasa antarmuka, dan latar belakang profesional Dinar Permadi Yusup.'),
	})
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<article v-if="page" class="max-w-3xl mx-auto">
			<header class="mb-10 pb-8 border-b border-slate-200/80 dark:border-slate-800/80">
				<span class="badge-neutral text-brand-600 dark:text-brand-400 font-semibold mb-3">
					<span class="i-lucide-user text-xs mr-1 inline-block" /> Profile & Background
				</span>
				<h1 class="heading-hero text-slate-900 dark:text-white text-3xl sm:text-4xl md:text-5xl leading-tight">
					{{ page.title }}
				</h1>
				<p class="text-body text-slate-600 dark:text-slate-300 text-lg mt-3 leading-relaxed">
					{{ page.description }}
				</p>
			</header>

			<div class="prose prose-slate dark:prose-invert max-w-none font-sans text-slate-700 dark:text-slate-200 leading-relaxed">
				<ContentRenderer :value="page" />
			</div>
		</article>
	</div>
</template>
