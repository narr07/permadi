<script setup lang="ts">
import { onClickOutside, useThrottleFn } from '@vueuse/core'

export interface TocLinkItem {
	id: string
	text: string
	depth?: number
	children?: TocLinkItem[]
}

const props = withDefaults(
	defineProps<{
		links?: TocLinkItem[]
		title?: string
		mode?: 'mobile' | 'desktop' | 'all'
	}>(),
	{
		links: () => [],
		title: '',
		mode: 'all',
	},
)

const { locale } = useI18n()

const mobileOpen = ref(false)
const activeId = ref<string>('')
const mobileContainerRef = ref<HTMLElement | null>(null)

onClickOutside(mobileContainerRef, () => {
	if (mobileOpen.value) {
		mobileOpen.value = false
	}
})

const displayTitle = computed(() => {
	if (props.title)
		return props.title
	return locale.value === 'id' ? 'Daftar Isi' : 'Table of Contents'
})

function flattenWithLevel(links: TocLinkItem[], level = 0): { link: TocLinkItem, level: number }[] {
	return links.flatMap(l => [
		{ link: l, level },
		...(l.children ? flattenWithLevel(l.children, level + 1) : []),
	])
}

const flatList = computed(() => flattenWithLevel(props.links || []))

// Throttled Real-time Scrollspy Tracker (ringan & hemat CPU)
const updateActiveHeading = useThrottleFn(() => {
	if (import.meta.server)
		return
	const flat = flatList.value
	if (!flat.length)
		return

	const offset = 120

	for (let i = flat.length - 1; i >= 0; i--) {
		const item = flat[i].link
		const el = document.getElementById(item.id)
		if (el) {
			const rect = el.getBoundingClientRect()
			if (rect.top <= offset) {
				activeId.value = item.id
				return
			}
		}
	}

	if (flat[0]) {
		activeId.value = flat[0].link.id
	}
}, 120)

function scrollToHeading(id: string) {
	const target = document.getElementById(id)
	if (target) {
		const offset = 90
		const bodyRect = document.body.getBoundingClientRect().top
		const elementRect = target.getBoundingClientRect().top
		const elementPosition = elementRect - bodyRect
		const offsetPosition = elementPosition - offset

		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth',
		})
		activeId.value = id
		history.replaceState(null, '', `#${encodeURIComponent(id)}`)
	}
	mobileOpen.value = false
}

function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth',
	})
}

const activeIndex = computed(() => {
	const idx = flatList.value.findIndex(item => item.link.id === activeId.value)
	return idx >= 0 ? idx : 0
})

const progressPercentage = computed(() => {
	if (!flatList.value.length)
		return 0
	return Math.round(((activeIndex.value + 1) / flatList.value.length) * 100)
})

const desktopListRef = ref<HTMLElement | null>(null)
const mobileListRef = ref<HTMLElement | null>(null)

function autoScrollToc(container: HTMLElement | null, id: string) {
	if (!container || !id || !import.meta.client)
		return
	const selector = window.CSS?.escape ? `[data-toc-id="${CSS.escape(id)}"]` : `[data-toc-id="${id}"]`
	const activeEl = container.querySelector<HTMLElement>(selector)
	if (!activeEl)
		return

	const elTop = activeEl.offsetTop
	const elHeight = activeEl.offsetHeight
	const containerTop = container.scrollTop
	const containerHeight = container.clientHeight

	if (elTop + elHeight > containerTop + containerHeight) {
		container.scrollTo({
			top: elTop + elHeight - containerHeight + 8,
			behavior: 'smooth',
		})
	}
	else if (elTop < containerTop) {
		container.scrollTo({
			top: Math.max(0, elTop - 8),
			behavior: 'smooth',
		})
	}
}

watch(activeId, (newId) => {
	if (!newId || import.meta.server)
		return

	nextTick(() => {
		autoScrollToc(desktopListRef.value, newId)
		if (mobileOpen.value) {
			autoScrollToc(mobileListRef.value, newId)
		}
	})
})

onMounted(() => {
	nextTick(() => {
		updateActiveHeading()
		window.addEventListener('scroll', updateActiveHeading, { passive: true })
	})
})

watch(
	() => props.links,
	() => {
		nextTick(() => {
			updateActiveHeading()
		})
	},
	{ deep: true },
)

onUnmounted(() => {
	window.removeEventListener('scroll', updateActiveHeading)
})
</script>

<template>
	<nav
		v-if="links && links.length > 0"
		class="content-toc pointer-events-auto w-full"
		:aria-label="locale === 'id' ? 'Daftar Isi Artikel' : 'Table of Contents'"
	>
		<!-- 1. Mobile Bento Floating Island Bar -->
		<div
			v-if="mode === 'mobile' || mode === 'all'"
			ref="mobileContainerRef"
			class="pointer-events-auto w-full"
			:class="mode === 'all' ? 'lg:hidden' : ''"
		>
			<div class="border border-slate-200/80 rounded-2xl bg-white/95 px-3.5 py-2 shadow-md backdrop-blur-xl dark:border-[#134e43] dark:bg-[#002b27]/95 sm:p-3">
				<!-- Trigger Bar Button -->
				<button
					type="button"
					class="w-full flex cursor-pointer touch-manipulation select-none items-center justify-between gap-3 text-left focus:outline-none"
					:aria-expanded="mobileOpen"
					aria-controls="mobile-toc-list"
					:aria-label="locale === 'id' ? 'Buka atau tutup daftar isi' : 'Toggle Table of Contents'"
					@click="mobileOpen = !mobileOpen"
				>
					<div class="flex items-center gap-2">
						<span class="section-label text-[10px] text-brand-700 font-bold tracking-wider uppercase dark:text-brand-400">
							{{ displayTitle }}
						</span>
						<span class="border border-brand-200/50 rounded-full bg-brand-50/90 px-2 py-0.5 text-[10px] text-brand-800 font-bold font-mono dark:border-brand-900/50 dark:bg-brand-950/70 dark:text-brand-400">
							{{ activeIndex + 1 }}/{{ flatList.length }}
						</span>
					</div>

					<div class="h-6 w-6 flex shrink-0 items-center justify-center border border-slate-200/60 rounded-full bg-slate-100 text-slate-700 dark:border-[#134e43] dark:bg-[#042f27] dark:text-slate-300">
						<span
							:class="mobileOpen ? 'i-hugeicons-arrow-up-01' : 'i-hugeicons-arrow-down-01'"
							class="text-xs transition-transform duration-150"
						/>
					</div>
				</button>

				<!-- Expanded Dropdown Bento List (Fast Transition) -->
				<Transition
					enter-active-class="transition-all duration-200 ease-out"
					enter-from-class="opacity-0 max-h-0"
					enter-to-class="opacity-100 max-h-[60vh]"
					leave-active-class="transition-all duration-150 ease-in"
					leave-from-class="opacity-100 max-h-[60vh]"
					leave-to-class="opacity-0 max-h-0"
				>
					<div
						v-if="mobileOpen"
						id="mobile-toc-list"
						ref="mobileListRef"
						class="mt-3 max-h-60 overflow-y-auto border-t border-slate-200/60 pt-3 space-y-1 dark:border-[#134e43]"
					>
						<div
							role="progressbar"
							:aria-valuenow="progressPercentage"
							aria-valuemin="0"
							aria-valuemax="100"
							:aria-label="locale === 'id' ? 'Progres Membaca' : 'Reading Progress'"
							class="mb-3 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#042f27]"
						>
							<div
								class="h-full bg-brand-700 transition-all duration-300 ease-out dark:bg-brand-400"
								:style="{ width: `${progressPercentage}%` }"
							/>
						</div>

						<a
							v-for="(item, idx) in flatList"
							:key="item.link.id"
							:href="`#${item.link.id}`"
							:data-toc-id="item.link.id"
							class="group flex items-center justify-between gap-2 border border-transparent rounded-xl text-xs font-medium transition-all"
							:class="[
								item.level > 0 ? 'pl-5 pr-3 py-1.5 text-[11.5px]' : 'px-3 py-2',
								item.link.id === activeId
									? 'text-brand-900 dark:text-brand-400 bg-slate-100/80 dark:bg-white/5 font-bold'
									: 'text-slate-700 dark:text-slate-300 hover:(text-brand-900 dark:text-brand-400 border-brand-500/30 dark:border-brand-400/20 bg-slate-50/60 dark:bg-white/5)',
							]"
							@click.prevent="scrollToHeading(item.link.id)"
						>
							<span class="truncate">{{ item.link.text }}</span>
							<span
								class="shrink-0 text-[10px] font-mono"
								:class="item.link.id === activeId ? 'opacity-90 font-bold text-brand-900 dark:text-brand-400' : 'opacity-60 group-hover:opacity-100'"
							>
								{{ idx < 9 ? `0${idx + 1}` : idx + 1 }}
							</span>
						</a>
					</div>
				</Transition>
			</div>
		</div>

		<!-- 2. Desktop Bento Sticky Card Widget -->
		<div
			v-if="mode === 'desktop' || mode === 'all'"
			class="w-full"
			:class="mode === 'all' ? 'hidden lg:block' : ''"
		>
			<div class="bento-card-clean relative overflow-hidden border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-xl dark:border-[#134e43] dark:bg-[#002b27]/90 sm:p-4.5">
				<!-- Header Bento Section (Single-row clean alignment) -->
				<div class="mb-2.5 flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5 dark:border-slate-800/60">
					<span class="whitespace-nowrap text-[11px] text-brand-700 font-bold tracking-wider font-sans uppercase dark:text-brand-400">
						{{ displayTitle }}
					</span>
					<span class="shrink-0 whitespace-nowrap border border-brand-200/50 rounded-full bg-brand-50/90 px-2 py-0.5 text-[10px] text-brand-800 font-bold font-mono dark:border-brand-900/50 dark:bg-brand-950/70 dark:text-brand-400">
						{{ activeIndex + 1 }}/{{ flatList.length }}
					</span>
				</div>

				<!-- Reading Progress Bar -->
				<div
					role="progressbar"
					:aria-valuenow="progressPercentage"
					aria-valuemin="0"
					aria-valuemax="100"
					:aria-label="locale === 'id' ? 'Progres Membaca' : 'Reading Progress'"
					class="mb-3 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800/80"
				>
					<div
						class="h-full bg-brand-700 transition-all duration-300 ease-out dark:bg-brand-400"
						:style="{ width: `${progressPercentage}%` }"
					/>
				</div>

				<!-- Bento Items List (Active like Hover, Hover with Outline) -->
				<div
					ref="desktopListRef"
					class="max-h-[22vh] min-h-[3.5rem] overflow-y-auto pr-1 space-y-1"
				>
					<a
						v-for="(item, idx) in flatList"
						:key="item.link.id"
						:href="`#${item.link.id}`"
						:data-toc-id="item.link.id"
						class="group flex items-center justify-between gap-2.5 border border-transparent rounded-xl text-xs font-medium transition-all"
						:class="[
							item.level > 0 ? 'pl-5 pr-3 py-1.5 text-[11.5px]' : 'px-3 py-1.5',
							item.link.id === activeId
								? 'text-brand-900 dark:text-brand-400 bg-slate-100/80 dark:bg-white/5 font-bold'
								: 'text-slate-700 dark:text-slate-300 hover:(text-brand-900 dark:text-brand-400 border-brand-500/30 dark:border-brand-400/20 bg-slate-50/60 dark:bg-white/5)',
						]"
						@click.prevent="scrollToHeading(item.link.id)"
					>
						<span class="truncate">{{ item.link.text }}</span>
						<span
							class="shrink-0 text-[10px] font-mono transition-opacity"
							:class="item.link.id === activeId ? 'opacity-90 font-bold text-brand-900 dark:text-brand-400' : 'opacity-60 group-hover:opacity-100'"
						>
							{{ idx < 9 ? `0${idx + 1}` : idx + 1 }}
						</span>
					</a>
				</div>

				<!-- Bento Footer Action (Back to top) -->
				<div class="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2.5 text-[11px] dark:border-slate-800/60">
					<span class="text-slate-600 font-mono dark:text-slate-400">
						{{ progressPercentage }}% {{ locale === 'id' ? 'dibaca' : 'read' }}
					</span>
					<button
						type="button"
						class="inline-flex cursor-pointer items-center gap-1 text-slate-700 font-semibold transition-colors dark:text-slate-300 hover:text-brand-800 dark:hover:text-brand-400"
						:aria-label="locale === 'id' ? 'Kembali ke atas artikel' : 'Scroll to top of article'"
						@click="scrollToTop"
					>
						<span>{{ locale === 'id' ? 'Ke Atas' : 'Top' }}</span>
						<span class="i-hugeicons-arrow-up-01 text-xs" />
					</button>
				</div>
			</div>
		</div>
	</nav>
</template>

<style scoped>
.content-toc ::-webkit-scrollbar {
	width: 4px;
}
.content-toc ::-webkit-scrollbar-thumb {
	background: rgba(100, 116, 139, 0.2);
	border-radius: 4px;
}
.dark .content-toc ::-webkit-scrollbar-thumb {
	background: rgba(148, 163, 184, 0.2);
}
</style>
