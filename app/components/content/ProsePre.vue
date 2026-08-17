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
			return 'i-vscode-icons-file-type-typescript'
		case 'tsx':
			return 'i-vscode-icons-file-type-reactts'
		case 'jsx':
		case 'react':
			return 'i-vscode-icons-file-type-reactjs'
		case 'js':
		case 'javascript':
		case 'mjs':
		case 'cjs':
			return 'i-vscode-icons-file-type-js'
		case 'vue':
			return 'i-vscode-icons-file-type-vue'
		case 'dart':
		case 'flutter':
			return 'i-vscode-icons-file-type-dartlang'
		case 'go':
		case 'golang':
			return 'i-vscode-icons-file-type-go'
		case 'kt':
		case 'kotlin':
			return 'i-vscode-icons-file-type-kotlin'
		case 'sql':
		case 'mysql':
		case 'pgsql':
		case 'postgres':
		case 'sqlite':
			return 'i-vscode-icons-file-type-sql'
		case 'html':
			return 'i-vscode-icons-file-type-html'
		case 'css':
		case 'scss':
		case 'less':
			return 'i-vscode-icons-file-type-css'
		case 'json':
			return 'i-vscode-icons-file-type-json'
		case 'yaml':
		case 'yml':
			return 'i-vscode-icons-file-type-yaml'
		case 'md':
		case 'mdc':
		case 'markdown':
			return 'i-vscode-icons-file-type-markdown'
		case 'sh':
		case 'bash':
		case 'zsh':
		case 'shell':
		case 'terminal':
			return 'i-vscode-icons-file-type-shell'
		case 'py':
		case 'python':
			return 'i-vscode-icons-file-type-python'
		case 'rs':
		case 'rust':
			return 'i-vscode-icons-file-type-rust'
		case 'graphql':
		case 'gql':
			return 'i-vscode-icons-file-type-graphql'
		case 'docker':
		case 'dockerfile':
			return 'i-vscode-icons-file-type-docker'
		case 'diff':
			return 'i-vscode-icons-file-type-git'
		default:
			return 'i-vscode-icons-default-file'
	}
})

function handleCopy() {
	if (props.code) {
		copy(props.code)
	}
}
</script>

<template>
	<div class="group relative my-6 overflow-hidden border border-[#115e4f]/30 rounded-2xl bg-[#042f27] shadow-xl transition-all duration-300 prose-code-block dark:border-[#134e43]/60 dark:bg-[#001412]">
		<!-- Code Block Header (File Info & Copy Button) -->
		<div class="flex select-none items-center justify-between border-b border-[#115e4f]/40 bg-[#02211c]/95 px-4 py-2.5 text-xs font-mono dark:border-[#134e43]/50 dark:bg-[#001c19]/90">
			<!-- Left: File Icon & Filename & Language Tag -->
			<div class="min-w-0 flex items-center gap-2.5">
				<span
					:class="fileIcon"
					class="shrink-0 text-sm"
				/>
				<span
					v-if="resolvedFilename"
					class="truncate text-xs text-brand-100 font-medium"
				>
					{{ resolvedFilename }}
				</span>
				<span
					v-if="displayLanguage"
					class="border border-brand-500/30 rounded-md bg-brand-500/15 px-1.5 py-0.5 text-[10px] text-brand-300 font-semibold tracking-wider uppercase"
				>
					{{ displayLanguage }}
				</span>
			</div>

			<!-- Right: Copy Code Button -->
			<button
				type="button"
				class="flex cursor-pointer items-center gap-1.5 border border-brand-500/30 rounded-lg bg-brand-900/70 px-2.5 py-1 text-xs text-brand-200 transition-all dark:border-white/10 dark:bg-white/10 hover:bg-brand-800 hover:text-white focus:outline-none focus:ring-1 focus:ring-brand-400/50 dark:hover:bg-white/15"
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
		<div class="custom-scrollbar relative overflow-x-auto p-4 text-[13px] leading-relaxed font-mono sm:text-sm">
			<pre
				:class="props.class"
				:style="props.style"
			><slot /></pre>
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
	white-space: pre !important;
	word-wrap: normal !important;
}

:deep(code) {
	background-color: transparent !important;
	padding: 0 !important;
	border: none !important;
	font-family: inherit !important;
	font-size: inherit !important;
	display: block !important;
	white-space: pre !important;
	word-wrap: normal !important;
}

:deep(.shiki span),
:deep(pre span) {
	color: var(--shiki-dark, inherit);
}

:deep(.line) {
	display: block !important;
	min-height: 1.5rem;
}

:deep(.line.highlight) {
	background-color: rgba(20, 184, 152, 0.15) !important;
	margin-left: -1rem;
	margin-right: -1rem;
	padding-left: 1rem;
	padding-right: 1rem;
	border-left: 2px solid #14b898;
}
</style>
