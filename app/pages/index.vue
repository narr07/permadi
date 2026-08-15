<script setup lang="ts">
	const { locale, t } = useI18n()
	const localePath = useLocalePath()
	const { el: spotlightEl, onMove } = useSpotlight()

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

	// 3. Proyek unggulan
	const { data: featuredProject } = await useAsyncData(
		() => `home-featured-proj-${locale.value}`,
		() => queryCollection(projectCollection.value).order('date', 'DESC').first(),
		{ watch: [locale] }
	)

	// 4. Cuplikan galeri
	const { data: galleryItems } = await useAsyncData(
		() => 'home-galeri-preview',
		() => queryCollection('galeri').order('order', 'ASC').limit(4).all()
	)

	const techStack = [
		'Vue 3',
		'Nuxt 4',
		'TypeScript',
		'UnoCSS',
		'Cloudflare D1',
		'SQLite FTS5',
		'Zod',
		'VeeValidate',
	]

	useSeoMeta({
		title: computed(() => page.value?.title || 'Dinar Permadi Yusup — Software Craftsman'),
		description: computed(() => page.value?.description || 'Frontend Developer & Digital Craftsman. Membangun antarmuka yang rapi, cepat, dan berperforma tinggi.'),
	})
</script>

<template>
	<div class="container-bento py-8">
		<div class="bento-grid">
			<!-- 1. Hero / Profil Card - 2x2 (6 col x 2 row) -->
			<div class="bento-card-subtle bento-lift bento-highlight lg:col-span-6 lg:row-span-2 flex flex-col justify-between">
				<div>
					<div class="flex items-center gap-4 mb-5">
						<div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-tr from-brand-600 to-brand-300 p-0.5 shadow-md">
							<div class="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-heading font-extrabold text-2xl sm:text-3xl">
								DP
							</div>
						</div>
						<div>
							<span class="badge-neutral text-brand-600 dark:text-brand-400 font-semibold mb-1">
								<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1 inline-block" /> Available for Hire
							</span>
							<h1 class="heading-hero text-slate-900 dark:text-white">
								Dinar Permadi Yusup
							</h1>
						</div>
					</div>
					<p class="text-body text-slate-600 dark:text-slate-300 leading-relaxed">
						{{ page?.description || 'Frontend Developer & Digital Craftsman. Membangun antarmuka web modern yang cepat, rapi, dan berperforma tinggi.' }}
					</p>
				</div>
				<div class="flex flex-wrap gap-2.5 mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
					<NuxtLink
						:to="locale === 'id' ? localePath('/projek') : localePath('/projects')"
						class="btn-primary"
					>
						{{ t('nav.projects', 'Lihat Proyek') }} <span class="i-lucide-arrow-right text-sm" />
					</NuxtLink>
					<NuxtLink
						:to="localePath('/blog')"
						class="btn-ghost border border-slate-200 dark:border-slate-700"
					>
						{{ t('nav.blog', 'Baca Tulisan') }}
					</NuxtLink>
				</div>
			</div>

			<!-- 2. Tentang Singkat - 2x1 (6 col x 1 row) -->
			<NuxtLink
				:to="locale === 'id' ? localePath('/tentang') : localePath('/about')"
				class="bento-card-soft bento-lift lg:col-span-6 lg:row-span-1 group block"
			>
				<div class="flex items-center justify-between mb-2">
					<h3 class="heading-card-md group-hover:text-brand-600 transition-colors">
						{{ t('nav.about', 'Tentang Singkat') }}
					</h3>
					<span class="i-lucide-arrow-up-right text-slate-400 group-hover:(text-brand-500 translate-x-0.5 -translate-y-0.5) transition-transform" />
				</div>
				<p class="text-body text-slate-600 dark:text-slate-300 line-clamp-2">
					Fokus di ekosistem Vue & Nuxt, menyukai konsistensi desain sistem, tipografi golden ratio, dan kecepatan rendering edge.
				</p>
			</NuxtLink>

			<!-- 3. Proyek Unggulan (Spotlight Card) - 2x2 (6 col x 2 row) -->
			<div
				ref="spotlightEl"
				class="bento-card-outline bento-spotlight bento-lift lg:col-span-6 lg:row-span-2 flex flex-col justify-between group"
				@mousemove="onMove"
			>
				<div>
					<div class="flex items-center justify-between mb-2">
						<span class="text-meta uppercase font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1">
							<span class="i-lucide-sparkles text-xs" /> Proyek Unggulan
						</span>
						<NuxtLink
							v-if="featuredProject"
							:to="featuredProject.path"
							class="text-meta hover:text-brand-500 flex items-center gap-1 font-medium"
						>
							Detail <span class="i-lucide-arrow-right text-xs" />
						</NuxtLink>
					</div>
					<h3 class="heading-card-lg group-hover:text-brand-500 transition-colors">
						{{ featuredProject?.title || 'Personal Portfolio & Bento Design System' }}
					</h3>
					<p class="text-body mt-2 line-clamp-3">
						{{ featuredProject?.description || 'Redesign sistem bento grid komprehensif dengan Nuxt 4, UnoCSS, dan Cloudflare D1.' }}
					</p>
				</div>
				<div class="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
					<div class="flex flex-wrap gap-1.5">
						<span v-for="tag in (featuredProject?.tags || ['Nuxt', 'UnoCSS', 'Cloudflare'])" :key="tag" class="badge-neutral text-xs">
							{{ tag }}
						</span>
					</div>
					<NuxtLink
						v-if="featuredProject"
						:to="featuredProject.path"
						class="btn-primary !px-3 !py-1 text-xs"
					>
						Explore Case Study
					</NuxtLink>
				</div>
			</div>

			<!-- 4. Tulisan Terbaru - 1x2 (3 col x 2 row) -->
			<div class="bento-card-soft lg:col-span-3 lg:row-span-2 flex flex-col justify-between">
				<div>
					<div class="flex items-center justify-between mb-3">
						<h3 class="heading-card-md">{{ t('nav.blog', 'Tulisan') }}</h3>
						<NuxtLink :to="localePath('/blog')" class="text-meta hover:text-brand-500 text-xs font-semibold flex items-center gap-0.5">
							Semua <span class="i-lucide-arrow-right text-[10px]" />
						</NuxtLink>
					</div>
					<ul v-if="latestPosts?.length" class="space-y-3 divide-y divide-slate-200/60 dark:divide-slate-800/60">
						<li v-for="post in latestPosts" :key="post.path" class="pt-2.5 first:pt-0">
							<NuxtLink :to="post.path" class="focus-ring block group">
								<h4 class="font-heading font-semibold text-g1 text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
									{{ post.title }}
								</h4>
								<span class="text-meta text-xs mt-1 block">{{ post.readingTime || 5 }} min read</span>
							</NuxtLink>
						</li>
					</ul>
					<p v-else class="text-meta text-xs">Belum ada tulisan.</p>
				</div>
				<NuxtLink :to="localePath('/blog')" class="btn-ghost !px-3 !py-1.5 text-xs text-center mt-3 border border-slate-200 dark:border-slate-700">
					Buka Halaman Blog
				</NuxtLink>
			</div>

			<!-- 5. Cuplikan Galeri - 1x2 (3 col x 2 row) -->
			<NuxtLink
				:to="locale === 'id' ? localePath('/galeri') : localePath('/gallery')"
				class="bento-card-ghost bento-lift lg:col-span-3 lg:row-span-2 flex flex-col justify-between group block"
			>
				<div>
					<div class="flex items-center justify-between mb-3">
						<h3 class="heading-card-md group-hover:text-brand-600 transition-colors">{{ t('nav.gallery', 'Galeri') }}</h3>
						<span class="i-lucide-arrow-up-right text-slate-400 group-hover:(text-brand-500 translate-x-0.5 -translate-y-0.5) transition-transform" />
					</div>
					<div v-if="galleryItems?.length" class="grid grid-cols-2 gap-2">
						<div
							v-for="(item, i) in galleryItems"
							:key="item.image || i"
							class="rounded-bento overflow-hidden bg-slate-200 dark:bg-slate-800"
							:class="i % 2 === 0 ? 'aspect-profile' : 'aspect-photo'"
						>
							<img
								:src="item.image"
								:alt="item.title || 'Foto galeri'"
								class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
								loading="lazy"
							>
						</div>
					</div>
					<div v-else class="py-6 text-center text-meta">
						<span class="i-lucide-image text-2xl mx-auto block opacity-40 mb-1" />
						Koleksi visual
					</div>
				</div>
				<span class="text-meta text-xs font-semibold text-brand-600 dark:text-brand-400 mt-2 block">
					Lihat semua karya visual & foto →
				</span>
			</NuxtLink>

			<!-- 6. Tech Stack - 1x1 (3 col x 1 row) -->
			<div class="bento-card-soft lg:col-span-3 lg:row-span-1">
				<h3 class="heading-card-md mb-2.5">Tech Stack</h3>
				<div class="flex flex-wrap gap-1.5">
					<span v-for="tech in techStack" :key="tech" class="badge-neutral text-xs">
						{{ tech }}
					</span>
				</div>
			</div>

			<!-- 7. Terhubung / Socials - 1x1 (3 col x 1 row) -->
			<div class="bento-card-ghost lg:col-span-3 lg:row-span-1">
				<h3 class="heading-card-md mb-2.5">Terhubung</h3>
				<div class="flex items-center gap-1.5 flex-wrap">
					<a href="https://github.com/narr07" target="_blank" rel="noopener" class="icon-btn" aria-label="GitHub">
						<span class="i-simple-icons-github text-base" />
					</a>
					<a href="https://x.com/dinarpermadi07" target="_blank" rel="noopener" class="icon-btn" aria-label="X">
						<span class="i-simple-icons-x text-base" />
					</a>
					<a href="https://www.instagram.com/narr07/" target="_blank" rel="noopener" class="icon-btn" aria-label="Instagram">
						<span class="i-simple-icons-instagram text-base" />
					</a>
					<a href="https://www.behance.net/narr07" target="_blank" rel="noopener" class="icon-btn" aria-label="Behance">
						<span class="i-simple-icons-behance text-base" />
					</a>
					<a href="mailto:hi@permadi.dev" class="icon-btn" aria-label="Email">
						<span class="i-lucide-mail text-base" />
					</a>
				</div>
			</div>

			<!-- 8. Newsletter - 2x1 (6 col x 1 row) -->
			<div class="bento-card-subtle lg:col-span-6 lg:row-span-1">
				<h3 class="heading-card-md">Newsletter</h3>
				<p class="text-meta mt-1">Dapatkan pembaruan berkala tentang web dev, UI/UX, dan studi kasus proyek.</p>
				<NewsletterForm />
			</div>
		</div>
	</div>
</template>
