<script setup lang="ts">
	const { locale, t } = useI18n()
	const localePath = useLocalePath()

	const blogCollection = computed(() => (locale.value === 'id' ? 'blog_id' : 'blog_en'))
	const projectCollection = computed(() => (locale.value === 'id' ? 'projek_id' : 'projek_en'))
	const pageCollection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
	const currentPath = computed(() => `/${locale.value}`)

	// 1. Data halaman beranda
	const { data: page } = await useAsyncData(
		() => `home-${locale.value}`,
		() => queryCollection(pageCollection.value).path(currentPath.value).first(),
		{ watch: [locale] }
	)

	// 2. Tulisan terbaru
	const { data: latestPosts } = await useAsyncData(
		() => `home-latest-posts-${locale.value}`,
		() => queryCollection(blogCollection.value).order('date', 'DESC').limit(4).all(),
		{ watch: [locale] }
	)

	// 3. Proyek unggulan terbaru
	const { data: featuredProject } = await useAsyncData(
		() => `home-featured-proj-${locale.value}`,
		() => queryCollection(projectCollection.value).order('date', 'DESC').first(),
		{ watch: [locale] }
	)

	// 4. Cuplikan galeri (Cloudinary API dengan fallback)
	const { data: galleryItems } = await useAsyncData(
		() => 'home-galeri-preview',
		async () => {
			try {
				const cloud = await $fetch<any[]>('/api/cloudinary-gallery')
				if (cloud && cloud.length > 0) return cloud.slice(0, 4)
			} catch {}
			return queryCollection('galeri').order('order', 'ASC').limit(4).all()
		}
	)

	useSeoMeta({
		title: computed(() => page.value?.title || 'Dinar Permadi Yusup — Software Craftsman'),
		description: computed(() => page.value?.description || 'Frontend Developer & Digital Craftsman. Membangun antarmuka yang rapi, cepat, dan berperforma tinggi.'),
	})
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<!-- 1. Page Intro Header (Gaya Tenang & Elegan personal-sitenextjs) -->
		<div class="max-w-3xl mb-10 sm:mb-12">
			<span class="section-label mb-3 block text-brand-600 dark:text-brand-400 font-bold">
				{{ locale === 'id' ? 'Permadi / Ruang Kerja Personal' : 'Permadi / Personal Workspace' }}
			</span>
			<h1 class="font-heading font-semibold text-slate-900 dark:text-white text-4xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight mb-4">
				{{ locale === 'id' ? 'Sudut kecil di belantara internet.' : 'A small corner of the internet.' }}
			</h1>
			<p class="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
				{{ page?.description || (locale === 'id' ? 'Arsip hidup berisi karya, eksperimen antarmuka, fotografi, dan catatan oleh frontend developer di Bandung.' : 'A living archive of work, experiments, images, and notes by a frontend developer in Bandung.') }}
			</p>
		</div>

		<!-- 2. Bento Grid Utama (12 Kolom) -->
		<div class="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
			<!-- Hero Card Utama (Span 7 di Desktop, Deep Forest Green #002b27) -->
			<div class="hero-card-clean md:col-span-7 md:row-span-2 p-6 sm:p-8 flex flex-col justify-between group">
				<div>
					<!-- Status Dot Eyebrow -->
					<div class="flex items-center gap-2 mb-6">
						<span class="status-dot" />
						<span class="text-xs uppercase tracking-widest font-semibold text-brand-300">
							{{ locale === 'id' ? 'Tersedia untuk proyek terpilih' : 'Available for select projects' }}
						</span>
					</div>

					<span class="kicker text-brand-400 block mb-2 font-medium">
						Frontend Developer / Digital Craftsman
					</span>

					<h2 class="font-heading font-semibold text-white text-3xl sm:text-5xl leading-[1.02] tracking-tight mb-4">
						{{ locale === 'id' ? 'Membangun antarmuka ' : 'Building useful ' }}
						<em class="font-serif italic font-normal text-brand-300">{{ locale === 'id' ? 'bermakna' : 'things' }}</em>
						{{ locale === 'id' ? ' dengan ketelitian.' : ' with care.' }}
					</h2>

					<p class="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md">
						{{ locale === 'id' ? 'Mengubah gagasan kompleks menjadi pengalaman digital yang tenang, rapi, dan berperforma tinggi.' : 'I turn complex ideas into calm, considered digital experiences.' }}
					</p>

					<!-- Action Buttons -->
					<div class="flex flex-wrap items-center gap-3 mt-6 pt-2">
						<NuxtLink
							:to="locale === 'id' ? '/id/projek' : '/en/projects'"
							class="px-5 py-2.5 rounded-full text-xs font-bold bg-brand-400 text-slate-950 hover:bg-brand-300 transition-all inline-flex items-center gap-1.5 shadow-sm"
						>
							{{ locale === 'id' ? 'Lihat Portofolio' : 'Browse Work' }} <span>↗</span>
						</NuxtLink>
						<NuxtLink
							:to="locale === 'id' ? '/id/kontak' : '/en/contact'"
							class="px-5 py-2.5 rounded-full text-xs font-semibold border border-brand-400/40 text-brand-200 hover:bg-brand-950/60 transition-all inline-flex items-center gap-1.5"
						>
							{{ locale === 'id' ? 'Hubungi Saya' : 'Get in Touch' }}
						</NuxtLink>
					</div>
				</div>

				<!-- Hero Meta Location -->
				<div class="mt-8 pt-4 border-t border-brand-900/60 flex items-center justify-between text-xs text-brand-400/80">
					<span class="flex items-center gap-1">
						<span class="i-hugeicons-location-01 text-sm text-brand-300" /> Bandung, ID
					</span>
					<span>GMT+7 / Local time</span>
				</div>
			</div>

			<!-- Selected Work Bento (Span 5) -->
			<NuxtLink
				:to="locale === 'id' ? '/id/projek' : '/en/projects'"
				class="bento-card-clean md:col-span-5 p-6 sm:p-7 flex flex-col justify-between group block"
			>
				<div>
					<div class="flex items-center justify-between mb-3">
						<span class="section-label text-brand-600 dark:text-brand-400">
							{{ locale === 'id' ? 'Projek Terpilih' : 'Selected Work' }}
						</span>
						<span class="i-hugeicons-arrow-right-01 text-slate-400 group-hover:(text-brand-500 translate-x-1) transition-transform" />
					</div>
					<h3 class="font-heading font-semibold text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight">
						{{ featuredProject?.title || (locale === 'id' ? 'Empat proyek, banyak pelajaran berharga.' : 'Four projects, many lessons.') }}
					</h3>
					<p class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2 line-clamp-2">
						{{ featuredProject?.description || (locale === 'id' ? 'Koleksi studi kasus sistem web dan eksplorasi desain modular.' : 'A collection of web systems case studies and modular design.') }}
					</p>
				</div>
				<div class="mt-6 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400">
					<span>{{ locale === 'id' ? 'Buka Semua Projek' : 'Browse All Work' }}</span>
					<span>↗</span>
				</div>
			</NuxtLink>

			<!-- Manifesto Accent Card (Span 5 - Warm Sand #facd87) -->
			<div class="sand-card-clean md:col-span-5 p-6 sm:p-7 flex flex-col justify-between">
				<div class="flex items-center justify-between">
					<span class="i-hugeicons-sparkles text-lg text-slate-900" />
					<span class="text-xs font-mono text-slate-700 font-semibold">01 / 04</span>
				</div>
				<p class="font-serif text-xl sm:text-2xl text-slate-900 leading-snug my-4">
					{{ locale === 'id' ? 'Desain yang baik itu tenang.' : 'Good design is quiet.' }}<br>
					<strong>{{ locale === 'id' ? 'Desain luar biasa akan selalu membekas.' : 'Great design stays with you.' }}</strong>
				</p>
				<span class="text-xs uppercase tracking-wider font-mono text-slate-700">
					Permadi Philosophy
				</span>
			</div>

			<!-- Visual Image / Workspace Card (Span 5) -->
			<NuxtLink
				:to="locale === 'id' ? '/id/galeri' : '/en/gallery'"
				class="bento-card-clean md:col-span-5 !p-0 flex flex-col justify-between group overflow-hidden block"
			>
				<div class="w-full aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
					<NuxtImg
						v-if="galleryItems?.[0]?.image"
						:src="galleryItems[0].image"
						:alt="galleryItems[0].title || 'Workspace'"
						:provider="galleryItems[0].image.startsWith('http') || galleryItems[0].image.startsWith('/projects') || galleryItems[0].image.startsWith('/galeri') ? undefined : 'cloudinary'"
						format="webp"
						quality="75"
						width="450"
						class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
						loading="lazy"
					/>
					<div v-else class="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
						<span class="i-hugeicons-image-02 text-3xl text-slate-400" />
					</div>
				</div>
				<div class="p-4 sm:p-5 flex items-center justify-between text-xs bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800/60">
					<div>
						<span class="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
							{{ locale === 'id' ? 'Eksplorasi Saat Ini' : 'Currently Exploring' }}
						</span>
						<strong class="text-slate-900 dark:text-white font-medium text-xs">
							{{ locale === 'id' ? 'Antarmuka yang terasa natural.' : 'Interfaces that feel inevitable.' }}
						</strong>
					</div>
					<span class="i-hugeicons-arrow-right-01 text-slate-400 group-hover:(text-brand-500 translate-x-1) transition-transform" />
				</div>
			</NuxtLink>

			<!-- The Archive / Gallery Bento (Span 7) -->
			<NuxtLink
				:to="locale === 'id' ? '/id/galeri' : '/en/gallery'"
				class="bento-card-clean md:col-span-7 p-6 sm:p-7 flex flex-col justify-between group block"
			>
				<div>
					<div class="flex items-center justify-between mb-3">
						<span class="section-label text-brand-600 dark:text-brand-400">
							{{ locale === 'id' ? 'Arsip Visual' : 'The Archive' }}
						</span>
						<span class="i-hugeicons-arrow-right-01 text-slate-400 group-hover:(text-brand-500 translate-x-1) transition-transform" />
					</div>
					<h3 class="font-heading font-semibold text-2xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
						{{ locale === 'id' ? 'Gambar, dokumentasi, dan observasi visual.' : 'Images, objects, and quiet observations.' }}
					</h3>
					<p class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2 max-w-lg">
						{{ locale === 'id' ? 'Dokumentasi fotografi karya dan setup ruang kerja yang terorganisir di Cloudinary.' : 'Curated visual captures and workspace documentation organized in Cloudinary CDN.' }}
					</p>
				</div>
				<div class="mt-6 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400">
					<span>{{ locale === 'id' ? 'Buka Galeri Lengkap' : 'Open Gallery' }}</span>
					<span>↗</span>
				</div>
			</NuxtLink>

			<!-- 3. Tulisan Terbaru Bento Grid (Span 12) -->
			<div class="bento-card-clean md:col-span-12 p-6 sm:p-8">
				<div class="flex items-center justify-between mb-6 pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
					<div>
						<span class="section-label text-brand-600 dark:text-brand-400 block mb-1">
							{{ locale === 'id' ? 'Tulisan & Catatan' : 'Recent Writing' }}
						</span>
						<h3 class="font-heading font-semibold text-2xl sm:text-3xl text-slate-900 dark:text-white">
							{{ locale === 'id' ? 'Catatan terbaru seputar web & sistem.' : 'Notes on code, craft, and systems.' }}
						</h3>
					</div>
					<NuxtLink
						:to="localePath('/blog')"
						class="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline hidden sm:inline-flex items-center gap-1"
					>
						{{ locale === 'id' ? 'Lihat Semua Tulisan' : 'Read All Notes' }} <span>↗</span>
					</NuxtLink>
				</div>

				<div v-if="latestPosts?.length" class="divide-y divide-slate-200/60 dark:divide-slate-800/60">
					<NuxtLink
						v-for="(post, pIdx) in latestPosts"
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
		</div>
	</div>
</template>
