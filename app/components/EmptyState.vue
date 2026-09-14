<script setup lang="ts">
defineProps<{
	icon: string
	title: string
	description: string
	actions?: { label: string, to: string }[]
}>()
</script>

<template>
	<div class="flex flex-col items-center border border-slate-200/80 bg-slate-50/80 px-4 py-12 text-center dark:border-[#134e43] dark:bg-[#002b27]">
		<span
			:class="icon"
			class="mb-4 text-4xl text-slate-300 dark:text-slate-600"
		/>
		<h3 class="heading-card-md">{{ title }}</h3>
		<p class="mt-1.5 max-w-sm text-body">{{ description }}</p>
		<div
			v-if="actions?.length"
			class="mt-5 flex flex-wrap justify-center gap-2.5"
		>
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
