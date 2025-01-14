// stores/likes.ts
import { createPinia, defineStore } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'

export interface LikeResponse {
  success: boolean
  message?: string // Pesan ini opsional
}

const pinia = createPinia()
pinia.use(piniaPersistedstate)

export const useLikesStore = defineStore('likes', {
  state: () => ({
    likesCount: {} as Record<string, number>, // Menggunakan objek biasa
  }),

  actions: {
    async addLike(articleId: string) {
      const response: LikeResponse = await $fetch('/api/likes/add', {
        method: 'POST',
        body: { articleId },
      })

      if (response.success) {
        this.likesCount[articleId] = (this.likesCount[articleId] || 0) + 1
      }
      else {
        console.error(response.message)
      }
    },

    getLikes(articleId: string) {
      return this.likesCount[articleId] || 0
    },
  },

  persist: {
    storage: piniaPluginPersistedstate.cookies(),
  },
})
