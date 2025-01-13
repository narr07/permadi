// stores/likes.ts
import { createPinia, defineStore } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'
// stores/likes.ts

export interface LikeResponse {
  success: boolean
  message?: string // Pesan ini opsional
}

const pinia = createPinia()
pinia.use(piniaPersistedstate)

export const useLikesStore = defineStore('likes', {
  state: () => ({
    likesCount: new Map<string, number>(), // Menyimpan jumlah likes berdasarkan articleId
  }),

  actions: {
    async addLike(articleId: string) {
      const response: LikeResponse = await $fetch('/api/likes/add', {
        method: 'POST',
        body: { articleId },
      })

      if (response.success) {
        this.likesCount.set(articleId, (this.likesCount.get(articleId) || 0) + 1)
      }
      else {
        console.error(response.message)
      }
    },

    getLikes(articleId: string) {
      return this.likesCount.get(articleId) || 0
    },
  },

  persist: {
    storage: piniaPluginPersistedstate.cookies(),
  },
})
