<script setup lang="ts">
	const { locale, locales, t } = useI18n()
	const localePath = useLocalePath()
	const i18nHead = useLocaleHead({ seo: true })

	useHead(() => ({
		htmlAttrs: i18nHead.value.htmlAttrs,
		link: i18nHead.value.link,
		meta: i18nHead.value.meta,
	}))

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
			to: localePath('/projek'),
		},
		{
			label: t('nav.gallery'),
			to: localePath('/galeri'),
		},
		{
			label: t('nav.about'),
			to: localePath('/tentang'),
		},
		{
			label: t('nav.contact'),
			to: localePath('/kontak'),
		},
	])
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

			<div class="lang-switcher">
				<SwitchLocalePathLink
					v-for="loc in locales"
					:key="loc.code"
					:locale="loc.code"
					:class="{ active: loc.code === locale }"
				>
					{{ loc.code.toUpperCase() }}
				</SwitchLocalePathLink>
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