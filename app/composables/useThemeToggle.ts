/**
 * Circular ripple View Transition for Dark/Light mode toggle
 * Credit: @hooray, @antfu, VitePress & UnoCSS
 */
export function useThemeToggle() {
	const colorMode = useColorMode()

	function toggleDark(event?: MouseEvent) {
		const isAppearanceTransition = typeof document !== 'undefined'
			// @ts-expect-error experimental View Transition API
			&& Boolean(document.startViewTransition)
			&& !window.matchMedia('(prefers-reduced-motion: reduce)').matches

		const nextMode = colorMode.value === 'dark' ? 'light' : 'dark'

		if (!isAppearanceTransition || !event) {
			colorMode.preference = nextMode
			return
		}

		const x = event.clientX
		const y = event.clientY
		const endRadius = Math.hypot(
			Math.max(x, window.innerWidth - x),
			Math.max(y, window.innerHeight - y),
		)

		// @ts-expect-error experimental View Transition API
		const transition = document.startViewTransition(async () => {
			colorMode.preference = nextMode
			await nextTick()
		})

		transition.ready.then(() => {
			const isDarkNow = nextMode === 'dark'
			const clipPath = [
				`circle(0px at ${x}px ${y}px)`,
				`circle(${endRadius}px at ${x}px ${y}px)`,
			]

			document.documentElement.animate(
				{
					clipPath: isDarkNow
						? [...clipPath].reverse()
						: clipPath,
				},
				{
					duration: 400,
					easing: 'ease-out',
					fill: 'forwards',
					pseudoElement: isDarkNow
						? '::view-transition-old(root)'
						: '::view-transition-new(root)',
				},
			)
		})
	}

	return {
		toggleDark,
		isDark: computed(() => colorMode.value === 'dark'),
	}
}
