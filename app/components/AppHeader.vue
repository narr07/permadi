<script setup lang="ts">
import { onClickOutside, useEventListener, useScrollLock } from '@vueuse/core'

const { t, locale } = useI18n()
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

// Full-screen mobile panel: freeze the page behind it (scroll + focus), close on navigation
// Lock <html>, not <body>: body has overflow-x: clip, so overflow:hidden on it turns body into
// its own scroll container and the sticky header jumps off-screen when the page is scrolled.
const scrollLocked = useScrollLock(import.meta.client ? document.documentElement : null)
watch(mobileOpen, (open) => {
	scrollLocked.value = open
	document.querySelectorAll('#main, footer').forEach(el => el.toggleAttribute('inert', open))
})
watch(() => route.path, () => (mobileOpen.value = false))

const navItems = computed(() => [
	{
		label: t('nav.projects', locale.value === 'id' ? 'Projek' : 'Projects'),
		to: locale.value === 'id' ? '/id/projek' : '/projects',
		prefix: locale.value === 'id' ? '/id/projek' : '/projects',
	},
	{
		label: t('nav.blog', 'Blog'),
		to: localePath('/blog'),
		prefix: locale.value === 'id' ? '/id/blog' : '/blog',
	},
	{
		label: t('nav.gallery', locale.value === 'id' ? 'Galeri' : 'Gallery'),
		to: locale.value === 'id' ? '/id/galeri' : '/gallery',
		prefix: locale.value === 'id' ? '/id/galeri' : '/gallery',
	},
	{
		label: t('nav.about', locale.value === 'id' ? 'Tentang' : 'About'),
		to: locale.value === 'id' ? '/id/tentang' : '/about',
		prefix: locale.value === 'id' ? '/id/tentang' : '/about',
	},
	{
		label: t('nav.contact', locale.value === 'id' ? 'Kontak' : 'Contact'),
		to: locale.value === 'id' ? '/id/kontak' : '/contact',
		prefix: locale.value === 'id' ? '/id/kontak' : '/contact',
	},
])

function isItemActive(item: { to: string, prefix: string }): boolean {
	return route.path === item.to || route.path.startsWith(item.prefix)
}

onMounted(() => {
	const updateHeight = () => {
		if (headerContainerRef.value) {
			const h = headerContainerRef.value.getBoundingClientRect().height
			document.documentElement.style.setProperty('--app-header-height', `${h}px`)
		}
	}
	updateHeight()
	window.addEventListener('resize', updateHeight, { passive: true })
	if (typeof ResizeObserver !== 'undefined' && headerContainerRef.value) {
		const ro = new ResizeObserver(updateHeight)
		ro.observe(headerContainerRef.value)
	}
})
</script>

<template>
	<header
		ref="headerContainerRef"
		class="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white dark:border-[#134e43] dark:bg-[#001e1c]"
	>
		<div class="mx-auto max-w-6xl flex items-center justify-between px-4 py-3.5 lg:px-8 sm:px-6">
			<!-- Brand Mark & Identity -->
			<NuxtLink
				:to="localePath('/')"
				class="flex items-center gap-3 text-xs text-slate-900 font-bold tracking-wider font-mono uppercase transition-all duration-150 active:scale-[0.98] hover:scale-[1.01] dark:text-slate-50 hover:text-brand-600 dark:hover:text-brand-400"
			>
				<LogoNav size="24" />
				<span class="tracking-[0.12em]">DINAR PERMADI</span>
			</NuxtLink>

			<!-- Navigation & Utility Rail -->
			<div class="flex items-center gap-2 sm:gap-4">
				<!-- Desktop Nav Links -->
				<nav class="hidden items-center gap-5 text-xs font-mono md:flex">
					<NuxtLink
						v-for="item in navItems"
						:key="item.to"
						:to="item.to"
						class="nav-link relative py-1 tracking-wider uppercase transition-colors duration-200 active:scale-[0.97] hover:text-brand-600 dark:hover:text-brand-400"
						:class="isItemActive(item) ? 'is-active font-bold text-brand-700 dark:text-brand-400' : 'text-slate-700 dark:text-slate-300'"
					>
						{{ item.label.toUpperCase() }}
					</NuxtLink>
				</nav>

				<div class="hidden h-4 w-[1px] bg-slate-200 md:block dark:bg-[#134e43]" />

				<!-- Search Modal Trigger -->
				<AppSearchModal />

				<!-- Language Switcher -->
				<div class="hidden items-center gap-1 text-xs text-slate-700 font-mono sm:flex dark:text-slate-300">
					<NuxtLink
						:to="switchLocalePath('id')"
						class="px-1 py-0.5 transition-all duration-150 active:scale-90 hover:text-brand-500"
						:class="locale === 'id' ? 'font-bold text-brand-700 dark:text-brand-400 underline underline-offset-2' : ''"
					>
						ID
					</NuxtLink>
					<span class="text-slate-600 dark:text-slate-400">/</span>
					<NuxtLink
						:to="switchLocalePath('en')"
						class="px-1 py-0.5 transition-all duration-150 active:scale-90 hover:text-brand-500"
						:class="locale === 'en' ? 'font-bold text-brand-700 dark:text-brand-400 underline underline-offset-2' : ''"
					>
						EN
					</NuxtLink>
				</div>

				<!-- Theme Switcher -->
				<button
					type="button"
					:aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
					class="icon-btn"
					@click="toggleDark($event)"
				>
					<span class="i-carbon-sun shrink-0 text-base text-slate-800 dark:hidden" />
					<span class="i-carbon-moon hidden shrink-0 text-base text-accent dark:inline-block" />
				</button>

				<!-- Mobile Hamburger Button -->
				<button
					type="button"
					aria-controls="mobile-navigation"
					:aria-expanded="mobileOpen"
					aria-label="Toggle navigation menu"
					class="icon-btn md:hidden"
					@click="mobileOpen = !mobileOpen"
				>
					<span
						class="block text-base"
						:class="mobileOpen ? 'i-carbon-close' : 'i-carbon-menu'"
					/>
				</button>
			</div>
		</div>

		<!-- Mobile Dropdown Menu -->
		<Transition
			enter-active-class="transition duration-150 ease-out"
			enter-from-class="opacity-0 -translate-y-1"
			enter-to-class="opacity-100 translate-y-0"
			leave-active-class="transition duration-100 ease-in"
			leave-from-class="opacity-100 translate-y-0"
			leave-to-class="opacity-0 -translate-y-1"
		>
			<nav
				v-if="mobileOpen"
				id="mobile-navigation"
				aria-label="Mobile Secondary Navigation"
				class="fixed inset-x-0 bottom-0 top-[var(--app-header-height,65px)] flex flex-col overflow-y-auto border-t border-slate-200/80 bg-white md:hidden dark:border-[#134e43] dark:bg-[#001e1c]"
			>
				<NuxtLink
					v-for="(item, idx) in navItems"
					:key="item.to"
					:to="item.to"
					class="group flex items-baseline gap-4 border-b border-slate-200/80 px-4 py-5 dark:border-[#134e43] sm:px-6"
					:class="isItemActive(item) ? 'text-brand-700 dark:text-brand-400' : 'text-slate-900 dark:text-slate-50'"
					:aria-current="isItemActive(item) ? 'page' : undefined"
					@click="mobileOpen = false"
				>
					<span class="w-6 text-xs text-slate-500 font-mono dark:text-slate-400">{{ String(idx + 1).padStart(2, '0') }}</span>
					<span class="flex-1 text-2xl font-900 tracking-tight font-heading">{{ item.label }}</span>
					<!-- Arrow marks the current page only, so "active" isn't conveyed by color alone -->
					<span
						v-if="isItemActive(item)"
						class="i-carbon-arrow-right self-center text-base text-brand-600 dark:text-brand-400"
						aria-hidden="true"
					/>
				</NuxtLink>

				<div class="mt-auto flex items-center justify-between border-t border-slate-200/80 px-4 py-4 text-xs font-mono dark:border-[#134e43] sm:px-6">
					<span class="text-slate-600 tracking-wider uppercase dark:text-slate-400">{{ $t('common.language') }}</span>
					<div class="flex items-center">
						<NuxtLink
							:to="switchLocalePath('id')"
							class="h-10 w-12 flex items-center justify-center border border-slate-300 dark:border-[#134e43]"
							:class="locale === 'id' ? 'bg-brand-500 border-brand-500 text-slate-950 font-bold' : 'text-slate-700 dark:text-slate-300'"
						>ID</NuxtLink>
						<NuxtLink
							:to="switchLocalePath('en')"
							class="h-10 w-12 flex items-center justify-center border border-l-0 border-slate-300 dark:border-[#134e43]"
							:class="locale === 'en' ? 'bg-brand-500 border-brand-500 text-slate-950 font-bold' : 'text-slate-700 dark:text-slate-300'"
						>EN</NuxtLink>
					</div>
				</div>
			</nav>
		</Transition>
	</header>
</template>

<style scoped>
.nav-link {
	position: relative;
	display: inline-block;
}

.nav-link::after {
	content: '';
	position: absolute;
	left: 0;
	bottom: -2px;
	width: 100%;
	height: 2px;
	background-color: currentColor;
	transform: scaleX(0);
	transform-origin: left;
	transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-link:hover::after,
.nav-link.is-active::after {
	transform: scaleX(1);
}
</style>
