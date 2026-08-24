<script setup lang="ts">
defineProps<{
	galleryItem?: any
	label?: string
	text?: string
}>()

const { locale } = useI18n()
const targetPath = computed(() => (locale.value === 'id' ? '/id/galeri' : '/en/gallery'))
</script>

<template>
	<NuxtLink
		v-spotlight
		:to="targetPath"
		:aria-label="`${label || (locale === 'id' ? 'Eksplorasi Saat Ini' : 'Currently Exploring')}: ${text || (locale === 'id' ? 'Antarmuka yang terasa natural.' : 'Interfaces that feel inevitable.')}`"
		class="bento-card-clean group block flex flex-col justify-between overflow-hidden md:col-span-5 !p-0"
	>
		<div class="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
			<img
				v-if="galleryItem?.image"
				:src="galleryItem.image"
				alt=""
				aria-hidden="true"
				decoding="async"
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				loading="lazy"
			/>
			<div
				v-else
				class="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-800"
			>
				<span class="i-hugeicons-image-02 text-3xl text-slate-400" />
			</div>
		</div>
		<div class="flex items-center justify-between border-t border-slate-200/60 bg-white p-4 text-xs dark:border-slate-800/60 dark:bg-slate-900 sm:p-5">
			<div>
				<span class="block text-[11px] text-slate-900 font-semibold tracking-wide dark:text-slate-200">
					{{ label || (locale === 'id' ? 'Eksplorasi Saat Ini' : 'Currently Exploring') }}
				</span>
				<strong class="text-xs text-slate-900 font-medium dark:text-white">
					{{ text || (locale === 'id' ? 'Antarmuka yang terasa natural.' : 'Interfaces that feel inevitable.') }}
				</strong>
			</div>
			<span class="i-hugeicons-arrow-right-01 text-slate-600 transition-transform group-hover:(translate-x-1 text-brand-700) dark:text-slate-400" />
		</div>
	</NuxtLink>
</template>
