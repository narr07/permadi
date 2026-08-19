import { useDebounceFn } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ReactionType = 'CLAPPING' | 'THINKING' | 'AMAZED'
export const MAX_REACTION_LIMIT = 20

export interface ReactionsDetail {
	CLAPPING: number
	THINKING: number
	AMAZED: number
}

export interface ArticleReactionsState {
	views: number
	shares: number
	total: ReactionsDetail
	user: ReactionsDetail
	sections: Record<string, ReactionsDetail>
	isLoading: boolean
}

export const useReactionsStore = defineStore('reactions', () => {
	const articles = ref<Record<string, ArticleReactionsState>>({})
	const pendingBatches = ref<Record<string, Record<ReactionType, { count: number, section: string }>>>({})
	const viewedArticles = ref<Record<string, boolean>>({})

	function getArticleState(slug: string): ArticleReactionsState {
		if (!articles.value[slug]) {
			articles.value[slug] = {
				views: 0,
				shares: 0,
				total: { CLAPPING: 0, THINKING: 0, AMAZED: 0 },
				user: { CLAPPING: 0, THINKING: 0, AMAZED: 0 },
				sections: {},
				isLoading: false,
			}
		}
		return articles.value[slug]
	}

	async function fetchReactions(slug: string) {
		const state = getArticleState(slug)
		state.isLoading = true

		try {
			const data = await $fetch<{
				meta: {
					views: number
					shares: number
					reactions: number
					reactionsDetail: ReactionsDetail
				}
				metaUser: { reactionsDetail: ReactionsDetail }
				metaSection: Record<string, { reactionsDetail: ReactionsDetail }>
			}>(`/api/insight/${slug}`)

			if (data) {
				state.views = data.meta.views || 0
				state.shares = data.meta.shares || 0
				state.total = { ...data.meta.reactionsDetail }
				state.user = { ...data.metaUser.reactionsDetail }

				const parsedSections: Record<string, ReactionsDetail> = {}
				for (const [secKey, secVal] of Object.entries(data.metaSection || {})) {
					parsedSections[secKey] = { ...secVal.reactionsDetail }
				}
				state.sections = parsedSections
			}
		}
		catch (err) {
			console.error(`Failed to fetch insight for ${slug}:`, err)
		}
		finally {
			state.isLoading = false
		}
	}

	async function recordView(slug: string) {
		if (!slug || viewedArticles.value[slug] || !import.meta.client)
			return

		viewedArticles.value[slug] = true
		try {
			const res = await $fetch<{ success: boolean, isNewView?: boolean }>(`/api/insight/${slug}/view`, {
				method: 'POST',
			})
			if (res?.isNewView) {
				const state = getArticleState(slug)
				state.views++
			}
		}
		catch (err) {
			console.error(`Failed to record view for ${slug}:`, err)
		}
	}

	async function recordShare(slug: string, network = 'unknown') {
		if (!slug || !import.meta.client)
			return

		const state = getArticleState(slug)
		// Optimistic update
		state.shares++

		try {
			await $fetch(`/api/insight/${slug}/share`, {
				method: 'POST',
				body: { network },
			})
		}
		catch (err) {
			console.error(`Failed to record share for ${slug}:`, err)
		}
	}

	// Debounced worker to send batched reactions to the server
	const sendBatchToServer = useDebounceFn(async (slug: string) => {
		const slugPending = pendingBatches.value[slug]
		if (!slugPending)
			return

		const typesToSend = Object.keys(slugPending) as ReactionType[]
		for (const type of typesToSend) {
			const batch = slugPending[type]
			if (!batch || batch.count <= 0)
				continue

			const payload = {
				type,
				section: batch.section || 'general',
				count: batch.count,
			}

			delete slugPending[type]

			try {
				await $fetch(`/api/reactions/${slug}`, {
					method: 'POST',
					body: payload,
				})
			}
			catch (err) {
				console.error(`Failed to submit batch reaction for ${slug}:`, err)
			}
		}
	}, 900)

	function addReaction(slug: string, type: ReactionType, section = 'general'): boolean {
		const state = getArticleState(slug)

		// Check session quota limit
		if (state.user[type] >= MAX_REACTION_LIMIT) {
			return false
		}

		// 1. Optimistic Update
		state.total[type]++
		state.user[type]++

		if (!state.sections[section]) {
			state.sections[section] = { CLAPPING: 0, THINKING: 0, AMAZED: 0 }
		}
		state.sections[section][type]++

		// 2. Queue into batch buffer
		if (!pendingBatches.value[slug]) {
			pendingBatches.value[slug] = {} as any
		}
		if (!pendingBatches.value[slug][type]) {
			pendingBatches.value[slug][type] = { count: 0, section }
		}
		pendingBatches.value[slug][type].count++
		pendingBatches.value[slug][type].section = section

		// 3. Trigger debounced submission
		sendBatchToServer(slug)

		return true
	}

	return {
		articles,
		getArticleState,
		fetchReactions,
		recordView,
		recordShare,
		addReaction,
	}
})
