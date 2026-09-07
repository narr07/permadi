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

const mobileNavItems = computed(() => [
	{
		label: t('nav.home'),
		to: localePath('/'),
		prefix: `/${locale.value}`,
		exact: true,
		icon: 'i-hugeicons-home-01',
	},
	{
		label: t('nav.blog'),
		to: localePath('/blog'),
		prefix: `/${locale.value}/blog`,
		icon: 'i-hugeicons-book-02',
	},
	{
		label: t('nav.projects'),
		to: locale.value === 'id' ? '/id/projek' : '/en/projects',
		prefix: locale.value === 'id' ? '/id/projek' : '/en/projects',
		icon: 'i-hugeicons-folder-02',
	},
	{
		label: t('nav.gallery'),
		to: locale.value === 'id' ? '/id/galeri' : '/en/gallery',
		prefix: locale.value === 'id' ? '/id/galeri' : '/en/gallery',
		icon: 'i-hugeicons-image-02',
	},
])

const aboutPath = computed(() => (locale.value === 'id' ? '/id/tentang' : '/en/about'))
const contactPath = computed(() => (locale.value === 'id' ? '/id/kontak' : '/en/contact'))

function isItemActive(item: { to: string, prefix: string, exact?: boolean }): boolean {
	if (item.exact) {
		return route.path === `/${locale.value}` || route.path === `/${locale.value}/`
	}
	return route.path.startsWith(item.prefix)
}

// Sliding Nav Pill Indicator (Desktop)
const navContainerRef = ref<HTMLElement | null>(null)
const indicatorStyle = ref({
	transform: 'translateX(0px)',
	width: '0px',
	opacity: 0,
})

// Sliding Nav Pill Indicator (Mobile Bottom Bar)
const mobileNavContainerRef = ref<HTMLElement | null>(null)
const mobileIndicatorStyle = ref({
	transform: 'translateX(0px)',
	width: '0px',
	opacity: 0,
})

function updateNavIndicator() {
	nextTick(() => {
		if (!navContainerRef.value)
			return
		const activeEl = navContainerRef.value.querySelector<HTMLElement>('[data-active="true"]')
		if (activeEl) {
			const containerRect = navContainerRef.value.getBoundingClientRect()
			const activeRect = activeEl.getBoundingClientRect()
			indicatorStyle.value = {
				transform: `translateX(${activeRect.left - containerRect.left}px)`,
				width: `${activeRect.width}px`,
				opacity: 1,
			}
		}
		else {
			indicatorStyle.value.opacity = 0
		}
	})
}

function updateMobileNavIndicator() {
	nextTick(() => {
		if (!mobileNavContainerRef.value)
			return
		const activeEl = mobileNavContainerRef.value.querySelector<HTMLElement>('[data-active="true"]')
		if (activeEl) {
			const containerRect = mobileNavContainerRef.value.getBoundingClientRect()
			const activeRect = activeEl.getBoundingClientRect()
			mobileIndicatorStyle.value = {
				transform: `translateX(${activeRect.left - containerRect.left}px)`,
				width: `${activeRect.width}px`,
				opacity: 1,
			}
		}
		else {
			mobileIndicatorStyle.value.opacity = 0
		}
	})
}

function onMobileTabClick() {
	setTimeout(updateMobileNavIndicator, 20)
}

watch(() => [route.path, locale.value], () => {
	updateNavIndicator()
	updateMobileNavIndicator()
	setTimeout(() => {
		updateNavIndicator()
		updateMobileNavIndicator()
	}, 100)
}, { immediate: true })

onMounted(() => {
	updateNavIndicator()
	updateMobileNavIndicator()
	window.addEventListener('resize', updateNavIndicator)
	window.addEventListener('resize', updateMobileNavIndicator)
})

onUnmounted(() => {
	window.removeEventListener('resize', updateNavIndicator)
	window.removeEventListener('resize', updateMobileNavIndicator)
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
			aria-hidden="true"
			class="backdrop-blur-xs pointer-events-auto fixed inset-0 z-40 bg-black/20 md:hidden dark:bg-black/40"
			@click="mobileOpen = false"
		/>
	</Transition>

	<header
		ref="headerContainerRef"
		class="pointer-events-none sticky top-4 z-50 w-full"
	>
		<div class="pointer-events-auto container-bento flex items-center justify-between gap-2 sm:gap-4">
			<!-- Island 1: Logo & Brand -->
			<NuxtLink
				:to="localePath('/')"
				aria-label="permadi.dev"
				class="flex nav-island items-center gap-2 px-2.5 py-1.5 transition-all hover:(border-brand-500/40)"
			>
				<LogoNav size="28" />
				<span class="hidden text-sm text-slate-900 font-semibold tracking-tight font-heading sm:inline dark:text-white">permadi.dev</span>
			</NuxtLink>

			<!-- Island 2: Navigasi Utama Desktop (Sliding Pill Nav Bento) -->
			<nav
				ref="navContainerRef"
				aria-label="Desktop Navigation"
				class="relative hidden nav-island items-center px-1.5 py-1 md:flex"
			>
				<!-- Animated Sliding Indicator Pill (GPU Composited) -->
				<div
					class="shadow-2xs pointer-events-none absolute bottom-1 left-0 top-1 rounded-bento-island bg-brand-100/90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform dark:bg-brand-800/70"
					:style="{
						transform: indicatorStyle.transform,
						width: indicatorStyle.width,
						opacity: indicatorStyle.opacity,
					}"
				/>

				<NuxtLink
					v-for="item in navItems"
					:key="item.to"
					:data-active="isItemActive(item)"
					:to="item.to"
					class="relative z-10 rounded-bento-island px-3.5 py-1.5 text-sm font-medium transition-colors duration-200"
					:class="isItemActive(item)
						? 'text-brand-950 dark:text-brand-100 font-bold'
						: 'text-slate-900 dark:text-slate-100 hover:(text-brand-950 dark:text-brand-100)'"
				>
					{{ item.label }}
				</NuxtLink>
			</nav>

			<!-- Island 3: Aksi (Search + Theme + Lang + Contact [Desktop] + Mobile Hamburger) -->
			<div class="flex nav-island items-center gap-1.5 px-2 py-1.5 sm:gap-2 sm:px-2.5">
				<!-- Search Modal Trigger -->
				<AppSearchModal />

				<!-- Dark/Light Mode Toggle (Desktop only) -->
				<button
					type="button"
					:aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
					class="hidden icon-btn cursor-pointer items-center justify-center md:flex"
					@click="toggleDark($event)"
				>
					<span class="i-hugeicons-sun-01 text-lg text-slate-900 transition-colors dark:hidden hover:text-brand-700" />
					<span class="i-hugeicons-moon-02 hidden text-lg text-brand-300 transition-colors dark:inline hover:text-accent" />
				</button>

				<!-- Language Switcher Links (Desktop only) -->
				<div
					role="group"
					:aria-label="locale === 'id' ? 'Pilih Bahasa' : 'Choose Language'"
					class="relative grid-cols-2 hidden w-16 select-none items-center border border-slate-300/70 rounded-full bg-slate-200/80 p-0.5 text-xs font-semibold md:grid sm:w-20 dark:border-slate-700/50 dark:bg-slate-800/80"
				>
					<!-- Animated Sliding Pill Indicator -->
					<div
						class="shadow-xs pointer-events-none absolute bottom-0.5 left-0.5 top-0.5 w-[calc(50%-2px)] rounded-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] dark:bg-slate-700"
						:style="{ transform: locale === 'id' ? 'translateX(100%)' : 'translateX(0%)' }"
					/>

					<NuxtLink
						v-for="loc in locales"
						:key="loc.code"
						:aria-label="loc.name || loc.code.toUpperCase()"
						:to="switchLocalePath(loc.code)"
						class="relative z-10 rounded-full py-0.5 text-center text-[11px] transition-colors duration-200 sm:py-1 sm:text-xs"
						:class="loc.code === locale
							? 'text-slate-950 dark:text-white font-bold'
							: 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'"
					>
						{{ loc.code.toUpperCase() }}
					</NuxtLink>
				</div>

				<!-- Contact CTA (Desktop only) -->
				<NuxtLink
					:class="{ 'bg-brand-900': route.path.startsWith(contactPath) }"
					:to="contactPath"
					class="hidden btn-primary text-xs font-semibold md:inline-flex !px-3.5 !py-1.5"
				>
					{{ t('nav.contact') }}
				</NuxtLink>

				<!-- Mobile Hamburger Button -->
				<button
					type="button"
					aria-controls="mobile-navigation"
					:aria-expanded="mobileOpen"
					aria-label="Toggle navigation menu"
					class="icon-btn flex items-center justify-center md:hidden"
					@click="mobileOpen = !mobileOpen"
				>
					<span
						class="text-xl"
						:class="mobileOpen ? 'i-hugeicons-cancel-01' : 'i-hugeicons-menu-01'"
					/>
				</button>
			</div>
		</div>

		<!-- Mobile Dropdown Menu (Tentang, Darkmode, Lang, Kontak) -->
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
				id="mobile-navigation"
				aria-label="Mobile Secondary Navigation"
				class="pointer-events-auto container-bento mt-2 md:hidden"
			>
				<div class="flex flex-col gap-1 border border-slate-200/80 rounded-2xl bg-brand-50/95 p-3 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-brand-900/95">
					<!-- Tentang / About Link -->
					<NuxtLink
						:to="aboutPath"
						class="block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
						:class="route.path.startsWith(aboutPath)
							? 'bg-brand-200 dark:bg-brand-950/60 text-brand-900 dark:text-brand-200 font-semibold border border-brand-500/20'
							: 'text-slate-800 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'"
						@click="mobileOpen = false"
					>
						{{ t('nav.about') }}
					</NuxtLink>

					<!-- Mobile Settings: Theme Toggle & Language Switcher -->
					<div class="grid grid-cols-2 mt-1.5 gap-2 border-t border-slate-200/70 pt-2.5 dark:border-slate-800/80">
						<!-- Theme Switcher Button -->
						<button
							type="button"
							class="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-200 px-3 py-2 text-sm text-brand-900 font-medium transition-colors dark:bg-brand-800/80 hover:bg-brand-200/80 dark:text-brand-200 dark:hover:bg-brand-700/80"
							@click="toggleDark($event)"
						>
							<span class="i-hugeicons-sun-01 text-lg text-slate-900 dark:hidden" />
							<span class="i-hugeicons-moon-02 hidden text-lg text-white dark:inline" />
							<span class="text-xs font-semibold">{{ isDark ? 'Dark' : 'Light' }}</span>
						</button>

						<!-- Sliding Language Switcher Pills (Mobile) -->
						<div class="relative grid grid-cols-2 select-none items-center border border-brand-200/50 rounded-xl bg-brand-100 p-1 text-xs font-semibold dark:border-brand-700/50 dark:bg-slate-800/80">
							<!-- Animated Sliding Pill Indicator -->
							<div
								class="shadow-xs pointer-events-none absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-lg bg-brand-300 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] dark:bg-brand-700"
								:style="{ transform: locale === 'id' ? 'translateX(100%)' : 'translateX(0%)' }"
							/>

							<NuxtLink
								v-for="loc in locales"
								:key="loc.code"
								:to="switchLocalePath(loc.code)"
								class="relative z-10 rounded-lg py-1 text-center transition-colors duration-200"
								:class="loc.code === locale
									? 'text-brand-950 dark:text-brand-100 font-bold'
									: 'text-brand-900 dark:text-brand-50 hover:text-slate-900 dark:hover:text-white'"
								@click="mobileOpen = false"
							>
								{{ loc.code.toUpperCase() }}
							</NuxtLink>
						</div>
					</div>

					<!-- Contact CTA Button -->
					<NuxtLink
						:to="contactPath"
						class="mt-2 btn-primary rounded-xl text-center text-sm font-semibold !py-2.5"
						@click="mobileOpen = false"
					>
						{{ t('nav.contact') }}
					</NuxtLink>
				</div>
			</nav>
		</Transition>
	</header>

	<!-- Mobile Bottom Bento Navigation Dock (md:hidden) -->
	<ClientOnly>
		<Teleport to="body">
			<nav
				aria-label="Mobile Navigation"
				class="pointer-events-auto fixed inset-x-0 bottom-3.5 z-40 mx-auto w-fit select-none md:hidden"
			>
				<div
					ref="mobileNavContainerRef"
					class="relative flex items-center gap-1 border border-slate-200/80 rounded-2xl bg-white/90 p-1 shadow-lg shadow-slate-900/10 backdrop-blur-xl dark:border-[#134e43] dark:bg-[#00221e]/95 dark:shadow-black/60"
				>
					<!-- Sliding Bento Indicator Pill -->
					<div
						class="shadow-xs pointer-events-none absolute bottom-1 left-0 top-1 border border-brand-500/30 rounded-xl bg-brand-500/15 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform dark:border-brand-400/30 dark:bg-brand-400/20"
						:style="{
							transform: mobileIndicatorStyle.transform,
							width: mobileIndicatorStyle.width,
							opacity: mobileIndicatorStyle.opacity,
						}"
					/>

					<NuxtLink
						v-for="item in mobileNavItems"
						:key="item.to"
						:aria-current="isItemActive(item) ? 'page' : undefined"
						:data-active="isItemActive(item)"
						:to="item.to"
						:title="item.label"
						class="relative z-10 h-9.5 w-11 flex items-center justify-center rounded-xl transition-all duration-200 active:scale-95"
						:class="isItemActive(item)
							? 'text-brand-950 dark:text-brand-100'
							: 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'"
						@click="onMobileTabClick"
					>
						<span
							class="shrink-0 text-[18px] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
							:class="[item.icon, isItemActive(item) ? 'scale-115 text-brand-700 dark:text-brand-300' : '']"
							aria-hidden="true"
						/>
						<span class="sr-only">
							{{ item.label }}
						</span>
					</NuxtLink>
				</div>
			</nav>
		</Teleport>
	</ClientOnly>
</template>
