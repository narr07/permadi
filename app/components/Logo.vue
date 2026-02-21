<!-- eslint-disable regexp/no-unused-capturing-group -->
<script setup lang="ts">
import { useElementBounding, useMouse } from '@vueuse/core'
import { motion, useMotionValue, useSpring } from 'motion-v'

const props = defineProps<{ size?: number | string }>()
const sizeValue = computed(() => {
  if (!props.size)
    return '32px'
  // If the passed size is just a number string like "100", append "px"
  if (/^\d+(\.\d+)?$/.test(String(props.size))) {
    return `${props.size}px`
  }
  return props.size
})

// Mouse and element tracking for the interactive eyes
const logoRef = ref<HTMLElement | null>(null)
const { x: mouseX, y: mouseY } = useMouse({ type: 'client' })
const { x: logoX, y: logoY, width, height } = useElementBounding(logoRef)

const maxOffsetX = 20
const maxOffsetY = 35 // Increase vertical travel range
const radius = 500

// Initialize motion values for pure tracking distances
const targetOffsetX = useMotionValue(0)
const targetOffsetY = useMotionValue(0)

// Apply a physics spring for that 'smooth following' motion
const springX = useSpring(targetOffsetX, { stiffness: 150, damping: 15, mass: 0.5 })
const springY = useSpring(targetOffsetY, { stiffness: 150, damping: 15, mass: 0.5 })

// Watch mouse and update the target offset instantly (spring handles the smoothing)
watchEffect(() => {
  if (!logoRef.value || width.value === 0)
    return

  const centerX = logoX.value + width.value / 2
  const centerY = logoY.value + height.value / 2

  const dx = mouseX.value - centerX
  const dy = mouseY.value - centerY
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance > 0) {
    const intensity = Math.min(distance / radius, 1) // 0 to 1
    targetOffsetX.set((dx / distance) * (maxOffsetX * intensity))
    targetOffsetY.set((dy / distance) * (maxOffsetY * intensity))
  }
  else {
    targetOffsetX.set(0)
    targetOffsetY.set(0)
  }
})
</script>

<template>
  <div ref="logoRef" :style="{ lineHeight: 0 }">
    <svg :style="{ width: sizeValue, height: sizeValue }" class="block" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Logo">
      <g clip-path="url(#clip0_1011_38)">
        <!-- Base Shape -->
        <path d="M400 800C620.914 800 800 620.914 800 400C800 179.086 620.914 0 400 0C179.086 0 0 179.086 0 400C0 620.914 179.086 800 400 800Z" fill="#99F6E4" />

        <!-- Left Eye (the dot inside 'd') -->
        <motion.path :style="{ x: springX, y: springY }" d="M530.53 445.35C555.53 445.35 575.88 425.01 575.88 400C575.88 374.99 555.54 354.66 530.53 354.66C505.52 354.66 485.18 375 485.18 400C485.18 425 505.52 445.35 530.53 445.35Z" fill="#134E4A" />

        <!-- Right Eye (the dot inside 'p') -->
        <motion.path :style="{ x: springX, y: springY }" d="M224.31 400C224.31 425 244.65 445.35 269.66 445.35C294.67 445.35 315.01 425.01 315.01 400C315.01 374.99 294.67 354.66 269.66 354.66C244.65 354.66 224.31 375 224.31 400Z" fill="#134E4A" />

        <!-- Main 'd' and 'p' letter paths -->
        <path d="M682.84 117.16C607.3 41.62 506.84 0 400 0C293.16 0 192.7 41.6 117.16 117.16C41.6 192.7 0 293.16 0 400C0 506.84 41.6 607.29 117.16 682.84C192.7 758.38 293.16 800 400 800C506.84 800 607.3 758.4 682.84 682.84C758.4 607.3 800 506.84 800 400C800 293.16 758.4 192.71 682.84 117.16ZM661.54 611.19C614.32 669.73 548.33 710.98 475.38 727.68V401.16C475.38 348 518.11 304.75 570.62 304.75H571.25C596.76 304.91 620.66 315.04 638.55 333.24C656.44 351.43 666.14 375.53 665.87 401.07C665.3 452.99 622.6 495.24 570.66 495.26C560.31 495.26 550.14 493.63 540.44 490.39C537.14 489.29 533.73 488.72 530.31 488.72C512.74 488.72 498.44 503.05 498.44 520.67C498.44 534.45 507.27 546.64 520.39 551C536.53 556.37 553.44 559.1 570.63 559.1C612.68 559.1 652.33 542.85 682.28 513.34C712.18 483.86 729.03 444.53 729.69 402.58C730.37 359.77 714.4 319.42 684.72 288.93C655.07 258.45 615.2 241.41 572.45 240.93C571.85 240.93 571.23 240.91 570.62 240.91C528.03 240.91 488.02 257.53 457.95 287.69C428.01 317.72 411.52 357.61 411.52 400.01V735.98C407.66 736.11 403.79 736.17 399.98 736.17C214.62 736.17 63.82 585.36 63.82 400.01C63.82 323.47 90.33 248.47 138.44 188.82C185.66 130.28 251.65 89.03 324.6 72.33V398.85C324.6 452.01 281.87 495.26 229.36 495.26H228.72C203.21 495.1 179.31 484.97 161.42 466.77C143.53 448.58 133.83 424.48 134.1 398.94C134.67 347.02 177.37 304.77 229.31 304.75C239.66 304.75 249.83 306.38 259.53 309.62C262.83 310.72 266.24 311.29 269.66 311.29C287.23 311.29 301.53 296.96 301.53 279.34C301.53 265.56 292.7 253.37 279.58 249.01C263.44 243.64 246.53 240.91 229.34 240.91C187.29 240.91 147.64 257.16 117.69 286.67C87.79 316.15 70.94 355.48 70.28 397.43C69.6 440.24 85.57 480.59 115.25 511.08C144.9 541.56 184.77 558.6 227.52 559.08C228.12 559.08 228.74 559.1 229.35 559.1C271.94 559.1 311.95 542.48 342.02 512.32C371.96 482.29 388.45 442.4 388.45 400V64.03C392.31 63.9 396.18 63.84 399.99 63.84C585.36 63.84 736.15 214.65 736.15 400C736.15 476.54 709.64 551.54 661.53 611.19H661.54Z" fill="#134E4A" />
      </g>
      <defs>
        <clipPath id="clip0_1011_38">
          <rect width="800" height="800" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </div>
</template>
