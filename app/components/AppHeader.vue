<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core'

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
</script>

<template>
	<header
		ref="headerContainerRef"
		class="sticky top-0 w-full border-b border-slate-200/80 bg-white dark:border-[#134e43] dark:bg-[#001e1c]"
	>
		<div class="mx-auto max-w-6xl flex items-center justify-between px-4 py-3.5 lg:px-8 sm:px-6">
			<!-- Brand Mark & Identity -->
			<NuxtLink
				:to="localePath('/')"
				aria-label="permadi.dev"
				class="flex items-center gap-3 text-xs text-slate-900 font-bold tracking-wider font-mono uppercase transition-all duration-150 active:scale-[0.98] hover:scale-[1.01] dark:text-slate-50 hover:text-brand-600 dark:hover:text-brand-400"
			>
				<LogoNav size="24" />
				<span class="tracking-[0.12em]">PERMADI.DEV // DINAR PERMADI</span>
			</NuxtLink>

			<!-- Navigation & Utility Rail -->
			<div class="flex items-center gap-4 sm:gap-6">
				<!-- Desktop Nav Links -->
				<nav class="hidden items-center gap-5 text-xs font-mono md:flex">
					<NuxtLink
						v-for="(item, idx) in navItems"
						:key="item.to"
						:to="item.to"
						class="transition-all duration-150 active:scale-[0.96] hover:text-brand-600 hover:-translate-y-0.5 dark:hover:text-brand-400"
						:class="isItemActive(item) ? 'font-bold text-brand-700 dark:text-brand-400 underline underline-offset-4' : 'text-slate-900/70 dark:text-slate-50/70'"
					>
						<span class="mr-1 text-slate-900/40 dark:text-slate-50/40">0{{ idx + 1 }} /</span>
						<span>{{ item.label.toUpperCase() }}</span>
					</NuxtLink>
				</nav>

				<div class="hidden h-4 w-[1px] bg-slate-200 md:block dark:bg-[#134e43]" />

				<!-- Search Modal Trigger -->
				<AppSearchModal />

				<!-- Language Switcher -->
				<div class="hidden items-center gap-1 text-xs text-slate-900/70 font-mono sm:flex dark:text-slate-50/70">
					<NuxtLink
						:to="switchLocalePath('id')"
						class="px-1 py-0.5 transition-all duration-150 active:scale-90 hover:text-brand-500"
						:class="locale === 'id' ? 'font-bold text-brand-700 dark:text-brand-400 underline underline-offset-2' : ''"
					>
						ID
					</NuxtLink>
					<span class="text-slate-900/30 dark:text-slate-50/30">/</span>
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
					class="inline-flex cursor-pointer items-center justify-center p-1.5 text-slate-700 transition-all duration-150 active:scale-90 hover:scale-110 dark:text-slate-200 hover:text-brand-600 dark:hover:text-accent"
					@click="toggleDark($event)"
				>
					<ClientOnly>
						<span
							class="shrink-0 text-base transition-transform duration-300"
							:class="isDark ? 'i-ph-moon text-accent rotate-[-12deg]' : 'i-ph-sun text-slate-700 rotate-0'"
						/>
						<template #fallback>
							<span class="i-ph-sun shrink-0 text-base dark:hidden" />
							<span class="i-ph-moon hidden shrink-0 text-base text-accent dark:inline-block" />
						</template>
					</ClientOnly>
				</button>

				<!-- Mobile Hamburger Button -->
				<button
					type="button"
					aria-controls="mobile-navigation"
					:aria-expanded="mobileOpen"
					aria-label="Toggle navigation menu"
					class="cursor-pointer p-1 text-slate-900 transition-transform duration-150 md:hidden active:scale-90 dark:text-slate-50"
					@click="mobileOpen = !mobileOpen"
				>
					<span
						class="text-xl"
						:class="mobileOpen ? 'i-ph-x' : 'i-ph-list'"
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
				class="border-t border-slate-200/80 bg-white px-4 py-4 md:hidden dark:border-[#134e43] dark:bg-[#001e1c]"
			>
				<div class="flex flex-col text-sm font-mono divide-y divide-slate-100 dark:divide-[#134e43]">
					<NuxtLink
						v-for="(item, idx) in navItems"
						:key="item.to"
						:to="item.to"
						class="flex items-center justify-between py-3"
						:class="isItemActive(item) ? 'font-bold text-brand-600 dark:text-brand-400' : 'text-slate-900/80 dark:text-slate-50/80'"
						@click="mobileOpen = false"
					>
						<span>0{{ idx + 1 }} / {{ item.label.toUpperCase() }}</span>
						<span class="i-ph-arrow-right text-xs text-slate-400" />
					</NuxtLink>

					<div class="flex items-center justify-between pt-3">
						<span class="text-xs text-slate-900/50 dark:text-slate-50/50">BAHASA</span>
						<div class="flex items-center gap-3">
							<NuxtLink
								:to="switchLocalePath('id')"
								:class="locale === 'id' ? 'font-bold text-brand-500' : ''"
							>ID</NuxtLink>
							<span>/</span>
							<NuxtLink
								:to="switchLocalePath('en')"
								:class="locale === 'en' ? 'font-bold text-brand-500' : ''"
							>EN</NuxtLink>
						</div>
					</div>
				</div>
			</nav>
		</Transition>
	</header>
</template>
