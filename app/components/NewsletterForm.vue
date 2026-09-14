<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

const { locale, t } = useI18n()

const isSuccess = ref(false)
const isSubmitting = ref(false)
const successMessage = ref('')
const serverError = ref('')

const { defineField, errors, handleSubmit, resetForm } = useForm({
	validationSchema: toTypedSchema(
		z.object({
			email: z.string().min(1, () => t('newsletter.error_required', 'Email wajib diisi')).email(() => t('newsletter.error_invalid', 'Format email tidak valid')),
		}),
	),
})

const [email] = defineField('email')

watch(email, () => {
	if (serverError.value) {
		serverError.value = ''
	}
	if (isSuccess.value) {
		isSuccess.value = false
	}
})

const onSubmit = handleSubmit(async (values) => {
	isSubmitting.value = true
	isSuccess.value = false
	serverError.value = ''
	try {
		const res = await $fetch<{ success: boolean, message?: string }>('/api/subscribe', {
			method: 'POST',
			body: { email: values.email },
		})

		isSuccess.value = true
		if (res.message === 'already_subscribed') {
			successMessage.value = t('newsletter.already_subscribed', 'Email kamu sudah terdaftar sebelumnya.')
		}
		else {
			successMessage.value = t('newsletter.success', 'Terima kasih telah berlangganan!')
		}
		resetForm()
	}
	catch (err: unknown) {
		const errorObj = err as { data?: { statusMessage?: string, message?: string }, statusMessage?: string, message?: string }
		serverError.value = errorObj?.data?.statusMessage || errorObj?.statusMessage || errorObj?.message || t('newsletter.error_failed', 'Gagal berlangganan. Silakan coba lagi.')
	}
	finally {
		isSubmitting.value = false
	}
})
</script>

<template>
	<form
		class="w-full"
		@submit.prevent="onSubmit"
	>
		<!-- Integrated Newsletter Bar -->
		<div
			class="newsletter-box"
			:class="{ 'newsletter-box-error': errors.email || serverError }"
		>
			<input
				v-model="email"
				type="email"
				name="email"
				autocomplete="email"
				spellcheck="false"
				aria-label="Email"
				:placeholder="t('newsletter.placeholder', 'you@domain.com')"
				class="newsletter-input"
			>

			<button
				type="submit"
				class="newsletter-btn"
				:disabled="isSubmitting"
			>
				<span
					v-if="isSubmitting"
					class="i-ph-spinner animate-spin text-xs"
				/>
				<span>{{ isSubmitting ? (locale === 'id' ? 'Mengirim…' : 'Sending…') : t('newsletter.button', 'Subscribe') }}</span>
			</button>
		</div>

		<!-- Feedback message -->
		<p
			v-if="errors.email"
			aria-live="polite"
			class="mt-1.5 flex items-center gap-1 text-xs text-[#ef4565] font-medium"
		>
			<span class="i-ph-warning-circle text-xs" /> {{ errors.email }}
		</p>
		<p
			v-else-if="serverError"
			aria-live="polite"
			class="mt-1.5 flex items-center gap-1 text-xs text-[#ef4565] font-medium"
		>
			<span class="i-ph-warning-circle text-xs" /> {{ serverError }}
		</p>
		<p
			v-if="isSuccess"
			aria-live="polite"
			class="mt-1.5 flex items-center gap-1 text-xs text-emerald-700 font-medium dark:text-emerald-300"
		>
			<span class="i-ph-check-circle text-xs" /> {{ successMessage }}
		</p>
	</form>
</template>

<style scoped>
.newsletter-box {
	display: flex;
	align-items: center;
	padding: 4px;
	border-radius: 0;
	background-color: #ffffff;
	border: 1px solid #c5d9d7;
	transition: all 0.15s ease;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.newsletter-box:focus-within {
	border-color: #14b898;
	box-shadow: 0 0 0 2px rgba(20, 184, 152, 0.18);
}

.newsletter-box-error {
	border-color: #ef4565 !important;
	box-shadow: 0 0 0 2px rgba(239, 69, 101, 0.2) !important;
}

.newsletter-input {
	flex: 1;
	min-width: 0;
	height: 36px;
	border: none;
	background: transparent;
	padding: 0 12px;
	font-size: 14px;
	color: #000b07;
	outline: none;
	border-radius: 0;
}

.newsletter-input::placeholder {
	color: #84a8a4;
}

.newsletter-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	height: 36px;
	padding: 0 16px;
	border-radius: 0;
	border: none;
	font-size: 13px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	cursor: pointer;
	white-space: nowrap;
	background-color: #001e1c;
	color: #ffffff;
	transition: all 0.15s ease;
}

.newsletter-btn:hover:not(:disabled) {
	background-color: #0f7662;
	transform: translateY(-1px);
}

.newsletter-btn:active:not(:disabled) {
	transform: scale(0.97);
}

.newsletter-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.newsletter-btn:focus-visible {
	outline: 2px solid #14b898;
	outline-offset: 2px;
}

:global(.dark) .newsletter-box {
	background-color: #001e1c;
	border-color: #134e43;
}

:global(.dark) .newsletter-box:focus-within {
	border-color: #2bd4b5;
	box-shadow: 0 0 0 2px rgba(43, 212, 181, 0.18);
}

:global(.dark) .newsletter-input {
	color: #f8fafa;
}

:global(.dark) .newsletter-input::placeholder {
	color: #537c77;
}

:global(.dark) .newsletter-btn {
	background-color: #ffffff;
	color: #001e1c;
}

:global(.dark) .newsletter-btn:hover:not(:disabled) {
	background-color: #f0fdfa;
	color: #0f7662;
}
</style>
