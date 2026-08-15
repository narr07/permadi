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
		title: computed(() => page.value?.title || (locale.value === 'id' ? 'Kontak & Kolaborasi — Dinar Permadi Yusup' : 'Contact & Collaboration — Dinar Permadi Yusup')),
		description: computed(() => page.value?.description || (locale.value === 'id' ? 'Hubungi Dinar Permadi Yusup untuk peluang kolaborasi, proyek pengembangan web, atau konsultasi antarmuka.' : 'Get in touch with Dinar Permadi Yusup for collaboration opportunities, web engineering, or interface consulting.')),
	})
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<!-- Page Header -->
		<header class="max-w-3xl mb-8 sm:mb-12">
			<span class="section-label text-brand-600 dark:text-brand-400 font-bold mb-3 block">
				{{ locale === 'id' ? 'Mari Terhubung' : 'Get in Touch' }}
			</span>
			<h1 class="font-heading font-semibold text-slate-900 dark:text-white text-4xl sm:text-6xl leading-[0.95] tracking-tight mb-4">
				{{ page?.title || (locale === 'id' ? 'Kontak & Kolaborasi' : 'Contact & Collaboration') }}
			</h1>
			<p class="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
				{{ page?.description || (locale === 'id' ? 'Tertarik berdiskusi tentang proyek baru, konsultasi frontend, atau sekadar bertukar pikiran? Silakan hubungi saya.' : 'Interested in discussing new projects, frontend consulting, or just sharing thoughts? Feel free to reach out.') }}
			</p>
		</header>

		<!-- Bento Contact Grid -->
		<div class="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 mb-12">
			<!-- Direct Email Bento (Hero Card Clean) -->
			<div class="hero-card-clean md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
				<div>
					<span class="text-xs uppercase tracking-widest font-semibold text-brand-300 flex items-center gap-1.5 mb-3">
						<span class="i-hugeicons-mail-01 text-xs" /> Direct Inquiries
					</span>
					<h3 class="font-heading font-semibold text-3xl sm:text-5xl text-white tracking-tight">hi@permadi.dev</h3>
					<p class="text-slate-300 text-sm mt-3 leading-relaxed max-w-md">
						{{ locale === 'id' ? 'Respon dalam 1-2 hari kerja untuk peluang kolaborasi atau penawaran kerja sama.' : 'Response within 1-2 business days for collaboration or project inquiries.' }}
					</p>
				</div>
				<div class="mt-8 pt-4 border-t border-brand-900/60 flex items-center justify-between">
					<a href="mailto:hi@permadi.dev" class="px-5 py-2.5 rounded-full text-xs font-bold bg-brand-400 text-slate-950 hover:bg-brand-300 transition-all inline-flex items-center gap-1.5">
						{{ locale === 'id' ? 'Kirim Email Sekarang' : 'Send Email Now' }} <span>↗</span>
					</a>
					<span class="text-xs text-brand-300/80">Available Worldwide</span>
				</div>
			</div>

			<!-- Location & Status Bento -->
			<div class="sand-card-clean md:col-span-5 p-6 sm:p-7 flex flex-col justify-between">
				<div>
					<span class="text-xs uppercase tracking-wider font-mono text-slate-800 flex items-center gap-1.5 mb-3 font-semibold">
						<span class="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> {{ locale === 'id' ? 'Status Ketersediaan' : 'Availability Status' }}
					</span>
					<h3 class="font-heading font-semibold text-2xl text-slate-900 leading-tight">Open for Projects & Consulting</h3>
					<p class="text-slate-800 text-xs sm:text-sm mt-2 leading-relaxed">
						{{ locale === 'id' ? 'Berbasis di Bandung, Indonesia (GMT+7). Terbiasa bekerja secara remote dengan tim global.' : 'Based in Bandung, Indonesia (UTC+7). Experienced in working remotely with global teams.' }}
					</p>
				</div>
				<div class="mt-6 pt-3 border-t border-slate-900/10 flex items-center justify-between text-xs font-mono text-slate-800">
					<span class="flex items-center gap-1">
						<span class="i-hugeicons-location-01 text-sm text-slate-900" /> Bandung, ID
					</span>
					<span>GMT+7</span>
				</div>
			</div>

			<!-- Social Channels Bento -->
			<div class="bento-card-clean md:col-span-6 p-6 sm:p-7 flex flex-col justify-between">
				<div>
					<span class="section-label text-brand-600 dark:text-brand-400 block mb-2">
						{{ locale === 'id' ? 'Saluran Sosial' : 'Social Channels' }}
					</span>
					<h3 class="font-heading font-semibold text-2xl text-slate-900 dark:text-white">
						{{ locale === 'id' ? 'Temukan saya di platform digital' : 'Connect across the web' }}
					</h3>
					<p class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1 mb-5 leading-relaxed">
						{{ locale === 'id' ? 'Tautan portofolio, repositori kode sumber, dan aktivitas harian.' : 'Open source code repositories, design experiments, and visual captures.' }}
					</p>
				</div>
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
					<a href="https://github.com/narr07" target="_blank" rel="noopener" class="focus-ring p-3 rounded-bento bg-slate-50 dark:bg-slate-800/60 hover:(bg-brand-50 text-brand-600) dark:hover:(bg-brand-950/40 text-brand-400) transition-all text-center group block">
						<span class="i-hugeicons-github text-xl mx-auto block mb-1" />
						<span class="text-xs font-semibold">GitHub</span>
					</a>
					<a href="https://x.com/dinarpermadi07" target="_blank" rel="noopener" class="focus-ring p-3 rounded-bento bg-slate-50 dark:bg-slate-800/60 hover:(bg-brand-50 text-brand-600) dark:hover:(bg-brand-950/40 text-brand-400) transition-all text-center group block">
						<span class="i-hugeicons-new-twitter text-xl mx-auto block mb-1" />
						<span class="text-xs font-semibold">X / Twitter</span>
					</a>
					<a href="https://www.instagram.com/narr07/" target="_blank" rel="noopener" class="focus-ring p-3 rounded-bento bg-slate-50 dark:bg-slate-800/60 hover:(bg-brand-50 text-brand-600) dark:hover:(bg-brand-950/40 text-brand-400) transition-all text-center group block">
						<span class="i-hugeicons-instagram text-xl mx-auto block mb-1" />
						<span class="text-xs font-semibold">Instagram</span>
					</a>
					<a href="https://www.behance.net/narr07" target="_blank" rel="noopener" class="focus-ring p-3 rounded-bento bg-slate-50 dark:bg-slate-800/60 hover:(bg-brand-50 text-brand-600) dark:hover:(bg-brand-950/40 text-brand-400) transition-all text-center group block">
						<span class="i-hugeicons-behance-02 text-xl mx-auto block mb-1" />
						<span class="text-xs font-semibold">Behance</span>
					</a>
				</div>
			</div>

			<!-- Newsletter Bento -->
			<div class="bento-card-clean md:col-span-6 p-6 sm:p-7 flex flex-col justify-between">
				<div>
					<span class="section-label text-brand-600 dark:text-brand-400 block mb-2">
						Newsletter
					</span>
					<h3 class="font-heading font-semibold text-2xl text-slate-900 dark:text-white">
						{{ locale === 'id' ? 'Berlangganan Newsletter' : 'Newsletter Subscription' }}
					</h3>
					<p class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1 mb-5 leading-relaxed">
						{{ locale === 'id' ? 'Dapatkan artikel berkala seputar web performance, Vue/Nuxt, dan design system.' : 'Get curated insights on web performance, Vue/Nuxt engineering, and design systems.' }}
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
