<script setup lang="ts">
	const { locale } = useI18n()
	const collection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
	const currentPath = computed(() => (locale.value === 'id' ? '/id/kontak' : '/en/contact'))

	const { data: page } = await useAsyncData(
		() => `kontak-page-${locale.value}`,
		() => queryCollection(collection.value).path(currentPath.value).first(),
		{ watch: [locale] }
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
	<div class="container-bento py-10 sm:py-14">
		<!-- Page Header -->
		<header class="max-w-3xl mb-8 sm:mb-12">
			<span
				v-if="page?.section_label"
				class="section-label text-brand-600 dark:text-brand-400 font-bold mb-3 block"
			>
				{{ page.section_label }}
			</span>
			<h1 class="font-heading font-semibold text-slate-900 dark:text-white text-4xl sm:text-6xl leading-[0.95] tracking-tight mb-4">
				{{ page?.headline || page?.title || (locale === 'id' ? 'Kontak & Kolaborasi' : 'Contact & Collaboration') }}
			</h1>
			<p class="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
				{{ page?.lead || page?.description || (locale === 'id' ? 'Tertarik berdiskusi tentang proyek baru, konsultasi frontend, atau sekadar bertukar pikiran? Silakan hubungi saya.' : 'Interested in discussing new projects, frontend consulting, or just sharing thoughts? Feel free to reach out.') }}
			</p>
		</header>

		<!-- Bento Contact Grid -->
		<div class="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 mb-12">
			<!-- Direct Email Bento (Hero Card Clean) -->
			<div
				v-if="page?.email_card"
				class="hero-card-clean md:col-span-7 p-6 sm:p-8 flex flex-col justify-between"
			>
				<div>
					<span class="text-xs uppercase tracking-widest font-semibold text-brand-300 flex items-center gap-1.5 mb-3">
						<span class="i-hugeicons-mail-01 text-xs" /> {{ page.email_card.label || 'Direct Inquiries' }}
					</span>
					<h3 class="font-heading font-semibold text-3xl sm:text-5xl text-white tracking-tight">
						{{ page.email_card.email || 'hi@permadi.dev' }}
					</h3>
					<p
						v-if="page.email_card.description"
						class="text-slate-300 text-sm mt-3 leading-relaxed max-w-md"
					>
						{{ page.email_card.description }}
					</p>
				</div>
				<div class="mt-8 pt-4 border-t border-brand-900/60 flex items-center justify-between">
					<a
						:href="`mailto:${page.email_card.email || 'hi@permadi.dev'}`"
						class="px-5 py-2.5 rounded-full text-xs font-bold bg-brand-400 text-slate-950 hover:bg-brand-300 transition-all inline-flex items-center gap-1.5"
					>
						{{ page.email_card.button_text || (locale === 'id' ? 'Kirim Email Sekarang' : 'Send Email Now') }}
						<span>↗</span>
					</a>
					<span
						v-if="page.email_card.meta"
						class="text-xs text-brand-300/80"
					>
						{{ page.email_card.meta }}
					</span>
				</div>
			</div>

			<!-- Location & Status Bento -->
			<div
				v-if="page?.status_card"
				class="sand-card-clean md:col-span-5 p-6 sm:p-7 flex flex-col justify-between"
			>
				<div>
					<span class="text-xs uppercase tracking-wider font-mono text-slate-800 flex items-center gap-1.5 mb-3 font-semibold">
						<span class="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
						{{ page.status_card.label || (locale === 'id' ? 'Status Ketersediaan' : 'Availability Status') }}
					</span>
					<h3 class="font-heading font-semibold text-2xl text-slate-900 leading-tight">
						{{ page.status_card.title || 'Open for Projects & Consulting' }}
					</h3>
					<p
						v-if="page.status_card.description"
						class="text-slate-800 text-xs sm:text-sm mt-2 leading-relaxed"
					>
						{{ page.status_card.description }}
					</p>
				</div>
				<div class="mt-6 pt-3 border-t border-slate-900/10 flex items-center justify-between text-xs font-mono text-slate-800">
					<span
						v-if="page.status_card.location"
						class="flex items-center gap-1"
					>
						<span class="i-hugeicons-location-01 text-sm text-slate-900" />
						{{ page.status_card.location }}
					</span>
					<span v-if="page.status_card.timezone">
						{{ page.status_card.timezone }}
					</span>
				</div>
			</div>

			<!-- Social Channels Bento -->
			<div
				v-if="page?.social_card"
				class="bento-card-clean md:col-span-6 p-6 sm:p-7 flex flex-col justify-between"
			>
				<div>
					<span
						v-if="page.social_card.label"
						class="section-label text-brand-600 dark:text-brand-400 block mb-2"
					>
						{{ page.social_card.label }}
					</span>
					<h3 class="font-heading font-semibold text-2xl text-slate-900 dark:text-white">
						{{ page.social_card.title || (locale === 'id' ? 'Temukan saya di platform digital' : 'Connect across the web') }}
					</h3>
					<p
						v-if="page.social_card.description"
						class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1 mb-5 leading-relaxed"
					>
						{{ page.social_card.description }}
					</p>
				</div>
				<div
					v-if="page.social_card.items && page.social_card.items.length > 0"
					class="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
				>
					<a
						v-for="item in page.social_card.items"
						:key="item.name"
						:href="item.url"
						target="_blank"
						rel="noopener"
						class="focus-ring p-3 rounded-bento bg-slate-50 dark:bg-slate-800/60 hover:(bg-brand-50 text-brand-600) dark:hover:(bg-brand-950/40 text-brand-400) transition-all text-center group block"
					>
						<span
							:class="item.icon || 'i-hugeicons-link-01'"
							class="text-xl mx-auto block mb-1"
						/>
						<span class="text-xs font-semibold">{{ item.name }}</span>
					</a>
				</div>
			</div>

			<!-- Newsletter Bento -->
			<div
				v-if="page?.newsletter_card"
				class="bento-card-clean md:col-span-6 p-6 sm:p-7 flex flex-col justify-between"
			>
				<div>
					<span
						v-if="page.newsletter_card.label"
						class="section-label text-brand-600 dark:text-brand-400 block mb-2"
					>
						{{ page.newsletter_card.label }}
					</span>
					<h3 class="font-heading font-semibold text-2xl text-slate-900 dark:text-white">
						{{ page.newsletter_card.title || (locale === 'id' ? 'Berlangganan Newsletter' : 'Newsletter Subscription') }}
					</h3>
					<p
						v-if="page.newsletter_card.description"
						class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1 mb-5 leading-relaxed"
					>
						{{ page.newsletter_card.description }}
					</p>
				</div>
				<NewsletterForm />
			</div>
		</div>

		<article v-if="page" class="prose prose-slate dark:prose-invert max-w-3xl mt-8">
			<ContentRenderer :value="page" />
		</article>
	</div>
</template>
