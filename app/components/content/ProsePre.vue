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

const iconMap: Record<string, string> = {
	'.editorconfig': 'i-vscode-icons-file-type-editorconfig',
	'.env': 'i-vscode-icons-file-type-dotenv',
	'.env.example': 'i-vscode-icons-file-type-dotenv',
	'.eslintignore': 'i-vscode-icons-file-type-eslint',
	'.eslintrc': 'i-vscode-icons-file-type-eslint',
	'.gitignore': 'i-vscode-icons-file-type-git',
	'.npmrc': 'i-vscode-icons-file-type-npm',
	'.nuxtignore': 'i-vscode-icons-file-type-nuxt',
	'.nuxtrc': 'i-vscode-icons-file-type-nuxt',
	'.vscode/settings.json': 'i-vscode-icons-file-type-vscode',
	'bun': 'i-vscode-icons-file-type-bun',
	'pnpm': 'i-vscode-icons-file-type-pnpm',
	'npm': 'i-vscode-icons-file-type-npm',
	'npx': 'i-vscode-icons-file-type-npm',
	'yarn': 'i-vscode-icons-file-type-yarn',
	'yarn.lock': 'i-vscode-icons-file-type-yarn',
	'deno': 'i-vscode-icons-file-type-deno',
	'node': 'i-vscode-icons-file-type-node',
	'package.json': 'i-vscode-icons-file-type-node',
	'nuxt': 'i-vscode-icons-file-type-nuxt',
	'nuxt.config.ts': 'i-vscode-icons-file-type-nuxt',
	'nuxt.config.js': 'i-vscode-icons-file-type-nuxt',
	'nuxt.schema.ts': 'i-vscode-icons-file-type-nuxt',
	'tailwind.config.ts': 'i-vscode-icons-file-type-tailwind',
	'tailwind.config.js': 'i-vscode-icons-file-type-tailwind',
	'uno.config.ts': 'i-vscode-icons-file-type-unocss',
	'tsconfig.json': 'i-vscode-icons-file-type-tsconfig',
	'eslint.config.js': 'i-vscode-icons-file-type-eslint',
	'eslint.config.mjs': 'i-vscode-icons-file-type-eslint',
	'eslint.config.cjs': 'i-vscode-icons-file-type-eslint',
	'dockerfile': 'i-vscode-icons-file-type-docker',
	'docker': 'i-vscode-icons-file-type-docker',
	'ts': 'i-vscode-icons-file-type-typescript',
	'typescript': 'i-vscode-icons-file-type-typescript',
	'tsx': 'i-vscode-icons-file-type-reactts',
	'jsx': 'i-vscode-icons-file-type-reactjs',
	'js': 'i-vscode-icons-file-type-js',
	'javascript': 'i-vscode-icons-file-type-js',
	'mjs': 'i-vscode-icons-file-type-js',
	'cjs': 'i-vscode-icons-file-type-js',
	'vue': 'i-vscode-icons-file-type-vue',
	'dart': 'i-vscode-icons-file-type-dartlang',
	'flutter': 'i-vscode-icons-file-type-dartlang',
	'go': 'i-vscode-icons-file-type-go',
	'golang': 'i-vscode-icons-file-type-go',
	'kt': 'i-vscode-icons-file-type-kotlin',
	'kotlin': 'i-vscode-icons-file-type-kotlin',
	'rs': 'i-vscode-icons-file-type-rust',
	'rust': 'i-vscode-icons-file-type-rust',
	'py': 'i-vscode-icons-file-type-python',
	'python': 'i-vscode-icons-file-type-python',
	'sql': 'i-vscode-icons-file-type-sql',
	'sqlite': 'i-vscode-icons-file-type-sql',
	'pgsql': 'i-vscode-icons-file-type-sql',
	'mysql': 'i-vscode-icons-file-type-sql',
	'html': 'i-vscode-icons-file-type-html',
	'css': 'i-vscode-icons-file-type-css',
	'scss': 'i-vscode-icons-file-type-css',
	'less': 'i-vscode-icons-file-type-css',
	'json': 'i-vscode-icons-file-type-json',
	'yaml': 'i-vscode-icons-file-type-yaml',
	'yml': 'i-vscode-icons-file-type-yaml',
	'md': 'i-vscode-icons-file-type-markdown',
	'mdc': 'i-vscode-icons-file-type-markdown',
	'markdown': 'i-vscode-icons-file-type-markdown',
	'sh': 'i-vscode-icons-file-type-shell',
	'bash': 'i-vscode-icons-file-type-shell',
	'zsh': 'i-vscode-icons-file-type-shell',
	'shell': 'i-vscode-icons-file-type-shell',
	'powershell': 'i-vscode-icons-file-type-powershell',
	'ps1': 'i-vscode-icons-file-type-powershell',
	'terminal': 'i-lucide-terminal',
}

const fileIcon = computed(() => {
	const clean = (resolvedFilename.value || '').replace(/\s*\(.*\)\s*$/, '').trim().toLowerCase()
	const name = clean.split('/').pop() || ''
	const ext = clean.includes('.') ? clean.split('.').pop() || '' : clean
	const lang = displayLanguage.value.toLowerCase()

	if (iconMap[clean])
		return iconMap[clean]
	if (iconMap[name])
		return iconMap[name]
	if (iconMap[ext])
		return iconMap[ext]
	if (iconMap[lang])
		return iconMap[lang]

	return 'i-vscode-icons-default-file'
})

const isMermaid = computed(() => displayLanguage.value === 'mermaid')
const isVisualMode = ref(true)

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
					:class="isMermaid ? 'i-lucide-network text-brand-400' : fileIcon"
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
					{{ isMermaid ? 'Diagram Alur' : displayLanguage }}
				</span>
			</div>

			<!-- Right: Controls (Mermaid Toggle + Copy Button) -->
			<div class="flex items-center gap-2">
				<!-- Mermaid View Mode Toggle -->
				<div
					v-if="isMermaid"
					class="flex items-center border border-brand-500/30 rounded-lg bg-brand-950/60 p-0.5"
				>
					<button
						type="button"
						class="cursor-pointer rounded px-2 py-0.5 text-[11px] font-medium font-sans transition-all"
						:class="isVisualMode ? 'bg-brand-500 text-brand-950 font-semibold shadow-sm' : 'text-brand-300 hover:text-white'"
						@click="isVisualMode = true"
					>
						Visual
					</button>
					<button
						type="button"
						class="cursor-pointer rounded px-2 py-0.5 text-[11px] font-medium font-sans transition-all"
						:class="!isVisualMode ? 'bg-brand-500 text-brand-950 font-semibold shadow-sm' : 'text-brand-300 hover:text-white'"
						@click="isVisualMode = false"
					>
						Kode
					</button>
				</div>

				<!-- Copy Code Button -->
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
		</div>

		<!-- Mermaid Visual Render -->
		<MermaidDiagram
			v-if="isMermaid && isVisualMode"
			:code="props.code"
		/>

		<!-- Pre / Code Slot Container with Shiki Syntax Highlighting -->
		<div
			v-else
			class="custom-scrollbar relative overflow-x-auto p-4 text-[13px] leading-relaxed font-mono sm:text-sm"
		>
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
