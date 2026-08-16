<script setup lang="ts">
	import { onClickOutside } from '@vueuse/core'

	const props = withDefaults(
		defineProps<{
			modelValue: string
			tags: string[]
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
		}
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
		if (props.allLabel) return props.allLabel
		return locale.value === 'id' ? 'Semua Topik' : 'All Topics'
	})

	const defaultItemUnit = computed(() => {
		if (props.itemLabel) return props.itemLabel
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
		if (!q) return props.tags
		return props.tags.filter((t) => t.toLowerCase().includes(q))
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
	<div class="w-full mb-8 relative z-30">
		<div class="flex items-center justify-between gap-4 p-2 sm:p-2.5 rounded-2xl bg-white/80 dark:bg-[#001412]/80 backdrop-blur-md border border-slate-200/80 dark:border-[#134e43]/60 shadow-xs">
			<!-- Dropdown Selector Button Only -->
			<div ref="dropdownRef" class="relative">
				<button
					type="button"
					class="flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border"
					:class="modelValue !== 'ALL'
						? 'bg-brand-700 text-white border-brand-600 shadow-xs'
						: 'bg-slate-100 dark:bg-[#002420] text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-[#134e43] hover:bg-slate-200/80 dark:hover:bg-[#00332c]'"
					:aria-expanded="isOpen"
					aria-label="Pilih topik filter"
					@click="isOpen = !isOpen"
				>
					<span class="i-hugeicons-filter-horizontal text-sm" />
					<span class="truncate max-w-[180px] sm:max-w-[260px]">{{ currentLabel }}</span>
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
						class="absolute left-0 top-full mt-2 w-72 max-w-[90vw] z-50 rounded-2xl bg-white dark:bg-[#001714] border border-slate-200 dark:border-[#134e43] shadow-2xl p-2 max-h-80 overflow-y-auto"
					>
						<!-- Tag Search Input inside Dropdown if more than 5 tags -->
						<div v-if="tags.length > 5" class="px-1 pb-2 mb-1.5 border-b border-slate-100 dark:border-white/10">
							<div class="relative">
								<span class="i-hugeicons-search-01 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
								<input
									v-model="tagSearchQuery"
									type="text"
									:placeholder="locale === 'id' ? 'Cari tag...' : 'Search tags...'"
									class="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#002420] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500"
								>
							</div>
						</div>

						<!-- List of Options -->
						<div class="space-y-0.5">
							<!-- "All Topics" Option -->
							<button
								type="button"
								class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-colors text-left cursor-pointer"
								:class="modelValue === 'ALL'
									? 'bg-brand-500/15 dark:bg-brand-500/25 text-brand-800 dark:text-brand-300 font-bold'
									: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'"
								@click="selectTag('ALL')"
							>
								<span class="flex items-center gap-2">
									<span class="i-hugeicons-grid-view text-xs" />
									{{ defaultAllLabel }}
								</span>
								<span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-400 font-mono font-medium">
									{{ totalCount }}
								</span>
							</button>

							<!-- Tags Options -->
							<button
								v-for="tag in filteredDropdownTags"
								:key="tag"
								type="button"
								class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-colors text-left cursor-pointer"
								:class="modelValue === tag
									? 'bg-brand-500/15 dark:bg-brand-500/25 text-brand-800 dark:text-brand-300 font-bold'
									: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'"
								@click="selectTag(tag)"
							>
								<span class="flex items-center gap-2 truncate">
									<span class="i-hugeicons-tag-01 text-xs shrink-0" />
									<span class="truncate">#{{ tag }}</span>
								</span>
								<span
									v-if="counts[tag]"
									class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-400 font-mono font-medium shrink-0 ml-2"
								>
									{{ counts[tag] }}
								</span>
							</button>

							<!-- Empty Filter Search -->
							<div v-if="filteredDropdownTags.length === 0" class="py-4 text-center text-xs text-slate-500">
								{{ locale === 'id' ? 'Tag tidak ditemukan' : 'No tag found' }}
							</div>
						</div>
					</div>
				</Transition>
			</div>

			<!-- Right: Total Count & Quick Reset -->
			<div class="flex items-center gap-3 shrink-0">
				<!-- Count Indicator -->
				<span class="text-xs text-slate-700 dark:text-slate-400 font-medium">
					{{ totalCount }} {{ defaultItemUnit }}
				</span>

				<!-- Reset Button (If active filter) -->
				<button
					v-if="modelValue !== 'ALL'"
					type="button"
					class="focus-ring inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-brand-800 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors cursor-pointer"
					@click="resetFilter"
				>
					<span class="i-hugeicons-cancel-01 text-xs" />
					{{ locale === 'id' ? 'Reset' : 'Reset' }}
				</button>
			</div>
		</div>
	</div>
</template>
