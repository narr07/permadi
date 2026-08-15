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
		<div class="flex items-center justify-between mb-6 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
			<div>
				<span class="section-label text-brand-600 dark:text-brand-400 block mb-1">
					{{ writing.label || (locale === 'id' ? 'Tulisan & Catatan' : 'Recent Writing') }}
				</span>
				<h3 class="font-heading font-semibold text-2xl sm:text-3xl text-slate-900 dark:text-white">
					{{ writing.title || (locale === 'id' ? 'Catatan terbaru seputar web & sistem.' : 'Notes on code, craft, and systems.') }}
				</h3>
			</div>
			<NuxtLink
				:to="localePath('/blog')"
				class="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline hidden sm:inline-flex items-center gap-1"
			>
				{{ writing.all_link_text || (locale === 'id' ? 'Lihat Semua Tulisan' : 'Read All Notes') }}
				<span>↗</span>
			</NuxtLink>
		</div>

		<div v-if="posts?.length" class="divide-y divide-slate-200/60 dark:divide-slate-800/60">
			<NuxtLink
				v-for="(post, pIdx) in posts"
				:key="post.path"
				:to="post.path"
				class="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-bento px-2 -mx-2 transition-colors"
			>
				<div class="flex items-center gap-3">
					<span class="text-xs font-mono text-slate-400 w-6 shrink-0">
						0{{ pIdx + 1 }}
					</span>
					<h4 class="font-heading font-semibold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
						{{ post.title }}
					</h4>
				</div>
				<div class="flex items-center gap-4 text-xs text-slate-400 shrink-0 sm:pl-4">
					<span>{{ post.date }}</span>
					<span>•</span>
					<span>{{ post.readingTime || 5 }} min read</span>
					<span class="i-hugeicons-arrow-right-01 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-brand-500" />
				</div>
			</NuxtLink>
		</div>
		<p v-else class="text-slate-400 text-xs py-4">
			{{ locale === 'id' ? 'Belum ada artikel.' : 'No articles published yet.' }}
		</p>
	</div>
</template>
