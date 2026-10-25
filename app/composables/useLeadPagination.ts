import type { Ref } from 'vue'

/**
 * Paginasi daftar dengan satu item unggulan di halaman pertama.
 * Halaman 1: unggulan + `gridSize` kartu; halaman berikutnya: `gridSize` kartu.
 * `gridSize` sebaiknya kelipatan 6 (= kelipatan 2 dan 3 kolom) agar baris grid penuh kecuali di halaman terakhir.
 */
export function useLeadPagination<T>(items: Ref<T[]>, page: Ref<number>, hasLead: Ref<boolean>, gridSize = 6) {
	const firstPageSize = computed(() => hasLead.value ? gridSize + 1 : gridSize)

	const totalPages = computed(() => {
		const count = items.value.length
		return count <= firstPageSize.value ? 1 : 1 + Math.ceil((count - firstPageSize.value) / gridSize)
	})

	const pageItems = computed(() => {
		const start = page.value <= 1 ? 0 : firstPageSize.value + (page.value - 2) * gridSize
		const size = page.value <= 1 ? firstPageSize.value : gridSize
		return items.value.slice(start, start + size)
	})

	const lead = computed(() => hasLead.value && page.value <= 1 ? pageItems.value[0] ?? null : null)
	const grid = computed(() => lead.value ? pageItems.value.slice(1) : pageItems.value)

	return { totalPages, lead, grid }
}

/**
 * Lebar kartu pada grid 4 kolom (md) dan 6 kolom (lg) agar baris terakhir selalu penuh.
 * Kartu biasa memakai 2 kolom (= 2 per baris di md, 3 per baris di lg); sisa di baris terakhir melebar.
 */
export function gridCardSpan(index: number, total: number) {
	const isLast = index === total - 1
	const lgRemainder = total % 3
	return {
		md: total % 2 === 1 && isLast ? 'md:col-span-4' : 'md:col-span-2',
		lg: lgRemainder === 1 && isLast
			? 'lg:col-span-6'
			: lgRemainder === 2 && index >= total - 2 ? 'lg:col-span-3' : 'lg:col-span-2',
		// Kartu selebar baris: dipakai kartu bergambar untuk beralih ke tata letak horizontal
		mdFullRow: total % 2 === 1 && isLast,
		lgFullRow: lgRemainder === 1 && isLast,
	}
}
