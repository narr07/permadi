export type ReactionType = 'love' | 'like' | 'sad'

export interface ReactionCounts {
  love: number
  like: number
  sad: number
}

export function useReactions(postId: number | null | undefined) {
  const counts = ref<ReactionCounts>({
    love: 0,
    like: 0,
    sad: 0,
  })

  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)

  // Fetch reaction counts
  async function fetchReactions() {
    if (!postId) return

    isLoading.value = true
    error.value = null

    try {
      const data = await $fetch<ReactionCounts>('/api/reactions', {
        query: { postId },
      })
      counts.value = data
    }
    catch (e: any) {
      error.value = e?.message || 'Failed to load reactions'
    }
    finally {
      isLoading.value = false
    }
  }

  // Add a reaction
  async function addReaction(type: ReactionType) {
    if (!postId || isSubmitting.value) return

    isSubmitting.value = true
    error.value = null

    // Optimistic update
    const previousCounts = { ...counts.value }
    counts.value[type]++

    try {
      const response = await $fetch<{ success: boolean, counts: ReactionCounts }>('/api/reactions', {
        method: 'POST',
        body: { postId, type },
      })
      counts.value = response.counts
    }
    catch (e: any) {
      // Rollback on error
      counts.value = previousCounts
      error.value = e?.data?.statusMessage || e?.message || 'Failed to add reaction'
    }
    finally {
      isSubmitting.value = false
    }
  }

  // Fetch on mount
  onMounted(() => {
    fetchReactions()
  })

  // Refetch when postId changes
  watch(() => postId, () => {
    fetchReactions()
  })

  return {
    counts,
    isLoading,
    isSubmitting,
    error,
    addReaction,
    fetchReactions,
  }
}
