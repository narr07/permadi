<script setup lang="ts">
// Total artikel dibaca (server/api/stats/reads.get.ts, cache 1 jam). Diambil di browser setelah footer
// terlihat, agar halaman prerender tidak membawa angka beku dari waktu build.

const { locale } = useI18n()
const reads = ref<number | null>(null)

onMounted(async () => {
	try {
		const data = await $fetch<{ reads: number }>('/api/stats/reads')
		reads.value = data.reads > 0 ? data.reads : null
	}
	catch {
		reads.value = null
	}
})

const text = computed(() => {
	if (reads.value === null)
		return ''
	const n = new Intl.NumberFormat(locale.value === 'id' ? 'id-ID' : 'en-US').format(reads.value)
	return locale.value === 'id' ? `Artikel di sini sudah dibaca ${n} kali` : `Articles here have been read ${n} times`
})
</script>

<template>
	<p
		v-if="text"
		class="m-0 text-slate-700 tabular-nums dark:text-slate-300"
	>
		{{ text }}
	</p>
</template>
