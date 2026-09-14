<script setup lang="ts">
const { locale } = useI18n()
const localePath = useLocalePath()
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
			name: computed(() => page.value?.person_meta?.name || 'Dinar Permadi Yusup'),
			alternateName: computed(() => page.value?.person_meta?.alternateName || 'Permadi'),
			jobTitle: computed(() => page.value?.person_meta?.jobTitle || 'Frontend Developer & Graphic Designer'),
			url: computed(() => page.value?.person_meta?.url || 'https://permadi.dev'),
			image: computed(() => page.value?.person_meta?.image || '/logo.png'),
			sameAs: computed(() => page.value?.person_meta?.sameAs || [
				'https://github.com/narr07',
				'https://x.com/dinarpermadi07',
				'https://www.behance.net/narr07',
				'https://www.instagram.com/narr07/',
			]),
			worksFor: computed(() => page.value?.person_meta?.worksFor || 'SDN Teja II'),
		}),
	}),
])

function getToolIcon(name?: string) {
	const n = (name || '').toLowerCase()
	if (n.includes('nuxt') || n.includes('vue'))
		return 'i-swisspost-code'
	if (n.includes('flutter') || n.includes('dart') || n.includes('mobile'))
		return 'i-swisspost-desktop'
	if (n.includes('adobe') || n.includes('photo') || n.includes('design'))
		return 'i-swisspost-brush'
	if (n.includes('cloudflare') || n.includes('nitro') || n.includes('edge'))
		return 'i-swisspost-globecontinents'
	if (n.includes('unocss') || n.includes('tailwind'))
		return 'i-swisspost-icondesign'
	return 'i-swisspost-code'
}
</script>

<template>
	<div class="mx-auto max-w-6xl px-4 py-10 lg:px-8 sm:px-6 sm:py-14">
		<!-- Page Header -->
		<header
			class="relative z-10 mb-8 border border-slate-200/80 bg-slate-50/70 p-6 sm:mb-10 dark:border-[#134e43] dark:bg-slate-900/60 sm:p-8"
		>
			<div class="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
				<!-- Sisi Kiri: Eyebrow + Judul + Deskripsi -->
				<div class="max-w-2xl">
					<div class="mb-3.5 flex items-center justify-between gap-3">
						<div class="inline-flex items-center gap-1.5 border border-brand-200/60 bg-brand-100/70 px-3 py-1 text-xs text-brand-950 font-semibold dark:border-brand-800/60 dark:bg-brand-950 dark:text-brand-300">
							<span class="i-swisspost-userunknown text-xs" />
							<span>{{ page?.section_label || (locale === 'id' ? 'Tentang Saya' : 'About Me') }}</span>
						</div>

						<!-- Logo Compact Badge di Mobile -->
						<div class="flex shrink-0 items-center justify-center border border-slate-200/70 bg-white p-1.5 shadow-xs md:hidden dark:border-slate-700/60 dark:bg-slate-800/80">
							<StaticLogo :size="36" />
						</div>
					</div>

					<h1 class="heading-page">
						{{ page?.headline || page?.title || (locale === 'id' ? 'Menghitung dengan cermat. Merancang dengan penuh niat.' : 'Calculating with care. Designing with purpose.') }}
					</h1>

					<p class="heading-page-sub">
						{{ page?.lead || page?.description || (locale === 'id' ? 'Menjembatani ruang kelas sekolah dasar, ketelitian logika hitung, arsitektur perangkat lunak modern, dan disiplin tata letak visual.' : 'Bridging classroom pedagogy, numerical clarity, modern software architecture, and typographic discipline.') }}
					</p>
				</div>

				<!-- Sisi Kanan: Interactive Logo Widget (Desktop) -->
				<div class="hidden shrink-0 items-center justify-center md:flex">
					<div class="border border-brand-500/30 bg-white p-6 shadow-sm dark:border-brand-400/20 dark:bg-[#002b27]">
						<StaticLogo :size="64" />
					</div>
				</div>
			</div>
		</header>

		<!-- About Grid -->
		<div class="grid grid-cols-1 mb-12 gap-4 md:grid-cols-12 sm:gap-5">
			<!-- Main Biography Card (Span 7) -->
			<div
				v-if="page?.story_card"
				class="flex flex-col justify-between border border-slate-200/80 bg-white p-6 md:col-span-7 dark:border-[#134e43] dark:bg-[#002b27] sm:p-8"
			>
				<div>
					<span
						v-if="page.story_card.label"
						class="mb-3 block section-label text-brand-800 dark:text-brand-300"
					>
						{{ page.story_card.label }}
					</span>
					<h2 class="mb-4 text-2xl text-slate-900 font-900 leading-tight font-heading sm:text-3xl dark:text-white">
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
						:to="localePath(page.story_card.link_to || '/projek')"
						class="group flex items-center gap-1.5 hover:text-brand-950 hover:underline"
					>
						{{ page.story_card.link_text || (locale === 'id' ? 'Lihat Arsip Studi Kasus' : 'Explore Case Studies') }}
						<span class="i-swisspost-arrowright text-xs transition-transform group-hover:translate-x-0.5" />
					</NuxtLink>
				</div>
			</div>

			<!-- Toolkit & Tech Stack Card (Span 5) -->
			<div
				v-if="page?.toolkit_card"
				class="flex flex-col justify-between border border-slate-200/80 bg-white p-6 md:col-span-5 dark:border-[#134e43] dark:bg-[#002b27] sm:p-7"
			>
				<div>
					<span
						v-if="page.toolkit_card.label"
						class="mb-3 block section-label text-brand-800 dark:text-brand-300"
					>
						{{ page.toolkit_card.label }}
					</span>
					<h3 class="mb-4 text-xl text-slate-900 font-900 font-heading sm:text-2xl dark:text-white">
						{{ page.toolkit_card.title }}
					</h3>
					<ul
						v-if="page.toolkit_card.tools && page.toolkit_card.tools.length > 0"
						class="space-y-2.5 divide-y divide-slate-200/50 dark:divide-slate-800/50"
					>
						<li
							v-for="t in page.toolkit_card.tools"
							:key="t.name"
							class="group flex items-center justify-between px-1.5 py-1 text-xs transition-all duration-150 hover:bg-slate-50 first:pt-0 dark:hover:bg-slate-800/50"
						>
							<span class="flex items-center gap-1.5 text-slate-900 font-semibold transition-colors dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">
								<span
									:class="getToolIcon(t.name)"
									class="text-[11px] text-brand-600 dark:text-brand-400"
								/>
								{{ t.name }}
							</span>
							<span class="text-[11px] text-slate-600 font-mono dark:text-slate-400">{{ t.desc }}</span>
						</li>
					</ul>
				</div>
				<div class="mt-6 border-t border-slate-200/60 pt-3 text-xs text-slate-600 font-mono dark:border-slate-800/60 dark:text-slate-400">
					{{ page.toolkit_card.footer || 'Nuxt 4 / UnoCSS / Cloudflare' }}
				</div>
			</div>

			<!-- Location & Remote Work Card (Span 5) -->
			<div class="flex flex-col justify-between border border-slate-200/80 bg-white p-6 md:col-span-5 dark:border-[#134e43] dark:bg-[#002b27] sm:p-7">
				<div>
					<span class="mb-2 block section-label text-brand-800 dark:text-brand-300">
						{{ page?.location_card?.label || (locale === 'id' ? 'Lokasi & Zona Waktu' : 'Location & Timezone') }}
					</span>
					<h3 class="mb-2 flex items-center gap-1.5 text-2xl text-slate-900 font-900 font-heading dark:text-white">
						<span class="i-swisspost-locationpin shrink-0 text-xl text-brand-600 dark:text-brand-400" />
						<span>{{ page?.location_card?.title || 'Majalengka, Indonesia' }}</span>
					</h3>
					<p class="text-xs text-slate-700 leading-relaxed sm:text-sm dark:text-slate-300">
						{{ page?.location_card?.description || (locale === 'id' ? 'Bekerja secara remote dan berkolaborasi dengan tim di berbagai belahan dunia.' : 'Working remotely and collaborating with teams across the globe.') }}
					</p>
				</div>
				<div class="mt-6 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs text-slate-700 font-mono dark:border-slate-800/60 dark:text-slate-300">
					<span class="flex items-center gap-1.5 font-semibold">
						<span class="i-swisspost-globecontinents text-sm text-brand-600 dark:text-brand-400" />
						{{ page?.location_card?.timezone || 'GMT+7' }}
					</span>
					<span class="inline-flex items-center gap-1 border border-brand-200/60 bg-brand-50 px-2 py-0.5 text-[11px] text-brand-900 font-medium dark:border-brand-800/60 dark:bg-brand-950/60 dark:text-brand-300">
						{{ page?.location_card?.badge || 'Available Globally' }}
					</span>
				</div>
			</div>

			<!-- Digital Philosophy & Core Principles Card (Span 7) -->
			<div class="flex flex-col justify-between border border-[#134e43] bg-[#002b27] p-6 text-[#f8fafa] md:col-span-7 sm:p-8">
				<div>
					<span class="mb-3 flex items-center gap-1.5 text-xs text-brand-300 font-semibold tracking-widest uppercase">
						<span class="i-swisspost-checkmark text-xs" />
						{{ page?.principles_label || (locale === 'id' ? 'Prinsip Utama' : 'Core Principles') }}
					</span>
					<div
						v-if="page?.principles && page.principles.length > 0"
						class="space-y-3"
					>
						<div
							v-for="p in page.principles"
							:key="p.title"
							class="flex items-start gap-2.5 border-b border-brand-900/60 pb-3 last:border-b-0 last:pb-0"
						>
							<span class="i-swisspost-checkmark mt-1 shrink-0 text-xs text-brand-300" />
							<div>
								<h4 class="text-sm text-white font-900 font-heading sm:text-base">
									{{ p.title }}
								</h4>
								<p class="mt-1 text-xs text-slate-200 leading-relaxed">
									{{ p.description }}
								</p>
							</div>
						</div>
					</div>
					<div v-else>
						<h3 class="mb-3 text-2xl text-white font-900 leading-tight font-heading sm:text-3xl">
							{{ locale === 'id' ? 'Kecepatan, Tipografi Presisi, dan Kode yang Bersih.' : 'Speed, Typographic Precision, and Maintainable Code.' }}
						</h3>
						<p class="max-w-lg text-xs text-slate-200 leading-relaxed sm:text-sm">
							{{ locale === 'id' ? 'Setiap baris kode dan elemen antarmuka dirancang dengan tujuan yang jelas: memberikan interaksi yang cepat, aksesibel, dan tahan lama.' : 'Every line of code and interface element is built with intention: delivering fast, accessible, and durable digital products.' }}
						</p>
					</div>
				</div>
				<div class="mt-6 flex items-center justify-between border-t border-brand-900/60 pt-3 text-xs text-brand-300 font-mono">
					<span>{{ page?.principles_footer || 'Crafted with Intention' }}</span>
					<span>© {{ new Date().getFullYear() }}</span>
				</div>
			</div>

			<!-- Journey & Dedication Section (Span 12) -->
			<div
				v-if="page?.journey"
				class="flex flex-col items-start justify-between gap-6 border border-slate-200/80 bg-white p-6 md:col-span-12 md:flex-row dark:border-[#134e43] dark:bg-[#002b27] sm:p-8"
			>
				<div class="max-w-2xl">
					<span class="mb-2 block section-label text-brand-700 dark:text-brand-400">
						{{ page.journey.label || (locale === 'id' ? 'Latar Belakang & Perjalanan' : 'Background & Journey') }}
					</span>
					<h3 class="mb-3 text-2xl text-slate-900 font-900 leading-tight font-heading sm:text-3xl dark:text-white">
						{{ page.journey.title }}
					</h3>
					<p class="text-sm text-slate-700 leading-relaxed sm:text-base dark:text-slate-300">
						{{ page.journey.description }}
					</p>
				</div>
				<div class="flex shrink-0 items-center gap-3">
					<NuxtLink
						:to="localePath(page.journey.primary_link_to || '/projek')"
						class="btn-brand inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold shadow-xs transition-all duration-150 active:scale-95 hover:-translate-y-0.5"
					>
						{{ page.journey.primary_link_text || (locale === 'id' ? 'Buka Arsip Karya' : 'Explore Projects') }}
						<span class="i-swisspost-arrowright text-xs" />
					</NuxtLink>
					<NuxtLink
						:to="localePath(page.journey.secondary_link_to || '/kontak')"
						class="btn-ghost inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 hover:-translate-y-0.5"
					>
						<span class="i-swisspost-mail text-xs" />
						{{ page.journey.secondary_link_text || (locale === 'id' ? 'Mulai Percakapan' : 'Start a Conversation') }}
					</NuxtLink>
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
