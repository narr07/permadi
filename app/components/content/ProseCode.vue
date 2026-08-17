<script setup lang="ts">
withDefaults(
	defineProps<{
		code?: string
		language?: string
		filename?: string
		highlights?: number[]
		meta?: string
	}>(),
	{
		code: '',
		language: '',
		filename: '',
		highlights: () => [],
		meta: '',
	},
)
</script>

<template>
	<slot />
</template>
