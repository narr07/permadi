<script setup lang="ts">
	const { locale, t } = useI18n()
	const route = useRoute()

	const currentYear = new Date().getFullYear()

	const isHomePage = computed(() => {
		const path = route.path.replace(/\/$/, '')
		return path === '' || path === '/id' || path === '/en'
	})

	function scrollToTop() {
		if (import.meta.client) {
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}

	const socialLinks = [
		{ name: 'GitHub', url: 'https://github.com/narr07', icon: 'i-ph-github-logo', ariaLabel: 'GitHub' },
		{ name: 'X', url: 'https://x.com/dinarpermadi07', icon: 'i-ph-x-logo', ariaLabel: 'X' },
		{ name: 'Instagram', url: 'https://www.instagram.com/narr07/', icon: 'i-ph-instagram-logo', ariaLabel: 'Instagram' },
		{ name: 'Behance', url: 'https://www.behance.net/narr07', icon: 'i-ph-behance-logo', ariaLabel: 'Behance' },
		{ name: 'RSS', url: '/feed.xml', icon: 'i-ph-rss-simple', ariaLabel: 'RSS Feed' },
		{ name: 'Email', url: 'mailto:dinar@permadi.dev', icon: 'i-ph-at', ariaLabel: 'Email' },
	]
</script>

<template>
	<!-- When on Home Page: A subtle back-to-top anchor rail that seamlessly closes the document -->
	<footer
		v-if="isHomePage"
		class="w-full border-t border-slate-200/80 bg-slate-50/90 px-6 py-4 dark:border-[#134e43] dark:bg-[#002420]/80 sm:px-8 font-mono text-xs flex items-center justify-between"
	>
		<span class="text-slate-900/50 uppercase dark:text-slate-50/50 tracking-wider">
			MAJALENGKA, JAWA BARAT
		</span>

		<button
			type="button"
			class="inline-flex items-center gap-2 border border-slate-300 dark:border-[#134e43] px-3 py-1.5 text-slate-900 font-bold uppercase tracking-wider hover:border-brand-500 hover:text-brand-600 dark:text-slate-50 dark:hover:text-brand-400 transition-colors"
			@click="scrollToTop"
		>
			<span>KEMBALI KE ATAS</span>
			<span class="i-ph-arrow-up text-xs" />
		</button>
	</footer>

	<!-- When on Inner Pages: Full Swiss Tabular Footer with Newsletter -->
	<footer
		v-else
		class="w-full border-t border-slate-200/80 bg-white dark:border-[#134e43] dark:bg-[#001e1c]"
	>
		<!-- Newsletter Band -->
		<div class="border-b border-slate-200/80 dark:border-[#134e43] p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
			<div class="max-w-xl">
				<div class="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-brand-700 dark:text-accent">
					{{ t('sections.newsletter_title', 'WARTA TEKNIS') }}
				</div>
				<h3 class="font-heading font-700 text-xl sm:text-2xl text-slate-900 dark:text-slate-50 mb-2">
					{{ t('newsletter.title', 'Info Artikel & Kajian Desain') }}
				</h3>
				<p class="font-sans text-xs sm:text-sm text-slate-900/70 dark:text-slate-50/70 leading-relaxed">
					{{ t('newsletter.description', 'Dapatkan tulisan teknis, insight pedagogi, dan rancangan terbaru langsung di inbox email kamu. Bebas spam.') }}
				</p>
			</div>

			<div class="w-full lg:max-w-md">
				<LazyNewsletterForm hydrate-on-visible />
			</div>
		</div>

		<!-- Bottom Copyright & Back to Top Strip -->
		<div class="px-6 py-4 sm:px-8 bg-slate-50/60 dark:bg-[#002420]/40 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<div class="flex items-center gap-2 text-slate-900/60 dark:text-slate-50/60">
				<span>© 2021–<ClientOnly fallback="2026">{{ currentYear }}</ClientOnly></span>
				<span>·</span>
				<span class="text-slate-900 font-bold dark:text-slate-100">Dinar Permadi Yusup</span>
				<span class="hidden sm:inline">· {{ locale === 'id' ? 'Hak cipta dilindungi.' : 'All rights reserved.' }}</span>
			</div>

			<button
				type="button"
				class="inline-flex items-center gap-2 border border-slate-300 dark:border-[#134e43] px-3 py-1.5 text-slate-900 font-bold uppercase tracking-wider hover:border-brand-500 hover:text-brand-600 dark:text-slate-50 dark:hover:text-brand-400 transition-colors"
				@click="scrollToTop"
			>
				<span>{{ locale === 'id' ? 'Kembali ke Atas' : 'Back to Top' }}</span>
				<span class="i-ph-arrow-up text-xs" />
			</button>
		</div>
	</footer>
</template>
