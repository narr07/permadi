<script setup lang="ts">
	defineProps<{
		eyebrow?: string
		headline?: string
		description?: string
	}>()
</script>

<template>
	<div class="max-w-3xl mb-10 sm:mb-12">
		<span v-if="eyebrow" class="section-label mb-3 block text-brand-600 dark:text-brand-400 font-bold">
			{{ eyebrow }}
		</span>
		<h1 v-if="headline" class="font-heading font-semibold text-slate-900 dark:text-white text-4xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight mb-4">
			{{ headline }}
		</h1>
		<p v-if="description" class="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
			{{ description }}
		</p>
	</div>
</template>
