<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		code?: string
		language?: string
		filename?: string
		highlights?: number[]
		meta?: string
		class?: any
		style?: any
	}>(),
	{
		code: '',
		language: '',
		filename: '',
		highlights: () => [],
		meta: '',
		class: undefined,
		style: undefined,
	},
)

const { copy, copied } = useClipboard({ copiedDuring: 2000 })

const resolvedFilename = computed(() => {
	if (props.filename)
		return props.filename
	if (props.meta) {
		const match = props.meta.match(/\[(.*?)\]/)
		if (match && match[1])
			return match[1]
	}
	return ''
})

const displayLanguage = computed(() => {
	if (props.language)
		return props.language.toLowerCase()
	if (resolvedFilename.value) {
		const ext = resolvedFilename.value.split('.').pop()
		return ext ? ext.toLowerCase() : ''
	}
	return ''
})

const fileIcon = computed(() => {
	const ext = (resolvedFilename.value ? resolvedFilename.value.split('.').pop()?.toLowerCase() : '') || displayLanguage.value
	switch (ext) {
		case 'ts':
		case 'typescript':
			return 'i-simple-icons-typescript text-sky-400'
		case 'js':
		case 'javascript':
		case 'mjs':
		case 'cjs':
			return 'i-simple-icons-javascript text-amber-300'
		case 'vue':
			return 'i-simple-icons-vuedotjs text-emerald-400'
		case 'html':
			return 'i-simple-icons-html5 text-orange-500'
		case 'css':
		case 'scss':
		case 'less':
			return 'i-simple-icons-css3 text-blue-400'
		case 'json':
			return 'i-simple-icons-json text-amber-400'
		case 'yaml':
		case 'yml':
			return 'i-simple-icons-yaml text-red-400'
		case 'md':
		case 'mdc':
		case 'markdown':
			return 'i-simple-icons-markdown text-slate-300'
		case 'sh':
		case 'bash':
		case 'zsh':
		case 'shell':
		case 'terminal':
			return 'i-lucide-terminal text-emerald-400'
		case 'py':
		case 'python':
			return 'i-simple-icons-python text-yellow-300'
		case 'go':
			return 'i-simple-icons-go text-cyan-400'
		case 'rs':
		case 'rust':
			return 'i-simple-icons-rust text-orange-400'
		case 'diff':
			return 'i-lucide-git-compare text-indigo-400'
		default:
			return 'i-lucide-file-code text-slate-400'
	}
})

function handleCopy() {
	if (props.code) {
		copy(props.code)
	}
}
</script>

<template>
	<div class="group relative my-6 overflow-hidden border border-slate-800/80 rounded-2xl bg-[#0f172a] shadow-xl transition-all duration-300 prose-code-block dark:border-[#134e43]/60 dark:bg-[#001412]">
		<!-- Code Block Header (File Info & Copy Button) -->
		<div class="flex select-none items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2.5 text-xs font-mono dark:border-[#134e43]/50 dark:bg-[#001c19]/90">
			<!-- Left: File Icon & Filename & Language Tag -->
			<div class="min-w-0 flex items-center gap-2.5">
				<span
					:class="fileIcon"
					class="shrink-0 text-sm"
				/>
				<span
					v-if="resolvedFilename"
					class="truncate text-xs text-slate-200 font-medium"
				>
					{{ resolvedFilename }}
				</span>
				<span
					v-if="displayLanguage"
					class="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300 font-semibold tracking-wider uppercase"
				>
					{{ displayLanguage }}
				</span>
			</div>

			<!-- Right: Copy Code Button -->
			<button
				type="button"
				class="flex cursor-pointer items-center gap-1.5 border border-white/10 rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300 transition-all dark:bg-white/10 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-1 focus:ring-brand-500/50 dark:hover:bg-white/15"
				:aria-label="copied ? 'Copied to clipboard' : 'Copy code to clipboard'"
				@click="handleCopy"
			>
				<span
					:class="copied ? 'i-lucide-check text-brand-400' : 'i-lucide-copy'"
					class="shrink-0 text-xs"
				/>
				<span class="text-[11px] font-medium font-sans">
					{{ copied ? 'Tersalin!' : 'Salin' }}
				</span>
			</button>
		</div>

		<!-- Pre / Code Slot Container with Shiki Syntax Highlighting -->
		<div class="custom-scrollbar relative overflow-x-auto p-4 text-[13px] text-slate-100 leading-relaxed font-mono sm:text-sm">
			<slot />
		</div>
	</div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.15);
	border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
	background: rgba(255, 255, 255, 0.25);
}

:deep(pre) {
	background-color: transparent !important;
	padding: 0 !important;
	margin: 0 !important;
	border-radius: 0 !important;
	border: none !important;
	font-family: inherit !important;
	overflow-x: visible !important;
}

:deep(code) {
	background-color: transparent !important;
	padding: 0 !important;
	border: none !important;
	font-family: inherit !important;
	font-size: inherit !important;
	color: inherit !important;
}
</style>
