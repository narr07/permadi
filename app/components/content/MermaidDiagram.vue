<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps<{
	code: string
}>()

const svgContent = ref('')
const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')

async function renderDiagram() {
	if (!props.code || !import.meta.client)
		return

	isLoading.value = true
	hasError.value = false
	errorMessage.value = ''

	try {
		let mermaid: any
		try {
			// @ts-ignore
			const m = await import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs')
			mermaid = m.default || m
		}
		catch {
			// @ts-ignore
			mermaid = (await import('mermaid')).default
		}

		mermaid.initialize({
			startOnLoad: false,
			theme: 'base',
			themeVariables: {
				darkMode: true,
				background: '#042f27',
				primaryColor: '#0d947a',
				primaryTextColor: '#f0fdfa',
				primaryBorderColor: '#14b898',
				lineColor: '#2bd4b5',
				secondaryColor: '#115e4f',
				tertiaryColor: '#02211c',
				fontFamily: 'system-ui, -apple-system, sans-serif',
				fontSize: '13px',
				nodeBorder: '1.5px solid #14b898',
				clusterBkg: '#02211c',
				clusterBorder: '#0f7662',
				titleColor: '#99f6e4',
				edgeLabelBackground: '#02211c',
			},
			securityLevel: 'loose',
		})

		const cleanCode = props.code.trim()
		const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`
		const { svg } = await mermaid.render(id, cleanCode)
		svgContent.value = svg
	}
	catch (err: any) {
		hasError.value = true
		errorMessage.value = err?.message || 'Gagal me-render diagram Mermaid'
	}
	finally {
		isLoading.value = false
	}
}

onMounted(() => {
	renderDiagram()
})

watch(() => props.code, () => {
	renderDiagram()
})
</script>

<template>
	<div class="mermaid-container w-full flex items-center justify-center p-4">
		<!-- Loading state -->
		<div
			v-if="isLoading"
			class="flex items-center gap-2.5 py-8 text-xs text-brand-300 font-sans"
		>
			<span class="i-lucide-loader-2 animate-spin text-base text-brand-400" />
			<span>Merender diagram visual...</span>
		</div>

		<!-- Error state -->
		<div
			v-else-if="hasError"
			class="w-full border border-amber-500/30 rounded-xl bg-amber-500/10 p-4 text-xs text-amber-200"
		>
			<div class="flex items-center gap-2 font-medium">
				<span class="i-lucide-alert-triangle text-amber-400" />
				<span>Diagram Mermaid tidak valid:</span>
			</div>
			<p class="mt-1 text-[11px] opacity-80 font-mono">
				{{ errorMessage }}
			</p>
		</div>

		<!-- Rendered SVG -->
		<div
			v-else
			class="mermaid-svg-wrapper max-w-full w-full overflow-x-auto py-2 text-center"
			v-html="svgContent"
		/>
	</div>
</template>

<style scoped>
:deep(svg) {
	max-width: 100% !important;
	height: auto !important;
	margin: 0 auto;
}

:deep(.node rect),
:deep(.node circle),
:deep(.node polygon) {
	rx: 8px !important;
	ry: 8px !important;
	filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
}

:deep(.edgePath .path) {
	stroke: #14b898 !important;
	stroke-width: 2px !important;
}

:deep(.arrowheadPath) {
	fill: #14b898 !important;
}

:deep(.label) {
	font-family: inherit !important;
	color: #f0fdfa !important;
}
</style>
