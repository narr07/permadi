<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		level?: string | number
		class?: any
	}>(),
	{
		level: 3,
		class: undefined,
	},
)
</script>

<template>
	<div
		class="prose-steps my-8 flex flex-col gap-6"
		:class="props.class"
	>
		<slot />
	</div>
</template>

<style scoped>
:deep(> h2),
:deep(> h3),
:deep(> h4) {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	font-family: 'Barlow', sans-serif;
	font-weight: 700;
	margin-top: 1.5rem !important;
	margin-bottom: 0.75rem !important;
	counter-increment: step-counter;
}

:deep(> h2::before),
:deep(> h3::before),
:deep(> h4::before) {
	content: counter(step-counter);
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1.875rem;
	height: 1.875rem;
	border-radius: 9999px;
	font-size: 0.8125rem;
	font-weight: 700;
	font-family: 'JetBrains Mono', monospace;
	background-color: rgba(20, 184, 152, 0.15);
	color: #14b898;
	border: 1px solid rgba(20, 184, 152, 0.35);
	flex-shrink: 0;
}

.prose-steps {
	counter-reset: step-counter;
	position: relative;
	padding-left: 0.5rem;
	border-left: 2px dashed rgba(20, 184, 152, 0.25);
	margin-left: 0.75rem;
}
</style>
