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
		<div
			class="noise"
			aria-hidden="true"
		/>
		<NuxtRouteAnnouncer />
		<AppHeader />

		<main class="flex-1">
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
					<a
						href="/feed.xml"
						target="_blank"
						rel="noopener"
						class="transition-colors hover:text-brand-800 dark:hover:text-brand-300"
						:title="locale === 'id' ? 'Berlangganan RSS Feed' : 'Subscribe via RSS'"
						aria-label="RSS Feed"
					>
						<span class="i-hugeicons-rss" />
					</a>
				</div>
			</div>
		</footer>

		<AppAiChat />
	</div>
</template>
