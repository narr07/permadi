<script setup lang="ts">
	import { onClickOutside, useEventListener } from '@vueuse/core'

	const { locales, t, locale } = useI18n()
	const localePath = useLocalePath()
	const switchLocalePath = useSwitchLocalePath()
	const { toggleDark, isDark } = useThemeToggle()
	const route = useRoute()

	const mobileOpen = ref(false)
	const headerContainerRef = ref<HTMLElement | null>(null)

	onClickOutside(headerContainerRef, () => {
		if (mobileOpen.value) {
			mobileOpen.value = false
		}
	})

	useEventListener('keydown', (e: KeyboardEvent) => {
		if (e.key === 'Escape' && mobileOpen.value) {
			mobileOpen.value = false
		}
	})

	const navItems = computed(() => [
		{
			label: t('nav.home'),
			to: localePath('/'),
			prefix: `/${locale.value}`,
			exact: true,
		},
		{
			label: t('nav.blog'),
			to: localePath('/blog'),
			prefix: `/${locale.value}/blog`,
		},
		{
			label: t('nav.projects'),
			to: locale.value === 'id' ? '/id/projek' : '/en/projects',
			prefix: locale.value === 'id' ? '/id/projek' : '/en/projects',
		},
		{
			label: t('nav.gallery'),
			to: locale.value === 'id' ? '/id/galeri' : '/en/gallery',
			prefix: locale.value === 'id' ? '/id/galeri' : '/en/gallery',
		},
		{
			label: t('nav.about'),
			to: locale.value === 'id' ? '/id/tentang' : '/en/about',
			prefix: locale.value === 'id' ? '/id/tentang' : '/en/about',
		},
	])

	const contactPath = computed(() => (locale.value === 'id' ? '/id/kontak' : '/en/contact'))

	function isItemActive(item: { to: string, prefix: string, exact?: boolean }): boolean {
		if (item.exact) {
			return route.path === `/${locale.value}` || route.path === `/${locale.value}/`
		}
		return route.path.startsWith(item.prefix)
	}
</script>

<template>
	<!-- Mobile Backdrop Click-to-Close Overlay -->
	<Transition
		enter-active-class="transition-opacity duration-200"
		enter-from-class="opacity-0"
		enter-to-class="opacity-100"
		leave-active-class="transition-opacity duration-150"
		leave-from-class="opacity-100"
		leave-to-class="opacity-0"
	>
		<div
			v-if="mobileOpen"
			class="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-xs md:hidden pointer-events-auto"
			aria-hidden="true"
			@click="mobileOpen = false"
		/>
	</Transition>

	<header
		ref="headerContainerRef"
		class="sticky top-4 z-50 pointer-events-none w-full"
	>
		<div class="container-bento flex items-center justify-between gap-2 sm:gap-4 pointer-events-auto">
			<!-- Island 1: Logo & Brand -->
			<NuxtLink
				:to="localePath('/')"
				class="nav-island px-2.5 py-1.5 hover:(border-brand-500/40 -translate-y-0.5) transition-all flex items-center gap-2"
				aria-label="permadi.dev"
			>
				<Logo size="28" />
				<span class="text-g1 font-heading font-semibold text-slate-900 dark:text-white hidden sm:inline tracking-tight">permadi.dev</span>
			</NuxtLink>

			<!-- Island 2: Navigasi Utama (Pill Nav Bento) -->
			<nav class="nav-island px-1.5 py-1 hidden md:flex">
				<NuxtLink
					v-for="item in navItems"
					:key="item.to"
					:to="item.to"
					class="px-3.5 py-1.5 rounded-bento-island text-g1 font-medium transition-all"
					:class="isItemActive(item)
						? 'bg-brand-50/90 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 font-semibold shadow-2xs'
						: 'text-slate-600 dark:text-slate-300 hover:(text-brand-600 dark:text-brand-400)'"
				>
					{{ item.label }}
				</NuxtLink>
			</nav>

			<!-- Island 3: Aksi (Search + Theme + Lang + Contact + Mobile Toggle) -->
			<div class="nav-island px-2 py-1.5">
				<!-- Search Modal Trigger -->
				<AppSearchModal />

				<!-- Dark/Light Mode Toggle (Desktop only) -->
				<button
					type="button"
					class="icon-btn hidden md:flex"
					:aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
					@click="toggleDark($event)"
				>
					<span class="i-hugeicons-sun-01 dark:hidden text-lg text-amber-500" />
					<span class="i-hugeicons-moon-02 hidden dark:inline text-lg text-brand-300" />
				</button>

				<!-- Language Switcher (Desktop only) -->
				<div class="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 rounded-full p-0.5 text-xs font-semibold">
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

				<!-- Contact CTA (Desktop only) -->
				<NuxtLink
					:to="contactPath"
					class="btn-primary !px-3.5 !py-1 text-g0 hidden md:inline-flex"
					:class="{ 'bg-brand-600': route.path.startsWith(contactPath) }"
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
					<span :class="mobileOpen ? 'i-hugeicons-cancel-01' : 'i-hugeicons-menu-01'" class="text-xl" />
				</button>
			</div>
		</div>

		<!-- Mobile Nav Menu Dropdown -->
		<Transition
			enter-active-class="transition duration-200 ease-out"
			enter-from-class="opacity-0 -translate-y-2 scale-98"
			enter-to-class="opacity-100 translate-y-0 scale-100"
			leave-active-class="transition duration-150 ease-in"
			leave-from-class="opacity-100 translate-y-0 scale-100"
			leave-to-class="opacity-0 -translate-y-2 scale-98"
		>
			<nav
				v-if="mobileOpen"
				class="container-bento mt-2 md:hidden pointer-events-auto"
			>
				<div class="rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl p-3 flex flex-col gap-1">
					<NuxtLink
						v-for="item in navItems"
						:key="item.to"
						:to="item.to"
						class="block px-4 py-2.5 rounded-xl text-g1 font-medium transition-colors"
						:class="isItemActive(item)
							? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/20'
							: 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'"
						@click="mobileOpen = false"
					>
						{{ item.label }}
					</NuxtLink>

					<!-- Mobile Settings: Theme Toggle & Language Switcher -->
					<div class="grid grid-cols-2 gap-2 pt-2.5 mt-1.5 border-t border-slate-100 dark:border-slate-800/80">
						<!-- Theme Switcher Button -->
						<button
							type="button"
							class="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-g1 font-medium bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
							@click="toggleDark($event)"
						>
							<span class="i-hugeicons-sun-01 dark:hidden text-lg text-amber-500" />
							<span class="i-hugeicons-moon-02 hidden dark:inline text-lg text-brand-300" />
							<span class="text-xs font-semibold">{{ isDark ? 'Dark' : 'Light' }}</span>
						</button>

						<!-- Language Switcher Pills -->
						<div class="flex items-center justify-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl p-1 text-xs font-semibold">
							<NuxtLink
								v-for="loc in locales"
								:key="loc.code"
								:to="switchLocalePath(loc.code)"
								class="flex-1 py-1 text-center rounded-lg transition-all text-slate-500 dark:text-slate-400"
								:class="{ 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs font-bold': loc.code === locale }"
								@click="mobileOpen = false"
							>
								{{ loc.code.toUpperCase() }}
							</NuxtLink>
						</div>
					</div>

					<!-- Contact CTA Button -->
					<NuxtLink
						:to="contactPath"
						class="btn-primary mt-2 text-center text-g1 !py-2.5 rounded-xl font-semibold"
						@click="mobileOpen = false"
					>
						{{ t('nav.contact') }}
					</NuxtLink>
				</div>
			</nav>
		</Transition>
	</header>
</template>
