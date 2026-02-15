// app/composables/useGalleryLikes.ts
// Composable for fetching and toggling gallery likes in batch

interface GalleryLikeData {
  count: number
  liked: boolean
}

export function useGalleryLikes() {
  const likes = ref<Record<string, GalleryLikeData>>({})
  const isLoading = ref(false)
  const togglingStems = ref<Set<string>>(new Set())

  // Fetch likes for multiple gallery items at once
  async function fetchLikes(stems: string[]) {
    if (stems.length === 0)
      return

    isLoading.value = true

    try {
      const data = await $fetch<Record<string, GalleryLikeData>>('/api/gallery-likes/batch', {
        query: { stems: stems.join(',') },
      })
      likes.value = { ...likes.value, ...data }
    }
    catch {
      // Silently fail — likes are non-critical
    }
    finally {
      isLoading.value = false
    }
  }

  // Toggle like on a gallery item
  async function toggleLike(stem: string) {
    if (togglingStems.value.has(stem))
      return

    togglingStems.value.add(stem)

    // Optimistic update
    const previous = likes.value[stem] ?? { count: 0, liked: false }
    likes.value[stem] = {
      count: previous.liked ? Math.max(0, previous.count - 1) : previous.count + 1,
      liked: !previous.liked,
    }

    try {
      const response = await $fetch<{ stem: string, count: number, liked: boolean }>('/api/gallery-likes', {
        method: 'POST',
        body: { stem },
      })
      likes.value[stem] = { count: response.count, liked: response.liked }
    }
    catch {
      // Rollback on error
      likes.value[stem] = previous
    }
    finally {
      togglingStems.value.delete(stem)
    }
  }

  function getCount(stem: string): number {
    return likes.value[stem]?.count ?? 0
  }

  function isLiked(stem: string): boolean {
    return likes.value[stem]?.liked ?? false
  }

  function isToggling(stem: string): boolean {
    return togglingStems.value.has(stem)
  }

  return {
    likes,
    isLoading,
    fetchLikes,
    toggleLike,
    getCount,
    isLiked,
    isToggling,
  }
}
