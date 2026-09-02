<script setup lang="ts">
const props = defineProps<{
	class?: any
}>()
</script>

<template>
	<code
		class="inline-code border border-[#a4c7c2] rounded-md border-dashed bg-[#eff6f5] px-1.5 py-0.5 text-[0.85em] text-[#0f7662] font-medium font-mono transition-colors dark:border-[rgba(94,234,207,0.35)] dark:bg-[rgba(20,184,152,0.08)] dark:text-[#5eeacf]"
		:class="props.class"
	><slot /></code>
</template>
