<script setup lang="ts">
import type { ComputedRef, Ref } from 'vue'
import { withBase } from 'ufo'
import { computed, inject, isRef, onMounted, onUnmounted, ref, useRuntimeConfig } from '#imports'

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
	},
)

const pageTitle = inject<Ref<string> | ComputedRef<string> | string>('pageTitle', '')
const resolvedTitle = computed(() => {
	if (isRef(pageTitle)) {
		return pageTitle.value || ''
	}
	return (typeof pageTitle === 'string' ? pageTitle : '') || ''
})

const resolvedAlt = computed(() => {
	if (props.alt && props.alt.trim().length > 0) {
		return props.alt.trim()
	}
	if (resolvedTitle.value && resolvedTitle.value.trim().length > 0) {
		return resolvedTitle.value.trim()
	}
	return 'Permadi Portfolio'
})

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
	if (!isZoomEnabled.value)
		return
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
	<figure class="prose-img-wrapper my-8 flex flex-col items-center">
		<!-- Main Image with Zoom Cursor and Bento styling -->
		<NuxtImg
			v-if="refinedSrc"
			:src="refinedSrc"
			:alt="resolvedAlt"
			:width="width"
			:height="height"
			:tabindex="isZoomEnabled ? 0 : undefined"
			:role="isZoomEnabled ? 'button' : undefined"
			:aria-label="isZoomEnabled ? `Perbesar gambar: ${resolvedAlt}` : undefined"
			class="shadow-xs mx-auto block h-auto max-w-full border border-slate-200/80 rounded-2xl transition-all duration-300 dark:border-[#134e43]/70 hover:shadow-md focus-ring"
			:class="[
				isZoomEnabled ? 'cursor-zoom-in hover:brightness-[1.02]' : '',
				props.class,
			]"
			loading="lazy"
			decoding="async"
			placeholder
			@click="openZoom"
			@keydown.enter.prevent="openZoom"
			@keydown.space.prevent="openZoom"
		/>

		<!-- Caption Fallback: Shows alt or project/article title -->
		<figcaption
			v-if="resolvedAlt"
			class="mt-2.5 max-w-xl text-center text-xs text-slate-500 tracking-wide font-sans dark:text-slate-400"
		>
			{{ resolvedAlt }}
		</figcaption>

		<!-- Fullscreen Zoom Lightbox Dialog (Teleport to body) -->
		<Teleport to="body">
			<Transition name="zoom-fade">
				<div
					v-if="isZoomed"
					class="fixed inset-0 z-[1000] flex cursor-zoom-out select-none items-center justify-center bg-black/85 p-4 backdrop-blur-md dark:bg-[#001715]/95 sm:p-8"
					tabindex="-1"
					role="dialog"
					aria-modal="true"
					:aria-label="`Pratinjau layar penuh: ${resolvedAlt}`"
					@click="closeZoom"
					@keydown.escape="closeZoom"
				>
					<!-- Close Button Top-Right -->
					<button
						type="button"
						class="absolute right-4 top-4 h-10 w-10 flex cursor-pointer items-center justify-center border border-white/10 rounded-full bg-white/10 text-white backdrop-blur-md transition-all sm:right-6 sm:top-6 hover:bg-white/20"
						aria-label="Close Zoom"
						@click.stop="closeZoom"
					>
						<span class="i-hugeicons-cancel-01 text-lg" />
					</button>

					<!-- Zoomed Image with Smooth Scale -->
					<div
						class="relative max-h-[95vh] max-w-[95vw] flex flex-col animate-zoom-in cursor-zoom-out items-center justify-center"
						@click.stop="closeZoom"
					>
						<NuxtImg
							:src="refinedSrc"
							:alt="resolvedAlt"
							class="h-auto max-h-[90vh] max-w-[95vw] w-full border border-white/15 rounded-2xl object-contain shadow-2xl"
						/>
						<p
							v-if="resolvedAlt"
							class="mt-3 max-w-xl border border-white/10 rounded-full bg-black/60 px-4 py-1.5 text-center text-xs text-slate-200 font-medium backdrop-blur-md"
						>
							{{ resolvedAlt }}
						</p>
					</div>
				</div>
			</Transition>
		</Teleport>
	</figure>
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
