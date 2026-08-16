<script setup lang="ts">
	export interface ArchiveData {
		label?: string
		title?: string
		description?: string
		link_text?: string
	}

	const props = withDefaults(
		defineProps<{
			archive?: ArchiveData
		}>(),
		{
			archive: () => ({}),
		}
	)

	const { locale } = useI18n()
	const targetPath = computed(() => (locale.value === 'id' ? '/id/galeri' : '/en/gallery'))
</script>

<template>
	<NuxtLink
		:to="targetPath"
		class="bento-card-clean md:col-span-7 p-6 sm:p-7 flex flex-col justify-between group block"
	>
		<div>
			<div class="flex items-center justify-between mb-3">
				<span class="section-label text-brand-700 dark:text-brand-400">
					{{ archive.label || (locale === 'id' ? 'Arsip Visual' : 'The Archive') }}
				</span>
				<span class="i-hugeicons-arrow-right-01 text-slate-500 group-hover:(text-brand-700 translate-x-1) transition-transform" />
			</div>
			<h3 class="font-heading font-semibold text-2xl sm:text-4xl text-slate-900 dark:text-white group-hover:text-brand-800 dark:group-hover:text-yellow-600 transition-colors duration-100 leading-tight">
				{{ archive.title || (locale === 'id' ? 'Gambar, dokumentasi, dan observasi visual.' : 'Images, objects, and quiet observations.') }}
			</h3>
			<p class="text-slate-700 dark:text-slate-300 text-xs sm:text-sm mt-2 max-w-lg">
				{{ archive.description || (locale === 'id' ? 'Dokumentasi fotografi karya dan setup ruang kerja yang terorganisir di Cloudinary.' : 'Curated visual captures and workspace documentation organized in Cloudinary CDN.') }}
			</p>
		</div>
		<div class="mt-6 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-bold text-brand-800 dark:text-brand-400 group-hover:text-brand-950 dark:group-hover:text-yellow-600">
			<span>{{ archive.link_text || (locale === 'id' ? 'Buka Galeri Lengkap' : 'Open Gallery') }}</span>
			<span>↗</span>
		</div>
	</NuxtLink>
</template>
