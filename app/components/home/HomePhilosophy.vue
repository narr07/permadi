<script setup lang="ts">
	export interface PhilosophyData {
		number?: string
		quote?: string
		quote_bold?: string
		label?: string
	}

	const props = withDefaults(
		defineProps<{
			philosophy?: PhilosophyData
		}>(),
		{
			philosophy: () => ({}),
		}
	)

	const { locale } = useI18n()
</script>

<template>
	<div class="sand-card-clean md:col-span-5 p-6 sm:p-7 flex flex-col justify-between">
		<div class="flex items-center justify-between">
			<span class="i-hugeicons-sparkles text-lg text-brand-900" />
			<span class="text-xs font-mono text-brand-700 font-semibold">
				{{ philosophy.number || '01 / 04' }}
			</span>
		</div>
		<p class=" text-xl sm:text-2xl text-brand-950 leading-snug my-4 ">
			{{ philosophy.quote || (locale === 'id' ? 'Desain yang baik itu tenang.' : 'Good design is quiet.') }}<br>
			<strong>{{ philosophy.quote_bold || (locale === 'id' ? 'Desain luar biasa akan selalu membekas.' : 'Great design stays with you.') }}</strong>
		</p>
		<span class="text-xs uppercase tracking-wider font-mono text-brand-950">
			{{ philosophy.label || 'Permadi Philosophy' }}
		</span>
	</div>
</template>
