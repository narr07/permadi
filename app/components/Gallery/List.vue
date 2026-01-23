<!-- eslint-disable antfu/top-level-function -->
<script setup lang="ts">
const { locale } = useI18n()
const isOpen = ref(false)
const selectedImage = ref<any>(null)

const { data: images } = await useAsyncData(`gallery-list-${locale.value}`, () => {
  return queryCollection(`${locale.value}_gallery`)
    .all()
})

const openLightbox = (image: any) => {
  selectedImage.value = image
  isOpen.value = true
}
</script>

<template>
  <div class="gallery-list-container my-12">
    <div v-if="images && images.length > 0">
      <UPageColumns>
        <div
          v-for="image in images"
          :key="image.id"
          class="relative group rounded-2xl overflow-hidden cursor-zoom-in transition-all duration-500 hover:ring-4 hover:ring-primary-500/30"
          @click="openLightbox(image)"
        >
          <NuxtImg
            :src="image.imageUrl"
            :alt="image.title"
            class="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
            :style="{ aspectRatio: image.aspectRatio || '1/1' }"
            loading="lazy"
          />

          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <p v-if="image.category" class="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1">
              {{ $t(`categories.${image.category}`) }}
            </p>
            <h4 class="text-white font-bold text-lg">
              {{ image.title }}
            </h4>
          </div>
        </div>
      </UPageColumns>
    </div>

    <!-- Lightbox Modal -->
    <UModal v-model="isOpen" :transition="false" class="sm:max-w-4xl">
      <template #content>
        <div v-if="selectedImage" class="relative group">
          <NuxtImg
            :src="selectedImage.imageUrl"
            :alt="selectedImage.title"
            class="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          />

          <div class="absolute -bottom-16 left-0 right-0 text-center">
            <h3 class="text-white text-xl font-bold mb-1">
              {{ selectedImage.title }}
            </h3>
            <p v-if="selectedImage.category" class="text-primary-400 text-sm font-medium">
              {{ $t(`categories.${selectedImage.category}`) }}
            </p>
          </div>

          <UButton
            color="neutral"
            variant="solid"
            icon="i-heroicons-x-mark"
            class="absolute -top-12 right-0 md:-right-12 rounded-full text-white bg-white/10 hover:bg-white/20 backdrop-blur-md"
            @click="isOpen = false"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<style scoped>
</style>
