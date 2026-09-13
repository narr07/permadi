<script setup lang="ts">
	const localePath = useLocalePath()
	const { locale } = useI18n()

	// Live local time (WIB / GMT+7 Majalengka)
	const currentTime = ref('')
	function updateClock() {
		currentTime.value = new Intl.DateTimeFormat(locale.value === 'id' ? 'id-ID' : 'en-US', {
			timeZone: 'Asia/Jakarta',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
		}).format(new Date())
	}

	onMounted(() => {
		updateClock()
		const timer = setInterval(updateClock, 1000)
		onUnmounted(() => clearInterval(timer))
	})
</script>

<template>
	<section class="w-full border-b border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#001e1c]">
		<div class="grid grid-cols-1 lg:grid-cols-12">
			<!-- Meta & Catalog Rail (Col 1 to 4 on Desktop) -->
			<div class="lg:col-span-4 p-6 sm:p-8 lg:p-10 lg:border-r border-b lg:border-b-0 border-slate-200/80 dark:border-[#134e43] flex flex-col justify-between bg-slate-50/50 dark:bg-[#002420]/50">
				<div>
					<!-- Section Heading Meta -->
					<div class="mb-6 flex items-center justify-between font-mono text-[11px] font-bold tracking-[0.2em] uppercase">
						<div class="flex items-center gap-2 text-brand-700 dark:text-accent">
							<span class="w-2 h-2 rounded-none bg-brand-500 inline-block shadow-[0_0_0_2px_#ccfbf2] dark:shadow-[0_0_0_2px_rgba(20,184,152,0.2)]" />
							<span>01 // MANIFEST</span>
						</div>
						<span class="text-slate-900/40 tabular-nums dark:text-slate-50/40">N° 2026.01</span>
					</div>

					<!-- Author Signature & Title -->
					<div class="my-6">
						<span class="block font-mono text-[11px] uppercase tracking-[0.15em] text-slate-900/50 dark:text-slate-50/50 mb-1.5">
							PRAKTISI &amp; PENDIDIK
						</span>
						<h2 class="font-heading font-800 text-3xl sm:text-4xl tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
							Dinar Permadi
						</h2>
						<span class="block text-brand-600 font-mono font-medium text-xs tracking-wider uppercase mt-1 dark:text-brand-400">
							Guru SD &amp; Digital Craftsman
						</span>
					</div>

					<p class="font-sans text-xs sm:text-sm text-slate-900/70 dark:text-slate-50/70 leading-relaxed max-w-[42ch]">
						Menghubungkan ketelitian matematika ruang kelas sekolah dasar dengan arsitektur web modern, presisi tata letak editorial, dan rekayasa perangkat lunak.
					</p>
				</div>

				<!-- Hairline Technical Parameters Spec Table -->
				<div class="mt-8 pt-6 border-t border-slate-200/80 dark:border-[#134e43]">
					<div class="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-900/40 dark:text-slate-50/40 mb-3">
						SPESIFIKASI SISTEM
					</div>

					<div class="divide-y divide-slate-200/80 dark:divide-[#134e43] font-mono text-xs">
						<div class="flex items-baseline justify-between py-2.5">
							<span class="text-slate-900/60 dark:text-slate-50/60">STATUS</span>
							<span class="flex items-center gap-1.5 font-bold text-brand-600 dark:text-brand-400">
								<span class="w-1.5 h-1.5 rounded-none bg-brand-500 inline-block" />
								<span>TERSEDIA PROYEK</span>
							</span>
						</div>

						<div class="flex items-baseline justify-between py-2.5">
							<span class="text-slate-900/60 dark:text-slate-50/60">ALMAMATER</span>
							<span class="text-slate-900 dark:text-slate-50 tabular-nums">UPI Bandung</span>
						</div>

						<div class="flex items-baseline justify-between py-2.5">
							<span class="text-slate-900/60 dark:text-slate-50/60">LOKASI</span>
							<span class="text-slate-900 dark:text-slate-50">Majalengka, ID</span>
						</div>

						<div class="flex items-baseline justify-between py-2.5">
							<span class="text-slate-900/60 dark:text-slate-50/60">WAKTU LOKAL</span>
							<span class="text-slate-900 dark:text-slate-50 tabular-nums font-semibold">{{ currentTime || '00:00:00' }} WIB</span>
						</div>

						<div class="flex items-baseline justify-between py-2.5">
							<span class="text-slate-900/60 dark:text-slate-50/60">KOORDINAT</span>
							<span class="text-slate-900/60 dark:text-slate-50/60 tabular-nums text-[11px]">6°50'S 108°13'E</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Typographic Statement Field (Col 5 to 12 on Desktop) -->
			<div class="lg:col-span-8 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
				<div>
					<!-- Section Kicker -->
					<div class="mb-6 flex items-center justify-between">
						<span class="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-brand-700 dark:text-accent">
							01.A // PRINSIP &amp; VISI REKAYASA
						</span>
						<span class="font-mono text-[11px] text-slate-900/40 uppercase tracking-widest hidden sm:inline dark:text-slate-50/40">
							KISI MODULAR 12-KOLOM
						</span>
					</div>

					<!-- Monumental Display Headline in GT Pressura -->
					<h1 class="font-heading font-800 text-3xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] tracking-[-0.035em] text-slate-900 dark:text-slate-50 leading-[0.92] text-balance mb-8">
						Merajut logika berhitung, baris kode, dan estetika visual secara presisi.
					</h1>

					<!-- Thesis Paragraph in GT America -->
					<p class="font-sans text-base sm:text-lg text-slate-900/80 dark:text-slate-50/80 leading-relaxed max-w-[58ch] mb-10">
						Sebagai guru SD di Majalengka, saya meyakini bahwa keteraturan logika numerik di ruang kelas sejalan dengan disiplin arsitektur kode web modern (<span class="font-medium text-slate-900 dark:text-slate-100">Nuxt 4</span> &amp; <span class="font-medium text-slate-900 dark:text-slate-100">Flutter</span>) serta ketegasan tata letak tipografi Swiss. Menolak ornamen semu untuk menghadirkan kejelasan fungsional.
					</p>
				</div>

				<!-- Action Plates & Colophon Footer -->
				<div class="pt-8 border-t border-slate-200/80 dark:border-[#134e43] flex flex-wrap items-center justify-between gap-4">
					<div class="flex flex-wrap items-center gap-3 sm:gap-4">
						<NuxtLink
							:to="localePath('/projek')"
							class="px-6 py-3.5 bg-brand-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-widest rounded-none hover:bg-brand-400 active:scale-[0.99] transition-all flex items-center gap-2.5"
						>
							<span>JELAJAHI PROJEK</span>
							<span class="i-hugeicons-arrow-up-right-01 text-sm" />
						</NuxtLink>

						<NuxtLink
							:to="localePath('/kontak')"
							class="px-6 py-3.5 border border-slate-300 dark:border-[#134e43] text-slate-900 dark:text-slate-50 font-mono font-bold text-xs uppercase tracking-widest rounded-none hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 active:scale-[0.99] transition-all flex items-center gap-2.5"
						>
							<span>MULAI DISKUSI</span>
							<span class="i-hugeicons-arrow-right-01 text-sm" />
						</NuxtLink>
					</div>

					<div class="font-mono text-[11px] text-slate-900/50 dark:text-slate-50/50 tracking-wider uppercase">
						EDISI: GT AMERICA &amp; GT PRESSURA
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
