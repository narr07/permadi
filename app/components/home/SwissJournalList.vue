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
	title?: string
	all_link_text?: string
}

const props = defineProps<{
	posts?: PostItem[]
	writing?: WritingSection
}>()

const localePath = useLocalePath()

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
			<span class="text-slate-900/40 tabular-nums dark:text-slate-50/40">
				JOURNAL // VOL. 2026
			</span>
		</div>

		<!-- Table Header Row (Desktop) -->
		<div class="grid-cols-12 hidden gap-4 border-b border-slate-200/80 bg-slate-50/50 px-6 py-3 text-[10px] text-slate-900/50 tracking-widest font-mono uppercase md:grid dark:border-[#134e43] dark:bg-[#002420]/30 sm:px-8 dark:text-slate-50/50">
			<span class="col-span-1">NO.</span>
			<span class="col-span-8">JUDUL TULISAN &amp; KAJIAN TEKNIS</span>
			<span class="col-span-2 text-center">DISIPLIN</span>
			<span class="col-span-1 text-right">TANGGAL</span>
		</div>

		<!-- Tabular Journal Rows -->
		<div class="divide-y divide-slate-200/80 dark:divide-[#134e43]">
			<NuxtLink
				v-for="post in formattedPosts"
				:key="post.index"
				:to="localePath(post.link)"
				class="group min-h-[56px] flex flex-col items-start gap-2 px-6 py-5 transition-colors duration-150 md:grid md:grid-cols-12 md:items-center md:gap-4 hover:(bg-slate-50/90 dark:bg-[#002420]/50) sm:px-8"
			>
				<span class="col-span-1 text-xs text-brand-600 font-bold font-mono tabular-nums dark:text-brand-400">
					{{ post.index }}
				</span>

				<span class="col-span-8 text-base text-slate-900 font-700 leading-snug font-heading transition-colors duration-150 sm:text-lg dark:text-slate-50 group-hover:text-brand-700 dark:group-hover:text-brand-300">
					{{ post.title }}
				</span>

				<span class="col-span-2 hidden text-center text-[11px] text-slate-900/60 font-mono uppercase md:block dark:text-slate-50/60">
					[{{ post.category }}]
				</span>

				<span class="col-span-1 w-full flex items-center justify-between gap-2 text-xs text-slate-900/60 font-mono tabular-nums md:w-auto md:justify-end dark:text-slate-50/60">
					<span class="text-[10px] text-slate-900/40 font-mono uppercase md:hidden">[{{ post.category }}]</span>
					<span>{{ post.date }}</span>
					<span class="i-ph-arrow-up-right text-sm text-slate-900/40 transition-transform duration-150 group-hover:(translate-x-0.5 text-brand-500 -translate-y-0.5) dark:text-slate-50/40" />
				</span>
			</NuxtLink>
		</div>

		<!-- Footer Link Strip -->
		<div class="flex items-center justify-between border-t border-slate-200/80 bg-slate-50/50 px-6 py-3.5 text-xs font-mono dark:border-[#134e43] dark:bg-[#002420]/30 sm:px-8">
			<span class="hidden text-slate-900/40 uppercase sm:inline dark:text-slate-50/40">
				PUBLIKASI: TEKNOLOGI &amp; RUANG KELAS
			</span>
			<NuxtLink
				:to="localePath('/blog')"
				class="ml-auto inline-flex items-center gap-2 text-slate-900 font-bold tracking-wider uppercase underline underline-offset-4 dark:text-slate-50 hover:text-brand-600 dark:hover:text-brand-400"
			>
				<span>{{ writing?.all_link_text || 'BUKA SELURUH TULISAN & ESAI' }}</span>
				<span class="i-ph-arrow-right text-xs" />
			</NuxtLink>
		</div>
	</section>
</template>
