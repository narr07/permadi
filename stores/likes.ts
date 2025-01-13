// stores/likes.ts
import { defineStore } from 'pinia'
// stores/likes.ts

export interface LikeResponse {
  success: boolean
  message?: string // Pesan ini opsional
}

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

  persist: true, // Menambahkan opsi persist untuk menyimpan state
})
