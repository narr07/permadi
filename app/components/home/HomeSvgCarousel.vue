<script setup lang="ts">
import { Motion } from 'motion-v'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import SvgDesigner from '~/components/SvgDesigner.vue'
import SvgDev from '~/components/SvgDev.vue'
import SvgGuru from '~/components/SvgGuru.vue'

const { locale } = useI18n()

interface SvgSlide {
	id: string
	role: string
	title: string
	subtitle: string
	component: any
	badgeClass: string
}

const slides = computed<SvgSlide[]>(() => [
	{
		id: 'dev',
		role: locale.value === 'id' ? 'Web & Mobile Developer' : 'Web & Mobile Engineer',
		title: 'Nuxt, Flutter & Python',
		subtitle: locale.value === 'id' ? 'Logika kode reaktif & arsitektur full-stack' : 'Reactive code logic & full-stack architecture',
		component: SvgDev,
		badgeClass: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/25',
	},
	{
		id: 'designer',
		role: locale.value === 'id' ? 'Desainer Grafis & UI' : 'Graphic & UI Designer',
		title: 'Adobe Suite & Figma',
		subtitle: locale.value === 'id' ? 'Harmoni visual, vektor presisi & desain sistem' : 'Visual harmony, precision vectors & design systems',
		component: SvgDesigner,
		badgeClass: 'bg-teal-500/10 text-teal-800 dark:text-teal-300 border-teal-500/25',
	},
	{
		id: 'guru',
		role: locale.value === 'id' ? 'Pendidik & Guru SD' : 'Educator & Teacher',
		title: 'Pedagogi & Accelerated Learning',
		subtitle: locale.value === 'id' ? 'Strategi pembelajaran bermakna & Kurikulum Merdeka' : 'Meaningful learning strategies & curriculum design',
		component: SvgGuru,
		badgeClass: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/25',
	},
])

const currentIndex = ref(0)
const isHovered = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const currentSlide = computed(() => slides.value[currentIndex.value] || slides.value[0])

function next() {
	currentIndex.value = (currentIndex.value + 1) % slides.value.length
}

function prev() {
	currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length
}

function goTo(index: number) {
	currentIndex.value = index
}

onMounted(() => {
	timer = setInterval(() => {
		if (!isHovered.value) {
			next()
		}
	}, 4500)
})

onUnmounted(() => {
	if (timer) {
		clearInterval(timer)
		timer = null
	}
})
</script>

<template>
	<Motion
		as="div"
		:initial="{ opacity: 0, transform: 'translateY(16px)' }"
		:while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
		:transition="{ type: 'spring', stiffness: 80, damping: 20 }"
		:in-view-options="{ margin: '-60px' }"
		class="bento-card-clean relative flex flex-col justify-between overflow-hidden p-6 md:col-span-5 sm:p-7"
		@mouseenter="isHovered = true"
		@mouseleave="isHovered = false"
	>
		<!-- Header Carousel: Role Badge & Nuxt UI-Style Controls -->
		<div class="relative z-10 flex items-center justify-between gap-3">
			<span
				class="inline-flex items-center border rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide font-mono transition-colors"
				:class="currentSlide.badgeClass"
			>
				{{ currentSlide.role }}
			</span>

			<!-- Controls: Prev / Next Buttons -->
			<div class="flex items-center gap-1.5">
				<button
					type="button"
					class="h-8 w-8 flex items-center justify-center border border-slate-200/80 rounded-full bg-white/90 text-slate-700 shadow-sm transition-all active:scale-95 dark:border-slate-700/80 hover:border-brand-500 dark:bg-slate-800/90 dark:text-slate-200 hover:text-brand-900 dark:hover:border-brand-400 dark:hover:text-brand-300"
					:aria-label="locale === 'id' ? 'Slide sebelumnya' : 'Previous slide'"
					@click="prev"
				>
					<span class="i-hugeicons-arrow-left-01 text-xs" />
				</button>
				<button
					type="button"
					class="h-8 w-8 flex items-center justify-center border border-slate-200/80 rounded-full bg-white/90 text-slate-700 shadow-sm transition-all active:scale-95 dark:border-slate-700/80 hover:border-brand-500 dark:bg-slate-800/90 dark:text-slate-200 hover:text-brand-900 dark:hover:border-brand-400 dark:hover:text-brand-300"
					:aria-label="locale === 'id' ? 'Slide berikutnya' : 'Next slide'"
					@click="next"
				>
					<span class="i-hugeicons-arrow-right-01 text-xs" />
				</button>
			</div>
		</div>

		<!-- SVG Display Area with Transition -->
		<div class="relative my-4 min-h-[220px] flex flex-1 items-center justify-center sm:min-h-[260px]">
			<Transition
				mode="out-in"
				enter-active-class="transition-all duration-300 ease-out"
				enter-from-class="opacity-0 scale-95 translate-x-3"
				enter-to-class="opacity-100 scale-100 translate-x-0"
				leave-active-class="transition-all duration-200 ease-in"
				leave-from-class="opacity-100 scale-100 translate-x-0"
				leave-to-class="opacity-0 scale-95 -translate-x-3"
			>
				<div
					:key="currentSlide.id"
					class="h-full w-full flex items-center justify-center"
				>
					<component
						:is="currentSlide.component"
						class="pointer-events-none h-auto max-h-52 max-w-[280px] w-full drop-shadow-md sm:max-h-60 sm:max-w-[320px]"
						aria-hidden="true"
					/>
				</div>
			</Transition>
		</div>

		<!-- Slide Info Caption & Indicators -->
		<div class="relative z-10 border-t border-slate-200/60 pt-3 dark:border-slate-800/60">
			<div class="flex items-center justify-between gap-3">
				<div class="min-w-0">
					<h4 class="truncate text-sm text-slate-900 font-bold font-heading dark:text-white">
						{{ currentSlide.title }}
					</h4>
					<p class="truncate text-[11px] text-slate-700 dark:text-slate-300">
						{{ currentSlide.subtitle }}
					</p>
				</div>

				<!-- Dots Indicator -->
				<div class="flex shrink-0 items-center gap-1.5">
					<button
						v-for="(slide, idx) in slides"
						:key="slide.id"
						type="button"
						class="h-2 rounded-full transition-all duration-300"
						:class="idx === currentIndex ? 'w-6 bg-brand-600 dark:bg-brand-400' : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'"
						:aria-label="`Go to slide ${idx + 1}`"
						@click="goTo(idx)"
					/>
				</div>
			</div>
		</div>
	</Motion>
</template>
