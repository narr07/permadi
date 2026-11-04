<script setup lang="ts">
// Formulir masukan tentang situs (bukan per artikel). Dipakai di dialog footer dan di halaman Kontak.
// Server: server/api/feedback.post.ts. Field "website" adalah honeypot untuk bot.

const emit = defineEmits<{ sent: [] }>()

const { locale } = useI18n()
const route = useRoute()

const MIN_MESSAGE = 10
const MAX_MESSAGE = 2000

type Category = 'design' | 'content' | 'bug' | 'other'
type Status = 'idle' | 'sending' | 'sent' | 'error'

const uid = useId()
const category = ref<Category | ''>('')
const message = ref('')
const email = ref('')
const website = ref('')
const status = ref<Status>('idle')
const errorText = ref('')
const openedAt = ref(0)

onMounted(() => {
	openedAt.value = Date.now()
})

const copy = computed(() => locale.value === 'id'
	? {
			categoryLegend: 'Tentang apa?',
			categories: { design: 'Tampilan', content: 'Isi', bug: 'Error', other: 'Lainnya' },
			message: 'Pesan',
			messageHint: (n: number) => `${n}/${MAX_MESSAGE} karakter, minimal ${MIN_MESSAGE}`,
			email: 'Email (opsional, kalau ingin dibalas)',
			submit: 'Kirim masukan',
			sending: 'Mengirim...',
			sent: 'Terima kasih, masukan Anda sudah terkirim.',
			again: 'Kirim masukan lain',
			errors: {
				category: 'Pilih dulu masukan Anda tentang apa.',
				message: `Pesan perlu ${MIN_MESSAGE} sampai ${MAX_MESSAGE} karakter.`,
				email: 'Format email belum benar.',
				rate: 'Terlalu banyak kiriman dalam satu jam. Coba lagi nanti.',
				network: 'Masukan belum terkirim karena gangguan jaringan. Coba lagi.',
			},
		}
	: {
			categoryLegend: 'What is it about?',
			categories: { design: 'Design', content: 'Content', bug: 'Bug', other: 'Other' },
			message: 'Message',
			messageHint: (n: number) => `${n}/${MAX_MESSAGE} characters, at least ${MIN_MESSAGE}`,
			email: 'Email (optional, if you want a reply)',
			submit: 'Send feedback',
			sending: 'Sending...',
			sent: 'Thank you, your feedback has been sent.',
			again: 'Send more feedback',
			errors: {
				category: 'Choose what your feedback is about.',
				message: `The message needs ${MIN_MESSAGE} to ${MAX_MESSAGE} characters.`,
				email: 'That email address does not look right.',
				rate: 'Too many messages in one hour. Please try again later.',
				network: 'Your feedback was not sent because of a network problem. Please try again.',
			},
		})

const categoryOptions = computed(() => (Object.keys(copy.value.categories) as Category[])
	.map(value => ({ value, label: copy.value.categories[value] })))

function validate() {
	if (!category.value)
		return copy.value.errors.category
	const length = message.value.trim().length
	if (length < MIN_MESSAGE || length > MAX_MESSAGE)
		return copy.value.errors.message
	if (email.value.trim() && !/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email.value.trim()))
		return copy.value.errors.email
	return ''
}

async function submit() {
	errorText.value = validate()
	if (errorText.value) {
		status.value = 'error'
		return
	}
	status.value = 'sending'
	try {
		await $fetch('/api/feedback', {
			method: 'POST',
			body: {
				category: category.value,
				message: message.value.trim(),
				email: email.value.trim(),
				page: route.path,
				locale: locale.value,
				website: website.value,
				elapsed: Date.now() - openedAt.value,
			},
		})
		status.value = 'sent'
		emit('sent')
	}
	catch (err) {
		const code = err as { statusMessage?: string, statusCode?: number }
		errorText.value = code.statusCode === 429
			? copy.value.errors.rate
			: code.statusMessage === 'invalid_email'
				? copy.value.errors.email
				: code.statusMessage === 'invalid_message'
					? copy.value.errors.message
					: copy.value.errors.network
		status.value = 'error'
	}
}

function reset() {
	category.value = ''
	message.value = ''
	email.value = ''
	errorText.value = ''
	status.value = 'idle'
	openedAt.value = Date.now()
}
</script>

<template>
	<div
		v-if="status === 'sent'"
		class="flex flex-col items-start gap-3"
	>
		<p
			class="m-0 text-sm text-brand-700 font-semibold dark:text-brand-300"
			role="status"
		>
			{{ copy.sent }}
		</p>
		<button
			type="button"
			class="cursor-pointer border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition-colors dark:border-[#134e43] hover:border-brand-600 dark:bg-[#001e1c] dark:text-slate-100 focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2 focus-visible:outline dark:hover:border-brand-400"
			@click="reset"
		>
			{{ copy.again }}
		</button>
	</div>

	<form
		v-else
		class="flex flex-col gap-4 text-sm font-sans"
		novalidate
		@submit.prevent="submit"
	>
		<fieldset class="m-0 border-0 p-0">
			<legend class="mb-2 text-slate-900 font-semibold dark:text-slate-100">
				{{ copy.categoryLegend }}
			</legend>
			<div class="flex flex-wrap gap-2">
				<label
					v-for="option in categoryOptions"
					:key="option.value"
					class="inline-flex cursor-pointer items-center gap-2 border border-slate-300 bg-white px-3 py-2 text-slate-800 dark:border-[#134e43] dark:bg-[#002420] dark:text-slate-100"
				>
					<input
						v-model="category"
						type="radio"
						:name="`${uid}-category`"
						:value="option.value"
						class="m-0 accent-brand-600 dark:accent-brand-400"
					>
					{{ option.label }}
				</label>
			</div>
		</fieldset>

		<div class="flex flex-col gap-1.5">
			<label
				:for="`${uid}-message`"
				class="text-slate-900 font-semibold dark:text-slate-100"
			>{{ copy.message }}</label>
			<textarea
				:id="`${uid}-message`"
				v-model="message"
				rows="4"
				:maxlength="MAX_MESSAGE"
				:aria-describedby="`${uid}-message-hint`"
				class="w-full resize-y border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-[#134e43] dark:bg-[#002420] dark:text-slate-100 focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2 focus-visible:outline"
			/>
			<span
				:id="`${uid}-message-hint`"
				class="text-xs text-slate-700 tabular-nums dark:text-slate-300"
			>{{ copy.messageHint(message.trim().length) }}</span>
		</div>

		<div class="flex flex-col gap-1.5">
			<label
				:for="`${uid}-email`"
				class="text-slate-900 font-semibold dark:text-slate-100"
			>{{ copy.email }}</label>
			<input
				:id="`${uid}-email`"
				v-model="email"
				type="email"
				autocomplete="email"
				inputmode="email"
				class="w-full border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-[#134e43] dark:bg-[#002420] dark:text-slate-100 focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2 focus-visible:outline"
			>
		</div>

		<!-- Honeypot: tersembunyi dari pengunjung dan pembaca layar, biasanya diisi bot -->
		<div
			class="absolute h-px w-px overflow-hidden -left-[9999px]"
			aria-hidden="true"
		>
			<label :for="`${uid}-website`">Website</label>
			<input
				:id="`${uid}-website`"
				v-model="website"
				type="text"
				tabindex="-1"
				autocomplete="off"
			>
		</div>

		<p
			v-if="status === 'error' && errorText"
			class="m-0 text-sm text-red-700 font-semibold dark:text-red-300"
			role="alert"
		>
			{{ errorText }}
		</p>

		<div>
			<button
				type="submit"
				class="inline-flex cursor-pointer items-center gap-2 border border-transparent bg-slate-900 px-4 py-2.5 text-sm text-white font-semibold transition-colors disabled:cursor-not-allowed dark:bg-brand-400 hover:bg-slate-800 dark:text-slate-950 disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2 focus-visible:outline dark:hover:bg-brand-300"
				:disabled="status === 'sending'"
			>
				{{ status === 'sending' ? copy.sending : copy.submit }}
			</button>
		</div>
	</form>
</template>
