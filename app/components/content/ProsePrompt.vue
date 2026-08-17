<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { computed, useSlots } from 'vue'

const props = withDefaults(
	defineProps<{
		description?: string
		icon?: string
		actions?: ('copy' | 'cursor' | 'windsurf' | 'claude')[]
		class?: any
	}>(),
	{
		description: undefined,
		icon: 'i-hugeicons-ai-magic',
		actions: () => ['copy'],
		class: undefined,
	},
)

const slots = useSlots()
const { copy, copied } = useClipboard()

function extractText(nodes: any): string {
	if (!nodes)
		return ''
	if (typeof nodes === 'string')
		return nodes
	if (Array.isArray(nodes))
		return nodes.map(extractText).join('')
	if (nodes.children)
		return extractText(nodes.children)
	return ''
}

const promptText = computed(() => {
	const defaultSlot = slots.default?.()
	return defaultSlot ? extractText(defaultSlot).trim() : ''
})

function handleCopy() {
	if (promptText.value) {
		copy(promptText.value)
	}
}

function openInCursor() {
	window.open(`cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(promptText.value)}`, '_self')
}

function openInWindsurf() {
	window.open(`windsurf://cascade/newChat?prompt=${encodeURIComponent(promptText.value)}`, '_self')
}

function openInClaude() {
	window.open(`claude://code/new?q=${encodeURIComponent(promptText.value)}`, '_self')
}
</script>

<template>
	<div
		class="my-6 overflow-hidden border border-brand-500/30 rounded-2xl bg-white/80 shadow-md backdrop-blur-md dark:border-[#134e43]/70 dark:bg-[#001c19]/90"
		:class="props.class"
	>
		<!-- Prompt Header / Action Bar -->
		<div class="flex select-none items-center justify-between border-b border-brand-500/20 bg-brand-50/60 px-4 py-2.5 dark:border-[#134e43]/50 dark:bg-black/20">
			<div class="flex items-center gap-2 text-xs text-brand-700 font-semibold font-sans dark:text-brand-300">
				<span
					:class="props.icon"
					class="shrink-0 text-base text-brand-600 dark:text-brand-400"
				/>
				<span>AI Prompt</span>
			</div>

			<div class="flex items-center gap-1.5">
				<button
					v-if="props.actions.includes('copy')"
					type="button"
					class="flex cursor-pointer items-center gap-1.5 border border-brand-500/30 rounded-lg bg-brand-500/10 px-2.5 py-1 text-xs text-brand-800 transition-all dark:border-brand-500/20 dark:bg-brand-500/15 hover:bg-brand-500/20 dark:text-brand-200"
					:aria-label="copied ? 'Prompt tersalin' : 'Salin prompt'"
					@click="handleCopy"
				>
					<span
						:class="copied ? 'i-hugeicons-checkmark-circle-02 text-brand-600 dark:text-brand-400' : 'i-hugeicons-copy-01'"
						class="shrink-0 text-xs"
					/>
					<span class="text-[11px] font-medium font-sans">
						{{ copied ? 'Tersalin!' : 'Salin Prompt' }}
					</span>
				</button>

				<button
					v-if="props.actions.includes('cursor')"
					type="button"
					class="flex cursor-pointer items-center gap-1 border border-slate-200 rounded-lg bg-white px-2 py-1 text-xs text-slate-700 transition-all dark:border-white/10 dark:bg-white/5 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/10"
					title="Buka di Cursor"
					@click="openInCursor"
				>
					<span class="i-simple-icons-cursor shrink-0 text-xs text-brand-500" />
					<span class="text-[11px] font-sans">Cursor</span>
				</button>

				<button
					v-if="props.actions.includes('windsurf')"
					type="button"
					class="flex cursor-pointer items-center gap-1 border border-slate-200 rounded-lg bg-white px-2 py-1 text-xs text-slate-700 transition-all dark:border-white/10 dark:bg-white/5 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/10"
					title="Buka di Windsurf"
					@click="openInWindsurf"
				>
					<span class="i-simple-icons-windsurf shrink-0 text-xs text-teal-500" />
					<span class="text-[11px] font-sans">Windsurf</span>
				</button>

				<button
					v-if="props.actions.includes('claude')"
					type="button"
					class="flex cursor-pointer items-center gap-1 border border-slate-200 rounded-lg bg-white px-2 py-1 text-xs text-slate-700 transition-all dark:border-white/10 dark:bg-white/5 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/10"
					title="Buka di Claude"
					@click="openInClaude"
				>
					<span class="i-simple-icons-claude shrink-0 text-xs text-amber-500" />
					<span class="text-[11px] font-sans">Claude</span>
				</button>
			</div>
		</div>

		<!-- Prompt Content -->
		<div class="p-4 text-sm text-slate-700 leading-relaxed font-sans dark:text-slate-200">
			<p
				v-if="props.description"
				class="mb-2 text-xs text-slate-500 font-medium italic dark:text-slate-400"
			>
				{{ props.description }}
			</p>
			<slot />
		</div>
	</div>
</template>
