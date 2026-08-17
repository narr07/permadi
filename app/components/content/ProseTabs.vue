<script setup lang="ts">
import { computed, provide, ref, useSlots } from 'vue'

const props = withDefaults(
	defineProps<{
		defaultValue?: string
		sync?: string
		class?: any
	}>(),
	{
		defaultValue: '0',
		sync: undefined,
		class: undefined,
	},
)

const slots = useSlots()
const selectedIndex = ref(Number.parseInt(props.defaultValue, 10) || 0)

const tabs = computed(() => {
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
			icon: vnode.props?.icon,
			description: vnode.props?.description,
			vnode,
		}
	})
})

provide('tabsSelectedIndex', selectedIndex)
</script>

<template>
	<div
		class="shadow-xs my-6 overflow-hidden border border-[#115e4f]/25 rounded-2xl bg-white/70 backdrop-blur-md dark:border-[#134e43]/60 dark:bg-[#001c19]/80"
		:class="props.class"
	>
		<!-- Bento Tab Header -->
		<div class="custom-scrollbar flex items-center gap-1.5 overflow-x-auto border-b border-[#115e4f]/15 bg-brand-50/50 p-2 dark:border-[#134e43]/40 dark:bg-black/20">
			<button
				v-for="(tab, idx) in tabs"
				:key="idx"
				type="button"
				class="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-sans transition-all"
				:class="[
					selectedIndex === idx
						? 'bg-white text-brand-700 font-bold shadow-xs border border-brand-200/80 dark:bg-brand-950 dark:text-brand-300 dark:border-brand-800/80'
						: 'text-slate-500 hover:text-slate-800 hover:bg-white/40 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 border border-transparent',
				]"
				@click="selectedIndex = idx"
			>
				<span
					v-if="tab.icon"
					:class="tab.icon"
					class="shrink-0 text-sm"
				/>
				<span>{{ tab.label }}</span>
			</button>
		</div>

		<!-- Tab Panels -->
		<div class="p-5">
			<template
				v-for="(tab, idx) in tabs"
				:key="idx"
			>
				<div
					v-show="selectedIndex === idx"
					class="text-sm text-slate-700 leading-relaxed font-sans dark:text-slate-200"
				>
					<component :is="tab.vnode" />
				</div>
			</template>
		</div>
	</div>
</template>
