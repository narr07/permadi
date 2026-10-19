<script setup lang="ts">
import { useEventListener, useResizeObserver } from '@vueuse/core'

// One continuous brand line that snakes along a page's Swiss grid: down one outer edge, across the
// next real bottom border, down the opposite edge, and so on, drawn as you scroll with a glowing tip.
// Drop it as the last child of a `relative` page wrapper; it traces the wrapper's direct children.
// Geometry comes from the real boxes (re-measured on resize); scrolling only writes two styles.

interface Stop { y0: number, y1: number, len0: number, len1: number }

const svgRef = ref<SVGSVGElement | null>(null)
const pathRef = ref<SVGPathElement | null>(null)
const tipRef = ref<SVGGElement | null>(null)
const enabled = ref(false)
const size = reactive({ w: 0, h: 0 })
const d = ref('')
let total = 0
let stops: Stop[] = []
let frame = 0

function measure() {
	const root = svgRef.value?.parentElement
	if (!root)
		return
	const rootBox = root.getBoundingClientRect()
	const docTop = rootBox.top + window.scrollY
	const docEnd = document.documentElement.scrollHeight
	const turn = Math.min(window.innerHeight * 0.35, 320)
	const xs = [1, rootBox.width - 1]

	// Cross only at children that draw a bottom border (plus the last one); others merge into the run
	const blocks = [...root.children].filter((el): el is HTMLElement =>
		el instanceof HTMLElement && el.offsetHeight > 0 && getComputedStyle(el).position !== 'absolute')
	const turns = blocks.filter((el, i) => i === blocks.length - 1 || Number.parseFloat(getComputedStyle(el).borderBottomWidth) > 0)

	size.w = rootBox.width
	size.h = rootBox.height
	stops = []
	total = 0
	let path = ''
	let side = 0
	let lag = 0
	let top = blocks.length ? blocks[0]!.getBoundingClientRect().top - rootBox.top : 0

	for (const el of turns) {
		const bottom = el.getBoundingClientRect().bottom - rootBox.top - 1
		const x = xs[side]!
		const x2 = xs[1 - side]!
		const run = bottom - top
		const cross = Math.abs(x2 - x)
		const turnAt = Math.min(turn, run / 2)

		path += `${path ? 'L' : 'M'}${x} ${top}L${x} ${bottom}L${x2} ${bottom}`
		// Vertical starts once the previous crossing is done (lag) and catches up by this border;
		// the crossing runs over the next `turnAt` px, so the tip trails the probe and stays on screen.
		stops.push({ y0: docTop + top + lag, y1: docTop + bottom, len0: total, len1: total + run })
		total += run
		stops.push({ y0: docTop + bottom, y1: Math.min(docTop + bottom + turnAt, docEnd), len0: total, len1: total + cross })
		total += cross
		side = 1 - side
		lag = turnAt
		top = bottom
	}
	d.value = path
	nextTick(update)
}

function update() {
	frame = 0
	const path = pathRef.value
	const tip = tipRef.value
	if (!path || !tip || !total)
		return
	const vh = window.innerHeight
	const max = Math.max(1, document.documentElement.scrollHeight - vh)
	// Probe starts at the top (nothing drawn at scroll 0), eases to 60% of the viewport over the first
	// half screen of scroll, then slides to the very bottom as the page ends so the line completes.
	const y = window.scrollY
	const probe = y + vh * (0.6 * Math.min(1, y / (vh * 0.5)) + 0.4 * Math.min(1, y / max))
	let drawn = 0
	for (const s of stops) {
		if (probe <= s.y0)
			break
		drawn = probe >= s.y1 ? s.len1 : s.len0 + (s.len1 - s.len0) * (probe - s.y0) / (s.y1 - s.y0)
	}
	path.style.strokeDasharray = `${total}`
	path.style.strokeDashoffset = `${total - drawn}`

	// At rest the start corner sits under the sticky header, so the tip only shows once drawing begins
	const moving = drawn > 0 && drawn < total - 0.5
	tip.style.opacity = moving ? '1' : '0'
	if (moving) {
		const pt = path.getPointAtLength(drawn)
		tip.setAttribute('transform', `translate(${pt.x} ${pt.y})`)
	}
}

useResizeObserver(() => (enabled.value ? svgRef.value?.parentElement : null), measure)
useEventListener('scroll', () => {
	if (enabled.value)
		frame ||= requestAnimationFrame(update)
}, { passive: true })

onMounted(() => {
	// Reduced motion: no line at all; the static borders stay as they are
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
		return
	enabled.value = true
	nextTick(measure)
})
onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>

<template>
	<svg
		v-if="enabled"
		ref="svgRef"
		class="pointer-events-none absolute left-0 top-0 z-20 overflow-visible text-slate-950 dark:text-brand-400"
		:width="size.w"
		:height="size.h"
		:viewBox="`0 0 ${size.w} ${size.h}`"
		aria-hidden="true"
	>
		<path
			ref="pathRef"
			:d="d"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			shape-rendering="crispEdges"
		/>
		<!-- Glowing tip: the single glow on the page, marking where the reader is -->
		<g
			ref="tipRef"
			class="swiss-trace-tip"
			opacity="0"
		>
			<circle
				class="swiss-trace-halo"
				r="9"
				fill="currentColor"
			/>
			<circle
				r="3.5"
				fill="currentColor"
			/>
			<circle
				r="1.5"
				fill="#ecfdf9"
			/>
		</g>
	</svg>
</template>

<style scoped>
.swiss-trace-tip {
	transition: opacity 0.2s ease;
}

/* Glow only on the dark canvas; a black glow on white just reads as a smudge */
:global(.dark) .swiss-trace-tip {
	filter: drop-shadow(0 0 4px currentColor) drop-shadow(0 0 10px currentColor);
}

.swiss-trace-halo {
	transform-box: fill-box;
	transform-origin: center;
	animation: swiss-trace-pulse 1.6s ease-out infinite;
}

@keyframes swiss-trace-pulse {
	from {
		opacity: 0.45;
		transform: scale(0.4);
	}

	to {
		opacity: 0;
		transform: scale(1.6);
	}
}
</style>
