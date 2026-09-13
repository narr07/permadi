<script setup lang="ts">
	import { useEventListener } from '@vueuse/core'

	const { locale } = useI18n()
	const showGridOverlay = ref(false)

	useEventListener('keydown', (e: KeyboardEvent) => {
		if (e.key === 'g' || e.key === 'G') {
			const activeTag = document.activeElement?.tagName.toLowerCase()
			if (activeTag === 'input' || activeTag === 'textarea')
				return
			showGridOverlay.value = !showGridOverlay.value
		}
	})

	const blogCollection = computed(() => (locale.value === 'id' ? 'blog_id' : 'blog_en'))
	const projectCollection = computed(() => (locale.value === 'id' ? 'projek_id' : 'projek_en'))
	const pageCollection = computed(() => (locale.value === 'id' ? 'home_id' : 'home_en'))

	const { data: page } = await useAsyncData(
		() => `home-${locale.value}`,
		() => queryCollection(pageCollection.value).first(),
		{ watch: [locale] },
	)

	const { data: latestPosts } = await useAsyncData(
		() => `home-latest-posts-${locale.value}`,
		() => queryCollection(blogCollection.value).order('date', 'DESC').limit(4).all(),
		{ watch: [locale] },
	)

	const { data: latestProjects } = await useAsyncData(
		() => `home-latest-projects-${locale.value}`,
		() => queryCollection(projectCollection.value).order('date', 'DESC').limit(3).all(),
		{ watch: [locale] },
	)

	useSeoMeta({
		title: computed(() => page.value?.title),
		description: computed(() => page.value?.description),
		ogTitle: computed(() => page.value?.title),
		ogDescription: computed(() => page.value?.description),
	})

	defineOgImage('Bento', {
		title: page.value?.title,
		description: page.value?.description,
	})
</script>

<template>
	<!-- Swiss Modular Grid Inspection Overlay (Key 'G' Toggle) -->
	<div
		v-if="showGridOverlay"
		class="pointer-events-none fixed inset-0 z-50 overflow-hidden"
	>
		<div class="swiss-container h-full">
			<div class="grid grid-cols-12 gap-4 h-full sm:gap-6 opacity-15 dark:opacity-20">
				<div
					v-for="col in 12"
					:key="col"
					class="h-full border-x border-brand-500/50 bg-brand-500"
				/>
			</div>
		</div>
		<div class="pointer-events-auto fixed bottom-4 left-4 z-50 border border-brand-500 bg-slate-950 px-3 py-1.5 font-mono text-[11px] text-brand-400 font-bold uppercase tracking-widest shadow-lg">
			GRID OVERLAY: ACTIVE [PRESS 'G' TO CLOSE]
		</div>
	</div>

	<div class="w-full">
		<!-- Section 01: Asymmetric Hero & System Spec Rail -->
		<HomeSwissHero
			:hero="page?.hero"
			:eyebrow="page?.eyebrow"
			:headline="page?.headline"
			:description="page?.description"
		/>

		<!-- Section 02: Selected Case Studies Modular Triad -->
		<HomeSwissProjectsTriad
			:projects="latestProjects || []"
			:label="page?.project_section?.label"
			:fallback-title="page?.project_section?.fallback_title"
			:fallback-description="page?.project_section?.fallback_description"
			:all-link-text="page?.project_section?.all_link_text"
		/>

		<!-- Section 03 & 04: Philosophy Ethos & Dual Toolkit Matrix -->
		<HomeSwissPhilosophyToolkit
			:philosophy="page?.philosophy"
			:skills-data="page?.skills_section"
		/>

		<!-- Section 05: Archival Tabular Journal & Field Notes -->
		<HomeSwissJournalList
			:posts="latestPosts || []"
			:writing="page?.writing"
		/>

		<!-- Section 06: Contact Inquiries & Technical Colophon -->
		<HomeSwissContactColophon />
	</div>
</template>
