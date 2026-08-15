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
		title: computed(() => page.value?.title || (locale.value === 'id' ? 'Kontak — Dinar Permadi Yusup' : 'Contact — Dinar Permadi Yusup')),
		description: computed(() => page.value?.description || (locale.value === 'id' ? 'Hubungi Dinar Permadi Yusup untuk kolaborasi proyek, konsultasi arsitektur frontend, atau diskusi teknis.' : 'Contact Dinar Permadi Yusup for project collaboration, frontend architecture consulting, or technical discussions.')),
	})
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<header class="max-w-3xl mb-10">
			<span class="badge-neutral text-brand-600 dark:text-brand-400 font-semibold mb-3">
				<span class="i-hugeicons-mail-01 text-xs mr-1 inline-block" /> {{ locale === 'id' ? 'Kontak & Diskusi' : 'Contact & Discussion' }}
			</span>
			<h1 class="heading-hero text-slate-900 dark:text-white">
				{{ page?.title || (locale === 'id' ? 'Kontak & Kolaborasi' : 'Contact & Collaboration') }}
			</h1>
			<p class="text-body text-slate-600 dark:text-slate-300 mt-2 text-lg">
				{{ page?.description || (locale === 'id' ? 'Tertarik berdiskusi tentang proyek baru, konsultasi frontend, atau sekadar bertukar pikiran? Silakan hubungi saya.' : 'Interested in discussing new projects, frontend consulting, or just sharing thoughts? Feel free to reach out.') }}
			</p>
		</header>

		<!-- Bento Contact Grid -->
		<div class="bento-grid mb-12">
			<!-- Direct Email Bento -->
			<div class="bento-card-subtle bento-lift lg:col-span-6 flex flex-col justify-between">
				<div>
					<span class="text-meta text-xs uppercase font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1.5 mb-2">
						<span class="i-hugeicons-mail-01 text-xs" /> Direct Email
					</span>
					<h3 class="heading-card-md">hi@permadi.dev</h3>
					<p class="text-body text-sm mt-1.5">
						{{ locale === 'id' ? 'Respon dalam 1-2 hari kerja untuk peluang kolaborasi atau penawaran kerja sama.' : 'Response within 1-2 business days for collaboration or project inquiries.' }}
					</p>
				</div>
				<div class="mt-6">
					<a href="mailto:hi@permadi.dev" class="btn-primary">
						{{ locale === 'id' ? 'Kirim Email Sekarang' : 'Send Email Now' }} <span class="i-hugeicons-arrow-right-01 text-xs" />
					</a>
				</div>
			</div>

			<!-- Location & Status Bento -->
			<div class="bento-card-soft lg:col-span-6 flex flex-col justify-between">
				<div>
					<span class="text-meta text-xs uppercase font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
						<span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> {{ locale === 'id' ? 'Status Ketersediaan' : 'Availability Status' }}
					</span>
					<h3 class="heading-card-md">Open for Projects & Consulting</h3>
					<p class="text-body text-sm mt-1.5">
						{{ locale === 'id' ? 'Berbasis di Indonesia (GMT+7). Terbiasa bekerja secara remote dengan tim global.' : 'Based in Indonesia (UTC+7). Experienced in working remotely with global teams.' }}
					</p>
				</div>
				<div class="mt-6 flex items-center gap-2 text-meta text-xs">
					<span class="i-hugeicons-location-01 text-brand-500 text-sm" /> Indonesia (UTC+7)
				</div>
			</div>

			<!-- Social Channels Bento -->
			<div class="bento-card-outline lg:col-span-6">
				<h3 class="heading-card-md mb-2">{{ locale === 'id' ? 'Saluran Sosial & Portofolio' : 'Social Channels & Portfolio' }}</h3>
				<p class="text-meta text-xs mb-4">{{ locale === 'id' ? 'Temukan saya di platform berikut:' : 'Connect with me on these platforms:' }}</p>
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
			<div class="bento-card-subtle lg:col-span-6">
				<h3 class="heading-card-md">{{ locale === 'id' ? 'Berlangganan Newsletter' : 'Newsletter Subscription' }}</h3>
				<p class="text-meta text-xs mt-1">{{ locale === 'id' ? 'Dapatkan artikel dan pembaruan seputar web performance & design system.' : 'Get curated insights on web performance & design systems.' }}</p>
				<NewsletterForm />
			</div>
		</div>

		<article v-if="page" class="prose prose-slate dark:prose-invert max-w-3xl mt-8">
			<ContentRenderer :value="page" />
		</article>
	</div>
</template>
