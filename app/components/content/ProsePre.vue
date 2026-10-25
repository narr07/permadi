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
const { locale } = useI18n()

const labels = computed(() => locale.value === 'id'
	? { copy: 'Salin', copied: 'Tersalin', copyAria: 'Salin kode', diagram: 'Diagram', code: 'Kode' }
	: { copy: 'Copy', copied: 'Copied', copyAria: 'Copy code', diagram: 'Diagram', code: 'Code' })

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
	'terminal': 'i-carbon-screen',
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
	<!-- not-prose: gaya tipografi artikel (mis. margin 2em pada img) tidak boleh masuk ke header -->
	<div class="not-prose my-6 overflow-hidden border border-slate-200 bg-white prose-code-block dark:border-[#134e43] dark:bg-[#00140f]">
		<div class="h-10 flex select-none items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 pl-3 pr-1 text-xs font-mono dark:border-[#134e43] dark:bg-[#00211e]">
			<div class="min-w-0 flex items-center gap-2">
				<FileTypeIcon
					:icon="isMermaid ? 'i-carbon-branch text-brand-600 dark:text-brand-400' : fileIcon"
					class="shrink-0 text-sm"
				/>
				<span
					v-if="resolvedFilename"
					class="truncate text-slate-800 dark:text-slate-200"
				>
					{{ resolvedFilename }}
				</span>
				<span
					v-if="displayLanguage"
					class="shrink-0 text-slate-500 dark:text-slate-400"
				>
					{{ isMermaid ? labels.diagram : displayLanguage }}
				</span>
			</div>

			<div class="flex shrink-0 items-center gap-1">
				<div
					v-if="isMermaid"
					class="flex items-center border border-slate-200 p-0.5 dark:border-[#134e43]"
				>
					<button
						type="button"
						class="h-6 cursor-pointer px-2 text-[11px] transition-colors"
						:class="isVisualMode ? 'bg-slate-900 text-white dark:bg-brand-400 dark:text-slate-950' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50'"
						:aria-pressed="isVisualMode"
						@click="isVisualMode = true"
					>
						Visual
					</button>
					<button
						type="button"
						class="h-6 cursor-pointer px-2 text-[11px] transition-colors"
						:class="!isVisualMode ? 'bg-slate-900 text-white dark:bg-brand-400 dark:text-slate-950' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50'"
						:aria-pressed="!isVisualMode"
						@click="isVisualMode = false"
					>
						{{ labels.code }}
					</button>
				</div>

				<button
					type="button"
					class="h-8 inline-flex cursor-pointer items-center gap-1.5 px-2 text-xs text-slate-600 font-sans transition-colors hover:bg-slate-200 dark:text-slate-400 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2 focus-visible:outline dark:hover:bg-[#0a3a35] dark:hover:text-slate-50"
					:aria-label="copied ? labels.copied : labels.copyAria"
					@click="handleCopy"
				>
					<span
						:class="copied ? 'i-carbon-checkmark text-brand-600 dark:text-brand-400' : 'i-carbon-copy'"
						class="shrink-0"
						aria-hidden="true"
					/>
					<span aria-live="polite">{{ copied ? labels.copied : labels.copy }}</span>
				</button>
			</div>
		</div>

		<MermaidDiagram
			v-if="isMermaid && isVisualMode"
			:code="props.code"
		/>

		<div
			v-else
			class="custom-scrollbar relative overflow-x-auto px-4 py-3.5 text-[13px] leading-relaxed font-mono"
		>
			<pre
				:class="props.class"
				:style="props.style"
			><slot /></pre>
		</div>
	</div>
</template>

<style scoped>
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

/* Warna token mengikuti tema lewat --shiki-default (terang) dan --shiki-dark di main.css */

:deep(.line) {
	display: block !important;
	min-height: 1.5rem;
}

:deep(.line.highlight) {
	background-color: rgba(20, 184, 152, 0.12) !important;
	margin-left: -1rem;
	margin-right: -1rem;
	padding-left: calc(1rem - 2px);
	padding-right: 1rem;
	border-left: 2px solid #14b898;
}
</style>
