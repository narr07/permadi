<script setup lang="ts">
const props = defineProps<{
	href?: string
}>()

const link = computed(() => resolveChatLink(props.href || ''))
</script>

<template>
	<NuxtLink
		:to="link.to"
		:external="link.external"
		:target="link.external ? '_blank' : undefined"
		:rel="link.external ? 'noopener noreferrer' : undefined"
		class="text-brand-800 underline underline-offset-2 transition-colors dark:text-brand-300 hover:text-brand-950 focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2 focus-visible:outline dark:hover:text-brand-200"
	>
		<slot />
	</NuxtLink>
</template>
