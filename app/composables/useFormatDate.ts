export function useFormatDate() {
	const { locale } = useI18n()

	function formatDate(dateStr?: string | Date | null): string {
		if (!dateStr)
			return ''

		const raw = String(dateStr).trim()

		// Match YYYY-MM-DD format directly
		const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw)
		if (isoMatch) {
			const [, year, month, day] = isoMatch
			return locale.value === 'id' ? `${day}-${month}-${year}` : `${year}-${month}-${day}`
		}

		// Match DD-MM-YYYY format directly
		const idMatch = /^(\d{2})-(\d{2})-(\d{4})/.exec(raw)
		if (idMatch) {
			const [, day, month, year] = idMatch
			return locale.value === 'id' ? `${day}-${month}-${year}` : `${year}-${month}-${day}`
		}

		// Fallback parse using Date object
		const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
		if (!Number.isNaN(d.getTime())) {
			const year = d.getFullYear()
			const month = String(d.getMonth() + 1).padStart(2, '0')
			const day = String(d.getDate()).padStart(2, '0')

			if (locale.value === 'id') {
				return `${day}-${month}-${year}`
			}
			return `${year}-${month}-${day}`
		}

		return raw
	}

	return {
		formatDate,
	}
}
