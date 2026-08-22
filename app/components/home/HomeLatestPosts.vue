<script setup lang="ts">
export interface WritingData {
	label?: string
	title?: string
	all_link_text?: string
}

withDefaults(
	defineProps<{
		posts?: any[]
		writing?: WritingData
	}>(),
	{
		posts: () => [],
		writing: () => ({}),
	},
)

const { locale } = useI18n()
const localePath = useLocalePath()
</script>

<template>
	<div class="bento-card-clean p-6 md:col-span-12 sm:p-8">
		<div class="mb-6 flex items-center justify-between border-b border-slate-200/60 pb-3.5 dark:border-slate-800/60">
			<div>
				<span class="section-label mb-1 block text-brand-900 dark:text-brand-300">
					{{ writing.label || (locale === 'id' ? 'Tulisan & Catatan' : 'Recent Writing') }}
				</span>
				<h3 class="text-2xl text-brand-950 font-semibold font-heading sm:text-3xl dark:text-brand-100">
					{{ writing.title || (locale === 'id' ? 'Catatan terbaru seputar web & sistem.' : 'Notes on code, craft, and systems.') }}
				</h3>
			</div>
			<NuxtLink
				:to="localePath('/blog')"
				class="group hidden items-center gap-1.5 text-xs text-brand-900 font-bold transition-colors sm:inline-flex dark:text-brand-300 hover:text-brand-950 dark:hover:text-yellow-600"
			>
				{{ writing.all_link_text || (locale === 'id' ? 'Lihat Semua Tulisan' : 'Read All Notes') }}
				<span class="i-hugeicons-arrow-right-01 text-xs transition-transform group-hover:translate-x-0.5" />
			</NuxtLink>
		</div>

		<div
			v-if="posts?.length"
			class="divide-y divide-slate-100 dark:divide-slate-800/60"
		>
			<NuxtLink
				v-for="(post, pIdx) in posts"
				:key="post.path"
				:to="post.path"
				class="group my-0.5 flex flex-col justify-between gap-2 rounded-xl px-3 py-3 transition-all duration-150 -mx-3 sm:flex-row sm:items-center hover:bg-brand-100 dark:hover:bg-brand-900/50"
			>
				<div class="min-w-0 flex items-center gap-3">
					<span class="w-6 shrink-0 text-xs text-brand-950 font-bold font-mono transition-colors dark:text-brand-200 group-hover:text-brand-950 dark:group-hover:text-yellow-600">
						0{{ pIdx + 1 }}
					</span>
					<h4 class="truncate text-base text-brand-950 font-semibold font-heading transition-colors duration-150 sm:text-lg dark:text-brand-100 group-hover:text-brand-800 dark:group-hover:text-yellow-600">
						{{ post.title }}
					</h4>
				</div>
				<div class="flex shrink-0 items-center gap-3 text-xs text-slate-700 sm:pl-4 dark:text-slate-300">
					<span class="text-[11px] font-mono">{{ post.date }}</span>
					<span class="text-slate-400 dark:text-slate-700">•</span>
					<span class="text-[11px] font-mono">{{ post.readingTime || 5 }} min read</span>
					<span class="i-hugeicons-arrow-right-01 text-xs text-brand-900 opacity-0 transition-all group-hover:translate-x-0.5 dark:text-yellow-600 group-hover:opacity-100" />
				</div>
			</NuxtLink>
		</div>
		<p
			v-else
			class="py-4 text-xs text-slate-600 dark:text-slate-400"
		>
			{{ locale === 'id' ? 'Belum ada artikel.' : 'No articles published yet.' }}
		</p>
	</div>
</template>
