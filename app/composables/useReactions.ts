// app/composables/useReactions.ts
export type ReactionType = 'love' | 'like' | 'sad'

export interface ReactionCounts {
  love: number
  like: number
  sad: number
}

export function useReactions(postId: number | null | undefined) {
  const toast = useToast()
  const counts = ref<ReactionCounts>({
    love: 0,
    like: 0,
    sad: 0,
  })

  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)

  const { t } = useI18n()

  // Fetch reaction counts
  async function fetchReactions() {
    if (!postId)
      return

    isLoading.value = true
    error.value = null

    try {
      const data = await $fetch<ReactionCounts>('/api/reactions', {
        query: { postId },
      })
      counts.value = data
    }
    catch (e: any) {
      error.value = e?.message || t('toast.load_reactions_error')
    }
    finally {
      isLoading.value = false
    }
  }

  // Add a reaction
  async function addReaction(type: ReactionType) {
    if (!postId || isSubmitting.value)
      return

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
      const statusCode = e?.response?.status || e?.statusCode
      if (statusCode === 429) {
        toast.add({
          title: t('toast.limit_reached'),
          description: t('toast.reaction_limit_msg'),
          icon: 'i-narr-warning',
          color: 'warning',
        })
      }
      else {
        toast.add({
          title: t('toast.error_title'),
          description: t('toast.reaction_error_msg'),
          icon: 'i-narr-error',
          color: 'error',
        })
      }
      error.value = null
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
