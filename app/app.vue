<script setup lang="ts">
	const { t, locale } = useI18n()

	useHead({
		htmlAttrs: {
			lang: locale,
		},
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
		],
	})
</script>

<template>
	<div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:(bg-brand-500 text-white) transition-colors duration-300 flex flex-col justify-between">
		<NuxtRouteAnnouncer />
		<AppHeader />
		
		<main class="flex-1">
			<NuxtPage />
		</main>

		<footer class="mt-16 border-t border-slate-200/80 dark:border-slate-800/80 py-8">
			<div class="container-bento flex flex-col sm:flex-row items-center justify-between gap-4 text-meta text-center sm:text-left">
				<div>
					<p class="font-heading font-semibold text-slate-700 dark:text-slate-300">
						permadi.dev <span class="font-normal text-slate-400">© {{ new Date().getFullYear() }}</span>
					</p>
					<p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
						Crafted with Nuxt, UnoCSS & Cloudflare D1.
					</p>
				</div>
				<div class="flex items-center gap-3 text-lg text-slate-400 dark:text-slate-500">
					<a href="https://github.com/narr07" target="_blank" rel="noopener" class="hover:text-brand-500 transition-colors" aria-label="GitHub">
						<span class="i-simple-icons-github" />
					</a>
					<a href="https://x.com/dinarpermadi07" target="_blank" rel="noopener" class="hover:text-brand-500 transition-colors" aria-label="X">
						<span class="i-simple-icons-x" />
					</a>
					<a href="https://www.instagram.com/narr07/" target="_blank" rel="noopener" class="hover:text-brand-500 transition-colors" aria-label="Instagram">
						<span class="i-simple-icons-instagram" />
					</a>
					<a href="https://www.behance.net/narr07" target="_blank" rel="noopener" class="hover:text-brand-500 transition-colors" aria-label="Behance">
						<span class="i-simple-icons-behance" />
					</a>
				</div>
			</div>
		</footer>
	</div>
</template>