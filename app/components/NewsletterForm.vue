<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

const { t } = useI18n()

const isSuccess = ref(false)
const isSubmitting = ref(false)
const successMessage = ref('')

const { defineField, errors, handleSubmit, resetForm } = useForm({
	validationSchema: toTypedSchema(
		z.object({
			email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
		}),
	),
})

const [email] = defineField('email')

const onSubmit = handleSubmit(async (_values) => {
	isSubmitting.value = true
	try {
		// Simulasi submit/langganan newsletter
		await new Promise(resolve => setTimeout(resolve, 600))
		isSuccess.value = true
		successMessage.value = t('newsletter.success', 'Terima kasih telah berlangganan!')
		resetForm()
	}
	catch (err) {
		console.error(err)
	}
	finally {
		isSubmitting.value = false
	}
})
</script>

<template>
	<form
		class="mt-3 flex flex-col gap-2 sm:flex-row"
		@submit.prevent="onSubmit"
	>
		<div class="flex-1">
			<input
				v-model="email"
				type="email"
				name="email"
				autocomplete="email"
				spellcheck="false"
				aria-label="Email"
				placeholder="email@kamu.com…"
				class="w-full border border-slate-200 rounded-bento bg-white px-3.5 py-2.5 text-g1 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white placeholder:text-slate-400 focus-ring"
				:class="{ 'border-red-500! ring-1 ring-red-500/50': errors.email }"
			>
			<p
				v-if="errors.email"
				aria-live="polite"
				class="mt-1.5 flex items-center gap-1 text-meta text-red-500"
			>
				<span class="i-hugeicons-alert-circle text-xs" /> {{ errors.email }}
			</p>
			<p
				v-if="isSuccess"
				aria-live="polite"
				class="mt-1.5 flex items-center gap-1 text-meta text-emerald-500"
			>
				<span class="i-hugeicons-checkmark-circle-02 text-xs" /> {{ successMessage }}
			</p>
		</div>
		<button
			type="submit"
			class="btn-primary cursor-pointer self-start sm:self-auto !py-2.5"
			:disabled="isSubmitting"
		>
			<span
				v-if="isSubmitting"
				class="i-hugeicons-loading-03 animate-spin text-lg"
			/>
			<span
				v-else
				class="flex items-center gap-1.5"
			>
				Subscribe <span class="i-hugeicons-sent text-xs" />
			</span>
		</button>
	</form>
</template>
