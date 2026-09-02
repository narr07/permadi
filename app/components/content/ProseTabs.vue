<script setup lang="ts">
import { computed, onMounted, ref, useSlots, watch } from 'vue'

export interface TabItemData {
	label?: string
	title?: string
	icon?: string
	description?: string
	[key: string]: any
}

const props = withDefaults(
	defineProps<{
		/**
		 * The default selected tab index (0-based)
		 * @default '0'
		 */
		defaultValue?: string
		/**
		 * Sync the selected tab with a local storage key
		 */
		sync?: string
		/**
		 * Programmatic array of tab items (alternative to slots)
		 */
		items?: TabItemData[]
		/**
		 * Additional CSS classes
		 */
		class?: any
	}>(),
	{
		defaultValue: '0',
		sync: undefined,
		items: undefined,
		class: undefined,
	},
)

const slots = useSlots()
const selectedIndex = ref(Number.parseInt(props.defaultValue, 10) || 0)

const tabs = computed(() => {
	if (props.items && props.items.length) {
		return props.items.map((item, idx) => ({
			label: item.label || item.title || `Tab ${idx + 1}`,
			icon: resolveIcon(item.icon),
			description: item.description,
			vnode: null,
		}))
	}

	const defaultSlot = slots.default?.() || []
	const flat = defaultSlot.flatMap((vnode: any) => {
		if (typeof vnode.type === 'symbol' && Array.isArray(vnode.children)) {
			return vnode.children
		}
		return vnode
	}).filter(Boolean)

	return flat.map((vnode: any, idx: number) => {
		return {
			label: vnode.props?.label || vnode.props?.title || `Tab ${idx + 1}`,
			icon: resolveIcon(vnode.props?.icon),
			description: vnode.props?.description,
			vnode,
		}
	})
})

function resolveIcon(icon?: string) {
	if (!icon)
		return undefined
	if (icon === 'i-hugeicons-database' || icon === 'database')
		return 'i-hugeicons-database-01'
	if (icon === 'i-hugeicons-global' || icon === 'global')
		return 'i-hugeicons-globe-02'
	if (icon === 'i-hugeicons-shield-01' || icon === 'i-hugeicons-shield' || icon === 'security')
		return 'i-hugeicons-shield-02'
	if (icon === 'i-hugeicons-flash-01' || icon === 'scalability' || icon === 'lightning')
		return 'i-hugeicons-flash'
	return icon
}

onMounted(() => {
	if (props.sync && typeof window !== 'undefined') {
		const syncKey = `prose-tabs-${props.sync}`
		const saved = localStorage.getItem(syncKey)
		if (saved !== null) {
			const parsed = Number.parseInt(saved, 10)
			if (!Number.isNaN(parsed) && parsed < tabs.value.length) {
				selectedIndex.value = parsed
			}
		}

		watch(selectedIndex, (newIdx) => {
			localStorage.setItem(syncKey, String(newIdx))
		})
	}
})
</script>

<template>
	<div
		class="prose-tabs my-6 overflow-hidden border border-slate-300/80 rounded-2xl bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
		:class="props.class"
	>
		<!-- Bento High-Contrast Tab Header -->
		<div class="custom-scrollbar flex items-center gap-2 overflow-x-auto border-b border-slate-200 bg-slate-100/90 p-2 dark:border-slate-800 dark:bg-slate-900">
			<button
				v-for="(tab, idx) in tabs"
				:key="idx"
				type="button"
				class="flex shrink-0 cursor-pointer select-none items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-sans transition-all duration-200 sm:text-sm"
				:class="[
					selectedIndex === idx
						? 'bg-white text-slate-950 font-bold shadow-xs border border-slate-300/90 dark:bg-slate-950 dark:text-[#5eeacf] dark:border-brand-500/50'
						: 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/80 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 border border-transparent font-medium',
				]"
				:aria-selected="selectedIndex === idx"
				@click="selectedIndex = idx"
			>
				<span
					v-if="tab.icon"
					:class="[
						tab.icon,
						selectedIndex === idx ? 'text-brand-700 dark:text-[#5eeacf]' : 'text-slate-500 dark:text-slate-400',
					]"
					class="shrink-0 text-base"
				/>
				<span>{{ tab.label }}</span>
			</button>
		</div>

		<!-- Tab Content Panel -->
		<div class="p-5 sm:p-6">
			<template
				v-for="(tab, idx) in tabs"
				:key="idx"
			>
				<div
					v-show="selectedIndex === idx"
					class="tab-content text-sm text-slate-900 leading-relaxed font-sans dark:text-slate-200"
				>
					<component
						:is="tab.vnode"
						v-if="tab.vnode"
					/>
					<template v-else>
						{{ tab.description }}
					</template>
				</div>
			</template>
		</div>
	</div>
</template>
