import { useMotionTemplate, useMotionValue, useSpring } from 'motion-v'

export interface SpotlightOptions {
	stiffness?: number
	damping?: number
	radius?: number
	color?: string
}

export function useSpotlight(options: SpotlightOptions = {}) {
	const {
		stiffness = 350,
		damping = 30,
		radius = 500,
		color = 'rgba(20, 184, 152, 0.12)',
	} = options

	// Motion values mengabaikan overhead reactivity Vue untuk performa tinggi (60/120fps)
	const mouseX = useMotionValue(0)
	const mouseY = useMotionValue(0)

	// Inersia halus dengan physics spring (tidak kaku/patah-patah)
	const smoothX = useSpring(mouseX, { stiffness, damping })
	const smoothY = useSpring(mouseY, { stiffness, damping })

	function onMouseMove(e: MouseEvent) {
		const target = e.currentTarget as HTMLElement
		if (!target)
			return
		const rect = target.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		mouseX.set(x)
		mouseY.set(y)

		// Tetap sinkronkan CSS variable untuk class .bento-spotlight bawaan
		target.style.setProperty('--x', `${x}px`)
		target.style.setProperty('--y', `${y}px`)
	}

	// Template radial gradient dinamis yang terikat langsung ke motion value
	const spotlightBackground = useMotionTemplate`radial-gradient(${radius}px circle at ${smoothX}px ${smoothY}px, ${color}, transparent 70%)`

	return {
		mouseX,
		mouseY,
		smoothX,
		smoothY,
		onMouseMove,
		spotlightBackground,
	}
}
