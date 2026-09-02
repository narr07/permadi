<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { computed, ref, useSlots } from 'vue'

const props = withDefaults(
	defineProps<{
		defaultValue?: string
		sync?: string
		class?: any
	}>(),
	{
		defaultValue: '0',
		sync: undefined,
		class: undefined,
	},
)

const slots = useSlots()
const selectedIndex = ref(Number.parseInt(props.defaultValue, 10) || 0)
const { copy, copied } = useClipboard({ copiedDuring: 2000 })

function extractText(node: any): string {
	if (!node)
		return ''
	if (typeof node === 'string')
		return node
	if (Array.isArray(node))
		return node.map(extractText).join('')
	if (node.props?.code)
		return node.props.code
	if (node.children) {
		if (typeof node.children === 'string')
			return node.children
		if (Array.isArray(node.children))
			return node.children.map(extractText).join('')
		if (typeof node.children === 'object' && typeof node.children.default === 'function')
			return extractText(node.children.default())
	}
	return ''
}

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

function resolveIcon(filename?: string, language?: string): string {
	if (!filename && !language)
		return 'i-vscode-icons-default-file'

	const clean = (filename || '').replace(/\s*\(.*\)\s*$/, '').trim().toLowerCase()
	const name = clean.split('/').pop() || ''
	const ext = clean.includes('.') ? clean.split('.').pop() || '' : clean
	const lang = (language || '').toLowerCase()

	// 1. Exact match by clean filename / label
	if (iconMap[clean])
		return iconMap[clean]
	if (iconMap[name])
		return iconMap[name]
	// 2. Match by extension / label keyword
	if (iconMap[ext])
		return iconMap[ext]
	// 3. Match by language prop
	if (iconMap[lang])
		return iconMap[lang]

	return 'i-vscode-icons-default-file'
}

const tabs = computed(() => {
	const defaultSlot = slots.default?.() || []
	const flat = defaultSlot.flatMap((vnode: any) => {
		if (typeof vnode.type === 'symbol' && Array.isArray(vnode.children)) {
			return vnode.children
		}
		return vnode
	}).filter(Boolean)

	return flat.map((vnode: any, idx: number) => {
		const filename = vnode.props?.filename || vnode.props?.label || vnode.props?.meta || `Tab ${idx + 1}`
		const language = vnode.props?.language || ''
		const icon = vnode.props?.icon || resolveIcon(filename, language)

		return {
			label: filename,
			icon,
			vnode,
		}
	})
})

const activeCode = computed(() => {
	const activeTab = tabs.value[selectedIndex.value]
	if (!activeTab?.vnode)
		return ''
	if (activeTab.vnode.props?.code)
		return activeTab.vnode.props.code
	return extractText(activeTab.vnode)
})

function handleCopy() {
	if (activeCode.value) {
		copy(activeCode.value)
	}
}
</script>

<template>
	<div
		class="prose-code-group my-6 overflow-hidden border border-[#115e4f]/30 rounded-2xl bg-[#042f27] shadow-xl dark:border-[#134e43]/60 dark:bg-[#001412]"
		:class="props.class"
	>
		<!-- Bento Tab Bar & Action Header -->
		<div class="flex items-center justify-between border-b border-[#115e4f]/40 bg-[#02211c]/95 px-2 py-1.5 dark:border-[#134e43]/50 dark:bg-[#001c19]/90">
			<!-- Tab Buttons List -->
			<div class="custom-scrollbar flex min-w-0 items-center gap-1.5 overflow-x-auto pr-2">
				<button
					v-for="(tab, idx) in tabs"
					:key="idx"
					type="button"
					class="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-mono transition-all"
					:class="[
						selectedIndex === idx
							? 'bg-brand-500/20 text-brand-200 font-semibold shadow-xs border border-brand-500/30 dark:bg-white/10 dark:text-white dark:border-white/15'
							: 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent',
					]"
					@click="selectedIndex = idx"
				>
					<span
						:class="tab.icon"
						class="shrink-0 text-sm"
					/>
					<span>{{ tab.label }}</span>
				</button>
			</div>

			<!-- Copy Button on Right -->
			<button
				type="button"
				class="group/btn flex shrink-0 cursor-pointer items-center gap-1.5 border border-brand-500/25 rounded-lg bg-brand-950/40 px-2.5 py-1 text-xs text-brand-200 font-sans transition-all hover:border-brand-400/50 hover:bg-brand-500/20 hover:text-white"
				:aria-label="copied ? 'Tersalin' : 'Salin kode'"
				@click="handleCopy"
			>
				<span
					class="transition-transform duration-200"
					:class="[
						copied ? 'i-lucide-check text-brand-300 scale-110' : 'i-lucide-copy text-brand-300/80 group-hover/btn:scale-110',
					]"
				/>
				<span class="text-[11px] font-medium">
					{{ copied ? 'Tersalin' : 'Salin' }}
				</span>
			</button>
		</div>

		<!-- Tab Content Container -->
		<div class="relative">
			<template
				v-for="(tab, idx) in tabs"
				:key="idx"
			>
				<div
					v-show="selectedIndex === idx"
					class="code-group-panel"
				>
					<component :is="tab.vnode" />
				</div>
			</template>
		</div>
	</div>
</template>

<style scoped>
:deep(.prose-code-block) {
	margin: 0 !important;
	border: none !important;
	border-radius: 0 !important;
	box-shadow: none !important;
	background: transparent !important;
}

:deep(.prose-code-block > div:first-child) {
	display: none !important;
}
</style>
