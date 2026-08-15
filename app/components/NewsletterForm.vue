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
			})
		),
	})

	const [email] = defineField('email')

	const onSubmit = handleSubmit(async (values) => {
		isSubmitting.value = true
		try {
			// Simulasi submit/langganan newsletter
			await new Promise((resolve) => setTimeout(resolve, 600))
			isSuccess.value = true
			successMessage.value = t('newsletter.success', 'Terima kasih telah berlangganan!')
			resetForm()
		} catch (err) {
			console.error(err)
		} finally {
			isSubmitting.value = false
		}
	})
</script>

<template>
	<form class="flex flex-col sm:flex-row gap-2 mt-3" @submit.prevent="onSubmit">
		<div class="flex-1">
			<input
				v-model="email"
				type="email"
				placeholder="email@kamu.com"
				class="focus-ring w-full px-3.5 py-2.5 rounded-bento border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-g1 text-slate-900 dark:text-white placeholder:text-slate-400"
				:class="{ 'border-red-500! ring-1 ring-red-500/50': errors.email }"
			>
			<p v-if="errors.email" class="text-meta text-red-500 mt-1.5 flex items-center gap-1">
				<span class="i-lucide-alert-circle text-xs" /> {{ errors.email }}
			</p>
			<p v-if="isSuccess" class="text-meta text-emerald-500 mt-1.5 flex items-center gap-1">
				<span class="i-lucide-check-circle text-xs" /> {{ successMessage }}
			</p>
		</div>
		<button
			type="submit"
			class="btn-primary !py-2.5 self-start sm:self-auto cursor-pointer"
			:disabled="isSubmitting"
		>
			<span v-if="isSubmitting" class="i-lucide-loader-2 animate-spin text-lg" />
			<span v-else class="flex items-center gap-1.5">
				Subscribe <span class="i-lucide-send text-xs" />
			</span>
		</button>
	</form>
</template>
