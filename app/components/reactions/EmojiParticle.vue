<script setup lang="ts">
import { Motion } from 'motion-v'
import { onMounted } from 'vue'

const props = defineProps<{
	emoji: string
	id: string
}>()

const emit = defineEmits<{
	(e: 'remove', id: string): void
}>()

// Posisi & rotasi acak agar partikel meledak secara dinamis
const randomX = (Math.random() - 0.5) * 60
const randomY = -(70 + Math.random() * 60)
const randomRotate = (Math.random() - 0.5) * 45

onMounted(() => {
	setTimeout(() => {
		emit('remove', props.id)
	}, 950)
})
</script>

<template>
	<Motion
		:initial="{ opacity: 1, scale: 0.6, x: 0, y: 0, rotate: 0 }"
		:animate="{
			opacity: [1, 1, 0],
			scale: [0.6, 1.3, 0.85],
			x: randomX,
			y: randomY,
			rotate: randomRotate,
		}"
		:transition="{ duration: 0.9, ease: 'easeOut' }"
		class="pointer-events-none absolute left-1/2 top-1/2 z-50 select-none text-2xl -translate-x-1/2 -translate-y-1/2"
	>
		{{ emoji }}
	</Motion>
</template>
