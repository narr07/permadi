<script setup lang="ts">
defineProps<{
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
		class="group bento-card-clean block flex flex-col justify-between p-6 md:col-span-5 sm:p-7"
	>
		<div>
			<div class="mb-3 flex items-center justify-between">
				<span class="section-label text-brand-900 dark:text-brand-300">
					{{ label || (locale === 'id' ? 'Projek Terpilih' : 'Selected Work') }}
				</span>
				<span class="i-hugeicons-arrow-right-01 text-slate-600 transition-transform group-hover:(translate-x-1 text-brand-700) dark:text-slate-400" />
			</div>
			<h3 class="text-2xl text-slate-900 font-semibold leading-tight font-heading transition-colors duration-100 sm:text-3xl dark:text-white group-hover:text-brand-800 dark:group-hover:text-accent">
				{{ project?.title || fallbackTitle || (locale === 'id' ? 'Empat proyek, banyak pelajaran berharga.' : 'Four projects, many lessons.') }}
			</h3>
			<p class="line-clamp-2 mt-2 text-xs text-slate-800 sm:text-sm dark:text-slate-200">
				{{ project?.description || fallbackDescription || (locale === 'id' ? 'Koleksi studi kasus sistem web dan eksplorasi desain modular.' : 'A collection of web systems case studies and modular design.') }}
			</p>
		</div>
		<div class="mt-6 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs text-brand-900 font-bold dark:border-slate-800/60 dark:text-brand-300 group-hover:text-brand-950 dark:group-hover:text-accent">
			<span>{{ allLinkText || (locale === 'id' ? 'Buka Semua Projek' : 'Browse All Work') }}</span>
			<span class="i-hugeicons-arrow-right-01 text-xs transition-transform group-hover:translate-x-0.5" />
		</div>
	</NuxtLink>
</template>
