export function useThemeToggle() {
	const colorMode = useColorMode()

	function toggleDark() {
		colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
	}

	return {
		toggleDark,
		isDark: computed(() => colorMode.value === 'dark'),
	}
}
