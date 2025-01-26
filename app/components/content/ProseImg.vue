<script setup lang="ts">
import ImageComponent from '#build/mdc-image-component.mjs'
import { computed, useRuntimeConfig } from '#imports'

import { joinURL, withLeadingSlash, withTrailingSlash } from 'ufo'

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: 'permadi.dev',
  },
  width: {
    type: [String, Number],
    default: '1200',

  },
  height: {
    type: [String, Number],
    default: '800',
  },
})

const refinedSrc = computed(() => {
  if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
    const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
    if (_base !== '/' && !props.src.startsWith(_base)) {
      return joinURL(_base, props.src)
    }
  }
  return props.src
})
</script>

<template>
  <component
    :is="ImageComponent"
    :src="refinedSrc"
    :alt="props.alt"
    :width="props.width"
    :height="props.height"
    class="rounded"
    sizes="100vw sm:70vw md:500px"
  />
</template>
