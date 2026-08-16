<script setup lang="ts">
	const { locale } = useI18n()
	const collection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
	const currentPath = computed(() => (locale.value === 'id' ? '/id/tentang' : '/en/about'))

	const { data: page } = await useAsyncData(
		() => `tentang-page-${locale.value}`,
		() => queryCollection(collection.value).path(currentPath.value).first(),
		{ watch: [locale] }
	)

	function onHeaderMouseMove(e: MouseEvent) {
		const target = e.currentTarget as HTMLElement
		if (!target) return
		const rect = target.getBoundingClientRect()
		target.style.setProperty('--x', `${e.clientX - rect.left}px`)
		target.style.setProperty('--y', `${e.clientY - rect.top}px`)
	}

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
	<div class="container-bento py-10 sm:py-14">
		<!-- Page Header with Bento Spotlight Effect -->
		<header
			class="bento-card-clean bento-spotlight relative z-10 p-6 sm:p-8 mb-8 sm:mb-10 bg-slate-50/50 dark:bg-slate-900/40"
			@mousemove="onHeaderMouseMove"
		>
			<!-- Ambient Glow Subtle Background -->
			<div class="absolute inset-0 rounded-[20px] overflow-hidden pointer-events-none">
				<div class="absolute -right-16 -top-16 w-64 h-64 bg-brand-400/10 dark:bg-brand-400/5 rounded-full blur-3xl" />
			</div>

			<div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
				<!-- Sisi Kiri: Eyebrow + Judul + Deskripsi -->
				<div class="max-w-2xl">
					<div class="flex items-center justify-between gap-3 mb-3.5">
						<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-100/70 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
							<span class="status-dot animate-pulse" />
							<span>{{ page?.section_label || (locale === 'id' ? 'Tentang Saya' : 'About Me') }}</span>
						</div>

						<!-- Logo Compact Badge di Mobile -->
						<div class="md:hidden shrink-0 p-1.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 shadow-xs flex items-center justify-center">
							<Logo :size="36" />
						</div>
					</div>

					<h1 class="heading-page">
						{{ page?.headline || page?.title || (locale === 'id' ? 'Selalu ingin tahu. Bertindak dengan penuh niat.' : 'Curious by default. Intentional by choice.') }}
					</h1>

					<p class="heading-page-sub">
						{{ page?.lead || page?.description || (locale === 'id' ? 'Fokus pada irisan antara desain antarmuka dan rekayasa perangkat lunak — mengubah interaksi bermakna menjadi produk yang bermanfaat.' : 'I care about the space between design and engineering — where a thoughtful interaction becomes a useful product.') }}
					</p>
				</div>

				<!-- Sisi Kanan: Interactive Logo Bento Widget (Desktop) -->
				<div class="hidden md:flex shrink-0 items-center justify-center">
					<div class="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 shadow-xs flex items-center justify-center hover:border-brand-500 dark:hover:border-brand-400 transition-colors duration-100">
						<Logo :size="84" />
					</div>
				</div>
			</div>
		</header>

		<!-- Bento About Grid -->
		<div class="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 mb-12">
			<!-- Main Biography Card (Span 7) -->
			<div
				v-if="page?.story_card"
				class="bento-card-clean md:col-span-7 p-6 sm:p-8 flex flex-col justify-between"
			>
				<div>
					<span
						v-if="page.story_card.label"
						class="section-label text-brand-700 dark:text-brand-400 block mb-3"
					>
						{{ page.story_card.label }}
					</span>
					<h2 class="font-heading font-semibold text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight mb-4">
						{{ page.story_card.title }}
					</h2>
					<p
						v-if="page.story_card.lead"
						class="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-4"
					>
						{{ page.story_card.lead }}
					</p>
					<p
						v-if="page.story_card.bio"
						class="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed"
					>
						{{ page.story_card.bio }}
					</p>
				</div>

				<div class="mt-8 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-brand-800 dark:text-brand-400 font-bold">
					<NuxtLink
						:to="locale === 'id' ? '/id/projek' : '/en/projects'"
						class="hover:underline flex items-center gap-1 hover:text-brand-950"
					>
						{{ page.story_card.link_text || (locale === 'id' ? 'Eksplorasi Studi Kasus Projek' : 'Explore Project Case Studies') }}
						<span>↗</span>
					</NuxtLink>
				</div>
			</div>

			<!-- Toolkit & Tech Stack Card (Span 5) -->
			<div
				v-if="page?.toolkit_card"
				class="bento-card-clean md:col-span-5 p-6 sm:p-7 flex flex-col justify-between"
			>
				<div>
					<span
						v-if="page.toolkit_card.label"
						class="section-label text-brand-700 dark:text-brand-400 block mb-3"
					>
						{{ page.toolkit_card.label }}
					</span>
					<h3 class="font-heading font-semibold text-xl sm:text-2xl text-slate-900 dark:text-white mb-4">
						{{ page.toolkit_card.title }}
					</h3>
					<ul
						v-if="page.toolkit_card.tools && page.toolkit_card.tools.length > 0"
						class="space-y-3 divide-y divide-slate-200/50 dark:divide-slate-800/50"
					>
						<li
							v-for="t in page.toolkit_card.tools"
							:key="t.name"
							class="pt-2.5 first:pt-0 flex items-center justify-between text-xs"
						>
							<span class="font-semibold text-slate-900 dark:text-white">{{ t.name }}</span>
							<span class="text-slate-600 dark:text-slate-400 font-mono text-[11px]">{{ t.desc }}</span>
						</li>
					</ul>
				</div>
				<div class="mt-6 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400 font-mono">
					Nuxt 4 / UnoCSS / Cloudflare
				</div>
			</div>

			<!-- Location & Remote Work Card (Span 5 - Warm Sand) -->
			<div class="sand-card-clean md:col-span-5 p-6 sm:p-7 flex flex-col justify-between">
				<div>
					<span class="text-xs uppercase tracking-wider font-mono text-slate-800 block mb-2 font-semibold">
						{{ locale === 'id' ? 'Lokasi & Zona Waktu' : 'Location & Timezone' }}
					</span>
					<h3 class="font-heading font-semibold text-2xl text-slate-900 mb-2">
						Majalengka, Indonesia
					</h3>
					<p class="text-slate-800 text-xs sm:text-sm leading-relaxed">
						{{ locale === 'id' ? 'Bekerja secara remote dan berkolaborasi dengan tim di berbagai belahan dunia.' : 'Working remotely and collaborating with teams across the globe.' }}
					</p>
				</div>
				<div class="mt-6 pt-3 border-t border-slate-900/10 flex items-center justify-between text-xs font-mono text-slate-800">
					<span class="flex items-center gap-1">
						<span class="i-hugeicons-location-01 text-sm text-slate-900" /> GMT+7
					</span>
					<span>Available Globally</span>
				</div>
			</div>

			<!-- Digital Philosophy Card (Span 7) -->
			<div class="hero-card-clean md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
				<div>
					<span class="text-xs uppercase tracking-widest font-semibold text-brand-300 block mb-3">
						Core Principles
					</span>
					<h3 class="font-heading font-semibold text-2xl sm:text-3xl text-white leading-tight mb-3">
						{{ locale === 'id' ? 'Kecepatan, Tipografi Presisi, dan Kode yang Bersih.' : 'Speed, Typographic Precision, and Maintainable Code.' }}
					</h3>
					<p class="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg">
						{{ locale === 'id' ? 'Setiap baris kode dan elemen antarmuka dirancang dengan tujuan yang jelas: memberikan interaksi yang cepat, aksesibel, dan tahan lama.' : 'Every line of code and interface element is built with intention: delivering fast, accessible, and durable digital products.' }}
					</p>
				</div>
				<div class="mt-6 pt-3 border-t border-brand-900/60 flex items-center justify-between text-xs text-brand-300">
					<span>Crafted with Intention</span>
					<span>© {{ new Date().getFullYear() }}</span>
				</div>
			</div>
		</div>

		<!-- Markdown Content Renderer if any -->
		<article v-if="page" class="prose prose-slate dark:prose-invert max-w-3xl mt-8">
			<ContentRenderer :value="page" />
		</article>
	</div>
</template>
