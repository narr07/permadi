<script setup lang="ts">
	const { locale } = useI18n()
	const config = useRuntimeConfig()

	// Cloudflare Web Analytics via @nuxt/scripts
	if (config.public.cloudflareAnalyticsToken) {
		useScriptCloudflareWebAnalytics({
			token: config.public.cloudflareAnalyticsToken,
		})
	}

	useHead({
		htmlAttrs: {
			lang: locale,
		},
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
		],
	})

	useSeoMeta({
		titleTemplate: (titleChunk) => {
			return titleChunk ? `${titleChunk} — Permadi` : 'Permadi — Web Developer & Designer'
		},
		ogSiteName: 'Permadi',
		twitterCard: 'summary_large_image',
	})

	defineOgImage('Bento', {
		title: 'Permadi — Web Developer & Designer',
		description: 'Personal Portfolio, Showcase of Projects & Technical Blog of Permadi.',
		category: 'Portfolio & Articles',
	})
</script>

<template>
	<div class="min-h-screen selection:(bg-brand-500 text-white) flex flex-col justify-between relative">
		<div class="noise" aria-hidden="true" />
		<NuxtRouteAnnouncer />
		<AppHeader />
		
		<main class="flex-1">
			<NuxtPage />
		</main>

		<footer class="mt-16 border-t border-slate-200/80 dark:border-slate-800/80 py-8">
			<div class="container-bento flex flex-col sm:flex-row items-center justify-between gap-4 text-meta text-center sm:text-left">
				<div>
					<p class="font-heading font-semibold text-slate-800 dark:text-slate-300">
						permadi.dev <span class="font-normal text-slate-600 dark:text-slate-400">© {{ new Date().getFullYear() }}</span>
					</p>
					<p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
						Crafted with Nuxt, UnoCSS & Cloudflare D1.
					</p>
				</div>
				<div class="flex items-center gap-3 text-lg text-slate-600 dark:text-slate-400">
					<a href="https://github.com/narr07" target="_blank" rel="noopener" class="hover:text-brand-800 dark:hover:text-brand-300 transition-colors" aria-label="GitHub">
						<span class="i-hugeicons-github" />
					</a>
					<a href="https://x.com/dinarpermadi07" target="_blank" rel="noopener" class="hover:text-brand-800 dark:hover:text-brand-300 transition-colors" aria-label="X">
						<span class="i-hugeicons-new-twitter" />
					</a>
					<a href="https://www.instagram.com/narr07/" target="_blank" rel="noopener" class="hover:text-brand-800 dark:hover:text-brand-300 transition-colors" aria-label="Instagram">
						<span class="i-hugeicons-instagram" />
					</a>
					<a href="https://www.behance.net/narr07" target="_blank" rel="noopener" class="hover:text-brand-800 dark:hover:text-brand-300 transition-colors" aria-label="Behance">
						<span class="i-hugeicons-behance-02" />
					</a>
				</div>
			</div>
		</footer>
	</div>
</template>
