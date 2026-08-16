<script setup lang="ts">
	const props = defineProps<{
		project?: any
		label?: string
		fallbackTitle?: string
		fallbackDescription?: string
		allLinkText?: string
	}>()

	const { locale } = useI18n()
	const targetPath = computed(() => (locale.value === 'id' ? '/id/projek' : '/en/projects'))
</script>

<template>
	<NuxtLink
		:to="project?.path || targetPath"
		class="bento-card-clean md:col-span-5 p-6 sm:p-7 flex flex-col justify-between group block"
	>
		<div>
			<div class="flex items-center justify-between mb-3">
				<span class="section-label text-brand-700 dark:text-brand-400">
					{{ label || (locale === 'id' ? 'Projek Terpilih' : 'Selected Work') }}
				</span>
				<span class="i-hugeicons-arrow-right-01 text-slate-500 group-hover:(text-brand-700 translate-x-1) transition-transform" />
			</div>
			<h3 class="font-heading font-semibold text-2xl sm:text-3xl text-slate-900 dark:text-white group-hover:text-brand-800 dark:group-hover:text-yellow-600 transition-colors duration-100 leading-tight">
				{{ project?.title || fallbackTitle || (locale === 'id' ? 'Empat proyek, banyak pelajaran berharga.' : 'Four projects, many lessons.') }}
			</h3>
			<p class="text-slate-700 dark:text-slate-300 text-xs sm:text-sm mt-2 line-clamp-2">
				{{ project?.description || fallbackDescription || (locale === 'id' ? 'Koleksi studi kasus sistem web dan eksplorasi desain modular.' : 'A collection of web systems case studies and modular design.') }}
			</p>
		</div>
		<div class="mt-6 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-bold text-brand-800 dark:text-brand-400 group-hover:text-brand-950 dark:group-hover:text-yellow-600">
			<span>{{ allLinkText || (locale === 'id' ? 'Buka Semua Projek' : 'Browse All Work') }}</span>
			<span>↗</span>
		</div>
	</NuxtLink>
</template>
