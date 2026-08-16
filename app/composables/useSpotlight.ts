export function useSpotlight() {
	const el = ref<HTMLElement | null>(null)

	function onMove(e: MouseEvent) {
		const target = el.value || (e.currentTarget as HTMLElement)
		if (!target)
			return
		const rect = target.getBoundingClientRect()
		target.style.setProperty('--x', `${e.clientX - rect.left}px`)
		target.style.setProperty('--y', `${e.clientY - rect.top}px`)
	}

	return { el, onMove }
}
