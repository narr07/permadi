// app/composables/useGalleryLikes.ts
// Composable for fetching and adding gallery likes (no unlike, same as blog reactions)

export function useGalleryLikes() {
  const toast = useToast()
  const likeCounts = ref<Record<string, number>>({})
  const isLoading = ref(false)
  const isSubmitting = ref<Record<string, boolean>>({})

  // Fetch like counts for multiple gallery items at once
  async function fetchLikes(stems: string[]) {
    if (stems.length === 0)
      return

    isLoading.value = true

    try {
      const data = await $fetch<Record<string, { count: number }>>('/api/gallery-likes/batch', {
        query: { stems: stems.join(',') },
      })
      for (const [stem, info] of Object.entries(data)) {
        likeCounts.value[stem] = info.count
      }
    }
    catch {
      // Silently fail — likes are non-critical
    }
    finally {
      isLoading.value = false
    }
  }

  // Add a like to a gallery item (no unlike)
  async function addLike(stem: string) {
    if (isSubmitting.value[stem])
      return

    isSubmitting.value[stem] = true

    // Optimistic update
    const previousCount = likeCounts.value[stem] ?? 0
    likeCounts.value[stem] = previousCount + 1

    try {
      const response = await $fetch<{ stem: string, count: number }>('/api/gallery-likes', {
        method: 'POST',
        body: { stem },
      })
      likeCounts.value[stem] = response.count
    }
    catch (e: any) {
      // Rollback on error
      likeCounts.value[stem] = previousCount
      const statusCode = e?.response?.status || e?.statusCode
      if (statusCode === 429) {
        toast.add({
          title: 'Batas tercapai',
          description: 'Kamu sudah mencapai batas maksimal like. Coba lagi nanti ya!',
          icon: 'i-heroicons-exclamation-triangle',
          color: 'warning',
        })
      }
      else {
        toast.add({
          title: 'Gagal',
          description: 'Tidak bisa memberikan like. Coba lagi.',
          icon: 'i-heroicons-x-circle',
          color: 'error',
        })
      }
    }
    finally {
      isSubmitting.value[stem] = false
    }
  }

  function getCount(stem: string): number {
    return likeCounts.value[stem] ?? 0
  }

  function isLikeSubmitting(stem: string): boolean {
    return isSubmitting.value[stem] ?? false
  }

  return {
    likeCounts,
    isLoading,
    fetchLikes,
    addLike,
    getCount,
    isLikeSubmitting,
  }
}
