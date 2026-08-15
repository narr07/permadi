<script setup lang="ts">
	const { locale } = useI18n()
	const collection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
	const currentPath = computed(() => (locale.value === 'id' ? '/id/galeri' : '/en/gallery'))

	const { data: page } = await useAsyncData(
		() => 'galeri-page-id',
		() => queryCollection('pages_id').path('/id/galeri').first()
	)

	const { data: galleryItems } = await useAsyncData(
		() => 'galeri-items-list-id',
		() => queryCollection('galeri').order('order', 'ASC').all()
	)

	useSeoMeta({
		title: computed(() => page.value?.title || 'Galeri — Dinar Permadi Yusup'),
		description: computed(() => page.value?.description || 'Dokumentasi visual, fotografi, dan eksplorasi antarmuka digital.'),
	})
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<!-- Header -->
		<header class="max-w-3xl mb-10">
			<span class="badge-neutral text-brand-600 dark:text-brand-400 font-semibold mb-3">
				<span class="i-lucide-camera text-xs mr-1 inline-block" /> Snapshot & Dokumentasi
			</span>
			<h1 class="heading-hero text-slate-900 dark:text-white">
				{{ page?.title || 'Galeri Visual' }}
			</h1>
			<p class="text-body text-slate-600 dark:text-slate-300 mt-2 text-lg">
				{{ page?.description || 'Kumpulan snapshot, dokumentasi workspace, dan eksplorasi visual.' }}
			</p>
		</header>

		<!-- Bento Grid Gallery -->
		<div v-if="galleryItems?.length" class="bento-grid">
			<div
				v-for="(item, i) in galleryItems"
				:key="item.image || i"
				class="bento-card-outline bento-lift overflow-hidden p-3 group relative"
				:class="i % 3 === 0 ? 'lg:col-span-6 md:col-span-6 lg:row-span-2' : 'lg:col-span-3 md:col-span-6 lg:row-span-1'"
			>
				<div class="w-full h-full rounded-bento overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
					<img
						:src="item.image"
						:alt="item.title || 'Foto galeri'"
						class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
						:class="item.aspectRatio || (i % 2 === 0 ? 'aspect-photo' : 'aspect-profile')"
						loading="lazy"
					>
					<div class="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
						<h3 class="font-heading font-semibold text-g1 text-white">
							{{ item.title }}
						</h3>
						<p v-if="item.description" class="text-meta text-slate-200 text-xs mt-1">
							{{ item.description }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Page Content Markdown if any -->
		<article v-if="page" class="prose prose-slate dark:prose-invert max-w-3xl mt-12">
			<ContentRenderer :value="page" />
		</article>
	</div>
</template>
