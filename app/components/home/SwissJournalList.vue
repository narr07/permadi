<script setup lang="ts">
interface PostItem {
	path?: string
	title?: string
	date?: string
	category?: string
}

interface WritingSection {
	label?: string
	all_link_text?: string
	all_link_to?: string
}

const props = defineProps<{
	posts?: PostItem[]
	writing?: WritingSection
}>()

const { locale } = useI18n()
const listPath = computed(() => locale.value === 'id' ? '/id/blog' : '/blog')

const formattedPosts = computed(() => {
	const dateFormat = new Intl.DateTimeFormat(locale.value === 'id' ? 'id-ID' : 'en-US', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	})
	return (props.posts || []).slice(0, 4).map(post => ({
		title: post.title,
		category: post.category,
		date: post.date ? dateFormat.format(new Date(post.date)) : '',
		link: post.path || listPath.value,
	}))
})
</script>

<template>
	<section
		v-if="formattedPosts.length > 0"
		class="w-full border-b border-slate-200/80 bg-white dark:border-[#134e43] dark:bg-[#001e1c]"
	>
		<!-- Header Strip -->
		<h2 class="border-b border-slate-200/80 px-6 py-4 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:border-[#134e43] sm:px-8 sm:py-5 dark:text-accent">
			{{ writing?.label || (locale === 'id' ? 'Tulisan terbaru' : 'Recent writing') }}
		</h2>

		<div class="divide-y divide-slate-200/80 dark:divide-[#134e43]">
			<NuxtLink
				v-for="post in formattedPosts"
				:key="post.link"
				:to="post.link"
				class="group min-h-[56px] flex flex-col cursor-pointer items-start gap-2 px-6 py-5 transition-colors duration-150 md:grid md:grid-cols-12 md:items-center md:gap-4 hover:(bg-[#e2f4f0] dark:bg-[#003832]) sm:px-8"
			>
				<span class="col-span-8 text-base text-slate-900 font-900 leading-snug font-heading transition-colors duration-150 sm:text-lg dark:text-slate-50 group-hover:text-brand-700 dark:group-hover:text-brand-300">
					{{ post.title }}
				</span>

				<span class="col-span-2 text-[11px] text-slate-700 font-mono uppercase md:text-center dark:text-slate-300">
					{{ post.category }}
				</span>

				<time class="col-span-2 text-xs text-slate-700 font-mono tabular-nums md:text-right dark:text-slate-300">
					{{ post.date }}
				</time>
			</NuxtLink>
		</div>

		<!-- Footer Link Strip -->
		<div class="flex justify-end border-t border-slate-200/80 bg-slate-50/50 px-6 py-3.5 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/30 sm:px-8">
			<NuxtLink
				:to="writing?.all_link_to || listPath"
				class="text-slate-900 font-bold tracking-wider uppercase underline underline-offset-4 dark:text-slate-50 hover:text-brand-600 dark:hover:text-brand-400"
			>
				{{ writing?.all_link_text || $t('common.view_all_articles') }}
			</NuxtLink>
		</div>
	</section>
</template>
