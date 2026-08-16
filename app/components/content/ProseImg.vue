<script setup lang="ts">
	import { withBase } from 'ufo'
	import { useRuntimeConfig, computed, ref, onMounted, onUnmounted } from '#imports'

	const props = withDefaults(
		defineProps<{
			src?: string
			alt?: string
			width?: string | number
			height?: string | number
			zoom?: boolean | string
			class?: any
		}>(),
		{
			src: '',
			alt: '',
			width: undefined,
			height: undefined,
			zoom: true,
			class: undefined,
		}
	)

	const isZoomed = ref(false)

	const isZoomEnabled = computed(() => {
		return props.zoom !== false && props.zoom !== 'false'
	})

	const refinedSrc = computed(() => {
		if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
			const _base = useRuntimeConfig().app.baseURL
			if (_base !== '/' && !props.src.startsWith(_base)) {
				return withBase(props.src, _base)
			}
		}
		return props.src
	})

	function openZoom() {
		if (!isZoomEnabled.value) return
		isZoomed.value = true
		if (typeof document !== 'undefined') {
			document.body.style.overflow = 'hidden'
		}
	}

	function closeZoom() {
		isZoomed.value = false
		if (typeof document !== 'undefined') {
			document.body.style.overflow = ''
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isZoomed.value) {
			closeZoom()
		}
	}

	function handleScroll() {
		if (isZoomed.value) {
			closeZoom()
		}
	}

	onMounted(() => {
		window.addEventListener('keydown', handleKeydown)
		window.addEventListener('scroll', handleScroll, { passive: true })
	})

	onUnmounted(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeydown)
			window.removeEventListener('scroll', handleScroll)
		}
		if (typeof document !== 'undefined') {
			document.body.style.overflow = ''
		}
	})
</script>

<template>
	<span class="prose-img-wrapper inline-block w-full my-6">
		<!-- Main Image with Zoom Cursor and Bento styling -->
		<NuxtImg
			v-if="refinedSrc"
			:src="refinedSrc"
			:alt="alt"
			:width="width"
			:height="height"
			:tabindex="isZoomEnabled ? 0 : undefined"
			:role="isZoomEnabled ? 'button' : undefined"
			:aria-label="isZoomEnabled ? (alt ? `Perbesar gambar: ${alt}` : 'Perbesar gambar') : undefined"
			:class="[
				'rounded-2xl border border-slate-200/80 dark:border-[#134e43] shadow-sm max-w-full h-auto mx-auto block transition-all duration-300 hover:shadow-md focus-ring',
				isZoomEnabled ? 'cursor-zoom-in hover:brightness-[1.02]' : '',
				props.class
			]"
			loading="lazy"
			@click="openZoom"
			@keydown.enter.prevent="openZoom"
			@keydown.space.prevent="openZoom"
		/>

		<!-- Fullscreen Zoom Lightbox Dialog (Teleport to body) -->
		<Teleport to="body">
			<Transition name="zoom-fade">
				<div
					v-if="isZoomed"
					class="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-8 bg-black/80 dark:bg-[#001715]/90 backdrop-blur-md cursor-zoom-out select-none"
					tabindex="-1"
					role="dialog"
					aria-modal="true"
					aria-label="Pratinjau gambar layar penuh"
					@click="closeZoom"
					@keydown.escape="closeZoom"
				>
					<!-- Close Button Top-Right -->
					<button
						type="button"
						class="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/10 cursor-pointer"
						aria-label="Close Zoom"
						@click.stop="closeZoom"
					>
						<span class="i-hugeicons-cancel-01 text-lg" />
					</button>

					<!-- Zoomed Image with Smooth Scale -->
					<div
						class="relative max-w-[95vw] max-h-[95vh] flex flex-col items-center justify-center animate-zoom-in cursor-zoom-out"
						@click.stop="closeZoom"
					>
						<NuxtImg
							:src="refinedSrc"
							:alt="alt"
							class="w-full h-auto max-w-[95vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-white/15"
						/>
						<p
							v-if="alt"
							class="text-xs text-slate-300 font-medium text-center mt-3 max-w-xl px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10"
						>
							{{ alt }}
						</p>
					</div>
				</div>
			</Transition>
		</Teleport>
	</span>
</template>

<style scoped>
.zoom-fade-enter-active,
.zoom-fade-leave-active {
	transition: opacity 0.25s ease;
}

.zoom-fade-enter-from,
.zoom-fade-leave-to {
	opacity: 0;
}

@keyframes zoomIn {
	from {
		transform: scale(0.92);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
}

.animate-zoom-in {
	animation: zoomIn 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
