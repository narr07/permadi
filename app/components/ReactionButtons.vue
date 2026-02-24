// app/components/ReactionButtons.vue
<script setup lang="ts">
const props = defineProps<{
  postId: number | null | undefined
}>()

const { counts, isLoading, isSubmitting, error, addReaction } = useReactions(props.postId)

const reactions = [
  { type: 'love' as const, icon: 'i-narr-love', label: 'Love', color: 'text-red-500' },
  { type: 'like' as const, icon: 'i-narr-lovefinger', label: 'Love Full', color: 'text-blue-500' },
  { type: 'sad' as const, icon: 'i-narr-like', label: 'Like', color: 'text-yellow-500' },
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
        <UButton
          v-for="reaction in reactions"
          :key="reaction.type"
          :disabled="isSubmitting"
          variant="subtle"
          @click="addReaction(reaction.type)"
        >
          <div
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
        </UButton>
      </div>
    </template>

    <!-- Fallback if no postId -->
    <p v-else class="text-sm text-gray-500">
      Reactions not available
    </p>
  </div>
</template>
