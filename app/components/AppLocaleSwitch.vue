<script setup lang="ts">
const { locale } = useI18n()
const { getLocaleSwitchUrl } = useLocaleSwitch()

const isEnglish = computed(() => locale.value === 'en')

const switchLabel = computed(() =>
	isEnglish.value
		? 'Switch language to Indonesian (ID)'
		: 'Ganti bahasa ke Inggris (EN)',
)

async function toggleLocale() {
	const targetLocale = isEnglish.value ? 'id' : 'en'
	await navigateTo(getLocaleSwitchUrl(targetLocale))
}
</script>

<template>
	<button
		type="button"
		role="switch"
		:aria-checked="isEnglish"
		:aria-label="switchLabel"
		:title="switchLabel"
		class="group/switch relative grid grid-cols-2 h-10 w-[72px] shrink-0 cursor-pointer items-center border border-[#c5d9d7] bg-white p-1 text-[11px] font-bold tracking-wider font-mono uppercase transition-all duration-150 active:scale-[0.95] dark:border-[#134e43] hover:border-brand-500 dark:bg-[#001e1c] focus-visible:outline-2 focus-visible:outline-brand-600 focus-visible:outline-offset-2 dark:hover:border-brand-400 dark:focus-visible:outline-brand-400"
		@click="toggleLocale"
	>
		<!-- Sliding thumb (Nuxt UI Switch motion, matched to icon-btn proportions & colors) -->
		<span
			aria-hidden="true"
			class="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-4px)] bg-slate-800 transition-transform duration-200 ease-out dark:bg-slate-100 motion-reduce:transition-none"
			:class="isEnglish ? 'translate-x-full' : 'translate-x-0'"
		/>

		<span
			class="relative z-10 text-center leading-none transition-colors duration-150"
			:class="!isEnglish ? 'text-white dark:text-slate-950' : 'text-slate-600 dark:text-slate-400'"
		>
			ID
		</span>

		<span
			class="relative z-10 text-center leading-none transition-colors duration-150"
			:class="isEnglish ? 'text-white dark:text-slate-950' : 'text-slate-600 dark:text-slate-400'"
		>
			EN
		</span>
	</button>
</template>
