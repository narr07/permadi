<script setup>
defineProps({ blok: Object })
const isOpen = ref(false)
</script>

<template>
  <UCard
    data-aos="zoom-in"
    data-aos-duration="300"
    class="rop-shadow-2 dark:drop-shadow-2gelap hover:bg-yellow hover:drop-shadow-1 transition bg-gray-100 dark:bg-gray-900 dark:ring-gray-800 ring-1 ring-gray-800  dark:hover:bg-gray-800   dark:hover:ring-permadi-500 text-center  "
    :ui="{
      body: {
        padding: 'px-2 py-2 sm:px-2 sm:py-2 ',
      },
    }"
  >
    <div v-editable="blok">
      <NuxtImg
        class="rounded aspect-square sm:w-48 object-cover bg-cover bg-permadi-300 dark:bg-permadi-700 h-[300px] md:h-[300px] md:w-full mx-auto ring-1 ring-permadi-800"
        :src="`${blok.image.filename}/m/500x0`"
        loading="lazy"
        height="500"
        width="500"
        :alt="blok.title"
        @click="isOpen = true"
      />
    </div>
    <div class="my-2">
      <h2 class="font-medium line-clamp-2">
        {{ blok.title }}
      </h2>
    </div>
  </UCard>
  <UModal
    v-model="isOpen"
    :ui="{
      inner: 'inset-4  ',
      // wrapper: 'z-20',
      container: ' items-center  ',
      padding: 'p-2 sm:p-0',
      ring: 'ring-1 ring-primary',
    }"
    :overlay="true"
  >
    <UCard
      :ui="{
        header: {
          padding: 'px-2 py-2 sm:px-2 sm:py-2 ',
        },
        footer: {
          padding: 'px-2 py-1.5 sm:px-2 sm:py-2 ',
        },
      }"
    >
      <div class="pb-4">
        <h3 class="text-center">
          {{ blok.title }}
        </h3>
      </div>
      <NuxtImg
        v-if="blok.image?.filename"
        height="500"
        width="500"
        :src="`${blok.image.filename}/m/1000x0`"
        :alt="blok.title"
        :title="blok.title"
        class="bg-contain object-contain sm:w-48 sm:h-48 lg:w-60 lg:h-60 mx-auto"
      />
      <template #footer>
        <div class="flex justify-between items-center">
          <UTooltip :popper="{ arrow: true }" text="Tools">
            <Icon :name="blok.tools" size="32" />
          </UTooltip>
          <div class="flex justify-end">
            <div class="flex items-center justify-end">
              <UButton
                aria-label="close"
                variant="outline"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isOpen = false"
              />
            </div>
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
  <!-- End Col -->
  <!-- End Team -->
</template>
