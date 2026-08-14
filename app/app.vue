<script setup lang="ts">
	const { locales, t } = useI18n()
	const route = useRoute()
	const localePath = useLocalePath()

	const currentLocale = computed(() => {
		const parts = route.path.split('/').filter(Boolean)
		return parts[0] === 'id' ? 'id' : 'en'
	})

	const navLinks = computed(() => [
		{
			label: t('nav.home'),
			to: localePath('/'),
		},
		{
			label: t('nav.blog'),
			to: localePath('/blog'),
		},
		{
			label: t('nav.projects'),
			to: localePath('projects'),
		},
		{
			label: t('nav.gallery'),
			to: localePath('gallery'),
		},
		{
			label: t('nav.about'),
			to: localePath('about'),
		},
		{
			label: t('nav.contact'),
			to: localePath('contact'),
		},
	])

	// Peta terjemahan slug artikel blog
	const blogSlugMap: Record<string, { en: string; id: string }> = {
		'building-bento-grid-design-system': { en: 'building-bento-grid-design-system', id: 'membangun-design-system-bento' },
		'membangun-design-system-bento': { en: 'building-bento-grid-design-system', id: 'membangun-design-system-bento' },
		'why-use-golden-ratio-in-typography': { en: 'why-use-golden-ratio-in-typography', id: 'mengapa-golden-ratio-dalam-tipografi' },
		'mengapa-golden-ratio-dalam-tipografi': { en: 'why-use-golden-ratio-in-typography', id: 'mengapa-golden-ratio-dalam-tipografi' },
		'optimizing-nuxt-with-cloudflare-d1': { en: 'optimizing-nuxt-with-cloudflare-d1', id: 'optimasi-nuxt-dengan-cloudflare-d1' },
		'optimasi-nuxt-dengan-cloudflare-d1': { en: 'optimizing-nuxt-with-cloudflare-d1', id: 'optimasi-nuxt-dengan-cloudflare-d1' },
		'interface-philosophy-digital-craftsman': { en: 'interface-philosophy-digital-craftsman', id: 'filosofi-antarmuka-digital-craftsman' },
		'filosofi-antarmuka-digital-craftsman': { en: 'interface-philosophy-digital-craftsman', id: 'filosofi-antarmuka-digital-craftsman' },
	}

	// Peta terjemahan slug projek
	const projectSlugMap: Record<string, { en: string; id: string }> = {
		'personal-portfolio-bento-redesign': { en: 'personal-portfolio-bento-redesign', id: 'redesign-sistem-bento-portfolio-pribadi' },
		'redesign-sistem-bento-portfolio-pribadi': { en: 'personal-portfolio-bento-redesign', id: 'redesign-sistem-bento-portfolio-pribadi' },
		'design-token-generator': { en: 'design-token-generator', id: 'generator-token-desain' },
		'generator-token-desain': { en: 'design-token-generator', id: 'generator-token-desain' },
		'cloudflare-d1-starter': { en: 'cloudflare-d1-starter', id: 'starter-cloudflare-d1' },
		'starter-cloudflare-d1': { en: 'cloudflare-d1-starter', id: 'starter-cloudflare-d1' },
		'micro-interactions-preset-motion-vue': { en: 'micro-interactions-preset-motion-vue', id: 'preset-animasi-motion-vue' },
		'preset-animasi-motion-vue': { en: 'micro-interactions-preset-motion-vue', id: 'preset-animasi-motion-vue' },
	}

	function getSwitchPath(targetLocale: string): string {
		const parts = route.path.split('/').filter(Boolean)
		const loc = parts[0] === 'id' ? 'id' : 'en'

		if (targetLocale === loc) {
			return route.path
		}

		// 1. Beranda
		if (parts.length <= 1) {
			return targetLocale === 'id' ? '/id' : '/en'
		}

		const section = parts[1]
		const slug = parts[2]

		// 2. Rute dinamis blog
		if (section === 'blog' && slug && blogSlugMap[slug]) {
			const targetSlug = blogSlugMap[slug][targetLocale as 'en' | 'id'] || slug
			return `/${targetLocale}/blog/${targetSlug}`
		}

		// 3. Rute dinamis projek
		if ((section === 'projects' || section === 'projek') && slug && projectSlugMap[slug]) {
			const targetSection = targetLocale === 'id' ? 'projek' : 'projects'
			const targetSlug = projectSlugMap[slug][targetLocale as 'en' | 'id'] || slug
			return `/${targetLocale}/${targetSection}/${targetSlug}`
		}

		// 4. Rute statis (projects, gallery, about, contact, blog)
		if (parts.length === 2) {
			if (section === 'projects' || section === 'projek') return targetLocale === 'id' ? '/id/projek' : '/en/projects'
			if (section === 'gallery' || section === 'galeri') return targetLocale === 'id' ? '/id/galeri' : '/en/gallery'
			if (section === 'about' || section === 'tentang') return targetLocale === 'id' ? '/id/tentang' : '/en/about'
			if (section === 'contact' || section === 'kontak') return targetLocale === 'id' ? '/id/kontak' : '/en/contact'
			if (section === 'blog') return `/${targetLocale}/blog`
		}

		return targetLocale === 'id' ? '/id' : '/en'
	}
</script>

<template>
	<NuxtRouteAnnouncer />
	<header class="app-header">
		<div class="header-container">
			<nav aria-label="Main Navigation">
				<ul class="nav-list">
					<li
						v-for="item in navLinks"
						:key="item.to"
					>
						<NuxtLink
							:to="item.to"
						>
							{{ item.label }}
						</NuxtLink>
					</li>
				</ul>
			</nav>

			<div class="header-actions">
				<AppSearchModal />
				<div class="lang-switcher">
					<NuxtLink
						v-for="loc in locales"
						:key="loc.code"
						:to="getSwitchPath(loc.code)"
						:class="{ active: loc.code === currentLocale }"
					>
						{{ loc.code.toUpperCase() }}
					</NuxtLink>
				</div>
			</div>
		</div>
	</header>
	<NuxtPage />
</template>

<style scoped>
	.app-header {
		max-width: 800px;
		margin: 1.5rem auto 0;
		padding: 0 1rem;
	}

	.header-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.nav-list {
		display: flex;
		flex-wrap: wrap;
		gap: 1.25rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.nav-list a {
		text-decoration: none;
		color: inherit;
		font-weight: 500;
		transition: opacity 0.2s ease;
	}

	.nav-list a:hover,
	.nav-list a.router-link-active {
		text-decoration: underline;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.lang-switcher {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.lang-switcher a {
		font-size: 0.85rem;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		text-decoration: none;
		color: inherit;
		border: 1px solid #ccc;
	}

	.lang-switcher a.active {
		font-weight: bold;
		background: #eee;
		border-color: #999;
	}
</style>