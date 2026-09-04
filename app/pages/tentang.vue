<script setup lang="ts">
const { locale } = useI18n()
const collection = computed(() => (locale.value === 'id' ? 'tentang_id' : 'tentang_en'))

const { data: page } = await useAsyncData(
	() => `tentang-page-${locale.value}`,
	() => queryCollection(collection.value).first(),
	{ watch: [locale] },
)

useSeoMeta({
	title: () => page.value?.title || (locale.value === 'id' ? 'Tentang' : 'About'),
	description: () => page.value?.description,
	ogTitle: () => page.value?.title || (locale.value === 'id' ? 'Tentang' : 'About'),
	ogDescription: () => page.value?.description,
	twitterTitle: () => page.value?.title || (locale.value === 'id' ? 'Tentang' : 'About'),
	twitterDescription: () => page.value?.description,
	twitterCard: 'summary_large_image',
})

defineOgImage('Bento', {
	title: page.value?.title,
	description: page.value?.description,
})

useSchemaOrg([
	defineWebPage({
		'@type': 'ProfilePage',
		'mainEntity': definePerson({
			name: 'Dinar Permadi Yusup',
			alternateName: 'Permadi',
			jobTitle: 'Frontend Developer & Graphic Designer',
			url: 'https://permadi.dev',
			image: '/logo.png',
			sameAs: [
				'https://github.com/narr07',
				'https://x.com/dinarpermadi07',
				'https://www.behance.net/narr07',
				'https://www.instagram.com/narr07/',
			],
			worksFor: 'SDN Teja II',
		}),
	}),
])
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<!-- Page Header (Clean Bento Style without gradient) -->
		<header
			class="bento-card-clean relative z-10 mb-8 bg-slate-50/70 p-6 sm:mb-10 dark:bg-slate-900/60 sm:p-8"
		>
			<div class="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
				<!-- Sisi Kiri: Eyebrow + Judul + Deskripsi -->
				<div class="max-w-2xl">
					<div class="mb-3.5 flex items-center justify-between gap-3">
						<div class="inline-flex items-center border border-brand-200/60 rounded-xl bg-brand-100/70 px-3 py-1 text-xs text-brand-950 font-semibold dark:border-brand-800/60 dark:bg-brand-950 dark:text-brand-300">
							<span>{{ page?.section_label || (locale === 'id' ? 'Tentang Saya' : 'About Me') }}</span>
						</div>

						<!-- Logo Compact Badge di Mobile -->
						<div class="shadow-xs flex shrink-0 items-center justify-center border border-slate-200/70 rounded-xl bg-white p-1.5 md:hidden dark:border-slate-700/60 dark:bg-slate-800/80">
							<Logo :size="36" />
						</div>
					</div>

					<h1 class="heading-page">
						{{ page?.headline || page?.title || (locale === 'id' ? 'Selalu ingin tahu. Bertindak dengan penuh niat.' : 'Curious by default. Intentional by choice.') }}
					</h1>

					<p class="heading-page-sub">
						{{ page?.lead || page?.description || (locale === 'id' ? 'Fokus pada irisan antara desain antarmuka dan rekayasa perangkat lunak, mengubah interaksi bermakna menjadi produk yang bermanfaat.' : 'I care about the space between design and engineering, where a thoughtful interaction becomes a useful product.') }}
					</p>
				</div>

				<!-- Sisi Kanan: Interactive Logo Bento Widget (Desktop) -->
				<div class="hidden shrink-0 items-center justify-center md:flex">
					<div class="shadow-xs flex items-center justify-center border border-slate-200/70 rounded-2xl bg-white p-4 transition-colors duration-100 dark:border-slate-700/60 hover:border-brand-500 dark:bg-slate-800/80 dark:hover:border-brand-400">
						<Logo :size="84" />
					</div>
				</div>
			</div>
		</header>

		<!-- Bento About Grid -->
		<div class="grid grid-cols-1 mb-12 gap-4 md:grid-cols-12 sm:gap-5">
			<!-- Main Biography Card (Span 7) -->
			<div
				v-if="page?.story_card"
				class="bento-card-clean flex flex-col justify-between p-6 md:col-span-7 sm:p-8"
			>
				<div>
					<span
						v-if="page.story_card.label"
						class="section-label mb-3 block text-brand-700 dark:text-brand-400"
					>
						{{ page.story_card.label }}
					</span>
					<h2 class="mb-4 text-2xl text-slate-900 font-semibold leading-tight font-heading sm:text-3xl dark:text-white">
						{{ page.story_card.title }}
					</h2>
					<p
						v-if="page.story_card.lead"
						class="mb-4 text-sm text-slate-700 leading-relaxed sm:text-base dark:text-slate-300"
					>
						{{ page.story_card.lead }}
					</p>
					<p
						v-if="page.story_card.bio"
						class="text-xs text-slate-600 leading-relaxed sm:text-sm dark:text-slate-400"
					>
						{{ page.story_card.bio }}
					</p>
				</div>

				<div class="mt-8 flex items-center justify-between border-t border-slate-200/60 pt-4 text-xs text-brand-800 font-bold dark:border-slate-800/60 dark:text-brand-400">
					<NuxtLink
						:to="locale === 'id' ? '/id/projek' : '/en/projects'"
						class="group flex items-center gap-1.5 hover:text-brand-950 hover:underline"
					>
						{{ page.story_card.link_text || (locale === 'id' ? 'Eksplorasi Studi Kasus Projek' : 'Explore Project Case Studies') }}
						<span class="i-hugeicons-arrow-right-01 text-xs transition-transform group-hover:translate-x-0.5" />
					</NuxtLink>
				</div>
			</div>

			<!-- Toolkit & Tech Stack Card (Span 5) -->
			<div
				v-if="page?.toolkit_card"
				class="bento-card-clean flex flex-col justify-between p-6 md:col-span-5 sm:p-7"
			>
				<div>
					<span
						v-if="page.toolkit_card.label"
						class="section-label mb-3 block text-brand-700 dark:text-brand-400"
					>
						{{ page.toolkit_card.label }}
					</span>
					<h3 class="mb-4 text-xl text-slate-900 font-semibold font-heading sm:text-2xl dark:text-white">
						{{ page.toolkit_card.title }}
					</h3>
					<ul
						v-if="page.toolkit_card.tools && page.toolkit_card.tools.length > 0"
						class="space-y-3 divide-y divide-slate-200/50 dark:divide-slate-800/50"
					>
						<li
							v-for="t in page.toolkit_card.tools"
							:key="t.name"
							class="flex items-center justify-between pt-2.5 text-xs first:pt-0"
						>
							<span class="text-slate-900 font-semibold dark:text-white">{{ t.name }}</span>
							<span class="text-[11px] text-slate-600 font-mono dark:text-slate-400">{{ t.desc }}</span>
						</li>
					</ul>
				</div>
				<div class="mt-6 border-t border-slate-200/60 pt-3 text-xs text-slate-600 font-mono dark:border-slate-800/60 dark:text-slate-400">
					Nuxt 4 / UnoCSS / Cloudflare
				</div>
			</div>

			<!-- Location & Remote Work Card (Span 5 - Warm Sand) -->
			<div class="sand-card-clean flex flex-col justify-between p-6 md:col-span-5 sm:p-7">
				<div>
					<span class="mb-2 block text-xs text-slate-800 font-semibold tracking-wider font-mono uppercase">
						{{ locale === 'id' ? 'Lokasi & Zona Waktu' : 'Location & Timezone' }}
					</span>
					<h3 class="mb-2 text-2xl text-brand-950 font-semibold font-heading dark:text-brand-950">
						Majalengka, Indonesia
					</h3>
					<p class="text-xs text-slate-800 leading-relaxed sm:text-sm">
						{{ locale === 'id' ? 'Bekerja secara remote dan berkolaborasi dengan tim di berbagai belahan dunia.' : 'Working remotely and collaborating with teams across the globe.' }}
					</p>
				</div>
				<div class="mt-6 flex items-center justify-between border-t border-slate-900/10 pt-3 text-xs text-slate-800 font-mono">
					<span class="flex items-center gap-1">
						<span class="i-hugeicons-location-01 text-sm text-slate-900" /> GMT+7
					</span>
					<span>Available Globally</span>
				</div>
			</div>

			<!-- Digital Philosophy Card (Span 7) -->
			<div class="hero-card-clean flex flex-col justify-between p-6 md:col-span-7 sm:p-8">
				<div>
					<span class="mb-3 block text-xs text-brand-300 font-semibold tracking-widest uppercase">
						Core Principles
					</span>
					<h3 class="mb-3 text-2xl text-white font-semibold leading-tight font-heading sm:text-3xl">
						{{ locale === 'id' ? 'Kecepatan, Tipografi Presisi, dan Kode yang Bersih.' : 'Speed, Typographic Precision, and Maintainable Code.' }}
					</h3>
					<p class="max-w-lg text-xs text-slate-300 leading-relaxed sm:text-sm">
						{{ locale === 'id' ? 'Setiap baris kode dan elemen antarmuka dirancang dengan tujuan yang jelas: memberikan interaksi yang cepat, aksesibel, dan tahan lama.' : 'Every line of code and interface element is built with intention: delivering fast, accessible, and durable digital products.' }}
					</p>
				</div>
				<div class="mt-6 flex items-center justify-between border-t border-brand-900/60 pt-3 text-xs text-brand-300">
					<span>Crafted with Intention</span>
					<span>© {{ new Date().getFullYear() }}</span>
				</div>
			</div>
		</div>

		<!-- Markdown Content Renderer if any -->
		<article
			v-if="page"
			class="mt-8 max-w-3xl prose prose-slate dark:prose-invert"
		>
			<ContentRenderer :value="page" />
		</article>
	</div>
</template>
