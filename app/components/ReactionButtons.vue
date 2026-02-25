// app/components/ReactionButtons.vue
<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  postId: number | null | undefined
}>()

const { counts, isLoading, isSubmitting, error, addReaction } = useReactions(props.postId)

const reactions = [
  { type: 'love' as const, icon: 'i-narr-love', label: 'Love', color: 'text-red-500', hoverBg: 'hover:bg-red-50 dark:hover:bg-red-950/30' },
  { type: 'like' as const, icon: 'i-narr-lovefinger', label: 'Love Full', color: 'text-blue-500', hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-950/30' },
  { type: 'sad' as const, icon: 'i-narr-like', label: 'Like', color: 'text-yellow-500', hoverBg: 'hover:bg-yellow-50 dark:hover:bg-yellow-950/30' },
]
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <!-- Show only if postId is valid -->
    <template v-if="postId">
      <!-- Error message -->
      <p v-if="error" class="text-xs text-red-500">
        {{ error }}
      </p>

      <!-- Label -->
      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
        {{ t('reaction_label') || 'Beri Reaksi' }}
      </p>

      <!-- Reaction buttons -->
      <div class="flex items-center gap-2">
        <button
          v-for="reaction in reactions"
          :key="reaction.type"
          :disabled="isSubmitting"
          class="reaction-btn group"
          :class="[reaction.hoverBg, isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer']"
          @click="addReaction(reaction.type)"
        >
          <div
            class="transition-transform duration-200 group-hover:scale-125"
            :class="[isSubmitting ? 'animate-pulse' : '']"
          >
            <UIcon
              :name="reaction.icon"
              class="w-8 h-8 transition-colors duration-200"
              :class="reaction.color"
            />
          </div>
          <span class="text-sm font-semibold tabular-nums text-gray-600 dark:text-gray-400 transition-colors group-hover:text-gray-900 dark:group-hover:text-gray-200">
            <span v-if="isLoading" class="animate-pulse">···</span>
            <span v-else>{{ counts[reaction.type] }}</span>
          </span>
        </button>
      </div>
    </template>

    <!-- Fallback if no postId -->
    <p v-else class="text-sm text-gray-500">
      Reactions not available
    </p>
  </div>
</template>

<style scoped>
.reaction-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid transparent;
  background: transparent;
  transition: all 0.2s ease;
}

.reaction-btn:hover:not(:disabled) {
  border-color: rgba(156, 163, 175, 0.3);
}

.reaction-btn:active:not(:disabled) {
  transform: scale(0.95);
}
</style>
