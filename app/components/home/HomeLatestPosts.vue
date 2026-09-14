<script setup lang="ts">
import { computed } from 'vue'

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
	},
)

const { locale } = useI18n()
const localePath = useLocalePath()
const { formatDate } = useFormatDate()

const featuredPost = computed(() => props.posts?.[0])
const otherPosts = computed(() => props.posts?.slice(1, 4) || [])

function getPostUrl(post: any) {
	if (!post)
		return locale.value === 'id' ? '/id/blog' : '/blog'
	const slug = post.slug || (post.path ? post.path.split('/').pop().replace(/^\d+\./, '') : '')
	return locale.value === 'id' ? `/id/blog/${slug}` : `/blog/${slug}`
}

function getCategoryLabel(category?: string) {
	if (!category)
		return locale.value === 'id' ? 'Catatan' : 'Note'
	const cat = category.toLowerCase()
	if (cat === 'tech' || cat === 'programming') {
		return locale.value === 'id' ? 'Teknologi & Web' : 'Tech & Web'
	}
	if (cat === 'design') {
		return locale.value === 'id' ? 'Desain & UI' : 'Design & UI'
	}
	if (cat === 'pendidikan' || cat === 'education') {
		return locale.value === 'id' ? 'Pedagogi' : 'Pedagogy'
	}
	return category
}
</script>

<template>
	<div class="grid grid-cols-1 items-stretch gap-4 md:col-span-12 md:grid-cols-12 sm:gap-5">
		<!-- Card 1 (Kiri, col-span-7): Quick Reads Bento Stack (Lebih Luas) -->
		<div class="bento-card-clean flex flex-col justify-between p-5 md:col-span-7 sm:p-6">
			<div>
				<!-- Header -->
				<div class="mb-3.5 flex items-center justify-between border-b border-slate-200/60 pb-2.5 dark:border-slate-800/60">
					<div>
						<span class="mb-0.5 block text-[11px] text-brand-700 font-semibold tracking-wider font-mono uppercase dark:text-brand-400">
							{{ writing.label || (locale === 'id' ? 'Koleksi Catatan' : 'Recent Notes') }}
						</span>
						<h4 class="text-base text-slate-900 font-bold font-heading sm:text-lg dark:text-white">
							{{ writing.title || (locale === 'id' ? 'Catatan terbaru seputar web, desain, dan sistem.' : 'Notes on code, design, and systems.') }}
						</h4>
					</div>
					<NuxtLink
						:to="localePath('/blog')"
						class="group inline-flex shrink-0 items-center gap-1 text-xs text-brand-900 font-bold transition-colors dark:text-brand-300 hover:text-brand-950 dark:hover:text-accent"
					>
						<span>{{ locale === 'id' ? 'Lihat Semua' : 'View All' }}</span>
						<span class="i-ph-arrow-right text-xs transition-transform group-hover:translate-x-0.5" />
					</NuxtLink>
				</div>

				<!-- Mini Bento Tiles Stack -->
				<div
					v-if="otherPosts.length"
					class="flex flex-col gap-2"
				>
					<NuxtLink
						v-for="(post, idx) in otherPosts"
						:key="post.path"
						:to="getPostUrl(post)"
						class="group flex items-center justify-between gap-3 border border-slate-200/70 rounded-xl bg-slate-50/70 px-3.5 py-2.5 transition-all dark:border-slate-800/70 hover:border-brand-500/40 dark:bg-slate-800/40 hover:bg-brand-50/40 dark:hover:border-brand-400/40 dark:hover:bg-slate-800/80"
					>
						<div class="min-w-0 flex items-center gap-3">
							<span class="w-5 shrink-0 text-xs text-brand-700 font-semibold font-mono dark:text-brand-400">
								0{{ idx + 2 }}
							</span>
							<div class="min-w-0">
								<h5 class="truncate text-xs text-slate-900 font-semibold font-heading transition-colors sm:text-sm dark:text-white group-hover:text-brand-800 dark:group-hover:text-accent">
									{{ post.title }}
								</h5>
								<p class="mt-0.5 truncate text-[11px] text-slate-500 font-mono dark:text-slate-400">
									{{ formatDate(post.date) }} • {{ locale === 'id' ? `${post.readingTime || 4} mnt` : `${post.readingTime || 4} min` }}
								</p>
							</div>
						</div>
						<span class="i-ph-arrow-right shrink-0 text-xs text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-700 dark:group-hover:text-brand-300" />
					</NuxtLink>
				</div>
				<p
					v-else
					class="py-4 text-xs text-slate-600 dark:text-slate-400"
				>
					{{ locale === 'id' ? 'Belum ada artikel tambahan.' : 'No additional posts.' }}
				</p>
			</div>

			<!-- Footer Link -->
			<NuxtLink
				:to="localePath('/blog')"
				class="group mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs text-brand-900 font-bold dark:border-slate-800/60 dark:text-brand-300 hover:text-brand-950 dark:hover:text-accent"
			>
				<span>{{ writing.all_link_text || (locale === 'id' ? 'Buka Arsip Semua Tulisan' : 'Browse All Articles Archive') }}</span>
				<span class="i-ph-arrow-right text-xs transition-transform group-hover:translate-x-0.5" />
			</NuxtLink>
		</div>

		<!-- Card 2 (Kanan, col-span-5): Featured Latest Article (Kecil & Kompak) -->
		<NuxtLink
			v-if="featuredPost"
			:to="getPostUrl(featuredPost)"
			class="bento-card-clean group flex flex-col justify-between p-5 transition-all duration-200 md:col-span-5 hover:border-brand-500/40 sm:p-6 hover:-translate-y-0.5"
		>
			<div>
				<!-- Top Bar: Category Pill & Date -->
				<div class="mb-3 flex items-center justify-between gap-2">
					<span class="inline-flex items-center gap-1.5 border border-brand-200/60 rounded-full bg-brand-100/70 px-2.5 py-0.5 text-[11px] text-brand-950 tracking-tight font-mono dark:border-brand-800/60 dark:bg-brand-950 dark:text-accent">
						<span class="status-dot" />
						<span>{{ getCategoryLabel(featuredPost.category) }}</span>
					</span>
					<span class="text-[11px] text-slate-500 font-mono dark:text-slate-400">
						{{ formatDate(featuredPost.date) }}
					</span>
				</div>

				<!-- Headline (Kompak, tidak terlalu besar) -->
				<h4 class="text-base text-slate-900 font-bold leading-snug font-heading transition-colors sm:text-lg dark:text-white group-hover:text-brand-800 dark:group-hover:text-accent">
					{{ featuredPost.title }}
				</h4>

				<!-- Excerpt Ringkas -->
				<p class="line-clamp-3 mt-2 text-xs text-slate-700 leading-relaxed dark:text-slate-300">
					{{ featuredPost.description }}
				</p>

				<!-- Tags -->
				<div
					v-if="featuredPost.tags?.length"
					class="mt-3.5 flex flex-wrap gap-1.5"
				>
					<span
						v-for="tag in featuredPost.tags.slice(0, 3)"
						:key="tag"
						class="rounded-md bg-slate-100/80 px-2 py-0.5 text-[10px] text-slate-700 font-mono dark:bg-slate-800/80 dark:text-slate-300"
					>
						#{{ tag }}
					</span>
				</div>
			</div>

			<!-- Bottom Action -->
			<div class="mt-5 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs text-brand-900 font-bold dark:border-slate-800/60 dark:text-brand-300 group-hover:text-brand-950 dark:group-hover:text-accent">
				<span class="flex items-center gap-1.5">
					<span>{{ locale === 'id' ? 'Baca Artikel' : 'Read Article' }}</span>
					<span class="i-ph-arrow-right text-xs transition-transform group-hover:translate-x-1" />
				</span>
				<span class="text-[11px] text-slate-500 font-normal font-mono dark:text-slate-400">
					{{ locale === 'id' ? `${featuredPost.readingTime || 5} mnt baca` : `${featuredPost.readingTime || 5} min read` }}
				</span>
			</div>
		</NuxtLink>
	</div>
</template>
