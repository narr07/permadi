<script setup lang="ts">
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
			highlight?: boolean
			highlightVariant?: 'circuit' | 'straight'
			mode?: 'mobile' | 'desktop' | 'all'
		}>(),
		{
			links: () => [],
			title: '',
			highlight: true,
			highlightVariant: 'circuit',
			mode: 'all',
		}
	)

	const { locale } = useI18n()

	const mobileOpen = ref(false)
	const activeId = ref<string>('')
	const contentRef = ref<HTMLElement | null>(null)
	const mobileContainerRef = ref<HTMLElement | null>(null)

	const displayTitle = computed(() => {
		if (props.title) return props.title
		return locale.value === 'id' ? 'Daftar Isi' : 'Table of Contents'
	})

	function flattenLinks(links: TocLinkItem[]): TocLinkItem[] {
		return links.flatMap((l) => [l, ...(l.children ? flattenLinks(l.children) : [])])
	}

	function flattenWithLevel(links: TocLinkItem[], level = 0): { link: TocLinkItem, level: number }[] {
		return links.flatMap((l) => [
			{ link: l, level },
			...(l.children ? flattenWithLevel(l.children, level + 1) : []),
		])
	}

	const flatList = computed(() => flattenWithLevel(props.links || []))

	// Real-time Scrollspy Tracker
	function updateActiveHeading() {
		if (import.meta.server) return
		const flat = flattenLinks(props.links || [])
		if (!flat.length) return

		const offset = 120

		for (let i = flat.length - 1; i >= 0; i--) {
			const item = flat[i]
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
			activeId.value = flat[0].id
		}
	}

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

	const activeIndex = computed(() => {
		return flatList.value.findIndex((item) => item.link.id === activeId.value)
	})

	const activeHeadingText = computed(() => {
		return flatList.value.find((i) => i.link.id === activeId.value)?.link.text || flatList.value[0]?.link.text || ''
	})

	const linkHeight = 2.0 // 2.0rem = 32px per item (h-8)

	// Nuxt UI Circuit SVG Mask Generator: Masking wadah agar warna aktif mengikuti persis alur sirkuit
	const circuitSvgStyle = computed(() => {
		if (!props.highlight || props.highlightVariant !== 'circuit' || !flatList.value.length) {
			return null
		}

		const flatLinks = flatList.value
		const svgUnit = 16
		const svgLinkHeight = linkHeight * svgUnit
		const svgHeight = flatLinks.length * svgLinkHeight
		const x0 = 1.5
		const x1 = 10.5

		let path = ''
		let currentX = x0
		let y = 0

		flatLinks.forEach((item, index) => {
			const targetX = item.level > 0 ? x1 : x0
			const nextY = y + svgLinkHeight

			if (index === 0) {
				path += `M${targetX} ${y}`
				currentX = targetX
			}

			if (targetX !== currentX) {
				path += ` L${targetX} ${y + 6}`
				currentX = targetX
			}

			path += ` L${currentX} ${nextY - (index < flatLinks.length - 1 && flatLinks[index + 1]?.level !== item.level ? 6 : 0)}`
			y = nextY
		})

		const svgPath = encodeURIComponent(
			`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 ${svgHeight}'><path d='${path}' stroke='black' stroke-width='1.5' fill='none'/></svg>`
		)

		return {
			width: '0.75rem',
			height: `${flatLinks.length * linkHeight}rem`,
			maskImage: `url("data:image/svg+xml,${svgPath}")`,
			WebkitMaskImage: `url("data:image/svg+xml,${svgPath}")`,
			maskRepeat: 'no-repeat',
			WebkitMaskRepeat: 'no-repeat',
			maskSize: '100% 100%',
			WebkitMaskSize: '100% 100%',
		}
	})

	function toggleMobile(event: Event) {
		event.stopPropagation()
		event.preventDefault()
		mobileOpen.value = !mobileOpen.value
	}

	// Close on click outside (mobile)
	function handleClickOutside(event: Event) {
		const target = event.target as Node | null
		if (mobileContainerRef.value && target && !mobileContainerRef.value.contains(target)) {
			mobileOpen.value = false
		}
	}

	onMounted(() => {
		nextTick(() => {
			updateActiveHeading()
			window.addEventListener('scroll', updateActiveHeading, { passive: true })
			document.addEventListener('click', handleClickOutside)
			document.addEventListener('touchstart', handleClickOutside, { passive: true })
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
		document.removeEventListener('click', handleClickOutside)
		document.removeEventListener('touchstart', handleClickOutside)
	})
</script>

<template>
	<nav v-if="links && links.length > 0" class="content-toc w-full pointer-events-auto" aria-label="Table of contents">
		<!-- 1. Mobile Sticky Island Floating Bar (Fixed persis di bawah Navbar saat di-scroll) -->
		<div
			v-if="mode === 'mobile' || mode === 'all'"
			ref="mobileContainerRef"
			class="w-full transition-all duration-300 pointer-events-auto"
			:class="mode === 'all' ? 'lg:hidden' : ''"
		>
			<div
				class="bg-white/95 dark:bg-[#002b27]/95 backdrop-blur-xl border border-slate-200/80 dark:border-[#134e43] shadow-md transition-all duration-300 cursor-pointer"
				:class="mobileOpen ? 'rounded-2xl p-4' : 'rounded-full px-4 py-2.5'"
			>
				<!-- Trigger Bar -->
				<button
					type="button"
					class="w-full flex items-center justify-between gap-3 text-left cursor-pointer select-none touch-manipulation"
					aria-label="Toggle Table of Contents"
					@click.stop="toggleMobile"
					@touchend.stop="toggleMobile"
				>
					<div class="flex items-center gap-2.5 min-w-0 flex-1">
						<span class="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-600 dark:text-[#f9bc60] flex items-center justify-center shrink-0 pointer-events-none">
							<span class="i-hugeicons-book-open-01 text-xs" />
						</span>
						<div class="min-w-0 flex-1 pointer-events-none">
							<div class="flex items-center gap-1.5 text-xs">
								<span class="font-heading font-semibold text-slate-900 dark:text-[#f9bc60] uppercase tracking-wider text-[10px]">
									{{ displayTitle }}
								</span>
							</div>
							<p class="text-xs text-slate-600 dark:text-slate-300 font-medium truncate">
								{{ activeHeadingText }}
							</p>
						</div>
					</div>

					<div class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400 pointer-events-none">
						<span
							:class="mobileOpen ? 'i-hugeicons-arrow-up-01' : 'i-hugeicons-arrow-down-01'"
							class="text-xs transition-transform duration-200"
						/>
					</div>
				</button>

				<!-- Expanded Dropdown Menu with EXACT Circuit Line Highlight -->
				<div
					v-if="mobileOpen"
					class="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 max-h-[60vh] overflow-y-auto animate-fade-in relative pl-5"
				>
					<!-- Circuit Line Masked Indicator on Mobile -->
					<div
						v-if="highlight && highlightVariant === 'circuit' && circuitSvgStyle"
						class="absolute left-0 top-3 overflow-hidden pointer-events-none"
						:style="circuitSvgStyle"
					>
						<!-- Inactive Circuit Background -->
						<div class="absolute inset-0 bg-slate-200 dark:bg-slate-800" />
						
						<!-- Active Highlight yang Mengikuti Jalur Sirkuit -->
						<div
							v-if="activeIndex >= 0"
							class="absolute inset-x-0 bg-brand-500 dark:bg-[#f9bc60] transition-all duration-300 ease-out"
							:style="{
								top: `${activeIndex * linkHeight}rem`,
								height: `${linkHeight}rem`
							}"
						/>
					</div>

					<!-- Straight Line Alternative -->
					<div
						v-else-if="highlight"
						class="absolute left-0 top-3 bottom-0 w-[1.5px] bg-slate-200 dark:bg-slate-800 overflow-hidden"
					>
						<div
							v-if="activeIndex >= 0"
							class="absolute left-0 w-full bg-brand-500 dark:bg-[#f9bc60] transition-all duration-300 ease-out"
							:style="{
								top: `${activeIndex * linkHeight}rem`,
								height: `${linkHeight}rem`
							}"
						/>
					</div>

					<!-- Links List -->
					<ul class="space-y-0">
						<li
							v-for="item in flatList"
							:key="item.link.id"
							class="h-8 flex items-center"
						>
							<a
								:href="`#${item.link.id}`"
								class="text-xs transition-all truncate block w-full py-1 hover:translate-x-0.5"
								:class="[
									item.level > 0 ? 'pl-3 text-[11px]' : '',
									item.link.id === activeId
										? 'text-brand-600! dark:text-[#f9bc60]! font-semibold'
										: 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
								]"
								@click.prevent="scrollToHeading(item.link.id)"
							>
								{{ item.link.text }}
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- 2. Desktop Sticky Sidebar TOC (Fixed di Kolom Kanan saat Artikel di-Scroll) -->
		<div
			v-if="mode === 'desktop' || mode === 'all'"
			class="w-full"
			:class="mode === 'all' ? 'hidden lg:block' : ''"
		>
			<div class="p-4 rounded-bento bg-white/70 dark:bg-[#002b27]/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800/70 shadow-xs">
				<!-- Header Title -->
				<div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
					<span class="i-hugeicons-book-open-01 text-brand-500 text-sm" />
					<h4 class="font-heading font-semibold text-xs text-slate-900 dark:text-[#f9bc60] uppercase tracking-wider">
						{{ displayTitle }}
					</h4>
				</div>

				<!-- Tree List Container dengan Circuit Line Masking -->
				<div ref="contentRef" class="relative pl-5 max-h-[calc(100vh-12rem)] overflow-y-auto">
					<!-- Circuit Line Structure (Warna Jalur Aktif & Pasif Mengikuti Persis Lekukan Sirkuit) -->
					<div
						v-if="highlight && highlightVariant === 'circuit' && circuitSvgStyle"
						class="absolute left-0 top-0 overflow-hidden pointer-events-none"
						:style="circuitSvgStyle"
					>
						<!-- Inactive Circuit Background -->
						<div class="absolute inset-0 bg-slate-200 dark:bg-slate-800" />
						
						<!-- Active Highlight yang Mengikuti Jalur Sirkuit -->
						<div
							v-if="activeIndex >= 0"
							class="absolute inset-x-0 bg-brand-500 dark:bg-[#f9bc60] transition-all duration-300 ease-out"
							:style="{
								top: `${activeIndex * linkHeight}rem`,
								height: `${linkHeight}rem`
							}"
						/>
					</div>

					<!-- Straight Line Indicator Alternatif -->
					<div
						v-else-if="highlight"
						class="absolute left-0 top-0 bottom-0 w-[1.5px] bg-slate-200 dark:bg-slate-800 overflow-hidden"
					>
						<div
							v-if="activeIndex >= 0"
							class="absolute left-0 w-full bg-brand-500 dark:bg-[#f9bc60] transition-all duration-300 ease-out"
							:style="{
								top: `${activeIndex * linkHeight}rem`,
								height: `${linkHeight}rem`
							}"
						/>
					</div>

					<!-- Link List -->
					<ul class="space-y-0">
						<li
							v-for="item in flatList"
							:key="item.link.id"
							class="h-8 flex items-center"
						>
							<a
								:href="`#${item.link.id}`"
								class="text-xs transition-all truncate block w-full py-1 hover:translate-x-0.5"
								:class="[
									item.level > 0 ? 'pl-3 text-[11px]' : '',
									item.link.id === activeId
										? 'text-brand-600! dark:text-[#f9bc60]! font-semibold'
										: 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
								]"
								@click.prevent="scrollToHeading(item.link.id)"
							>
								{{ item.link.text }}
							</a>
						</li>
					</ul>
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
	border-radius: 2px;
}
</style>
