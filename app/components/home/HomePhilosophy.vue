<script setup lang="ts">
import { Motion } from 'motion-v'

export interface PhilosophyData {
	number?: string
	quote?: string
	quote_bold?: string
	label?: string
}

withDefaults(
	defineProps<{
		philosophy?: PhilosophyData
	}>(),
	{
		philosophy: () => ({}),
	},
)

const { locale } = useI18n()
</script>

<template>
	<Motion
		as="div"
		:initial="{ opacity: 0, transform: 'translateY(16px)' }"
		:while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
		:transition="{ type: 'spring', stiffness: 80, damping: 20 }"
		:in-view-options="{ margin: '-60px' }"
		class="sand-card-clean flex flex-col justify-between p-6 md:col-span-5 sm:p-7"
	>
		<div class="flex items-center justify-between">
			<span class="i-hugeicons-compass-01 text-lg text-brand-950" />
			<span class="text-xs text-brand-950 font-bold font-mono">
				{{ philosophy.number || '01 / 04' }}
			</span>
		</div>
		<p class="my-4 text-xl text-brand-950 leading-snug sm:text-2xl">
			{{ philosophy.quote || (locale === 'id' ? 'Desain yang baik itu tenang.' : 'Good design is quiet.') }}<br>
			<strong>{{ philosophy.quote_bold || (locale === 'id' ? 'Desain luar biasa akan selalu membekas.' : 'Great design stays with you.') }}</strong>
		</p>
		<span class="text-xs text-brand-950 font-bold tracking-wide">
			{{ philosophy.label || 'Permadi Philosophy' }}
		</span>
	</Motion>
</template>
