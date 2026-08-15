<script setup lang="ts">
	const { locale, t } = useI18n()
	const isOpen = ref(false)
	const searchQuery = ref('')
	const inputRef = ref<HTMLInputElement | null>(null)
	const results = ref<any[]>([])

	// Koleksi aktif berdasarkan bahasa
	const collections = computed(() => {
		return locale.value === 'id'
			? (['blog_id', 'projek_id', 'pages_id'] as const)
			: (['blog_en', 'projek_en', 'pages_en'] as const)
	})

	// Composable resmi Nuxt Content: useSearchCollection (FTS5 + BM25 + Snippets)
	const { status, search, init } = useSearchCollection(collections as any, {
		immediate: true,
	})

	// Jalankan pencarian saat query berubah
	watch(searchQuery, async (newVal) => {
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
		} catch (err) {
			console.error('Search error:', err)
			results.value = []
		}
	})

	// Kelompokkan hasil pencarian
	const articleResults = computed(() => {
		return results.value.filter((r) => r.collection?.includes('blog'))
	})

	const projectResults = computed(() => {
		return results.value.filter((r) => r.collection?.includes('projek') || r.collection?.includes('project'))
	})

	const pageResults = computed(() => {
		return results.value.filter((r) => r.collection?.includes('pages'))
	})

	function getTargetUrl(result: any): string {
		if (result.id) {
			return result.id
		}
		return `/${locale.value}`
	}

	async function openModal() {
		isOpen.value = true
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
	}

	// Tangkap shortcut keyboard Ctrl+K / Cmd+K & Esc
	onMounted(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault()
				if (isOpen.value) {
					closeModal()
				} else {
					openModal()
				}
			}
			if (e.key === 'Escape' && isOpen.value) {
				closeModal()
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		onUnmounted(() => {
			window.removeEventListener('keydown', handleKeyDown)
		})
	})
</script>

<template>
	<div class="relative inline-flex items-center">
		<!-- Trigger Button (Icon Only) -->
		<button
			type="button"
			class="icon-btn"
			:aria-label="t('search.shortcut', 'Cari (Ctrl K)')"
			@click="openModal"
		>
			<span class="i-lucide-search text-base text-slate-600 dark:text-slate-300" />
		</button>

		<!-- Modal Dialog Backdrop -->
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
					class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-slate-950/60 backdrop-blur-sm"
					@click.self="closeModal"
				>
					<div class="w-full max-w-2xl rounded-bento bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-scale-in">
						<!-- Search Header -->
						<div class="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
							<span class="i-lucide-search text-xl text-brand-500" />
							<input
								ref="inputRef"
								v-model="searchQuery"
								type="search"
								class="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-g1 font-sans"
								:placeholder="t('search.placeholder', 'Ketik kata kunci pencarian...')"
							>
							<span v-if="status === 'loading'" class="i-lucide-loader-2 text-lg text-brand-500 animate-spin" />
							<button
								type="button"
								class="icon-btn text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
								aria-label="Tutup pencarian"
								@click="closeModal"
							>
								<span class="i-lucide-x text-lg" />
							</button>
						</div>

						<!-- Search Body / Results -->
						<div class="flex-1 overflow-y-auto p-4 space-y-5">
							<!-- Empty Query / Hints -->
							<div v-if="!searchQuery.trim()" class="py-8 text-center text-slate-400">
								<span class="i-lucide-command text-3xl mx-auto mb-2 block opacity-40" />
								<p class="text-g1 font-medium">{{ t('search.placeholder', 'Pencarian FTS5 Cepat') }}</p>
								<p class="text-meta mt-1">Cari artikel, studi kasus projek, atau dokumentasi.</p>
							</div>

							<!-- No Results -->
							<div v-else-if="results.length === 0 && status !== 'loading'" class="py-8 text-center text-slate-400">
								<span class="i-lucide-search-x text-3xl mx-auto mb-2 block opacity-40" />
								<p class="text-g1">{{ t('search.no_results', 'Tidak ditemukan hasil untuk') }} "<strong>{{ searchQuery }}</strong>"</p>
							</div>

							<!-- Results Lists -->
							<div v-else class="space-y-4">
								<!-- Articles Group -->
								<section v-if="articleResults.length > 0">
									<h3 class="text-meta uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-2 px-1 flex items-center gap-1.5">
										<span class="i-lucide-book-open text-xs text-brand-500" />
										{{ t('search.articles', 'Artikel') }} ({{ articleResults.length }})
									</h3>
									<ul class="space-y-1">
										<li v-for="item in articleResults" :key="item.id + (item.level || 0)">
											<NuxtLink
												:to="getTargetUrl(item)"
												class="focus-ring block p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700/60"
												@click="closeModal"
											>
												<div class="font-heading font-semibold text-g1 text-slate-900 dark:text-white" v-html="item.snippets?.title || item.title" />
												<div v-if="item.snippets?.content" class="text-meta text-slate-500 dark:text-slate-400 mt-1 line-clamp-2" v-html="item.snippets.content" />
											</NuxtLink>
										</li>
									</ul>
								</section>

								<!-- Projects Group -->
								<section v-if="projectResults.length > 0">
									<h3 class="text-meta uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-2 px-1 flex items-center gap-1.5">
										<span class="i-lucide-folder-git-2 text-xs text-blue-500" />
										{{ t('search.projects', 'Projek') }} ({{ projectResults.length }})
									</h3>
									<ul class="space-y-1">
										<li v-for="item in projectResults" :key="item.id + (item.level || 0)">
											<NuxtLink
												:to="getTargetUrl(item)"
												class="focus-ring block p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700/60"
												@click="closeModal"
											>
												<div class="font-heading font-semibold text-g1 text-slate-900 dark:text-white" v-html="item.snippets?.title || item.title" />
												<div v-if="item.snippets?.content" class="text-meta text-slate-500 dark:text-slate-400 mt-1 line-clamp-2" v-html="item.snippets.content" />
											</NuxtLink>
										</li>
									</ul>
								</section>

								<!-- Pages Group -->
								<section v-if="pageResults.length > 0">
									<h3 class="text-meta uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mb-2 px-1 flex items-center gap-1.5">
										<span class="i-lucide-file-text text-xs text-amber-500" />
										Halaman ({{ pageResults.length }})
									</h3>
									<ul class="space-y-1">
										<li v-for="item in pageResults" :key="item.id + (item.level || 0)">
											<NuxtLink
												:to="getTargetUrl(item)"
												class="focus-ring block p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700/60"
												@click="closeModal"
											>
												<div class="font-heading font-semibold text-g1 text-slate-900 dark:text-white" v-html="item.snippets?.title || item.title" />
												<div v-if="item.snippets?.content" class="text-meta text-slate-500 dark:text-slate-400 mt-1 line-clamp-2" v-html="item.snippets.content" />
											</NuxtLink>
										</li>
									</ul>
								</section>
							</div>
						</div>

						<!-- Search Footer -->
						<div class="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
							<span class="flex items-center gap-1">
								<span class="i-lucide-zap text-xs text-amber-400" /> SQLite FTS5 Engine
							</span>
							<span>Tekan <kbd class="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono">ESC</kbd> untuk menutup</span>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<style>
mark {
	background-color: rgba(43, 212, 181, 0.25);
	color: inherit;
	border-radius: 2px;
	padding: 0 2px;
}
.dark mark {
	background-color: rgba(43, 212, 181, 0.35);
	color: #5eeacf;
}
</style>
