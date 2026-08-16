<script setup lang="ts">
	export interface WritingData {
		label?: string
		title?: string
		all_link_text?: string
	}

	const props = withDefaults(
		defineProps<{
			posts?: any[]
			writing?: WritingData
		}>(),
		{
			posts: () => [],
			writing: () => ({}),
		}
	)

	const { locale } = useI18n()
	const localePath = useLocalePath()
</script>

<template>
	<div class="bento-card-clean md:col-span-12 p-6 sm:p-8">
		<div class="flex items-center justify-between mb-6 pb-3.5 border-b border-slate-200/60 dark:border-slate-800/60">
			<div>
				<span class="section-label text-brand-600 dark:text-brand-400 block mb-1">
					{{ writing.label || (locale === 'id' ? 'Tulisan & Catatan' : 'Recent Writing') }}
				</span>
				<h3 class="font-heading font-semibold text-2xl sm:text-3xl text-brand-950 dark:text-brand-100">
					{{ writing.title || (locale === 'id' ? 'Catatan terbaru seputar web & sistem.' : 'Notes on code, craft, and systems.') }}
				</h3>
			</div>
			<NuxtLink
				:to="localePath('/blog')"
				class="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-yellow-600 hidden sm:inline-flex items-center gap-1 transition-colors"
			>
				{{ writing.all_link_text || (locale === 'id' ? 'Lihat Semua Tulisan' : 'Read All Notes') }}
				<span>↗</span>
			</NuxtLink>
		</div>

		<div v-if="posts?.length" class="divide-y divide-slate-100 dark:divide-slate-800/60">
			<NuxtLink
				v-for="(post, pIdx) in posts"
				:key="post.path"
				:to="post.path"
				class="py-3 px-3 -mx-3 my-0.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 group hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-all duration-150"
			>
				<div class="flex items-center gap-3 min-w-0">
					<span class="text-xs font-mono font-semibold text-brand-500/70 dark:text-brand-400/70 w-6 shrink-0 group-hover:text-brand-600 dark:group-hover:text-yellow-600 transition-colors">
						0{{ pIdx + 1 }}
					</span>
					<h4 class="font-heading font-semibold text-base sm:text-lg text-brand-950 dark:text-brand-100 group-hover:text-brand-700 dark:group-hover:text-yellow-600 transition-colors duration-150 truncate">
						{{ post.title }}
					</h4>
				</div>
				<div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 shrink-0 sm:pl-4">
					<span class="font-mono text-[11px]">{{ post.date }}</span>
					<span class="text-slate-300 dark:text-slate-700">•</span>
					<span class="font-mono text-[11px]">{{ post.readingTime || 5 }} min read</span>
					<span class="i-hugeicons-arrow-right-01 text-xs text-brand-600 dark:text-yellow-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
				</div>
			</NuxtLink>
		</div>
		<p v-else class="text-slate-400 text-xs py-4">
			{{ locale === 'id' ? 'Belum ada artikel.' : 'No articles published yet.' }}
		</p>
	</div>
</template>
