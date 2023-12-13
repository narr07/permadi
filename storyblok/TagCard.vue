<!-- eslint-disable vue/valid-define-emits -->
<script setup>
defineProps({ tag: Object, slug: String })
const emit = defineEmits()
function handleClick() {
  emit('click', tag)
}
</script>

<template>
  <div class="w-full h-full" data-aos="zoom-in" data-aos-duration="200">
    <UCard class="cardHover p-1 h-full md:p-0" @click="handleClick">
      <div v-editable="tag">
        <div class="mt-4">
          <!-- Judul Tag -->
          <NuxtLink :to="localePath(`/${slug}`)">
            <h2 class="text-xl mb-2 line-clamp-2">
              {{ tag.label }}
            </h2>
          </NuxtLink>
        </div>
      </div>
    </UCard>
  </div>
</template>
