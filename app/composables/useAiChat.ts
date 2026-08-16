export function useAiChat() {
	const isOpen = useState<boolean>('isAiChatOpen', () => false)

	function openAiChat() {
		isOpen.value = true
	}

	function closeAiChat() {
		isOpen.value = false
	}

	function toggleAiChat() {
		isOpen.value = !isOpen.value
	}

	return {
		isOpen,
		openAiChat,
		closeAiChat,
		toggleAiChat,
	}
}
