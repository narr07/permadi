<script setup lang="ts">
// Pemicu "Kirim masukan" di footer. <dialog> bawaan browser menangani Esc, fokus di dalam dialog,
// dan mengembalikan fokus ke tombol pemicu saat ditutup. Formulir baru dirender saat dialog dibuka.

const { locale } = useI18n()

const dialogRef = ref<HTMLDialogElement | null>(null)
const isOpen = ref(false)
const titleId = useId()

const copy = computed(() => locale.value === 'id'
	? { prompt: 'Ada masukan untuk situs ini?', open: 'Kirim masukan', title: 'Masukan untuk permadi.dev', close: 'Tutup' }
	: { prompt: 'Feedback about this site?', open: 'Send feedback', title: 'Feedback for permadi.dev', close: 'Close' })

function open() {
	isOpen.value = true
	nextTick(() => dialogRef.value?.showModal())
}

function close() {
	dialogRef.value?.close()
}

// Klik di area gelap di luar kotak dialog menutup dialog
function onDialogClick(event: MouseEvent) {
	if (event.target === dialogRef.value)
		close()
}
</script>

<template>
	<div class="flex flex-wrap items-center gap-2 text-slate-700 dark:text-slate-300">
		<span>{{ copy.prompt }}</span>
		<button
			type="button"
			class="cursor-pointer border border-slate-300 px-3 py-1.5 text-slate-900 font-bold transition-colors dark:border-[#134e43] hover:border-brand-500 dark:text-slate-50 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2 focus-visible:outline dark:hover:text-brand-400"
			aria-haspopup="dialog"
			@click="open"
		>
			{{ copy.open }}
		</button>
	</div>

	<dialog
		v-if="isOpen"
		ref="dialogRef"
		:aria-labelledby="titleId"
		class="m-auto max-h-[calc(100dvh-2rem)] max-w-lg w-[calc(100%-2rem)] overflow-y-auto border border-slate-300 bg-white p-0 text-slate-900 dark:border-[#134e43] backdrop:bg-slate-950/60 dark:bg-[#001e1c] dark:text-slate-100"
		@click="onDialogClick"
		@close="isOpen = false"
	>
		<div class="p-5 sm:p-6">
			<div class="mb-4 flex items-start justify-between gap-4">
				<h2
					:id="titleId"
					class="m-0 text-lg font-900 font-heading"
				>
					{{ copy.title }}
				</h2>
				<button
					type="button"
					class="h-9 w-9 inline-flex shrink-0 cursor-pointer items-center justify-center border border-slate-300 text-slate-900 transition-colors dark:border-[#134e43] hover:border-brand-600 dark:text-slate-100 focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2 focus-visible:outline dark:hover:border-brand-400"
					:aria-label="copy.close"
					@click="close"
				>
					<span
						class="i-carbon-close text-lg"
						aria-hidden="true"
					/>
				</button>
			</div>
			<AppFeedbackForm />
		</div>
	</dialog>
</template>
