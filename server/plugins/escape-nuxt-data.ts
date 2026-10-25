// Contoh kode di artikel (mis. "<!-- ... --> <script setup> ... </script>") kadang lolos ke payload
// __NUXT_DATA__ tanpa di-escape. Browser lalu menutup <script> lebih awal dan sisa payload tampil
// sebagai teks di halaman. Di dalam JSON, "<" hanya muncul di dalam string, jadi mengganti semuanya
// dengan < aman dan hasil parse-nya identik.
const OPEN_TAG = /<script[^>]*id="__NUXT_DATA__"[^>]*>/

function escapeNuxtData(chunk: string) {
	const open = chunk.match(OPEN_TAG)
	if (!open || open.index === undefined)
		return chunk
	const start = open.index + open[0].length

	// "</script>" palsu bisa ada di dalam konten: penutup sebenarnya adalah yang pertama
	// membuat isi di antaranya menjadi JSON valid
	let close = chunk.indexOf('</script>', start)
	while (close !== -1) {
		const content = chunk.slice(start, close)
		try {
			JSON.parse(content)
			return chunk.slice(0, start) + content.replaceAll('<', '\\u003C') + chunk.slice(close)
		}
		catch {
			close = chunk.indexOf('</script>', close + 1)
		}
	}
	return chunk
}

export default defineNitroPlugin((nitroApp) => {
	nitroApp.hooks.hook('render:html', (html) => {
		html.head = html.head.map(escapeNuxtData)
		html.bodyPrepend = html.bodyPrepend.map(escapeNuxtData)
		html.body = html.body.map(escapeNuxtData)
		html.bodyAppend = html.bodyAppend.map(escapeNuxtData)
	})
})
