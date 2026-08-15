<script setup lang="ts">
	const { locale } = useI18n()
	const collection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
	const currentPath = computed(() => (locale.value === 'id' ? '/id/tentang' : '/en/about'))

	const { data: page } = await useAsyncData(
		() => `tentang-page-${locale.value}`,
		() => queryCollection(collection.value).path(currentPath.value).first(),
		{ watch: [locale] }
	)

	useSeoMeta({
		title: computed(() => page.value?.title || (locale.value === 'id' ? 'Tentang — Dinar Permadi Yusup' : 'About — Dinar Permadi Yusup')),
		description: computed(() => page.value?.description || (locale.value === 'id' ? 'Profil, filosofi rekayasa antarmuka, dan latar belakang profesional Dinar Permadi Yusup.' : 'Profile, interface engineering philosophy, and professional background of Dinar Permadi Yusup.')),
	})
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<!-- Page Intro Header -->
		<div class="max-w-3xl mb-10 sm:mb-12">
			<span
				v-if="page?.section_label"
				class="section-label text-brand-600 dark:text-brand-400 font-bold mb-3 block"
			>
				{{ page.section_label }}
			</span>
			<h1 class="font-heading font-semibold text-slate-900 dark:text-white text-4xl sm:text-6xl leading-[0.95] tracking-tight mb-4">
				{{ page?.headline || (locale === 'id' ? 'Selalu ingin tahu. Bertindak dengan penuh niat.' : 'Curious by default. Intentional by choice.') }}
			</h1>
			<p class="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
				{{ page?.lead || page?.description || (locale === 'id' ? 'Fokus pada irisan antara desain antarmuka dan rekayasa perangkat lunak — mengubah interaksi bermakna menjadi produk yang bermanfaat.' : 'I care about the space between design and engineering — where a thoughtful interaction becomes a useful product.') }}
			</p>
		</div>

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
						class="section-label text-brand-600 dark:text-brand-400 block mb-3"
					>
						{{ page.story_card.label }}
					</span>
					<h2 class="font-heading font-semibold text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight mb-4">
						{{ page.story_card.title }}
					</h2>
					<p
						v-if="page.story_card.lead"
						class="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-4"
					>
						{{ page.story_card.lead }}
					</p>
					<p
						v-if="page.story_card.bio"
						class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed"
					>
						{{ page.story_card.bio }}
					</p>
				</div>

				<div class="mt-8 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-brand-600 dark:text-brand-400 font-bold">
					<NuxtLink
						:to="locale === 'id' ? '/id/projek' : '/en/projects'"
						class="hover:underline flex items-center gap-1"
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
						class="section-label text-brand-600 dark:text-brand-400 block mb-3"
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
							<span class="text-slate-400 font-mono text-[11px]">{{ t.desc }}</span>
						</li>
					</ul>
				</div>
				<div class="mt-6 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-400 font-mono">
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
						Bandung, Indonesia
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
