<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{ title?: string, description?: string, headline?: string }>(), {
  title: 'title',
  description: 'description',
  headline: 'permadi.dev - Dinar Permadi Yusup',
})

const title = computed(() => {
  const titleStr = String(props.title || '')
  const trimmedTitle = titleStr.slice(0, 60)
  return titleStr.length > 60 ? `${trimmedTitle}...` : trimmedTitle
})

const description = computed(() => {
  const descriptionStr = String(props.description || '')
  const trimmedDescription = descriptionStr.slice(0, 200)
  return descriptionStr.length > 200 ? `${trimmedDescription}...` : trimmedDescription
})
</script>

<template>
  <div>
    <svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#031e1c;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2b6964;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)" />
    </svg>
    <div
      class="w-full h-full flex flex-col justify-center "
      style="background-size: 50px 50px; background-image: linear-gradient(to right, rgba(229, 231, 235, 0.1) 1px, transparent 0.4px), linear-gradient(to bottom, rgba(229, 231, 235, 0.1) 1px, transparent 0.4px);"
    >
      <div class="w-[900px] pl-[100px] ">
        <p v-if="headline" style="font-family: 'Snomal'" class="text-[24px] text-[rgb(171,209,198)] mb-4 font-semibold">
          {{ headline }}
        </p>
        <h1
          v-if="title"
          style="font-family: 'Sblack'" class="w-[900px] m-0  leading-[1] font-black text-[70px] mb-4 text-[rgb(249,188,96)] flex items-center"
        >
          <span>{{ title }}</span>
        </h1>
        <p v-if="description" style="font-family: 'Snomal'" class="text-[32px] text-[rgb(171,209,198)] font-normal leading-tight">
          {{ description }}
        </p>
      </div>
      <div class="absolute top-5 right-[100px]">
        <div class="flex flex-row justify-center items-center  rounded-lg">
          <svg width="75" height="75" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_24_170)">
              <path d="M250 500C388.071 500 500 388.071 500 250C500 111.929 388.071 0 250 0C111.929 0 0 111.929 0 250C0 388.071 111.929 500 250 500Z" fill="#ACD1C6" />
              <path d="M250.3 0.0999756C112.2 0.0999756 0.300049 112 0.300049 250.1C0.300049 388.2 112.2 500.1 250.3 500.1C388.4 500.1 500.3 388.2 500.3 250.1C500.3 112 388.4 0.0999756 250.3 0.0999756ZM292.1 468.3V250.8C292.1 213.2 322.5 182.2 360.2 182.4C397.6 182.6 427.8 213.2 427.4 250.8C427 287.7 396.7 317.7 359.8 317.7C352.3 317.7 345.1 316.5 338.4 314.2C336.9 313.7 335.4 313.5 334 313.5C326.6 313.5 320.1 319.5 320.1 327.4C320.1 333.4 324 338.8 329.7 340.6C339.2 343.8 349.3 345.5 359.8 345.5C412 345.5 454.5 303.6 455.3 251.5C456.1 198.4 414 155.1 360.9 154.5C334 154.2 309.7 165 292.2 182.6C275 199.9 264.3 223.7 264.3 250V471.7C259.7 472 255 472.1 250.4 472.1C127.7 472.1 28.3 372.7 28.3 250C28.3 141.6 105.9 51.4 208.6 31.8V249.3C208.6 286.9 178.2 317.9 140.5 317.7C103.1 317.5 72.9 286.9 73.3 249.3C73.7001 212.4 104 182.4 140.9 182.4C148.4 182.4 155.6 183.6 162.3 185.9C163.8 186.4 165.3 186.6 166.7 186.6C174.1 186.6 180.6 180.6 180.6 172.6C180.6 166.6 176.7 161.2 171 159.4C161.5 156.2 151.4 154.5 140.8 154.5C88.6001 154.5 46.1 196.4 45.3 248.5C44.5 301.6 86.6 344.9 139.7 345.5C166.6 345.8 190.9 335 208.4 317.4C225.6 300.1 236.3 276.3 236.3 250V28.4C240.9 28.1 245.6 28 250.2 28C372.9 28 472.3 127.5 472.3 250.1C472.5 358.5 394.8 448.7 292.1 468.3Z" fill="#014744" />
              <path d="M356.6 250.1C356.6 262.6 346.5 272.6 334.1 272.6C321.7 272.6 311.6 262.5 311.6 250.1C311.6 237.6 321.7 227.6 334.1 227.6C346.5 227.6 356.6 237.6 356.6 250.1Z" fill="#014744" />
              <path d="M189.3 250.1C189.3 262.6 179.2 272.6 166.8 272.6C154.4 272.6 144.3 262.5 144.3 250.1C144.3 237.6 154.4 227.6 166.8 227.6C179.2 227.6 189.3 237.6 189.3 250.1Z" fill="#014744" />
            </g>
            <defs>
              <clipPath id="clip0_24_170">
                <rect width="500" height="500" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
