<script setup lang="ts">
	defineProps<{
		icon: string
		title: string
		description: string
		actions?: { label: string; to: string }[]
	}>()
</script>

<template>
	<div class="flex flex-col items-center text-center py-12 px-4 bento-card-subtle rounded-bento">
		<span :class="icon" class="text-4xl text-slate-300 dark:text-slate-600 mb-4" />
		<h3 class="heading-card-md">{{ title }}</h3>
		<p class="text-body mt-1.5 max-w-sm">{{ description }}</p>
		<div v-if="actions?.length" class="flex flex-wrap justify-center gap-2.5 mt-5">
			<NuxtLink
				v-for="a in actions"
				:key="a.to"
				:to="a.to"
				class="btn-primary"
			>
				{{ a.label }}
			</NuxtLink>
		</div>
	</div>
</template>
