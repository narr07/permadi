export function useCategoryLabel() {
	const { locale } = useI18n()

	const categoryMap: Record<string, { id: string, en: string }> = {
		// Kategori Blog
		edu: { id: 'Pendidikan', en: 'Education' },
		tech: { id: 'Teknologi', en: 'Technology' },
		art: { id: 'Seni', en: 'Art' },

		// Kategori Projek
		web: { id: 'Web App', en: 'Web App' },
		mobile: { id: 'Mobile App', en: 'Mobile App' },
		design: { id: 'Desain', en: 'Design' },
	}

	function getCategoryLabel(category?: string): string {
		if (!category)
			return ''
		const key = category.toLowerCase().trim()
		if (categoryMap[key]) {
			return locale.value === 'id' ? categoryMap[key].id : categoryMap[key].en
		}
		return category
	}

	return {
		getCategoryLabel,
		categoryMap,
	}
}
