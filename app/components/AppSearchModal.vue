<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()
const isOpen = ref(false)
const searchQuery = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const results = ref<any[]>([])
const selectedIndex = ref(-1)

// Koleksi aktif berdasarkan bahasa
const collections = computed(() => {
	return locale.value === 'id'
		? (['blog_id', 'projek_id', 'pages_id'] as const)
		: (['blog_en', 'projek_en', 'pages_en'] as const)
})

// Composable resmi Nuxt Content: useSearchCollection
const { status, search, init } = useSearchCollection(collections as any, {
	immediate: true,
})

// Jalankan pencarian saat query berubah
watch(searchQuery, async (newVal) => {
	selectedIndex.value = -1
	const trimmed = newVal.trim()
	if (!trimmed) {
		results.value = []
		return
	}
	try {
		const res = await search(trimmed, {
			limit: 20,
			snippet: {
				columns: ['content', 'title'],
				around: 35,
				tag: 'mark',
			},
		})
		results.value = res
	}
	catch (err) {
		console.error('Search error:', err)
		results.value = []
	}
})

// Kelompokkan hasil pencarian
const articleResults = computed(() => {
	return results.value.filter(r => r.collection?.includes('blog'))
})

const projectResults = computed(() => {
	return results.value.filter(r => r.collection?.includes('projek') || r.collection?.includes('project'))
})

const pageResults = computed(() => {
	return results.value.filter(r => r.collection?.includes('pages'))
})

// List Links default dengan Hugeicons
const defaultLinks = computed(() => [
	{
		label: 'Ask AI',
		description: locale.value === 'id' ? 'Tanya seputar pengalaman & profil' : 'Ask about experience & profile',
		icon: 'i-hugeicons-sparkles',
		kbds: ['CTRL', 'I'],
		to: localePath('/kontak'),
	},
	{
		label: t('nav.home', 'Home'),
		description: locale.value === 'id' ? 'Halaman utama & ringkasan profil' : 'Overview & main landing',
		icon: 'i-hugeicons-home-01',
		to: localePath('/'),
	},
	{
		label: t('nav.blog', 'Blog'),
		description: locale.value === 'id' ? 'Artikel teknis, tutorial, dan catatan pengembangan' : 'Technical articles, tutorials & dev notes',
		icon: 'i-hugeicons-book-open-01',
		to: localePath('/blog'),
	},
	{
		label: t('nav.projects', 'Projects'),
		description: locale.value === 'id' ? 'Koleksi studi kasus aplikasi & demo karya' : 'Explore case studies and live demos',
		icon: 'i-hugeicons-code-folder',
		to: locale.value === 'id' ? '/id/projek' : '/en/projects',
	},
	{
		label: t('nav.gallery', 'Gallery'),
		description: locale.value === 'id' ? 'Koleksi foto visual & cuplikan karya' : 'Visual snapshots, photos & design',
		icon: 'i-hugeicons-image-02',
		to: locale.value === 'id' ? '/id/galeri' : '/en/gallery',
	},
	{
		label: t('nav.about', 'About'),
		description: locale.value === 'id' ? 'Biografi singkat, keahlian, dan riwayat karir' : 'Biography, skillset, and career',
		icon: 'i-hugeicons-user-circle',
		to: locale.value === 'id' ? '/id/tentang' : '/en/about',
	},
	{
		label: t('nav.contact', 'Contact'),
		description: locale.value === 'id' ? 'Diskusikan projek baru atau kirim pesan' : 'Discuss new projects or get in touch',
		icon: 'i-hugeicons-mail-01',
		to: locale.value === 'id' ? '/id/kontak' : '/en/contact',
	},
	{
		label: 'GitHub',
		description: 'github.com/narr07',
		icon: 'i-hugeicons-github',
		href: 'https://github.com/narr07',
		target: '_blank',
	},
	{
		label: 'X (Twitter)',
		description: 'x.com/dinarpermadi07',
		icon: 'i-hugeicons-new-twitter',
		href: 'https://x.com/dinarpermadi07',
		target: '_blank',
	},
	{
		label: 'Behance',
		description: 'behance.net/narr07',
		icon: 'i-hugeicons-behance-02',
		href: 'https://www.behance.net/narr07',
		target: '_blank',
	},
	{
		label: 'Instagram',
		description: 'instagram.com/narr07',
		icon: 'i-hugeicons-instagram',
		href: 'https://www.instagram.com/narr07/',
		target: '_blank',
	},
])

// Seluruh hasil aktif untuk keyboard navigation
const activeItems = computed(() => {
	if (!searchQuery.value.trim()) {
		return defaultLinks.value
	}
	return [...articleResults.value, ...projectResults.value, ...pageResults.value]
})

function getTargetUrl(result: any): string {
	if (result.id) {
		return result.id
	}
	return `/${locale.value}`
}

async function openModal() {
	isOpen.value = true
	selectedIndex.value = -1
	if (status.value === 'idle') {
		await init()
	}
	nextTick(() => {
		inputRef.value?.focus()
	})
}

function closeModal() {
	isOpen.value = false
	searchQuery.value = ''
	results.value = []
	selectedIndex.value = -1
}

async function handleItemSelect(item: any) {
	closeModal()
	if (item.href) {
		window.open(item.href, item.target || '_blank')
	}
	else if (item.to) {
		await navigateTo(item.to)
	}
	else {
		await navigateTo(getTargetUrl(item))
	}
}

// Keyboard Navigation (Up, Down, Enter, Esc)
function handleModalKeydown(e: KeyboardEvent) {
	if (!isOpen.value)
		return

	const total = activeItems.value.length

	if (e.key === 'ArrowDown') {
		e.preventDefault()
		if (total > 0) {
			selectedIndex.value = (selectedIndex.value + 1) % total
		}
	}
	else if (e.key === 'ArrowUp') {
		e.preventDefault()
		if (total > 0) {
			selectedIndex.value = (selectedIndex.value - 1 + total) % total
		}
	}
	else if (e.key === 'Enter') {
		if (selectedIndex.value >= 0 && selectedIndex.value < total) {
			e.preventDefault()
			const item = activeItems.value[selectedIndex.value]
			if (item) {
				handleItemSelect(item)
			}
		}
	}
}

// Shortcut global Ctrl+K / Cmd+K & Esc
onMounted(() => {
	function handleGlobalKeyDown(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
			e.preventDefault()
			if (isOpen.value) {
				closeModal()
			}
			else {
				openModal()
			}
		}
		if (e.key === 'Escape' && isOpen.value) {
			closeModal()
		}
	}
	window.addEventListener('keydown', handleGlobalKeyDown)
	onUnmounted(() => {
		window.removeEventListener('keydown', handleGlobalKeyDown)
	})
})
</script>

<template>
	<div class="relative inline-flex items-center">
		<!-- Trigger Button -->
		<button
			type="button"
			class="icon-btn transition-transform active:scale-95"
			:aria-label="t('search.shortcut', 'Cari (Ctrl+K)')"
			@click="openModal"
		>
			<span class="i-hugeicons-search-01 text-base text-slate-600 dark:text-slate-300" />
		</button>

		<!-- Modal Backdrop & Blur -->
		<Teleport to="body">
			<Transition
				enter-active-class="transition duration-200 ease-out"
				enter-from-class="opacity-0"
				enter-to-class="opacity-100"
				leave-active-class="transition duration-150 ease-in"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
			>
				<div
					v-if="isOpen"
					class="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto bg-slate-950/70 p-3 pt-16 backdrop-blur-md transition-all dark:bg-slate-950/80 md:p-6 sm:p-4 sm:pt-24"
					role="dialog"
					aria-modal="true"
					:aria-label="t('search.placeholder', 'Pencarian')"
					@click.self="closeModal"
					@keydown="handleModalKeydown"
				>
					<!-- Bento Command Palette Card -->
					<div class="animate-scale-in max-h-[80vh] max-w-2xl w-full flex flex-col overflow-hidden border border-slate-200/80 rounded-bento bg-white/95 shadow-2xl backdrop-blur-xl transition-all dark:border-slate-800/80 dark:bg-slate-900/95">
						<!-- Top Search Bar -->
						<div class="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 dark:border-slate-800/80">
							<span class="i-hugeicons-search-01 shrink-0 text-lg text-slate-400 dark:text-slate-500" />

							<input
								ref="inputRef"
								v-model="searchQuery"
								type="search"
								role="combobox"
								aria-autocomplete="list"
								:aria-expanded="Boolean(searchQuery.trim())"
								:aria-label="t('search.placeholder', 'Ketik kata kunci pencarian...')"
								class="flex-1 border-none bg-transparent text-sm text-slate-900 font-sans outline-none sm:text-base dark:text-white placeholder:text-slate-400"
								:placeholder="t('search.placeholder', 'Type a command or search...')"
								autocomplete="off"
								spellcheck="false"
							>

							<span
								v-if="status === 'loading'"
								class="i-hugeicons-loading-03 shrink-0 animate-spin text-base text-brand-500"
								aria-live="polite"
							/>

							<button
								type="button"
								class="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
								aria-label="Tutup"
								@click="closeModal"
							>
								<span class="i-hugeicons-cancel-01 text-base" />
							</button>
						</div>

						<!-- Body: Links / Search Results -->
						<div class="flex-1 overflow-y-auto p-2 space-y-3 sm:p-2.5">
							<!-- 1. DEFAULT LINKS LIST (seperti di Nuxt UI docs) -->
							<div
								v-if="!searchQuery.trim()"
								class="space-y-1"
							>
								<div class="px-3 py-1.5 text-xs text-slate-400 font-semibold tracking-wide uppercase dark:text-slate-500">
									Links
								</div>

								<ul class="space-y-0.5">
									<li
										v-for="(item, idx) in defaultLinks"
										:key="item.label"
									>
										<!-- Link Internal (NuxtLink) -->
										<NuxtLink
											v-if="item.to"
											:to="item.to"
											class="group flex cursor-pointer items-center justify-between border border-transparent rounded-bento px-3 py-2.5 text-sm transition-all duration-150"
											:class="idx === selectedIndex
												? 'bg-brand-50/90 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border-brand-200/60 dark:border-brand-800/50'
												: 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:border-slate-200/50 dark:hover:border-slate-700/50'"
											@click="closeModal"
										>
											<div class="min-w-0 flex flex-1 items-center gap-3">
												<span
													:class="item.icon"
													class="shrink-0 text-base text-slate-400 transition-colors group-hover:text-brand-500"
												/>
												<div class="flex items-center gap-2 truncate">
													<span class="shrink-0 text-slate-900 font-medium dark:text-white">{{ item.label }}</span>
													<span class="truncate text-xs text-slate-400 dark:text-slate-500">{{ item.description }}</span>
												</div>
											</div>

											<div
												v-if="item.kbds"
												class="ml-2 flex shrink-0 items-center gap-1"
											>
												<kbd
													v-for="k in item.kbds"
													:key="k"
													class="border border-slate-200/60 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 font-medium font-mono dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-400"
												>
													{{ k }}
												</kbd>
											</div>
										</NuxtLink>

										<!-- Link Eksternal (a) -->
										<a
											v-else-if="item.href"
											:href="item.href"
											:target="item.target"
											rel="noopener"
											class="group flex cursor-pointer items-center justify-between border border-transparent rounded-bento px-3 py-2.5 text-sm transition-all duration-150"
											:class="idx === selectedIndex
												? 'bg-brand-50/90 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border-brand-200/60 dark:border-brand-800/50'
												: 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:border-slate-200/50 dark:hover:border-slate-700/50'"
											@click="closeModal"
										>
											<div class="min-w-0 flex flex-1 items-center gap-3">
												<span
													:class="item.icon"
													class="shrink-0 text-base text-slate-400 transition-colors group-hover:text-brand-500"
												/>
												<div class="flex items-center gap-2 truncate">
													<span class="shrink-0 text-slate-900 font-medium dark:text-white">{{ item.label }}</span>
													<span class="truncate text-xs text-slate-400 dark:text-slate-500">{{ item.description }}</span>
												</div>
											</div>
										</a>
									</li>
								</ul>
							</div>

							<!-- 2. NO RESULTS STATE -->
							<div
								v-else-if="results.length === 0 && status !== 'loading'"
								class="py-10 text-center"
							>
								<span class="i-hugeicons-search-01 mx-auto mb-2 block text-2xl text-slate-400 opacity-40" />
								<p class="text-sm text-slate-700 font-medium dark:text-slate-300">
									{{ t('search.no_results', 'Tidak ada hasil untuk') }} "<strong>{{ searchQuery }}</strong>"
								</p>
							</div>

							<!-- 3. SEARCH RESULTS LIST -->
							<div
								v-else
								class="space-y-3"
							>
								<!-- Group: Artikel -->
								<div
									v-if="articleResults.length > 0"
									class="space-y-1"
								>
									<div class="flex items-center justify-between px-3 py-1 text-xs text-slate-400 font-semibold tracking-wide uppercase dark:text-slate-500">
										<span>{{ t('search.articles', 'Artikel') }}</span>
										<span>{{ articleResults.length }}</span>
									</div>
									<ul class="space-y-0.5">
										<li
											v-for="item in articleResults"
											:key="item.id + (item.level || 0)"
										>
											<NuxtLink
												:to="getTargetUrl(item)"
												class="group block cursor-pointer border border-transparent rounded-bento px-3 py-2 text-sm transition-all duration-150"
												:class="activeItems.indexOf(item) === selectedIndex
													? 'bg-brand-50/90 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border-brand-200/60 dark:border-brand-800/50'
													: 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:border-slate-200/50 dark:hover:border-slate-700/50'"
												@click="closeModal"
											>
												<div class="flex items-center justify-between gap-2">
													<div
														class="text-slate-900 font-medium transition-colors dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400"
														v-html="item.snippets?.title || item.title"
													/>
													<span class="i-hugeicons-arrow-right-01 shrink-0 text-xs text-slate-400 group-hover:text-brand-500" />
												</div>
												<div
													v-if="item.snippets?.content"
													class="line-clamp-1 mt-0.5 text-xs text-slate-500 dark:text-slate-400"
													v-html="item.snippets.content"
												/>
											</NuxtLink>
										</li>
									</ul>
								</div>

								<!-- Group: Projek -->
								<div
									v-if="projectResults.length > 0"
									class="space-y-1"
								>
									<div class="flex items-center justify-between px-3 py-1 text-xs text-slate-400 font-semibold tracking-wide uppercase dark:text-slate-500">
										<span>{{ t('search.projects', 'Projek') }}</span>
										<span>{{ projectResults.length }}</span>
									</div>
									<ul class="space-y-0.5">
										<li
											v-for="item in projectResults"
											:key="item.id + (item.level || 0)"
										>
											<NuxtLink
												:to="getTargetUrl(item)"
												class="group block cursor-pointer border border-transparent rounded-bento px-3 py-2 text-sm transition-all duration-150"
												:class="activeItems.indexOf(item) === selectedIndex
													? 'bg-blue-50/90 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/50'
													: 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:border-slate-200/50 dark:hover:border-slate-700/50'"
												@click="closeModal"
											>
												<div class="flex items-center justify-between gap-2">
													<div
														class="text-slate-900 font-medium transition-colors dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
														v-html="item.snippets?.title || item.title"
													/>
													<span class="i-hugeicons-arrow-right-01 shrink-0 text-xs text-slate-400 group-hover:text-blue-500" />
												</div>
												<div
													v-if="item.snippets?.content"
													class="line-clamp-1 mt-0.5 text-xs text-slate-500 dark:text-slate-400"
													v-html="item.snippets.content"
												/>
											</NuxtLink>
										</li>
									</ul>
								</div>

								<!-- Group: Halaman -->
								<div
									v-if="pageResults.length > 0"
									class="space-y-1"
								>
									<div class="flex items-center justify-between px-3 py-1 text-xs text-slate-400 font-semibold tracking-wide uppercase dark:text-slate-500">
										<span>Halaman</span>
										<span>{{ pageResults.length }}</span>
									</div>
									<ul class="space-y-0.5">
										<li
											v-for="item in pageResults"
											:key="item.id + (item.level || 0)"
										>
											<NuxtLink
												:to="getTargetUrl(item)"
												class="group block cursor-pointer border border-transparent rounded-bento px-3 py-2 text-sm transition-all duration-150"
												:class="activeItems.indexOf(item) === selectedIndex
													? 'bg-amber-50/90 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/50'
													: 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:border-slate-200/50 dark:hover:border-slate-700/50'"
												@click="closeModal"
											>
												<div class="flex items-center justify-between gap-2">
													<div
														class="text-slate-900 font-medium transition-colors dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400"
														v-html="item.snippets?.title || item.title"
													/>
													<span class="i-hugeicons-arrow-right-01 shrink-0 text-xs text-slate-400 group-hover:text-amber-500" />
												</div>
												<div
													v-if="item.snippets?.content"
													class="line-clamp-1 mt-0.5 text-xs text-slate-500 dark:text-slate-400"
													v-html="item.snippets.content"
												/>
											</NuxtLink>
										</li>
									</ul>
								</div>
							</div>
						</div>

						<!-- Footer Bar -->
						<div class="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-4 py-2.5 text-[11px] text-slate-400 dark:border-slate-800 dark:bg-slate-950/80">
							<div class="flex items-center gap-3">
								<span class="flex items-center gap-1">
									<kbd class="rounded bg-slate-200/70 px-1 py-0.2 text-[10px] font-mono dark:bg-slate-800">↑↓</kbd>
									<span>Pilih</span>
								</span>
								<span class="flex items-center gap-1">
									<kbd class="rounded bg-slate-200/70 px-1 py-0.2 text-[10px] font-mono dark:bg-slate-800">↵</kbd>
									<span>Buka</span>
								</span>
								<span class="flex items-center gap-1">
									<kbd class="rounded bg-slate-200/70 px-1 py-0.2 text-[10px] font-mono dark:bg-slate-800">ESC</kbd>
									<span>Tutup</span>
								</span>
							</div>

							<div class="flex items-center gap-1 text-brand-600 font-medium dark:text-brand-400">
								<span class="i-hugeicons-sparkles text-xs text-amber-500" />
								<span>SQLite FTS5</span>
							</div>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<style>
mark {
	background-color: rgba(20, 184, 152, 0.22);
	color: inherit;
	border-radius: 4px;
	padding: 0 3px;
	font-weight: 600;
}
.dark mark {
	background-color: rgba(43, 212, 181, 0.3);
	color: #5eeacf;
}
</style>
