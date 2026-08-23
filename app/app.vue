<script setup lang="ts">
const { locale } = useI18n()
const config = useRuntimeConfig()

// Defer analytics to first user interaction (scroll, click, touch, keydown)
// This eliminates 182 KiB of third-party JS on initial load, drops TBT to 0ms,
// and avoids net::ERR_BLOCKED_BY_CLIENT in Lighthouse audits.
onMounted(() => {
	if (!import.meta.client) return

	const initAnalytics = () => {
		window.removeEventListener('scroll', initAnalytics)
		window.removeEventListener('click', initAnalytics)
		window.removeEventListener('touchstart', initAnalytics)
		window.removeEventListener('keydown', initAnalytics)

		if (config.public.cloudflareAnalyticsToken) {
			useScriptCloudflareWebAnalytics({
				token: config.public.cloudflareAnalyticsToken,
			}, {
				proxy: false,
			})
		}

		if (config.public.googleAnalyticsId) {
			useScriptGoogleAnalytics({
				id: config.public.googleAnalyticsId,
			}, {
				proxy: false,
			})
		}
	}

	window.addEventListener('scroll', initAnalytics, { passive: true, once: true })
	window.addEventListener('click', initAnalytics, { passive: true, once: true })
	window.addEventListener('touchstart', initAnalytics, { passive: true, once: true })
	window.addEventListener('keydown', initAnalytics, { passive: true, once: true })
})

useHead({
	htmlAttrs: {
		lang: () => locale.value,
	},
	link: [
		{ rel: 'icon', type: 'image/png', href: '/favicon.png' },
		{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
		{ rel: 'alternate', type: 'application/rss+xml', title: 'Permadi | RSS Feed (RSS 2.0)', href: '/feed.xml' },
		{ rel: 'alternate', type: 'application/atom+xml', title: 'Permadi | Atom Feed (Atom 1.0)', href: '/feed.atom' },
		{ rel: 'alternate', type: 'application/feed+json', title: 'Permadi | JSON Feed (JSON 1.0)', href: '/feed.json' },
	],
})

useSeoMeta({
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | Permadi` : 'Permadi | Web Developer & Designer'
	},
	ogSiteName: 'Permadi',
	fbAppId: () => config.public.fbAppId ? String(config.public.fbAppId) : undefined,
	twitterCard: 'summary_large_image',
})

useSchemaOrg([
	definePerson({
		name: 'Dinar Permadi Yusup',
		alternateName: 'Permadi',
		jobTitle: 'Frontend Developer & Graphic Designer',
		url: 'https://permadi.dev',
		image: '/logo.png',
		sameAs: [
			'https://github.com/narr07',
			'https://x.com/dinarpermadi07',
			'https://www.behance.net/narr07',
			'https://www.instagram.com/narr07/',
		],
	}),
	defineWebSite({
		name: 'Permadi',
		url: 'https://permadi.dev',
		description: 'Web Developer & Designer portfolio and technical blog of Permadi.',
		inLanguage: ['id-ID', 'en-US'],
	}),
	defineWebPage(),
])

defineOgImage('Bento', {
	title: 'Permadi | Web Developer & Designer',
	description: 'Personal Portfolio, Showcase of Projects & Technical Blog of Permadi.',
	category: 'Portfolio & Articles',
})
</script>

<template>
	<div class="relative min-h-screen flex flex-col justify-between selection:(bg-brand-500 text-white)">
		<!-- Skip to Main Content for A11y / Keyboard Focus Management -->
		<a
			href="#main"
			class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none"
		>
			{{ locale === 'id' ? 'Lewati ke konten utama' : 'Skip to main content' }}
		</a>

		<div
			class="noise"
			aria-hidden="true"
		/>
		<NuxtRouteAnnouncer />
		<AppHeader />

		<main
			id="main"
			tabindex="-1"
			class="flex-1 outline-none"
		>
			<NuxtPage />
		</main>

		<footer class="mt-16 border-t border-slate-200/80 py-8 dark:border-slate-800/80">
			<div class="container-bento flex flex-col items-center justify-between gap-4 text-center text-meta sm:flex-row sm:text-left">
				<div>
					<p class="text-sm text-slate-600 dark:text-slate-400">
						© 2021-<ClientOnly fallback="2026">{{ new Date().getFullYear() }}</ClientOnly> - narr07
					</p>
				</div>
				<div class="flex items-center gap-3 text-lg text-slate-600 dark:text-slate-400">
					<a
						href="https://github.com/narr07"
						target="_blank"
						rel="noopener"
						class="transition-colors hover:text-brand-800 dark:hover:text-brand-300"
						aria-label="GitHub"
					>
						<span class="i-hugeicons-github" />
					</a>
					<a
						href="https://x.com/dinarpermadi07"
						target="_blank"
						rel="noopener"
						class="transition-colors hover:text-brand-800 dark:hover:text-brand-300"
						aria-label="X"
					>
						<span class="i-hugeicons-new-twitter" />
					</a>
					<a
						href="https://www.instagram.com/narr07/"
						target="_blank"
						rel="noopener"
						class="transition-colors hover:text-brand-800 dark:hover:text-brand-300"
						aria-label="Instagram"
					>
						<span class="i-hugeicons-instagram" />
					</a>
					<a
						href="https://www.behance.net/narr07"
						target="_blank"
						rel="noopener"
						class="transition-colors hover:text-brand-800 dark:hover:text-brand-300"
						aria-label="Behance"
					>
						<span class="i-hugeicons-behance-02" />
					</a>
					<NuxtLink
						to="/feed.xml"
						external
						target="_blank"
						rel="noopener"
						class="transition-colors hover:text-brand-800 dark:hover:text-brand-300"
						:title="locale === 'id' ? 'Berlangganan RSS Feed' : 'Subscribe via RSS'"
						aria-label="RSS Feed"
					>
						<span class="i-hugeicons-rss" />
					</NuxtLink>
				</div>
			</div>
		</footer>

		<LazyAppAiChat />
	</div>
</template>
