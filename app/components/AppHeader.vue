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

	// Sliding Nav Pill Indicator
	const navContainerRef = ref<HTMLElement | null>(null)
	const indicatorStyle = ref({
		left: '0px',
		width: '0px',
		opacity: 0,
	})

	function updateNavIndicator() {
		nextTick(() => {
			if (!navContainerRef.value) return
			const activeEl = navContainerRef.value.querySelector<HTMLElement>('[data-active="true"]')
			if (activeEl) {
				const containerRect = navContainerRef.value.getBoundingClientRect()
				const activeRect = activeEl.getBoundingClientRect()
				indicatorStyle.value = {
					left: `${activeRect.left - containerRect.left}px`,
					width: `${activeRect.width}px`,
					opacity: 1,
				}
			}
			else {
				indicatorStyle.value.opacity = 0
			}
		})
	}

	watch(() => [route.path, locale.value], () => {
		updateNavIndicator()
	}, { immediate: true })

	onMounted(() => {
		updateNavIndicator()
		window.addEventListener('resize', updateNavIndicator)
	})

	onUnmounted(() => {
		window.removeEventListener('resize', updateNavIndicator)
	})
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
				class="nav-island px-2.5 py-1.5 hover:(border-brand-500/40) transition-all flex items-center gap-2"
				aria-label="permadi.dev"
			>
				<Logo size="28" />
				<span class="text-g1 font-heading font-semibold text-slate-900 dark:text-white hidden sm:inline tracking-tight">permadi.dev</span>
			</NuxtLink>

			<!-- Island 2: Navigasi Utama (Sliding Pill Nav Bento) -->
			<nav
				ref="navContainerRef"
				class="nav-island relative px-1.5 py-1 hidden md:flex items-center"
			>
				<!-- Animated Sliding Indicator Pill -->
				<div
					class="absolute top-1 bottom-1 rounded-bento-island bg-brand-100/90 dark:bg-brand-800/70 shadow-2xs pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
					:style="{
						left: indicatorStyle.left,
						width: indicatorStyle.width,
						opacity: indicatorStyle.opacity,
					}"
				/>

				<NuxtLink
					v-for="item in navItems"
					:key="item.to"
					:to="item.to"
					:data-active="isItemActive(item)"
					class="relative z-10 px-3.5 py-1.5 rounded-bento-island text-g1 font-medium transition-colors duration-200"
					:class="isItemActive(item)
						? 'text-brand-600 dark:text-brand-400 font-semibold'
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

				<!-- Sliding Language Switcher (Desktop only) -->
				<div class="relative hidden md:grid grid-cols-2 items-center bg-slate-100 dark:bg-slate-800/80 rounded-full p-0.5 text-xs font-semibold select-none border border-slate-200/50 dark:border-slate-700/50 w-20">
					<!-- Animated Sliding Pill Indicator -->
					<div
						class="absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-white dark:bg-slate-700 shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none"
						:style="{ transform: locale === 'id' ? 'translateX(100%)' : 'translateX(0%)' }"
					/>

					<NuxtLink
						v-for="loc in locales"
						:key="loc.code"
						:to="switchLocalePath(loc.code)"
						class="relative z-10 py-1 text-center rounded-full transition-colors duration-200"
						:class="loc.code === locale
							? 'text-brand-600 dark:text-brand-300 font-bold'
							: 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'"
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
				<div class="rounded-2xl bg-brand-50/95 dark:bg-brand-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl p-3 flex flex-col gap-1">
					<NuxtLink
						v-for="item in navItems"
						:key="item.to"
						:to="item.to"
						class="block px-4 py-2.5 rounded-xl text-g1 font-medium transition-colors"
						:class="isItemActive(item)
							? 'bg-brand-200 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/20'
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
							class="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-g1 font-medium bg-brand-200 dark:bg-brand-800/80 text-brand-700 dark:text-brand-200 hover:bg-brand-200/80 dark:hover:bg-brand-700/80 transition-colors cursor-pointer"
							@click="toggleDark($event)"
						>
							<span class="i-hugeicons-sun-01 dark:hidden text-lg text-brand-900" />
							<span class="i-hugeicons-moon-02 hidden dark:inline text-lg text-brand-100" />
							<span class="text-xs font-semibold">{{ isDark ? 'Dark' : 'Light' }}</span>
						</button>

						<!-- Sliding Language Switcher Pills (Mobile) -->
						<div class="relative grid grid-cols-2 items-center bg-brand-100 dark:bg-slate-800/80 rounded-xl p-1 text-xs font-semibold select-none border border-brand-200/50 dark:border-brand-700/50 ">
							<!-- Animated Sliding Pill Indicator -->
							<div
								class="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg bg-brand-300  dark:bg-brand-700 shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none"
								:style="{ transform: locale === 'id' ? 'translateX(100%)' : 'translateX(0%)' }"
							/>

							<NuxtLink
								v-for="loc in locales"
								:key="loc.code"
								:to="switchLocalePath(loc.code)"
								class="relative z-10 py-1 text-center rounded-lg transition-colors duration-200"
								:class="loc.code === locale
									? 'text-brand-950 dark:text-brand-100 font-bold'
									: 'text-brand-800 dark:text-brand-50 hover:text-slate-900 dark:hover:text-white'"
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
