<script setup lang="ts">
import { motion } from 'motion-v'

const props = defineProps<{
	project?: any
	label?: string
	fallbackTitle?: string
	fallbackDescription?: string
	allLinkText?: string
}>()

const { locale } = useI18n()
const targetPath = computed(() => {
	if (props.project) {
		const slug = props.project.slug || (props.project.path ? props.project.path.split('/').pop().replace(/^\d+\./, '') : '')
		if (slug) {
			return locale.value === 'id' ? `/id/projek/${slug}` : `/projects/${slug}`
		}
	}
	return locale.value === 'id' ? '/id/projek' : '/projects'
})
</script>

<template>
	<motion.div
		:initial="{ opacity: 0, y: 16 }"
		:animate="{ opacity: 1, y: 0 }"
		:transition="{ duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] }"
		class="md:col-span-5 flex flex-col"
	>
		<NuxtLink
			:to="targetPath"
			class="group bento-card-clean block flex flex-col justify-between p-6 sm:p-7 flex-1"
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
</motion.div>
</template>
