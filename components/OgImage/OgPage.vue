<script lang="ts" setup>
defineOptions({
  inheritAttrs: false
})
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false,
    default: ''
  }
})
</script>
<template>
  <div class="w-full h-full flex flex-col justify-between items-start bg-[#023230] p-20 pt-26 pb-16">
    <div
      style="position: absolute;width: 1156px;height: 1000px;left: -215px;top: -337px;background: radial-gradient(50% 50% at 50% 50%, #ABD1C6 0%, rgba(0, 220, 130, 0) 100%);filter: blur(180.5px);opacity: 0.5;"
    />
    <div>
      <h1 class="text-8xl mb-4 text-[#F9BC60] flex items-center">
        <span>{{ title }}</span>
        <img v-if="image" :src="image" class="h-20 w-20 rounded ml-8">
      </h1>
      <p class="text-gray-200 leading-tight pr-10" :class="description?.length > 100 ? 'text-3xlxl' : 'text-5xl'">
        {{ description }}
      </p>
      <Logo class="w-[60px] h-[60px] " />
    </div>
  </div>
</template>
<style scoped>
._gradient {
}
</style>
