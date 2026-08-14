<script setup lang="ts">
	const { locale, t } = useI18n()
	const pageCollection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
	const projectCollection = computed(() => (locale.value === 'id' ? 'projek_id' : 'projek_en'))
	const currentPath = computed(() => (locale.value === 'id' ? '/id/projek' : '/en/projects'))

	const searchQuery = ref('')
	const selectedTag = ref<string>('ALL')

	const { data: page } = await useAsyncData(
		() => 'projects-index-' + locale.value,
		() => queryCollection(pageCollection.value).path(currentPath.value).first(),
		{ watch: [locale] }
	)

	const { data: projects } = await useAsyncData(
		() => 'projects-list-' + locale.value,
		() => queryCollection(projectCollection.value).all(),
		{ watch: [locale] }
	)

	function cleanSlug(pathStr: string): string {
		const parts = pathStr.split('/')
		const lastPart = parts[parts.length - 1] || ''
		return lastPart.replace(/^\d+\./, '')
	}

	const allTags = computed(() => {
		if (!projects.value) return []
		const tagSet = new Set<string>()
		for (const item of projects.value) {
			if (Array.isArray(item.tags)) {
				item.tags.forEach((tag: string) => tagSet.add(tag))
			}
		}
		return Array.from(tagSet)
	})

	const filteredProjects = computed(() => {
		if (!projects.value) return []
		const section = locale.value === 'id' ? 'projek' : 'projects'
		return projects.value.filter((item: any) => {
			const q = searchQuery.value.trim().toLowerCase()
			const matchesQuery = !q ||
				item.title?.toLowerCase().includes(q) ||
				item.description?.toLowerCase().includes(q) ||
				item.tags?.some((tag: string) => tag.toLowerCase().includes(q)) ||
				item.plainText?.toLowerCase().includes(q)

			const matchesTag = selectedTag.value === 'ALL' || item.tags?.includes(selectedTag.value)
			return matchesQuery && matchesTag
		}).map((item: any) => ({
			...item,
			url: `/${locale.value}/${section}/${item.slug || cleanSlug(item.path)}`,
		}))
	})

	if (!page.value) {
		throw createError({
			statusCode: 404,
			statusMessage: 'Page not found',
		})
	}

	useSeoMeta({
		title: computed(() => page.value?.title),
		description: computed(() => page.value?.description),
	})
</script>

<template>
	<main class="page-container">
		<header class="project-header">
			<h1>{{ page?.title }}</h1>
			<p class="project-desc">{{ page?.description }}</p>
		</header>

		<!-- In-Page Live Search & Filter -->
		<div class="search-box">
			<div class="input-wrapper">
				<span class="search-ico">🔍</span>
				<input
					v-model="searchQuery"
					type="search"
					class="search-input"
					:placeholder="t('search.search_projects')"
				/>
				<button
					v-if="searchQuery"
					type="button"
					class="clear-btn"
					@click="searchQuery = ''"
				>
					✕
				</button>
			</div>

			<!-- Tag Filter Pills -->
			<div
				v-if="allTags.length > 0"
				class="tag-filters"
			>
				<button
					type="button"
					class="tag-pill"
					:class="{ active: selectedTag === 'ALL' }"
					@click="selectedTag = 'ALL'"
				>
					{{ t('search.all_tags') }}
				</button>
				<button
					v-for="tag in allTags"
					:key="tag"
					type="button"
					class="tag-pill"
					:class="{ active: selectedTag === tag }"
					@click="selectedTag = tag"
				>
					#{{ tag }}
				</button>
			</div>
		</div>

		<!-- Projects Grid -->
		<section class="projects-section">
			<div
				v-if="filteredProjects.length === 0"
				class="no-results"
			>
				<p>{{ t('search.no_results') }} <strong v-if="searchQuery">"{{ searchQuery }}"</strong></p>
			</div>

			<ul
				v-else
				class="projects-list"
			>
				<li
					v-for="item in filteredProjects"
					:key="item.url"
					class="project-card"
				>
					<NuxtLink
						:to="item.url"
						class="project-link"
					>
						<div class="project-top">
							<h2 class="project-title">{{ item.title }}</h2>
							<span v-if="item.featured" class="featured-badge">⭐ Featured</span>
						</div>
						<p class="project-summary">{{ item.description }}</p>
						<div class="project-footer">
							<div
								v-if="item.tags?.length"
								class="project-tags"
							>
								<span
									v-for="tItem in item.tags"
									:key="tItem"
									class="mini-tag"
								>
									#{{ tItem }}
								</span>
							</div>
						</div>
					</NuxtLink>
				</li>
			</ul>
		</section>
	</main>
</template>

<style scoped>
	.page-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		line-height: 1.6;
	}

	.project-header {
		margin-bottom: 2rem;
	}

	.project-header h1 {
		font-size: 2.25rem;
		font-weight: 700;
		color: #18181b;
		margin-bottom: 0.5rem;
		letter-spacing: -0.02em;
	}

	.project-desc {
		font-size: 1.1rem;
		color: #71717a;
		line-height: 1.5;
	}

	.search-box {
		margin-bottom: 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		background: #f4f4f5;
		border: 1px solid #e4e4e7;
		border-radius: 8px;
		padding: 0.6rem 1rem;
		gap: 0.5rem;
		transition: border-color 0.2s ease;
	}

	.input-wrapper:focus-within {
		border-color: #18181b;
		background: #ffffff;
	}

	.search-ico {
		font-size: 1rem;
		color: #71717a;
	}

	.search-input {
		flex: 1;
		border: none;
		background: transparent;
		outline: none;
		font-size: 0.95rem;
		color: #18181b;
	}

	.clear-btn {
		background: none;
		border: none;
		cursor: pointer;
		color: #71717a;
		font-size: 0.9rem;
	}

	.tag-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag-pill {
		background: #f4f4f5;
		border: 1px solid #e4e4e7;
		padding: 0.25rem 0.65rem;
		border-radius: 20px;
		font-size: 0.8rem;
		color: #52525b;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tag-pill:hover {
		border-color: #a1a1aa;
		background: #e4e4e7;
	}

	.tag-pill.active {
		background: #18181b;
		color: #ffffff;
		border-color: #18181b;
		font-weight: 500;
	}

	.projects-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.project-card {
		background: #ffffff;
		border: 1px solid #e4e4e7;
		border-radius: 12px;
		transition: all 0.2s ease;
		overflow: hidden;
	}

	.project-card:hover {
		border-color: #a1a1aa;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		transform: translateY(-2px);
	}

	.project-link {
		display: block;
		padding: 1.25rem 1.5rem;
		text-decoration: none;
		color: inherit;
	}

	.project-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.project-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #18181b;
		line-height: 1.35;
		margin: 0;
	}

	.featured-badge {
		font-size: 0.75rem;
		background: #fef3c7;
		color: #92400e;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
		font-weight: 600;
	}

	.project-summary {
		font-size: 0.95rem;
		color: #52525b;
		margin-bottom: 0.75rem;
		line-height: 1.5;
	}

	.project-footer {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: #71717a;
	}

	.project-tags {
		display: flex;
		gap: 0.4rem;
	}

	.mini-tag {
		background: #f4f4f5;
		padding: 0.1rem 0.4rem;
		border-radius: 4px;
		font-size: 0.75rem;
	}

	.no-results {
		text-align: center;
		padding: 3rem 1rem;
		color: #71717a;
		background: #fafafa;
		border-radius: 8px;
		border: 1px dashed #e4e4e7;
	}
</style>
