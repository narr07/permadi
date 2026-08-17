<script setup lang="ts">
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
		const ext = filename.includes('.') ? filename.split('.').pop()?.toLowerCase() : language.toLowerCase()

		let icon = 'i-vscode-icons-default-file'
		switch (ext) {
			case 'ts':
			case 'typescript':
				icon = 'i-vscode-icons-file-type-typescript'
				break
			case 'tsx':
				icon = 'i-vscode-icons-file-type-reactts'
				break
			case 'jsx':
			case 'react':
				icon = 'i-vscode-icons-file-type-reactjs'
				break
			case 'js':
			case 'javascript':
				icon = 'i-vscode-icons-file-type-js'
				break
			case 'vue':
				icon = 'i-vscode-icons-file-type-vue'
				break
			case 'dart':
			case 'flutter':
				icon = 'i-vscode-icons-file-type-dartlang'
				break
			case 'go':
				icon = 'i-vscode-icons-file-type-go'
				break
			case 'kt':
			case 'kotlin':
				icon = 'i-vscode-icons-file-type-kotlin'
				break
			case 'sql':
				icon = 'i-vscode-icons-file-type-sql'
				break
			case 'html':
				icon = 'i-vscode-icons-file-type-html'
				break
			case 'css':
				icon = 'i-vscode-icons-file-type-css'
				break
			case 'json':
				icon = 'i-vscode-icons-file-type-json'
				break
			case 'yaml':
			case 'yml':
				icon = 'i-vscode-icons-file-type-yaml'
				break
			case 'md':
			case 'mdc':
				icon = 'i-vscode-icons-file-type-markdown'
				break
			case 'sh':
			case 'bash':
				icon = 'i-vscode-icons-file-type-shell'
				break
			case 'py':
			case 'python':
				icon = 'i-vscode-icons-file-type-python'
				break
			case 'rs':
			case 'rust':
				icon = 'i-vscode-icons-file-type-rust'
				break
		}

		return {
			label: filename,
			icon,
			vnode,
		}
	})
})
</script>

<template>
	<div
		class="prose-code-group my-6 overflow-hidden border border-[#115e4f]/30 rounded-2xl bg-[#042f27] shadow-xl dark:border-[#134e43]/60 dark:bg-[#001412]"
		:class="props.class"
	>
		<!-- Bento Tab Bar -->
		<div class="custom-scrollbar flex items-center gap-1.5 overflow-x-auto border-b border-[#115e4f]/40 bg-[#02211c]/95 p-1.5 dark:border-[#134e43]/50 dark:bg-[#001c19]/90">
			<button
				v-for="(tab, idx) in tabs"
				:key="idx"
				type="button"
				class="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-mono transition-all"
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
