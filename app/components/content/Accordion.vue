<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'

const props = defineProps({
  items: {
    type: Array as PropType<Array<{ label: string, content: string }>>,
    default: () => [],
  },
  type: {
    type: String as PropType<'single' | 'multiple'>,
    default: 'single',
  },
})

const accordionItems = computed<AccordionItem[]>(() =>
  props.items.map((item, index) => ({
    label: item.label,
    content: item.content,
    value: String(index),
  })),
)
</script>

<template>
  <UAccordion :type="type" :items="accordionItems" />
</template>
