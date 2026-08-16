<script setup lang="ts">
	const props = defineProps<{
		galleryItem?: any
		label?: string
		text?: string
	}>()

	const { locale } = useI18n()
	const targetPath = computed(() => (locale.value === 'id' ? '/id/galeri' : '/en/gallery'))
</script>

<template>
	<NuxtLink
		:to="targetPath"
		:aria-label="`${label || (locale === 'id' ? 'Eksplorasi Saat Ini' : 'Currently Exploring')}: ${text || (locale === 'id' ? 'Antarmuka yang terasa natural.' : 'Interfaces that feel inevitable.')}`"
		class="bento-card-clean md:col-span-5 !p-0 flex flex-col justify-between group overflow-hidden block"
	>
		<div class="w-full aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
			<NuxtImg
				v-if="galleryItem?.image"
				:src="galleryItem.image"
				alt=""
				aria-hidden="true"
				:provider="galleryItem.image.startsWith('http') || galleryItem.image.startsWith('/projects') || galleryItem.image.startsWith('/galeri') ? undefined : 'cloudinary'"
				format="webp"
				quality="75"
				width="450"
				class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
				loading="lazy"
			/>
			<div v-else class="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
				<span class="i-hugeicons-image-02 text-3xl text-slate-400" />
			</div>
		</div>
		<div class="p-4 sm:p-5 flex items-center justify-between text-xs bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800/60">
			<div>
				<span class="text-slate-700 dark:text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
					{{ label || (locale === 'id' ? 'Eksplorasi Saat Ini' : 'Currently Exploring') }}
				</span>
				<strong class="text-slate-900 dark:text-white font-medium text-xs">
					{{ text || (locale === 'id' ? 'Antarmuka yang terasa natural.' : 'Interfaces that feel inevitable.') }}
				</strong>
			</div>
			<span class="i-hugeicons-arrow-right-01 text-slate-500 group-hover:(text-brand-700 translate-x-1) transition-transform" />
		</div>
	</NuxtLink>
</template>
