<script setup lang="ts">
const { locale } = useI18n()
const config = useRuntimeConfig()

// Defer analytics to first user interaction (scroll, click, touch, keydown)
// This eliminates 182 KiB of third-party JS on initial load, drops TBT to 0ms,
// and avoids net::ERR_BLOCKED_BY_CLIENT in Lighthouse audits.
onMounted(() => {
	if (!import.meta.client)
		return

	const initAnalytics = () => {
		window.removeEventListener('scroll', initAnalytics)
		window.removeEventListener('click', initAnalytics)
		window.removeEventListener('touchstart', initAnalytics)
		window.removeEventListener('keydown', initAnalytics)

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
		{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
		{ rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
		{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
		{ rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
		{ rel: 'manifest', href: '/site.webmanifest' },
		{ rel: 'alternate', type: 'application/rss+xml', title: 'Permadi | RSS Feed (RSS 2.0)', href: '/feed.xml' },
		{ rel: 'alternate', type: 'application/atom+xml', title: 'Permadi | Atom Feed (Atom 1.0)', href: '/feed.atom' },
		{ rel: 'alternate', type: 'application/feed+json', title: 'Permadi | JSON Feed (JSON 1.0)', href: '/feed.json' },
	],
})

useSeoMeta({
	titleTemplate: (titleChunk) => {
		return titleChunk ? `${titleChunk} | Permadi` : (locale.value === 'id' ? 'Dinar Permadi Yusup | Guru SD, Developer & Desainer' : 'Dinar Permadi Yusup | Teacher, Developer & Designer')
	},
	ogSiteName: 'Permadi',
	fbAppId: () => config.public.fbAppId ? String(config.public.fbAppId) : undefined,
	twitterCard: 'summary_large_image',
})

useSchemaOrg([
	definePerson({
		name: 'Dinar Permadi Yusup',
		alternateName: 'Permadi',
		jobTitle: () => (locale.value === 'id' ? 'Guru SD, Web Developer & Desainer Grafis' : 'Elementary School Teacher, Web Developer & Graphic Designer'),
		alumniOf: {
			'@type': 'EducationalOrganization',
			'name': 'Universitas Pendidikan Indonesia (UPI)',
			'url': 'https://www.upi.edu',
		},
		url: 'https://permadi.dev',
		image: '/logo.png',
		sameAs: [
			'https://github.com/narr07',
			'https://x.com/dinarpermadi07',
			'https://www.behance.net/narr07',
			'https://www.instagram.com/narr07/',
		],
		worksFor: 'SDN Teja II',
	}),
	defineWebSite({
		name: 'Permadi',
		url: 'https://permadi.dev',
		description: () => (locale.value === 'id'
			? 'Portofolio dan blog teknis Dinar Permadi Yusup: Guru SD lulusan UPI, Web & Mobile Developer (Nuxt, Flutter, Python, PHP), dan Desainer Grafis.'
			: 'Personal portfolio and technical notes of Dinar Permadi Yusup: Elementary School Teacher, UPI Alumnus, Web & Mobile Developer (Nuxt, Flutter, Python, PHP), and Graphic Designer.'),
		inLanguage: ['id-ID', 'en-US'],
	}),
	defineWebPage(),
])

defineOgImage('Bento', {
	title: () => (locale.value === 'id' ? 'Dinar Permadi Yusup | Guru SD, Developer & Desainer' : 'Dinar Permadi Yusup | Teacher, Developer & Designer'),
	description: () => (locale.value === 'id' ? 'Portofolio projek, blog teknis, dan galeri visual karya Dinar Permadi Yusup.' : 'Project portfolio, technical blog, and visual gallery by Dinar Permadi Yusup.'),
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

		<NuxtLoadingIndicator
			color="#14b898"
			:height="2"
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

		<AppFooter />

	</div>
</template>

<style>
@import '~/assets/css/main.css';
</style>
