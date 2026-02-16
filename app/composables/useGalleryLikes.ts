// app/composables/useGalleryLikes.ts
// Composable for fetching and adding gallery likes using image as identifier

export function useGalleryLikes() {
  const toast = useToast()
  const likeCounts = ref<Record<string, number>>({})
  const isLoading = ref(false)
  const isSubmitting = ref<Record<string, boolean>>({})

  // Fetch like counts for multiple gallery items at once
  async function fetchLikes(images: string[]) {
    if (images.length === 0)
      return

    isLoading.value = true

    try {
      const data = await $fetch<Record<string, { count: number }>>('/api/gallery-likes/batch', {
        query: { images: images.join(',') },
      })
      for (const [image, info] of Object.entries(data)) {
        likeCounts.value[image] = info.count
      }
    }
    catch {
      // Silently fail — likes are non-critical
    }
    finally {
      isLoading.value = false
    }
  }

  // Add a like to a gallery item
  async function addLike(image: string) {
    if (isSubmitting.value[image])
      return

    isSubmitting.value[image] = true

    // Optimistic update
    const previousCount = likeCounts.value[image] ?? 0
    likeCounts.value[image] = previousCount + 1

    try {
      const response = await $fetch<{ image: string, count: number }>('/api/gallery-likes', {
        method: 'POST',
        body: { image },
      })
      likeCounts.value[image] = response.count
    }
    catch (e: any) {
      // Rollback on error
      likeCounts.value[image] = previousCount
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
      isSubmitting.value[image] = false
    }
  }

  function getCount(image: string): number {
    return likeCounts.value[image] ?? 0
  }

  function isLikeSubmitting(image: string): boolean {
    return isSubmitting.value[image] ?? false
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
