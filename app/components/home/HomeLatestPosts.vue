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
	if (!post) return locale.value === 'id' ? '/id/blog' : '/blog'
	const slug = post.slug || (post.path ? post.path.split('/').pop().replace(/^\d+\./, '') : '')
	return locale.value === 'id' ? `/id/blog/${slug}` : `/blog/${slug}`
}

function getCategoryLabel(category?: string) {
	if (!category) return locale.value === 'id' ? 'Catatan' : 'Note'
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
	<div class="grid grid-cols-1 md:grid-cols-12 md:col-span-12 gap-4 sm:gap-5 items-stretch">
		<!-- Card 1 (Kiri, col-span-7): Quick Reads Bento Stack (Lebih Luas) -->
		<div class="bento-card-clean flex flex-col justify-between p-5 sm:p-6 md:col-span-7">
			<div>
				<!-- Header -->
				<div class="mb-3.5 flex items-center justify-between border-b border-slate-200/60 pb-2.5 dark:border-slate-800/60">
					<div>
						<span class="mb-0.5 block text-[11px] font-mono font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
							{{ writing.label || (locale === 'id' ? 'Koleksi Catatan' : 'Recent Notes') }}
						</span>
						<h4 class="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white">
							{{ writing.title || (locale === 'id' ? 'Catatan terbaru seputar web, desain, dan sistem.' : 'Notes on code, design, and systems.') }}
						</h4>
					</div>
					<NuxtLink
						:to="localePath('/blog')"
						class="group inline-flex items-center gap-1 text-xs font-bold text-brand-900 dark:text-brand-300 hover:text-brand-950 dark:hover:text-accent shrink-0 transition-colors"
					>
						<span>{{ locale === 'id' ? 'Lihat Semua' : 'View All' }}</span>
						<span class="i-hugeicons-arrow-right-01 text-xs transition-transform group-hover:translate-x-0.5" />
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
						class="group flex items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-slate-50/70 px-3.5 py-2.5 transition-all dark:border-slate-800/70 dark:bg-slate-800/40 hover:border-brand-500/40 hover:bg-brand-50/40 dark:hover:border-brand-400/40 dark:hover:bg-slate-800/80"
					>
						<div class="min-w-0 flex items-center gap-3">
							<span class="w-5 shrink-0 text-xs font-mono font-semibold text-brand-700 dark:text-brand-400">
								0{{ idx + 2 }}
							</span>
							<div class="min-w-0">
								<h5 class="truncate text-xs sm:text-sm font-semibold font-heading text-slate-900 transition-colors group-hover:text-brand-800 dark:group-hover:text-accent dark:text-white">
									{{ post.title }}
								</h5>
								<p class="mt-0.5 truncate text-[11px] font-mono text-slate-500 dark:text-slate-400">
									{{ formatDate(post.date) }} • {{ locale === 'id' ? `${post.readingTime || 4} mnt` : `${post.readingTime || 4} min` }}
								</p>
							</div>
						</div>
						<span class="i-hugeicons-arrow-right-01 text-xs shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-700 dark:group-hover:text-brand-300" />
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
				class="group mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs font-bold text-brand-900 dark:border-slate-800/60 dark:text-brand-300 hover:text-brand-950 dark:hover:text-accent"
			>
				<span>{{ writing.all_link_text || (locale === 'id' ? 'Buka Arsip Semua Tulisan' : 'Browse All Articles Archive') }}</span>
				<span class="i-hugeicons-arrow-right-01 text-xs transition-transform group-hover:translate-x-0.5" />
			</NuxtLink>
		</div>

		<!-- Card 2 (Kanan, col-span-5): Featured Latest Article (Kecil & Kompak) -->
		<NuxtLink
			v-if="featuredPost"
			:to="getPostUrl(featuredPost)"
			class="bento-card-clean group flex flex-col justify-between p-5 sm:p-6 md:col-span-5 transition-all duration-200 hover:border-brand-500/40 hover:-translate-y-0.5"
		>
			<div>
				<!-- Top Bar: Category Pill & Date -->
				<div class="mb-3 flex items-center justify-between gap-2">
					<span class="inline-flex items-center gap-1.5 border border-brand-200/60 rounded-full bg-brand-100/70 px-2.5 py-0.5 text-[11px] text-brand-950 font-mono tracking-tight dark:border-brand-800/60 dark:bg-brand-950 dark:text-accent">
						<span class="status-dot" />
						<span>{{ getCategoryLabel(featuredPost.category) }}</span>
					</span>
					<span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">
						{{ formatDate(featuredPost.date) }}
					</span>
				</div>

				<!-- Headline (Kompak, tidak terlalu besar) -->
				<h4 class="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white leading-snug transition-colors group-hover:text-brand-800 dark:group-hover:text-accent">
					{{ featuredPost.title }}
				</h4>

				<!-- Excerpt Ringkas -->
				<p class="mt-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
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
						class="rounded-md bg-slate-100/80 px-2 py-0.5 text-[10px] font-mono text-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
					>
						#{{ tag }}
					</span>
				</div>
			</div>

			<!-- Bottom Action -->
			<div class="mt-5 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs font-bold text-brand-900 dark:border-slate-800/60 dark:text-brand-300 group-hover:text-brand-950 dark:group-hover:text-accent">
				<span class="flex items-center gap-1.5">
					<span>{{ locale === 'id' ? 'Baca Artikel' : 'Read Article' }}</span>
					<span class="i-hugeicons-arrow-right-01 text-xs transition-transform group-hover:translate-x-1" />
				</span>
				<span class="text-[11px] font-mono font-normal text-slate-500 dark:text-slate-400">
					{{ locale === 'id' ? `${featuredPost.readingTime || 5} mnt baca` : `${featuredPost.readingTime || 5} min read` }}
				</span>
			</div>
		</NuxtLink>
	</div>
</template>



