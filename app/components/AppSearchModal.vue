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
	<div class="search-wrapper">
		<!-- Trigger button di header -->
		<button
			type="button"
			class="search-trigger"
			:aria-label="t('search.shortcut')"
			@click="openModal"
		>
			<span class="search-icon">🔍</span>
			<span class="search-label">{{ t('search.placeholder') }}</span>
			<kbd class="search-kbd">Ctrl K</kbd>
		</button>

		<!-- Modal overlay -->
		<Teleport to="body">
			<Transition name="fade">
				<div
					v-if="isOpen"
					class="search-modal-backdrop"
					@click.self="closeModal"
				>
					<div
						class="search-modal"
						role="dialog"
						aria-modal="true"
					>
						<div class="search-modal-header">
							<span class="modal-search-icon">🔍</span>
							<input
								ref="inputRef"
								v-model="searchQuery"
								type="search"
								class="search-modal-input"
								:placeholder="t('search.placeholder')"
							/>
							<span
								v-if="status === 'loading'"
								class="status-indicator"
							>
								⏳
							</span>
							<button
								type="button"
								class="search-close-btn"
								@click="closeModal"
							>
								✕
							</button>
						</div>

						<div class="search-modal-body">
							<!-- Hasil Pencarian Kosong -->
							<div
								v-if="searchQuery.trim() && results.length === 0 && status !== 'loading'"
								class="search-empty"
							>
								<p>{{ t('search.no_results') }} "<strong>{{ searchQuery }}</strong>"</p>
							</div>

							<!-- Prompt Awal -->
							<div
								v-else-if="!searchQuery.trim()"
								class="search-hints"
							>
								<p class="hints-title">{{ t('search.placeholder') }}</p>
								<p class="hints-desc">{{ t('search.close') }}</p>
							</div>

							<!-- Daftar Hasil Pencarian (FTS5 + BM25 Ranked) -->
							<div
								v-else
								class="search-results"
							>
								<!-- Grup Artikel Blog -->
								<section
									v-if="articleResults.length > 0"
									class="result-group"
								>
									<h3 class="group-title">{{ t('search.articles') }} ({{ articleResults.length }})</h3>
									<ul class="result-list">
										<li
											v-for="item in articleResults"
											:key="item.id + (item.level || 0)"
											class="result-item"
										>
											<NuxtLink
												:to="getTargetUrl(item)"
												class="result-link"
												@click="closeModal"
											>
												<div
													class="result-title"
													v-html="item.snippets?.title || item.title"
												/>
												<div
													v-if="item.snippets?.content"
													class="result-snippet"
													v-html="item.snippets.content"
												/>
												<div
													v-else-if="item.content"
													class="result-desc"
												>
													{{ item.content.slice(0, 120) }}...
												</div>
											</NuxtLink>
										</li>
									</ul>
								</section>

								<!-- Grup Projek -->
								<section
									v-if="projectResults.length > 0"
									class="result-group"
								>
									<h3 class="group-title">{{ t('search.projects') }} ({{ projectResults.length }})</h3>
									<ul class="result-list">
										<li
											v-for="item in projectResults"
											:key="item.id + (item.level || 0)"
											class="result-item"
										>
											<NuxtLink
												:to="getTargetUrl(item)"
												class="result-link"
												@click="closeModal"
											>
												<div
													class="result-title"
													v-html="item.snippets?.title || item.title"
												/>
												<div
													v-if="item.snippets?.content"
													class="result-snippet"
													v-html="item.snippets.content"
												/>
											</NuxtLink>
										</li>
									</ul>
								</section>

								<!-- Grup Halaman -->
								<section
									v-if="pageResults.length > 0"
									class="result-group"
								>
									<h3 class="group-title">Halaman ({{ pageResults.length }})</h3>
									<ul class="result-list">
										<li
											v-for="item in pageResults"
											:key="item.id + (item.level || 0)"
											class="result-item"
										>
											<NuxtLink
												:to="getTargetUrl(item)"
												class="result-link"
												@click="closeModal"
											>
												<div
													class="result-title"
													v-html="item.snippets?.title || item.title"
												/>
												<div
													v-if="item.snippets?.content"
													class="result-snippet"
													v-html="item.snippets.content"
												/>
											</NuxtLink>
										</li>
									</ul>
								</section>
							</div>
						</div>

						<div class="search-modal-footer">
							<span class="engine-badge">⚡ SQLite FTS5 Engine</span>
							<span>{{ t('search.close') }}</span>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>

<style scoped>
	.search-trigger {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.35rem 0.75rem;
		background: #f4f4f5;
		border: 1px solid #e4e4e7;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.85rem;
		color: #52525b;
		transition: all 0.2s ease;
	}

	.search-trigger:hover {
		border-color: #a1a1aa;
		background: #ececee;
	}

	.search-icon {
		font-size: 0.8rem;
	}

	.search-label {
		color: #71717a;
	}

	.search-kbd {
		background: #ffffff;
		border: 1px solid #d4d4d8;
		border-radius: 4px;
		padding: 0.1rem 0.35rem;
		font-size: 0.75rem;
		font-family: inherit;
		color: #71717a;
	}

	/* Modal Backdrop & Container */
	.search-modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.45);
		backdrop-filter: blur(4px);
		z-index: 9999;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding-top: 10vh;
	}

	.search-modal {
		background: #ffffff;
		width: 90%;
		max-width: 620px;
		max-height: 80vh;
		border-radius: 12px;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
		border: 1px solid #e4e4e7;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.search-modal-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.85rem 1.25rem;
		border-bottom: 1px solid #e4e4e7;
	}

	.modal-search-icon {
		font-size: 1.1rem;
		color: #71717a;
	}

	.search-modal-input {
		flex: 1;
		border: none;
		outline: none;
		font-size: 1rem;
		color: #18181b;
		background: transparent;
	}

	.status-indicator {
		font-size: 0.85rem;
	}

	.search-close-btn {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1.1rem;
		color: #71717a;
		padding: 0.25rem;
	}

	.search-modal-body {
		padding: 1rem 1.25rem;
		overflow-y: auto;
		max-height: 55vh;
	}

	.search-empty,
	.search-hints {
		text-align: center;
		padding: 2rem 1rem;
		color: #71717a;
	}

	.hints-title {
		font-weight: 600;
		color: #27272a;
		margin-bottom: 0.25rem;
	}

	.hints-desc {
		font-size: 0.85rem;
	}

	.result-group {
		margin-bottom: 1.25rem;
	}

	.group-title {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #71717a;
		margin-bottom: 0.5rem;
	}

	.result-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.result-link {
		display: block;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		text-decoration: none;
		color: inherit;
		background: #fbfbfb;
		border: 1px solid #f0f0f0;
		transition: all 0.2s ease;
	}

	.result-link:hover {
		background: #f4f4f5;
		border-color: #d4d4d8;
	}

	.result-title {
		font-weight: 600;
		color: #18181b;
		margin-bottom: 0.25rem;
	}

	.result-title :deep(mark) {
		background: #fef08a;
		color: #854d0e;
		padding: 0 0.15rem;
		border-radius: 2px;
	}

	.result-snippet {
		font-size: 0.825rem;
		color: #3f3f46;
		background: #f4f4f5;
		padding: 0.35rem 0.6rem;
		border-radius: 4px;
		margin-top: 0.25rem;
		line-height: 1.45;
		border-left: 2px solid #18181b;
	}

	.result-snippet :deep(mark) {
		background: #fef08a;
		color: #854d0e;
		font-weight: 600;
		padding: 0 0.15rem;
		border-radius: 2px;
	}

	.result-desc {
		font-size: 0.85rem;
		color: #52525b;
		margin-top: 0.25rem;
		line-height: 1.4;
	}

	.search-modal-footer {
		padding: 0.6rem 1.25rem;
		background: #fafafa;
		border-top: 1px solid #e4e4e7;
		font-size: 0.75rem;
		color: #71717a;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.engine-badge {
		font-weight: 500;
		color: #52525b;
	}

	/* Transitions */
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.15s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>
