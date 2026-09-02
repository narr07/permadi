<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const props = withDefaults(
	defineProps<{
		modelValue?: string
		tags?: string[]
		counts?: Record<string, number>
		totalCount?: number
		allLabel?: string
		itemLabel?: string
		type?: 'blog' | 'project'
	}>(),
	{
		modelValue: 'ALL',
		tags: () => [],
		counts: () => ({}),
		totalCount: 0,
		allLabel: '',
		itemLabel: '',
		type: 'blog',
	},
)

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void
}>()

const { locale } = useI18n()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const tagSearchQuery = ref('')

onClickOutside(dropdownRef, () => {
	if (isOpen.value) {
		isOpen.value = false
	}
})

const defaultAllLabel = computed(() => {
	if (props.allLabel)
		return props.allLabel
	return locale.value === 'id' ? 'Semua Topik' : 'All Topics'
})

const defaultItemUnit = computed(() => {
	if (props.itemLabel)
		return props.itemLabel
	if (props.type === 'project') {
		return locale.value === 'id' ? 'projek' : 'projects'
	}
	return locale.value === 'id' ? 'artikel' : 'articles'
})

const currentLabel = computed(() => {
	if (props.modelValue === 'ALL') {
		return defaultAllLabel.value
	}
	return `#${props.modelValue}`
})

const filteredDropdownTags = computed(() => {
	const q = tagSearchQuery.value.trim().toLowerCase()
	if (!q)
		return props.tags
	return props.tags.filter(t => t.toLowerCase().includes(q))
})

function selectTag(tag: string) {
	emit('update:modelValue', tag)
	isOpen.value = false
	tagSearchQuery.value = ''
}

function resetFilter() {
	emit('update:modelValue', 'ALL')
	tagSearchQuery.value = ''
}
</script>

<template>
	<div class="relative z-30 mb-8 w-full">
		<div class="shadow-xs flex items-center justify-between gap-4 border border-slate-200/80 rounded-2xl bg-white/80 p-2 backdrop-blur-md dark:border-[#134e43]/60 dark:bg-[#001412]/80 sm:p-2.5">
			<!-- Dropdown Selector Button Only -->
			<div
				ref="dropdownRef"
				class="relative"
			>
				<button
					type="button"
					class="flex cursor-pointer items-center gap-2.5 border rounded-xl px-4 py-2 text-xs font-semibold transition-all"
					:class="modelValue !== 'ALL'
						? 'bg-brand-700 text-white border-brand-600 shadow-xs'
						: 'bg-slate-100 dark:bg-[#002420] text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-[#134e43] hover:bg-slate-200/80 dark:hover:bg-[#00332c]'"
					:aria-expanded="isOpen"
					aria-label="Pilih topik filter"
					@click="isOpen = !isOpen"
				>
					<span class="i-hugeicons-filter-horizontal text-sm" />
					<span class="max-w-[180px] truncate sm:max-w-[260px]">{{ currentLabel }}</span>
					<span
						class="i-hugeicons-arrow-down-01 text-xs transition-transform duration-200"
						:class="{ 'rotate-180': isOpen }"
					/>
				</button>

				<!-- Dropdown Popover Menu (Solid Background & High Elevation) -->
				<Transition
					enter-active-class="transition duration-150 ease-out"
					enter-from-class="transform scale-95 opacity-0 -translate-y-1"
					enter-to-class="transform scale-100 opacity-100 translate-y-0"
					leave-active-class="transition duration-100 ease-in"
					leave-from-class="transform scale-100 opacity-100 translate-y-0"
					leave-to-class="transform scale-95 opacity-0 -translate-y-1"
				>
					<div
						v-if="isOpen"
						class="absolute left-0 top-full z-50 mt-2 max-w-[90vw] w-72 flex flex-col overflow-hidden border border-slate-200 rounded-2xl bg-white p-2 shadow-2xl dark:border-[#134e43] dark:bg-[#001714]"
					>
						<!-- Tag Search Input inside Dropdown if more than 5 tags -->
						<div
							v-if="tags.length > 5"
							class="mb-1.5 shrink-0 border-b border-slate-100 px-1 pb-2 dark:border-white/10"
						>
							<div class="relative">
								<span class="i-hugeicons-search-01 absolute left-2.5 top-1/2 text-xs text-slate-500 -translate-y-1/2" />
								<input
									v-model="tagSearchQuery"
									type="text"
									:placeholder="locale === 'id' ? 'Cari tag...' : 'Search tags...'"
									class="w-full border border-slate-200 rounded-lg bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 dark:border-white/10 dark:bg-[#002420] dark:text-white placeholder:text-slate-500"
								>
							</div>
						</div>

						<!-- List of Options -->
						<div class="max-h-60 space-y-0.5 overflow-y-auto overscroll-contain pr-1 custom-scrollbar">
							<!-- "All Topics" Option -->
							<button
								type="button"
								class="w-full flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-colors"
								:class="modelValue === 'ALL'
									? 'bg-brand-500/15 dark:bg-brand-500/25 text-brand-800 dark:text-brand-300 font-bold'
									: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'"
								@click="selectTag('ALL')"
							>
								<span class="flex items-center gap-2">
									<span class="i-hugeicons-grid-view text-xs" />
									{{ defaultAllLabel }}
								</span>
								<span class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 font-medium font-mono dark:bg-white/10 dark:text-slate-400">
									{{ totalCount }}
								</span>
							</button>

							<!-- Tags Options -->
							<button
								v-for="tag in filteredDropdownTags"
								:key="tag"
								type="button"
								class="w-full flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-colors"
								:class="modelValue === tag
									? 'bg-brand-500/15 dark:bg-brand-500/25 text-brand-800 dark:text-brand-300 font-bold'
									: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'"
								@click="selectTag(tag)"
							>
								<span class="flex items-center gap-2 truncate">
									<span class="i-hugeicons-tag-01 shrink-0 text-xs" />
									<span class="truncate">#{{ tag }}</span>
								</span>
								<span
									v-if="counts[tag]"
									class="ml-2 shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 font-medium font-mono dark:bg-white/10 dark:text-slate-400"
								>
									{{ counts[tag] }}
								</span>
							</button>

							<!-- Empty Filter Search -->
							<div
								v-if="filteredDropdownTags.length === 0"
								class="py-4 text-center text-xs text-slate-500"
							>
								{{ locale === 'id' ? 'Tag tidak ditemukan' : 'No tag found' }}
							</div>
						</div>
					</div>
				</Transition>
			</div>

			<!-- Right: Total Count & Quick Reset -->
			<div class="flex shrink-0 items-center gap-3">
				<!-- Count Indicator -->
				<span class="text-xs text-slate-700 font-medium dark:text-slate-400">
					{{ totalCount }} {{ defaultItemUnit }}
				</span>

				<!-- Reset Button (If active filter) -->
				<button
					v-if="modelValue !== 'ALL'"
					type="button"
					class="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs text-brand-800 font-medium transition-colors hover:bg-brand-50 dark:text-brand-400 focus-ring dark:hover:bg-brand-950/40"
					@click="resetFilter"
				>
					<span class="i-hugeicons-cancel-01 text-xs" />
					{{ locale === 'id' ? 'Reset' : 'Reset' }}
				</button>
			</div>
		</div>
	</div>
</template>
