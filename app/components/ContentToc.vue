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
		showClose?: boolean
		showPin?: boolean
		isPinned?: boolean
	}>(),
	{
		links: () => [],
		title: '',
		mode: 'all',
		showClose: false,
		showPin: false,
		isPinned: false,
	},
)

const emit = defineEmits<{
	(e: 'close'): void
	(e: 'togglePin'): void
	(e: 'navigate', id: string): void
}>()

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
	return locale.value === 'id' ? 'DAFTAR ISI NASKAH' : 'TABLE OF CONTENTS'
})

function flattenWithLevel(links: TocLinkItem[], level = 0): { link: TocLinkItem, level: number }[] {
	return links.flatMap(l => [
		{ link: l, level },
		...(l.children ? flattenWithLevel(l.children, level + 1) : []),
	])
}

const flatList = computed(() => flattenWithLevel(props.links || []))

// Throttled real-time scrollspy tracker
const updateActiveHeading = useThrottleFn(() => {
	if (import.meta.server)
		return
	const flat = flatList.value
	if (!flat.length)
		return

	const offset = 140

	for (let i = flat.length - 1; i >= 0; i--) {
		const entry = flat[i]
		if (!entry)
			continue
		const item = entry.link
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
}, 100)

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
	emit('navigate', id)
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
		class="w-full font-mono text-xs"
		:aria-label="locale === 'id' ? 'Daftar Isi Artikel' : 'Table of Contents'"
	>
		<!-- 1. Mobile Swiss Sticky Accordion Bar -->
		<div
			v-if="mode === 'mobile' || mode === 'all'"
			ref="mobileContainerRef"
			class="w-full border-b border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#001e1c]"
			:class="mode === 'all' ? 'lg:hidden' : ''"
		>
			<button
				type="button"
				class="w-full px-4 py-3 flex items-center justify-between gap-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-[#002420]/50 cursor-pointer"
				:aria-expanded="mobileOpen"
				@click="mobileOpen = !mobileOpen"
			>
				<div class="flex items-center gap-2 font-bold tracking-wider uppercase text-[11px]">
					<span class="w-1.5 h-1.5 bg-brand-500 inline-block" />
					<span class="text-slate-900 dark:text-slate-50">{{ displayTitle }}</span>
					<span class="text-slate-900/40 dark:text-slate-50/40 tabular-nums">
						[{{ String(activeIndex + 1).padStart(2, '0') }}/{{ String(flatList.length).padStart(2, '0') }}]
					</span>
				</div>

				<div class="flex items-center gap-1.5 text-slate-900/60 dark:text-slate-50/60 text-xs">
					<span>{{ mobileOpen ? 'TUTUP' : 'LIHAT' }}</span>
					<span :class="mobileOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="text-sm" />
				</div>
			</button>

			<!-- Mobile Reading Progress Line -->
			<div class="w-full h-[2px] bg-slate-200/60 dark:bg-[#134e43]/60">
				<div
					class="h-full bg-brand-500 transition-all duration-200"
					:style="{ width: `${progressPercentage}%` }"
				/>
			</div>

			<!-- Mobile Expandable Index List -->
			<div
				v-if="mobileOpen"
				class="border-t border-slate-200/80 dark:border-[#134e43] max-h-72 overflow-y-auto divide-y divide-slate-200/60 dark:divide-[#134e43]/60 bg-slate-50/50 dark:bg-[#002420]/30"
			>
				<a
					v-for="(item, idx) in flatList"
					:key="item.link.id"
					:href="`#${item.link.id}`"
					class="flex items-baseline justify-between gap-3 px-4 py-2.5 transition-colors"
					:class="[
						item.level > 0 ? 'pl-8' : 'pl-4',
						item.link.id === activeId
							? 'bg-brand-500/10 text-brand-700 dark:text-accent font-bold border-l-2 border-brand-500'
							: 'text-slate-900/70 dark:text-slate-50/70 hover:text-brand-600 dark:hover:text-brand-400',
					]"
					@click.prevent="scrollToHeading(item.link.id)"
				>
					<span class="truncate">{{ item.link.text }}</span>
					<span class="shrink-0 tabular-nums text-[10px] text-slate-900/40 dark:text-slate-50/40">
						{{ String(idx + 1).padStart(2, '0') }}
					</span>
				</a>
			</div>
		</div>

		<!-- 2. Desktop Swiss Architectural Sidebar Rail -->
		<div
			v-if="mode === 'desktop' || mode === 'all'"
			class="w-full"
			:class="mode === 'all' ? 'hidden lg:block' : ''"
		>
			<div class="border border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#001e1c]">
				<!-- Masthead / Header of TOC -->
				<div class="p-4 border-b border-slate-200/80 dark:border-[#134e43] bg-slate-50/60 dark:bg-[#002420]/40 flex items-center justify-between">
					<div class="flex items-center gap-2 font-bold tracking-widest text-[11px] uppercase text-brand-700 dark:text-accent">
						<span class="w-2 h-2 bg-brand-500 inline-block" />
						<span>{{ displayTitle }}</span>
					</div>

					<div class="flex items-center gap-2">
						<span class="text-slate-900/50 dark:text-slate-50/50 tabular-nums text-[10px] font-bold">
							{{ String(activeIndex + 1).padStart(2, '0') }} / {{ String(flatList.length).padStart(2, '0') }}
						</span>

						<!-- Pin / Unpin Trigger -->
						<button
							v-if="showPin"
							type="button"
							class="text-slate-900/60 hover:text-brand-600 dark:text-slate-50/60 dark:hover:text-accent text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer px-1.5 py-0.5 border border-slate-300 dark:border-[#134e43]"
							:title="isPinned ? 'Lepas Sematan' : 'Sematkan ke Sisi'"
							@click="emit('togglePin')"
						>
							{{ isPinned ? 'LEPAS' : 'SEMAT' }}
						</button>

						<!-- Close / Collapse Trigger -->
						<button
							v-if="showClose"
							type="button"
							class="text-slate-900/60 hover:text-rose-600 dark:text-slate-50/60 dark:hover:text-rose-400 text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer px-1.5 py-0.5 border border-slate-300 dark:border-[#134e43]"
							:title="locale === 'id' ? 'Tutup Daftar Isi' : 'Close Table of Contents'"
							@click="emit('close')"
						>
							✕
						</button>
					</div>
				</div>

				<!-- Hairline Reading Progress Gauge -->
				<div
					role="progressbar"
					:aria-valuenow="progressPercentage"
					aria-valuemin="0"
					aria-valuemax="100"
					class="w-full h-[2px] bg-slate-200/60 dark:bg-[#134e43]/60"
				>
					<div
						class="h-full bg-brand-500 transition-all duration-200"
						:style="{ width: `${progressPercentage}%` }"
					/>
				</div>

				<!-- Sequential Tabular Index List -->
				<div class="max-h-[calc(100vh-14rem)] overflow-y-auto divide-y divide-slate-100 dark:divide-[#134e43]/40">
					<a
						v-for="(item, idx) in flatList"
						:key="item.link.id"
						:href="`#${item.link.id}`"
						class="group flex items-baseline justify-between gap-3 p-3 transition-colors text-xs"
						:class="[
							item.level > 0 ? 'pl-6' : 'pl-3',
							item.link.id === activeId
								? 'bg-slate-100/80 dark:bg-[#002420] text-brand-700 dark:text-accent font-bold border-l-2 border-brand-500'
								: 'text-slate-900/75 dark:text-slate-50/75 hover:bg-slate-50 dark:hover:bg-[#002420]/40 hover:text-brand-600 dark:hover:text-brand-400',
						]"
						@click.prevent="scrollToHeading(item.link.id)"
					>
						<span class="truncate leading-snug">{{ item.link.text }}</span>
						<span
							class="shrink-0 text-[10px] tabular-nums font-mono"
							:class="item.link.id === activeId ? 'text-brand-600 dark:text-accent font-bold' : 'text-slate-900/40 dark:text-slate-50/40 group-hover:text-slate-900 dark:group-hover:text-slate-50'"
						>
							{{ String(idx + 1).padStart(2, '0') }}
						</span>
					</a>
				</div>

				<!-- Back to Top Trigger -->
				<div class="p-3 border-t border-slate-200/80 dark:border-[#134e43] bg-slate-50/60 dark:bg-[#002420]/40">
					<button
						type="button"
						class="w-full py-1.5 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-900/70 hover:text-brand-600 dark:text-slate-50/70 dark:hover:text-brand-400 transition-colors cursor-pointer"
						@click="scrollToTop"
					>
						<span class="i-lucide-arrow-up text-xs" />
						<span>{{ locale === 'id' ? 'KEMBALI KE PUNCAK' : 'BACK TO TOP' }}</span>
					</button>
				</div>
			</div>
		</div>
	</nav>
</template>
