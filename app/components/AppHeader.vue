<script setup lang="ts">
	const { locales, t, locale } = useI18n()
	const localePath = useLocalePath()
	const switchLocalePath = useSwitchLocalePath()
	const colorMode = useColorMode()

	const mobileOpen = ref(false)

	function toggleColorMode() {
		colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
	}

	const navItems = computed(() => [
		{ label: t('nav.home'), to: localePath('/') },
		{ label: t('nav.blog'), to: localePath('/blog') },
		{ label: t('nav.projects'), to: locale.value === 'id' ? localePath('/projek') : localePath('/projects') },
		{ label: t('nav.gallery'), to: locale.value === 'id' ? localePath('/galeri') : localePath('/gallery') },
		{ label: t('nav.about'), to: locale.value === 'id' ? localePath('/tentang') : localePath('/about') },
	])

	const contactPath = computed(() => (locale.value === 'id' ? localePath('/kontak') : localePath('/contact')))
</script>

<template>
	<header class="sticky top-4 z-50 px-4">
		<div class="container-bento flex items-center justify-between gap-2 sm:gap-4">
			<!-- Island 1: Logo & Brand -->
			<NuxtLink
				:to="localePath('/')"
				class="nav-island focus-ring px-3 py-1.5 hover:(border-brand-500/40 -translate-y-0.5) transition-all"
			>
				<div class="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center font-heading font-bold text-xs">
					P
				</div>
				<span class="text-g1 font-heading font-semibold text-slate-900 dark:text-white hidden sm:inline tracking-tight">permadi.dev</span>
			</NuxtLink>

			<!-- Island 2: Navigasi Utama (Pill Nav Bento) -->
			<nav class="nav-island px-1.5 py-1 hidden md:flex">
				<NuxtLink
					v-for="item in navItems"
					:key="item.to"
					:to="item.to"
					class="focus-ring px-3.5 py-1.5 rounded-bento-island text-g1 font-medium text-slate-600 dark:text-slate-300 transition-all hover:(text-brand-600 dark:text-brand-400)"
					active-class="bg-brand-50/90 dark:bg-brand-950/70 text-brand-600! dark:text-brand-400! bento-highlight"
				>
					{{ item.label }}
				</NuxtLink>
			</nav>

			<!-- Island 3: Aksi (Search + Theme + Lang + Contact + Mobile Toggle) -->
			<div class="nav-island px-2 py-1.5">
				<!-- Search Modal Trigger -->
				<AppSearchModal />

				<!-- Dark/Light Mode Toggle -->
				<button
					type="button"
					class="icon-btn"
					:aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
					@click="toggleColorMode"
				>
					<span class="i-lucide-sun dark:hidden text-lg text-amber-500" />
					<span class="i-lucide-moon hidden dark:inline text-lg text-brand-300" />
				</button>

				<!-- Language Switcher -->
				<div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 rounded-full p-0.5 text-xs font-semibold">
					<NuxtLink
						v-for="loc in locales"
						:key="loc.code"
						:to="switchLocalePath(loc.code)"
						class="px-2 py-1 rounded-full transition-all text-slate-500 dark:text-slate-400"
						:class="{ 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs font-bold': loc.code === locale }"
					>
						{{ loc.code.toUpperCase() }}
					</NuxtLink>
				</div>

				<!-- Contact CTA -->
				<NuxtLink
					:to="contactPath"
					class="btn-primary !px-3.5 !py-1 text-g0 hidden sm:inline-flex"
				>
					{{ t('nav.contact') }}
				</NuxtLink>

				<!-- Mobile Hamburger Button -->
				<button
					type="button"
					class="icon-btn md:hidden"
					aria-label="Toggle navigation menu"
					@click="mobileOpen = !mobileOpen"
				>
					<span :class="mobileOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="text-xl" />
				</button>
			</div>
		</div>

		<!-- Mobile Nav Menu Dropdown -->
		<nav
			v-if="mobileOpen"
			class="container-bento mt-2 md:hidden nav-island flex-col items-stretch p-3 animate-fade-in"
		>
			<NuxtLink
				v-for="item in navItems"
				:key="item.to"
				:to="item.to"
				class="focus-ring block px-4 py-2.5 rounded-bento text-g1 font-medium text-slate-700 dark:text-slate-200 transition-colors"
				active-class="bg-brand-50 dark:bg-brand-950/50 text-brand-600! dark:text-brand-400! bento-highlight font-semibold"
				@click="mobileOpen = false"
			>
				{{ item.label }}
			</NuxtLink>
			<NuxtLink
				:to="contactPath"
				class="btn-primary mt-2 text-center text-g1"
				@click="mobileOpen = false"
			>
				{{ t('nav.contact') }}
			</NuxtLink>
		</nav>
	</header>
</template>
