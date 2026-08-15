<script setup lang="ts">
	const { locale } = useI18n()
	const collection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
	const currentPath = computed(() => (locale.value === 'id' ? '/id/kontak' : '/en/contact'))

	const { data: page } = await useAsyncData(
		() => 'contact-page-' + locale.value,
		() => queryCollection(collection.value).path(currentPath.value).first(),
		{ watch: [locale] }
	)

	useSeoMeta({
		title: computed(() => page.value?.title || 'Contact — Dinar Permadi Yusup'),
		description: computed(() => page.value?.description || 'Hubungi Dinar Permadi Yusup untuk kolaborasi proyek, konsultasi arsitektur frontend, atau diskusi teknis.'),
	})
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<header class="max-w-3xl mb-10">
			<span class="badge-neutral text-brand-600 dark:text-brand-400 font-semibold mb-3">
				<span class="i-lucide-message-square text-xs mr-1 inline-block" /> Get In Touch
			</span>
			<h1 class="heading-hero text-slate-900 dark:text-white">
				{{ page?.title || 'Kontak & Kolaborasi' }}
			</h1>
			<p class="text-body text-slate-600 dark:text-slate-300 mt-2 text-lg">
				{{ page?.description || 'Tertarik berdiskusi tentang proyek baru, konsultasi frontend, atau sekadar bertukar pikiran? Silakan hubungi saya.' }}
			</p>
		</header>

		<!-- Bento Contact Grid -->
		<div class="bento-grid mb-12">
			<!-- Direct Email Bento -->
			<div class="bento-card-subtle bento-lift lg:col-span-6 flex flex-col justify-between">
				<div>
					<span class="text-meta text-xs uppercase font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1.5 mb-2">
						<span class="i-lucide-mail text-xs" /> Direct Email
					</span>
					<h3 class="heading-card-md">hi@permadi.dev</h3>
					<p class="text-body text-sm mt-1.5">
						Respon dalam 1-2 hari kerja untuk peluang kolaborasi atau penawaran kerja sama.
					</p>
				</div>
				<div class="mt-6">
					<a href="mailto:hi@permadi.dev" class="btn-primary">
						Kirim Email Sekarang <span class="i-lucide-arrow-right text-xs" />
					</a>
				</div>
			</div>

			<!-- Location & Status Bento -->
			<div class="bento-card-soft lg:col-span-6 flex flex-col justify-between">
				<div>
					<span class="text-meta text-xs uppercase font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
						<span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> Status Ketersediaan
					</span>
					<h3 class="heading-card-md">Open for Projects & Consulting</h3>
					<p class="text-body text-sm mt-1.5">
						Berbasis di Jakarta, Indonesia (GMT+7). Terbiasa bekerja secara remote dengan tim global.
					</p>
				</div>
				<div class="mt-6 flex items-center gap-2 text-meta text-xs">
					<span class="i-carbon-location text-brand-500 text-sm" /> Jakarta, Indonesia (UTC+7)
				</div>
			</div>

			<!-- Social Channels Bento -->
			<div class="bento-card-outline lg:col-span-6">
				<h3 class="heading-card-md mb-2">Saluran Sosial & Portofolio</h3>
				<p class="text-meta text-xs mb-4">Temukan saya di platform berikut:</p>
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
					<a href="https://github.com/narr07" target="_blank" rel="noopener" class="focus-ring p-3 rounded-bento bg-slate-50 dark:bg-slate-800/60 hover:(bg-brand-50 text-brand-600) dark:hover:(bg-brand-950/40 text-brand-400) transition-all text-center group block">
						<span class="i-simple-icons-github text-xl mx-auto block mb-1" />
						<span class="text-xs font-semibold">GitHub</span>
					</a>
					<a href="https://x.com/dinarpermadi07" target="_blank" rel="noopener" class="focus-ring p-3 rounded-bento bg-slate-50 dark:bg-slate-800/60 hover:(bg-brand-50 text-brand-600) dark:hover:(bg-brand-950/40 text-brand-400) transition-all text-center group block">
						<span class="i-simple-icons-x text-xl mx-auto block mb-1" />
						<span class="text-xs font-semibold">X / Twitter</span>
					</a>
					<a href="https://www.instagram.com/narr07/" target="_blank" rel="noopener" class="focus-ring p-3 rounded-bento bg-slate-50 dark:bg-slate-800/60 hover:(bg-brand-50 text-brand-600) dark:hover:(bg-brand-950/40 text-brand-400) transition-all text-center group block">
						<span class="i-simple-icons-instagram text-xl mx-auto block mb-1" />
						<span class="text-xs font-semibold">Instagram</span>
					</a>
					<a href="https://www.behance.net/narr07" target="_blank" rel="noopener" class="focus-ring p-3 rounded-bento bg-slate-50 dark:bg-slate-800/60 hover:(bg-brand-50 text-brand-600) dark:hover:(bg-brand-950/40 text-brand-400) transition-all text-center group block">
						<span class="i-simple-icons-behance text-xl mx-auto block mb-1" />
						<span class="text-xs font-semibold">Behance</span>
					</a>
				</div>
			</div>

			<!-- Newsletter Bento -->
			<div class="bento-card-subtle lg:col-span-6">
				<h3 class="heading-card-md">Berlangganan Newsletter</h3>
				<p class="text-meta text-xs mt-1">Dapatkan artikel dan pembaruan seputar web performance & design system.</p>
				<NewsletterForm />
			</div>
		</div>

		<article v-if="page" class="prose prose-slate dark:prose-invert max-w-3xl mt-8">
			<ContentRenderer :value="page" />
		</article>
	</div>
</template>
