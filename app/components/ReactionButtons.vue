<script setup lang="ts">
const props = defineProps<{
  postId: number | null | undefined
}>()

const { counts, isLoading, isSubmitting, error, addReaction } = useReactions(props.postId)

const reactions = [
  { type: 'love' as const, icon: 'i-heroicons-heart', label: 'Love', color: 'text-red-500' },
  { type: 'like' as const, icon: 'i-heroicons-hand-thumb-up', label: 'Like', color: 'text-blue-500' },
  { type: 'sad' as const, icon: 'i-heroicons-face-frown', label: 'Sad', color: 'text-yellow-500' },
]
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Show only if postId is valid -->
    <template v-if="postId">
      <!-- Error message -->
      <p v-if="error" class="text-sm text-red-500">
        {{ error }}
      </p>

      <!-- Reaction buttons -->
      <div class="flex items-center gap-4">
        <button
          v-for="reaction in reactions"
          :key="reaction.type"
          :disabled="isSubmitting"
          class="group flex flex-col items-center gap-1 transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
          @click="addReaction(reaction.type)"
        >
          <div
            class="relative flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 transition-all group-hover:shadow-lg"
            :class="[isSubmitting ? 'animate-pulse' : '']"
          >
            <UIcon
              :name="reaction.icon"
              class="w-7 h-7 transition-colors"
              :class="reaction.color"
            />
          </div>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
            <span v-if="isLoading" class="animate-pulse">...</span>
            <span v-else>{{ counts[reaction.type] }}</span>
          </span>
        </button>
      </div>

      <p class="text-xs text-gray-500">
        Klik untuk memberikan reaksi!
      </p>
    </template>

    <!-- Fallback if no postId -->
    <p v-else class="text-sm text-gray-500">
      Reactions not available
    </p>
  </div>
</template>
