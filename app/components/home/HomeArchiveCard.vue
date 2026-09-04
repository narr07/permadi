<script setup lang="ts">
export interface ArchiveData {
	label?: string
	title?: string
	description?: string
	link_text?: string
}

withDefaults(
	defineProps<{
		archive?: ArchiveData
	}>(),
	{
		archive: () => ({}),
	},
)

const { locale } = useI18n()
const targetPath = computed(() => (locale.value === 'id' ? '/id/galeri' : '/en/gallery'))
</script>

<template>
	<NuxtLink

		:to="targetPath"
		class="group bento-card-clean block flex flex-col justify-between p-6 md:col-span-7 sm:p-7"
	>
		<div>
			<div class="mb-3 flex items-center justify-between">
				<span class="section-label text-brand-900 dark:text-brand-300">
					{{ archive.label || (locale === 'id' ? 'Arsip Visual' : 'The Archive') }}
				</span>
				<span class="i-hugeicons-arrow-right-01 text-slate-600 transition-transform group-hover:(translate-x-1 text-brand-700) dark:text-slate-400" />
			</div>
			<h3 class="text-2xl text-slate-900 font-semibold leading-tight font-heading transition-colors duration-100 sm:text-4xl dark:text-white group-hover:text-brand-800 dark:group-hover:text-accent">
				{{ archive.title || (locale === 'id' ? 'Gambar, dokumentasi, dan observasi visual.' : 'Images, objects, and quiet observations.') }}
			</h3>
			<p class="mt-2 max-w-lg text-xs text-slate-800 sm:text-sm dark:text-slate-200">
				{{ archive.description || (locale === 'id' ? 'Dokumentasi fotografi karya dan setup ruang kerja yang terorganisir di Cloudinary.' : 'Curated visual captures and workspace documentation organized in Cloudinary CDN.') }}
			</p>
		</div>
		<div class="mt-6 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs text-brand-900 font-bold dark:border-slate-800/60 dark:text-brand-300 group-hover:text-brand-950 dark:group-hover:text-accent">
			<span>{{ archive.link_text || (locale === 'id' ? 'Buka Galeri Lengkap' : 'Open Gallery') }}</span>
			<span class="i-hugeicons-arrow-right-01 text-xs transition-transform group-hover:translate-x-0.5" />
		</div>
	</NuxtLink>
</template>
