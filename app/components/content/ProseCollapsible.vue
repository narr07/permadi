<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
	defineProps<{
		name?: string
		openText?: string
		closeText?: string
		icon?: string
		defaultOpen?: boolean
		class?: any
	}>(),
	{
		name: 'Details',
		openText: 'Show',
		closeText: 'Hide',
		icon: 'i-hugeicons-arrow-down-01',
		defaultOpen: false,
		class: undefined,
	},
)

const isOpen = ref(props.defaultOpen)
</script>

<template>
	<div
		class="shadow-xs my-6 overflow-hidden border border-[#115e4f]/25 rounded-2xl bg-white/70 backdrop-blur-md dark:border-[#134e43]/60 dark:bg-[#001c19]/80"
		:class="props.class"
	>
		<button
			type="button"
			class="w-full flex cursor-pointer items-center justify-between gap-4 px-5 py-3.5 text-xs text-slate-700 font-semibold font-sans transition-colors hover:bg-brand-50/50 sm:text-sm dark:text-slate-200 dark:hover:bg-white/5"
			:aria-expanded="isOpen"
			@click="isOpen = !isOpen"
		>
			<span>{{ isOpen ? props.closeText : props.openText }} {{ props.name }}</span>
			<span
				:class="props.icon"
				class="shrink-0 text-base text-slate-400 transition-transform duration-300 dark:text-slate-500"
				:style="{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }"
			/>
		</button>

		<div
			v-show="isOpen"
			class="border-t border-[#115e4f]/15 px-5 pb-5 pt-3 text-sm text-slate-600 leading-relaxed font-sans dark:border-[#134e43]/40 dark:text-slate-300"
		>
			<slot />
		</div>
	</div>
</template>
