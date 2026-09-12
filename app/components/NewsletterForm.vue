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
		<!-- Bento Integrated Bar (Nuxt style) -->
		<div
			class="bento-subscribe-box"
			:class="{ 'bento-subscribe-box-error': errors.email || serverError }"
		>
			<input
				v-model="email"
				type="email"
				name="email"
				autocomplete="email"
				spellcheck="false"
				aria-label="Email"
				:placeholder="t('newsletter.placeholder', 'you@domain.com')"
				class="bento-subscribe-input"
			>

			<button
				type="submit"
				class="bento-subscribe-btn"
				:disabled="isSubmitting"
			>
				<span
					v-if="isSubmitting"
					class="i-hugeicons-loading-03 animate-spin text-xs"
				/>
				<span>{{ isSubmitting ? (locale === 'id' ? 'Mengirim…' : 'Sending…') : t('newsletter.button', 'Subscribe') }}</span>
			</button>
		</div>

		<!-- Feedback message -->
		<p
			v-if="errors.email"
			aria-live="polite"
			class="mt-1.5 flex items-center gap-1 text-xs text-red font-medium"
		>
			<span class="i-hugeicons-alert-circle text-xs" /> {{ errors.email }}
		</p>
		<p
			v-else-if="serverError"
			aria-live="polite"
			class="mt-1.5 flex items-center gap-1 text-xs text-red font-medium"
		>
			<span class="i-hugeicons-alert-circle text-xs" /> {{ serverError }}
		</p>
		<p
			v-if="isSuccess"
			aria-live="polite"
			class="mt-1.5 flex items-center gap-1 text-xs text-emerald-700 font-medium dark:text-emerald-300"
		>
			<span class="i-hugeicons-checkmark-circle-02 text-xs" /> {{ successMessage }}
		</p>
	</form>
</template>

<style scoped>
.bento-subscribe-box {
	display: flex;
	align-items: center;
	padding: 4px;
	border-radius: 12px;
	background-color: #ffffff;
	border: 1px solid #c5d9d7;
	transition: all 0.15s ease;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.bento-subscribe-box:focus-within {
	border-color: #14b898;
	box-shadow: 0 0 0 3px rgba(20, 184, 152, 0.18);
}

.bento-subscribe-box-error {
	border-color: #ef4565 !important;
	box-shadow: 0 0 0 3px rgba(239, 69, 101, 0.2) !important;
}

.bento-subscribe-input {
	flex: 1;
	min-width: 0;
	height: 36px;
	border: none;
	background: transparent;
	padding: 0 12px;
	font-size: 14px;
	color: #000b07;
	outline: none;
}

.bento-subscribe-input::placeholder {
	color: #84a8a4;
}

.bento-subscribe-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	height: 36px;
	padding: 0 16px;
	border-radius: 8px;
	border: none;
	font-size: 13px;
	font-weight: 600;
	cursor: pointer;
	white-space: nowrap;
	background-color: #001e1c;
	color: #ffffff;
	transition: all 0.15s ease;
}

.bento-subscribe-btn:hover:not(:disabled) {
	background-color: #0f7662;
}

.bento-subscribe-btn:active:not(:disabled) {
	transform: scale(0.97);
}

.bento-subscribe-btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.bento-subscribe-btn:focus-visible {
	outline: 2px solid #14b898;
	outline-offset: 2px;
}

:global(.dark) .bento-subscribe-box {
	background-color: #001e1c;
	border-color: #134e43;
}

:global(.dark) .bento-subscribe-box:focus-within {
	border-color: #2bd4b5;
	box-shadow: 0 0 0 3px rgba(43, 212, 181, 0.18);
}

:global(.dark) .bento-subscribe-input {
	color: #f8fafa;
}

:global(.dark) .bento-subscribe-input::placeholder {
	color: #537c77;
}

:global(.dark) .bento-subscribe-btn {
	background-color: #ffffff;
	color: #001e1c;
}

:global(.dark) .bento-subscribe-btn:hover:not(:disabled) {
	background-color: #f0fdfa;
	color: #0f7662;
}
</style>
