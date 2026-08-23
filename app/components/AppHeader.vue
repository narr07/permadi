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
		if (!navContainerRef.value)
			return
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
			class="backdrop-blur-xs pointer-events-auto fixed inset-0 z-40 bg-black/20 md:hidden dark:bg-black/40"
			aria-hidden="true"
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
				class="flex nav-island items-center gap-2 px-2.5 py-1.5 transition-all hover:(border-brand-500/40)"
				aria-label="permadi.dev"
			>
				<Logo size="28" />
				<span class="hidden text-g1 text-slate-900 font-semibold tracking-tight font-heading sm:inline dark:text-white">permadi.dev</span>
			</NuxtLink>

			<!-- Island 2: Navigasi Utama (Sliding Pill Nav Bento) -->
			<nav
				ref="navContainerRef"
				class="relative hidden nav-island items-center px-1.5 py-1 md:flex"
			>
				<!-- Animated Sliding Indicator Pill -->
				<div
					class="shadow-2xs pointer-events-none absolute bottom-1 top-1 rounded-bento-island bg-brand-100/90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] dark:bg-brand-800/70"
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
					class="relative z-10 rounded-bento-island px-3.5 py-1.5 text-g1 font-medium transition-colors duration-200"
					:class="isItemActive(item)
						? 'text-brand-950 dark:text-brand-100 font-bold'
						: 'text-slate-900 dark:text-slate-100 hover:(text-brand-950 dark:text-brand-100)'"
				>
					{{ item.label }}
				</NuxtLink>
			</nav>

			<!-- Island 3: Aksi (Search + Theme + Lang + Contact + Mobile Toggle) -->
			<div class="flex nav-island items-center gap-2 px-2.5 py-1.5">
				<!-- Search Modal Trigger -->
				<AppSearchModal />

				<!-- Dark/Light Mode Toggle -->
				<button
					type="button"
					class="hidden icon-btn cursor-pointer items-center justify-center md:flex"
					:aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
					@click="toggleDark($event)"
				>
					<span class="i-hugeicons-sun-01 text-lg text-amber-500 dark:hidden" />
					<span class="i-hugeicons-moon-02 hidden text-lg text-brand-300 dark:inline" />
				</button>

				<!-- Language Switcher Links -->
				<div
					role="group"
					:aria-label="locale === 'id' ? 'Pilih Bahasa' : 'Choose Language'"
					class="relative grid-cols-2 hidden w-20 select-none items-center border border-slate-300/70 rounded-full bg-slate-200/80 p-0.5 text-xs font-semibold md:grid dark:border-slate-700/50 dark:bg-slate-800/80"
				>
					<!-- Animated Sliding Pill Indicator -->
					<div
						class="shadow-xs pointer-events-none absolute bottom-0.5 left-0.5 top-0.5 w-[calc(50%-2px)] rounded-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] dark:bg-slate-700"
						:style="{ transform: locale === 'id' ? 'translateX(100%)' : 'translateX(0%)' }"
					/>

					<NuxtLink
						v-for="loc in locales"
						:key="loc.code"
						:to="switchLocalePath(loc.code)"
						:aria-label="loc.name || loc.code.toUpperCase()"
						class="relative z-10 rounded-full py-1 text-center transition-colors duration-200"
						:class="loc.code === locale
							? 'text-slate-950 dark:text-white font-bold'
							: 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'"
					>
						{{ loc.code.toUpperCase() }}
					</NuxtLink>
				</div>

				<!-- Contact CTA (Desktop only) -->
				<NuxtLink
					:to="contactPath"
					class="hidden btn-primary text-xs font-semibold md:inline-flex !px-3.5 !py-1.5"
					:class="{ 'bg-brand-900': route.path.startsWith(contactPath) }"
				>
					{{ t('nav.contact') }}
				</NuxtLink>

				<!-- Mobile Hamburger Button -->
				<button
					type="button"
					class="icon-btn md:hidden"
					aria-label="Toggle navigation menu"
					:aria-expanded="mobileOpen"
					aria-controls="mobile-navigation"
					@click="mobileOpen = !mobileOpen"
				>
					<span
						:class="mobileOpen ? 'i-hugeicons-cancel-01' : 'i-hugeicons-menu-01'"
						class="text-xl"
					/>
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
				id="mobile-navigation"
				aria-label="Mobile Navigation"
				class="pointer-events-auto container-bento mt-2 md:hidden"
			>
				<div class="flex flex-col gap-1 border border-slate-200/80 rounded-2xl bg-brand-50/95 p-3 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-brand-900/95">
					<NuxtLink
						v-for="item in navItems"
						:key="item.to"
						:to="item.to"
						class="block rounded-xl px-4 py-2.5 text-g1 font-medium transition-colors"
						:class="isItemActive(item)
							? 'bg-brand-200 dark:bg-brand-950/60 text-brand-900 dark:text-brand-200 font-semibold border border-brand-500/20'
							: 'text-slate-800 dark:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/50'"
						@click="mobileOpen = false"
					>
						{{ item.label }}
					</NuxtLink>

					<!-- Mobile Settings: Theme Toggle & Language Switcher -->
					<div class="grid grid-cols-2 mt-1.5 gap-2 border-t border-slate-100 pt-2.5 dark:border-slate-800/80">
						<!-- Theme Switcher Button -->
						<button
							type="button"
							class="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-200 px-3 py-2 text-g1 text-brand-900 font-medium transition-colors dark:bg-brand-800/80 hover:bg-brand-200/80 dark:text-brand-200 dark:hover:bg-brand-700/80"
							@click="toggleDark($event)"
						>
							<span class="i-hugeicons-sun-01 text-lg text-brand-900 dark:hidden" />
							<span class="i-hugeicons-moon-02 hidden text-lg text-brand-100 dark:inline" />
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
						class="mt-2 btn-primary rounded-xl text-center text-g1 font-semibold !py-2.5"
						@click="mobileOpen = false"
					>
						{{ t('nav.contact') }}
					</NuxtLink>
				</div>
			</nav>
		</Transition>
	</header>
</template>
