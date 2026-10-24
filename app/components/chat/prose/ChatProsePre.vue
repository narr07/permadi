<script setup lang="ts">
const props = defineProps<{
	language?: string
	class?: any
}>()

const { locale } = useI18n()
const preRef = ref<HTMLPreElement | null>(null)
const copied = ref(false)

const copyLabel = computed(() => {
	if (locale.value === 'id')
		return copied.value ? 'Tersalin' : 'Salin kode'
	return copied.value ? 'Copied' : 'Copy code'
})

async function copyCode() {
	try {
		await navigator.clipboard.writeText(preRef.value?.textContent ?? '')
		copied.value = true
		setTimeout(() => copied.value = false, 2000)
	}
	catch {}
}
</script>

<template>
	<div class="chat-code my-3 overflow-hidden border border-slate-200 rounded-md dark:border-[#134e43]">
		<div class="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-3 py-1 dark:border-[#134e43] dark:bg-[#00211e]">
			<span class="text-xs text-slate-600 font-mono dark:text-slate-400">{{ props.language || 'text' }}</span>
			<button
				type="button"
				class="h-7 inline-flex cursor-pointer items-center gap-1.5 rounded px-2 text-xs text-slate-600 font-sans transition-colors hover:bg-slate-200 dark:text-slate-400 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2 focus-visible:outline dark:hover:bg-[#0a3a35] dark:hover:text-slate-50"
				:aria-label="copyLabel"
				@click="copyCode"
			>
				<span
					:class="copied ? 'i-carbon-checkmark' : 'i-carbon-copy'"
					aria-hidden="true"
				/>
				{{ copyLabel }}
			</button>
		</div>
		<pre
			ref="preRef"
			class="overflow-x-auto bg-white p-3 text-[0.8125rem] leading-relaxed font-mono dark:bg-[#00140f]"
			:class="props.class"
		><slot /></pre>
	</div>
</template>

<style scoped>
/* rangi menulis warna mode gelap di --shiki-dark; inline style perlu dikalahkan di mode gelap */
:global(.dark) .chat-code pre :deep(span[style*='--shiki-dark']) {
	color: var(--shiki-dark) !important;
}
</style>
