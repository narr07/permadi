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
		}
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
		if (props.title) return props.title
		return locale.value === 'id' ? 'Daftar Isi' : 'Table of Contents'
	})

	function flattenWithLevel(links: TocLinkItem[], level = 0): { link: TocLinkItem, level: number }[] {
		return links.flatMap((l) => [
			{ link: l, level },
			...(l.children ? flattenWithLevel(l.children, level + 1) : []),
		])
	}

	const flatList = computed(() => flattenWithLevel(props.links || []))

	// Throttled Real-time Scrollspy Tracker (ringan & hemat CPU)
	const updateActiveHeading = useThrottleFn(() => {
		if (import.meta.server) return
		const flat = flatList.value
		if (!flat.length) return

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
		const idx = flatList.value.findIndex((item) => item.link.id === activeId.value)
		return idx >= 0 ? idx : 0
	})

	const activeHeadingText = computed(() => {
		return flatList.value.find((i) => i.link.id === activeId.value)?.link.text || flatList.value[0]?.link.text || ''
	})

	const progressPercentage = computed(() => {
		if (!flatList.value.length) return 0
		return Math.round(((activeIndex.value + 1) / flatList.value.length) * 100)
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
		{ deep: true }
	)

	onUnmounted(() => {
		window.removeEventListener('scroll', updateActiveHeading)
	})
</script>

<template>
	<nav
		v-if="links && links.length > 0"
		class="content-toc w-full pointer-events-auto"
		aria-label="Table of contents"
	>
		<!-- 1. Mobile Bento Floating Island Bar -->
		<div
			v-if="mode === 'mobile' || mode === 'all'"
			ref="mobileContainerRef"
			class="w-full pointer-events-auto"
			:class="mode === 'all' ? 'lg:hidden' : ''"
		>
			<div class="rounded-2xl bg-white/95 dark:bg-[#002b27]/95 backdrop-blur-xl border border-slate-200/80 dark:border-[#134e43] shadow-lg p-3">
				<!-- Trigger Bar Button -->
				<button
					type="button"
					class="w-full flex items-center justify-between gap-3 text-left cursor-pointer select-none touch-manipulation focus:outline-none"
					aria-label="Toggle Table of Contents"
					@click="mobileOpen = !mobileOpen"
				>
					<div class="flex items-center gap-2.5 min-w-0 flex-1">
						<span class="w-7 h-7 rounded-full bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-900/60 flex items-center justify-center shrink-0">
							<span class="i-hugeicons-book-open-01 text-xs" />
						</span>
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2 text-xs">
								<span class="section-label text-[10px] font-bold">
									{{ displayTitle }}
								</span>
								<span class="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-brand-50/90 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400">
									{{ activeIndex + 1 }}/{{ flatList.length }}
								</span>
							</div>
							<p class="text-xs text-slate-800 dark:text-slate-200 font-medium truncate mt-0.5">
								{{ activeHeadingText }}
							</p>
						</div>
					</div>

					<div class="w-7 h-7 rounded-full bg-slate-100 dark:bg-[#042f27] border border-slate-200/60 dark:border-[#134e43] flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-300">
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
						class="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 overflow-y-auto space-y-1"
					>
						<a
							v-for="(item, idx) in flatList"
							:key="item.link.id"
							:href="`#${item.link.id}`"
							class="flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-medium border border-transparent transition-all group"
							:class="[
								item.level > 0 ? 'ml-3 text-[11px]' : '',
								item.link.id === activeId
									? 'text-brand-600 dark:text-brand-400 bg-slate-100/80 dark:bg-white/5 font-semibold'
									: 'text-slate-600 dark:text-slate-300 hover:(text-brand-600 dark:text-brand-400 border-brand-500/30 dark:border-brand-400/20 bg-slate-50/60 dark:bg-white/5)'
							]"
							@click.prevent="scrollToHeading(item.link.id)"
						>
							<span class="truncate flex items-center gap-2">
								<span
									class="w-1.5 h-1.5 rounded-full shrink-0 transition-transform"
									:class="item.link.id === activeId ? 'bg-brand-500 dark:bg-brand-400 scale-125' : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-brand-400'"
								/>
								{{ item.link.text }}
							</span>
							<span
								class="text-[10px] font-mono shrink-0"
								:class="item.link.id === activeId ? 'opacity-90 font-bold text-brand-600 dark:text-brand-400' : 'opacity-40 group-hover:opacity-75'"
							>
								0{{ idx + 1 }}
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
			<div class="bento-card-clean p-5 relative overflow-hidden backdrop-blur-xl bg-white/90 dark:bg-[#002b27]/90 border border-slate-200/80 dark:border-[#134e43] shadow-sm">
				<!-- Header Bento Section -->
				<div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800/60">
					<div class="flex items-center gap-2">
						<span class="w-6 h-6 rounded-lg bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-900/60 flex items-center justify-center shrink-0">
							<span class="i-hugeicons-book-open-01 text-xs" />
						</span>
						<span class="section-label font-bold text-[11px]">
							{{ displayTitle }}
						</span>
					</div>
					<span class="text-[11px] font-mono px-2 py-0.5 rounded-full bg-brand-50/90 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 border border-brand-200/50 dark:border-brand-900/50">
						{{ activeIndex + 1 }} / {{ flatList.length }}
					</span>
				</div>

				<!-- Reading Progress Bar -->
				<div class="w-full bg-slate-100 dark:bg-slate-800/80 h-1 rounded-full mb-4 overflow-hidden">
					<div
						class="bg-brand-500 dark:bg-brand-400 h-full transition-all duration-300 ease-out"
						:style="{ width: `${progressPercentage}%` }"
					/>
				</div>

				<!-- Bento Items List (Active like Hover, Hover with Outline) -->
				<div class="max-h-[calc(100vh-16rem)] overflow-y-auto pr-1 space-y-1">
					<a
						v-for="(item, idx) in flatList"
						:key="item.link.id"
						:href="`#${item.link.id}`"
						class="flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs font-medium border border-transparent transition-all group"
						:class="[
							item.level > 0 ? 'ml-3.5 text-[11.5px]' : '',
							item.link.id === activeId
								? 'text-brand-600 dark:text-brand-400 bg-slate-100/80 dark:bg-white/5 font-semibold'
								: 'text-slate-600 dark:text-slate-300 hover:(text-brand-600 dark:text-brand-400 border-brand-500/30 dark:border-brand-400/20 bg-slate-50/60 dark:bg-white/5)'
						]"
						@click.prevent="scrollToHeading(item.link.id)"
					>
						<div class="min-w-0 flex items-center gap-2 truncate">
							<span
								class="w-1.5 h-1.5 rounded-full shrink-0 transition-all"
								:class="item.link.id === activeId ? 'bg-brand-500 dark:bg-brand-400 scale-125' : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-brand-400'"
							/>
							<span class="truncate">{{ item.link.text }}</span>
						</div>
						<span
							class="text-[10px] font-mono shrink-0 transition-opacity"
							:class="item.link.id === activeId ? 'opacity-90 font-bold text-brand-600 dark:text-brand-400' : 'opacity-40 group-hover:opacity-75'"
						>
							{{ idx < 9 ? `0${idx + 1}` : idx + 1 }}
						</span>
					</a>
				</div>

				<!-- Bento Footer Action (Back to top) -->
				<div class="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
					<span class="text-slate-400 dark:text-slate-500 font-mono">
						{{ progressPercentage }}% {{ locale === 'id' ? 'dibaca' : 'read' }}
					</span>
					<button
						type="button"
						class="inline-flex items-center gap-1 font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
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
