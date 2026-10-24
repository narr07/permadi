<script setup lang="ts">
const props = defineProps<{
	options: Array<{ value: string, label: string }>
	modelValue: string
	label: string
}>()

const emit = defineEmits<{
	'update:modelValue': [value: string]
}>()
</script>

<template>
	<!-- Mobile: satu baris tab teks yang bisa digeser; layar sm ke atas: tombol kotak -->
	<nav
		:aria-label="props.label"
		class="w-full border-b border-slate-200/80 bg-slate-50/60 text-xs font-mono sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 dark:border-[#134e43] dark:bg-[#002420]/40 sm:px-8 sm:py-3.5"
	>
		<div class="filter-scroll flex items-center gap-6 overflow-x-auto px-6 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:px-0">
			<button
				v-for="option in props.options"
				:key="option.value"
				type="button"
				class="filter-tab"
				:aria-pressed="props.modelValue === option.value"
				@click="emit('update:modelValue', option.value)"
			>
				{{ option.label }}
			</button>
		</div>

		<div class="px-6 pb-3 pt-1 text-[11px] text-slate-600 uppercase tabular-nums sm:p-0 dark:text-slate-400">
			<slot />
		</div>
	</nav>
</template>

<style scoped>
.filter-scroll {
	scrollbar-width: none;
	/* Pudar di tepi kanan: tanda bahwa baris tab bisa digeser */
	mask-image: linear-gradient(to right, #000 calc(100% - 32px), transparent);
}

@media (min-width: 640px) {
	.filter-scroll {
		mask-image: none;
	}
}

.filter-scroll::-webkit-scrollbar {
	display: none;
}

.filter-tab {
	--at-apply: shrink-0 cursor-pointer whitespace-nowrap border-b-2 border-transparent py-3 font-bold tracking-wider uppercase text-slate-600 transition-colors dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2;
}

.filter-tab[aria-pressed='true'] {
	--at-apply: border-brand-600 text-slate-950 dark:border-brand-400 dark:text-slate-50;
}

@media (min-width: 640px) {
	.filter-tab {
		--at-apply: border border-slate-300 bg-white px-3.5 py-1.5 text-slate-800 dark:border-[#134e43] dark:bg-[#001e1c] dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 active:scale-95;
	}

	.filter-tab[aria-pressed='true'] {
		background-color: #001e1c;
		color: #ffffff;
		border-color: #001e1c;
	}

	:global(.dark) .filter-tab[aria-pressed='true'] {
		background-color: #f8fafa;
		color: #001e1c;
		border-color: #f8fafa;
	}
}
</style>
