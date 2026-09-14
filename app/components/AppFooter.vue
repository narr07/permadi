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
</script>

<template>
	<!-- When on Home Page: A subtle back-to-top anchor rail that seamlessly closes the document -->
	<footer
		v-if="isHomePage"
		class="w-full flex items-center justify-between border-t border-slate-200/80 bg-slate-50/90 px-6 py-4 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/80 sm:px-8"
	>
		<span class="text-slate-600 tracking-wider uppercase dark:text-slate-400">
			{{ locale === 'id' ? 'MAJALENGKA, JAWA BARAT' : 'MAJALENGKA, WEST JAVA' }}
		</span>

		<button
			type="button"
			class="inline-flex items-center gap-2 border border-slate-300 px-3 py-1.5 text-slate-900 font-bold tracking-wider uppercase transition-colors dark:border-[#134e43] hover:border-brand-500 dark:text-slate-50 hover:text-brand-600 dark:hover:text-brand-400"
			@click="scrollToTop"
		>
			<span>{{ locale === 'id' ? 'KEMBALI KE ATAS' : 'BACK TO TOP' }}</span>
			<span class="i-swisspost-arrowup text-xs" />
		</button>
	</footer>

	<!-- When on Inner Pages: Full Swiss Tabular Footer with Newsletter -->
	<footer
		v-else
		class="w-full border-t border-slate-200/80 bg-white dark:border-[#134e43] dark:bg-[#001e1c]"
	>
		<!-- Newsletter Band -->
		<div class="flex flex-col justify-between gap-6 border-b border-slate-200/80 p-6 lg:flex-row lg:items-center dark:border-[#134e43] lg:p-10 sm:p-8">
			<div class="max-w-xl">
				<div class="mb-2 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:text-accent">
					{{ t('sections.newsletter_title', 'WARTA TEKNIS') }}
				</div>
				<h3 class="mb-2 text-xl text-slate-900 font-900 font-heading sm:text-2xl dark:text-slate-50">
					{{ t('newsletter.title', 'Info Artikel & Kajian Desain') }}
				</h3>
				<p class="text-xs text-slate-700 leading-relaxed font-sans sm:text-sm dark:text-slate-300">
					{{ t('newsletter.description', 'Dapatkan tulisan teknis, insight pedagogi, dan rancangan terbaru langsung di inbox email kamu. Bebas spam.') }}
				</p>
			</div>

			<div class="w-full lg:max-w-md">
				<LazyNewsletterForm hydrate-on-visible />
			</div>
		</div>

		<!-- Bottom Copyright & Back to Top Strip -->
		<div class="flex flex-col items-start justify-between gap-4 bg-slate-50/60 px-6 py-4 text-xs font-mono sm:flex-row sm:items-center dark:bg-[#002420]/40 sm:px-8">
			<div class="flex items-center gap-2 text-slate-700 dark:text-slate-300">
				<span>© 2021–<ClientOnly fallback="2026">{{ currentYear }}</ClientOnly></span>
				<span>·</span>
				<span class="text-slate-900 font-bold dark:text-slate-100">Dinar Permadi Yusup</span>
				<span class="hidden sm:inline">· {{ locale === 'id' ? 'Hak cipta dilindungi.' : 'All rights reserved.' }}</span>
			</div>

			<button
				type="button"
				class="group inline-flex cursor-pointer items-center gap-2 border border-slate-300 px-3 py-1.5 text-slate-900 font-bold tracking-wider uppercase transition-all duration-150 active:scale-95 dark:border-[#134e43] hover:border-brand-500 dark:text-slate-50 hover:text-brand-600 hover:-translate-y-0.5 dark:hover:text-brand-400"
				@click="scrollToTop"
			>
				<span>{{ locale === 'id' ? 'Kembali ke Atas' : 'Back to Top' }}</span>
				<span class="i-swisspost-arrowup text-xs transition-transform duration-150 group-hover:-translate-y-0.5" />
			</button>
		</div>
	</footer>
</template>
