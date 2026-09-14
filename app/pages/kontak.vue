<script setup lang="ts">
const { locale } = useI18n()
const collection = computed(() => (locale.value === 'id' ? 'kontak_id' : 'kontak_en'))

const { data: page } = await useAsyncData(
	() => `kontak-page-${locale.value}`,
	() => queryCollection(collection.value).first(),
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

useSchemaOrg([
	defineWebPage({
		'@type': 'ContactPage',
	}),
])
</script>

<template>
	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
		<!-- Page Header -->
		<header
			class="relative z-10 mb-8 border border-slate-200/80 bg-slate-50/70 p-6 sm:mb-10 dark:border-[#134e43] dark:bg-slate-900/60 sm:p-8"
		>
			<div class="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
				<!-- Sisi Kiri: Eyebrow + Judul + Deskripsi -->
				<div class="max-w-2xl">
					<div class="mb-3.5 flex items-center justify-between gap-3">
						<div class="inline-flex items-center border border-brand-200/60 bg-brand-100/70 px-3 py-1 text-xs text-brand-950 font-semibold dark:border-brand-800/60 dark:bg-brand-950 dark:text-brand-300">
							<span>{{ page?.section_label || (locale === 'id' ? 'Kontak & Kolaborasi' : 'Contact & Connect') }}</span>
						</div>

						<!-- Logo Compact Badge di Mobile -->
						<div class="flex shrink-0 items-center justify-center border border-slate-200/70 bg-white p-1.5 shadow-xs md:hidden dark:border-slate-700/60 dark:bg-slate-800/80">
							<Logo :size="36" />
						</div>
					</div>

					<h1 class="heading-page">
						{{ page?.headline || page?.title || (locale === 'id' ? 'Kontak & Kolaborasi' : 'Contact & Collaboration') }}
					</h1>

					<p class="heading-page-sub">
						{{ page?.lead || page?.description || (locale === 'id' ? 'Tertarik berdiskusi tentang proyek baru, konsultasi frontend, atau sekadar bertukar pikiran? Silakan hubungi saya.' : 'Interested in discussing new projects, frontend consulting, or just sharing thoughts? Feel free to reach out.') }}
					</p>
				</div>

				<!-- Sisi Kanan: Interactive Logo Widget (Desktop) -->
				<div class="hidden shrink-0 items-center justify-center md:flex">
					<div class="border border-brand-500/30 bg-white p-6 shadow-sm dark:border-brand-400/20 dark:bg-[#002b27]">
						<Logo size="64" />
					</div>
				</div>
			</div>
		</header>

		<!-- Contact Grid -->
		<div class="grid grid-cols-1 mb-12 gap-4 md:grid-cols-12 sm:gap-5">
			<!-- Direct Email Card -->
			<div
				v-if="page?.email_card"
				class="relative border border-[#134e43] bg-[#002b27] text-[#f8fafa] flex flex-col justify-between p-6 md:col-span-7 sm:p-8"
			>
				<div>
					<span class="mb-3 flex items-center gap-1.5 text-xs text-brand-300 font-semibold tracking-wide">
						<span class="i-ph-envelope-simple text-xs" /> {{ page.email_card.label || 'Direct Inquiries' }}
					</span>
					<h3 class="text-3xl text-white font-semibold tracking-tight font-heading sm:text-5xl">
						{{ page.email_card.email || 'dinar@permadi.dev' }}
					</h3>
					<p
						v-if="page.email_card.description"
						class="mt-3 max-w-md text-sm text-slate-300 leading-relaxed"
					>
						{{ page.email_card.description }}
					</p>
				</div>
				<div class="mt-8 flex items-center justify-between border-t border-brand-900/60 pt-4">
					<a
						:href="`mailto:${page.email_card.email || 'dinar@permadi.dev'}`"
						class="inline-flex items-center gap-1.5 bg-brand-400 px-5 py-2.5 text-xs text-slate-950 font-bold transition-all hover:bg-brand-300"
					>
						{{ page.email_card.button_text || (locale === 'id' ? 'Kirim Email Sekarang' : 'Send Email Now') }}
						<span class="i-ph-arrow-up-right text-xs" />
					</a>
					<span
						v-if="page.email_card.meta"
						class="text-xs text-brand-300/80"
					>
						{{ page.email_card.meta }}
					</span>
				</div>
			</div>

			<!-- Location & Status Card -->
			<div
				v-if="page?.status_card"
				class="relative border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#002b27] text-slate-900 dark:text-slate-50 flex flex-col justify-between p-6 md:col-span-5 sm:p-7"
			>
				<div>
					<span class="mb-3 flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200 font-semibold tracking-wide">
						<span class="inline-block h-2 w-2 rounded-none bg-emerald-600" />
						{{ page.status_card.label || (locale === 'id' ? 'Status Ketersediaan' : 'Availability Status') }}
					</span>
					<h3 class="text-2xl font-semibold leading-tight font-heading">
						{{ page.status_card.title || 'Open for Projects & Consulting' }}
					</h3>
					<p
						v-if="page.status_card.description"
						class="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed sm:text-sm"
					>
						{{ page.status_card.description }}
					</p>
				</div>
				<div class="mt-6 flex items-center justify-between border-t border-slate-200 dark:border-[#134e43] pt-3 text-xs text-slate-800 dark:text-slate-300 font-mono">
					<span
						v-if="page.status_card.location"
						class="flex items-center gap-1"
					>
						<span class="i-ph-map-pin text-sm" />
						{{ page.status_card.location }}
					</span>
					<span v-if="page.status_card.timezone">
						{{ page.status_card.timezone }}
					</span>
				</div>
			</div>

			<!-- Social Channels -->
			<div
				v-if="page?.social_card"
				class="border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#002b27] flex flex-col justify-between p-6 md:col-span-6 sm:p-7"
			>
				<div>
					<span
						v-if="page.social_card.label"
						class="mb-2 block section-label text-brand-700 dark:text-brand-400"
					>
						{{ page.social_card.label }}
					</span>
					<h3 class="text-2xl text-slate-900 font-semibold font-heading dark:text-white">
						{{ page.social_card.title || (locale === 'id' ? 'Temukan saya di platform digital' : 'Connect across the web') }}
					</h3>
					<p
						v-if="page.social_card.description"
						class="mb-5 mt-1 text-xs text-slate-700 leading-relaxed sm:text-sm dark:text-slate-300"
					>
						{{ page.social_card.description }}
					</p>
				</div>
				<div
					v-if="page.social_card.items && page.social_card.items.length > 0"
					class="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
				>
					<a
						v-for="item in page.social_card.items"
						:key="item.name"
						:href="item.url"
						target="_blank"
						rel="noopener"
						class="group block border border-slate-200/80 dark:border-[#134e43] bg-slate-50 p-3 text-center transition-all dark:bg-slate-800/60 hover:(bg-brand-50 text-brand-800) focus-ring dark:hover:(bg-brand-950/40 text-brand-400)"
					>
						<span
							:class="item.icon || 'i-ph-link-simple'"
							class="mx-auto mb-1 block text-xl"
						/>
						<span class="text-xs font-semibold">{{ item.name }}</span>
					</a>
				</div>
			</div>

			<!-- Newsletter -->
			<div
				v-if="page?.newsletter_card"
				class="border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#002b27] flex flex-col justify-between p-6 md:col-span-6 sm:p-7"
			>
				<div>
					<span
						v-if="page.newsletter_card.label"
						class="mb-2 block section-label text-brand-700 dark:text-brand-400"
					>
						{{ page.newsletter_card.label }}
					</span>
					<h3 class="text-2xl text-slate-900 font-semibold font-heading dark:text-white">
						{{ page.newsletter_card.title || (locale === 'id' ? 'Berlangganan Newsletter' : 'Newsletter Subscription') }}
					</h3>
					<p
						v-if="page.newsletter_card.description"
						class="mb-5 mt-1 text-xs text-slate-700 leading-relaxed sm:text-sm dark:text-slate-300"
					>
						{{ page.newsletter_card.description }}
					</p>
				</div>
				<NewsletterForm />
			</div>
		</div>

		<article
			v-if="page"
			class="mt-8 max-w-3xl prose prose-slate dark:prose-invert"
		>
			<ContentRenderer :value="page" />
		</article>
	</div>
</template>
