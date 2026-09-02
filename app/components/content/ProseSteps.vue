<script setup lang="ts">
import { computed } from 'vue'

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

const resolvedLevel = computed(() => String(props.level || '3'))
</script>

<template>
	<div
		class="prose-steps my-8 ml-3.5 border-l-2 border-slate-200/90 transition-colors sm:ml-4 dark:border-slate-800/90"
		:class="[
			`level-${resolvedLevel}`,
			props.class,
		]"
	>
		<slot />
	</div>
</template>

<style scoped>
.prose-steps {
	--step-pl: 2rem;
	--step-badge-size: 1.75rem;
	counter-reset: step;
	position: relative;
	padding-left: var(--step-pl);
}

@media (min-width: 640px) {
	.prose-steps {
		--step-pl: 2.25rem;
		--step-badge-size: 1.875rem;
	}
}

/* Base Step Item Heading */
.prose-steps :deep(h2),
.prose-steps :deep(h3),
.prose-steps :deep(h4) {
	position: relative;
	font-family: 'Barlow', sans-serif;
	font-weight: 800;
	letter-spacing: -0.025em;
	color: #000b07;
	border-bottom: none !important;
	padding-bottom: 0 !important;
	line-height: 1.25 !important;
}

:global(.dark) .prose-steps :deep(h2),
:global(.dark) .prose-steps :deep(h3),
:global(.dark) .prose-steps :deep(h4) {
	color: #f8fafa;
}

/* Target Heading by Level */
.level-2 :deep(> h2),
.level-3 :deep(> h3),
.level-4 :deep(> h4),
.prose-steps:not([class*="level-"]) :deep(> h3) {
	counter-increment: step;
	margin-top: 2.25rem !important;
	margin-bottom: 0.75rem !important;
}

.level-2 :deep(> h2:first-child),
.level-3 :deep(> h3:first-child),
.level-4 :deep(> h4:first-child),
.prose-steps:not([class*="level-"]) :deep(> h3:first-child) {
	margin-top: 0.25rem !important;
}

/* Numbered Badge (Clean, Minimalist & Dead-Center on vertical timeline) */
.level-2 :deep(> h2::before),
.level-3 :deep(> h3::before),
.level-4 :deep(> h4::before),
.prose-steps:not([class*="level-"]) :deep(> h3::before) {
	content: counter(step);
	position: absolute;
	/* Sumbu X Presisi: tepat di tengah garis vertikal */
	left: calc(-1 * var(--step-pl) - (var(--step-badge-size) / 2) - 1px);
	top: 50%;
	transform: translateY(-50%);
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: var(--step-badge-size);
	height: var(--step-badge-size);
	border-radius: 9999px;
	font-size: 0.75rem;
	font-weight: 700;
	font-family: 'JetBrains Mono', monospace;
	background-color: #ffffff;
	color: #0f7662;
	border: 1px solid #ced7d5;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	z-index: 2;
	transition: all 0.15s ease;
}

:global(.dark) .level-2 :deep(> h2::before),
:global(.dark) .level-3 :deep(> h3::before),
:global(.dark) .level-4 :deep(> h4::before),
:global(.dark) .prose-steps:not([class*="level-"]) :deep(> h3::before) {
	background-color: #000c0a;
	color: #5eeacf;
	border-color: rgba(20, 184, 152, 0.4);
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

/* Hide autolink hash inside steps */
.prose-steps :deep(h2 > a > span),
.prose-steps :deep(h3 > a > span),
.prose-steps :deep(h4 > a > span) {
	display: none !important;
}
</style>
