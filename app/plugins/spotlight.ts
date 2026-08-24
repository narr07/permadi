export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive('spotlight', {
		mounted(el: HTMLElement) {
			el.classList.add('bento-spotlight')
			const onMouseMove = (e: MouseEvent) => {
				const rect = el.getBoundingClientRect()
				el.style.setProperty('--x', `${e.clientX - rect.left}px`)
				el.style.setProperty('--y', `${e.clientY - rect.top}px`)
			}
			el.addEventListener('mousemove', onMouseMove, { passive: true })
			;(el as any)._onSpotlightMouseMove = onMouseMove
		},
		unmounted(el: HTMLElement) {
			if ((el as any)._onSpotlightMouseMove) {
				el.removeEventListener('mousemove', (el as any)._onSpotlightMouseMove)
			}
		},
		getSSRProps() {
			return {
				class: 'bento-spotlight',
			}
		},
	})
})
