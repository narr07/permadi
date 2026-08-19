<script setup lang="ts">
import { renderMermaidSVG } from 'beautiful-mermaid'
import { computed } from 'vue'

const props = defineProps<{
	code: string
}>()

const diagramResult = computed(() => {
	if (!props.code)
		return { svg: '', error: '' }

	try {
		const cleanCode = props.code.trim()
		// Kustomisasi palet warna brand teal/emerald + background transparan
		const svg = renderMermaidSVG(cleanCode, {
			transparent: true,
			bg: '#02211c',
			fg: '#f0fdfa',
			surface: '#0d947a',
			border: '#14b898',
			line: '#2bd4b5',
			accent: '#5eeacf',
			muted: '#99f6e4',
			padding: 24,
			nodeSpacing: 36,
			layerSpacing: 48,
		})
		return { svg, error: '' }
	}
	catch (err: any) {
		return {
			svg: '',
			error: err?.message || 'Gagal me-render diagram Mermaid',
		}
	}
})
</script>

<template>
	<div class="mermaid-container w-full overflow-hidden p-2 sm:p-4">
		<!-- Error state -->
		<div
			v-if="diagramResult.error"
			class="w-full border border-amber-500/30 rounded-xl bg-amber-500/10 p-4 text-xs text-amber-200"
		>
			<div class="flex items-center gap-2 font-medium">
				<span class="i-lucide-alert-triangle text-amber-400" />
				<span>Diagram Mermaid tidak valid:</span>
			</div>
			<p class="mt-1 text-[11px] font-mono opacity-80">
				{{ diagramResult.error }}
			</p>
		</div>

		<!-- Rendered SVG with smooth horizontal scrolling & large readable typography -->
		<div
			v-else-if="diagramResult.svg"
			class="custom-scrollbar mermaid-svg-wrapper w-full flex items-center justify-start overflow-x-auto py-4 sm:justify-center"
		>
			<div
				class="inline-block min-w-max shrink-0 transition-transform"
				v-html="diagramResult.svg"
			/>
		</div>
	</div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.1);
	border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
	background: rgba(20, 184, 152, 0.25);
	border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background: rgba(20, 184, 152, 0.5);
}

:deep(svg) {
	display: block;
	height: auto;
	margin: 0 auto;
}

:deep(text) {
	font-weight: 500 !important;
	letter-spacing: 0.01em !important;
}
</style>
