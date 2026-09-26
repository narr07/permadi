<script setup lang="ts">
interface PostItem {
	_path?: string
	idBlog?: string
	title?: string
	description?: string
	date?: string
	category?: string
}

interface WritingSection {
	label?: string
	volume?: string
	col_no?: string
	col_title?: string
	col_discipline?: string
	col_date?: string
	footer_tag?: string
	title?: string
	all_link_text?: string
	all_link_to?: string
}

const props = defineProps<{
	posts?: PostItem[]
	writing?: WritingSection
}>()

const localePath = useLocalePath()
const { locale } = useI18n()

const defaultPosts = [
	{
		index: '01',
		title: 'Membangun antarmuka yang tenang dengan sistem grid modular 12-kolom',
		category: 'ARSITEKTUR',
		date: '12.08.2026',
		link: '/blog',
	},
	{
		index: '02',
		title: 'Catatan kecil tentang performa Nuxt 4 dan edge computing Cloudflare',
		category: 'ENGINEERING',
		date: '28.07.2026',
		link: '/blog',
	},
	{
		index: '03',
		title: 'Mengapa detail tipografi menentukan wibawa dan keterbacaan sebuah produk',
		category: 'TIPOGRAFI',
		date: '04.06.2026',
		link: '/blog',
	},
	{
		index: '04',
		title: 'Mengajarkan logika berhitung dasar melalui visualisasi geometri terstruktur',
		category: 'PEDAGOGI',
		date: '15.05.2026',
		link: '/blog',
	},
]

const formattedPosts = computed(() => {
	if (props.posts && props.posts.length > 0) {
		return props.posts.slice(0, 4).map((post, idx) => {
			let dateFormatted = '2026'
			if (post.date) {
				try {
					const d = new Date(post.date)
					dateFormatted = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getFullYear()).slice(-2)}`
				}
				catch {
					dateFormatted = String(post.date)
				}
			}
			return {
				index: String(idx + 1).padStart(2, '0'),
				title: post.title || 'Catatan Teknis & Pedagogi',
				category: post.category || 'CATATAN',
				date: dateFormatted,
				link: post._path || '/blog',
			}
		})
	}
	return defaultPosts
})
</script>

<template>
	<section class="w-full border-b border-slate-200/80 bg-white dark:border-[#134e43] dark:bg-[#001e1c]">
		<!-- Header Strip -->
		<div class="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 text-[11px] font-bold tracking-[0.2em] font-mono uppercase dark:border-[#134e43] sm:px-8 sm:py-5">
			<div class="flex items-center gap-2.5 text-brand-700 dark:text-accent">
				<span class="inline-block h-2 w-2 rounded-none bg-brand-500" />
				<span>{{ writing?.label || '05 // TULISAN & CATATAN TERBARU' }}</span>
			</div>
			<span class="text-slate-600 tabular-nums dark:text-slate-400">
				{{ writing?.volume || 'JOURNAL // VOL. 2026' }}
			</span>
		</div>

		<!-- Table Header Row (Desktop) -->
		<div class="grid-cols-12 hidden gap-4 border-b border-slate-200/80 bg-slate-50/50 px-6 py-3 text-[10px] text-slate-600 tracking-widest font-mono uppercase md:grid dark:border-[#134e43] dark:bg-[#002420]/30 sm:px-8 dark:text-slate-400">
			<span class="col-span-1">{{ writing?.col_no || 'NO.' }}</span>
			<span class="col-span-8">{{ writing?.col_title || (locale === 'id' ? 'JUDUL TULISAN & KAJIAN TEKNIS' : 'ARTICLE TITLE & ESSAYS') }}</span>
			<span class="col-span-2 text-center">{{ writing?.col_discipline || (locale === 'id' ? 'DISIPLIN' : 'DISCIPLINE') }}</span>
			<span class="col-span-1 text-right">{{ writing?.col_date || (locale === 'id' ? 'TANGGAL' : 'DATE') }}</span>
		</div>

		<!-- Tabular Journal Rows -->
		<div class="divide-y divide-slate-200/80 dark:divide-[#134e43]">
			<NuxtLink
				v-for="post in formattedPosts"
				:key="post.index"
				:to="localePath(post.link)"
				class="group min-h-[56px] flex flex-col cursor-pointer items-start gap-2 px-6 py-5 transition-all duration-200 md:grid md:grid-cols-12 hover:(translate-x-1 bg-[#e2f4f0] dark:bg-[#003832]) active:scale-[0.99] md:items-center md:gap-4 sm:px-8"
			>
				<span class="col-span-1 text-xs text-brand-600 font-bold font-mono tabular-nums dark:text-brand-400">
					{{ post.index }}
				</span>

				<span class="col-span-8 text-base text-slate-900 font-900 leading-snug font-heading transition-colors duration-150 sm:text-lg dark:text-slate-50 group-hover:text-brand-700 dark:group-hover:text-brand-300">
					{{ post.title }}
				</span>

				<span class="col-span-2 hidden text-center text-[11px] text-slate-700 font-mono uppercase md:block dark:text-slate-300">
					[{{ post.category }}]
				</span>

				<span class="col-span-1 w-full flex items-center justify-between gap-2 text-xs text-slate-700 font-mono tabular-nums md:w-auto md:justify-end dark:text-slate-300">
					<span class="text-[10px] text-slate-600 font-mono uppercase md:hidden">[{{ post.category }}]</span>
					<span>{{ post.date }}</span>
					<span class="i-swisspost-arrowupright text-sm text-slate-600 transition-transform duration-150 group-hover:(translate-x-0.5 text-brand-500 -translate-y-0.5) dark:text-slate-400" />
				</span>
			</NuxtLink>
		</div>

		<!-- Footer Link Strip -->
		<div class="flex items-center justify-between border-t border-slate-200/80 bg-slate-50/50 px-6 py-3.5 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/30 sm:px-8">
			<span class="hidden text-slate-600 uppercase sm:inline dark:text-slate-400">
				{{ writing?.footer_tag || (locale === 'id' ? 'PUBLIKASI: TEKNOLOGI & RUANG KELAS' : 'PUBLICATIONS: TECH & CLASSROOM') }}
			</span>
			<NuxtLink
				:to="localePath(writing?.all_link_to || '/blog')"
				class="group ml-auto inline-flex items-center gap-2 text-slate-900 font-bold tracking-wider uppercase underline underline-offset-4 dark:text-slate-50 hover:text-brand-600 dark:hover:text-brand-400"
			>
				<span>{{ writing?.all_link_text || $t('common.view_all_articles') }}</span>
				<span class="i-swisspost-arrowright text-xs transition-transform duration-150 group-hover:translate-x-1" />
			</NuxtLink>
		</div>
	</section>
</template>
