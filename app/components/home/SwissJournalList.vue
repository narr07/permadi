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
	<section class="w-full border-b border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#001e1c]">
		<!-- Header Strip -->
		<div class="px-6 py-4 sm:px-8 sm:py-5 border-b border-slate-200/80 dark:border-[#134e43] flex items-center justify-between font-mono text-[11px] font-bold tracking-[0.2em] uppercase">
			<div class="flex items-center gap-2.5 text-brand-700 dark:text-accent">
				<span class="w-2 h-2 rounded-none bg-brand-500 inline-block" />
				<span>{{ writing?.label || '05 // TULISAN & CATATAN TERBARU' }}</span>
			</div>
			<span class="text-slate-900/40 tabular-nums dark:text-slate-50/40">
				JOURNAL // EDISI 2026
			</span>
		</div>

		<!-- Table Header Row (Desktop) -->
		<div class="hidden md:grid grid-cols-12 gap-4 px-6 sm:px-8 py-3 font-mono text-[10px] text-slate-900/50 uppercase tracking-widest border-b border-slate-200/80 bg-slate-50/50 dark:border-[#134e43] dark:bg-[#002420]/30 dark:text-slate-50/50">
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
				class="group flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 px-6 sm:px-8 py-5 min-h-[56px] items-start md:items-center transition-colors duration-150 hover:(bg-slate-50/90 dark:bg-[#002420]/50)"
			>
				<span class="col-span-1 font-mono text-xs font-bold text-brand-600 dark:text-brand-400 tabular-nums">
					{{ post.index }}
				</span>

				<span class="col-span-8 font-heading font-700 text-base sm:text-lg text-slate-900 leading-snug transition-colors duration-150 group-hover:text-brand-700 dark:text-slate-50 dark:group-hover:text-brand-300">
					{{ post.title }}
				</span>

				<span class="col-span-2 hidden md:block text-center font-mono text-[11px] text-slate-900/60 uppercase dark:text-slate-50/60">
					[{{ post.category }}]
				</span>

				<span class="col-span-1 flex items-center justify-between md:justify-end gap-2 font-mono text-xs text-slate-900/60 tabular-nums dark:text-slate-50/60 w-full md:w-auto">
					<span class="md:hidden font-mono text-[10px] text-slate-900/40 uppercase">[{{ post.category }}]</span>
					<span>{{ post.date }}</span>
					<span class="i-hugeicons-arrow-up-right-01 text-sm text-slate-900/40 transition-transform duration-150 group-hover:(translate-x-0.5 -translate-y-0.5 text-brand-500) dark:text-slate-50/40" />
				</span>
			</NuxtLink>
		</div>

		<!-- Footer Link Strip -->
		<div class="px-6 py-3.5 sm:px-8 border-t border-slate-200/80 dark:border-[#134e43] flex items-center justify-between bg-slate-50/50 dark:bg-[#002420]/30 font-mono text-xs">
			<span class="text-slate-900/40 uppercase hidden sm:inline dark:text-slate-50/40">
				PUBLIKASI: TEKNOLOGI &amp; RUANG KELAS
			</span>
			<NuxtLink
				:to="localePath('/blog')"
				class="inline-flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider underline underline-offset-4 hover:text-brand-600 dark:text-slate-50 dark:hover:text-brand-400 ml-auto"
			>
				<span>{{ writing?.all_link_text || 'BUKA SELURUH TULISAN & ESAI' }}</span>
				<span class="i-hugeicons-arrow-right-01 text-xs" />
			</NuxtLink>
		</div>
	</section>
</template>
